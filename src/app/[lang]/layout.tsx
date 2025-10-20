import { ReactNode } from 'react';
import PublicLayout from '@/app/(public)/layout'; // ✅ استيراد PublicLayout

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const fontClass = lang === 'ar' ? 'font-tajawal' : 'font-inter';

  return (
    <html lang={lang} dir={dir} className={fontClass}>
      <body>
        {/* تغليف المحتوى بـ PublicLayout */}
        <PublicLayout lang={lang}>{children}</PublicLayout>
      </body>
    </html>
  );
}