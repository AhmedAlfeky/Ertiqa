import { redirect } from 'next/navigation';
import { getAllCategories, isAdmin } from '@/features/admin/queries';
import { CategoriesTable } from '@/app/components/admin/CategoriesTable';
import { getTranslations } from 'next-intl/server';
import { DataTablePagination } from '@/app/components/dashboard/DataTablePagination';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage({
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
  const categoriesData = await getAllCategories(page, limit);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('categories')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('manageCategories') || 'Manage course categories'}
        </p>
      </div>

      <CategoriesTable categories={categoriesData.data} locale={locale} />

      {categoriesData.total > 0 && (
        <DataTablePagination
          total={categoriesData.total}
          page={categoriesData.page}
          limit={categoriesData.limit}
          totalPages={categoriesData.totalPages}
        />
      )}
    </div>
  );
}
