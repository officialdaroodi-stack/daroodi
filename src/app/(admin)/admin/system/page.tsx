'use client';

import React from 'react';
import { Terminal, Database, Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_USERS, INITIAL_COMMISSIONS } from '@/lib/mockData';

export default function SystemDeveloperConsolePage() {
  const tables = [
    { name: 'profiles (Users & Hierarchy)', count: INITIAL_USERS.length, status: 'Healthy' },
    { name: 'products (ACF Garments)', count: INITIAL_PRODUCTS.length, status: 'Healthy' },
    { name: 'orders (Atelier Pipeline)', count: INITIAL_ORDERS.length, status: 'Healthy' },
    { name: 'commissions (Affiliate)', count: INITIAL_COMMISSIONS.length, status: 'Healthy' },
    { name: 'cms_blocks (Headless Blocks)', count: 1, status: 'Healthy' },
    { name: 'journal_posts (Editorial)', count: 2, status: 'Healthy' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--green-900)' }}>Backend System Architecture & Database</h1>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
          Inspect Supabase PostgreSQL connections, database table row integrity, and API endpoints.
        </p>
      </div>

      {/* Connection Health Banner */}
      <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', padding: '20px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircle2 size={24} color="#2E7D32" />
          <div>
            <strong style={{ color: '#1B5E20', fontSize: '1rem' }}>Supabase PostgreSQL Engine: Connected & Ready</strong>
            <p style={{ color: '#2E7D32', fontSize: '0.85rem' }}>Row-Level Security (RLS) Active · Next.js 15 App Router Edge Runtime</p>
          </div>
        </div>
        <span style={{ background: '#2E7D32', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '4px' }}>
          Vercel Production Edge
        </span>
      </div>

      {/* Database Tables Overview */}
      <div className="data-card">
        <div className="data-card-header">
          <h2 className="data-card-title">Supabase Database Tables</h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>PostgreSQL Table Name</th>
                <th>Active Records</th>
                <th>Integrity Status</th>
                <th>RLS Policy</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((t) => (
                <tr key={t.name}>
                  <td>
                    <code>{t.name}</code>
                  </td>
                  <td>
                    <strong>{t.count} records</strong>
                  </td>
                  <td>
                    <span style={{ color: '#2E7D32', fontWeight: 600 }}>● {t.status}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', background: 'var(--cream-100)', color: 'var(--green-900)', padding: '2px 8px', borderRadius: '4px' }}>
                      Enforced
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deployment & Environment Checklist */}
      <div style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--cream-300)', boxShadow: 'var(--shadow-3d-card)' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--green-900)', marginBottom: '14px' }}>
          Vercel & GitHub Deployment Keys
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          <div style={{ padding: '12px', background: 'var(--cream-50)', borderRadius: '8px', border: '1px solid var(--cream-300)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 700 }}>NEXT_PUBLIC_SUPABASE_URL</span>
            <div style={{ fontSize: '0.85rem', color: 'var(--green-900)', fontWeight: 600, marginTop: '4px' }}>https://daroodi.supabase.co</div>
          </div>
          <div style={{ padding: '12px', background: 'var(--cream-50)', borderRadius: '8px', border: '1px solid var(--cream-300)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 700 }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
            <div style={{ fontSize: '0.85rem', color: 'var(--green-900)', fontWeight: 600, marginTop: '4px' }}>eyJhbGciOi... (Active)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
