import type { Metadata } from "next";
import { SoundImmersion } from "@/components/SoundImmersion";

export const metadata: Metadata = {
  title: "Sound",
};

export default function SoundPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-20">
      <p className="font-display text-xs tracking-[0.28em] text-solar-gold">SOUND</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
        Intentional atmosphere
      </h1>
      <p className="mt-4 max-w-2xl text-white/65">
        Drop into deeper creative states through intentional sound. Unlock once (Enter, Enable sound,
        or Start bed) — soft ambient continues as you move through the academy. Mute stays global.
        Beds are optional and local to your browser. No medical claims.
      </p>
      <div className="mt-10">
        <SoundImmersion />
      </div>
    </div>
  );
}
