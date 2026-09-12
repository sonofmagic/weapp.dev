import { describe, expect, it } from 'vitest'
import { getToolchainProjects } from './toolchain'

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
})
