'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserProfile } from '@/lib/types';
import { Globe, UserPlus, Users, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export default function CountryManagersPage() {
  const { allUsers, createUser } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [overrideRate, setOverrideRate] = useState(0.05);

  const countryManagers = allUsers.filter((u) => u.role === 'country_sales_manager');
  const regionalAgents = allUsers.filter((u) => u.role === 'regional_sales_agent');

  const handleCreateCountryManager = (e: React.FormEvent) => {
    e.preventDefault();
    createUser({
      email,
      full_name: name,
      role: 'country_sales_manager',
      assigned_country: country,
      commission_rate: overrideRate,
    });
    alert(`Created Country Sales Head for ${country}: ${name}`);
    setShowAddModal(false);
    setName('');
    setEmail('');
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
