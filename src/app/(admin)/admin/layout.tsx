'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
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
  Layers,
  Terminal,
  LogOut,
  Sparkles,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, switchRole } = useAuth();
  const role = currentUser?.role;

  return (
    <div className="admin-layout">
      {/* Dynamic Role-Adaptive Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="logo-emblem">
            <span style={{ color: '#C9A84C', fontWeight: 700 }}>D</span>
          </div>
          <div>
            <div className="sidebar-logo-text">Daroodi ERP</div>
            <span className="sidebar-role-badge">
              {role ? getRoleDisplayName(role) : 'Guest'}
            </span>
          </div>
        </div>

        <nav className="sidebar-menu">
          {/* Main Dashboard Overview */}
          <Link
            href="/admin"
            className={`sidebar-link ${pathname === '/admin' ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Overview & KPIs</span>
          </Link>

          {/* User Management & Hierarchy (Super Admin & Admin) */}
          {canManageUsers(role) && (
            <>
              <div className="sidebar-section-title">Administration</div>
              <Link
                href="/admin/users"
                className={`sidebar-link ${pathname === '/admin/users' ? 'active' : ''}`}
              >
                <Users size={18} />
                <span>User Hierarchy & Roles</span>
              </Link>
            </>
          )}

          {/* Product Operations (Product Manager, Editor, Admin, Super Admin) */}
          {canManageProducts(role) && (
            <>
              <div className="sidebar-section-title">Catalog & Inventory</div>
              <Link
                href="/admin/products"
                className={`sidebar-link ${pathname.startsWith('/admin/products') ? 'active' : ''}`}
              >
                <Package size={18} />
                <span>Products & ACF Specs</span>
              </Link>
            </>
          )}

          {/* Order Processing & Custom Tailoring (Product Manager, Order Checker, Admin) */}
          {canManageOrders(role) && (
            <Link
              href="/admin/orders"
              className={`sidebar-link ${pathname.startsWith('/admin/orders') ? 'active' : ''}`}
            >
              <ShoppingBag size={18} />
              <span>Orders & Measurements</span>
            </Link>
          )}

          {/* Finance & Payouts (Finance Manager, Super Admin) */}
          {canManageFinance(role) && (
            <>
              <div className="sidebar-section-title">Financial Control</div>
              <Link
                href="/admin/finance"
                className={`sidebar-link ${pathname === '/admin/finance' ? 'active' : ''}`}
              >
                <DollarSign size={18} />
                <span>Revenue & Analytics</span>
              </Link>
              <Link
                href="/admin/finance/payouts"
                className={`sidebar-link ${pathname === '/admin/finance/payouts' ? 'active' : ''}`}
              >
                <TrendingUp size={18} />
                <span>Commission Approvals</span>
              </Link>
            </>
          )}

          {/* Marketing & Multi-Tier Sales Hierarchy (Marketing Admin & Country Managers) */}
          {canManageMarketing(role) && (
            <>
              <div className="sidebar-section-title">Sales & Affiliates</div>
              <Link
                href="/admin/marketing"
                className={`sidebar-link ${pathname === '/admin/marketing' ? 'active' : ''}`}
              >
                <Globe size={18} />
                <span>Global Campaigns</span>
              </Link>
              <Link
                href="/admin/marketing/country-managers"
                className={`sidebar-link ${pathname === '/admin/marketing/country-managers' ? 'active' : ''}`}
              >
                <Users size={18} />
                <span>Country Heads & Agents</span>
              </Link>
            </>
          )}

          {/* Direct Sales Agent Portal (Regional Agents & Country Heads) */}
          {(role === 'regional_sales_agent' || role === 'country_sales_manager') && (
            <>
              <div className="sidebar-section-title">My Partner Portal</div>
              <Link
                href="/admin/my-sales"
                className={`sidebar-link ${pathname === '/admin/my-sales' ? 'active' : ''}`}
              >
                <TrendingUp size={18} />
                <span>My Commissions & Links</span>
              </Link>
            </>
          )}

          {/* Headless CMS & Developer Consoles */}
          {(isDeveloper(role) || role === 'admin') && (
            <>
              <div className="sidebar-section-title">Engineering & CMS</div>
              <Link
                href="/admin/cms"
                className={`sidebar-link ${pathname === '/admin/cms' ? 'active' : ''}`}
              >
                <Layers size={18} />
                <span>Headless CMS Blocks</span>
              </Link>
              <Link
                href="/admin/system"
                className={`sidebar-link ${pathname === '/admin/system' ? 'active' : ''}`}
              >
                <Terminal size={18} />
                <span>Supabase DB & Logs</span>
              </Link>
            </>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <Link href="/" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
            ← Back to Storefront
          </Link>
          <Link href="/auth/login" style={{ color: 'var(--slate-400)' }} aria-label="Switch User">
            <LogOut size={16} />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Admin Topbar */}
        <header className="admin-topbar">
          <div>
            <strong style={{ fontSize: '1.1rem', color: 'var(--green-900)' }}>
              {currentUser?.full_name}
            </strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginLeft: '8px' }}>
              ({currentUser?.email})
            </span>
          </div>

          <div className="topbar-user">
            <Link href="/auth/login" className="btn-3d-secondary" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
              Switch Active Role
            </Link>
          </div>
        </header>

        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
