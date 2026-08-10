export interface Enrollment {
  id: string;
  course: string;
  course_title: string;
  student: string;
  status: string;
  enrolled_at: string;
  completed_at: string | null;

  progress_percentage: number;
  completed_lectures: number;
  total_lectures: number;

  certificate_issued: boolean;
  is_active: boolean;
}

export interface CourseProgress {
  id: string;
  enrollment: string;
  completed_lectures: number;
  total_lectures: number;
  progress_percentage: number;
  last_completed_lecture: string | null;
}