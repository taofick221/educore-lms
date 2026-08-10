import { Link } from "react-router-dom";
import type { Enrollment } from "../../types/enrollment";

interface Props {
  enrollment: Enrollment;
}

function EnrollmentCard({ enrollment }: Props) {
  const progress = Math.min(
    Math.max(
      enrollment.progress_percentage,
      0,
    ),
    100,
  );

  const completed = progress === 100;

  return (
    <Link
      to={`/learning/${enrollment.id}`}
      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {/* Course Header */}

      <div className="relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 sm:h-36">
        {/* Decorative shapes */}

        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10" />

        <div className="absolute -bottom-10 -left-8 h-28 w-28 rounded-full bg-white/10" />

        <span className="relative text-4xl font-black tracking-tight text-white/90 sm:text-5xl">
          E
        </span>

        {/* Status */}

        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm sm:right-4 sm:top-4 ${
            completed
              ? "bg-emerald-500 text-white"
              : "bg-white text-indigo-700"
          }`}
        >
          {completed
            ? "Completed"
            : "In Progress"}
        </span>
      </div>

      {/* Course Information */}

      <div className="p-4 sm:p-5">

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Course
            </p>

            <h2 className="mt-1 line-clamp-2 text-base font-bold leading-6 text-gray-900 transition group-hover:text-indigo-600 sm:text-lg">
              {enrollment.course_title}
            </h2>
          </div>

          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${
              completed
                ? "bg-emerald-50 text-emerald-700"
                : "bg-indigo-50 text-indigo-700"
            }`}
          >
            {enrollment.status}
          </span>

        </div>

        {/* Progress */}

        <div className="mt-5">

          <div className="mb-1.5 flex items-center justify-between text-xs">

            <span className="font-medium text-gray-500">
              Progress
            </span>

            <span
              className={`font-bold ${
                completed
                  ? "text-emerald-600"
                  : "text-indigo-600"
              }`}
            >
              {progress}%
            </span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                completed
                  ? "bg-emerald-500"
                  : "bg-indigo-600"
              }`}
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

        </div>

        {/* Footer */}

        <div className="mt-4 border-t border-gray-100 pt-3">

          <div
            className={`text-sm font-bold ${
              completed
                ? "text-emerald-600 group-hover:text-emerald-700"
                : "text-indigo-600 group-hover:text-indigo-700"
            }`}
          >
            {completed
              ? "Review Course"
              : "Continue Learning"}

            <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </div>

        </div>
      </div>
    </Link>
  );
}

export default EnrollmentCard;