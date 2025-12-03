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
  const t = await getTranslations('admin');

  if (!(await isAdmin())) {
    redirect(`/${locale}/login`);
  }

  const instructor = await getInstructorDetails(instructorId);

  if (!instructor) {
    notFound();
  }

  return (
    <div className="container py-8 space-y-6">
      <Link
        href={`/${locale}/admin/instructors`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Instructors
      </Link>

      <InstructorDetails instructor={instructor} locale={locale} />
    </div>
  );
}



