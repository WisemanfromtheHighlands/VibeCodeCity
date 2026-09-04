"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const CityGlimpse = dynamic(
  () => import("@/components/city/CityGlimpse").then((m) => m.CityGlimpse),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(100dvh-8rem)] min-h-[70vh] items-center justify-center rounded-3xl border border-white/10 bg-void">
        <p className="font-display text-sm tracking-wide text-white/50">Loading district…</p>
      </div>
    ),
  },
);

export function CityClient() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-xs tracking-[0.28em] text-cyan">CITY GLIMPSE</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
            Nocturnal district
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
            A hyperfuture plaza — rave neon on void, solarpunk glow on the edges. Click{" "}
            <span className="text-white/90">Look around</span>, then walk (WASD) or orbit. Buildings
            are portals into the academy.
          </p>
        </div>
        <Link href="/orientation" className="text-sm text-white/55 transition hover:text-cyan">
          Prefer a map? Orient →
        </Link>
      </div>

      <CityGlimpse variant="full" />

      <p className="mt-4 text-center text-xs text-white/40">
        Click a glowing label — Orient, Practice, Field, or Sound (soundtrack room). Esc releases
        mouse look. Reduced-motion uses a slow orbit.
      </p>
    </div>
  );
}
