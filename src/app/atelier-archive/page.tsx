'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Crown, ArrowRight } from 'lucide-react';

export default function AtelierArchivePage() {
  const archives = [
    {
      title: 'The 1988 Sovereign Coronation Sherwani',
      year: '1988',
      desc: 'Handcrafted in 24k metallic bullion zari with botanical Mughal jaal across pure midnight velvet.',
      img: '/uploads/2026/05/daroodi-ceremonial-robes.jpg',
      hours: '160 Hours',
    },
    {
      title: 'The Chancellor Ceremonial Robe',
      year: '2004',
      desc: 'Heavyweight damask silk with hand-padded bullion crests crafted for collegiate chancellors.',
      img: '/uploads/2026/05/daroodi-bishops-robes.jpg',
      hours: '140 Hours',
    },
    {
      title: 'The Grand Master Masonic Regalia',
      year: '2016',
      desc: 'Gold tilla heraldic embellishments stitched with silk resham ties for European fraternal lodges.',
      img: '/uploads/2026/05/daroodi-masonic-regalia.jpg',
      hours: '110 Hours',
    },
    {
      title: 'The Imperial Peacock Zardozi Prince Coat',
      year: '2024',
      desc: 'Masterwork peacock feather filigree across Italian micro-velvet canvas with handmade knot buttons.',
      img: '/uploads/2026/06/Mens-Premium-Prince-Coat-4.webp',
      hours: '120 Hours',
    },
  ];

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', color: '#162923' }}>

      <section style={{ background: 'linear-gradient(135deg, #162923 0%, #1F3B33 100%)', color: '#FFFFFF', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#C9A84C', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Historical Masterpieces (1982 – Present)
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '38px', fontWeight: 700, margin: '0 0 12px', color: '#FFFFFF' }}>
            The Daroodi Atelier Archive
          </h1>
          <p style={{ fontSize: '14px', color: '#E8D5A8', margin: 0, lineHeight: 1.6 }}>
            A curated retrospective of royal ceremonial commissions, dignitary garments, and one-of-a-kind bespoke creations.
          </p>
        </div>
      </section>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 20px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
          {archives.map((item, idx) => (
            <div key={idx} style={{ background: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #162923', overflow: 'hidden', boxShadow: '0 8px 24px rgba(22,41,35,0.06)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '280px', overflow: 'hidden', background: '#162923', position: 'relative' }}>
                <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#162923', color: '#C9A84C', border: '1px solid #C9A84C', padding: '4px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: 800 }}>
                  {item.year}
                </span>
                <span style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(255,255,255,0.95)', color: '#162923', padding: '4px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: 800 }}>
                  ✦ {item.hours}
                </span>
              </div>
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#162923', margin: '0 0 8px' }}>{item.title}</h3>
                  <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
                <div style={{ marginTop: '18px', paddingTop: '12px', borderTop: '1px solid #F0ECE4' }}>
                  <Link href="/custom-order" style={{ fontSize: '12px', fontWeight: 800, color: '#162923', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Re-commission Archive Silhouette <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

    </div>
  );
}
