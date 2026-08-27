import { describe, expect, it } from 'vitest'
import varo from './content/projects/varo.json'
import tailwind from './content/projects/weapp-tailwindcss.json'
import vite from './content/projects/weapp-vite.json'

describe('project definitions', () => {
  const projects = [tailwind, vite, varo]
  const officialDocsUrls: Record<string, string> = {
    'weapp-tailwindcss': 'https://tw.weapp.dev/',
    'weapp-vite': 'https://vite.weapp.dev/',
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
      expect(project.npmUrl).toMatch(/^https:\/\//)
      const license = 'license' in project ? project.license : undefined
      expect(project.status === 'planned' || license).toBeTruthy()
      license && expect(license).toMatch(/^https:\/\//)
      expect(project.installCommand).toContain(project.packageName)
      expect(project.keywords.length).toBeGreaterThan(0)
      for (const visual of Object.values(project.visuals)) {
        expect(visual.src).toMatch(/^\/media\/projects\/.+\.webp$/)
        expect(visual.avif).toMatch(/^\/media\/projects\/.+\.avif$/)
        expect(visual.width).toBeGreaterThan(0)
        expect(visual.height).toBeGreaterThan(0)
        expect(visual.locales['zh-CN'].alt).not.toHaveLength(0)
        expect(visual.locales.en.caption).not.toHaveLength(0)
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
})
