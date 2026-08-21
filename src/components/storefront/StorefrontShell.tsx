'use client';

import React from 'react';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { BottomNav } from '@/components/storefront/BottomNav';

interface StorefrontShellProps {
  children: React.ReactNode;
}

export const StorefrontShell: React.FC<StorefrontShellProps> = ({ children }) => {
  return (
    <div className="storefront-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flexGrow: 1 }}>{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
};
