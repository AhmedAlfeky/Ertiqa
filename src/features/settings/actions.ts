'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { UpdateProfileInput } from './schemas';

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function updateProfile(
  userId: string,
  data: UpdateProfileInput,
  locale: string = 'ar'
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    // 1. Get authenticated user from session to prevent IDOR
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }

    // 2. Validate userId matches authenticated session
    if (userId && userId !== user.id) {
      return {
        success: false,
        error: 'Unauthorized - You cannot update another user profile',
      };
    }

    // Prepare profile update data
    const profileUpdate: any = {
      full_name: data.full_name,
      bio: data.bio || null,
      phone: data.phone || null,
      specialization: data.specialization || null,
      avatar_url: data.avatar_url || null,
      linkedin_url: data.linkedin_url || null,
      twitter_url: data.twitter_url || null,
      website_url: data.website_url || null,
      facebook_url: data.facebook_url || null,
      instagram_url: data.instagram_url || null,
      youtube_url: data.youtube_url || null,
      updated_at: new Date().toISOString(),
    };

    // Remove empty strings and convert to null
    Object.keys(profileUpdate).forEach(key => {
      if (profileUpdate[key] === '') {
        profileUpdate[key] = null;
      }
    });

    // 3. Update user_profiles using authenticated user's ID exclusively
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update(profileUpdate)
      .eq('id', user.id);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      return {
        success: false,
        error: 'Failed to update profile',
      };
    }

    // Also update auth metadata for consistency
    const metadataUpdate: any = {
      full_name: data.full_name,
      bio: data.bio || null,
      phone: data.phone || null,
      specialization: data.specialization || null,
      avatar_url: data.avatar_url || null,
    };

    // Remove empty strings
    Object.keys(metadataUpdate).forEach(key => {
      if (metadataUpdate[key] === '') {
        metadataUpdate[key] = null;
      }
    });

    const { error: metadataError } = await supabase.auth.updateUser({
      data: metadataUpdate,
    });

    if (metadataError) {
      console.error('Error updating metadata:', metadataError);
      // Don't fail if metadata update fails
    }

    // Revalidate relevant paths
    revalidatePath(`/${locale}/instructor/settings`);
    revalidatePath(`/${locale}/admin/settings`);
    revalidatePath(`/${locale}/student/settings`);
    revalidatePath(`/${locale}/instructor/dashboard`);
    revalidatePath(`/${locale}/admin/dashboard`);
    revalidatePath(`/${locale}/student/dashboard`);

    return { success: true };
  } catch (error) {
    console.error('Unexpected error updating profile:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

