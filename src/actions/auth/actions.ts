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
import type { AuthActionResult, RoleData } from '@/types/auth.types';
import { formatAuthErrorMessage } from '@/lib/auth-errors';

// ============================================
// ACTION: Login with Email/Password
// ============================================
export async function loginWithEmail(data: LoginInput, locale: string = 'ar'): Promise<AuthActionResult> {
  const isAr = locale !== 'en';
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

  try {
    const supabase = await createClient();

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
          error: isAr
            ? 'يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول.'
            : 'Please verify your email address before logging in.',
          data: {
            needsEmailVerification: true,
            email: email,
          },
        };
      }

      return {
        success: false,
        error: formatAuthErrorMessage(authError, locale),
      };
    }

    if (!authData.user) {
      console.error('❌ No user data returned');
      return {
        success: false,
        error: isAr ? 'فشل تسجيل الدخول، يرجى المحاولة لاحقاً.' : 'Login failed. Please try again.',
      };
    }

    // Check if email is confirmed
    if (!authData.user.email_confirmed_at) {
      console.warn('⚠️ Email not confirmed for:', email);
      return {
        success: false,
        error: isAr
          ? 'يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول.'
          : 'Please verify your email address before logging in.',
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

    const redirectPath = ROLE_REDIRECTS[roleId] || '/student/dashboard';

    revalidatePath('/', 'layout');
    redirect(`/${locale}${redirectPath}`);
  } catch (err: any) {
    if (err?.digest?.startsWith('NEXT_REDIRECT') || err?.message === 'NEXT_REDIRECT') {
      throw err;
    }
    console.error('❌ Login exception:', err);
    return {
      success: false,
      error: formatAuthErrorMessage(err, locale),
    };
  }
}

// ============================================
// ACTION: Resend Verification Email
// ============================================
export async function resendVerificationEmail(email: string, locale: string = 'ar'): Promise<AuthActionResult> {
  const isAr = locale !== 'en';
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      return {
        success: false,
        error: formatAuthErrorMessage(error, locale),
      };
    }

    return {
      success: true,
      data: {
        message: isAr
          ? 'تم إرسال بريد التحقق بنجاح! يرجى مراجعة صندوق الوارد.'
          : 'Verification email sent! Please check your inbox.',
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: formatAuthErrorMessage(err, locale),
    };
  }
}

// ============================================
// ACTION: Signup with Email/Password + Role
// ============================================
export async function signupWithEmail(data: SignupInput, locale: string = 'ar'): Promise<AuthActionResult> {
  const isAr = locale !== 'en';
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

  try {
    const supabase = await createClient();

    // Determine role ID
    const roleId = role === 'INSTRUCTOR' ? ROLE_IDS.INSTRUCTOR : ROLE_IDS.STUDENT;

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

    if (authError) {
      console.error('❌ Signup error:', authError);
      return {
        success: false,
        error: formatAuthErrorMessage(authError, locale),
      };
    }

    if (!authData.user) {
      console.error('❌ No user data returned from signup');
      return {
        success: false,
        error: isAr ? 'فشل إنشاء الحساب، يرجى المحاولة لاحقاً.' : 'Failed to create account. Please try again.',
      };
    }

    // Email confirmation is enabled - user needs to verify email before logging in
    return {
      success: true,
      data: {
        message: isAr
          ? 'تم إنشاء الحساب بنجاح! يرجى مراجعة بريدك الإلكتروني لتأكيد الحساب.'
          : 'Account created successfully! Please check your email to verify your account.',
        email: email,
      },
    };
  } catch (err: any) {
    console.error('❌ Signup exception:', err);
    return {
      success: false,
      error: formatAuthErrorMessage(err, locale),
    };
  }
}

// ============================================
// ACTION: Forgot Password
// ============================================
export async function forgotPassword(data: ForgotPasswordInput, locale: string = 'ar'): Promise<AuthActionResult> {
  const isAr = locale !== 'en';
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

  try {
    const supabase = await createClient();

    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const redirectTo = `${origin}/${locale}/auth/callback?type=recovery`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      console.error('❌ Password reset error:', error);
      return {
        success: false,
        error: formatAuthErrorMessage(error, locale),
      };
    }

    return {
      success: true,
      data: {
        message: isAr
          ? 'تم إرسال رابط إعادة تعيين كلمة المرور! يرجى مراجعة بريدك الإلكتروني.'
          : 'Password reset link sent! Please check your email.',
      },
    };
  } catch (err: any) {
    console.error('❌ Password reset exception:', err);
    return {
      success: false,
      error: formatAuthErrorMessage(err, locale),
    };
  }
}

// ============================================
// ACTION: Reset Password
// ============================================
export async function resetPassword(data: ResetPasswordInput, locale: string = 'ar'): Promise<AuthActionResult> {
  const isAr = locale !== 'en';
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

  try {
    const supabase = await createClient();

    // Check if user has an active session (required for password reset)
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('❌ No active session for password reset:', sessionError);
      return {
        success: false,
        error: isAr
          ? 'انتهت صلاحية جلسة التحقق! يرجى النقر على رابط إعادة التعيين في بريدك مرة أخرى.'
          : 'Auth session missing! Please click the reset link in your email again.',
      };
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      console.error('❌ Password update error:', error);
      return {
        success: false,
        error: formatAuthErrorMessage(error, locale),
      };
    }

    return {
      success: true,
      data: {
        message: isAr
          ? 'تم تحديث كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.'
          : 'Password updated successfully! You can now log in with your new password.',
      },
    };
  } catch (err: any) {
    console.error('❌ Password reset exception:', err);
    return {
      success: false,
      error: formatAuthErrorMessage(err, locale),
    };
  }
}

// ============================================
// ACTION: Login with Google OAuth
// ============================================
export async function loginWithGoogle(
  locale: string = 'ar',
  role?: 'STUDENT' | 'INSTRUCTOR'
): Promise<AuthActionResult> {
  const isAr = locale !== 'en';
  try {
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
        error: formatAuthErrorMessage(error, locale),
      };
    }

    if (data.url) {
      redirect(data.url);
    }

    return {
      success: false,
      error: isAr ? 'فشل بدء تسجيل الدخول بواسطة جوجل.' : 'Failed to initiate Google OAuth.',
    };
  } catch (err: any) {
    if (err?.digest?.startsWith('NEXT_REDIRECT') || err?.message === 'NEXT_REDIRECT') {
      throw err;
    }
    return {
      success: false,
      error: formatAuthErrorMessage(err, locale),
    };
  }
}

// ============================================
// ACTION: Logout
// ============================================
export async function logout(locale: string = 'ar'): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  revalidatePath('/', 'layout');
  redirect(`/${locale}/login`);
}

// ============================================
// ACTION: Get Current User with Role
// ============================================
export async function getCurrentUserWithRole() {
  try {
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
  } catch (error) {
    console.error('Error getting current user with role:', error);
    return null;
  }
}
