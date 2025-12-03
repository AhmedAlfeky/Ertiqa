'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormInput, FormImageUpload, FormSelect } from '@/app/components/form';
import {
  createCourseSchema,
  type CreateCourseInput,
} from '@/features/instructor/schemas_new';
import type {
  CourseWithDetails,
  Level,
  Language,
  Category,
} from '@/features/instructor/types';
import {
  createCourse,
  updateCourseBasicInfo,
  updateCourseSettings,
} from '@/features/instructor/actions';
import type { SubmitHandler } from 'react-hook-form';

interface CourseFormProps {
  course?: CourseWithDetails; // If provided, we're editing
  locale: string;
  levels: Level[];
  languages: Language[];
  categories: Category[];
  submitLabel?: string;
  showCancel?: boolean;
}

export function CourseForm({
  course,
  locale,
  levels,
  languages,
  categories,
  submitLabel = 'Save Changes',
  showCancel = true,
}: CourseFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Extract translations from course_translations array
  const arTranslation = course?.course_translations?.find(
    (t: any) => t.language_id === 1
  );
  const enTranslation = course?.course_translations?.find(
    (t: any) => t.language_id === 2
  );

  const form = useForm<CreateCourseInput>({
    resolver: zodResolver(createCourseSchema) as any,
    defaultValues: course
      ? {
          titleAr: arTranslation?.title || '',
          titleEn: enTranslation?.title || '',
          subtitleAr: arTranslation?.subtitle || '',
          subtitleEn: enTranslation?.subtitle || '',
          descriptionAr: arTranslation?.description || '',
          descriptionEn: enTranslation?.description || '',
          levelId: course.level_id || 1,
          categoryId: course.category_id || undefined,
          teachingLanguageId: course.teaching_language_id || 1,
          isFree: course.is_free !== undefined ? course.is_free : false,
          price: course.is_free
            ? undefined // Don't set price if course is free
            : course.price !== null && course.price !== undefined
            ? course.price
            : undefined,
          currency: course.currency || 'USD',
          isPublished: course.is_published || false,
          coverImageUrl: course.cover_image_url || '',
          promoVideoUrl: course.promo_video_url || undefined,
        }
      : {
          isFree: false,
          isPublished: false,
          currency: 'USD',
          teachingLanguageId: 1,
          price: undefined,
          titleAr: '',
          titleEn: '',
          descriptionAr: '',
          descriptionEn: '',
          levelId: 1,
          coverImageUrl: '',
        },
  });
  console.log(form.formState.errors);
  const isFree = form.watch('isFree');

  const handleSubmit: SubmitHandler<CreateCourseInput> = async data => {
    startTransition(async () => {
      if (course) {
        const basicInfoResult = await updateCourseBasicInfo(course.id, {
          titleAr: data.titleAr,
          titleEn: data.titleEn,
          subtitleAr: data.subtitleAr,
          subtitleEn: data.subtitleEn,
          descriptionAr: data.descriptionAr,
          descriptionEn: data.descriptionEn,
          coverImageUrl: data.coverImageUrl,
        });

        if (!basicInfoResult.success) {
          toast.error(basicInfoResult.error || 'Failed to update basic info');
          return;
        }

        // 2. Update Settings
        const priceValue = data.isFree
          ? 0
          : typeof data.price === 'string'
          ? parseFloat(data.price) || 0
          : data.price || 0;

        const settingsResult = await updateCourseSettings(course.id, {
          levelId: data.levelId,
          categoryId: data.categoryId,
          languageId: data.teachingLanguageId,
          isFree: data.isFree,
          price: priceValue,
          currency: data.currency,
          isPublished: data.isPublished,
        });

        if (!settingsResult.success) {
          toast.error(settingsResult.error || 'Failed to update settings');
          return;
        }

        toast.success('Course updated successfully');
        router.refresh();
      } else {
        // Create Mode
        const result = await createCourse(data, locale);

        if (result.success && result.data?.courseId) {
          toast.success('Course created successfully!');
          router.push(
            `/${locale}/instructor/courses/${result.data.courseId}/manage`
          );
        } else {
          toast.error(result.error || 'Failed to create course');
        }
      }
    });
  };

  // Transform options for Select components
  const levelOptions = (levels || []).map(l => ({
    value: l.id,
    label: l.name,
  }));
  const languageOptions = (languages || []).map(l => ({
    value: l.id,
    label: l.name,
  }));
  const categoryOptions = (categories || []).map(c => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Course Titles */}
          <div className="bg-card p-6 rounded-lg border space-y-4">
            <h2 className="text-xl font-semibold mb-4">Course Titles</h2>

            <FormInput
              name="titleAr"
              label="Arabic Title"
              placeholder="عنوان الدورة"
              formType="input"
              inputType="text"
              required
              disabled={isPending}
            />

            <FormInput
              name="titleEn"
              label="English Title"
              placeholder="Course Title"
              formType="input"
              inputType="text"
              required
              disabled={isPending}
            />
          </div>

          {/* Subtitles (Optional) */}
          <div className="bg-card p-6 rounded-lg border space-y-4">
            <h2 className="text-xl font-semibold mb-4">Subtitles (Optional)</h2>

            <FormInput
              name="subtitleAr"
              label="Arabic Subtitle"
              placeholder="عنوان فرعي"
              formType="input"
              inputType="text"
              disabled={isPending}
            />

            <FormInput
              name="subtitleEn"
              label="English Subtitle"
              placeholder="Course Subtitle"
              formType="input"
              inputType="text"
              disabled={isPending}
            />
          </div>

          {/* Descriptions */}
          <div className="bg-card p-6 rounded-lg border space-y-4">
            <h2 className="text-xl font-semibold mb-4">Descriptions</h2>

            <FormInput
              name="descriptionAr"
              label="Arabic Description"
              placeholder="وصف الدورة التدريبية..."
              formType="textarea"
              required
              disabled={isPending}
              rows={5}
            />

            <FormInput
              name="descriptionEn"
              label="English Description"
              placeholder="Course description..."
              formType="textarea"
              required
              disabled={isPending}
              rows={5}
            />
          </div>

          {/* Cover Image */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Cover Image</h2>
            <FormImageUpload
              name="coverImageUrl"
              label="Course Cover"
              description="Upload a high-quality cover image for your course"
              bucket="courses"
              folder="course-covers"
              maxSizeMB={5}
              required
            />
          </div>

          {/* Course Settings */}
          <div className="bg-card p-6 rounded-lg border space-y-4">
            <h2 className="text-xl font-semibold mb-4">Course Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect
                name="levelId"
                label="Course Level"
                options={levelOptions}
                placeholder="Select level"
                required
                disabled={isPending}
              />

              <FormSelect
                name="categoryId"
                label="Category"
                options={categoryOptions}
                placeholder="Select category"
                disabled={isPending}
              />

              <FormSelect
                name="teachingLanguageId"
                label="Teaching Language"
                options={languageOptions}
                placeholder="Select language"
                required
                disabled={isPending}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-card p-6 rounded-lg border space-y-4">
            <h2 className="text-xl font-semibold mb-4">Pricing</h2>

            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="isFree"
                checked={isFree}
                onCheckedChange={checked => {
                  const isFreeValue = !!checked;
                  form.setValue('isFree', isFreeValue);
                  // Clear price when course is free
                  if (isFreeValue) {
                    form.setValue('price', undefined);
                  }
                }}
                disabled={isPending}
              />
              <label
                htmlFor="isFree"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                This course is free
              </label>
            </div>

            {!isFree && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  name="price"
                  label="Price"
                  placeholder="99.99"
                  formType="input"
                  inputType="number"
                  required={!isFree}
                  disabled={isPending}
                />

                <FormSelect
                  name="currency"
                  label="Currency"
                  options={[
                    { value: 'USD', label: 'USD ($)' },
                    { value: 'EUR', label: 'EUR (€)' },
                    { value: 'EGP', label: 'EGP (E£)' },
                  ]}
                  disabled={isPending}
                />
              </div>
            )}
          </div>

          {/* Promo Video (Optional) */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">
              Promo Video (Optional)
            </h2>
            <FormInput
              name="promoVideoUrl"
              label="Video URL"
              placeholder="https://youtube.com/watch?v=..."
              formType="input"
              inputType="url"
              disabled={isPending}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            {showCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : submitLabel}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
