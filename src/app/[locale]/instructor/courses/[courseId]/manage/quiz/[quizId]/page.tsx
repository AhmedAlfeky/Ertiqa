import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  getCourseById,
  getCurrentInstructorId,
} from '@/features/instructor/queries';
import { getQuizWithQuestions } from '@/features/instructor/curriculum-queries';
import { QuizManageClient } from '@/app/components/instructor/QuizManageClient';
import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function ManageQuizPage({
  params,
}: {
  params: Promise<{ courseId: string; quizId: string; locale: string }>;
}) {
  const { courseId, quizId, locale } = await params;
  const t = await getTranslations('instructor');
  const instructorId = await getCurrentInstructorId();

  if (!instructorId) {
    redirect(`/${locale}/login`);
  }

  const courseIdNum = parseInt(courseId);
  const quizIdNum = parseInt(quizId);

  const course = await getCourseById(courseIdNum);

  if (!course || course.instructor_id !== instructorId) {
    redirect(`/${locale}/instructor/courses`);
  }

  // Verify lesson exists and belongs to course
  const supabase = await createClient();

  // First check if lesson exists (without .single() to get better error info)
  const { data: lessonData, error: lessonError } = await supabase
    .from('lessons')
    .select('id, lesson_type, unit_id')
    .eq('id', quizIdNum);

  if (lessonError) {
    console.error('❌ Error querying lesson:', lessonError);
    notFound();
  }

  if (!lessonData || lessonData.length === 0) {
    console.error(`❌ Lesson with ID ${quizIdNum} not found in database`);

    // Debug: List all lessons for this course to help identify the issue
    const { data: allLessons } = await supabase
      .from('lessons')
      .select(
        `
        id,
        lesson_type,
        unit_id,
        course_units!inner(course_id)
      `
      )
      .eq('course_units.course_id', courseIdNum);

    console.log(`📋 Available lessons for course ${courseIdNum}:`, allLessons);

    // Redirect to course manage page - the lesson doesn't exist
    // User can see available lessons there
    redirect(`/${locale}/instructor/courses/${courseIdNum}/manage`);
  }

  // Type assertion for lesson data
  const lesson = lessonData[0] as {
    id: number;
    lesson_type: string;
    unit_id: number;
  };

  // Verify lesson is a quiz
  if (lesson.lesson_type !== 'quiz') {
    redirect(`/${locale}/instructor/courses/${courseIdNum}/manage`);
  }

  // Verify the unit belongs to this course
  const { data: unitData, error: unitError } = await supabase
    .from('course_units')
    .select('course_id')
    .eq('id', lesson.unit_id)
    .single();

  if (unitError || !unitData) {
    console.error('❌ Unit not found:', unitError);
    notFound();
  }

  const unit = unitData as { course_id: number };

  if (unit.course_id !== courseIdNum) {
    console.error('❌ Unit does not belong to course');
    notFound();
  }

  // Fetch quiz with its questions
  const quiz = await getQuizWithQuestions(quizIdNum);

  if (!quiz) {
    console.error('❌ Quiz data not found for lesson:', quizIdNum);
    notFound();
  }

  return (
    <div className="py-8">
      <QuizManageClient courseId={courseIdNum} quiz={quiz} locale={locale} />
    </div>
  );
}
