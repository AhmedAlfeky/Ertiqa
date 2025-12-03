'use client';

import { useState, useTransition, useEffect } from 'react';
import { useTranslations } from 'next-intl';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const unitSchema = z.object({
  title_ar: z.string().min(3, 'Title must be at least 3 characters'),
  title_en: z.string().min(3, 'Title must be at least 3 characters'),
  description_ar: z.string().optional(),
  description_en: z.string().optional(),
});

type UnitFormData = z.infer<typeof unitSchema>;

interface AddUnitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UnitFormData) => Promise<void>;
  initialData?: Partial<UnitFormData>;
  mode?: 'create' | 'edit';
}

export function AddUnitDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode = 'create',
}: AddUnitDialogProps) {
  const t = useTranslations('instructor');
  const [isPending, startTransition] = useTransition();

  const form = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      title_ar: '',
      title_en: '',
      description_ar: '',
      description_en: '',
    },
  });

  // Reset form when dialog opens or initialData changes
  useEffect(() => {
    if (open) {
      form.reset({
        title_ar: initialData?.title_ar || '',
        title_en: initialData?.title_en || '',
        description_ar: initialData?.description_ar || '',
        description_en: initialData?.description_en || '',
      });
    }
  }, [open, initialData, form]);

  const handleSubmit = (data: UnitFormData) => {
    startTransition(async () => {
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? t('addUnit') : t('editUnit')}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Add a new unit to organize your course lessons'
              : 'Update unit information'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('unitTitleAr')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="عنوان الوحدة"
                        dir="rtl"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('unitTitleEn')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Unit Title"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="description_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('unitDescription')} (Arabic) <span className="text-muted-foreground">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="وصف الوحدة..."
                        dir="rtl"
                        rows={3}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('unitDescription')} (English) <span className="text-muted-foreground">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Unit description..."
                        rows={3}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'create' ? t('create') : t('update')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
