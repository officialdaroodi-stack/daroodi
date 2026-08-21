'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Users, Award, ShieldCheck, Clock, Scissors, ArrowRight, MessageCircle } from 'lucide-react';

export default function BulkEventsPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'Wedding / Groomsmen',
    quantity: '5-10 Pieces',
    eventDate: '',
    budgetPerPiece: '£500 - £1,000',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enquiryId = Math.floor(100000 + Math.random() * 900000);
    router.push(`/thank-you?type=bulk_enquiry&id=${enquiryId}`);
  };

  const whatsappUrl = `https://wa.me/923001215532?text=${encodeURIComponent(
    "Hi Daroodi! I am interested in placing a bulk/event order for groomsmen/wedding party."
  )}`;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px 80px', color: 'var(--black)' }}>
      {/* Hero */}
      <div
        style={{
          textAlign: 'center',
          padding: '60px 20px 50px',
          background: 'linear-gradient(135deg, #1B5E20 0%, #09220b 100%)',
          borderRadius: '0 0 24px 24px',
          marginBottom: '60px',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 12px', color: '#fff' }}>
          Bulk & Event Orders by <span style={{ color: 'var(--gold-500)' }}>Daroodi</span>
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
          Bespoke outfits for weddings, corporate events, and group orders. Tailored to perfection with premium fabrics and dedicated artisan support.
        </p>
      </div>

      {/* Benefits Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '70px' }}>
        <div style={{ background: '#fff', border: '1px solid var(--cream-300)', borderRadius: '14px', padding: '28px 20px', textAlign: 'center', boxShadow: 'var(--shadow-3d-card)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--green-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--green-700)' }}>
            <Award size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--green-900)' }}>Tiered Discounts</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', margin: 0, lineHeight: 1.5 }}>
            Exclusive wholesale pricing for group orders of 5 pieces or more.
          </p>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--cream-300)', borderRadius: '14px', padding: '28px 20px', textAlign: 'center', boxShadow: 'var(--shadow-3d-card)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--green-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--green-700)' }}>
            <Users size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--green-900)' }}>Dedicated Stylist</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', margin: 0, lineHeight: 1.5 }}>
            A personal designer to coordinate themes, color palettes, and fabrics.
          </p>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--cream-300)', borderRadius: '14px', padding: '28px 20px', textAlign: 'center', boxShadow: 'var(--shadow-3d-card)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--green-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--green-700)' }}>
            <Scissors size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--green-900)' }}>Custom Sizing</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', margin: 0, lineHeight: 1.5 }}>
            Individual measurement profiles for every member of your group.
          </p>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--cream-300)', borderRadius: '14px', padding: '28px 20px', textAlign: 'center', boxShadow: 'var(--shadow-3d-card)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--green-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--green-700)' }}>
            <Clock size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--green-900)' }}>Guaranteed Delivery</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', margin: 0, lineHeight: 1.5 }}>
            Prioritized production queue to ensure your outfits arrive weeks before the event.
          </p>
        </div>
      </div>

      {/* Enquiry Form */}
      <div style={{ background: '#fff', border: '1px solid var(--cream-300)', borderRadius: '20px', padding: '40px 30px', boxShadow: 'var(--shadow-3d-card)', maxWidth: '780px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--green-900)', margin: '0 0 8px' }}>
            Submit Your Event Enquiry
          </h2>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>
            Fill out the form below and our bespoke events concierge will respond within 24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Tariq Mansoor"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>Email Address *</label>
              <input
                type="email"
                required
                placeholder="e.g. tariq@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>Phone / WhatsApp Number *</label>
              <input
                type="tel"
                required
                placeholder="e.g. +44 7911 123456"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>Occasion / Event Type</label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px', background: 'var(--cream-50)' }}
              >
                <option>Wedding / Groomsmen</option>
                <option>Corporate Gala / Formal Dinner</option>
                <option>Cultural Festival / Celebration</option>
                <option>Bespoke Group Order (Family/Club)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>Estimated Quantity</label>
              <select
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px', background: 'var(--cream-50)' }}
              >
                <option>5 - 10 Pieces (10% Tier Discount)</option>
                <option>11 - 25 Pieces (15% Tier Discount)</option>
                <option>26 - 50 Pieces (20% Tier Discount)</option>
                <option>50+ Pieces (Custom Master Pricing)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>Event Date</label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>Event Details & Design Requirements</label>
            <textarea
              rows={4}
              placeholder="Tell us about the theme, desired color palette, preferred fabric, or any specific embroidery motifs..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px', fontSize: '0.9rem' }}
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '14px', marginTop: '10px', flexWrap: 'wrap' }}>
            <button
              type="submit"
              className="btn-3d-primary"
              style={{ flex: 1, padding: '14px', fontSize: '1rem', justifyContent: 'center' }}
            >
              Submit Bulk Enquiry <ArrowRight size={18} />
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-3d-secondary"
              style={{ padding: '14px 20px', fontSize: '0.95rem', gap: '6px' }}
            >
              <MessageCircle size={18} color="#25D366" /> Chat on WhatsApp
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
