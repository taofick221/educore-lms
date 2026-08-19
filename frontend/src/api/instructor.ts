import apiClient from "./client";

/* ============================================================
   TYPES
============================================================ */

export interface InstructorDashboard {
  course_count: number;
  published_course_count: number;
  student_count: number;
  enrollment_count: number;
  completed_enrollment_count: number;
  revenue: number | string;
}

export interface InstructorCourseCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InstructorCourse {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  short_description: string;
  thumbnail: string | null;
  category: InstructorCourseCategory;
  instructor_id: string;
  instructor_name: string;
  level: string;
  language: string;
  duration: number;
  price: number | string;
  discount_price: number | string | null;
  status: string;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface CourseResource {
  id: string;
  title: string;
  resource_type: string;
  file: string | null;
  external_url: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseLecture {
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
  resources: CourseResource[];
  created_at: string;
  updated_at: string;
}

export interface CourseSection {
  id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  is_active: boolean;
  is_published: boolean;
  lectures: CourseLecture[];
  created_at: string;
  updated_at: string;
}

export interface CourseFeature {
  id?: string;
  title: string;
}

export interface LearningOutcome {
  id?: string;
  title: string;
}

export interface CourseRequirement {
  id?: string;
  title: string;
}

export interface InstructorCourseDetail {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  short_description: string;
  description: string;
  thumbnail: string | null;
  intro_video: string;
  category: InstructorCourseCategory;
  instructor_id: string;
  instructor_name: string;
  instructor_email: string;
  level: string;
  language: string;
  duration: number;
  price: number | string;
  discount_price: number | string | null;

  features: CourseFeature[];
  learning_outcomes: LearningOutcome[];
  requirements: CourseRequirement[];

  sections: CourseSection[];

  total_sections: number;
  total_lectures: number;

  status: string;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;

  meta_title: string;
  meta_description: string;

  created_at: string;
  updated_at: string;
}

/* ============================================================
   DASHBOARD
============================================================ */

export async function getInstructorDashboard(): Promise<
  InstructorDashboard
> {
  const response =
    await apiClient.get<InstructorDashboard>(
      "/instructor/dashboard/",
    );

  return response.data;
}

/* ============================================================
   INSTRUCTOR COURSES
============================================================ */

export async function getInstructorCourses(): Promise<
  InstructorCourse[]
> {
  const response =
    await apiClient.get<
      | InstructorCourse[]
      | {
          results: InstructorCourse[];
        }
    >("/instructor/courses/");

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return response.data.results ?? [];
}

/* ============================================================
   COURSE DETAIL
============================================================ */

export async function getInstructorCourse(
  slug: string,
): Promise<InstructorCourseDetail> {
  const response =
    await apiClient.get<InstructorCourseDetail>(
      `/instructor/courses/${slug}/`,
    );

  return response.data;
}

/* ============================================================
   CATEGORIES
============================================================ */

export async function getCourseCategories(): Promise<
  InstructorCourseCategory[]
> {
  const response =
    await apiClient.get<
      | InstructorCourseCategory[]
      | {
          results: InstructorCourseCategory[];
        }
    >("/courses/categories/");

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return response.data.results ?? [];
}

/* ============================================================
   CREATE COURSE
============================================================ */

export interface CreateCoursePayload {
  title: string;
  subtitle?: string;
  short_description?: string;
  description: string;

  thumbnail?: File | null;

  intro_video?: string;

  category: string;

  level: string;
  language: string;

  duration: number;

  price: number;
  discount_price?: number | null;

  features?: CourseFeature[];
  learning_outcomes?: LearningOutcome[];
  requirements?: CourseRequirement[];

  meta_title?: string;
  meta_description?: string;
}

export async function createInstructorCourse(
  data: CreateCoursePayload,
): Promise<InstructorCourseDetail> {
  const formData = new FormData();

  formData.append(
    "title",
    data.title,
  );

  formData.append(
    "subtitle",
    data.subtitle ?? "",
  );

  formData.append(
    "short_description",
    data.short_description ?? "",
  );

  formData.append(
    "description",
    data.description,
  );

  /*
   * Only append thumbnail when an actual File exists.
   */
  if (data.thumbnail instanceof File) {
    formData.append(
      "thumbnail",
      data.thumbnail,
      data.thumbnail.name,
    );
  }

  formData.append(
    "intro_video",
    data.intro_video ?? "",
  );

  formData.append(
    "category",
    data.category,
  );

  formData.append(
    "level",
    data.level,
  );

  formData.append(
    "language",
    data.language,
  );

  formData.append(
    "duration",
    String(data.duration),
  );

  formData.append(
    "price",
    String(data.price),
  );

  if (
    data.discount_price !== null &&
    data.discount_price !== undefined
  ) {
    formData.append(
      "discount_price",
      String(data.discount_price),
    );
  }

  if (
    data.features &&
    data.features.length > 0
  ) {
    formData.append(
      "features",
      JSON.stringify(data.features),
    );
  }

  if (
    data.learning_outcomes &&
    data.learning_outcomes.length > 0
  ) {
    formData.append(
      "learning_outcomes",
      JSON.stringify(
        data.learning_outcomes,
      ),
    );
  }

  if (
    data.requirements &&
    data.requirements.length > 0
  ) {
    formData.append(
      "requirements",
      JSON.stringify(
        data.requirements,
      ),
    );
  }

  formData.append(
    "meta_title",
    data.meta_title ?? "",
  );

  formData.append(
    "meta_description",
    data.meta_description ?? "",
  );

  const response =
    await apiClient.post<InstructorCourseDetail>(
      "/instructor/courses/",
      formData,
    );

  return response.data;
}

/* ============================================================
   UPDATE COURSE
============================================================ */

export interface UpdateCoursePayload {
  title?: string;
  subtitle?: string;
  short_description?: string;
  description?: string;

  /*
   * null = do not upload a new thumbnail.
   * File = upload new thumbnail.
   */
  thumbnail?: File | null;

  intro_video?: string;

  category?: string;

  level?: string;
  language?: string;

  duration?: number;

  price?: number;
  discount_price?: number | null;

  status?: string;
  is_featured?: boolean;

  /*
   * IMPORTANT:
   *
   * false must be sent for draft.
   * true must be sent for publish.
   */
  is_published?: boolean;

  is_active?: boolean;

  meta_title?: string;
  meta_description?: string;
}

export async function updateInstructorCourse(
  slug: string,
  data: UpdateCoursePayload,
): Promise<InstructorCourseDetail> {
  const formData = new FormData();

  Object.entries(data).forEach(
    ([key, value]) => {
      /*
       * Undefined means:
       * do not send this field.
       */
      if (value === undefined) {
        return;
      }

      /*
       * Thumbnail:
       *
       * Only send when it is an actual File.
       *
       * Never send:
       * ""
       * null
       * existing image URL
       */
      if (key === "thumbnail") {
        if (value instanceof File) {
          formData.append(
            "thumbnail",
            value,
            value.name,
          );
        }

        return;
      }

      /*
       * null fields.
       *
       * For discount_price, empty string tells DRF
       * to clear the nullable field.
       */
      if (value === null) {
        formData.append(
          key,
          "",
        );

        return;
      }

      /*
       * Boolean values MUST remain explicit.
       *
       * false -> "false"
       * true  -> "true"
       */
      if (typeof value === "boolean") {
        formData.append(
          key,
          value ? "true" : "false",
        );

        return;
      }

      formData.append(
        key,
        String(value),
      );
    },
  );

  const response =
    await apiClient.patch<InstructorCourseDetail>(
      `/instructor/courses/${slug}/`,
      formData,
    );

  return response.data;
}

/* ============================================================
   DELETE COURSE
============================================================ */

export async function deleteInstructorCourse(
  slug: string,
): Promise<void> {
  await apiClient.delete(
    `/instructor/courses/${slug}/`,
  );
}

/* ============================================================
   SECTION
============================================================ */

export interface CreateSectionPayload {
  course: string;
  title: string;
  description?: string;
  order: number;
  is_active?: boolean;
  is_published?: boolean;
}

export async function createSection(
  data: CreateSectionPayload,
): Promise<CourseSection> {
  const response =
    await apiClient.post<CourseSection>(
      "/courses/sections/",
      data,
    );

  return response.data;
}

export async function updateSection(
  slug: string,
  data: Partial<CreateSectionPayload>,
): Promise<CourseSection> {
  const response =
    await apiClient.patch<CourseSection>(
      `/courses/sections/${slug}/`,
      data,
    );

  return response.data;
}

export async function deleteSection(
  slug: string,
): Promise<void> {
  await apiClient.delete(
    `/courses/sections/${slug}/`,
  );
}

/* ============================================================
   LECTURE
============================================================ */

export interface CreateLecturePayload {
  section: string;
  title: string;
  description?: string;
  video_url: string;
  duration: number;
  order: number;
  is_preview?: boolean;
  is_active?: boolean;
  is_published?: boolean;
}

export async function createLecture(
  data: CreateLecturePayload,
): Promise<CourseLecture> {
  const response =
    await apiClient.post<CourseLecture>(
      "/courses/lectures/",
      data,
    );

  return response.data;
}

export async function updateLecture(
  slug: string,
  data: Partial<CreateLecturePayload>,
): Promise<CourseLecture> {
  const response =
    await apiClient.patch<CourseLecture>(
      `/courses/lectures/${slug}/`,
      data,
    );

  return response.data;
}

export async function deleteLecture(
  slug: string,
): Promise<void> {
  await apiClient.delete(
    `/courses/lectures/${slug}/`,
  );
}

/* ============================================================
   RESOURCE
============================================================ */

export interface CreateResourcePayload {
  lecture: string;
  title: string;
  resource_type: string;
  file?: File | null;
  external_url?: string;
  order: number;
  is_active?: boolean;
}

export async function createResource(
  data: CreateResourcePayload,
): Promise<CourseResource> {
  const formData = new FormData();

  formData.append(
    "lecture",
    data.lecture,
  );

  formData.append(
    "title",
    data.title,
  );

  formData.append(
    "resource_type",
    data.resource_type,
  );

  formData.append(
    "order",
    String(data.order),
  );

  formData.append(
    "is_active",
    String(
      data.is_active ?? true,
    ),
  );

  if (data.file instanceof File) {
    formData.append(
      "file",
      data.file,
      data.file.name,
    );
  }

  if (data.external_url) {
    formData.append(
      "external_url",
      data.external_url,
    );
  }

  const response =
    await apiClient.post<CourseResource>(
      "/courses/resources/",
      formData,
    );

  return response.data;
}

export async function updateResource(
  id: string,
  data: Partial<CreateResourcePayload>,
): Promise<CourseResource> {
  const formData = new FormData();

  Object.entries(data).forEach(
    ([key, value]) => {
      if (value === undefined) {
        return;
      }

      if (value instanceof File) {
        formData.append(
          key,
          value,
          value.name,
        );

        return;
      }

      if (value === null) {
        formData.append(
          key,
          "",
        );

        return;
      }

      formData.append(
        key,
        String(value),
      );
    },
  );

  const response =
    await apiClient.patch<CourseResource>(
      `/courses/resources/${id}/`,
      formData,
    );

  return response.data;
}

export async function deleteResource(
  id: string,
): Promise<void> {
  await apiClient.delete(
    `/courses/resources/${id}/`,
  );
}