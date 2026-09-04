"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAudioUi } from "./MuteControl";

const fade = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.56, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Hero() {
  const { reducedMotion, unlock } = useAudioUi();

  return (
    <section className="relative overflow-hidden bg-rave-glow">
      <div className="pointer-events-none absolute inset-0 grid-noise opacity-60" aria-hidden />
      <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-center px-4 py-20 sm:px-6 lg:py-28">
        <motion.p
          className="mb-4 font-display text-xs font-semibold tracking-[0.28em] text-magenta text-glow-magenta"
          custom={0}
          initial={reducedMotion ? false : "hidden"}
          animate="show"
          variants={fade}
        >
          OCELOT CLAW STUDIOS
        </motion.p>
        <motion.h1
          className="max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          custom={1}
          initial={reducedMotion ? false : "hidden"}
          animate="show"
          variants={fade}
        >
          VibeCodeCity
        </motion.h1>
        <motion.p
          className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl"
          custom={2}
          initial={reducedMotion ? false : "hidden"}
          animate="show"
          variants={fade}
        >
          An immersive academy for creative AI literacy, built for minds that think differently.
          Learn to wield AI as a tool. Drop into deeper creative states through intentional sound
          and entrainment. Create with more presence, less friction.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-wrap items-center gap-4"
          custom={3}
          initial={reducedMotion ? false : "hidden"}
          animate="show"
          variants={fade}
        >
          <Link
            href="/orientation"
            onClick={() => {
              void unlock();
            }}
            className="rounded-full bg-magenta px-7 py-3 font-display text-sm font-semibold tracking-wide text-white shadow-[0_0_32px_rgba(255,42,109,0.35)] transition duration-medium ease-organic hover:bg-magenta/90 hover:shadow-[0_0_40px_rgba(255,42,109,0.5)]"
          >
            Enter
          </Link>
          <Link
            href="/practice"
            className="rounded-full border border-white/20 bg-white/5 px-7 py-3 font-display text-sm font-semibold tracking-wide text-white/90 transition duration-medium ease-organic hover:border-cyan/50 hover:text-cyan"
          >
            Begin
          </Link>
        </motion.div>
        <motion.p
          className="mt-8 text-sm text-white/45"
          custom={4}
          initial={reducedMotion ? false : "hidden"}
          animate="show"
          variants={fade}
        >
          Hybrid nocturnal craft · solar accents · no waitlist theater
        </motion.p>
      </div>
    </section>
  );
}
