export type Locale = 'zh-CN' | 'en'

export interface LocalizedProjectContent {
  name: string
  tagline: string
  description: string
  capabilities: string[]
}

export interface ProjectDefinition {
  order: number
  status: 'stable' | 'beta' | 'planned'
  packageName: string
  github: string
  docsUrl: string
  futureDocsPath: string
  logo: string
  accent: string
  platforms: string[]
  locales: Record<Locale, LocalizedProjectContent>
}

export interface ProjectMetrics {
  version: string
  releasedAt: string
  stars: number
  weeklyDownloads: number
  fetchedAt: string
}

export type ProjectMetricsMap = Record<string, ProjectMetrics>
