import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  PlayCircle,
  Trophy,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import apiClient from "../../api/client";

import {
  createLessonProgress,
  getLessonProgress,
} from "../../api/enrollments";

import {
  getCourseQuizzes,
  type Quiz,
} from "../../api/quizzes";

import {
  getCourseAssignments,
  type Assignment,
} from "../../api/assignments";

import CourseProgress from "../../components/learning/CourseProgress";
import LessonList from "../../components/learning/LessonList";

/* ==========================================================
   TYPES
========================================================== */

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
   YOUTUBE URL HELPER
========================================================== */

function getYouTubeEmbedUrl(url: string): string {
  if (!url) {
    return "";
  }

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();

    if (
      hostname.includes("youtube.com") &&
      parsedUrl.pathname === "/watch"
    ) {
      const videoId = parsedUrl.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    if (hostname === "youtu.be") {
      const videoId = parsedUrl.pathname
        .replace(/^\/+/, "")
        .split("/")[0];

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    if (
      hostname.includes("youtube.com") &&
      parsedUrl.pathname.startsWith("/shorts/")
    ) {
      const videoId = parsedUrl.pathname
        .replace("/shorts/", "")
        .split("/")[0];

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    if (
      hostname.includes("youtube.com") &&
      parsedUrl.pathname.startsWith("/embed/")
    ) {
      return url;
    }

    return url;
  } catch {
    return "";
  }
}

/* ==========================================================
   DATE FORMATTER
========================================================== */

function formatDueDate(date: string | null): string {
  if (!date) {
    return "No deadline";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "No deadline";
  }

  return parsed.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ==========================================================
   DEADLINE STATUS
========================================================== */

function getAssignmentDeadline(
  dueAt: string | null,
): {
  label: string;
  className: string;
} {
  if (!dueAt) {
    return {
      label: "No deadline",
      className: "bg-gray-100 text-gray-600",
    };
  }

  const dueDate = new Date(dueAt);

  if (Number.isNaN(dueDate.getTime())) {
    return {
      label: "No deadline",
      className: "bg-gray-100 text-gray-600",
    };
  }

  const now = new Date();

  if (dueDate.getTime() <= now.getTime()) {
    return {
      label: "Deadline passed",
      className: "bg-red-50 text-red-700",
    };
  }

  const difference =
    dueDate.getTime() - now.getTime();

  const days = Math.ceil(
    difference / (1000 * 60 * 60 * 24),
  );

  if (days <= 1) {
    return {
      label: "Due soon",
      className: "bg-amber-50 text-amber-700",
    };
  }

  return {
    label: "Upcoming",
    className: "bg-emerald-50 text-emerald-700",
  };
}

/* ==========================================================
   COMPONENT
========================================================== */

function LearningPage() {
  const { enrollmentId } = useParams();
  const navigate = useNavigate();

  const [enrollment, setEnrollment] =
    useState<Enrollment | null>(null);

  const [course, setCourse] =
    useState<Course | null>(null);

  const [quizzes, setQuizzes] =
    useState<Quiz[]>([]);

  const [assignments, setAssignments] =
    useState<Assignment[]>([]);

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
     LOAD LEARNING DATA
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
           1. Enrollment
        -------------------------------------------------- */

        const enrollmentResponse =
          await apiClient.get<Enrollment>(
            `/enrollments/${enrollmentId}/`,
          );

        const enrollmentData =
          enrollmentResponse.data;

        setEnrollment(enrollmentData);

        const courseIdentifier =
          enrollmentData.course_slug ||
          enrollmentData.course;

        if (!courseIdentifier) {
          throw new Error(
            "Course information is missing.",
          );
        }

        /* --------------------------------------------------
           2. Course
        -------------------------------------------------- */

        const courseResponse =
          await apiClient.get<Course>(
            `/courses/${courseIdentifier}/`,
          );

        const courseData =
          courseResponse.data;

        setCourse(courseData);

        /* --------------------------------------------------
           3. Quizzes
        -------------------------------------------------- */

        try {
          const quizData =
            await getCourseQuizzes(
              enrollmentData.course,
            );

          setQuizzes(
            Array.isArray(quizData)
              ? quizData
              : [],
          );
        } catch (quizError) {
          console.error(
            "Failed to load quizzes:",
            quizError,
          );

          setQuizzes([]);
        }

        /* --------------------------------------------------
           4. Assignments
        -------------------------------------------------- */

        try {
          const assignmentData =
            await getCourseAssignments(
              enrollmentData.course,
            );

          setAssignments(
            Array.isArray(assignmentData)
              ? assignmentData
              : [],
          );
        } catch (assignmentError) {
          console.error(
            "Failed to load assignments:",
            assignmentError,
          );

          setAssignments([]);
        }

        /* --------------------------------------------------
           5. First lecture
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
           6. Lesson progress
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
     LECTURES
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
     SELECT LECTURE
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
     PREVIOUS
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
     NEXT
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
     START QUIZ
  ========================================================== */

  const handleStartQuiz = (quiz: Quiz) => {
    if (!enrollmentId) {
      setActionError(
        "Your enrollment information is missing.",
      );

      return;
    }

    navigate(
      `/learning/${enrollmentId}/quiz/${quiz.id}`,
    );
  };

  /* ==========================================================
     OPEN ASSIGNMENT
  ========================================================== */

  const handleOpenAssignment = (
    assignment: Assignment,
  ) => {
    if (!enrollmentId) {
      setActionError(
        "Your enrollment information is missing.",
      );

      return;
    }

    /*
     * Assignment page route:
     *
     * /learning/:enrollmentId/assignment/:assignmentId
     */
    navigate(
      `/learning/${enrollmentId}/assignment/${assignment.id}`,
    );
  };

  /* ==========================================================
     COMPLETE LECTURE
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
     LOADING
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
     ERROR
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
     MAIN UI
  ========================================================== */

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ==================================================
          HEADER
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
          MAIN
      ================================================== */}

      <main className="mx-auto max-w-[1440px] px-3 py-3 sm:px-6 sm:py-5">

        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[290px_minmax(0,1fr)]">

          {/* ==================================================
              LEARNING AREA
          ================================================== */}

          <section className="order-1 min-w-0 lg:order-2">

            {/* VIDEO */}

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

                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                        <PlayCircle className="h-5 w-5" />
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
                {/* LECTURE INFORMATION */}

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
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 sm:px-2.5 sm:py-1 sm:text-[10px]">
                            <CheckCircle2 className="h-3 w-3" />
                            Completed
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
                    <div className="mt-3 flex gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 sm:mt-4 sm:rounded-xl sm:px-4">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

                      <p className="text-xs font-medium leading-5 text-red-700 sm:text-sm">
                        {actionError}
                      </p>
                    </div>
                  )}

                  {/* COMPLETE */}

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
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition sm:w-auto sm:rounded-xl sm:px-5 sm:text-sm ${
                        currentCompleted
                          ? "cursor-default bg-emerald-50 text-emerald-700"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      } disabled:cursor-not-allowed disabled:opacity-70`}
                    >
                      {completing && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}

                      {completing
                        ? "Saving..."
                        : currentCompleted
                          ? "Completed"
                          : "Mark as Complete"}
                    </button>

                  </div>
                </div>

                {/* PREVIOUS / NEXT */}

                <div className="mt-2.5 flex items-center justify-between gap-2 sm:mt-3">

                  <button
                    type="button"
                    disabled={!previousLecture}
                    onClick={handlePrevious}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[11px] font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-xs"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Previous
                  </button>

                  <span className="text-[10px] font-medium text-gray-400 sm:text-xs">
                    {currentLectureIndex + 1}{" "}
                    / {allLectures.length}
                  </span>

                  <button
                    type="button"
                    disabled={!nextLecture}
                    onClick={handleNext}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-xs"
                  >
                    Next
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                </div>
              </>
            )}
          </section>

          {/* ==================================================
              COURSE CONTENT
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

            <div className="max-h-[650px] overflow-y-auto lg:max-h-[calc(100vh-140px)]">

              {/* ==================================================
                  LESSONS
              ================================================== */}

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

              {/* ==================================================
                  ASSIGNMENTS
              ================================================== */}

              <div className="border-t border-gray-200">

                <div className="px-3.5 py-3 sm:px-4">

                  <div className="flex items-center justify-between gap-2">

                    <div className="min-w-0">

                      <div className="flex items-center gap-1.5">

                        <FileText className="h-3.5 w-3.5 text-amber-600" />

                        <p className="text-[10px] font-bold uppercase tracking-wide text-amber-600 sm:text-xs">
                          Assignments
                        </p>

                      </div>

                      <h3 className="mt-0.5 text-xs font-extrabold text-gray-900 sm:text-sm">
                        Course Assignments
                      </h3>

                    </div>

                    <span className="rounded-full bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-700 sm:px-2.5 sm:text-[10px]">
                      {assignments.length}
                    </span>

                  </div>
                </div>

                {assignments.length > 0 ? (

                  <div className="space-y-2 px-3.5 pb-3.5 sm:px-4 sm:pb-4">

                    {assignments.map(
                      (assignment) => {
                        const deadline =
                          getAssignmentDeadline(
                            assignment.due_at,
                          );

                        return (
                          <button
                            key={
                              assignment.id
                            }
                            type="button"
                            onClick={() =>
                              handleOpenAssignment(
                                assignment,
                              )
                            }
                            className="group w-full rounded-xl border border-gray-200 bg-white p-3 text-left transition hover:border-amber-200 hover:bg-amber-50/40"
                          >

                            <div className="flex items-start gap-3">

                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                                <FileText className="h-4 w-4" />
                              </div>

                              <div className="min-w-0 flex-1">

                                <p className="line-clamp-2 text-xs font-bold leading-5 text-gray-900 group-hover:text-amber-700">
                                  {assignment.title}
                                </p>

                                {assignment.description && (
                                  <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-gray-500">
                                    {
                                      assignment.description
                                    }
                                  </p>
                                )}

                                <div className="mt-2 flex flex-wrap items-center gap-1.5">

                                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-[9px] font-semibold text-gray-600">
                                    <Trophy className="h-3 w-3" />
                                    {assignment.max_score}{" "}
                                    points
                                  </span>

                                  <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-semibold ${deadline.className}`}
                                  >
                                    <CalendarDays className="h-3 w-3" />
                                    {deadline.label}
                                  </span>

                                </div>

                                <div className="mt-2 flex items-center justify-between gap-2">

                                  <span className="inline-flex items-center gap-1 text-[9px] font-medium text-gray-500">
                                    <Clock3 className="h-3 w-3" />
                                    {formatDueDate(
                                      assignment.due_at,
                                    )}
                                  </span>

                                  <span className="text-[10px] font-bold text-amber-600 transition group-hover:text-amber-700">
                                    Open →
                                  </span>

                                </div>

                              </div>
                            </div>

                          </button>
                        );
                      },
                    )}

                  </div>

                ) : (

                  <div className="px-3.5 pb-4 sm:px-4">

                    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-3 py-4 text-center">

                      <FileText className="mx-auto h-5 w-5 text-gray-300" />

                      <p className="mt-2 text-[10px] font-medium text-gray-500 sm:text-xs">
                        No assignments available for this course yet.
                      </p>

                    </div>

                  </div>
                )}
              </div>

              {/* ==================================================
                  QUIZZES
              ================================================== */}

              <div className="border-t border-gray-200">

                <div className="px-3.5 py-3 sm:px-4">

                  <div className="flex items-center justify-between gap-2">

                    <div className="min-w-0">

                      <div className="flex items-center gap-1.5">

                        <BookOpen className="h-3.5 w-3.5 text-purple-600" />

                        <p className="text-[10px] font-bold uppercase tracking-wide text-purple-600 sm:text-xs">
                          Assessments
                        </p>

                      </div>

                      <h3 className="mt-0.5 text-xs font-extrabold text-gray-900 sm:text-sm">
                        Course Quizzes
                      </h3>

                    </div>

                    <span className="rounded-full bg-purple-50 px-2 py-1 text-[9px] font-bold text-purple-700 sm:px-2.5 sm:text-[10px]">
                      {quizzes.length}
                    </span>

                  </div>
                </div>

                {quizzes.length > 0 ? (

                  <div className="space-y-2 px-3.5 pb-3.5 sm:px-4 sm:pb-4">

                    {quizzes.map((quiz) => (
                      <button
                        key={quiz.id}
                        type="button"
                        onClick={() =>
                          handleStartQuiz(
                            quiz,
                          )
                        }
                        className="group w-full rounded-xl border border-gray-200 bg-white p-3 text-left transition hover:border-purple-200 hover:bg-purple-50/50"
                      >

                        <div className="flex items-start gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                            <BookOpen className="h-4 w-4" />
                          </div>

                          <div className="min-w-0 flex-1">

                            <p className="line-clamp-2 text-xs font-bold leading-5 text-gray-900 group-hover:text-purple-700">
                              {quiz.title}
                            </p>

                            <div className="mt-1.5 flex flex-wrap items-center gap-2">

                              <span className="text-[9px] font-semibold text-gray-500">
                                {quiz.questions?.length ||
                                  0}{" "}
                                {quiz.questions?.length ===
                                1
                                  ? "question"
                                  : "questions"}
                              </span>

                              <span className="text-[9px] font-semibold text-gray-400">
                                •
                              </span>

                              <span className="text-[9px] font-semibold text-gray-500">
                                Pass:{" "}
                                {quiz.passing_score}%
                              </span>

                              {quiz.time_limit_minutes >
                                0 && (
                                <>
                                  <span className="text-[9px] font-semibold text-gray-400">
                                    •
                                  </span>

                                  <span className="text-[9px] font-semibold text-gray-500">
                                    {
                                      quiz.time_limit_minutes
                                    }{" "}
                                    min
                                  </span>
                                </>
                              )}

                            </div>

                            <div className="mt-2 text-[10px] font-bold text-purple-600">
                              Start Quiz →
                            </div>

                          </div>
                        </div>

                      </button>
                    ))}

                  </div>

                ) : (

                  <div className="px-3.5 pb-4 sm:px-4">

                    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-3 py-4 text-center">

                      <BookOpen className="mx-auto h-5 w-5 text-gray-300" />

                      <p className="mt-2 text-[10px] font-medium text-gray-500 sm:text-xs">
                        No quizzes are available for this course yet.
                      </p>

                    </div>

                  </div>
                )}

              </div>

            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default LearningPage;