import Link from "next/link";
import type { Lesson } from "@/lib/lessons";
import { LessonVideo } from "./LessonVideo";
import { LessonMarkdown } from "./LessonMarkdown";

type Props = {
  lesson: Lesson;
};

export function LessonShell({ lesson }: Props) {
  return (
    <div className="bg-rave-glow">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
        <p className="font-display text-xs tracking-[0.28em] text-magenta uppercase">
          {lesson.eyebrow}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
          {lesson.title}
        </h1>

        <LessonVideo videoKey={lesson.videoKey} />

        <div className="mt-10">
          <LessonMarkdown source={lesson.body} />
        </div>

        {lesson.exercise ? (
          <section className="surface mt-12 rounded-3xl p-6 sm:p-8">
            <h2 className="font-display text-sm tracking-[0.2em] text-chlorophyll">EXERCISE</h2>
            <div className="mt-4">
              <LessonMarkdown source={lesson.exercise} />
            </div>
            <Link
              href="/notes"
              className="mt-6 inline-flex rounded-full border border-cyan/40 bg-cyan/10 px-5 py-2.5 text-sm font-semibold text-cyan transition duration-medium ease-organic hover:border-cyan/70 hover:bg-cyan/15"
            >
              Open Notes →
            </Link>
          </section>
        ) : null}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
          <Link href="/orientation" className="text-sm text-white/45 hover:text-cyan">
            Class map
          </Link>
          <Link
            href={lesson.next}
            className="rounded-full bg-magenta px-6 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(255,42,109,0.3)] transition duration-medium ease-organic hover:bg-magenta/90"
          >
            {lesson.nextLabel} →
          </Link>
        </div>
      </div>
    </div>
  );
}
