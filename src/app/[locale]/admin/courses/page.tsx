import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/features/admin/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTablePagination } from '@/app/components/dashboard/DataTablePagination';

type CourseRow = {
  id: number;
  instructor_id: string;
  cover_image_url: string | null;
  is_published: boolean;
  is_free: boolean;
  price: number | null;
  currency: string | null;
  lookup_levels?: { id: number; name: string } | null;
  course_translations?: {
    language_id: number;
    title: string;
    subtitle: string | null;
    description: string | null;
  }[];
  user_profiles?: { full_name: string | null; email: string | null } | null;
};

type PaginatedCourses = {
  data: CourseRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const LANG_AR = 1;
const LANG_EN = 2;

async function getAdminCourses(page: number, limit: number, locale: string): Promise<PaginatedCourses> {
  const supabase = await createClient();
  const offset = (page - 1) * limit;

  const { count } = await supabase.from('courses').select('*', { head: true, count: 'exact' });

  const { data, error } = await supabase
    .from('courses')
    .select(
      `
      *,
      lookup_levels (id, name),
      course_translations (language_id, title, subtitle, description),
      user_profiles:instructor_id (full_name, email)
    `
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching admin courses:', error);
    return { data: [], total: 0, page, limit, totalPages: 0 };
  }

  return {
    data: (data as CourseRow[]) || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

function mapTranslation(course: CourseRow, locale: string) {
  const primaryId = locale === 'ar' ? LANG_AR : LANG_EN;
  const fallbackId = locale === 'ar' ? LANG_EN : LANG_AR;

  const primary = course.course_translations?.find((t) => t.language_id === primaryId);
  const fallback = course.course_translations?.find((t) => t.language_id === fallbackId);

  return {
    title: primary?.title || fallback?.title || 'Untitled Course',
    subtitle: primary?.subtitle || fallback?.subtitle,
    description: primary?.description || fallback?.description,
  };
}

export const dynamic = 'force-dynamic';

export default async function AdminCoursesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const { locale } = await params;
  const resolvedSearch = await searchParams;
  const tAdmin = await getTranslations('admin');
  const tInstructor = await getTranslations('instructor');

  if (!(await isAdmin())) {
    redirect(`/${locale}/login`);
  }

  const page = parseInt(resolvedSearch.page || '1');
  const limit = parseInt(resolvedSearch.limit || '10');

  const coursesData = await getAdminCourses(page, limit, locale);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{tAdmin('allCourses')}</h1>
        <p className="text-muted-foreground mt-2">{tAdmin('allCoursesSubtitle')}</p>
      </div>

      <Suspense fallback={<CoursesListSkeleton />}>
        {coursesData.data.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground">{tAdmin('noResults')}</Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {coursesData.data.map((course) => (
                <CourseCard key={course.id} course={course} locale={locale} t={tInstructor} />
              ))}
            </div>

            <DataTablePagination
              total={coursesData.total}
              page={coursesData.page}
              limit={coursesData.limit}
              totalPages={coursesData.totalPages}
            />
          </>
        )}
      </Suspense>
    </div>
  );
}

function CourseCard({ course, locale, t }: { course: CourseRow; locale: string; t: any }) {
  const translation = mapTranslation(course, locale);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary">
      <div className="flex gap-4 p-4">
        <div className="relative w-48 h-32 shrink-0 rounded-md overflow-hidden bg-muted">
          {course.cover_image_url ? (
            <Image src={course.cover_image_url} alt={translation.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-muted/50">
              <span className="text-xs">{t('noImage') || 'No Image'}</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{translation.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {translation.subtitle || translation.description || t('noDescription') || 'No description'}
              </p>
            </div>
            <Badge variant={course.is_published ? 'default' : 'secondary'} className="shrink-0">
              {course.is_published ? t('published') : t('draft')}
            </Badge>
          </div>

          <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground flex-wrap">
            {course.lookup_levels?.name && (
              <Badge variant="outline" className="text-xs">
                {course.lookup_levels.name}
              </Badge>
            )}
            {course.is_free ? (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {t('free')}
              </Badge>
            ) : course.price ? (
              <span className="font-semibold text-foreground">
                {course.price} {course.currency}
              </span>
            ) : null}
            {course.user_profiles?.full_name && (
              <span className="truncate">
                {course.user_profiles.full_name}{' '}
                {course.user_profiles.email ? <span className="text-xs text-muted-foreground">({course.user_profiles.email})</span> : null}
              </span>
            )}
            <Link
              href={`/${locale}/admin/instructors/${course.instructor_id}`}
              className="text-primary hover:underline text-xs font-medium"
            >
              {t('instructor')}
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

function CoursesListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
}

