'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';

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
        const { data, error } = await supabaseClient.from('inf_courses').select('*');
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

  if (loading) return <p className="text-center p-6">جارٍ التحميل...</p>;
  if (error) return <p className="text-red-600 text-center p-6">خطأ: {error}</p>;

  return (
    <div dir="rtl" className="p-6 max-w-7xl mx-auto overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">اختبار الاتصال بقاعدة البيانات</h1>

      {courses.length === 0 ? (
        <p className="text-center">لا توجد دورات في قاعدة البيانات.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-right font-semibold text-gray-700 border-b">رقم الدورة</th>
              <th className="py-3 px-4 text-right font-semibold text-gray-700 border-b">المحتوى</th>
              <th className="py-3 px-4 text-right font-semibold text-gray-700 border-b">المدرب</th>
              <th className="py-3 px-4 text-right font-semibold text-gray-700 border-b">النوع</th>
              <th className="py-3 px-4 text-right font-semibold text-gray-700 border-b">المستوى</th>
              <th className="py-3 px-4 text-right font-semibold text-gray-700 border-b">اللغة</th>
              <th className="py-3 px-4 text-right font-semibold text-gray-700 border-b">الأهداف</th>
              <th className="py-3 px-4 text-right font-semibold text-gray-700 border-b">المخرجات</th>
              <th className="py-3 px-4 text-right font-semibold text-gray-700 border-b">تاريخ الإنشاء</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50 border-b">
                <td className="py-3 px-4 text-right">{course.id}</td>
                <td className="py-3 px-4 text-right">{course.content_id ?? '—'}</td>
                <td className="py-3 px-4 text-right">{course.instructor_id}</td>
                <td className="py-3 px-4 text-right">{course.course_type ?? '—'}</td>
                <td className="py-3 px-4 text-right">{course.level ?? '—'}</td>
                <td className="py-3 px-4 text-right">{course.language ?? '—'}</td>
                <td className="py-3 px-4 text-right max-w-xs break-words">{course.objectives ?? '—'}</td>
                <td className="py-3 px-4 text-right max-w-xs break-words">{course.outcomes ?? '—'}</td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  {new Date(course.created_at).toLocaleString('ar-SA')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}



// import { createClient } from "@supabase/supabase-js";

// type Props = { params: { lang: string } };

// export default async function Page({ params }: Props) {
//   const { lang } = params;

//   const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.SUPABASE_SERVICE_ROLE_KEY! // مخصّص للسيرفر فقط
//   );

//   try {
//     // استعلام جدول lookup_languages (يمكن إضافة where حسب اللغة إذا لديك عمود للغة)
//     const { data, error } = await supabase
//       .from("lookup_languages")
//       .select("*")
//       .limit(50);

//     if (error) throw error;

//     return (
//       <main>
//         <h1>✅ اختبار الاتصال بقاعدة البيانات — landing ({lang})</h1>
//         <p>عدد السجلات التي استُرجعت: {Array.isArray(data) ? data.length : 0}</p>
//         <pre>
//           {JSON.stringify(data, null, 2)}
//         </pre>
//       </main>
//     );
//   } catch (err: any) {
//     return (
//       <main>
//         <h1>❌ فشل الاتصال بـ Supabase — landing ({lang})</h1>
//         <p>رسالة الخطأ:</p>
//         <pre>
//           {String(err?.message ?? err)}
//         </pre>
//       </main>
//     );
//   }
// }

/////////////////////////////////////////////////////////////////////////////////////////

// 'use client';

// import { useEffect, useState } from 'react';
// import { supabaseClient } from '@/lib/supabaseClient';

// type Course = {
//   id: number;
//   content_id: number | null;
//   instructor_id: number;
//   objectives: string | null;
//   outcomes: string | null;
//   course_type: number | null;
//   level: number | null;
//   language: number | null;
//   created_at: string;
//   updated_at: string | null;
// };


// export default function TestDBPage() {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const { data, error } = await supabaseClient.from('inf_courses').select('*');
//         if (error) throw error;
//         setCourses(data || []);
//       } catch (err: any) {
//         setError(err.message || 'حدث خطأ غير معروف');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   if (loading) return <p>جارٍ التحميل...</p>;
//   if (error) return <p className="text-red-600">خطأ: {error}</p>;

//   return (
//     <div dir="rtl" className="p-6 max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">اختبار الاتصال بقاعدة البيانات</h1>
//       {courses.length === 0 ? (
//         <p>لا توجد دورات في قاعدة البيانات.</p>
//       ) : (
//         <ul className="space-y-4">
//             {courses.map((course) => (
//                 <li key={course.id} className="border p-4 rounded shadow-sm">
//                 <p><strong>رقم الدورة:</strong> {course.id}</p>
//                 <p><strong>المحتوى:</strong> {course.content_id ?? 'غير محدد'}</p>
//                 <p><strong>المدرب:</strong> {course.instructor_id}</p>
//                 <p><strong>النوع:</strong> {course.course_type ?? 'غير محدد'}</p>
//                 <p><strong>المستوى:</strong> {course.level ?? 'غير محدد'}</p>
//                 <p><strong>اللغة:</strong> {course.language ?? 'غير محددة'}</p>
//                 <p><strong>الأهداف:</strong> {course.objectives ?? 'لا يوجد'}</p>
//                 <p><strong>المخرجات:</strong> {course.outcomes ?? 'لا يوجد'}</p>
//                 <p><strong>تاريخ الإنشاء:</strong> {new Date(course.created_at).toLocaleString()}</p>
//                 </li>
//             ))}
//         </ul>
//       )}
//     </div>
//   );
// }