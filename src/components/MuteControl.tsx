"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { unlockAudio } from "@/lib/audio";

type AudioUiState = {
  muted: boolean;
  unlocked: boolean;
  reducedMotion: boolean;
  setMuted: (v: boolean) => void;
  unlock: () => Promise<boolean>;
};

const AudioUiContext = createContext<AudioUiState | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const unlock = useCallback(async () => {
    const ok = await unlockAudio();
    setUnlocked(ok);
    return ok;
  }, []);

  const value = useMemo(
    () => ({ muted, unlocked, reducedMotion, setMuted, unlock }),
    [muted, unlocked, reducedMotion, unlock],
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
        }
        setMuted(!muted);
      }}
    >
      {!unlocked ? "Enable sound" : muted ? "Unmute" : "Mute"}
    </button>
  );
}
