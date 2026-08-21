'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageSquare } from 'lucide-react';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'ordering',
      q: 'How does the bespoke custom order process work?',
      a: 'You can either select a catalog silhouette from our shop or submit inspiration references via /custom-order. After you provide standard sizing or custom body measurements, our master pattern cutters draft a dedicated 3D pattern profile before our artisans begin stretching velvet on traditional wooden Karchob looms.',
    },
    {
      category: 'ordering',
      q: 'What is the production lead time for a bespoke coat?',
      a: 'Bespoke hand-embroidered coats typically require 3–4 weeks for complete artisanal execution and canvas construction. Ready-to-ship catalog sizes dispatch within 24–48 hours.',
    },
    {
      category: 'craft',
      q: 'What materials and embroidery threads are used?',
      a: 'We use genuine metallic 24k gold and silver plated dabka coils, bullion wire, French sequins, pure silk resham threads, and imported 520 GSM Italian silk velvet canvas with pure Bemberg cupro linings.',
    },
    {
      category: 'craft',
      q: 'How should I care for and store my velvet embroidered garment?',
      a: 'Store your garment in the provided breathable archival cotton garment bag away from direct moisture and sunlight. Never machine wash or iron directly over zardozi bullion. Specialist dry clean only with luxury garment care experts.',
    },
    {
      category: 'sizing',
      q: 'What if my bespoke garment does not fit perfectly?',
      a: 'Every piece is covered by the Daroodi Perfect-Fit Guarantee. We provide complimentary local alteration credits up to £75 or complimentary return courier service for atelier fine-tuning.',
    },
    {
      category: 'shipping',
      q: 'Which countries do you ship to and how long does transit take?',
      a: 'We ship to over 40 countries including the United Kingdom, UAE, United States, Canada, Australia, and throughout Europe via fully-insured DHL Express (3–5 business days transit).',
    },
    {
      category: 'bulk',
      q: 'Do you create ceremonial regalia, masonic uniforms, and graduation robes?',
      a: 'Yes, our atelier produces custom heraldic insignia, chancellory robes, and fraternal regalia for institutions, orders, and dignitaries worldwide. Visit /bulk-events or contact bulk@daroodi.com.',
    },
  ];

  const filteredFaqs = faqs.filter(f => {
    const matchesCat = activeCategory === 'all' || f.category === activeCategory;
    const matchesSearch = !searchQuery || f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', color: '#162923' }}>
      <Header />

      <section style={{ background: 'linear-gradient(135deg, #162923 0%, #1F3B33 100%)', color: '#FFFFFF', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#C9A84C', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Daroodi Concierge Knowledgebase
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '38px', fontWeight: 700, margin: '0 0 12px', color: '#FFFFFF' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: '14px', color: '#E8D5A8', margin: '0 auto 24px', maxWidth: '560px', lineHeight: 1.6 }}>
            Everything you need to know about our bespoke ordering process, hand needlework, sizing algorithms, and global delivery.
          </p>

          <div style={{ maxWidth: '480px', margin: '0 auto', position: 'relative' }}>
            <Search size={18} color="#C9A84C" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '14px 16px 14px 46px', borderRadius: '50px', border: '1.5px solid #C9A84C', background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
            />
          </div>
        </div>
      </section>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 20px 80px' }}>
        
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'ordering', label: 'Bespoke Ordering' },
            { id: 'craft', label: 'Craftsmanship & Care' },
            { id: 'sizing', label: 'Sizing & Fit' },
            { id: 'shipping', label: 'Shipping & Delivery' },
            { id: 'bulk', label: 'Bulk & Regalia' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{ padding: '8px 16px', borderRadius: '50px', border: '1.5px solid #162923', background: activeCategory === cat.id ? '#162923' : '#fff', color: activeCategory === cat.id ? '#C9A84C' : '#162923', fontWeight: 700, fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} style={{ background: '#FFFFFF', border: '1.5px solid #162923', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(22,41,35,0.03)' }}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  style={{ width: '100%', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isOpen ? '#F8F6F3' : '#fff', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                >
                  <strong style={{ fontSize: '15px', color: '#162923', lineHeight: 1.4 }}>{faq.q}</strong>
                  {isOpen ? <ChevronUp size={20} color="#162923" /> : <ChevronDown size={20} color="#162923" />}
                </button>
                {isOpen && (
                  <div style={{ padding: '18px 22px', fontSize: '13px', color: '#444', lineHeight: 1.7, borderTop: '1px solid #E5E0D8', background: '#FFFFFF' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Direct WhatsApp Concierge CTA */}
        <div style={{ marginTop: '48px', background: '#F8F6F3', padding: '32px', borderRadius: '20px', border: '1px solid #E5E0D8', textAlign: 'center' }}>
          <MessageSquare size={32} color="#162923" style={{ margin: '0 auto 10px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#162923', margin: '0 0 6px' }}>Have a Specific Styling or Measurement Question?</h3>
          <p style={{ fontSize: '13px', color: '#666', margin: '0 auto 18px', maxWidth: '480px' }}>
            Speak directly with our Lahore Atelier Master Tailors via WhatsApp or arrange a video consultation.
          </p>
          <a
            href="https://wa.me/923001215532?text=Hi%20Daroodi%20Atelier!%20I%20have%20a%20question%20about%20a%20bespoke%20order."
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '50px', background: '#162923', color: '#C9A84C', fontWeight: 800, fontSize: '13px', textDecoration: 'none' }}
          >
            Chat with Master Tailor on WhatsApp
          </a>
        </div>

      </main>

      <Footer />
    </div>
  );
}
