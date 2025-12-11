'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Props = {
  course: {
    id: number;
    slug: string;
    title?: string | null;
    subtitle?: string | null;
    cover_image_url?: string | null;
    instructor_name?: string | null;
    price?: number | null;
    currency?: string | null;
    is_free?: boolean | null;
    avg_rating?: number | null;
    students_count?: number | null;
  };
  locale: string;
};

export function CourseCard({ course, locale }: Props) {
  const priceLabel =
    course.is_free || course.price === null || course.price === undefined
      ? locale === 'ar'
        ? 'مجانًا'
        : 'Free'
      : `${course.price} ${course.currency || 'USD'}`;

  return (
    <Link href={`/${locale}/courses/${course.slug}`}>
      <Card className="h-full p-0 overflow-hidden hover:shadow-lg transition-shadow bg-card">
        {course.cover_image_url ? (
          <div className="aspect-video overflow-hidden">
            <img
              src={course.cover_image_url}
              alt={course.title || ''}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-r from-alice-blue to-platinum flex items-center justify-center text-muted-foreground">
            <span>{locale === 'ar' ? 'لا توجد صورة' : 'No image'}</span>
          </div>
        )}

        <CardContent className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold line-clamp-2">
              {course.title}
            </h3>
            {course.avg_rating ? (
              <Badge variant="secondary" className="shrink-0">
                ★ {Number(course.avg_rating).toFixed(1)}
              </Badge>
            ) : null}
          </div>
          {course.subtitle ? (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {course.subtitle}
            </p>
          ) : null}
          <p className="text-sm text-foreground/80">
            {locale === 'ar' ? 'المدرب:' : 'Instructor:'}{' '}
            <span className="font-medium">{course.instructor_name || '—'}</span>
          </p>
        </CardContent>

        <CardFooter className="px-4 pb-4 flex items-center justify-between">
          <span
            className={cn(
              'text-sm font-semibold',
              course.is_free && 'text-green-600'
            )}
          >
            {priceLabel}
          </span>
          <span className="text-xs text-muted-foreground">
            {locale === 'ar' ? 'طلاب' : 'Students'}:{' '}
            {course.students_count || 0}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
