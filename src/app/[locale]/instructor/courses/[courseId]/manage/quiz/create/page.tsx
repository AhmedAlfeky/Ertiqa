import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  getCourseById,
  getCurrentInstructorId,
} from '@/features/instructor/queries';
import { getCourseUnits } from '@/features/instructor/curriculum-queries';
import { QuizCreateForm } from '@/app/components/instructor/QuizCreateForm';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function CreateQuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string; locale: string }>;
  searchParams: Promise<{ unitId?: string }>;
}) {
  const { courseId, locale } = await params;
  const { unitId } = await searchParams;
  const t = await getTranslations('instructor');

  const instructorId = await getCurrentInstructorId();

  if (!instructorId) {
    redirect(`/${locale}/login`);
  }

  const courseIdNum = parseInt(courseId);
  const course = await getCourseById(courseIdNum);

  if (!course || course.instructor_id !== instructorId) {
    redirect(`/${locale}/instructor/courses`);
  }

  const units = await getCourseUnits(courseIdNum);

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="space-y-2">
        <Link
          href={`/${locale}/instructor/courses/${courseId}/manage`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          {t('back') || 'Back'}
        </Link>
        <h1 className="text-3xl font-bold">{t('createQuiz')}</h1>
        <p className="text-muted-foreground">
          {t('createQuizDescription') || 'Create a new quiz for your course'}
        </p>
      </div>

      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <QuizCreateForm
          courseId={courseIdNum}
          unitId={unitId ? parseInt(unitId) : undefined}
          units={units}
          locale={locale}
        />
      </div>
    </div>
  );
}
