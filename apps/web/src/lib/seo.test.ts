import type { ProjectDefinition } from '../types/project'
import { describe, expect, it } from 'vitest'
import varo from '../content/projects/varo.json'
import tailwind from '../content/projects/weapp-tailwindcss.json'
import fallbackMetrics from '../data/project-metrics.fallback.json'
import { breadcrumbSchema, canonicalUrl, organizationSchema, pricingSchema, projectSchema, serializeJsonLd } from './seo'

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
    expect(breadcrumb.itemListElement[1].item).toBe('https://weapp.dev/projects/')
    expect(breadcrumbSchema('en', project).itemListElement[1].item).toBe('https://weapp.dev/en/projects/')
    expect(JSON.parse(serializeJsonLd(entity))).toEqual(entity)
  })

  it('does not publish release or package claims for planned projects', () => {
    const project = { id: 'varo', data: varo as unknown as ProjectDefinition }
    const entity = projectSchema('en', project, fallbackMetrics.varo)
    expect(entity).not.toHaveProperty('version')
    expect(entity).not.toHaveProperty('dateModified')
    expect(entity).not.toHaveProperty('downloadUrl')
    expect(entity.sameAs).not.toContain('https://www.npmjs.com/package/@varo/cli')
  })

  it('derives organization links from project definitions', () => {
    const project = { id: 'weapp-tailwindcss', data: tailwind as unknown as ProjectDefinition }
    const organization = organizationSchema([project])

    expect(organization.sameAs).toContain('https://tw.weapp.dev/')
    expect(organization.sameAs).toContain('https://github.com/sonofmagic/weapp-tailwindcss')
  })

  it('describes delivery and sponsorship without purchasable offers', () => {
    const schema = pricingSchema('zh-CN') as Record<string, unknown>
    expect(schema['@type']).toBe('CollectionPage')
    expect(JSON.stringify(schema)).toContain('DonateAction')
    expect(JSON.stringify(schema)).not.toContain('Offer')
  })
})
