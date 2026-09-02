import type { APIRoute } from 'astro'
import { loadProjectMetrics } from '../lib/metrics'
import { getProjects } from '../lib/projects'

function escapeXml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

export const GET: APIRoute = async () => {
  const projects = await getProjects()
  const metrics = await loadProjectMetrics()
  const items = projects.map((project) => {
    const release = metrics[project.id]
    const link = project.data.npmUrl ?? project.data.docsUrl
    return `<item><title>${escapeXml(project.data.packageName)} ${escapeXml(release.version)}</title><link>${link}</link><guid isPermaLink="false">${escapeXml(project.data.packageName)}@${escapeXml(release.version)}</guid><pubDate>${new Date(release.releasedAt).toUTCString()}</pubDate><description>${escapeXml(project.data.locales.en.tagline)}</description></item>`
  }).join('')

  const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>weapp.dev releases</title><link>https://weapp.dev/</link><description>Release updates from the weapp.dev open-source stack.</description><language>en</language>${items}</channel></rss>`
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
