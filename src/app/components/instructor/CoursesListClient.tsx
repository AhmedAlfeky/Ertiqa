'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTablePagination } from '@/app/components/dashboard/DataTablePagination';
import type {
  CourseWithDetails,
  PaginatedResult,
} from '../../../features/instructor/types';
import Link from 'next/link';
import Image from 'next/image';

interface CoursesListClientProps {
  coursesData: PaginatedResult<CourseWithDetails>;
  locale: string;
}

export function CoursesListClient({
  coursesData,
  locale,
}: CoursesListClientProps) {
  const t = useTranslations('instructor');
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href={`/${locale}/instructor/courses/create`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('createCourse')}
          </Button>
        </Link>
      </div>

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
          <div className="grid gap-4">
            {coursesData.data.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                locale={locale}
                onEdit={() =>
                  router.push(
                    `/${locale}/instructor/courses/${course.id}/manage`
                  )
                }
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
    </div>
  );
}

function CourseCard({
  course,
  locale,
  onEdit,
}: {
  course: CourseWithDetails;
  locale: string;
  onEdit: () => void;
}) {
  const t = useTranslations('instructor');

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex gap-4 p-4">
        {/* Course Image */}
        <div className="relative w-48 h-32 shrink-0 rounded-md overflow-hidden bg-muted">
          {course.cover_image_url ? (
            <Image
              src={course.cover_image_url}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>

        {/* Course Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg">{course.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {course.subtitle || course.description || 'No description'}
              </p>
            </div>
            <Badge variant={course.is_published ? 'default' : 'secondary'}>
              {course.is_published ? t('published') : t('draft')}
            </Badge>
          </div>

          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <span>
              {course.modulesCount || 0} {t('modules')}
            </span>
            <span>•</span>
            <span>
              {course.lessonsCount || 0} {t('lessons')}
            </span>
            {course.lookup_levels?.name && (
              <>
                <span>•</span>
                <span>{course.lookup_levels.name}</span>
              </>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={onEdit} variant="outline" size="sm">
              {t('manage')}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
