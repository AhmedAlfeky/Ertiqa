'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, GripVertical, CheckCircle2 } from 'lucide-react';

interface QuestionCardProps {
  question: any;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onRefresh: () => void;
}

export function QuestionCard({ question, index, onEdit, onDelete, onRefresh }: QuestionCardProps) {
  const correctAnswersCount = question.options?.filter((opt: any) => opt.is_correct).length || 0;

  return (
    <Card className="overflow-hidden border">
      <div className="flex items-start gap-4 p-5">
        {/* Drag Handle */}
        <button
          className="mt-1 cursor-grab active:cursor-grabbing hover:bg-muted/80 p-1.5 rounded transition-colors"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Question Content */}
        <div className="flex-1 space-y-4">
          {/* Question Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="font-mono text-xs">
                  Q{index + 1}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {question.options?.length || 0} options
                </Badge>
                <Badge variant="default" className="text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {correctAnswersCount} correct
                </Badge>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-base leading-relaxed">
                  {question.question_text_en || 'No English question text'}
                </h3>
                {question.question_text_ar && (
                  <p className="text-sm text-muted-foreground" dir="rtl">
                    {question.question_text_ar}
                  </p>
                )}
              </div>
            </div>

            {/* Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Question
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
                      onDelete();
                    }
                  }} 
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Question
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Options List */}
          {question.options && question.options.length > 0 && (
            <div className="space-y-2 pt-2 border-t">
              {question.options.map((option: any, optIndex: number) => (
                <div
                  key={option.id}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                    option.is_correct 
                      ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800' 
                      : 'bg-muted/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    {option.is_correct ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <div className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-sm font-medium">
                        <span className="font-semibold text-muted-foreground mr-2">
                          {String.fromCharCode(65 + optIndex)}.
                        </span>
                        {option.option_text_en || 'No English option text'}
                      </p>
                      {option.option_text_ar && (
                        <p className="text-xs text-muted-foreground" dir="rtl">
                          {option.option_text_ar}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
