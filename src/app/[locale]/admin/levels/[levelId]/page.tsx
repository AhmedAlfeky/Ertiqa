import { redirect, notFound } from 'next/navigation';
import { getLevelById, isAdmin } from '@/features/admin/queries';
import { LevelForm } from '@/app/components/admin/LevelForm';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function EditLevelPage({
  params,
}: {
  params: Promise<{ levelId: string; locale: string }>;
}) {
  const { levelId, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });

  if (!(await isAdmin())) {
    redirect(`/${locale}/login`);
  }

  const levelIdNum = parseInt(levelId);
  const level = await getLevelById(levelIdNum);

  if (!level) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('editLevel') || 'Edit Level'}</h1>
        <p className="text-muted-foreground mt-1">
          {t('editLevelDescription') || 'Update level information'}
        </p>
      </div>

      <LevelForm level={level} locale={locale} />
    </div>
  );
}







