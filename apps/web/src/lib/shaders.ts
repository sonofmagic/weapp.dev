export type ShaderPreset = 'convergence' | 'grid' | 'marble' | 'tunnel' | 'orbit'

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
  convergence: `${common}
vec2 curvePoint(vec2 a, vec2 control, vec2 b, float t) {
  vec2 ab = mix(a, control, t);
  vec2 bc = mix(control, b, t);
  return mix(ab, bc, t);
}

float segmentDistance(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 0.0001), 0.0, 1.0);
  return length(pa - ba * h);
}

float stream(vec2 p, vec2 start, vec2 control, vec2 end, float phase) {
  float distanceToPath = 1.0;
  float pulse = 0.0;
  for (int i = 0; i < 8; i += 1) {
    float t0 = float(i) / 8.0;
    float t1 = float(i + 1) / 8.0;
    vec2 a = curvePoint(start, control, end, t0);
    vec2 b = curvePoint(start, control, end, t1);
    float segment = segmentDistance(p, a, b);
    distanceToPath = min(distanceToPath, segment);
    float head = fract(u_time * 0.075 + phase + t0);
    pulse = max(pulse, exp(-130.0 * abs(head - 0.5)) * smoothstep(0.08, 0.0, segment));
  }
  float ribbon = smoothstep(0.055, 0.004, distanceToPath);
  return ribbon * (0.62 + pulse * 1.2);
}

void main() {
  vec2 p = (2.0 * gl_FragCoord.xy - u_resolution) / u_resolution.y;
  vec2 pointer = (u_pointer - 0.5 * u_resolution) / u_resolution.y;
  vec2 center = clamp(pointer * 0.08, vec2(-0.085), vec2(0.085));
  float t = u_time * 0.16;

  float style = stream(p, vec2(-1.28, -0.58), vec2(-0.42, -0.18) + center, center, 0.02);
  style += stream(p, center, vec2(0.46, 0.22) + center, vec2(1.35, 0.68), 0.37);
  float build = stream(p, vec2(-0.08, 1.28), vec2(0.02, 0.52) + center, center, 0.24);
  build += stream(p, center, vec2(-0.22, -0.42) + center, vec2(-0.88, -1.28), 0.59);
  float compose = stream(p, vec2(1.3, -0.48), vec2(0.48, -0.14) + center, center, 0.46);
  compose += stream(p, center, vec2(0.4, -0.08) + center, vec2(1.28, -1.22), 0.76);

  float radius = length(p - center);
  float wave = exp(-42.0 * abs(radius - fract(t * 0.22) * 0.72)) * smoothstep(0.8, 0.02, radius);
  float nucleus = exp(-20.0 * radius);
  vec3 base = vec3(0.008, 0.022, 0.018);
  vec3 styleColor = vec3(0.28, 0.92, 0.58);
  vec3 buildColor = vec3(0.38, 0.82, 0.72);
  vec3 composeColor = vec3(0.56, 0.94, 0.78);
  vec3 color = base + styleColor * style * 0.42 + buildColor * build * 0.42 + composeColor * compose * 0.42;
  color += vec3(0.72, 1.0, 0.86) * (nucleus * 0.6 + wave * 0.16);
  float vignette = 1.0 - smoothstep(0.55, 1.55, length(p) * 0.72);
  gl_FragColor = vec4(color * vignette, 1.0);
}
`,
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
