import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-server';
import { listAllUsers, createAuthUser } from '@/lib/auth-admin';
import { UserRole } from '@/lib/types';

async function authorizeStaff() {
  const me = await getCurrentUser();
  if (!me) return { error: 'Unauthenticated', status: 401 } as const;
  if (me.role !== 'super_admin' && me.role !== 'admin') {
    return { error: 'Forbidden', status: 403 } as const;
  }
  return { me } as const;
}

export async function GET() {
  const auth = await authorizeStaff();
  if ('error' in auth) return NextResponse.json(auth, { status: auth.status });
  try {
    const users = await listAllUsers();
    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to list users' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await authorizeStaff();
  if ('error' in auth) return NextResponse.json(auth, { status: auth.status });

  let body: { email?: string; password?: string; full_name?: string; role?: UserRole };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const { email, password, full_name, role } = body;
  if (!email || !password || !full_name || !role) {
    return NextResponse.json(
      { error: 'email, password, full_name and role are required' },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  try {
    const user = await createAuthUser({ email, password, full_name, role });
    return NextResponse.json({ user: { id: user.id, email: user.email } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 500 });
  }
}
