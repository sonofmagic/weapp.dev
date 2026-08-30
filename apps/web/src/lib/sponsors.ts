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

function sanitize(value: unknown): PublicSponsor | undefined {
  if (!value || typeof value !== 'object') {
    return undefined
  }
  const item = value as Record<string, unknown>
  if (typeof item.id !== 'string' || (item.kind !== 'individual' && item.kind !== 'business')) {
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
  return {
    id: item.id,
    kind: item.kind,
    tier: item.tier as SponsorTier,
    ...(typeof item.login === 'string' ? { login: item.login } : {}),
    ...(typeof item.profileUrl === 'string' ? { profileUrl: item.profileUrl } : {}),
    ...(typeof item.avatarUrl === 'string' ? { avatarUrl: item.avatarUrl } : {}),
    ...(typeof item.brandName === 'string' ? { brandName: item.brandName } : {}),
    ...(typeof item.brandUrl === 'string' ? { brandUrl: item.brandUrl } : {}),
    ...(typeof item.logoUrl === 'string' ? { logoUrl: item.logoUrl } : {}),
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
    const items = Array.isArray(payload.items) ? payload.items.map(sanitize).filter((item): item is PublicSponsor => Boolean(item)) : []
    return { version: typeof payload.version === 'number' ? payload.version : 1, repositoryUrl, total: items.length, items }
  }
  catch {
    return fallback
  }
}
