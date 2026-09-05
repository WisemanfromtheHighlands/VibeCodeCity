"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { classNav } from "@/lib/lessons";

const roomLinks = [
  { href: "/city", label: "City" },
  { href: "/sound", label: "Sound" },
  { href: "/field", label: "Field" },
  { href: "/notes", label: "Notes" },
  { href: "/playground", label: "Playground" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const learnRef = useRef<HTMLDivElement>(null);

  const learnActive =
    pathname === "/orientation" ||
    pathname === "/practice" ||
    pathname.startsWith("/learn/");

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!learnRef.current?.contains(e.target as Node)) setLearnOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-void/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-display text-sm font-bold tracking-[0.18em] text-white transition duration-medium ease-organic hover:text-cyan sm:text-base"
        >
          VIBECODECITY
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          <div className="relative" ref={learnRef}>
            <button
              type="button"
              className={`rounded-full px-3 py-1.5 text-sm transition duration-fast ease-organic ${
                learnActive
                  ? "bg-white/10 text-cyan"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
              aria-expanded={learnOpen}
              aria-haspopup="true"
              onClick={() => setLearnOpen((v) => !v)}
            >
              Learn
            </button>
            <AnimatePresence>
              {learnOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 top-full z-50 mt-2 min-w-[12rem] rounded-2xl border border-white/10 bg-void/95 p-2 shadow-xl backdrop-blur-xl"
                >
                  {classNav.map((link) => {
                    const active =
                      pathname === link.href || pathname.startsWith(link.href + "/");
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setLearnOpen(false)}
                        className={`block rounded-xl px-3 py-2 text-sm ${
                          active ? "bg-white/10 text-cyan" : "text-white/75 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {roomLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm transition duration-fast ease-organic ${
                  active
                    ? "bg-white/10 text-cyan"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="surface rounded-full px-3 py-1.5 text-sm text-white/80 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/10 md:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              <p className="px-3 pt-1 text-[10px] font-display tracking-[0.2em] text-white/35">
                LEARN
              </p>
              {classNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-cyan"
                >
                  {link.label}
                </Link>
              ))}
              <p className="px-3 pt-3 text-[10px] font-display tracking-[0.2em] text-white/35">
                ROOMS
              </p>
              {roomLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-cyan"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
