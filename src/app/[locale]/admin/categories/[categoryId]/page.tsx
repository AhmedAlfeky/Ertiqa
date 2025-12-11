import { redirect, notFound } from 'next/navigation';
import { getCategoryById, isAdmin } from '@/features/admin/queries';
import { CategoryForm } from '@/app/components/admin/CategoryForm';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string; locale: string }>;
}) {
  const { categoryId, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });

  if (!(await isAdmin())) {
    redirect(`/${locale}/login`);
  }

  const categoryIdNum = parseInt(categoryId);
  const category = await getCategoryById(categoryIdNum);

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('editCategory') || 'Edit Category'}</h1>
        <p className="text-muted-foreground mt-1">
          {t('editCategoryDescription') || 'Update category information'}
        </p>
      </div>

      <CategoryForm category={category} locale={locale} />
    </div>
  );
}







