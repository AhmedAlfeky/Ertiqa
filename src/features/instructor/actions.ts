'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  createCourseSchema,
  type CreateCourseInput,
} from './schemas_new';
import {
  courseBasicInfoSchema,
  courseSettingsSchema,
  createModuleSchema,
  updateModuleSchema,
  createVideoLessonSchema,
  createQuizLessonSchema,
  updateLessonSchema,
  type CourseBasicInfoInput,
  type CourseSettingsInput,
  type CreateModuleInput,
  type UpdateModuleInput,
  type CreateVideoLessonInput,
  type CreateQuizLessonInput,
  type UpdateLessonInput,
} from './schemas';
import type { ActionResult, UploadResult } from './types';
import { getCurrentInstructorId } from './queries';

// ============================================
// ACTION: Create Course (Step 1)
// ============================================
export async function createCourse(
  data: CreateCourseInput,
  locale: string = 'ar'
): Promise<ActionResult<{ courseId: number }>> {
  console.log('📝 CREATE COURSE - Received data:', JSON.stringify(data, null, 2));
  
  // Validate input
  const validation = createCourseSchema.safeParse(data);
  
  if (!validation.success) {
    console.error('❌ Validation failed:', validation.error.issues);
    return {
      success: false,
      error: validation.error.issues.map((e) => e.message).join(', '),
    };
  }

  console.log('✅ Validation passed');

  const supabase = await createClient();
  const instructorId = await getCurrentInstructorId();
  
  if (!instructorId) {
    return {
      success: false,
      error: 'Instructor not found',
    };
  }

  try {
    // Generate slug from English title (URL-friendly version)
    const slug = validation.data.titleEn
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .substring(0, 255); // Limit to 255 chars
    
    console.log('Creating course with instructor ID:', instructorId);
    console.log('Generated slug:', slug);
    
    // Step 1: Insert into courses table with ALL form data
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .insert({
        instructor_id: instructorId, // UUID from auth.users
        slug: slug,
        level_id: validation.data.levelId || null,
        category_id: validation.data.categoryId || null,
        teaching_language_id: validation.data.teachingLanguageId || 1,
        cover_image_url: validation.data.coverImageUrl || null,
        promo_video_url: validation.data.promoVideoUrl || null,
        is_free: validation.data.isFree ?? false,
        price: validation.data.isFree ? null : (typeof validation.data.price === 'string' ? parseFloat(validation.data.price) : (validation.data.price || null)),
        currency: validation.data.currency || 'USD',
        is_published: validation.data.isPublished || false,
      })
      .select()
      .single();

    if (courseError) {
      console.error('Error creating course:', JSON.stringify(courseError, null, 2));
      return {
        success: false,
        error: `Database error: ${courseError.message}`,
      };
    }

    if (!courseData) {
      return {
        success: false,
        error: 'Failed to create course - no data returned',
      };
    }

    console.log('✅ Course created:', courseData.id);

    // Step 2: Create translations for BOTH Arabic and English
    const translations = [
      {
        course_id: courseData.id,
        language_id: 1, // Arabic
        title: validation.data.titleAr,
        subtitle: validation.data.subtitleAr || null,
        description: validation.data.descriptionAr || null,
        objectives: null,
      },
      {
        course_id: courseData.id,
        language_id: 2, // English
        title: validation.data.titleEn,
        subtitle: validation.data.subtitleEn || null,
        description: validation.data.descriptionEn || null,
        objectives: null,
      },
    ];

    const { error: translationError } = await supabase
      .from('course_translations')
      .insert(translations);

    if (translationError) {
      console.error('Error creating translations:', JSON.stringify(translationError, null, 2));
      // Clean up the course record
      await supabase.from('courses').delete().eq('id', courseData.id);
      return {
        success: false,
        error: `Failed to create translations: ${translationError.message}`,
      };
    }

    console.log('✅ Translations created for both AR and EN');

    // Revalidate and return success with courseId for client-side navigation
    revalidatePath(`/${locale}/instructor/courses`);
    
    return {
      success: true,
      data: {
        courseId: courseData.id,
      },
    };
  } catch (error: any) {
    console.error('Error in createCourse:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

// ============================================
// ACTION: Update Course Basic Info
// ============================================
export async function updateCourseBasicInfo(
  courseId: number,
  data: CourseBasicInfoInput
): Promise<ActionResult> {
  const validation = courseBasicInfoSchema.safeParse(data);
  
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues.map((e) => e.message).join(', '),
    };
  }

  const supabase = await createClient();
  const instructorId = await getCurrentInstructorId();

  if (!instructorId) {
    return {
      success: false,
      error: 'Unauthorized',
    };
  }

  try {
    // Verify course exists and belongs to instructor
    const { data: course } = await supabase
      .from('courses')
      .select('id')
      .eq('id', courseId)
      .eq('instructor_id', instructorId)
      .single();

    if (!course) {
      return {
        success: false,
        error: 'Course not found',
      };
    }

    // Update course cover image
    const { error: courseError } = await supabase
      .from('courses')
      .update({
        cover_image_url: validation.data.coverImageUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', courseId);

    if (courseError) {
      console.error('Error updating course:', courseError);
      return {
        success: false,
        error: 'Failed to update course',
      };
    }

    // Update course translations (both Arabic and English)
    // Update Arabic translation (language_id: 1)
    const { error: arTranslationError } = await supabase
      .from('course_translations')
      .upsert({
        course_id: courseId,
        language_id: 1, // Arabic
        title: validation.data.titleAr,
        subtitle: validation.data.subtitleAr || null,
        description: validation.data.descriptionAr || null,
      }, {
        onConflict: 'course_id,language_id',
      });

    if (arTranslationError) {
      console.error('Error updating Arabic translation:', arTranslationError);
      return {
        success: false,
        error: 'Failed to update Arabic translation',
      };
    }

    // Update English translation (language_id: 2)
    const { error: enTranslationError } = await supabase
      .from('course_translations')
      .upsert({
        course_id: courseId,
        language_id: 2, // English
        title: validation.data.titleEn,
        subtitle: validation.data.subtitleEn || null,
        description: validation.data.descriptionEn || null,
      }, {
        onConflict: 'course_id,language_id',
      });

    if (enTranslationError) {
      console.error('Error updating English translation:', enTranslationError);
      return {
        success: false,
        error: 'Failed to update English translation',
      };
    }

    console.log('✅ Course basic info updated (both Arabic and English)');
    revalidatePath(`/instructor/courses/${courseId}/manage`);

    return {
      success: true,
      data: { message: 'Course updated successfully' },
    };
  } catch (error: any) {
    console.error('Error in updateCourseBasicInfo:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

// ============================================
// ACTION: Update Course Settings
// ============================================
export async function updateCourseSettings(
  courseId: number,
  data: CourseSettingsInput
): Promise<ActionResult> {
  const validation = courseSettingsSchema.safeParse(data);
  
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues.map((e) => e.message).join(', '),
    };
  }

  const supabase = await createClient();
  const instructorId = await getCurrentInstructorId();

  if (!instructorId) {
    return {
      success: false,
      error: 'Unauthorized',
    };
  }

  try {
    // Verify course exists and belongs to instructor
    const { data: course } = await supabase
      .from('courses')
      .select('id')
      .eq('id', courseId)
      .eq('instructor_id', instructorId)
      .single();

    if (!course) {
      return {
        success: false,
        error: 'Course not found',
      };
    }

    // Update course settings
    const { error: courseError } = await supabase
      .from('courses')
      .update({
        level_id: validation.data.levelId || null,
        category_id: validation.data.categoryId || null,
        teaching_language_id: validation.data.languageId || 1,
        is_free: validation.data.isFree || false,
        price: validation.data.isFree ? null : validation.data.price,
        currency: validation.data.currency || 'USD',
        is_published: validation.data.isPublished || false,
        published_at: validation.data.isPublished ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', courseId);

    if (courseError) {
      console.error('Error updating course settings:', courseError);
      return {
        success: false,
        error: 'Failed to update course settings',
      };
    }

    console.log('✅ Course settings updated');
    revalidatePath(`/instructor/courses/${courseId}/manage`);

    return {
      success: true,
      data: { message: 'Settings updated successfully' },
    };
  } catch (error: any) {
    console.error('Error in updateCourseSettings:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

// ============================================
// ACTION: Create Module
// ============================================
export async function createModule(data: CreateModuleInput): Promise<ActionResult<{ moduleId: number }>> {
  const validation = createModuleSchema.safeParse(data);
  
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues.map((e) => e.message).join(', '),
    };
  }

  const supabase = await createClient();

  try {
    const { data: module, error } = await supabase
      .from('INF_COURSE_MODULES')
      .insert({
        COURSE_ID: validation.data.courseId,
        TITLE: validation.data.title,
        DESCRIPTION: validation.data.description,
        ORDER: validation.data.order,
        CREATED_AT: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !module) {
      console.error('Error creating module:', error);
      return {
        success: false,
        error: 'Failed to create module',
      };
    }

    console.log('✅ Module created:', module.ID);
    revalidatePath(`/instructor/courses/${validation.data.courseId}/manage`);

    return {
      success: true,
      data: { moduleId: module.ID },
    };
  } catch (error: any) {
    console.error('Error in createModule:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

// ============================================
// ACTION: Update Module
// ============================================
export async function updateModule(data: UpdateModuleInput): Promise<ActionResult> {
  const validation = updateModuleSchema.safeParse(data);
  
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues.map((e) => e.message).join(', '),
    };
  }

  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('INF_COURSE_MODULES')
      .update({
        TITLE: validation.data.title,
        DESCRIPTION: validation.data.description,
        ORDER: validation.data.order,
        UPDATED_AT: new Date().toISOString(),
      })
      .eq('ID', validation.data.id);

    if (error) {
      console.error('Error updating module:', error);
      return {
        success: false,
        error: 'Failed to update module',
      };
    }

    console.log('✅ Module updated');
    revalidatePath(`/instructor/courses`);

    return {
      success: true,
      data: { message: 'Module updated successfully' },
    };
  } catch (error: any) {
    console.error('Error in updateModule:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

// ============================================
// ACTION: Delete Module
// ============================================
export async function deleteModule(moduleId: number): Promise<ActionResult> {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('INF_COURSE_MODULES')
      .delete()
      .eq('ID', moduleId);

    if (error) {
      console.error('Error deleting module:', error);
      return {
        success: false,
        error: 'Failed to delete module',
      };
    }

    console.log('✅ Module deleted');
    revalidatePath(`/instructor/courses`);

    return {
      success: true,
      data: { message: 'Module deleted successfully' },
    };
  } catch (error: any) {
    console.error('Error in deleteModule:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

// ============================================
// ACTION: Create Video Lesson
// ============================================
export async function createVideoLesson(data: CreateVideoLessonInput): Promise<ActionResult<{ lessonId: number }>> {
  const validation = createVideoLessonSchema.safeParse(data);
  
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues.map((e) => e.message).join(', '),
    };
  }

  const supabase = await createClient();

  try {
    const { data: lesson, error } = await supabase
      .from('INF_COURSE_LESSONS')
      .insert({
        MODULE_ID: validation.data.moduleId,
        TITLE: validation.data.title,
        LESSON_TYPE: 1, // 1 = Video
        VIDEO_URL: validation.data.videoUrl,
        DURATION: validation.data.duration,
        IS_FREE_PREVIEW: validation.data.isFreePreview,
        ORDER: validation.data.order,
        CREATED_AT: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !lesson) {
      console.error('Error creating video lesson:', error);
      return {
        success: false,
        error: 'Failed to create lesson',
      };
    }

    console.log('✅ Video lesson created:', lesson.ID);
    revalidatePath(`/instructor/courses`);

    return {
      success: true,
      data: { lessonId: lesson.ID },
    };
  } catch (error: any) {
    console.error('Error in createVideoLesson:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

// ============================================
// ACTION: Create Quiz Lesson (WITH TRANSACTION)
// ============================================
export async function createQuizLesson(data: CreateQuizLessonInput): Promise<ActionResult<{ lessonId: number }>> {
  const validation = createQuizLessonSchema.safeParse(data);
  
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues.map((e) => e.message).join(', '),
    };
  }

  const supabase = await createClient();

  try {
    // Step 1: Create the lesson
    const { data: lesson, error: lessonError } = await supabase
      .from('INF_COURSE_LESSONS')
      .insert({
        MODULE_ID: validation.data.moduleId,
        TITLE: validation.data.title,
        LESSON_TYPE: 5, // 5 = Quiz
        PASSING_SCORE: validation.data.passingScore,
        ORDER: validation.data.order,
        CREATED_AT: new Date().toISOString(),
      })
      .select()
      .single();

    if (lessonError || !lesson) {
      console.error('Error creating quiz lesson:', lessonError);
      return {
        success: false,
        error: 'Failed to create quiz',
      };
    }

    // Step 2: Create questions and options
    for (const question of validation.data.questions) {
      const { data: questionData, error: questionError } = await supabase
        .from('INF_QUIZ_QUESTIONS')
        .insert({
          LESSON_ID: lesson.ID,
          QUESTION_TEXT: question.questionText,
          ORDER: question.order,
          CREATED_AT: new Date().toISOString(),
        })
        .select()
        .single();

      if (questionError || !questionData) {
        console.error('Error creating question:', questionError);
        // Rollback: Delete the lesson
        await supabase.from('INF_COURSE_LESSONS').delete().eq('ID', lesson.ID);
        return {
          success: false,
          error: 'Failed to create quiz questions',
        };
      }

      // Step 3: Create options for this question
      const optionsToInsert = question.options.map((option) => ({
        QUESTION_ID: questionData.ID,
        OPTION_TEXT: option.optionText,
        IS_CORRECT: option.isCorrect,
        ORDER: option.order,
        CREATED_AT: new Date().toISOString(),
      }));

      const { error: optionsError } = await supabase
        .from('INF_QUIZ_OPTIONS')
        .insert(optionsToInsert);

      if (optionsError) {
        console.error('Error creating options:', optionsError);
        // Rollback: Delete the lesson (cascade will handle questions)
        await supabase.from('INF_COURSE_LESSONS').delete().eq('ID', lesson.ID);
        return {
          success: false,
          error: 'Failed to create quiz options',
        };
      }
    }

    console.log('✅ Quiz lesson created with questions and options:', lesson.ID);
    revalidatePath(`/instructor/courses`);

    return {
      success: true,
      data: { lessonId: lesson.ID },
    };
  } catch (error: any) {
    console.error('Error in createQuizLesson:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

// ============================================
// ACTION: Update Lesson
// ============================================
export async function updateLesson(data: UpdateLessonInput): Promise<ActionResult> {
  const validation = updateLessonSchema.safeParse(data);
  
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues.map((e) => e.message).join(', '),
    };
  }

  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('INF_COURSE_LESSONS')
      .update({
        TITLE: validation.data.title,
        VIDEO_URL: validation.data.videoUrl,
        DURATION: validation.data.duration,
        IS_FREE_PREVIEW: validation.data.isFreePreview,
        ORDER: validation.data.order,
        UPDATED_AT: new Date().toISOString(),
      })
      .eq('ID', validation.data.id);

    if (error) {
      console.error('Error updating lesson:', error);
      return {
        success: false,
        error: 'Failed to update lesson',
      };
    }

    console.log('✅ Lesson updated');
    revalidatePath(`/instructor/courses`);

    return {
      success: true,
      data: { message: 'Lesson updated successfully' },
    };
  } catch (error: any) {
    console.error('Error in updateLesson:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

// ============================================
// ACTION: Delete Lesson
// ============================================
export async function deleteLesson(lessonId: number): Promise<ActionResult> {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('INF_COURSE_LESSONS')
      .delete()
      .eq('ID', lessonId);

    if (error) {
      console.error('Error deleting lesson:', error);
      return {
        success: false,
        error: 'Failed to delete lesson',
      };
    }

    console.log('✅ Lesson deleted');
    revalidatePath(`/instructor/courses`);

    return {
      success: true,
      data: { message: 'Lesson deleted successfully' },
    };
  } catch (error: any) {
    console.error('Error in deleteLesson:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

// ============================================
// ACTION: Upload Image to Supabase Storage
// ============================================
export async function uploadCourseImage(fileData: FormData): Promise<ActionResult<UploadResult>> {
  const supabase = await createClient();
  const file = fileData.get('file') as File;
  
  if (!file) {
    return {
      success: false,
      error: 'No file provided',
    };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `courses/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('courses')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return {
        success: false,
        error: 'Failed to upload image',
      };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('courses')
      .getPublicUrl(filePath);

    console.log('✅ Image uploaded:', publicUrl);

    return {
      success: true,
      data: {
        url: publicUrl,
        path: filePath,
      },
    };
  } catch (error: any) {
    console.error('Error in uploadCourseImage:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}
