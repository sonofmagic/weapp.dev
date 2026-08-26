import { describe, expect, it, vi } from 'vitest'
import worker from './worker'

function requestWithCountry(url: string, country?: string, method = 'GET'): Request {
  const request = new Request(url, { method })
  if (country) {
    Object.defineProperty(request, 'cf', { value: { country } })
  }
  return request
}

type AnalyticsEnvOverrides = Partial<Record<'BAIDU_TONGJI_ID' | 'GA4_MEASUREMENT_ID', string>>

function createEnv(overrides: AnalyticsEnvOverrides = {}): Env {
  return {
    ASSETS: { fetch: vi.fn() } as unknown as Fetcher,
    BAIDU_TONGJI_ID: 'baidu_test_id',
    GA4_MEASUREMENT_ID: 'G-TEST1234',
    ...overrides,
  } as unknown as Env
}

describe('Cloudflare worker', () => {
  it('delegates apex requests to the static asset binding', async () => {
    const assetResponse = new Response('asset', { status: 200 })
    const assets = { fetch: vi.fn(async () => assetResponse) } as unknown as Fetcher
    const request = new Request('https://weapp.dev/en/')
    const response = await worker.fetch(request, { ASSETS: assets } as unknown as Env)

    expect(response).toBe(assetResponse)
    expect(assets.fetch).toHaveBeenCalledWith(request)
  })

  it.each([
    ['CN', 'baidu', false],
    ['US', 'ga4', false],
    ['DE', 'ga4', true],
    ['GB', 'ga4', true],
    ['T1', 'ga4', true],
    ['XX', 'ga4', true],
    [undefined, 'ga4', true],
  ])('selects analytics for country %s', async (country, provider, consentRequired) => {
    const response = await worker.fetch(
      requestWithCountry('https://weapp.dev/api/analytics/config', country),
      createEnv(),
    )

    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({ provider, consentRequired })
    expect(response.headers.get('cache-control')).toBe('private, no-store')
    expect(response.headers.get('vary')).toBe('CF-IPCountry')
  })

  it('disables a provider when its public site ID is missing', async () => {
    const response = await worker.fetch(
      requestWithCountry('https://weapp.dev/api/analytics/config', 'CN'),
      createEnv({ BAIDU_TONGJI_ID: '' }),
    )

    expect(await response.json()).toEqual({ provider: 'none', consentRequired: false })
  })

  it('supports HEAD and rejects other methods on the analytics endpoint', async () => {
    const env = createEnv()
    const head = await worker.fetch(
      requestWithCountry('https://weapp.dev/api/analytics/config', 'US', 'HEAD'),
      env,
    )
    const post = await worker.fetch(
      requestWithCountry('https://weapp.dev/api/analytics/config', 'US', 'POST'),
      env,
    )

    expect(head.status).toBe(200)
    expect(await head.text()).toBe('')
    expect(post.status).toBe(405)
    expect(post.headers.get('allow')).toBe('GET, HEAD')
  })
})
