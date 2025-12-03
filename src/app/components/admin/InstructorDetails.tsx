'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Video, FileQuestion, BookOpen } from 'lucide-react';

interface InstructorDetailsProps {
  instructor: {
    profile: any;
    courses: any[];
  };
  locale: string;
}

export function InstructorDetails({ instructor, locale }: InstructorDetailsProps) {
  const router = useRouter();
  const { profile, courses } = instructor;

  return (
    <div className="space-y-6">
      {/* Instructor Profile */}
      <Card className="p-6">
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback className="text-2xl">
              {profile.full_name?.charAt(0) || 'I'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{profile.full_name || 'No name'}</h1>
              {profile.instructor_verified && (
                <Badge variant="default">Verified</Badge>
              )}
            </div>
            {profile.specialization && (
              <p className="text-lg text-muted-foreground mb-2">{profile.specialization}</p>
            )}
            {profile.bio && (
              <p className="text-muted-foreground">{profile.bio}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Courses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Courses ({courses.length})</h2>
        </div>

        {courses.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">This instructor has no courses yet.</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="p-4 hover:bg-accent/5 transition-colors cursor-pointer"
                onClick={() => router.push(`/${locale}/instructor/courses/${course.id}/manage`)}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{course.title_en || course.title_ar}</h3>
                    <Badge variant={course.is_published ? 'default' : 'secondary'}>
                      {course.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  {course.title_ar && course.title_ar !== course.title_en && (
                    <p className="text-sm text-muted-foreground" dir="rtl">
                      {course.title_ar}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {course.units_count || 0} Units
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="h-4 w-4" />
                      {course.lessons_count || 0} Lessons
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



