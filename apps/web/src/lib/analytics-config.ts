export type AnalyticsProvider = 'baidu' | 'ga4' | 'none'

export interface AnalyticsConfig {
  provider: AnalyticsProvider
  consentRequired: boolean
  siteId?: string
}

const STRICT_CONSENT_COUNTRIES = new Set([
  'AT',
  'BE',
  'BG',
  'CH',
  'CY',
  'CZ',
  'DE',
  'DK',
  'EE',
  'ES',
  'FI',
  'FR',
  'GB',
  'GR',
  'HR',
  'HU',
  'IE',
  'IS',
  'IT',
  'LI',
  'LT',
  'LU',
  'LV',
  'MT',
  'NL',
  'NO',
  'PL',
  'PT',
  'RO',
  'SE',
  'SI',
  'SK',
])

const SITE_ID_PATTERN = /^[\w-]{4,64}$/
const COUNTRY_CODE_PATTERN = /^[A-Z]{2}$/
const UNKNOWN_COUNTRY_CODES = new Set(['T1', 'XX'])

export function requiresAnalyticsConsent(country?: string): boolean {
  const normalizedCountry = country?.toUpperCase()
  return !normalizedCountry
    || !COUNTRY_CODE_PATTERN.test(normalizedCountry)
    || UNKNOWN_COUNTRY_CODES.has(normalizedCountry)
    || STRICT_CONSENT_COUNTRIES.has(normalizedCountry)
}

export function selectAnalyticsConfig(
  country: string | undefined,
  siteIds: { baidu?: string, ga4?: string },
): AnalyticsConfig {
  const provider = country?.toUpperCase() === 'CN' ? 'baidu' : 'ga4'
  const siteId = siteIds[provider]?.trim()

  if (!siteId || !SITE_ID_PATTERN.test(siteId)) {
    return { provider: 'none', consentRequired: false }
  }

  return {
    provider,
    consentRequired: requiresAnalyticsConsent(country),
    siteId,
  }
}
