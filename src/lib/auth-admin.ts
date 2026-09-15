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

export async function updateUserDetails(userId: string, data: {
  full_name?: string;
  email?: string;
  role?: UserRole;
  password?: string;
  assigned_country?: string | null;
  assigned_region?: string | null;
  commission_rate?: number | null;
  phone?: string | null;
}) {
  const admin = createAdminClient();

  // 1. Update Supabase Auth if email, password, or full_name provided
  const authUpdates: { email?: string; password?: string; user_metadata?: Record<string, any> } = {};
  if (data.email) authUpdates.email = data.email.trim();
  if (data.password && data.password.trim().length >= 8) authUpdates.password = data.password.trim();
  if (data.full_name) authUpdates.user_metadata = { full_name: data.full_name.trim() };

  if (Object.keys(authUpdates).length > 0) {
    const { error: authErr } = await admin.auth.admin.updateUserById(userId, authUpdates);
    if (authErr) throw authErr;
  }

  // 2. Update profiles table
  const profileUpdates: Record<string, any> = {};
  if (data.full_name !== undefined) profileUpdates.full_name = data.full_name.trim();
  if (data.email !== undefined) profileUpdates.email = data.email.trim();
  if (data.role !== undefined) profileUpdates.role = data.role;
  if (data.assigned_country !== undefined) profileUpdates.assigned_country = data.assigned_country;
  if (data.assigned_region !== undefined) profileUpdates.assigned_region = data.assigned_region;
  if (data.commission_rate !== undefined) profileUpdates.commission_rate = data.commission_rate;
  if (data.phone !== undefined) profileUpdates.phone = data.phone;
  profileUpdates.updated_at = new Date().toISOString();

  const { error: profileErr } = await admin
    .from('profiles')
    .update(profileUpdates)
    .eq('id', userId);
  if (profileErr) throw profileErr;

  return { ok: true };
}

export async function deleteAuthUser(userId: string) {
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) throw error;
}

