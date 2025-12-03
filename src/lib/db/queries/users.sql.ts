import { createAdminClient } from '@/lib/supabase/admin';
import type { SecUser, UserWithRole } from '@/types/auth.types';

/**
 * Find user by email in SEC_USERS table
 */
export async function findUserByEmail(email: string): Promise<SecUser | null> {
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from('SEC_USERS')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error finding user by email:', error);
    return null;
  }

  return data;
}

/**
 * Find user by auth user ID
 */
export async function findUserByAuthId(authUserId: string): Promise<SecUser | null> {
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from('SEC_USERS')
    .select('*')
    .eq('auth_user_id', authUserId)
    .single();

  if (error) {
    console.error('Error finding user by auth ID:', error);
    return null;
  }

  return data;
}

/**
 * Create a new user in SEC_USERS table
 */
export async function createUser(
  authUserId: string,
  email: string,
  fullName?: string
): Promise<SecUser | null> {
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from('SEC_USERS')
    .insert({
      auth_user_id: authUserId,
      email,
      full_name: fullName || email.split('@')[0],
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    return null;
  }

  return data;
}

/**
 * Assign a role to a user
 */
export async function assignRoleToUser(
  userId: number,
  roleId: number
): Promise<boolean> {
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from('SEC_USER_ROLES')
    .insert({
      user_id: userId,
      role_id: roleId,
    });

  if (error) {
    console.error('Error assigning role:', error);
    return false;
  }

  return true;
}

/**
 * Get user with their role information
 */
export async function getUserWithRole(email: string): Promise<UserWithRole | null> {
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from('SEC_USERS')
    .select(`
      *,
      SEC_USER_ROLES (
        role_id,
        SEC_ROLES (
          role_name
        )
      )
    `)
    .eq('email', email)
    .single();

  if (error || !data) {
    console.error('Error fetching user with role:', error);
    return null;
  }

  const userRoles = data.SEC_USER_ROLES as any;
  const role = userRoles?.[0];

  if (!role) {
    return null;
  }

  return {
    ...data,
    role_id: role.role_id,
    role_name: role.SEC_ROLES.role_name,
  };
}

/**
 * Update user profile information
 */
export async function updateUserProfile(
  userId: number,
  updates: {
    full_name?: string;
    profile_picture_url?: string;
  }
): Promise<SecUser | null> {
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from('SEC_USERS')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }

  return data;
}
