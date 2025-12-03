'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { 
  loginSchema, 
  signupSchema, 
  forgotPasswordSchema,
  resetPasswordSchema,
  type LoginInput, 
  type SignupInput,
  type ForgotPasswordInput,
  type ResetPasswordInput
} from '@/lib/validations/auth.schemas';
import { ROLE_IDS, ROLE_REDIRECTS } from '@/lib/constants';
import type { AuthActionResult } from '@/types/auth.types';

// ============================================
// ACTION: Login with Email/Password
// ============================================
export async function loginWithEmail(data: LoginInput, locale: string = 'ar'): Promise<AuthActionResult> {
  // Validate input
  const validation = loginSchema.safeParse(data);
  
  if (!validation.success) {
    const errorMessage = validation.error.issues.map((e) => e.message).join(', ');
    return {
      success: false,
      error: errorMessage,
    };
  }

  const { email, password } = validation.data;
  const supabase = await createClient();

  console.log('🔐 Login attempt for:', email);

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    console.error('❌ Auth error:', authError.message);
    
    // Check if error is due to unconfirmed email
    if (authError.message.includes('Email not confirmed')) {
      return {
        success: false,
        error: 'Please verify your email address before logging in.',
        data: {
          needsEmailVerification: true,
          email: email,
        },
      };
    }

    return {
      success: false,
      error: authError.message === 'Invalid login credentials' 
        ? 'Invalid email or password' 
        : authError.message,
    };
  }

  if (!authData.user) {
    console.error('❌ No user data returned');
    return {
      success: false,
      error: 'Login failed. Please try again.',
    };
  }

  console.log('✅ User authenticated:', {
    id: authData.user.id,
    email: authData.user.email,
    email_confirmed: !!authData.user.email_confirmed_at,
    metadata: authData.user.user_metadata,
  });

  // Check if email is confirmed
  if (!authData.user.email_confirmed_at) {
    console.warn('⚠️ Email not confirmed for:', email);
    return {
      success: false,
      error: 'Please verify your email address before logging in.',
      data: {
        needsEmailVerification: true,
        email: email,
      },
    };
  }

  // Get role from user metadata (stored during signup)
  const roleId = authData.user.user_metadata?.role_id || 
                 authData.user.app_metadata?.role_id || 
                 ROLE_IDS.STUDENT;
  
  console.log('📝 Role from metadata:', {
    roleId,
    metadata: authData.user.user_metadata,
  });

  const redirectPath = ROLE_REDIRECTS[roleId] || '/student/dashboard';

  console.log('🎯 Redirect decision:', {
    roleId,
    redirectPath,
    fullUrl: `/${locale}${redirectPath}`,
  });

  revalidatePath('/', 'layout');
  redirect(`/${locale}${redirectPath}`);
}

// ============================================
// ACTION: Resend Verification Email
// ============================================
export async function resendVerificationEmail(email: string): Promise<AuthActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    data: {
      message: 'Verification email sent! Please check your inbox.',
    },
  };
}

// ============================================
// ACTION: Signup with Email/Password + Role
// ============================================
export async function signupWithEmail(data: SignupInput, locale: string = 'ar'): Promise<AuthActionResult> {
  // Validate input
  const validation = signupSchema.safeParse(data);
  
  if (!validation.success) {
    const errorMessage = validation.error.issues.map((e) => e.message).join(', ');
    return {
      success: false,
      error: errorMessage,
    };
  }

  const { email, password, fullName, role, specialization, bio } = validation.data;
  const supabase = await createClient();

  console.log('📝 Signup attempt:', {
    email,
    fullName,
    role,
    hasSpecialization: !!specialization,
    hasBio: !!bio,
  });

  // Determine role ID
  const roleId = role === 'INSTRUCTOR' ? ROLE_IDS.INSTRUCTOR : ROLE_IDS.STUDENT;

  console.log('🎭 Role assignment:', {
    selectedRole: role,
    roleId,
    ROLE_IDS,
  });

  // Create auth user with metadata
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role_id: roleId,
        specialization: specialization || null,
        bio: bio || null,
      },
    },
  });

  console.log('📧 Supabase signup result:', {
    success: !!authData.user,
    userId: authData.user?.id,
    error: authError?.message,
    metadata: authData.user?.user_metadata,
  });

  if (authError) {
    console.error('❌ Signup error:', authError);
    return {
      success: false,
      error: authError.message === 'User already registered' 
        ? 'An account with this email already exists'
        : authError.message,
    };
  }

  if (!authData.user) {
    console.error('❌ No user data returned from signup');
    return {
      success: false,
      error: 'Failed to create account. Please try again.',
    };
  }

  console.log('✅ Account created successfully for:', email);
  console.log('📨 Verification email should be sent to:', email);

  // Email confirmation is enabled - user needs to verify email before logging in
  return {
    success: true,
    data: {
      message: 'Account created successfully! Please check your email to verify your account.',
      email: email,
    },
  };
}

// ============================================
// ACTION: Forgot Password
// ============================================
export async function forgotPassword(data: ForgotPasswordInput, locale: string = 'ar'): Promise<AuthActionResult> {
  // Validate input
  const validation = forgotPasswordSchema.safeParse(data);
  
  if (!validation.success) {
    const errorMessage = validation.error.issues.map((e) => e.message).join(', ');
    return {
      success: false,
      error: errorMessage,
    };
  }

  const { email } = validation.data;
  const supabase = await createClient();

  console.log('🔑 Password reset request for:', email);

  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const redirectTo = `${origin}/${locale}/auth/callback?type=recovery`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    console.error('❌ Password reset error:', error);
    return {
      success: false,
      error: error.message,
    };
  }

  console.log('✅ Password reset email sent to:', email);

  return {
    success: true,
    data: {
      message: 'Password reset link sent! Please check your email.',
    },
  };
}

// ============================================
// ACTION: Reset Password
// ============================================
export async function resetPassword(data: ResetPasswordInput): Promise<AuthActionResult> {
  // Validate input
  const validation = resetPasswordSchema.safeParse(data);
  
  if (!validation.success) {
    const errorMessage = validation.error.issues.map((e) => e.message).join(', ');
    return {
      success: false,
      error: errorMessage,
    };
  }

  const { password } = validation.data;
  const supabase = await createClient();

  // Check if user has an active session (required for password reset)
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    console.error('❌ No active session for password reset:', sessionError);
    return {
      success: false,
      error: 'Auth session missing! Please click the reset link in your email again.',
    };
  }

  console.log('🔐 Updating password for user:', session.user.email);

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    console.error('❌ Password update error:', error);
    return {
      success: false,
      error: error.message,
    };
  }

  console.log('✅ Password updated successfully');

  return {
    success: true,
    data: {
      message: 'Password updated successfully! You can now log in with your new password.',
    },
  };
}

// ============================================
// ACTION: Login with Google OAuth
// ============================================
export async function loginWithGoogle(
  locale: string = 'ar',
  role?: 'STUDENT' | 'INSTRUCTOR'
): Promise<AuthActionResult> {
  const supabase = await createClient();

  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const redirectTo = `${origin}/${locale}/auth/callback`;

  const roleId = role === 'INSTRUCTOR' ? ROLE_IDS.INSTRUCTOR : ROLE_IDS.STUDENT;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  if (data.url) {
    redirect(data.url);
  }

  return {
    success: false,
    error: 'Failed to initiate Google OAuth',
  };
}

// ============================================
// ACTION: Logout
// ============================================
export async function logout(locale: string = 'ar'): Promise<void> {
  const supabase = await createClient();
  
  await supabase.auth.signOut();
  
  revalidatePath('/', 'layout');
  redirect(`/${locale}/login`);
}

// ============================================
// ACTION: Get Current User with Role
// ============================================
export async function getCurrentUserWithRole() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  // Get role from database
  const { data: roleData } = await supabase.rpc('get_user_role', {
    user_email: user.email!
  }) as { data: RoleData[] | null };

  if (!roleData || roleData.length === 0) {
    return null;
  }

  return {
    id: user.id,
    email: user.email!,
    fullName: user.user_metadata.full_name || user.email,
    roleId: roleData[0].role_id,
    roleName: roleData[0].role_name,
  };
}
