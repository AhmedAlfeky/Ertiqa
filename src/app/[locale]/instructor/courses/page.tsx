import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import {
  getInstructorCourses,
  getCurrentInstructorId,
} from '@/features/instructor/queries';
import { isAdmin } from '@/features/admin/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { DataTablePagination } from '@/app/components/dashboard/DataTablePagination';
import { CourseCard } from './CourseCard';
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
  const t = await getTranslations({ locale, namespace: 'instructor' });
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
              {coursesData.data.map(course => (
                <CourseCard key={course.id} course={course} locale={locale} />
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

function CoursesListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
}
