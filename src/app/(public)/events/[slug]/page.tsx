// ضع هذا في أعلى الصفحة
import { notFound } from "next/navigation";

export default function Page({ params }: { params?: any }) {
  // ✅ الشرط الأساسي: لو الصفحة ما عندهاش params أو بيانات
  if (!params || !params.slug) {
    notFound(); // يتجاهل الصفحة ويعرض 404
  }

  // مثال: لو البيانات من API أو DB مش موجودة
  const data = null; // افترض أنها فارغة
  if (!data) {
    notFound();
  }

  return (
    <main>
      <h1>صفحة: {params.slug}</h1>
      <p>المحتوى موجود هنا.</p>
    </main>
  );
}

// import React from "react";

// interface EventPageProps {
//   params: { slug: string };
// }

// export default function EventPage({ params }: EventPageProps) {
//   return (
//     <main className="p-6">
//       <h1 className="text-2xl font-bold text-gray-800">الفعالية: {params.slug}</h1>
//       <p className="mt-2 text-gray-600">تفاصيل الفعالية ستظهر هنا لاحقًا.</p>
//     </main>
//   );
// }