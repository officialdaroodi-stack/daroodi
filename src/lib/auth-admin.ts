import { createAdminClient } from '@/lib/supabase/admin';
import { UserProfile, UserRole } from '@/lib/types';

/**
 * SERVER-ONLY admin operations using the Supabase service-role key.
 * Bypasses RLS. Never import from a client component.
 */

export async function listAllUsers(): Promise<UserProfile[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as UserProfile[];
}

export async function createAuthUser(opts: {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
}) {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email: opts.email,
    password: opts.password,
    email_confirm: true,
    user_metadata: { full_name: opts.full_name },
  });
  if (error) throw error;
  if (!data.user) throw new Error('User creation failed');

  const { error: profileErr } = await admin
    .from('profiles')
    .update({ full_name: opts.full_name, role: opts.role, email: opts.email })
    .eq('id', data.user.id);
  if (profileErr) throw profileErr;

  return data.user;
}

export async function updateUserRole(userId: string, role: UserRole) {
  const admin = createAdminClient();
  const { error } = await admin.from('profiles').update({ role }).eq('id', userId);
  if (error) throw error;
}

export async function deleteAuthUser(userId: string) {
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) throw error;
}
