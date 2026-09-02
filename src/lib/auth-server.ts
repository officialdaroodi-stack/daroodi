import { createClient } from '@/lib/supabase/server';
import { UserProfile, UserRole } from '@/lib/types';

export type AuthUser = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
};

/**
 * SERVER-ONLY auth helpers. These import `next/headers` via the server
 * Supabase client and must NEVER be imported from a `'use client'` file.
 *
 * For admin actions that need the service-role key, use `@/lib/auth-admin`
 * (also server-only) or expose them through API routes under `src/app/api/`.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, full_name, role')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return {
      id: user.id,
      email: user.email ?? '',
      full_name: user.user_metadata?.full_name ?? '',
      role: 'customer',
    };
  }

  return profile as AuthUser;
}

export async function requireAuth(nextPath?: string): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    const params = nextPath ? `?next=${encodeURIComponent(nextPath)}` : '';
    throw new Error(`UNAUTHORIZED_REDIRECT:/auth/login${params}`);
  }
  return user;
}

export async function requireStaff(): Promise<AuthUser> {
  const user = await requireAuth();
  if (user.role === 'customer') {
    throw new Error('UNAUTHORIZED_REDIRECT:/account');
  }
  return user;
}
