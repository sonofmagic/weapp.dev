import { access, readdir, readFile } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import process from 'node:process'
import { parse } from 'node-html-parser'

const root = resolve(import.meta.dirname, '..')
const dist = resolve(root, 'dist')
const expectedFiles = [
  'index.html',
  'en/index.html',
  '404.html',
  'projects/weapp-tailwindcss/index.html',
  'projects/weapp-vite/index.html',
  'en/projects/weapp-tailwindcss/index.html',
  'en/projects/weapp-vite/index.html',
  'privacy/index.html',
  'en/privacy/index.html',
  'releases.xml',
  'sitemap-index.xml',
]

async function collectHtml(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      return collectHtml(path)
    }
    return path.endsWith('.html') ? [path] : []
  }))
  return nested.flat()
}

function outputPathForUrl(pathname: string): string {
  if (pathname === '/') {
    return resolve(dist, 'index.html')
  }
  if (pathname === '/404' || pathname === '/404/') {
    return resolve(dist, '404.html')
  }
  if (pathname.endsWith('/')) {
    return resolve(dist, pathname.slice(1), 'index.html')
  }
  return resolve(dist, pathname.slice(1))
}

const errors: string[] = []
for (const file of expectedFiles) {
  try {
    await access(resolve(dist, file))
  }
  catch {
    errors.push(`Missing expected build output: ${file}`)
  }
}

for (const file of await collectHtml(dist)) {
  if (/^baidu_verify_[^/]+\.html$/.test(relative(dist, file))) {
    continue
  }
  const html = await readFile(file, 'utf8')
  const document = parse(html)
  const label = relative(dist, file)
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href')
  const alternates = document.querySelectorAll('link[rel="alternate"][hreflang]')
  if (!canonical?.startsWith('https://weapp.dev/')) {
    errors.push(`${label}: invalid canonical URL`)
  }
  if (alternates.length < 3) {
    errors.push(`${label}: missing language alternates`)
  }
  if (document.text.includes('—') || document.text.includes('–')) {
    errors.push(`${label}: contains a forbidden dash character`)
  }

  for (const anchor of document.querySelectorAll('a[href]')) {
    const href = anchor.getAttribute('href')
    if (!href || href.startsWith('#') || /^(?:https?:|mailto:|tel:)/.test(href)) {
      continue
    }
    const pathname = new URL(href, 'https://weapp.dev').pathname
    try {
      await access(outputPathForUrl(pathname))
    }
    catch {
      errors.push(`${label}: broken internal link ${href}`)
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'))
  process.exitCode = 1
}
else {
  console.log(`Validated ${expectedFiles.length} required outputs and all internal links.`)
}
