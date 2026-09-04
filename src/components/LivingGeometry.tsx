"use client";

import { useEffect, useRef } from "react";
import { useAudioUi } from "./MuteControl";

type Accent = { r: number; g: number; b: number; a: number };

const ACCENTS: Accent[] = [
  { r: 255, g: 42, b: 109, a: 0.55 }, // magenta
  { r: 0, g: 240, b: 255, a: 0.5 }, // cyan
  { r: 177, g: 78, b: 255, a: 0.48 }, // violet
  { r: 245, g: 197, b: 66, a: 0.42 }, // solar-gold
  { r: 61, g: 220, b: 151, a: 0.4 }, // chlorophyll
];

function rgba(c: Accent, a?: number) {
  return `rgba(${c.r},${c.g},${c.b},${a ?? c.a})`;
}

/**
 * Full-bleed sacred/fractal field behind the hero.
 * Pointer/touch gently warps; coherence rises as movement slows
 * (Tuning Field philosophy preview).
 */
export function LivingGeometry({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { reducedMotion } = useAudioUi();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let running = true;
    let t0 = performance.now();

    const pointer = {
      x: 0.5,
      y: 0.5,
      tx: 0.5,
      ty: 0.5,
      speed: 0,
      coherence: 1,
    };

    const resize = () => {
      const parent = canvas.parentElement;
      const rect = parent?.getBoundingClientRect() ?? canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const onMove = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nx = (clientX - rect.left) / rect.width;
      const ny = (clientY - rect.top) / rect.height;
      const dx = nx - pointer.tx;
      const dy = ny - pointer.ty;
      pointer.speed = Math.min(1, Math.hypot(dx, dy) * 18);
      pointer.tx = Math.min(1, Math.max(0, nx));
      pointer.ty = Math.min(1, Math.max(0, ny));
    };

    const onPointerMove = (e: PointerEvent) => onMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) {
        t0 = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const drawRing = (
      cx: number,
      cy: number,
      radius: number,
      sides: number,
      rot: number,
      color: Accent,
      lineW: number,
      warp: number,
    ) => {
      ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const a = (i / sides) * Math.PI * 2 + rot;
        const wobble = 1 + Math.sin(a * 3 + rot * 2) * warp * 0.04;
        const rr = radius * wobble;
        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = rgba(color);
      ctx.lineWidth = lineW;
      ctx.stroke();
    };

    const drawStar = (
      cx: number,
      cy: number,
      outer: number,
      inner: number,
      points: number,
      rot: number,
      color: Accent,
      lineW: number,
    ) => {
      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const a = (i / (points * 2)) * Math.PI * 2 + rot;
        const r = i % 2 === 0 ? outer : inner;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = rgba(color);
      ctx.lineWidth = lineW;
      ctx.stroke();
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = w * 0.58;
      const cy = h * 0.48;
      const base = Math.min(w, h) * 0.28;

      ctx.fillStyle = "rgba(7,6,11,0.15)";
      ctx.fillRect(0, 0, w, h);

      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, base * 2.2);
      glow.addColorStop(0, "rgba(177,78,255,0.12)");
      glow.addColorStop(0.4, "rgba(0,240,255,0.06)");
      glow.addColorStop(1, "rgba(7,6,11,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      drawRing(cx, cy, base * 1.15, 6, 0.2, ACCENTS[2], 1.1, 0.2);
      drawRing(cx, cy, base * 0.92, 72, 0, ACCENTS[1], 0.7, 0);
      drawStar(cx, cy, base * 0.78, base * 0.42, 6, 0.35, ACCENTS[0], 1);
      drawRing(cx, cy, base * 0.55, 5, -0.15, ACCENTS[4], 0.9, 0.1);
      drawRing(cx, cy, base * 0.32, 3, 0.4, ACCENTS[3], 0.8, 0);

      // soft secondary node
      const sx = w * 0.22;
      const sy = h * 0.62;
      drawRing(sx, sy, base * 0.28, 6, 0.5, ACCENTS[1], 0.6, 0);
      drawRing(sx, sy, base * 0.16, 36, 0, ACCENTS[4], 0.45, 0);
    };

    const frame = (now: number) => {
      if (!running) return;
      if (reducedMotion) {
        drawStatic();
        return;
      }

      const t = (now - t0) / 1000;

      // ease pointer + coherence (slow movement → higher coherence)
      pointer.x += (pointer.tx - pointer.x) * 0.045;
      pointer.y += (pointer.ty - pointer.y) * 0.045;
      pointer.speed *= 0.92;
      const targetCoherence = 1 - pointer.speed * 0.55;
      pointer.coherence += (targetCoherence - pointer.coherence) * 0.03;

      ctx.clearRect(0, 0, w, h);

      const cx = w * (0.52 + (pointer.x - 0.5) * 0.06);
      const cy = h * (0.46 + (pointer.y - 0.5) * 0.05);
      const base = Math.min(w, h) * 0.3;
      const warp = (1 - pointer.coherence) * 2.2;
      const rot = t * 0.06;

      // void wash + soft field bloom under geometry
      const bloom = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        base * (2.4 + pointer.coherence * 0.3),
      );
      bloom.addColorStop(0, `rgba(177,78,255,${0.1 + pointer.coherence * 0.06})`);
      bloom.addColorStop(0.35, `rgba(0,240,255,${0.05 + pointer.coherence * 0.04})`);
      bloom.addColorStop(0.7, `rgba(61,220,151,${0.03 + pointer.coherence * 0.02})`);
      bloom.addColorStop(1, "rgba(7,6,11,0)");
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, w, h);

      // pointer warp glow
      const px = pointer.x * w;
      const py = pointer.y * h;
      const pg = ctx.createRadialGradient(px, py, 0, px, py, Math.max(w, h) * 0.28);
      pg.addColorStop(0, `rgba(255,42,109,${0.06 + (1 - pointer.coherence) * 0.05})`);
      pg.addColorStop(0.5, `rgba(245,197,66,${0.03 * pointer.coherence})`);
      pg.addColorStop(1, "rgba(7,6,11,0)");
      ctx.fillStyle = pg;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // nested sacred rings
      drawRing(cx, cy, base * 1.22, 6, rot * 0.7, ACCENTS[2], 1.05, warp);
      drawRing(cx, cy, base * 1.05, 96, -rot * 0.35, ACCENTS[1], 0.55, warp * 0.4);
      drawStar(cx, cy, base * 0.88, base * 0.46, 6, rot * 0.9 + 0.2, ACCENTS[0], 1.05);
      drawRing(cx, cy, base * 0.7, 5, -rot * 1.1, ACCENTS[4], 0.85, warp * 0.6);
      drawStar(cx, cy, base * 0.48, base * 0.22, 8, -rot * 0.55, ACCENTS[3], 0.75);
      drawRing(cx, cy, base * 0.28, 3, rot * 1.4, ACCENTS[1], 0.7, warp * 0.3);

      // radial spokes (subtle)
      ctx.strokeStyle = rgba(ACCENTS[2], 0.12 + pointer.coherence * 0.1);
      ctx.lineWidth = 0.6;
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 + rot * 0.4;
        const r0 = base * 0.12;
        const r1 = base * (1.05 + Math.sin(t * 0.4 + i) * 0.02 * warp);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
        ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
        ctx.stroke();
      }

      // secondary solarpunk node
      const sx = w * (0.2 + (pointer.x - 0.5) * -0.03);
      const sy = h * (0.68 + (pointer.y - 0.5) * -0.02);
      const sr = base * 0.32;
      drawRing(sx, sy, sr, 6, -rot * 0.8, ACCENTS[4], 0.7, warp * 0.5);
      drawRing(sx, sy, sr * 0.58, 48, rot * 0.5, ACCENTS[1], 0.45, 0);
      drawRing(sx, sy, sr * 0.28, 3, rot, ACCENTS[3], 0.65, 0);

      // tertiary violet mote
      const tx = w * 0.78;
      const ty = h * 0.28;
      drawRing(tx, ty, base * 0.14, 5, rot * 1.2, ACCENTS[2], 0.55, warp * 0.3);

      ctx.restore();

      // soft film grain speckles (very sparse)
      if (pointer.coherence > 0.7) {
        ctx.fillStyle = "rgba(255,255,255,0.015)";
        for (let i = 0; i < 18; i++) {
          const gx = ((Math.sin(t * 0.2 + i * 12.3) * 0.5 + 0.5) * w) | 0;
          const gy = ((Math.cos(t * 0.17 + i * 7.1) * 0.5 + 0.5) * h) | 0;
          ctx.fillRect(gx, gy, 1, 1);
        }
      }

      raf = requestAnimationFrame(frame);
    };

    if (reducedMotion) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden
    />
  );
}
