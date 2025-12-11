'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit2, Save, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { AddQuestionDialog } from './AddQuestionDialog';
import { QuestionCard } from './QuestionCard';
import { updateQuizPassingScore } from '@/features/instructor/quiz-actions';

interface QuizManageClientProps {
  courseId: number;
  quiz: any; // Will be properly typed
  locale: string;
}

export function QuizManageClient({ courseId, quiz, locale }: QuizManageClientProps) {
  const t = useTranslations('instructor');
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [isEditingPassingScore, setIsEditingPassingScore] = useState(false);
  const [passingScore, setPassingScore] = useState<string>(
    (quiz.passing_score || 70.0).toString()
  );
  const [isSavingPassingScore, setIsSavingPassingScore] = useState(false);

  const refreshPage = () => {
    window.location.reload();
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setShowAddQuestion(true);
  };

  const handleEditQuestion = (question: any) => {
    setEditingQuestion(question);
    setShowAddQuestion(true);
  };

  const handleDeleteQuestion = async (questionId: number) => {
    const { deleteQuizQuestion } = await import('@/features/instructor/quiz-actions');
    const result = await deleteQuizQuestion(questionId);
    
    if (result.success) {
      toast.success(t('questionDeletedSuccessfully'));
      refreshPage();
    } else {
      toast.error(result.error || t('failedToDeleteQuestion'));
    }
  };

  const handleSavePassingScore = async () => {
    const score = parseFloat(passingScore);
    if (isNaN(score) || score < 0 || score > 100) {
      toast.error(t('passingScoreMustBeBetween'));
      return;
    }

    setIsSavingPassingScore(true);
    try {
      const result = await updateQuizPassingScore(quiz.id, score);
      if (result.success) {
        toast.success(t('passingScoreUpdatedSuccessfully'));
        setIsEditingPassingScore(false);
        refreshPage();
      } else {
        toast.error(result.error || t('failedToUpdatePassingScore'));
      }
    } catch (error) {
      toast.error(t('anErrorOccurred'));
    } finally {
      setIsSavingPassingScore(false);
    }
  };

  const handleCancelPassingScore = () => {
    setPassingScore((quiz.passing_score || 70.0).toString());
    setIsEditingPassingScore(false);
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
          <div>
            <h1 className="text-3xl font-bold">{quiz.title_en || quiz.title_ar}</h1>
            <p className="text-muted-foreground mt-1">
              {quiz.title_ar && quiz.title_en && quiz.title_ar !== quiz.title_en && (
                <span className="block" dir="rtl">{quiz.title_ar}</span>
              )}
              <span className="block mt-1">{t('manageQuizQuestions')}</span>
            </p>
          </div>
          <Button onClick={handleAddQuestion}>
            <Plus className="mr-2 h-4 w-4" />
            {t('addQuestion')}
          </Button>
        </div>
      </div>

      {/* Quiz Info */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-lg font-semibold">{t('quizInformation')}</h2>
                <Badge variant="secondary">
                  {quiz.questions?.length || 0} {t('questions')}
                </Badge>
              </div>
              {quiz.title_ar && quiz.title_en && quiz.title_ar !== quiz.title_en && (
                <p className="text-sm text-muted-foreground" dir="rtl">
                  {quiz.title_ar}
                </p>
              )}
            </div>
          </div>

          {/* Passing Score */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="passing-score" className="text-sm font-medium">
                  {t('passingScorePercent')}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {t('minimumPercentageDescription')}
                </p>
              </div>
              {isEditingPassingScore ? (
                <div className="flex items-center gap-2">
                  <Input
                    id="passing-score"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={passingScore}
                    onChange={(e) => setPassingScore(e.target.value)}
                    className="w-24"
                    disabled={isSavingPassingScore}
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                  <Button
                    size="sm"
                    onClick={handleSavePassingScore}
                    disabled={isSavingPassingScore}
                  >
                    {isSavingPassingScore ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancelPassingScore}
                    disabled={isSavingPassingScore}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">
                    {quiz.passing_score || 70.0}%
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditingPassingScore(true)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Questions</h2>
        </div>

        {quiz.questions && quiz.questions.length > 0 ? (
          <div className="space-y-3">
            {quiz.questions.map((question: any, index: number) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                onEdit={() => handleEditQuestion(question)}
                onDelete={() => handleDeleteQuestion(question.id)}
                onRefresh={refreshPage}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2">{t('noQuestionsYet')}</h3>
              <p className="text-muted-foreground mb-6">
                {t('startAddingQuestions')}
              </p>
              <Button onClick={handleAddQuestion}>
                <Plus className="mr-2 h-4 w-4" />
                {t('addFirstQuestion')}
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Add/Edit Question Dialog */}
      <AddQuestionDialog
        open={showAddQuestion}
        onOpenChange={(open) => {
          setShowAddQuestion(open);
          if (!open) setEditingQuestion(null);
        }}
        quizId={quiz.id}
        question={editingQuestion}
        onSuccess={() => {
          setShowAddQuestion(false);
          setEditingQuestion(null);
          refreshPage();
        }}
      />
    </div>
  );
}
