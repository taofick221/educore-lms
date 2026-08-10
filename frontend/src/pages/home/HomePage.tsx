import { Link } from "react-router-dom";

import CourseCard from "../../components/courses/CourseCard";
import { useCourses } from "../../hooks/useCourses";
import { useEnrollments } from "../../hooks/useEnrollments";

function HomePage() {
  const {
    courses,
    loading: coursesLoading,
    error: coursesError,
  } = useCourses();

  const {
    enrollments,
    loading: enrollmentsLoading,
  } = useEnrollments();

  /*
   * Select the student's current learning course.
   *
   * Priority:
   * 1. Active enrollment
   * 2. First available enrollment
   */
  const learningEnrollment =
    enrollments.find(
      (enrollment) =>
        enrollment.status === "active",
    ) ?? enrollments[0];

  const progress =
    learningEnrollment?.progress_percentage ?? 0;

  const totalLessons =
    learningEnrollment?.total_lectures ?? 0;

  const completedLessons =
    learningEnrollment?.completed_lectures ?? 0;

  const certificateIssued =
    learningEnrollment?.certificate_issued ?? false;

  const safeProgress = Math.min(
    100,
    Math.max(0, progress),
  );

  const isCompleted =
    safeProgress >= 100;

  return (
    <section>
      {/* ==================================================
          Hero
      ================================================== */}

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">

            {/* Hero Content */}

            <div>
              <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
                Learn smarter
              </span>

              <h1 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                Build skills.
                <br />
                Learn with
                <span className="text-indigo-600">
                  {" "}
                  purpose.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-gray-500 sm:text-base sm:leading-7">
                EduCore helps you learn practical skills
                through structured courses, real progress
                tracking, and focused learning.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  Explore Courses
                </Link>

                {learningEnrollment && (
                  <Link
                    to={`/learning/${learningEnrollment.id}`}
                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Continue Learning
                  </Link>
                )}
              </div>
            </div>

            {/* ==================================================
                Live Learning Progress
            ================================================== */}

            <div className="relative">
              <div className="rounded-2xl border border-white/80 bg-white p-4 shadow-xl shadow-indigo-100/60 sm:p-5 xl:rounded-3xl">

                <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 p-5 text-white sm:p-6 xl:rounded-2xl">

                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs text-indigo-100">
                        Your learning journey
                      </p>

                      <h2 className="mt-1.5 truncate text-lg font-extrabold sm:text-xl">
                        {enrollmentsLoading
                          ? "Loading..."
                          : learningEnrollment
                            ? learningEnrollment.course_title
                            : "Start learning."}
                      </h2>

                      <p className="mt-1 text-xs text-indigo-100">
                        {enrollmentsLoading
                          ? "Loading your progress..."
                          : !learningEnrollment
                            ? "Choose a course and start your journey."
                            : isCompleted
                              ? "Course completed."
                              : "Keep learning."}
                      </p>
                    </div>

                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-base sm:h-11 sm:w-11 sm:rounded-xl ${
                        isCompleted
                          ? "bg-emerald-500"
                          : "bg-white/15"
                      }`}
                    >
                      {isCompleted ? "✓" : "▶"}
                    </div>
                  </div>

                  {learningEnrollment && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-indigo-100">
                          Course progress
                        </span>

                        <span className="font-bold">
                          {safeProgress}%
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted
                              ? "bg-emerald-400"
                              : "bg-white"
                          }`}
                          style={{
                            width: `${safeProgress}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* ==================================================
                    Learning Statistics
                ================================================== */}

                {learningEnrollment ? (
                  <div className="mt-3 grid grid-cols-3 gap-2.5 sm:mt-4 sm:gap-3">

                    {/* Lessons */}

                    <div className="rounded-lg bg-gray-50 px-2 py-3 text-center sm:rounded-xl sm:p-3.5">
                      <p className="text-base font-extrabold text-gray-900 sm:text-lg">
                        {totalLessons}
                      </p>

                      <p className="mt-0.5 text-[10px] text-gray-500 sm:text-xs">
                        Lessons
                      </p>
                    </div>

                    {/* Completed */}

                    <div className="rounded-lg bg-gray-50 px-2 py-3 text-center sm:rounded-xl sm:p-3.5">
                      <p className="text-base font-extrabold text-gray-900 sm:text-lg">
                        {completedLessons}
                      </p>

                      <p className="mt-0.5 text-[10px] text-gray-500 sm:text-xs">
                        Completed
                      </p>
                    </div>

                    {/* Certificate */}

                    <div className="rounded-lg bg-gray-50 px-2 py-3 text-center sm:rounded-xl sm:p-3.5">
                      <p className="text-base font-extrabold text-gray-900 sm:text-lg">
                        {certificateIssued ? 1 : 0}
                      </p>

                      <p className="mt-0.5 text-[10px] text-gray-500 sm:text-xs">
                        Certificate
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="px-2 py-4 text-center">
                    <p className="text-xs text-gray-500 sm:text-sm">
                      Enroll in a course to start tracking
                      your learning progress.
                    </p>

                    <Link
                      to="/courses"
                      className="mt-3 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
                    >
                      Browse Courses
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          Featured Courses
      ================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 sm:text-sm">
              Explore
            </p>

            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Featured Courses
            </h2>

            <p className="mt-1.5 text-sm text-gray-500">
              Build practical skills with courses designed
              for real learning.
            </p>
          </div>

          <Link
            to="/courses"
            className="hidden shrink-0 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700 sm:inline-flex"
          >
            View all courses →
          </Link>
        </div>

        {coursesLoading && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <div className="aspect-video animate-pulse bg-gray-200" />

                <div className="space-y-3 p-4">
                  <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!coursesLoading && coursesError && (
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-5">
            <p className="text-sm font-semibold text-red-700">
              Failed to load courses.
            </p>
          </div>
        )}

        {!coursesLoading &&
          !coursesError &&
          courses.length > 0 && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses
                .filter((course) => course.is_featured)
                .slice(0, 3)
                .map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                  />
                ))}
            </div>
          )}

        <Link
          to="/courses"
          className="mt-5 inline-flex text-sm font-semibold text-indigo-600 sm:hidden"
        >
          View all courses →
        </Link>
      </div>
    </section>
  );
}

export default HomePage;