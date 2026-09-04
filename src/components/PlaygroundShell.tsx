"use client";

import { useState } from "react";

const starters = [
  "Describe a feeling instead of a result",
  "Give the AI a constraint that forces originality",
  "Ask it to become a collaborator rather than a tool",
];

export function PlaygroundShell() {
  const [prompt, setPrompt] = useState(starters[0]);
  const [draft, setDraft] = useState("");

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="surface rounded-3xl p-6 sm:p-8">
        <p className="font-display text-xs tracking-[0.24em] text-magenta">PLAYGROUND</p>
        <h2 className="mt-2 font-display text-2xl text-white">Compose before you send</h2>
        <p className="mt-3 text-sm text-white/60">
          A local rehearsal space. Paste or write a prompt, refine it here, then carry it to your preferred model.
          No API calls, no accounts.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {starters.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setPrompt(s)}
              className="rounded-full border border-white/10 px-3 py-1.5 text-left text-xs text-white/65 hover:border-cyan/40 hover:text-cyan"
            >
              {s}
            </button>
          ))}
        </div>
        <label className="mt-6 block text-xs tracking-wide text-white/45" htmlFor="prompt">
          Prompt seed
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mt-2 min-h-[120px] w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/90 outline-none focus:border-magenta/40"
        />
      </div>

      <div className="surface rounded-3xl p-6 sm:p-8">
        <label className="block text-xs tracking-wide text-white/45" htmlFor="draft">
          Working draft
        </label>
        <textarea
          id="draft"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Expand the seed. Add constraints. Leave room for surprise."
          className="mt-2 min-h-[280px] w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-relaxed text-white/90 outline-none focus:border-violet/40"
        />
        <p className="mt-4 text-xs text-white/40">
          Tip: keep one constraint visible while you revise — originality thrives under pressure.
        </p>
      </div>
    </div>
  );
}
