'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { createQuizQuestion, updateQuizQuestion } from '@/features/instructor/quiz-actions';

const optionSchema = z.object({
  option_text_ar: z.string().min(1, 'Required'),
  option_text_en: z.string().min(1, 'Required'),
  is_correct: z.boolean().default(false),
});

const questionSchema = z.object({
  question_text_ar: z.string().min(3, 'Question must be at least 3 characters'),
  question_text_en: z.string().min(3, 'Question must be at least 3 characters'),
  options: z.array(optionSchema).min(2, 'At least 2 options required'),
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface AddQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizId: number;
  question?: any; // Existing question for editing
  onSuccess: () => void;
}

export function AddQuestionDialog({
  open,
  onOpenChange,
  quizId,
  question,
  onSuccess,
}: AddQuestionDialogProps) {
  const [isPending, setIsPending] = useState(false);
  const isEditing = !!question;

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: isEditing ? {
      question_text_ar: question.question_text_ar || '',
      question_text_en: question.question_text_en || '',
      options: question.options || [
        { option_text_ar: '', option_text_en: '', is_correct: false },
        { option_text_ar: '', option_text_en: '', is_correct: false },
      ],
    } : {
      question_text_ar: '',
      question_text_en: '',
      options: [
        { option_text_ar: '', option_text_en: '', is_correct: false },
        { option_text_ar: '', option_text_en: '', is_correct: false },
      ],
    },
  });

  const { fields: options, append: appendOption, remove: removeOption } = useFieldArray({
    control: form.control,
    name: 'options',
  });

  const handleSubmit = async (data: QuestionFormData) => {
    // Validate at least one correct answer
    const hasCorrectAnswer = data.options.some(opt => opt.is_correct);
    if (!hasCorrectAnswer) {
      toast.error('Please mark at least one option as correct');
      return;
    }

    setIsPending(true);

    try {
      const result = isEditing
        ? await updateQuizQuestion(question.id, data)
        : await createQuizQuestion(quizId, data);

      if (result.success) {
        toast.success(isEditing ? 'Question updated successfully' : 'Question added successfully');
        onSuccess();
      } else {
        toast.error(result.error || 'Failed to save question');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Question' : 'Add New Question'}</DialogTitle>
          <DialogDescription>
            Create a multiple-choice question with at least 2 options
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Question Text */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="question_text_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arabic Question *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="السؤال..."
                        dir="rtl"
                        rows={3}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="question_text_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>English Question *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Question..."
                        rows={3}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Answer Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Answer Options</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendOption({ option_text_ar: '', option_text_en: '', is_correct: false })}
                  disabled={isPending}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Option
                </Button>
              </div>

              {options.map((option, index) => (
                <Card key={option.id} className="p-4">
                  <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-3 items-start">
                    {/* Correct Checkbox */}
                    <FormField
                      control={form.control}
                      name={`options.${index}.is_correct`}
                      render={({ field }) => (
                        <FormItem className="flex items-center pt-8">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isPending}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Arabic Option */}
                    <FormField
                      control={form.control}
                      name={`options.${index}.option_text_ar`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Arabic</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="الخيار"
                              dir="rtl"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* English Option */}
                    <FormField
                      control={form.control}
                      name={`options.${index}.option_text_en`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">English</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Option"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Delete Button */}
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-6"
                        onClick={() => removeOption(index)}
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update Question' : 'Add Question'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
