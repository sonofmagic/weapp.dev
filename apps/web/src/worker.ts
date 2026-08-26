import { selectAnalyticsConfig } from './lib/analytics-config'

const analyticsHeaders = {
  'Cache-Control': 'private, no-store',
  'Content-Type': 'application/json; charset=utf-8',
  'Vary': 'CF-IPCountry',
  'X-Content-Type-Options': 'nosniff',
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.hostname === 'www.weapp.dev') {
      url.hostname = 'weapp.dev'
      return Response.redirect(url.toString(), 308)
    }

    if (url.pathname === '/api/analytics/config') {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return new Response(null, {
          status: 405,
          headers: { ...analyticsHeaders, Allow: 'GET, HEAD' },
        })
      }

      const country = typeof request.cf?.country === 'string' ? request.cf.country : undefined
      const config = selectAnalyticsConfig(country, {
        baidu: env.BAIDU_TONGJI_ID,
        ga4: env.GA4_MEASUREMENT_ID,
      })

      return new Response(request.method === 'HEAD' ? null : JSON.stringify(config), {
        headers: analyticsHeaders,
      })
    }

    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
