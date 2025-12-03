import { redirect } from 'next/navigation';
import { getAllUsersWithRoles, isAdmin } from '@/features/admin/queries';
import { UsersTable } from '@/app/components/admin/UsersTable';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('admin');

  if (!(await isAdmin())) {
    redirect(`/${locale}/login`);
  }

  const users = await getAllUsersWithRoles();

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('users') || 'Users'}</h1>
        <p className="text-muted-foreground mt-1">
          {t('manageUsers') || 'Manage all users and their roles'}
        </p>
      </div>

      <UsersTable users={users} locale={locale} />
    </div>
  );
}



