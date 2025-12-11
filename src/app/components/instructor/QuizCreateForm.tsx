'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createQuizLesson } from '@/features/instructor/curriculum-actions';

const quizSchema = z.object({
  unitId: z.coerce.number().min(1, 'Please select a unit'),
  title_ar: z.string().min(3, 'Arabic title must be at least 3 characters'),
  title_en: z.string().min(3, 'English title must be at least 3 characters'),
});

type QuizFormData = z.infer<typeof quizSchema>;

interface QuizCreateFormProps {
  courseId: number;
  unitId?: number;
  units: Array<{ id: number; title_ar: string; title_en: string }>;
  locale: string;
}

export function QuizCreateForm({ courseId, unitId, units, locale }: QuizCreateFormProps) {
  const t = useTranslations('instructor');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      unitId: unitId || undefined,
      title_ar: '',
      title_en: '',
    },
  });

  const handleSubmit = async (data: QuizFormData) => {
    startTransition(async () => {
      const result = await createQuizLesson({
        unitId: data.unitId,
        titleAr: data.title_ar,
        titleEn: data.title_en,
        questions: [], // Will add questions on the next page
      });

      if (result.success && result.data) {
        toast.success(t('quizCreatedSuccessfully'));
        router.push(`/${locale}/instructor/courses/${courseId}/manage/quiz/${result.data.lessonId}`);
      } else {
        toast.error(result.error || t('failedToCreateQuiz'));
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/instructor/courses/${courseId}/manage`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{t('createNewQuiz')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('setUpQuizDetails')}
          </p>
        </div>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Unit Selection */}
            <FormField
              control={form.control}
              name="unitId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('selectUnit')} *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                    disabled={isPending || !!unitId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('chooseUnitForQuiz')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id.toString()}>
                          {unit.title_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t('quizWillBeAddedToUnit')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quiz Titles */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('arabicTitle')} *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="عنوان الاختبار"
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
                    <FormLabel>{t('englishTitle')} *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Quiz Title"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Link href={`/${locale}/instructor/courses/${courseId}/manage`}>
                <Button type="button" variant="outline" disabled={isPending}>
                  {t('cancel')}
                </Button>
              </Link>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('createQuizAndAddQuestions')}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
