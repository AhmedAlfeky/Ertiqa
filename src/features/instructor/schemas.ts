import { z } from 'zod';

// ============================================
// Course Creation Schema (Step 1)
// ============================================
export const createCourseSchema = z.object({
  titleAr: z.string().min(3, 'Arabic title must be at least 3 characters').max(255),
  titleEn: z.string().min(3, 'English title must be at least 3 characters').max(255),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;

// ============================================
// Course Basic Info Schema (Tab 1)
// ============================================
export const courseBasicInfoSchema = z.object({
  titleAr: z.string().min(3, 'Arabic title must be at least 3 characters').max(200, 'Arabic title is too long'),
  titleEn: z.string().min(3, 'English title must be at least 3 characters').max(200, 'English title is too long'),
  subtitleAr: z.string().min(10, 'Arabic subtitle must be at least 10 characters').max(500, 'Arabic subtitle is too long').optional(),
  subtitleEn: z.string().min(10, 'English subtitle must be at least 10 characters').max(500, 'English subtitle is too long').optional(),
  descriptionAr: z.string().min(20, 'Arabic description must be at least 20 characters').optional(),
  descriptionEn: z.string().min(20, 'English description must be at least 20 characters').optional(),
  coverImageUrl: z.string().url('Invalid image URL').optional().nullable(),
});

export type CourseBasicInfoInput = z.infer<typeof courseBasicInfoSchema>;

// ============================================
// Course Settings Schema (Tab 2)
// ============================================
export const courseSettingsSchema = z.object({
  price: z.number().min(0, 'Price cannot be negative').default(0),
  levelId: z.number().int().positive('Please select a level'),
  languageId: z.number().int().positive('Please select a language'),
  categoryId: z.number().int().positive('Please select a category').optional(),
  isFree: z.boolean().default(false),
  currency: z.string().default('USD'),
  isPublished: z.boolean().default(false),
});

export type CourseSettingsInput = z.infer<typeof courseSettingsSchema>;

// ============================================
// Module Schema
// ============================================
export const createModuleSchema = z.object({
  courseId: z.number().int().positive(),
  title: z.string().min(3, 'Module title must be at least 3 characters').max(200, 'Title is too long'),
  description: z.string().optional(),
  order: z.number().int().min(0).default(0),
});

export const updateModuleSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(3, 'Module title must be at least 3 characters').max(200, 'Title is too long'),
  description: z.string().optional(),
  order: z.number().int().min(0),
});

export type CreateModuleInput = z.infer<typeof createModuleSchema>;
export type UpdateModuleInput = z.infer<typeof updateModuleSchema>;

// ============================================
// Video Lesson Schema
// ============================================
export const createVideoLessonSchema = z.object({
  moduleId: z.number().int().positive(),
  title: z.string().min(3, 'Lesson title must be at least 3 characters').max(200, 'Title is too long'),
  videoUrl: z.string().url('Invalid video URL').optional().or(z.literal('')),
  duration: z.number().int().min(0).optional().nullable(),
  isFreePreview: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

export type CreateVideoLessonInput = z.infer<typeof createVideoLessonSchema>;

// ============================================
// Quiz Lesson Schema
// ============================================
export const quizOptionSchema = z.object({
  optionText: z.string().min(1, 'Option text is required').max(500, 'Option text is too long'),
  isCorrect: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

export const quizQuestionSchema = z.object({
  questionText: z.string().min(5, 'Question must be at least 5 characters').max(1000, 'Question is too long'),
  order: z.number().int().min(0).default(0),
  options: z.array(quizOptionSchema).min(2, 'At least 2 options required').max(6, 'Maximum 6 options allowed'),
});

export const createQuizLessonSchema = z.object({
  moduleId: z.number().int().positive(),
  title: z.string().min(3, 'Quiz title must be at least 3 characters').max(200, 'Title is too long'),
  passingScore: z.number().int().min(0).max(100).default(70),
  order: z.number().int().min(0).default(0),
  questions: z.array(quizQuestionSchema).min(1, 'At least 1 question required').max(50, 'Maximum 50 questions allowed'),
}).refine(
  (data) => {
    // Ensure each question has at least one correct answer
    return data.questions.every((q) => q.options.some((opt) => opt.isCorrect));
  },
  {
    message: 'Each question must have at least one correct answer',
    path: ['questions'],
  }
);

export type CreateQuizLessonInput = z.infer<typeof createQuizLessonSchema>;
export type QuizQuestionInput = z.infer<typeof quizQuestionSchema>;
export type QuizOptionInput = z.infer<typeof quizOptionSchema>;

// ============================================
// Update Lesson Schema
// ============================================
export const updateLessonSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(3, 'Lesson title must be at least 3 characters').max(200, 'Title is too long'),
  videoUrl: z.string().url('Invalid video URL').optional().nullable(),
  duration: z.number().int().min(0).optional().nullable(),
  isFreePreview: z.boolean().optional(),
  order: z.number().int().min(0),
});

export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;

// ============================================
// Image Upload Schema
// ============================================
export const imageUploadSchema = z.object({
  file: z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
    message: 'File size must be less than 5MB',
  }).refine(
    (file) => ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type),
    {
      message: 'Only JPEG, PNG, and WebP images are allowed',
    }
  ),
  bucket: z.enum(['courses', 'avatars']).default('courses'),
});

export type ImageUploadInput = z.infer<typeof imageUploadSchema>;
