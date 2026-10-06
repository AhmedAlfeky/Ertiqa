import AuthLayout from '@/app/components/auth/AuthLayout';
import ForgotPasswordForm from '@/app/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      imageUrl="/images/forgot-password-bg.jpg"
      imageAlt="Reset your password"
      imageSide="left"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
