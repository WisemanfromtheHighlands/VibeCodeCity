import type * as THREE from "three";
import type { CityQuality } from "./cityTypes";

/** Post stack disabled — bloom/vignette/grain removed (fuzzy FX). Always null. */
export type PostStack = never;

export function createPostStack(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  quality: CityQuality,
): null {
  void renderer;
  void scene;
  void camera;
  void quality;
  return null;
}

export function resizePostStack(post: null, w: number, h: number) {
  void post;
  void w;
  void h;
}

export function disposePostStack(post: null) {
  void post;
}
