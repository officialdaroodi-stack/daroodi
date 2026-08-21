'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/lib/types';
import { getRoleDisplayName } from '@/lib/rbac';
import { Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, switchRole, allUsers } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      switchRole(found.role);
      alert(`Welcome back, ${found.full_name} (${getRoleDisplayName(found.role)})`);
      router.push('/admin');
    } else {
      alert('Email not recognized. Use quick role switcher below.');
    }
  };

  const handleQuickSwitch = (role: UserRole) => {
    switchRole(role);
    router.push('/admin');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '60px auto 100px', padding: '0 16px' }}>
      <div
        style={{
          background: 'var(--white)',
          padding: '40px 30px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--cream-300)',
          boxShadow: 'var(--shadow-3d-card)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div className="logo-emblem" style={{ margin: '0 auto 12px', width: '40px', height: '40px' }}>
            <span style={{ color: '#C9A84C', fontWeight: 700, fontSize: '1.3rem' }}>D</span>
          </div>
          <h1 style={{ fontSize: '2rem', color: 'var(--green-900)' }}>Daroodi Staff & Client Portal</h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', marginTop: '6px' }}>
            Sign in to access your role-specific dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)' }}>Email Address</label>
            <input
              type="email"
              placeholder="e.g. owner@daroodi.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '6px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '6px' }}
            />
          </div>

          <button
            type="submit"
            className="btn-3d-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'center', marginTop: '10px' }}
          >
            Sign In <ArrowRight size={18} />
          </button>
        </form>

        {/* Instant Role Switcher for Testing & Demonstration */}
        <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid var(--cream-300)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <UserCheck size={18} color="var(--green-700)" />
            <h3 style={{ fontSize: '1.05rem', color: 'var(--green-900)' }}>
              Instant Multi-Role Switcher (1-Click Login):
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
            <button
              onClick={() => handleQuickSwitch('super_admin')}
              className="btn-3d-secondary"
              style={{ fontSize: '0.78rem', padding: '8px', justifyContent: 'flex-start' }}
            >
              👑 Super Admin (Full Control)
            </button>
            <button
              onClick={() => handleQuickSwitch('admin')}
              className="btn-3d-secondary"
              style={{ fontSize: '0.78rem', padding: '8px', justifyContent: 'flex-start' }}
            >
              🛡️ Store Admin
            </button>
            <button
              onClick={() => handleQuickSwitch('product_manager')}
              className="btn-3d-secondary"
              style={{ fontSize: '0.78rem', padding: '8px', justifyContent: 'flex-start' }}
            >
              🛍️ Product & Order Manager
            </button>
            <button
              onClick={() => handleQuickSwitch('order_checker')}
              className="btn-3d-secondary"
              style={{ fontSize: '0.78rem', padding: '8px', justifyContent: 'flex-start' }}
            >
              🔍 Order & Measurement Checker
            </button>
            <button
              onClick={() => handleQuickSwitch('finance_manager')}
              className="btn-3d-secondary"
              style={{ fontSize: '0.78rem', padding: '8px', justifyContent: 'flex-start' }}
            >
              💰 Finance & Payout Manager
            </button>
            <button
              onClick={() => handleQuickSwitch('marketing_admin')}
              className="btn-3d-secondary"
              style={{ fontSize: '0.78rem', padding: '8px', justifyContent: 'flex-start' }}
            >
              📢 Marketing & Country Head Admin
            </button>
            <button
              onClick={() => handleQuickSwitch('country_sales_manager')}
              className="btn-3d-secondary"
              style={{ fontSize: '0.78rem', padding: '8px', justifyContent: 'flex-start' }}
            >
              🗺️ Country Sales Head (UK)
            </button>
            <button
              onClick={() => handleQuickSwitch('regional_sales_agent')}
              className="btn-3d-secondary"
              style={{ fontSize: '0.78rem', padding: '8px', justifyContent: 'flex-start' }}
            >
              📍 Regional Sales Agent (London)
            </button>
            <button
              onClick={() => handleQuickSwitch('dev_frontend')}
              className="btn-3d-secondary"
              style={{ fontSize: '0.78rem', padding: '8px', justifyContent: 'flex-start' }}
            >
              🎨 Frontend CMS Developer
            </button>
            <button
              onClick={() => handleQuickSwitch('dev_backend')}
              className="btn-3d-secondary"
              style={{ fontSize: '0.78rem', padding: '8px', justifyContent: 'flex-start' }}
            >
              ⚙️ Backend System Developer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
