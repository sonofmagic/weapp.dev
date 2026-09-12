import type { ProjectEntry } from './projects'

export const toolchainRoles = ['engineering', 'styling', 'components', 'data', 'migration'] as const
export type ToolchainRole = typeof toolchainRoles[number]

export const toolchainProjectIds = ['weapp-vite', 'weapp-tailwindcss', 'varo', 'weapp-sqlite', 'vite-plugin-taro'] as const

const roleById: Record<string, ToolchainRole> = {
  'weapp-vite': 'engineering',
  'weapp-tailwindcss': 'styling',
  'varo': 'components',
  'weapp-sqlite': 'data',
  'vite-plugin-taro': 'migration',
}

const declaredRoleById: Record<string, string> = {
  'weapp-vite': 'Engineering',
  'weapp-tailwindcss': 'Styling',
  'varo': 'Components',
  'weapp-sqlite': 'Local data',
  'vite-plugin-taro': 'Migration',
}

export function getToolchainProjects(projects: ProjectEntry[]) {
  return projects
    .filter(project => roleById[project.id])
    .sort((a, b) => toolchainRoles.indexOf(roleById[a.id]) - toolchainRoles.indexOf(roleById[b.id]))
    .map(project => ({ project, role: roleById[project.id] }))
}

/** Validate the catalog contract before any page turns it into navigation. */
export function validateToolchainCatalog(projects: ProjectEntry[]): void {
  const byId = new Map(projects.map(project => [project.id, project]))
  for (const id of toolchainProjectIds) {
    if (!byId.has(id)) {
      throw new Error(`Missing toolchain project: ${id}`)
    }
  }
  for (const project of projects) {
    for (const relatedId of project.data.relatedProjects ?? []) {
      if (!byId.has(relatedId)) {
        throw new Error(`Unknown related project ${relatedId} on ${project.id}`)
      }
    }
    if (project.data.status === 'planned' && project.data.dataCompleteness === 'complete') {
      throw new Error(`Planned project cannot claim complete data: ${project.id}`)
    }
    if (project.data.status === 'planned' && (project.data.npmUrl || project.data.installCommand)) {
      throw new Error(`Planned project cannot publish package actions: ${project.id}`)
    }
    if (project.data.status !== 'planned' && (!project.data.npmUrl || !project.data.installCommand)) {
      throw new Error(`Active project is missing package actions: ${project.id}`)
    }
    if (project.data.maturity && project.data.maturity !== project.data.status) {
      throw new Error(`Project status and maturity differ: ${project.id}`)
    }
    if (declaredRoleById[project.id] && project.data.role !== declaredRoleById[project.id]) {
      throw new Error(`Project role differs from toolchain role: ${project.id}`)
    }
  }
}
