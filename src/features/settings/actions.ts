'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

interface UpdateProfileData {
  full_name: string;
  bio?: string;
  phone?: string;
  specialization?: string;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
}

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function updateProfile(
  userId: string,
  data: UpdateProfileData,
  locale: string = 'ar'
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    // Update user_profiles
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({
        full_name: data.full_name,
        bio: data.bio || '',
        phone: data.phone || '',
        specialization: data.specialization || '',
        linkedin_url: data.linkedin_url || null,
        twitter_url: data.twitter_url || null,
        website_url: data.website_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      return {
        success: false,
        error: 'Failed to update profile',
      };
    }

    // Also update auth metadata for consistency
    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        full_name: data.full_name,
        bio: data.bio,
        phone: data.phone,
        specialization: data.specialization,
      },
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

