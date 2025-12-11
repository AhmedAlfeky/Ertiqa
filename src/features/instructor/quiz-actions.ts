'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentInstructorId, isInstructor } from './queries';
import type { ActionResult } from './types';

// ============================================
// HELPERS (Internal)
// ============================================

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
 * Verifies ownership for Quiz operations.
 * Can look up ownership starting from a Quiz (Lesson) ID or a Question ID.
 */
async function verifyQuizContext(
  supabase: any,
  instructorId: string,
  type: 'quiz' | 'question',
  entityId: number
) {
  if (type === 'quiz') {
    // EntityId is lesson_id
    const { data: lesson } = await supabase
      .from('lessons')
      .select(
        'id, unit_id, course_units!inner(course_id, courses!inner(instructor_id))'
      )
      .eq('id', entityId)
      .single();

    if (
      !lesson ||
      (lesson as any).course_units?.courses?.instructor_id !== instructorId
    ) {
      throw new Error('Quiz not found or unauthorized');
    }
    return {
      quizId: entityId,
      courseId: (lesson as any).course_units.course_id,
    };
  } else {
    // EntityId is question_id
    const { data: question } = await supabase
      .from('quiz_questions')
      .select(
        `
        id, 
        lesson_id, 
        lessons!inner(
          id, 
          unit_id, 
          course_units!inner(course_id, courses!inner(instructor_id))
        )
      `
      )
      .eq('id', entityId)
      .single();

    if (
      !question ||
      (question as any).lessons?.course_units?.courses?.instructor_id !==
        instructorId
    ) {
      throw new Error('Question not found or unauthorized');
    }
    return {
      quizId: question.lesson_id,
      courseId: (question as any).lessons.course_units.course_id,
    };
  }
}

/**
 * Centralized revalidation for Quiz specific paths
 */
function revalidateQuizPaths(courseId: number, quizId: number) {
  const locales = ['ar', 'en'];
  locales.forEach(lang => {
    revalidatePath(
      `/${lang}/instructor/courses/${courseId}/manage/quiz/${quizId}`
    );
    revalidatePath(`/${lang}/instructor/courses/${courseId}/manage`);
    revalidatePath(`/${lang}/instructor/courses`);
  });
}

// ============================================
// QUESTION CRUD ACTIONS
// ============================================

interface CreateQuestionInput {
  question_text_ar: string;
  question_text_en: string;
  options: Array<{
    option_text_ar: string;
    option_text_en: string;
    is_correct: boolean;
  }>;
}

export async function createQuizQuestion(
  quizId: number,
  data: CreateQuestionInput
): Promise<ActionResult<{ questionId: number }>> {
  try {
    const { supabase, instructorId } = await verifyInstructorAccess();
    const { courseId } = await verifyQuizContext(
      supabase,
      instructorId,
      'quiz',
      quizId
    );

    // Get current max order_index
    const { data: questions } = await supabase
      .from('quiz_questions')
      .select('order_index')
      .eq('lesson_id', quizId)
      .order('order_index', { ascending: false })
      .limit(1);

    const nextOrder = questions?.length ? questions[0].order_index + 1 : 0;

    // Insert question
    const { data: question, error: questionError } = await supabase
      .from('quiz_questions')
      .insert({
        lesson_id: quizId,
        order_index: nextOrder,
        question_type: 'multiple_choice',
      })
      .select()
      .single();

    if (questionError || !question)
      throw new Error(questionError?.message || 'Failed to create question');

    // Insert question translations
    const { error: questionTransError } = await supabase
      .from('quiz_question_translations')
      .insert([
        {
          question_id: question.id,
          language_id: 1,
          question_text: data.question_text_ar,
        },
        {
          question_id: question.id,
          language_id: 2,
          question_text: data.question_text_en,
        },
      ]);

    if (questionTransError) {
      await supabase.from('quiz_questions').delete().eq('id', question.id);
      throw new Error(questionTransError.message);
    }

    // Insert options
    for (let i = 0; i < data.options.length; i++) {
      const option = data.options[i];

      const { data: optionData, error: optionError } = await supabase
        .from('quiz_options')
        .insert({
          question_id: question.id,
          order_index: i,
          is_correct: option.is_correct,
        })
        .select()
        .single();

      if (optionError || !optionData) {
        // Cleanup on failure
        await supabase.from('quiz_questions').delete().eq('id', question.id);
        throw new Error(optionError?.message || 'Failed to create option');
      }

      const { error: optionTransError } = await supabase
        .from('quiz_option_translations')
        .insert([
          {
            option_id: optionData.id,
            language_id: 1,
            option_text: option.option_text_ar,
          },
          {
            option_id: optionData.id,
            language_id: 2,
            option_text: option.option_text_en,
          },
        ]);

      if (optionTransError) {
        await supabase.from('quiz_questions').delete().eq('id', question.id);
        throw new Error(optionTransError.message);
      }
    }

    revalidateQuizPaths(courseId, quizId);
    return { success: true, data: { questionId: question.id } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateQuizQuestion(
  questionId: number,
  data: CreateQuestionInput
): Promise<ActionResult<void>> {
  try {
    const { supabase, instructorId } = await verifyInstructorAccess();
    const { courseId, quizId } = await verifyQuizContext(
      supabase,
      instructorId,
      'question',
      questionId
    );

    // Update question translations (Upsert)
    const translations = [
      {
        question_id: questionId,
        language_id: 1,
        question_text: data.question_text_ar,
      },
      {
        question_id: questionId,
        language_id: 2,
        question_text: data.question_text_en,
      },
    ];

    for (const trans of translations) {
      const { error } = await supabase
        .from('quiz_question_translations')
        .upsert(trans, { onConflict: 'question_id,language_id' });
      if (error) throw new Error(error.message);
    }

    // Replace Options
    // 1. Delete existing
    await supabase.from('quiz_options').delete().eq('question_id', questionId);

    // 2. Insert new
    for (let i = 0; i < data.options.length; i++) {
      const option = data.options[i];

      const { data: optionData, error: optionError } = await supabase
        .from('quiz_options')
        .insert({
          question_id: questionId,
          order_index: i,
          is_correct: option.is_correct,
        })
        .select()
        .single();

      if (optionError || !optionData)
        throw new Error(optionError?.message || 'Failed to update option');

      const { error: optionTransError } = await supabase
        .from('quiz_option_translations')
        .insert([
          {
            option_id: optionData.id,
            language_id: 1,
            option_text: option.option_text_ar,
          },
          {
            option_id: optionData.id,
            language_id: 2,
            option_text: option.option_text_en,
          },
        ]);

      if (optionTransError) throw new Error(optionTransError.message);
    }

    revalidateQuizPaths(courseId, quizId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateQuizPassingScore(
  lessonId: number,
  passingScore: number
): Promise<ActionResult<void>> {
  try {
    const { supabase, instructorId } = await verifyInstructorAccess();
    const { courseId } = await verifyQuizContext(
      supabase,
      instructorId,
      'quiz',
      lessonId
    );

    if (passingScore < 0 || passingScore > 100) {
      throw new Error('Passing score must be between 0 and 100');
    }

    const { error } = await supabase
      .from('lessons')
      .update({ passing_score: passingScore })
      .eq('id', lessonId)
      .eq('lesson_type', 'quiz');

    if (error) throw new Error(error.message);

    revalidateQuizPaths(courseId, lessonId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteQuizQuestion(
  questionId: number
): Promise<ActionResult<void>> {
  try {
    const { supabase, instructorId } = await verifyInstructorAccess();
    const { courseId, quizId } = await verifyQuizContext(
      supabase,
      instructorId,
      'question',
      questionId
    );

    const { error } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('id', questionId);

    if (error) throw new Error(error.message);

    revalidateQuizPaths(courseId, quizId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
