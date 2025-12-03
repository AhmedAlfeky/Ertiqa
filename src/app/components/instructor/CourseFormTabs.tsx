'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import FormInput from '@/app/components/form/FormInput';
import { ImageUpload } from './ImageUpload';
import { toast } from 'sonner';
import {
  courseBasicInfoSchema,
  courseSettingsSchema,
  type CourseBasicInfoInput,
  type CourseSettingsInput,
} from '@/features/instructor/schemas';
import type {
  Course,
  Level,
  Language,
} from '@/features/instructor/types';
import {
  updateCourseBasicInfo,
  updateCourseSettings,
} from '@/features/instructor/actions';
import { CurriculumTab } from './CurriculumTab';

interface CourseFormTabsProps {
  course: Course;
  levels: Level[];
  languages: Language[];
  price?: number;
}

export function CourseFormTabs({
  course,
  levels,
  languages,
  price = 0,
}: CourseFormTabsProps) {
  const t = useTranslations('instructor');
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState('basic');

  // Basic Info Form
  const basicInfoForm = useForm<CourseBasicInfoInput>({
    resolver: zodResolver(courseBasicInfoSchema),
    defaultValues: {
      title: course.title,
      summary: course.summary || '',
      description: course.description || '',
      coverImageUrl: course.coverImageUrl || null,
    },
  });

  // Settings Form
  const settingsForm = useForm<CourseSettingsInput>({
    resolver: zodResolver(courseSettingsSchema),
    defaultValues: {
      price: price,
      levelId: course.levelId || 0,
      languageId: course.languageId || 0,
      isPublished: course.status === 2,
    },
  });

  const handleBasicInfoSubmit = async (data: CourseBasicInfoInput) => {
    startTransition(async () => {
      const result = await updateCourseBasicInfo(course.id, data);
      if (result.success) {
        toast.success(t('courseUpdated'));
      } else {
        toast.error(result.error || t('updateFailed'));
      }
    });
  };

  const handleSettingsSubmit = async (data: CourseSettingsInput) => {
    startTransition(async () => {
      const result = await updateCourseSettings(course.id, data);
      if (result.success) {
        toast.success(t('settingsUpdated'));
      } else {
        toast.error(result.error || t('updateFailed'));
      }
    });
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">{t('basicInfo')}</TabsTrigger>
        <TabsTrigger value="settings">{t('settings')}</TabsTrigger>
        <TabsTrigger value="curriculum">{t('curriculum')}</TabsTrigger>
      </TabsList>

      {/* Tab 1: Basic Info */}
      <TabsContent value="basic" className="space-y-4 mt-4">
        <Form {...basicInfoForm}>
          <form
            onSubmit={basicInfoForm.handleSubmit(handleBasicInfoSubmit)}
            className="space-y-4"
          >
            <FormInput
              name="title"
              formType="input"
              inputType="text"
              label={t('courseTitle')}
              placeholder={t('courseTitlePlaceholder')}
              required
              disabled={isPending}
            />

            <FormInput
              name="summary"
              formType="textarea"
              label={t('summary')}
              placeholder={t('summaryPlaceholder')}
              disabled={isPending}
              rows={3}
            />

            <FormInput
              name="description"
              formType="textarea"
              label={t('description')}
              placeholder={t('descriptionPlaceholder')}
              disabled={isPending}
              rows={6}
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('courseImage')}
              </label>
              <ImageUpload
                value={basicInfoForm.watch('coverImageUrl')}
                onChange={url => basicInfoForm.setValue('coverImageUrl', url)}
                disabled={isPending}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? t('saving') : t('saveChanges')}
              </Button>
            </div>
          </form>
        </Form>
      </TabsContent>

      {/* Tab 2: Settings */}
      <TabsContent value="settings" className="space-y-4 mt-4">
        <Form {...settingsForm}>
          <form
            onSubmit={settingsForm.handleSubmit(handleSettingsSubmit)}
            className="space-y-4"
          >
            <FormInput
              name="price"
              formType="input"
              inputType="number"
              label={t('price')}
              placeholder="0"
              disabled={isPending}
              min={0}
            />

            <FormInput
              name="levelId"
              formType="select"
              label={t('level')}
              options={levels.map(level => ({
                value: level.id.toString(),
                label: level.name,
              }))}
              required
              disabled={isPending}
            />

            <FormInput
              name="languageId"
              formType="select"
              label={t('language')}
              options={languages.map(lang => ({
                value: lang.id.toString(),
                label: lang.name,
              }))}
              required
              disabled={isPending}
            />

            <FormInput
              name="isPublished"
              formType="checkbox"
              label={t('publishCourse')}
              disabled={isPending}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? t('saving') : t('saveSettings')}
              </Button>
            </div>
          </form>
        </Form>
      </TabsContent>

      {/* Tab 3: Curriculum */}
      <TabsContent value="curriculum" className="space-y-4 mt-4">
        <CurriculumTab courseId={course.id} />
      </TabsContent>
    </Tabs>
  );
}
