import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  PUBLIC_ROUTES,
  ROLE_REDIRECTS,
  ROLE_IDS,
} from '@/lib/constants';

function getLocaleFromPathname(pathname: string): string | null {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];

  if (SUPPORTED_LOCALES.includes(potentialLocale as any)) {
    return potentialLocale;
  }
  return null;
}

function isPublicRoute(pathname: string): boolean {
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';

  return PUBLIC_ROUTES.some(route => {
    if (route === '/') {
      return pathWithoutLocale === '/';
    }
    return pathWithoutLocale.startsWith(route);
  });
}

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.match(
      /\.(jpg|jpeg|png|gif|svg|ico|webp|woff|woff2|ttf|eot|css|js)$/i
    )
  ) {
    return NextResponse.next();
  }

  let locale = getLocaleFromPathname(pathname);
  let response: NextResponse;

  if (!locale) {
    const url = new URL(`/${DEFAULT_LOCALE}${pathname}`, origin);
    return NextResponse.redirect(url);
  }

  response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;
  console.log('session', user);
  console.log('user', user);
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';
  const isPublic = isPublicRoute(pathname);
  const isAuthRoute =
    pathWithoutLocale === '/login' || pathWithoutLocale === '/signup';
  const isHomepage = pathWithoutLocale === '/';

  // If user is logged in and trying to access auth routes or homepage, redirect to dashboard
  if (user && (isAuthRoute || isHomepage)) {
    // Get role from user_metadata (prioritize role_id)
    const roleId =
      user.user_metadata?.role_id ||
      user.app_metadata?.role_id ||
      ROLE_IDS.STUDENT;

    // Use ROLE_REDIRECTS from constants for consistent redirects
    const redirectPath =
      ROLE_REDIRECTS[roleId] || ROLE_REDIRECTS[ROLE_IDS.STUDENT];

    // Prevent redirect loop: if redirect path is the same as current path, don't redirect
    if (redirectPath === pathWithoutLocale) {
      return response;
    }

    // If role is GUEST and user is on homepage, allow them to stay (homepage is public)
    if (roleId === ROLE_IDS.GUEST && isHomepage) {
      return response;
    }

    console.log('🎯 Redirecting', user.email, 'role_id:', roleId, 'to:', redirectPath);

    const url = new URL(`/${locale}${redirectPath}`, origin);
    return NextResponse.redirect(url);
  }

  if (!user && !isPublic) {
    const url = new URL(`/${locale}/login`, origin);
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect admins away from instructor space to the admin dashboard
  if (user) {
    const roleId =
      user.user_metadata?.role_id ||
      user.app_metadata?.role_id ||
      ROLE_IDS.STUDENT;

    if (roleId === ROLE_IDS.ADMIN && pathWithoutLocale.startsWith('/instructor')) {
      const url = new URL(`/${locale}${ROLE_REDIRECTS[ROLE_IDS.ADMIN]}`, origin);
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)'],
};
