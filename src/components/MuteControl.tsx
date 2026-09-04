"use client";

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
  unlock: () => Promise<boolean>;
  startAmbient: () => boolean;
  stopAmbientBed: () => void;
};

const AudioUiContext = createContext<AudioUiState | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMutedState] = useState(false);
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
    const h = ensureAmbient({
      muted: false,
      tone: getAmbientTone(),
      reducedMotion,
    });
    setMutedState(false);
    setAmbientPlaying(!!h);
    setToneState(getAmbientTone());
    return true;
  }, [reducedMotion]);

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

export function MuteControl({ className = "" }: { className?: string }) {
  const { muted, setMuted, unlocked, unlock } = useAudioUi();

  return (
    <button
      type="button"
      className={`surface fixed bottom-4 right-4 z-40 rounded-full px-4 py-2 text-xs font-medium tracking-wide text-white/80 shadow-lg shadow-black/40 transition duration-medium ease-organic hover:border-cyan/40 hover:text-cyan ${className}`}
      aria-pressed={muted}
      onClick={async () => {
        if (!unlocked) {
          await unlock();
          return;
        }
        setMuted(!muted);
      }}
    >
      {!unlocked ? "Enable sound" : muted ? "Unmute" : "Mute"}
    </button>
  );
}
