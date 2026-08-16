import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Loader2,
  Send,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import apiClient from "../../api/client";
import {
  getCourseQuizzes,
  startQuizAttempt,
  submitQuizAttempt,
} from "../../api/quizzes";

import type {
  Quiz,
  QuizAttempt,
} from "../../api/quizzes";

/* ============================================================
   TYPES
   ============================================================ */

interface Enrollment {
  id: string;
  course: string;
  course_title?: string;
  course_slug?: string;
  progress_percentage?: number;
  status?: string;
}

/* ============================================================
   QUIZ PAGE
   ============================================================ */

function QuizPage() {
  const {
    enrollmentId,
    quizId,
  } = useParams<{
    enrollmentId: string;
    quizId: string;
  }>();

  const navigate = useNavigate();

  const [quiz, setQuiz] =
    useState<Quiz | null>(null);

  const [attempt, setAttempt] =
    useState<QuizAttempt | null>(null);

  /*
   * questionId -> optionId
   */
  const [answers, setAnswers] =
    useState<Record<string, string>>({});

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [remainingSeconds, setRemainingSeconds] =
    useState<number | null>(null);

  /* ==========================================================
     LOAD QUIZ
     ========================================================== */

  useEffect(() => {
    if (!enrollmentId || !quizId) {
      setError("Invalid quiz URL.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadQuiz = async () => {
      try {
        setLoading(true);
        setError("");

        /*
         * 1. Get enrollment
         *
         * We need the course ID because the quiz API
         * returns quizzes by course.
         */
        const enrollmentResponse =
          await apiClient.get<Enrollment>(
            `/enrollments/${enrollmentId}/`,
          );

        const enrollmentData =
          enrollmentResponse.data;

        if (cancelled) {
          return;
        }

        /*
         * 2. Get quizzes for this course
         */
        const quizzes =
          await getCourseQuizzes(
            enrollmentData.course,
          );

        if (cancelled) {
          return;
        }

        /*
         * 3. Find requested quiz
         */
        const selectedQuiz =
          quizzes.find(
            (item) => item.id === quizId,
          );

        if (!selectedQuiz) {
          throw new Error(
            "Quiz not found for this course.",
          );
        }

        setQuiz(selectedQuiz);

        /*
         * 4. Start attempt
         */
        const startedAttempt =
          await startQuizAttempt(quizId);

        if (cancelled) {
          return;
        }

        setAttempt(startedAttempt);

        /*
         * 5. Calculate remaining time
         *
         * Backend started_at is the source of truth.
         */
        if (
          selectedQuiz.time_limit_minutes &&
          startedAttempt.started_at
        ) {
          const startedAt =
            new Date(
              startedAttempt.started_at,
            ).getTime();

          const limit =
            selectedQuiz.time_limit_minutes *
            60;

          const elapsed = Math.floor(
            (Date.now() - startedAt) / 1000,
          );

          const remaining = Math.max(
            0,
            limit - elapsed,
          );

          setRemainingSeconds(
            remaining,
          );
        }
      } catch (err: any) {
        console.error(
          "Quiz page error:",
          err,
        );

        if (
          err?.response?.data?.detail
        ) {
          setError(
            err.response.data.detail,
          );
        } else if (
          err?.response?.data?.message
        ) {
          setError(
            err.response.data.message,
          );
        } else if (
          err instanceof Error
        ) {
          setError(err.message);
        } else {
          setError(
            "Unable to load this quiz. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadQuiz();

    return () => {
      cancelled = true;
    };
  }, [enrollmentId, quizId]);

  /* ==========================================================
     TIMER
     ========================================================== */

  useEffect(() => {
    if (
      remainingSeconds === null ||
      remainingSeconds <= 0
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds(
        (current) => {
          if (
            current === null ||
            current <= 1
          ) {
            window.clearInterval(timer);
            return 0;
          }

          return current - 1;
        },
      );
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [remainingSeconds]);

  /* ==========================================================
     FORMAT TIME
     ========================================================== */

  const formattedTime = useMemo(() => {
    if (remainingSeconds === null) {
      return "--:--";
    }

    const minutes = Math.floor(
      remainingSeconds / 60,
    );

    const seconds =
      remainingSeconds % 60;

    return `${String(minutes).padStart(
      2,
      "0",
    )}:${String(seconds).padStart(
      2,
      "0",
    )}`;
  }, [remainingSeconds]);

  /* ==========================================================
     AUTO SUBMIT WHEN TIME ENDS
     ========================================================== */

  useEffect(() => {
    if (
      remainingSeconds !== 0 ||
      !attempt ||
      submitting
    ) {
      return;
    }

    const autoSubmit = async () => {
      await handleSubmit(true);
    };

    autoSubmit();
  }, [
    remainingSeconds,
    attempt,
    submitting,
  ]);

  /* ==========================================================
     SELECT ANSWER
     ========================================================== */

  const handleAnswerChange = (
    questionId: string,
    optionId: string,
  ) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: optionId,
    }));
  };

  /* ==========================================================
     SUBMIT QUIZ
     ========================================================== */

  async function handleSubmit(
    autoSubmit = false,
  ) {
    if (
      !quiz ||
      !attempt ||
      !quizId ||
      !enrollmentId
    ) {
      return;
    }

    if (submitting) {
      return;
    }

    /*
     * Check unanswered questions.
     */
    const unansweredQuestions =
      quiz.questions.filter(
        (question) =>
          !answers[question.id],
      );

    if (
      unansweredQuestions.length > 0 &&
      !autoSubmit
    ) {
      const firstUnanswered =
        unansweredQuestions[0];

      const questionElement =
        document.getElementById(
          `question-${firstUnanswered.id}`,
        );

      questionElement?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      setError(
        `Please answer all questions before submitting. ${unansweredQuestions.length} question${
          unansweredQuestions.length > 1
            ? "s"
            : ""
        } remaining.`,
      );

      return;
    }

    try {
      setSubmitting(true);
      setError("");

      /*
       * Convert:
       *
       * {
       *   questionId: optionId
       * }
       *
       * into the API payload.
       */
      const answerPayload =
        Object.entries(answers).map(
          ([question, selected_option]) => ({
            question,
            selected_option,
          }),
        );

      const result =
        await submitQuizAttempt(
          attempt.id,
          answerPayload,
        );

      /*
       * Go to result page.
       *
       * IMPORTANT:
       * We use enrollmentId here.
       */
      navigate(
        `/learning/${enrollmentId}/quiz/${quizId}/result`,
        {
          replace: true,
          state: {
            quiz,
            attempt: result,
          },
        },
      );
    } catch (err: any) {
      console.error(
        "Quiz submission error:",
        err,
      );

      if (
        err?.response?.data?.detail
      ) {
        setError(
          err.response.data.detail,
        );
      } else if (
        err?.response?.data?.message
      ) {
        setError(
          err.response.data.message,
        );
      } else {
        setError(
          "Unable to submit your quiz. Please try again.",
        );
      }

      setSubmitting(false);
    }
  }

  /* ==========================================================
     LOADING
     ========================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4">
          <div className="text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-indigo-600" />

            <p className="mt-4 text-sm font-medium text-gray-600">
              Loading quiz...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ==========================================================
     ERROR
     ========================================================== */

  if (error && !quiz) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4">
          <div className="w-full rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-7 w-7 text-red-500" />
            </div>

            <h1 className="mt-5 text-xl font-extrabold text-gray-900">
              Unable to load quiz
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {error}
            </p>

            {enrollmentId && (
              <Link
                to={`/learning/${enrollmentId}`}
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Course
              </Link>
            )}
          </div>
        </div>
      </main>
    );
  }

  if (!quiz || !attempt) {
    return null;
  }

  /* ==========================================================
     PROGRESS
     ========================================================== */

  const answeredCount =
    Object.keys(answers).length;

  const totalQuestions =
    quiz.questions.length;

  const progress =
    totalQuestions > 0
      ? Math.round(
          (answeredCount /
            totalQuestions) *
            100,
        )
      : 0;

  const timeIsLow =
    remainingSeconds !== null &&
    remainingSeconds <= 60;

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
        {/* ====================================================
            TOP NAVIGATION
            ==================================================== */}

        <div className="mb-5">
          <Link
            to={`/learning/${enrollmentId}`}
            className="inline-flex items-center text-sm font-semibold text-gray-600 transition hover:text-indigo-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Link>
        </div>

        {/* ====================================================
            QUIZ HEADER
            ==================================================== */}

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                  Quiz
                </div>

                <h1 className="mt-4 text-2xl font-extrabold leading-tight text-gray-950 sm:text-3xl">
                  {quiz.title}
                </h1>

                {quiz.description && (
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-500 sm:text-base">
                    {quiz.description}
                  </p>
                )}
              </div>

              {/* Timer */}
              {remainingSeconds !==
                null && (
                <div
                  className={`flex shrink-0 items-center rounded-xl border px-4 py-2.5 ${
                    timeIsLow
                      ? "border-red-200 bg-red-50 text-red-600"
                      : "border-gray-200 bg-gray-50 text-gray-700"
                  }`}
                >
                  <Clock3 className="mr-2 h-5 w-5" />

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Time left
                    </p>

                    <p className="text-lg font-extrabold tabular-nums">
                      {formattedTime}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* =================================================
                PROGRESS
                ================================================= */}

            <div className="mt-7">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-700">
                  {answeredCount} of{" "}
                  {totalQuestions} answered
                </span>

                <span className="font-bold text-indigo-600">
                  {progress}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            ERROR MESSAGE
            ==================================================== */}

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <p className="leading-6">
              {error}
            </p>
          </div>
        )}

        {/* ====================================================
            QUESTIONS
            ==================================================== */}

        <div className="mt-5 space-y-5">
          {quiz.questions.map(
            (question, questionIndex) => {
              const selectedOption =
                answers[question.id];

              return (
                <section
                  key={question.id}
                  id={`question-${question.id}`}
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
                >
                  {/* Question header */}

                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-extrabold text-indigo-600">
                      {questionIndex + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="text-base font-bold leading-6 text-gray-900 sm:text-lg">
                        {question.text}
                      </h2>

                      <p className="mt-1 text-xs font-medium text-gray-400">
                        {question.points}{" "}
                        {question.points ===
                        1
                          ? "point"
                          : "points"}
                      </p>
                    </div>
                  </div>

                  {/* Options */}

                  <div className="mt-5 space-y-3">
                    {question.options.map(
                      (
                        option,
                        optionIndex,
                      ) => {
                        const isSelected =
                          selectedOption ===
                          option.id;

                        const optionLetter =
                          String.fromCharCode(
                            65 +
                              optionIndex,
                          );

                        return (
                          <label
                            key={option.id}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition sm:p-4 ${
                              isSelected
                                ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
                                : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={
                                option.id
                              }
                              checked={
                                isSelected
                              }
                              onChange={() =>
                                handleAnswerChange(
                                  question.id,
                                  option.id,
                                )
                              }
                              className="sr-only"
                            />

                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                                isSelected
                                  ? "bg-indigo-600 text-white"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {
                                optionLetter
                              }
                            </span>

                            <span
                              className={`text-sm leading-6 ${
                                isSelected
                                  ? "font-bold text-indigo-900"
                                  : "font-medium text-gray-700"
                              }`}
                            >
                              {
                                option.text
                              }
                            </span>
                          </label>
                        );
                      },
                    )}
                  </div>
                </section>
              );
            },
          )}
        </div>

        {/* ====================================================
            SUBMIT SECTION
            ==================================================== */}

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-gray-900">
                Ready to submit?
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                You have answered{" "}
                <span className="font-bold text-gray-700">
                  {answeredCount}
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-700">
                  {totalQuestions}
                </span>{" "}
                questions.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                handleSubmit(false)
              }
              disabled={submitting}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Submit Quiz
                </>
              )}
            </button>
          </div>
        </section>

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </main>
  );
}

export default QuizPage;