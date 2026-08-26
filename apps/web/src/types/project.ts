export type Locale = 'zh-CN' | 'en'

export interface LocalizedProjectContent {
  name: string
  tagline: string
  description: string
  audience: string
  useCases: string[]
  capabilities: string[]
  faqs: Array<{ question: string, answer: string }>
}

export interface ProjectDefinition {
  order: number
  status: 'stable' | 'beta' | 'planned'
  packageName: string
  github: string
  docsUrl: string
  npmUrl: string
  license: string
  maintainer: string
  keywords: string[]
  installCommand: string
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
