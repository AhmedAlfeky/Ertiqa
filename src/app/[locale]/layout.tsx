import { Cairo, Orbitron, Poppins } from 'next/font/google';
import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Toaster } from 'sonner';
import { QueryProvider } from '@/lib/providers/query-provider';
import { Navbar } from '../components/landing/Navbar';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
});

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['latin'],
});

const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
});

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  // Load messages for next-intl
  const messages = (await import(`../../messages/${locale}.json`)).default;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        className={`overflow-x-hidden dark rtl:direction-rtl ${
          locale === 'ar'
            ? `${cairo.variable} cairo`
            : `${orbitron.variable} ${poppins.variable} poppins`
        } antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <Navbar />
            <>{children}</>
            <Toaster
              dir={locale === 'ar' ? 'rtl' : 'ltr'}
              position="top-right"
            />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
