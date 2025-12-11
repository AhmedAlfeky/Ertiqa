'use server';

import { createClient } from '@/lib/supabase/server';

type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

const LANG_AR = 1;
const LANG_EN = 2;

function getLangId(locale?: string) {
  return locale === 'en' ? LANG_EN : LANG_AR;
}

type CourseRow = {
  id: number;
  slug: string;
  instructor_id: string | null;
  instructor_name?: string | null;
  instructor_avatar?: string | null;
  category_id?: number | null;
  level_id?: number | null;
  teaching_language_id?: number | null;
  cover_image_url?: string | null;
  promo_video_url?: string | null;
  is_free?: boolean | null;
  price?: number | null;
  currency?: string | null;
  is_published?: boolean | null;
  published_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  title_ar?: string | null;
  subtitle_ar?: string | null;
  description_ar?: string | null;
  title_en?: string | null;
  subtitle_en?: string | null;
  description_en?: string | null;
  units_count?: number | null;
  lessons_count?: number | null;
  students_count?: number | null;
  avg_rating?: number | null;
};

function mapCourseLocale(row: CourseRow, locale?: string) {
  const isAr = locale !== 'en';
  return {
    ...row,
    title: isAr ? row.title_ar : row.title_en,
    subtitle: isAr ? row.subtitle_ar : row.subtitle_en,
    description: isAr ? row.description_ar : row.description_en,
  };
}

export async function getPublicCourses(params: {
  page?: number;
  pageSize?: number;
  category?: string;
  level?: string;
  language?: string;
  isFree?: string;
  search?: string;
  locale?: string;
}): Promise<Paginated<ReturnType<typeof mapCourseLocale>>> {
  const supabase = await createClient();
  const page = Number(params.page) > 0 ? Number(params.page) : 1;
  const pageSize = Number(params.pageSize) > 0 ? Number(params.pageSize) : 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const langId = getLangId(params.locale);

  let query = supabase
    .from('v_courses_full')
    .select('*', { count: 'exact' })
    .eq('is_published', true);

  if (params.category) query = query.eq('category_id', Number(params.category));
  if (params.level) query = query.eq('level_id', Number(params.level));
  if (params.language)
    query = query.eq('teaching_language_id', Number(params.language));
  if (params.isFree === 'true') query = query.eq('is_free', true);
  if (params.search) {
    const field = langId === LANG_EN ? 'title_en' : 'title_ar';
    query = query.ilike(field, `%${params.search}%`);
  }

  const { data, error, count } = await query
    .order('published_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching public courses', error);
    return { items: [], page, pageSize, total: 0, totalPages: 0 };
  }

  const total = count || 0;
  return {
    items: (data || []).map(row =>
      mapCourseLocale(row as CourseRow, params.locale)
    ),
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getPublicCourseBySlug(slug: string, locale?: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('v_courses_full')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !data) {
    console.error('Error fetching course by slug', error);
    return null;
  }

  return mapCourseLocale(data as CourseRow, locale);
}

export async function getFeaturedCourses(locale?: string, limit: number = 6) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('v_courses_full')
    .select('*')
    .eq('is_published', true)
    .order('students_count', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured courses', error);
    return [];
  }

  return (data || []).map(row => mapCourseLocale(row as CourseRow, locale));
}

// Instructors
type InstructorRow = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  specialization: string | null;
  bio: string | null;
  instructor_verified: boolean | null;
  created_at: string | null;
};

export async function getPublicInstructors(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  specialization?: string;
}): Promise<Paginated<InstructorRow>> {
  const supabase = await createClient();
  const page = Number(params.page) > 0 ? Number(params.page) : 1;
  const pageSize = Number(params.pageSize) > 0 ? Number(params.pageSize) : 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('user_profiles')
    .select('*', { count: 'exact' })
    .eq('is_instructor', true);

  if (params.search) {
    query = query.ilike('full_name', `%${params.search}%`);
  }
  if (params.specialization) {
    query = query.ilike('specialization', `%${params.specialization}%`);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching instructors', error);
    return { items: [], page, pageSize, total: 0, totalPages: 0 };
  }

  const total = count || 0;
  return {
    items: (data || []) as InstructorRow[],
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getPublicInstructorById(id: string, locale?: string) {
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', id)
    .eq('is_instructor', true)
    .single();

  if (profileError || !profile) {
    console.error('Error fetching instructor profile', profileError);
    return null;
  }

  const { data: courses, error: coursesError } = await supabase
    .from('v_courses_full')
    .select('*')
    .eq('instructor_id', id)
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (coursesError) {
    console.error('Error fetching instructor courses', coursesError);
  }

  return {
    profile,
    courses: (courses || []).map(row =>
      mapCourseLocale(row as CourseRow, locale)
    ),
  };
}

export async function getFeaturedInstructors(limit: number = 4) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('is_instructor', true)
    .order('instructor_verified', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured instructors', error);
    return [];
  }

  return data || [];
}

// Filters
export async function getCategories(locale?: string) {
  const supabase = await createClient();
  const langId = getLangId(locale);
  const { data, error } = await supabase
    .from('lookup_categories')
    .select(
      `
        id,
        slug,
        lookup_category_translations(language_id, name)
      `
    )
    .order('id');

  if (error) {
    console.error('Error fetching categories', error);
    return [];
  }

  return (data || []).map((cat: any) => {
    const t = cat.lookup_category_translations?.find(
      (tr: any) => tr.language_id === langId
    );
    return {
      id: cat.id,
      slug: cat.slug,
      name: t?.name || '',
    };
  });
}

export async function getCategoriesWithCounts(locale?: string) {
  const supabase = await createClient();
  const langId = getLangId(locale);

  // Get all categories with translations
  const { data: categories, error: categoriesError } = await supabase
    .from('lookup_categories')
    .select(
      `
        id,
        slug,
        lookup_category_translations(language_id, name)
      `
    )
    .order('id');

  if (categoriesError || !categories) {
    console.error('Error fetching categories', categoriesError);
    return [];
  }

  // Get course counts for each category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (cat: any) => {
      const t = cat.lookup_category_translations?.find(
        (tr: any) => tr.language_id === langId
      );

      // Count published courses in this category
      const { count, error: countError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', cat.id)
        .eq('is_published', true);

      if (countError) {
        console.error(
          `Error counting courses for category ${cat.id}`,
          countError
        );
      }

      return {
        id: cat.id.toString(),
        slug: cat.slug,
        name: t?.name || '',
        count: count || 0,
      };
    })
  );

  // Filter out categories with 0 courses and sort by count descending
  return categoriesWithCounts
    .filter(cat => cat.count > 0)
    .sort((a, b) => b.count - a.count);
}

export async function getLevels() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('lookup_levels')
    .select('*')
    .order('id');

  if (error) {
    console.error('Error fetching levels', error);
    return [];
  }

  return data || [];
}

export async function getLanguages() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('lookup_languages')
    .select('id, code, name, is_rtl')
    .order('id');

  if (error) {
    console.error('Error fetching languages', error);
    return [];
  }

  return data || [];
}

export async function getTestimonials(limit: number = 6) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('act_testimonials')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching testimonials', error);
    return [];
  }

  return data || [];
}

export async function checkEnrollment(userId: string | null, courseId: number) {
  if (!userId) return false;
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('course_id', courseId);

  if (error) {
    console.error('Error checking enrollment', error);
    return false;
  }

  return (count || 0) > 0;
}
