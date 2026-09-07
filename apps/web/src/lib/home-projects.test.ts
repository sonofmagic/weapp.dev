import { describe, expect, it } from 'vitest'
import { homeProjectPlacements } from '../content/home-projects'
import varo from '../content/projects/varo.json'
import tailwind from '../content/projects/weapp-tailwindcss.json'
import vite from '../content/projects/weapp-vite.json'
import { projectDefinitionSchema, showcaseSchema } from '../content/schemas'
import tailwindImages from '../content/showcases/weapp-tailwindcss.json'
import { assembleHomeProjects } from './home-projects'

const projects = [
  { id: 'weapp-tailwindcss', data: projectDefinitionSchema.parse(tailwind) },
  { id: 'weapp-vite', data: projectDefinitionSchema.parse(vite) },
  { id: 'varo', data: projectDefinitionSchema.parse(varo) },
]

describe('home project composition', () => {
  it('keeps editorial order when the catalog is reordered or extended', () => {
    const extended = [...projects].reverse().concat({ id: 'new-project', data: projects[0].data })
    const result = assembleHomeProjects(extended, homeProjectPlacements)
    expect(result.map(project => project.id)).toEqual(['weapp-tailwindcss', 'weapp-vite', 'varo'])
    expect(result.map(project => project.demo)).toEqual(['style', 'build', 'registry'])
  })

  it('combines independent metadata and demo placements without requiring screenshots', () => {
    const changedProjects = structuredClone(projects)
    changedProjects[0].data.docsUrl = 'https://example.com/new-docs/'
    changedProjects[0].data.status = 'beta'
    const changedPlacements = structuredClone(homeProjectPlacements)
    changedPlacements[0].reversed = true
    const result = assembleHomeProjects(changedProjects, changedPlacements)
    expect(result[0].data.docsUrl).toBe('https://example.com/new-docs/')
    expect(result[0].data.status).toBe('beta')
    expect(result[0].reversed).toBe(true)
    expect(result[0]).not.toHaveProperty('showcase')
    expect(changedProjects[0].data.visuals).not.toHaveProperty('showcase')
    expect(projects[0].data.status).toBe('stable')
  })

  it('rejects stale references and duplicate placements before rendering', () => {
    expect(() => assembleHomeProjects(projects, [...homeProjectPlacements, homeProjectPlacements[0]]))
      .toThrow('Duplicate home project')
    expect(() => assembleHomeProjects(projects.slice(1), homeProjectPlacements))
      .toThrow('unknown project')
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
