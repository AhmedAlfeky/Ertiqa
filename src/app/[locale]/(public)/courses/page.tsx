import { CoursesFilter } from '@/features/public/components/CoursesFilter';
import { CourseCard } from '@/features/public/components/CourseCard';
import { PaginationWrapper } from '@/features/public/components/PaginationWrapper';
import { SectionHeader } from '@/features/public/components/SectionHeader';
import {
  getCategories,
  getLanguages,
  getLevels,
  getPublicCourses,
} from '@/features/public/queries';

export const revalidate = 0;

export default async function CoursesPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const locale = params.locale;
  const page = Number(searchParams.page) || 1;
  const pageSize = 12;

  const [categories, levels, languages, courses] = await Promise.all([
    getCategories(locale),
    getLevels(),
    getLanguages(),
    getPublicCourses({
      page,
      pageSize,
      category: stringParam(searchParams.category),
      level: stringParam(searchParams.level),
      language: stringParam(searchParams.language),
      isFree: stringParam(searchParams.isFree),
      search: stringParam(searchParams.search),
      locale,
    }),
  ]);

  const t = (ar: string, en: string) => (locale === 'ar' ? ar : en);

  return (
    <div className="container mx-auto px-6 py-10 space-y-8">
      <SectionHeader
        title={t('كل الدورات', 'All Courses')}
        subtitle={t('ابحث وفلتر الدورات حسب الفئة والمستوى واللغة.', 'Search and filter by category, level, and language.')}
        align="left"
      />

      <CoursesFilter categories={categories} levels={levels} languages={languages} locale={locale} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.items.map((course) => (
          <CourseCard key={course.id} course={course} locale={locale} />
        ))}
      </div>

      <PaginationWrapper page={courses.page} totalPages={courses.totalPages} />
    </div>
  );
}

function stringParam(value?: string | string[]) {
  if (Array.isArray(value)) return value[0];
  return value;
}

