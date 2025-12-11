'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/app/components/dashboard/DataTable';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { updateUserRole } from '../../../features/admin/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslations } from 'next-intl';

interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role_id: number | null;
  role_name: string;
  is_instructor: boolean;
  instructor_verified: boolean;
  created_at: string;
}

interface UsersTableProps {
  users: User[];
  locale: string;
}

export function UsersTable({ users, locale }: UsersTableProps) {
  const t = useTranslations('admin');
  const router = useRouter();
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const isRTL = locale === 'ar';

  const handleRoleChange = async (userId: string, roleId: number) => {
    setUpdatingUserId(userId);
    try {
      const result = await updateUserRole(userId, roleId);
      if (result.success) {
        toast.success(t('userRoleUpdated'));
        router.refresh();
      } else {
        toast.error(result.error || t('userRoleUpdateFailed'));
      }
    } catch (error) {
      toast.error(t('errorOccurred'));
    } finally {
      setUpdatingUserId(null);
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'full_name',
      header: t('user'),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback>
                {user.full_name?.charAt(0) ||
                  user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.full_name || t('noName')}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role_name',
      header: t('role'),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Select
            value={user.role_id?.toString() || '1'}
            onValueChange={value => handleRoleChange(user.id, parseInt(value))}
            disabled={updatingUserId === user.id}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent dir={isRTL ? 'rtl' : 'ltr'}>
              <SelectItem value="1">{t('student')}</SelectItem>
              <SelectItem value="2">{t('instructor')}</SelectItem>
              <SelectItem value="5">{t('admin')}</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: 'is_instructor',
      header: t('status'),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex gap-2">
            {user.is_instructor && (
              <Badge variant="secondary">{t('instructor')}</Badge>
            )}
            {user.instructor_verified && (
              <Badge variant="default">{t('verified')}</Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: t('joined'),
      cell: ({ row }) => {
        const date = new Date(row.getValue('created_at'));
        return date.toLocaleDateString();
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
      searchKey="email"
      searchPlaceholder={t('searchUsersByEmail')}
    />
  );
}
