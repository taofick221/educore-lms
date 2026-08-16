import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  Paperclip,
  Send,
  Upload,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { ChangeEvent } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getAssignmentSubmission,
  getCourseAssignments,
  submitAssignment,
  type Assignment,
  type Submission,
} from "../../api/assignments";

import apiClient from "../../api/client";

interface Enrollment {
  id: string;
  course: string;
  course_title: string;
  course_slug: string;
  progress_percentage: number;
  status: string;
}

function formatDueDate(
  value: string | null,
): string {
  if (!value) {
    return "No deadline";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
  ).format(new Date(value));
}

function isPastDue(
  value: string | null,
): boolean {
  if (!value) {
    return false;
  }

  return new Date(value).getTime() <
    Date.now();
}

function getStatusLabel(
  submission: Submission | null,
): string {
  if (!submission) {
    return "Not submitted";
  }

  if (submission.status === "graded") {
    return "Graded";
  }

  if (submission.status === "returned") {
    return "Returned";
  }

  return "Submitted";
}

function AssignmentPage() {
  const {
    enrollmentId,
    assignmentId,
  } = useParams<{
    enrollmentId: string;
    assignmentId: string;
  }>();

  const [enrollment, setEnrollment] =
    useState<Enrollment | null>(null);

  const [assignment, setAssignment] =
    useState<Assignment | null>(null);

  const [submission, setSubmission] =
    useState<Submission | null>(null);

  const [text, setText] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const loadAssignment =
    async () => {
      if (
        !enrollmentId ||
        !assignmentId
      ) {
        setError(
          "Assignment information is missing.",
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const enrollmentResponse =
          await apiClient.get<Enrollment>(
            `/enrollments/${enrollmentId}/`,
          );

        const enrollmentData =
          enrollmentResponse.data;

        setEnrollment(
          enrollmentData,
        );

        const assignments =
          await getCourseAssignments(
            enrollmentData.course,
          );

        const selectedAssignment =
          assignments.find(
            (item) =>
              item.id === assignmentId,
          );

        if (!selectedAssignment) {
          throw new Error(
            "Assignment not found.",
          );
        }

        setAssignment(
          selectedAssignment,
        );

        const existingSubmission =
          await getAssignmentSubmission(
            assignmentId,
          );

        setSubmission(
          existingSubmission,
        );

        if (existingSubmission) {
          setText(
            existingSubmission.text || "",
          );
        }
      } catch (err: any) {
        console.error(
          "Assignment page error:",
          err,
        );

        setError(
          err?.response?.data?.detail ||
            err?.message ||
            "Unable to load the assignment.",
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadAssignment();
  }, [
    enrollmentId,
    assignmentId,
  ]);

  const deadlinePassed = useMemo(
    () =>
      assignment
        ? isPastDue(
            assignment.due_at,
          )
        : false,
    [assignment],
  );

  const canEditSubmission =
    !submission ||
    submission.status === "submitted";

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(
        "File size must be 10 MB or smaller.",
      );
      event.target.value = "";
      return;
    }

    setError("");
    setSelectedFile(file);
  };

  const handleSubmit =
    async () => {
      if (
        !assignment ||
        !assignmentId
      ) {
        return;
      }

      if (!text.trim() && !selectedFile) {
        setError(
          "Please write your answer or attach a file before submitting.",
        );
        return;
      }

      if (
        deadlinePassed &&
        !submission
      ) {
        setError(
          "The submission deadline has passed.",
        );
        return;
      }

      try {
        setSubmitting(true);
        setError("");
        setSuccess("");

        const result =
          await submitAssignment(
            assignmentId,
            {
              text: text.trim(),
              attachment:
                selectedFile,
            },
          );

        setSubmission(result);
        setSelectedFile(null);

        setSuccess(
          "Your assignment was submitted successfully.",
        );
      } catch (err: any) {
        console.error(
          "Assignment submission error:",
          err,
        );

        setError(
          err?.response?.data?.detail ||
            "Unable to submit the assignment. Please try again.",
        );
      } finally {
        setSubmitting(false);
      }
    };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-9 w-9 animate-spin text-indigo-600" />
            <p className="mt-3 text-sm font-medium text-gray-500">
              Loading assignment...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (
    error &&
    !assignment
  ) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4">
          <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>

            <h1 className="mt-4 text-xl font-extrabold text-gray-900">
              Assignment unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {error}
            </p>

            <Link
              to={
                enrollmentId
                  ? `/learning/${enrollmentId}`
                  : "/my-courses"
              }
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Course
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (
    !assignment ||
    !enrollment
  ) {
    return null;
  }

  const status =
    getStatusLabel(submission);

  const isGraded =
    submission?.status ===
      "graded" ||
    submission?.status ===
      "returned";

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
        {/* Back */}

        <Link
          to={`/learning/${enrollment.id}`}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Link>

        {/* Header */}

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 px-5 py-6 text-white sm:px-8 sm:py-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
                  <FileText className="h-3.5 w-3.5" />
                  Assignment
                </div>

                <h1 className="mt-4 text-2xl font-extrabold leading-tight sm:text-3xl">
                  {assignment.title}
                </h1>

                <p className="mt-2 text-sm text-indigo-100">
                  Complete this task and
                  submit your work before
                  the deadline.
                </p>
              </div>

              <div className="shrink-0 rounded-xl bg-white/10 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-100">
                  Maximum Score
                </p>

                <p className="mt-1 text-2xl font-extrabold">
                  {assignment.max_score}
                </p>
              </div>
            </div>
          </div>

          {/* Meta */}

          <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="flex items-center gap-3 p-4 sm:p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <CalendarDays className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Deadline
                </p>

                <p className="mt-0.5 text-sm font-bold text-gray-800">
                  {formatDueDate(
                    assignment.due_at,
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 sm:p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Clock3 className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Status
                </p>

                <p className="mt-0.5 text-sm font-bold text-gray-800">
                  {status}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 sm:p-5">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  isGraded
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                {isGraded ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <FileText className="h-5 w-5" />
                )}
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Your Score
                </p>

                <p className="mt-0.5 text-sm font-bold text-gray-800">
                  {submission?.score !==
                  null &&
                  submission?.score !==
                    undefined
                    ? `${submission.score} / ${assignment.max_score}`
                    : "Not graded"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Error */}

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="leading-6">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              className="ml-auto shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Success */}

        {success && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="leading-6">
              {success}
            </p>
          </div>
        )}

        {/* Assignment description */}

        <section className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <FileText className="h-4 w-4" />
            </div>

            <h2 className="text-lg font-extrabold text-gray-900">
              Assignment Instructions
            </h2>
          </div>

          <div className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-600 sm:text-base">
            {assignment.description}
          </div>
        </section>

        {/* Graded result */}

        {isGraded &&
          submission && (
            <section className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div>
                  <p className="text-sm font-bold text-emerald-700">
                    Assignment Graded
                  </p>

                  <p className="mt-1 text-3xl font-extrabold text-gray-950">
                    {submission.score}{" "}
                    <span className="text-lg text-gray-400">
                      / {assignment.max_score}
                    </span>
                  </p>
                </div>
              </div>

              {submission.feedback && (
                <div className="mt-5 rounded-xl border border-emerald-100 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Instructor Feedback
                  </p>

                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
                    {submission.feedback}
                  </p>
                </div>
              )}
            </section>
          )}

        {/* Submission */}

        <section className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">
                Your Submission
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {submission
                  ? "You can update your submission while it has not been graded."
                  : "Write your answer below and submit your work."}
              </p>
            </div>

            {submission && (
              <span className="inline-flex w-fit items-center rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                {status}
              </span>
            )}
          </div>

          {canEditSubmission &&
          !deadlinePassed ? (
            <>
              <div className="mt-5">
                <label
                  htmlFor="assignment-answer"
                  className="text-sm font-bold text-gray-800"
                >
                  Your answer
                </label>

                <textarea
                  id="assignment-answer"
                  value={text}
                  onChange={(event) =>
                    setText(
                      event.target.value,
                    )
                  }
                  rows={9}
                  placeholder="Write your answer here..."
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="mt-5">
                <p className="text-sm font-bold text-gray-800">
                  Attachment
                </p>

                <div className="mt-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                  {selectedFile ? (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                          <Paperclip className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-gray-800">
                            {selectedFile.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            {(
                              selectedFile.size /
                              1024 /
                              1024
                            ).toFixed(
                              2,
                            )}{" "}
                            MB
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedFile(
                            null,
                          )
                        }
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center py-5 text-center">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                        <Upload className="h-5 w-5" />
                      </div>

                      <p className="mt-3 text-sm font-bold text-gray-700">
                        Upload your file
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Maximum file size: 10 MB
                      </p>

                      <input
                        type="file"
                        onChange={
                          handleFileChange
                        }
                        className="sr-only"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Link
                  to={`/learning/${enrollment.id}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Link>

                <button
                  type="button"
                  onClick={
                    handleSubmit
                  }
                  disabled={
                    submitting
                  }
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Assignment
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                <div>
                  <p className="text-sm font-bold text-gray-800">
                    {submission
                      ? "Your submission has been recorded."
                      : "Submission is closed."}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    {submission
                      ? "Your instructor will review your work and provide a score and feedback."
                      : "The deadline for this assignment has passed."}
                  </p>
                </div>
              </div>

              {submission?.text && (
                <div className="mt-4 rounded-xl bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Submitted Answer
                  </p>

                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
                    {submission.text}
                  </p>
                </div>
              )}

              {submission?.attachment_url && (
                <a
                  href={
                    submission.attachment_url
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
                >
                  <Paperclip className="h-4 w-4" />
                  View submitted attachment
                </a>
              )}
            </div>
          )}
        </section>

        <div className="h-8" />
      </div>
    </main>
  );
}

export default AssignmentPage;