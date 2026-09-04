export type PortalDef = {
  id: string;
  label: string;
  href: string;
  position: [number, number, number];
  size: [number, number, number];
  color: number;
  accent: number;
};

export const PORTALS: PortalDef[] = [
  { id: "orient", label: "Orient", href: "/orientation", position: [-8, 3.2, -10], size: [4.2, 6.4, 3.4], color: 0x1a0a18, accent: 0xff2a6d },
  { id: "practice", label: "Practice", href: "/practice", position: [0, 4.0, -12], size: [5.0, 8.0, 3.8], color: 0x0a1418, accent: 0x00f0ff },
  { id: "field", label: "Field", href: "/field", position: [8.5, 3.5, -9.5], size: [4.0, 7.0, 3.2], color: 0x0c1810, accent: 0x3ddc97 },
  { id: "sound", label: "Sound", href: "/sound", position: [3.5, 2.6, -5.5], size: [3.2, 5.2, 2.8], color: 0x14100a, accent: 0xf5c542 },
];

export const FILLER: { position: [number, number, number]; size: [number, number, number]; accent: number }[] = [
  { position: [-14, 5.5, -16], size: [3.5, 11, 3.5], accent: 0xb14eff },
  { position: [14, 4.2, -14], size: [3.2, 8.4, 3.0], accent: 0xff2a6d },
  { position: [-11, 2.4, -4], size: [2.4, 4.8, 2.4], accent: 0x00f0ff },
  { position: [12, 2.8, -3], size: [2.6, 5.6, 2.2], accent: 0x3ddc97 },
  { position: [-5, 6.5, -18], size: [4.0, 13, 3.5], accent: 0xf5c542 },
  { position: [6, 7.2, -20], size: [3.8, 14.4, 3.2], accent: 0xb14eff },
];

export type CityMode = "idle" | "fps" | "orbit";

export type LabelState = {
  id: string;
  label: string;
  href: string;
  x: number;
  y: number;
  visible: boolean;
  hot: boolean;
};

export type CitySceneApi = {
  enterFps: () => void;
  enterOrbit: () => void;
  navigateHot: () => void;
};

export type CitySceneHooks = {
  setMode: (m: CityMode) => void;
  setHint: (h: string) => void;
  setLocked: (v: boolean) => void;
  setLabels: (labels: LabelState[]) => void;
  onNavigate: (href: string) => void;
  getMount: () => HTMLElement | null;
};
