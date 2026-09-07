import type { Locale, ProjectDefinition, ProjectVisual } from '../types/project'

export interface HomeProjectPlacement {
  id: string
  layout: 'phone' | 'phone-pair' | 'component'
  reversed: boolean
  stage: Record<Locale, string>
}

export interface HomeProject extends HomeProjectPlacement {
  data: ProjectDefinition
  showcase: ProjectVisual[]
}

interface CatalogProject {
  id: string
  data: ProjectDefinition
}

interface ShowcaseEntry {
  id: string
  data: { images: ProjectVisual[] }
}

export function assembleHomeProjects(
  projects: CatalogProject[],
  showcases: ShowcaseEntry[],
  placements: HomeProjectPlacement[],
): HomeProject[] {
  const catalog = new Map(projects.map(project => [project.id, project.data]))
  const images = new Map(showcases.map(showcase => [showcase.id, showcase.data.images]))
  for (const showcase of showcases) {
    if (!catalog.has(showcase.id)) {
      throw new Error(`Showcase references unknown project: ${showcase.id}`)
    }
  }
  const used = new Set<string>()
  return placements.map((placement) => {
    if (used.has(placement.id)) {
      throw new Error(`Duplicate home project: ${placement.id}`)
    }
    used.add(placement.id)
    const data = catalog.get(placement.id)
    const showcase = images.get(placement.id)
    if (!data || !showcase?.length) {
      throw new Error(`Home project requires project data and showcase images: ${placement.id}`)
    }
    return { ...placement, data, showcase }
  })
}
