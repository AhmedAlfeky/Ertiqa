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
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const result = await deleteCategory(deleteId);
      if (result.success) {
        toast.success('Category deleted successfully');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete category');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
    },
    {
      accessorKey: 'name_en',
      header: 'Name (English)',
    },
    {
      accessorKey: 'name_ar',
      header: 'Name (Arabic)',
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
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        searchKey="name_en"
        searchPlaceholder="Search categories..."
      />

      <DeleteDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        itemName={categories.find(c => c.id === deleteId)?.name_en || ''}
        isLoading={isDeleting}
      />
    </div>
  );
}
