'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, RotateCcw, Scissors, HelpCircle } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', color: '#162923' }}>

      <section style={{ background: 'linear-gradient(135deg, #162923 0%, #1F3B33 100%)', color: '#FFFFFF', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#C9A84C', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Daroodi Client Assurance
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '38px', fontWeight: 700, margin: '0 0 12px', color: '#FFFFFF' }}>
            Returns &amp; Bespoke Alterations Policy
          </h1>
          <p style={{ fontSize: '14px', color: '#E8D5A8', margin: 0, lineHeight: 1.6 }}>
            Our 100% Fit Guarantee ensures every handmade garment conforms perfectly to your silhouette.
          </p>
        </div>
      </section>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 20px 80px' }}>
        
        {/* Core Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{ background: '#F8F6F3', padding: '24px', borderRadius: '16px', border: '1.5px solid #162923' }}>
            <Scissors size={28} color="#C9A84C" style={{ marginBottom: '10px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px' }}>Complimentary Alterations</h3>
            <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.5, margin: 0 }}>
              If your bespoke coat requires any minor adjustments, we provide complimentary alteration coverage or reimburse local master tailoring up to £75.
            </p>
          </div>

          <div style={{ background: '#F8F6F3', padding: '24px', borderRadius: '16px', border: '1.5px solid #162923' }}>
            <RotateCcw size={28} color="#C9A84C" style={{ marginBottom: '10px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px' }}>14-Day Ready-to-Wear Returns</h3>
            <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.5, margin: 0 }}>
              Standard unworn catalog sizes can be exchanged or returned within 14 days of delivery in original packaging with tags intact.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '14px', lineHeight: 1.7, color: '#333' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162923', margin: '0 0 8px' }}>
              1. Bespoke &amp; Made-to-Measure Garments
            </h2>
            <p style={{ margin: 0 }}>
              Because bespoke coats are drafted and hand-embroidered specifically to your unique anatomical measurements and design specifications (with up to 140 hours of artisanal hand needlework), they are not eligible for traditional refund once production begins. However, they are fully covered under our <strong>Daroodi Perfect-Fit Guarantee</strong>. If your garment does not match the submitted measurements, we will re-tailor or remake the piece at zero expense to you.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162923', margin: '0 0 8px' }}>
              2. How to Request an Adjustment or Exchange
            </h2>
            <ol style={{ paddingLeft: '20px', margin: '0 0 10px' }}>
              <li>Contact our Master Tailor Concierge via WhatsApp at <a href="https://wa.me/923001215532" style={{ color: '#162923', fontWeight: 700 }}>+92 300 1215532</a> or email <a href="mailto:concierge@daroodi.com" style={{ color: '#162923', fontWeight: 700 }}>concierge@daroodi.com</a> within 7 days of receiving your order.</li>
              <li>Provide 2–3 clear photographs wearing the garment (front, side, back) in natural lighting.</li>
              <li>Our head pattern cutter will review the fit and arrange either a complimentary DHL collection for atelier fine-tuning or authorize local tailor adjustment reimbursement.</li>
            </ol>
          </div>

          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162923', margin: '0 0 8px' }}>
              3. Damaged or Defective Deliveries
            </h2>
            <p style={{ margin: 0 }}>
              All shipments are insured for 100% of their retail value. In the rare event of transit damage, notify us within 48 hours of delivery with photos of the damaged shipping trunk, and we will initiate an expedited priority replacement.
            </p>
          </div>
        </div>

      </main>

    </div>
  );
}
