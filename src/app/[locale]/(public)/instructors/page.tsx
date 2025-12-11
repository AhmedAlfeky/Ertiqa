import { Suspense } from 'react';
import { InstructorCard } from '@/features/public/components/InstructorCard';
import { InstructorsFilter } from '@/features/public/components/InstructorsFilter';
import { PaginationWrapper } from '@/features/public/components/PaginationWrapper';
import {
  getPublicInstructors,
  getInstructorSpecializations,
} from '@/features/public/queries';
import { Sparkles, Users } from 'lucide-react';
import MaxWidthWrapper from '@/app/components/MaxwidthWrapper';

export const revalidate = 0;

export default async function InstructorsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const locale = params.locale;
  const page = Number(searchParams.page) || 1;
  const pageSize = 12;

  const [instructors, specializations] = await Promise.all([
    getPublicInstructors({
      page,
      pageSize,
      search: stringParam(searchParams.search),
      specialization: stringParam(searchParams.specialization),
    }),
    getInstructorSpecializations(),
  ]);

  const t = (ar: string, en: string) => (locale === 'ar' ? ar : en);

  return (
    <div className="min-h-screen pt-12 bg-snow dark:bg-slate-950 ">
      {/* =======================
          HERO SECTION
      ======================== */}
      <section className="relative overflow-hidden pt-12  pb-4 lg:pt-20 ">
        {/* Abstract Background Doodles */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gold-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-yale-blue/5 rounded-full blur-[80px]" />
          {/* Pattern Dots */}
          <div
            className="absolute top-20 left-10 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(var(--color-gold-primary) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
              width: '200px',
              height: '200px',
            }}
          />
        </div>

        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-primary/15 dark:bg-gold-primary/10 text-gold-primary dark:text-gold-light text-sm font-bold tracking-wide mb-6 animate-in fade-in zoom-in duration-500 border border-gold-primary/30">
            <Users className="w-4 h-4" />
            <span>{t('نخبة المدربين', 'Expert Instructors')}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-yale-blue dark:text-white mb-6 leading-tight max-w-4xl mx-auto">
            {t('تعلم من ', 'Learn from ')}
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-yale-blue to-yale-blue-light dark:from-gold-primary dark:to-gold-light">
              {t('أفضل الخبراء', 'the Best Experts')}
              <svg
                className="absolute w-full h-3 bottom-1 left-0 text-gold-primary/40 -z-10"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                />
              </svg>
            </span>
            {t(' في مجالك', ' in your field')}
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            {t(
              'اكتشف مجموعة من المدربين المحترفين في مختلف التخصصات، وابدأ رحلة التعلم الخاصة بك مع توجيه مباشر.',
              'Discover a group of professional instructors in various disciplines, and start your learning journey with direct guidance.'
            )}
          </p>
        </div>
      </section>

      {/* =======================
          FILTER & CONTENT
      ======================== */}
      <MaxWidthWrapper>
        {/* Floating Filter Bar */}
        <InstructorsFilter locale={locale} specializations={specializations} />

        {/* Grid Content */}
        {instructors.items.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {instructors.items.map((ins, index) => (
              <InstructorCard
                key={ins.id}
                instructor={ins}
                locale={locale}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <div className="w-16 h-16 bg-gold-primary/10 dark:bg-gold-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-gold-primary dark:text-gold-light" />
            </div>
            <h3 className="text-xl font-bold text-yale-blue dark:text-white mb-2">
              {t('لا يوجد نتائج', 'No instructors found')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {t(
                'جرب البحث بكلمات مختلفة أو تغيير التخصص.',
                'Try searching with different keywords or changing the specialization.'
              )}
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-16">
          <PaginationWrapper
            page={instructors.page}
            totalPages={instructors.totalPages}
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
