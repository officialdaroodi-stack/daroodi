'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { INITIAL_ORDERS } from '@/lib/mockData';
import { OrderStatus } from '@/lib/types';
import { ArrowLeft, Scissors, User, MapPin, CreditCard, ShieldCheck } from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const order = INITIAL_ORDERS.find((o) => o.id === id) || INITIAL_ORDERS[0];
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);

  const STATUS_OPTIONS: OrderStatus[] = [
    'pending',
    'processing',
    'in_tailoring',
    'quality_check',
    'shipped',
    'completed',
    'cancelled',
  ];

  const handleUpdate = () => {
    alert(`Status updated to: ${currentStatus.replace('_', ' ').toUpperCase()}`);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <Link href="/admin/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--green-700)', fontWeight: 600, marginBottom: '20px' }}>
        <ArrowLeft size={16} /> Back to Orders Pipeline
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase' }}>
            ORDER SPECIFICATION SHEET
          </span>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--green-900)' }}>{order.order_number}</h1>
        </div>

        {/* Status Modifier Box */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            value={currentStatus}
            onChange={(e) => setCurrentStatus(e.target.value as OrderStatus)}
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--cream-300)', fontWeight: 700, background: 'var(--white)', fontSize: '0.85rem' }}
          >
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>{st.replace('_', ' ').toUpperCase()}</option>
            ))}
          </select>
          <button onClick={handleUpdate} className="btn-3d-primary" style={{ padding: '10px 16px', fontSize: '0.85rem' }}>
            Update State
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Client & Shipping */}
        <div style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--cream-300)', boxShadow: 'var(--shadow-3d-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--green-900)' }}>
            <User size={20} />
            <h3 style={{ fontSize: '1.1rem' }}>Client Information</h3>
          </div>
          <p><strong>{order.shipping_address.full_name}</strong></p>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '4px' }}>{order.shipping_address.email}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>{order.shipping_address.phone}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '8px' }}>
            {order.shipping_address.address_line1}, {order.shipping_address.city}, {order.shipping_address.country} ({order.shipping_address.postal_code})
          </p>
        </div>

        {/* Payment & Grand Total */}
        <div style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--cream-300)', boxShadow: 'var(--shadow-3d-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--green-900)' }}>
            <CreditCard size={20} />
            <h3 style={{ fontSize: '1.1rem' }}>Financial Summary</h3>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
            <span>Payment Method</span>
            <strong>{order.payment_method}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
            <span>Payment Status</span>
            <strong style={{ color: 'var(--green-700)' }}>{order.payment_status.toUpperCase()}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 700, color: 'var(--green-900)', borderTop: '1px solid var(--cream-300)', paddingTop: '12px', marginTop: '12px' }}>
            <span>Grand Total</span>
            <span>£{order.grand_total}</span>
          </div>
        </div>
      </div>

      {/* Tailor Custom Measurement Spec Card */}
      {order.measurements && (
        <div style={{ background: 'var(--white)', padding: '30px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--cream-300)', boxShadow: 'var(--shadow-3d-card)', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--green-900)' }}>
            <Scissors size={22} color="var(--green-700)" />
            <h2 style={{ fontSize: '1.3rem' }}>Master Cutter Measurement Specifications (Inches)</h2>
          </div>

          <div className="measurement-grid">
            <div className="measurement-item"><span className="measurement-key">Chest</span><span className="measurement-val">{order.measurements.chest}&quot;</span></div>
            <div className="measurement-item"><span className="measurement-key">Shoulder</span><span className="measurement-val">{order.measurements.shoulder}&quot;</span></div>
            <div className="measurement-item"><span className="measurement-key">Waist</span><span className="measurement-val">{order.measurements.waist}&quot;</span></div>
            <div className="measurement-item"><span className="measurement-key">Hips</span><span className="measurement-val">{order.measurements.hips}&quot;</span></div>
            <div className="measurement-item"><span className="measurement-key">Sleeve Length</span><span className="measurement-val">{order.measurements.sleeve_length}&quot;</span></div>
            <div className="measurement-item"><span className="measurement-key">Jacket Length</span><span className="measurement-val">{order.measurements.jacket_length}&quot;</span></div>
            <div className="measurement-item"><span className="measurement-key">Neck</span><span className="measurement-val">{order.measurements.neck || 16}&quot;</span></div>
            <div className="measurement-item"><span className="measurement-key">Height</span><span className="measurement-val">{order.measurements.height_ft || 'N/A'}</span></div>
            <div className="measurement-item"><span className="measurement-key">Fit Silhouette</span><span className="measurement-val" style={{ textTransform: 'capitalize' }}>{order.measurements.fit_preference}</span></div>
          </div>

          {order.measurements.special_notes && (
            <div style={{ marginTop: '20px', padding: '16px', background: 'var(--cream-50)', borderRadius: '8px', border: '1px solid var(--cream-300)' }}>
              <strong>Client Tailoring Notes:</strong>
              <p style={{ marginTop: '4px', fontSize: '0.9rem', color: 'var(--slate-700)' }}>{order.measurements.special_notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
