'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Users, Award, Sparkles } from 'lucide-react';

export default function SahibAliFoundationPage() {
  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', color: '#162923' }}>

      <section style={{ background: 'linear-gradient(135deg, #162923 0%, #1F3B33 100%)', color: '#FFFFFF', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#C9A84C', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Preserving Living Craftsmanship
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '38px', fontWeight: 700, margin: '0 0 12px', color: '#FFFFFF' }}>
            The Sahib Ali Artisan Welfare Foundation
          </h1>
          <p style={{ fontSize: '14px', color: '#E8D5A8', margin: 0, lineHeight: 1.6 }}>
            Empowering master ustads, funding apprentice stipends, and securing healthcare for South Asian embroidery craft lineages.
          </p>
        </div>
      </section>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 20px 80px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{ background: '#F8F6F3', padding: '24px', borderRadius: '16px', border: '1.5px solid #162923', textAlign: 'center' }}>
            <Users size={28} color="#C9A84C" style={{ margin: '0 auto 10px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px' }}>Master Ustad Pensions</h3>
            <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.5, margin: 0 }}>
              Lifelong pension and healthcare security for retired embroidery masters who dedicated 30+ years to the needle.
            </p>
          </div>

          <div style={{ background: '#F8F6F3', padding: '24px', borderRadius: '16px', border: '1.5px solid #162923', textAlign: 'center' }}>
            <Award size={28} color="#C9A84C" style={{ margin: '0 auto 10px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px' }}>Youth Apprenticeships</h3>
            <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.5, margin: 0 }}>
              Full vocational stipends training young artisans in traditional Karchob loom framing and zardozi bullion cutting.
            </p>
          </div>
        </div>

        <div style={{ fontSize: '14px', lineHeight: 1.8, color: '#333' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#162923', margin: '0 0 10px' }}>Our Sacred Commitment</h2>
          <p>
            Established in honour of Master Artisan Sahib Ali, 5% of proceeds from every Daroodi Platinum and Gold commission directly fund artisan healthcare clinics, clean drinking water filtration in weaving communities, and educational scholarships for artisan families across Punjab.
          </p>
        </div>

      </main>

    </div>
  );
}
