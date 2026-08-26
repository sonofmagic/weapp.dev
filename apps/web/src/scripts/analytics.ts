import type { AnalyticsConfig, AnalyticsProvider } from '../lib/analytics-config'

export const ANALYTICS_CONSENT_KEY = 'weapp-analytics-consent:v1'

export type AnalyticsEventName
  = | 'change_theme'
    | 'click_outbound'
    | 'navigate_section'
    | 'select_project'
    | 'switch_language'

export type AnalyticsEventParams = Record<string, string | undefined>
export type AnalyticsConsent = 'granted' | 'denied'

interface ConsentRecord {
  choice: AnalyticsConsent
  version: 1
}

interface PrivacyNavigator {
  doNotTrack?: string | null
  globalPrivacyControl?: boolean
}

declare global {
  interface Window {
    _hmt?: Array<Array<boolean | number | string>>
    __WEAPP_ANALYTICS_TEST__?: boolean
    dataLayer?: unknown[][]
    gtag?: (...args: unknown[]) => void
    weappAnalytics?: {
      openPreferences: () => void
      track: (name: AnalyticsEventName, params?: AnalyticsEventParams) => void
    }
  }
}

const EVENT_PARAM_KEYS: Record<AnalyticsEventName, readonly string[]> = {
  change_theme: ['theme'],
  click_outbound: ['target', 'project'],
  navigate_section: ['section'],
  select_project: ['project'],
  switch_language: ['from', 'to'],
}

const UTM_PARAMS = new Set([
  'utm_campaign',
  'utm_content',
  'utm_medium',
  'utm_source',
  'utm_term',
])

export function readAnalyticsConsent(storage: Pick<Storage, 'getItem'>): AnalyticsConsent | null {
  try {
    const value = storage.getItem(ANALYTICS_CONSENT_KEY)
    if (!value) {
      return null
    }
    const record = JSON.parse(value) as Partial<ConsentRecord>
    return record.version === 1 && (record.choice === 'granted' || record.choice === 'denied')
      ? record.choice
      : null
  }
  catch {
    return null
  }
}

export function writeAnalyticsConsent(
  storage: Pick<Storage, 'setItem'>,
  choice: AnalyticsConsent,
): void {
  storage.setItem(ANALYTICS_CONSENT_KEY, JSON.stringify({ choice, version: 1 } satisfies ConsentRecord))
}

export function hasPrivacySignal(navigatorLike: PrivacyNavigator): boolean {
  return navigatorLike.globalPrivacyControl === true || navigatorLike.doNotTrack === '1'
}

export function sanitizeAnalyticsUrl(value: string): string {
  const url = new URL(value)
  const query = new URLSearchParams()
  for (const [key, parameter] of url.searchParams) {
    if (UTM_PARAMS.has(key)) {
      query.append(key, parameter.slice(0, 120))
    }
  }
  const suffix = query.size > 0 ? `?${query.toString()}` : ''
  return `${url.origin}${url.pathname}${suffix}`
}

export function normalizeAnalyticsEvent(
  name: AnalyticsEventName,
  params: AnalyticsEventParams = {},
): Record<string, string> {
  return Object.fromEntries(
    EVENT_PARAM_KEYS[name]
      .map(key => [key, params[key]?.slice(0, 80)] as const)
      .filter((entry): entry is readonly [string, string] => Boolean(entry[1])),
  )
}

export function mapBaiduEvent(
  name: AnalyticsEventName,
  params: AnalyticsEventParams = {},
): [category: string, action: string, label: string] {
  const normalized = normalizeAnalyticsEvent(name, params)
  const category = name === 'click_outbound' ? 'outbound' : 'site'
  const label = EVENT_PARAM_KEYS[name]
    .map(key => normalized[key])
    .filter(Boolean)
    .join(':')
  return [category, name, label]
}

function appendProviderScript(id: string, src: string): Promise<void> {
  const current = document.getElementById(id) as HTMLScriptElement | null
  if (current?.dataset.loaded === 'true') {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const script = current ?? document.createElement('script')
    const handleLoad = () => {
      script.dataset.loaded = 'true'
      resolve()
    }
    script.addEventListener('load', handleLoad, { once: true })
    script.addEventListener('error', () => reject(new Error(`Unable to load ${id}`)), { once: true })
    if (!current) {
      script.id = id
      script.async = true
      script.src = src
      document.head.appendChild(script)
    }
  })
}

function getPreferenceElements() {
  return {
    banner: document.querySelector<HTMLElement>('[data-analytics-banner]'),
    dialog: document.querySelector<HTMLDialogElement>('[data-analytics-dialog]'),
    enabled: document.querySelector<HTMLInputElement>('[data-analytics-enabled]'),
    privacyNotice: document.querySelector<HTMLElement>('[data-analytics-privacy-signal]'),
  }
}

export function initAnalytics(): void {
  if (window.weappAnalytics) {
    return
  }

  let config: AnalyticsConfig | null = null
  let activeProvider: AnalyticsProvider = 'none'
  let providerPromise: Promise<void> | null = null
  const privacySignal = hasPrivacySignal(navigator)
  const preferenceElements = getPreferenceElements()

  const track = (name: AnalyticsEventName, params: AnalyticsEventParams = {}) => {
    const normalized = normalizeAnalyticsEvent(name, params)
    if (activeProvider === 'ga4') {
      window.gtag?.('event', name, normalized)
    }
    else if (activeProvider === 'baidu') {
      const [category, action, label] = mapBaiduEvent(name, normalized)
      window._hmt?.push(['_trackEvent', category, action, label])
    }
  }

  const openPreferences = () => {
    const { dialog, enabled, privacyNotice } = preferenceElements
    if (!dialog || !enabled) {
      return
    }
    const choice = readAnalyticsConsent(localStorage)
    enabled.checked = !privacySignal && (choice === 'granted' || (choice === null && config?.consentRequired === false))
    enabled.disabled = privacySignal || config?.provider === 'none'
    privacyNotice?.toggleAttribute('hidden', !privacySignal)
    dialog.showModal()
  }

  window.weappAnalytics = { openPreferences, track }

  const sendPageView = () => {
    const pageLocation = sanitizeAnalyticsUrl(window.location.href)
    const pagePath = new URL(pageLocation).pathname + new URL(pageLocation).search
    if (activeProvider === 'ga4') {
      window.gtag?.('event', 'page_view', {
        page_location: pageLocation,
        page_path: pagePath,
        page_title: document.title.slice(0, 120),
      })
    }
    else if (activeProvider === 'baidu') {
      window._hmt?.push(['_trackPageview', pagePath])
    }
  }

  const loadProvider = async () => {
    if (!config?.siteId || config.provider === 'none' || privacySignal) {
      return
    }
    if (providerPromise) {
      return providerPromise
    }

    activeProvider = config.provider
    if (config.provider === 'ga4') {
      window.dataLayer = window.dataLayer ?? []
      window.gtag = window.gtag ?? ((...args: unknown[]) => window.dataLayer?.push(args))
      window.gtag('consent', 'default', {
        ad_personalization: 'denied',
        ad_storage: 'denied',
        analytics_storage: 'granted',
      })
      window.gtag('js', new Date())
      window.gtag('config', config.siteId, {
        allow_ad_personalization_signals: false,
        allow_google_signals: false,
        send_page_view: false,
      })
      providerPromise = appendProviderScript(
        'weapp-ga4',
        `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.siteId)}`,
      )
    }
    else {
      window._hmt = window._hmt ?? []
      window._hmt.push(['_setAutoPageview', false])
      providerPromise = appendProviderScript(
        'weapp-baidu-tongji',
        `https://hm.baidu.com/hm.js?${encodeURIComponent(config.siteId)}`,
      )
    }

    try {
      await providerPromise
      sendPageView()
    }
    catch {
      activeProvider = 'none'
      providerPromise = null
    }
  }

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element
      ? event.target.closest<HTMLElement>('[data-analytics-event]')
      : null
    if (!target) {
      return
    }
    const name = target.dataset.analyticsEvent as AnalyticsEventName
    if (!(name in EVENT_PARAM_KEYS)) {
      return
    }
    track(name, {
      from: target.dataset.analyticsFrom,
      project: target.dataset.analyticsProject,
      section: target.dataset.analyticsSection,
      target: target.dataset.analyticsTarget,
      theme: name === 'change_theme' ? document.documentElement.dataset.theme : undefined,
      to: target.dataset.analyticsTo,
    })
  })

  document.querySelectorAll<HTMLElement>('[data-analytics-preferences-open]').forEach((button) => {
    button.addEventListener('click', openPreferences)
  })
  document.querySelectorAll<HTMLElement>('[data-analytics-preferences-close]').forEach((button) => {
    button.addEventListener('click', () => preferenceElements.dialog?.close())
  })
  document.querySelector<HTMLElement>('[data-analytics-accept]')?.addEventListener('click', () => {
    writeAnalyticsConsent(localStorage, 'granted')
    preferenceElements.banner?.setAttribute('hidden', '')
    void loadProvider()
  })
  document.querySelector<HTMLElement>('[data-analytics-reject]')?.addEventListener('click', () => {
    writeAnalyticsConsent(localStorage, 'denied')
    preferenceElements.banner?.setAttribute('hidden', '')
  })
  document.querySelector<HTMLFormElement>('[data-analytics-preferences-form]')?.addEventListener('submit', (event) => {
    event.preventDefault()
    const enabled = preferenceElements.enabled?.checked === true && !privacySignal
    writeAnalyticsConsent(localStorage, enabled ? 'granted' : 'denied')
    preferenceElements.dialog?.close()
    if (enabled) {
      void loadProvider()
    }
    else if (activeProvider !== 'none') {
      window.location.reload()
    }
  })

  const shouldRun = window.location.hostname === 'weapp.dev' || window.__WEAPP_ANALYTICS_TEST__ === true
  if (!shouldRun) {
    return
  }

  void fetch('/api/analytics/config', {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  }).then(async (response) => {
    if (!response.ok) {
      return
    }
    config = await response.json() as AnalyticsConfig
    if (config.provider === 'none' || privacySignal) {
      return
    }
    const choice = readAnalyticsConsent(localStorage)
    if (choice === 'granted' || (choice === null && !config.consentRequired)) {
      await loadProvider()
    }
    else if (choice === null && config.consentRequired) {
      preferenceElements.banner?.removeAttribute('hidden')
    }
  }).catch(() => undefined)
}
