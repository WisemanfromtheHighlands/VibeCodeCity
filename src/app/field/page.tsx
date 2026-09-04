import type { Metadata } from "next";
import { TuningField } from "@/components/TuningField";

export const metadata: Metadata = {
  title: "Tuning Field",
};

export default function FieldPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:py-20">
      <p className="font-display text-xs tracking-[0.28em] text-chlorophyll">TUNING FIELD</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
        Rehearse collaborative prompts
      </h1>
      <p className="mt-4 max-w-2xl text-white/65">
        Move through the field and let teaching prompts rotate. Practice describing feeling, inventing
        constraints, and inviting collaboration — before you open a chat elsewhere.
      </p>
      <div className="mt-10">
        <TuningField />
      </div>
    </div>
  );
}
