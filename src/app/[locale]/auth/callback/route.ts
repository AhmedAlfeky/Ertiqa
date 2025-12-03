import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROLE_IDS, ROLE_REDIRECTS } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const type = requestUrl.searchParams.get('type'); // recovery, signup, etc.
  const locale = requestUrl.pathname.split('/')[1] || 'ar';

  console.log('🔗 Auth callback triggered:', {
    code: code ? 'present' : 'missing',
    type,
    locale,
    url: requestUrl.href,
  });

  if (code) {
    const supabase = await createClient();
    
    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('❌ Error exchanging code:', error);
      return NextResponse.redirect(`${requestUrl.origin}/${locale}/login?error=${error.message}`);
    }

    console.log('✅ Code exchanged successfully');

    // Handle password recovery differently
    if (type === 'recovery') {
      console.log('🔐 Password recovery detected, redirecting to reset password');
      return NextResponse.redirect(`${requestUrl.origin}/${locale}/reset-password`);
    }

    // Get user to determine redirect for normal login
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      console.log('👤 User data:', {
        id: user.id,
        email: user.email,
        metadata: user.user_metadata,
      });

      // Get role from user metadata
      const roleId = user.user_metadata?.role_id || ROLE_IDS.STUDENT;
      const redirectPath = ROLE_REDIRECTS[roleId] || '/student/dashboard';

      console.log('🎯 Callback redirect:', {
        roleId,
        redirectPath,
        fullUrl: `${requestUrl.origin}/${locale}${redirectPath}`,
      });

      return NextResponse.redirect(`${requestUrl.origin}/${locale}${redirectPath}`);
    }
  }

  console.warn('⚠️ No code or user, redirecting to login');
  return NextResponse.redirect(`${requestUrl.origin}/${locale}/login`);
}
