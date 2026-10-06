'use client';

import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  GripVertical,
  Video,
  FileQuestion,
  Clock,
  Eye,
} from 'lucide-react';

interface Lesson {
  id: number;
  title_ar: string;
  title_en: string;
  lesson_type: 'video' | 'quiz';
  duration?: number;
  video_url?: string;
  is_free_preview: boolean;
  order_index: number;
}

interface LessonCardProps {
  lesson: Lesson;
  locale: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function LessonCard({ lesson, locale, onEdit, onDelete }: LessonCardProps) {
  const t = useTranslations('instructor');

  const getTitle = () => {
    return locale === 'ar' ? lesson.title_ar : lesson.title_en;
  };

  const isVideo = lesson.lesson_type === 'video';

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 p-4">
        <button
          className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>

        <div className="flex-shrink-0">
          {isVideo ? (
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Video className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <FileQuestion className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium truncate">{getTitle()}</h4>
            {lesson.is_free_preview && (
              <Badge variant="secondary" className="text-xs">
                <Eye className="h-3 w-3 mr-1" />
                {t('freePreview')}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="capitalize">
              {isVideo ? t('videoLesson') : t('quizLesson')}
            </span>
            {lesson.duration && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {lesson.duration} {t('duration').toLowerCase().replace('(minutes)', 'min')}
                </span>
              </>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              {t('editLesson')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              {t('deleteLesson')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
