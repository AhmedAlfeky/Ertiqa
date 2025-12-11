'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import * as schemas from './schemas';
import * as newSchemas from './schemas_new';
import type { ActionResult, UploadResult } from './types';
import { getCurrentInstructorId, isInstructor } from './queries';
import { SupabaseClient } from '@supabase/supabase-js';

// ============================================
// CONSTANTS & CONFIG
// ============================================
const LANG = { AR: 1, EN: 2 } as const;
const LESSON_TYPE = { VIDEO: 1, QUIZ: 5 } as const;

// ============================================
// UTILITIES & MIDDLEWARE (The Senior Sauce 👨‍🍳)
// ============================================

/**
 * Generates a URL-friendly slug from a string.
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 255);
}

/**
 * Context passed to every protected action.
 */
type ActionContext = {
  supabase: SupabaseClient;
  instructorId: string;
};

/**
 * Higher-order function to wrap actions with:
 * 1. Input Validation (Zod)
 * 2. Authentication & Authorization (Instructor Check)
 * 3. Error Handling
 * 4. Supabase Client Injection
 */
async function createInstructorAction<TInput, TOutput>(
  schema: z.ZodSchema<TInput>,
  actionFn: (data: TInput, ctx: ActionContext) => Promise<TOutput>,
  data: TInput,
  revalidatePathStr?: string
): Promise<ActionResult<TOutput>> {
  try {
    // 1. Authorization
    if (!(await isInstructor())) {
      return {
        success: false,
        error: 'Unauthorized: Instructor access required',
      };
    }

    const instructorId = await getCurrentInstructorId();
    if (!instructorId) {
      return { success: false, error: 'Instructor profile not found' };
    }

    // 2. Input Validation
    const validation = schema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues.map(e => e.message).join(', '),
      };
    }

    const validatedData = validation.data;

    // 3. Setup Context
    const supabase = await createClient();

    // 4. Execute Logic
    const result = await actionFn(validatedData, { supabase, instructorId });

    // 5. Revalidation
    if (revalidatePathStr) {
      revalidatePath(revalidatePathStr);
    }

    return { success: true, data: result };
  } catch (error: any) {
    // Zod Error Handling
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map(e => e.message).join(', '),
      };
    }

    // Generic Error Handling
    console.error(`❌ Action Error:`, error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Helper to verify resource ownership (Security Critical)
 */
async function assertCourseOwner(
  supabase: SupabaseClient,
  courseId: number,
  instructorId: string
) {
  const { data } = await supabase
    .from('courses')
    .select('id')
    .eq('id', courseId)
    .eq('instructor_id', instructorId)
    .single();

  if (!data) throw new Error('Course not found or unauthorized access');
}

async function assertModuleOwner(
  supabase: SupabaseClient,
  moduleId: number,
  instructorId: string
) {
  const { data } = await supabase
    .from('INF_COURSE_MODULES')
    .select('COURSE_ID, courses!inner(instructor_id)')
    .eq('ID', moduleId)
    .single();

  if (!data || (data as any).courses?.instructor_id !== instructorId) {
    throw new Error('Module not found or unauthorized access');
  }
  return data;
}

async function assertLessonOwner(
  supabase: SupabaseClient,
  lessonId: number,
  instructorId: string
) {
  const { data } = await supabase
    .from('INF_COURSE_LESSONS')
    .select(
      'MODULE_ID, INF_COURSE_MODULES!inner(COURSE_ID, courses!inner(instructor_id))'
    )
    .eq('ID', lessonId)
    .single();

  if (
    !data ||
    (data as any).INF_COURSE_MODULES?.courses?.instructor_id !== instructorId
  ) {
    throw new Error('Lesson not found or unauthorized access');
  }
  return data;
}

// ============================================
// ACTIONS IMPLEMENTATION
// ============================================

// 1. Create Course
export async function createCourse(
  input: newSchemas.CreateCourseInput,
  locale: string = 'ar'
) {
  // We manually parse here because of the locale logic in revalidate
  const validation = newSchemas.createCourseSchema.safeParse(input);
  if (!validation.success)
    return { success: false, error: validation.error.issues[0].message };

  return createInstructorAction(
    newSchemas.createCourseSchema,
    async (data, { supabase, instructorId }) => {
      const slug = generateSlug(data.titleEn);

      // Step 1: Insert Course
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
          instructor_id: instructorId,
          slug,
          level_id: data.levelId || null,
          category_id: data.categoryId || null,
          teaching_language_id: data.teachingLanguageId || 1,
          cover_image_url: data.coverImageUrl || null,
          promo_video_url: data.promoVideoUrl || null,
          is_free: data.isFree ?? false,
          price: data.isFree
            ? null
            : typeof data.price === 'string'
            ? parseFloat(data.price)
            : data.price,
          currency: data.currency || 'USD',
          is_published: data.isPublished || false,
        })
        .select()
        .single();

      if (courseError || !course)
        throw new Error(`Database error: ${courseError?.message}`);

      // Step 2: Create Translations
      const translations = [
        {
          course_id: course.id,
          language_id: LANG.AR,
          title: data.titleAr,
          subtitle: data.subtitleAr,
          description: data.descriptionAr,
        },
        {
          course_id: course.id,
          language_id: LANG.EN,
          title: data.titleEn,
          subtitle: data.subtitleEn,
          description: data.descriptionEn,
        },
      ];

      const { error: transError } = await supabase
        .from('course_translations')
        .insert(translations);

      if (transError) {
        // Rollback: Manual cleanup since Supabase HTTP API doesn't support complex transactions easily
        await supabase.from('courses').delete().eq('id', course.id);
        throw new Error(`Translation error: ${transError.message}`);
      }

      return { courseId: course.id };
    },
    validation.data,
    `/${locale}/instructor/courses`
  );
}

// 2. Update Course Basic Info
export async function updateCourseBasicInfo(
  courseId: number,
  input: schemas.CourseBasicInfoInput
) {
  // Validate first to catch Zod errors early if needed, or rely on wrapper
  const validation = schemas.courseBasicInfoSchema.safeParse(input);
  if (!validation.success)
    return { success: false, error: validation.error.issues[0].message };

  return createInstructorAction(
    schemas.courseBasicInfoSchema,
    async (data, { supabase, instructorId }) => {
      await assertCourseOwner(supabase, courseId, instructorId);

      // Parallel Updates for Performance
      await Promise.all([
        // 1. Update Core
        supabase
          .from('courses')
          .update({
            cover_image_url: data.coverImageUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('id', courseId),

        // 2. Update Arabic
        supabase.from('course_translations').upsert(
          {
            course_id: courseId,
            language_id: LANG.AR,
            title: data.titleAr,
            subtitle: data.subtitleAr,
            description: data.descriptionAr,
          },
          { onConflict: 'course_id,language_id' }
        ),

        // 3. Update English
        supabase.from('course_translations').upsert(
          {
            course_id: courseId,
            language_id: LANG.EN,
            title: data.titleEn,
            subtitle: data.subtitleEn,
            description: data.descriptionEn,
          },
          { onConflict: 'course_id,language_id' }
        ),
      ]);

      return { message: 'Course updated successfully' };
    },
    validation.data,
    `/instructor/courses/${courseId}/manage`
  );
}

// 3. Update Course Settings
export async function updateCourseSettings(
  courseId: number,
  input: schemas.CourseSettingsInput
) {
  const validation = schemas.courseSettingsSchema.safeParse(input);
  if (!validation.success)
    return { success: false, error: validation.error.issues[0].message };

  return createInstructorAction(
    schemas.courseSettingsSchema,
    async (data, { supabase, instructorId }) => {
      await assertCourseOwner(supabase, courseId, instructorId);

      const { error } = await supabase
        .from('courses')
        .update({
          level_id: data.levelId || null,
          category_id: data.categoryId || null,
          teaching_language_id: data.languageId || 1,
          is_free: data.isFree || false,
          price: data.isFree ? null : data.price,
          currency: data.currency || 'USD',
          is_published: data.isPublished || false,
          published_at: data.isPublished ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', courseId);

      if (error) throw new Error(error.message);
      return { message: 'Settings updated successfully' };
    },
    validation.data,
    `/instructor/courses/${courseId}/manage`
  );
}

// 4. Create Module
export async function createModule(input: schemas.CreateModuleInput) {
  const validation = schemas.createModuleSchema.safeParse(input);
  if (!validation.success)
    return { success: false, error: validation.error.issues[0].message };

  return createInstructorAction(
    schemas.createModuleSchema,
    async (data, { supabase, instructorId }) => {
      await assertCourseOwner(supabase, data.courseId, instructorId);

      const { data: module, error } = await supabase
        .from('INF_COURSE_MODULES')
        .insert({
          COURSE_ID: data.courseId,
          TITLE: data.title,
          DESCRIPTION: data.description,
          ORDER: data.order,
          CREATED_AT: new Date().toISOString(),
        })
        .select()
        .single();

      if (error || !module) throw new Error('Failed to create module');
      return { moduleId: module.ID };
    },
    validation.data,
    `/instructor/courses/${input.courseId}/manage`
  );
}

// 5. Update Module
export async function updateModule(input: schemas.UpdateModuleInput) {
  const validation = schemas.updateModuleSchema.safeParse(input);
  if (!validation.success)
    return { success: false, error: validation.error.issues[0].message };

  return createInstructorAction(
    schemas.updateModuleSchema,
    async (data, { supabase, instructorId }) => {
      await assertModuleOwner(supabase, data.id, instructorId);

      const { error } = await supabase
        .from('INF_COURSE_MODULES')
        .update({
          TITLE: data.title,
          DESCRIPTION: data.description,
          ORDER: data.order,
          UPDATED_AT: new Date().toISOString(),
        })
        .eq('ID', data.id);

      if (error) throw new Error('Failed to update module');
      return { message: 'Module updated successfully' };
    },
    validation.data,
    `/instructor/courses`
  );
}

// 6. Delete Module
export async function deleteModule(moduleId: number) {
  return createInstructorAction(
    z.number(),
    async (id, { supabase, instructorId }) => {
      await assertModuleOwner(supabase, id, instructorId);

      const { error } = await supabase
        .from('INF_COURSE_MODULES')
        .delete()
        .eq('ID', id);

      if (error) throw new Error('Failed to delete module');
      return { message: 'Module deleted successfully' };
    },
    moduleId,
    `/instructor/courses`
  );
}

// 7. Create Video Lesson
export async function createVideoLesson(input: schemas.CreateVideoLessonInput) {
  const validation = schemas.createVideoLessonSchema.safeParse(input);
  if (!validation.success)
    return { success: false, error: validation.error.issues[0].message };

  return createInstructorAction(
    schemas.createVideoLessonSchema,
    async (data, { supabase, instructorId }) => {
      await assertModuleOwner(supabase, data.moduleId, instructorId);

      const { data: lesson, error } = await supabase
        .from('INF_COURSE_LESSONS')
        .insert({
          MODULE_ID: data.moduleId,
          TITLE: data.title,
          LESSON_TYPE: LESSON_TYPE.VIDEO,
          VIDEO_URL: data.videoUrl,
          DURATION: data.duration,
          IS_FREE_PREVIEW: data.isFreePreview,
          ORDER: data.order,
          CREATED_AT: new Date().toISOString(),
        })
        .select()
        .single();

      if (error || !lesson) throw new Error('Failed to create lesson');
      return { lessonId: lesson.ID };
    },
    validation.data,
    `/instructor/courses`
  );
}

// 8. Create Quiz Lesson
export async function createQuizLesson(input: schemas.CreateQuizLessonInput) {
  const validation = schemas.createQuizLessonSchema.safeParse(input);
  if (!validation.success)
    return { success: false, error: validation.error.issues[0].message };

  return createInstructorAction(
    schemas.createQuizLessonSchema,
    async (data, { supabase, instructorId }) => {
      await assertModuleOwner(supabase, data.moduleId, instructorId);

      // Step 1: Create Lesson
      const { data: lesson, error: lessonError } = await supabase
        .from('INF_COURSE_LESSONS')
        .insert({
          MODULE_ID: data.moduleId,
          TITLE: data.title,
          LESSON_TYPE: LESSON_TYPE.QUIZ,
          PASSING_SCORE: data.passingScore,
          ORDER: data.order,
          CREATED_AT: new Date().toISOString(),
        })
        .select()
        .single();

      if (lessonError || !lesson)
        throw new Error('Failed to create quiz lesson');

      try {
        // Step 2: Create Questions & Options
        for (const question of data.questions) {
          const { data: qData, error: qError } = await supabase
            .from('INF_QUIZ_QUESTIONS')
            .insert({
              LESSON_ID: lesson.ID,
              QUESTION_TEXT: question.questionText,
              ORDER: question.order,
              CREATED_AT: new Date().toISOString(),
            })
            .select()
            .single();

          if (qError || !qData) throw new Error('Failed to create question');

          const optionsPayload = question.options.map(opt => ({
            QUESTION_ID: qData.ID,
            OPTION_TEXT: opt.optionText,
            IS_CORRECT: opt.isCorrect,
            ORDER: opt.order,
            CREATED_AT: new Date().toISOString(),
          }));

          const { error: optError } = await supabase
            .from('INF_QUIZ_OPTIONS')
            .insert(optionsPayload);
          if (optError) throw new Error('Failed to create options');
        }
      } catch (err) {
        // Rollback on any internal failure
        await supabase.from('INF_COURSE_LESSONS').delete().eq('ID', lesson.ID);
        throw err;
      }

      return { lessonId: lesson.ID };
    },
    validation.data,
    `/instructor/courses`
  );
}

// 9. Update Lesson
export async function updateLesson(input: schemas.UpdateLessonInput) {
  const validation = schemas.updateLessonSchema.safeParse(input);
  if (!validation.success)
    return { success: false, error: validation.error.issues[0].message };

  return createInstructorAction(
    schemas.updateLessonSchema,
    async (data, { supabase, instructorId }) => {
      await assertLessonOwner(supabase, data.id, instructorId);

      const { error } = await supabase
        .from('INF_COURSE_LESSONS')
        .update({
          TITLE: data.title,
          VIDEO_URL: data.videoUrl,
          DURATION: data.duration,
          IS_FREE_PREVIEW: data.isFreePreview,
          ORDER: data.order,
          UPDATED_AT: new Date().toISOString(),
        })
        .eq('ID', data.id);

      if (error) throw new Error('Failed to update lesson');
      return { message: 'Lesson updated successfully' };
    },
    validation.data,
    `/instructor/courses`
  );
}

// 10. Delete Lesson
export async function deleteLesson(lessonId: number) {
  return createInstructorAction(
    z.number(),
    async (id, { supabase, instructorId }) => {
      await assertLessonOwner(supabase, id, instructorId);

      const { error } = await supabase
        .from('INF_COURSE_LESSONS')
        .delete()
        .eq('ID', id);

      if (error) throw new Error('Failed to delete lesson');
      return { message: 'Lesson deleted successfully' };
    },
    lessonId,
    `/instructor/courses`
  );
}

// 11. Upload Image
export async function uploadCourseImage(fileData: FormData) {
  // Custom logic because input is FormData, not JSON schema
  try {
    if (!(await isInstructor()))
      return { success: false, error: 'Unauthorized' };

    const supabase = await createClient();
    const file = fileData.get('file') as File;
    if (!file) return { success: false, error: 'No file provided' };

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;
    const filePath = `courses/${fileName}`;

    const { error } = await supabase.storage
      .from('courses')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) throw new Error(error.message);

    const {
      data: { publicUrl },
    } = supabase.storage.from('courses').getPublicUrl(filePath);

    return {
      success: true,
      data: { url: publicUrl, path: filePath },
    };
  } catch (error: any) {
    console.error('Upload Error:', error);
    return { success: false, error: error.message };
  }
}
