import { ArrowRight, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";

import type { Course } from "../../types/course";

interface Props {
  course: Course;
}

function CourseCard({ course }: Props) {
  const price =
    course.discount_price &&
    Number(course.discount_price) <
      Number(course.price)
      ? course.discount_price
      : course.price;

  const hasDiscount =
    course.discount_price &&
    Number(course.discount_price) <
      Number(course.price);

  const isFree = Number(price) === 0;

  return (
    <Link
      to={`/courses/${course.slug}`}
      className="group block min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-lg sm:rounded-2xl"
    >
      {/* ==================================================
          Thumbnail
      ================================================== */}

      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
            <span className="text-3xl font-extrabold text-white/90 sm:text-5xl">
              E
            </span>
          </div>
        )}

        {/* Featured */}

        {course.is_featured && (
          <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-1 text-[8px] font-bold text-indigo-700 shadow-sm backdrop-blur sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[10px] lg:left-4 lg:top-4 lg:px-3 lg:text-xs">
            Featured
          </span>
        )}

        {/* Level */}

        <span className="absolute bottom-2 left-2 rounded-full bg-gray-900/80 px-2 py-1 text-[8px] font-semibold capitalize text-white backdrop-blur sm:bottom-3 sm:left-3 sm:px-2.5 sm:text-[10px] lg:bottom-4 lg:left-4 lg:px-3 lg:text-xs">
          {course.level}
        </span>
      </div>

      {/* ==================================================
          Content
      ================================================== */}

      <div className="p-3 sm:p-4 lg:p-5">
        {/* Category */}

        {course.category && (
          <p className="truncate text-[8px] font-bold uppercase tracking-wider text-indigo-600 sm:text-[10px] lg:text-xs">
            {course.category.name}
          </p>
        )}

        {/* Title */}

        <h2 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-extrabold leading-5 text-gray-900 transition group-hover:text-indigo-600 sm:mt-1.5 sm:min-h-[3rem] sm:text-base sm:leading-6 lg:min-h-[3.5rem] lg:text-lg lg:leading-7">
          {course.title}
        </h2>

        {/* Description */}

        <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-gray-500 sm:mt-1.5 sm:text-xs sm:leading-5 lg:mt-2 lg:text-sm lg:leading-6">
          {course.short_description}
        </p>

        {/* ==================================================
            Meta
        ================================================== */}

        <div className="mt-2.5 flex min-w-0 items-center gap-1.5 text-[9px] text-gray-400 sm:mt-3 sm:gap-2 sm:text-[10px] lg:mt-4 lg:gap-4 lg:text-xs">
          <span className="inline-flex min-w-0 items-center gap-1 truncate">
            <Clock3 className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
            {course.duration} min
          </span>

          <span
            aria-hidden="true"
            className="shrink-0"
          >
            •
          </span>

          <span className="truncate capitalize">
            {course.language}
          </span>
        </div>

        {/* ==================================================
            Bottom
        ================================================== */}

        <div className="mt-2.5 flex min-w-0 items-center justify-between gap-2 border-t border-gray-100 pt-2.5 sm:mt-4 sm:pt-3 lg:mt-5 lg:pt-4">
          {/* Price */}

          <div className="flex min-w-0 items-center gap-1">
            {isFree ? (
              <span className="text-sm font-extrabold text-emerald-600 sm:text-base lg:text-lg">
                Free
              </span>
            ) : (
              <>
                <span className="truncate text-sm font-extrabold text-gray-900 sm:text-base lg:text-lg">
                  ৳{price}
                </span>

                {hasDiscount && (
                  <span className="hidden shrink-0 text-[9px] text-gray-400 line-through sm:inline sm:text-[10px] lg:text-xs">
                    ৳{course.price}
                  </span>
                )}
              </>
            )}
          </div>

          {/* View */}

          <span className="inline-flex shrink-0 items-center gap-0.5 text-[10px] font-bold text-indigo-600 transition group-hover:translate-x-0.5 sm:text-xs lg:text-sm">
            <span className="hidden sm:inline">
              View
            </span>

            <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;