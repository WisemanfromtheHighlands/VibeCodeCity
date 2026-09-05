import * as THREE from "three";
import type { CityQuality, PortalDef } from "./cityTypes";
import { PORTALS, FILLER } from "./cityTypes";
import { createBuildingMaterial, createSkyDome } from "./cityShaders";

export type CityWorld = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  magenta: THREE.PointLight;
  cyan: THREE.PointLight;
  gold: THREE.PointLight;
  portalMeshes: THREE.Mesh[];
  labelAnchors: { portal: PortalDef; obj: THREE.Object3D }[];
  buildingMaterials: THREE.ShaderMaterial[];
  skyUpdate: (t: number) => void;
  quality: CityQuality;
};

export function buildCityWorld(el: HTMLElement, quality: CityQuality = "high"): CityWorld {
  const cheap = quality === "low";
  const w0 = el.clientWidth || 800;
  const h0 = el.clientHeight || 500;

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(62, w0 / h0, 0.1, 140);
  camera.position.set(0, 1.7, 8);

  const renderer = new THREE.WebGLRenderer({
    antialias: !cheap,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cheap ? 1.25 : 1.75));
  renderer.setSize(w0, h0, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = cheap ? 1.05 : 1.12;
  el.appendChild(renderer.domElement);
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.touchAction = "none";
  renderer.domElement.tabIndex = 0;

  const sky = createSkyDome(cheap);
  scene.add(sky.mesh);

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
    new THREE.PlaneGeometry(80, 80, cheap ? 1 : 40, cheap ? 1 : 40),
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
    new THREE.RingGeometry(4.2, 5.1, cheap ? 32 : 64),
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

  const portalMeshes: THREE.Mesh[] = [];
  const labelAnchors: { portal: PortalDef; obj: THREE.Object3D }[] = [];
  const buildingMaterials: THREE.ShaderMaterial[] = [];

  const makeBuilding = (
    position: [number, number, number],
    size: [number, number, number],
    baseColor: number,
    accent: number,
    portal?: PortalDef,
  ) => {
    const group = new THREE.Group();
    const bodyMat = createBuildingMaterial(baseColor, accent);
    buildingMaterials.push(bodyMat);
    const body = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), bodyMat);
    body.position.y = size[1] / 2;
    group.add(body);

    // Slim emissive roof edge — keeps silhouette readable without heavy geo
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(size[0] * 1.05, 0.12, size[2] * 1.05),
      new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 1.6 }),
    );
    roof.position.y = size[1] + 0.08;
    group.add(roof);

    // Optional mid glow band (skip on low for fewer draw calls)
    if (!cheap) {
      const band = new THREE.Mesh(
        new THREE.BoxGeometry(size[0] * 0.94, Math.max(0.14, size[1] * 0.05), size[2] * 1.02),
        new THREE.MeshStandardMaterial({
          color: accent,
          emissive: accent,
          emissiveIntensity: 1.1,
          metalness: 0.7,
          roughness: 0.2,
        }),
      );
      band.position.y = size[1] * 0.55;
      group.add(band);
    }

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

  return {
    scene,
    camera,
    renderer,
    magenta,
    cyan,
    gold,
    portalMeshes,
    labelAnchors,
    buildingMaterials,
    skyUpdate: sky.update,
    quality,
  };
}
