import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, Tag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllUsersCount, getAllInstructorsCount } from '@/features/admin/queries';
import { createClient } from '@/lib/supabase/server';

async function DashboardStats() {
  const supabase = await createClient();
  
  // Get counts
  const usersCount = await getAllUsersCount();
  const instructorsCount = await getAllInstructorsCount();
  
  // Get courses count
  const { count: coursesCount } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true });
  
  // Get categories count
  const { count: categoriesCount } = await supabase
    .from('lookup_categories')
    .select('*', { count: 'exact', head: true });

  const stats = [
    {
      title: 'Total Users',
      value: usersCount || 0,
      description: 'Registered users',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Instructors',
      value: instructorsCount || 0,
      description: 'Active instructors',
      icon: GraduationCap,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Courses',
      value: coursesCount || 0,
      description: 'Total courses',
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Categories',
      value: categoriesCount || 0,
      description: 'Course categories',
      icon: Tag,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
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

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the admin dashboard. Manage your platform here.
        </p>
      </div>

      <Suspense fallback={<StatsLoading />}>
        <DashboardStats />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform updates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href={`/${locale}/admin/users`}
              className="block text-sm text-primary hover:underline"
            >
              → Manage Users
            </a>
            <a
              href={`/${locale}/admin/categories`}
              className="block text-sm text-primary hover:underline"
            >
              → Manage Categories
            </a>
            <a
              href={`/${locale}/admin/levels`}
              className="block text-sm text-primary hover:underline"
            >
              → Manage Levels
            </a>
            <a
              href={`/${locale}/admin/instructors`}
              className="block text-sm text-primary hover:underline"
            >
              → View Instructors
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Platform health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm">All systems operational</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}






