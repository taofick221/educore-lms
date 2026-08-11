import type { CourseListParams } from "../../types/course";

interface Props {
  filters: CourseListParams;
  onChange: (filters: CourseListParams) => void;
  mobile?: boolean;
  onApply?: () => void;
}

function CourseFilters({
  filters,
  onChange,
  mobile = false,
  onApply,
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
    <div
      className={
        mobile
          ? "space-y-5"
          : "rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
      }
    >
      {/* ==================================================
          Header
      ================================================== */}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">
            Find your course
          </h2>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            Search and filter courses based on your
            needs.
          </p>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="shrink-0 text-xs font-bold text-indigo-600 transition hover:text-indigo-700"
          >
            Clear
          </button>
        )}
      </div>

      {/* ==================================================
          Search
      ================================================== */}

      <div>
        <label
          htmlFor={
            mobile
              ? "mobile-course-search"
              : "course-search"
          }
          className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500"
        >
          Search courses
        </label>

        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            🔎
          </span>

          <input
            id={
              mobile
                ? "mobile-course-search"
                : "course-search"
            }
            type="text"
            value={filters.search ?? ""}
            onChange={(event) =>
              updateFilter(
                "search",
                event.target.value,
              )
            }
            placeholder="Search by course name..."
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* ==================================================
          Level
      ================================================== */}

      <div>
        <label
          htmlFor={
            mobile
              ? "mobile-course-level"
              : "course-level"
          }
          className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500"
        >
          Level
        </label>

        <select
          id={
            mobile
              ? "mobile-course-level"
              : "course-level"
          }
          value={filters.level ?? ""}
          onChange={(event) =>
            updateFilter(
              "level",
              event.target.value,
            )
          }
          className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">All levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">
            Intermediate
          </option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* ==================================================
          Language
      ================================================== */}

      <div>
        <label
          htmlFor={
            mobile
              ? "mobile-course-language"
              : "course-language"
          }
          className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500"
        >
          Language
        </label>

        <select
          id={
            mobile
              ? "mobile-course-language"
              : "course-language"
          }
          value={filters.language ?? ""}
          onChange={(event) =>
            updateFilter(
              "language",
              event.target.value,
            )
          }
          className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">All languages</option>
          <option value="english">English</option>
          <option value="bangla">Bangla</option>
        </select>
      </div>

      {/* ==================================================
          Category
      ================================================== */}

      <div>
        <label
          htmlFor={
            mobile
              ? "mobile-course-category"
              : "course-category"
          }
          className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500"
        >
          Category
        </label>

        <input
          id={
            mobile
              ? "mobile-course-category"
              : "course-category"
          }
          type="text"
          value={filters.category ?? ""}
          onChange={(event) =>
            updateFilter(
              "category",
              event.target.value,
            )
          }
          placeholder="Category"
          className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {/* ==================================================
          Sort
      ================================================== */}

      <div>
        <label
          htmlFor={
            mobile
              ? "mobile-course-ordering"
              : "course-ordering"
          }
          className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500"
        >
          Sort by
        </label>

        <select
          id={
            mobile
              ? "mobile-course-ordering"
              : "course-ordering"
          }
          value={filters.ordering ?? ""}
          onChange={(event) =>
            updateFilter(
              "ordering",
              event.target.value,
            )
          }
          className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">Newest</option>
          <option value="title">Name A-Z</option>
          <option value="-title">Name Z-A</option>
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

      {/* ==================================================
          Mobile Apply
      ================================================== */}

      {mobile && (
        <div className="sticky bottom-0 -mx-5 border-t border-gray-200 bg-white px-5 py-4">
          <button
            type="button"
            onClick={onApply}
            className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default CourseFilters;