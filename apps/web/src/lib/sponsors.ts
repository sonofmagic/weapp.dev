export type SponsorSite = 'icebreaker' | 'weapp' | 'tw' | 'vite'
export type SponsorTier = 'supporter' | 'bronze' | 'silver' | 'gold'

export interface PublicSponsor {
  id: string
  kind: 'individual' | 'business'
  tier: SponsorTier
  login?: string
  profileUrl?: string
  avatarUrl?: string
  brandName?: string
  brandUrl?: string
  logoUrl?: string
  displaySites: SponsorSite[]
}

export interface SponsorSnapshot {
  version: number
  repositoryUrl: string
  total: number
  items: PublicSponsor[]
}

export type SponsorGraphNodeKind = 'sponsor' | 'project' | 'fund' | 'site'
export interface SponsorGraphNode { id: string, name: string, kind: SponsorGraphNodeKind, value?: number, url?: string }
export interface SponsorGraphEdge { source: string, target: string, value: number, label?: string }
export interface SponsorGraphData { nodes: SponsorGraphNode[], edges: SponsorGraphEdge[], relationEdges: SponsorGraphEdge[], buckets: Array<{ id: string, name: string, share: number, body: string }> }

const repositoryUrl = 'https://github.com/sonofmagic/sponsors'
const fallback: SponsorSnapshot = {
  version: 1,
  repositoryUrl,
  total: 1,
  items: [{
    id: 'manual:easysearch',
    kind: 'business',
    tier: 'gold',
    brandName: 'Easysearch',
    brandUrl: 'https://easysearch.cn/',
    logoUrl: 'https://icebreaker.top/generated/sponsors/gold-manual-easysearch.webp',
    displaySites: ['icebreaker', 'weapp', 'tw', 'vite'],
  }],
}
const allSites: SponsorSite[] = ['icebreaker', 'weapp', 'tw', 'vite']

function sanitizeUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.toString() : undefined
  }
  catch {
    return undefined
  }
}

function sanitize(value: unknown): PublicSponsor | undefined {
  if (!value || typeof value !== 'object') {
    return undefined
  }
  const item = value as Record<string, unknown>
  if (typeof item.id !== 'string' || item.id.trim().length === 0 || (item.kind !== 'individual' && item.kind !== 'business')) {
    return undefined
  }
  if (!['supporter', 'bronze', 'silver', 'gold'].includes(String(item.tier))) {
    return undefined
  }
  const displaySites = Array.isArray(item.displaySites)
    ? item.displaySites.filter((site): site is SponsorSite => allSites.includes(site as SponsorSite))
    : []
  if (!displaySites.includes('weapp')) {
    return undefined
  }
  const id = item.id.trim()
  return {
    id,
    kind: item.kind,
    tier: item.tier as SponsorTier,
    ...(typeof item.login === 'string' ? { login: item.login } : {}),
    ...(sanitizeUrl(item.profileUrl) ? { profileUrl: sanitizeUrl(item.profileUrl) } : {}),
    ...(sanitizeUrl(item.avatarUrl) ? { avatarUrl: sanitizeUrl(item.avatarUrl) } : {}),
    ...(typeof item.brandName === 'string' ? { brandName: item.brandName } : {}),
    ...(sanitizeUrl(item.brandUrl) ? { brandUrl: sanitizeUrl(item.brandUrl) } : {}),
    ...(sanitizeUrl(item.logoUrl) ? { logoUrl: sanitizeUrl(item.logoUrl) } : {}),
    displaySites,
  }
}

export async function loadPublicSponsors(): Promise<SponsorSnapshot> {
  const endpoint = import.meta.env.SPONSOR_SNAPSHOT_URL || 'https://icebreaker.top/api/sponsor/v1/sponsors'
  try {
    const headers: Record<string, string> = {}
    if (import.meta.env.SPONSOR_API_TOKEN) {
      headers.Authorization = `Bearer ${import.meta.env.SPONSOR_API_TOKEN}`
    }
    const response = await fetch(endpoint, { headers })
    if (!response.ok) {
      throw new Error(`Sponsor snapshot returned ${response.status}`)
    }
    const payload = await response.json() as Record<string, unknown>
    const items = Array.isArray(payload.items)
      ? payload.items.map(sanitize).filter((item): item is PublicSponsor => Boolean(item)).reduce<PublicSponsor[]>((unique, item) => {
          if (!unique.some(existing => existing.id === item.id)) {
            unique.push(item)
          }
          return unique
        }, [])
      : []
    const version = typeof payload.version === 'number' && Number.isInteger(payload.version) && payload.version > 0 ? payload.version : 1
    return { version, repositoryUrl, total: items.length, items }
  }
  catch {
    return fallback
  }
}

const projects = [
  ['project:weapp-vite', 'weapp-vite', 'https://github.com/weapp-vite/weapp-vite'],
  ['project:weapp-tailwindcss', 'weapp-tailwindcss', 'https://github.com/sonofmagic/weapp-tailwindcss'],
  ['project:weapp-dev', 'weapp.dev', 'https://github.com/sonofmagic/weapp.dev'],
] as const
const sites = [
  ['site:weapp', 'weapp.dev', 'https://weapp.dev/'],
  ['site:tw', 'tw.weapp.dev', 'https://tw.weapp.dev/'],
  ['site:vite', 'vite.weapp.dev', 'https://vite.weapp.dev/'],
  ['site:icebreaker', 'icebreaker.top', 'https://icebreaker.top/'],
] as const

export function sponsorGraphData(snapshot: SponsorSnapshot): SponsorGraphData {
  const nodes: SponsorGraphNode[] = projects.map(([id, name, url]) => ({ id, name, kind: 'project', url }))
  nodes.push(...sites.map(([id, name, url]) => ({ id, name, kind: 'site' as const, url })))
  const edges: SponsorGraphEdge[] = []
  const relationEdges: SponsorGraphEdge[] = []
  for (const sponsor of snapshot.items) {
    const name = sponsor.brandName || sponsor.login || sponsor.id
    nodes.push({ id: `sponsor:${sponsor.id}`, name, kind: 'sponsor', url: sponsor.brandUrl || sponsor.profileUrl })
    for (const site of sponsor.displaySites) {
      relationEdges.push({ source: `sponsor:${sponsor.id}`, target: `site:${site}`, value: 1, label: 'display' })
    }
  }
  const buckets = [
    { id: 'fund:core', name: 'Core maintenance', share: 60, body: 'Maintainer time, tests, CI, domain and docs.' },
    { id: 'fund:contributors', name: 'Contributors fund', share: 25, body: 'Quarterly pool and targeted bounties.' },
    { id: 'fund:ecosystem', name: 'Nearby open source', share: 15, body: 'Related mini-program ecosystem projects.' },
  ]
  for (const bucket of buckets) {
    nodes.push({ id: bucket.id, name: bucket.name, kind: 'fund', value: bucket.share })
    edges.push({ source: 'ledger:net', target: bucket.id, value: bucket.share, label: `${bucket.share}%` })
  }
  nodes.push({ id: 'ledger:net', name: 'Confirmed net receipts', kind: 'fund', value: 100 })
  return { nodes, edges, relationEdges, buckets }
}
