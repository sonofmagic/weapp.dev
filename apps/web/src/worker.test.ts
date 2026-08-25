import type { Env } from './worker'
import { describe, expect, it, vi } from 'vitest'
import worker from './worker'

describe('Cloudflare worker', () => {
  it('redirects www to the apex host and preserves the request URL', async () => {
    const assets = { fetch: vi.fn() } as unknown as Fetcher
    const response = await worker.fetch(
      new Request('https://www.weapp.dev/projects/weapp-vite/?source=test'),
      { ASSETS: assets } satisfies Env,
    )

    expect(response.status).toBe(308)
    expect(response.headers.get('location')).toBe('https://weapp.dev/projects/weapp-vite/?source=test')
    expect(assets.fetch).not.toHaveBeenCalled()
  })

  it('delegates apex requests to the static asset binding', async () => {
    const assetResponse = new Response('asset', { status: 200 })
    const assets = { fetch: vi.fn(async () => assetResponse) } as unknown as Fetcher
    const request = new Request('https://weapp.dev/en/')
    const response = await worker.fetch(request, { ASSETS: assets } satisfies Env)

    expect(response).toBe(assetResponse)
    expect(assets.fetch).toHaveBeenCalledWith(request)
  })
})
