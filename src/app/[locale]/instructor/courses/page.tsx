import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { getInstructorCourses, getCurrentInstructorId } from '@/features/instructor/queries';
import { isAdmin } from '@/features/admin/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { DataTablePagination } from '@/app/components/dashboard/DataTablePagination';
import type { CourseWithDetails } from '@/features/instructor/types';

export const dynamic = 'force-dynamic';

export default async function InstructorCoursesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations('instructor');
  
  // If the current user is an admin (role_id 5), redirect them to the admin dashboard
  if (await isAdmin()) {
    redirect(`/${locale}/admin/dashboard`);
  }

  const instructorId = await getCurrentInstructorId();

  if (!instructorId) {
    redirect(`/${locale}/auth/login`);
  }

  const page = parseInt(resolvedSearchParams.page || '1');
  const limit = parseInt(resolvedSearchParams.limit || '10');

  const coursesData = await getInstructorCourses(page, limit, locale);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('myCourses')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('manageCoursesDescription')}
          </p>
        </div>
        <Link href={`/${locale}/instructor/courses/create`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('createCourse')}
          </Button>
        </Link>
      </div>

      <Suspense fallback={<CoursesListSkeleton />}>
        {coursesData.data.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">{t('noCourses')}</p>
            <Link href={`/${locale}/instructor/courses/create`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('createFirstCourse')}
              </Button>
            </Link>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {coursesData.data.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  locale={locale}
                  t={t}
                />
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

function CourseCard({
  course,
  locale,
  t,
}: {
  course: CourseWithDetails;
  locale: string;
  t: any;
}) {
  return (
    <Link href={`/${locale}/instructor/courses/${course.id}/manage`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group border-l-4 border-l-transparent hover:border-l-primary">
        <div className="flex gap-4 p-4">
          {/* Course Image */}
          <div className="relative w-48 h-32 shrink-0 rounded-md overflow-hidden bg-muted group-hover:scale-105 transition-transform duration-200">
            {course.cover_image_url ? (
              <Image
                src={course.cover_image_url}
                alt={course.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-muted/50">
                <span className="text-xs">{t('noImage') || 'No Image'}</span>
              </div>
            )}
          </div>

          {/* Course Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {course.subtitle || course.description || t('noDescription') || 'No description'}
                </p>
              </div>
              <Badge 
                variant={course.is_published ? 'default' : 'secondary'}
                className="shrink-0"
              >
                {course.is_published ? t('published') : t('draft')}
              </Badge>
            </div>

            <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <span className="font-medium">{course.modulesCount || 0}</span>
                <span>{t('modules')}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="font-medium">{course.lessonsCount || 0}</span>
                <span>{t('lessons')}</span>
              </span>
              {course.lookup_levels?.name && (
                <>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs">
                    {course.lookup_levels.name}
                  </Badge>
                </>
              )}
              {course.is_free ? (
                <>
                  <span>•</span>
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {t('free')}
                  </Badge>
                </>
              ) : course.price ? (
                <>
                  <span>•</span>
                  <span className="font-semibold text-foreground">
                    {course.price} {course.currency}
                  </span>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </Card>
    </Link>
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
