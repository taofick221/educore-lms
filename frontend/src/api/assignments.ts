import apiClient from "./client";
import {
  getListResults,
  type PaginatedResponse,
} from "./list";

export interface Assignment {
  id: string;
  course: string;
  course_title?: string;
  title: string;
  description: string;
  max_score: number;
  due_at: string | null;
  is_published: boolean;
}

export interface Submission {
  id: string;
  assignment: string;
  assignment_title?: string;
  text: string;
  attachment: string | null;
  attachment_url?: string | null;
  status: "submitted" | "graded" | "returned" | string;
  score: number | null;
  max_score?: number;
  feedback: string;
  graded_at: string | null;
  created_at: string;
  updated_at?: string;
}

export const getCourseAssignments = async (
  courseId: string,
): Promise<Assignment[]> => {
  const response = await apiClient.get<
    Assignment[] | PaginatedResponse<Assignment>
  >(`/assignments/courses/${courseId}/`);

  return getListResults(response.data);
};

export const getAssignmentSubmission = async (
  assignmentId: string,
): Promise<Submission | null> => {
  try {
    const response =
      await apiClient.get<Submission>(
        `/assignments/${assignmentId}/submission/`,
      );

    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return null;
    }

    throw error;
  }
};

export const submitAssignment = async (
  assignmentId: string,
  data: {
    text: string;
    attachment?: File | null;
  },
): Promise<Submission> => {
  const formData = new FormData();

  formData.append("text", data.text);

  if (data.attachment) {
    formData.append(
      "attachment",
      data.attachment,
    );
  }

  const response =
    await apiClient.post<Submission>(
      `/assignments/${assignmentId}/submit/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

  return response.data;
};