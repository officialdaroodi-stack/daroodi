'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { getJournalPostBySlug, getJournalPosts } from '@/lib/db/journal';
import { JournalPost } from '@/lib/types';
import { Clock, ArrowLeft, Share2, Sparkles, Feather, Bookmark, Check } from 'lucide-react';

export default function SingleJournalPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug;
  const [post, setPost] = useState<JournalPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const p = await getJournalPostBySlug(slug);
      const all = await getJournalPosts();
      setPost(p);
      setRelatedPosts(all.filter((item) => item.slug !== slug).slice(0, 2));
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ maxWidth: '840px', margin: '80px auto', textAlign: 'center', color: 'var(--green-900)' }}>
        Loading editorial article...
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ maxWidth: '800px', margin: '80px auto', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--green-900)' }}>Article Not Found</h1>
        <Link href="/journal" className="btn-3d-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>
          ← Back to Journal Archive
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: [post.featured_image_url],
    author: {
      '@type': 'Person',
      name: post.author_name || 'Daroodi Master Stylist',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Daroodi',
      logo: {
        '@type': 'ImageObject',
        url: 'https://daroodi.com/wp-content/uploads/2026/06/cropped-Droodi-Logo.webp',
      },
    },
    datePublished: post.published_at,
    description: post.excerpt,
  };

  return (
    <article style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 16px 120px' }}>
      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <Link
        href="/journal"
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
        <ArrowLeft size={16} /> Back to Journal Archive
      </Link>

      <div style={{ marginBottom: '16px' }}>
        <span
          style={{
            background: 'var(--green-900)',
            color: 'var(--gold-500)',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {post.category || 'Sartorial Heritage'}
        </span>
      </div>

      <h1 style={{ fontSize: '3rem', color: 'var(--green-900)', marginBottom: '18px', lineHeight: 1.2 }}>
        {post.title}
      </h1>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--cream-300)',
          marginBottom: '36px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--slate-600)', fontSize: '0.88rem' }}>
          <span>By <strong>{post.author_name || 'Daroodi Master Stylist'}</strong></span>
          <span>·</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} /> {post.read_time_mins} min read
          </span>
        </div>

        <button
          onClick={handleShare}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--cream-100)',
            border: '1px solid var(--cream-300)',
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            color: 'var(--green-900)',
          }}
        >
          {copied ? <Check size={14} color="#16A34A" /> : <Share2 size={14} />}
          {copied ? 'Link Copied' : 'Share Essay'}
        </button>
      </div>

      {/* Featured Header Visual */}
      <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: '44px', boxShadow: 'var(--shadow-3d-card)', aspectRatio: '16/9' }}>
        <img
          src={post.featured_image_url}
          alt={post.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Article Content */}
      <div
        style={{
          fontSize: '1.15rem',
          lineHeight: 1.85,
          color: 'var(--slate-800)',
          whiteSpace: 'pre-line',
        }}
      >
        {post.content_markdown}
      </div>

      {/* Custom Tailoring Callout Banner */}
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
          Commission a hand-embroidered prince coat tailored to your personal measurements. Worldwide express shipping by DHL.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/shop" className="btn-3d-primary" style={{ padding: '12px 24px' }}>
            Explore Atelier Catalog →
          </Link>
          <Link href="/custom-order" className="btn-3d-secondary" style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
            Request Custom Piece
          </Link>
        </div>
      </div>
    </article>
  );
}
