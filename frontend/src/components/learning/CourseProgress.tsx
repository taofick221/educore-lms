interface Props {
  progress: number;
}

function CourseProgress({
  progress,
}: Props) {
  const safeProgress = Math.min(
    100,
    Math.max(0, progress),
  );

  const isCompleted =
    safeProgress >= 100;

  return (
    <div>
      {/* ==================================================
          Progress Header
      ================================================== */}

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold text-gray-700 sm:text-sm">
            Course progress
          </p>

          <p className="mt-0.5 truncate text-[10px] text-gray-400 sm:text-xs">
            {isCompleted
              ? "Course completed"
              : "Keep learning"}
          </p>
        </div>

        <span
          className={`shrink-0 text-xs font-extrabold sm:text-sm ${
            isCompleted
              ? "text-emerald-600"
              : "text-indigo-600"
          }`}
        >
          {safeProgress}%
        </span>
      </div>

      {/* ==================================================
          Progress Bar
      ================================================== */}

      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-200 sm:mt-2 sm:h-2">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isCompleted
              ? "bg-emerald-500"
              : "bg-indigo-600"
          }`}
          style={{
            width: `${safeProgress}%`,
          }}
        />
      </div>
    </div>
  );
}

export default CourseProgress;