"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback, useRef } from "react";
import { useAudioUi } from "./MuteControl";
import { LivingGeometry } from "./LivingGeometry";

const ORGANIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fade = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.12 + i * 0.11,
      duration: 0.62,
      ease: ORGANIC,
    },
  }),
};

export function Hero() {
  const { reducedMotion } = useAudioUi();
  const stageRef = useRef<HTMLElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 22, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 22, mass: 0.6 });
  const parallaxX = useTransform(sx, (v) => v * 10);
  const parallaxY = useTransform(sy, (v) => v * 8);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (reducedMotion) return;
      const el = stageRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mx.set(nx);
      my.set(ny);
    },
    [reducedMotion, mx, my],
  );

  const onPointerLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <section
      ref={stageRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative isolate flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-void"
    >
      <LivingGeometry className="z-0" />

      <div className="hero-orb hero-orb-magenta" aria-hidden />
      <div className="hero-orb hero-orb-cyan" aria-hidden />
      <div className="hero-orb hero-orb-solar" aria-hidden />
      <div className="hero-orb hero-orb-chloro" aria-hidden />

      <div className="hero-vignette z-[1]" aria-hidden />
      <div className="hero-grain z-[1] opacity-40" aria-hidden />
      <div className="pointer-events-none absolute inset-0 z-[1] grid-noise opacity-35" aria-hidden />

      <motion.div
        className="relative z-[2] mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-24 sm:px-6 lg:py-28"
        style={reducedMotion ? undefined : { x: parallaxX, y: parallaxY }}
      >
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
          Learn to wield AI as a tool. Optional soundtrack for focus while you learn. Create with
          more presence, less friction.
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
            className="rounded-full bg-magenta px-7 py-3 font-display text-sm font-semibold tracking-wide text-white shadow-[0_0_32px_rgba(255,42,109,0.35)] transition duration-medium ease-organic hover:bg-magenta/90 hover:shadow-[0_0_40px_rgba(255,42,109,0.5)]"
          >
            Enter
          </Link>
          <Link
            href="/city"
            className="rounded-full border border-cyan/40 bg-cyan/10 px-7 py-3 font-display text-sm font-semibold tracking-wide text-cyan shadow-[0_0_28px_rgba(0,240,255,0.18)] transition duration-medium ease-organic hover:border-cyan/70 hover:bg-cyan/15"
          >
            Enter the city
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
          Hybrid nocturnal craft · solar accents · soundtrack stays optional
        </motion.p>
      </motion.div>

      <motion.div
        className="relative z-[2] flex justify-center pb-8 pt-2"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 0.45 }}
        transition={{ delay: 1.1, duration: 0.7, ease: ORGANIC }}
        aria-hidden
      >
        <div className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}
