import apiClient from "./client";

import type {
  Enrollment,
  CourseProgress,
} from "../types/enrollment";

/* ==========================================================
   Enrollment APIs
========================================================== */

export const getEnrollments = async (): Promise<
  Enrollment[]
> => {
  const response =
    await apiClient.get<Enrollment[]>(
      "/enrollments/",
    );

  return response.data;
};

export const getEnrollment = async (
  enrollmentId: string,
): Promise<Enrollment> => {
  const response =
    await apiClient.get<Enrollment>(
      `/enrollments/${enrollmentId}/`,
    );

  return response.data;
};

/* ==========================================================
   Lesson Progress
========================================================== */

export interface LessonProgress {
  id: string;
  enrollment: string;
  lecture: string;
  last_watched_second: number;
  watch_percentage: number;
  is_completed: boolean;
  completed_at: string | null;
}

export interface LessonProgressPayload {
  enrollment: string;
  lecture: string;
  last_watched_second: number;
  watch_percentage: number;
}

export const getLessonProgress =
  async (): Promise<LessonProgress[]> => {
    const response =
      await apiClient.get<LessonProgress[]>(
        "/enrollments/lesson-progress/",
      );

    return response.data;
  };

export const createLessonProgress =
  async (
    data: LessonProgressPayload,
  ): Promise<LessonProgress> => {
    const response =
      await apiClient.post<LessonProgress>(
        "/enrollments/lesson-progress/",
        data,
      );

    return response.data;
  };

export const updateLessonProgress =
  async (
    progressId: string,
    data: Partial<LessonProgressPayload>,
  ): Promise<LessonProgress> => {
    const response =
      await apiClient.patch<LessonProgress>(
        `/enrollments/lesson-progress/${progressId}/`,
        data,
      );

    return response.data;
  };

/* ==========================================================
   Course Progress
========================================================== */

export const getCourseProgress =
  async (
    progressId: string,
  ): Promise<CourseProgress> => {
    const response =
      await apiClient.get<CourseProgress>(
        `/enrollments/course-progress/${progressId}/`,
      );

    return response.data;
  };