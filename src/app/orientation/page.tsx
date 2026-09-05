import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { lessons } from "@/lib/lessons";

export const metadata: Metadata = {
  title: "Orientation",
  description:
    "What this is, before you touch anything — the VibeCodeCity.cloud literacy class map.",
};

export default function OrientationPage() {
  return <LessonShell lesson={lessons.orientation} />;
}
