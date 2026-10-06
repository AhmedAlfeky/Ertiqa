'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Video, FileQuestion, Loader2 } from 'lucide-react';
import { createQuizLesson } from '@/features/instructor/curriculum-actions';

// Simple schema for quiz creation (titles only)
const quizTitleSchema = z.object({
  title_ar: z.string().min(3, 'Arabic title must be at least 3 characters'),
  title_en: z.string().min(3, 'English title must be at least 3 characters'),
});

type QuizTitleData = z.infer<typeof quizTitleSchema>;

interface AddLessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unitId: number;
  onSuccess: () => void;
}

export function AddLessonDialog({
  open,
  onOpenChange,
  unitId,
  onSuccess,
}: AddLessonDialogProps) {
  const t = useTranslations('instructor');
  const router = useRouter();
  const params = useParams();
  const locale = useLocale();
  const [step, setStep] = useState<'type-selection' | 'quiz-details'>(
    'type-selection'
  );
  const [isPending, startTransition] = useTransition();

  const localeParam = params.locale as string;
  const courseId = params.courseId as string;
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const form = useForm<QuizTitleData>({
    resolver: zodResolver(quizTitleSchema),
    defaultValues: {
      title_ar: '',
      title_en: '',
    },
  });

  const handleClose = () => {
    setStep('type-selection');
    form.reset();
    onOpenChange(false);
  };

  const handleVideoSelect = () => {
    // Redirect to full page video lesson creator
    router.push(
      `/${localeParam}/instructor/courses/${courseId}/manage/units/${unitId}/lessons/create-video`
    );
    handleClose();
  };

  const handleQuizSubmit = async (data: QuizTitleData) => {
    startTransition(async () => {
      const result = await createQuizLesson({
        unitId,
        titleAr: data.title_ar,
        titleEn: data.title_en,
        questions: [], // Initialize with empty questions
      });

      if (result.success && result.data) {
        toast.success(t('quizCreatedSuccessfully'));
        // Redirect to quiz builder
        router.push(
          `/${locale}/instructor/courses/${courseId}/manage/quiz/${result.data.lessonId}`
        );
        handleClose();
        onSuccess();
      } else {
        toast.error(result.error || t('failedToCreateQuiz'));
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {step === 'type-selection' ? t('addNewLesson') : t('createQuiz')}
          </DialogTitle>
          <DialogDescription>
            {step === 'type-selection'
              ? t('chooseLessonType')
              : t('enterQuizTitle')}
          </DialogDescription>
        </DialogHeader>

        {step === 'type-selection' ? (
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              variant="outline"
              className="h-32 flex flex-col gap-3 hover:border-primary hover:bg-primary/5"
              onClick={handleVideoSelect}
            >
              <Video className="h-8 w-8 text-primary" />
              <span className="font-semibold">{t('videoLesson')}</span>
            </Button>

            <Button
              variant="outline"
              className="h-32 flex flex-col gap-3 hover:border-primary hover:bg-primary/5"
              onClick={() => setStep('quiz-details')}
            >
              <FileQuestion className="h-8 w-8 text-primary" />
              <span className="font-semibold">{t('quiz')}</span>
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleQuizSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('arabicTitle')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        dir="rtl"
                        placeholder="عنوان الاختبار"
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
                    <FormLabel>{t('englishTitle')}</FormLabel>
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

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep('type-selection')}
                  disabled={isPending}
                >
                  {t('back')}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t('createAndAddQuestions')}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
