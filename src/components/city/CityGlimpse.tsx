"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  createCityScene,
  type CityMode,
  type LabelState,
  type CitySceneApi,
  type CityQuality,
} from "./cityScene";
import { resolveCityQuality } from "./cityTypes";

type CityGlimpseProps = {
  variant?: "full" | "compact";
  className?: string;
};

export function CityGlimpse({ variant = "full", className = "" }: CityGlimpseProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [mode, setMode] = useState<CityMode>("idle");
  const [hint, setHint] = useState("Look around");
  const [labels, setLabels] = useState<LabelState[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [locked, setLocked] = useState(false);
  const [quality, setQuality] = useState<CityQuality>("high");
  const apiRef = useRef<CitySceneApi | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReducedMotion(mq.matches);
      setQuality(resolveCityQuality());
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const { api, dispose } = createCityScene({
      setMode,
      setHint,
      setLocked,
      setLabels,
      setQuality,
      onNavigate: (href) => router.push(href),
      getMount: () => mountRef.current,
    });
    apiRef.current = api;
    setQuality(api.getQuality());
    return () => {
      dispose();
      apiRef.current = null;
    };
  }, [router, variant]);

  const onEnterCity = useCallback(() => {
    if (reducedMotion) apiRef.current?.enterOrbit();
    else apiRef.current?.enterFps();
  }, [reducedMotion]);

  const toggleQuality = useCallback(() => {
    if (reducedMotion) return;
    const next: CityQuality = quality === "high" ? "low" : "high";
    apiRef.current?.setQuality(next);
    setQuality(next);
  }, [quality, reducedMotion]);

  const heightClass =
    variant === "compact" ? "min-h-[420px] h-[55vh]" : "min-h-[70vh] h-[calc(100dvh-8rem)]";

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-void ${heightClass} ${className}`}>
      <div ref={mountRef} className="absolute inset-0" />

      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(7,6,11,0.55) 100%)",
        }}
        aria-hidden
      />

      {mode === "idle" && (
        <div className="absolute inset-0 z-[2] flex items-center justify-center">
          <button
            type="button"
            onClick={onEnterCity}
            className="rounded-full bg-magenta px-8 py-4 font-display text-base font-semibold tracking-wide text-white shadow-[0_0_40px_rgba(255,42,109,0.45)] transition duration-medium ease-organic hover:bg-magenta/90 sm:text-lg"
          >
            Look around
          </button>
        </div>
      )}

      <div className="pointer-events-none absolute bottom-4 left-1/2 z-[3] w-[min(92%,36rem)] -translate-x-1/2 text-center">
        <p className="rounded-full border border-white/10 bg-void/70 px-4 py-2 text-xs text-white/70 backdrop-blur-md sm:text-sm">
          {hint}
          {locked ? " · looking" : ""}
        </p>
      </div>

      <div className="absolute right-3 top-3 z-[3] flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => apiRef.current?.enterFps()}
          className={`rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-md transition ${
            mode === "fps"
              ? "bg-cyan/20 text-cyan ring-1 ring-cyan/40"
              : "bg-void/60 text-white/70 ring-1 ring-white/10 hover:text-white"
          }`}
        >
          Walk
        </button>
        <button
          type="button"
          onClick={() => apiRef.current?.enterOrbit()}
          className={`rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-md transition ${
            mode === "orbit"
              ? "bg-violet/25 text-violet ring-1 ring-violet/40"
              : "bg-void/60 text-white/70 ring-1 ring-white/10 hover:text-white"
          }`}
        >
          Orbit
        </button>
        <button
          type="button"
          onClick={toggleQuality}
          disabled={reducedMotion}
          title={
            reducedMotion
              ? "Quality locked low while prefers-reduced-motion is on"
              : "Toggle sharper sky and pixel ratio (High / Low)"
          }
          className={`rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-md transition ${
            quality === "high"
              ? "bg-solar-gold/20 text-solar-gold ring-1 ring-solar-gold/40"
              : "bg-void/60 text-white/70 ring-1 ring-white/10 hover:text-white"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {quality === "high" ? "HQ" : "LQ"}
        </button>
      </div>

      {labels.map((l) =>
        l.visible ? (
          <button
            key={l.id}
            type="button"
            onClick={() => router.push(l.href)}
            className={`absolute z-[4] -translate-x-1/2 -translate-y-full rounded-full px-3 py-1.5 font-display text-xs font-semibold tracking-wide backdrop-blur-md transition ${
              l.hot
                ? "bg-magenta text-white shadow-[0_0_24px_rgba(255,42,109,0.5)]"
                : "border border-white/20 bg-void/70 text-white/90 hover:border-cyan/50 hover:text-cyan"
            }`}
            style={{ left: l.x, top: l.y }}
          >
            {l.label}
            <span className="ml-1 text-[10px] font-normal opacity-70">→</span>
          </button>
        ) : null,
      )}
    </div>
  );
}
