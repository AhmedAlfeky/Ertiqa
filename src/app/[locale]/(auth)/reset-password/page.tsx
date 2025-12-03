'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPassword } from '@/actions/auth';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations/auth.schemas';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useTranslations } from 'next-intl';
import FormInput from '@/app/components/form/FormInput';
import AuthLayout from '@/app/components/auth/AuthLayout';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const t = useTranslations('auth');
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = (params.locale as string) || 'ar';
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(''); // Password submission errors
  const [sessionError, setSessionError] = useState(''); // Code validation errors
  const [success, setSuccess] = useState('');
  const [isValidatingSession, setIsValidatingSession] = useState(true);
  const [sessionValid, setSessionValid] = useState(false);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Exchange code for session on page load
  useEffect(() => {
    const exchangeCodeForSession = async () => {
      const code = searchParams.get('code');
      
      if (code) {
        console.log('🔐 Exchanging reset code for session...');
        const supabase = createClient();
        
        try {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error('❌ Error exchanging code:', exchangeError);
            setSessionError('Invalid or expired reset link. Please request a new one.');
            setSessionValid(false);
          } else {
            console.log('✅ Code exchanged successfully, session established');
            setSessionValid(true);
          }
        } catch (err: any) {
          console.error('❌ Exception during code exchange:', err);
          setSessionError('Failed to validate reset link.');
          setSessionValid(false);
        }
      } else {
        // No code provided, might be accessing directly
        setSessionError('No reset code provided. Please use the link from your email.');
        setSessionValid(false);
      }
      
      setIsValidatingSession(false);
    };

    exchangeCodeForSession();
  }, [searchParams]);

  async function onSubmit(data: ResetPasswordInput) {
    setIsLoading(true);
    setFormError('');
    setSuccess('');

    try {
      const result = await resetPassword(data);
      if (result.success) {
        setSuccess(result.data?.message || 'Password updated successfully!');
        form.reset();
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push(`/${locale}/login`);
        }, 2000);
      } else {
        setFormError(result.error || 'Failed to update password');
      }
      setIsLoading(false);
    } catch (err: any) {
      setFormError(err.message || 'An error occurred');
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      imageUrl="/images/reset-password-bg.jpg"
      imageAlt="Create new password"
      imageSide="left"
    >
      <div className="w-full space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        {isValidatingSession && (
          <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Validating reset link...
            </p>
          </div>
        )}

        {sessionError && (
          <div className="rounded-md bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{sessionError}</p>
          </div>
        )}

        {formError && (
          <div className="rounded-md bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{formError}</p>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
            <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
              Redirecting to login...
            </p>
          </div>
        )}

        {!isValidatingSession && sessionValid && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                name="password"
                formType="input"
                password
                required
                disabled={isLoading}
              />

              <FormInput
                name="confirmPassword"
                formType="input"
                password
                required
                disabled={isLoading}
              />

              <div className="text-xs text-muted-foreground">
                {t('passwordRequirements')}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || !!success}>
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </AuthLayout>
  );
}
