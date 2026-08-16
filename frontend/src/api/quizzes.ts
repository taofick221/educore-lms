import apiClient from "./client";
import { getListResults, type PaginatedResponse } from "./list";

export interface QuizOption { id: string; text: string }
export interface QuizQuestion { id: string; text: string; order: number; points: number; options: QuizOption[] }
export interface Quiz { id: string; course: string; title: string; description: string; passing_score: number; time_limit_minutes: number; questions: QuizQuestion[] }
export interface QuizAttempt { id: string; quiz: string; status: string; score: string; started_at: string; submitted_at: string | null }

export const getCourseQuizzes = async (courseId: string): Promise<Quiz[]> => {
  const response = await apiClient.get<Quiz[] | PaginatedResponse<Quiz>>(
    `/quizzes/courses/${courseId}/`,
  );
  return getListResults(response.data);
};

export const startQuizAttempt = async (quizId: string): Promise<QuizAttempt> => {
  const response = await apiClient.post<QuizAttempt>(`/quizzes/${quizId}/attempts/`);
  return response.data;
};

export const submitQuizAttempt = async (
  attemptId: string,
  answers: { question: string; selected_option: string }[],
): Promise<QuizAttempt> => {
  const response = await apiClient.post<QuizAttempt>(
    `/quizzes/attempts/${attemptId}/submit/`,
    { answers },
  );
  return response.data;
};
