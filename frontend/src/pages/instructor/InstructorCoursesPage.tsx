import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  Eye,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  deleteInstructorCourse,
  getInstructorCourses,
  type InstructorCourse,
} from "../../api/instructor";

function InstructorCoursesPage() {
  const navigate = useNavigate();

  const [courses, setCourses] =
    useState<InstructorCourse[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [deletingSlug, setDeletingSlug] =
    useState<string | null>(null);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getInstructorCourses();

      setCourses(data);
    } catch (err: any) {
      console.error(
        "Instructor courses error:",
        err,
      );

      setError(
        err?.response?.data?.detail ||
          "Unable to load your courses.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return courses;
    }

    return courses.filter((course) =>
      [
        course.title,
        course.subtitle,
        course.short_description,
        course.category?.name,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query),
        ),
    );
  }, [courses, search]);

  const publishedCount =
    courses.filter(
      (course) => course.is_published,
    ).length;

  const draftCount =
    courses.length - publishedCount;

  const handleDelete = async (
    course: InstructorCourse,
  ) => {
    const confirmed = window.confirm(
      `Delete "${course.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingSlug(course.slug);

      await deleteInstructorCourse(
        course.slug,
      );

      setCourses((previous) =>
        previous.filter(
          (item) =>
            item.slug !== course.slug,
        ),
      );
    } catch (err: any) {
      window.alert(
        err?.response?.data?.detail ||
          "Unable to delete this course.",
      );
    } finally {
      setDeletingSlug(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />

            <p className="mt-3 text-sm text-slate-500">
              Loading your courses...
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
            <FileText className="mx-auto h-10 w-10 text-red-500" />

            <h1 className="mt-4 text-xl font-bold text-slate-900">
              Unable to load courses
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>

            <button
              onClick={loadCourses}
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

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* Header */}
        <div className="flex flex-col gap-5">
          <Link
            to="/instructor"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold text-indigo-600">
                Instructor Workspace
              </p>

              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                My Courses
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create, edit and manage your learning
                content.
              </p>
            </div>

            <Link
              to="/instructor/courses/new"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Create Course
            </Link>
          </div>
        </div>

        {/* Summary */}
        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <SummaryCard
            label="Total courses"
            value={courses.length}
          />

          <SummaryCard
            label="Published"
            value={publishedCount}
          />

          <SummaryCard
            label="Drafts"
            value={draftCount}
          />
        </section>

        {/* Search */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search your courses..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </section>

        {/* Empty */}
        {filteredCourses.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-slate-300" />

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              {search
                ? "No matching courses"
                : "You have no courses yet"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {search
                ? "Try another search."
                : "Create your first course to start teaching."}
            </p>

            {!search && (
              <Link
                to="/instructor/courses/new"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white"
              >
                <Plus className="h-4 w-4" />
                Create Course
              </Link>
            )}
          </div>
        ) : (
          <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map(
              (course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  deleting={
                    deletingSlug ===
                    course.slug
                  }
                  onDelete={
                    handleDelete
                  }
                  onManage={() =>
                    navigate(
                      `/instructor/courses/${course.slug}`,
                    )
                  }
                />
              ),
            )}
          </section>
        )}
      </div>
    </main>
  );
}

/* ============================================================
   SUMMARY CARD
============================================================ */

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-extrabold text-slate-900">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   COURSE CARD
============================================================ */

function CourseCard({
  course,
  deleting,
  onDelete,
  onManage,
}: {
  course: InstructorCourse;
  deleting: boolean;
  onDelete: (
    course: InstructorCourse,
  ) => void;
  onManage: () => void;
}) {
  const price = Number(course.price);

  const discount =
    course.discount_price !== null
      ? Number(course.discount_price)
      : null;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="h-10 w-10 text-slate-300" />
          </div>
        )}

        <div className="absolute left-3 top-3">
          <StatusBadge
            published={course.is_published}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <p className="text-[11px] font-bold uppercase tracking-wide text-indigo-600">
          {course.category?.name ?? "Course"}
        </p>

        <h2 className="mt-1 line-clamp-2 text-base font-extrabold leading-6 text-slate-900">
          {course.title}
        </h2>

        {course.subtitle && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
            {course.subtitle}
          </p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <MetaItem
            icon={Clock3}
            label="Duration"
            value={`${course.duration} min`}
          />

          <MetaItem
            icon={CalendarDays}
            label="Created"
            value={formatDate(
              course.created_at,
            )}
          />
        </div>

        {/* Price */}
        <div className="mt-4">
          <p className="text-xs text-slate-400">
            Course price
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span className="text-lg font-extrabold text-slate-900">
              ৳
              {(discount ?? price).toLocaleString()}
            </span>

            {discount !== null && (
              <span className="text-xs text-slate-400 line-through">
                ৳{price.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link
            to={`/courses/${course.slug}`}
            target="_blank"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Link>

          <button
            onClick={onManage}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700"
          >
            <Edit3 className="h-4 w-4" />
            Manage
          </button>
        </div>

        <button
          onClick={() => onDelete(course)}
          disabled={deleting}
          className="mt-2 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-100 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          {deleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}

          {deleting
            ? "Deleting..."
            : "Delete Course"}
        </button>
      </div>
    </article>
  );
}

/* ============================================================
   STATUS
============================================================ */

function StatusBadge({
  published,
}: {
  published: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
        published
          ? "bg-emerald-500 text-white"
          : "bg-white text-slate-700"
      }`}
    >
      {published && (
        <CheckCircle2 className="h-3 w-3" />
      )}

      {published
        ? "Published"
        : "Draft"}
    </span>
  );
}

/* ============================================================
   META
============================================================ */

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-indigo-500" />

        <span className="text-[10px] font-semibold text-slate-400">
          {label}
        </span>
      </div>

      <p className="mt-1 text-xs font-bold text-slate-700">
        {value}
      </p>
    </div>
  );
}

function formatDate(
  value: string,
) {
  return new Date(value).toLocaleDateString(
    "en-BD",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

export default InstructorCoursesPage;