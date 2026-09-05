export const lessonVideos = {
  orientation: { youtubeId: "" },
  whatItIs: { youtubeId: "" },
  whatItCanDo: { youtubeId: "" },
  howAndWhy: { youtubeId: "" },
  practice: { youtubeId: "" },
} as const;

export type LessonVideoKey = keyof typeof lessonVideos;
