'use client';

import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/app/components/dashboard/DataTable';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye } from 'lucide-react';

interface Instructor {
  id: string;
  full_name: string;
  avatar_url: string | null;
  specialization: string | null;
  bio: string | null;
  instructor_verified: boolean;
  created_at: string;
}

interface InstructorsTableProps {
  instructors: Instructor[];
  locale: string;
}

export function InstructorsTable({ instructors, locale }: InstructorsTableProps) {
  const router = useRouter();

  const columns: ColumnDef<Instructor>[] = [
    {
      accessorKey: 'full_name',
      header: 'Instructor',
      cell: ({ row }) => {
        const instructor = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={instructor.avatar_url || undefined} />
              <AvatarFallback>
                {instructor.full_name?.charAt(0) || 'I'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{instructor.full_name || 'No name'}</div>
              {instructor.specialization && (
                <div className="text-sm text-muted-foreground">{instructor.specialization}</div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'instructor_verified',
      header: 'Status',
      cell: ({ row }) => {
        const instructor = row.original;
        return (
          <Badge variant={instructor.instructor_verified ? 'default' : 'secondary'}>
            {instructor.instructor_verified ? 'Verified' : 'Pending'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const instructor = row.original;
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/${locale}/admin/instructors/${instructor.id}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={instructors}
      searchKey="full_name"
      searchPlaceholder="Search instructors..."
    />
  );
}



