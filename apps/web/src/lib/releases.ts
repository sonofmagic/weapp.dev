export function getReleaseLink(status: string, npmUrl?: string): string | null {
  if (status === 'planned' || !npmUrl) {
    return null
  }
  try {
    const url = new URL(npmUrl)
    return url.protocol === 'https:' && (url.hostname === 'www.npmjs.com' || url.hostname === 'npmjs.com') ? npmUrl : null
  }
  catch {
    return null
  }
}
