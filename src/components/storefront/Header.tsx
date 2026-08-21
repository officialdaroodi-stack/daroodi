'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export const Header: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <p>
          Free shipping on orders over £500 · <Link href="/shop">Browse the collection</Link>
        </p>
      </div>

      {/* Header */}
      <header className="header" id="header">
        <div className="nav-shell">
          <nav className="nav container" aria-label="Main navigation">
            <div className="nav-mobile-start">
              <button
                className={`menu-toggle ${isDrawerOpen ? 'is-active' : ''}`}
                aria-label="Open menu"
                aria-expanded={isDrawerOpen}
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              >
                <span className="menu-toggle-box" aria-hidden="true">
                  <span className="bar bar-1"></span>
                  <span className="bar bar-2"></span>
                  <span className="bar bar-3"></span>
                </span>
              </button>
              <Link href="/shop" className="nav-icon nav-icon-3d nav-search" aria-label="Search products">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
              </Link>
            </div>
            <Link href="/" className="logo logo-3d">
              <span className="logo-emblem">
                <img src="https://daroodi.com/wp-content/uploads/2026/06/cropped-Droodi-Logo.webp" alt="Daroodi logo" width={34} height={34} />
              </span>
              <span className="logo-text">Daroodi</span>
            </Link>
            <ul className="nav-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/collections">Collections</Link></li>
              <li><Link href="/shop">Shop</Link></li>
              <li><Link href="/custom-order">Bespoke</Link></li>
              <li><Link href="/bulk-events">Bulk &amp; Events</Link></li>
              <li><Link href="/journal">Journal</Link></li>
            </ul>
            <div className="nav-icons">
              <Link href="/shop" className="nav-icon nav-search-desktop" aria-label="Search products">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
              </Link>
              <Link href="/auth/login" className="nav-icon nav-icon-3d nav-account" aria-label="My account">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </Link>
              <Link href="/cart" className="nav-icon nav-icon-3d nav-shop" aria-label="Shop" style={{ position: 'relative' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                {totalItems > 0 && (
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#C9A84C', color: '#0F241E', borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {totalItems}
                  </span>
                )}
              </Link>
              <Link href="/shop" className="btn btn-primary btn-sm nav-cta">Shop Now</Link>
            </div>
          </nav>
        </div>

        {/* 3D Mobile Drawer */}
        <div className={`mobile-drawer ${isDrawerOpen ? 'is-open open' : ''}`} aria-hidden={!isDrawerOpen}>
          <div className="drawer-backdrop" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="drawer-panel">
            <div className="drawer-accent" aria-hidden="true"></div>
            <div className="drawer-header">
              <Link href="/" className="drawer-brand" onClick={() => setIsDrawerOpen(false)}>
                <span className="drawer-brand-emblem">
                  <img src="https://daroodi.com/wp-content/uploads/2026/06/cropped-Droodi-Logo.webp" alt="" width={32} height={32} />
                </span>
                <span className="drawer-brand-text">
                  <strong>Daroodi</strong>
                  <small>Bespoke Luxury</small>
                </span>
              </Link>
              <button className="drawer-close" aria-label="Close menu" onClick={() => setIsDrawerOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="drawer-quick">
              <Link href="/shop" className="drawer-quick-btn" onClick={() => setIsDrawerOpen(false)}>
                <span className="drawer-quick-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
                </span>
                Search
              </Link>
              <Link href="/auth/login" className="drawer-quick-btn" onClick={() => setIsDrawerOpen(false)}>
                <span className="drawer-quick-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                Account
              </Link>
              <Link href="/shop" className="drawer-quick-btn drawer-quick-btn-accent" onClick={() => setIsDrawerOpen(false)}>
                <span className="drawer-quick-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/></svg>
                </span>
                Shop
              </Link>
            </div>
            <nav className="drawer-nav" aria-label="Mobile menu">
              <Link href="/" className="drawer-link" onClick={() => setIsDrawerOpen(false)}>
                <span className="drawer-link-num">01</span>
                <span className="drawer-link-text">Home</span>
                <span className="drawer-link-arrow" aria-hidden="true">→</span>
              </Link>
              <Link href="/collections" className="drawer-link" onClick={() => setIsDrawerOpen(false)}>
                <span className="drawer-link-num">02</span>
                <span className="drawer-link-text">Collections</span>
                <span className="drawer-link-arrow" aria-hidden="true">→</span>
              </Link>
              <Link href="/shop" className="drawer-link" onClick={() => setIsDrawerOpen(false)}>
                <span className="drawer-link-num">03</span>
                <span className="drawer-link-text">Shop</span>
                <span className="drawer-link-arrow" aria-hidden="true">→</span>
              </Link>
              <Link href="/custom-order" className="drawer-link" onClick={() => setIsDrawerOpen(false)}>
                <span className="drawer-link-num">04</span>
                <span className="drawer-link-text">Bespoke Orders</span>
                <span className="drawer-link-arrow" aria-hidden="true">→</span>
              </Link>
              <Link href="/bulk-events" className="drawer-link" onClick={() => setIsDrawerOpen(false)}>
                <span className="drawer-link-num">05</span>
                <span className="drawer-link-text">Bulk &amp; Events</span>
                <span className="drawer-link-arrow" aria-hidden="true">→</span>
              </Link>
              <Link href="/our-heritage" className="drawer-link" onClick={() => setIsDrawerOpen(false)}>
                <span className="drawer-link-num">06</span>
                <span className="drawer-link-text">About</span>
                <span className="drawer-link-arrow" aria-hidden="true">→</span>
              </Link>
              <Link href="/journal" className="drawer-link" onClick={() => setIsDrawerOpen(false)}>
                <span className="drawer-link-num">07</span>
                <span className="drawer-link-text">Journal</span>
                <span className="drawer-link-arrow" aria-hidden="true">→</span>
              </Link>
            </nav>
            <div className="drawer-footer">
              <Link href="/shop" className="btn btn-primary drawer-cta" onClick={() => setIsDrawerOpen(false)}>Shop Collection</Link>
              <p className="drawer-tagline">Handcrafted luxury · Worldwide delivery</p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
