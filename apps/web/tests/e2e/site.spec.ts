import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { siteCopy } from '../../src/i18n/ui'

const retiredVisuals = 'canvas, [data-shader-canvas], [data-shader], [data-shader-frame], [data-webgl-fallback], [data-art], .project-art, [class^="art-"], [class*=" art-"]'

async function expectHomeVisuals(page: import('@playwright/test').Page, _locale: 'zh-CN' | 'en') {
  await expect(page.locator('.home-hero-stage img:visible, #projects picture:visible')).toHaveCount(0)
  await expect(page.locator(retiredVisuals)).toHaveCount(0)
  await expect(page.locator('hero-demos [role="tabpanel"]:visible')).toHaveCount(1)
  await expect(page.locator('hero-demos')).toBeVisible()
  await expect(page.locator('#projects .home-lab')).toHaveCount(0)
  await expect(page.locator('#projects .home-project-proof')).toHaveCount(5)
  await expect(page.locator('#projects .home-project-proof-command')).toContainText('pnpm exec wv build -p weapp')
  await expect(page.locator('[data-project-id="weapp-sqlite"] .home-project-proof-list')).toContainText(_locale === 'zh-CN' ? '运行时边界待确认' : 'Runtime boundaries are still being confirmed')
  await expect(page.locator('[data-project-id="weapp-sqlite"] .home-project-proof')).toHaveAttribute('data-proof-count', '2')
  await expect(page.locator('[data-project-id="weapp-sqlite"] .home-project-proof-list')).toHaveAttribute('aria-label', _locale === 'zh-CN' ? '规划证明条目' : 'Planning proof items')
  const images = await page.evaluate(() => performance.getEntriesByType('resource').map(entry => entry.name).filter(url => /\/media\/(?:showcase|projects)\//.test(url)))
  expect(images.every(url => url.includes('/media/projects/vpt-hmr-'))).toBe(true)
  expect(images.length).toBeLessThanOrEqual(2)
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
  await expect(page.locator('.home-hero')).toHaveAttribute('aria-labelledby', 'home-hero-title')
  await expectHomeVisuals(page, 'zh-CN')
  await expect(page.locator('#projects').getByRole('heading', { name: 'weapp-tailwindcss' })).toBeVisible()
  await expect(page.locator('#projects').getByRole('heading', { name: 'weapp-vite' })).toBeVisible()
  await expect(page.locator('#projects').getByRole('heading', { name: 'Varo' })).toBeVisible()
  await expect(page.locator('.home-adjacent-projects')).toHaveCount(1)
  await expect(page.locator('.home-adjacent-projects')).toContainText('需要本地数据或迁移现有 React 工程时')
  await expect(page.locator('.home-adjacent-projects article')).toHaveCount(2)
  await expect(page.locator('.home-adjacent-projects [data-project-status]')).toHaveCount(2)
  await expect(page.locator('.home-adjacent-projects article').first()).toHaveAttribute('aria-labelledby', 'home-adjacent-title-weapp-sqlite')
  await expect(page.locator('.home-adjacent-projects article').first()).toHaveAttribute('aria-describedby', 'home-adjacent-description-weapp-sqlite home-adjacent-proof-weapp-sqlite home-adjacent-roadmap-weapp-sqlite')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://weapp.dev/')
  await expect(page.locator('link[hreflang="en-US"]')).toHaveAttribute('href', 'https://weapp.dev/en/')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow')
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'zh_CN')
  await expect(page.locator('meta[property="og:locale:alternate"]')).toHaveAttribute('content', 'en_US')
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://weapp.dev/og.png')
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', 'weapp.dev 小程序工程工具链地图')
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(4)
  await expect(page.locator('#about')).toContainText('weapp-tailwindcss')
  for (const [section, title] of [['about', 'about-title'], ['projects', 'projects-title'], ['vision', 'vision-title'], ['releases', 'releases-title'], ['commercial', 'commercial-title']] as const) {
    await expect(page.locator(`#${section}`)).toHaveAttribute('aria-labelledby', title)
  }
  await expect(page.locator('.home-toolchain-shell')).toHaveCount(2)
  await expect(page.locator('.home-toolchain-shell').first()).not.toHaveAttribute('aria-labelledby')
  await expect(page.locator('.home-toolchain-shell').nth(1)).not.toHaveAttribute('aria-labelledby')
  await expect(page.locator('section[aria-labelledby="collaboration-title"]')).toHaveCount(1)
  await expect(page.locator('[data-principle-card]').first()).toHaveAttribute('aria-labelledby', 'vision-principle-title-1')
  await expect(page.locator('[data-principle-card]').first()).toHaveAttribute('aria-describedby', 'vision-principle-owns-1 vision-principle-not-owns-1')
  const docsLinks = page.locator('#projects').getByRole('link', { name: '文档' })
  await expect(docsLinks).toHaveCount(7)
  await expect(docsLinks.evaluateAll(links => links.map(link => link.getAttribute('href')))).resolves.toEqual([
    'https://vite.weapp.dev/',
    'https://tw.weapp.dev/',
    'https://github.com/daguanren21/Varo#readme',
    'https://github.com/weapp-sqlite/weapp-sqlite#readme',
    'https://vpt.js.org/',
    'https://github.com/weapp-sqlite/weapp-sqlite#readme',
    'https://vpt.js.org/',
  ])
  const projectHomeLinks = page.locator('.home-project-rail a')
  await expect(projectHomeLinks.evaluateAll(links => links.map(link => ({ href: link.getAttribute('href'), target: link.getAttribute('target'), rel: link.getAttribute('rel') })))).resolves.toEqual([
    { href: 'https://vite.weapp.dev/', target: '_blank', rel: 'noopener noreferrer' },
    { href: 'https://tw.weapp.dev/', target: '_blank', rel: 'noopener noreferrer' },
    { href: 'https://github.com/daguanren21/Varo#readme', target: '_blank', rel: 'noopener noreferrer' },
    { href: 'https://github.com/weapp-sqlite/weapp-sqlite#readme', target: '_blank', rel: 'noopener noreferrer' },
    { href: 'https://vpt.js.org/', target: '_blank', rel: 'noopener noreferrer' },
  ])
  await expect(page.locator('.home-project-proof')).toHaveCount(5)
  await expect(page.locator('.home-project-row[data-project-id]')).toHaveCount(5)
  await expect(page.locator('.home-project-row[data-project-id="weapp-sqlite"]')).toHaveAttribute('data-roadmap-count', '2')
  for (const id of ['weapp-vite', 'weapp-tailwindcss', 'varo', 'weapp-sqlite', 'vite-plugin-taro']) {
    await expect(page.locator(`.home-project-row[data-project-id="${id}"]`)).toHaveAttribute('aria-labelledby', `home-project-title-${id}`)
    await expect(page.locator(`.home-project-row[data-project-id="${id}"]`)).toHaveAttribute('aria-describedby', `home-project-description-${id} home-project-status-${id} home-project-proof-${id}`)
  }
  await expect(page.locator('#projects .home-lab')).toHaveCount(0)
  await expect(page.locator('.home-hero .home-lab')).toHaveCount(1)
  await expect(page.locator('#projects a[data-analytics-event="select_project"]').evaluateAll(links => links.map(link => link.getAttribute('href')))).resolves.toEqual([
    '/projects/weapp-vite/',
    '/projects/weapp-tailwindcss/',
    '/projects/varo/',
    '/projects/weapp-sqlite/',
    '/projects/vite-plugin-taro/',
    '/projects/weapp-sqlite/',
    '/projects/vite-plugin-taro/',
  ])
  await expect(page.locator('#projects a[data-analytics-event="click_outbound"][data-analytics-target="docs"]')).toHaveCount(7)

  await page.getByRole('link', { name: 'English' }).click()
  await expect(page).toHaveURL(/\/en\/$/)
  await expect(page.getByText('Tools for real mini-app repos')).toBeVisible()
  await expect(page.locator('.home-hero')).toHaveAttribute('aria-labelledby', 'home-hero-title')
  await expectHomeVisuals(page, 'en')
  await expect(page.locator('.home-adjacent-projects')).toHaveCount(1)
  await expect(page.locator('.home-adjacent-projects')).toContainText('When you need local data or a React migration path')
  await expect(page.locator('.home-adjacent-projects article')).toHaveCount(2)
  await expect(page.locator('.home-adjacent-projects [data-project-status]')).toHaveCount(2)
  await expect(page.locator('.home-adjacent-projects article').first()).toHaveAttribute('aria-labelledby', 'home-adjacent-title-weapp-sqlite')
  await expect(page.locator('.home-adjacent-projects article').first()).toHaveAttribute('aria-describedby', 'home-adjacent-description-weapp-sqlite home-adjacent-proof-weapp-sqlite home-adjacent-roadmap-weapp-sqlite')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://weapp.dev/en/')
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_US')
  await expect(page.locator('meta[property="og:locale:alternate"]')).toHaveAttribute('content', 'zh_CN')
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', 'weapp.dev toolchain map for mini-app engineering')
  await expect(page.locator('link[hreflang="zh-CN"]')).toHaveAttribute('href', 'https://weapp.dev/')
  await expect(page.locator('#projects a[data-analytics-event="select_project"]').evaluateAll(links => links.map(link => link.getAttribute('href')))).resolves.toEqual([
    '/en/projects/weapp-vite/',
    '/en/projects/weapp-tailwindcss/',
    '/en/projects/varo/',
    '/en/projects/weapp-sqlite/',
    '/en/projects/vite-plugin-taro/',
    '/en/projects/weapp-sqlite/',
    '/en/projects/vite-plugin-taro/',
  ])
  await expect(page.locator('.home-project-rail a').evaluateAll(links => links.map(link => link.getAttribute('href')))).resolves.toEqual([
    'https://vite.weapp.dev/',
    'https://tw.weapp.dev/',
    'https://github.com/daguanren21/Varo#readme',
    'https://github.com/weapp-sqlite/weapp-sqlite#readme',
    'https://vpt.js.org/',
  ])
})

for (const [path, primary, secondary, mapHref] of [
  ['/', '选择项目开始', '查看工具链地图', '/#projects'],
  ['/en/', 'Choose a project', 'View toolchain map', '/en/#projects'],
] as const) {
  test(`keeps homepage CTAs aligned with the toolchain flow on ${path}`, async ({ page }) => {
    await page.goto(path)
    const hero = page.locator('.home-hero')
    await expect(hero.locator('a').filter({ hasText: primary })).toHaveAttribute('href', path === '/' ? '/projects/' : '/en/projects/')
    await expect(hero.locator('a').filter({ hasText: secondary })).toHaveAttribute('href', mapHref)
    await expect(hero.locator('a').filter({ hasText: secondary })).toHaveAttribute('data-analytics-section', 'projects')
  })
}

test('renders the bilingual pricing and delivery page', async ({ page }) => {
  await page.goto('/pricing/')
  await expect(page.locator('section[aria-labelledby="pricing-title"]')).toHaveCount(1)
  await expect(page.locator('#plans')).toHaveAttribute('aria-label', '开源社区入口')
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
  await expect(page.locator('.pricing-sponsor-tier[aria-labelledby]')).toHaveCount(4)
  await expect(page.locator('.pricing-allocation-stack article[aria-labelledby]')).toHaveCount(3)
  await expect(page.locator('.pricing-sponsor-tier').first()).toHaveAttribute('aria-describedby', 'pricing-sponsor-tier-cadence-1 pricing-sponsor-tier-body-1')
  await expect(page.locator('.pricing-allocation-stack article').first()).toHaveAttribute('aria-describedby', 'pricing-allocation-body-1')
  for (const id of ['sponsor', 'services', 'support', 'boundary', 'faq']) {
    await expect(page.locator(`#${id}`)).toHaveAttribute('aria-labelledby', `pricing-${id}-title`)
  }
  await expect(page.locator('#sponsor')).toContainText('赞助不含技术支持')
  await expect(page.locator('#sponsor')).toContainText('weapp.dev、tw.weapp.dev、vite.weapp.dev')
  await expect(page.locator('#sponsor')).toContainText('Easysearch')
  await expect(page.locator('.pricing-sla-table caption')).toHaveText('支持响应级别')
  await expect(page.locator('.pricing-sla-table thead th[scope="col"]')).toHaveCount(3)
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
  await expect(page.locator('section[aria-labelledby="pricing-title"]')).toHaveCount(1)
  await expect(page.locator('#plans')).toHaveAttribute('aria-label', 'Open source community path')
  await expect(page.locator('#sponsor')).toContainText('¥1,000')
  await expect(page.locator('#sponsor')).toContainText('Contributors fund')
  await expect(page.locator('.pricing-sla-table caption')).toHaveText('Support response levels')
  await expect(page.locator('.pricing-sla-table thead th[scope="col"]')).toHaveCount(3)
})

test('renders the bilingual contributor program', async ({ page }) => {
  await page.goto('/contributors/')
  await expect(page.locator('section[aria-labelledby="contributors-title"]')).toHaveCount(1)
  await expect(page.getByRole('heading', { level: 1, name: '把一部分赞助分给合过代码的人' })).toBeVisible()
  await expect(page.getByText('25%', { exact: true })).toBeVisible()
  await expect(page.getByText('贡献者基金', { exact: true }).first()).toBeVisible()
  await expect(page.locator('.contributors-bucket-grid article')).toHaveCount(3)
  await expect(page.locator('.contributors-bucket-grid article').first()).toHaveAttribute('aria-labelledby', 'contributors-bucket-title-1')
  await expect(page.locator('.contributors-bucket-grid article').first()).toHaveAttribute('aria-describedby', 'contributors-bucket-body-1')
  await expect(page.locator('#main-content').getByRole('link', { name: 'weapp-vite' })).toBeVisible()
  await expect(page.getByRole('link', { name: '返回赞助页' })).toHaveAttribute('href', '/pricing/#sponsor')
  await expect(page.locator('.contributors-table caption')).toHaveText('贡献者积分规则')
  await expect(page.locator('.contributors-table thead th')).toHaveCount(3)
  await expect(page.locator('#contributors-section-1')).toHaveAttribute('aria-labelledby', 'contributors-heading-1')
  await expect(page.locator('#contributors-weights-title').locator('xpath=..')).toHaveAttribute('aria-labelledby', 'contributors-weights-title')
  await expect(page.locator('nav[aria-label="本页目录"] a[href="#contributors-weights-title"]')).toHaveCount(1)
  await expect(page.locator('nav[aria-label="本页目录"] a[href="#contributors-repos-title"]')).toHaveCount(1)
  await expect(page.locator('nav[aria-label="本页目录"] a[href="#contributors-payout-title"]')).toHaveCount(1)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://weapp.dev/contributors/')
  await expect(page.locator('link[hreflang="en-US"]')).toHaveAttribute('href', 'https://weapp.dev/en/contributors/')

  await page.getByRole('link', { name: 'English' }).click()
  await expect(page).toHaveURL(/\/en\/contributors\/$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Share some sponsorship with people who land the work' })).toBeVisible()
  await expect(page.locator('section[aria-labelledby="contributors-title"]')).toHaveCount(1)
  await expect(page.getByRole('link', { name: 'Back to sponsorship' })).toHaveAttribute('href', '/en/pricing/#sponsor')
  await expect(page.locator('.contributors-bucket-grid article')).toHaveCount(3)
  await expect(page.locator('.contributors-bucket-grid article').first()).toHaveAttribute('aria-labelledby', 'contributors-bucket-title-1')
  await expect(page.locator('.contributors-bucket-grid article').first()).toHaveAttribute('aria-describedby', 'contributors-bucket-body-1')
  await expect(page.locator('.contributors-table caption')).toHaveText('Contributor point rules')
  await expect(page.locator('.contributors-table thead th')).toHaveCount(3)
  await expect(page.locator('#contributors-section-1')).toHaveAttribute('aria-labelledby', 'contributors-heading-1')
  await expect(page.locator('#contributors-weights-title').locator('xpath=..')).toHaveAttribute('aria-labelledby', 'contributors-weights-title')
  await expect(page.locator('nav[aria-label="On this page"] a[href="#contributors-weights-title"]')).toHaveCount(1)
  await expect(page.locator('nav[aria-label="On this page"] a[href="#contributors-repos-title"]')).toHaveCount(1)
  await expect(page.locator('nav[aria-label="On this page"] a[href="#contributors-payout-title"]')).toHaveCount(1)
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
  await expect(page.locator('[aria-labelledby="project-future-docs-title"] a')).toHaveAttribute('aria-label', '文档: weapp-vite')
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
  await page.goto('/projects/weapp-sqlite/')
  const related = page.getByRole('link', { name: /相关项目:/ })
  await expect(related).toHaveCount(2)
  await expect(related.first()).toHaveAttribute('href', '/projects/weapp-vite/')
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
  test(`marks the active project detail in navigation on ${prefix || '/'}`, async ({ page }) => {
    await page.goto(`${prefix}/projects/weapp-vite/`)
    const current = page.locator('[data-site-header] a[aria-current="page"]')
    await expect(current).toHaveCount(2)
    await expect(current.first()).toHaveAttribute('href', `${prefix}/projects/weapp-vite/`)
    await expect(page.locator(`footer a[aria-current="page"][href="${prefix}/projects/weapp-vite/"]`)).toHaveCount(1)
  })
}

for (const [route, footerPath] of [
  ['/projects/', '/projects/'],
  ['/pricing/', '/pricing/'],
  ['/contributors/', '/contributors/'],
  ['/privacy/', '/privacy/'],
  ['/sponsors/', '/sponsors/'],
  ['/en/projects/', '/en/projects/'],
  ['/en/pricing/', '/en/pricing/'],
  ['/en/contributors/', '/en/contributors/'],
  ['/en/privacy/', '/en/privacy/'],
  ['/en/sponsors/', '/en/sponsors/'],
] as const) {
  test(`marks the current footer destination on ${route}`, async ({ page }) => {
    await page.goto(route)
    await expect(page.locator(`footer a[aria-current="page"][href="${footerPath}"]`)).toHaveCount(1)
  })
}

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
  test(`marks the localized homepage brand link as current on ${localePath || 'zh-CN'}`, async ({ page }) => {
    await page.goto(`${localePath}/`)
    await expect(page.locator('[data-site-header] a[aria-label="weapp.dev"]')).toHaveAttribute('aria-current', 'page')
  })

  test(`marks the localized footer brand link as current on ${localePath || 'zh-CN'}`, async ({ page }) => {
    await page.goto(`${localePath}/`)
    await expect(page.locator('footer a:has(img[src="/logo.svg"])')).toHaveAttribute('aria-current', 'page')
  })

  test(`does not mark the localized footer brand as current away from home on ${localePath || 'zh-CN'}`, async ({ page }) => {
    await page.goto(`${localePath}/projects/`)
    await expect(page.locator('footer a:has(img[src="/logo.svg"])')).not.toHaveAttribute('aria-current')
  })

  test(`prioritizes the localized header brand asset on ${localePath || 'zh-CN'}`, async ({ page }) => {
    await page.goto(`${localePath}/`)
    await expect(page.locator('[data-site-header] a[aria-label="weapp.dev"] img')).toHaveAttribute('fetchpriority', 'high')
  })

  for (const slug of ['varo', 'weapp-sqlite']) {
    test(`keeps ${localePath || 'zh-CN'} ${slug} page in planning state`, async ({ page }) => {
      await page.goto(`${localePath}/projects/${slug}/`)
      await expect(page.locator('[data-project-readiness]')).toBeVisible()
      const copy = siteCopy[localePath ? 'en' : 'zh-CN'].project
      await expect(page.getByText(copy.readinessNote, { exact: true })).toHaveCount(1)
      await expect(page.getByRole('region', { name: copy.setupStatus, exact: true })).toBeVisible()
      await expect(page.getByRole('heading', { name: copy.install, exact: true })).toHaveCount(0)
      await expect(page.getByRole('region', { name: copy.visualProof, exact: true })).toHaveCount(slug === 'weapp-sqlite' ? 0 : 1)
      await expect(page.locator('.project-proof-code-head')).toContainText(localePath ? 'Planned' : '规划中')
      if (slug === 'weapp-sqlite') {
        await expect(page.locator('.project-proof-list li')).toHaveText(localePath
          ? ['Runtime boundaries are still being confirmed', 'Migration and sync strategy are still being confirmed']
          : ['运行时边界待确认', '迁移与同步策略待确认'])
      }
      else {
        await expect(page.locator('.project-proof-code code')).toContainText('status: planned')
      }
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

test('exposes labeled footer navigation landmarks in both locales', async ({ page }) => {
  for (const path of ['/', '/en/']) {
    await page.goto(path)
    await expect(page.getByRole('contentinfo', { name: path === '/' ? '站点页脚' : 'Site footer' })).toBeVisible()
    await expect(page.getByRole('navigation', { name: path === '/' ? '项目' : 'Projects', exact: true })).toBeVisible()
    await expect(page.getByRole('navigation', { name: path === '/' ? '资源' : 'Resources', exact: true })).toBeVisible()
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

  const demoTabs = page.getByRole('tab')
  await expect(demoTabs).toHaveCount(5)
  await demoTabs.first().focus()
  await page.keyboard.press('ArrowRight')
  await expect(demoTabs.nth(1)).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('[data-active-project]')).toHaveText('weapp-tailwindcss')
})

test('protects all new-window links across key routes', async ({ page }) => {
  const routes = ['/', '/en/', '/projects/', '/en/projects/', '/pricing/', '/en/pricing/', '/contributors/', '/en/contributors/', '/sponsors/', '/en/sponsors/']
  for (const route of routes) {
    await page.goto(route)
    const unsafe = await page.locator('a[target="_blank"]').evaluateAll(links => links
      .filter((link) => {
        const tokens = (link.getAttribute('rel') || '').split(/\s+/)
        return !tokens.includes('noopener') || !tokens.includes('noreferrer')
      })
      .map(link => link.getAttribute('href')))
    expect(unsafe, `${route} has unprotected external links`).toEqual([])
  }
})

test('keeps secondary project logos lazy and asynchronously decoded', async ({ page }) => {
  await page.goto('/')
  for (const selector of ['.toolchain-map-list img', '#projects .home-project-row img', '#releases img']) {
    const images = page.locator(selector)
    await expect(images).not.toHaveCount(0)
    await expect(images.evaluateAll(items => items.map(item => ({ loading: item.getAttribute('loading'), decoding: item.getAttribute('decoding') })))).resolves.toEqual(
      Array.from({ length: await images.count() }, () => ({ loading: 'lazy', decoding: 'async' })),
    )
  }
})

test('asynchronously decodes the visible homepage project rail', async ({ page }) => {
  await page.goto('/')
  const images = page.locator('.home-project-rail img')
  await expect(images).toHaveCount(5)
  await expect(images.evaluateAll(items => items.every(item => item.getAttribute('decoding') === 'async'))).resolves.toBe(true)
  await expect(images.first()).toHaveAttribute('loading', 'eager')
  await expect(images.first()).toHaveAttribute('fetchpriority', 'high')
  await expect(images.nth(1)).toHaveAttribute('loading', 'lazy')
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
  const command = page.locator('#quick-start-command')
  await expect(command).toHaveAttribute('tabindex', '0')
  await expect(command).toHaveAttribute('aria-label', '安装命令')
  await command.focus()
  await expect(command).toBeFocused()
  await expect(copyButton).toHaveAttribute('aria-label', '复制命令')
  await expect(copyButton).toHaveAttribute('data-analytics-event', 'copy_command')
  await expect(copyButton).toHaveAttribute('data-analytics-project', 'weapp-vite')
  await copyButton.click()
  await expect(copyButton).toHaveAttribute('aria-label', '已复制')
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('pnpm add -D weapp-vite')

  const faq = page.locator('main details').first()
  await expect(faq).not.toHaveAttribute('open', '')
  await faq.locator('summary').click()
  await expect(faq).toHaveAttribute('open', '')
  await expect(faq.getByText('Vite 驱动的开发和构建流程')).toBeVisible()
})

test('labels the English install command for keyboard users', async ({ page }) => {
  await page.goto('/en/projects/weapp-vite/')
  const command = page.locator('#quick-start-command')
  await expect(command).toHaveAttribute('tabindex', '0')
  await expect(command).toHaveAttribute('aria-label', 'Install command')
  await command.focus()
  await expect(command).toBeFocused()
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
  const source = copyButton.locator('..').locator('pre')
  await expect(source).toBeFocused()
  await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toBe('pnpm add -D weapp-vite')
  await page.keyboard.press('Tab')
  await expect(copyButton).toBeFocused()
})

test('copies the first command from the homepage adoption path', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/')
  const path = page.locator('.project-selector-list article').first()
  const command = path.locator('code[id^="selector-command-"]')
  await expect(command).toHaveAttribute('tabindex', '0')
  await expect(command).toHaveAttribute('aria-label', '安装命令')
  await command.focus()
  await expect(command).toBeFocused()
  const copyButton = path.locator('[data-selector-copy]')
  await expect(copyButton).toHaveAttribute('aria-label', '复制命令')
  await expect(copyButton).toHaveAttribute('data-analytics-event', 'copy_command')
  await expect(copyButton).toHaveAttribute('data-analytics-project', 'weapp-vite')
  await copyButton.click()
  await expect(copyButton).toHaveAttribute('aria-label', '已复制')
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('pnpm add -D weapp-vite')
})

test('keeps homepage command copying readable when the clipboard API is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => { throw new Error('clipboard unavailable') } },
    })
  })
  await page.goto('/en/')
  const copyButton = page.locator('.project-selector-list article').first().locator('[data-selector-copy]')
  await copyButton.click()
  await expect(copyButton).toHaveAttribute('aria-label', 'Copy manually')
  await expect(copyButton.locator('[data-selector-copy-text]')).toHaveText('Copy manually')
  await expect(copyButton.locator('[data-selector-copy-text]')).toHaveAttribute('role', 'status')
  await expect(copyButton.locator('[data-selector-copy-text]')).toHaveAttribute('aria-live', 'polite')
  await expect(copyButton.locator('..').locator('code')).toBeFocused()
  await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toBe('pnpm add -D weapp-vite')
  await page.keyboard.press('Tab')
  await expect(copyButton).toBeFocused()
})

test('provides a working mobile navigation menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const [route, navigationName, menuLabel] of [['/', '移动端导航', '打开导航'], ['/en/', 'Mobile navigation', 'Open navigation']] as const) {
    await page.goto(route)
    const menu = page.locator(`summary[aria-label="${menuLabel}"]`)
    await expect(menu).toHaveAttribute('aria-expanded', 'false')
    await expect(menu).toHaveAttribute('aria-controls', 'mobile-navigation')
    await menu.click()
    await expect(menu).toHaveAttribute('aria-expanded', 'true')
    const mobileNav = page.getByRole('navigation', { name: navigationName })
    await expect(mobileNav).toBeVisible()
    await expect(mobileNav.getByRole('link', { name: 'weapp-vite' })).toBeVisible()
    await menu.click()
    await expect(menu).toHaveAttribute('aria-expanded', 'false')
    await expect(mobileNav).not.toBeVisible()
    await menu.click()
    await page.locator('#main-content').click({ position: { x: 12, y: 12 } })
    await expect(menu).toHaveAttribute('aria-expanded', 'false')
    await expect(mobileNav).not.toBeVisible()
  }
})

test('announces the desktop project menu state in both locales', async ({ page }) => {
  for (const [route, navigationName] of [['/', '主导航'], ['/en/', 'Primary navigation']] as const) {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto(route)
    await expect(page.getByRole('navigation', { name: navigationName })).toBeVisible()
    const summary = page.locator('[data-project-menu] summary')
    await expect(summary).toHaveAttribute('aria-controls', 'project-navigation')
    await expect(summary).toHaveAttribute('aria-expanded', 'false')
    await summary.click()
    await expect(summary).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('#project-navigation')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(summary).toHaveAttribute('aria-expanded', 'false')
    await expect(summary).toBeFocused()
    await summary.click()
    await page.locator('main').click({ position: { x: 12, y: 12 } })
    await expect(summary).toHaveAttribute('aria-expanded', 'false')
  }
})

test('defers project logos inside the header menus', async ({ page }) => {
  for (const route of ['/', '/en/']) {
    await page.goto(route)
    await expect(page.locator('[data-site-header] > div > a img')).toHaveAttribute('decoding', 'async')
    const logos = page.locator('[data-site-header] nav img')
    await expect(logos).toHaveCount(10)
    await expect(logos.evaluateAll(images => images.every(image => image.getAttribute('loading') === 'lazy' && image.getAttribute('decoding') === 'async'))).resolves.toBe(true)
  }
})

test('defers the footer brand mark below the first viewport', async ({ page }) => {
  for (const route of ['/', '/en/']) {
    await page.goto(route)
    const mark = page.locator('footer img[src="/logo.svg"]')
    await expect(mark).toHaveAttribute('loading', 'lazy')
    await expect(mark).toHaveAttribute('decoding', 'async')
  }
})

test('labels the homepage demo stage as a landmark', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('region', { name: '下面可以点着玩：五层工具链的交互证明；完整工具链见项目地图。' })).toBeVisible()
})

test('opens analytics preferences directly from the privacy page', async ({ page }) => {
  await page.goto('/privacy/')
  await expect(page.locator('section[aria-labelledby="privacy-title"]')).toHaveCount(1)
  await expect(page.locator('[id^="privacy-section-"][aria-labelledby]')).toHaveCount(4)
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
    await expect(page.locator('.toolchain-map-list li')).toHaveCount(5)
    await expect(page.locator('.project-selector-list article')).toHaveCount(5)
    await expect(page.locator('.home-project-rail a')).toHaveCount(5)
    await expect(page.locator('.home-toolchain-shell a').first()).toBeVisible()
    for (const button of await page.locator('[data-selector-copy]').all()) {
      await expect(button).toBeDisabled()
    }
    await page.goto(`${locale === 'en' ? '/en' : ''}/projects/weapp-vite/`)
    await expect(page.locator('[data-copy-command]')).toBeDisabled()
    await expect(page.locator('[data-copy-command]').locator('..').locator('pre code')).toHaveText('pnpm add -D weapp-vite')
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

for (const route of ['/', '/en/', '/projects/', '/pricing/', '/contributors/', '/privacy/', '/sponsors/', '/en/projects/', '/en/pricing/', '/en/contributors/', '/en/privacy/', '/en/sponsors/']) {
  test(`passes axe on ${route} in both themes`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
    await page.goto(route)
    for (const theme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
      await page.reload()
      const results = await new AxeBuilder({ page }).include('main').analyze()
      expect(results.violations, `${route} ${theme}`).toEqual([])
    }
  })
}
