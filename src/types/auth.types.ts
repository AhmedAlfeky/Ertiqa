// Database types matching the actual schema
export interface SecUser {
  id: number;
  email: string;
  password_hash: string;
  is_active: boolean;
  created_at: string;
  last_login_at?: string;
  email_verified: boolean;
  email_verification_token?: string;
  email_verification_expires?: string;
  reset_password_token?: string;
  reset_password_expires?: string;
}

export interface SecRole {
  id: number;
  name: 'STUDENT' | 'INSTRUCTOR' | 'SUPPORT' | 'ADMIN' | 'GUEST';
  description?: string;
  created_at: string;
}

export interface SecUserRole {
  user_id: number;
  role_id: number;
  assigned_at: string;
  assigned_by?: number;
}

export interface InfProfile {
  user_id: number;
  full_name: string;
  bio?: string;
  photo_url?: string;
  phone?: string;
  linkedin_url?: string;
  facebook_url?: string;
  whatsapp_url?: string;
  instagram_url?: string;
  x_url?: string;
  youtube_url?: string;
  specialization?: string;
  timezone?: string;
  created_at: string;
}

export interface InfInstructor {
  user_id: number;
  verified: boolean;
  joined_at: string;
  whatsapp_group_link?: string;
}

// Auth form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'STUDENT' | 'INSTRUCTOR';
  // Instructor-specific fields
  specialization?: string;
  bio?: string;
}

// Server action result types
export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthActionResult extends ActionResult {
  redirectTo?: string;
}

export interface UserWithRole {
  id: number;
  email: string;
  fullName: string;
  role: SecRole;
  isInstructor: boolean;
}
