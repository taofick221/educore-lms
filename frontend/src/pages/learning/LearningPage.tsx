import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import apiClient from "../../api/client";

import {
  createLessonProgress,
  getLessonProgress,
} from "../../api/enrollments";

import CourseProgress from "../../components/learning/CourseProgress";
import LessonList from "../../components/learning/LessonList";

interface Lecture {
  id: string;
  title: string;
  slug: string;
  description: string;
  video_url: string;
  duration: number;
  order: number;
  is_preview: boolean;
  is_active: boolean;
  is_published: boolean;
  resources: unknown[];
}

interface Section {
  id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  lectures: Lecture[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  sections: Section[];
  total_sections: number;
  total_lectures: number;
}

interface Enrollment {
  id: string;
  course: string;
  course_title: string;
  course_slug: string;
  progress_percentage: number;
  status: string;
}

interface LessonProgress {
  id: string;
  enrollment: string;
  lecture: string;
  last_watched_second: number;
  watch_percentage: number;
  is_completed: boolean;
  completed_at: string | null;
}

/* ==========================================================
   YouTube URL Helper
========================================================== */

function getYouTubeEmbedUrl(
  url: string,
): string {
  if (!url) {
    return "";
  }

  try {
    const parsedUrl = new URL(url);

    const hostname =
      parsedUrl.hostname.toLowerCase();

    /* --------------------------------------------------------
       youtube.com/watch?v=VIDEO_ID
    -------------------------------------------------------- */

    if (
      hostname.includes("youtube.com") &&
      parsedUrl.pathname === "/watch"
    ) {
      const videoId =
        parsedUrl.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    /* --------------------------------------------------------
       youtu.be/VIDEO_ID
    -------------------------------------------------------- */

    if (hostname === "youtu.be") {
      const videoId =
        parsedUrl.pathname.replace(
          /^\/+/,
          "",
        );

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    /* --------------------------------------------------------
       youtube.com/shorts/VIDEO_ID
    -------------------------------------------------------- */

    if (
      hostname.includes("youtube.com") &&
      parsedUrl.pathname.startsWith(
        "/shorts/",
      )
    ) {
      const videoId =
        parsedUrl.pathname
          .replace("/shorts/", "")
          .split("/")[0];

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    /* --------------------------------------------------------
       youtube.com/embed/VIDEO_ID
    -------------------------------------------------------- */

    if (
      hostname.includes("youtube.com") &&
      parsedUrl.pathname.startsWith(
        "/embed/",
      )
    ) {
      return url;
    }

    /*
     * If the backend already provides an iframe-compatible
     * URL, return it as-is.
     */

    return url;
  } catch {
    return "";
  }
}

/* ==========================================================
   Component
========================================================== */

function LearningPage() {
  const { enrollmentId } = useParams();

  const [enrollment, setEnrollment] =
    useState<Enrollment | null>(null);

  const [course, setCourse] =
    useState<Course | null>(null);

  const [selectedLecture, setSelectedLecture] =
    useState<Lecture | null>(null);

  const [completedLectures, setCompletedLectures] =
    useState<Set<string>>(new Set());

  const [loading, setLoading] =
    useState(true);

  const [completing, setCompleting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [actionError, setActionError] =
    useState("");

  /* ==========================================================
     Load Enrollment + Course + Progress
  ========================================================== */

  useEffect(() => {
    const loadLearningData = async () => {
      if (!enrollmentId) {
        setError("Enrollment not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        /* --------------------------------------------------
           1. Load Enrollment
        -------------------------------------------------- */

        const enrollmentResponse =
          await apiClient.get<Enrollment>(
            `/enrollments/${enrollmentId}/`,
          );

        const enrollmentData =
          enrollmentResponse.data;

        setEnrollment(enrollmentData);

        /* --------------------------------------------------
           2. Determine Course URL
        -------------------------------------------------- */

        const courseIdentifier =
          enrollmentData.course_slug ||
          enrollmentData.course;

        if (!courseIdentifier) {
          throw new Error(
            "Course information is missing.",
          );
        }

        /* --------------------------------------------------
           3. Load Course
        -------------------------------------------------- */

        const courseResponse =
          await apiClient.get<Course>(
            `/courses/${courseIdentifier}/`,
          );

        const courseData =
          courseResponse.data;

        setCourse(courseData);

        /* --------------------------------------------------
           4. Find First Available Lecture
        -------------------------------------------------- */

        const availableLectures =
          courseData.sections
            ?.flatMap(
              (section) =>
                section.lectures || [],
            )
            .filter(
              (lecture) =>
                lecture.is_active &&
                lecture.is_published,
            ) || [];

        if (availableLectures.length > 0) {
          setSelectedLecture(
            availableLectures[0],
          );
        } else {
          setSelectedLecture(null);
        }

        /* --------------------------------------------------
           5. Load Existing Lesson Progress
        -------------------------------------------------- */

        try {
          const progress =
            await getLessonProgress();

          const completedIds =
            progress
              .filter(
                (item: LessonProgress) =>
                  item.enrollment ===
                    enrollmentData.id &&
                  item.is_completed,
              )
              .map(
                (item: LessonProgress) =>
                  item.lecture,
              );

          setCompletedLectures(
            new Set(completedIds),
          );
        } catch (progressError) {
          console.error(
            "Failed to load lesson progress:",
            progressError,
          );
        }
      } catch (err: any) {
        console.error(
          "Learning page error:",
          err,
        );

        const backendError =
          err?.response?.data;

        if (
          backendError &&
          typeof backendError === "object"
        ) {
          const message =
            Object.values(backendError)
              .flat()
              .join(" ");

          setError(
            message ||
              "Failed to load your course.",
          );
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(
            "Failed to load your course.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadLearningData();
  }, [enrollmentId]);

  /* ==========================================================
     All Published + Active Lectures
  ========================================================== */

  const allLectures = useMemo(() => {
    if (!course) {
      return [];
    }

    return course.sections.flatMap(
      (section) =>
        section.lectures?.filter(
          (lecture) =>
            lecture.is_active &&
            lecture.is_published,
        ) || [],
    );
  }, [course]);

  /* ==========================================================
     Current Lecture
  ========================================================== */

  const currentLectureIndex =
    selectedLecture
      ? allLectures.findIndex(
          (lecture) =>
            lecture.id ===
            selectedLecture.id,
        )
      : -1;

  const previousLecture =
    currentLectureIndex > 0
      ? allLectures[
          currentLectureIndex - 1
        ]
      : null;

  const nextLecture =
    currentLectureIndex >= 0 &&
    currentLectureIndex <
      allLectures.length - 1
      ? allLectures[
          currentLectureIndex + 1
        ]
      : null;

  const currentCompleted =
    selectedLecture
      ? completedLectures.has(
          selectedLecture.id,
        )
      : false;

  /* ==========================================================
     Select Lecture
  ========================================================== */

  const handleLectureSelect = (
    lectureId: string,
  ) => {
    const lecture =
      allLectures.find(
        (item) =>
          item.id === lectureId,
      );

    if (!lecture) {
      return;
    }

    setSelectedLecture(lecture);
    setActionError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ==========================================================
     Previous
  ========================================================== */

  const handlePrevious = () => {
    if (!previousLecture) {
      return;
    }

    setSelectedLecture(previousLecture);
    setActionError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ==========================================================
     Next
  ========================================================== */

  const handleNext = () => {
    if (!nextLecture) {
      return;
    }

    setSelectedLecture(nextLecture);
    setActionError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ==========================================================
     Mark Lecture Complete
  ========================================================== */

  const handleCompleteLecture =
    async () => {
      if (
        !selectedLecture ||
        !enrollment ||
        completing ||
        currentCompleted
      ) {
        return;
      }

      try {
        setCompleting(true);
        setActionError("");

        const progress =
          await getLessonProgress();

        const existingProgress =
          progress.find(
            (item: LessonProgress) =>
              item.enrollment ===
                enrollment.id &&
              item.lecture ===
                selectedLecture.id,
          );

        const watchSeconds =
          Math.max(
            0,
            selectedLecture.duration * 60,
          );

        if (existingProgress) {
          await apiClient.patch(
            `/enrollments/lesson-progress/${existingProgress.id}/`,
            {
              last_watched_second:
                watchSeconds,

              watch_percentage: 100,
            },
          );
        } else {
          await createLessonProgress({
            enrollment:
              enrollment.id,

            lecture:
              selectedLecture.id,

            last_watched_second:
              watchSeconds,

            watch_percentage: 100,
          });
        }

        setCompletedLectures(
          (previous) => {
            const updated =
              new Set(previous);

            updated.add(
              selectedLecture.id,
            );

            return updated;
          },
        );

        /* --------------------------------------------------
           Refresh Enrollment Progress
        -------------------------------------------------- */

        try {
          const response =
            await apiClient.get<Enrollment>(
              `/enrollments/${enrollment.id}/`,
            );

          setEnrollment(response.data);
        } catch (refreshError) {
          console.error(
            "Failed to refresh enrollment:",
            refreshError,
          );
        }
      } catch (err: any) {
        console.error(
          "Complete lecture error:",
          err,
        );

        const backendError =
          err?.response?.data;

        if (
          backendError &&
          typeof backendError === "object"
        ) {
          const message =
            Object.values(backendError)
              .flat()
              .join(" ");

          setActionError(
            message ||
              "Failed to mark the lecture as complete.",
          );
        } else {
          setActionError(
            "Failed to mark the lecture as complete.",
          );
        }
      } finally {
        setCompleting(false);
      }
    };

  /* ==========================================================
     Loading
  ========================================================== */

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-gray-50 px-3 py-5 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-6xl animate-pulse space-y-3 sm:space-y-4">
          <div className="h-4 w-32 rounded bg-gray-200 sm:h-5 sm:w-40" />

          <div className="aspect-video rounded-xl bg-gray-200 sm:rounded-2xl" />

          <div className="h-28 rounded-xl bg-gray-200 sm:h-32 sm:rounded-2xl" />
        </div>
      </div>
    );
  }

  /* ==========================================================
     Error
  ========================================================== */

  if (
    error ||
    !course ||
    !enrollment
  ) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-7">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-base font-bold text-red-600">
            !
          </div>

          <h1 className="mt-3 text-base font-bold text-gray-900 sm:text-lg">
            Unable to load course
          </h1>

          <p className="mt-1.5 text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">
            {error ||
              "The course could not be loaded."}
          </p>

          <Link
            to="/my-courses"
            className="mt-4 inline-flex rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700 sm:mt-5 sm:rounded-xl sm:px-5 sm:text-sm"
          >
            Back to My Courses
          </Link>
        </div>
      </div>
    );
  }

  /* ==========================================================
     Main UI
  ========================================================== */

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ==================================================
          Header
      ================================================== */}

      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-[1440px] px-3 py-2.5 sm:px-6 sm:py-3">
          <div className="flex items-center justify-between gap-3">

            <div className="min-w-0 flex-1">
              <Link
                to="/my-courses"
                className="text-[11px] font-bold text-indigo-600 transition hover:text-indigo-700 sm:text-xs"
              >
                ← My Courses
              </Link>

              <h1 className="mt-0.5 truncate text-sm font-extrabold text-gray-900 sm:text-base lg:text-lg">
                {course.title}
              </h1>
            </div>

            <div className="w-28 shrink-0 sm:w-48 lg:w-56">
              <CourseProgress
                progress={
                  enrollment.progress_percentage
                }
              />
            </div>
          </div>
        </div>
      </header>

      {/* ==================================================
          Main
      ================================================== */}

      <main className="mx-auto max-w-[1440px] px-3 py-3 sm:px-6 sm:py-5">
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[290px_minmax(0,1fr)]">

          {/* ==================================================
              Learning Area
          ================================================== */}

          <section className="order-1 min-w-0 lg:order-2">

            {/* Video */}

            <div className="overflow-hidden rounded-xl bg-black shadow-sm sm:rounded-2xl">
              {selectedLecture ? (
                selectedLecture.video_url ? (
                  <iframe
                    src={getYouTubeEmbedUrl(
                      selectedLecture.video_url,
                    )}
                    title={
                      selectedLecture.title
                    }
                    className="aspect-video w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-gray-950 px-4">
                    <div className="text-center text-white">
                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-base">
                        ▶
                      </div>

                      <p className="mt-2 text-xs font-semibold text-gray-300 sm:text-sm">
                        Video not available
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex aspect-video items-center justify-center bg-gray-950">
                  <div className="px-4 text-center">
                    <p className="text-xs font-semibold text-gray-300 sm:text-sm">
                      No published lectures available.
                    </p>

                    <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                      Please check the course curriculum.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {selectedLecture && (
              <>
                {/* Lecture Information */}

                <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-4 sm:rounded-2xl sm:p-5 lg:p-6">
                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-indigo-600 sm:text-xs">
                          Lecture{" "}
                          {currentLectureIndex +
                            1}{" "}
                          /{" "}
                          {allLectures.length}
                        </span>

                        {currentCompleted && (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 sm:px-2.5 sm:py-1 sm:text-[10px]">
                            ✓ Completed
                          </span>
                        )}
                      </div>

                      <h2 className="mt-1 text-base font-extrabold leading-6 text-gray-900 sm:text-lg sm:leading-7 lg:text-xl">
                        {selectedLecture.title}
                      </h2>
                    </div>

                    <span className="shrink-0 rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-600 sm:px-3 sm:py-1.5 sm:text-xs">
                      {selectedLecture.duration} min
                    </span>
                  </div>

                  {selectedLecture.description && (
                    <p className="mt-3 whitespace-pre-line text-xs leading-5 text-gray-600 sm:mt-4 sm:text-sm sm:leading-6">
                      {selectedLecture.description}
                    </p>
                  )}

                  {actionError && (
                    <div className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 sm:mt-4 sm:rounded-xl sm:px-4">
                      <p className="text-xs font-medium leading-5 text-red-700 sm:text-sm">
                        {actionError}
                      </p>
                    </div>
                  )}

                  {/* Completion */}

                  <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:mt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 sm:text-sm">
                        {currentCompleted
                          ? "Lecture completed"
                          : "Finished this lecture?"}
                      </p>

                      <p className="mt-0.5 text-[10px] leading-4 text-gray-500 sm:text-xs sm:leading-5">
                        {currentCompleted
                          ? "Your progress has been saved."
                          : "Mark it complete to update your progress."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        handleCompleteLecture
                      }
                      disabled={
                        currentCompleted ||
                        completing
                      }
                      className={`w-full rounded-lg px-4 py-2.5 text-xs font-bold transition sm:w-auto sm:rounded-xl sm:px-5 sm:text-sm ${
                        currentCompleted
                          ? "cursor-default bg-emerald-50 text-emerald-700"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      } disabled:cursor-not-allowed disabled:opacity-70`}
                    >
                      {completing
                        ? "Saving..."
                        : currentCompleted
                          ? "✓ Completed"
                          : "Mark as Complete"}
                    </button>
                  </div>
                </div>

                {/* Previous / Next */}

                <div className="mt-2.5 flex items-center justify-between gap-2 sm:mt-3">
                  <button
                    type="button"
                    disabled={!previousLecture}
                    onClick={handlePrevious}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-[11px] font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-xs"
                  >
                    ← Previous
                  </button>

                  <span className="text-[10px] font-medium text-gray-400 sm:text-xs">
                    {currentLectureIndex + 1}{" "}
                    / {allLectures.length}
                  </span>

                  <button
                    type="button"
                    disabled={!nextLecture}
                    onClick={handleNext}
                    className="rounded-lg bg-indigo-600 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-xs"
                  >
                    Next →
                  </button>
                </div>
              </>
            )}
          </section>

          {/* ==================================================
              Course Content
          ================================================== */}

          <aside className="order-2 h-fit overflow-hidden rounded-xl border border-gray-200 bg-white lg:order-1 lg:sticky lg:top-[75px] lg:rounded-2xl">

            <div className="border-b border-gray-200 px-3.5 py-3 sm:px-4">
              <div className="flex items-center justify-between gap-2">

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-600 sm:text-xs">
                    Course Content
                  </p>

                  <h2 className="mt-0.5 text-xs font-extrabold text-gray-900 sm:text-sm">
                    {course.sections?.length || 0}{" "}
                    {course.sections?.length === 1
                      ? "Section"
                      : "Sections"}
                  </h2>
                </div>

                <span className="shrink-0 rounded-full bg-gray-100 px-2 py-1 text-[9px] font-bold text-gray-600 sm:px-2.5 sm:text-[10px]">
                  {allLectures.length}{" "}
                  {allLectures.length === 1
                    ? "lesson"
                    : "lessons"}
                </span>
              </div>
            </div>

            <div className="max-h-[520px] overflow-y-auto lg:max-h-[calc(100vh-140px)]">
              <LessonList
                sections={course.sections}
                selectedLecture={
                  selectedLecture?.id ?? null
                }
                completedLectures={
                  completedLectures
                }
                onSelect={
                  handleLectureSelect
                }
              />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default LearningPage;