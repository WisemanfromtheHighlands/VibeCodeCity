import Link from "next/link";
import { Hero } from "@/components/Hero";
import { PracticeCard } from "@/components/PracticeCard";
import { practiceModules } from "@/lib/modules";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section
        id="pathways"
        className="relative mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-xs tracking-[0.24em] text-cyan">PATHWAYS</p>
            <h2 className="mt-2 font-display text-3xl text-white">Practice rooms</h2>
          </div>
          <Link href="/practice" className="text-sm text-white/60 hover:text-cyan">
            View all modules →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {practiceModules.slice(0, 4).map((mod) => (
            <PracticeCard key={mod.slug} mod={mod} />
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-3">
          {[
            {
              title: "Orient",
              href: "/orientation",
              body: "New here? What this place is, how a visit works, and a plain path from zero to fluent.",
            },
            {
              title: "Sound",
              href: "/sound",
              body: "Unlock once — soft ambient can follow you sitewide. Mute anytime. Atmosphere, not therapy.",
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
    </>
  );
}
