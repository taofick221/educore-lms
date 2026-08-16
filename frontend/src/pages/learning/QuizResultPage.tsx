import {
  CheckCircle2,
  XCircle,
  Award,
  Target,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";

import {
  Link,
  useLocation,
  useParams,
} from "react-router-dom";

import type {
  Quiz,
  QuizAttempt,
} from "../../api/quizzes";

interface ResultState {
  quiz: Quiz;
  attempt: QuizAttempt;
}

function QuizResultPage() {
  const { enrollmentId } = useParams<{
    enrollmentId: string;
    quizId: string;
  }>();

  const location = useLocation();

  const state =
    location.state as ResultState | null;

  /*
   * ----------------------------------------------------------
   * RESULT DATA NOT AVAILABLE
   * ----------------------------------------------------------
   */

  if (!state?.quiz || !state?.attempt) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4 py-10 sm:px-6">
          <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
              <Target className="h-7 w-7 text-amber-600" />
            </div>

            <h1 className="mt-5 text-xl font-extrabold text-gray-900">
              Quiz Result Not Available
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              We could not find the quiz result for this
              page. Please return to your course and open
              the quiz again.
            </p>

            <Link
              to={
                enrollmentId
                  ? `/learning/${enrollmentId}`
                  : "/my-courses"
              }
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Course
            </Link>

          </div>
        </div>
      </main>
    );
  }

  const { quiz, attempt } = state;

  const score =
    Number(attempt.score) || 0;

  const passingScore =
    Number(quiz.passing_score) || 0;

  const passed =
    score >= passingScore;

  /*
   * ----------------------------------------------------------
   * MAIN RESULT PAGE
   * ----------------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-[75vh] max-w-3xl items-center px-4 py-8 sm:px-6 lg:px-8">

        <div className="w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

          {/* ==================================================
              RESULT HEADER
          ================================================== */}

          <div
            className={`px-5 py-8 text-center sm:px-10 sm:py-12 ${
              passed
                ? "bg-emerald-50"
                : "bg-red-50"
            }`}
          >

            {/* Icon */}

            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                passed
                  ? "bg-emerald-100"
                  : "bg-red-100"
              }`}
            >
              {passed ? (
                <CheckCircle2 className="h-9 w-9 text-emerald-600" />
              ) : (
                <XCircle className="h-9 w-9 text-red-600" />
              )}
            </div>

            {/* Status */}

            <p
              className={`mt-5 text-sm font-extrabold uppercase tracking-wide ${
                passed
                  ? "text-emerald-700"
                  : "text-red-600"
              }`}
            >
              {passed
                ? "Quiz Passed"
                : "Quiz Not Passed"}
            </p>

            {/* Title */}

            <h1 className="mx-auto mt-3 max-w-2xl text-2xl font-extrabold leading-tight tracking-tight text-gray-950 sm:text-3xl">
              {quiz.title}
            </h1>

            {/* Score */}

            <div className="mt-8">

              <p className="text-sm font-semibold text-gray-500">
                Your Score
              </p>

              <p
                className={`mt-1 text-6xl font-black tracking-tight sm:text-7xl ${
                  passed
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {score}%
              </p>

            </div>

          </div>

          {/* ==================================================
              RESULT DETAILS
          ================================================== */}

          <div className="p-5 sm:p-8">

            {/* Score summary */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              {/* Your score */}

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                    <Award className="h-5 w-5 text-indigo-600" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500">
                      Your Score
                    </p>

                    <p className="mt-0.5 text-lg font-extrabold text-gray-900">
                      {score}%
                    </p>
                  </div>

                </div>

              </div>

              {/* Passing score */}

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                    <Target className="h-5 w-5 text-purple-600" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500">
                      Passing Score
                    </p>

                    <p className="mt-0.5 text-lg font-extrabold text-gray-900">
                      {passingScore}%
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* ==================================================
                MESSAGE
            ================================================== */}

            <div
              className={`mt-5 rounded-2xl border p-5 ${
                passed
                  ? "border-emerald-100 bg-emerald-50"
                  : "border-red-100 bg-red-50"
              }`}
            >

              <h2
                className={`text-sm font-extrabold ${
                  passed
                    ? "text-emerald-800"
                    : "text-red-800"
                }`}
              >
                {passed
                  ? "Excellent work!"
                  : "Keep learning and try again!"}
              </h2>

              <p
                className={`mt-1.5 text-sm leading-6 ${
                  passed
                    ? "text-emerald-700"
                    : "text-red-700"
                }`}
              >
                {passed
                  ? `You scored ${score}% and passed this quiz. You have successfully met the required passing score of ${passingScore}%.`
                  : `You scored ${score}%. You need at least ${passingScore}% to pass this quiz. Review the course materials and try again when you are ready.`}
              </p>

            </div>

            {/* ==================================================
                STATUS
            ================================================== */}

            <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5">

              <div className="flex items-center justify-between gap-4">

                <span className="text-sm font-medium text-gray-500">
                  Assessment status
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                    passed
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {passed
                    ? "PASSED"
                    : "NOT PASSED"}
                </span>

              </div>

            </div>

            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">

              {/* Back to course */}

              <Link
                to={`/learning/${enrollmentId}`}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Course
              </Link>

              {/* Try Again */}

              {!passed && (
                <Link
                  to={`/learning/${enrollmentId}/quiz/${quiz.id}`}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:border-indigo-200 hover:bg-gray-50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </Link>
              )}

            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

export default QuizResultPage;