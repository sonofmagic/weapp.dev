import type { Locale, ProjectDefinition, ProjectMetrics } from '../types/project'

export const siteUrl = 'https://weapp.dev'
export const organizationId = `${siteUrl}/#organization`

export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString()
}

export function canonicalUrl(pathname: string): string {
  const path = pathname.split(/[?#]/, 1)[0] || '/'
  return absoluteUrl(path)
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId,
    'name': 'weapp.dev',
    'url': siteUrl,
    'logo': absoluteUrl('/favicon.svg'),
    'sameAs': [
      'https://github.com/sonofmagic/weapp.dev',
      'https://github.com/sonofmagic/weapp-tailwindcss',
      'https://github.com/weapp-vite/weapp-vite',
      'https://tw.icebreaker.top/',
      'https://vite.icebreaker.top/',
    ],
  }
}

export function websiteSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    'name': 'weapp.dev',
    'url': siteUrl,
    'inLanguage': locale === 'zh-CN' ? 'zh-CN' : 'en-US',
    'publisher': { '@id': organizationId },
  }
}

export function webPageSchema(locale: Locale, title: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    url,
    'name': title,
    description,
    'inLanguage': locale === 'zh-CN' ? 'zh-CN' : 'en-US',
    'isPartOf': { '@id': `${siteUrl}/#website` },
  }
}

export function projectListSchema(locale: Locale, projects: Array<{ id: string, data: ProjectDefinition }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': locale === 'zh-CN' ? 'weapp.dev 项目' : 'weapp.dev projects',
    'itemListElement': projects.map((project, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': project.data.locales[locale].name,
      'url': absoluteUrl(locale === 'zh-CN' ? `/projects/${project.id}/` : `/en/projects/${project.id}/`),
    })),
  }
}

export function projectSchema(
  locale: Locale,
  project: { id: string, data: ProjectDefinition },
  metrics: ProjectMetrics,
) {
  const content = project.data.locales[locale]
  const path = locale === 'zh-CN' ? `/projects/${project.id}/` : `/en/projects/${project.id}/`

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    '@id': absoluteUrl(path),
    'name': content.name,
    'description': content.description,
    'url': absoluteUrl(path),
    'image': absoluteUrl(project.data.logo),
    'codeRepository': `https://github.com/${project.data.github}`,
    'downloadUrl': project.data.npmUrl,
    'programmingLanguage': ['TypeScript', 'JavaScript'],
    'keywords': project.data.keywords.join(', '),
    'runtimePlatform': project.data.platforms,
    'license': project.data.license,
    'version': metrics.version,
    'dateModified': metrics.releasedAt,
    'maintainer': {
      '@type': 'Organization',
      'name': project.data.maintainer,
    },
    'isPartOf': { '@id': organizationId },
    'sameAs': [project.data.docsUrl, project.data.npmUrl, `https://github.com/${project.data.github}`],
  }
}

export function breadcrumbSchema(locale: Locale, project: { id: string, data: ProjectDefinition }) {
  const homePath = locale === 'zh-CN' ? '/' : '/en/'
  const projectsLabel = locale === 'zh-CN' ? '项目' : 'Projects'
  const content = project.data.locales[locale]
  const projectPath = locale === 'zh-CN' ? `/projects/${project.id}/` : `/en/projects/${project.id}/`

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'weapp.dev', 'item': absoluteUrl(homePath) },
      { '@type': 'ListItem', 'position': 2, 'name': projectsLabel, 'item': absoluteUrl(`${homePath}#projects`) },
      { '@type': 'ListItem', 'position': 3, 'name': content.name, 'item': absoluteUrl(projectPath) },
    ],
  }
}
