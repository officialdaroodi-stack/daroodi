'use client';

import React from 'react';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';

export default function CookiePolicyPage() {
  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', color: '#162923' }}>
      <Header />

      <section style={{ background: 'linear-gradient(135deg, #162923 0%, #1F3B33 100%)', color: '#FFFFFF', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#C9A84C', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Storefront Preferences
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '38px', fontWeight: 700, margin: '0 0 12px', color: '#FFFFFF' }}>
            Cookie Policy
          </h1>
          <p style={{ fontSize: '14px', color: '#E8D5A8', margin: 0, lineHeight: 1.6 }}>
            Understanding how Daroodi utilizes cookies to remember bespoke garment selections and shopping bag state.
          </p>
        </div>
      </section>

      <main style={{ maxWidth: '840px', margin: '0 auto', padding: '48px 20px 80px', fontSize: '14px', lineHeight: 1.8, color: '#333' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162923', marginTop: '20px' }}>1. Essential Store Cookies</h2>
        <p>
          We use strictly necessary session cookies to maintain your shopping cart items, bespoke measurement drafts, and active currency selection as you browse across collections.
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162923', marginTop: '28px' }}>2. Performance &amp; Analytics</h2>
        <p>
          Anonymized analytics cookies help us understand page load speeds and gallery interactions so we can continuously optimize high-resolution garment viewing.
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162923', marginTop: '28px' }}>3. Managing Cookies</h2>
        <p>
          You may modify cookie preferences at any time through your browser settings. For assistance, email <a href="mailto:info@daroodi.com" style={{ color: '#162923', fontWeight: 700 }}>info@daroodi.com</a>.
        </p>
      </main>

      <Footer />
    </div>
  );
}
