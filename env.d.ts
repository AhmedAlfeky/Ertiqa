namespace NodeJS {
  interface ProcessEnv {
    /**
     * 🔗 رابط مشروع Supabase
     * مثال: https://xyzcompany.supabase.co
     */
    NEXT_PUBLIC_SUPABASE_URL: string;

    /**
     * 🔑 المفتاح العام (Anon key)
     * يستخدم في الواجهة الأمامية (Client Side)
     */
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;

    /**
     * 🧩 المفتاح السري (Service Role Key)
     * ⚠️ لا تضعه أبدًا في متغير يبدأ بـ NEXT_PUBLIC_ لأنه سري جدًا
     * يُستخدم فقط في lib/supabaseServer.ts أو داخل API routes
     */
    SUPABASE_SERVICE_ROLE_KEY: string;

    /**
     * 🧠 بيئة المشروع (تلقائيًا من Vercel أو يدويًا)
     * مثال: development | production
     */
    NODE_ENV: "development" | "production" | "test";
  }
}

export {};
