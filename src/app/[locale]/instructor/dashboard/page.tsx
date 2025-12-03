import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Clock, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentInstructorId } from '@/features/instructor/queries';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

async function DashboardStats() {
  const supabase = await createClient();
  const instructorId = await getCurrentInstructorId();

  if (!instructorId) {
    return null;
  }

  // Get instructor's courses count
  const { count: coursesCount } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true })
    .eq('instructor_id', instructorId);

  // Get published courses
  const { count: publishedCount } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true })
    .eq('instructor_id', instructorId)
    .eq('is_published', true);

  // Get total students enrolled (we'll implement this when we have enrollments)
  const totalStudents = 0; // Placeholder

  // Get recent courses
  const { data: recentCourses } = await supabase
    .from('courses')
    .select(`
      id,
      cover_image_url,
      is_published,
      created_at,
      course_translations!inner (
        title,
        language_id
      )
    `)
    .eq('instructor_id', instructorId)
    .eq('course_translations.language_id', 1) // Arabic
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = [
    {
      title: 'Total Courses',
      value: coursesCount || 0,
      description: 'All your courses',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Published',
      value: publishedCount || 0,
      description: 'Live courses',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Students',
      value: totalStudents,
      description: 'Total enrollments',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Draft Courses',
      value: (coursesCount || 0) - (publishedCount || 0),
      description: 'Not yet published',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {recentCourses && recentCourses.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Courses</CardTitle>
            <CardDescription>Your latest course activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCourses.map((course: any) => (
                <div
                  key={course.id}
                  className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">
                      {course.course_translations?.[0]?.title || 'Untitled Course'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {course.is_published ? (
                        <span className="text-green-600">Published</span>
                      ) : (
                        <span className="text-orange-600">Draft</span>
                      )}
                    </p>
                  </div>
                  <a
                    href={`/instructor/courses/${course.id}/manage`}
                    className="text-sm text-primary hover:underline"
                  >
                    Manage →
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

function StatsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader className="space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function InstructorDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const instructorId = await getCurrentInstructorId();

  if (!instructorId) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your teaching activity.
          </p>
        </div>
        <a
          href={`/${locale}/instructor/courses/create`}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Create Course
        </a>
      </div>

      <Suspense fallback={<StatsLoading />}>
        <DashboardStats />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your courses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href={`/${locale}/instructor/courses`}
              className="block text-sm text-primary hover:underline"
            >
              → View All Courses
            </a>
            <a
              href={`/${locale}/instructor/courses/create`}
              className="block text-sm text-primary hover:underline"
            >
              → Create New Course
            </a>
            <a
              href={`/${locale}/instructor/students`}
              className="block text-sm text-primary hover:underline"
            >
              → View Students
            </a>
            <a
              href={`/${locale}/instructor/settings`}
              className="block text-sm text-primary hover:underline"
            >
              → Settings
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tips & Resources</CardTitle>
            <CardDescription>Improve your teaching</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Check out our instructor guides to create engaging content and
              reach more students.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Support</CardTitle>
            <CardDescription>Need help?</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Our support team is here to help you succeed.
            </p>
            <a
              href="#"
              className="text-sm text-primary hover:underline"
            >
              Contact Support →
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

