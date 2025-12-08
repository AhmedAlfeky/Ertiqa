import { redirect } from 'next/navigation';
import { getAllLevels, isAdmin } from '@/features/admin/queries';
import { LevelsTable } from '@/app/components/admin/LevelsTable';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function AdminLevelsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('admin');

  if (!(await isAdmin())) {
    redirect(`/${locale}/login`);
  }

  const levels = await getAllLevels();

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('levels') || 'Levels'}</h1>
          <p className="text-muted-foreground mt-1">
            {t('manageLevels') || 'Manage course levels'}
          </p>
        </div>
      </div>

      <LevelsTable levels={levels} locale={locale} />
    </div>
  );
}







