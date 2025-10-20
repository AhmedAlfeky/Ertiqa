// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  // إعادة توجيه تلقائي إلى اللغة الافتراضية
  redirect('/ar');
}