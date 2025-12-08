import { redirect } from 'next/navigation';
import { getAllInstructors, isAdmin } from '@/features/admin/queries';
import { InstructorsTable } from '@/app/components/admin/InstructorsTable';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function AdminInstructorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('admin');

  if (!(await isAdmin())) {
    redirect(`/${locale}/login`);
  }

  const instructors = await getAllInstructors();

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('instructors') || 'Instructors'}</h1>
        <p className="text-muted-foreground mt-1">
          {t('manageInstructors') || 'Browse and manage instructors'}
        </p>
      </div>

      <InstructorsTable instructors={instructors} locale={locale} />
    </div>
  );
}







