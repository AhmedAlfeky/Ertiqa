'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { ActionResult } from './types';

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
  const supabase = await createClient();

  try {
    // Get current max order_index
    const { data: questions } = await supabase
      .from('quiz_questions')
      .select('order_index')
      .eq('lesson_id', quizId)
      .order('order_index', { ascending: false })
      .limit(1);

    const nextOrder = questions && questions.length > 0 ? questions[0].order_index + 1 : 0;

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

    if (questionError || !question) {
      return { success: false, error: questionError?.message || 'Failed to create question' };
    }

    // Insert question translations
    const questionTranslations = [
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
    ];

    const { error: questionTransError } = await supabase
      .from('quiz_question_translations')
      .insert(questionTranslations);

    if (questionTransError) {
      await supabase.from('quiz_questions').delete().eq('id', question.id);
      return { success: false, error: questionTransError.message };
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
        await supabase.from('quiz_questions').delete().eq('id', question.id);
        return { success: false, error: optionError?.message || 'Failed to create option' };
      }

      // Insert option translations
      const optionTranslations = [
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
      ];

      const { error: optionTransError } = await supabase
        .from('quiz_option_translations')
        .insert(optionTranslations);

      if (optionTransError) {
        await supabase.from('quiz_questions').delete().eq('id', question.id);
        return { success: false, error: optionTransError.message };
      }
    }

    // Get course_id and lesson_id for revalidation
    const { data: lesson } = await supabase
      .from('lessons')
      .select(`
        id,
        unit_id,
        course_units!inner(course_id)
      `)
      .eq('id', quizId)
      .single();

    if (lesson) {
      const courseId = (lesson as any).course_units?.course_id;
      if (courseId) {
        revalidatePath(`/instructor/courses/${courseId}/manage/quiz/${quizId}`);
        revalidatePath(`/instructor/courses/${courseId}/manage`);
      }
    }
    revalidatePath(`/instructor/courses`);

    return { success: true, data: { questionId: question.id } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateQuizQuestion(
  questionId: number,
  data: CreateQuestionInput
): Promise<ActionResult<void>> {
  const supabase = await createClient();

  try {
    // Update question translations
    const questionTranslations = [
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

    for (const trans of questionTranslations) {
      const { error } = await supabase
        .from('quiz_question_translations')
        .upsert(trans, { onConflict: 'question_id,language_id' });

      if (error) {
        return { success: false, error: error.message };
      }
    }

    // Delete existing options
    await supabase.from('quiz_options').delete().eq('question_id', questionId);

    // Insert new options
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

      if (optionError || !optionData) {
        return { success: false, error: optionError?.message || 'Failed to update option' };
      }

      const optionTranslations = [
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
      ];

      const { error: optionTransError } = await supabase
        .from('quiz_option_translations')
        .insert(optionTranslations);

      if (optionTransError) {
        return { success: false, error: optionTransError.message };
      }
    }

    // Get course_id and lesson_id for revalidation
    const { data: question } = await supabase
      .from('quiz_questions')
      .select('lesson_id')
      .eq('id', questionId)
      .single();

    if (question) {
      const { data: lesson } = await supabase
        .from('lessons')
        .select(`
          id,
          unit_id,
          course_units!inner(course_id)
        `)
        .eq('id', (question as any).lesson_id)
        .single();

      if (lesson) {
        const courseId = (lesson as any).course_units?.course_id;
        const lessonId = (lesson as any).id;
        if (courseId && lessonId) {
          revalidatePath(`/instructor/courses/${courseId}/manage/quiz/${lessonId}`);
          revalidatePath(`/instructor/courses/${courseId}/manage`);
        }
      }
    }
    revalidatePath(`/instructor/courses`);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateQuizPassingScore(
  lessonId: number,
  passingScore: number
): Promise<ActionResult<void>> {
  const supabase = await createClient();

  try {
    // Validate passing score (0-100)
    if (passingScore < 0 || passingScore > 100) {
      return { success: false, error: 'Passing score must be between 0 and 100' };
    }

    // Get course_id for revalidation
    const { data: lesson } = await supabase
      .from('lessons')
      .select(`
        id,
        unit_id,
        course_units!inner(course_id)
      `)
      .eq('id', lessonId)
      .single();

    const { error } = await supabase
      .from('lessons')
      .update({ passing_score: passingScore })
      .eq('id', lessonId)
      .eq('lesson_type', 'quiz');

    if (error) {
      return { success: false, error: error.message };
    }

    // Revalidate pages
    if (lesson) {
      const courseId = (lesson as any).course_units?.course_id;
      if (courseId) {
        revalidatePath(`/instructor/courses/${courseId}/manage/quiz/${lessonId}`);
        revalidatePath(`/instructor/courses/${courseId}/manage`);
      }
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteQuizQuestion(questionId: number): Promise<ActionResult<void>> {
  const supabase = await createClient();

  try {
    // Get lesson_id and course_id before deleting
    const { data: question, error: fetchError } = await supabase
      .from('quiz_questions')
      .select(`
        id,
        lesson_id,
        lessons!inner(
          id,
          unit_id,
          course_units!inner(course_id)
        )
      `)
      .eq('id', questionId)
      .single();

    if (fetchError || !question) {
      return { success: false, error: fetchError?.message || 'Question not found' };
    }

    const lessonId = (question as any).lesson_id;
    const courseId = (question as any).lessons?.course_units?.course_id;

    const { error } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('id', questionId);

    if (error) {
      return { success: false, error: error.message };
    }

    // Revalidate quiz page and course manage page
    if (courseId && lessonId) {
      revalidatePath(`/instructor/courses/${courseId}/manage/quiz/${lessonId}`);
      revalidatePath(`/instructor/courses/${courseId}/manage`);
    }
    revalidatePath(`/instructor/courses`);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
