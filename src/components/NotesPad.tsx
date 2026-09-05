"use client";

import { useEffect, useState } from "react";

const KEY = "vcc-notes-v1";

export function NotesPad() {
  const [text, setText] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setText(saved);
    } catch {
      /* private mode */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, text);
    } catch {
      /* ignore */
    }
  }, [text, ready]);

  return (
    <div className="surface rounded-3xl p-6 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-xs tracking-[0.24em] text-violet">FIELD NOTES</p>
          <h2 className="mt-2 font-display text-2xl text-white">Keep fragments close</h2>
        </div>
        <button
          type="button"
          className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/60 hover:text-white"
          onClick={() => setText("")}
        >
          Clear
        </button>
      </div>
      <p className="mt-3 text-sm text-white/55">
        Local-only scratch pad for prompts, salvageable lines, and session residue. Nothing leaves this browser.
      </p>
      <label className="sr-only" htmlFor="notes">
        Notes
      </label>
      <textarea
        id="notes"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe a feeling instead of a result…"
        className="mt-6 min-h-[280px] w-full resize-y rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-relaxed text-white/90 outline-none transition focus:border-cyan/40"
      />
    </div>
  );
}
