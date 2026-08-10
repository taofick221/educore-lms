import { Link } from "react-router-dom";
import { useEnrollments } from "../../hooks/useEnrollments";

function MyCoursesPage() {
  const {
    enrollments,
    loading,
    error,
  } = useEnrollments();

  return (
    <section className="min-h-screen bg-gray-50">
      {/* ==================================================
          Header
      ================================================== */}

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-9">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 sm:text-xs">
                Learning Library
              </p>

              <h1 className="mt-1 text-xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                My Courses
              </h1>

              <p className="mt-1 max-w-xl text-xs leading-5 text-gray-500 sm:mt-1.5 sm:text-sm sm:leading-6">
                Continue where you left off and track your
                learning progress.
              </p>
            </div>

            <Link
              to="/courses"
              className="inline-flex min-h-9 w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:min-h-10 sm:w-auto sm:rounded-xl sm:px-5 sm:py-2.5 sm:text-sm"
            >
              Browse Courses
              <span className="ml-1.5">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ==================================================
          Content
      ================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        {/* ==================================================
            Loading
        ================================================== */}

        {loading && (
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:rounded-2xl"
              >
                <div className="h-32 animate-pulse bg-gray-200 sm:h-40" />

                <div className="space-y-2.5 p-4 sm:space-y-3 sm:p-5">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 sm:h-5" />

                  <div className="h-3 w-full animate-pulse rounded bg-gray-200" />

                  <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />

                  <div className="pt-1">
                    <div className="h-1.5 w-full animate-pulse rounded-full bg-gray-200 sm:h-2" />
                  </div>

                  <div className="h-3 w-28 animate-pulse rounded bg-gray-200 sm:h-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==================================================
            Error
        ================================================== */}

        {!loading && error && (
          <div className="rounded-xl border border-red-100 bg-white px-4 py-8 text-center shadow-sm sm:rounded-2xl sm:px-8 sm:py-10">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-red-600">
              !
            </div>

            <h2 className="mt-3 text-sm font-bold text-gray-900 sm:text-lg">
              Unable to load your courses
            </h2>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Please try again later.
            </p>
          </div>
        )}

        {/* ==================================================
            Empty
        ================================================== */}

        {!loading &&
          !error &&
          enrollments.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-9 text-center shadow-sm sm:rounded-2xl sm:px-6 sm:py-12">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-xl sm:h-14 sm:w-14 sm:rounded-2xl sm:text-2xl">
                📚
              </div>

              <h2 className="mt-3 text-base font-bold text-gray-900 sm:mt-4 sm:text-xl">
                No courses yet
              </h2>

              <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">
                You haven't enrolled in any courses.
                Explore our course library and start learning.
              </p>

              <Link
                to="/courses"
                className="mt-4 inline-flex min-h-9 w-full items-center justify-center rounded-lg bg-indigo-600 px-5 py-2 text-xs font-bold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-5 sm:min-h-10 sm:w-auto sm:rounded-xl sm:py-2.5 sm:text-sm"
              >
                Explore Courses
              </Link>
            </div>
          )}

        {/* ==================================================
            Course Grid
        ================================================== */}

        {!loading &&
          !error &&
          enrollments.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {enrollments.map(
                (enrollment) => {
                  const progress =
                    Math.min(
                      Math.max(
                        enrollment.progress_percentage,
                        0,
                      ),
                      100,
                    );

                  const completed =
                    progress === 100;

                  return (
                    <Link
                      key={enrollment.id}
                      to={`/learning/${enrollment.id}`}
                      className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:rounded-2xl"
                    >
                      {/* ==================================================
                          Course Visual
                      ================================================== */}

                      <div className="relative flex h-32 shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 sm:h-40">
                        {/* Decorative shapes */}

                        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 sm:h-28 sm:w-28" />

                        <div className="absolute -bottom-8 -left-7 h-24 w-24 rounded-full bg-white/10 sm:h-28 sm:w-28" />

                        <div className="absolute right-1/4 top-1/4 h-10 w-10 rounded-full bg-white/5 sm:h-12 sm:w-12" />

                        <span className="relative text-4xl font-black tracking-tight text-white/90 sm:text-5xl">
                          E
                        </span>

                        {/* Status */}

                        <span
                          className={`absolute right-2.5 top-2.5 rounded-full px-2 py-0.5 text-[9px] font-bold shadow-sm sm:right-4 sm:top-4 sm:px-2.5 sm:py-1 sm:text-[11px] ${
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

                      {/* ==================================================
                          Information
                      ================================================== */}

                      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
                        <div className="flex items-start justify-between gap-2.5">
                          <h2 className="line-clamp-2 text-sm font-extrabold leading-5 text-gray-900 transition group-hover:text-indigo-600 sm:text-lg sm:leading-6">
                            {enrollment.course_title}
                          </h2>

                          <span
                            className={`shrink-0 text-xs font-extrabold sm:text-sm ${
                              completed
                                ? "text-emerald-600"
                                : "text-indigo-600"
                            }`}
                          >
                            {progress}%
                          </span>
                        </div>

                        {/* ==================================================
                            Progress
                        ================================================== */}

                        <div className="mt-3 sm:mt-4">
                          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 sm:h-2">
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

                          <div className="mt-1 flex items-center justify-between text-[10px] sm:mt-1.5 sm:text-[11px]">
                            <span className="text-gray-400">
                              Course progress
                            </span>

                            <span className="font-semibold text-gray-500">
                              {progress}%
                            </span>
                          </div>
                        </div>

                        {/* ==================================================
                            CTA
                        ================================================== */}

                        <div className="mt-auto pt-3 sm:pt-4">
                          <div className="border-t border-gray-100 pt-2.5 sm:pt-3">
                            <span
                              className={`text-xs font-bold transition sm:text-sm ${
                                completed
                                  ? "text-emerald-600 group-hover:text-emerald-700"
                                  : "text-indigo-600 group-hover:text-indigo-700"
                              }`}
                            >
                              {completed
                                ? "Review Course"
                                : "Continue Learning"}

                              <span className="ml-1 transition-transform group-hover:translate-x-0.5">
                                →
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                },
              )}
            </div>
          )}
      </div>
    </section>
  );
}

export default MyCoursesPage;