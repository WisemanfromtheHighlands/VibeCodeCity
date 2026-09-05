"use client";

import { useEffect, useRef, useState } from "react";
import { useAudioUi } from "./MuteControl";

const PROMPTS = [
  "Describe a feeling instead of a result",
  "Give the AI a constraint that forces originality",
  "Ask it to become a collaborator rather than a tool",
];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
};

export function TuningField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [promptIndex, setPromptIndex] = useState(0);
  const { reducedMotion } = useAudioUi();
  const pointer = useRef({ x: 0.5, y: 0.5, active: false });

  useEffect(() => {
    const id = window.setInterval(() => {
      setPromptIndex((i) => (i + 1) % PROMPTS.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let particles: Particle[] = [];
    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = reducedMotion ? 24 : 70;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.2 + Math.random() * 2.4,
        hue: Math.random() > 0.5 ? 320 : 185,
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.fillStyle = "rgba(7, 6, 11, 0.22)";
      ctx.fillRect(0, 0, w, h);

      const px = pointer.current.x * w;
      const py = pointer.current.y * h;

      const glow = ctx.createRadialGradient(px, py, 0, px, py, Math.max(w, h) * 0.35);
      glow.addColorStop(0, "rgba(177, 78, 255, 0.16)");
      glow.addColorStop(0.45, "rgba(0, 240, 255, 0.08)");
      glow.addColorStop(1, "rgba(7, 6, 11, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      particles.forEach((p) => {
        if (!reducedMotion) {
          if (pointer.current.active) {
            const dx = px - p.x;
            const dy = py - p.y;
            const dist = Math.hypot(dx, dy) || 1;
            p.vx += (dx / dist) * 0.02;
            p.vy += (dy / dist) * 0.02;
          }
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          p.x = Math.max(0, Math.min(w, p.x));
          p.y = Math.max(0, Math.min(h, p.y));
        }

        ctx.beginPath();
        ctx.fillStyle =
          p.hue > 250
            ? "rgba(255, 42, 109, 0.75)"
            : "rgba(0, 240, 255, 0.7)";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.beginPath();
      ctx.strokeStyle = "rgba(61, 220, 151, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.arc(px, py, 42, 0, Math.PI * 2);
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-void">
      <canvas
        ref={canvasRef}
        className="h-[420px] w-full touch-none sm:h-[520px]"
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          pointer.current = {
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height,
            active: true,
          };
        }}
        onPointerLeave={() => {
          pointer.current.active = false;
        }}
        aria-label="Tuning Field canvas"
        role="img"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-void via-void/80 to-transparent p-6 sm:p-8">
        <p className="font-display text-xs tracking-[0.24em] text-chlorophyll">TEACHING PROMPT</p>
        <p className="mt-2 max-w-xl font-display text-xl text-white sm:text-2xl" aria-live="polite">
          {PROMPTS[promptIndex]}
        </p>
        <div className="mt-4 flex gap-2" aria-hidden>
          {PROMPTS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-8 rounded-full ${i === promptIndex ? "bg-cyan" : "bg-white/20"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
