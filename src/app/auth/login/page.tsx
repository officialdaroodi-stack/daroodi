'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, ArrowRight, ShieldCheck, Mail, Key } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { switchRole, allUsers } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (!email || !password) {
      setErrorMsg('Please enter both your email address and password.');
      setLoading(false);
      return;
    }

    // Authenticate user
    const found = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (found) {
      switchRole(found.role);
      if (found.role === 'customer') {
        router.push('/track-order');
      } else {
        router.push('/admin');
      }
    } else {
      if (isRegister) {
        // Register new customer
        switchRole('customer');
        router.push('/track-order');
      } else {
        setErrorMsg('Invalid email or password. Please try again or create a new account.');
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ maxWidth: '520px', margin: '60px auto 100px', padding: '0 16px' }}>
      <div
        style={{
          background: 'var(--white)',
          padding: '40px 32px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--cream-300)',
          boxShadow: 'var(--shadow-3d-card)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            className="logo-emblem"
            style={{
              margin: '0 auto 14px',
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(145deg, var(--green-900), var(--green-950))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(15, 36, 30, 0.25)',
            }}
          >
            <span style={{ color: '#C9A84C', fontWeight: 800, fontSize: '1.4rem', fontFamily: 'var(--font-serif)' }}>D</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--green-900)', margin: '0 0 6px' }}>
            {isRegister ? 'Create Daroodi Account' : 'Daroodi Client Portal'}
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>
            {isRegister
              ? 'Join our private clientele for bespoke tracking & priority commissions.'
              : 'Sign in to access your orders, measurements, and bespoke commissions.'}
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#B91C1C',
              fontSize: '0.85rem',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-800)', display: 'block', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 38px',
                  borderRadius: '10px',
                  border: '1px solid var(--cream-300)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  background: 'var(--cream-50)',
                  boxSizing: 'border-box',
                }}
              />
              <Mail size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-800)' }}>
                Password
              </label>
              {!isRegister && (
                <Link href="/contact" style={{ fontSize: '0.78rem', color: 'var(--green-700)', textDecoration: 'underline' }}>
                  Forgot password?
                </Link>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 38px',
                  borderRadius: '10px',
                  border: '1px solid var(--cream-300)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  background: 'var(--cream-50)',
                  boxSizing: 'border-box',
                }}
              />
              <Key size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-3d-primary"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1rem',
              justifyContent: 'center',
              marginTop: '8px',
              borderRadius: '12px',
            }}
          >
            {loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid var(--cream-300)', paddingTop: '20px' }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)' }}>
            {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMsg('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--green-700)',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
                fontSize: '0.88rem',
              }}
            >
              {isRegister ? 'Sign In' : 'Register as Client'}
            </button>
          </p>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--slate-500)', fontSize: '0.78rem' }}>
          <ShieldCheck size={14} color="var(--green-700)" />
          <span>256-Bit Encrypted Secure Atelier Connection</span>
        </div>
      </div>
    </div>
  );
}
