'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { BottomNav } from '@/components/storefront/BottomNav';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const pathname = usePathname();

  // Admin ERP and Authentication pages must have ZERO storefront header or footer
  const isAdminOrAuth = pathname?.startsWith('/admin') || pathname?.startsWith('/auth');

  if (isAdminOrAuth) {
    return <>{children}</>;
  }

  return (
    <div className="storefront-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flexGrow: 1 }}>{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
};
