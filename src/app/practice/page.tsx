import type { Metadata } from "next";
import { PracticeCard } from "@/components/PracticeCard";
import { practiceModules } from "@/lib/modules";

export const metadata: Metadata = {
  title: "Practice",
};

export default function PracticeIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
      <p className="font-display text-xs tracking-[0.28em] text-cyan">PRACTICE</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">Modules</h1>
      <p className="mt-4 max-w-2xl text-white/65">
        Compact rooms for creative AI literacy. Each module is a loop you can finish in one sitting —
        then salvage what still hums.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {practiceModules.map((mod) => (
          <PracticeCard key={mod.slug} mod={mod} />
        ))}
      </div>
    </div>
  );
}
