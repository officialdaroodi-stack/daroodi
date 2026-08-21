'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, User, Scissors, Ruler, CheckCircle, ArrowRight, ArrowLeft, MessageCircle } from 'lucide-react';

export default function CustomOrderWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Contact & Event
  const [contactData, setContactData] = useState({
    fullName: '',
    email: '',
    phone: '',
    eventDate: '',
    location: '',
  });

  // Step 2: Garment Preferences
  const [garmentData, setGarmentData] = useState({
    garmentType: 'Prince Coat',
    tier: 'Platinum Collection (£1,450+)',
    color: 'Imperial Emerald',
    fabric: 'Italian Velvet & Mulberry Silk',
    budget: '£1,000 - £2,000',
  });

  // Step 3: Measurements
  const [sizingType, setSizingType] = useState<'standard' | 'custom'>('custom');
  const [standardSize, setStandardSize] = useState('M');
  const [measurements, setMeasurements] = useState({
    chest: 40,
    shoulder: 18,
    sleeve: 25,
    jacketLength: 30,
    neck: 16,
    waist: 34,
    hips: 40,
    height: "6'0\"",
    weight: 80,
    fit: 'tailored',
  });

  // Step 4: Notes & Reference
  const [specialNotes, setSpecialNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = Math.floor(100000 + Math.random() * 900000);
    router.push(`/thank-you?type=custom_order&id=${orderId}`);
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 20px 100px', color: 'var(--black)' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0 0 10px', color: 'var(--green-900)' }}>
          Design Your <span style={{ color: 'var(--gold-500)' }}>Bespoke</span> Garment
        </h1>
        <p style={{ color: 'var(--slate-600)', fontSize: '1rem', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
          Experience true slow luxury. Complete our bespoke consultation wizard and our master atelier will draft your personal paper pattern.
        </p>
      </div>

      {/* 4-Step Progress Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '40px' }}>
        {[
          { step: 1, label: 'Contact' },
          { step: 2, label: 'Silhouette' },
          { step: 3, label: 'Measurements' },
          { step: 4, label: 'Review' },
        ].map((s) => (
          <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: currentStep >= s.step ? 'var(--green-700)' : 'var(--cream-200)',
                color: currentStep >= s.step ? '#fff' : 'var(--slate-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {s.step}
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: currentStep >= s.step ? 'var(--green-900)' : 'var(--slate-400)' }}>
              {s.label}
            </span>
            {s.step < 4 && <span style={{ color: 'var(--slate-300)', margin: '0 4px' }}>—</span>}
          </div>
        ))}
      </div>

      {/* Step Form Container */}
      <div
        style={{
          background: 'var(--white)',
          border: '1px solid var(--cream-300)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px 30px',
          boxShadow: 'var(--shadow-3d-card)',
        }}
      >
        {/* STEP 1: Contact Details */}
        {currentStep === 1 && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--green-900)', marginBottom: '20px' }}>
              Step 1: Contact & Event Details
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alexander Hamilton"
                  value={contactData.fullName}
                  onChange={(e) => setContactData({ ...contactData, fullName: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. alexander@example.com"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +44 7911 123456"
                    value={contactData.phone}
                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>Event Date (Optional)</label>
                  <input
                    type="date"
                    value={contactData.eventDate}
                    onChange={(e) => setContactData({ ...contactData, eventDate: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>Delivery City / Country</label>
                  <input
                    type="text"
                    placeholder="e.g. London, United Kingdom"
                    value={contactData.location}
                    onChange={(e) => setContactData({ ...contactData, location: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="btn-3d-primary"
                style={{ padding: '12px 24px' }}
              >
                Proceed to Silhouette Choice <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Silhouette & Fabric */}
        {currentStep === 2 && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--green-900)', marginBottom: '20px' }}>
              Step 2: Garment Silhouette & Craft Tier
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>Garment Silhouette</label>
                <select
                  value={garmentData.garmentType}
                  onChange={(e) => setGarmentData({ ...garmentData, garmentType: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px', background: 'var(--cream-50)' }}
                >
                  <option>Prince Coat</option>
                  <option>Royal Sherwani</option>
                  <option>Embroidered Tuxedo / Blazer</option>
                  <option>Brocade Waistcoat & Kurta</option>
                  <option>Full Bridal/Groom Ensemble</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>Embroidery Craft Tier</label>
                  <select
                    value={garmentData.tier}
                    onChange={(e) => setGarmentData({ ...garmentData, tier: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px', background: 'var(--cream-50)' }}
                  >
                    <option>Platinum Collection (£1,450+) - 140 Hours Zari</option>
                    <option>Gold Heritage Tier (£980+) - 90 Hours Zari</option>
                    <option>Silver Classic (£750+) - 50 Hours Zari</option>
                    <option>Atelier Essentials (£380+) - Modern Structured</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>Fabric Canvas</label>
                  <select
                    value={garmentData.fabric}
                    onChange={(e) => setGarmentData({ ...garmentData, fabric: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px', background: 'var(--cream-50)' }}
                  >
                    <option>Italian Micro-Velvet & Silk</option>
                    <option>Raw Mulberry Silk</option>
                    <option>Banarasi Metallic Brocade</option>
                    <option>Super 130s Pure Wool</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>Color Palette</label>
                <select
                  value={garmentData.color}
                  onChange={(e) => setGarmentData({ ...garmentData, color: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px', background: 'var(--cream-50)' }}
                >
                  <option>Imperial Emerald Green</option>
                  <option>Midnight Royal Navy</option>
                  <option>Burgundy Wine</option>
                  <option>Obsidian Black</option>
                  <option>Ivory & Metallic Gold</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="btn-3d-secondary"
                style={{ padding: '12px 20px' }}
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="btn-3d-primary"
                style={{ padding: '12px 24px' }}
              >
                Proceed to Measurements <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Measurements */}
        {currentStep === 3 && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--green-900)', marginBottom: '20px' }}>
              Step 3: Master Cutter Measurements
            </h2>

            {/* Sizing Toggle */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              <button
                type="button"
                onClick={() => setSizingType('custom')}
                className={sizingType === 'custom' ? 'btn-3d-primary' : 'btn-3d-secondary'}
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                ✨ Custom Tailored Measurements (Recommended)
              </button>
              <button
                type="button"
                onClick={() => setSizingType('standard')}
                className={sizingType === 'standard' ? 'btn-3d-primary' : 'btn-3d-secondary'}
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                Standard Sizing (XS - 3XL)
              </button>
            </div>

            {sizingType === 'standard' ? (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setStandardSize(sz)}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '8px',
                      border: standardSize === sz ? '2px solid var(--green-700)' : '1px solid var(--cream-300)',
                      background: standardSize === sz ? 'var(--green-50)' : '#fff',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Chest (in)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={measurements.chest}
                    onChange={(e) => setMeasurements({ ...measurements, chest: parseFloat(e.target.value) })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--cream-300)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Shoulder (in)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={measurements.shoulder}
                    onChange={(e) => setMeasurements({ ...measurements, shoulder: parseFloat(e.target.value) })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--cream-300)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Sleeve (in)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={measurements.sleeve}
                    onChange={(e) => setMeasurements({ ...measurements, sleeve: parseFloat(e.target.value) })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--cream-300)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Length (in)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={measurements.jacketLength}
                    onChange={(e) => setMeasurements({ ...measurements, jacketLength: parseFloat(e.target.value) })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--cream-300)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Waist (in)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={measurements.waist}
                    onChange={(e) => setMeasurements({ ...measurements, waist: parseFloat(e.target.value) })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--cream-300)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Hips (in)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={measurements.hips}
                    onChange={(e) => setMeasurements({ ...measurements, hips: parseFloat(e.target.value) })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--cream-300)' }}
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="btn-3d-secondary"
                style={{ padding: '12px 20px' }}
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="btn-3d-primary"
                style={{ padding: '12px 24px' }}
              >
                Review & Confirm <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Final Submission */}
        {currentStep === 4 && (
          <form onSubmit={handleSubmit}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--green-900)', marginBottom: '20px' }}>
              Step 4: Review Your Bespoke Specifications
            </h2>

            <div style={{ background: 'var(--cream-50)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-300)', marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.9rem' }}>
                <div><strong>Client:</strong> {contactData.fullName || 'Guest'}</div>
                <div><strong>WhatsApp:</strong> {contactData.phone || 'N/A'}</div>
                <div><strong>Garment:</strong> {garmentData.garmentType}</div>
                <div><strong>Tier:</strong> {garmentData.tier}</div>
                <div><strong>Color & Fabric:</strong> {garmentData.color} ({garmentData.fabric})</div>
                <div>
                  <strong>Sizing:</strong> {sizingType === 'custom' ? `${measurements.chest}" C / ${measurements.shoulder}" S` : `Standard ${standardSize}`}
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>
                Special Tailoring Notes / Embroidery Requests
              </label>
              <textarea
                rows={3}
                placeholder="Any special sleeve ease, monogram embroidery initials, collar preference..."
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--cream-300)', marginTop: '4px' }}
              ></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="btn-3d-secondary"
                style={{ padding: '12px 20px' }}
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="submit"
                className="btn-3d-primary"
                style={{ padding: '14px 28px', fontSize: '1rem' }}
              >
                Submit Bespoke Commission <CheckCircle size={18} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
