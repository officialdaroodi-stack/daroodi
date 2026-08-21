'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole, UserProfile } from '@/lib/types';
import { getRoleDisplayName, canManageUsers } from '@/lib/rbac';
import { Users, UserPlus, ShieldCheck, Check, Edit2, Key } from 'lucide-react';

export default function UsersManagementPage() {
  const { allUsers, createUser, updateUserRole, currentUser } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('product_manager');
  const [newManagerId, setNewManagerId] = useState<string>(currentUser?.id || '');
  const [newCountry, setNewCountry] = useState('UK');
  const [newRegion, setNewRegion] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser({
      email: newEmail,
      full_name: newFullName,
      role: newRole,
      manager_id: newManagerId || undefined,
      assigned_country: newCountry,
      assigned_region: newRegion,
      commission_rate: newRole === 'regional_sales_agent' ? 0.15 : newRole === 'country_sales_manager' ? 0.05 : 0.10,
    });
    alert(`Created ${newFullName} as ${getRoleDisplayName(newRole)} successfully!`);
    setShowCreateModal(false);
    setNewFullName('');
    setNewEmail('');
  };

  const ROLES: UserRole[] = [
    'super_admin',
    'admin',
    'product_manager',
    'product_editor',
    'order_checker',
    'finance_manager',
    'marketing_admin',
    'country_sales_manager',
    'regional_sales_agent',
    'dev_frontend',
    'dev_backend',
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--green-900)' }}>Enterprise User & Role Hierarchy</h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
            Manage organizational access, reporting hierarchies, and specialized operational sub-roles.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-3d-primary"
          style={{ padding: '10px 20px', fontSize: '0.88rem' }}
        >
          <UserPlus size={18} /> Create New Staff / Admin
        </button>
      </div>

      {/* User Hierarchy Table */}
      <div className="data-card">
        <div className="data-card-header">
          <h2 className="data-card-title">Staff & Partner Accounts ({allUsers.length})</h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>User / Email</th>
                <th>Role & Permissions</th>
                <th>Reporting Manager</th>
                <th>Assigned Territory</th>
                <th>Commission Rate</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user) => {
                const manager = allUsers.find((u) => u.id === user.manager_id);

                return (
                  <tr key={user.id}>
                    <td>
                      <strong style={{ color: 'var(--green-900)' }}>{user.full_name}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>{user.email}</div>
                    </td>
                    <td>
                      <span style={{ display: 'inline-block', background: 'var(--cream-100)', color: 'var(--green-900)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                        {getRoleDisplayName(user.role)}
                      </span>
                    </td>
                    <td>
                      {manager ? (
                        <div>
                          <span style={{ fontWeight: 600 }}>{manager.full_name}</span>
                          <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>{getRoleDisplayName(manager.role)}</div>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--slate-400)', fontSize: '0.8rem' }}>Master Root</span>
                      )}
                    </td>
                    <td>
                      {user.assigned_country ? (
                        <span>{user.assigned_country} {user.assigned_region && `(${user.assigned_region})`}</span>
                      ) : (
                        <span style={{ color: 'var(--slate-400)' }}>Global / HQ</span>
                      )}
                    </td>
                    <td>
                      {user.commission_rate ? `${(user.commission_rate * 100).toFixed(0)}%` : 'N/A (Salary)'}
                    </td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--cream-300)', fontSize: '0.75rem', background: 'var(--cream-50)' }}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {getRoleDisplayName(r)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create User */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 36, 30, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: 'var(--white)', padding: '32px', borderRadius: 'var(--radius-xl)', maxWidth: '520px', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--green-900)', marginBottom: '20px' }}>Create User Account</h2>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Qureshi"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sarah@daroodi.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>Role Assignment</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px', background: 'var(--cream-50)' }}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{getRoleDisplayName(r)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>Reporting Manager (Hierarchy)</label>
                <select
                  value={newManagerId}
                  onChange={(e) => setNewManagerId(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px', background: 'var(--cream-50)' }}
                >
                  {allUsers.map((u) => (
                    <option key={u.id} value={u.id}>{u.full_name} ({getRoleDisplayName(u.role)})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" className="btn-3d-primary" style={{ flex: 1, padding: '12px', justifyContent: 'center' }}>
                  Create & Authorize
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
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
