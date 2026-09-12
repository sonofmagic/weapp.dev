import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { siteCopy } from '../../src/i18n/ui'

const retiredVisuals = 'canvas, [data-shader-canvas], [data-shader], [data-shader-frame], [data-webgl-fallback], [data-art], .project-art, [class^="art-"], [class*=" art-"]'

async function expectHomeVisuals(page: import('@playwright/test').Page, _locale: 'zh-CN' | 'en') {
  await expect(page.locator('.home-hero-stage img, #projects picture')).toHaveCount(0)
  await expect(page.locator(retiredVisuals)).toHaveCount(0)
  await expect(page.locator('hero-demos [role="tabpanel"]:visible')).toHaveCount(1)
  await expect(page.locator('hero-demos')).toBeVisible()
  await expect(page.locator('#projects .home-lab')).toHaveCount(0)
  await expect(page.locator('#projects .home-project-proof')).toHaveCount(3)
  await expect(page.locator('#projects .home-project-proof-command')).toContainText('pnpm exec wv build -p weapp')
  const images = await page.evaluate(() => performance.getEntriesByType('resource').map(entry => entry.name).filter(url => /\/media\/(?:showcase|projects)\//.test(url)))
  expect(images).toEqual([])
}

async function enableAnalyticsTestMode(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    Object.defineProperty(window, '__WEAPP_ANALYTICS_TEST__', { value: true })
  })
}

async function mockAnalyticsScripts(
  page: import('@playwright/test').Page,
  options: { failGa4Attempts?: number } = {},
) {
  let ga4Attempts = 0
  await page.route('https://www.googletagmanager.com/**', async route => route.fulfill({
    status: ga4Attempts++ < (options.failGa4Attempts ?? 0) ? 503 : 200,
    body: '',
    contentType: 'text/javascript',
  }))
  await page.route('https://hm.baidu.com/**', async route => route.fulfill({
    body: '',
    contentType: 'text/javascript',
    status: 200,
  }))
}

test('renders the bilingual ecosystem home with valid metadata', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'weapp.dev' })).toBeVisible()
  await expectHomeVisuals(page, 'zh-CN')
  await expect(page.locator('#projects').getByRole('heading', { name: 'weapp-tailwindcss' })).toBeVisible()
  await expect(page.locator('#projects').getByRole('heading', { name: 'weapp-vite' })).toBeVisible()
  await expect(page.locator('#projects').getByRole('heading', { name: 'Varo' })).toBeVisible()
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://weapp.dev/')
  await expect(page.locator('link[hreflang="en-US"]')).toHaveAttribute('href', 'https://weapp.dev/en/')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow')
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://weapp.dev/og.png')
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(4)
  await expect(page.locator('#about')).toContainText('weapp-tailwindcss')
  const docsLinks = page.locator('#projects').getByRole('link', { name: '文档' })
  await expect(docsLinks).toHaveCount(5)
  await expect(docsLinks.evaluateAll(links => links.map(link => link.getAttribute('href')))).resolves.toEqual([
    'https://tw.weapp.dev/',
    'https://vite.weapp.dev/',
    'https://github.com/daguanren21/Varo#readme',
    'https://github.com/weapp-sqlite/weapp-sqlite#readme',
    'https://vpt.js.org/',
  ])
  const projectHomeLinks = page.locator('.home-project-rail a')
  await expect(projectHomeLinks.evaluateAll(links => links.map(link => ({ href: link.getAttribute('href'), target: link.getAttribute('target'), rel: link.getAttribute('rel') })))).resolves.toEqual([
    { href: 'https://tw.weapp.dev/', target: '_blank', rel: 'noreferrer' },
    { href: 'https://vite.weapp.dev/', target: '_blank', rel: 'noreferrer' },
    { href: 'https://github.com/daguanren21/Varo#readme', target: '_blank', rel: 'noreferrer' },
  ])
  await expect(page.locator('.home-project-proof')).toHaveCount(3)
  await expect(page.locator('#projects .home-lab')).toHaveCount(0)
  await expect(page.locator('.home-hero .home-lab')).toHaveCount(1)
  await expect(page.locator('#projects a[data-analytics-event="select_project"]').evaluateAll(links => links.map(link => link.getAttribute('href')))).resolves.toEqual([
    '/projects/weapp-tailwindcss/',
    '/projects/weapp-vite/',
    '/projects/varo/',
  ])
  await expect(page.locator('#projects a[data-analytics-event="click_outbound"][data-analytics-target="docs"]')).toHaveCount(3)

  await page.getByRole('link', { name: 'English' }).click()
  await expect(page).toHaveURL(/\/en\/$/)
  await expect(page.getByText('Tools for real mini-app repos')).toBeVisible()
  await expectHomeVisuals(page, 'en')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://weapp.dev/en/')
  await expect(page.locator('link[hreflang="zh-CN"]')).toHaveAttribute('href', 'https://weapp.dev/')
  await expect(page.locator('#projects a[data-analytics-event="select_project"]').evaluateAll(links => links.map(link => link.getAttribute('href')))).resolves.toEqual([
    '/en/projects/weapp-tailwindcss/',
    '/en/projects/weapp-vite/',
    '/en/projects/varo/',
  ])
  await expect(page.locator('.home-project-rail a').evaluateAll(links => links.map(link => link.getAttribute('href')))).resolves.toEqual([
    'https://tw.weapp.dev/',
    'https://vite.weapp.dev/',
    'https://github.com/daguanren21/Varo#readme',
  ])
})

test('renders the bilingual pricing and delivery page', async ({ page }) => {
  await page.goto('/pricing/')
  await expect(page.getByRole('heading', { level: 1, name: '维护要花时间；钱怎么分，我们写在前面' })).toBeVisible()
  await expect(page.getByText('¥20', { exact: true })).toBeVisible()
  await expect(page.getByText('¥200', { exact: true })).toBeVisible()
  await expect(page.getByText('¥1,000', { exact: true })).toBeVisible()
  await expect(page.getByText('¥2,000 起', { exact: true })).toBeVisible()
  await expect(page.locator('#sponsor')).toContainText('60%')
  await expect(page.locator('#sponsor')).toContainText('25%')
  await expect(page.locator('#sponsor')).toContainText('15%')
  await expect(page.locator('#sponsor')).toContainText('贡献者基金')
  await expect(page.locator('#sponsor')).toContainText('到账后怎么分')
  await expect(page.locator('#sponsor')).toContainText('赞助不含技术支持')
  await expect(page.locator('#sponsor')).toContainText('weapp.dev、tw.weapp.dev、vite.weapp.dev')
  await expect(page.locator('#sponsor')).toContainText('Easysearch')
  await expect(page.locator('#services')).toContainText('¥8,000-15,000')
  await expect(page.locator('#plans')).toContainText('开源工具免费可用')
  await expect(page.locator('#plans')).toContainText('去看开源项目')
  await expect(page.locator('#plans')).not.toContainText('Pro')
  await expect(page.locator('#roadmap')).toHaveCount(0)
  await expect(page.locator('#cloud-build')).toHaveCount(0)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://weapp.dev/pricing/')
  await expect(page.locator('link[hreflang="en-US"]')).toHaveAttribute('href', 'https://weapp.dev/en/pricing/')
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(2)
  await expect(page.locator('script[type="application/ld+json"]').nth(1)).not.toContainText('Offer')

  await page.getByRole('link', { name: 'English' }).click()
  await expect(page).toHaveURL(/\/en\/pricing\/$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Maintenance takes time; we put the money split up front' })).toBeVisible()
  await expect(page.locator('#sponsor')).toContainText('¥1,000')
  await expect(page.locator('#sponsor')).toContainText('Contributors fund')
})

test('renders the bilingual contributor program', async ({ page }) => {
  await page.goto('/contributors/')
  await expect(page.getByRole('heading', { level: 1, name: '把一部分赞助分给合过代码的人' })).toBeVisible()
  await expect(page.getByText('25%', { exact: true })).toBeVisible()
  await expect(page.getByText('贡献者基金', { exact: true }).first()).toBeVisible()
  await expect(page.locator('#main-content').getByRole('link', { name: 'weapp-vite' })).toBeVisible()
  await expect(page.getByRole('link', { name: '返回赞助页' })).toHaveAttribute('href', '/pricing/#sponsor')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://weapp.dev/contributors/')
  await expect(page.locator('link[hreflang="en-US"]')).toHaveAttribute('href', 'https://weapp.dev/en/contributors/')

  await page.getByRole('link', { name: 'English' }).click()
  await expect(page).toHaveURL(/\/en\/contributors\/$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Share some sponsorship with people who land the work' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Back to sponsorship' })).toHaveAttribute('href', '/en/pricing/#sponsor')
})

test('home commercial entry points reach pricing and services', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#commercial')).toContainText('赞助与分账')
  await page.getByRole('link', { name: '赞助维护' }).click()
  await expect(page).toHaveURL(/\/pricing\/#sponsor$/)
  await page.goto('/')
  await page.getByRole('link', { name: '看服务报价' }).click()
  await expect(page).toHaveURL(/\/pricing\/#services$/)
})

test('theme control changes and persists the selected theme', async ({ page }) => {
  await page.goto('/')
  const initial = await page.locator('html').getAttribute('data-theme')
  await page.getByRole('button', { name: '切换主题' }).click()
  const next = initial === 'dark' ? 'light' : 'dark'
  await expect(page.locator('html')).toHaveAttribute('data-theme', next)
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', next)
})

test('home hero follows the active theme without an inverted surface', async ({ page }) => {
  for (const theme of ['light', 'dark']) {
    await page.addInitScript(selectedTheme => localStorage.setItem('weapp-theme', selectedTheme), theme)
    await page.goto('/')
    const colors = await page.locator('.home-hero').evaluate((hero) => {
      const style = getComputedStyle(hero)
      const body = getComputedStyle(document.body)
      return { text: style.color === body.color, background: style.backgroundColor === body.backgroundColor }
    })
    expect(colors, theme).toEqual({ text: true, background: true })
    const kicker = await page.locator('.home-kicker').evaluate((element) => {
      const style = getComputedStyle(element)
      return { size: style.fontSize, family: style.fontFamily }
    })
    expect(kicker.size).toBe('12px')
    expect(kicker.family).toContain('Geist Mono Variable')
  }
})

test('reduced motion keeps content visible and product interactions stationary', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const movingOrHidden = () => page.locator('[data-reveal], .home-hero-copy, .home-project-rail, .home-demo button:visible').evaluateAll(elements => elements.filter((element) => {
    const style = getComputedStyle(element)
    return style.opacity !== '1' || style.transform !== 'none' || style.animationName !== 'none' || style.transitionDuration !== '0s'
  }).map(element => element.tagName))
  expect(await movingOrHidden()).toEqual([])
  for (const link of await page.locator('#projects a[data-analytics-target="docs"]').all()) {
    await link.hover()
    expect(await movingOrHidden()).toEqual([])
    await link.focus()
    expect(await movingOrHidden()).toEqual([])
  }
  await page.locator('[data-principle-card]').first().hover()
  expect(await movingOrHidden()).toEqual([])
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0)
})

test('reveals content after the timeout when the observer never reports visibility', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.clock.install()
  await page.addInitScript(() => {
    window.IntersectionObserver = class extends IntersectionObserver {
      observe() {}
    }
  })
  await page.goto('/')
  await expect(page.locator('[data-reveal][data-visible]')).toHaveCount(0)
  await page.clock.fastForward(4000)
  await expect(page.locator('[data-reveal]:not([data-visible])')).toHaveCount(0)
  await expect.poll(() => page.locator('[data-reveal]').evaluateAll(elements => elements.filter(element => getComputedStyle(element).opacity !== '1').length)).toBe(0)
})

test('project detail exposes docs, source, metrics, and future path', async ({ page }) => {
  await page.goto('/projects/weapp-vite/')
  await expect(page.getByRole('heading', { level: 1, name: 'weapp-vite' })).toBeVisible()
  await expect(page.getByRole('link', { name: '文档' }).first()).toHaveAttribute('href', 'https://vite.weapp.dev/')
  await expect(page.getByText('/docs/weapp-vite/')).toBeVisible()
  await expect(page.getByText('GitHub Stars')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'FAQ' })).toBeVisible()
  await expect(page.locator('pre code').filter({ hasText: 'pnpm add -D weapp-vite' })).toHaveCount(1)
  await expect(page.getByRole('link', { name: 'npm' }).first()).toHaveAttribute('href', 'https://www.npmjs.com/package/weapp-vite')
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(3)
})

test('publishes indexable SEO resources and keeps 404 out of the index', async ({ page, request }) => {
  const llms = await request.get('/llms.txt')
  expect(llms.ok()).toBeTruthy()
  expect(await llms.text()).toContain('weapp-tailwindcss')

  const sitemap = await request.get('/sitemap-index.xml')
  expect(sitemap.ok()).toBeTruthy()
  expect(await sitemap.text()).not.toContain('/404')

  await page.goto('/404/')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow')
})

test('planned project exposes an honest readiness state', async ({ page }) => {
  await page.goto('/projects/varo/')
  await expect(page.getByRole('heading', { level: 1, name: 'Varo' })).toBeVisible()
  await expect(page.getByRole('link', { name: '源码' }).first()).toHaveAttribute('href', 'https://github.com/daguanren21/Varo')
  await expect(page.getByRole('link', { name: '文档' }).first()).toHaveAttribute('href', 'https://github.com/daguanren21/Varo#readme')
  await expect(page.getByRole('link', { name: 'npm' })).toHaveCount(0)
  await expect(page.locator('.project-proof-code code')).toContainText('status: planned')
  await expect(page.locator('.project-proof-code code')).not.toContainText('pnpm dlx')
  await expect(page.getByText('v0.0.1')).toHaveCount(0)
  await expect(page.getByText('/docs/varo/')).toBeVisible()
  await expect(page.locator('meta[property="article:modified_time"]')).toHaveCount(0)
  await expect(page.locator('[data-project-readiness]')).toBeVisible()
  await expect(page.getByText('GitHub Stars')).toHaveCount(0)
  await expect(page.getByText('周下载')).toHaveCount(0)
  await page.goto('/')
  const releaseRow = page.locator('#releases article').filter({ hasText: 'Varo' })
  await expect(releaseRow).toContainText('规划中')
  await expect(releaseRow).not.toContainText('0.0.1')
  await expect(releaseRow.locator('a')).toHaveCount(0)
  const rss = await page.request.get('/releases.xml')
  expect(await rss.text()).not.toContain('@varo/cli 0.0.1')
  const llms = await page.request.get('/llms-full.txt')
  const llmsText = await llms.text()
  expect(llmsText).not.toContain('npmjs.com/package/@varo/cli')
  expect(llmsText).not.toContain('pnpm dlx @varo/cli')
})

for (const prefix of ['', '/en']) {
  test(`planned projects expose no package or install actions on ${prefix || '/'}`, async ({ page }) => {
    for (const slug of ['varo', 'weapp-sqlite']) {
      await page.goto(`${prefix}/projects/${slug}/`)
      await expect(page.getByRole('link', { name: 'npm' })).toHaveCount(0)
      await expect(page.locator('[data-copy-command]')).toHaveCount(0)
      await expect(page.locator('main')).toContainText(prefix ? 'Planned' : '规划中')
    }
  })
}

for (const localePath of ['', '/en']) {
  for (const slug of ['varo', 'weapp-sqlite']) {
    test(`keeps ${localePath || 'zh-CN'} ${slug} page in planning state`, async ({ page }) => {
      await page.goto(`${localePath}/projects/${slug}/`)
      await expect(page.locator('[data-project-readiness]')).toBeVisible()
      await expect(page.locator('.project-proof-code code')).toContainText('status: planned')
      await expect(page.locator('main a[data-analytics-target="package"]')).toHaveCount(0)
      await expect(page.locator('meta[property="article:modified_time"]')).toHaveCount(0)
      await expect(page.locator('script[type="application/ld+json"]').nth(1)).not.toContainText('"version"')
    })
  }
}

for (const localePath of ['', '/en']) {
  test(`planned project pages pass accessibility checks on ${localePath || 'zh-CN'}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const slug of ['varo', 'weapp-sqlite']) {
      await page.goto(`${localePath}/projects/${slug}/`)
      await page.waitForFunction(() => [...document.querySelectorAll('[data-reveal]')].every(element => element.hasAttribute('data-visible')))
      const accessibility = await new AxeBuilder({ page }).include('main').analyze()
      expect(accessibility.violations).toEqual([])
    }
  })
}

test('passes automated accessibility checks in light and dark themes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const theme of ['light', 'dark']) {
    await page.addInitScript(selectedTheme => localStorage.setItem('weapp-theme', selectedTheme), theme)
    for (const path of ['/', '/en/', '/pricing/', '/en/pricing/', '/contributors/', '/en/contributors/']) {
      await page.goto(path)
      await page.waitForFunction(() => [...document.querySelectorAll('[data-reveal]')].every(element => element.hasAttribute('data-visible')))
      const results = await new AxeBuilder({ page }).analyze()
      expect(results.violations, `${path} ${theme} theme violations`).toEqual([])
    }
  }
})

test('supports keyboard navigation and activation', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: '跳到主要内容' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main-content$/)

  const themeToggle = page.getByRole('button', { name: '切换主题' })
  await themeToggle.focus()
  const initial = await page.locator('html').getAttribute('data-theme')
  await page.keyboard.press('Enter')
  await expect(page.locator('html')).toHaveAttribute('data-theme', initial === 'dark' ? 'light' : 'dark')
})

test('has no horizontal overflow or clipped interactive labels', async ({ page }) => {
  await page.goto('/')
  const overflow = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    controls: [...document.querySelectorAll<HTMLElement>('a, button, summary')]
      .filter(element => element.scrollWidth > element.clientWidth + 1)
      .map(element => element.textContent?.trim() || element.getAttribute('aria-label')),
  }))
  expect(overflow).toEqual({ document: false, controls: [] })
})

test('keeps every key route stable across responsive viewports', async ({ page }) => {
  const viewports = [
    { width: 320, height: 720 },
    { width: 390, height: 844 },
    { width: 768, height: 900 },
    { width: 1024, height: 900 },
    { width: 1440, height: 1000 },
  ]
  for (const viewport of viewports) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    const layout = await page.evaluate(() => {
      const heroCta = document.querySelector<HTMLAnchorElement>('[data-analytics-section="projects"]')
      return {
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        heroCtaPresent: Boolean(heroCta),
        wrappedControls: [...document.querySelectorAll<HTMLElement>('a, button, summary')]
          .filter(element => element.scrollWidth > element.clientWidth + 1)
          .map(element => element.textContent?.trim() || element.getAttribute('aria-label')),
      }
    })
    expect(layout.heroCtaPresent, `${viewport.width}px hero CTA`).toBe(true)
    expect(layout.overflow, `${viewport.width}px overflow`).toBe(false)
    expect(layout.wrappedControls, `${viewport.width}px wrapped controls`).toEqual([])
  }
})

test('copies the install command and expands project FAQ content', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/projects/weapp-vite/')
  const copyButton = page.locator('button[data-copy-command]')
  await expect(copyButton).toHaveAttribute('aria-label', '复制命令')
  await copyButton.click()
  await expect(copyButton).toHaveAttribute('aria-label', '已复制')
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('pnpm add -D weapp-vite')

  const faq = page.locator('main details').first()
  await expect(faq).not.toHaveAttribute('open', '')
  await faq.locator('summary').click()
  await expect(faq).toHaveAttribute('open', '')
  await expect(faq.getByText('Vite 驱动的开发和构建流程')).toBeVisible()
})

test('keeps command copying accessible when the clipboard API is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => { throw new Error('clipboard unavailable') } },
    })
  })
  await page.goto('/en/projects/weapp-vite/')
  const copyButton = page.locator('button[data-copy-command]')
  await copyButton.click()
  await expect(copyButton).toHaveAttribute('aria-label', 'Copy manually')
  await expect(copyButton.locator('[data-copy-text]')).toHaveText('Copy manually')
  await expect(copyButton.locator('[data-copy-text]')).toHaveAttribute('aria-live', 'polite')
})

test('provides a working mobile navigation menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const menu = page.locator('summary[aria-label="打开导航"]')
  await menu.click()
  const mobileNav = page.getByRole('navigation', { name: 'Mobile navigation' })
  await expect(mobileNav).toBeVisible()
  await expect(mobileNav.getByRole('link', { name: 'weapp-vite' })).toBeVisible()
  await menu.click()
  await expect(mobileNav).not.toBeVisible()
})

test('opens analytics preferences directly from the privacy page', async ({ page }) => {
  await page.goto('/privacy/')
  await page.getByRole('button', { name: '打开统计偏好' }).click()
  await expect(page.getByRole('dialog', { name: '统计偏好' })).toBeVisible()
})

test('loads all local product visuals on key pages', async ({ page }) => {
  for (const path of ['/', '/en/', '/projects/weapp-tailwindcss/', '/projects/weapp-vite/', '/projects/varo/', '/en/projects/weapp-tailwindcss/', '/en/projects/weapp-vite/', '/en/projects/varo/', '/pricing/', '/en/pricing/', '/privacy/', '/en/privacy/', '/contributors/', '/en/contributors/', '/404/']) {
    await page.goto(path)
    await expect(page.locator(retiredVisuals)).toHaveCount(0)
    await page.locator('img').evaluateAll(images => images.forEach((image) => {
      (image as HTMLImageElement).loading = 'eager'
    }))
    await page.waitForFunction(() => [...document.images].every(image => image.complete))
    const unloaded = await page.locator('img').evaluateAll(images => images
      .map(image => image as HTMLImageElement)
      .filter(image => image.naturalWidth === 0 || image.naturalHeight === 0)
      .map(image => image.getAttribute('src')))
    expect(unloaded, `${path} unloaded images`).toEqual([])
  }
})

test('publishes only the official project destinations', async ({ page }) => {
  await page.goto('/')
  const hrefs = await page.locator('a[href]').evaluateAll(anchors => anchors.map(anchor => anchor.getAttribute('href')))
  expect(hrefs).toContain('https://tw.weapp.dev/')
  expect(hrefs).toContain('https://vite.weapp.dev/')
  expect(hrefs).not.toContain('https://tw.icebreaker.top/')
  expect(hrefs).not.toContain('https://vite.icebreaker.top/')
})

test('keeps core content and links available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  for (const locale of ['zh-CN', 'en'] as const) {
    await page.goto(locale === 'en' ? '/en/' : '/')
    await expect(page.getByRole('heading', { level: 1, name: 'weapp.dev' })).toBeVisible()
    await expect(page.getByRole('link', { name: siteCopy[locale].projects.documentation }).first()).toBeVisible()
    await expectHomeVisuals(page, locale)
  }
  await context.close()
})

test('loads both analytics providers by default without a consent banner', async ({ page }) => {
  await enableAnalyticsTestMode(page)
  await mockAnalyticsScripts(page)

  const configRequests: string[] = []
  page.on('request', (request) => {
    if (request.url().includes('/api/analytics/config')) {
      configRequests.push(request.url())
    }
  })

  await page.goto('/?token=secret&utm_source=e2e#projects')
  await expect(page.locator('#weapp-ga4')).toHaveCount(1)
  await expect(page.locator('#weapp-baidu-tongji')).toHaveCount(1)
  await expect(page.locator('[data-analytics-banner]')).toHaveCount(0)
  expect(configRequests).toEqual([])

  const dataLayer = await page.evaluate(() => (window.dataLayer ?? []).map(command => Array.from(command as ArrayLike<unknown>)))
  expect(dataLayer.filter(command => command[0] === 'config')).toEqual([[
    'config',
    'G-P7XL4TEVNM',
    expect.objectContaining({
      page_location: 'http://127.0.0.1:4321/?utm_source=e2e',
      page_path: '/?utm_source=e2e',
      send_page_view: true,
    }),
  ]])
  expect(dataLayer.filter(command => command[0] === 'event' && command[1] === 'page_view')).toEqual([])
})

test('supports a persistent opt-out and re-enable for both providers', async ({ page }) => {
  await enableAnalyticsTestMode(page)
  await mockAnalyticsScripts(page)

  await page.goto('/')
  await expect(page.locator('#weapp-ga4')).toHaveCount(1)
  await expect(page.locator('#weapp-baidu-tongji')).toHaveCount(1)

  await page.getByRole('button', { name: '统计偏好' }).click()
  const dialog = page.getByRole('dialog', { name: '统计偏好' })
  await expect(dialog).toBeVisible()
  const enabled = dialog.getByRole('checkbox')
  await expect(enabled).toBeChecked()
  await enabled.uncheck()
  await dialog.getByRole('button', { name: '保存偏好' }).click()

  await page.waitForLoadState('load')
  await expect(page.locator('#weapp-ga4')).toHaveCount(0)
  await expect(page.locator('#weapp-baidu-tongji')).toHaveCount(0)
  await expect.poll(() => page.evaluate(() => localStorage.getItem('weapp-analytics-consent:v1')))
    .toBe('{"choice":"denied","version":1}')

  await page.getByRole('button', { name: '统计偏好' }).click()
  await expect(dialog.getByRole('checkbox')).not.toBeChecked()
  await dialog.getByRole('checkbox').check()
  await dialog.getByRole('button', { name: '保存偏好' }).click()
  await expect(page.locator('#weapp-ga4')).toHaveCount(1)
  await expect(page.locator('#weapp-baidu-tongji')).toHaveCount(1)
})

test('honors browser privacy signals', async ({ page }) => {
  await enableAnalyticsTestMode(page)
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'globalPrivacyControl', { value: true })
  })
  await mockAnalyticsScripts(page)

  await page.goto('/')
  await expect(page.locator('#weapp-ga4')).toHaveCount(0)
  await expect(page.locator('#weapp-baidu-tongji')).toHaveCount(0)
  await page.getByRole('button', { name: '统计偏好' }).click()
  await expect(page.getByText('浏览器已启用全局隐私控制')).toBeVisible()
  await expect(page.getByRole('dialog').getByRole('checkbox')).toBeDisabled()
})

test('keeps the other provider working when GA4 fails to load', async ({ page }) => {
  await enableAnalyticsTestMode(page)
  await mockAnalyticsScripts(page, { failGa4Attempts: Number.POSITIVE_INFINITY })

  await page.goto('/')
  await expect(page.locator('#weapp-baidu-tongji')).toHaveCount(1)
  await expect(page.getByRole('heading', { level: 1, name: 'weapp.dev' })).toBeVisible()
})

test('retries a failed GA4 script without duplicating its configuration', async ({ page }) => {
  await enableAnalyticsTestMode(page)
  await mockAnalyticsScripts(page, { failGa4Attempts: 1 })

  await page.goto('/?token=secret&utm_source=retry')
  await expect(page.locator('#weapp-ga4[data-failed="true"]')).toHaveCount(1)

  await page.getByRole('button', { name: '统计偏好' }).click()
  const dialog = page.getByRole('dialog', { name: '统计偏好' })
  await dialog.getByRole('button', { name: '保存偏好' }).click()
  await expect(page.locator('#weapp-ga4[data-loaded="true"]')).toHaveCount(1)

  const dataLayer = await page.evaluate(() => (window.dataLayer ?? []).map(command => Array.from(command as ArrayLike<unknown>)))
  expect(dataLayer.filter(command => command[0] === 'config')).toHaveLength(1)
  expect(dataLayer.filter(command => command[0] === 'event' && command[1] === 'page_view')).toEqual([])
})
