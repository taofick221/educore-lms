import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

import CourseGrid from "../../components/courses/CourseGrid";
import CourseFilters from "../../components/courses/CourseFilters";
import { useCourses } from "../../hooks/useCourses";
import type { CourseListParams } from "../../types/course";

function CoursesPage() {
  const [filters, setFilters] =
    useState<CourseListParams>({});

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

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
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 sm:text-xs">
                Course Library
              </p>

              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                Find your course
              </h1>

              <p className="mt-1.5 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                Search and filter courses based on your
                needs.
              </p>
            </div>

            {/* Mobile Filter Button */}

            <button
              type="button"
              onClick={() =>
                setMobileFiltersOpen(true)
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 md:hidden"
              aria-label="Open filters"
            >
              <SlidersHorizontal
                size={18}
                strokeWidth={2}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================
          Main Content
      ================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* ==================================================
              Desktop / Tablet Sidebar
          ================================================== */}

          <aside className="hidden md:block">
            <div className="sticky top-6">
              <CourseFilters
                filters={filters}
                onChange={setFilters}
              />
            </div>
          </aside>

          {/* ==================================================
              Course Content
          ================================================== */}

          <main className="min-w-0">
            {/* Result Information */}

            {!loading && !error && (
              <div className="mb-4 flex items-center justify-between sm:mb-5">
                <div>
                  <h2 className="text-base font-extrabold text-gray-900 sm:text-lg">
                    Courses
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
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                {[1, 2, 3, 4, 5, 6].map(
                  (item) => (
                    <div
                      key={item}
                      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:rounded-2xl"
                    >
                      <div className="aspect-video animate-pulse bg-gray-200" />

                      <div className="space-y-2.5 p-3 sm:p-5">
                        <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />

                        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />

                        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />

                        <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />

                        <div className="mt-3 h-5 w-16 animate-pulse rounded bg-gray-200" />
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
              <div className="rounded-2xl border border-red-100 bg-white px-4 py-8 shadow-sm sm:px-6 sm:py-10">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-red-600">
                    !
                  </div>

                  <div>
                    <p className="text-sm font-bold text-red-700">
                      Unable to load courses
                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-600 sm:text-sm">
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
                <CourseGrid courses={courses} />
              )}

            {/* ==================================================
                Empty State
            ================================================== */}

            {!loading &&
              !error &&
              courses.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-10 text-center shadow-sm sm:px-6 sm:py-12">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-xl sm:h-14 sm:w-14">
                    🔎
                  </div>

                  <h2 className="mt-4 text-base font-extrabold text-gray-900 sm:text-lg">
                    No courses found
                  </h2>

                  <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-gray-500 sm:text-sm">
                    Try changing your search or filters
                    to find available courses.
                  </p>

                  <button
                    type="button"
                    onClick={() => setFilters({})}
                    className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
          </main>
        </div>
      </div>

      {/* ==================================================
          Mobile Filter Drawer
      ================================================== */}

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}

          <button
            type="button"
            aria-label="Close filters"
            onClick={() =>
              setMobileFiltersOpen(false)
            }
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
          />

          {/* Drawer */}

          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-2xl">
            {/* Drawer Header */}

            <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-5">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">
                  Filters
                </h2>

                <p className="text-xs text-gray-500">
                  Refine your course search
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileFiltersOpen(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Content */}

            <div className="flex-1 overflow-y-auto p-5">
              <CourseFilters
                filters={filters}
                onChange={setFilters}
                mobile
                onApply={() =>
                  setMobileFiltersOpen(false)
                }
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default CoursesPage;