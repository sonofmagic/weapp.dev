import type { ProjectDefinition } from '../types/project'
import { describe, expect, it } from 'vitest'
import tailwind from '../content/projects/weapp-tailwindcss.json'
import fallbackMetrics from '../data/project-metrics.fallback.json'
import { breadcrumbSchema, canonicalUrl, organizationSchema, projectSchema, serializeJsonLd } from './seo'

describe('SEO helpers', () => {
  it('normalizes canonical URLs without query strings or hashes', () => {
    expect(canonicalUrl('/projects/weapp-tailwindcss/?utm_source=test#faq'))
      .toBe('https://weapp.dev/projects/weapp-tailwindcss/')
  })

  it('creates official project entity and breadcrumb schemas', () => {
    const project = { id: 'weapp-tailwindcss', data: tailwind as unknown as ProjectDefinition }
    const entity = projectSchema('zh-CN', project, fallbackMetrics['weapp-tailwindcss'])
    const breadcrumb = breadcrumbSchema('zh-CN', project)

    expect(entity['@type']).toBe('SoftwareSourceCode')
    expect(entity.codeRepository).toBe('https://github.com/sonofmagic/weapp-tailwindcss')
    expect(entity.sameAs).toContain('https://www.npmjs.com/package/weapp-tailwindcss')
    expect(breadcrumb.itemListElement).toHaveLength(3)
    expect(JSON.parse(serializeJsonLd(entity))).toEqual(entity)
  })

  it('derives organization links from project definitions', () => {
    const project = { id: 'weapp-tailwindcss', data: tailwind as unknown as ProjectDefinition }
    const organization = organizationSchema([project])

    expect(organization.sameAs).toContain('https://tw.weapp.dev/')
    expect(organization.sameAs).toContain('https://github.com/sonofmagic/weapp-tailwindcss')
  })
})
