import pool from '../pool';

export interface CourseItem {
  id: number;
  title: string;
  slug: string;
  summary: string;
  cover_image_url: string;
  instructor_name: string;
  published_at: string;
}

export async function getPublishedCourses(limit: number = 10): Promise<CourseItem[]> {
  const query = `
    SELECT 
      c.id,
      cont.title,
      cont.slug,
      cont.summary,
      cont.cover_image_url,
      u.full_name AS instructor_name,
      cont.published_at
    FROM inf_courses c
    JOIN inf_contents cont ON c.content_id = cont.id
    JOIN inf_profiles u ON c.instructor_id = u.user_id
    JOIN lookup_cont_status st ON cont.status = st.id
    WHERE st.name = 'PUBLISHED'
    ORDER BY cont.published_at DESC
    LIMIT $1
  `;
  
  const { rows } = await pool.query(query, [limit]);
  return rows as CourseItem[];
}