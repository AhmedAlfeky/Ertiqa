'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  GripVertical,
  Video,
  FileQuestion,
  ExternalLink,
} from 'lucide-react';
import { deleteLesson } from '../../../features/instructor/curriculum-actions';
import { toast } from 'sonner';

interface Lesson {
  id: number;
  title_ar: string;
  title_en: string;
  lesson_type: 'video' | 'quiz';
  video_duration?: number;
  video_url?: string;
  is_free_preview: boolean;
  order_index: number;
}

interface Unit {
  id: number;
  title_ar: string;
  title_en: string;
  description_ar?: string | null;
  description_en?: string | null;
  order_index: number;
  lessons?: Lesson[];
}

interface UnitAccordionProps {
  unit: Unit;
  courseId: number;
  onEditUnit: () => void;
  onDeleteUnit: () => void;
  onAddLesson: () => void;
}

import { DeleteDialog } from '@/app/components/dashboard/DeleteDialog';

export function UnitAccordion({
  unit,
  courseId,
  onEditUnit,
  onDeleteUnit,
  onAddLesson,
}: UnitAccordionProps) {
  const t = useTranslations('instructor');
  const [isOpen, setIsOpen] = useState(false);
  const [deleteLessonId, setDeleteLessonId] = useState<number | null>(null);
  const [showDeleteUnitDialog, setShowDeleteUnitDialog] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: unit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDeleteLesson = async () => {
    if (!deleteLessonId) return;

    try {
      const result = await deleteLesson(deleteLessonId);
      if (result.success) {
        toast.success('Lesson deleted successfully');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete lesson');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the lesson');
    } finally {
      setDeleteLessonId(null);
    }
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className="overflow-hidden border-l-4 border-l-primary"
      >
        <div className="flex items-center bg-card hover:bg-accent/5 transition-colors">
          <button
            {...attributes}
            {...listeners}
            className="px-3 py-6 cursor-grab active:cursor-grabbing hover:bg-muted/50 transition-colors border-r h-full flex items-center justify-center"
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>

          <div className="flex-1 min-w-0">
            <Accordion
              type="single"
              collapsible
              value={isOpen ? 'unit' : ''}
              onValueChange={value => setIsOpen(value === 'unit')}
            >
              <AccordionItem value="unit" className="border-none">
                <div className="flex items-center pr-4">
                  <AccordionTrigger className="flex-1 px-4 py-4 hover:no-underline group">
                    <div className="flex items-center justify-between gap-4 flex-1 text-left min-w-0 w-full">
                      <div className="flex flex-col items-start gap-1 min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className="font-mono bg-background"
                          >
                            Unit {unit.order_index + 1}
                          </Badge>
                          <h3 className="font-semibold text-lg truncate">
                            {unit.title_en}
                          </h3>
                        </div>
                        {unit.description_en && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {unit.description_en}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant="secondary"
                          className="whitespace-nowrap"
                        >
                          {unit.lessons?.length || 0} {t('lessons')}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={e => {
                        e.stopPropagation();
                        router.push(
                          `/${locale}/instructor/courses/${courseId}/manage/units/${unit.id}`
                        );
                      }}
                      className="h-8 px-3 text-xs"
                    >
                      <ExternalLink className="h-3 w-3 mr-1.5" />
                      View Details
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={e => e.stopPropagation()}
                      >
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={onEditUnit}>
                          <Edit className="h-4 w-4 mr-2" />
                          {t('editUnit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setShowDeleteUnitDialog(true)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t('deleteUnit')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <AccordionContent className="px-0 pb-0 border-t">
                  <div className="bg-muted/30 p-4 space-y-3">
                    {unit.lessons && unit.lessons.length > 0 ? (
                      unit.lessons.map((lesson, index) => {
                        const lessonUrl =
                          lesson.lesson_type === 'quiz'
                            ? `/${locale}/instructor/courses/${courseId}/manage/quiz/${lesson.id}`
                            : `/${locale}/instructor/courses/${courseId}/manage/units/${unit.id}/lessons/${lesson.id}`;

                        return (
                          <Link
                            key={lesson.id}
                            href={lessonUrl}
                            className="group relative flex items-center gap-3 bg-card rounded-md border p-3 hover:shadow-sm transition-all cursor-pointer"
                          >
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary shrink-0">
                              {lesson.lesson_type === 'video' ? (
                                <Video className="h-4 w-4" />
                              ) : (
                                <FileQuestion className="h-4 w-4" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-mono text-muted-foreground">
                                  {index + 1}.
                                </span>
                                <h4 className="font-medium truncate">
                                  {lesson.title_en}
                                </h4>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Badge
                                  variant="outline"
                                  className="text-[10px] h-5 px-1.5 uppercase tracking-wider"
                                >
                                  {lesson.lesson_type}
                                </Badge>
                                {lesson.video_duration && (
                                  <>
                                    <span>•</span>
                                    <span>
                                      {Math.round(lesson.video_duration / 60)}{' '}
                                      min
                                    </span>
                                  </>
                                )}
                                {lesson.is_free_preview && (
                                  <Badge
                                    variant="secondary"
                                    className="text-[10px] h-5 bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                                  >
                                    Free Preview
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  asChild
                                  onClick={e => e.stopPropagation()}
                                >
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {lesson.lesson_type === 'quiz' && (
                                    <DropdownMenuItem
                                      onClick={e => {
                                        e.stopPropagation();
                                        router.push(
                                          `/${locale}/instructor/courses/${courseId}/manage/quiz/${lesson.id}`
                                        );
                                      }}
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      {t('editLesson')}
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={e => {
                                      e.stopPropagation();
                                      setDeleteLessonId(lesson.id);
                                    }}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {t('deleteLesson')}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </Link>
                        );
                      })
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed rounded-lg">
                        <div className="p-3 rounded-full bg-muted mb-3">
                          <Video className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          No lessons yet
                        </p>
                        <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-4">
                          Get started by adding your first video or quiz lesson
                          to this unit.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onAddLesson}
                        >
                          <Plus className="h-3 w-3 mr-2" />
                          Add Lesson
                        </Button>
                      </div>
                    )}

                    {unit.lessons && unit.lessons.length > 0 && (
                      <Button
                        variant="outline"
                        className="w-full border-dashed"
                        onClick={onAddLesson}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {t('addLesson')}
                      </Button>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </Card>

      <DeleteDialog
        isOpen={showDeleteUnitDialog}
        onClose={() => setShowDeleteUnitDialog(false)}
        onConfirm={() => {
          onDeleteUnit();
          setShowDeleteUnitDialog(false);
        }}
        title={t('deleteUnitTitle')}
        description={t('deleteUnitDescription')}
        itemName={unit.title_en}
      />

      <DeleteDialog
        isOpen={!!deleteLessonId}
        onClose={() => setDeleteLessonId(null)}
        onConfirm={handleDeleteLesson}
        title={t('deleteLesson')}
        description={t('confirmDeleteLessonDesc')}
      />
    </>
  );
}
