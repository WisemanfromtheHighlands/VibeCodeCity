import type { Metadata } from "next";
import { NotesPad } from "@/components/NotesPad";

export const metadata: Metadata = {
  title: "Notes",
};

export default function NotesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
      <p className="font-display text-xs tracking-[0.28em] text-violet">NOTES</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">Session residue</h1>
      <p className="mt-4 text-white/65">
        Keep the lines worth returning to. Stored only in this browser.
      </p>
      <div className="mt-10">
        <NotesPad />
      </div>
    </div>
  );
}
