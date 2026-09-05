import type { Metadata } from "next";
import Link from "next/link";
import { LessonShell } from "@/components/LessonShell";
import { lessons } from "@/lib/lessons";
import { practiceModules } from "@/lib/modules";

export const metadata: Metadata = {
  title: "Practice",
  description: "One real task — the literacy class sitting.",
};

export default function PracticePage() {
  return (
    <>
      <LessonShell lesson={lessons.practice} />
      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
          <p className="font-display text-xs tracking-[0.2em] text-white/40">EXTRA ROOMS</p>
          <p className="mt-2 text-sm text-white/50">
            Optional modules from earlier builds. They do not replace the class path above.
          </p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {practiceModules.map((mod) => (
              <li key={mod.slug}>
                <Link
                  href={`/practice/${mod.slug}`}
                  className="text-sm text-white/45 hover:text-cyan"
                >
                  {mod.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
