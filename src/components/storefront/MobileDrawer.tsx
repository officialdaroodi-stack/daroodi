'use client';

import React from 'react';
import Link from 'next/link';
import { X, Search, User, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { totalItems } = useCart();

  const navItems = [
    { num: '01', title: 'Home', href: '/' },
    { num: '02', title: 'Collections (4 Tiers)', href: '/collections' },
    { num: '03', title: 'Shop All Pieces', href: '/shop' },
    { num: '04', title: 'Bespoke Custom Order', href: '/custom-order' },
    { num: '05', title: 'Atelier Heritage Story', href: '/our-heritage' },
    { num: '06', title: 'The Journal', href: '/journal' },
    { num: '07', title: '🏢 ERP & Staff Portal', href: '/admin' },
  ];

  return (
    <>
      <div
        className={`drawer-backdrop ${isOpen ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`mobile-drawer ${isOpen ? 'is-open' : ''}`} aria-label="Mobile Navigation Drawer">
        <div className="drawer-header">
          <div className="logo-container">
            <div className="logo-emblem">
              <span style={{ color: '#C9A84C', fontWeight: 700, fontSize: '1.1rem' }}>D</span>
            </div>
            <span className="logo-text">Daroodi</span>
          </div>
          <button
            onClick={onClose}
            className="menu-toggle-btn"
            style={{ width: '34px', height: '34px' }}
            aria-label="Close Drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Action Cards (Search, Account, Shop) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
          <Link
            href="/shop"
            onClick={onClose}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 6px',
              background: 'linear-gradient(155deg, #1B5E20, #0F241E)',
              color: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #05140E',
              boxShadow: '0 3px 0 #05140E',
              fontSize: '0.72rem',
              fontWeight: 700,
              textDecoration: 'none',
              gap: '4px'
            }}
          >
            <ShoppingBag size={18} color="#FFFFFF" />
            <span>SHOP</span>
          </Link>

          <Link
            href="/shop"
            onClick={onClose}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 6px',
              background: '#FFFFFF',
              color: 'var(--green-900)',
              borderRadius: '12px',
              border: '1px solid var(--cream-300)',
              boxShadow: '0 3px 0 var(--cream-400)',
              fontSize: '0.72rem',
              fontWeight: 700,
              textDecoration: 'none',
              gap: '4px'
            }}
          >
            <Search size={18} />
            <span>SEARCH</span>
          </Link>

          <Link
            href="/auth/login"
            onClick={onClose}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 6px',
              background: '#FFFFFF',
              color: 'var(--green-900)',
              borderRadius: '12px',
              border: '1px solid var(--cream-300)',
              boxShadow: '0 3px 0 var(--cream-400)',
              fontSize: '0.72rem',
              fontWeight: 700,
              textDecoration: 'none',
              gap: '4px'
            }}
          >
            <User size={18} />
            <span>ACCOUNT</span>
          </Link>
        </div>

        {/* Numbered 3D Navigation Cards */}
        <nav className="drawer-nav-list">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="drawer-card-item"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="drawer-num">{item.num}</span>
                <span>{item.title}</span>
              </div>
              <ArrowRight size={14} color="var(--slate-400)" />
            </Link>
          ))}
        </nav>

        {/* Bottom Drawer Support & WhatsApp */}
        <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
          <a
            href="https://wa.me/923001215532?text=Hi%20Daroodi!%20I'm%20interested%20in%20ordering%20a%20custom%20embroidered%20coat."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.88rem' }}
          >
            WhatsApp Atelier Specialist
          </a>
        </div>
      </aside>
    </>
  );
};
