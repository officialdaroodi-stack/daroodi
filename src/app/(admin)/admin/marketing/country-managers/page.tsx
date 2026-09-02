'use client';

import React, { useEffect, useState } from 'react';
import { UserProfile, UserRole } from '@/lib/types';
import { Globe, UserPlus, Users, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < 14; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
}

export default function CountryManagersPage() {
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [overrideRate, setOverrideRate] = useState(0.05);
  const [password, setPassword] = useState('');

  const [successMessage, setSuccessMessage] = useState<{ name: string; country: string; email: string; password: string } | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', { cache: 'no-store' });
      const json = await res.json();
      setAllUsers(json.users || []);
    } catch (err) {
      console.error('Country managers: failed to load users', err);
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const countryManagers = allUsers.filter((u) => u.role === 'country_sales_manager');
  const regionalAgents = allUsers.filter((u) => u.role === 'regional_sales_agent');

  const handleCreateCountryManager = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalPassword = password || generateTempPassword();

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: finalPassword,
          full_name: name,
          role: 'country_sales_manager' as UserRole,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        alert(`Failed to create country head: ${json.error || res.statusText}`);
        return;
      }

      setSuccessMessage({ name, country, email, password: finalPassword });
      setShowAddModal(false);
      setName('');
      setEmail('');
      setPassword('');
      setCountry('United Kingdom');
      setOverrideRate(0.05);

      await loadUsers();
    } catch (err: any) {
      alert(`Failed to create country head: ${err?.message || 'Network error'}`);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--green-900)' }}>Country Sales Heads & Regional Networks</h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
            Marketing Admin oversees national sales heads who recruit regional, state, and provincial sales agents.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn-3d-primary" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>
          <UserPlus size={18} /> Appoint Country Sales Head
        </button>
      </div>

      {/* Success banner */}
      {successMessage && (
        <div
          style={{
            background: '#E8F5E9',
            border: '1px solid #1B5E20',
            color: '#1B5E20',
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '0.88rem',
          }}
        >
          <strong>Created Country Sales Head for {successMessage.country}: {successMessage.name}.</strong>
          <div style={{ marginTop: '6px', fontSize: '0.82rem' }}>
            Share these temporary login credentials with the new country head:
          </div>
          <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <code style={{ background: '#FFFFFF', border: '1px solid #1B5E20', padding: '4px 10px', borderRadius: '6px', color: '#162923' }}>
              {successMessage.email}
            </code>
            <code style={{ background: '#FFFFFF', border: '1px solid #1B5E20', padding: '4px 10px', borderRadius: '6px', color: '#162923', fontWeight: 700 }}>
              {successMessage.password}
            </code>
            <button
              onClick={() => setSuccessMessage(null)}
              className="btn-3d-secondary"
              style={{ padding: '4px 12px', fontSize: '0.75rem' }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Country Sales Heads Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {countryManagers.map((cm) => {
          const recruitedAgents = regionalAgents.filter((ra) => ra.manager_id === cm.id || ra.assigned_country === cm.assigned_country);

          return (
            <div
              key={cm.id}
              style={{
                background: 'var(--white)',
                border: '1px solid var(--cream-300)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                boxShadow: 'var(--shadow-3d-card)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--green-700)', background: 'var(--green-50)', padding: '4px 10px', borderRadius: '6px' }}>
                  <Globe size={14} /> {cm.assigned_country} Head
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold-500)', background: 'var(--green-900)', padding: '3px 8px', borderRadius: '4px' }}>
                  {((cm.commission_rate || 0.05) * 100).toFixed(0)}% Override
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', color: 'var(--green-900)' }}>{cm.full_name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: '16px' }}>{cm.email}</p>

              <div style={{ borderTop: '1px solid var(--cream-200)', paddingTop: '14px', marginTop: '14px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '8px' }}>
                  Recruited Regional Agents ({recruitedAgents.length}):
                </div>
                {recruitedAgents.map((ra) => (
                  <div key={ra.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '4px 0', color: 'var(--slate-600)' }}>
                    <span>📍 {ra.full_name} ({ra.assigned_region || 'Territory'})</span>
                    <span style={{ fontWeight: 600, color: 'var(--green-700)' }}>{((ra.commission_rate || 0.15) * 100).toFixed(0)}% Comm</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {countryManagers.length === 0 && !loading && (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.9rem', background: 'var(--white)', border: '1px dashed var(--cream-300)', borderRadius: 'var(--radius-lg)' }}>
            No country sales heads yet. Click <strong>Appoint Country Sales Head</strong> to add one.
          </div>
        )}

        {loading && (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.9rem' }}>
            Loading country sales heads…
          </div>
        )}
      </div>

      {/* Modal: Appoint Country Head */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 36, 30, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: 'var(--white)', padding: '32px', borderRadius: 'var(--radius-xl)', maxWidth: '500px', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--green-900)', marginBottom: '20px' }}>Appoint Country Sales Head</h2>

            <form onSubmit={handleCreateCountryManager} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faisal Qureshi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. faisal@daroodi.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>Initial Password</label>
                <input
                  type="text"
                  placeholder="Leave blank to auto-generate a temporary password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px', fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>Assigned Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px', background: 'var(--cream-50)' }}
                >
                  <option>United Kingdom</option>
                  <option>United States</option>
                  <option>United Arab Emirates</option>
                  <option>Pakistan</option>
                  <option>Canada</option>
                  <option>Saudi Arabia</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" className="btn-3d-primary" style={{ flex: 1, padding: '12px', justifyContent: 'center' }}>
                  Authorize Country Head
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-3d-secondary"
                  style={{ padding: '12px 20px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}