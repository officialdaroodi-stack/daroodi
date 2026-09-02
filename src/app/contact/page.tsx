'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', color: '#162923' }}>

      <section style={{ background: 'linear-gradient(135deg, #162923 0%, #1F3B33 100%)', color: '#FFFFFF', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#C9A84C', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Atelier Concierge
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '38px', fontWeight: 700, margin: '0 0 12px', color: '#FFFFFF' }}>
            Get in Touch &amp; Private Consultation
          </h1>
          <p style={{ fontSize: '14px', color: '#E8D5A8', margin: 0, lineHeight: 1.6 }}>
            Connect with our creative director and head pattern cutters for bespoke wedding styling, custom sizing, and fraternal commissions.
          </p>
        </div>
      </section>

      <main style={{ maxWidth: '1080px', margin: '0 auto', padding: '48px 20px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px' }}>
          
          {/* Contact Details */}
          <div style={{ background: '#F8F6F3', padding: '32px', borderRadius: '20px', border: '1.5px solid #162923', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#162923', margin: '0 0 8px' }}>Lahore Flagship Atelier</h2>
              <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6, margin: 0 }}>
                Crafting royal South Asian formalwear and diplomatic regalia since 1982.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <MapPin size={20} color="#C9A84C" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div style={{ fontSize: '13px' }}>
                <strong>Atelier Address:</strong>
                <p style={{ margin: '2px 0 0', color: '#666' }}>Lahore Cultural District, Punjab, Pakistan (31.5204° N, 74.3587° E)</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Phone size={20} color="#C9A84C" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div style={{ fontSize: '13px' }}>
                <strong>Direct Telephone &amp; WhatsApp:</strong>
                <p style={{ margin: '2px 0 0', color: '#666' }}>+92 300 1215532 · +44 7440 437493</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Mail size={20} color="#C9A84C" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div style={{ fontSize: '13px' }}>
                <strong>Client Concierge Email:</strong>
                <p style={{ margin: '2px 0 0', color: '#666' }}>info@daroodi.com · bespoke@daroodi.com</p>
              </div>
            </div>

            <div style={{ marginTop: '10px', paddingTop: '16px', borderTop: '1px solid #E5E0D8' }}>
              <a
                href="https://wa.me/923001215532?text=Hello%20Daroodi%20Concierge!%20I%20would%20like%20to%20arrange%20a%20bespoke%20consultation."
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '50px', background: '#162923', color: '#C9A84C', fontWeight: 800, fontSize: '13px', textDecoration: 'none' }}
              >
                <MessageSquare size={16} /> Instant WhatsApp Consultation
              </a>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '20px', border: '1px solid #E5E0D8', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#162923', margin: '0 0 16px' }}>Send Us a Message</h2>

            {submitted ? (
              <div style={{ background: '#E8F5E9', padding: '24px', borderRadius: '14px', textAlign: 'center', color: '#1B5E20' }}>
                <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 800 }}>Inquiry Received!</h3>
                <p style={{ margin: 0, fontSize: '13px' }}>Our master tailor concierge will respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Full Name</label>
                  <input type="text" required placeholder="Lord / Sheikh / Dr. Your Name" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Email Address</label>
                    <input type="email" required placeholder="you@domain.com" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Phone / WhatsApp</label>
                    <input type="tel" required placeholder="+44 7440..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Inquiry Type</label>
                  <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8', fontSize: '13px' }}>
                    <option>Bespoke Groom &amp; Wedding Coat</option>
                    <option>Custom Made-to-Measure Blazer</option>
                    <option>Bulk Ceremonial &amp; Fraternal Regalia</option>
                    <option>Existing Order Sizing / Timeline Check</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Your Message / Event Date</label>
                  <textarea rows={4} required placeholder="Please describe your requirements, preferred colors, and upcoming event dates..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                </div>

                <button
                  type="submit"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px', borderRadius: '50px', background: '#162923', color: '#C9A84C', fontWeight: 800, fontSize: '13px', border: 'none', cursor: 'pointer', marginTop: '6px' }}
                >
                  <Send size={15} /> Send Inquiry
                </button>
              </form>
            )}
          </div>

        </div>
      </main>

    </div>
  );
}
