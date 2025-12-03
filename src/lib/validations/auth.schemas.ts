import { z } from 'zod';

// ============================================
// Login Schema
// ============================================
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ============================================
// Resend Verification Email Schema
// ============================================
export const resendVerificationSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;

// ============================================
// Signup Schema
// ============================================
export const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  role: z.enum(['STUDENT', 'INSTRUCTOR'], {
    errorMap: () => ({ message: 'Please select a valid role' }),
  }),
  specialization: z.string().optional(),
  bio: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type SignupInput = z.infer<typeof signupSchema>;

// ============================================
// Forgot Password Schema
// ============================================
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// ============================================
// Reset Password Schema
// ============================================
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
