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

const ROLE_NAMES: Record<number, string> = {
  1: 'Student',
  2: 'Instructor',
  4: 'Admin',
};

export function UsersTable({ users, locale }: UsersTableProps) {
  const router = useRouter();
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, roleId: number) => {
    setUpdatingUserId(userId);
    try {
      const result = await updateUserRole(userId, roleId);
      if (result.success) {
        toast.success('User role updated successfully');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update user role');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'full_name',
      header: 'User',
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
              <div className="font-medium">{user.full_name || 'No name'}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role_name',
      header: 'Role',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Select
            value={user.role_id?.toString() || '1'}
            onValueChange={value => handleRoleChange(user.id, parseInt(value))}
            disabled={updatingUserId === user.id}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Student</SelectItem>
              <SelectItem value="2">Instructor</SelectItem>
              <SelectItem value="4">Admin</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: 'is_instructor',
      header: 'Status',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex gap-2">
            {user.is_instructor && (
              <Badge variant="secondary">Instructor</Badge>
            )}
            {user.instructor_verified && (
              <Badge variant="default">Verified</Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Joined',
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
      searchPlaceholder="Search users by email..."
    />
  );
}
