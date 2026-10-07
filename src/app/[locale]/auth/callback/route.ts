import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROLE_IDS, ROLE_REDIRECTS } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const type = requestUrl.searchParams.get('type'); // recovery, signup, etc.
  const locale = requestUrl.pathname.split('/')[1] || 'ar';

  if (code) {
    try {
      const supabase = await createClient();
      
      // Exchange code for session
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('❌ Error exchanging code:', error);
        return NextResponse.redirect(`${requestUrl.origin}/${locale}/login?error=${encodeURIComponent(error.message)}`);
      }

      // Handle password recovery differently
      if (type === 'recovery') {
        return NextResponse.redirect(`${requestUrl.origin}/${locale}/reset-password`);
      }

      // Get user to determine redirect for normal login
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get role from user metadata
        const roleId = user.user_metadata?.role_id || ROLE_IDS.STUDENT;
        const redirectPath = ROLE_REDIRECTS[roleId] || '/student/dashboard';

        return NextResponse.redirect(`${requestUrl.origin}/${locale}${redirectPath}`);
      }
    } catch (err: any) {
      console.error('❌ Callback exception:', err);
      return NextResponse.redirect(`${requestUrl.origin}/${locale}/login?error=connection_error`);
    }
  }

  console.warn('⚠️ No code or user, redirecting to login');
  return NextResponse.redirect(`${requestUrl.origin}/${locale}/login`);
}
