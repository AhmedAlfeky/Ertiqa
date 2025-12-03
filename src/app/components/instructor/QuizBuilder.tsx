'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Loader2 } from 'lucide-react';

const optionSchema = z.object({
  optionTextAr: z.string().min(1, 'Required'),
  optionTextEn: z.string().min(1, 'Required'),
  isCorrect: z.boolean().default(false),
});

const questionSchema = z.object({
  questionTextAr: z.string().min(3, 'Question must be at least 3 characters'),
  questionTextEn: z.string().min(3, 'Question must be at least 3 characters'),
  options: z.array(optionSchema).min(2, 'At least 2 options required'),
});

const quizSchema = z.object({
  title_ar: z.string().min(3, 'Title must be at least 3 characters'),
  title_en: z.string().min(3, 'Title must be at least 3 characters'),
  questions: z.array(questionSchema).min(1, 'At least 1 question required'),
});

type QuizFormData = z.infer<typeof quizSchema>;

interface QuizBuilderProps {
  onSubmit: (data: QuizFormData) => Promise<void>;
  isLoading?: boolean;
}

export function QuizBuilder({ onSubmit, isLoading }: QuizBuilderProps) {
  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title_ar: '',
      title_en: '',
      questions: [
        {
          questionTextAr: '',
          questionTextEn: '',
          options: [
            { optionTextAr: '', optionTextEn: '', isCorrect: false },
            { optionTextAr: '', optionTextEn: '', isCorrect: false },
          ],
        },
      ],
    },
  });

  const { fields: questions, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control: form.control,
    name: 'questions',
  });

  const addQuestion = () => {
    appendQuestion({
      questionTextAr: '',
      questionTextEn: '',
      options: [
        { optionTextAr: '', optionTextEn: '', isCorrect: false },
        { optionTextAr: '', optionTextEn: '', isCorrect: false },
      ],
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Quiz Titles */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title_ar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arabic Title *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="عنوان الاختبار"
                    dir="rtl"
                    disabled={isLoading}
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
                <FormLabel>English Title *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Quiz Title"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Questions</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addQuestion}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>

          {questions.map((question, qIndex) => (
            <QuestionCard
              key={question.id}
              questionIndex={qIndex}
              form={form}
              onRemove={() => removeQuestion(qIndex)}
              isLoading={isLoading}
              canRemove={questions.length > 1}
            />
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Quiz
          </Button>
        </div>
      </form>
    </Form>
  );
}

function QuestionCard({
  questionIndex,
  form,
  onRemove,
  isLoading,
  canRemove,
}: {
  questionIndex: number;
  form: any;
  onRemove: () => void;
  isLoading?: boolean;
  canRemove: boolean;
}) {
  const { fields: options, append: appendOption, remove: removeOption } = useFieldArray({
    control: form.control,
    name: `questions.${questionIndex}.options`,
  });

  const addOption = () => {
    appendOption({ optionTextAr: '', optionTextEn: '', isCorrect: false });
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h4 className="font-medium">Question {questionIndex + 1}</h4>
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onRemove}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>

        {/* Question Text */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`questions.${questionIndex}.questionTextAr`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arabic Question *</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="السؤال..."
                    dir="rtl"
                    rows={2}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`questions.${questionIndex}.questionTextEn`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>English Question *</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Question..."
                    rows={2}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Options */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Answer Options</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOption}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Option
            </Button>
          </div>

          {options.map((option, oIndex) => (
            <div key={option.id} className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-start">
              <FormField
                control={form.control}
                name={`questions.${questionIndex}.options.${oIndex}.isCorrect`}
                render={({ field }) => (
                  <FormItem className="flex items-center pt-8">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`questions.${questionIndex}.options.${oIndex}.optionTextAr`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Arabic</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="الخيار"
                        dir="rtl"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`questions.${questionIndex}.options.${oIndex}.optionTextEn`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">English</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Option"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {options.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-6"
                  onClick={() => removeOption(oIndex)}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
