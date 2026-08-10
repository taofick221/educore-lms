import { Link } from "react-router-dom";
import type { Course } from "../../types/course";

interface Props {
  course: Course;
}

function getYouTubeEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);

    // youtube.com/watch?v=VIDEO_ID
    if (
      parsedUrl.hostname.includes("youtube.com") &&
      parsedUrl.searchParams.get("v")
    ) {
      return `https://www.youtube.com/embed/${parsedUrl.searchParams.get(
        "v",
      )}`;
    }

    // youtu.be/VIDEO_ID
    if (parsedUrl.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${parsedUrl.pathname}`;
    }

    // youtube.com/shorts/VIDEO_ID
    if (
      parsedUrl.hostname.includes("youtube.com") &&
      parsedUrl.pathname.startsWith("/shorts/")
    ) {
      const videoId = parsedUrl.pathname.split("/shorts/")[1];

      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Already an embed URL
    if (
      parsedUrl.hostname.includes("youtube.com") &&
      parsedUrl.pathname.startsWith("/embed/")
    ) {
      return url;
    }

    return url;
  } catch {
    return "";
  }
}

function CourseDetails({ course }: Props) {
  const hasDiscount =
    course.discount_price !== null &&
    Number(course.discount_price) < Number(course.price);

  const currentPrice = hasDiscount
    ? course.discount_price
    : course.price;

  const isFree = Number(currentPrice) === 0;

  const introVideoUrl = course.intro_video
    ? getYouTubeEmbedUrl(course.intro_video)
    : "";

  return (
    <div className="bg-white">
      {/* ==================================================
          Hero
      ================================================== */}

      <section className="overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-9 lg:px-8 lg:py-14">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">

            {/* Course Information */}

            <div className="flex min-w-0 flex-col justify-center">
              {course.category && (
                <Link
                  to="/courses"
                  className="w-fit rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700 transition hover:bg-indigo-200 sm:px-3 sm:py-1.5 sm:text-xs"
                >
                  {course.category.name}
                </Link>
              )}

              <h1 className="mt-3 max-w-3xl text-2xl font-extrabold leading-tight tracking-tight text-gray-900 sm:mt-4 sm:text-3xl lg:text-5xl">
                {course.title}
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 sm:mt-4 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
                {course.subtitle}
              </p>

              {/* Meta */}

              <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
                <span className="rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-semibold capitalize text-gray-600 shadow-sm ring-1 ring-gray-100 sm:px-3 sm:py-2 sm:text-sm">
                  {course.level}
                </span>

                <span className="rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-semibold capitalize text-gray-600 shadow-sm ring-1 ring-gray-100 sm:px-3 sm:py-2 sm:text-sm">
                  {course.language}
                </span>

                <span className="rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-semibold text-gray-600 shadow-sm ring-1 ring-gray-100 sm:px-3 sm:py-2 sm:text-sm">
                  {course.duration} min
                </span>

                {course.total_lectures !== undefined && (
                  <span className="rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-semibold text-gray-600 shadow-sm ring-1 ring-gray-100 sm:px-3 sm:py-2 sm:text-sm">
                    {course.total_lectures} lectures
                  </span>
                )}
              </div>

              {/* Instructor */}

              {course.instructor_name && (
                <div className="mt-5 flex items-center gap-2.5 sm:mt-7 sm:gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 sm:h-11 sm:w-11">
                    {course.instructor_name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 sm:text-xs">
                      Instructor
                    </p>

                    <p className="truncate text-sm font-semibold text-gray-800">
                      {course.instructor_name}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Purchase Card */}

            <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg shadow-gray-200/50 sm:rounded-2xl">

                {/* Thumbnail */}

                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
                      <span className="text-4xl font-extrabold text-white sm:text-5xl">
                        E
                      </span>
                    </div>
                  )}

                  {course.is_featured && (
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-indigo-700 shadow-sm sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
                      Featured Course
                    </span>
                  )}
                </div>

                <div className="p-4 sm:p-6">

                  {/* Price */}

                  <div className="flex items-end gap-2 sm:gap-3">
                    {isFree ? (
                      <span className="text-2xl font-extrabold text-emerald-600 sm:text-3xl">
                        Free
                      </span>
                    ) : (
                      <>
                        <span className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                          ৳{currentPrice}
                        </span>

                        {hasDiscount && (
                          <span className="pb-0.5 text-xs text-gray-400 line-through sm:pb-1 sm:text-sm">
                            ৳{course.price}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* CTA */}

                  <Link
                    to={`/checkout?course=${course.id}`}
                    className="mt-4 flex min-h-10 w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-100 transition hover:bg-indigo-700 sm:mt-6 sm:min-h-11 sm:px-5 sm:py-3.5"
                  >
                    {isFree
                      ? "Start Learning"
                      : "Enroll Now"}
                  </Link>

                  <p className="mt-2 text-center text-[10px] text-gray-400 sm:mt-3 sm:text-xs">
                    Full course access after enrollment
                  </p>

                  {/* Includes */}

                  <div className="mt-4 border-t border-gray-100 pt-4 sm:mt-6 sm:pt-5">
                    <p className="text-sm font-bold text-gray-900">
                      This course includes:
                    </p>

                    <div className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                      <div className="flex gap-2.5 text-xs text-gray-600 sm:gap-3 sm:text-sm">
                        <span className="shrink-0 text-indigo-600">
                          ✓
                        </span>
                        <span>
                          Structured course content
                        </span>
                      </div>

                      <div className="flex gap-2.5 text-xs text-gray-600 sm:gap-3 sm:text-sm">
                        <span className="shrink-0 text-indigo-600">
                          ✓
                        </span>
                        <span>
                          Progress tracking
                        </span>
                      </div>

                      <div className="flex gap-2.5 text-xs text-gray-600 sm:gap-3 sm:text-sm">
                        <span className="shrink-0 text-indigo-600">
                          ✓
                        </span>
                        <span>
                          Lifetime learning access
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          INTRO VIDEO
      ================================================== */}

      {introVideoUrl && (
        <section className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 sm:pt-10 lg:px-8 lg:pt-14">
          <div className="max-w-4xl">
            <div className="mb-4 sm:mb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 sm:text-sm">
                Course Preview
              </p>

              <h2 className="mt-1.5 text-xl font-extrabold text-gray-900 sm:text-2xl">
                Introduction to this course
              </h2>

              <p className="mt-1.5 text-xs text-gray-500 sm:text-sm">
                Watch the introduction before enrolling.
              </p>
            </div>

            <div className="overflow-hidden rounded-xl bg-black shadow-xl sm:rounded-2xl">
              <iframe
                src={introVideoUrl}
                title={`${course.title} - Introduction`}
                className="aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      {/* ==================================================
          Main Content
      ================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <div className="max-w-4xl">

          {/* About */}

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 sm:text-sm">
              Overview
            </p>

            <h2 className="mt-1.5 text-xl font-extrabold text-gray-900 sm:mt-2 sm:text-2xl">
              About this course
            </h2>

            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600 sm:mt-5 sm:text-base sm:leading-8">
              {course.description ||
                course.short_description}
            </p>
          </div>

          {/* What You'll Learn */}

          {course.learning_outcomes &&
            course.learning_outcomes.length > 0 && (
              <div className="mt-7 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:mt-10 sm:rounded-2xl sm:p-7">
                <h2 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                  What you'll learn
                </h2>

                <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-5">
                  {course.learning_outcomes.map(
                    (outcome) => (
                      <div
                        key={outcome.id}
                        className="flex gap-2.5 sm:gap-3"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-600 sm:h-6 sm:w-6 sm:text-xs">
                          ✓
                        </span>

                        <p className="text-xs leading-5 text-gray-600 sm:text-sm sm:leading-6">
                          {outcome.title}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

          {/* Features */}

          {course.features &&
            course.features.length > 0 && (
              <div className="mt-8 sm:mt-10">
                <h2 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                  Course features
                </h2>

                <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">
                  {course.features.map(
                    (feature) => (
                      <div
                        key={feature.id}
                        className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:rounded-2xl sm:p-5"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-sm text-indigo-600 sm:h-10 sm:w-10 sm:rounded-xl">
                          ✓
                        </div>

                        <h3 className="mt-3 text-sm font-bold text-gray-900 sm:mt-4">
                          {feature.title}
                        </h3>

                        {feature.description && (
                          <p className="mt-1.5 text-xs leading-5 text-gray-500 sm:mt-2 sm:text-sm sm:leading-6">
                            {feature.description}
                          </p>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

          {/* Requirements */}

          {course.requirements &&
            course.requirements.length > 0 && (
              <div className="mt-8 sm:mt-10">
                <h2 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                  Requirements
                </h2>

                <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 sm:mt-6 sm:rounded-2xl sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    {course.requirements.map(
                      (requirement) => (
                        <div
                          key={requirement.id}
                          className="flex gap-2.5 sm:gap-3"
                        >
                          <span className="mt-0.5 text-sm text-indigo-600">
                            •
                          </span>

                          <p className="text-xs leading-5 text-gray-600 sm:text-sm sm:leading-6">
                            {requirement.title}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}

          {/* Curriculum */}

          <div className="mt-8 sm:mt-10">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                Course content
              </h2>

              <p className="mt-1.5 text-xs text-gray-500 sm:text-sm">
                {course.total_sections ??
                  course.sections?.length ??
                  0}{" "}
                sections ·{" "}
                {course.total_lectures ?? 0}{" "}
                lectures
              </p>
            </div>

            {course.sections &&
            course.sections.length > 0 ? (
              <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 sm:mt-6 sm:rounded-2xl">
                {course.sections.map(
                  (section, sectionIndex) => (
                    <div
                      key={section.id}
                      className="border-b border-gray-200 last:border-b-0"
                    >
                      {/* Section Header */}

                      <div className="flex items-start gap-3 bg-gray-50 px-4 py-3.5 sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-5">
                        <div className="flex min-w-0 items-start gap-2.5 sm:items-center sm:gap-4">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-600 sm:h-10 sm:w-10 sm:rounded-xl sm:text-sm">
                            {sectionIndex + 1}
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-gray-900 sm:text-base">
                              {section.title}
                            </h3>

                            {section.description && (
                              <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-gray-500 sm:mt-1 sm:text-sm">
                                {section.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <span className="hidden shrink-0 text-xs font-medium text-gray-400 sm:block">
                          {section.lectures.length}{" "}
                          lectures
                        </span>
                      </div>

                      {/* Lectures */}

                      <div className="divide-y divide-gray-100">
                        {section.lectures.map(
                          (lecture) => (
                            <div
                              key={lecture.id}
                              className="flex items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4"
                            >
                              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-[10px] text-indigo-600 sm:h-9 sm:w-9 sm:text-xs">
                                  ▶
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate text-xs font-semibold text-gray-700 sm:text-sm">
                                    {lecture.title}
                                  </p>

                                  {lecture.is_preview && (
                                    <span className="text-[10px] font-semibold text-emerald-600 sm:text-xs">
                                      Preview available
                                    </span>
                                  )}
                                </div>
                              </div>

                              <span className="shrink-0 text-[10px] text-gray-400 sm:text-xs">
                                {lecture.duration} min
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-9 text-center sm:mt-6 sm:rounded-2xl sm:px-6 sm:py-12">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-600">
                  📚
                </div>

                <h3 className="mt-3 text-sm font-bold text-gray-900 sm:mt-4">
                  Course content is coming soon
                </h3>

                <p className="mt-1.5 text-xs leading-5 text-gray-500 sm:text-sm">
                  Lectures and sections will appear here
                  once they are published.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default CourseDetails;