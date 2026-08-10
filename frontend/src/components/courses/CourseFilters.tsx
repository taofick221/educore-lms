import type { CourseListParams } from "../../types/course";

interface Props {
  filters: CourseListParams;
  onChange: (filters: CourseListParams) => void;
}

function CourseFilters({
  filters,
  onChange,
}: Props) {
  const updateFilter = (
    key: keyof CourseListParams,
    value: string,
  ) => {
    onChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearFilters = () => {
    onChange({});
  };

  const hasFilters = Object.values(filters).some(
    (value) => value,
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      {/* ==================================================
          Header
      ================================================== */}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">
            Find your course
          </h2>

          <p className="mt-0.5 text-xs leading-5 text-gray-500 sm:text-sm">
            Search and filter courses based on your needs.
          </p>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="shrink-0 rounded-lg px-2 py-1 text-xs font-bold text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700 sm:text-sm"
          >
            Clear
          </button>
        )}
      </div>

      {/* ==================================================
          Main Filters
      ================================================== */}

      <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search */}

        <div className="min-w-0 lg:col-span-2">
          <label
            htmlFor="course-search"
            className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500 sm:text-xs"
          >
            Search
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              🔎
            </span>

            <input
              id="course-search"
              type="text"
              value={filters.search ?? ""}
              onChange={(event) =>
                updateFilter(
                  "search",
                  event.target.value,
                )
              }
              placeholder="Search courses..."
              className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-50 sm:h-11"
            />
          </div>
        </div>

        {/* Level */}

        <div className="min-w-0">
          <label
            htmlFor="course-level"
            className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500 sm:text-xs"
          >
            Level
          </label>

          <select
            id="course-level"
            value={filters.level ?? ""}
            onChange={(event) =>
              updateFilter(
                "level",
                event.target.value,
              )
            }
            className="h-10 w-full min-w-0 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-50 sm:h-11 sm:px-4"
          >
            <option value="">All levels</option>
            <option value="beginner">
              Beginner
            </option>
            <option value="intermediate">
              Intermediate
            </option>
            <option value="advanced">
              Advanced
            </option>
          </select>
        </div>

        {/* Language */}

        <div className="min-w-0">
          <label
            htmlFor="course-language"
            className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500 sm:text-xs"
          >
            Language
          </label>

          <select
            id="course-language"
            value={filters.language ?? ""}
            onChange={(event) =>
              updateFilter(
                "language",
                event.target.value,
              )
            }
            className="h-10 w-full min-w-0 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-50 sm:h-11 sm:px-4"
          >
            <option value="">
              All languages
            </option>

            <option value="english">
              English
            </option>

            <option value="bangla">
              Bangla
            </option>
          </select>
        </div>
      </div>

      {/* ==================================================
          Secondary Filters
      ================================================== */}

      <div className="mt-3 grid gap-3 border-t border-gray-100 pt-3 sm:mt-4 sm:gap-4 sm:pt-4 md:grid-cols-2">
        {/* Category */}

        <div className="min-w-0">
          <label
            htmlFor="course-category"
            className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500 sm:text-xs"
          >
            Category
          </label>

          <input
            id="course-category"
            type="text"
            value={filters.category ?? ""}
            onChange={(event) =>
              updateFilter(
                "category",
                event.target.value,
              )
            }
            placeholder="Category slug..."
            className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-50 sm:h-11 sm:px-4"
          />
        </div>

        {/* Ordering */}

        <div className="min-w-0">
          <label
            htmlFor="course-ordering"
            className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500 sm:text-xs"
          >
            Sort
          </label>

          <select
            id="course-ordering"
            value={filters.ordering ?? ""}
            onChange={(event) =>
              updateFilter(
                "ordering",
                event.target.value,
              )
            }
            className="h-10 w-full min-w-0 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-50 sm:h-11 sm:px-4"
          >
            <option value="">
              Newest
            </option>

            <option value="title">
              Name A-Z
            </option>

            <option value="-title">
              Name Z-A
            </option>

            <option value="price">
              Price Low-High
            </option>

            <option value="-price">
              Price High-Low
            </option>

            <option value="-created_at">
              Recently Added
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default CourseFilters;