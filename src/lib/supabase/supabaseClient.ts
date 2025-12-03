// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// ✅ التحقق من وجود المتغيرات البيئية في وقت التشغيل
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("❌ Environment variable NEXT_PUBLIC_SUPABASE_URL is missing.");
}

if (!supabaseAnonKey) {
  throw new Error("❌ Environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.");
}

// ✅ إنشاء عميل Supabase آمن للاستخدام من جهة العميل (Browser)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // يحفظ جلسة المستخدم في المتصفح
    autoRefreshToken: true, // يحدّث الرموز تلقائيًا
  },
});

export default supabaseClient;