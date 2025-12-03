'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginWithGoogle, resendVerificationEmail } from '@/actions/auth';
import { loginWithEmail } from '@/actions/auth';
import { loginSchema, type LoginInput } from '@/lib/validations/auth.schemas';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FcGoogle } from 'react-icons/fc';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import FormInput from '@/app/components/form/FormInput';
import { Mail } from 'lucide-react';

export default function LoginForm() {
  const t = useTranslations('auth');
  const params = useParams();
  const locale = (params.locale as string) || 'ar';
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [resendSuccess, setResendSuccess] = useState('');

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    setError('');
    setNeedsVerification(false);
    setResendSuccess('');

    try {
      const result = await loginWithEmail(data, locale);
      if (!result.success) {
        setError(result.error || 'Login failed');
        
        // Check if user needs email verification
        if (result.data?.needsEmailVerification) {
          setNeedsVerification(true);
          setUserEmail(result.data.email);
        }
        
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setIsLoading(false);
    }
  }

  async function handleResendVerification() {
    setIsLoading(true);
    setResendSuccess('');
    setError('');

    try {
      const result = await resendVerificationEmail(userEmail);
      if (result.success) {
        setResendSuccess(result.data?.message || 'Verification email sent!');
        setNeedsVerification(false);
      } else {
        setError(result.error || 'Failed to send verification email');
      }
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setIsLoading(true);
    try {
      await loginWithGoogle(locale);
    } catch (err: any) {
      setError(err.message || 'Failed to initiate Google login');
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          {t('loginTitle')}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('loginSubtitle')}
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {resendSuccess && (
        <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
          <p className="text-sm text-green-800 dark:text-green-200">{resendSuccess}</p>
        </div>
      )}

      {needsVerification && (
        <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-4 space-y-3">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Your email address has not been verified yet.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResendVerification}
            disabled={isLoading}
            className="w-full gap-2"
          >
            <Mail className="h-4 w-4" />
            Resend Verification Email
          </Button>
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

          <FormInput
            name="password"
            formType="input"
            password
            required
            disabled={isLoading}
          />

          <div className="flex items-center justify-end">
            <Link
              href={`/${locale}/forgot-password`}
              className="text-sm text-primary hover:underline"
            >
              {t('forgotPassword')}
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('loggingIn') : t('login')}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t('orContinueWith')}
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <FcGoogle className="h-5 w-5" />
        <span>{t('continueWithGoogle')}</span>
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t('dontHaveAccount')}{' '}
        <Link href={`/${locale}/signup`} className="text-primary hover:underline font-medium">
          {t('register')}
        </Link>
      </p>
    </div>
  );
}
