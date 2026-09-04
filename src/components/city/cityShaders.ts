import * as THREE from "three";

/** Locked nocturnal solarpunk / rave neon palette */
export const CITY_PALETTE = {
  void: new THREE.Color(0x07060b),
  magenta: new THREE.Color(0xff2a6d),
  cyan: new THREE.Color(0x00f0ff),
  violet: new THREE.Color(0xb14eff),
  gold: new THREE.Color(0xf5c542),
  chloro: new THREE.Color(0x3ddc97),
} as const;

const SKY_VERT = /* glsl */ `
varying vec3 vWorldPos;
varying vec3 vDir;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const SKY_FRAG = /* glsl */ `
uniform float uTime;
uniform float uCheap;
uniform vec3 uVoid;
uniform vec3 uMagenta;
uniform vec3 uCyan;
uniform vec3 uViolet;
uniform vec3 uGold;
varying vec3 vDir;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.05;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec3 d = normalize(vDir);
  float up = d.y * 0.5 + 0.5;
  float horizon = 1.0 - smoothstep(-0.05, 0.35, d.y);

  vec3 col = uVoid;

  // Soft nebula / haze wash
  float n = 0.0;
  if (uCheap < 0.5) {
    vec2 sp = d.xz * (1.2 / max(0.15, d.y + 0.55)) + uTime * 0.012;
    n = fbm(sp * 1.6);
    n += fbm(sp * 3.1 + 8.0) * 0.35;
  } else {
    n = 0.35 + 0.15 * sin(d.x * 3.0 + d.z * 2.0);
  }

  col += uViolet * (0.045 + n * 0.08) * (0.35 + up * 0.65);
  col += uMagenta * (0.03 + n * 0.055) * smoothstep(0.2, 0.95, up);
  col += uCyan * 0.035 * (1.0 - up) * (0.4 + n);

  // Distant soft city glow on horizon
  float glow = horizon * horizon;
  col += mix(uMagenta, uCyan, 0.45) * glow * 0.22;
  col += uGold * glow * 0.06;
  col += uViolet * pow(horizon, 1.5) * 0.12;

  // Very faint stars (high quality only)
  if (uCheap < 0.5) {
    float stars = step(0.997, hash(floor(d.xz * 220.0 + d.y * 40.0)));
    col += vec3(0.85, 0.9, 1.0) * stars * smoothstep(0.15, 0.7, up) * 0.55;
  }

  gl_FragColor = vec4(col, 1.0);
}
`;

export function createSkyDome(cheap: boolean): {
  mesh: THREE.Mesh;
  material: THREE.ShaderMaterial;
  update: (t: number) => void;
} {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uCheap: { value: cheap ? 1 : 0 },
      uVoid: { value: CITY_PALETTE.void.clone() },
      uMagenta: { value: CITY_PALETTE.magenta.clone() },
      uCyan: { value: CITY_PALETTE.cyan.clone() },
      uViolet: { value: CITY_PALETTE.violet.clone() },
      uGold: { value: CITY_PALETTE.gold.clone() },
    },
    vertexShader: SKY_VERT,
    fragmentShader: SKY_FRAG,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(90, cheap ? 16 : 32, cheap ? 12 : 24), material);
  mesh.renderOrder = -10;
  mesh.frustumCulled = false;
  return {
    mesh,
    material,
    update: (t: number) => {
      material.uniforms.uTime.value = t;
    },
  };
}

const BUILDING_VERT = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vWorldPos;
void main() {
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vView = cameraPosition - wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const BUILDING_FRAG = /* glsl */ `
uniform vec3 uBase;
uniform vec3 uAccent;
uniform float uTime;
uniform float uEmissiveBoost;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vWorldPos;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vView);
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.4);

  // Window grid in UV space
  vec2 grid = vUv * vec2(6.0, 10.0);
  vec2 cell = fract(grid);
  float win = step(0.18, cell.x) * step(cell.x, 0.82) * step(0.22, cell.y) * step(cell.y, 0.78);
  float frame = 1.0 - win;

  // Lit / dark window pattern
  float flicker = 0.85 + 0.15 * sin(uTime * 1.7 + floor(grid.x) * 1.3 + floor(grid.y) * 2.1);
  float lit = step(0.28, fract(sin(dot(floor(grid), vec2(12.9898, 78.233))) * 43758.5453));
  lit *= flicker;

  vec3 baseCol = uBase * (0.55 + 0.2 * (1.0 - fresnel));
  vec3 glass = mix(uBase * 0.35, uAccent * 0.15, 0.55);
  glass += uAccent * lit * win * (0.55 + uEmissiveBoost * 0.35);

  vec3 col = mix(baseCol, glass, win * 0.92);
  col += uAccent * frame * 0.04;

  // Soft edge / fresnel glow (glass-ish)
  col += uAccent * fresnel * 0.45;
  col += uAccent * pow(fresnel, 3.0) * 0.25;

  // Subtle vertical wash
  float heightWash = smoothstep(0.0, 1.0, vUv.y);
  col += uAccent * heightWash * 0.04;

  gl_FragColor = vec4(col, 1.0);
}
`;

export function createBuildingMaterial(baseColor: number, accent: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uBase: { value: new THREE.Color(baseColor) },
      uAccent: { value: new THREE.Color(accent) },
      uTime: { value: 0 },
      uEmissiveBoost: { value: 1 },
    },
    vertexShader: BUILDING_VERT,
    fragmentShader: BUILDING_FRAG,
  });
}

/** Mild vignette + tiny grain as a ShaderPass-compatible definition */
export const VignetteGrainShader = {
  name: "VignetteGrainShader",
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uIntensity: { value: 0.35 },
    uGrain: { value: 0.08 },
    uTime: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uIntensity;
    uniform float uGrain;
    uniform float uTime;
    varying vec2 vUv;
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      float d = distance(vUv, vec2(0.5));
      float vig = smoothstep(0.35, 0.95, d) * uIntensity;
      c.rgb *= 1.0 - vig;
      float g = (hash(vUv * vec2(1200.0, 900.0) + uTime) - 0.5) * uGrain;
      c.rgb += g;
      gl_FragColor = c;
    }
  `,
};
