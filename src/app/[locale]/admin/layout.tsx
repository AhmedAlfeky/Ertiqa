import { redirect } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/app/components/admin/AdminSidebar';
import { isAdmin } from '@/features/admin/queries';
import MaxWidthWrapper from '@/app/components/MaxwidthWrapper';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  console.log(locale);
  // Check if user is admin
  const userIsAdmin = await isAdmin();
  console.log('User is admin:', userIsAdmin, locale);

  if (!userIsAdmin) {
    console.log('User is not admin, redirecting to login');
    redirect(`/${locale}/login`);
  }

  return (
    <SidebarProvider dir={locale === 'ar' ? 'rtl' : 'ltr'} className="">
      <div className={`flex w-full min-h-screen`}>
        <AdminSidebar locale={locale} />
        <main className="flex-1 w-full">
          <div className={`sticky top-0 z-10 bg-background border-b `}>
            <div className="flex items-center h-14">
              <SidebarTrigger />
            </div>
          </div>
          <section className="p-6">{children}</section>
        </main>
      </div>
    </SidebarProvider>
  );
}
