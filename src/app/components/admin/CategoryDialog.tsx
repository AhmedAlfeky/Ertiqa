'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  createCategory,
  updateCategory,
} from '../../../features/admin/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

const categorySchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    ),
  name_ar: z.string().min(1, 'Arabic name is required'),
  name_en: z.string().min(1, 'English name is required'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: {
    id: number;
    slug: string;
    name_ar: string;
    name_en: string;
  };
  locale: string;
}

export function CategoryDialog({ open, onOpenChange, category, locale }: CategoryDialogProps) {
  const router = useRouter();
  const t = useTranslations('admin');
  const isEditing = !!category;
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      slug: '',
      name_ar: '',
      name_en: '',
    },
  });

  // Reset form when category changes
  useEffect(() => {
    if (category) {
      form.reset({
        slug: category.slug,
        name_ar: category.name_ar,
        name_en: category.name_en,
      });
    } else {
      form.reset({
        slug: '',
        name_ar: '',
        name_en: '',
      });
    }
  }, [category, form]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const result = isEditing
        ? await updateCategory(category.id, data)
        : await createCategory(data);

      if (result.success) {
        toast.success(
          isEditing
            ? t('categoryUpdated') || 'Category updated successfully'
            : t('categoryCreated') || 'Category created successfully'
        );
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to save category');
      }
    } catch (error) {
      toast.error(t('errorOccurred') || 'An error occurred');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" dir={dir}>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('editCategory') : t('newCategory')}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t('editCategoryDescription')
              : t('createCategoryDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="category-slug" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (English) *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Category Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (Arabic) *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="اسم الفئة" dir="rtl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter dir={dir}>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? t('update') : t('create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

