import { Link } from "react-router-dom";
import type { Course } from "../../types/course";

interface Props {
  course: Course;
}

function CourseCard({ course }: Props) {
  const price =
    course.discount_price &&
    Number(course.discount_price) < Number(course.price)
      ? course.discount_price
      : course.price;

  const hasDiscount =
    course.discount_price &&
    Number(course.discount_price) < Number(course.price);

  const isFree = Number(price) === 0;

  return (
    <Link
      to={`/courses/${course.slug}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-lg sm:rounded-2xl"
    >
      {/* ==================================================
          Thumbnail
      ================================================== */}

      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
            <span className="text-4xl font-extrabold text-white/90 sm:text-5xl">
              E
            </span>
          </div>
        )}

        {/* Featured */}

        {course.is_featured && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-indigo-700 shadow-sm backdrop-blur sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
            Featured
          </span>
        )}

        {/* Level */}

        <span className="absolute bottom-2.5 left-2.5 rounded-full bg-gray-900/80 px-2.5 py-1 text-[10px] font-semibold capitalize text-white backdrop-blur sm:bottom-4 sm:left-4 sm:px-3 sm:text-xs">
          {course.level}
        </span>
      </div>

      {/* ==================================================
          Content
      ================================================== */}

      <div className="p-4 sm:p-5">
        {/* Category */}

        {course.category && (
          <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 sm:text-xs">
            {course.category.name}
          </p>
        )}

        {/* Title */}

        <h2 className="mt-1.5 line-clamp-2 min-h-[2.75rem] text-base font-extrabold leading-5 text-gray-900 transition group-hover:text-indigo-600 sm:mt-2 sm:min-h-[3.5rem] sm:text-lg sm:leading-7">
          {course.title}
        </h2>

        {/* Description */}

        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-gray-500 sm:mt-2 sm:text-sm sm:leading-6">
          {course.short_description}
        </p>

        {/* ==================================================
            Meta
        ================================================== */}

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-gray-400 sm:mt-4 sm:gap-4 sm:text-xs">
          <span>{course.duration} min</span>

          <span aria-hidden="true">•</span>

          <span className="capitalize">
            {course.language}
          </span>
        </div>

        {/* ==================================================
            Bottom
        ================================================== */}

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-100 pt-3 sm:mt-5 sm:pt-4">
          {/* Price */}

          <div className="flex min-w-0 items-center gap-1.5">
            {isFree ? (
              <span className="text-base font-extrabold text-emerald-600 sm:text-lg">
                Free
              </span>
            ) : (
              <>
                <span className="truncate text-base font-extrabold text-gray-900 sm:text-lg">
                  ৳{price}
                </span>

                {hasDiscount && (
                  <span className="shrink-0 text-[10px] text-gray-400 line-through sm:text-xs">
                    ৳{course.price}
                  </span>
                )}
              </>
            )}
          </div>

          {/* View */}

          <span className="shrink-0 text-xs font-bold text-indigo-600 transition group-hover:translate-x-1 sm:text-sm">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;