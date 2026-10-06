import { Suspense } from 'react';
import AuthLayout from '@/app/components/auth/AuthLayout';
import ResetPasswordForm from '@/app/components/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      imageUrl="/images/reset-password-bg.jpg"
      imageAlt="Create new password"
      imageSide="left"
    >
      <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
