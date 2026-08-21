'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { Truck, ShieldCheck, Globe, Clock, PackageCheck, AlertCircle } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', color: '#162923' }}>
      <Header />

      {/* Hero Header */}
      <section style={{ background: 'linear-gradient(135deg, #162923 0%, #1F3B33 100%)', color: '#FFFFFF', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#C9A84C', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Daroodi Global Logistics
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '38px', fontWeight: 700, margin: '0 0 12px', color: '#FFFFFF' }}>
            Worldwide Shipping &amp; White-Glove Delivery
          </h1>
          <p style={{ fontSize: '14px', color: '#E8D5A8', margin: 0, lineHeight: 1.6 }}>
            Every bespoke masterpiece is packaged in museum-grade garment trunks and dispatched with fully-insured DHL Express worldwide.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 20px 80px' }}>
        
        {/* Logistics Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '48px' }}>
          <div style={{ background: '#F8F6F3', padding: '24px', borderRadius: '16px', border: '1.5px solid #162923', textAlign: 'center' }}>
            <Globe size={28} color="#C9A84C" style={{ margin: '0 auto 10px' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px' }}>40+ Countries Shipped</h3>
            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Direct from our Lahore Atelier to UK, UAE, USA, Canada, Europe &amp; Australia.</p>
          </div>

          <div style={{ background: '#F8F6F3', padding: '24px', borderRadius: '16px', border: '1.5px solid #162923', textAlign: 'center' }}>
            <Truck size={28} color="#C9A84C" style={{ margin: '0 auto 10px' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px' }}>DHL Express Air</h3>
            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>3–5 business days transit time once bespoke tailoring is completed.</p>
          </div>

          <div style={{ background: '#F8F6F3', padding: '24px', borderRadius: '16px', border: '1.5px solid #162923', textAlign: 'center' }}>
            <ShieldCheck size={28} color="#C9A84C" style={{ margin: '0 auto 10px' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px' }}>100% Insured Transit</h3>
            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Full replacement value guarantee against transit loss or damage.</p>
          </div>

          <div style={{ background: '#F8F6F3', padding: '24px', borderRadius: '16px', border: '1.5px solid #162923', textAlign: 'center' }}>
            <PackageCheck size={28} color="#C9A84C" style={{ margin: '0 auto 10px' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px' }}>Archival Luxury Box</h3>
            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Includes breathable velvet garment bag and custom engraved wooden hanger.</p>
          </div>
        </div>

        {/* Timeline Table */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#162923', marginBottom: '16px' }}>
            Production &amp; Dispatch Timelines
          </h2>
          <div style={{ background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: '16px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F8F6F3', borderBottom: '1px solid #E5E0D8' }}>
                  <th style={{ padding: '14px 18px' }}>Garment Category</th>
                  <th style={{ padding: '14px 18px' }}>Artisan Crafting Time</th>
                  <th style={{ padding: '14px 18px' }}>DHL Transit</th>
                  <th style={{ padding: '14px 18px' }}>Total Arrival Window</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #F0ECE4' }}>
                  <td style={{ padding: '14px 18px' }}><strong>Ready-to-Ship Archive Sizes</strong></td>
                  <td style={{ padding: '14px 18px' }}>24 – 48 Hours</td>
                  <td style={{ padding: '14px 18px' }}>3 – 5 Days</td>
                  <td style={{ padding: '14px 18px', color: '#1B5E20', fontWeight: 700 }}>4 – 7 Days</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F0ECE4' }}>
                  <td style={{ padding: '14px 18px' }}><strong>Bespoke Prince Coats (Platinum &amp; Gold)</strong></td>
                  <td style={{ padding: '14px 18px' }}>3 – 4 Weeks (120h needlework)</td>
                  <td style={{ padding: '14px 18px' }}>3 – 5 Days</td>
                  <td style={{ padding: '14px 18px', fontWeight: 700 }}>3.5 – 4.5 Weeks</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F0ECE4' }}>
                  <td style={{ padding: '14px 18px' }}><strong>Tailored Blazers &amp; Tuxedo Jackets</strong></td>
                  <td style={{ padding: '14px 18px' }}>2 – 3 Weeks</td>
                  <td style={{ padding: '14px 18px' }}>3 – 5 Days</td>
                  <td style={{ padding: '14px 18px', fontWeight: 700 }}>2.5 – 3.5 Weeks</td>
                </tr>
                <tr>
                  <td style={{ padding: '14px 18px' }}><strong>Bulk Dignitary &amp; Fraternal Regalia</strong></td>
                  <td style={{ padding: '14px 18px' }}>4 – 6 Weeks (Per cohort specs)</td>
                  <td style={{ padding: '14px 18px' }}>3 – 5 Days</td>
                  <td style={{ padding: '14px 18px', fontWeight: 700 }}>4.5 – 6.5 Weeks</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Duties & Custom Clearances */}
        <section style={{ background: '#F8F6F3', padding: '24px', borderRadius: '16px', border: '1px solid #E5E0D8' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#162923', margin: '0 0 10px' }}>
            Duties, Customs &amp; Import Clearance
          </h3>
          <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.6, margin: 0 }}>
            All international shipments are dispatched under harmonized luxury bespoke textile codes with accurate provenance documentation. UK and UAE orders are typically processed through customs seamlessly. For inquiries regarding specific country import regulations, contact our dedicated logistics desk via <a href="mailto:logistics@daroodi.com" style={{ color: '#162923', fontWeight: 700 }}>logistics@daroodi.com</a> or WhatsApp at <a href="https://wa.me/923001215532" style={{ color: '#162923', fontWeight: 700 }}>+92 300 1215532</a>.
          </p>
        </section>

      </main>

      <Footer />
    </div>
  );
}
