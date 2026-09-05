import type { LessonVideoKey } from "./lessonVideos";
import { orientationLesson } from "@/content/lessons/orientation";
import { whatItIsLesson } from "@/content/lessons/whatItIs";
import { whatItCanDoLesson } from "@/content/lessons/whatItCanDo";
import { howAndWhyLesson } from "@/content/lessons/howAndWhy";
import { practiceLesson } from "@/content/lessons/practice";

export type Lesson = {
  id: string;
  slug: string;
  eyebrow: string;
  title: string;
  next: string;
  nextLabel: string;
  videoKey: LessonVideoKey;
  body: string;
  exercise: string;
};

export const lessons = {
  orientation: orientationLesson,
  whatItIs: whatItIsLesson,
  whatItCanDo: whatItCanDoLesson,
  howAndWhy: howAndWhyLesson,
  practice: practiceLesson,
} as const satisfies Record<string, Lesson>;

export type LessonId = keyof typeof lessons;

export const classNav = [
  { href: "/orientation", label: "Orientation" },
  { href: "/learn/what-it-is", label: "What it is" },
  { href: "/learn/what-it-can-do", label: "What it can do" },
  { href: "/learn/how-and-why", label: "How and why" },
  { href: "/practice", label: "Practice" },
] as const;
