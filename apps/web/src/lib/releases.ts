export function getReleaseLink(status: string, npmUrl?: string): string | null {
  if (status === 'planned' || !npmUrl) {
    return null
  }
  try {
    return new URL(npmUrl).protocol === 'https:' ? npmUrl : null
  }
  catch {
    return null
  }
}
