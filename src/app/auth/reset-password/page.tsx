'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Mail, ArrowRight, ShieldCheck, Key } from 'lucide-react';

function ResetForm() {
  const searchParams = useSearchParams();
  // Supabase sends recovery links with #access_token=...&type=recovery
  // After the link is clicked, the user lands here with a session in place.
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const isRecoveryMode = typeof window !== 'undefined' && window.location.hash.includes('type=recovery');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) {
        setErrorMsg(error.message);
      } else {
        setInfoMsg('Password reset email sent. Check your inbox for the secure link.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred.');
    }
    setLoading(false);
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }
      window.location.href = '/auth/login?reset=1';
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
          <h1 style={{ fontSize: '1.85rem', color: 'var(--green-900)', margin: '0 0 6px' }}>
            {isRecoveryMode ? 'Set a new password' : 'Reset your password'}
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>
            {isRecoveryMode
              ? 'Enter your new password below.'
              : "Enter your email and we'll send a secure reset link."}
          </p>
        </div>

        {errorMsg && (
          <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#B91C1C', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}
        {infoMsg && (
          <div style={{ padding: '12px 16px', borderRadius: '8px', background: '#E8F5E9', border: '1px solid #C8E6C9', color: '#1B5E20', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center' }}>
            {infoMsg}
          </div>
        )}

        {isRecoveryMode ? (
          <form onSubmit={handleSetNewPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-800)', display: 'block', marginBottom: '6px' }}>New password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px 12px 38px', borderRadius: '10px', border: '1px solid var(--cream-300)', fontSize: '0.95rem', outline: 'none', background: 'var(--cream-50)', boxSizing: 'border-box' }}
                />
                <Key size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-3d-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'center', borderRadius: '12px' }}>
              {loading ? 'Updating…' : 'Update password'} <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleRequestReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-800)', display: 'block', marginBottom: '6px' }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="name@example.com"
                  style={{ width: '100%', padding: '12px 14px 12px 38px', borderRadius: '10px', border: '1px solid var(--cream-300)', fontSize: '0.95rem', outline: 'none', background: 'var(--cream-50)', boxSizing: 'border-box' }}
                />
                <Mail size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-3d-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'center', borderRadius: '12px' }}>
              {loading ? 'Sending…' : 'Send reset link'} <ArrowRight size={18} />
            </button>
          </form>
        )}

        <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid var(--cream-300)', paddingTop: '20px' }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)' }}>
            Remembered it?{' '}
            <Link href="/auth/login" style={{ color: 'var(--green-700)', fontWeight: 700, textDecoration: 'underline' }}>
              Back to sign in
            </Link>
          </p>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--slate-500)', fontSize: '0.78rem' }}>
          <ShieldCheck size={14} color="var(--green-700)" />
          <span>Secure password reset over email</span>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading…</div>}>
      <ResetForm />
    </Suspense>
  );
}
