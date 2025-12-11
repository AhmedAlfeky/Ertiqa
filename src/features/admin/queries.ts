'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
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

// Get all categories with translations (paginated)
export const getAllCategories = cache(
  async (page: number = 1, limit: number = 10) => {
    if (!(await isAdmin())) {
      return { data: [], total: 0, page, limit, totalPages: 0 };
    }

    // Use normal client for read operations (RLS allows public read)
    const supabase = await createClient();
    const offset = (page - 1) * limit;

    // Get total count
    const { count } = await supabase
      .from('lookup_categories')
      .select('*', { count: 'exact', head: true });

    // Get paginated data
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
      .order('id')
      .range(offset, offset + limit - 1);

    if (error || !data) {
      console.error('Error fetching categories:', error);
      return { data: [], total: 0, page, limit, totalPages: 0 };
    }

    const mappedData = (data as any[]).map((cat: any) => {
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

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data: mappedData,
      total,
      page,
      limit,
      totalPages,
    };
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

    // Use normal client for read operations (RLS allows public read)
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

// Get all levels (paginated)
export const getAllLevels = cache(
  async (page: number = 1, limit: number = 10) => {
    if (!(await isAdmin())) {
      return { data: [], total: 0, page, limit, totalPages: 0 };
    }

    // Use normal client for read operations (RLS allows public read)
    const supabase = await createClient();
    const offset = (page - 1) * limit;

    // Get total count
    const { count } = await supabase
      .from('lookup_levels')
      .select('*', { count: 'exact', head: true });

    // Get paginated data
    const { data, error } = await supabase
      .from('lookup_levels')
      .select('*')
      .order('id')
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching levels:', error);
      return { data: [], total: 0, page, limit, totalPages: 0 };
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data: data || [],
      total,
      page,
      limit,
      totalPages,
    };
  }
);

// Get level by ID
export const getLevelById = cache(async (levelId: number) => {
  if (!(await isAdmin())) {
    return null;
  }

  // Use normal client for read operations (RLS allows public read)
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

// Get all users with roles (paginated)
export const getAllUsersWithRoles = cache(
  async (page: number = 1, limit: number = 10) => {
    // 1. تحقق أولاً باستخدام Anon Client (من هو المستخدم الحالي؟)
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { data: [], total: 0, page, limit, totalPages: 0 };
    }

    // 2. تحقق من صلاحياته (هل هو Admin؟)
    const roleId = user.user_metadata?.role_id || user.app_metadata?.role_id;
    const roleName = user.user_metadata?.role || user.app_metadata?.role;
    const isUserAdmin =
      roleId === ROLE_IDS.ADMIN || roleName === 'ADMIN' || roleName === 'admin';

    if (!isUserAdmin) {
      return { data: [], total: 0, page, limit, totalPages: 0 };
    }

    // 3. الآن فقط استخدم الـ Admin Client
    const adminSupabase = createAdminClient();

    // Get users from auth.users and their profiles
    // Note: listUsers doesn't support pagination directly, so we fetch all and paginate in memory
    const { data: authUsers, error: authError } =
      await adminSupabase.auth.admin.listUsers();

    if (authError) {
      console.error('Error fetching users:', authError);
      return { data: [], total: 0, page, limit, totalPages: 0 };
    }

    // Get user profiles (can use regular client for this - supabase already defined above)
    const { data: profiles } = await supabase
      .from('user_profiles')
      .select('id, full_name, avatar_url, is_instructor, instructor_verified');

    const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));

    // Map users with their roles from metadata
    const allUsers = (authUsers?.users || []).map((user: any) => {
      const profile = profileMap.get(user.id);
      const roleId = user.user_metadata?.role_id || user.app_metadata?.role_id;
      const roleName = user.user_metadata?.role || user.app_metadata?.role;

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

    // Sort by created_at descending
    allUsers.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Paginate
    const total = allUsers.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedUsers = allUsers.slice(offset, offset + limit);

    return {
      data: paginatedUsers,
      total,
      page,
      limit,
      totalPages,
    };
  }
);

// Get all instructors (paginated)
export const getAllInstructors = cache(
  async (page: number = 1, limit: number = 10) => {
    if (!(await isAdmin())) {
      return { data: [], total: 0, page, limit, totalPages: 0 };
    }

    const supabase = await createClient();
    const offset = (page - 1) * limit;

    // Get total count
    const { count } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_instructor', true);

    // Get paginated data
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
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching instructors:', error);
      return { data: [], total: 0, page, limit, totalPages: 0 };
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data: profiles || [],
      total,
      page,
      limit,
      totalPages,
    };
  }
);

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
