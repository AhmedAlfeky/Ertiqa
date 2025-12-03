import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/types/database.types';

/**
 * Admin client with service role key for privileged operations
 * ⚠️ ONLY use on the server side
 * ⚠️ Never expose service role key to the client
 */
export const createAdminClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};
