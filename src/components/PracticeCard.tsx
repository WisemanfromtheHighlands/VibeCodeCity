import Link from "next/link";
import type { PracticeModule } from "@/lib/modules";

const accentMap = {
  magenta: "text-magenta border-magenta/30 hover:border-magenta/60",
  cyan: "text-cyan border-cyan/30 hover:border-cyan/60",
  violet: "text-violet border-violet/30 hover:border-violet/60",
  chlorophyll: "text-chlorophyll border-chlorophyll/30 hover:border-chlorophyll/60",
  "solar-gold": "text-solar-gold border-solar-gold/30 hover:border-solar-gold/60",
} as const;

export function PracticeCard({ mod }: { mod: PracticeModule }) {
  return (
    <Link
      href={`/practice/${mod.slug}`}
      className={`surface group flex h-full flex-col rounded-3xl p-6 transition duration-medium ease-organic hover:-translate-y-0.5 hover:bg-white/[0.05] ${accentMap[mod.accent]}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-display text-xs tracking-[0.2em] uppercase opacity-90">{mod.duration}</span>
        <span className="text-xs text-white/40 group-hover:text-white/70">Open →</span>
      </div>
      <h3 className="mt-4 font-display text-2xl text-white">{mod.title}</h3>
      <p className="mt-1 text-sm text-white/55">{mod.subtitle}</p>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-white/70">{mod.summary}</p>
    </Link>
  );
}
