'use server';

import { createClient } from '@/lib/supabase/server';

// Get course units with translations
export async function getCourseUnits(courseId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('course_units')
    .select(
      `
      *,
      course_unit_translations (
        language_id,
        title,
        description
      ),
      lessons (
        *,
        lesson_translations (
          language_id,
          title,
          content
        )
      )
    `
    )
    .eq('course_id', courseId)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching units:', error);
    return [];
  }

  // Map to a cleaner structure
  return (data || []).map((unit: any) => {
    const arTrans = unit.course_unit_translations?.find(
      (t: any) => t.language_id === 1
    );
    const enTrans = unit.course_unit_translations?.find(
      (t: any) => t.language_id === 2
    );

    return {
      ...unit,
      title_ar: arTrans?.title || '',
      title_en: enTrans?.title || '',
      description_ar: arTrans?.description || null,
      description_en: enTrans?.description || null,
      lessons: (unit.lessons || []).map((lesson: any) => {
        const lessonArTrans = lesson.lesson_translations?.find(
          (t: any) => t.language_id === 1
        );
        const lessonEnTrans = lesson.lesson_translations?.find(
          (t: any) => t.language_id === 2
        );

        return {
          ...lesson,
          lesson_type: lesson.lesson_type === 'quiz' ? 'quiz' : 'video', // Map DB string to UI string
          title_ar: lessonArTrans?.title || '',
          title_en: lessonEnTrans?.title || '',
          content_ar: lessonArTrans?.content || null,
          content_en: lessonEnTrans?.content || null,
        };
      }),
    };
  });
}

// Get unit by ID with lessons
export async function getUnitById(unitId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('course_units')
    .select(
      `
      *,
      course_unit_translations (
        language_id,
        title,
        description
      ),
      lessons (
        *,
        lesson_translations (
          language_id,
          title,
          content
        )
      )
    `
    )
    .eq('id', unitId)
    .single();

  if (error || !data) {
    console.error('Error fetching unit:', error);
    return null;
  }

  // Map translations
  const unitData = data as any;
  const arTrans = unitData.course_unit_translations?.find(
    (t: any) => t.language_id === 1
  );
  const enTrans = unitData.course_unit_translations?.find(
    (t: any) => t.language_id === 2
  );

  return {
    ...unitData,
    title_ar: arTrans?.title || '',
    title_en: enTrans?.title || '',
    description_ar: arTrans?.description || null,
    description_en: enTrans?.description || null,
    lessons: (unitData.lessons || [])
      .map((lesson: any) => {
        const lessonArTrans = lesson.lesson_translations?.find(
          (t: any) => t.language_id === 1
        );
        const lessonEnTrans = lesson.lesson_translations?.find(
          (t: any) => t.language_id === 2
        );

        return {
          ...lesson,
          lesson_type: lesson.lesson_type === 'quiz' ? 'quiz' : 'video',
          title_ar: lessonArTrans?.title || '',
          title_en: lessonEnTrans?.title || '',
          content_ar: lessonArTrans?.content || null,
          content_en: lessonEnTrans?.content || null,
        };
      })
      .sort((a: any, b: any) => a.order_index - b.order_index),
  };
}

// Get lesson by ID
export async function getLessonById(lessonId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('lessons')
    .select(
      `
      *,
      lesson_translations (
        language_id,
        title,
        content
      )
    `
    )
    .eq('id', lessonId)
    .single();

  if (error || !data) {
    console.error('Error fetching lesson:', error);
    return null;
  }

  // Map translations
  const lessonData = data as any;
  const arTrans = lessonData.lesson_translations?.find(
    (t: any) => t.language_id === 1
  );
  const enTrans = lessonData.lesson_translations?.find(
    (t: any) => t.language_id === 2
  );

  return {
    ...lessonData,
    title_ar: arTrans?.title || '',
    title_en: enTrans?.title || '',
    content_ar: arTrans?.content || null,
    content_en: enTrans?.content || null,
  };
}

// Get quiz with questions
export async function getQuizWithQuestions(lessonId: number) {
  const supabase = await createClient();

  // First get the lesson to verify it exists
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('id, lesson_type')
    .eq('id', lessonId)
    .single();

  if (lessonError || !lesson) {
    console.error('Error fetching lesson:', lessonError);
    return null;
  }

  // Verify it's a quiz lesson
  const lessonData = lesson as any;
  if (lessonData.lesson_type !== 'quiz') {
    console.error('Lesson is not a quiz:', lessonData.lesson_type);
    return null;
  }

  // Now fetch the full quiz data with questions
  const { data, error } = await supabase
    .from('lessons')
    .select(
      `
      *,
      passing_score,
      lesson_translations (
        language_id,
        title,
        content
      ),
      quiz_questions (
        *,
        quiz_question_translations (
          language_id,
          question_text
        ),
        quiz_options (
          *,
          quiz_option_translations (
            language_id,
            option_text
          )
        )
      )
    `
    )
    .eq('id', lessonId)
    .single();

  if (error || !data) {
    console.error('Error fetching quiz data:', error);
    return null;
  }

  // Map translations
  const quizData = data as any;
  const arTrans = quizData.lesson_translations?.find(
    (t: any) => t.language_id === 1
  );
  const enTrans = quizData.lesson_translations?.find(
    (t: any) => t.language_id === 2
  );

  return {
    ...quizData,
    lesson_type: 'quiz', // Ensure UI gets the expected string
    passing_score: quizData.passing_score || 70.0, // Default to 70% if not set
    title_ar: arTrans?.title || '',
    title_en: enTrans?.title || '',
    questions: (quizData.quiz_questions || [])
      .map((q: any) => {
        const qArTrans = q.quiz_question_translations?.find(
          (t: any) => t.language_id === 1
        );
        const qEnTrans = q.quiz_question_translations?.find(
          (t: any) => t.language_id === 2
        );

        return {
          ...q,
          question_text_ar: qArTrans?.question_text || '',
          question_text_en: qEnTrans?.question_text || '',
          options: (q.quiz_options || [])
            .map((o: any) => {
              const oArTrans = o.quiz_option_translations?.find(
                (t: any) => t.language_id === 1
              );
              const oEnTrans = o.quiz_option_translations?.find(
                (t: any) => t.language_id === 2
              );

              return {
                ...o,
                option_text_ar: oArTrans?.option_text || '',
                option_text_en: oEnTrans?.option_text || '',
              };
            })
            .sort((a: any, b: any) => a.order_index - b.order_index),
        };
      })
      .sort((a: any, b: any) => a.order_index - b.order_index),
  };
}
