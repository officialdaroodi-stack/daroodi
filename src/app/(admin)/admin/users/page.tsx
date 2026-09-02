'use client';

import React, { useEffect, useState } from 'react';
import { UserRole, UserProfile } from '@/lib/types';
import { AuthUser } from '@/lib/auth';
import { getRoleDisplayName, canManageUsers } from '@/lib/rbac';
import { Users, UserPlus, ShieldCheck, Check, Edit2, Key } from 'lucide-react';

function generateTempPassword(): string {
  // 14-char alphanumeric temporary password.
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < 14; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
}

export default function UsersManagementPage() {
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('product_manager');
  const [newPassword, setNewPassword] = useState('');
  const [newCountry, setNewCountry] = useState('UK');
  const [newRegion, setNewRegion] = useState('');

  const [successMessage, setSuccessMessage] = useState<{ name: string; role: UserRole; email: string; password: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [meRes, usersRes] = await Promise.all([
        fetch('/api/auth/me', { cache: 'no-store' }).then((r) => r.json()),
        fetch('/api/admin/users', { cache: 'no-store' }).then((r) => r.json()),
      ]);
      setCurrentUser(meRes.user || null);
      setAllUsers(usersRes.users || []);
    } catch (err) {
      console.error('Users: failed to load', err);
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalPassword = newPassword || generateTempPassword();

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail,
          password: finalPassword,
          full_name: newFullName,
          role: newRole,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        alert(`Failed to create user: ${json.error || res.statusText}`);
        return;
      }

      // Capture for the success message, then reset form and close modal.
      setSuccessMessage({ name: newFullName, role: newRole, email: newEmail, password: finalPassword });
      setShowCreateModal(false);
      setNewFullName('');
      setNewEmail('');
      setNewPassword('');
      setNewRegion('');
      setNewCountry('UK');
      setNewRole('product_manager');

      // Refresh the user list so the new row shows up.
      await loadData();
    } catch (err: any) {
      alert(`Failed to create user: ${err?.message || 'Network error'}`);
    }
  };

  const handleRoleChange = async (userId: string, role: UserRole) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        alert(`Failed to update role: ${json.error || res.statusText}`);
        return;
      }
      setAllUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    } catch (err: any) {
      alert(`Failed to update role: ${err?.message || 'Network error'}`);
    }
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

      {/* Success banner — shows the temporary password generated for the just-created user */}
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
          <strong>Created {successMessage.name} as {getRoleDisplayName(successMessage.role)} successfully.</strong>
          <div style={{ marginTop: '6px', fontSize: '0.82rem' }}>
            Share these temporary login credentials with the new user — they should change the password on first sign-in:
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

      {/* User Hierarchy Table */}
      <div className="data-card">
        <div className="data-card-header">
          <h2 className="data-card-title">Staff & Partner Accounts ({allUsers.length})</h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.9rem' }}>
              Loading staff accounts…
            </div>
          ) : (
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
                          onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
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
          )}
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
                <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>Initial Password</label>
                <input
                  type="text"
                  placeholder="Leave blank to auto-generate a temporary password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px', fontFamily: 'monospace' }}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginTop: '4px', display: 'block' }}>
                  The user can sign in with this password and should change it after first login.
                </span>
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