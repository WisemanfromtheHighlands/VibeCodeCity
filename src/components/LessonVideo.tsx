import type { LessonVideoKey } from "@/lib/lessonVideos";
import { lessonVideos } from "@/lib/lessonVideos";

type Props = {
  videoKey: LessonVideoKey;
};

export function LessonVideo({ videoKey }: Props) {
  const { youtubeId } = lessonVideos[videoKey];

  if (!youtubeId) {
    return (
      <div
        className="surface mt-8 flex aspect-video w-full items-center justify-center rounded-3xl px-6 text-center"
        role="status"
      >
        <p className="text-sm text-white/50">
          Video coming. The lesson is the text on this page.
        </p>
      </div>
    );
  }

  return (
    <div className="surface mt-8 overflow-hidden rounded-3xl">
      <div className="aspect-video w-full">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
          title="Lesson video"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
