export type PracticeModule = {
  slug: string;
  title: string;
  subtitle: string;
  duration: string;
  accent: "magenta" | "cyan" | "violet" | "chlorophyll" | "solar-gold";
  summary: string;
  beats: string[];
};

export const practiceModules: PracticeModule[] = [
  {
    slug: "prompt-craft",
    title: "Prompt Craft",
    subtitle: "Language as material",
    duration: "18 min",
    accent: "magenta",
    summary:
      "Treat prompts as creative constraints. Learn to shape intent so the model becomes a collaborator instead of a vending machine.",
    beats: [
      "Describe a feeling instead of a result",
      "Give the AI a constraint that forces originality",
      "Ask it to become a collaborator rather than a tool",
    ],
  },
  {
    slug: "constraint-studio",
    title: "Constraint Studio",
    subtitle: "Limits that liberate",
    duration: "22 min",
    accent: "cyan",
    summary:
      "Build originality by narrowing the field. Practice inventing rules that make generic answers impossible.",
    beats: [
      "Pick one forbidden word and one required texture",
      "Force a medium shift mid-response",
      "Cap length until every sentence earns its place",
    ],
  },
  {
    slug: "presence-loop",
    title: "Presence Loop",
    subtitle: "Less friction, more attention",
    duration: "15 min",
    accent: "violet",
    summary:
      "Slow the dialogue. Use intentional pauses, sound, and short cycles so you stay inside the work instead of racing past it.",
    beats: [
      "One question, one breath, one revision",
      "Name what you notice before you ask for more",
      "End sessions with a single salvageable fragment",
    ],
  },
  {
    slug: "field-literacy",
    title: "Field Literacy",
    subtitle: "Tuning Field practice",
    duration: "20 min",
    accent: "chlorophyll",
    summary:
      "Map creative state to gesture. Use the Tuning Field to rehearse prompts that invite atmosphere, not just output.",
    beats: [
      "Describe a feeling instead of a result",
      "Give the AI a constraint that forces originality",
      "Ask it to become a collaborator rather than a tool",
    ],
  },
];

export function getModule(slug: string) {
  return practiceModules.find((m) => m.slug === slug);
}
