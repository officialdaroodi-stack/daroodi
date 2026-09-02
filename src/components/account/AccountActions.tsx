'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { KeyRound, LogOut, Loader2, Eye, EyeOff } from 'lucide-react';

export function AccountActions() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [newPw, setNewPw] = useState('');
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (newPw.length < 8) {
      setMsg({ kind: 'err', text: 'Password must be at least 8 characters.' });
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setLoading(false);
    if (error) {
      setMsg({ kind: 'err', text: error.message });
    } else {
      setNewPw('');
      setMsg({ kind: 'ok', text: 'Password updated.' });
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--cream-300)' }}>
      <button
        onClick={() => setShowPw((v) => !v)}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--green-700)', fontWeight: 700, fontSize: '0.88rem', padding: 0, cursor: 'pointer' }}
      >
        <KeyRound size={14} /> {showPw ? 'Cancel' : 'Change password'}
      </button>

      {showPw && (
        <form onSubmit={handleChangePassword} style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            type="password"
            placeholder="New password (min 8)"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            minLength={8}
            required
            style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--cream-300)', fontSize: '0.88rem' }}
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-3d-secondary"
            style={{ padding: '8px', fontSize: '0.82rem', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <KeyRound size={13} />}
            Update password
          </button>
        </form>
      )}

      {msg && (
        <p
          style={{
            margin: '8px 0 0',
            fontSize: '0.78rem',
            color: msg.kind === 'ok' ? '#1B5E20' : '#B91C1C',
            background: msg.kind === 'ok' ? '#E8F5E9' : 'rgba(239, 68, 68, 0.1)',
            padding: '6px 10px',
            borderRadius: '6px',
          }}
        >
          {msg.text}
        </p>
      )}

      <button
        onClick={handleSignOut}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#B91C1C', fontWeight: 700, fontSize: '0.88rem', padding: 0, cursor: 'pointer', marginTop: '16px' }}
      >
        <LogOut size={14} /> Sign out
      </button>
    </div>
  );
}
