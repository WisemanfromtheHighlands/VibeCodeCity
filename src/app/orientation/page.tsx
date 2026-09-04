import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Orientation",
};

const steps = [
  {
    n: "01",
    title: "Arrive",
    body: "You are not behind. Orientation is a soft landing — read the map, pick one door, leave the rest for later.",
  },
  {
    n: "02",
    title: "Wield, don’t worship",
    body: "AI is a tool with texture. Learn to aim it with feeling, constraints, and collaboration language.",
  },
  {
    n: "03",
    title: "Sound as scaffolding",
    body: "Optional immersion beds help you stay inside the work. Mute anytime. Nothing medical is claimed.",
  },
  {
    n: "04",
    title: "Practice in loops",
    body: "Short modules beat marathon bingeing. Capture fragments in Notes. Return when the charge fades.",
  },
];

export default function OrientationPage() {
  return (
    <div className="bg-rave-glow">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
        <p className="font-display text-xs tracking-[0.28em] text-magenta">ORIENTATION</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
          How to move through the city
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-white/70">
          VibeCodeCity is an immersive academy for creative AI literacy, built for minds that think
          differently. Learn to wield AI as a tool. Drop into deeper creative states through intentional
          sound and entrainment. Create with more presence, less friction.
        </p>

        <ol className="mt-12 space-y-6">
          {steps.map((step) => (
            <li key={step.n} className="surface rounded-3xl p-6">
              <div className="flex gap-4">
                <span className="font-display text-sm text-cyan">{step.n}</span>
                <div>
                  <h2 className="font-display text-xl text-white">{step.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{step.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/practice"
            className="rounded-full bg-magenta px-6 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(255,42,109,0.3)]"
          >
            Begin practice
          </Link>
          <Link
            href="/field"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/85 hover:border-cyan/50 hover:text-cyan"
          >
            Enter the Field
          </Link>
        </div>
      </div>
    </div>
  );
}
