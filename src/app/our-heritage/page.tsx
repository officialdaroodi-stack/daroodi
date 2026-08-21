import React from 'react';
import Link from 'next/link';
import { Scissors, Award, Users, Globe, ArrowRight } from 'lucide-react';

export default function OurHeritagePage() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 16px 100px' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <span style={{ color: 'var(--green-700)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          THE ATELIER ARCHIVE
        </span>
        <h1 style={{ fontSize: '3.2rem', margin: '10px 0', color: 'var(--green-900)' }}>
          Four Centuries of Royal Embroidery
        </h1>
        <p style={{ color: 'var(--slate-700)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.7 }}>
          From the imperial courts of the Mughal dynasty to the international runways of modern formalwear, Daroodi preserves ancient embroidery traditions through slow, uncompromising hand needlework.
        </p>
      </div>

      <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: '60px', boxShadow: 'var(--shadow-3d-card)', border: '1px solid var(--cream-300)' }}>
        <img
          src="https://daroodi.com/wp-content/uploads/2026/06/Mens-Premium-Prince-Coat-4.webp"
          alt="Daroodi Master Atelier"
          style={{ width: '100%', maxHeight: '480px', objectFit: 'cover' }}
        />
      </div>

      {/* Narrative Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '60px' }}>
        <div style={{ background: 'var(--white)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--cream-300)' }}>
          <Scissors size={28} color="var(--green-700)" style={{ marginBottom: '14px' }} />
          <h3 style={{ fontSize: '1.3rem', color: 'var(--green-900)', marginBottom: '8px' }}>Authentic Needle Arts</h3>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Every bullion thread, metallic spiral (dabka), and silk ribbon (marori) is applied by hand without mechanical reproduction.
          </p>
        </div>

        <div style={{ background: 'var(--white)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--cream-300)' }}>
          <Users size={28} color="var(--green-700)" style={{ marginBottom: '14px' }} />
          <h3 style={{ fontSize: '1.3rem', color: 'var(--green-900)', marginBottom: '8px' }}>Artisan Guild Empowerment</h3>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Our master craftsmen receive ethical fair wages, healthcare support, and multi-generational craft security.
          </p>
        </div>

        <div style={{ background: 'var(--white)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--cream-300)' }}>
          <Globe size={28} color="var(--green-700)" style={{ marginBottom: '14px' }} />
          <h3 style={{ fontSize: '1.3rem', color: 'var(--green-900)', marginBottom: '8px' }}>Global Bespoke Delivery</h3>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Directly delivered to over 40 countries via DHL Express with our perfect-fit guarantee.
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link href="/collections" className="btn-3d-primary">
          Explore the Master Collection <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
