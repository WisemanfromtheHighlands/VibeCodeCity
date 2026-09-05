import Link from "next/link";
import { Hero } from "@/components/Hero";
import { PracticeCard } from "@/components/PracticeCard";
import { practiceModules } from "@/lib/modules";
import { classNav } from "@/lib/lessons";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section
        id="class"
        className="relative mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 sm:pt-10"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-xs tracking-[0.24em] text-gold">CLASS</p>
            <h2 className="mt-2 font-display text-3xl text-white">Literacy path</h2>
            <p className="mt-3 max-w-2xl text-sm text-white/60">
              From fancy Google to knowing what this is and how to aim it. Four lessons, one real sitting.
            </p>
          </div>
          <Link href="/orientation" className="text-sm text-white/60 hover:text-chlorophyll">
            Start orientation →
          </Link>
        </div>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {classNav.map((step, i) => (
            <li key={step.href}>
              <Link
                href={step.href}
                className="flex h-full flex-col rounded-3xl border border-white/10 bg-void/40 p-5 transition duration-medium ease-organic hover:border-gold/40"
              >
                <span className="font-display text-xs text-gold">
                  {String(i).padStart(2, "0")}
                </span>
                <span className="mt-2 font-display text-lg text-white">{step.label}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Orient",
              href: "/orientation",
              body: "Class map and three questions. Start here — not a waitlist.",
            },
            {
              title: "City",
              href: "/city",
              body: "Step into a nocturnal district. Look around, walk the plaza, and enter academy portals.",
            },
            {
              title: "Soundtrack",
              href: "/sound",
              body: "Optional focus beds — opt in here only. Research ongoing. No medical claims. Silent by default.",
            },
            {
              title: "Tuning Field",
              href: "/field",
              body: "Learn by gesture. Move through prompts that train collaborative AI craft.",
            },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-3xl border border-white/10 bg-void/40 p-6 transition duration-medium ease-organic hover:border-chlorophyll/40"
            >
              <h3 className="font-display text-xl text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{card.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="extra-rooms"
        className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-xs tracking-[0.24em] text-white/40">EXTRA ROOMS</p>
            <h2 className="mt-2 font-display text-2xl text-white/80">Optional modules</h2>
            <p className="mt-2 max-w-xl text-sm text-white/45">
              Earlier practice rooms. They stay available but do not outrank the class path.
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 opacity-80 sm:grid-cols-2">
          {practiceModules.slice(0, 4).map((mod) => (
            <PracticeCard key={mod.slug} mod={mod} />
          ))}
        </div>
      </section>
    </>
  );
}
