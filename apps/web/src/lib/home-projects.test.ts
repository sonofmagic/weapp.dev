import { describe, expect, it } from 'vitest'
import { homeProjectPlacements } from '../content/home-projects'
import varo from '../content/projects/varo.json'
import tailwind from '../content/projects/weapp-tailwindcss.json'
import vite from '../content/projects/weapp-vite.json'
import { projectDefinitionSchema, showcaseSchema } from '../content/schemas'
import varoImages from '../content/showcases/varo.json'
import tailwindImages from '../content/showcases/weapp-tailwindcss.json'
import viteImages from '../content/showcases/weapp-vite.json'
import { assembleHomeProjects } from './home-projects'

const projects = [
  { id: 'weapp-tailwindcss', data: projectDefinitionSchema.parse(tailwind) },
  { id: 'weapp-vite', data: projectDefinitionSchema.parse(vite) },
  { id: 'varo', data: projectDefinitionSchema.parse(varo) },
]
const showcases = [
  { id: 'weapp-tailwindcss', data: showcaseSchema.parse(tailwindImages) },
  { id: 'weapp-vite', data: showcaseSchema.parse(viteImages) },
  { id: 'varo', data: showcaseSchema.parse(varoImages) },
]

describe('home project composition', () => {
  it('keeps editorial order when the catalog is reordered or extended', () => {
    const extended = [...projects].reverse().concat({ id: 'new-project', data: projects[0].data })
    const result = assembleHomeProjects(extended, showcases, homeProjectPlacements)
    expect(result.map(project => project.id)).toEqual(['weapp-tailwindcss', 'weapp-vite', 'varo'])
    expect(result.map(project => project.showcase.length)).toEqual([1, 2, 1])
  })

  it('combines independent metadata and screenshot updates without overwriting either', () => {
    const changedProjects = structuredClone(projects)
    changedProjects[0].data.docsUrl = 'https://example.com/new-docs/'
    changedProjects[0].data.status = 'beta'
    const changedShowcases = structuredClone(showcases)
    changedShowcases[0].data.images[0].locales.en.caption = 'Updated capture'
    const result = assembleHomeProjects(changedProjects, changedShowcases, homeProjectPlacements)
    expect(result[0].data.docsUrl).toBe('https://example.com/new-docs/')
    expect(result[0].data.status).toBe('beta')
    expect(result[0].showcase[0].locales.en.caption).toBe('Updated capture')
    expect(changedProjects[0].data.visuals).not.toHaveProperty('showcase')
    expect(projects[0].data.status).toBe('stable')
  })

  it('rejects stale references and duplicate placements before rendering', () => {
    expect(() => assembleHomeProjects(projects, showcases, [...homeProjectPlacements, homeProjectPlacements[0]]))
      .toThrow('Duplicate home project')
    expect(() => assembleHomeProjects(projects.slice(1), showcases, homeProjectPlacements))
      .toThrow('unknown project')
    expect(() => assembleHomeProjects(projects, showcases.slice(1), homeProjectPlacements))
      .toThrow('requires project data and showcase images')
  })

  it('validates image metadata independently from the project definition', () => {
    expect(showcaseSchema.safeParse({ images: [] }).success).toBe(false)
    const invalid = structuredClone(tailwindImages)
    invalid.images[0].width = 0
    expect(showcaseSchema.safeParse(invalid).success).toBe(false)
    expect(projectDefinitionSchema.safeParse(tailwind).success).toBe(true)
    expect(projectDefinitionSchema.safeParse({
      ...tailwind,
      visuals: { ...tailwind.visuals, showcase: tailwindImages.images },
    }).success).toBe(false)
    expect(showcaseSchema.safeParse({ ...tailwindImages, status: 'stable' }).success).toBe(false)
  })
})
