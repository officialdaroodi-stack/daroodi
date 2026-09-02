'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Commission } from '@/lib/types';
import { AuthUser } from '@/lib/auth';
import { Check, X, ArrowLeft, DollarSign, ShieldCheck } from 'lucide-react';

export default function PayoutApprovalsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        // No commissions db module yet — start empty.
        // Replace this block when /lib/db/commissions.ts is added.
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        const json = await res.json();
        if (!cancelled) setCurrentUser(json.user || null);
      } catch (err) {
        if (!cancelled) console.error('Payouts page: failed to load', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAction = (commId: string, action: 'approved' | 'rejected') => {
    setCommissions((prev) =>
      prev.map((c) => (c.id === commId ? { ...c, status: action, approved_by: currentUser?.id ?? null } : c))
    );
    alert(`Commission ${commId} marked as: ${action.toUpperCase()}`);
  };

  return (
    <div>
      <Link href="/admin/finance" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--green-700)', fontWeight: 600, marginBottom: '20px' }}>
        <ArrowLeft size={16} /> Back to Finance Overview
      </Link>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--green-900)' }}>Partner Commission Approvals</h1>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
          Authorize regional agent sales commissions and country head override payouts into partner bank accounts.
        </p>
      </div>

      <div className="data-card">
        <div className="data-card-header">
          <h2 className="data-card-title">Commission Ledger ({commissions.length})</h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.9rem' }}>
              Loading commission ledger…
            </div>
          ) : commissions.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.9rem' }}>
              No commissions awaiting approval. New referral commissions will appear here once orders are placed.
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Partner / Agent</th>
                  <th>Referred Order</th>
                  <th>Tier Level</th>
                  <th>Order Amount</th>
                  <th>Rate (%)</th>
                  <th>Commission (£)</th>
                  <th>Status</th>
                  <th>Approval Actions</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((comm) => (
                  <tr key={comm.id}>
                    <td>
                      <strong style={{ color: 'var(--green-900)' }}>{comm.recipient?.full_name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{comm.recipient?.email}</div>
                    </td>
                    <td>
                      <strong>{comm.order?.order_number}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{comm.order?.items?.[0]?.product?.title}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', background: 'var(--cream-100)', color: 'var(--green-900)', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        {comm.tier_level.replace('_', ' ')}
                      </span>
                    </td>
                    <td>£{comm.order_amount}</td>
                    <td>{(comm.rate * 100).toFixed(0)}%</td>
                    <td>
                      <strong style={{ color: 'var(--green-700)', fontSize: '1.05rem' }}>£{comm.commission_amount.toFixed(2)}</strong>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          background: comm.status === 'approved' ? '#E8F5E9' : comm.status === 'pending_approval' ? '#FFF8E1' : '#FFEBEE',
                          color: comm.status === 'approved' ? '#2E7D32' : comm.status === 'pending_approval' ? '#F57F17' : '#C62828',
                        }}
                      >
                        {comm.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {comm.status === 'pending_approval' ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleAction(comm.id, 'approved')}
                            className="btn-3d-primary"
                            style={{ padding: '6px 12px', fontSize: '0.75rem', gap: '4px' }}
                          >
                            <Check size={14} /> Allow Payout
                          </button>
                          <button
                            onClick={() => handleAction(comm.id, 'rejected')}
                            className="btn-3d-secondary"
                            style={{ padding: '6px 10px', fontSize: '0.75rem', color: '#C62828' }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--slate-400)' }}>Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}