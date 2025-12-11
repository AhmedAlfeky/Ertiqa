import { redirect } from 'next/navigation';
import { getAllUsersWithRoles, isAdmin } from '@/features/admin/queries';
import { UsersTable } from '@/app/components/admin/UsersTable';
import { getTranslations } from 'next-intl/server';
import { DataTablePagination } from '@/app/components/dashboard/DataTablePagination';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage({
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
  const usersData = await getAllUsersWithRoles(page, limit);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('users') || 'Users'}</h1>
        <p className="text-muted-foreground mt-1">
          {t('manageUsers') || 'Manage all users and their roles'}
        </p>
      </div>

      <UsersTable users={usersData.data} locale={locale} />

      {usersData.total > 0 && (
        <DataTablePagination
          total={usersData.total}
          page={usersData.page}
          limit={usersData.limit}
          totalPages={usersData.totalPages}
        />
      )}
    </div>
  );
}







