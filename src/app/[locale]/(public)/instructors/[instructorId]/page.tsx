import { notFound } from 'next/navigation';
import { CourseCard } from '@/features/public/components/CourseCard';
import { SectionHeader } from '@/features/public/components/SectionHeader';
import { getPublicInstructorById } from '@/features/public/queries';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  Star, 
  BadgeCheck,
  GraduationCap,
  PlayCircle
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export const revalidate = 3600; // Cache for 1 hour

export default async function InstructorDetailPage({
  params,
}: {
  params: { locale: string; instructorId: string };
}) {
  const { locale, instructorId } = params;
  const data = await getPublicInstructorById(instructorId, locale);
  const t = await getTranslations({ locale, namespace: 'instructor' });

  if (!data) return notFound();

  const { profile, courses, stats } = data;
  const initials = (profile.full_name || 'IN')
    .split(' ')
    .map((p: string) => p[0])
    .join('')
    .slice(0, 2);

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="min-h-screen bg-snow dark:bg-slate-950">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-yale-blue via-yale-blue-light to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Avatar */}
            <div className="relative">
              <div className="absolute -inset-2 bg-gold-primary/30 rounded-full blur-xl" />
              <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white/20 shadow-2xl relative z-10">
                <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || ''} />
                <AvatarFallback className="bg-white/10 text-white text-3xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {profile.instructor_verified && (
                <div className="absolute -bottom-2 -right-2 bg-gold-primary p-2 rounded-full border-4 border-white shadow-lg">
                  <BadgeCheck className="w-6 h-6 text-yale-blue" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl md:text-5xl font-extrabold">
                  {profile.full_name}
                </h1>
                {profile.instructor_verified && (
                  <Badge className="bg-gold-primary/20 text-gold-primary border-gold-primary/50 px-3 py-1">
                    <BadgeCheck className="w-4 h-4 mr-1" />
                    {t('verifiedInstructor')}
                  </Badge>
                )}
              </div>
              
              {profile.specialization && (
                <div className="flex items-center gap-2 text-gold-light">
                  <GraduationCap className="w-5 h-5" />
                  <p className="text-lg font-semibold">{profile.specialization}</p>
                </div>
              )}

              {profile.bio && (
                <p className="text-white/90 text-base md:text-lg max-w-3xl leading-relaxed">
                  {profile.bio}
                </p>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 text-gold-light mb-1">
                    <BookOpen className="w-5 h-5" />
                    <span className="text-sm font-medium">{t('courses')}</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.totalCourses}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 text-gold-light mb-1">
                    <Users className="w-5 h-5" />
                    <span className="text-sm font-medium">{t('students')}</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 text-gold-light mb-1">
                    <PlayCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{t('lessons')}</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.totalLessons}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 text-gold-light mb-1">
                    <Star className="w-5 h-5 fill-gold-primary text-gold-primary" />
                    <span className="text-sm font-medium">{t('rating')}</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.avgRating > 0 ? stats.avgRating.toFixed(1) : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 py-12 space-y-12">
        {/* Courses Section */}
        <div className="space-y-6">
          <SectionHeader
            title={t('coursesByInstructor')}
            align="left"
          />
          {courses.length === 0 ? (
            <div className="text-center py-20 bg-card dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
              <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {t('noCoursesYet')}
              </h3>
              <p className="text-slate-500">
                {t('noCoursesDescription')}
              </p>
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
    </div>
  );
}
