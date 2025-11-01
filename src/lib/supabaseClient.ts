import { createClient } from '@supabase/supabase-js';

//تم إيقاف هذا الكود لاختبار الكود الآخر
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);




// للـ client: استخدام متغيرات NEXT_PUBLIC_
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

// للخادم (إذا تحتاج صلاحيات أعلى) استخدم SERVICE_ROLE_KEY دون NEXT_PUBLIC_
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);