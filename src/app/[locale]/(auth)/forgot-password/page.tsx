'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPassword } from '@/actions/auth';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations/auth.schemas';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import FormInput from '@/app/components/form/FormInput';
import { ArrowLeft } from 'lucide-react';
import AuthLayout from '@/app/components/auth/AuthLayout';

export default function ForgotPasswordPage() {
  const t = useTranslations('auth');
  const params = useParams();
  const locale = (params.locale as string) || 'ar';
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: ForgotPasswordInput) {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await forgotPassword(data, locale);
      if (result.success) {
        setSuccess(result.data?.message || 'Password reset link sent!');
        form.reset();
      } else {
        setError(result.error || 'Failed to send reset link');
      }
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      imageUrl="/images/forgot-password-bg.jpg"
      imageAlt="Reset your password"
      imageSide="left"
    >
      <div className="w-full space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Forgot Password?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
            <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              name="email"
              formType="input"
              inputType="email"
              required
              disabled={isLoading}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <Link
            href={`/${locale}/login`}
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
