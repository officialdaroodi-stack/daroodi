'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  canManageUsers,
  canManageProducts,
  canManageOrders,
  canManageFinance,
  canManageMarketing,
  isDeveloper,
  getRoleDisplayName,
} from '@/lib/rbac';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Globe,
  LogOut,
  BarChart3,
  FileText,
  BookOpen,
  Plug,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

interface AdminShellProps {
  user: { id: string; email: string; full_name: string; role: any };
  children: React.ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const role = user.role;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      setMobileOpen((v) => !v);
    } else {
      setIsCollapsed((v) => !v);
    }
  };

  return (
    <div className={`admin-layout ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
          aria-hidden="true"
        />
      )}

      <aside
        className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
      >
        <div className="sidebar-brand">
          <div className="logo-emblem">
            <span style={{ color: '#C9A84C', fontWeight: 700 }}>D</span>
          </div>
          <div>
            <div className="sidebar-logo-text">Daroodi CMS</div>
            <span className="sidebar-role-badge">{getRoleDisplayName(role) || 'Staff'}</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <Link
            href="/admin"
            className={`sidebar-link ${pathname === '/admin' ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
            title="Overview & KPIs"
          >
            <LayoutDashboard size={18} />
            <span>Overview & KPIs</span>
          </Link>

          {canManageUsers(role) && (
            <>
              <div className="sidebar-section-title">Administration</div>
              <Link
                href="/admin/users"
                className={`sidebar-link ${pathname === '/admin/users' ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                title="User Hierarchy & Roles"
              >
                <Users size={18} />
                <span>User Hierarchy & Roles</span>
              </Link>
            </>
          )}

          {canManageProducts(role) && (
            <>
              <div className="sidebar-section-title">Catalog & Inventory</div>
              <Link
                href="/admin/products"
                className={`sidebar-link ${pathname.startsWith('/admin/products') ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                title="Products & ACF Specs"
              >
                <Package size={18} />
                <span>Products & ACF Specs</span>
              </Link>
            </>
          )}

          {canManageOrders(role) && (
            <Link
              href="/admin/orders"
              className={`sidebar-link ${pathname.startsWith('/admin/orders') ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
              title="Orders & Measurements"
            >
              <ShoppingBag size={18} />
              <span>Orders & Measurements</span>
            </Link>
          )}

          {canManageFinance(role) && (
            <>
              <div className="sidebar-section-title">Financial Control</div>
              <Link
                href="/admin/finance"
                className={`sidebar-link ${pathname === '/admin/finance' ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                title="Revenue & Analytics"
              >
                <DollarSign size={18} />
                <span>Revenue & Analytics</span>
              </Link>
              <Link
                href="/admin/finance/payouts"
                className={`sidebar-link ${pathname === '/admin/finance/payouts' ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                title="Commission Approvals"
              >
                <TrendingUp size={18} />
                <span>Commission Approvals</span>
              </Link>
            </>
          )}

          {canManageMarketing(role) && (
            <>
              <div className="sidebar-section-title">Sales & Affiliates</div>
              <Link
                href="/admin/marketing"
                className={`sidebar-link ${pathname === '/admin/marketing' ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                title="Global Campaigns"
              >
                <Globe size={18} />
                <span>Global Campaigns</span>
              </Link>
              <Link
                href="/admin/marketing/country-managers"
                className={`sidebar-link ${pathname === '/admin/marketing/country-managers' ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                title="Country Heads & Agents"
              >
                <Users size={18} />
                <span>Country Heads & Agents</span>
              </Link>
            </>
          )}

          {(role === 'regional_sales_agent' || role === 'country_sales_manager') && (
            <>
              <div className="sidebar-section-title">My Partner Portal</div>
              <Link
                href="/admin/my-sales"
                className={`sidebar-link ${pathname === '/admin/my-sales' ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                title="My Commissions & Links"
              >
                <TrendingUp size={18} />
                <span>My Commissions & Links</span>
              </Link>
            </>
          )}

          {(role === 'super_admin' || role === 'admin' || role === 'marketing_admin' || role === 'dev_frontend' || role === 'product_editor') && (
            <>
              <div className="sidebar-section-title">Content &amp; CMS</div>
              <Link
                href="/admin/posts"
                className={`sidebar-link ${pathname.startsWith('/admin/posts') ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                title="Blog Posts"
              >
                <BookOpen size={18} />
                <span>Blog Posts</span>
              </Link>
              <Link
                href="/admin/pages"
                className={`sidebar-link ${pathname.startsWith('/admin/pages') ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                title="Storefront Pages"
              >
                <FileText size={18} />
                <span>Storefront Pages</span>
              </Link>
              <Link
                href="/admin/cms"
                className={`sidebar-link ${pathname === '/admin/cms' ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                title="Reviews & Q&A"
              >
                <Sparkles size={18} />
                <span>Reviews &amp; Q&amp;A</span>
              </Link>
            </>
          )}

          <div className="sidebar-section-title">Insights</div>
          <Link
            href="/admin/analytics"
            className={`sidebar-link ${pathname === '/admin/analytics' ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
            title="Visitor Analytics"
          >
            <BarChart3 size={18} />
            <span>Visitor Analytics</span>
          </Link>

          {(role === 'super_admin' || role === 'admin' || isDeveloper(role)) && (
            <>
              <div className="sidebar-section-title">Engineering</div>
              <Link
                href="/admin/settings"
                className={`sidebar-link ${pathname === '/admin/settings' ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                title="Tracking & Integrations"
              >
                <Plug size={18} />
                <span>Tracking &amp; Integrations</span>
              </Link>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <Link href="/" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
            ← Back to Storefront
          </Link>
          <button
            onClick={handleSignOut}
            style={{ background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}
            aria-label="Sign out"
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            onClick={handleToggleSidebar}
            className="admin-mobile-menu-btn"
            aria-label="Toggle sidebar"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Menu size={20} />
          </button>
          <div>
            <strong style={{ fontSize: '1.05rem', color: 'var(--green-900)' }}>{user.full_name || user.email}</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginLeft: '8px' }}>({user.email})</span>
          </div>
          <div className="topbar-user">
            <Link href="/account" className="btn-3d-secondary" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
              My Account
            </Link>
          </div>
        </header>

        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
