import type { LessonVideoKey } from "@/lib/lessonVideos";

export const practiceLesson = {
  id: 'practice',
  slug: '/practice',
  eyebrow: 'Lesson 4 of 4',
  title: 'One real task',
  next: '/notes',
  nextLabel: 'Open Notes',
  videoKey: 'practice' as LessonVideoKey,
  body: 'Pick one thing that is actually yours this week. Not a hypothetical startup. Not “write me a poem about AI.”\n\nGood picks:\n\n- A message you owe someone\n- A pile of notes that is stressing you\n- A paragraph you do not understand\n- A plan with a budget and a time you have to leave work\n\n## The sitting (about 20 minutes)\n\n1. Write the four-line brief in Notes. (5 minutes)\n2. Paste it into whatever chat you already use. (1 minute)\n3. Read the reply out loud. Mark one sentence that is true and one that is off. (5 minutes)\n4. Ask for a single revision: “Keep X. Fix Y. Do not add new ideas.” (3 minutes)\n5. Copy the keeper into Notes. Close the chat. (2 minutes)\n\nIf the topic was a FIND question (hours, price, dose, law), your last step is: confirm somewhere that is not the chat.\n\nThis site does not run the model for you. The method travels. Use the tool you already have.\n\n## Done looks like\n\n- You have a fragment you could show another human\n- You can say whether the job was FIND or MAKE\n- You did not accept the first reply whole\n\nThat is fluency enough for a first visit.\n\n> It generates, it does not retrieve. It helps me when I can judge the draft. I aim it with a brief.\n\nThe city, the sound, and the field are still here if you want the building. The class is this sitting.',
  exercise: '',
} as const;
