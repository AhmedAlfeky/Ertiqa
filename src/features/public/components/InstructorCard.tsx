'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Props = {
  instructor: {
    id: string;
    full_name: string | null;
    specialization?: string | null;
    avatar_url?: string | null;
    courses_count?: number | null;
  };
  locale: string;
};

export function InstructorCard({ instructor, locale }: Props) {
  const initials = instructor.full_name
    ? instructor.full_name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
    : 'IN';

  return (
    <Link href={`/${locale}/instructors/${instructor.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow bg-card">
        <CardContent className="p-4 flex flex-col items-center text-center gap-3">
          <Avatar className="h-16 w-16">
            <AvatarImage src={instructor.avatar_url || ''} alt={instructor.full_name || ''} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-base font-semibold">{instructor.full_name}</h3>
            <p className="text-sm text-muted-foreground">
              {instructor.specialization || (locale === 'ar' ? 'مدرب' : 'Instructor')}
            </p>
          </div>
        </CardContent>
        <CardFooter className="px-4 pb-4 text-sm text-muted-foreground">
          {locale === 'ar' ? 'الدورات: ' : 'Courses: '} {instructor.courses_count ?? '—'}
        </CardFooter>
      </Card>
    </Link>
  );
}

