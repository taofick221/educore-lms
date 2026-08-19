import {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  File,
  FilePlus2,
  Image as ImageIcon,
  Loader2,
  Plus,
  Save,
  Trash2,
  Video,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  createInstructorCourse,
  createLecture,
  createResource,
  createSection,
  deleteLecture,
  deleteResource,
  deleteSection,
  getCourseCategories,
  getInstructorCourse,
  updateInstructorCourse,
  type CourseSection,
  type InstructorCourseCategory,
  type InstructorCourseDetail,
} from "../../api/instructor";


function normalizeCourse(
  data: InstructorCourseDetail,
): InstructorCourseDetail {
  const sections = Array.isArray(data.sections)
    ? data.sections.map((section) => {
        const lectures = Array.isArray(section.lectures)
          ? section.lectures.map((lecture) => ({
              ...lecture,
              resources: Array.isArray(lecture.resources)
                ? lecture.resources
                : [],
            }))
          : [];

        return {
          ...section,
          lectures,
        };
      })
    : [];

  const totalLectures = sections.reduce(
    (total, section) =>
      total + section.lectures.length,
    0,
  );

  return {
    ...data,
    sections,
    total_sections:
      typeof data.total_sections === "number"
        ? data.total_sections
        : sections.length,
    total_lectures:
      typeof data.total_lectures === "number"
        ? data.total_lectures
        : totalLectures,
  };
}


function InstructorCourseEditorPage() {
  const { slug } = useParams<{
    slug: string;
  }>();

  const navigate = useNavigate();

  const isEdit = Boolean(
    slug && slug !== "new",
  );

  const [course, setCourse] =
    useState<InstructorCourseDetail | null>(
      null,
    );

  const [categories, setCategories] =
    useState<InstructorCourseCategory[]>(
      [],
    );

  const [loading, setLoading] =
    useState(isEdit);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [thumbnail, setThumbnail] =
    useState<File | null>(null);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    short_description: "",
    description: "",
    intro_video: "",
    category: "",
    level: "beginner",
    language: "english",
    duration: 0,
    price: 0,
    discount_price: "",
    meta_title: "",
    meta_description: "",
  });

  const [expandedSections, setExpandedSections] =
    useState<Record<string, boolean>>({});

  const [newSection, setNewSection] =
    useState({
      title: "",
      description: "",
    });

  const [addingSection, setAddingSection] =
    useState(false);

  const [lectureInputs, setLectureInputs] =
    useState<
      Record<
        string,
        {
          title: string;
          description: string;
          video_url: string;
          duration: number;
        }
      >
    >({});

  const [resourceInputs, setResourceInputs] =
    useState<
      Record<
        string,
        {
          title: string;
          resource_type: string;
          external_url: string;
          file: File | null;
        }
      >
    >({});


  /* ==========================================================
     LOAD
  ========================================================== */

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const categoryData =
          await getCourseCategories();

        setCategories(categoryData);

        if (!isEdit || !slug) {
          return;
        }

        const rawData =
          await getInstructorCourse(slug);

        const data =
          normalizeCourse(rawData);

        setCourse(data);

        setForm({
          title: data.title,
          subtitle: data.subtitle ?? "",
          short_description:
            data.short_description ?? "",
          description:
            data.description ?? "",
          intro_video:
            data.intro_video ?? "",
          category:
            data.category?.id ?? "",
          level: data.level,
          language: data.language,
          duration: Number(data.duration) || 0,
          price: Number(data.price) || 0,
          discount_price:
            data.discount_price === null
              ? ""
              : String(data.discount_price),
          meta_title:
            data.meta_title ?? "",
          meta_description:
            data.meta_description ?? "",
        });

        const sectionState: Record<
          string,
          boolean
        > = {};

        data.sections.forEach(
          (section) => {
            sectionState[section.id] = true;
          },
        );

        setExpandedSections(
          sectionState,
        );
      } catch (err: any) {
        console.error(
          "Instructor course editor:",
          err,
        );

        setError(
          err?.response?.data?.detail ||
            err?.response?.data?.message ||
            "Unable to load course.",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isEdit, slug]);


  /* ==========================================================
     FORM
  ========================================================== */

  const updateForm = (
    field: string,
    value: string | number,
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };


  /* ==========================================================
     SAVE COURSE
  ========================================================== */

  const handleSave = async (
    publish = false,
  ) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!form.title.trim()) {
        throw new Error(
          "Course title is required.",
        );
      }

      if (!form.category) {
        throw new Error(
          "Please select a category.",
        );
      }

      if (form.price < 0) {
        throw new Error(
          "Price cannot be negative.",
        );
      }

      if (
        form.discount_price !== "" &&
        Number(form.discount_price) >
          form.price
      ) {
        throw new Error(
          "Discount price cannot be greater than price.",
        );
      }


      /* ========================================================
         CREATE
      ======================================================== */

      if (!isEdit) {
        const createPayload = {
          title: form.title.trim(),

          subtitle:
            form.subtitle.trim(),

          short_description:
            form.short_description.trim(),

          description:
            form.description,

          intro_video:
            form.intro_video.trim(),

          category:
            form.category,

          level:
            form.level,

          language:
            form.language,

          duration:
            Number(form.duration) || 0,

          price:
            Number(form.price) || 0,

          discount_price:
            form.discount_price === ""
              ? null
              : Number(
                  form.discount_price,
                ),

          meta_title:
            form.meta_title.trim(),

          meta_description:
            form.meta_description.trim(),
        };

        if (thumbnail) {
          Object.assign(
            createPayload,
            { thumbnail },
          );
        }

        const createdRaw =
          await createInstructorCourse(
            createPayload,
          );

        const created =
          normalizeCourse(createdRaw);


        /*
         * New course is created as Draft.
         *
         * If user clicked Publish Course,
         * explicitly publish it after creation.
         */

        if (publish) {
          const publishedRaw =
            await updateInstructorCourse(
              created.slug,
              {
                is_published: true,
              },
            );

          const published =
            normalizeCourse(
              publishedRaw,
            );

          setCourse(published);
          setThumbnail(null);

          setSuccess(
            "Course published successfully.",
          );

          navigate(
            `/instructor/courses/${published.slug}`,
            {
              replace: true,
            },
          );

          return;
        }


        /*
         * Save Draft.
         *
         * The create endpoint creates
         * an unpublished course.
         */

        setCourse(created);
        setThumbnail(null);

        setSuccess(
          "Course saved as draft successfully.",
        );

        navigate(
          `/instructor/courses/${created.slug}`,
          {
            replace: true,
          },
        );

        return;
      }


      /* ========================================================
         EDIT
      ======================================================== */

      if (!slug) {
        throw new Error(
          "Course slug is missing.",
        );
      }


      /*
       * IMPORTANT:
       *
       * Save Draft:
       *     is_published: false
       *
       * Publish:
       *     is_published: true
       *
       * Never use:
       *
       * is_published:
       *     publish ? true : undefined
       *
       * because undefined means
       * "do not update this field".
       */

      const updatePayload = {
        title:
          form.title.trim(),

        subtitle:
          form.subtitle.trim(),

        short_description:
          form.short_description.trim(),

        description:
          form.description,

        intro_video:
          form.intro_video.trim(),

        category:
          form.category,

        level:
          form.level,

        language:
          form.language,

        duration:
          Number(form.duration) || 0,

        price:
          Number(form.price) || 0,

        discount_price:
          form.discount_price === ""
            ? null
            : Number(
                form.discount_price,
              ),

        meta_title:
          form.meta_title.trim(),

        meta_description:
          form.meta_description.trim(),

        is_published:
          publish,
      };

      /*
       * Only send thumbnail when the user
       * selected a new file.
       *
       * Never send null / "" for an ImageField.
       */
      if (thumbnail) {
        Object.assign(
          updatePayload,
          { thumbnail },
        );
      }

      const updatedRaw =
        await updateInstructorCourse(
          slug,
          updatePayload,
        );

      /*
       * Some PUT/PATCH responses may not
       * include nested sections/lectures/resources.
       * Keep the existing curriculum in that case.
       */
      const updated =
        normalizeCourse({
          ...course!,
          ...updatedRaw,
          sections:
            Array.isArray(
              updatedRaw.sections,
            )
              ? updatedRaw.sections
              : course?.sections ?? [],
        });

      setCourse(updated);
      setThumbnail(null);

      setSuccess(
        publish
          ? "Course published successfully."
          : "Course saved as draft successfully.",
      );

    } catch (err: any) {
      console.error(
        "Save course error:",
        err,
      );

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Unable to save course.",
      );
    } finally {
      setSaving(false);
    }
  };


  /* ==========================================================
     ADD SECTION
  ========================================================== */

  const handleAddSection = async () => {
    if (!course) {
      return;
    }

    if (!newSection.title.trim()) {
      setError(
        "Section title is required.",
      );

      return;
    }

    try {
      setAddingSection(true);
      setError("");
      setSuccess("");

      await createSection({
        course: course.id,

        title:
          newSection.title.trim(),

        description:
          newSection.description.trim(),

        order:
          (course.sections ?? []).length + 1,

        is_active: true,

        is_published: true,
      });

      const refreshedRaw =
        await getInstructorCourse(
          course.slug,
        );

      const refreshed =
        normalizeCourse(
          refreshedRaw,
        );

      setCourse(refreshed);

      setNewSection({
        title: "",
        description: "",
      });

      setSuccess(
        "Section created successfully.",
      );
    } catch (err: any) {
      console.error(
        "Create section error:",
        err,
      );

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Unable to create section.",
      );
    } finally {
      setAddingSection(false);
    }
  };


  /* ==========================================================
     ADD LECTURE
  ========================================================== */

  const handleAddLecture = async (
    section: CourseSection,
  ) => {
    const input =
      lectureInputs[section.id];

    if (!input?.title.trim()) {
      setError(
        "Lecture title is required.",
      );

      return;
    }

    try {
      setError("");
      setSuccess("");

      await createLecture({
        section:
          section.id,

        title:
          input.title.trim(),

        description:
          input.description.trim(),

        video_url:
          input.video_url.trim(),

        duration:
          Number(input.duration) || 0,

        order:
          section.lectures.length + 1,

        is_preview: false,

        is_active: true,

        is_published: true,
      });

      const refreshedRaw =
        await getInstructorCourse(
          course!.slug,
        );

      const refreshed =
        normalizeCourse(
          refreshedRaw,
        );

      setCourse(refreshed);

      setLectureInputs(
        (previous) => ({
          ...previous,

          [section.id]: {
            title: "",
            description: "",
            video_url: "",
            duration: 0,
          },
        }),
      );

      setSuccess(
        "Lecture created successfully.",
      );
    } catch (err: any) {
      console.error(
        "Create lecture error:",
        err,
      );

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Unable to create lecture.",
      );
    }
  };


  /* ==========================================================
     ADD RESOURCE
  ========================================================== */

  const handleAddResource = async (
    lectureId: string,
  ) => {
    const input =
      resourceInputs[lectureId];

    if (!input?.title.trim()) {
      setError(
        "Resource title is required.",
      );

      return;
    }

    try {
      setError("");
      setSuccess("");

      await createResource({
        lecture:
          lectureId,

        title:
          input.title.trim(),

        resource_type:
          input.resource_type,

        external_url:
          input.external_url.trim(),

        file:
          input.file,

        order: 1,

        is_active: true,
      });

      const refreshedRaw =
        await getInstructorCourse(
          course!.slug,
        );

      const refreshed =
        normalizeCourse(
          refreshedRaw,
        );

      setCourse(refreshed);

      setResourceInputs(
        (previous) => ({
          ...previous,

          [lectureId]: {
            title: "",
            resource_type:
              "document",
            external_url: "",
            file: null,
          },
        }),
      );

      setSuccess(
        "Resource created successfully.",
      );
    } catch (err: any) {
      console.error(
        "Create resource error:",
        err,
      );

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Unable to create resource.",
      );
    }
  };


  /* ==========================================================
     DELETE SECTION
  ========================================================== */

  const handleDeleteSection = async (
    section: CourseSection,
  ) => {
    if (
      !window.confirm(
        `Delete section "${section.title}"?`,
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteSection(
        section.slug,
      );

      const refreshedRaw =
        await getInstructorCourse(
          course!.slug,
        );

      const refreshed =
        normalizeCourse(
          refreshedRaw,
        );

      setCourse(refreshed);

      setSuccess(
        "Section deleted successfully.",
      );
    } catch (err: any) {
      console.error(
        "Delete section error:",
        err,
      );

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Unable to delete section.",
      );
    }
  };


  /* ==========================================================
     DELETE LECTURE
  ========================================================== */

  const handleDeleteLecture = async (
    lecture: {
      id: string;
      slug: string;
      title: string;
    },
  ) => {
    if (
      !window.confirm(
        `Delete lecture "${lecture.title}"?`,
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteLecture(
        lecture.slug,
      );

      const refreshedRaw =
        await getInstructorCourse(
          course!.slug,
        );

      const refreshed =
        normalizeCourse(
          refreshedRaw,
        );

      setCourse(refreshed);

      setSuccess(
        "Lecture deleted successfully.",
      );
    } catch (err: any) {
      console.error(
        "Delete lecture error:",
        err,
      );

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Unable to delete lecture.",
      );
    }
  };


  /* ==========================================================
     DELETE RESOURCE
  ========================================================== */

  const handleDeleteResource = async (
    id: string,
  ) => {
    if (
      !window.confirm(
        "Delete this resource?",
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteResource(id);

      const refreshedRaw =
        await getInstructorCourse(
          course!.slug,
        );

      const refreshed =
        normalizeCourse(
          refreshedRaw,
        );

      setCourse(refreshed);

      setSuccess(
        "Resource deleted successfully.",
      );
    } catch (err: any) {
      console.error(
        "Delete resource error:",
        err,
      );

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Unable to delete resource.",
      );
    }
  };


  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </main>
    );
  }


  /* ==========================================================
     PAGE
  ========================================================== */

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <Link
              to="/instructor/courses"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600"
            >
              <ArrowLeft className="h-4 w-4" />

              Back to Courses
            </Link>

            <h1 className="mt-3 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              {isEdit
                ? "Manage Course"
                : "Create Course"}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Build your course content and
              learning structure.
            </p>
          </div>

          {isEdit && course && (
            <div
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                course.is_published
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {course.is_published
                ? "Published"
                : "Draft"}
            </div>
          )}
        </div>


        {/* ====================================================
            ALERTS
        ==================================================== */}

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <Check className="h-4 w-4" />

            {success}
          </div>
        )}


        {/* ====================================================
            COURSE INFORMATION
        ==================================================== */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <BookOpen className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Course Information
              </h2>

              <p className="text-xs text-slate-500">
                Basic information students will see.
              </p>
            </div>

          </div>


          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <Field
              label="Course title"
              value={form.title}
              onChange={(value) =>
                updateForm(
                  "title",
                  value,
                )
              }
              required
            />

            <Field
              label="Subtitle"
              value={form.subtitle}
              onChange={(value) =>
                updateForm(
                  "subtitle",
                  value,
                )
              }
            />

            <Field
              label="Short description"
              value={
                form.short_description
              }
              onChange={(value) =>
                updateForm(
                  "short_description",
                  value,
                )
              }
            />

            <SelectField
              label="Category"
              value={form.category}
              onChange={(value) =>
                updateForm(
                  "category",
                  value,
                )
              }
              options={categories.map(
                (category) => ({
                  value: category.id,
                  label: category.name,
                }),
              )}
              required
            />

            <SelectField
              label="Level"
              value={form.level}
              onChange={(value) =>
                updateForm(
                  "level",
                  value,
                )
              }
              options={[
                {
                  value: "beginner",
                  label: "Beginner",
                },
                {
                  value: "intermediate",
                  label: "Intermediate",
                },
                {
                  value: "advanced",
                  label: "Advanced",
                },
              ]}
            />

            <SelectField
              label="Language"
              value={form.language}
              onChange={(value) =>
                updateForm(
                  "language",
                  value,
                )
              }
              options={[
                {
                  value: "english",
                  label: "English",
                },
                {
                  value: "bangla",
                  label: "Bangla",
                },
              ]}
            />

            <Field
              label="Duration (minutes)"
              type="number"
              value={String(
                form.duration,
              )}
              onChange={(value) =>
                updateForm(
                  "duration",
                  Number(value) || 0,
                )
              }
            />

            <Field
              label="Price"
              type="number"
              value={String(
                form.price,
              )}
              onChange={(value) =>
                updateForm(
                  "price",
                  Number(value) || 0,
                )
              }
              required
            />

            <Field
              label="Discount price"
              type="number"
              value={
                form.discount_price
              }
              onChange={(value) =>
                updateForm(
                  "discount_price",
                  value,
                )
              }
            />

            <Field
              label="Intro video URL"
              value={
                form.intro_video
              }
              onChange={(value) =>
                updateForm(
                  "intro_video",
                  value,
                )
              }
            />


            {/* Thumbnail */}

            <div>
              <label className="text-sm font-bold text-slate-700">
                Thumbnail
              </label>

              <label className="mt-2 flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 hover:border-indigo-400 hover:bg-indigo-50">

                <ImageIcon className="h-5 w-5 text-indigo-600" />

                <span className="min-w-0 flex-1 truncate text-sm text-slate-500">
                  {thumbnail
                    ? thumbnail.name
                    : "Choose course image"}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) =>
                    setThumbnail(
                      event.target
                        .files?.[0] ??
                        null,
                    )
                  }
                />
              </label>
            </div>


            <div className="md:col-span-2">
              <TextArea
                label="Description"
                value={
                  form.description
                }
                onChange={(value) =>
                  updateForm(
                    "description",
                    value,
                  )
                }
                rows={7}
              />
            </div>


            <Field
              label="Meta title"
              value={
                form.meta_title
              }
              onChange={(value) =>
                updateForm(
                  "meta_title",
                  value,
                )
              }
            />

            <Field
              label="Meta description"
              value={
                form.meta_description
              }
              onChange={(value) =>
                updateForm(
                  "meta_description",
                  value,
                )
              }
            />

          </div>


          {/* ==================================================
              SAVE BUTTONS
          ================================================== */}

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

            {/* SAVE DRAFT */}

            <button
              type="button"
              onClick={() =>
                handleSave(false)
              }
              disabled={saving}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              Save Draft
            </button>


            {/* PUBLISH */}

            <button
              type="button"
              onClick={() =>
                handleSave(true)
              }
              disabled={saving}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}

              {course?.is_published
                ? "Save Changes"
                : "Publish Course"}
            </button>

          </div>

        </section>


        {/* ====================================================
            CURRICULUM
        ==================================================== */}

        {isEdit && course && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Course Curriculum
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {course.total_sections} sections ·{" "}
                  {course.total_lectures} lectures
                </p>
              </div>

            </div>


            {/* =================================================
                ADD SECTION
            ================================================= */}

            <div className="mt-6 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 p-4">

              <p className="text-sm font-bold text-slate-900">
                Add Section
              </p>

              <div className="mt-3 grid gap-3 md:grid-cols-2">

                <input
                  value={
                    newSection.title
                  }
                  onChange={(event) =>
                    setNewSection(
                      (previous) => ({
                        ...previous,
                        title:
                          event.target
                            .value,
                      }),
                    )
                  }
                  placeholder="Section title"
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400"
                />

                <input
                  value={
                    newSection.description
                  }
                  onChange={(event) =>
                    setNewSection(
                      (previous) => ({
                        ...previous,
                        description:
                          event.target
                            .value,
                      }),
                    )
                  }
                  placeholder="Section description"
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400"
                />

              </div>

              <button
                type="button"
                onClick={
                  handleAddSection
                }
                disabled={
                  addingSection
                }
                className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {addingSection ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}

                Add Section
              </button>

            </div>


            {/* =================================================
                SECTIONS
            ================================================= */}

            <div className="mt-6 space-y-4">

              {(course.sections ?? []).map(
                (section) => {
                  const expanded =
                    expandedSections[
                      section.id
                    ] ?? true;

                  return (
                    <SectionEditor
                      key={section.id}
                      section={
                        section
                      }
                      expanded={
                        expanded
                      }
                      onToggle={() =>
                        setExpandedSections(
                          (
                            previous,
                          ) => ({
                            ...previous,
                            [section.id]:
                              !expanded,
                          }),
                        )
                      }
                      lectureInput={
                        lectureInputs[
                          section.id
                        ] ?? {
                          title: "",
                          description:
                            "",
                          video_url:
                            "",
                          duration: 0,
                        }
                      }
                      setLectureInput={(
                        value,
                      ) =>
                        setLectureInputs(
                          (
                            previous,
                          ) => ({
                            ...previous,
                            [section.id]:
                              value,
                          }),
                        )
                      }
                      resourceInputs={
                        resourceInputs
                      }
                      setResourceInputs={
                        setResourceInputs
                      }
                      onAddLecture={() =>
                        handleAddLecture(
                          section,
                        )
                      }
                      onDeleteSection={() =>
                        handleDeleteSection(
                          section,
                        )
                      }
                      onDeleteLecture={
                        handleDeleteLecture
                      }
                      onAddResource={
                        handleAddResource
                      }
                      onDeleteResource={
                        handleDeleteResource
                      }
                    />
                  );
                },
              )}

            </div>


            {(course.sections ?? []).length ===
              0 && (
              <div className="mt-6 rounded-xl border border-dashed border-slate-300 py-12 text-center">

                <BookOpen className="mx-auto h-8 w-8 text-slate-300" />

                <p className="mt-3 text-sm font-semibold text-slate-500">
                  No sections yet.
                </p>

              </div>
            )}

          </section>
        )}

      </div>
    </main>
  );
}


/* ============================================================
   SECTION EDITOR
============================================================ */

function SectionEditor({
  section,
  expanded,
  onToggle,
  lectureInput,
  setLectureInput,
  resourceInputs,
  setResourceInputs,
  onAddLecture,
  onDeleteSection,
  onDeleteLecture,
  onAddResource,
  onDeleteResource,
}: {
  section: CourseSection;

  expanded: boolean;

  onToggle: () => void;

  lectureInput: {
    title: string;
    description: string;
    video_url: string;
    duration: number;
  };

  setLectureInput: (
    value: {
      title: string;
      description: string;
      video_url: string;
      duration: number;
    },
  ) => void;

  resourceInputs: Record<
    string,
    {
      title: string;
      resource_type: string;
      external_url: string;
      file: File | null;
    }
  >;

  setResourceInputs: Dispatch<
    SetStateAction<
      Record<
        string,
        {
          title: string;
          resource_type: string;
          external_url: string;
          file: File | null;
        }
      >
    >
  >;

  onAddLecture: () => void;

  onDeleteSection: () => void;

  onDeleteLecture: (
    lecture: {
      id: string;
      slug: string;
      title: string;
    },
  ) => void;

  onAddResource: (
    lectureId: string,
  ) => void;

  onDeleteResource: (
    id: string,
  ) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">

      {/* SECTION HEADER */}

      <div className="flex items-center gap-3 bg-slate-50 p-4">

        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
            <BookOpen className="h-4 w-4" />
          </div>

          <div className="min-w-0">

            <p className="truncate text-sm font-extrabold text-slate-900">
              {section.order}.{" "}
              {section.title}
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              {(section.lectures ?? []).length} lectures
            </p>

          </div>

        </button>


        <button
          type="button"
          onClick={
            onDeleteSection
          }
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
          title="Delete section"
        >
          <Trash2 className="h-4 w-4" />
        </button>


        <button
          type="button"
          onClick={onToggle}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg hover:bg-white"
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

      </div>


      {expanded && (
        <div className="p-4">

          {/* EXISTING LECTURES */}

          <div className="space-y-3">

            {(section.lectures ?? []).map(
              (lecture) => (
                <div
                  key={lecture.id}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >

                  <div className="flex items-start gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                      <Video className="h-4 w-4" />
                    </div>


                    <div className="min-w-0 flex-1">

                      <p className="text-sm font-bold text-slate-900">
                        {lecture.order}.{" "}
                        {lecture.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {lecture.duration} minutes
                      </p>

                      {lecture.video_url && (
                        <a
                          href={
                            lecture.video_url
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 block truncate text-xs font-semibold text-indigo-600"
                        >
                          {lecture.video_url}
                        </a>
                      )}

                    </div>


                    <button
                      type="button"
                      onClick={() =>
                        onDeleteLecture(
                          lecture,
                        )
                      }
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                  </div>


                  {/* RESOURCES */}

                  <div className="mt-4 border-t border-slate-100 pt-4">

                    <p className="text-xs font-bold text-slate-700">
                      Resources
                    </p>


                    {(lecture.resources ?? []).length >
                      0 && (
                      <div className="mt-2 space-y-2">

                        {(lecture.resources ?? []).map(
                          (resource) => (
                            <div
                              key={
                                resource.id
                              }
                              className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2"
                            >

                              <File className="h-3.5 w-3.5 text-indigo-500" />

                              <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-700">
                                {
                                  resource.title
                                }
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  onDeleteResource(
                                    resource.id,
                                  )
                                }
                                className="text-red-500"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>

                            </div>
                          ),
                        )}

                      </div>
                    )}


                    {/* ADD RESOURCE */}

                    <div className="mt-3 grid gap-2 md:grid-cols-4">

                      <input
                        placeholder="Resource title"
                        value={
                          resourceInputs[
                            lecture.id
                          ]?.title ??
                          ""
                        }
                        onChange={(
                          event,
                        ) =>
                          setResourceInputs(
                            (
                              previous,
                            ) => ({
                              ...previous,
                              [lecture.id]:
                                {
                                  title:
                                    event
                                      .target
                                      .value,

                                  resource_type:
                                    previous[
                                      lecture
                                        .id
                                    ]
                                      ?.resource_type ??
                                    "document",

                                  external_url:
                                    previous[
                                      lecture
                                        .id
                                    ]
                                      ?.external_url ??
                                    "",

                                  file:
                                    previous[
                                      lecture
                                        .id
                                    ]
                                      ?.file ??
                                    null,
                                },
                            }),
                          )
                        }
                        className="h-10 rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-indigo-400"
                      />


                      <select
                        value={
                          resourceInputs[
                            lecture.id
                          ]?.resource_type ??
                          "document"
                        }
                        onChange={(
                          event,
                        ) =>
                          setResourceInputs(
                            (
                              previous,
                            ) => ({
                              ...previous,
                              [lecture.id]:
                                {
                                  title:
                                    previous[
                                      lecture
                                        .id
                                    ]
                                      ?.title ??
                                    "",

                                  resource_type:
                                    event
                                      .target
                                      .value,

                                  external_url:
                                    previous[
                                      lecture
                                        .id
                                    ]
                                      ?.external_url ??
                                    "",

                                  file:
                                    previous[
                                      lecture
                                        .id
                                    ]
                                      ?.file ??
                                    null,
                                },
                            }),
                          )
                        }
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-indigo-400"
                      >

                        <option value="document">
                          Document
                        </option>

                        <option value="link">
                          External Link
                        </option>

                        <option value="file">
                          File
                        </option>

                      </select>


                      {(
                        resourceInputs[
                          lecture.id
                        ]?.resource_type ??
                        "document"
                      ) === "file" && (
                        <label className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-3 text-xs text-slate-500">
                          <File className="h-3.5 w-3.5 text-indigo-500" />
                          <span className="min-w-0 flex-1 truncate">
                            {resourceInputs[
                              lecture.id
                            ]?.file?.name ??
                              "Choose file"}
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(event) =>
                              setResourceInputs(
                                (previous) => ({
                                  ...previous,
                                  [lecture.id]: {
                                    title:
                                      previous[
                                        lecture.id
                                      ]?.title ?? "",
                                    resource_type:
                                      previous[
                                        lecture.id
                                      ]?.resource_type ??
                                      "file",
                                    external_url:
                                      previous[
                                        lecture.id
                                      ]?.external_url ??
                                      "",
                                    file:
                                      event.target.files?.[0] ??
                                      null,
                                  },
                                }),
                              )
                            }
                          />
                        </label>
                      )}

                      <input
                        placeholder="External URL"
                        value={
                          resourceInputs[
                            lecture.id
                          ]?.external_url ??
                          ""
                        }
                        onChange={(
                          event,
                        ) =>
                          setResourceInputs(
                            (
                              previous,
                            ) => ({
                              ...previous,
                              [lecture.id]:
                                {
                                  title:
                                    previous[
                                      lecture
                                        .id
                                    ]
                                      ?.title ??
                                    "",

                                  resource_type:
                                    previous[
                                      lecture
                                        .id
                                    ]
                                      ?.resource_type ??
                                    "document",

                                  external_url:
                                    event
                                      .target
                                      .value,

                                  file:
                                    previous[
                                      lecture
                                        .id
                                    ]
                                      ?.file ??
                                    null,
                                },
                            }),
                          )
                        }
                        className="h-10 rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-indigo-400"
                      />


                      <button
                        type="button"
                        onClick={() =>
                          onAddResource(
                            lecture.id,
                          )
                        }
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white hover:bg-slate-800"
                      >
                        <FilePlus2 className="h-3.5 w-3.5" />

                        Add Resource
                      </button>

                    </div>

                  </div>

                </div>
              ),
            )}

          </div>


          {/* =================================================
              ADD LECTURE
          ================================================= */}

          <div className="mt-4 rounded-xl border border-dashed border-purple-200 bg-purple-50/40 p-4">

            <p className="text-xs font-bold text-slate-900">
              Add Lecture
            </p>


            <div className="mt-3 grid gap-2 md:grid-cols-2">

              <input
                placeholder="Lecture title"
                value={
                  lectureInput.title
                }
                onChange={(event) =>
                  setLectureInput({
                    ...lectureInput,
                    title:
                      event.target.value,
                  })
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-indigo-400"
              />


              <input
                placeholder="Video URL"
                value={
                  lectureInput.video_url
                }
                onChange={(event) =>
                  setLectureInput({
                    ...lectureInput,
                    video_url:
                      event.target.value,
                  })
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-indigo-400"
              />


              <input
                placeholder="Description"
                value={
                  lectureInput.description
                }
                onChange={(event) =>
                  setLectureInput({
                    ...lectureInput,
                    description:
                      event.target.value,
                  })
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-indigo-400"
              />


              <input
                type="number"
                min="0"
                placeholder="Duration in minutes"
                value={
                  lectureInput.duration
                }
                onChange={(event) =>
                  setLectureInput({
                    ...lectureInput,
                    duration:
                      Number(
                        event.target.value,
                      ) || 0,
                  })
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-indigo-400"
              />

            </div>


            <button
              type="button"
              onClick={
                onAddLecture
              }
              className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-700"
            >
              <Plus className="h-4 w-4" />

              Add Lecture
            </button>

          </div>

        </div>
      )}

    </div>
  );
}


/* ============================================================
   FIELD
============================================================ */

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;

  value: string;

  onChange: (
    value: string,
  ) => void;

  type?: string;

  required?: boolean;
}) {
  return (
    <div>

      <label className="text-sm font-bold text-slate-700">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>


      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      />

    </div>
  );
}


/* ============================================================
   TEXT AREA
============================================================ */

function TextArea({
  label,
  value,
  onChange,
  rows = 5,
}: {
  label: string;

  value: string;

  onChange: (
    value: string,
  ) => void;

  rows?: number;
}) {
  return (
    <div>

      <label className="text-sm font-bold text-slate-700">
        {label}
      </label>


      <textarea
        value={value}
        rows={rows}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm leading-6 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      />

    </div>
  );
}


/* ============================================================
   SELECT
============================================================ */

function SelectField({
  label,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;

  value: string;

  onChange: (
    value: string,
  ) => void;

  options: {
    value: string;
    label: string;
  }[];

  required?: boolean;
}) {
  return (
    <div>

      <label className="text-sm font-bold text-slate-700">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>


      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      >

        <option value="">
          Select {label}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}

      </select>

    </div>
  );
}


export default InstructorCourseEditorPage;