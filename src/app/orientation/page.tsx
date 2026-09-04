import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Orientation",
  description:
    "What VibeCodeCity is, how to move through it, and a simple path from knowing nothing about AI to becoming fluent.",
};

const visitSteps = [
  {
    n: "01",
    title: "Orient",
    body: "You're here. Read this page once. You don’t need to memorize anything — just get the shape of the place.",
  },
  {
    n: "02",
    title: "Practice",
    body: "Short modules. One idea at a time. Prompt craft, constraints, presence — small reps that build real fluency.",
  },
  {
    n: "03",
    title: "Soundtrack (optional)",
    body: "Optional focus beds — start them only on /sound when you want. Silent by default. Research ongoing; no medical claims.",
  },
  {
    n: "04",
    title: "Tuning Field",
    body: "Learn by gesture. Move through teaching prompts that train collaborative AI craft with your body in the loop.",
  },
];

const ladder = [
  {
    title: "What a model is",
    plain:
      "Think of an AI model as a very fast pattern-matcher that has read a lot of human writing. It predicts likely next words. It is not a person, not a search engine with feelings, and not magic — it's a tool that responds to how clearly you aim it.",
    deep: "Under the hood it's statistics over tokens. Your job is taste + direction; its job is generation at speed.",
  },
  {
    title: "Prompting as collaboration",
    plain:
      "Don't bark orders at a vending machine. Talk to it like a sharp junior partner: say what you're trying to make, who it's for, what \"good\" looks like, and what to avoid. Then revise together.",
    deep: "Constraints, examples, and role framing beat vague wishes. Iteration is the craft.",
  },
  {
    title: "Constraints create originality",
    plain:
      "\"Write something cool\" gets generic mush. \"Write it as a postcard from 2089, no adjectives ending in -ly, under 80 words\" forces invention. Limits are gifts.",
    deep: "Narrow the field until generic answers can't survive.",
  },
  {
    title: "Iteration over one-shot genius",
    plain:
      "First drafts from AI are clay. Your job is the second and third pass: keep the spark, cut the sludge, ask for a sharper take. Fluency is a loop, not a download.",
    deep: "Name what worked before you ask for more. Salvage fragments.",
  },
  {
    title: "Taste is the real skill",
    plain:
      "Anyone can generate. The rare skill is knowing when something is alive. Notice what moves you. Keep that. Throw the rest back. Taste compounds faster than tips.",
    deep: "Presence beats bingeing. Short sessions with attention beat marathon scroll.",
  },
];

export default function OrientationPage() {
  return (
    <div className="bg-rave-glow">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
        <p className="font-display text-xs tracking-[0.28em] text-magenta">ORIENTATION</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
          What this place is
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-white/75">
          VibeCodeCity is a living academy — a dojo for creative AI literacy. Not a product funnel.
          Not a waitlist. Not a course that sells you hype. It’s a place to walk in curious, leave with
          clearer mental models, and practice wielding AI as a tool with presence and taste.
        </p>
        <p className="mt-4 text-base leading-relaxed text-white/60">
          Built for beginners who know nothing yet — and welcoming to advanced minds who want depth
          without jargon walls. If your grandma can follow the map, you’re doing it right. If you’ve
          already shipped with models for years, the Field and Practice rooms still have texture.
        </p>

        <section className="mt-14">
          <h2 className="font-display text-2xl text-white">Who it’s for</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/65">
            <li className="surface rounded-2xl px-5 py-4">
              <span className="font-medium text-cyan">Curious from zero.</span> You’ve heard the noise.
              You want a simple picture of what this stuff actually is — and a path to get good.
            </li>
            <li className="surface rounded-2xl px-5 py-4">
              <span className="font-medium text-cyan">Makers who think differently.</span> You care about
              craft, atmosphere, and collaboration — not checklist certificates.
            </li>
            <li className="surface rounded-2xl px-5 py-4">
              <span className="font-medium text-cyan">Advanced, still hungry.</span> Skip the baby talk;
              use Practice and the Field as a sharpening stone. Depth lives in the reps.
            </li>
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl text-white">How a visit works</h2>
          <p className="mt-3 text-sm text-white/55">Four doors. Any order works. This is the gentle path:</p>
          <ol className="mt-6 space-y-4">
            {visitSteps.map((step) => (
              <li key={step.n} className="surface rounded-3xl p-6">
                <div className="flex gap-4">
                  <span className="font-display text-sm text-cyan">{step.n}</span>
                  <div>
                    <h3 className="font-display text-xl text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{step.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl text-white">From nothing to fluency</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            You don’t need a giant curriculum dump. You need a ladder of plain ideas — the kind you
            could explain at the kitchen table — with optional deeper asides if you want them.
          </p>
          <div className="mt-6 space-y-5">
            {ladder.map((rung, i) => (
              <article key={rung.title} className="surface rounded-3xl p-6">
                <p className="font-display text-xs tracking-[0.2em] text-solar-gold">
                  RUNG {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-xl text-white">{rung.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{rung.plain}</p>
                <details className="mt-4 group">
                  <summary className="cursor-pointer list-none text-xs font-medium tracking-wide text-cyan/90 hover:text-cyan">
                    <span className="underline-offset-2 group-open:underline">Deeper aside</span>
                  </summary>
                  <p className="mt-2 text-xs leading-relaxed text-white/50">{rung.deep}</p>
                </details>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 surface rounded-3xl p-6 sm:p-8">
          <h2 className="font-display text-2xl text-white">Your next move</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            Pick one. Don’t collect all the doors. Start a short practice module, or open the Field and
            learn by gesture. Sound can unlock in the corner whenever you want it — soundtrack stays optional.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/practice/prompt-craft"
              className="rounded-full bg-magenta px-6 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(255,42,109,0.3)] transition duration-medium ease-organic hover:bg-magenta/90"
            >
              Start first practice
            </Link>
            <Link
              href="/field"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/85 transition duration-medium ease-organic hover:border-cyan/50 hover:text-cyan"
            >
              Open the Field
            </Link>
            <Link
              href="/practice"
              className="rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-white/60 transition duration-medium ease-organic hover:border-white/25 hover:text-white/85"
            >
              Browse all modules
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
