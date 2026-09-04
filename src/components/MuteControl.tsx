"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  ensureAmbient,
  setAmbientMuted,
  setAmbientTone,
  stopAmbient,
  unlockAudio,
  isAmbientPlaying,
  getAmbientTone,
  type ToneId,
} from "@/lib/audio";

type AudioUiState = {
  muted: boolean;
  unlocked: boolean;
  reducedMotion: boolean;
  ambientPlaying: boolean;
  tone: ToneId;
  setMuted: (v: boolean) => void;
  setTone: (tone: ToneId) => void;
  /** Resume AudioContext only — does NOT start the soundtrack. */
  unlock: () => Promise<boolean>;
  startAmbient: () => boolean;
  stopAmbientBed: () => void;
};

const AudioUiContext = createContext<AudioUiState | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMutedState] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  const [tone, setToneState] = useState<ToneId>("drone");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    setAmbientMuted(muted);
  }, [muted]);

  const setMuted = useCallback((v: boolean) => {
    setMutedState(v);
    setAmbientMuted(v);
  }, []);

  const setTone = useCallback((next: ToneId) => {
    setToneState(next);
    setAmbientTone(next);
  }, []);

  const startAmbient = useCallback(() => {
    const h = ensureAmbient({ muted, tone, reducedMotion });
    const playing = !!h || isAmbientPlaying();
    setAmbientPlaying(playing);
    return playing;
  }, [muted, tone, reducedMotion]);

  const stopAmbientBed = useCallback(() => {
    stopAmbient();
    setAmbientPlaying(false);
  }, []);

  const unlock = useCallback(async () => {
    const ok = await unlockAudio();
    if (!ok) return false;
    setUnlocked(true);
    setToneState(getAmbientTone());
    // Opt-in only: never auto-start ambient on unlock / Enter.
    return true;
  }, []);

  const value = useMemo(
    () => ({
      muted,
      unlocked,
      reducedMotion,
      ambientPlaying,
      tone,
      setMuted,
      setTone,
      unlock,
      startAmbient,
      stopAmbientBed,
    }),
    [
      muted,
      unlocked,
      reducedMotion,
      ambientPlaying,
      tone,
      setMuted,
      setTone,
      unlock,
      startAmbient,
      stopAmbientBed,
    ],
  );

  return <AudioUiContext.Provider value={value}>{children}</AudioUiContext.Provider>;
}

export function useAudioUi() {
  const ctx = useContext(AudioUiContext);
  if (!ctx) throw new Error("useAudioUi must be used within AudioProvider");
  return ctx;
}

/**
 * Corner mute UI. Silent by default.
 * Mute/Unmute only when the soundtrack is already running (opted in on /sound).
 * Otherwise offers a clear link to the Soundtrack room — no surprise auto-start.
 */
export function MuteControl({ className = "" }: { className?: string }) {
  const { muted, setMuted, ambientPlaying } = useAudioUi();

  if (!ambientPlaying) {
    return (
      <Link
        href="/sound"
        className={`surface fixed bottom-4 right-4 z-40 rounded-full px-4 py-2 text-xs font-medium tracking-wide text-white/70 shadow-lg shadow-black/40 transition duration-medium ease-organic hover:border-cyan/40 hover:text-cyan ${className}`}
      >
        Soundtrack
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={`surface fixed bottom-4 right-4 z-40 rounded-full px-4 py-2 text-xs font-medium tracking-wide text-white/80 shadow-lg shadow-black/40 transition duration-medium ease-organic hover:border-cyan/40 hover:text-cyan ${className}`}
      aria-pressed={muted}
      onClick={() => setMuted(!muted)}
    >
      {muted ? "Unmute" : "Mute"}
    </button>
  );
}
