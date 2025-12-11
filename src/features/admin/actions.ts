'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdmin } from './queries';
import type { ActionResult } from '../instructor/types';

// ============================================
// CATEGORY ACTIONS
// ============================================

interface CreateCategoryInput {
  slug: string;
  name_ar: string;
  name_en: string;
}

export async function createCategory(
  data: CreateCategoryInput
): Promise<ActionResult<{ categoryId: number }>> {
  if (!(await isAdmin())) {
    return { success: false, error: 'Unauthorized - Admin access required' };
  }

  // Use admin client for write operations
  const supabase = createAdminClient();

  try {
    // Insert category
    const { data: category, error: categoryError } = await supabase
      .from('lookup_categories')
      .insert({
        slug: data.slug,
      } as any)
      .select()
      .single();

    if (categoryError || !category) {
      return {
        success: false,
        error: categoryError?.message || 'Failed to create category',
      };
    }

    const categoryId = (category as any).id;

    // Insert translations
    const translations = [
      {
        category_id: categoryId,
        language_id: 1,
        name: data.name_ar,
      },
      {
        category_id: categoryId,
        language_id: 2,
        name: data.name_en,
      },
    ];

    const { error: translationError } = await supabase
      .from('lookup_category_translations')
      .insert(translations as any);

    if (translationError) {
      await supabase.from('lookup_categories').delete().eq('id', categoryId);
      return { success: false, error: translationError.message };
    }

    revalidatePath('/admin/categories');
    return { success: true, data: { categoryId } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCategory(
  categoryId: number,
  data: CreateCategoryInput
): Promise<ActionResult<void>> {
  if (!(await isAdmin())) {
    return { success: false, error: 'Unauthorized - Admin access required' };
  }

  // Use admin client for write operations
  const supabase = createAdminClient();

  try {
    // Update category slug
    const { error: categoryError } = await (supabase as any)
      .from('lookup_categories')
      .update({ slug: data.slug })
      .eq('id', categoryId);

    if (categoryError) {
      return { success: false, error: categoryError.message };
    }

    // Update translations
    const updates = [
      {
        category_id: categoryId,
        language_id: 1,
        name: data.name_ar,
      },
      {
        category_id: categoryId,
        language_id: 2,
        name: data.name_en,
      },
    ];

    for (const update of updates) {
      const { error } = await supabase
        .from('lookup_category_translations')
        .upsert(update as any, { onConflict: 'category_id,language_id' });

      if (error) {
        return { success: false, error: error.message };
      }
    }

    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(
  categoryId: number
): Promise<ActionResult<void>> {
  if (!(await isAdmin())) {
    return { success: false, error: 'Unauthorized - Admin access required' };
  }

  // Use admin client for write operations
  const supabase = createAdminClient();

  try {
    const { error } = await supabase
      .from('lookup_categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================
// LEVEL ACTIONS
// ============================================

interface CreateLevelInput {
  name: string;
}

export async function createLevel(
  data: CreateLevelInput
): Promise<ActionResult<{ levelId: number }>> {
  if (!(await isAdmin())) {
    return { success: false, error: 'Unauthorized - Admin access required' };
  }

  // Use admin client for write operations
  const supabase = createAdminClient();

  try {
    const { data: level, error } = await supabase
      .from('lookup_levels')
      .insert({ name: data.name } as any)
      .select()
      .single();

    if (error || !level) {
      return {
        success: false,
        error: error?.message || 'Failed to create level',
      };
    }

    const levelId = (level as any).id;
    revalidatePath('/admin/levels');
    return { success: true, data: { levelId } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateLevel(
  levelId: number,
  data: CreateLevelInput
): Promise<ActionResult<void>> {
  if (!(await isAdmin())) {
    return { success: false, error: 'Unauthorized - Admin access required' };
  }

  // Use admin client for write operations
  const supabase = createAdminClient();

  try {
    const { error } = await (supabase as any)
      .from('lookup_levels')
      .update({ name: data.name })
      .eq('id', levelId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/levels');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteLevel(
  levelId: number
): Promise<ActionResult<void>> {
  if (!(await isAdmin())) {
    return { success: false, error: 'Unauthorized - Admin access required' };
  }

  // Use admin client for write operations
  const supabase = createAdminClient();

  try {
    const { error } = await supabase
      .from('lookup_levels')
      .delete()
      .eq('id', levelId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/levels');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================
// USER ROLE ACTIONS
// ============================================

export async function updateUserRole(
  userId: string,
  newRoleId: number
): Promise<ActionResult<void>> {
  // Security check: Verify user is an admin
  if (!(await isAdmin())) {
    return { success: false, error: 'Unauthorized - Admin access required' };
  }

  // Use admin client for privileged operations
  const adminSupabase = createAdminClient();

  try {
    // Update user metadata using admin client
    const { error } = await adminSupabase.auth.admin.updateUserById(userId, {
      user_metadata: { role_id: newRoleId },
      app_metadata: { role_id: newRoleId },
    });

    if (error) {
      console.error('Error updating user role:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    console.error('Exception updating user role:', error);
    return {
      success: false,
      error: error.message || 'Failed to update user role',
    };
  }
}
