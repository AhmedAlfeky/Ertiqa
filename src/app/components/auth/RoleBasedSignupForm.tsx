'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupWithEmail, loginWithGoogle } from '@/actions/auth';
import { signupSchema, type SignupInput } from '@/lib/validations/auth.schemas';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FcGoogle } from 'react-icons/fc';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { GraduationCap, Users } from 'lucide-react';
import FormInput from '@/app/components/form/FormInput';

export default function RoleBasedSignupForm() {
  const t = useTranslations('auth');
  const params = useParams();
  const locale = (params.locale as string) || 'ar';
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'INSTRUCTOR'>('STUDENT');

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'STUDENT',
      specialization: '',
      bio: '',
    },
  });

  async function onSubmit(data: SignupInput) {
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Update role based on selected tab
    const submitData = { ...data, role: selectedRole };

    try {
      const result = await signupWithEmail(submitData, locale);
      if (result.success) {
        setSuccess(result.data?.message || 'Account created successfully!');
        form.reset();
      } else {
        setError(result.error || 'Signup failed');
      }
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setIsLoading(false);
    }
  }

  async function handleGoogleSignup() {
    setIsLoading(true);
    try {
      await loginWithGoogle(locale, selectedRole);
    } catch (err: any) {
      setError(err.message || 'Failed to initiate Google sign up');
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          {t('signupTitle')}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('signupSubtitle')}
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

      <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="STUDENT" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            {t('studentRole')}
          </TabsTrigger>
          <TabsTrigger value="INSTRUCTOR" className="gap-2">
            <Users className="h-4 w-4" />
            {t('instructorRole')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="STUDENT" className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                name="fullName"
                formType="input"
                inputType="text"
                required
                disabled={isLoading}
              />

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

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('creatingAccount') : t('signup')}
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="INSTRUCTOR" className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                name="fullName"
                formType="input"
                inputType="text"
                required
                disabled={isLoading}
              />

              <FormInput
                name="email"
                formType="input"
                inputType="email"
                required
                disabled={isLoading}
              />

              <FormInput
                name="specialization"
                formType="input"
                inputType="text"
                disabled={isLoading}
              />

              <FormInput
                name="bio"
                formType="textarea"
                rows={3}
                disabled={isLoading}
              />

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

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('creatingAccount') : t('signup')}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>

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
        onClick={handleGoogleSignup}
        disabled={isLoading}
      >
        <FcGoogle className="h-5 w-5" />
        <span>{t('continueWithGoogle')}</span>
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t('alreadyHaveAccount')}{' '}
        <Link href={`/${locale}/login`} className="text-primary hover:underline font-medium">
          {t('login')}
        </Link>
      </p>
    </div>
  );
}
