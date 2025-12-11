import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';
import { ROLE_IDS } from '@/lib/constants';
import type {
  Course,
  CourseWithDetails,
  Module,
  ModuleWithLessons,
  Lesson,
  Level,
  Language,
  Category,
  PaginatedResult,
} from './types';

// ============================================
// Get Instructor's Courses - NEW SCHEMA
// ============================================
export const getInstructorCourses = cache(
  async (
    page: number = 1,
    limit: number = 10,
    locale: string = 'en'
  ): Promise<PaginatedResult<CourseWithDetails>> => {
    const supabase = await createClient();
    const instructorId = await getCurrentInstructorId();

    if (!instructorId) {
      console.error('No authenticated instructor found');
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }

    const offset = (page - 1) * limit;

    // Get total count using NEW schema
    const { count } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('instructor_id', instructorId);

    // Get courses with details using NEW schema
    const { data, error } = await supabase
      .from('courses')
      .select(
        `
      *,
      lookup_levels (id, name),
      lookup_languages!courses_teaching_language_id_fkey (id, code, name),
      course_translations (
        language_id,
        title,
        subtitle,
        description
      )
    `
      )
      .eq('instructor_id', instructorId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching courses:', error);
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }

    // Map the data to include translated fields
    const courses = (data || []).map((course: any) => {
      // Find translations
      const enTranslation = course.course_translations?.find(
        (t: any) => t.language_id === 2
      );
      const arTranslation = course.course_translations?.find(
        (t: any) => t.language_id === 1
      );

      // Determine primary translation based on locale
      const primaryTranslation =
        locale === 'ar' ? arTranslation : enTranslation;
      const fallbackTranslation =
        locale === 'ar' ? enTranslation : arTranslation;

      return {
        ...course,
        title:
          primaryTranslation?.title ||
          fallbackTranslation?.title ||
          'Untitled Course',
        subtitle: primaryTranslation?.subtitle || fallbackTranslation?.subtitle,
        description:
          primaryTranslation?.description || fallbackTranslation?.description,
        modulesCount: 0, // Will be populated if needed
        lessonsCount: 0, // Will be populated if needed
        course_translations: course.course_translations, // Keep raw translations for editing
      };
    });

    return {
      data: courses,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }
);

// ============================================
// Get Course Details by ID - NEW SCHEMA
// ============================================
export const getCourseById = cache(
  async (courseId: number): Promise<CourseWithDetails | null> => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('courses')
      .select(
        `
      *,
      lookup_levels (id, name),
      lookup_languages!courses_teaching_language_id_fkey (id, code, name),
      course_translations (
        language_id,
        title,
        subtitle,
        description
      )
    `
      )
      .eq('id', courseId)
      .single();

    if (error || !data) {
      console.error('Error fetching course:', error);
      return null;
    }

    // Count units and lessons
    const { count: unitsCount } = await supabase
      .from('course_units')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', courseId);

    // To count lessons, we need to get units first, then count lessons in those units
    const { data: units } = await supabase
      .from('course_units')
      .select('id')
      .eq('course_id', courseId);

    let lessonsCount = 0;
    if (units && units.length > 0) {
      const unitIds = (units as any[]).map(u => u.id);
      const { count } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true })
        .in('unit_id', unitIds);
      lessonsCount = count || 0;
    }

    return {
      ...(data as any),
      modulesCount: unitsCount || 0,
      lessonsCount: lessonsCount || 0,
    } as CourseWithDetails;
  }
);

// ============================================
// Get Course Units with Lessons - NEW SCHEMA
// ============================================
export const getCourseModules = cache(
  async (courseId: number): Promise<ModuleWithLessons[]> => {
    const supabase = await createClient();

    const { data: units, error } = await supabase
      .from('course_units')
      .select(
        `
      *,
      unit_translations (
        language_id,
        title,
        description
      )
    `
      )
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    if (error || !units) {
      console.error('Error fetching units:', error);
      return [];
    }

    // Get lessons for each unit
    const unitsWithLessons = await Promise.all(
      units.map(async (unit: any) => {
        const { data: lessons } = await supabase
          .from('lessons')
          .select(
            `
          *,
          lesson_translations (
            language_id,
            title,
            description
          )
        `
          )
          .eq('unit_id', unit.id)
          .order('order_index', { ascending: true });

        return {
          ...unit,
          lessons: lessons || [],
        };
      })
    );

    return unitsWithLessons;
  }
);

// ============================================
// Get Lookup Data (Levels, Languages & Categories) - NEW SCHEMA
// ============================================
export const getLookupData = cache(
  async (
    locale: string = 'en'
  ): Promise<{
    levels: Level[];
    languages: Language[];
    categories: Category[];
  }> => {
    // Use normal client for read operations (RLS allows public read)
    const supabase = await createClient();
    const languageId = locale === 'ar' ? 1 : 2; // 1 = Arabic, 2 = English

    const [levelsResult, languagesResult, categoriesResult] = await Promise.all(
      [
        supabase.from('lookup_levels').select('*').order('id'),
        supabase.from('lookup_languages').select('*').order('id'),
        supabase
          .from('lookup_categories')
          .select(
            `
        *,
        lookup_category_translations (
          name,
          language_id
        )
      `
          )
          .order('id'),
      ]
    );

    // Map categories with translations
    const categories = (categoriesResult.data || []).map((cat: any) => {
      const translation = cat.lookup_category_translations?.find(
        (t: any) => t.language_id === languageId
      );
      return {
        id: cat.id,
        slug: cat.slug,
        name: translation?.name || cat.slug,
      };
    });

    return {
      levels: levelsResult.data || [],
      languages: languagesResult.data || [],
      categories,
    };
  }
);

// ============================================
// Check if user is instructor
// ============================================
export async function isInstructor(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  // Check user metadata for instructor role (prioritize role_id)
  const roleId = user.user_metadata?.role_id || user.app_metadata?.role_id;
  const roleName = user.user_metadata?.role || user.app_metadata?.role;
  const isInstructorFlag =
    user.user_metadata?.is_instructor || user.app_metadata?.is_instructor;

  return (
    roleId === ROLE_IDS.INSTRUCTOR ||
    roleName === 'INSTRUCTOR' ||
    roleName === 'instructor' ||
    isInstructorFlag === true
  );
}

// ============================================
// Get Current Instructor ID
// ============================================
export const getCurrentInstructorId = cache(
  async (): Promise<string | null> => {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log('No authenticated user');
      return null;
    }

    // Verify user is actually an instructor
    const roleId = user.user_metadata?.role_id || user.app_metadata?.role_id;
    const roleName = user.user_metadata?.role || user.app_metadata?.role;
    const isInstructorFlag =
      user.user_metadata?.is_instructor || user.app_metadata?.is_instructor;

    const isUserInstructor =
      roleId === ROLE_IDS.INSTRUCTOR ||
      roleName === 'INSTRUCTOR' ||
      roleName === 'instructor' ||
      isInstructorFlag === true;

    if (!isUserInstructor) {
      console.log('User is not an instructor');
      return null;
    }

    // In the new schema, courses.instructor_id references auth.users(id) directly
    // So we just return the user's UUID
    return user.id;
  }
);
