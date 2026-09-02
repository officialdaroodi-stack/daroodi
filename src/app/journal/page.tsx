'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getJournalPosts } from '@/lib/db/journal';
import { JournalPost } from '@/lib/types';
import { Clock, ArrowRight, BookOpen, Sparkles, Feather } from 'lucide-react';

export default function JournalArchivePage() {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getJournalPosts();
      // Only published posts are visible on the public storefront
      setPosts(data.filter((p) => (p.status || 'published') === 'published'));
      setLoading(false);
    }
    load();
  }, []);

  const categories = ['all', 'Sartorial Heritage', 'Bespoke Guides', 'Zardozi Embroidery', 'Wedding Styling'];

  const filteredPosts = posts.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 16px 120px' }}>
      {/* Editorial Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <span style={{ color: 'var(--green-700)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          ATELIER EDITORIAL ARCHIVE
        </span>
        <h1 style={{ fontSize: '3.2rem', margin: '10px 0 14px', color: 'var(--green-900)' }}>
          The Daroodi Journal
        </h1>
        <p style={{ color: 'var(--slate-700)', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
          Essays on slow luxury, 400-year-old zardozi needlework, bespoke tailoring guides, and royal sartorial heritage.
        </p>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={selectedCategory === cat ? 'btn-3d-primary' : 'btn-3d-secondary'}
            style={{ padding: '8px 18px', fontSize: '0.82rem', textTransform: 'capitalize' }}
          >
            {cat === 'all' ? 'All Editorial Essays' : cat}
          </button>
        ))}
      </div>

      {/* Journal Post Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--green-900)' }}>
          Loading editorial archives...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '36px' }}>
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              style={{
                background: 'var(--white)',
                border: '1px solid var(--cream-300)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-3d-card)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              <div style={{ width: '100%', height: '240px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={post.featured_image_url || post.cover_image_url || '/uploads/2026/05/craftsmanship.jpg'}
                  alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    background: 'var(--green-900)',
                    color: 'var(--gold-500)',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                  }}
                >
                  {post.category || 'Editorial'}
                </span>
              </div>

              <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: 'var(--slate-500)', marginBottom: '12px' }}>
                  <span>{post.author_name || post.author || 'Daroodi Master Stylist'}</span>
                  <span>·</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} /> {post.read_time_mins || post.read_time_minutes || 5} min read
                  </span>
                </div>

                <h2 style={{ fontSize: '1.35rem', color: 'var(--green-900)', marginBottom: '12px', lineHeight: 1.3 }}>
                  <Link href={`/journal/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {post.title}
                  </Link>
                </h2>

                <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px', flexGrow: 1 }}>
                  {post.excerpt}
                </p>

                <Link
                  href={`/journal/${post.slug}`}
                  className="btn-3d-secondary"
                  style={{ padding: '10px 18px', fontSize: '0.85rem', alignSelf: 'flex-start' }}
                >
                  Read Full Essay <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
