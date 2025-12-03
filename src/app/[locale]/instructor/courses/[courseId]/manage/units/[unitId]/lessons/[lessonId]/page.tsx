import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  getCourseById,
  getCurrentInstructorId,
} from '@/features/instructor/queries';
import {
  getLessonById,
  getUnitById,
} from '@/features/instructor/curriculum-queries';
import { VideoLessonForm } from '@/app/components/instructor/VideoLessonForm';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function LessonManagePage({
  params,
}: {
  params: Promise<{
    courseId: string;
    unitId: string;
    lessonId: string;
    locale: string;
  }>;
}) {
  const { courseId, unitId, lessonId, locale } = await params;
  const t = await getTranslations('instructor');
  const instructorId = await getCurrentInstructorId();

  if (!instructorId) {
    redirect(`/${locale}/login`);
  }

  const courseIdNum = parseInt(courseId);
  const unitIdNum = parseInt(unitId);
  const lessonIdNum = parseInt(lessonId);

  const course = await getCourseById(courseIdNum);

  if (!course || course.instructor_id !== instructorId) {
    redirect(`/${locale}/instructor/courses`);
  }

  // Verify unit belongs to course
  const unit = await getUnitById(unitIdNum);
  if (!unit || (unit as any).course_id !== courseIdNum) {
    notFound();
  }

  // Get lesson
  const lesson = await getLessonById(lessonIdNum);
  if (!lesson) {
    notFound();
  }

  // Verify lesson belongs to unit
  if (lesson.unit_id !== unitIdNum) {
    notFound();
  }

  // If it's a quiz, redirect to quiz management page
  if (lesson.lesson_type === 'quiz') {
    redirect(
      `/${locale}/instructor/courses/${courseId}/manage/quiz/${lessonId}`
    );
  }
  console.log('lesson', lesson);
  return (
    <div className=" space-y-6">
      <div className="space-y-2">
        <Link
          href={`/${locale}/instructor/courses/${courseId}/manage`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          {t('backToCurriculum') || 'Back to Curriculum'}
        </Link>
        <h1 className="text-3xl font-bold">
          {t('editLesson') || 'Edit Video Lesson'}
        </h1>
        <p className="text-muted-foreground">
          {t('editLessonDescription') || 'Update lesson information'} - Unit:{' '}
          <span className="font-semibold text-foreground">{unit.title_en}</span>
        </p>
      </div>

      <VideoLessonForm
        unitId={unitIdNum}
        lesson={lesson}
        isFullPage={false}
        courseId={courseIdNum}
        locale={locale}
      />
    </div>
  );
}
