"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback, useRef } from "react";
import { useAudioUi } from "./MuteControl";
import { LivingGeometry } from "./LivingGeometry";
import { HeroPlate } from "./HeroPlate";

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
      className="hero-stage relative isolate flex min-h-[100dvh] flex-col justify-center overflow-hidden"
      aria-label="VibeCodeCity.cloud hero"
    >
      {/* Stack back→front: wash → plate → geometry → chrome */}
      <div className="hero-orb hero-orb-solar z-0" aria-hidden />
      <div className="hero-orb hero-orb-cyan z-0" aria-hidden />
      <div className="hero-orb hero-orb-chloro z-0" aria-hidden />
      <div className="hero-orb hero-orb-magenta z-0" aria-hidden />

      <HeroPlate />

      <LivingGeometry className="z-[1]" />

      <div className="hero-scrim z-[1]" aria-hidden />
      <div className="hero-vignette z-[1]" aria-hidden />
      <div className="hero-grain z-[1] opacity-35" aria-hidden />
      <div className="pointer-events-none absolute inset-0 z-[1] grid-noise opacity-30" aria-hidden />

      <motion.div
        className="relative z-[2] mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-24 sm:px-6 lg:py-28"
        style={reducedMotion ? undefined : { x: parallaxX, y: parallaxY }}
      >
        <motion.p
          className="mb-4 font-display text-xs font-semibold tracking-[0.28em] text-gold/90"
          custom={0}
          initial={reducedMotion ? false : "hidden"}
          animate="show"
          variants={fade}
        >
          OCELOT CLAW STUDIOS
        </motion.p>
        <motion.h1
          className="max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-paper sm:text-5xl md:text-6xl lg:text-7xl"
          custom={1}
          initial={reducedMotion ? false : "hidden"}
          animate="show"
          variants={fade}
        >
          VibeCodeCity.cloud
        </motion.h1>
        <motion.div
          className="mt-3"
          custom={1}
          initial={reducedMotion ? false : "hidden"}
          animate="show"
          variants={fade}
        >
          <div className="wordmark-hairline mt-3" aria-hidden />
        </motion.div>
        <motion.p
          className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/75 sm:text-xl"
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
            className="rounded-full bg-gold px-7 py-3 font-display text-sm font-semibold tracking-wide text-void shadow-[0_0_28px_rgba(201,162,39,0.28)] transition duration-medium ease-organic hover:bg-gold-soft hover:shadow-[0_0_36px_rgba(201,162,39,0.4)]"
          >
            Enter
          </Link>
          <Link
            href="/city"
            className="rounded-full border border-cyan/35 bg-cyan/10 px-7 py-3 font-display text-sm font-semibold tracking-wide text-cyan shadow-[0_0_24px_rgba(62,224,232,0.12)] transition duration-medium ease-organic hover:border-cyan/60 hover:bg-cyan/15"
          >
            Enter the city
          </Link>
          <Link
            href="/orientation"
            className="rounded-full border border-paper/20 bg-paper/5 px-7 py-3 font-display text-sm font-semibold tracking-wide text-paper/90 transition duration-medium ease-organic hover:border-chlorophyll/50 hover:text-chlorophyll"
          >
            Begin
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="relative z-[2] flex justify-center pb-8 pt-2"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.1, duration: 0.7, ease: ORGANIC }}
        aria-hidden
      >
        <div className="h-8 w-px bg-gradient-to-b from-gold/50 to-transparent" />
      </motion.div>
    </section>
  );
}
