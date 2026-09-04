import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getModule, practiceModules } from "@/lib/modules";

type Props = { params: Promise<{ module: string }> };

export function generateStaticParams() {
  return practiceModules.map((m) => ({ module: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { module: slug } = await params;
  const mod = getModule(slug);
  return { title: mod?.title ?? "Module" };
}

export default async function PracticeModulePage({ params }: Props) {
  const { module: slug } = await params;
  const mod = getModule(slug);
  if (!mod) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
      <Link href="/practice" className="text-sm text-white/50 hover:text-cyan">
        ← All modules
      </Link>
      <p className="mt-6 font-display text-xs tracking-[0.24em] text-white/50 uppercase">
        {mod.duration} · {mod.subtitle}
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">{mod.title}</h1>
      <p className="mt-6 text-lg leading-relaxed text-white/70">{mod.summary}</p>

      <section className="surface mt-10 rounded-3xl p-6 sm:p-8">
        <h2 className="font-display text-sm tracking-[0.2em] text-chlorophyll">SESSION BEATS</h2>
        <ol className="mt-6 space-y-4">
          {mod.beats.map((beat, i) => (
            <li key={beat} className="flex gap-4">
              <span className="font-display text-cyan">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-white/80">{beat}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/field"
          className="rounded-full bg-cyan/15 px-5 py-2.5 text-sm font-semibold text-cyan ring-1 ring-cyan/40"
        >
          Rehearse in Tuning Field
        </Link>
        <Link href="/notes" className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/75">
          Capture notes
        </Link>
      </div>
    </div>
  );
}
