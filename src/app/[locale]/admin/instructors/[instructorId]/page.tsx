import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getInstructorDetails, isAdmin } from '@/features/admin/queries';
import { InstructorDetails } from '@/app/components/admin/InstructorDetails';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function InstructorDetailPage({
  params,
}: {
  params: Promise<{ instructorId: string; locale: string }>;
}) {
  const { instructorId, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });

  if (!(await isAdmin())) {
    redirect(`/${locale}/login`);
  }

  const instructor = await getInstructorDetails(instructorId);

  if (!instructor) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/${locale}/admin/instructors`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="me-2 h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
        {t('backToInstructors')}
      </Link>

      <InstructorDetails instructor={instructor} locale={locale} />
    </div>
  );
}







