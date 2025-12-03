import AuthLayout from '@/app/components/auth/AuthLayout';
import RoleBasedSignupForm from '@/app/components/auth/RoleBasedSignupForm';

export default function SignupPage() {
  return (
    <AuthLayout
      imageUrl="/images/signup-bg.jpg"
      imageAlt="Join Ertiqa Platform"
      imageSide="left"
    >
      <RoleBasedSignupForm />
    </AuthLayout>
  );
}
