'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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

const levelSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type LevelFormData = z.infer<typeof levelSchema>;

interface LevelFormProps {
  level?: {
    id: number;
    name: string;
  };
  locale: string;
}

export function LevelForm({ level, locale }: LevelFormProps) {
  const router = useRouter();
  const isEditing = !!level;

  const form = useForm<LevelFormData>({
    resolver: zodResolver(levelSchema),
    defaultValues: level || {
      name: '',
    },
  });

  const onSubmit = async (data: LevelFormData) => {
    try {
      const result = isEditing
        ? await updateLevel(level.id, data)
        : await createLevel(data);

      if (result.success) {
        toast.success(
          isEditing
            ? 'Level updated successfully'
            : 'Level created successfully'
        );
        router.push(`/${locale}/admin/levels`);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to save level');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="me-2 h-4 w-4 animate-spin" />
            )}
            {isEditing ? 'Update Level' : 'Create Level'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
