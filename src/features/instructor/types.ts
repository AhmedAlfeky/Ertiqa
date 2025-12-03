// ============================================
// Action Result Types
// ============================================
export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

// ============================================
// Course Types (NEW SCHEMA)
// ============================================
export interface Course {
  id: number;
  instructor_id: string; // UUID
  slug: string;
  level_id?: number | null;
  category_id?: number | null;
  teaching_language_id: number;
  cover_image_url?: string | null;
  promo_video_url?: string | null;
  is_free: boolean;
  price?: number | null;
  currency: string;
  is_published: boolean;
  published_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CourseWithDetails extends Course {
  // Translated fields (from course_translations)
  title: string;
  subtitle?: string | null;
  description?: string | null;
  
  // Lookup relations
  lookup_levels?: { id: number; name: string } | null;
  lookup_languages?: { id: number; name: string } | null;
  
  // Raw translations array (for editing)
  course_translations?: Array<{
    language_id: number;
    title: string;
    subtitle?: string | null;
    description?: string | null;
  }>;
  
  // Counts
  modulesCount: number;
  lessonsCount: number;
}

// ============================================
// Module Types
// ============================================
export interface Module {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

// ============================================
// Lesson Types
// ============================================
export interface Lesson {
  id: number;
  moduleId: number;
  title: string;
  lessonType: number; // 1 = Video, 5 = Quiz
  videoUrl?: string;
  duration?: number;
  isFreePreview: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface VideoLesson extends Lesson {
  lessonType: 1;
  videoUrl: string;
}

export interface QuizLesson extends Lesson {
  lessonType: 5;
  passingScore: number;
  questions: QuizQuestion[];
}

// ============================================
// Quiz Types
// ============================================
export interface QuizQuestion {
  id: number;
  lessonId: number;
  questionText: string;
  order: number;
  createdAt: string;
  options: QuizOption[];
}

export interface QuizOption {
  id: number;
  questionId: number;
  optionText: string;
  isCorrect: boolean;
  order: number;
  createdAt: string;
}

// ============================================
// Lookup Types
// ============================================
export interface Level {
  id: number;
  name: string;
  nameAr?: string;
}

export interface Language {
  id: number;
  name: string;
  nameAr?: string;
  code: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

// ============================================
// Pagination Types
// ============================================
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// Upload Types
// ============================================
export interface UploadResult {
  url: string;
  path: string;
}
