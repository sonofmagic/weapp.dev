import { describe, expect, it } from 'vitest'
import varo from './content/projects/varo.json'
import vpt from './content/projects/vite-plugin-taro.json'
import sqlite from './content/projects/weapp-sqlite.json'
import tailwind from './content/projects/weapp-tailwindcss.json'
import vite from './content/projects/weapp-vite.json'
import { projectDefinitionSchema } from './content/schemas'

describe('project definitions', () => {
  const projects = [vite, tailwind, varo, sqlite, vpt].map(project => projectDefinitionSchema.parse(project))
  const officialDocsUrls: Record<string, string> = {
    'weapp-tailwindcss': 'https://tw.weapp.dev/',
    'weapp-vite': 'https://vite.weapp.dev/',
    'vite-plugin-taro': 'https://vpt.js.org/',
    'weapp-sqlite': 'https://github.com/weapp-sqlite/weapp-sqlite#readme',
    '@varo/cli': 'https://github.com/daguanren21/Varo#readme',
  }

  it('provides complete localized content for every project', () => {
    for (const project of projects) {
      for (const locale of ['zh-CN', 'en'] as const) {
        expect(project.locales[locale].name).not.toHaveLength(0)
        expect(project.locales[locale].description).not.toHaveLength(0)
        expect(project.locales[locale].audience).not.toHaveLength(0)
        expect(project.locales[locale].useCases.length).toBeGreaterThan(0)
        expect(project.locales[locale].capabilities.length).toBeGreaterThan(0)
        expect(project.locales[locale].faqs.length).toBeGreaterThan(0)
      }
      if (project.status === 'planned') {
        expect(project.npmUrl).toBeUndefined()
      }
      else {
        expect(project.npmUrl).toMatch(/^https:\/\//)
      }
      const license = 'license' in project ? project.license : undefined
      expect(project.status === 'planned' || license).toBeTruthy()
      license && expect(license).toMatch(/^https:\/\//)
      expect(project.installCommand).toContain(project.packageName)
      expect(project.keywords.length).toBeGreaterThan(0)
      expect(project.role).toBeTruthy()
      expect(project.dataCompleteness).toBeTruthy()
      if (project.visuals) {
        for (const visual of [project.visuals.primary, project.visuals.secondary]) {
          expect(visual.src).toMatch(/^\/media\/(projects|showcase)\/.+\.(webp|png)$/)
          expect(visual.avif).toMatch(/^\/media\/(projects|showcase)\/.+\.(avif|png)$/)
          expect(visual.width).toBeGreaterThan(0)
          expect(visual.height).toBeGreaterThan(0)
          expect(visual.locales['zh-CN'].alt).not.toHaveLength(0)
          expect(visual.locales.en.caption).not.toHaveLength(0)
        }
      }
    }
  })

  it('reserves canonical documentation routes without publishing them', () => {
    for (const project of projects) {
      expect(project.futureDocsPath).toMatch(/^\/docs\/[\w-]+\/$/)
      expect(project.docsUrl).toBe(officialDocsUrls[project.packageName])
    }
  })

  it('uses explicit placeholders for the planned Varo release', () => {
    expect(varo).toMatchObject({
      status: 'planned',
      packageName: '@varo/cli',
      github: 'daguanren21/Varo',
      docsUrl: 'https://github.com/daguanren21/Varo#readme',
    })
  })

  it('keeps weapp-sqlite honest while it is planned', () => {
    const definition = projectDefinitionSchema.parse(sqlite)
    expect(definition).toMatchObject({ status: 'planned', role: 'Local data', dataCompleteness: 'planned' })
    expect(definition.npmUrl).toBeUndefined()
    expect(definition.visuals).toBeUndefined()
    expect(definition.locales['zh-CN'].description).toContain('规划')
    expect(definition.locales.en.description).toContain('planned')
  })
})
