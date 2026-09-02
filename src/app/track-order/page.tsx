'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Order, OrderStatus } from '@/lib/types';
import { Search, Clock, Scissors, ShieldCheck, Truck, PackageCheck, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TrackOrderPage() {
  const [orderQuery, setOrderQuery] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searching, setSearching] = useState(false);

  const STAGES: { key: OrderStatus; label: string; icon: any; description: string }[] = [
    { key: 'pending', label: 'Order Confirmed', icon: Clock, description: 'Fabric allocation & initial pattern creation' },
    { key: 'processing', label: 'Pattern Drafting', icon: Scissors, description: 'Master bespoke cutting to your custom measurements' },
    { key: 'in_tailoring', label: 'Hand Needlework', icon: Scissors, description: 'Artisan Zardozi bullion & thread embroidery' },
    { key: 'quality_check', label: 'Master QC Inspection', icon: ShieldCheck, description: 'Double inspection & hand-press finishing' },
    { key: 'shipped', label: 'Dispatched via Courier', icon: Truck, description: 'Secure tracked international transit' },
    { key: 'completed', label: 'Delivered', icon: PackageCheck, description: 'Arrived at your destination address' },
  ];

  const currentStageIndex = activeOrder ? STAGES.findIndex((s) => s.key === activeOrder.status) : -1;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = orderQuery.trim();
    if (!trimmedQuery) {
      setErrorMsg('Please enter your Order ID or email address.');
      setActiveOrder(null);
      setSearched(true);
      return;
    }

    setSearched(true);
    setSearching(true);
    setErrorMsg('');
    setActiveOrder(null);

    try {
      const supabase = createClient();
      const trimmed = trimmedQuery.toLowerCase();

      // Primary lookup by exact order_number
      let { data: found, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', trimmedQuery)
        .maybeSingle();

      // Fallback: lookup by client_email if order_number didn't match
      if (!found && !error && trimmed.includes('@')) {
        const emailRes = await supabase
          .from('orders')
          .select('*')
          .ilike('client_email', trimmed)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (emailRes.data) found = emailRes.data;
      }

      // Fallback: lookup by id if it looks like a UUID
      if (!found) {
        const idRes = await supabase
          .from('orders')
          .select('*')
          .eq('id', trimmedQuery)
          .maybeSingle();
        if (idRes.data) found = idRes.data;
      }

      if (found) {
        setActiveOrder(found as unknown as Order);
        setErrorMsg('');
      } else {
        setActiveOrder(null);
        setErrorMsg(`No active orders found matching "${trimmedQuery}". Please check your confirmation receipt or reach out to our concierge.`);
      }
    } catch (err) {
      console.error('Order lookup failed', err);
      setErrorMsg(`No active orders found matching "${trimmedQuery}". Please check your confirmation receipt or reach out to our concierge.`);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 16px 100px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <span style={{ color: 'var(--green-700)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          LIVE ATELIER TRACKING
        </span>
        <h1 style={{ fontSize: '2.5rem', margin: '10px 0', color: 'var(--green-900)' }}>
          Track Your Order
        </h1>
        <p style={{ color: 'var(--slate-700)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
          Enter your Order Reference Number (e.g. from your confirmation email) to monitor your garment&apos;s handcrafted progress.
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', maxWidth: '520px', margin: '0 auto 40px' }}>
        <input
          type="text"
          placeholder="Enter Order ID (e.g. DRD-2026-001 or email)"
          value={orderQuery}
          onChange={(e) => {
            setOrderQuery(e.target.value);
            setErrorMsg('');
          }}
          aria-label="Order Reference Number or Email"
          style={{
            flexGrow: 1,
            padding: '13px 18px',
            borderRadius: '12px',
            border: '1px solid var(--cream-300)',
            background: 'var(--white)',
            fontSize: '0.95rem',
            outline: 'none',
          }}
        />
        <button type="submit" disabled={searching} className="btn-3d-primary" style={{ padding: '13px 22px', whiteSpace: 'nowrap' }}>
          {searching ? 'Searching…' : 'Track'} <Search size={16} />
        </button>
      </form>

      {/* Result or Initial State */}
      {searched && errorMsg && (
        <div
          style={{
            background: 'var(--white)',
            border: '1px solid var(--cream-300)',
            borderRadius: 'var(--radius-lg)',
            padding: '30px',
            textAlign: 'center',
            marginBottom: '40px',
            boxShadow: 'var(--shadow-3d-card)',
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(201, 168, 76, 0.15)', color: '#8A6D1E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <HelpCircle size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--green-900)', marginBottom: '8px' }}>Order Not Found</h3>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto 16px' }}>
            {errorMsg}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-secondary btn-sm">
              Contact Concierge
            </Link>
            <a
              href="https://wa.me/923001215532?text=Hello%20Daroodi,%20I%20would%20like%20to%20inquire%20about%20my%20order%20status."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      )}

      {activeOrder && (
        <div
          style={{
            background: 'var(--white)',
            border: '1px solid var(--cream-300)',
            borderRadius: 'var(--radius-xl)',
            padding: '40px 30px',
            boxShadow: 'var(--shadow-3d-card)',
            marginBottom: '40px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--cream-300)', paddingBottom: '20px', marginBottom: '30px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase' }}>Order Number</span>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--green-900)' }}>{activeOrder.order_number}</h2>
            </div>
            <div>
              <span className={`status-pill status-${activeOrder.status}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                ● Current Stage: {activeOrder.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* 6-Stage Visual Stepper */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            {STAGES.map((st, idx) => {
              const isCompleted = idx <= (currentStageIndex > -1 ? currentStageIndex : 0);
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
                  <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginTop: '4px' }}>
                    {st.description}
                  </span>
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
      )}

      {/* Atelier Craftsmanship Timeline Guide */}
      <div style={{ marginTop: '50px' }}>
        <h3 style={{ fontSize: '1.3rem', color: 'var(--green-900)', textAlign: 'center', marginBottom: '24px' }}>
          How Daroodi Handcrafted Orders Progress
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--cream-300)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--green-700)' }}>STAGE 01</span>
            <h4 style={{ fontSize: '1.05rem', margin: '8px 0 6px', color: 'var(--green-900)' }}>Bespoke Pattern Cut</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
              Our master cutter drafts a personalized card pattern based on your individual dimensions.
            </p>
          </div>
          <div style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--cream-300)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--green-700)' }}>STAGE 02</span>
            <h4 style={{ fontSize: '1.05rem', margin: '8px 0 6px', color: 'var(--green-900)' }}>Artisan Hand Embroidery</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
              Over 80–140 hours of meticulous hand needlework using authentic gold bullion and silk resham threads.
            </p>
          </div>
          <div style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--cream-300)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--green-700)' }}>STAGE 03</span>
            <h4 style={{ fontSize: '1.05rem', margin: '8px 0 6px', color: 'var(--green-900)' }}>Quality &amp; Structure</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
              Hand-padded chest canvas, lining insertion, and rigorous 12-point quality inspection.
            </p>
          </div>
          <div style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--cream-300)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--green-700)' }}>STAGE 04</span>
            <h4 style={{ fontSize: '1.05rem', margin: '8px 0 6px', color: 'var(--green-900)' }}>Global Tracked Courier</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
              Carefully packed in a luxury garment bag and dispatched via DHL Express with tracking updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
