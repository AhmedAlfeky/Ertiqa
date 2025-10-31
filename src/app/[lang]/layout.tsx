import { ReactNode } from 'react';
import PublicLayout from '@/app/(public)/layout';
//import { promises } from 'dns';


// ✅ إزالة async إذا لم تكن بحاجة لـ await داخل الدالة
export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // ✅ استخدم await لفك الـ Promise
  const { lang } = await params;

  return (
    <PublicLayout lang={lang}>{children}</PublicLayout>
   );
}