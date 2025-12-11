'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentInstructorId, isInstructor } from './queries';
import type { ActionResult } from './types';

// ============================================
// HELPERS (Internal)
// ============================================

/**
 * Centralized authorization check and client creation.
 */
async function verifyInstructorAccess() {
  if (!(await isInstructor())) {
    throw new Error('Unauthorized - Instructor access required');
  }
  const supabase = await createClient();
  const instructorId = await getCurrentInstructorId();

  if (!instructorId) {
    throw new Error('Unauthorized');
  }

  return { supabase, instructorId };
}

/**
 * Verifies ownership of a Course or a Unit.
 */
async function verifyOwnership(
  supabase: any,
  instructorId: string,
  type: 'course' | 'unit',
  entityId: number
) {
  if (type === 'course') {
    const { data } = await supabase
      .from('courses')
      .select('id')
      .eq('id', entityId)
      .eq('instructor_id', instructorId)
      .single();
    if (!data) throw new Error('Course not found or unauthorized');
    return { courseId: entityId };
  } else {
    // For unit, we join to check the course's instructor
    const { data } = await supabase
      .from('course_units')
      .select('course_id, courses!inner(instructor_id)')
      .eq('id', entityId)
      .single();

    if (!data || (data as any).courses?.instructor_id !== instructorId) {
      throw new Error('Unit not found or unauthorized');
    }
    return { courseId: data.course_id };
  }
}

/**
 * Centralized revalidation to ensure both locales and list pages are updated.
 */
function revalidateCoursePaths(courseId: number) {
  const locales = ['ar', 'en'];
  locales.forEach(lang => {
    revalidatePath(`/${lang}/instructor/courses/${courseId}/manage`);
    revalidatePath(`/${lang}/instructor/courses`);
  });
}

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
  try {
    const { supabase, instructorId } = await verifyInstructorAccess();
    await verifyOwnership(supabase, instructorId, 'course', data.courseId);

    // Get next order index
    const { data: units } = await supabase
      .from('course_units')
      .select('order_index')
      .eq('course_id', data.courseId)
      .order('order_index', { ascending: false })
      .limit(1);

    const nextOrder = units?.length ? units[0].order_index + 1 : 0;

    // Insert unit
    const { data: unit, error: unitError } = await supabase
      .from('course_units')
      .insert({
        course_id: data.courseId,
        order_index: nextOrder,
      })
      .select()
      .single();

    if (unitError || !unit)
      throw new Error(unitError?.message || 'Failed to create unit');

    // Insert translations
    const { error: translationError } = await supabase
      .from('course_unit_translations')
      .insert([
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
      ]);

    if (translationError) {
      await supabase.from('course_units').delete().eq('id', unit.id);
      throw new Error(translationError.message);
    }

    revalidateCoursePaths(data.courseId);
    return { success: true, data: { unitId: unit.id } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUnit(
  unitId: number,
  data: Omit<CreateUnitInput, 'courseId'>
): Promise<ActionResult<void>> {
  try {
    const { supabase, instructorId } = await verifyInstructorAccess();
    const { courseId } = await verifyOwnership(
      supabase,
      instructorId,
      'unit',
      unitId
    );

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
      if (error) throw new Error(error.message);
    }

    revalidateCoursePaths(courseId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteUnit(unitId: number): Promise<ActionResult<void>> {
  try {
    const { supabase, instructorId } = await verifyInstructorAccess();
    const { courseId } = await verifyOwnership(
      supabase,
      instructorId,
      'unit',
      unitId
    );

    const { error } = await supabase
      .from('course_units')
      .delete()
      .eq('id', unitId);
    if (error) throw new Error(error.message);

    revalidateCoursePaths(courseId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function reorderUnits(
  courseId: number,
  unitIds: number[]
): Promise<ActionResult<void>> {
  try {
    const { supabase, instructorId } = await verifyInstructorAccess();
    await verifyOwnership(supabase, instructorId, 'course', courseId);

    console.log('🔄 Reordering units:', { courseId, unitIds });

    // Two-step reorder to avoid unique constraint collisions
    // Step 1: Move to temp positions (1000+)
    for (let i = 0; i < unitIds.length; i++) {
      const { error } = await supabase
        .from('course_units')
        .update({ order_index: 1000 + i })
        .eq('id', unitIds[i])
        .eq('course_id', courseId);
      if (error) throw new Error(error.message);
    }

    // Step 2: Move to final positions
    for (let i = 0; i < unitIds.length; i++) {
      const { error } = await supabase
        .from('course_units')
        .update({ order_index: i })
        .eq('id', unitIds[i])
        .eq('course_id', courseId);
      if (error) throw new Error(error.message);
    }

    revalidateCoursePaths(courseId);
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
  try {
    const { supabase, instructorId } = await verifyInstructorAccess();
    const { courseId } = await verifyOwnership(
      supabase,
      instructorId,
      'unit',
      data.unitId
    );

    // Get max order
    const { data: lessons } = await supabase
      .from('lessons')
      .select('order_index')
      .eq('unit_id', data.unitId)
      .order('order_index', { ascending: false })
      .limit(1);

    const nextOrder = lessons?.length ? lessons[0].order_index + 1 : 0;

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

    if (lessonError || !lesson)
      throw new Error(lessonError?.message || 'Failed to create lesson');

    // Insert translations
    const { error: translationError } = await supabase
      .from('lesson_translations')
      .insert([
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
      ]);

    if (translationError) {
      await supabase.from('lessons').delete().eq('id', lesson.id);
      throw new Error(translationError.message);
    }

    revalidateCoursePaths(courseId);
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
  try {
    const { supabase, instructorId } = await verifyInstructorAccess();
    const { courseId } = await verifyOwnership(
      supabase,
      instructorId,
      'unit',
      data.unitId
    );

    // Get max order
    const { data: lessons } = await supabase
      .from('lessons')
      .select('order_index')
      .eq('unit_id', data.unitId)
      .order('order_index', { ascending: false })
      .limit(1);

    const nextOrder = lessons?.length ? lessons[0].order_index + 1 : 0;

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

    if (lessonError || !lesson)
      throw new Error(lessonError?.message || 'Failed to create quiz');

    // Insert lesson translations
    const { error: lessonTransError } = await supabase
      .from('lesson_translations')
      .insert([
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
      ]);

    if (lessonTransError) {
      await supabase.from('lessons').delete().eq('id', lesson.id);
      throw new Error(lessonTransError.message);
    }

    // Insert questions and options
    for (let qIndex = 0; qIndex < data.questions.length; qIndex++) {
      const question = data.questions[qIndex];

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
        throw new Error(questionError?.message || 'Failed to create question');
      }

      await supabase.from('quiz_question_translations').insert([
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
      ]);

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
          // Deep cleanups are hard without transactions, but removing the lesson cascades delete
          await supabase.from('lessons').delete().eq('id', lesson.id);
          throw new Error(optionError?.message || 'Failed to create option');
        }

        await supabase.from('quiz_option_translations').insert([
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
        ]);
      }
    }

    revalidateCoursePaths(courseId);
    return { success: true, data: { lessonId: lesson.id } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateVideoLesson(
  lessonId: number,
  data: CreateVideoLessonInput
): Promise<ActionResult<void>> {
  try {
    const { supabase, instructorId } = await verifyInstructorAccess();

    // Custom ownership check for lesson needing to join up to course
    const { data: lesson } = await supabase
      .from('lessons')
      .select(
        `id, unit_id, course_units!inner(course_id, courses!inner(instructor_id))`
      )
      .eq('id', lessonId)
      .single();

    if (
      !lesson ||
      (lesson as any).course_units?.courses?.instructor_id !== instructorId
    ) {
      throw new Error('Unauthorized or lesson not found');
    }

    const courseId = (lesson as any).course_units.course_id;

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

    if (lessonError) throw new Error(lessonError.message);

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
      if (error) throw new Error(error.message);
    }

    revalidateCoursePaths(courseId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteLesson(
  lessonId: number
): Promise<ActionResult<void>> {
  try {
    const { supabase, instructorId } = await verifyInstructorAccess();

    // Verify lesson ownership
    const { data: lesson } = await supabase
      .from('lessons')
      .select(
        `id, unit_id, course_units!inner(course_id, courses!inner(instructor_id))`
      )
      .eq('id', lessonId)
      .single();

    if (
      !lesson ||
      (lesson as any).course_units?.courses?.instructor_id !== instructorId
    ) {
      throw new Error('Lesson not found or unauthorized');
    }

    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId);
    if (error) throw new Error(error.message);

    revalidateCoursePaths((lesson as any).course_units.course_id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function reorderLessons(
  unitId: number,
  lessonIds: number[]
): Promise<ActionResult<void>> {
  try {
    const { supabase, instructorId } = await verifyInstructorAccess();
    const { courseId } = await verifyOwnership(
      supabase,
      instructorId,
      'unit',
      unitId
    );

    for (let i = 0; i < lessonIds.length; i++) {
      const { error } = await supabase
        .from('lessons')
        .update({ order_index: i })
        .eq('id', lessonIds[i])
        .eq('unit_id', unitId);

      if (error) throw new Error(error.message);
    }

    revalidateCoursePaths(courseId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
