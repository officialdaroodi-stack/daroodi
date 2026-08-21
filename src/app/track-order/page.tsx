'use client';

import React, { useState } from 'react';
import { INITIAL_ORDERS } from '@/lib/mockData';
import { OrderStatus } from '@/lib/types';
import { Search, CheckCircle2, Clock, Scissors, ShieldCheck, Truck, PackageCheck } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderQuery, setOrderQuery] = useState('DAR-2026-8921');
  const [activeOrder, setActiveOrder] = useState(INITIAL_ORDERS[0]);

  const STAGES: { key: OrderStatus; label: string; icon: any }[] = [
    { key: 'pending', label: 'Order Received', icon: Clock },
    { key: 'processing', label: 'Pattern Drafting', icon: Scissors },
    { key: 'in_tailoring', label: 'Atelier Tailoring (Zari Stitched)', icon: Scissors },
    { key: 'quality_check', label: 'Master Quality Check', icon: ShieldCheck },
    { key: 'shipped', label: 'Dispatched via DHL', icon: Truck },
    { key: 'completed', label: 'Delivered', icon: PackageCheck },
  ];

  const currentStageIndex = STAGES.findIndex((s) => s.key === activeOrder.status);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = INITIAL_ORDERS.find((o) => o.order_number.toLowerCase() === orderQuery.trim().toLowerCase());
    if (found) {
      setActiveOrder(found);
    } else {
      alert(`Order "${orderQuery}" not found in demo records.`);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 16px 100px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span style={{ color: 'var(--green-700)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          ATELIER TRACKER
        </span>
        <h1 style={{ fontSize: '2.6rem', margin: '10px 0', color: 'var(--green-900)' }}>
          Track Your Bespoke Garment
        </h1>
        <p style={{ color: 'var(--slate-700)', fontSize: '0.95rem' }}>
          Monitor the real-time progress of your coat from pattern cut to hand needlework and DHL dispatch.
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', maxWidth: '460px', margin: '0 auto 50px' }}>
        <input
          type="text"
          placeholder="e.g. DAR-2026-8921"
          value={orderQuery}
          onChange={(e) => setOrderQuery(e.target.value)}
          style={{
            flexGrow: 1,
            padding: '12px 18px',
            borderRadius: '12px',
            border: '1px solid var(--cream-300)',
            background: 'var(--white)',
            fontSize: '0.95rem',
            outline: 'none',
          }}
        />
        <button type="submit" className="btn-3d-primary" style={{ padding: '12px 20px' }}>
          Track <Search size={16} />
        </button>
      </form>

      {/* Visualizer Card */}
      <div
        style={{
          background: 'var(--white)',
          border: '1px solid var(--cream-300)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px 30px',
          boxShadow: 'var(--shadow-3d-card)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--cream-300)', paddingBottom: '20px', marginBottom: '30px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase' }}>Order Number</span>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--green-900)' }}>{activeOrder.order_number}</h2>
          </div>
          <div>
            <span className={`status-pill status-${activeOrder.status}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
              ● Current State: {activeOrder.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* 6-Stage Visual Stepper */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {STAGES.map((st, idx) => {
            const isCompleted = idx <= (currentStageIndex > -1 ? currentStageIndex : 2);
            const isCurrent = idx === currentStageIndex;
            const Icon = st.icon;

            return (
              <div
                key={st.key}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: isCompleted ? 'var(--green-700)' : 'var(--cream-200)',
                    color: isCompleted ? '#fff' : 'var(--slate-400)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px',
                    boxShadow: isCurrent ? '0 0 0 4px var(--green-100)' : 'none',
                  }}
                >
                  <Icon size={20} />
                </div>
                <strong style={{ fontSize: '0.82rem', color: isCompleted ? 'var(--green-900)' : 'var(--slate-400)' }}>
                  {st.label}
                </strong>
              </div>
            );
          })}
        </div>

        {/* Garment Details & Measurements */}
        {activeOrder.measurements && (
          <div style={{ background: 'var(--cream-50)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--cream-300)' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--green-900)', marginBottom: '14px' }}>
              ✂️ Custom Master Pattern Specifications
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
              <div><span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Chest</span><div style={{ fontWeight: 700 }}>{activeOrder.measurements.chest}&quot;</div></div>
              <div><span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Shoulder</span><div style={{ fontWeight: 700 }}>{activeOrder.measurements.shoulder}&quot;</div></div>
              <div><span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Waist</span><div style={{ fontWeight: 700 }}>{activeOrder.measurements.waist}&quot;</div></div>
              <div><span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Sleeve</span><div style={{ fontWeight: 700 }}>{activeOrder.measurements.sleeve_length}&quot;</div></div>
              <div><span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Fit</span><div style={{ fontWeight: 700, textTransform: 'capitalize' }}>{activeOrder.measurements.fit_preference}</div></div>
            </div>
            {activeOrder.measurements.special_notes && (
              <p style={{ marginTop: '12px', fontSize: '0.82rem', color: 'var(--slate-700)' }}>
                <strong>Tailoring Note:</strong> {activeOrder.measurements.special_notes}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
