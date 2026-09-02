import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-server';
import { deleteAuthUser } from '@/lib/auth-admin';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  if (me.role !== 'super_admin' && me.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  if (id === me.id) {
    return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
  }
  try {
    await deleteAuthUser(id);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 500 });
  }
}
