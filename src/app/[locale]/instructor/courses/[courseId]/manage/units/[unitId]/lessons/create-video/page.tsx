import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  getCourseById,
  getCurrentInstructorId,
} from '@/features/instructor/queries';
import { getCourseUnits } from '@/features/instructor/curriculum-queries';
import { VideoLessonForm } from '@/app/components/instructor/VideoLessonForm';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function CreateVideoLessonPage({
  params,
}: {
  params: Promise<{ courseId: string; unitId: string; locale: string }>;
}) {
  const { courseId, unitId, locale } = await params;
  const t = await getTranslations('instructor');
  const instructorId = await getCurrentInstructorId();

  if (!instructorId) {
    redirect(`/${locale}/login`);
  }

  const courseIdNum = parseInt(courseId);
  const unitIdNum = parseInt(unitId);

  const course = await getCourseById(courseIdNum);

  if (!course || course.instructor_id !== instructorId) {
    redirect(`/${locale}/instructor/courses`);
  }

  const units = await getCourseUnits(courseIdNum);
  const unit = units.find(u => u.id === unitIdNum);

  if (!unit) {
    notFound();
  }

  return (
    <div className=" py-8 space-y-6">
      <div className="space-y-2">
        <Link
          href={`/${locale}/instructor/courses/${courseId}/manage`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          {t('back') || 'Back'}
        </Link>
        <h1 className="text-3xl font-bold">{t('createLesson')}</h1>
        <p className="text-muted-foreground">
          {t('addLessonDescription') || 'Add a new video lesson'} -{' '}
          <span className="font-semibold text-foreground">{unit.title_en}</span>
        </p>
      </div>

      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <VideoLessonForm
          unitId={unitIdNum}
          isFullPage={true}
          courseId={courseIdNum}
          locale={locale}
        />
      </div>
    </div>
  );
}
