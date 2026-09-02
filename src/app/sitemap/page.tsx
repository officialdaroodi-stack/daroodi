'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_PRODUCTS, INITIAL_COLLECTIONS, INITIAL_JOURNAL_POSTS } from '@/lib/mockData';
import { Search, Compass, Sparkles, BookOpen, Layers, ShieldCheck, ChevronRight } from 'lucide-react';

export default function StylishHTMLSitemap() {
  const [searchQuery, setSearchQuery] = useState('');

  const staticLinks = [
    { title: 'Home Page', url: '/', desc: 'Daroodi bespoke luxury atelier flagship home' },
    { title: 'Bespoke Collections', url: '/collections', desc: 'Platinum, Gold, Silver & Essentials curated tiers' },
    { title: 'All Products / Master Catalog', url: '/shop', desc: 'Browse handcrafted prince coats, blazers & sherwanis' },
    { title: 'Bespoke Custom Orders', url: '/custom-order', desc: 'Made-to-measure custom garments crafted to millimeter specs' },
    { title: 'Bulk & Fraternal Events', url: '/bulk-events', desc: 'Ceremonial regalia, orders, dignitaries & corporate galas' },
    { title: 'Our Heritage & Atelier', url: '/our-heritage', desc: 'Three generations of royal embroidery craft in Lahore' },
    { title: 'The Daroodi Style Journal', url: '/journal', desc: 'Editorial guides, zardozi needlework essays & styling' },
    { title: 'Track Order & Production', url: '/track-order', desc: 'Real-time timeline tracking for bespoke creation' },
    { title: 'Client Account / Login', url: '/auth/login', desc: 'Access bespoke measurements and order history' },
    { title: 'Shopping Bag & Checkout', url: '/cart', desc: 'Review selected garments with worldwide DHL Express' },
  ];

  const filterItem = (text: string) => {
    if (!searchQuery) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', color: '#162923' }}>

      {/* Hero Banner */}
      <section style={{ background: 'linear-gradient(135deg, #162923 0%, #1F3B33 100%)', color: '#FFFFFF', padding: '60px 20px 50px', textAlign: 'center', position: 'relative' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#C9A84C', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Daroodi Haute Couture Sitemap
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '38px', fontWeight: 700, margin: '0 0 12px', color: '#FFFFFF' }}>
            Complete Store Navigation Directory
          </h1>
          <p style={{ fontSize: '14px', color: '#E8D5A8', margin: '0 auto 24px', maxWidth: '560px', lineHeight: 1.6 }}>
            Explore every bespoke collection, handcrafted prince coat, editorial journal article, and atelier customer service page.
          </p>

          {/* Quick Search */}
          <div style={{ maxWidth: '460px', margin: '0 auto', position: 'relative' }}>
            <Search size={18} color="#C9A84C" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search pages, collections, garments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '14px 16px 14px 46px', borderRadius: '50px', border: '1.5px solid #C9A84C', background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
            />
          </div>
        </div>
      </section>

      {/* Main Sitemap Content Grid */}
      <main style={{ maxWidth: '1360px', margin: '0 auto', padding: '48px 20px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>

          {/* Section 1: Main Portals */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #162923', padding: '24px', boxShadow: '0 4px 16px rgba(22,41,35,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '12px', borderBottom: '2px solid #F0ECE4' }}>
              <Compass size={22} color="#C9A84C" />
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162923', margin: 0 }}>
                Main Storefront Pages
              </h2>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {staticLinks.filter(l => filterItem(l.title) || filterItem(l.desc)).map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.url}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '10px', textDecoration: 'none', color: '#162923', background: '#F8F6F3', transition: 'all 0.2s' }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#162923';
                      e.currentTarget.style.color = '#C9A84C';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#F8F6F3';
                      e.currentTarget.style.color = '#162923';
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '13px', display: 'block' }}>{link.title}</strong>
                      <span style={{ fontSize: '11px', opacity: 0.8 }}>{link.desc}</span>
                    </div>
                    <ChevronRight size={16} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2: Collections */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #162923', padding: '24px', boxShadow: '0 4px 16px rgba(22,41,35,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '12px', borderBottom: '2px solid #F0ECE4' }}>
              <Sparkles size={22} color="#C9A84C" />
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162923', margin: 0 }}>
                Royal Collections
              </h2>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {INITIAL_COLLECTIONS.filter(c => filterItem(c.title) || filterItem(c.description)).map((col) => (
                <li key={col.id}>
                  <Link
                    href={`/collections`}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: '10px', textDecoration: 'none', color: '#162923', background: '#F8F6F3', transition: 'all 0.2s' }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#162923';
                      e.currentTarget.style.color = '#C9A84C';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#F8F6F3';
                      e.currentTarget.style.color = '#162923';
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '14px', display: 'block' }}>{col.title}</strong>
                      <span style={{ fontSize: '11px', opacity: 0.8 }}>{col.price_range_label}</span>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', background: 'rgba(201, 168, 76, 0.2)', padding: '3px 8px', borderRadius: '4px' }}>
                      {col.tier}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Masterpiece Prince Coats & Blazers */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #162923', padding: '24px', boxShadow: '0 4px 16px rgba(22,41,35,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '12px', borderBottom: '2px solid #F0ECE4' }}>
              <Layers size={22} color="#C9A84C" />
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162923', margin: 0 }}>
                Masterpiece Garments
              </h2>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {INITIAL_PRODUCTS.filter(p => filterItem(p.title) || filterItem(p.description)).map((prod) => (
                <li key={prod.id}>
                  <Link
                    href={`/shop/${prod.slug}`}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '10px', textDecoration: 'none', color: '#162923', background: '#F8F6F3', transition: 'all 0.2s' }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#162923';
                      e.currentTarget.style.color = '#C9A84C';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#F8F6F3';
                      e.currentTarget.style.color = '#162923';
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '13px', display: 'block' }}>{prod.title}</strong>
                      <span style={{ fontSize: '11px', opacity: 0.8 }}>£{prod.base_price_gbp.toFixed(2)} · {prod.acf_meta?.embroidery_hours || 100}h needlework</span>
                    </div>
                    <ChevronRight size={16} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: The Daroodi Style Journal */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #162923', padding: '24px', boxShadow: '0 4px 16px rgba(22,41,35,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '12px', borderBottom: '2px solid #F0ECE4' }}>
              <BookOpen size={22} color="#C9A84C" />
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162923', margin: 0 }}>
                The Daroodi Journal
              </h2>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {INITIAL_JOURNAL_POSTS.filter(j => filterItem(j.title) || filterItem(j.excerpt)).map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/journal/${post.slug}`}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '10px', textDecoration: 'none', color: '#162923', background: '#F8F6F3', transition: 'all 0.2s' }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#162923';
                      e.currentTarget.style.color = '#C9A84C';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#F8F6F3';
                      e.currentTarget.style.color = '#162923';
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '13px', display: 'block' }}>{post.title}</strong>
                      <span style={{ fontSize: '11px', opacity: 0.8 }}>{post.read_time_minutes || 5} min read · {post.author || 'Atelier'}</span>
                    </div>
                    <ChevronRight size={16} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 5: Customer Care & Policies */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #162923', padding: '24px', boxShadow: '0 4px 16px rgba(22,41,35,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '12px', borderBottom: '2px solid #F0ECE4' }}>
              <ShieldCheck size={22} color="#C9A84C" />
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162923', margin: 0 }}>
                Customer Care &amp; Guarantees
              </h2>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { title: 'Bespoke Perfect-Fit Guarantee', url: '/custom-order', desc: 'Complimentary alterations and re-drafting support' },
                { title: 'Global DHL Express Delivery', url: '/track-order', desc: 'Fully-insured tracked international dispatch' },
                { title: 'Atelier Care & Preservation', url: '/journal/bespoke-sizing-and-measurement-guide', desc: 'Museum-grade archival storage recommendations' },
                { title: 'Privacy Policy & Terms of Service', url: '/our-heritage', desc: 'GDPR compliance and bespoke client confidentiality' },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.url}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '10px', textDecoration: 'none', color: '#162923', background: '#F8F6F3', transition: 'all 0.2s' }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#162923';
                      e.currentTarget.style.color = '#C9A84C';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#F8F6F3';
                      e.currentTarget.style.color = '#162923';
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '13px', display: 'block' }}>{item.title}</strong>
                      <span style={{ fontSize: '11px', opacity: 0.8 }}>{item.desc}</span>
                    </div>
                    <ChevronRight size={16} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </main>

    </div>
  );
}
