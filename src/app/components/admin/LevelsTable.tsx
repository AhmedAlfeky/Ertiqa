'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/app/components/dashboard/DataTable';
import { DeleteDialog } from '@/app/components/dashboard/DeleteDialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { deleteLevel } from '../../../features/admin/actions';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface Level {
  id: number;
  name: string;
  created_at: string;
}

interface LevelsTableProps {
  levels: Level[];
  locale: string;
}

export function LevelsTable({ levels, locale }: LevelsTableProps) {
  const t = useTranslations('admin');
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const result = await deleteLevel(deleteId);
      if (result.success) {
        toast.success(t('levelDeleted'));
        router.refresh();
      } else {
        toast.error(result.error || t('levelDeleteFailed'));
      }
    } catch (error) {
      toast.error(t('errorOccurred'));
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: ColumnDef<Level>[] = [
    {
      accessorKey: 'id',
      header: t('id'),
    },
    {
      accessorKey: 'name',
      header: t('name'),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const level = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/${locale}/admin/levels/${level.id}`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteId(level.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => router.push(`/${locale}/admin/levels/new`)}>
          <Plus className="me-2 h-4 w-4" />
          {t('addLevel')}
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={levels}
        searchKey="name"
        searchPlaceholder={t('searchLevels')}
      />

      <DeleteDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t('deleteLevel')}
        description={t('deleteLevelDescription')}
        itemName={levels.find(l => l.id === deleteId)?.name || ''}
        isLoading={isDeleting}
      />
    </div>
  );
}
