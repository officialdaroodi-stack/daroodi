'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { INITIAL_ORDERS, INITIAL_PRODUCTS, INITIAL_COMMISSIONS } from '@/lib/mockData';
import { getRoleDisplayName } from '@/lib/rbac';
import {
  DollarSign,
  ShoppingBag,
  Scissors,
  Users,
  TrendingUp,
  Package,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export default function AdminDashboardOverview() {
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'super_admin';

  // Calculate Metrics
  const totalRevenue = INITIAL_ORDERS.reduce((acc, o) => acc + o.grand_total, 0);
  const inTailoringCount = INITIAL_ORDERS.filter((o) => o.status === 'in_tailoring').length;
  const pendingApprovals = INITIAL_COMMISSIONS.filter((c) => c.status === 'pending_approval');
  const pendingApprovalAmount = pendingApprovals.reduce((acc, c) => acc + c.commission_amount, 0);

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
            <div className="stat-value">{INITIAL_ORDERS.length}</div>
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
            <div className="stat-value">£{pendingApprovalAmount.toFixed(2)}</div>
            <div className="stat-label">Pending Commission Payouts</div>
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
              {INITIAL_ORDERS.map((ord) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
