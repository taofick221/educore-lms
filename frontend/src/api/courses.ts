import apiClient from "./client";
import type {
  Course,
  CourseListParams,
} from "../types/course";

export const getCourses = async (
  params?: CourseListParams,
): Promise<Course[]> => {
  const response = await apiClient.get<Course[]>(
    "/courses/",
    {
      params,
    },
  );

  return response.data;
};

export const getCourse = async (
  slug: string,
): Promise<Course> => {
  const response = await apiClient.get<Course>(
    `/courses/${slug}/`,
  );

  return response.data;
};