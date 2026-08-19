import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Loader2,
  RefreshCw,
  Users,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  getInstructorDashboard,
  type InstructorDashboard,
} from "../../api/instructor";

function InstructorDashboardPage() {
  const [dashboard, setDashboard] =
    useState<InstructorDashboard | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getInstructorDashboard();

      setDashboard(data);
    } catch (err: any) {
      console.error(
        "Instructor dashboard error:",
        err,
      );

      if (err?.response?.status === 403) {
        setError(
          "You do not have permission to access the instructor dashboard.",
        );
      } else {
        setError(
          "Unable to load the instructor dashboard.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />
            <p className="mt-3 text-sm text-slate-500">
              Loading instructor dashboard...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-xl px-4 py-12">
          <div className="rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>

            <h1 className="mt-4 text-xl font-bold text-slate-900">
              Unable to load dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>

            <button
              onClick={loadDashboard}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!dashboard) {
    return null;
  }

  const completionRate =
    dashboard.enrollment_count > 0
      ? Math.round(
          (dashboard.completed_enrollment_count /
            dashboard.enrollment_count) *
            100,
        )
      : 0;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold text-indigo-600">
              Instructor Portal
            </p>

            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Instructor Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage your courses and monitor your
              teaching performance.
            </p>
          </div>

          <button
            onClick={loadDashboard}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">

          <StatCard
            title="Courses"
            value={dashboard.course_count}
            description={`${dashboard.published_course_count} published`}
            icon={BookOpen}
          />

          <StatCard
            title="Students"
            value={dashboard.student_count}
            description={`${dashboard.enrollment_count} enrollments`}
            icon={Users}
          />

          <StatCard
            title="Completed"
            value={dashboard.completed_enrollment_count}
            description={`${completionRate}% completion`}
            icon={CheckCircle2}
          />

          <StatCard
            title="Revenue"
            value={`৳${Number(
              dashboard.revenue,
            ).toLocaleString()}`}
            description="Total revenue"
            icon={Wallet}
          />
        </section>

        {/* Main workspace */}
        <section className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* Learning overview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Teaching overview
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  A quick look at your current instructor
                  activity.
                </p>
              </div>

              <GraduationCap className="h-6 w-6 text-indigo-600" />
            </div>

            <div className="mt-6 space-y-5">
              <ProgressRow
                label="Published courses"
                value={
                  dashboard.published_course_count
                }
                total={dashboard.course_count}
              />

              <ProgressRow
                label="Completed enrollments"
                value={
                  dashboard.completed_enrollment_count
                }
                total={
                  dashboard.enrollment_count
                }
              />
            </div>
          </div>

          {/* Workspace */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-base font-extrabold text-slate-900">
              Instructor Workspace
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage your teaching content.
            </p>

            <div className="mt-5 space-y-3">

              <WorkspaceLink
                to="/instructor/courses"
                icon={BookOpen}
                title="My Courses"
                description="Manage your courses and content."
              />

            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-indigo-100">
                Course management
              </p>

              <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">
                Build and manage your courses
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">
                Add sections, lectures and learning
                resources from one workspace.
              </p>
            </div>

            <Link
              to="/instructor/courses"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-indigo-700 hover:bg-indigo-50"
            >
              Open Courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-400 sm:text-sm">
            {title}
          </p>

          <p className="mt-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
            {value}
          </p>

          <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
            {description}
          </p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 sm:h-10 sm:w-10">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PROGRESS
============================================================ */

function ProgressRow({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percentage =
    total > 0
      ? Math.min(
          Math.round((value / total) * 100),
          100,
        )
      : 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-700">
          {label}
        </span>

        <span className="text-sm font-bold text-slate-900">
          {percentage}%
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <p className="mt-2 text-xs text-slate-400">
        {value} of {total}
      </p>
    </div>
  );
}

/* ============================================================
   WORKSPACE LINK
============================================================ */

function WorkspaceLink({
  to,
  icon: Icon,
  title,
  description,
}: {
  to: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="group block rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-indigo-200 hover:bg-indigo-50"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-bold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default InstructorDashboardPage;