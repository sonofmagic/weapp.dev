import { expect, test } from '@playwright/test'

for (const route of ['/sponsors/', '/en/sponsors/']) {
  test(`initializes both sponsor charts on ${route}`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(route)
    const graphs = page.locator('[data-sponsor-graphs]')
    await expect(page.locator('footer a[aria-current="page"]')).toHaveAttribute('href', route)
    await expect(page.locator('[data-sponsor-snapshot]')).toHaveText(route.startsWith('/en') ? 'Public snapshot v1' : '公开快照 v1')
    await graphs.scrollIntoViewIfNeeded()
    await expect(graphs).toHaveAttribute('data-ready', 'true')
    await expect(graphs.locator('[data-chart="flow"]')).toHaveAttribute('aria-describedby', 'sponsor-flow-help')
    await expect(graphs.locator('[data-chart="relation"]')).toHaveAttribute('aria-describedby', 'sponsor-relation-help')
    await expect(graphs.locator('[data-graph-card="relation"] header')).toContainText(route.startsWith('/en') ? 'sites' : '站点')
    await expect(graphs.locator('[data-graph-card="flow"]')).toHaveAttribute('aria-labelledby', 'sponsor-flow-title')
    await expect(graphs.locator('[data-graph-card="relation"]')).toHaveAttribute('aria-labelledby', 'sponsor-relation-title')
    await expect(graphs.locator('[data-chart="flow"] canvas')).toHaveCount(1)
    await expect(graphs.locator('[data-chart="relation"] canvas')).toHaveCount(1)
    await expect(graphs).toHaveAttribute('aria-busy', 'false')
    await expect(graphs.locator('[data-summary]')).toContainText(route.startsWith('/en') ? 'Current filter:' : '当前筛选：')
    expect(errors).toEqual([])
  })
}

for (const route of ['/sponsors/', '/en/sponsors/']) {
  test(`filters, selects by keyboard and resets on ${route}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(route)
    const graphs = page.locator('[data-sponsor-graphs]')
    await expect(graphs).toHaveAttribute('data-ready', 'true')
    const initialCount = await graphs.locator('[data-status]').textContent()
    await expect(graphs.locator('[data-kind] option[value="site"]')).toHaveText(route.startsWith('/en') ? 'Sites' : '站点')
    await graphs.locator('[data-kind]').selectOption('site')
    await expect(graphs.locator('[data-status]')).toHaveText(route.startsWith('/en') ? '4 nodes' : '4 个节点')
    await graphs.locator('[data-reset]').click()
    await graphs.locator('[data-kind]').selectOption('project')
    await graphs.locator('[data-search]').fill('weapp-vite')
    await expect(graphs.locator('[data-status]')).toHaveText(route.startsWith('/en') ? '1 nodes' : '1 个节点')
    await graphs.locator('[data-search]').fill('no-matching-node')
    await expect(graphs.locator('[data-status]')).toHaveText(route.startsWith('/en') ? '0 nodes' : '0 个节点')
    await expect(graphs.locator('[data-summary]')).toHaveText(route.startsWith('/en') ? 'The current public snapshot has no relationship data to display.' : '当前公开快照没有可展示的关系数据。')
    const node = graphs.locator('[data-node-id="project:weapp-vite"]')
    await node.focus()
    await page.keyboard.press('Enter')
    await expect(graphs.locator('[data-node-details]')).toBeVisible()
    await expect(graphs.locator('[data-node-name]')).toHaveText('weapp-vite')
    await expect(graphs.locator('[data-node-link]')).toHaveAttribute('href', 'https://github.com/weapp-vite/weapp-vite')
    await graphs.locator('[data-reset]').click()
    await expect(graphs.locator('[data-node-details]')).toBeHidden()
    await expect(graphs.locator('[data-search]')).toBeFocused()
    await expect(graphs.locator('[data-status]')).toHaveText(initialCount!)
  })

  test(`keeps tables readable when the chart chunk fails on ${route}`, async ({ page }) => {
    await page.route('**/_astro/core.*.js', route => route.abort())
    await page.goto(route)
    const graphs = page.locator('[data-sponsor-graphs]')
    await expect(graphs.locator('[data-graph-error]').first()).toBeVisible()
    await expect(graphs.locator('[data-graph-error]').first()).toHaveAttribute('role', 'status')
    await expect(graphs.locator('[data-chart="flow"]')).toBeHidden()
    await expect(graphs.locator('canvas')).toHaveCount(0)
    await expect(graphs).toHaveAttribute('aria-busy', 'false')
    await expect(graphs.locator('[data-search]')).toBeDisabled()
    await expect(graphs.locator('table')).toHaveCount(3)
    await expect(graphs.locator('table').first()).toBeVisible()
    await expect(graphs.locator('table').last()).toBeVisible()
  })
}

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  for (const route of ['/sponsors/', '/en/sponsors/']) {
    test(`exposes static graph data on ${route}`, async ({ page }) => {
      await page.goto(route)
      const graphs = page.locator('[data-sponsor-graphs]')
      await expect(graphs).toHaveAttribute('aria-busy', 'false')
      await expect(graphs.locator('canvas')).toHaveCount(0)
      await expect(graphs.locator('table').first()).toBeVisible()
      await expect(graphs.locator('table').last()).toBeVisible()
      await expect(graphs.locator('table').nth(1).locator('thead th[scope="col"]')).toHaveCount(2)
      await expect(graphs.locator('table').last().locator('thead th[scope="col"]')).toHaveCount(3)
      await expect(graphs.locator('table').last().locator('thead th').nth(2)).toHaveText(route.startsWith('/en') ? 'Connection type' : '连接类型')
      await expect(graphs.locator('table').last().locator('tbody th[scope="row"]').first()).toBeVisible()
      await expect(graphs.locator('[data-search]')).toBeDisabled()
      await expect(graphs.locator('[data-chart="relation"]')).toBeHidden()
    })
  }
})

test('cleans up charts before reconnecting the same element', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/sponsors/')
  const graphs = page.locator('[data-sponsor-graphs]')
  await expect(graphs).toHaveAttribute('data-ready', 'true')
  const detachedCount = await graphs.evaluate((element) => {
    const parent = element.parentElement!
    element.remove()
    const count = element.querySelectorAll('canvas').length
    parent.append(element)
    return count
  })
  expect(detachedCount).toBe(0)
  await expect(graphs).toHaveAttribute('data-ready', 'true')
  await expect(graphs.locator('canvas')).toHaveCount(2)
  await graphs.locator('[data-search]').fill('weapp-vite')
  await expect(graphs.locator('[data-status]')).toHaveText('1 个节点')
  expect(errors).toEqual([])
})

for (const width of [1440, 768, 390]) {
  for (const theme of ['light', 'dark'] as const) {
    test(`fits ${width}px in ${theme} with reduced motion`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 1000 })
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
      await page.goto('/sponsors/')
      const graphs = page.locator('[data-sponsor-graphs]')
      await expect(graphs).toHaveAttribute('data-ready', 'true')
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
      expect(overflow).toBe(false)
      await graphs.locator('[data-graph-card="flow"]').screenshot({ path: testInfo.outputPath('funding-flow.png'), style: '[data-site-header], body > a[href="#main-content"] { visibility: hidden !important; }' })
      await graphs.locator('[data-graph-card="relation"]').screenshot({ path: testInfo.outputPath('relations.png'), style: '[data-site-header], body > a[href="#main-content"] { visibility: hidden !important; }' })
    })
  }
}

test('does not initialize a detached component after a delayed import', async ({ page }) => {
  let release!: () => void
  const held = new Promise<void>((resolve) => {
    release = resolve
  })
  let requested!: () => void
  const requestStarted = new Promise<void>((resolve) => {
    requested = resolve
  })
  await page.route('**/_astro/core.*.js', async (route) => {
    requested()
    await held
    await route.continue()
  })
  await page.goto('/sponsors/', { waitUntil: 'domcontentloaded' })
  await requestStarted
  const component = await page.locator('[data-sponsor-graphs]').elementHandle()
  await component!.evaluate(element => element.remove())
  const finished = page.waitForResponse(response => /\/_astro\/core\./.test(response.url()))
  release()
  await (await finished).finished()
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  expect(await component!.evaluate(element => element.querySelectorAll('canvas').length)).toBe(0)
  await component!.evaluate(element => document.querySelector('main')!.append(element))
  await expect(page.locator('[data-sponsor-graphs]')).toHaveAttribute('data-ready', 'true')
  await expect(page.locator('[data-sponsor-graphs] canvas')).toHaveCount(2)
})

for (const route of ['/', '/en/']) {
  test(`does not fetch chart runtime on ${route}`, async ({ page }) => {
    const chartRequests: string[] = []
    page.on('request', (request) => {
      if (/\/_astro\/(?:core|charts|components|renderers|SponsorGraphs)\./.test(request.url())) {
        chartRequests.push(request.url())
      }
    })
    await page.goto(route)
    await page.locator('footer').scrollIntoViewIfNeeded()
    expect(chartRequests).toEqual([])
  })
}

test('keeps filters and canvases when the user switches theme', async ({ page }) => {
  await page.goto('/sponsors/')
  const graphs = page.locator('[data-sponsor-graphs]')
  await expect(graphs).toHaveAttribute('data-ready', 'true')
  await graphs.locator('[data-search]').fill('weapp-vite')
  const theme = await page.locator('html').getAttribute('data-theme')
  await page.locator('[data-theme-toggle]:visible').first().click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme === 'dark' ? 'light' : 'dark')
  await expect(graphs.locator('[data-search]')).toHaveValue('weapp-vite')
  await expect(graphs.locator('[data-status]')).toHaveText('1 个节点')
  await expect(graphs.locator('canvas')).toHaveCount(2)
})
