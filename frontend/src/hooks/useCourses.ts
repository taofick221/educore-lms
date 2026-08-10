import { useEffect, useState } from "react";

import {
  getCourse,
  getCourses,
} from "../api/courses";

import type {
  Course,
  CourseListParams,
} from "../types/course";

export function useCourses(
  params?: CourseListParams,
) {
  const [courses, setCourses] =
    useState<Course[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCourses(params);

        setCourses(data);
      } catch (err) {
        console.error(
          "Failed to load courses:",
          err,
        );

        setError(
          "Failed to load courses.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [JSON.stringify(params)]);

  return {
    courses,
    loading,
    error,
  };
}

export function useCourse(
  slug: string,
) {
  const [course, setCourse] =
    useState<Course | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadCourse = async () => {
      // Don't request an invalid URL such as:
      // /courses/undefined/
      if (!slug) {
        setCourse(null);
        setError("Course not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getCourse(slug);

        setCourse(data);
      } catch (err) {
        console.error(
          "Failed to load course:",
          err,
        );

        setError(
          "Failed to load course.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [slug]);

  return {
    course,
    loading,
    error,
  };
}