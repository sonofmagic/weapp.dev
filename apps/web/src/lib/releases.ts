export function getReleaseLink(status: string, npmUrl?: string): string | null {
  if (status === 'planned' || !npmUrl) {
    return null
  }
  try {
    const url = new URL(npmUrl)
    return url.protocol === 'https:'
      && (url.hostname === 'www.npmjs.com' || url.hostname === 'npmjs.com')
      && url.pathname.startsWith('/package/')
      && url.pathname.length > '/package/'.length
      && url.search === ''
      && url.hash === ''
      ? npmUrl
      : null
  }
  catch {
    return null
  }
}
