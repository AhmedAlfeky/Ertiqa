'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Video,
  FileQuestion,
  GripVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { AddUnitDialog } from './AddUnitDialog';
import { AddLessonDialog } from './AddLessonDialog';
import { DeleteDialog } from './DeleteDialog';
import {
  updateUnit,
  deleteUnit,
} from '../../../features/instructor/curriculum-actions';

interface UnitManageClientProps {
  courseId: number;
  unit: any;
  locale: string;
}

export function UnitManageClient({
  courseId,
  unit,
  locale,
}: UnitManageClientProps) {
  const t = useTranslations('instructor');
  const router = useRouter();
  const [showEditUnit, setShowEditUnit] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [showDeleteUnit, setShowDeleteUnit] = useState(false);

  const handleUpdateUnit = async (data: any) => {
    const result = await updateUnit(unit.id, {
      titleAr: data.title_ar,
      titleEn: data.title_en,
      descriptionAr: data.description_ar,
      descriptionEn: data.description_en,
    });

    if (result.success) {
      toast.success(t('unitUpdatedSuccessfully'));
      setShowEditUnit(false);
      router.refresh();
    } else {
      toast.error(result.error || t('failedToUpdateUnit'));
      throw new Error(result.error);
    }
  };

  const handleDeleteUnit = async () => {
    const result = await deleteUnit(unit.id);

    if (result.success) {
      toast.success(t('unitDeletedSuccessfully'));
      router.push(`/${locale}/instructor/courses/${courseId}/manage`);
    } else {
      toast.error(result.error || t('failedToDeleteUnit'));
    }
  };

  const handleLessonClick = (lesson: any) => {
    if (lesson.lesson_type === 'quiz') {
      router.push(
        `/${locale}/instructor/courses/${courseId}/manage/quiz/${lesson.id}`
      );
    } else {
      // For video lessons, navigate to lesson edit page
      router.push(
        `/${locale}/instructor/courses/${courseId}/manage/units/${unit.id}/lessons/${lesson.id}`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href={`/${locale}/instructor/courses/${courseId}/manage`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          {t('back') || 'Back to Course'}
        </Link>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="font-mono">
                Unit {unit.order_index + 1}
              </Badge>
              <h1 className="text-3xl font-bold">
                {unit.title_en || unit.title_ar}
              </h1>
            </div>
            {unit.title_ar &&
              unit.title_en &&
              unit.title_ar !== unit.title_en && (
                <p className="text-muted-foreground" dir="rtl">
                  {unit.title_ar}
                </p>
              )}
            {unit.description_en && (
              <p className="text-muted-foreground mt-2">
                {unit.description_en}
              </p>
            )}
            {unit.description_ar &&
              unit.description_ar !== unit.description_en && (
                <p className="text-muted-foreground mt-1" dir="rtl">
                  {unit.description_ar}
                </p>
              )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowEditUnit(true)}>
              <Edit className="mr-2 h-4 w-4" />
              {t('editUnit')}
            </Button>
            <Button onClick={() => setShowAddLesson(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t('addLesson')}
            </Button>
          </div>
        </div>
      </div>

      {/* Unit Info Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2">{t('unitInformation')}</h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{unit.lessons?.length || 0} {t('lessons')}</span>
              <span>
                {unit.lessons?.filter((l: any) => l.lesson_type === 'quiz')
                  .length || 0}{' '}
                {t('quizzes')}
              </span>
              <span>
                {unit.lessons?.filter((l: any) => l.lesson_type === 'video')
                  .length || 0}{' '}
                {t('videos')}
              </span>
            </div>
          </div>
          <Button variant="destructive" onClick={() => setShowDeleteUnit(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t('deleteUnit')}
          </Button>
        </div>
      </Card>

      {/* Lessons List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t('lessons')}</h2>
        </div>

        {unit.lessons && unit.lessons.length > 0 ? (
          <div className="space-y-3">
            {unit.lessons.map((lesson: any, index: number) => (
              <Card
                key={lesson.id}
                className="p-4 hover:bg-accent/5 transition-colors cursor-pointer border"
                onClick={() => handleLessonClick(lesson)}
              >
                <div className="flex items-start gap-4">
                  <button
                    className="mt-1 cursor-grab active:cursor-grabbing hover:bg-muted/80 p-1 rounded transition-colors"
                    aria-label="Drag to reorder"
                    onClick={e => e.stopPropagation()}
                  >
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {index + 1}
                      </Badge>
                      {lesson.lesson_type === 'quiz' ? (
                        <FileQuestion className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Video className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Badge
                        variant={
                          lesson.lesson_type === 'quiz'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {lesson.lesson_type === 'quiz' ? t('quiz') : t('video')}
                      </Badge>
                      {lesson.is_free_preview && (
                        <Badge variant="outline">{t('freePreview')}</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-base mb-1">
                      {lesson.title_en || lesson.title_ar}
                    </h3>
                    {lesson.title_ar &&
                      lesson.title_en &&
                      lesson.title_ar !== lesson.title_en && (
                        <p className="text-sm text-muted-foreground" dir="rtl">
                          {lesson.title_ar}
                        </p>
                      )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2">{t('noLessonsYet')}</h3>
              <p className="text-muted-foreground mb-6">
                {t('startBuildingUnit')}
              </p>
              <Button onClick={() => setShowAddLesson(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t('addFirstLesson')}
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Edit Unit Dialog */}
      <AddUnitDialog
        open={showEditUnit}
        onOpenChange={setShowEditUnit}
        onSubmit={handleUpdateUnit}
        initialData={{
          title_ar: unit.title_ar,
          title_en: unit.title_en,
          description_ar: unit.description_ar || '',
          description_en: unit.description_en || '',
        }}
        mode="edit"
      />

      {/* Add Lesson Dialog */}
      <AddLessonDialog
        open={showAddLesson}
        onOpenChange={setShowAddLesson}
        unitId={unit.id}
        onSuccess={() => {
          setShowAddLesson(false);
          router.refresh();
        }}
      />

      {/* Delete Unit Dialog */}
      <DeleteDialog
        isOpen={showDeleteUnit}
        onClose={() => setShowDeleteUnit(false)}
        onConfirm={handleDeleteUnit}
        title={t('deleteUnitTitle')}
        description={t('deleteUnitDescription')}
        itemName={unit.title_en}
      />
    </div>
  );
}
