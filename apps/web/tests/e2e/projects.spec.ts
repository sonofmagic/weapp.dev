import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

for (const prefix of ['', '/en']) {
  const zh = prefix === ''
  test(`filters project rows and recovers from an empty intersection on ${prefix}/projects/`, async ({ page }) => {
    await page.goto(`${prefix}/projects/`)
    const role = page.locator('[data-filter-role]')
    const maturity = page.locator('[data-filter-maturity]')
    const platform = page.locator('[data-filter-platform]')
    const visible = page.locator('[data-project-card]:visible')
    await expect(role).toBeEnabled()
    await expect(visible).toHaveCount(5)
    await role.selectOption('data')
    await expect(visible).toHaveCount(1)
    await expect(visible.getByRole('heading')).toHaveText('weapp-sqlite')
    await expect(page.locator('[data-filter-count]')).toHaveText(zh ? '1 个项目' : '1 project')
    await maturity.selectOption('stable')
    await expect(visible).toHaveCount(0)
    await expect(page.locator('[data-filter-empty]')).toBeVisible()
    await page.locator('[data-filter-clear]').focus()
    await page.keyboard.press('Enter')
    await expect(role).toBeFocused()
    await expect(visible).toHaveCount(5)
    await expect(page.locator('[data-filter-empty]')).toBeHidden()
    await platform.selectOption('WeChat')
    expect(await visible.count()).toBeGreaterThan(0)
    for (const card of await visible.all()) {
      expect((await card.getAttribute('data-platforms'))?.split('|')).toContain('WeChat')
    }
    await page.locator('[data-filter-reset]').click()
    await expect(platform).toHaveValue('')
    await expect(visible).toHaveCount(5)
  })

  test(`offers five adoption paths and their documentation on ${prefix}/`, async ({ page }) => {
    await page.goto(`${prefix}/`)
    const paths = page.locator('.project-selector-list article')
    await expect(paths).toHaveCount(5)
    for (const [index, slug] of ['weapp-vite', 'weapp-tailwindcss', 'varo', 'weapp-sqlite', 'vite-plugin-taro'].entries()) {
      const path = paths.nth(index)
      await expect(path.locator('.project-selector-actions a').first()).toHaveAttribute('href', `${prefix}/projects/${slug}/`)
      await expect(path.locator('.project-selector-actions a').last()).toHaveAttribute('href', /^https:\/\//)
      if (['varo', 'weapp-sqlite'].includes(slug)) {
        await expect(path.locator('code')).toHaveCount(0)
        await expect(path.locator('.project-selector-planned')).toContainText(zh ? '规划中' : 'planned')
      }
      else {
        await expect(path.locator('code')).not.toBeEmpty()
      }
    }
  })
}

for (const prefix of ['', '/en']) {
  test(`audits all project detail pages in ${prefix || 'zh-CN'} for accessibility`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const theme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
      for (const slug of ['weapp-vite', 'weapp-tailwindcss', 'varo', 'weapp-sqlite', 'vite-plugin-taro']) {
        await page.goto(`${prefix}/projects/${slug}/`)
        await page.waitForFunction(() => [...document.querySelectorAll('[data-reveal]')].every(element => element.hasAttribute('data-visible')))
        const accessibility = await new AxeBuilder({ page }).include('main').analyze()
        expect(accessibility.violations, `${prefix || 'zh-CN'} ${theme} ${slug}`).toEqual([])
      }
    }
  })
}

test.describe('project catalog without JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  for (const prefix of ['', '/en']) {
    test(`keeps all projects readable on ${prefix}/projects/`, async ({ page }) => {
      await page.goto(`${prefix}/projects/`)
      await expect(page.locator('[data-project-card]:visible')).toHaveCount(5)
      for (const control of await page.locator('[data-project-filters] select, [data-filter-reset]').all()) {
        await expect(control).toBeDisabled()
      }
      await expect(page.locator('.projects-filter-note')).toContainText('JavaScript')
      await expect(page.locator('[data-filter-empty]')).toBeHidden()
      await page.locator('[data-project-card][data-role="data"] .projects-index-actions a').last().click()
      await expect(page).toHaveURL(`${prefix}/projects/weapp-sqlite/`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('weapp-sqlite')
    })
  }
})

for (const width of [1440, 768, 390]) {
  for (const theme of ['light', 'dark'] as const) {
    test(`keeps project filters readable at ${width}px in ${theme}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 1000 })
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
      await page.goto('/en/projects/')
      await expect(page.locator('[data-filter-role]')).toBeEnabled()
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
      const results = await new AxeBuilder({ page }).include('main').analyze()
      expect(results.violations).toEqual([])
      await page.screenshot({ path: testInfo.outputPath('project-catalog.png'), fullPage: true })
      await page.goto('/en/')
      await page.locator('.project-selector').scrollIntoViewIfNeeded()
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
      await page.locator('.project-selector').screenshot({ path: testInfo.outputPath('project-paths.png'), style: '[data-site-header], body > a[href="#main-content"] { visibility: hidden !important; }' })
    })
  }
}
