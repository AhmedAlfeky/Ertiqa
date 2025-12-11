import { notFound } from 'next/navigation';
import { InstructorCard } from '@/features/public/components/InstructorCard';
import { CourseCard } from '@/features/public/components/CourseCard';
import { SectionHeader } from '@/features/public/components/SectionHeader';
import { getPublicInstructorById } from '@/features/public/queries';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const revalidate = 0;

export default async function InstructorDetailPage({
  params,
}: {
  params: { locale: string; instructorId: string };
}) {
  const { locale, instructorId } = params;
  const data = await getPublicInstructorById(instructorId, locale);

  if (!data) return notFound();

  const { profile, courses } = data;
  const initials = (profile.full_name || 'IN')
    .split(' ')
    .map((p: string) => p[0])
    .join('')
    .slice(0, 2);

  const t = (ar: string, en: string) => (locale === 'ar' ? ar : en);

  return (
    <div className="container mx-auto px-6 py-10 space-y-10">
      <div className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || ''} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {profile.full_name}
            </h1>
            <p className="text-muted-foreground">
              {profile.specialization || t('مدرب', 'Instructor')}
            </p>
            {profile.bio ? (
              <p className="text-sm text-muted-foreground max-w-2xl whitespace-pre-line">
                {profile.bio}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <SectionHeader
          title={t('دورات هذا المدرب', 'Courses by this instructor')}
          align="left"
        />
        {courses.length === 0 ? (
          <div className="text-muted-foreground text-sm">
            {t('لا توجد دورات حاليًا', 'No courses yet')}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

