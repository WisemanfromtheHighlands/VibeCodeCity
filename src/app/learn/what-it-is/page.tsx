import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { lessons } from "@/lib/lessons";

export const metadata: Metadata = {
  title: "What it is",
  description: "It generates. It does not retrieve.",
};

export default function WhatItIsPage() {
  return <LessonShell lesson={lessons.whatItIs} />;
}
