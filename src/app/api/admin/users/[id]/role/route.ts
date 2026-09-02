import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-server';
import { updateUserRole } from '@/lib/auth-admin';
import { UserRole } from '@/lib/types';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  if (me.role !== 'super_admin' && me.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  let body: { role?: UserRole };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (!body.role) {
    return NextResponse.json({ error: 'role is required' }, { status: 400 });
  }

  try {
    await updateUserRole(id, body.role);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update role' }, { status: 500 });
  }
}
