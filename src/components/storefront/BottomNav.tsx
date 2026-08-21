'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  // Disable on Single Product pages (replaced with dedicated product action pill)
  if (pathname?.startsWith('/shop/') && pathname !== '/shop') {
    return null;
  }

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile bottom navigation">
      <div className="bottom-nav-shell">
        <Link
          href="/"
          className={`bottom-nav-item ${pathname === '/' ? 'is-active' : ''}`}
          data-nav="hero"
        >
          <span className="bottom-nav-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5z"/></svg>
          </span>
          <span className="bottom-nav-label">Home</span>
        </Link>

        <Link
          href="/collections"
          className={`bottom-nav-item ${pathname.startsWith('/collections') ? 'is-active' : ''}`}
          data-nav="collections"
        >
          <span className="bottom-nav-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          </span>
          <span className="bottom-nav-label">Collections</span>
        </Link>

        <Link
          href="/shop"
          className="bottom-nav-item bottom-nav-item-center"
          aria-label="Shop"
        >
          <span className="bottom-nav-fab-wrap">
            <span className="bottom-nav-fab-ring" aria-hidden="true"></span>
            <span className="bottom-nav-fab-ring bottom-nav-fab-ring-2" aria-hidden="true"></span>
            <span className="bottom-nav-fab">
              <span className="bottom-nav-fab-shimmer" aria-hidden="true"></span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            </span>
          </span>
        </Link>

        <Link
          href="/our-heritage"
          className={`bottom-nav-item ${pathname.startsWith('/our-heritage') ? 'is-active' : ''}`}
          data-nav="craft"
        >
          <span className="bottom-nav-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="M12 2l2.4 4.8L20 8l-4 3.6L17 18h-10l1-6.4L4 8l5.6-1.2L12 2z"/></svg>
          </span>
          <span className="bottom-nav-label">About</span>
        </Link>

        <Link
          href="/auth/login"
          className={`bottom-nav-item ${pathname.startsWith('/auth') || pathname.startsWith('/admin') ? 'is-active' : ''}`}
        >
          <span className="bottom-nav-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </span>
          <span className="bottom-nav-label">Account</span>
        </Link>
      </div>
    </nav>
  );
};
