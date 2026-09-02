import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { AdminShell } from '@/components/admin/AdminShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login?next=/admin');
  }
  if (user.role === 'customer') {
    redirect('/account');
  }
  return <AdminShell user={user}>{children}</AdminShell>;
}
