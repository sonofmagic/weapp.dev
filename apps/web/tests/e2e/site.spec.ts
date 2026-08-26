import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

async function enableAnalyticsTestMode(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    Object.defineProperty(window, '__WEAPP_ANALYTICS_TEST__', { value: true })
  })
}

async function mockAnalyticsConfig(
  page: import('@playwright/test').Page,
  config: { provider: 'baidu' | 'ga4', consentRequired: boolean, siteId: string },
) {
  await page.route('**/api/analytics/config', async route => route.fulfill({
    body: JSON.stringify(config),
    contentType: 'application/json',
    status: 200,
  }))
  await page.route('https://www.googletagmanager.com/**', async route => route.fulfill({
    body: '',
    contentType: 'text/javascript',
    status: 200,
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
  await expect(page.locator('#projects').getByRole('heading', { name: 'weapp-tailwindcss' })).toBeVisible()
  await expect(page.locator('#projects').getByRole('heading', { name: 'weapp-vite' })).toBeVisible()
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://weapp.dev/')
  await expect(page.locator('link[hreflang="en-US"]')).toHaveAttribute('href', 'https://weapp.dev/en/')

  await page.getByRole('link', { name: 'English' }).click()
  await expect(page).toHaveURL(/\/en\/$/)
  await expect(page.getByText('Open-source mini-app stack')).toBeVisible()
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

test('project detail exposes docs, source, metrics, and future path', async ({ page }) => {
  await page.goto('/projects/weapp-vite/')
  await expect(page.getByRole('heading', { level: 1, name: 'weapp-vite' })).toBeVisible()
  await expect(page.getByRole('link', { name: '阅读文档' }).first()).toHaveAttribute('href', 'https://vite.icebreaker.top/')
  await expect(page.getByText('/docs/weapp-vite/')).toBeVisible()
  await expect(page.getByText('GitHub Stars')).toBeVisible()
})

test('passes automated accessibility checks', async ({ page }) => {
  await page.goto('/')
  await page.waitForFunction(() => document.getAnimations().every(animation => animation.playState === 'finished'))
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
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

test('keeps core content and links available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'weapp.dev' })).toBeVisible()
  await expect(page.getByRole('link', { name: /阅读文档/ }).first()).toBeVisible()
  await context.close()
})

test('requires consent before loading GA4 in strict regions', async ({ page }) => {
  await enableAnalyticsTestMode(page)
  await mockAnalyticsConfig(page, {
    provider: 'ga4',
    consentRequired: true,
    siteId: 'G-TEST1234',
  })

  await page.goto('/?token=secret&utm_source=e2e#projects')
  const banner = page.getByRole('complementary', { name: '统计偏好' })
  await expect(banner).toBeVisible()
  await expect(page.locator('#weapp-ga4')).toHaveCount(0)

  await page.getByRole('button', { name: '允许统计' }).click()
  await expect(banner).toBeHidden()
  await expect(page.locator('#weapp-ga4')).toHaveCount(1)
  const dataLayer = await page.evaluate(() => window.dataLayer)
  expect(dataLayer).toContainEqual([
    'event',
    'page_view',
    expect.objectContaining({
      page_location: 'http://127.0.0.1:4321/?utm_source=e2e',
      page_path: '/?utm_source=e2e',
    }),
  ])
})

test('loads Baidu by default and supports a persistent opt-out', async ({ page }) => {
  await enableAnalyticsTestMode(page)
  await mockAnalyticsConfig(page, {
    provider: 'baidu',
    consentRequired: false,
    siteId: 'baidu_test_id',
  })

  await page.goto('/')
  await expect(page.locator('#weapp-baidu-tongji')).toHaveCount(1)
  await expect(page.getByRole('complementary', { name: '统计偏好' })).toBeHidden()

  await page.getByRole('button', { name: '统计偏好' }).click()
  const dialog = page.getByRole('dialog', { name: '统计偏好' })
  await expect(dialog).toBeVisible()
  const enabled = dialog.getByRole('checkbox')
  await expect(enabled).toBeChecked()
  await enabled.uncheck()
  await dialog.getByRole('button', { name: '保存偏好' }).click()

  await page.waitForLoadState('load')
  await expect(page.locator('#weapp-baidu-tongji')).toHaveCount(0)
  await expect.poll(() => page.evaluate(() => localStorage.getItem('weapp-analytics-consent:v1')))
    .toBe('{"choice":"denied","version":1}')
})

test('honors browser privacy signals', async ({ page }) => {
  await enableAnalyticsTestMode(page)
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'globalPrivacyControl', { value: true })
  })
  await mockAnalyticsConfig(page, {
    provider: 'ga4',
    consentRequired: false,
    siteId: 'G-TEST1234',
  })

  await page.goto('/')
  await expect(page.locator('#weapp-ga4')).toHaveCount(0)
  await page.getByRole('button', { name: '统计偏好' }).click()
  await expect(page.getByText('浏览器已启用全局隐私控制')).toBeVisible()
  await expect(page.getByRole('dialog').getByRole('checkbox')).toBeDisabled()
})
