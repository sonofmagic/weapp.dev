import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadPublicSponsors, sponsorGraphData } from './sponsors'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('sponsor graph data', () => {
  it('does not infer project funding from sponsor order or display consent', () => {
    const snapshot = {
      version: 1,
      repositoryUrl: 'https://github.com/sonofmagic/sponsors',
      total: 2,
      items: [
        { id: 'first', kind: 'individual' as const, tier: 'supporter' as const, displaySites: ['weapp' as const, 'vite' as const] },
        { id: 'second', kind: 'individual' as const, tier: 'gold' as const, displaySites: ['weapp' as const] },
      ],
    }
    for (const items of [snapshot.items, [...snapshot.items].reverse()]) {
      const graph = sponsorGraphData({ ...snapshot, items })
      expect(graph.nodes.filter(node => node.kind === 'sponsor')).toHaveLength(2)
      expect(graph.edges.filter(edge => edge.source.startsWith('sponsor:'))).toEqual([])
    }
  })

  it('creates valid project, sponsor, ledger and fund references', () => {
    const graph = sponsorGraphData({
      version: 1,
      repositoryUrl: 'https://github.com/sonofmagic/sponsors',
      total: 1,
      items: [{ id: 'acme', kind: 'business', tier: 'gold', brandName: 'Acme', displaySites: ['weapp'] }],
    })

    expect(graph.nodes.find(node => node.id === 'sponsor:acme')?.name).toBe('Acme')
    expect(graph.nodes.filter(node => node.kind === 'site')).toHaveLength(4)
    expect(graph.relationEdges).toEqual([{ source: 'sponsor:acme', target: 'site:weapp', value: 1, label: 'display' }])
    expect(graph.edges.some(edge => edge.source === 'ledger:net' && edge.target === 'fund:core')).toBe(true)
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
        { id: '   ', kind: 'individual', tier: 'supporter', displaySites: ['weapp'] },
        { id: 'unsafe-url', kind: 'business', tier: 'gold', brandUrl: 'javascript:alert(1)', displaySites: ['weapp'] },
      ],
    }), { status: 200, headers: { 'content-type': 'application/json' } })))

    const snapshot = await loadPublicSponsors()

    expect(snapshot.version).toBe(4)
    expect(snapshot.items.map(item => item.id)).toEqual(['valid', 'unsafe-url'])
    expect(snapshot.items[0]?.profileUrl).toBe('https://github.com/valid')
    expect(snapshot.items[1]?.brandUrl).toBeUndefined()
  })

  it('trims and deduplicates sponsor IDs before building graph nodes', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      items: [
        { id: '  duplicate  ', kind: 'business', tier: 'gold', brandName: 'First', displaySites: ['weapp', 'weapp', 'vite'] },
        { id: 'duplicate', kind: 'business', tier: 'silver', brandName: 'Second', displaySites: ['weapp'] },
      ],
    }), { status: 200 })))

    const snapshot = await loadPublicSponsors()
    expect(snapshot.items).toHaveLength(1)
    expect(snapshot.items[0]).toMatchObject({ id: 'duplicate', brandName: 'First' })
    expect(snapshot.items[0]?.displaySites).toEqual(['weapp', 'vite'])
    const graph = sponsorGraphData(snapshot)
    expect(graph.nodes.filter(node => node.id === 'sponsor:duplicate')).toHaveLength(1)
    expect(graph.relationEdges.filter(edge => edge.source === 'sponsor:duplicate')).toHaveLength(2)
  })

  it.each([0, -2, 1.5, Number.NaN])('normalizes invalid snapshot version %s', async (version) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ version, items: [] }), { status: 200 })))

    const snapshot = await loadPublicSponsors()

    expect(snapshot.version).toBe(1)
  })
})
