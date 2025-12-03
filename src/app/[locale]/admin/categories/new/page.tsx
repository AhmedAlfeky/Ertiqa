import { redirect } from 'next/navigation';
import { isAdmin } from '@/features/admin/queries';
import { CategoryForm } from '@/app/components/admin/CategoryForm';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function NewCategoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('admin');

  if (!(await isAdmin())) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('newCategory') || 'New Category'}</h1>
        <p className="text-muted-foreground mt-1">
          {t('createCategoryDescription') || 'Create a new course category'}
        </p>
      </div>

      <CategoryForm locale={locale} />
    </div>
  );
}



