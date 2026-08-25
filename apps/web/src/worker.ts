export interface Env {
  ASSETS: Fetcher
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.hostname === 'www.weapp.dev') {
      url.hostname = 'weapp.dev'
      return Response.redirect(url.toString(), 308)
    }

    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
