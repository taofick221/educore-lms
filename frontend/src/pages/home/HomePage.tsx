import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  PlayCircle,
  Sparkles,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";

import CourseCard from "../../components/courses/CourseCard";
import { useCourses } from "../../hooks/useCourses";
import { useEnrollments } from "../../hooks/useEnrollments";

function HomePage() {
  const {
    courses,
    loading: coursesLoading,
    error: coursesError,
  } = useCourses({
    ordering: "-created_at",
  });

  const {
    enrollments,
    loading: enrollmentsLoading,
  } = useEnrollments();

  const learningEnrollment =
    enrollments.find(
      (enrollment) =>
        enrollment.status === "active",
    ) ?? enrollments[0];

  const progress = Math.min(
    100,
    Math.max(
      0,
      learningEnrollment?.progress_percentage ?? 0,
    ),
  );

  const totalLessons =
    learningEnrollment?.total_lectures ?? 0;

  const completedLessons =
    learningEnrollment?.completed_lectures ?? 0;

  const certificateIssued =
    learningEnrollment?.certificate_issued ?? false;

  const isCompleted = progress >= 100;

  const featuredCourses = courses
    .filter((course) => course.is_featured)
    .slice(0, 8);

  return (
    <main className="min-h-screen bg-white">
      {/* ==================================================
          Hero
      ================================================== */}

      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl sm:h-80 sm:w-80"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl sm:h-96 sm:w-96"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-16">
            {/* Hero Content */}

            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-sm backdrop-blur sm:px-4 sm:py-2 sm:text-sm">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Learn something new today
              </div>

              <h1 className="mt-5 text-3xl font-extrabold leading-[1.12] tracking-tight text-gray-950 sm:mt-6 sm:text-4xl md:text-5xl lg:text-[3.4rem] xl:text-6xl">
                Learn skills.
                <br />
                <span className="text-indigo-600">
                  Build your future.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-gray-600 sm:mt-5 sm:text-base sm:leading-7 lg:text-lg">
                Learn practical skills through
                structured courses, expert content,
                and progress-based learning with
                EduCore.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row">
                <Link
                  to="/courses"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Explore Courses
                  <ArrowRight className="h-4 w-4" />
                </Link>

                {learningEnrollment && (
                  <Link
                    to={`/learning/${learningEnrollment.id}`}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Continue Learning
                  </Link>
                )}
              </div>

              <div className="mt-7 grid grid-cols-1 gap-2.5 text-xs text-gray-600 sm:mt-8 sm:grid-cols-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>Structured courses</span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>Track your progress</span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>Learn at your pace</span>
                </div>
              </div>
            </div>

            {/* Learning Journey */}

            <div className="w-full lg:justify-self-end">
              <div className="rounded-2xl border border-white/80 bg-white p-2.5 shadow-xl shadow-indigo-100/50 sm:rounded-3xl sm:p-3">
                <div className="overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 text-white sm:rounded-2xl">
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-indigo-100" />

                          <p className="text-xs font-semibold text-indigo-100">
                            Your learning journey
                          </p>
                        </div>

                        <h2 className="mt-2 break-words text-lg font-extrabold leading-6 sm:text-xl sm:leading-7">
                          {enrollmentsLoading
                            ? "Loading your course..."
                            : learningEnrollment
                              ? learningEnrollment.course_title
                              : "Start learning."}
                        </h2>

                        <p className="mt-1.5 text-xs leading-5 text-indigo-100 sm:text-sm">
                          {enrollmentsLoading
                            ? "Loading your progress..."
                            : !learningEnrollment
                              ? "Choose a course and start your journey."
                              : isCompleted
                                ? "Congratulations! You completed this course."
                                : "Keep learning and make steady progress."}
                        </p>
                      </div>

                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isCompleted
                            ? "bg-emerald-500"
                            : "bg-white/15"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <PlayCircle className="h-5 w-5" />
                        )}
                      </div>
                    </div>

                    {learningEnrollment && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-indigo-100">
                            Course progress
                          </span>

                          <span className="font-extrabold text-white">
                            {progress}%
                          </span>
                        </div>

                        <div
                          className="mt-2 h-2 overflow-hidden rounded-full bg-white/20"
                          role="progressbar"
                          aria-valuenow={progress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label="Course progress"
                        >
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isCompleted
                                ? "bg-emerald-400"
                                : "bg-white"
                            }`}
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {learningEnrollment ? (
                    <div className="grid grid-cols-3 gap-px border-t border-white/10 bg-white/10">
                      <div className="bg-indigo-700/40 px-2 py-4 text-center sm:px-4">
                        <BookOpen className="mx-auto h-4 w-4 text-indigo-200" />

                        <p className="mt-1.5 text-lg font-extrabold sm:text-xl">
                          {totalLessons}
                        </p>

                        <p className="text-[10px] text-indigo-100 sm:text-xs">
                          Lessons
                        </p>
                      </div>

                      <div className="bg-indigo-700/40 px-2 py-4 text-center sm:px-4">
                        <Target className="mx-auto h-4 w-4 text-indigo-200" />

                        <p className="mt-1.5 text-lg font-extrabold sm:text-xl">
                          {completedLessons}
                        </p>

                        <p className="text-[10px] text-indigo-100 sm:text-xs">
                          Completed
                        </p>
                      </div>

                      <div className="bg-indigo-700/40 px-2 py-4 text-center sm:px-4">
                        <CheckCircle2 className="mx-auto h-4 w-4 text-indigo-200" />

                        <p className="mt-1.5 text-lg font-extrabold sm:text-xl">
                          {certificateIssued ? 1 : 0}
                        </p>

                        <p className="text-[10px] text-indigo-100 sm:text-xs">
                          Certificate
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="border-t border-white/10 p-4 sm:p-5">
                      <Link
                        to="/courses"
                        className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-50 sm:text-sm"
                      >
                        Browse Courses
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          Featured Courses
      ================================================== */}

      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 sm:text-sm">
                Learn & Grow
              </p>

              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
                Featured Courses
              </h2>

              <p className="mt-1.5 max-w-xl text-sm leading-6 text-gray-500">
                Build practical skills with structured
                courses designed for real learning.
              </p>
            </div>

            <Link
              to="/courses"
              className="hidden shrink-0 items-center gap-1 text-sm font-bold text-indigo-600 transition hover:text-indigo-700 sm:inline-flex"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Loading */}

          {coursesLoading && (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white sm:rounded-2xl"
                >
                  <div className="aspect-video animate-pulse bg-gray-200" />

                  <div className="space-y-2.5 p-3 sm:p-4">
                    <div className="h-2.5 w-16 animate-pulse rounded bg-gray-200 sm:h-3 sm:w-20" />

                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 sm:h-5" />

                    <div className="h-3 w-full animate-pulse rounded bg-gray-200" />

                    <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}

          {!coursesLoading && coursesError && (
            <div className="mt-6 rounded-2xl border border-red-100 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-sm font-bold text-red-700">
                Unable to load featured courses.
              </p>

              <p className="mt-1 text-xs text-red-600 sm:text-sm">
                Please try again later.
              </p>
            </div>
          )}

          {/* Courses */}

          {!coursesLoading &&
            !coursesError &&
            featuredCourses.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
                {featuredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                  />
                ))}
              </div>
            )}

          {/* Empty */}

          {!coursesLoading &&
            !coursesError &&
            featuredCourses.length === 0 && (
              <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-10 text-center">
                <BookOpen className="mx-auto h-8 w-8 text-gray-300" />

                <p className="mt-3 text-sm font-semibold text-gray-700">
                  No featured courses available yet.
                </p>

                <Link
                  to="/courses"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-indigo-600"
                >
                  Browse all courses
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

          <Link
            to="/courses"
            className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-indigo-600 sm:hidden"
          >
            View all courses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ==================================================
          Why EduCore
      ================================================== */}

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 sm:text-sm">
              Why EduCore
            </p>

            <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
              Learn with a clear path
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
              Everything you need to learn consistently
              and track your progress.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5 lg:mt-10 lg:gap-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <BookOpen className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-base font-extrabold text-gray-950">
                Structured Learning
              </h3>

              <p className="mt-1.5 text-sm leading-6 text-gray-500">
                Follow organized sections and lectures
                instead of learning randomly.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Target className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-base font-extrabold text-gray-950">
                Track Progress
              </h3>

              <p className="mt-1.5 text-sm leading-6 text-gray-500">
                See completed lessons and course progress
                in one place.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <GraduationCap className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-base font-extrabold text-gray-950">
                Learn & Achieve
              </h3>

              <p className="mt-1.5 text-sm leading-6 text-gray-500">
                Complete your courses and work toward
                earning certificates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          CTA
      ================================================== */}

      <section className="bg-indigo-600">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:items-center lg:flex-row">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Start your learning journey today.
              </h2>

              <p className="mt-2 text-sm leading-6 text-indigo-100 sm:text-base">
                Explore courses and take the next step
                toward your goals.
              </p>
            </div>

            <Link
              to="/courses"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-600 shadow-sm transition hover:bg-indigo-50 sm:w-auto"
            >
              Explore Courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;