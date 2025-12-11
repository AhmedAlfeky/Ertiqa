import { redirect } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { InstructorSidebar } from '@/app/components/instructor/InstructorSidebar';
import { getCurrentInstructorId } from '@/features/instructor/queries';

export default async function InstructorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const instructorId = await getCurrentInstructorId();
  console.log('Instructor ID:', instructorId);

  if (!instructorId) {
    console.log('No instructor ID found, redirecting to login');
    redirect(`/${locale}/login`);
  }

  const isRTL = locale === 'ar';

  return (
    <SidebarProvider className="">
      <div
        className={`flex w-full min-h-screen 
        `}
      >
        <InstructorSidebar locale={locale} />
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
