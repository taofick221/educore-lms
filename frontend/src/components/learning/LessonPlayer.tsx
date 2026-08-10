import type { Lecture } from "../../types/course";

interface Props {
  lecture: Lecture | null;
}

function LessonPlayer({
  lecture,
}: Props) {
  // ==================================================
  // No Lecture Selected
  // ==================================================

  if (!lecture) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl border border-gray-200 bg-gray-50 sm:rounded-2xl">
        <div className="px-4 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-sm text-indigo-600 sm:h-12 sm:w-12 sm:text-base">
            ▶
          </div>

          <p className="mt-2 text-xs font-medium text-gray-500 sm:mt-3 sm:text-sm">
            Select a lesson to start learning.
          </p>
        </div>
      </div>
    );
  }

  const videoUrl =
    lecture.video_url;

  const embedUrl = videoUrl
    ? videoUrl.replace(
        "watch?v=",
        "embed/",
      )
    : "";

  return (
    <div className="min-w-0">
      {/* ==================================================
          Video
      ================================================== */}

      <div className="overflow-hidden rounded-xl bg-black shadow-sm sm:rounded-2xl sm:shadow-lg">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={lecture.title}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex aspect-video items-center justify-center bg-gray-900">
            <div className="px-4 text-center text-white">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm sm:h-14 sm:w-14 sm:text-xl">
                ▶
              </div>

              <p className="mt-2 text-xs text-gray-400 sm:mt-4 sm:text-sm">
                Video not available.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================
          Lecture Information
      ================================================== */}

      <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-5 sm:rounded-2xl sm:p-6 lg:p-7">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 sm:text-xs">
              Lecture
            </p>

            <h1 className="mt-1 text-base font-extrabold leading-5 text-gray-900 sm:mt-1.5 sm:text-xl sm:leading-7 lg:text-2xl">
              {lecture.title}
            </h1>
          </div>

          <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-600 sm:px-3 sm:py-1.5 sm:text-xs">
            {lecture.duration} min
          </span>
        </div>

        {lecture.description && (
          <p className="mt-3 whitespace-pre-line text-xs leading-5 text-gray-600 sm:mt-4 sm:text-sm sm:leading-6 lg:text-base lg:leading-7">
            {lecture.description}
          </p>
        )}
      </div>
    </div>
  );
}

export default LessonPlayer;