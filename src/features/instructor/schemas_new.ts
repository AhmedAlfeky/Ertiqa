import { z } from 'zod';

// ============================================
// Single-Step Course Creation Schema
// ============================================
export const createCourseSchema = z.object({
  // Titles (required in both languages)
  titleAr: z.string().min(3, 'Arabic title must be at least 3 characters').max(255),
  titleEn: z.string().min(3, 'English title must be at least 3 characters').max(255),
  
  // Subtitles (optional - but if provided must be at least 10 chars)
  subtitleAr: z.string().min(10, 'Arabic subtitle must be at least 10 characters').max(255).optional().or(z.literal('')),
  subtitleEn: z.string().min(10, 'English subtitle must be at least 10 characters').max(255).optional().or(z.literal('')),
  
  // Descriptions (REQUIRED)
  descriptionAr: z.string().min(20, 'Arabic description is required (min 20 characters)'),
  descriptionEn: z.string().min(20, 'English description is required (min 20 characters)'),
  
  // Course Settings
  levelId: z.number().int().positive('Please select a level'),
  categoryId: z.number().int().positive('Please select a category').optional(),
  teachingLanguageId: z.number().int().positive('Please select teaching language').default(1),
  
  // Pricing (REQUIRED when not free)
  isFree: z.boolean().default(false), // Pricing ON by default
  price: z.union([z.string(), z.number()]).nullable().optional(), // Optional - accepts string, number, null, or undefined
  currency: z.string().length(3).default('USD'),
  
  // Publishing
  isPublished: z.boolean().default(false), // NOT public by default
  
  // Media (REQUIRED)
  coverImageUrl: z.string().min(1, 'Cover image is required'), // Will be uploaded, not URL
  promoVideoUrl: z.string().url('Invalid video URL').optional().nullable(),
}).superRefine((data, ctx) => {
  // If course is not free, price must be provided and greater than 0
  if (!data.isFree) {
    const priceNum = typeof data.price === 'string' 
      ? parseFloat(data.price) 
      : data.price;
    
    if (priceNum === undefined || priceNum === null || isNaN(priceNum)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Price is required for paid courses',
        path: ['price'],
      });
    } else if (priceNum <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Price must be greater than 0',
        path: ['price'],
      });
    }
  }
  // If free, price validation is skipped (can be 0, null, or undefined)
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;

// ============================================
// Unit Schema (for later - separate page)
// ============================================
export const createUnitSchema = z.object({
  courseId: z.number().int().positive(),
  titleAr: z.string().min(3).max(255),
  titleEn: z.string().min(3).max(255),
  descriptionAr: z.string().optional(),
  descriptionEn: z.string().optional(),
  orderIndex: z.number().int().min(0).default(0),
});

export type CreateUnitInput = z.infer<typeof createUnitSchema>;

// ============================================
// Lesson Schema (for later - separate page)
// ============================================
export const createLessonSchema = z.object({
  unitId: z.number().int().positive(),
  titleAr: z.string().min(3).max(255),
  titleEn: z.string().min(3).max(255),
  lessonType: z.enum(['video', 'text', 'quiz', 'file']),
  
  // Video lesson fields
  videoUrl: z.string().url().optional(),
  videoDuration: z.number().int().min(0).optional(),
  
  // Text lesson fields
  contentAr: z.string().optional(),
  contentEn: z.string().optional(),
  
  // File lesson fields
  fileUrl: z.string().url().optional(),
  
  // Settings
  isFreePreview: z.boolean().default(false),
  orderIndex: z.number().int().min(0).default(0),
});

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
