'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AuthUser } from '@/lib/auth';
import { getProducts } from '@/lib/db/products';
import { getOrders } from '@/lib/db/orders';
import { Order, Product } from '@/lib/types';
import { getRoleDisplayName } from '@/lib/rbac';
import {
  DollarSign,
  ShoppingBag,
  Scissors,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

export default function AdminDashboardOverview() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [meRes, ordersData, productsData] = await Promise.all([
          fetch('/api/auth/me', { cache: 'no-store' }).then((r) => r.json()),
          getOrders(),
          getProducts(),
        ]);
        if (cancelled) return;
        setCurrentUser(meRes.user || null);
        setOrders(ordersData);
        setProducts(productsData);
      } catch (err) {
        console.error('Failed to load admin overview data:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const role = currentUser?.role || 'super_admin';

  // Calculate Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + (o.grand_total || 0), 0);
  const inTailoringCount = orders.filter((o) => o.status === 'in_tailoring').length;
  // Pending payouts: no commission data wired up yet — show count of pending orders as a proxy
  const pendingPayoutCount = orders.filter((o) => o.status === 'pending').length;
  const hasPendingPayouts = pendingPayoutCount > 0;

  return (
    <div>
      {/* Executive Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F241E 0%, #1B5E20 100%)',
          color: '#FFFFFF',
          padding: '30px',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-3d-card)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <span style={{ color: 'var(--gold-500)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            OPERATIONAL COMMAND CENTER
          </span>
          <h1 style={{ fontSize: '2rem', color: '#fff', margin: '6px 0' }}>
            {getRoleDisplayName(role)} Workspace
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
            Connected to Supabase PostgreSQL Database · All systems operational.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/admin/orders" className="btn-3d-secondary" style={{ padding: '10px 18px', fontSize: '0.85rem' }}>
            Inspect Orders
          </Link>
          <Link href="/admin/products" className="btn-3d-secondary" style={{ padding: '10px 18px', fontSize: '0.85rem' }}>
            Manage Catalog
          </Link>
        </div>
      </div>

      {/* 3D KPI Metrics Grid */}
      <div className="metrics-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-green">
            <DollarSign size={24} />
          </div>
          <div>
            <div className="stat-value">£{totalRevenue.toLocaleString()}</div>
            <div className="stat-label">Total Store Revenue</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-gold">
            <ShoppingBag size={24} />
          </div>
          <div>
            <div className="stat-value">{orders.length}</div>
            <div className="stat-label">Active Orders</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-purple">
            <Scissors size={24} />
          </div>
          <div>
            <div className="stat-value">{inTailoringCount}</div>
            <div className="stat-label">Atelier Tailoring Queue</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-blue">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="stat-value">
              {hasPendingPayouts ? `${pendingPayoutCount}` : '£0'}
            </div>
            <div className="stat-label">
              {hasPendingPayouts ? 'Pending Payouts (Orders)' : 'Pending Payouts · No payouts yet'}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Processing Table */}
      <div className="data-card">
        <div className="data-card-header">
          <h2 className="data-card-title">Live Atelier Orders Pipeline</h2>
          <Link href="/admin/orders" className="btn-3d-secondary" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
            View Full Pipeline →
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Client / Agent</th>
                <th>Garment / Sizing</th>
                <th>Total (£)</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--slate-500)' }}>
                    Loading live order pipeline…
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--slate-500)' }}>
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id}>
                    <td>
                      <strong style={{ color: 'var(--green-900)' }}>{ord.order_number}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{ord.order_type.replace('_', ' ')}</div>
                    </td>
                    <td>
                      <div>{ord.shipping_address.full_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{ord.shipping_address.city}, {ord.shipping_address.country}</div>
                    </td>
                    <td>
                      {ord.items?.[0]?.product?.title}
                      <div style={{ fontSize: '0.75rem', color: 'var(--green-700)', fontWeight: 600 }}>
                        {ord.items?.[0]?.selected_size}
                      </div>
                    </td>
                    <td>
                      <strong>£{ord.grand_total}</strong>
                    </td>
                    <td>
                      <span className={`status-pill status-${ord.status}`}>
                        {ord.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', background: '#E8F5E9', color: '#2E7D32', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        {ord.payment_status}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="btn-3d-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                      >
                        Inspect Spec
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}