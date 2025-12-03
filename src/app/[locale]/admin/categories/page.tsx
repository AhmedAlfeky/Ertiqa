import { redirect } from 'next/navigation';
import { getAllCategories, isAdmin } from '@/features/admin/queries';
import { CategoriesTable } from '@/app/components/admin/CategoriesTable';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('admin');

  if (!(await isAdmin())) {
    redirect(`/${locale}/login`);
  }

  const categories = await getAllCategories();

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('categories') || 'Categories'}</h1>
          <p className="text-muted-foreground mt-1">
            {t('manageCategories') || 'Manage course categories'}
          </p>
        </div>
      </div>

      <CategoriesTable categories={categories} locale={locale} />
    </div>
  );
}



