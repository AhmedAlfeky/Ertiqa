import { CoursesFilter } from '@/features/public/components/CoursesFilter';
import { CourseCard } from '@/features/public/components/CourseCard';
import { PaginationWrapper } from '@/features/public/components/PaginationWrapper';
import {
  getCategories,
  getLanguages,
  getLevels,
  getPublicCourses,
} from '@/features/public/queries';
import { BookOpen, Sparkles, Zap } from 'lucide-react';
import MaxWidthWrapper from '@/app/components/MaxwidthWrapper';

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
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-slate-950  font-sans">
      {/* =========================================
          HERO SECTION (Knowledge Hub Theme)
      ========================================= */}
      <section className="relative w-full pt-28 pb-32 overflow-hidden bg-yale-blue dark:bg-slate-900 text-white rounded-b-[3rem] shadow-2xl shadow-yale-blue/20">
        {/* Background Patterns (Abstract Books/Paths) */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0 100 C 20 0 50 0 100 100 Z"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
            />
            <path
              d="M0 100 C 50 0 80 0 100 100 Z"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              className="opacity-50"
            />
          </svg>
        </div>

        {/* Floating Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-primary/20 rounded-full blur-[100px] mix-blend-screen" />

        <MaxWidthWrapper className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-blue-200 text-sm font-bold tracking-wide mb-6 backdrop-blur-md">
            <BookOpen className="w-4 h-4 text-gold-primary" />
            <span>{t('مكتبة المعرفة', 'Knowledge Library')}</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            {t('اكتشف شغفك، ', 'Discover your passion, ')}
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-yellow-200">
              {t('طور مهاراتك', 'Upgrade your skills')}
              <svg
                className="absolute w-full h-4 -bottom-2 left-0 text-white/20 -z-0"
                viewBox="0 0 200 9"
                fill="none"
              >
                <path
                  d="M2.00026 6.99997C2.00026 6.99997 101.5 0.499972 198 2.49997"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed mb-8">
            {t(
              'تصفح مئات الدورات التدريبية في مجالات متنوعة، وابدأ رحلة تعلم لا تتوقف.',
              'Browse hundreds of courses in various fields, and start a never-ending learning journey.'
            )}
          </p>
        </MaxWidthWrapper>
      </section>

      {/* =========================================
          FILTER & CONTENT
      ========================================= */}
      <MaxWidthWrapper className="relative z-20 -mt-16">
        {/* Filter Bar */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <CoursesFilter
            categories={categories}
            levels={levels}
            languages={languages}
            locale={locale}
          />
        </div>

        {/* Course Grid */}
        <div className="mt-8">
          {courses.items.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {courses.items.map((course, i) => (
                <div
                  key={course.id}
                  className="animate-in fade-in zoom-in duration-500 fill-mode-backwards"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <CourseCard course={course} locale={locale} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[2rem] border border-dashed border-slate-300 dark:border-slate-800">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {t('لا يوجد نتائج', 'No courses found')}
              </h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                {t(
                  'جرب تغيير خيارات البحث أو الفلتر.',
                  'Try changing your search terms or filters to find what you are looking for.'
                )}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-16">
          <PaginationWrapper
            page={courses.page}
            totalPages={courses.totalPages}
          />
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

function stringParam(value?: string | string[]) {
  if (Array.isArray(value)) return value[0];
  return value;
}
