'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Mail, Key, User, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/account';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('GB');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, assigned_country: country },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        },
      });
      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }
      // If email confirmation is required, session will be null and we redirect with a notice.
      if (!data.session) {
        router.push('/auth/login?registered=1');
        return;
      }
      router.push(nextPath);
      router.refresh();
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
          <h1 style={{ fontSize: '1.85rem', color: 'var(--green-900)', margin: '0 0 6px' }}>Create Daroodi Account</h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>
            Join our private clientele for bespoke tracking, measurements archive, and priority commissions.
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

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-800)', display: 'block', marginBottom: '6px' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="e.g. Lord Arthur Sterling"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 14px 12px 38px', borderRadius: '10px', border: '1px solid var(--cream-300)', fontSize: '0.95rem', outline: 'none', background: 'var(--cream-50)', boxSizing: 'border-box' }}
              />
              <User size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-800)', display: 'block', marginBottom: '6px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={{ width: '100%', padding: '12px 14px 12px 38px', borderRadius: '10px', border: '1px solid var(--cream-300)', fontSize: '0.95rem', outline: 'none', background: 'var(--cream-50)', boxSizing: 'border-box' }}
              />
              <Mail size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-800)', display: 'block', marginBottom: '6px' }}>Password (min 8 chars)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                style={{ width: '100%', padding: '12px 14px 12px 38px', borderRadius: '10px', border: '1px solid var(--cream-300)', fontSize: '0.95rem', outline: 'none', background: 'var(--cream-50)', boxSizing: 'border-box' }}
              />
              <Key size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-800)', display: 'block', marginBottom: '6px' }}>Country (for shipping & currency)</label>
            <div style={{ position: 'relative' }}>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={{ width: '100%', padding: '12px 14px 12px 38px', borderRadius: '10px', border: '1px solid var(--cream-300)', fontSize: '0.95rem', outline: 'none', background: 'var(--cream-50)', boxSizing: 'border-box' }}
              >
                <option value="GB">United Kingdom</option>
                <option value="US">United States</option>
                <option value="AE">United Arab Emirates</option>
                <option value="SA">Saudi Arabia</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="EU">Europe</option>
                <option value="PK">Pakistan</option>
              </select>
              <MapPin size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-3d-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'center', marginTop: '8px', borderRadius: '12px' }}>
            {loading ? 'Creating account…' : 'Create Account'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid var(--cream-300)', paddingTop: '20px' }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)' }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: 'var(--green-700)', fontWeight: 700, textDecoration: 'underline' }}>
              Sign in
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

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading…</div>}>
      <RegisterForm />
    </Suspense>
  );
}
