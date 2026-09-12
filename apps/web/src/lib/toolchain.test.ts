import type { ProjectEntry } from './projects'
import { describe, expect, it } from 'vitest'
import varo from '../content/projects/varo.json'
import taro from '../content/projects/vite-plugin-taro.json'
import sqlite from '../content/projects/weapp-sqlite.json'
import tailwind from '../content/projects/weapp-tailwindcss.json'
import vite from '../content/projects/weapp-vite.json'
import { projectDefinitionSchema } from '../content/schemas'
import { getToolchainProjects, validateToolchainCatalog } from './toolchain'

describe('toolchain project ordering', () => {
  it('keeps the five product roles in build-flow order', () => {
    const projects = ['vite-plugin-taro', 'varo', 'weapp-sqlite', 'weapp-vite', 'weapp-tailwindcss'].map(id => ({ id, data: {} })) as never
    expect(getToolchainProjects(projects).map(item => item.project.id)).toEqual([
      'weapp-vite',
      'weapp-tailwindcss',
      'varo',
      'weapp-sqlite',
      'vite-plugin-taro',
    ])
  })

  it('validates the five project catalog and related references', () => {
    const projects = [vite, tailwind, varo, sqlite, taro].map((data, index) => ({
      id: ['weapp-vite', 'weapp-tailwindcss', 'varo', 'weapp-sqlite', 'vite-plugin-taro'][index],
      data: projectDefinitionSchema.parse(data),
    })) as unknown as ProjectEntry[]
    expect(() => validateToolchainCatalog(projects)).not.toThrow()
    const invalidOrder = structuredClone(projects) as ProjectEntry[]
    invalidOrder[0].data.order = 2
    expect(() => validateToolchainCatalog(invalidOrder)).toThrow('Project order differs from toolchain flow')
    const duplicateOrder = structuredClone(projects) as ProjectEntry[]
    duplicateOrder[1].data.order = duplicateOrder[0].data.order
    expect(() => validateToolchainCatalog(duplicateOrder)).toThrow('Duplicate toolchain project order')
    expect(() => validateToolchainCatalog(projects.slice(0, 4))).toThrow('Missing toolchain project')
    const invalid = structuredClone(projects) as ProjectEntry[]
    invalid[0].data.relatedProjects = ['missing-project']
    expect(() => validateToolchainCatalog(invalid)).toThrow('Unknown related project')
    const selfRelated = structuredClone(projects) as ProjectEntry[]
    selfRelated[0].data.relatedProjects = ['weapp-vite']
    expect(() => validateToolchainCatalog(selfRelated)).toThrow('Project cannot relate to itself')
    const outsideToolchain = structuredClone(projects) as ProjectEntry[]
    outsideToolchain.push({ id: 'other-project', collection: 'projects', data: { ...outsideToolchain[0].data, relatedProjects: [] } })
    outsideToolchain[0].data.relatedProjects = ['other-project']
    expect(() => validateToolchainCatalog(outsideToolchain)).toThrow('Related project is outside the toolchain')
  })

  it('rejects a planned project marked as complete', () => {
    const projects = [vite, tailwind, varo, sqlite, taro].map((data, index) => ({
      id: ['weapp-vite', 'weapp-tailwindcss', 'varo', 'weapp-sqlite', 'vite-plugin-taro'][index],
      data: projectDefinitionSchema.parse(data),
    })) as unknown as ProjectEntry[]
    projects[2].data.dataCompleteness = 'complete'
    expect(() => validateToolchainCatalog(projects)).toThrow('Planned project cannot claim complete data')
  })

  it('rejects package actions that contradict project status', () => {
    const projects = [vite, tailwind, varo, sqlite, taro].map((data, index) => ({
      id: ['weapp-vite', 'weapp-tailwindcss', 'varo', 'weapp-sqlite', 'vite-plugin-taro'][index],
      data: projectDefinitionSchema.parse(data),
    })) as unknown as ProjectEntry[]
    projects[2].data.installCommand = 'pnpm dlx @varo/cli'
    expect(() => validateToolchainCatalog(projects)).toThrow('Planned project cannot publish package actions')
    projects[2].data.installCommand = undefined
    projects[0].data.npmUrl = undefined
    expect(() => validateToolchainCatalog(projects)).toThrow('Active project is missing package actions')
  })

  it('rejects status and maturity drift', () => {
    const projects = [vite, tailwind, varo, sqlite, taro].map((data, index) => ({
      id: ['weapp-vite', 'weapp-tailwindcss', 'varo', 'weapp-sqlite', 'vite-plugin-taro'][index],
      data: projectDefinitionSchema.parse(data),
    })) as unknown as ProjectEntry[]
    projects[0].data.maturity = 'beta'
    expect(() => validateToolchainCatalog(projects)).toThrow('Project status and maturity differ')
  })

  it('rejects a declared role that differs from the flow role', () => {
    const projects = [vite, tailwind, varo, sqlite, taro].map((data, index) => ({
      id: ['weapp-vite', 'weapp-tailwindcss', 'varo', 'weapp-sqlite', 'vite-plugin-taro'][index],
      data: projectDefinitionSchema.parse(data),
    })) as unknown as ProjectEntry[]
    projects[0].data.role = 'Styling'
    expect(() => validateToolchainCatalog(projects)).toThrow('Project role differs from toolchain role')
  })

  it('keeps project roles within the documented toolchain vocabulary', () => {
    expect(() => projectDefinitionSchema.parse({ ...vite, role: 'Documentation' })).toThrow()
  })
})
