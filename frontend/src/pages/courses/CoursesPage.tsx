import { useState } from "react";

import CourseCard from "../../components/courses/CourseCard";
import CourseFilters from "../../components/courses/CourseFilters";

import { useCourses } from "../../hooks/useCourses";

function CoursesPage() {
  const [filters, setFilters] = useState({});

  const {
    courses,
    loading,
    error,
  } = useCourses(filters);

  return (
    <section className="min-h-screen bg-gray-50">
      {/* ==================================================
          Page Header
      ================================================== */}

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 sm:text-sm">
            Explore
          </span>

          <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            Explore Courses
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-gray-500 sm:mt-2 sm:text-base">
            Find practical courses and learn new skills
            at your own pace.
          </p>
        </div>
      </div>

      {/* ==================================================
          Content
      ================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        {/* ==================================================
            Filters
        ================================================== */}

        <CourseFilters
          filters={filters}
          onChange={setFilters}
        />

        {/* ==================================================
            Result Information
        ================================================== */}

        {!loading && !error && (
          <div className="mt-5 flex items-end justify-between sm:mt-6">
            <div>
              <h2 className="text-base font-extrabold text-gray-900 sm:text-lg">
                All Courses
              </h2>

              <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                {courses.length}{" "}
                {courses.length === 1
                  ? "course"
                  : "courses"}{" "}
                available
              </p>
            </div>
          </div>
        )}

        {/* ==================================================
            Loading
        ================================================== */}

        {loading && (
          <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="aspect-video animate-pulse bg-gray-200" />

                  <div className="space-y-2.5 p-4 sm:p-5">
                    <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />

                    <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />

                    <div className="h-3 w-full animate-pulse rounded bg-gray-200" />

                    <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              ),
            )}
          </div>
        )}

        {/* ==================================================
            Error
        ================================================== */}

        {!loading && error && (
          <div className="mt-5 rounded-2xl border border-red-100 bg-white px-4 py-7 shadow-sm sm:mt-6 sm:px-6 sm:py-8">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-red-600">
                !
              </div>

              <div>
                <p className="text-sm font-bold text-red-700">
                  Unable to load courses
                </p>

                <p className="mt-0.5 text-xs leading-5 text-red-600 sm:text-sm">
                  Please try again later.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            Course Grid
        ================================================== */}

        {!loading &&
          !error &&
          courses.length > 0 && (
            <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                />
              ))}
            </div>
          )}

        {/* ==================================================
            Empty State
        ================================================== */}

        {!loading &&
          !error &&
          courses.length === 0 && (
            <div className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-10 text-center shadow-sm sm:mt-6 sm:px-6 sm:py-12">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-xl sm:h-14 sm:w-14 sm:rounded-2xl sm:text-2xl">
                🔎
              </div>

              <h2 className="mt-4 text-base font-extrabold text-gray-900 sm:text-lg">
                No courses found
              </h2>

              <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">
                Try changing your search or filters to
                find available courses.
              </p>

              <button
                type="button"
                onClick={() => setFilters({})}
                className="mt-4 w-full rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-5 sm:w-auto"
              >
                Clear Filters
              </button>
            </div>
          )}
      </div>
    </section>
  );
}

export default CoursesPage;