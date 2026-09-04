import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { VignetteGrainShader } from "./cityShaders";
import type { CityQuality } from "./cityTypes";

export type PostStack = {
  composer: EffectComposer;
  bloom: UnrealBloomPass;
  vignette: ShaderPass;
};

export function createPostStack(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  quality: CityQuality,
): PostStack | null {
  if (quality !== "high") return null;
  const size = new THREE.Vector2();
  renderer.getSize(size);
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(size.clone(), 0.42, 0.55, 0.82);
  composer.addPass(bloom);
  const vignette = new ShaderPass(VignetteGrainShader);
  vignette.uniforms.uIntensity.value = 0.32;
  vignette.uniforms.uGrain.value = 0.06;
  composer.addPass(vignette);
  composer.addPass(new OutputPass());
  composer.setSize(size.x, size.y);
  return { composer, bloom, vignette };
}

export function resizePostStack(post: PostStack | null, w: number, h: number) {
  if (!post) return;
  post.composer.setSize(w, h);
  post.bloom.resolution.set(w, h);
}

export function disposePostStack(post: PostStack | null) {
  post?.composer.dispose();
}
