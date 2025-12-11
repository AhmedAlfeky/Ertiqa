// =============================================================================
// ROLE CONFIGURATION
// =============================================================================
export const ROLE_IDS = {
  STUDENT: 1,
  INSTRUCTOR: 2,
  SUPPORT: 3,
  ADMIN: 5, // Updated: ADMIN is now 5
  GUEST: 4, // Updated: GUEST is now 4
} as const;

export type RoleName = 'STUDENT' | 'INSTRUCTOR' | 'SUPPORT' | 'ADMIN' | 'GUEST';

export const ROLES: Record<RoleName, RoleName> = {
  STUDENT: 'STUDENT',
  INSTRUCTOR: 'INSTRUCTOR',
  SUPPORT: 'SUPPORT',
  ADMIN: 'ADMIN',
  GUEST: 'GUEST',
} as const;

// =============================================================================
// ROLE-BASED REDIRECTS
// =============================================================================
export const ROLE_REDIRECTS: Record<number, string> = {
  [ROLE_IDS.STUDENT]: '/student/dashboard',
  [ROLE_IDS.INSTRUCTOR]: '/instructor/dashboard',
  [ROLE_IDS.SUPPORT]: '/support/dashboard',
  [ROLE_IDS.ADMIN]: '/admin/dashboard', // role_id 5
  [ROLE_IDS.GUEST]: '/', // role_id 4
};

export const DEFAULT_ROLE: RoleName = 'STUDENT';
export const DEFAULT_ROLE_ID = ROLE_IDS.STUDENT;

// =============================================================================
// ROUTE PROTECTION
// =============================================================================
export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/auth/callback',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
];

export const PROTECTED_ROUTES = [
  '/student',
  '/instructor',
  '/admin',
  '/support',
  '/profile',
  '/settings',
];

// Role-based route guards (which roles can access which routes)
export const ROLE_ROUTE_GUARDS: Record<string, number[]> = {
  '/student': [ROLE_IDS.STUDENT],
  '/instructor': [ROLE_IDS.INSTRUCTOR],
  '/admin': [ROLE_IDS.ADMIN],
  '/support': [ROLE_IDS.SUPPORT],
};

// =============================================================================
// LOCALE CONFIGURATION
// =============================================================================
export const SUPPORTED_LOCALES = ['ar', 'en', 'fr'] as const;
export const DEFAULT_LOCALE = 'ar';

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

// =============================================================================
// ROLE DISPLAY NAMES (for UI)
// =============================================================================
export const ROLE_DISPLAY_NAMES: Record<RoleName, { en: string; ar: string }> =
  {
    STUDENT: { en: 'Student', ar: 'طالب' },
    INSTRUCTOR: { en: 'Instructor', ar: 'مدرب' },
    SUPPORT: { en: 'Support', ar: 'دعم فني' },
    ADMIN: { en: 'Admin', ar: 'مدير' },
    GUEST: { en: 'Guest', ar: 'زائر' },
  };
