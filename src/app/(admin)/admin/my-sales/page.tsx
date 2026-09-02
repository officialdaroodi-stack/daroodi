'use client';

import React, { useEffect, useState } from 'react';
import { getOrders } from '@/lib/db/orders';
import { Order } from '@/lib/types';
import { AuthUser } from '@/lib/auth';
import { TrendingUp, DollarSign, Copy, CheckCircle, ArrowRight } from 'lucide-react';

export default function MySalesPartnerPage() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [meRes, allOrders] = await Promise.all([
          fetch('/api/auth/me', { cache: 'no-store' }).then((r) => r.json()),
          getOrders(),
        ]);
        if (!cancelled) {
          setCurrentUser(meRes.user || null);
          setOrders(allOrders);
        }
      } catch (err) {
        if (!cancelled) console.error('MySales: failed to load', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const agentId = currentUser?.id || '';

  // No commissions db module yet — derive a referral count from orders attributed to this agent.
  const myOrders = orders.filter((o) => o.agent_id === agentId);
  const myCommissions = myOrders; // placeholder shape; commissions arrive when db module lands
  const totalEarned = 0; // pending commissions db
  const approvedEarned = 0; // pending commissions db

  const referralCode = currentUser?.email?.split('@')[0] || 'daroodi_partner';
  const referralLink = `https://daroodi.com/?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert(`Copied your bespoke partner referral link:\n${referralLink}`);
  };

  const handleRequestPayout = () => {
    alert(`Payout request for £${approvedEarned.toFixed(2)} submitted to Chief Finance Manager!`);
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <span style={{ color: 'var(--green-700)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          PARTNER & SALES PORTAL
        </span>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--green-900)', marginTop: '4px' }}>
          Welcome, {currentUser?.full_name}
        </h1>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
          Assigned Territory: <strong>Global / HQ</strong> · Base Commission Rate: <strong>15%</strong>
        </p>
      </div>

      {/* KPI Cards */}
      <div className="metrics-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-green">
            <DollarSign size={24} />
          </div>
          <div>
            <div className="stat-value">£{approvedEarned.toFixed(2)}</div>
            <div className="stat-label">Available for Payout</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-gold">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="stat-value">£{totalEarned.toFixed(2)}</div>
            <div className="stat-label">Lifetime Commissions</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-blue">
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="stat-value">{myCommissions.length}</div>
            <div className="stat-label">Referred Bespoke Orders</div>
          </div>
        </div>
      </div>

      {/* Referral Link Card */}
      <div style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--cream-300)', boxShadow: 'var(--shadow-3d-card)', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--green-900)', marginBottom: '8px' }}>Your Personal Partner Link</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '14px' }}>
          Share this link with your private clients. Any orders placed will automatically credit your account.
        </p>
        <div style={{ display: 'flex', gap: '10px', maxWidth: '600px' }}>
          <input
            type="text"
            readOnly
            value={referralLink}
            style={{ flexGrow: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--cream-300)', background: 'var(--cream-50)', fontWeight: 600, color: 'var(--green-900)' }}
          />
          <button onClick={handleCopyLink} className="btn-3d-primary" style={{ padding: '10px 18px', fontSize: '0.85rem' }}>
            <Copy size={16} /> Copy
          </button>
        </div>
      </div>

      {/* Payout Request Button */}
      {approvedEarned > 0 && (
        <div style={{ background: 'linear-gradient(135deg, #1B5E20, #0F241E)', color: '#fff', padding: '24px', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>You have £{approvedEarned.toFixed(2)} ready for withdrawal</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>Direct bank wire transfer to your linked account.</p>
          </div>
          <button onClick={handleRequestPayout} className="btn-3d-secondary" style={{ background: '#fff', color: 'var(--green-900)', border: 'none' }}>
            Request Payout Transfer →
          </button>
        </div>
      )}
    </div>
  );
}