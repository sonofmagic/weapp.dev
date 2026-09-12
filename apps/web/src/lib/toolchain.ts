import type { ProjectEntry } from './projects'

export const toolchainRoles = ['engineering', 'styling', 'components', 'data', 'migration'] as const
export type ToolchainRole = typeof toolchainRoles[number]

const roleById: Record<string, ToolchainRole> = {
  'weapp-vite': 'engineering',
  'weapp-tailwindcss': 'styling',
  'varo': 'components',
  'weapp-sqlite': 'data',
  'vite-plugin-taro': 'migration',
}

export function getToolchainProjects(projects: ProjectEntry[]) {
  return projects
    .filter(project => roleById[project.id])
    .sort((a, b) => toolchainRoles.indexOf(roleById[a.id]) - toolchainRoles.indexOf(roleById[b.id]))
    .map(project => ({ project, role: roleById[project.id] }))
}
