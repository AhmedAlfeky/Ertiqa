import { redirect } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/app/components/admin/AdminSidebar';
import { isAdmin } from '@/features/admin/queries';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Check if user is admin
  const userIsAdmin = await isAdmin();
  console.log('User is admin:', userIsAdmin);

  if (!userIsAdmin) {
    console.log('User is not admin, redirecting to login');
    redirect(`/${locale}/login`);
  }

  const isRTL = locale === 'ar';

  return (
    <SidebarProvider className="">
      <div
        className={`flex w-full min-h-screen ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
      >
        <AdminSidebar locale={locale} />
        <main className="flex-1 w-full">
          <div
            className={`sticky top-0 z-10 bg-background border-b px-4 py-2 ${
              isRTL ? 'text-right' : 'text-left'
            }`}
          >
            <SidebarTrigger />
          </div>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}




