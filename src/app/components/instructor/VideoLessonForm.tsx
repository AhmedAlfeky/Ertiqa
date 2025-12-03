'use client';

import { useTransition } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import FormVideoUpload from '@/app/components/form/FormVideoUpload';
import FormInput from '@/app/components/form/FormInput';

const videoLessonSchema = z.object({
  title_ar: z.string().min(3, 'Arabic title must be at least 3 characters'),
  title_en: z.string().min(3, 'English title must be at least 3 characters'),
  description_ar: z.string().optional(),
  description_en: z.string().optional(),
  video_url: z
    .string()
    .url('Please upload a video or enter a valid URL')
    .min(1, 'Video URL is required'),
  duration: z.coerce.number().min(0).optional(),
  is_free_preview: z.boolean().default(false),
});

type VideoLessonFormData = z.infer<typeof videoLessonSchema>;

interface VideoLessonFormProps {
  unitId: number;
  lesson?: {
    id: number;
    title_ar: string;
    title_en: string;
    content_ar?: string | null;
    content_en?: string | null;
    video_url?: string | null;
    video_duration?: number | null;
    is_free_preview: boolean;
  };
  onSuccess?: () => void;
  isFullPage?: boolean;
  courseId?: number;
  locale?: string;
}

export function VideoLessonForm({
  unitId,
  lesson,
  onSuccess,
  isFullPage,
  courseId,
  locale,
}: VideoLessonFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = !!lesson;

  const form = useForm<VideoLessonFormData>({
    resolver: zodResolver(videoLessonSchema) as any,
    defaultValues: lesson
      ? {
          title_ar: lesson.title_ar || '',
          title_en: lesson.title_en || '',
          description_ar: lesson.content_ar || '',
          description_en: lesson.content_en || '',
          video_url: lesson.video_url || '',
          duration: lesson.video_duration
            ? Math.round(lesson.video_duration / 60)
            : 0,
          is_free_preview: lesson.is_free_preview || false,
        }
      : {
          title_ar: '',
          title_en: '',
          description_ar: '',
          description_en: '',
          video_url: '',
          duration: 0,
          is_free_preview: false,
        },
  });

  const handleSubmit = async (data: VideoLessonFormData) => {
    startTransition(async () => {
      const { createVideoLesson, updateVideoLesson } = await import(
        '@/features/instructor/curriculum-actions'
      );

      const result =
        isEditing && lesson
          ? await updateVideoLesson(lesson.id, {
              unitId,
              titleAr: data.title_ar,
              titleEn: data.title_en,
              contentAr: data.description_ar,
              contentEn: data.description_en,
              videoUrl: data.video_url,
              videoDuration: data.duration ? data.duration * 60 : undefined,
              isFreePreview: data.is_free_preview,
            })
          : await createVideoLesson({
              unitId,
              titleAr: data.title_ar,
              titleEn: data.title_en,
              contentAr: data.description_ar,
              contentEn: data.description_en,
              videoUrl: data.video_url,
              videoDuration: data.duration ? data.duration * 60 : undefined,
              isFreePreview: data.is_free_preview,
            });

      if (result.success) {
        toast.success(
          isEditing
            ? 'Video lesson updated successfully'
            : 'Video lesson created successfully'
        );
        if (isFullPage && courseId && locale) {
          // If editing, just refresh - don't redirect
          if (isEditing) {
            router.refresh();
          } else {
            // If creating, redirect to manage page
            router.push(`/${locale}/instructor/courses/${courseId}/manage`);
          }
        } else if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(
          result.error || `Failed to ${isEditing ? 'update' : 'create'} lesson`
        );
      }
    });
  };

  return (
    <div className={' '}>
      {isFullPage && courseId && locale && (
        <Link href={`/${locale}/instructor/courses/${courseId}/manage`}>
          <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Curriculum
          </Button>
        </Link>
      )}

      <Card className={'p-6'}>
        <FormProvider {...form}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Arabic Fields */}
                <div className="space-y-4">
                  <FormInput
                    name="title_ar"
                    label="Title (Arabic)"
                    placeholder="عنوان الدرس"
                    formType="input"
                    inputType="text"
                    required
                    disabled={isPending}
                  />
                  <FormInput
                    name="description_ar"
                    label="Description (Arabic)"
                    placeholder="وصف الدرس..."
                    formType="textarea"
                    rows={4}
                    disabled={isPending}
                  />
                </div>

                {/* English Fields */}
                <div className="space-y-4">
                  <FormInput
                    name="title_en"
                    label="Title (English)"
                    placeholder="Lesson Title"
                    formType="input"
                    inputType="text"
                    required
                    disabled={isPending}
                  />
                  <FormInput
                    name="description_en"
                    label="Description (English)"
                    placeholder="Lesson description..."
                    formType="textarea"
                    rows={4}
                    disabled={isPending}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <FormVideoUpload
                  name="video_url"
                  label="Video *"
                  description="Upload a video file or paste a video URL. Supported formats: MP4, WebM, OGG, MOV (max 500MB)"
                  maxSizeMB={500}
                  required
                />

                <FormInput
                  name="duration"
                  label="Duration (minutes)"
                  placeholder="0"
                  formType="input"
                  inputType="number"
                  disabled={isPending}
                />
              </div>

              <FormField
                control={form.control}
                name="is_free_preview"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Free Preview</FormLabel>
                      <FormDescription>
                        Allow students to watch this lesson without purchasing
                        the course
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3">
                {!isFullPage && onSuccess && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onSuccess}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isPending}
                  className={isFullPage ? 'w-full md:w-auto' : ''}
                >
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditing ? 'Update Video Lesson' : 'Create Video Lesson'}
                </Button>
              </div>
            </form>
          </Form>
        </FormProvider>
      </Card>
    </div>
  );
}
