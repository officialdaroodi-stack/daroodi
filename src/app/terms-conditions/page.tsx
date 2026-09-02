'use client';

import React from 'react';

export default function TermsConditionsPage() {
  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', color: '#162923' }}>

      <section style={{ background: 'linear-gradient(135deg, #162923 0%, #1F3B33 100%)', color: '#FFFFFF', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#C9A84C', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Legal &amp; Sartorial Terms
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '38px', fontWeight: 700, margin: '0 0 12px', color: '#FFFFFF' }}>
            Terms &amp; Conditions
          </h1>
          <p style={{ fontSize: '14px', color: '#E8D5A8', margin: 0, lineHeight: 1.6 }}>
            Bespoke contracting, measurement warranties, and intellectual property rights.
          </p>
        </div>
      </section>

      <main style={{ maxWidth: '840px', margin: '0 auto', padding: '48px 20px 80px', fontSize: '14px', lineHeight: 1.8, color: '#333' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162923', marginTop: '20px' }}>1. Bespoke Craftsmanship Agreement</h2>
        <p>
          By placing an order for a bespoke piece with Daroodi, you authorize our master artisans to begin drafting patterns and hand-stretching velvet across embroidery looms. Each garment is unique and handcrafted according to your submitted size options and fabric selection.
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162923', marginTop: '28px' }}>2. Pricing &amp; Currency</h2>
        <p>
          All prices are quoted in Great British Pounds (GBP £) and include worldwide insured DHL Express shipping. Currency conversion rates for USD, EUR, and AED are updated in real-time.
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162923', marginTop: '28px' }}>3. Intellectual Property</h2>
        <p>
          All motifs, zardozi needlework patterns, photography, and brand trademarks displayed on daroodi.com are the exclusive intellectual property of Daroodi Ltd.
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162923', marginTop: '28px' }}>4. Governing Law</h2>
        <p>
          These terms are governed by the laws of England and Wales and the Islamic Republic of Pakistan. For inquiries, contact <a href="mailto:legal@daroodi.com" style={{ color: '#162923', fontWeight: 700 }}>legal@daroodi.com</a>.
        </p>
      </main>

    </div>
  );
}
