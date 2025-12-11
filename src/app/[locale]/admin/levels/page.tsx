import { redirect } from 'next/navigation';
import { getAllLevels, isAdmin } from '@/features/admin/queries';
import { LevelsTable } from '@/app/components/admin/LevelsTable';
import { getTranslations } from 'next-intl/server';
import { DataTablePagination } from '@/app/components/dashboard/DataTablePagination';

export const dynamic = 'force-dynamic';

export default async function AdminLevelsPage({
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
  const levelsData = await getAllLevels(page, limit);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('levels') || 'Levels'}</h1>
        <p className="text-muted-foreground mt-1">
          {t('manageLevels') || 'Manage course levels'}
        </p>
      </div>

      <LevelsTable levels={levelsData.data} locale={locale} />

      {levelsData.total > 0 && (
        <DataTablePagination
          total={levelsData.total}
          page={levelsData.page}
          limit={levelsData.limit}
          totalPages={levelsData.totalPages}
        />
      )}
    </div>
  );
}







