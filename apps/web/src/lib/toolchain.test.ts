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
    expect(() => validateToolchainCatalog(projects.slice(0, 4))).toThrow('Missing toolchain project')
    const invalid = structuredClone(projects) as ProjectEntry[]
    invalid[0].data.relatedProjects = ['missing-project']
    expect(() => validateToolchainCatalog(invalid)).toThrow('Unknown related project')
  })

  it('rejects a planned project marked as complete', () => {
    const projects = [vite, tailwind, varo, sqlite, taro].map((data, index) => ({
      id: ['weapp-vite', 'weapp-tailwindcss', 'varo', 'weapp-sqlite', 'vite-plugin-taro'][index],
      data: projectDefinitionSchema.parse(data),
    })) as unknown as ProjectEntry[]
    projects[2].data.dataCompleteness = 'complete'
    expect(() => validateToolchainCatalog(projects)).toThrow('Planned project cannot claim complete data')
  })
})
