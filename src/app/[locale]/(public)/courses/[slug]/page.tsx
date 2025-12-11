import { notFound } from 'next/navigation';
import { getCourseUnits } from '@/features/instructor/curriculum-queries';
import { checkEnrollment, getPublicCourseBySlug } from '@/features/public/queries';
import { EnrollButton } from '@/features/public/components/EnrollButton';
import { SectionHeader } from '@/features/public/components/SectionHeader';
import { getUser } from '@/lib/supabase/server';
import { ROLE_IDS } from '@/lib/constants';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  const course = await getPublicCourseBySlug(slug, locale);

  if (!course) return notFound();

  const units = await getCourseUnits(course.id);
  const user = await getUser();
  const roleId = user?.user_metadata?.role_id || user?.app_metadata?.role_id;
  const isStudent = roleId === ROLE_IDS.STUDENT || user?.user_metadata?.role === 'STUDENT';
  const isLoggedIn = !!user;
  const isEnrolled = await checkEnrollment(user?.id || null, course.id);

  const t = (ar: string, en: string) => (locale === 'ar' ? ar : en);

  return (
    <div className="container mx-auto px-6 py-10 space-y-10">
      {/* Header */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <p className="text-gold-primary font-semibold">{course.instructor_name}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{course.title}</h1>
          {course.subtitle ? (
            <p className="text-muted-foreground text-lg">{course.subtitle}</p>
          ) : null}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>{t('الطلاب', 'Students')}: {course.students_count || 0}</span>
            <span>★ {course.avg_rating ? Number(course.avg_rating).toFixed(1) : '—'}</span>
            <span>{course.is_free ? t('مجاني', 'Free') : `${course.price ?? 0} ${course.currency || 'USD'}`}</span>
          </div>
          <EnrollButton
            locale={locale}
            isEnrolled={isEnrolled}
            isStudent={!!isStudent}
            isLoggedIn={isLoggedIn}
          />
        </div>
        <div>
          {course.cover_image_url ? (
            <img
              src={course.cover_image_url}
              alt={course.title || ''}
              className="w-full rounded-2xl border shadow-sm object-cover"
            />
          ) : (
            <div className="w-full aspect-video rounded-2xl border bg-platinum flex items-center justify-center text-muted-foreground">
              {t('لا توجد صورة', 'No image')}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {course.description ? (
        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-3">
          <SectionHeader
            title={t('وصف الدورة', 'Course description')}
            align="left"
          />
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {course.description}
          </p>
        </div>
      ) : null}

      {/* Curriculum preview */}
      <div className="space-y-4">
        <SectionHeader
          title={t('محتوى الدورة', 'Curriculum')}
          subtitle={t('نظرة سريعة على الوحدات والدروس.', 'Quick look at units and lessons.')}
          align="left"
        />
        <div className="space-y-3">
          {units.length === 0 && (
            <div className="text-muted-foreground text-sm">
              {t('لا يوجد محتوى بعد', 'No curriculum yet')}
            </div>
          )}
          {units.slice(0, 6).map((unit) => (
            <div key={unit.id} className="border rounded-xl p-4 bg-white/60">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  {locale === 'ar' ? unit.title_ar : unit.title_en}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {t('دروس', 'Lessons')}: {unit.lessons?.length || 0}
                </span>
              </div>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {(unit.lessons || []).slice(0, 3).map((lesson: any) => (
                  <li key={lesson.id} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-primary inline-block" />
                    {locale === 'ar' ? lesson.title_ar : lesson.title_en}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

