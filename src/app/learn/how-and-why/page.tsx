import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { lessons } from "@/lib/lessons";

export const metadata: Metadata = {
  title: "How and why",
  description: "Give it a brief — four lines that turn a vague ask into aim.",
};

export default function HowAndWhyPage() {
  return <LessonShell lesson={lessons.howAndWhy} />;
}
