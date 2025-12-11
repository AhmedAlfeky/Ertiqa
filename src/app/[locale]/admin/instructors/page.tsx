import { redirect } from 'next/navigation';
import { getAllInstructors, isAdmin } from '@/features/admin/queries';
import { InstructorsTable } from '@/app/components/admin/InstructorsTable';
import { getTranslations } from 'next-intl/server';
import { DataTablePagination } from '@/app/components/dashboard/DataTablePagination';

export const dynamic = 'force-dynamic';

export default async function AdminInstructorsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations({ locale, namespace: 'admin' });

  if (!(await isAdmin())) {
    redirect(`/${locale}/login`);
  }

  const page = parseInt(resolvedSearchParams.page || '1');
  const limit = parseInt(resolvedSearchParams.limit || '10');
  const instructorsData = await getAllInstructors(page, limit);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('instructors') || 'Instructors'}</h1>
        <p className="text-muted-foreground mt-1">
          {t('manageInstructors') || 'Browse and manage instructors'}
        </p>
      </div>

      <InstructorsTable instructors={instructorsData.data} locale={locale} />

      {instructorsData.total > 0 && (
        <DataTablePagination
          total={instructorsData.total}
          page={instructorsData.page}
          limit={instructorsData.limit}
          totalPages={instructorsData.totalPages}
        />
      )}
    </div>
  );
}







