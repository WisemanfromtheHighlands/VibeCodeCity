import type { LessonVideoKey } from "@/lib/lessonVideos";

export const orientationLesson = {
  id: 'orientation',
  slug: '/orientation',
  eyebrow: 'Orientation',
  title: 'What this is, before you touch anything',
  next: '/learn/what-it-is',
  nextLabel: 'Next — What it is',
  videoKey: 'orientation' as LessonVideoKey,
  body: 'Most people use AI like a smarter search box. Type a question. Skim. Leave.\n\nThat is not stupid. It is incomplete. Search finds a page that already exists. This writes a new page that *sounds* like it should exist. Mixing those jobs is why the tool feels magic one minute and useless the next.\n\nThis campus answers three questions:\n\n1. What is this, really?\n2. What can it do for me?\n3. How — and why does that work?\n\nYou do not need a computer-science background. You do not need to care how old the idea is. You can watch the video when it exists, or only read. Same class either way.\n\n## Who this is for\n\n- People who already “Google with extra steps” and want a straight answer\n- Beginners who want plain speech\n- Anyone who likes a deeper note — those stay folded\n\nThis is not a course in becoming a developer. It is literacy.\n\n## The four lessons\n\n1. **What it is** — search retrieves; this generates\n2. **What it can do** — drafts you can judge; not verdicts you cannot\n3. **How and why** — four lines that turn a vague ask into a brief\n4. **One real task** — do the method once on something from your week\n\nThe city, the field, and the optional soundtrack are the building. This is the class.',
  exercise: 'In Notes, write one sentence: the last thing you asked an AI this week, and whether you treated the answer like a search result or like a draft.',
} as const;
