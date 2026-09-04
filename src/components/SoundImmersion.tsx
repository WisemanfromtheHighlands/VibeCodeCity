"use client";

import { useEffect, useRef, useState } from "react";
import { startImmersion, type ImmersionHandles, type ToneId } from "@/lib/audio";
import { useAudioUi } from "./MuteControl";

const tones: { id: ToneId; label: string; blurb: string }[] = [
  { id: "drone", label: "Drone", blurb: "Low bed for sustained focus" },
  { id: "pulse", label: "Pulse", blurb: "Gentle tempo for drafting loops" },
  { id: "shimmer", label: "Shimmer", blurb: "High air for revision passes" },
];

export function SoundImmersion() {
  const { muted, unlocked, unlock, reducedMotion, setMuted } = useAudioUi();
  const [tone, setTone] = useState<ToneId>("drone");
  const [playing, setPlaying] = useState(false);
  const handles = useRef<ImmersionHandles | null>(null);

  useEffect(() => {
    return () => {
      handles.current?.stop();
      handles.current = null;
    };
  }, []);

  useEffect(() => {
    handles.current?.setMuted(muted);
  }, [muted]);

  useEffect(() => {
    if (playing) handles.current?.setTone(tone);
  }, [tone, playing]);

  const toggle = async () => {
    if (!unlocked) {
      const ok = await unlock();
      if (!ok) return;
    }
    if (playing) {
      handles.current?.stop();
      handles.current = null;
      setPlaying(false);
      return;
    }
    const h = startImmersion({ muted, tone, reducedMotion });
    if (!h) return;
    handles.current = h;
    setPlaying(true);
    if (muted) setMuted(false);
  };

  return (
    <div className="surface rounded-3xl p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-display text-xs tracking-[0.24em] text-solar-gold">SOUND ROOM</p>
          <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">Intentional immersion</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">
            Soft generative beds for creative sessions. Not therapy, not medical, not a product pitch —
            just atmosphere you control. First gesture unlocks audio in the browser.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void toggle()}
          className="rounded-full bg-cyan/15 px-5 py-2.5 text-sm font-semibold text-cyan ring-1 ring-cyan/40 transition duration-medium ease-organic hover:bg-cyan/25"
        >
          {playing ? "Stop bed" : unlocked ? "Start bed" : "Unlock & start"}
        </button>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {tones.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTone(t.id)}
            aria-pressed={tone === t.id}
            className={`rounded-2xl border px-4 py-4 text-left transition duration-fast ease-organic ${
              tone === t.id
                ? "border-magenta/50 bg-magenta/10 text-white"
                : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20"
            }`}
          >
            <span className="font-display text-sm tracking-wide">{t.label}</span>
            <span className="mt-1 block text-xs text-white/50">{t.blurb}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
