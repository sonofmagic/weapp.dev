export type ShaderPreset = 'grid' | 'marble' | 'tunnel' | 'orbit'

export const shaderVertexSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const common = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pointer;
`

export const shaderFragmentSources: Record<ShaderPreset, string> = {
  grid: `${common}
void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;
  float t = u_time * 0.12;
  vec2 q = p + vec2(t * 0.24, -t * 0.16);
  vec2 gridCell = abs(fract(q * 7.0) - 0.5);
  float line = 1.0 - smoothstep(0.46, 0.5, min(gridCell.x, gridCell.y));
  float pulse = 0.5 + 0.5 * sin(p.x * 8.0 + t * 2.0 + sin(p.y * 4.0));
  vec2 pointer = (u_pointer - 0.5 * u_resolution) / u_resolution.y;
  float signal = exp(-18.0 * distance(p, pointer));
  vec3 base = vec3(0.015, 0.04, 0.03);
  vec3 accent = vec3(0.41, 0.78, 0.65);
  vec3 color = base + accent * (line * 0.18 + pulse * 0.03 + signal * 0.68);
  gl_FragColor = vec4(color, 1.0);
}
`,
  marble: `${common}
void main() {
  vec2 p = (2.0 * gl_FragCoord.xy - u_resolution) / min(u_resolution.x, u_resolution.y);
  float t = u_time * 0.32;
  for (float i = 1.0; i < 9.0; i += 1.0) {
    p.x += 0.42 / i * cos(i * 2.4 * p.y + t);
    p.y += 0.42 / i * cos(i * 1.6 * p.x - t * 0.8);
  }
  float bands = 0.035 / max(abs(sin(t - p.y - p.x)), 0.02);
  float vignette = 1.0 - smoothstep(0.35, 1.45, length(p) * 0.54);
  vec3 color = vec3(0.02, 0.08, 0.06) + vec3(0.32, 0.72, 0.54) * bands * vignette;
  gl_FragColor = vec4(min(color, vec3(0.82)), 1.0);
}
`,
  tunnel: `${common}
void main() {
  vec2 p = (2.0 * gl_FragCoord.xy - u_resolution) / min(u_resolution.x, u_resolution.y);
  float t = u_time * 0.18;
  float radius = length(p);
  float angle = atan(p.y, p.x);
  float rings = 1.0 - smoothstep(0.02, 0.08, abs(fract(radius * 6.0 - t) - 0.5));
  float spokes = 1.0 - smoothstep(0.02, 0.07, abs(fract(angle / 6.28318 * 12.0 + radius * 1.5 + t) - 0.5));
  float depth = exp(-2.8 * radius) * (0.45 + 0.55 * sin(t * 2.0 + radius * 10.0));
  vec3 color = vec3(0.02, 0.06, 0.045) + vec3(0.25, 0.72, 0.54) * (rings * 0.22 + spokes * 0.12 + depth * 0.05);
  gl_FragColor = vec4(color, 1.0);
}
`,
  orbit: `${common}
float segment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}
void main() {
  vec2 p = (2.0 * gl_FragCoord.xy - u_resolution) / min(u_resolution.x, u_resolution.y);
  float t = u_time * 0.26;
  vec2 a = vec2(cos(t) * 0.72, sin(t * 1.3) * 0.32);
  vec2 b = vec2(cos(t + 2.1) * 0.62, sin(t * 0.8 + 1.2) * 0.5);
  vec2 c = vec2(cos(t + 4.2) * 0.7, sin(t * 1.1 + 2.6) * 0.34);
  float d = min(segment(p, a, b), min(segment(p, b, c), segment(p, c, a)));
  float line = 0.012 / max(d, 0.004);
  float ring = 0.008 / max(abs(length(p) - 0.54), 0.004);
  vec3 color = vec3(0.01, 0.035, 0.026) + vec3(0.42, 0.88, 0.66) * min(line + ring * 0.35, 1.0);
  gl_FragColor = vec4(color, 1.0);
}
`,
}
