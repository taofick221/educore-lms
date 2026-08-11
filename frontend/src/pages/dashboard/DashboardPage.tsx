import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  PlayCircle,
  ShoppingBag,
  Target,
} from "lucide-react";
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

  const learningEnrollment =
    activeCourses[0] ?? enrollments[0];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ==================================================
          Header
      ================================================== */}

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 sm:text-sm">
                Student Dashboard
              </p>

              <h1 className="mt-1.5 break-words text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl lg:text-4xl">
                Welcome back
                {user?.first_name
                  ? `, ${user.first_name}`
                  : ""}
                !
              </h1>

              <p className="mt-1.5 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                Continue learning, track your progress,
                and keep moving forward.
              </p>
            </div>

            <Link
              to="/courses"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Explore Courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================
          Content
      ================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* ==================================================
            Stats
        ================================================== */}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {/* Enrolled */}

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <BookOpen className="h-4 w-4" />
              </div>

              <span className="text-[10px] font-semibold text-gray-400 sm:text-xs">
                Courses
              </span>
            </div>

            <p className="mt-4 text-2xl font-extrabold text-gray-950">
              {enrollments.length}
            </p>

            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              Enrolled
            </p>
          </div>

          {/* Active */}

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <PlayCircle className="h-4 w-4" />
              </div>

              <span className="text-[10px] font-semibold text-gray-400 sm:text-xs">
                Learning
              </span>
            </div>

            <p className="mt-4 text-2xl font-extrabold text-gray-950">
              {activeCourses.length}
            </p>

            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              Active
            </p>
          </div>

          {/* Completed */}

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>

              <span className="text-[10px] font-semibold text-gray-400 sm:text-xs">
                Finished
              </span>
            </div>

            <p className="mt-4 text-2xl font-extrabold text-gray-950">
              {completedCourses.length}
            </p>

            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              Completed
            </p>
          </div>

          {/* Average progress */}

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Target className="h-4 w-4" />
              </div>

              <span className="text-[10px] font-semibold text-gray-400 sm:text-xs">
                Overall
              </span>
            </div>

            <p className="mt-4 text-2xl font-extrabold text-gray-950">
              {averageProgress}%
            </p>

            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              Average progress
            </p>
          </div>
        </div>

        {/* ==================================================
            Loading
        ================================================== */}

        {loading && (
          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="h-72 animate-pulse rounded-2xl bg-white" />
            <div className="h-72 animate-pulse rounded-2xl bg-white" />
          </div>
        )}

        {/* ==================================================
            Error
        ================================================== */}

        {!loading && error && (
          <div className="mt-6 rounded-2xl border border-red-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-red-600">
                !
              </div>

              <div>
                <p className="text-sm font-bold text-red-700">
                  Unable to load your dashboard
                </p>

                <p className="mt-1 text-xs leading-5 text-red-600 sm:text-sm">
                  Please try again later.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            Main Dashboard
        ================================================== */}

        {!loading && !error && (
          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            {/* ==================================================
                Continue Learning
            ================================================== */}

            <section className="min-w-0 rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-4 py-4 sm:px-5 sm:py-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                      Continue learning
                    </p>

                    <h2 className="mt-1 text-lg font-extrabold text-gray-950 sm:text-xl">
                      Your learning journey
                    </h2>
                  </div>

                  <Link
                    to="/my-courses"
                    className="hidden items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 sm:inline-flex sm:text-sm"
                  >
                    My Courses
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {learningEnrollment ? (
                <div className="p-4 sm:p-5">
                  <Link
                    to={`/learning/${learningEnrollment.id}`}
                    className="group block overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-600 to-violet-600 p-4 text-white transition hover:shadow-lg sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-indigo-100 sm:text-xs">
                          <GraduationCap className="h-3.5 w-3.5" />
                          {learningEnrollment.status ===
                          "completed"
                            ? "Completed"
                            : "In progress"}
                        </div>

                        <h3 className="mt-3 break-words text-lg font-extrabold leading-6 sm:text-2xl sm:leading-8">
                          {
                            learningEnrollment.course_title
                          }
                        </h3>

                        <p className="mt-1.5 text-xs leading-5 text-indigo-100 sm:text-sm">
                          {learningEnrollment.completed_lectures}{" "}
                          of{" "}
                          {
                            learningEnrollment.total_lectures
                          }{" "}
                          lessons completed
                        </p>
                      </div>

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 transition group-hover:bg-white/20 sm:h-11 sm:w-11">
                        {learningEnrollment.progress_percentage >=
                        100 ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <PlayCircle className="h-5 w-5" />
                        )}
                      </div>
                    </div>

                    {/* Progress */}

                    <div className="mt-6">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-indigo-100">
                          Course progress
                        </span>

                        <span className="font-extrabold">
                          {
                            learningEnrollment.progress_percentage
                          }
                          %
                        </span>
                      </div>

                      <div
                        className="mt-2 h-2 overflow-hidden rounded-full bg-white/15"
                        role="progressbar"
                        aria-valuenow={
                          learningEnrollment.progress_percentage
                        }
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            learningEnrollment.progress_percentage >=
                            100
                              ? "bg-emerald-400"
                              : "bg-white"
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                0,
                                learningEnrollment.progress_percentage,
                              ),
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Footer */}

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                      <span className="text-xs font-medium text-indigo-100">
                        {learningEnrollment.progress_percentage >=
                        100
                          ? "Course completed"
                          : "Continue where you left off"}
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs font-bold">
                        Open course
                        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="px-5 py-12 text-center sm:px-8">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <BookOpen className="h-6 w-6" />
                  </div>

                  <h3 className="mt-4 text-base font-extrabold text-gray-950">
                    Start your learning journey
                  </h3>

                  <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-gray-500">
                    Explore available courses and
                    choose something you want to learn.
                  </p>

                  <Link
                    to="/courses"
                    className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
                  >
                    Browse Courses
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}

              <Link
                to="/my-courses"
                className="flex items-center justify-center gap-1 border-t border-gray-100 px-4 py-3.5 text-xs font-bold text-indigo-600 sm:hidden"
              >
                View all my courses
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </section>

            {/* ==================================================
                Sidebar
            ================================================== */}

            <aside className="space-y-5">
              {/* Quick Actions */}

              <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                    <ShoppingBag className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="text-sm font-extrabold text-gray-950">
                      Quick actions
                    </h2>

                    <p className="text-xs text-gray-500">
                      Manage your learning
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2.5">
                  <Link
                    to="/courses"
                    className="group flex items-center gap-3 rounded-xl border border-gray-200 p-3 transition hover:border-indigo-200 hover:bg-indigo-50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <BookOpen className="h-4 w-4" />
                    </span>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900">
                        Explore Courses
                      </p>

                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        Find something new to learn
                      </p>
                    </div>

                    <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-gray-300 transition group-hover:text-indigo-600" />
                  </Link>

                  <Link
                    to="/my-courses"
                    className="group flex items-center gap-3 rounded-xl border border-gray-200 p-3 transition hover:border-emerald-200 hover:bg-emerald-50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <GraduationCap className="h-4 w-4" />
                    </span>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900">
                        My Courses
                      </p>

                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        View your enrolled courses
                      </p>
                    </div>

                    <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-gray-300 transition group-hover:text-emerald-600" />
                  </Link>

                  <Link
                    to="/orders"
                    className="group flex items-center gap-3 rounded-xl border border-gray-200 p-3 transition hover:border-violet-200 hover:bg-violet-50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                      <ShoppingBag className="h-4 w-4" />
                    </span>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900">
                        Orders
                      </p>

                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        View your purchases
                      </p>
                    </div>

                    <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-gray-300 transition group-hover:text-violet-600" />
                  </Link>
                </div>
              </section>

              {/* Learning summary */}

              <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Clock3 className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="text-sm font-extrabold text-gray-950">
                      Learning summary
                    </h2>

                    <p className="text-xs text-gray-500">
                      Your current activity
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Active courses
                    </span>

                    <span className="font-bold text-gray-900">
                      {activeCourses.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Completed courses
                    </span>

                    <span className="font-bold text-gray-900">
                      {completedCourses.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Average progress
                    </span>

                    <span className="font-bold text-indigo-600">
                      {averageProgress}%
                    </span>
                  </div>
                </div>
              </section>

              {/* Learning tip */}

              <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                  <Award className="h-5 w-5" />
                </div>

                <h3 className="mt-4 text-base font-extrabold">
                  Keep your momentum
                </h3>

                <p className="mt-1.5 text-sm leading-6 text-indigo-100">
                  Consistency beats intensity. Complete
                  one lesson at a time and keep moving
                  toward your goal.
                </p>
              </section>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

export default DashboardPage;