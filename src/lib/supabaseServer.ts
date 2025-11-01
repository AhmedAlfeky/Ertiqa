// lib/supabaseServer.ts
import { createClient } from "@supabase/supabase-js";

// ✅ التحقق من وجود المتغيرات البيئية الأساسية
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("❌ Environment variable NEXT_PUBLIC_SUPABASE_URL is missing.");
}

if (!supabaseServiceRoleKey) {
  throw new Error("❌ Environment variable SUPABASE_SERVICE_ROLE_KEY is missing.");
}

/**
 * ✅ Supabase Client مخصص للاستخدام على السيرفر فقط
 * يستخدم Service Role Key (صلاحيات كاملة)
 * ⚠️ لا تستعمل هذا الملف في Client Components أبدًا
 */
export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false, // لا حاجة لحفظ الجلسة على السيرفر
    autoRefreshToken: false, // لا داعي لتحديث الرموز على السيرفر
  },
});

export default supabaseServer;
