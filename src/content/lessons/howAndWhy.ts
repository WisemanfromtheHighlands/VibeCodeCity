import type { LessonVideoKey } from "@/lib/lessonVideos";

export const howAndWhyLesson = {
  id: 'howAndWhy',
  slug: '/learn/how-and-why',
  eyebrow: 'Lesson 3 of 4',
  title: 'Give it a brief',
  next: '/practice',
  nextLabel: 'Next — One real task',
  videoKey: 'howAndWhy' as LessonVideoKey,
  body: 'You do not need a prompt library. You need a brief, the same way you would brief a person who is fast, willing, and new.\n\n## The four lines\n\n1. **Job** — what we are making\n2. **Who** — who it is for, including you\n3. **Good** — what done looks like (length, tone, form)\n4. **Avoid** — the thing it will do if you say nothing\n\nThen: read. Keep a piece. Ask once more if needed. Stop.\n\n## Why this works\n\nThe machine is completing a pattern, not fetching a true page and not reading your mind.\n\nIf you say “write something nice to my landlord,” the pattern it completes is a million polite internet letters. Vague in, average out.\n\nIf you say the heat has been out three days, you want firm and short, no threats, no fake friendliness, under 150 words — now the pattern has rails. You can see whether the rails held.\n\nYou stay the editor because the model has no stakes. You do.\n\n<details>\n<summary>Deeper aside</summary>\n\nPeople who live in this tool all day treat it like a junior partner: they aim, they cut, they keep fragments. That is a later habit, not tonight’s homework. Tonight is four lines and one honest read.\n</details>\n\n## Worked example — before and after\n\n**Fancy Google (before):**\n\n```\nemail to landlord about heat\n```\n\nTypical reply: generic polite, “I hope this message finds you well,” no dates, no ask.\n\n**Brief (after):**\n\n```\nJob: email to my landlord\nWho: they are busy; I am tired of being cold; I want this fixed, not a fight\nGood: under 150 words, firm, specific, one clear ask\nAvoid: threats, sarcasm, "I hope this finds you well," legal language I don\'t mean\n\nFacts: heat out since Tuesday, apartment 2B, I texted the office once already\nAsk: restore heat by tomorrow evening or send a technician time\n```\n\nNow you have something you can send after one pass in your own voice.\n\n## What “stop” means\n\nTwo rounds is usually plenty for a letter. If you are on round seven, you are using the model to avoid deciding. Notes exist so you can walk away with a fragment instead of an endless thread.',
  exercise: 'Take the Job / Who / Judge lines from Lesson 2. Add **Good** and **Avoid**.\n\nWrite the full brief in Notes. You do not have to paste it into a model on this site. The brief is the work.',
} as const;
