import * as THREE from "three";
import type { PortalDef } from "./cityTypes";
import { PORTALS, FILLER } from "./cityTypes";

export type CityWorld = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  magenta: THREE.PointLight;
  cyan: THREE.PointLight;
  gold: THREE.PointLight;
  portalMeshes: THREE.Mesh[];
  labelAnchors: { portal: PortalDef; obj: THREE.Object3D }[];
};

export function buildCityWorld(el: HTMLElement): CityWorld {
  const w0 = el.clientWidth || 800;
  const h0 = el.clientHeight || 500;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x07060b);
  scene.fog = new THREE.FogExp2(0x07060b, 0.028);

  const camera = new THREE.PerspectiveCamera(62, w0 / h0, 0.1, 120);
  camera.position.set(0, 1.7, 8);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(w0, h0, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  el.appendChild(renderer.domElement);
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.touchAction = "none";
  renderer.domElement.tabIndex = 0;

  scene.add(new THREE.AmbientLight(0x1a1528, 0.55));
  scene.add(new THREE.HemisphereLight(0x3a2060, 0x0a1810, 0.55));

  const magenta = new THREE.PointLight(0xff2a6d, 28, 42, 2);
  magenta.position.set(-6, 8, 2);
  scene.add(magenta);
  const cyan = new THREE.PointLight(0x00f0ff, 24, 40, 2);
  cyan.position.set(7, 7, 1);
  scene.add(cyan);
  const gold = new THREE.PointLight(0xf5c542, 16, 32, 2);
  gold.position.set(2, 5, 6);
  scene.add(gold);
  const chloro = new THREE.PointLight(0x3ddc97, 12, 28, 2);
  chloro.position.set(-2, 4, -2);
  scene.add(chloro);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80, 40, 40),
    new THREE.MeshStandardMaterial({
      color: 0x0c0a12,
      metalness: 0.55,
      roughness: 0.35,
      emissive: 0x12081a,
      emissiveIntensity: 0.25,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(4.2, 5.1, 64),
    new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.85,
      metalness: 0.8,
      roughness: 0.2,
      side: THREE.DoubleSide,
    }),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.02;
  scene.add(ring);

  const grid = new THREE.GridHelper(60, 40, 0xb14eff, 0x1a1228);
  (grid.material as THREE.Material).opacity = 0.22;
  (grid.material as THREE.Material).transparent = true;
  scene.add(grid);

  const pillarGeo = new THREE.CylinderGeometry(0.08, 0.12, 6, 8);
  [-5, -1.5, 1.5, 5].forEach((x, i) => {
    const colors = [0xff2a6d, 0xb14eff, 0x00f0ff, 0x3ddc97];
    const mat = new THREE.MeshStandardMaterial({
      color: colors[i],
      emissive: colors[i],
      emissiveIntensity: 1.4,
      transparent: true,
      opacity: 0.55,
    });
    const p = new THREE.Mesh(pillarGeo, mat);
    p.position.set(x, 3, 3.5);
    scene.add(p);
  });

  const haze = new THREE.Mesh(
    new THREE.PlaneGeometry(90, 40),
    new THREE.MeshBasicMaterial({ color: 0x1a0530, transparent: true, opacity: 0.35, depthWrite: false }),
  );
  haze.position.set(0, 12, -28);
  scene.add(haze);

  const portalMeshes: THREE.Mesh[] = [];
  const labelAnchors: { portal: PortalDef; obj: THREE.Object3D }[] = [];

  const makeBuilding = (
    position: [number, number, number],
    size: [number, number, number],
    baseColor: number,
    accent: number,
    portal?: PortalDef,
  ) => {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(size[0], size[1], size[2]),
      new THREE.MeshStandardMaterial({
        color: baseColor,
        metalness: 0.35,
        roughness: 0.45,
        emissive: accent,
        emissiveIntensity: 0.12,
      }),
    );
    body.position.y = size[1] / 2;
    group.add(body);

    const bands = Math.max(2, Math.floor(size[1] / 1.4));
    const bandH = Math.max(0.18, size[1] * 0.06);
    for (let i = 0; i < bands; i++) {
      const band = new THREE.Mesh(
        new THREE.BoxGeometry(size[0] * 0.92, bandH, size[2] * 1.02),
        new THREE.MeshStandardMaterial({
          color: accent,
          emissive: accent,
          emissiveIntensity: 0.9 + (i % 2) * 0.35,
          metalness: 0.7,
          roughness: 0.2,
        }),
      );
      band.position.y = 0.7 + i * (size[1] / bands);
      group.add(band);
    }

    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(size[0] * 1.05, 0.12, size[2] * 1.05),
      new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 1.6 }),
    );
    roof.position.y = size[1] + 0.08;
    group.add(roof);

    group.position.set(position[0], 0, position[2]);
    scene.add(group);

    if (portal) {
      body.userData.portal = portal;
      portalMeshes.push(body);
      const anchor = new THREE.Object3D();
      anchor.position.set(0, size[1] + 1.2, 0);
      group.add(anchor);
      labelAnchors.push({ portal, obj: anchor });
    }
  };

  PORTALS.forEach((p) => makeBuilding(p.position, p.size, p.color, p.accent, p));
  FILLER.forEach((f) => makeBuilding(f.position, f.size, 0x0a0810, f.accent));

  [
    { x: -2.2, z: 1.5, c: 0xff2a6d },
    { x: 2.2, z: 1.2, c: 0x00f0ff },
  ].forEach((k) => {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.9, 0.9),
      new THREE.MeshStandardMaterial({ color: 0x101018, emissive: k.c, emissiveIntensity: 0.7 }),
    );
    m.position.set(k.x, 0.45, k.z);
    scene.add(m);
  });

  return { scene, camera, renderer, magenta, cyan, gold, portalMeshes, labelAnchors };
}
