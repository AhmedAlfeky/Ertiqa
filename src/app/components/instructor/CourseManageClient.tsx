'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseForm } from './CourseForm';
import { CurriculumTab } from './CurriculumTab';
import type {
  CourseWithDetails,
  Level,
  Language,
  Category,
} from '@/features/instructor/types';

interface CourseManageClientProps {
  course: CourseWithDetails;
  locale: string;
  initialUnits: any[];
  levels: Level[];
  languages: Language[];
  categories: Category[];
}

export function CourseManageClient({
  course,
  locale,
  initialUnits,
  levels,
  languages,
  categories,
}: CourseManageClientProps) {
  const t = useTranslations('instructor');
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get('tab') || 'details';

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href={`/${locale}/instructor/courses`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          {t('backToCourses')}
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-muted-foreground">
              {t('manageCourseDescription')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                course.is_published
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {course.is_published ? t('published') : t('draft')}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-flex">
          <TabsTrigger value="details" className="flex items-center gap-2">
            {t('basicInfo')}
          </TabsTrigger>
          <TabsTrigger value="curriculum" className="flex items-center gap-2">
            {t('curriculum')}
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Course Details */}
        <TabsContent value="details" className="mt-6">
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <CourseForm
              course={course}
              locale={locale}
              submitLabel={t('saveChanges')}
              showCancel={false}
              levels={levels}
              languages={languages}
              categories={categories}
            />
          </div>
        </TabsContent>

        {/* Tab 2: Curriculum */}
        <TabsContent value="curriculum" className="mt-6">
          <CurriculumTab courseId={course.id} initialUnits={initialUnits} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
