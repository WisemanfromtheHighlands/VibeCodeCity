import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { lessons } from "@/lib/lessons";

export const metadata: Metadata = {
  title: "What it can do",
  description: "When the draft is useful.",
};

export default function WhatItCanDoPage() {
  return <LessonShell lesson={lessons.whatItCanDo} />;
}
