import { useEffect, useState } from "react";
import {
  getEnrollment,
  getEnrollments,
} from "../api/enrollments";
import type { Enrollment } from "../types/enrollment";

export function useEnrollments() {
  const [enrollments, setEnrollments] = useState<
    Enrollment[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEnrollments = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getEnrollments();
        setEnrollments(data);
      } catch {
        setError(
          "Failed to load your courses.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadEnrollments();
  }, []);

  return {
    enrollments,
    loading,
    error,
  };
}

export function useEnrollment(
  enrollmentId: string,
) {
  const [enrollment, setEnrollment] =
    useState<Enrollment | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEnrollment = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getEnrollment(
          enrollmentId,
        );

        setEnrollment(data);
      } catch {
        setError(
          "Failed to load enrollment.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadEnrollment();
  }, [enrollmentId]);

  return {
    enrollment,
    loading,
    error,
  };
}