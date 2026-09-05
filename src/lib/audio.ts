export type ToneId = "drone" | "pulse" | "shimmer";

let sharedCtx: AudioContext | null = null;
let unlocked = false;

/** Layout-level soft ambient — survives route changes until explicitly stopped. */
let ambientHandles: ImmersionHandles | null = null;
let ambientTone: ToneId = "drone";
let ambientReducedMotion = false;

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!sharedCtx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedCtx = new Ctx();
  }
  return sharedCtx;
}

export async function unlockAudio(): Promise<boolean> {
  const ctx = getAudioContext();
  if (!ctx) return false;
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
  unlocked = ctx.state === "running";
  return unlocked;
}

export function isAudioUnlocked() {
  return unlocked;
}

export type ImmersionHandles = {
  stop: () => void;
  setMuted: (muted: boolean) => void;
  setTone: (tone: ToneId) => void;
};

export function startImmersion(opts: {
  muted?: boolean;
  tone?: ToneId;
  reducedMotion?: boolean;
}): ImmersionHandles | null {
  const ctx = getAudioContext();
  if (!ctx || !unlocked) return null;

  const master = ctx.createGain();
  master.gain.value = opts.muted ? 0 : 0.08;
  master.connect(ctx.destination);

  const oscillators: OscillatorNode[] = [];
  const gains: GainNode[] = [];

  const build = (tone: ToneId) => {
    oscillators.splice(0).forEach((o) => {
      try { o.stop(); } catch { /* noop */ }
      o.disconnect();
    });
    gains.splice(0).forEach((g) => g.disconnect());

    const specs =
      tone === "drone"
        ? [
            { f: 55, type: "sine" as OscillatorType, g: 0.55 },
            { f: 110.5, type: "triangle" as OscillatorType, g: 0.2 },
            { f: 164.8, type: "sine" as OscillatorType, g: 0.12 },
          ]
        : tone === "pulse"
          ? [
              { f: 72, type: "sine" as OscillatorType, g: 0.4 },
              { f: 144, type: "square" as OscillatorType, g: 0.08 },
            ]
          : [
              { f: 220, type: "sine" as OscillatorType, g: 0.25 },
              { f: 329.6, type: "triangle" as OscillatorType, g: 0.15 },
              { f: 523.2, type: "sine" as OscillatorType, g: 0.08 },
            ];

    specs.forEach((spec) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = spec.type;
      osc.frequency.value = spec.f;
      gain.gain.value = spec.g;
      osc.connect(gain);
      gain.connect(master);
      osc.start();
      oscillators.push(osc);
      gains.push(gain);

      if (!opts.reducedMotion && tone === "pulse") {
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.8;
        lfoGain.gain.value = 0.25;
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        lfo.start();
        oscillators.push(lfo);
        gains.push(lfoGain);
      }
    });
  };

  build(opts.tone ?? "drone");

  return {
    stop: () => {
      oscillators.forEach((o) => {
        try { o.stop(); } catch { /* noop */ }
        o.disconnect();
      });
      gains.forEach((g) => g.disconnect());
      master.disconnect();
    },
    setMuted: (muted: boolean) => {
      master.gain.setTargetAtTime(muted ? 0 : 0.08, ctx.currentTime, 0.05);
    },
    setTone: (tone: ToneId) => build(tone),
  };
}

/** Start or refresh the sitewide soft ambient bed (layout-level singleton). */
export function ensureAmbient(opts: {
  muted?: boolean;
  tone?: ToneId;
  reducedMotion?: boolean;
}): ImmersionHandles | null {
  if (opts.tone) ambientTone = opts.tone;
  if (opts.reducedMotion !== undefined) ambientReducedMotion = opts.reducedMotion;

  if (ambientHandles) {
    if (opts.tone) ambientHandles.setTone(ambientTone);
    if (opts.muted !== undefined) ambientHandles.setMuted(!!opts.muted);
    return ambientHandles;
  }

  const h = startImmersion({
    muted: opts.muted,
    tone: ambientTone,
    reducedMotion: ambientReducedMotion,
  });
  ambientHandles = h;
  return h;
}

export function stopAmbient() {
  ambientHandles?.stop();
  ambientHandles = null;
}

export function setAmbientMuted(muted: boolean) {
  ambientHandles?.setMuted(muted);
}

export function setAmbientTone(tone: ToneId) {
  ambientTone = tone;
  ambientHandles?.setTone(tone);
}

export function getAmbientTone(): ToneId {
  return ambientTone;
}

export function isAmbientPlaying(): boolean {
  return ambientHandles !== null;
}
