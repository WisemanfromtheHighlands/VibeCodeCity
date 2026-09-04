import type { Metadata } from "next";
import { PlaygroundShell } from "@/components/PlaygroundShell";

export const metadata: Metadata = {
  title: "Playground",
};

export default function PlaygroundPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
      <p className="font-display text-xs tracking-[0.28em] text-magenta">PLAYGROUND</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
        Compose with presence
      </h1>
      <p className="mt-4 max-w-2xl text-white/65">
        Create with more presence, less friction. This shell is offline-first — refine language here,
        then take it to whatever model you already use.
      </p>
      <div className="mt-10">
        <PlaygroundShell />
      </div>
    </div>
  );
}
