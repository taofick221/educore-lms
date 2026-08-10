import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEnrollments } from "../../hooks/useEnrollments";

function DashboardPage() {
  const { user } = useAuth();

  const {
    enrollments,
    loading,
    error,
  } = useEnrollments();

  const activeCourses = enrollments.filter(
    (enrollment) =>
      enrollment.status === "active",
  );

  const completedCourses = enrollments.filter(
    (enrollment) =>
      enrollment.status === "completed",
  );

  const averageProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce(
            (total, enrollment) =>
              total +
              enrollment.progress_percentage,
            0,
          ) / enrollments.length,
        )
      : 0;

  return (
    <section className="min-h-screen bg-gray-50">
      {/* ==================================================
          Welcome Header
      ================================================== */}

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-9">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 sm:text-xs">
                Student Dashboard
              </p>

              <h1 className="mt-1 text-xl font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                Welcome back
                {user?.first_name
                  ? `, ${user.first_name}`
                  : ""}
                !
              </h1>

              <p className="mt-1 max-w-xl text-xs leading-5 text-gray-500 sm:mt-1.5 sm:text-sm lg:text-base">
                Continue your learning journey and keep
                making progress.
              </p>
            </div>

            <Link
              to="/courses"
              className="inline-flex min-h-9 w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:min-h-10 sm:w-auto sm:rounded-xl sm:px-5 sm:text-sm"
            >
              Explore Courses
              <span className="ml-1.5">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ==================================================
          Dashboard Content
      ================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        {/* ==================================================
            Stats
        ================================================== */}

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4 lg:gap-4">
          {/* Enrolled */}

          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-sm text-indigo-600 sm:h-11 sm:w-11 sm:rounded-xl sm:text-lg">
                📚
              </div>

              <span className="hidden text-xs font-semibold text-gray-400 sm:block">
                Courses
              </span>
            </div>

            <p className="mt-3 text-xl font-extrabold text-gray-900 sm:mt-5 sm:text-3xl">
              {enrollments.length}
            </p>

            <p className="mt-0.5 text-[11px] text-gray-500 sm:text-sm">
              Enrolled courses
            </p>
          </div>

          {/* Active */}

          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-sm text-blue-600 sm:h-11 sm:w-11 sm:rounded-xl sm:text-lg">
                ▶
              </div>

              <span className="hidden text-xs font-semibold text-gray-400 sm:block">
                Learning
              </span>
            </div>

            <p className="mt-3 text-xl font-extrabold text-gray-900 sm:mt-5 sm:text-3xl">
              {activeCourses.length}
            </p>

            <p className="mt-0.5 text-[11px] text-gray-500 sm:text-sm">
              Courses in progress
            </p>
          </div>

          {/* Completed */}

          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-sm text-emerald-600 sm:h-11 sm:w-11 sm:rounded-xl sm:text-lg">
                ✓
              </div>

              <span className="hidden text-xs font-semibold text-gray-400 sm:block">
                Completed
              </span>
            </div>

            <p className="mt-3 text-xl font-extrabold text-gray-900 sm:mt-5 sm:text-3xl">
              {completedCourses.length}
            </p>

            <p className="mt-0.5 text-[11px] text-gray-500 sm:text-sm">
              Completed courses
            </p>
          </div>

          {/* Progress */}

          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-sm text-violet-600 sm:h-11 sm:w-11 sm:rounded-xl sm:text-lg">
                ↗
              </div>

              <span className="hidden text-xs font-semibold text-gray-400 sm:block">
                Overall
              </span>
            </div>

            <p className="mt-3 text-xl font-extrabold text-gray-900 sm:mt-5 sm:text-3xl">
              {averageProgress}%
            </p>

            <p className="mt-0.5 text-[11px] text-gray-500 sm:text-sm">
              Average progress
            </p>
          </div>
        </div>

        {/* ==================================================
            Main Dashboard Grid
        ================================================== */}

        <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-6">
          {/* ==================================================
              My Learning
          ================================================== */}

          <div className="min-w-0">
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 sm:text-xs">
                  Your learning
                </p>

                <h2 className="mt-0.5 text-lg font-extrabold tracking-tight text-gray-900 sm:mt-1 sm:text-2xl">
                  Continue Learning
                </h2>
              </div>

              <Link
                to="/my-courses"
                className="shrink-0 rounded-lg px-2 py-1 text-[11px] font-bold text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700 sm:text-sm"
              >
                View all →
              </Link>
            </div>

            {/* Loading */}

            {loading && (
              <div className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                {[1, 2, 3].map(
                  (item) => (
                    <div
                      key={item}
                      className="h-20 animate-pulse rounded-xl bg-white sm:h-28 sm:rounded-2xl"
                    />
                  ),
                )}
              </div>
            )}

            {/* Error */}

            {!loading && error && (
              <div className="mt-3 rounded-xl border border-red-100 bg-red-50 px-4 py-4 sm:mt-4 sm:rounded-2xl sm:px-5 sm:py-6">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600 sm:h-9 sm:w-9 sm:text-sm">
                    !
                  </div>

                  <div>
                    <p className="text-xs font-bold text-red-700 sm:text-sm">
                      Unable to load your courses.
                    </p>

                    <p className="mt-0.5 text-[11px] text-red-600 sm:text-xs">
                      Please try again later.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Empty */}

            {!loading &&
              !error &&
              enrollments.length === 0 && (
                <div className="mt-3 rounded-xl border border-dashed border-gray-300 bg-white px-4 py-8 text-center sm:mt-4 sm:rounded-2xl sm:px-5 sm:py-10">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-lg sm:h-14 sm:w-14 sm:rounded-2xl sm:text-xl">
                    📚
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-gray-900 sm:mt-4 sm:text-base">
                    Start your learning journey
                  </h3>

                  <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-gray-500 sm:mt-1.5 sm:text-sm sm:leading-6">
                    You haven't enrolled in any courses yet.
                  </p>

                  <Link
                    to="/courses"
                    className="mt-4 inline-flex min-h-9 items-center rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-700 sm:mt-5 sm:rounded-xl sm:px-5 sm:py-2.5 sm:text-sm"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}

            {/* Enrollment List */}

            {!loading &&
              !error &&
              enrollments.length > 0 && (
                <div className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                  {enrollments
                    .slice(0, 4)
                    .map(
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
                            key={
                              enrollment.id
                            }
                            to={`/learning/${enrollment.id}`}
                            className="group block rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:rounded-2xl sm:p-5"
                          >
                            <div className="flex items-center gap-2.5 sm:gap-4">
                              {/* Course Icon */}

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-violet-100 text-sm font-black text-indigo-600 sm:h-14 sm:w-14 sm:rounded-xl sm:text-lg">
                                E
                              </div>

                              {/* Course Information */}

                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <h3 className="truncate text-xs font-bold text-gray-900 transition group-hover:text-indigo-600 sm:text-base">
                                      {
                                        enrollment.course_title
                                      }
                                    </h3>

                                    <p
                                      className={`mt-0.5 text-[10px] font-medium capitalize sm:text-[11px] ${
                                        completed
                                          ? "text-emerald-600"
                                          : "text-gray-400"
                                      }`}
                                    >
                                      {completed
                                        ? "Completed"
                                        : enrollment.status}
                                    </p>
                                  </div>

                                  <span
                                    className={`shrink-0 text-[11px] font-extrabold sm:text-sm ${
                                      completed
                                        ? "text-emerald-600"
                                        : "text-indigo-600"
                                    }`}
                                  >
                                    {progress}%
                                  </span>
                                </div>

                                {/* Progress */}

                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100 sm:mt-3 sm:h-2">
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

                                <div className="mt-1 flex items-center justify-between">
                                  <span className="text-[9px] text-gray-400 sm:text-[11px]">
                                    {completed
                                      ? "Course completed"
                                      : "Continue learning"}
                                  </span>

                                  <span className="hidden text-[11px] font-bold text-indigo-600 transition group-hover:block">
                                    Open course →
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

          {/* ==================================================
              Sidebar
          ================================================== */}

          <aside className="space-y-3 sm:space-y-4">
            {/* Quick Actions */}

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 sm:text-xs">
                  Shortcuts
                </p>

                <h2 className="mt-0.5 text-base font-extrabold text-gray-900 sm:text-lg">
                  Quick Actions
                </h2>
              </div>

              <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
                {/* Explore */}

                <Link
                  to="/courses"
                  className="group flex items-center gap-2.5 rounded-lg border border-gray-200 p-2.5 transition hover:border-indigo-200 hover:bg-indigo-50 sm:gap-3 sm:rounded-xl sm:p-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-600 sm:h-9 sm:w-9 sm:text-sm">
                    +
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 sm:text-sm">
                      Explore Courses
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-gray-500 sm:text-xs">
                      Find something new to learn
                    </p>
                  </div>

                  <span className="ml-auto text-xs text-gray-300 transition group-hover:text-indigo-600 sm:text-sm">
                    →
                  </span>
                </Link>

                {/* My Courses */}

                <Link
                  to="/my-courses"
                  className="group flex items-center gap-2.5 rounded-lg border border-gray-200 p-2.5 transition hover:border-indigo-200 hover:bg-indigo-50 sm:gap-3 sm:rounded-xl sm:p-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-600 sm:h-9 sm:w-9 sm:text-sm">
                    ✓
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 sm:text-sm">
                      My Courses
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-gray-500 sm:text-xs">
                      View your enrolled courses
                    </p>
                  </div>

                  <span className="ml-auto text-xs text-gray-300 transition group-hover:text-emerald-600 sm:text-sm">
                    →
                  </span>
                </Link>

                {/* Orders */}

                <Link
                  to="/orders"
                  className="group flex items-center gap-2.5 rounded-lg border border-gray-200 p-2.5 transition hover:border-indigo-200 hover:bg-indigo-50 sm:gap-3 sm:rounded-xl sm:p-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-600 sm:h-9 sm:w-9 sm:text-sm">
                    $
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 sm:text-sm">
                      Orders
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-gray-500 sm:text-xs">
                      View your purchases
                    </p>
                  </div>

                  <span className="ml-auto text-xs text-gray-300 transition group-hover:text-violet-600 sm:text-sm">
                    →
                  </span>
                </Link>
              </div>
            </div>

            {/* Learning Tip */}

            <div className="overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 p-4 text-white shadow-sm sm:rounded-2xl sm:p-5">
              <span className="text-lg sm:text-xl">
                💡
              </span>

              <h3 className="mt-2 text-sm font-extrabold sm:mt-3 sm:text-base">
                Learning tip
              </h3>

              <p className="mt-1 text-xs leading-5 text-indigo-100 sm:mt-1.5 sm:text-sm sm:leading-6">
                Consistency beats intensity. Try to complete
                at least one lesson every day.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;