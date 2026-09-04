import type { Metadata } from "next";
import { SoundImmersion } from "@/components/SoundImmersion";

export const metadata: Metadata = {
  title: "Soundtrack",
};

export default function SoundPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-20">
      <p className="font-display text-xs tracking-[0.28em] text-solar-gold">SOUNDTRACK</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
        Optional soundtrack
      </h1>
      <p className="mt-4 max-w-2xl text-white/65">
        Soft generative beds you can opt into for focus while learning. Research on sound and
        attention is ongoing — this is not medicine, therapy, or a claim about outcomes. The rest of
        the academy stays silent until you start a bed here. Mute or stop anytime.
      </p>
      <div className="mt-10">
        <SoundImmersion />
      </div>
    </div>
  );
}
