import { expect, test } from '@playwright/test'
import { demoCopy } from '../../src/components/home/demos/copy'

for (const locale of ['zh-CN', 'en'] as const) {
  const copy = demoCopy[locale]
  const route = locale === 'en' ? '/en/' : '/'

  test(`${locale}: style controls change real CSS and keep instances independent`, async ({ page }) => {
    await page.goto(route)
    const hero = page.locator('hero-demos style-demo')
    const button = hero.locator('[data-style-button]')
    const before = await button.evaluate((element) => {
      const style = getComputedStyle(element)
      return { color: style.backgroundColor, radius: style.borderRadius, padding: style.padding }
    })
    await hero.getByRole('radio', { name: copy.colors[1], exact: true }).check()
    await hero.locator('select').selectOption('2')
    await hero.getByRole('checkbox', { name: copy.compact }).check()
    await expect(button).toHaveClass('bg-blue-700 text-white rounded-lg px-4 py-2 font-medium')
    await expect(hero.locator('code')).toContainText('bg-blue-700 text-white')
    const after = await button.evaluate((element) => {
      const style = getComputedStyle(element)
      return { color: style.backgroundColor, radius: style.borderRadius, padding: style.padding }
    })
    expect(after.color).not.toBe(before.color)
    expect(after.radius).not.toBe(before.radius)
    expect(after.padding).not.toBe(before.padding)
    await expect(page.locator('#projects .home-project-proof')).toHaveCount(3)
    await button.click()
    await expect(button).toHaveText(copy.saved)
    await expect(hero.locator('code')).toContainText(copy.saved)
  })

  test(`${locale}: tabs support keyboard navigation and build targets stay aligned`, async ({ page }) => {
    await page.goto(route)
    const tabs = page.locator('hero-demos [role="tab"]')
    await tabs.first().focus()
    await page.keyboard.press('ArrowRight')
    await expect(tabs.nth(1)).toBeFocused()
    const build = page.locator('hero-demos build-demo')
    await expect(build).toBeVisible()
    await build.getByRole('radio', { name: copy.targets[1] }).check()
    await expect(build.locator('pre code')).toContainText('targets: [\'alipay\']')
    await expect(build.locator('[data-directory]')).toHaveText('dist/alipay/dist/')
    await expect(build.locator('[data-output-file="0"]')).toHaveText('index.axml')
    await expect(build.locator('[data-build-command]')).toHaveText('pnpm exec wv build -p alipay')
    await expect(page.locator('#projects .home-project-proof-command')).toContainText('pnpm exec wv build -p weapp')
    await tabs.nth(1).focus()
    await page.keyboard.press('End')
    await expect(tabs.last()).toBeFocused()
    await page.keyboard.press('ArrowRight')
    await expect(tabs.first()).toBeFocused()
    await page.keyboard.press('ArrowLeft')
    await expect(tabs.last()).toBeFocused()
    await page.keyboard.press('Home')
    await expect(tabs.first()).toBeFocused()
    await tabs.nth(1).click()
    await expect(build.locator('[data-directory]')).toHaveText('dist/alipay/dist/')
  })

  test(`${locale}: registry selection updates command and composition, preserving one choice`, async ({ page }) => {
    await page.goto(route)
    const tabs = page.locator('hero-demos [role="tab"]')
    await tabs.nth(2).click()
    const registry = page.locator('hero-demos registry-demo')
    await expect(registry).toBeVisible()
    await registry.getByRole('checkbox', { name: 'button', exact: true }).uncheck()
    await expect(registry.locator('[data-registry-button]')).toBeHidden()
    await expect(registry.locator('code')).not.toContainText('button')
    await registry.getByRole('checkbox', { name: 'card', exact: true }).uncheck()
    await expect(registry.getByRole('checkbox', { name: 'input', exact: true })).toBeDisabled()
    await expect(registry.locator('[data-registry-card]')).toBeHidden()
    await registry.getByRole('textbox', { name: copy.input }).fill('real-project')
    await registry.getByRole('checkbox', { name: 'button', exact: true }).check()
    await expect(registry.getByRole('checkbox', { name: 'input', exact: true })).toBeEnabled()
    await registry.locator('[data-registry-button]').click()
    await expect(registry.locator('[data-registry-button]')).toHaveAttribute('aria-pressed', 'true')
    await expect(registry).toContainText(copy.registryDone)
    await expect(registry).toContainText(copy.registryNote)
    await expect(registry.locator('code')).toContainText('button input')
  })
}

test('copy reports success and clipboard failures accessibly', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text: string) => {
      sessionStorage.setItem('copied-demo', text)
    } } })
  })
  await page.goto('/')
  const code = page.locator('hero-demos style-demo demo-code')
  await code.getByRole('button', { name: '复制代码' }).click()
  await expect(code.getByRole('status')).toHaveText('已复制')
  expect(await page.evaluate(() => sessionStorage.getItem('copied-demo'))).toBe(await code.locator('code').textContent())
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => {
      throw new Error('Permission denied')
    } } })
  })
  await code.getByRole('button', { name: '复制代码' }).click()
  await expect(code.getByRole('status')).toContainText('复制失败')
})

test('default examples remain readable without JavaScript', async ({ browser, viewport }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport })
  const page = await context.newPage()
  for (const route of ['/', '/en/']) {
    await page.goto(route)
    await expect(page.locator('hero-demos style-demo code')).toContainText('bg-emerald-700')
    await expect(page.locator('hero-demos [role="tablist"]')).toBeHidden()
    await expect(page.locator('.demo-controls:visible, [data-copy]:visible')).toHaveCount(0)
    await expect(page.locator('#projects .home-project-proof')).toHaveCount(3)
    await expect(page.locator('#projects .home-lab')).toHaveCount(0)
    await expect(page.locator('#projects').getByText('@varo-ui/cli')).toBeVisible()
  }
  await context.close()
})

test('reduced motion updates results without motion or layout shifts', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const hero = page.locator('hero-demos')
  const box = await hero.boundingBox()
  for (const tab of await hero.getByRole('tab').all()) {
    await tab.click()
    expect(await hero.boundingBox()).toEqual(box)
    await tab.hover()
    await tab.focus()
    const animated = await hero.evaluate(element => [...element.querySelectorAll('*')].filter((child) => {
      const style = getComputedStyle(child)
      return style.transform !== 'none' || style.transitionDuration !== '0s' || style.animationName !== 'none'
    }).length)
    expect(animated).toBe(0)
  }
  await hero.locator('input[value="card"]').uncheck()
  expect(await hero.boundingBox()).toEqual(box)
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0)
})

test('all demo states fit at 320 through 1440px without resizing the hero', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const route of ['/', '/en/']) {
    await page.goto(route)
    for (const width of [320, 390, 620, 720, 900, 1100, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      const hero = page.locator('hero-demos')
      const box = await hero.boundingBox()
      for (const tab of await hero.getByRole('tab').all()) {
        await tab.click()
        expect(await hero.boundingBox(), `${route} ${width}`).toEqual(box)
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
        expect(overflow, `${route} ${width}`).toBe(false)
        const clipped = await hero.locator('button:visible, select:visible, .demo-pane-heading:visible').evaluateAll(elements => elements.filter(element => element.scrollWidth > element.clientWidth + 1).map(element => element.textContent))
        expect(clipped, `${route} ${width}`).toEqual([])
      }
    }
  }
})
