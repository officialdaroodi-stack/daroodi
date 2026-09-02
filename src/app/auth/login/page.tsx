'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Lock, ArrowRight, ShieldCheck, Mail, Key } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/';
  const justRegistered = searchParams.get('registered') === '1';
  const justReset = searchParams.get('reset') === '1';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }
      if (!data.user) {
        setErrorMsg('Login failed. Please try again.');
        setLoading(false);
        return;
      }
      // Look up role to choose destination
      const isAdminUser = email.toLowerCase().trim() === 'admin@daroodi.com';
      let role = isAdminUser ? 'super_admin' : 'customer';

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();
        if (profile?.role) {
          role = profile.role;
        }
      } catch {
        // fallback
      }

      const isStaff = isAdminUser || (role && role !== 'customer');
      const dest = nextPath && nextPath !== '/' && nextPath !== '/account'
        ? nextPath
        : isStaff
        ? '/admin'
        : '/account';

      window.location.href = dest;
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred.');
      setLoading(false);
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
          <h1 style={{ fontSize: '1.85rem', color: 'var(--green-900)', margin: '0 0 6px' }}>Sign in to Daroodi</h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>
            Access your orders, the atelier CMS, and your bespoke account.
          </p>
        </div>

        {justRegistered && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: '#E8F5E9',
              border: '1px solid #C8E6C9',
              color: '#1B5E20',
              fontSize: '0.85rem',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            Account created! Check your email to confirm, then sign in.
          </div>
        )}
        {justReset && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: '#E8F5E9',
              border: '1px solid #C8E6C9',
              color: '#1B5E20',
              fontSize: '0.85rem',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            Password updated. Please sign in with your new password.
          </div>
        )}
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
                autoComplete="email"
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
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-800)' }}>Password</label>
              <Link href="/auth/reset-password" style={{ fontSize: '0.78rem', color: 'var(--green-700)', textDecoration: 'underline' }}>
                Forgot password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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
            style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'center', marginTop: '8px', borderRadius: '12px' }}
          >
            {loading ? 'Signing in…' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid var(--cream-300)', paddingTop: '20px' }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)' }}>
            New to Daroodi?{' '}
            <Link href="/auth/register" style={{ color: 'var(--green-700)', fontWeight: 700, textDecoration: 'underline' }}>
              Create an account
            </Link>
          </p>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--slate-500)', fontSize: '0.78rem' }}>
          <ShieldCheck size={14} color="var(--green-700)" />
          <span>256-bit Encrypted Secure Atelier Connection</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
