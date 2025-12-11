'use server';

import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';
import { ROLE_IDS } from '@/lib/constants';

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  // Check user metadata for admin role (prioritize role_id)
  const roleId = user.user_metadata?.role_id || user.app_metadata?.role_id;
  const roleName = user.user_metadata?.role || user.app_metadata?.role;

  return (
    roleId === ROLE_IDS.ADMIN || roleName === 'ADMIN' || roleName === 'admin'
  );
}

// Get count of all users
export async function getAllUsersCount(): Promise<number> {
  if (!(await isAdmin())) {
    return 0;
  }

  const supabase = await createClient();

  const { count, error } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error counting users:', error);
    return 0;
  }

  return count || 0;
}

// Get count of all instructors
export async function getAllInstructorsCount(): Promise<number> {
  if (!(await isAdmin())) {
    return 0;
  }

  const supabase = await createClient();

  const { count, error } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_instructor', true);

  if (error) {
    console.error('Error counting instructors:', error);
    return 0;
  }

  return count || 0;
}

// Get all categories with translations
export const getAllCategories = cache(
  async (): Promise<
    Array<{
      id: number;
      slug: string;
      name_ar: string;
      name_en: string;
      created_at: string;
    }>
  > => {
    if (!(await isAdmin())) {
      return [];
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('lookup_categories')
      .select(
        `
      *,
      lookup_category_translations (
        language_id,
        name
      )
    `
      )
      .order('id');

    if (error || !data) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return (data as any[]).map((cat: any) => {
      const arTrans = cat.lookup_category_translations?.find(
        (t: any) => t.language_id === 1
      );
      const enTrans = cat.lookup_category_translations?.find(
        (t: any) => t.language_id === 2
      );
      return {
        id: cat.id,
        slug: cat.slug,
        name_ar: arTrans?.name || '',
        name_en: enTrans?.name || '',
        created_at: cat.created_at,
      };
    });
  }
);

// Get category by ID
export const getCategoryById = cache(
  async (
    categoryId: number
  ): Promise<{
    id: number;
    slug: string;
    name_ar: string;
    name_en: string;
    created_at: string;
  } | null> => {
    if (!(await isAdmin())) {
      return null;
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('lookup_categories')
      .select(
        `
      *,
      lookup_category_translations (
        language_id,
        name
      )
    `
      )
      .eq('id', categoryId)
      .single();

    if (error || !data) {
      console.error('Error fetching category:', error);
      return null;
    }

    const category = data as any;
    const arTrans = category.lookup_category_translations?.find(
      (t: any) => t.language_id === 1
    );
    const enTrans = category.lookup_category_translations?.find(
      (t: any) => t.language_id === 2
    );

    return {
      id: category.id,
      slug: category.slug,
      name_ar: arTrans?.name || '',
      name_en: enTrans?.name || '',
      created_at: category.created_at,
    };
  }
);

// Get all levels
export const getAllLevels = cache(async () => {
  if (!(await isAdmin())) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('lookup_levels')
    .select('*')
    .order('id');

  if (error) {
    console.error('Error fetching levels:', error);
    return [];
  }

  return data || [];
});

// Get level by ID
export const getLevelById = cache(async (levelId: number) => {
  if (!(await isAdmin())) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('lookup_levels')
    .select('*')
    .eq('id', levelId)
    .single();

  if (error || !data) {
    console.error('Error fetching level:', error);
    return null;
  }

  return data;
});

// Get all users with roles
export const getAllUsersWithRoles = cache(async () => {
  if (!(await isAdmin())) {
    return [];
  }

  const supabase = await createClient();

  // Get users from auth.users and their profiles
  const { data: authUsers, error: authError } =
    await supabase.auth.admin.listUsers();

  if (authError) {
    console.error('Error fetching users:', authError);
    return [];
  }

  // Get user profiles
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('id, full_name, avatar_url, is_instructor, instructor_verified');

  const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));

  // Map users with their roles from metadata
  return (authUsers?.users || []).map((user: any) => {
    const profile = profileMap.get(user.id);
    const roleId = user.user_metadata?.role_id;
    const roleName = user.user_metadata?.role;

    return {
      id: user.id,
      email: user.email,
      full_name: profile?.full_name || user.user_metadata?.full_name || '',
      avatar_url: profile?.avatar_url || null,
      role_id: roleId || null,
      role_name: roleName || 'STUDENT',
      is_instructor: profile?.is_instructor || false,
      instructor_verified: profile?.instructor_verified || false,
      created_at: user.created_at,
    };
  });
});

// Get all instructors
export const getAllInstructors = cache(async () => {
  if (!(await isAdmin())) {
    return [];
  }

  const supabase = await createClient();

  const { data: profiles, error } = await supabase
    .from('user_profiles')
    .select(
      `
      id,
      full_name,
      avatar_url,
      specialization,
      bio,
      instructor_verified,
      created_at
    `
    )
    .eq('is_instructor', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching instructors:', error);
    return [];
  }

  return profiles || [];
});

// Get instructor details with courses
export const getInstructorDetails = cache(async (instructorId: string) => {
  if (!(await isAdmin())) {
    return null;
  }

  const supabase = await createClient();

  // Get instructor profile
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', instructorId)
    .eq('is_instructor', true)
    .single();

  if (profileError || !profile) {
    console.error('Error fetching instructor:', profileError);
    return null;
  }

  // Get instructor's courses
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select(
      `
      *,
      course_translations (
        language_id,
        title,
        subtitle,
        description
      )
    `
    )
    .eq('instructor_id', instructorId)
    .order('created_at', { ascending: false });

  if (coursesError) {
    console.error('Error fetching courses:', coursesError);
  }

  return {
    profile,
    courses: (courses || []).map((course: any) => {
      const arTrans = course.course_translations?.find(
        (t: any) => t.language_id === 1
      );
      const enTrans = course.course_translations?.find(
        (t: any) => t.language_id === 2
      );
      return {
        ...course,
        title_ar: arTrans?.title || '',
        title_en: enTrans?.title || '',
        subtitle_ar: arTrans?.subtitle || null,
        subtitle_en: enTrans?.subtitle || null,
        description_ar: arTrans?.description || null,
        description_en: enTrans?.description || null,
      };
    }),
  };
});
