'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Course = {
  id: number;
  content_id: number | null;
  instructor_id: number;
  objectives: string | null;
  outcomes: string | null;
  course_type: number | null;
  level: number | null;
  language: number | null;
  created_at: string;
  updated_at: string | null;
};


export default function TestDBPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase.from('inf_courses').select('*');
        if (error) throw error;
        setCourses(data || []);
      } catch (err: any) {
        setError(err.message || 'حدث خطأ غير معروف');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p>جارٍ التحميل...</p>;
  if (error) return <p className="text-red-600">خطأ: {error}</p>;

  return (
    <div dir="rtl" className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">اختبار الاتصال بقاعدة البيانات</h1>
      {courses.length === 0 ? (
        <p>لا توجد دورات في قاعدة البيانات.</p>
      ) : (
        <ul className="space-y-4">
            {courses.map((course) => (
                <li key={course.id} className="border p-4 rounded shadow-sm">
                <p><strong>رقم الدورة:</strong> {course.id}</p>
                <p><strong>المحتوى:</strong> {course.content_id ?? 'غير محدد'}</p>
                <p><strong>المدرب:</strong> {course.instructor_id}</p>
                <p><strong>النوع:</strong> {course.course_type ?? 'غير محدد'}</p>
                <p><strong>المستوى:</strong> {course.level ?? 'غير محدد'}</p>
                <p><strong>اللغة:</strong> {course.language ?? 'غير محددة'}</p>
                <p><strong>الأهداف:</strong> {course.objectives ?? 'لا يوجد'}</p>
                <p><strong>المخرجات:</strong> {course.outcomes ?? 'لا يوجد'}</p>
                <p><strong>تاريخ الإنشاء:</strong> {new Date(course.created_at).toLocaleString()}</p>
                </li>
            ))}
        </ul>
      )}
    </div>
  );
}