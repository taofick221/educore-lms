export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseFeature {
  id: string;
  title: string;
  description?: string;
  icon?: string | null;
  order?: number;
}

export interface LearningOutcome {
  id: string;
  title: string;
  description?: string;
  order?: number;
}

export interface CourseRequirement {
  id: string;
  title: string;
  description?: string;
  order?: number;
}

export interface Lecture {
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
  resources: unknown[];
}

export interface Section {
  id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  is_active?: boolean;
  is_published?: boolean;
  lectures: Lecture[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  short_description: string;
  description?: string;

  thumbnail: string | null;
  intro_video?: string;

  category: CourseCategory | null;

  instructor_id: string;
  instructor_name: string;
  instructor_email?: string;

  level: string;
  language: string;
  duration: number;

  price: string;
  discount_price: string | null;

  features?: CourseFeature[];
  learning_outcomes?: LearningOutcome[];
  requirements?: CourseRequirement[];

  sections?: Section[];

  total_sections?: number;
  total_lectures?: number;

  status: string;
  is_featured: boolean;
  is_published: boolean;
  is_active?: boolean;

  published_at: string | null;

  created_at: string;
  updated_at?: string;
}

export interface CourseListParams {
  search?: string;
  category?: string;
  level?: string;
  language?: string;
  ordering?: string;
}