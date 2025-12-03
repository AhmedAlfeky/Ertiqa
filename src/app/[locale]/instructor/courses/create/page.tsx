import { getTranslations } from 'next-intl/server';
import { CourseForm } from '@/app/components/instructor/CourseForm';
import { getLookupData } from '@/features/instructor/queries';

export default async function CreateCoursePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('instructor');

  const { levels, languages, categories } = await getLookupData(locale);

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">{t('createCourse')}</h1>
        <p className="text-muted-foreground text-lg">
          {t('createCourseDescription')}
        </p>
      </div>

      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <CourseForm
          locale={locale}
          levels={levels}
          languages={languages}
          categories={categories}
        />
      </div>
    </div>
  );
}
