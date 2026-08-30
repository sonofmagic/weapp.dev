import type { ShaderPreset } from '../lib/shaders'
import { shaderFragmentSources, shaderVertexSource } from '../lib/shaders'

const mounted = new WeakSet<HTMLCanvasElement>()

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) {
    return null
  }
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function mount(canvas: HTMLCanvasElement) {
  if (mounted.has(canvas)) {
    return
  }
  mounted.add(canvas)

  const preset = canvas.dataset.shader as ShaderPreset
  const source = shaderFragmentSources[preset]
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'high-performance' })
  if (!gl || !source) {
    canvas.closest('[data-shader-frame]')?.setAttribute('data-webgl-fallback', '')
    return
  }

  const vertex = compile(gl, gl.VERTEX_SHADER, shaderVertexSource)
  const fragment = compile(gl, gl.FRAGMENT_SHADER, source)
  const program = gl.createProgram()
  if (!vertex || !fragment || !program) {
    canvas.closest('[data-shader-frame]')?.setAttribute('data-webgl-fallback', '')
    return
  }
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    canvas.closest('[data-shader-frame]')?.setAttribute('data-webgl-fallback', '')
    return
  }

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  gl.useProgram(program)
  const position = gl.getAttribLocation(program, 'a_position')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
  const resolution = gl.getUniformLocation(program, 'u_resolution')
  const time = gl.getUniformLocation(program, 'u_time')
  const pointer = gl.getUniformLocation(program, 'u_pointer')
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const scale = Number(canvas.dataset.shaderScale || 1)
  let visible = false
  let frame = 0
  let pointerX = 0
  let pointerY = 0

  const resize = () => {
    const mobile = window.matchMedia('(max-width: 700px)').matches
    const ratio = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.35) * scale
    const width = Math.max(1, Math.floor(canvas.clientWidth * ratio))
    const height = Math.max(1, Math.floor(canvas.clientHeight * ratio))
    if (canvas.width === width && canvas.height === height) {
      return
    }
    canvas.width = width
    canvas.height = height
    gl.viewport(0, 0, width, height)
  }

  const render = (stamp: number) => {
    if (!visible && !reduceMotion) {
      return
    }
    resize()
    gl.uniform2f(resolution, canvas.width, canvas.height)
    gl.uniform1f(time, reduceMotion ? 0 : stamp * 0.001)
    gl.uniform2f(pointer, pointerX * (canvas.width / Math.max(canvas.clientWidth, 1)), pointerY * (canvas.height / Math.max(canvas.clientHeight, 1)))
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    if (visible && !reduceMotion && document.visibilityState === 'visible') {
      frame = requestAnimationFrame(render)
    }
  }

  const start = () => {
    if (visible || reduceMotion) {
      return
    }
    visible = true
    frame = requestAnimationFrame(render)
  }
  const stop = () => {
    visible = false
    cancelAnimationFrame(frame)
  }

  canvas.addEventListener('pointermove', (event) => {
    const rect = canvas.getBoundingClientRect()
    pointerX = event.clientX - rect.left
    pointerY = rect.height - (event.clientY - rect.top)
  }, { passive: true })
  window.addEventListener('resize', resize, { passive: true })
  document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' ? start() : stop())
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting ? start() : stop()), { threshold: 0.01 })
    observer.observe(canvas)
  }
  else {
    start()
  }
  resize()
  if (reduceMotion) {
    visible = true
    render(0)
  }
}

export function mountShaderCanvases() {
  document.querySelectorAll<HTMLCanvasElement>('[data-shader-canvas]').forEach(mount)
}
