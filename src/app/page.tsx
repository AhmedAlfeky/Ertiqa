// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  // إعادة توجيه تلقائي إلى اللغة الافتراضية
  redirect('/ar');
  // إضافة مؤقتة يتم حذفها بعد الاختبار
  return <main><h1>Ping — الصفحة تعمل</h1></main>;

}