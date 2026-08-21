'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, MessageCircle, ArrowRight, ShieldCheck, Clock, PhoneCall } from 'lucide-react';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'custom_order';
  const orderId = searchParams.get('id') || `DAR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const isBulk = type === 'bulk_enquiry';

  const heading = isBulk
    ? 'Thank You for Your Event Enquiry!'
    : 'Your Custom Bespoke Order Has Been Received!';

  const subheading = isBulk
    ? 'We have received your group order enquiry and our bespoke events concierge will get back to you within 24 hours with a detailed quotation and fabric swatches.'
    : 'Thank you for choosing Daroodi. Our master atelier will review your measurements, draft your dedicated paper pattern, and begin hand-crafting your garment.';

  const whatsappMsg = isBulk
    ? `Hi Daroodi! I just submitted a bulk/event enquiry (#${orderId}). I would like to discuss further details.`
    : `Hi Daroodi! I just submitted a custom bespoke order (#${orderId}). I would like to discuss my measurement details.`;

  const whatsappUrl = `https://wa.me/923001215532?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div style={{ maxWidth: '680px', margin: '60px auto 100px', padding: '0 20px', textAlign: 'center' }}>
      <div
        style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-xl)',
          padding: '50px 30px',
          border: '1px solid var(--cream-300)',
          boxShadow: 'var(--shadow-3d-card)',
        }}
      >
        {/* Animated Check Emblem */}
        <div
          style={{
            width: '88px',
            height: '88px',
            margin: '0 auto 24px',
            background: 'var(--green-700)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gold-500)',
            boxShadow: '0 10px 30px rgba(27, 94, 32, 0.3)',
          }}
        >
          <CheckCircle size={48} />
        </div>

        <h1 style={{ fontSize: '2rem', color: 'var(--green-900)', marginBottom: '12px', fontWeight: 800 }}>
          {heading}
        </h1>

        <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '28px' }}>
          {subheading}
        </p>

        {/* Reference Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--cream-50)',
            border: '1px solid var(--cream-300)',
            borderRadius: '50px',
            padding: '10px 24px',
            marginBottom: '32px',
          }}
        >
          <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
            {isBulk ? 'Enquiry Reference:' : 'Order Reference:'}
          </span>
          <strong style={{ fontSize: '1.05rem', color: 'var(--green-900)' }}>#{orderId}</strong>
        </div>

        {/* What Happens Next Timeline */}
        <div style={{ textAlign: 'left', background: 'var(--cream-50)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--cream-300)', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--green-900)', marginBottom: '16px', fontWeight: 700 }}>
            What Happens Next:
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: 'var(--slate-700)' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Clock size={18} color="var(--green-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Within 24 Hours:</strong> Our design team reviews your specifications and measurements.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <PhoneCall size={18} color="var(--green-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>WhatsApp / Phone Consultation:</strong> We confirm fabric swatch preferences and sizing nuances.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <ShieldCheck size={18} color="var(--green-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Atelier Handcrafting:</strong> Master artisans begin hand bullion zardozi needlework.
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Direct Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'center', background: '#25D366', color: '#fff', border: 'none' }}
          >
            <MessageCircle size={20} /> Chat with Us on WhatsApp
          </a>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/track-order" className="btn-3d-secondary" style={{ flex: 1, padding: '12px', fontSize: '0.9rem', justifyContent: 'center' }}>
              Track Tailoring Status
            </Link>
            <Link href="/" className="btn-3d-secondary" style={{ flex: 1, padding: '12px', fontSize: '0.9rem', justifyContent: 'center' }}>
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading confirmation...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
