import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadPublicSponsors, sponsorGraphData } from './sponsors'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('sponsor graph data', () => {
  it('creates valid project, sponsor, ledger and fund references', () => {
    const graph = sponsorGraphData({
      version: 1,
      repositoryUrl: 'https://github.com/sonofmagic/sponsors',
      total: 1,
      items: [{ id: 'acme', kind: 'business', tier: 'gold', brandName: 'Acme', displaySites: ['weapp'] }],
    })

    expect(graph.nodes.find(node => node.id === 'sponsor:acme')?.name).toBe('Acme')
    expect(graph.buckets.reduce((total, bucket) => total + bucket.share, 0)).toBe(100)
    const nodeIds = new Set(graph.nodes.map(node => node.id))
    expect(graph.edges.every(edge => nodeIds.has(edge.source) && nodeIds.has(edge.target))).toBe(true)
  })

  it('falls back to the committed sponsor snapshot when the endpoint fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    const snapshot = await loadPublicSponsors()

    expect(snapshot.items[0]?.brandName).toBe('Easysearch')
    expect(snapshot.items[0]?.displaySites).toContain('weapp')
  })

  it('keeps only valid public sponsors from a remote payload', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      version: 4,
      items: [
        { id: 'valid', kind: 'individual', tier: 'supporter', login: 'valid', profileUrl: 'https://github.com/valid', displaySites: ['weapp'] },
        { id: 'hidden', kind: 'business', tier: 'gold', displaySites: ['vite'] },
        { id: 'bad-tier', kind: 'business', tier: 'platinum', displaySites: ['weapp'] },
        { id: 'unsafe-url', kind: 'business', tier: 'gold', brandUrl: 'javascript:alert(1)', displaySites: ['weapp'] },
      ],
    }), { status: 200, headers: { 'content-type': 'application/json' } })))

    const snapshot = await loadPublicSponsors()

    expect(snapshot.version).toBe(4)
    expect(snapshot.items.map(item => item.id)).toEqual(['valid', 'unsafe-url'])
    expect(snapshot.items[0]?.profileUrl).toBe('https://github.com/valid')
    expect(snapshot.items[1]?.brandUrl).toBeUndefined()
  })
})
