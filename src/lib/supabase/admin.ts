import { createClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client. Bypasses all RLS.
 * Use ONLY on the server (route handlers, server actions, seed scripts).
 * Never expose this to the browser.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
