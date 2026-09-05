import * as THREE from "three";
import type { CityMode, CityQuality, CitySceneApi, CitySceneHooks, LabelState, PortalDef } from "./cityTypes";
import { CITY_QUALITY_KEY, resolveCityQuality } from "./cityTypes";
import { buildCityWorld } from "./cityWorld";

export type { CityMode, LabelState, CitySceneApi, CityQuality } from "./cityTypes";

export function createCityScene(hooks: CitySceneHooks): { api: CitySceneApi; dispose: () => void } {
  const el = hooks.getMount();
  if (!el) {
    return {
      api: {
        enterFps: () => {},
        enterOrbit: () => {},
        navigateHot: () => {},
        setQuality: () => {},
        getQuality: () => "high",
      },
      dispose: () => {},
    };
  }

  const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let quality: CityQuality = resolveCityQuality();
  let disposed = false;
  let raf = 0;
  let pageVisible = document.visibilityState !== "hidden";
  let modeLocal: CityMode = prefersReduce ? "orbit" : "idle";
  let pointerLocked = false;

  let world = buildCityWorld(el, quality);
  let { scene, camera, renderer, magenta, cyan, gold, portalMeshes, labelAnchors, buildingMaterials, skyUpdate } =
    world;

  const keys: Record<string, boolean> = {};
  const euler = new THREE.Euler(0, 0, 0, "YXZ");
  euler.setFromQuaternion(camera.quaternion);
  const velocity = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();
  const center = new THREE.Vector2(0, 0);
  let hotPortal: PortalDef | null = null;
  let orbitAz = 0.35;
  let orbitEl = 0.28;
  let orbitR = prefersReduce ? 14 : 12;
  const orbitTarget = new THREE.Vector3(0, 2.2, -6);

  hooks.setQuality?.(quality);

  const clampPlayer = () => {
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -16, 16);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -16, 14);
    camera.position.y = 1.7;
  };

  const applyOrbit = () => {
    const x = orbitTarget.x + orbitR * Math.sin(orbitAz) * Math.cos(orbitEl);
    const y = orbitTarget.y + orbitR * Math.sin(orbitEl);
    const z = orbitTarget.z + orbitR * Math.cos(orbitAz) * Math.cos(orbitEl);
    camera.position.set(x, y, z);
    camera.lookAt(orbitTarget);
  };

  const setModeLocal = (m: CityMode) => {
    modeLocal = m;
    hooks.setMode(m);
    if (m === "fps") hooks.setHint("WASD move · look with mouse · Esc release · click portal to enter");
    else if (m === "orbit") hooks.setHint("Drag to orbit · scroll zoom · click a label to enter");
    else hooks.setHint("Look around");
  };

  const tryPointerLock = () => {
    if (!renderer.domElement.requestPointerLock) {
      setModeLocal("orbit");
      return;
    }
    renderer.domElement.requestPointerLock();
  };

  const enterFps = () => {
    if (prefersReduce) {
      setModeLocal("orbit");
      applyOrbit();
      return;
    }
    setModeLocal("fps");
    camera.position.set(0, 1.7, 8);
    euler.set(0, 0, 0);
    camera.quaternion.setFromEuler(euler);
    tryPointerLock();
  };

  const enterOrbit = () => {
    if (document.pointerLockElement) document.exitPointerLock();
    setModeLocal("orbit");
    applyOrbit();
  };

  const navigateHot = () => {
    if (hotPortal) hooks.onNavigate(hotPortal.href);
  };

  const tearDownWorld = () => {
    if (document.pointerLockElement === renderer.domElement) document.exitPointerLock();
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry?.dispose();
        const m = obj.material;
        if (Array.isArray(m)) m.forEach((x) => x.dispose());
        else m?.dispose();
      }
    });
    renderer.dispose();
    if (renderer.domElement.parentElement === el) el.removeChild(renderer.domElement);
  };

  const setQuality = (q: CityQuality) => {
    if (q === quality) return;
    const prevMode = modeLocal;
    const camPos = camera.position.clone();
    const camQuat = camera.quaternion.clone();
    quality = q;
    try {
      localStorage.setItem(CITY_QUALITY_KEY, q);
    } catch {
      /* ignore */
    }
    hooks.setQuality?.(q);
    tearDownWorld();
    world = buildCityWorld(el, quality);
    ({ scene, camera, renderer, magenta, cyan, gold, portalMeshes, labelAnchors, buildingMaterials, skyUpdate } =
      world);
    camera.position.copy(camPos);
    camera.quaternion.copy(camQuat);
    euler.setFromQuaternion(camera.quaternion);
    bindCanvasEvents();
    if (prevMode === "orbit") applyOrbit();
    else if (prevMode === "fps") setModeLocal("fps");
    else setModeLocal(prevMode);
  };

  const getQuality = () => quality;

  const api: CitySceneApi = { enterFps, enterOrbit, navigateHot, setQuality, getQuality };

  const onLockChange = () => {
    pointerLocked = document.pointerLockElement === renderer.domElement;
    hooks.setLocked(pointerLocked);
    if (!pointerLocked && modeLocal === "fps") {
      hooks.setHint("Click canvas to look · WASD move · Esc releases look");
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    if (modeLocal === "fps" && pointerLocked) {
      const sens = 0.0022;
      euler.y -= e.movementX * sens;
      euler.x -= e.movementY * sens;
      euler.x = Math.max(-Math.PI / 2.4, Math.min(Math.PI / 2.4, euler.x));
      camera.quaternion.setFromEuler(euler);
    }
  };

  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  const onPointerDown = (e: PointerEvent) => {
    if (modeLocal === "orbit") {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    } else if (modeLocal === "fps" && !pointerLocked) tryPointerLock();
    else if (modeLocal === "idle") enterFps();
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!dragging || modeLocal !== "orbit") return;
    orbitAz -= (e.clientX - lastX) * 0.005;
    orbitEl = THREE.MathUtils.clamp(orbitEl + (e.clientY - lastY) * 0.004, 0.08, 1.2);
    lastX = e.clientX;
    lastY = e.clientY;
  };

  const onPointerUp = () => {
    dragging = false;
  };

  const onWheel = (e: WheelEvent) => {
    if (modeLocal !== "orbit") return;
    e.preventDefault();
    orbitR = THREE.MathUtils.clamp(orbitR + e.deltaY * 0.01, 6, 28);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    keys[e.code] = true;
    if (e.code === "Escape" && document.pointerLockElement) document.exitPointerLock();
    if (e.code === "Enter" && hotPortal) hooks.onNavigate(hotPortal.href);
  };
  const onKeyUp = (e: KeyboardEvent) => {
    keys[e.code] = false;
  };

  const onClick = () => {
    if (modeLocal === "fps" && hotPortal) hooks.onNavigate(hotPortal.href);
  };

  const bindCanvasEvents = () => {
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    renderer.domElement.addEventListener("click", onClick);
  };

  const unbindCanvasEvents = () => {
    renderer.domElement.removeEventListener("pointerdown", onPointerDown);
    renderer.domElement.removeEventListener("pointermove", onPointerMove);
    renderer.domElement.removeEventListener("pointerup", onPointerUp);
    renderer.domElement.removeEventListener("wheel", onWheel);
    renderer.domElement.removeEventListener("click", onClick);
  };

  document.addEventListener("pointerlockchange", onLockChange);
  document.addEventListener("mousemove", onMouseMove);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  bindCanvasEvents();

  const onVisibility = () => {
    pageVisible = document.visibilityState !== "hidden";
    if (pageVisible && !disposed && !raf) {
      clock.start();
      animate();
    }
  };
  document.addEventListener("visibilitychange", onVisibility);

  if (prefersReduce) {
    setModeLocal("orbit");
    applyOrbit();
  }

  const clock = new THREE.Clock();
  const tmp = new THREE.Vector3();
  let labelTick = 0;

  const animate = () => {
    if (disposed) return;
    if (!pageVisible) {
      raf = 0;
      return;
    }
    raf = requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    skyUpdate(t);
    for (const mat of buildingMaterials) {
      mat.uniforms.uTime.value = t;
    }

    magenta.intensity = 24 + Math.sin(t * 0.7) * 4;
    cyan.intensity = 20 + Math.sin(t * 0.9 + 1) * 4;
    gold.intensity = 14 + Math.sin(t * 1.1 + 2) * 3;

    if (modeLocal === "fps") {
      direction.set(0, 0, 0);
      if (keys["KeyW"] || keys["ArrowUp"]) direction.z -= 1;
      if (keys["KeyS"] || keys["ArrowDown"]) direction.z += 1;
      if (keys["KeyA"] || keys["ArrowLeft"]) direction.x -= 1;
      if (keys["KeyD"] || keys["ArrowRight"]) direction.x += 1;
      if (direction.lengthSq() > 0) direction.normalize();
      const speed = keys["ShiftLeft"] || keys["ShiftRight"] ? 8.5 : 4.8;
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();
      const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
      velocity.set(0, 0, 0);
      velocity.addScaledVector(forward, -direction.z * speed);
      velocity.addScaledVector(right, direction.x * speed);
      camera.position.addScaledVector(velocity, dt);
      clampPlayer();
    } else if (modeLocal === "orbit") {
      orbitAz += dt * (prefersReduce || quality === "low" ? 0.025 : 0.08);
      applyOrbit();
    } else if (!prefersReduce) {
      camera.position.x = Math.sin(t * 0.15) * 0.35;
      camera.position.y = 1.7 + Math.sin(t * 0.22) * 0.05;
      camera.lookAt(0, 2.5, -8);
    }

    hotPortal = null;
    if (modeLocal === "fps") {
      raycaster.setFromCamera(center, camera);
      const hits = raycaster.intersectObjects(portalMeshes, false);
      if (hits[0]) {
        const p = (hits[0].object.userData as { portal?: PortalDef }).portal;
        if (p && hits[0].distance < 18) hotPortal = p;
      }
    }

    labelTick += dt;
    if (labelTick >= 0.1) {
      labelTick = 0;
      const nextLabels: LabelState[] = [];
      const rect = renderer.domElement.getBoundingClientRect();
      const worldPos = new THREE.Vector3();
      for (const { portal, obj } of labelAnchors) {
        obj.getWorldPosition(worldPos);
        const dist = camera.position.distanceTo(worldPos);
        tmp.copy(worldPos).project(camera);
        const visible = tmp.z < 1;
        nextLabels.push({
          id: portal.id,
          label: portal.label,
          href: portal.href,
          x: (tmp.x * 0.5 + 0.5) * rect.width,
          y: (-tmp.y * 0.5 + 0.5) * rect.height,
          visible: visible && dist < 14 && tmp.x > -1.2 && tmp.x < 1.2,
          hot: hotPortal?.id === portal.id,
        });
      }
      hooks.setLabels(nextLabels);
    }

    renderer.render(scene, camera);
  };
  animate();

  const onResize = () => {
    const mount = hooks.getMount();
    if (!mount) return;
    const w = mount.clientWidth;
    const h = mount.clientHeight;
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  const ro = new ResizeObserver(onResize);
  ro.observe(el);
  window.addEventListener("resize", onResize);

  const dispose = () => {
    disposed = true;
    cancelAnimationFrame(raf);
    raf = 0;
    ro.disconnect();
    document.removeEventListener("pointerlockchange", onLockChange);
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    window.removeEventListener("resize", onResize);
    unbindCanvasEvents();
    tearDownWorld();
  };

  return { api, dispose };
}
