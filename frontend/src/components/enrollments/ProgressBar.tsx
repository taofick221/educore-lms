interface Props {
  progress: number;
  showLabel?: boolean;
  size?: "sm" | "md";
}

function ProgressBar({
  progress,
  showLabel = true,
  size = "md",
}: Props) {
  const safeProgress = Math.min(
    100,
    Math.max(0, progress),
  );

  const isCompleted =
    safeProgress >= 100;

  const height =
    size === "sm" ? "h-1.5" : "h-2";

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-gray-500">
            Progress
          </span>

          <span
            className={`text-xs font-bold ${
              isCompleted
                ? "text-emerald-600"
                : "text-indigo-600"
            }`}
          >
            {safeProgress}%
          </span>
        </div>
      )}

      <div
        className={`w-full overflow-hidden rounded-full bg-gray-100 ${height}`}
      >
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

export default ProgressBar;