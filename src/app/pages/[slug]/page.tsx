'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { getPageBySlug } from '@/lib/db/pages';
import { CMSPage } from '@/lib/types';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function DynamicCMSPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [page, setPage] = useState<CMSPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const p = await getPageBySlug(slug);
      setPage(p);
      setLoading(false);
    }
    load();
  }, [slug]);

  // Set SEO meta from the page
  useEffect(() => {
    if (page) {
      document.title = page.seo_title || `${page.title} | Daroodi`;
      if (page.seo_description) {
        let m = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
        if (!m) {
          m = document.createElement('meta');
          m.name = 'description';
          document.head.appendChild(m);
        }
        m.content = page.seo_description;
      }
    }
  }, [page]);

  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '80px auto', textAlign: 'center', color: 'var(--green-900)' }}>
        Loading page…
      </div>
    );
  }

  if (!page) {
    return (
      <div style={{ maxWidth: '800px', margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--green-900)' }}>Page Not Found</h1>
        <p style={{ color: 'var(--slate-600)' }}>The page you are looking for doesn't exist or has been moved.</p>
        <Link href="/" className="btn-3d-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>
          ← Return to Storefront
        </Link>
      </div>
    );
  }

  return (
    <article style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 16px 120px' }}>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.88rem',
          color: 'var(--green-700)',
          fontWeight: 700,
          marginBottom: '28px',
          textDecoration: 'none',
        }}
      >
        <ArrowLeft size={16} /> Back to Storefront
      </Link>

      <h1 style={{ fontSize: '3rem', color: 'var(--green-900)', marginBottom: '18px', lineHeight: 1.2 }}>
        {page.title}
      </h1>

      {page.excerpt && (
        <p style={{ fontSize: '1.15rem', color: 'var(--slate-600)', marginBottom: '32px', lineHeight: 1.6, fontStyle: 'italic' }}>
          {page.excerpt}
        </p>
      )}

      {page.featured_image_url && (
        <div
          style={{
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            marginBottom: '40px',
            boxShadow: 'var(--shadow-3d-card)',
            aspectRatio: '16/9',
          }}
        >
          <img
            src={page.featured_image_url}
            alt={page.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      <div
        style={{
          fontSize: '1.1rem',
          lineHeight: 1.85,
          color: 'var(--slate-800)',
          whiteSpace: 'pre-line',
        }}
      >
        {page.content}
      </div>

      <div
        style={{
          marginTop: '60px',
          padding: '40px 32px',
          background: 'linear-gradient(135deg, #0F241E 0%, #1B5E20 100%)',
          borderRadius: 'var(--radius-xl)',
          textAlign: 'center',
          color: '#FFFFFF',
          boxShadow: 'var(--shadow-3d-button)',
        }}
      >
        <Sparkles size={28} color="var(--gold-500)" style={{ margin: '0 auto 12px' }} />
        <h3 style={{ fontSize: '1.6rem', color: 'var(--cream-50)', marginBottom: '8px' }}>
          Experience Bespoke Slow Luxury
        </h3>
        <p style={{ color: 'var(--cream-200)', fontSize: '0.95rem', maxWidth: '540px', margin: '0 auto 24px', lineHeight: 1.5 }}>
          Commission a hand-embroidered prince coat tailored to your personal measurements.
        </p>
        <Link href="/shop" className="btn-3d-primary" style={{ padding: '12px 24px' }}>
          Explore Atelier Catalog →
        </Link>
      </div>
    </article>
  );
}
