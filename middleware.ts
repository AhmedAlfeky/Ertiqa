import { NextRequest, NextResponse } from 'next/server';

// اللغات المدعومة
const supportedLocales = ['ar', 'en', 'fr'];
const defaultLocale = 'ar';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // تجاهل الملفات الثابتة و API Routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|webp|woff|woff2|ttf|eot|css|js)$/i)
  ) {
    return NextResponse.next();
  }

  // استخراج اللغة من المسار (إذا وُجدت)
  const pathnameIsMissingLocale = supportedLocales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // إذا لم تكن اللغة في المسار، وجّه إلى اللغة الافتراضية
  if (pathnameIsMissingLocale) {
    const locale = getLocaleFromRequest(request) || defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  return NextResponse.next();
}

// تحديد اللغة من طلب المستخدم (المتصفح أو الكوكيز لاحقًا)
function getLocaleFromRequest(request: NextRequest): string | null {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return null;

  // استخراج أول لغة مفضلة (مثل "ar-SA" → "ar")
  const userLocale = acceptLanguage.split(',')[0].split('-')[0];
  return supportedLocales.includes(userLocale) ? userLocale : null;
}

// تكوين Middleware
export const config = {
  matcher: [
    // تطابق جميع المسارات باستثناء الملفات الثابتة و API
    '/((?!_next|api|static|.*\\..*).*)',
  ],
};