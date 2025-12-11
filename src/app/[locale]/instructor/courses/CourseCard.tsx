'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CourseWithDetails } from '@/features/instructor/types';

export function CourseCard({
  course,
  locale,
}: {
  course: CourseWithDetails;
  locale: string;
}) {
  const t = useTranslations('instructor');

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
                <span className="text-xs">{t('noImage')}</span>
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
                  {course.subtitle || course.description || t('noDescription')}
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
                  <Badge
                    variant="secondary"
                    className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  >
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

