import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { createClient } from '@/lib/supabase/server';
import { Order } from '@/lib/types';
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Package,
  LogOut,
  KeyRound,
  ChevronRight,
  ShoppingBag,
  ShieldCheck,
} from 'lucide-react';
import { AccountActions } from '@/components/account/AccountActions';

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login?next=/account');

  // If user is admin / staff, automatically route directly to /admin
  if (user.role !== 'customer') {
    redirect('/admin');
  }

  const supabase = await createClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  const myOrders = (orders || []) as unknown as Order[];

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto 100px', padding: '0 16px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <span style={{ color: 'var(--green-700)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          MY ATELIER ACCOUNT
        </span>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--green-900)', margin: '6px 0 8px' }}>
          Welcome back, {user.full_name || 'valued client'}
        </h1>
        <p style={{ color: 'var(--slate-600)', fontSize: '1rem' }}>
          Manage your profile, track bespoke commissions, and review your order history.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'flex-start' }}>
        {/* Profile card */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--cream-300)', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: 'var(--shadow-3d-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--green-900), var(--green-700))',
                color: '#C9A84C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
                fontFamily: 'var(--font-serif)',
                flexShrink: 0,
              }}
            >
              {(user.full_name || user.email)[0]?.toUpperCase()}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontWeight: 800, color: 'var(--green-900)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.full_name || 'Unnamed client'}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--slate-700)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={15} color="var(--slate-400)" />
              <span>Role: <strong style={{ color: 'var(--green-900)', textTransform: 'capitalize' }}>{user.role.replace(/_/g, ' ')}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={15} color="var(--slate-400)" />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</span>
            </div>
          </div>

          <AccountActions />

          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--cream-300)' }}>
            <Link
              href="/shop"
              className="btn-3d-primary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px', fontSize: '0.9rem' }}
            >
              <ShoppingBag size={15} /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Orders */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--cream-300)', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: 'var(--shadow-3d-card)' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--green-900)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={18} color="var(--gold-500)" /> My Orders
          </h2>

          {myOrders.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--slate-500)' }}>
              <ShieldCheck size={32} color="var(--green-700)" style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ margin: 0, fontSize: '0.95rem' }}>You haven't placed any orders yet.</p>
              <p style={{ margin: '6px 0 0', fontSize: '0.85rem' }}>When you commission a bespoke piece, it will appear here with live tailoring status.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    border: '1px solid var(--cream-300)',
                    borderRadius: '12px',
                    background: 'var(--cream-50)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--green-900)' }}>#{order.order_number}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                      {new Date(order.created_at).toLocaleDateString()} · £{order.grand_total}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        background: 'var(--green-900)',
                        color: 'var(--gold-500)',
                      }}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <Link href={`/track-order?order=${order.order_number}`} aria-label="View order" style={{ color: 'var(--green-700)' }}>
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
