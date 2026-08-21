'use client';

import React from 'react';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', color: '#162923' }}>
      <Header />

      <section style={{ background: 'linear-gradient(135deg, #162923 0%, #1F3B33 100%)', color: '#FFFFFF', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#C9A84C', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Client Data Confidentiality
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '38px', fontWeight: 700, margin: '0 0 12px', color: '#FFFFFF' }}>
            Privacy Policy &amp; Security Standards
          </h1>
          <p style={{ fontSize: '14px', color: '#E8D5A8', margin: 0, lineHeight: 1.6 }}>
            How Daroodi protects and secures bespoke measurements, client correspondence, and payment information.
          </p>
        </div>
      </section>

      <main style={{ maxWidth: '840px', margin: '0 auto', padding: '48px 20px 80px', fontSize: '14px', lineHeight: 1.8, color: '#333' }}>
        <p><strong>Effective Date:</strong> August 2026 | <strong>Maison:</strong> Daroodi Luxury Atelier</p>

        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162923', marginTop: '28px' }}>1. Collection of Personal &amp; Measurement Data</h2>
        <p>
          To create handcrafted garments tailored to your specific anatomy, Daroodi collects anatomical measurements (chest, shoulders, sleeves, waist, stance), contact information, and shipping destination details. This information is stored in encrypted private vaults and accessed solely by our master pattern cutters and authorized concierge staff.
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162923', marginTop: '28px' }}>2. Payment Security &amp; Encryption</h2>
        <p>
          All credit card and banking transactions are processed through certified PCI-DSS Level 1 payment gateways (Stripe &amp; Barclays). Daroodi never stores or retains raw credit card numbers on our servers.
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162923', marginTop: '28px' }}>3. VIP Client Discretion &amp; Confidentiality</h2>
        <p>
          We strictly uphold client confidentiality. Royal commissions, diplomatic garments, and celebrity orders are kept private under non-disclosure unless explicit public approval has been granted.
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162923', marginTop: '28px' }}>4. Contact Data Protection Officer</h2>
        <p>
          For questions regarding GDPR data deletion or bespoke measurement records, email <a href="mailto:privacy@daroodi.com" style={{ color: '#162923', fontWeight: 700 }}>privacy@daroodi.com</a>.
        </p>
      </main>

      <Footer />
    </div>
  );
}
