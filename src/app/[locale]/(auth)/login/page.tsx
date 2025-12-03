import AuthLayout from '@/app/components/auth/AuthLayout';
import LoginForm from '@/app/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout
      imageUrl="/images/login-bg.jpg"
      imageAlt="Welcome to Ertiqa"
      imageSide="left"
    >
      <LoginForm />
    </AuthLayout>
  );
}
