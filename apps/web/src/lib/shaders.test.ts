import { describe, expect, it } from 'vitest'
import { shaderFragmentSources } from './shaders'

describe('homepage convergence shader', () => {
  it('defines the convergence preset with the shared animation uniforms', () => {
    const source = shaderFragmentSources.convergence

    expect(source).toContain('uniform vec2 u_resolution')
    expect(source).toContain('uniform float u_time')
    expect(source).toContain('uniform vec2 u_pointer')
    expect(source).toContain('float stream(')
  })

  it('keeps the project visual presets available', () => {
    expect(Object.keys(shaderFragmentSources)).toEqual(expect.arrayContaining(['grid', 'marble', 'tunnel', 'orbit']))
  })
})
