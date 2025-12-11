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
import { createLevel, updateLevel } from '../../../features/admin/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

const levelSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type LevelFormData = z.infer<typeof levelSchema>;

interface LevelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level?: {
    id: number;
    name: string;
  };
  locale: string;
}

export function LevelDialog({
  open,
  onOpenChange,
  level,
  locale,
}: LevelDialogProps) {
  const router = useRouter();
  const t = useTranslations('admin');
  const isEditing = !!level;
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const form = useForm<LevelFormData>({
    resolver: zodResolver(levelSchema),
    defaultValues: {
      name: '',
    },
  });

  // Reset form when level changes
  useEffect(() => {
    if (level) {
      form.reset({
        name: level.name,
      });
    } else {
      form.reset({
        name: '',
      });
    }
  }, [level, form]);

  const onSubmit = async (data: LevelFormData) => {
    try {
      const result = isEditing
        ? await updateLevel(level.id, data)
        : await createLevel(data);

      if (result.success) {
        toast.success(
          isEditing
            ? t('levelUpdated') || 'Level updated successfully'
            : t('levelCreated') || 'Level created successfully'
        );
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to save level');
      }
    } catch (error) {
      toast.error(t('errorOccurred') || 'An error occurred');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader dir={dir}>
          <DialogTitle>
            {isEditing ? t('editLevel') : t('newLevel')}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t('editLevelDescription')
              : t('createLevelDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Level Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
