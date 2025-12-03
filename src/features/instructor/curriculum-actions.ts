'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentInstructorId } from './queries';
import type { ActionResult } from './types';

// ============================================
// UNIT ACTIONS
// ============================================

interface CreateUnitInput {
  courseId: number;
  titleAr: string;
  titleEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
}

export async function createUnit(
  data: CreateUnitInput
): Promise<ActionResult<{ unitId: number }>> {
  const supabase = await createClient();
  const instructorId = await getCurrentInstructorId();

  if (!instructorId) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Get current max order_index
    const { data: units } = await supabase
      .from('course_units')
      .select('order_index')
      .eq('course_id', data.courseId)
      .order('order_index', { ascending: false })
      .limit(1);

    const nextOrder = units && units.length > 0 ? units[0].order_index + 1 : 0;

    // Insert unit
    const { data: unit, error: unitError } = await supabase
      .from('course_units')
      .insert({
        course_id: data.courseId,
        order_index: nextOrder,
      })
      .select()
      .single();

    if (unitError || !unit) {
      return {
        success: false,
        error: unitError?.message || 'Failed to create unit',
      };
    }

    // Insert translations
    const translations = [
      {
        unit_id: unit.id,
        language_id: 1, // Arabic
        title: data.titleAr,
        description: data.descriptionAr || null,
      },
      {
        unit_id: unit.id,
        language_id: 2, // English
        title: data.titleEn,
        description: data.descriptionEn || null,
      },
    ];

    const { error: translationError } = await supabase
      .from('course_unit_translations')
      .insert(translations);

    if (translationError) {
      // Rollback: delete the unit
      await supabase.from('course_units').delete().eq('id', unit.id);
      return { success: false, error: translationError.message };
    }

    // Revalidate paths
    revalidatePath(`/ar/instructor/courses/${data.courseId}/manage`);
    revalidatePath(`/en/instructor/courses/${data.courseId}/manage`);
    return { success: true, data: { unitId: unit.id } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUnit(
  unitId: number,
  data: Omit<CreateUnitInput, 'courseId'>
): Promise<ActionResult<void>> {
  const supabase = await createClient();

  try {
    // Get course_id for revalidation
    const { data: unit } = await supabase
      .from('course_units')
      .select('course_id')
      .eq('id', unitId)
      .single();

    // Update translations
    const updates = [
      {
        unit_id: unitId,
        language_id: 1,
        title: data.titleAr,
        description: data.descriptionAr || null,
      },
      {
        unit_id: unitId,
        language_id: 2,
        title: data.titleEn,
        description: data.descriptionEn || null,
      },
    ];

    for (const update of updates) {
      const { error } = await supabase
        .from('course_unit_translations')
        .upsert(update, { onConflict: 'unit_id,language_id' });

      if (error) {
        return { success: false, error: error.message };
      }
    }

    if (unit) {
      // Revalidate paths
      revalidatePath(`/ar/instructor/courses/${unit.course_id}/manage`);
      revalidatePath(`/en/instructor/courses/${unit.course_id}/manage`);
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteUnit(unitId: number): Promise<ActionResult<void>> {
  const supabase = await createClient();

  try {
    // First get the course_id before deleting
    const { data: unit, error: fetchError } = await supabase
      .from('course_units')
      .select('course_id')
      .eq('id', unitId)
      .single();

    if (fetchError || !unit) {
      return { success: false, error: fetchError?.message || 'Unit not found' };
    }

    // CASCADE will handle translations and lessons
    const { error } = await supabase
      .from('course_units')
      .delete()
      .eq('id', unitId);

    if (error) {
      return { success: false, error: error.message };
    }

    // Revalidate the course manage page (locale will be handled by Next.js)
    // Revalidate paths
    revalidatePath(`/ar/instructor/courses/${unit.course_id}/manage`);
    revalidatePath(`/en/instructor/courses/${unit.course_id}/manage`);
    revalidatePath(`/ar/instructor/courses`);
    revalidatePath(`/en/instructor/courses`);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function reorderUnits(
  courseId: number,
  unitIds: number[]
): Promise<ActionResult<void>> {
  const supabase = await createClient();

  console.log('🔄 Reordering units:', { courseId, unitIds });

  try {
    // STEP 1: Move all units to temporary positions (1000+)
    // This avoids unique constraint conflicts
    for (let i = 0; i < unitIds.length; i++) {
      const { error } = await supabase
        .from('course_units')
        .update({ order_index: 1000 + i })
        .eq('id', unitIds[i])
        .eq('course_id', courseId);

      if (error) {
        console.error('❌ Error in temp reorder:', error);
        return { success: false, error: error.message };
      }
    }

    // STEP 2: Move from temp positions to final positions
    for (let i = 0; i < unitIds.length; i++) {
      const { error } = await supabase
        .from('course_units')
        .update({ order_index: i })
        .eq('id', unitIds[i])
        .eq('course_id', courseId);

      if (error) {
        console.error('❌ Error in final reorder:', error);
        return { success: false, error: error.message };
      }
    }

    console.log('✅ Units reordered successfully');

    // Revalidate paths
    revalidatePath(`/ar/instructor/courses/${courseId}/manage`);
    revalidatePath(`/en/instructor/courses/${courseId}/manage`);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Reorder error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// LESSON ACTIONS
// ============================================

interface CreateVideoLessonInput {
  unitId: number;
  titleAr: string;
  titleEn: string;
  contentAr?: string;
  contentEn?: string;
  videoUrl: string;
  videoDuration?: number;
  isFreePreview?: boolean;
}

export async function createVideoLesson(
  data: CreateVideoLessonInput
): Promise<ActionResult<{ lessonId: number }>> {
  const supabase = await createClient();

  try {
    // Get current max order_index
    const { data: lessons } = await supabase
      .from('lessons')
      .select('order_index')
      .eq('unit_id', data.unitId)
      .order('order_index', { ascending: false })
      .limit(1);

    const nextOrder =
      lessons && lessons.length > 0 ? lessons[0].order_index + 1 : 0;

    // Insert lesson
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .insert({
        unit_id: data.unitId,
        order_index: nextOrder,
        lesson_type: 'video',
        video_url: data.videoUrl,
        video_duration: data.videoDuration || null,
        is_free_preview: data.isFreePreview || false,
      })
      .select()
      .single();

    if (lessonError || !lesson) {
      return {
        success: false,
        error: lessonError?.message || 'Failed to create lesson',
      };
    }

    // Insert translations
    const translations = [
      {
        lesson_id: lesson.id,
        language_id: 1,
        title: data.titleAr,
        content: data.contentAr || null,
      },
      {
        lesson_id: lesson.id,
        language_id: 2,
        title: data.titleEn,
        content: data.contentEn || null,
      },
    ];

    const { error: translationError } = await supabase
      .from('lesson_translations')
      .insert(translations);

    if (translationError) {
      await supabase.from('lessons').delete().eq('id', lesson.id);
      return { success: false, error: translationError.message };
    }

    // Get course_id for revalidation
    const { data: unit } = await supabase
      .from('course_units')
      .select('course_id')
      .eq('id', data.unitId)
      .single();

    if (unit) {
      // Revalidate paths
      revalidatePath(`/ar/instructor/courses/${unit.course_id}/manage`);
      revalidatePath(`/en/instructor/courses/${unit.course_id}/manage`);
    }

    return { success: true, data: { lessonId: lesson.id } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

interface QuizQuestionInput {
  questionTextAr: string;
  questionTextEn: string;
  options: {
    optionTextAr: string;
    optionTextEn: string;
    isCorrect: boolean;
  }[];
}

interface CreateQuizLessonInput {
  unitId: number;
  titleAr: string;
  titleEn: string;
  questions: QuizQuestionInput[];
}

export async function createQuizLesson(
  data: CreateQuizLessonInput
): Promise<ActionResult<{ lessonId: number }>> {
  const supabase = await createClient();

  try {
    // Get current max order_index
    const { data: lessons } = await supabase
      .from('lessons')
      .select('order_index')
      .eq('unit_id', data.unitId)
      .order('order_index', { ascending: false })
      .limit(1);

    const nextOrder =
      lessons && lessons.length > 0 ? lessons[0].order_index + 1 : 0;

    // Insert lesson
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .insert({
        unit_id: data.unitId,
        order_index: nextOrder,
        lesson_type: 'quiz',
      })
      .select()
      .single();

    if (lessonError || !lesson) {
      return {
        success: false,
        error: lessonError?.message || 'Failed to create quiz',
      };
    }

    // Insert lesson translations
    const lessonTranslations = [
      {
        lesson_id: lesson.id,
        language_id: 1,
        title: data.titleAr,
        content: null,
      },
      {
        lesson_id: lesson.id,
        language_id: 2,
        title: data.titleEn,
        content: null,
      },
    ];

    const { error: lessonTransError } = await supabase
      .from('lesson_translations')
      .insert(lessonTranslations);

    if (lessonTransError) {
      await supabase.from('lessons').delete().eq('id', lesson.id);
      return { success: false, error: lessonTransError.message };
    }

    // Insert questions and options
    for (let qIndex = 0; qIndex < data.questions.length; qIndex++) {
      const question = data.questions[qIndex];

      // Insert question
      const { data: questionData, error: questionError } = await supabase
        .from('quiz_questions')
        .insert({
          lesson_id: lesson.id,
          order_index: qIndex,
          question_type: 'multiple_choice',
        })
        .select()
        .single();

      if (questionError || !questionData) {
        await supabase.from('lessons').delete().eq('id', lesson.id);
        return {
          success: false,
          error: questionError?.message || 'Failed to create question',
        };
      }

      // Insert question translations
      const questionTranslations = [
        {
          question_id: questionData.id,
          language_id: 1,
          question_text: question.questionTextAr,
        },
        {
          question_id: questionData.id,
          language_id: 2,
          question_text: question.questionTextEn,
        },
      ];

      const { error: questionTransError } = await supabase
        .from('quiz_question_translations')
        .insert(questionTranslations);

      if (questionTransError) {
        await supabase.from('lessons').delete().eq('id', lesson.id);
        return { success: false, error: questionTransError.message };
      }

      // Insert options
      for (let oIndex = 0; oIndex < question.options.length; oIndex++) {
        const option = question.options[oIndex];

        const { data: optionData, error: optionError } = await supabase
          .from('quiz_options')
          .insert({
            question_id: questionData.id,
            order_index: oIndex,
            is_correct: option.isCorrect,
          })
          .select()
          .single();

        if (optionError || !optionData) {
          await supabase.from('lessons').delete().eq('id', lesson.id);
          return {
            success: false,
            error: optionError?.message || 'Failed to create option',
          };
        }

        // Insert option translations
        const optionTranslations = [
          {
            option_id: optionData.id,
            language_id: 1,
            option_text: option.optionTextAr,
          },
          {
            option_id: optionData.id,
            language_id: 2,
            option_text: option.optionTextEn,
          },
        ];

        const { error: optionTransError } = await supabase
          .from('quiz_option_translations')
          .insert(optionTranslations);

        if (optionTransError) {
          await supabase.from('lessons').delete().eq('id', lesson.id);
          return { success: false, error: optionTransError.message };
        }
      }
    }

    // Get course_id for revalidation
    const { data: unit } = await supabase
      .from('course_units')
      .select('course_id')
      .eq('id', data.unitId)
      .single();

    if (unit) {
      // Revalidate paths
      revalidatePath(`/ar/instructor/courses/${unit.course_id}/manage`);
      revalidatePath(`/en/instructor/courses/${unit.course_id}/manage`);
    }

    return { success: true, data: { lessonId: lesson.id } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateVideoLesson(
  lessonId: number,
  data: CreateVideoLessonInput
): Promise<ActionResult<void>> {
  const supabase = await createClient();
  const instructorId = await getCurrentInstructorId();

  if (!instructorId) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Verify lesson exists and belongs to instructor's course
    const { data: lesson } = await supabase
      .from('lessons')
      .select(
        `
        id,
        unit_id,
        course_units!inner(
          course_id,
          courses!inner(instructor_id)
        )
      `
      )
      .eq('id', lessonId)
      .single();

    if (
      !lesson ||
      (lesson as any).course_units?.courses?.instructor_id !== instructorId
    ) {
      return { success: false, error: 'Unauthorized or lesson not found' };
    }

    // Update lesson
    const { error: lessonError } = await supabase
      .from('lessons')
      .update({
        video_url: data.videoUrl,
        video_duration: data.videoDuration || null,
        is_free_preview: data.isFreePreview || false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', lessonId);

    if (lessonError) {
      return { success: false, error: lessonError.message };
    }

    // Update translations
    const updates = [
      {
        lesson_id: lessonId,
        language_id: 1,
        title: data.titleAr,
        content: data.contentAr || null,
      },
      {
        lesson_id: lessonId,
        language_id: 2,
        title: data.titleEn,
        content: data.contentEn || null,
      },
    ];

    for (const update of updates) {
      const { error } = await supabase
        .from('lesson_translations')
        .upsert(update, { onConflict: 'lesson_id,language_id' });

      if (error) {
        return { success: false, error: error.message };
      }
    }

    // Get course_id for revalidation
    const courseId = (lesson as any).course_units?.course_id;
    if (courseId) {
      // Revalidate both locales
      revalidatePath(`/ar/instructor/courses/${courseId}/manage`);
      revalidatePath(`/en/instructor/courses/${courseId}/manage`);
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteLesson(
  lessonId: number
): Promise<ActionResult<void>> {
  const supabase = await createClient();

  try {
    // First get the unit_id and course_id before deleting
    const { data: lesson, error: fetchError } = await supabase
      .from('lessons')
      .select(
        `
        id,
        unit_id,
        course_units!inner(course_id)
      `
      )
      .eq('id', lessonId)
      .single();

    if (fetchError || !lesson) {
      return {
        success: false,
        error: fetchError?.message || 'Lesson not found',
      };
    }

    const courseId = (lesson as any).course_units?.course_id;

    // CASCADE will handle translations, questions, and options
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId);

    if (error) {
      return { success: false, error: error.message };
    }

    // Revalidate the course manage page
    if (courseId) {
      // Revalidate both locales
      revalidatePath(`/ar/instructor/courses/${courseId}/manage`);
      revalidatePath(`/en/instructor/courses/${courseId}/manage`);
    }
    revalidatePath('/instructor/courses'); // Also revalidate list page

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function reorderLessons(
  unitId: number,
  lessonIds: number[]
): Promise<ActionResult<void>> {
  const supabase = await createClient();

  try {
    // Get course_id for revalidation
    const { data: unit } = await supabase
      .from('course_units')
      .select('course_id')
      .eq('id', unitId)
      .single();

    for (let i = 0; i < lessonIds.length; i++) {
      const { error } = await supabase
        .from('lessons')
        .update({ order_index: i })
        .eq('id', lessonIds[i])
        .eq('unit_id', unitId);

      if (error) {
        return { success: false, error: error.message };
      }
    }

    if (unit) {
      // Revalidate paths
      revalidatePath(`/ar/instructor/courses/${unit.course_id}/manage`);
      revalidatePath(`/en/instructor/courses/${unit.course_id}/manage`);
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
