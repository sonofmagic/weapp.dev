export function getReleaseLink(status: string, npmUrl?: string): string | null {
  if (status === 'planned' || !npmUrl) {
    return null
  }
  return npmUrl
}
