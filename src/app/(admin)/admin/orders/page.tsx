'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_ORDERS } from '@/lib/mockData';
import { Order, OrderStatus } from '@/lib/types';
import { ShoppingBag, Eye, Scissors, Filter, CheckCircle2 } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    alert(`Order ${orderId} updated to: ${newStatus.replace('_', ' ').toUpperCase()}`);
  };

  const STATUS_OPTIONS: OrderStatus[] = [
    'pending',
    'processing',
    'in_tailoring',
    'quality_check',
    'shipped',
    'completed',
    'cancelled',
  ];

  const filteredOrders = orders.filter((o) =>
    filterStatus === 'all' ? true : o.status === filterStatus
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--green-900)' }}>Atelier Order Fulfillment & Tailoring</h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
            Track garment lifecycles from paper pattern drafting to bullion stitching and DHL dispatch.
          </p>
        </div>

        {/* Filter Status Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'pending', 'processing', 'in_tailoring', 'quality_check', 'shipped', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={filterStatus === st ? 'btn-3d-primary' : 'btn-3d-secondary'}
              style={{ padding: '6px 12px', fontSize: '0.75rem', textTransform: 'capitalize' }}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="data-card">
        <div className="data-card-header">
          <h2 className="data-card-title">Active Orders Pipeline ({filteredOrders.length})</h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Client Details</th>
                <th>Piece & Sizing</th>
                <th>Custom Measurements</th>
                <th>Total (£)</th>
                <th>Status Modifier</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((ord) => (
                <tr key={ord.id}>
                  <td>
                    <strong style={{ color: 'var(--green-900)' }}>{ord.order_number}</strong>
                    <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>
                      {new Date(ord.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div>{ord.shipping_address.full_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{ord.shipping_address.email}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{ord.shipping_address.city}, {ord.shipping_address.country}</div>
                  </td>
                  <td>
                    <strong>{ord.items?.[0]?.product?.title}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--green-700)', fontWeight: 600 }}>
                      Size: {ord.items?.[0]?.selected_size}
                    </div>
                  </td>
                  <td>
                    {ord.measurements ? (
                      <span style={{ fontSize: '0.75rem', background: '#E8F5E9', color: '#1B5E20', padding: '3px 8px', borderRadius: '4px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Scissors size={12} /> {ord.measurements.chest}&quot; C / {ord.measurements.shoulder}&quot; S / {ord.measurements.waist}&quot; W
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Standard Size</span>
                    )}
                  </td>
                  <td>
                    <strong>£{ord.grand_total}</strong>
                  </td>
                  <td>
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid var(--cream-300)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: 'var(--cream-50)',
                        cursor: 'pointer',
                      }}
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st.replace('_', ' ').toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <Link
                      href={`/admin/orders/${ord.id}`}
                      className="btn-3d-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      <Eye size={14} /> Full Spec
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
