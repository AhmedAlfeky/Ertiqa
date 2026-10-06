import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Toaster } from 'sonner';
import { QueryProvider } from '@/lib/providers/query-provider';
import { ThemeProvider } from '@/lib/providers/theme-provider';
import { fontVariables } from '@/fonts';

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
    <html lang={locale} suppressHydrationWarning>
      <body
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        className={`overflow-x-hidden rtl:direction-rtl ${fontVariables} ${
          locale === 'ar' ? 'font-cairo' : 'font-poppins'
        } antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <QueryProvider>
              <>{children}</>
              <Toaster
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
                position="top-right"
              />
            </QueryProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
