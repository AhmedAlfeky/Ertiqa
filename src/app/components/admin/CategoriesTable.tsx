'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/app/components/dashboard/DataTable';
import { DeleteDialog } from '@/app/components/dashboard/DeleteDialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { deleteCategory } from '../../../features/admin/actions';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface Category {
  id: number;
  slug: string;
  name_ar: string;
  name_en: string;
  created_at: string;
}

interface CategoriesTableProps {
  categories: Category[];
  locale: string;
}

export function CategoriesTable({ categories, locale }: CategoriesTableProps) {
  const t = useTranslations('admin');
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const result = await deleteCategory(deleteId);
      if (result.success) {
        toast.success(t('categoryDeleted'));
        router.refresh();
      } else {
        toast.error(result.error || t('categoryDeleteFailed'));
      }
    } catch (error) {
      toast.error(t('errorOccurred'));
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: 'id',
      header: t('id'),
    },
    {
      accessorKey: 'slug',
      header: t('slug'),
    },
    {
      accessorKey: 'name_en',
      header: t('nameEnglish'),
    },
    {
      accessorKey: 'name_ar',
      header: t('nameArabic'),
      cell: ({ row }) => <span dir="rtl">{row.getValue('name_ar')}</span>,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                router.push(`/${locale}/admin/categories/${category.id}`)
              }
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteId(category.id)}
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
        <Button onClick={() => router.push(`/${locale}/admin/categories/new`)}>
          <Plus className="me-2 h-4 w-4" />
          {t('addCategory')}
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        searchKey="name_en"
        searchPlaceholder={t('searchCategories')}
      />

      <DeleteDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t('deleteCategory')}
        description={t('deleteCategoryDescription')}
        itemName={categories.find(c => c.id === deleteId)?.name_en || ''}
        isLoading={isDeleting}
      />
    </div>
  );
}
