'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Ruler, Sparkles, CheckCircle2, Scissors, ArrowRight } from 'lucide-react';

export default function SizeGuidePage() {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  const sizeTable = [
    { size: '36 (XS)', chestIn: '36"', chestCm: '91 cm', shoulderIn: '17.0"', shoulderCm: '43 cm', sleeveIn: '24.5"', sleeveCm: '62 cm', lengthIn: '29.0"', lengthCm: '74 cm' },
    { size: '38 (S)', chestIn: '38"', chestCm: '96 cm', shoulderIn: '17.5"', shoulderCm: '44.5 cm', sleeveIn: '25.0"', sleeveCm: '63.5 cm', lengthIn: '29.5"', lengthCm: '75 cm' },
    { size: '40 (M)', chestIn: '40"', chestCm: '101 cm', shoulderIn: '18.0"', shoulderCm: '46 cm', sleeveIn: '25.5"', sleeveCm: '65 cm', lengthIn: '30.0"', lengthCm: '76 cm' },
    { size: '42 (L)', chestIn: '42"', chestCm: '106 cm', shoulderIn: '18.5"', shoulderCm: '47 cm', sleeveIn: '26.0"', sleeveCm: '66 cm', lengthIn: '30.5"', lengthCm: '77.5 cm' },
    { size: '44 (XL)', chestIn: '44"', chestCm: '112 cm', shoulderIn: '19.0"', shoulderCm: '48.5 cm', sleeveIn: '26.5"', sleeveCm: '67 cm', lengthIn: '31.0"', lengthCm: '79 cm' },
    { size: '46 (2XL)', chestIn: '46"', chestCm: '117 cm', shoulderIn: '19.5"', shoulderCm: '49.5 cm', sleeveIn: '27.0"', sleeveCm: '68.5 cm', lengthIn: '31.5"', lengthCm: '80 cm' },
    { size: '48 (3XL)', chestIn: '48"', chestCm: '122 cm', shoulderIn: '20.0"', shoulderCm: '51 cm', sleeveIn: '27.5"', sleeveCm: '70 cm', lengthIn: '32.0"', lengthCm: '81 cm' },
  ];

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', color: '#162923' }}>

      <section style={{ background: 'linear-gradient(135deg, #162923 0%, #1F3B33 100%)', color: '#FFFFFF', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#C9A84C', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Atelier Sartorial Standards
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '38px', fontWeight: 700, margin: '0 0 12px', color: '#FFFFFF' }}>
            Bespoke Size Guide &amp; Measurement Guide
          </h1>
          <p style={{ fontSize: '14px', color: '#E8D5A8', margin: 0, lineHeight: 1.6 }}>
            Every Daroodi coat is tailored to millimeter precision. Use our standard size reference or choose bespoke custom measurements for guaranteed perfection.
          </p>
        </div>
      </section>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 20px 80px' }}>
        
        {/* Toggle & Table */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#162923', margin: 0 }}>
            Standard Garment Dimensions
          </h2>

          <div style={{ display: 'flex', border: '1.5px solid #162923', borderRadius: '50px', overflow: 'hidden' }}>
            <button
              onClick={() => setUnit('inches')}
              style={{ padding: '8px 18px', border: 'none', background: unit === 'inches' ? '#162923' : '#fff', color: unit === 'inches' ? '#C9A84C' : '#162923', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
            >
              Inches (in)
            </button>
            <button
              onClick={() => setUnit('cm')}
              style={{ padding: '8px 18px', border: 'none', background: unit === 'cm' ? '#162923' : '#fff', color: unit === 'cm' ? '#C9A84C' : '#162923', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1.5px solid #162923', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(22,41,35,0.04)', marginBottom: '48px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8F6F3', borderBottom: '2px solid #E5E0D8' }}>
                <th style={{ padding: '14px 18px' }}>UK / US Size</th>
                <th style={{ padding: '14px 18px' }}>Chest Measurement</th>
                <th style={{ padding: '14px 18px' }}>Shoulder Width</th>
                <th style={{ padding: '14px 18px' }}>Sleeve Length</th>
                <th style={{ padding: '14px 18px' }}>Jacket Length</th>
              </tr>
            </thead>
            <tbody>
              {sizeTable.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F0ECE4' }}>
                  <td style={{ padding: '14px 18px' }}><strong>{row.size}</strong></td>
                  <td style={{ padding: '14px 18px' }}>{unit === 'inches' ? row.chestIn : row.chestCm}</td>
                  <td style={{ padding: '14px 18px' }}>{unit === 'inches' ? row.shoulderIn : row.shoulderCm}</td>
                  <td style={{ padding: '14px 18px' }}>{unit === 'inches' ? row.sleeveIn : row.sleeveCm}</td>
                  <td style={{ padding: '14px 18px' }}>{unit === 'inches' ? row.lengthIn : row.lengthCm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* How to Measure Step-by-Step */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#162923', marginBottom: '20px', textAlign: 'center' }}>
            How to Measure Your Body in 4 Steps
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#F8F6F3', padding: '24px', borderRadius: '16px', border: '1px solid #E5E0D8' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#162923', color: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', marginBottom: '12px' }}>1</span>
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px' }}>Chest Circumference</h3>
              <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.5, margin: 0 }}>
                Wrap measuring tape horizontally under armpits across the fullest part of the chest. Keep arms relaxed at sides.
              </p>
            </div>

            <div style={{ background: '#F8F6F3', padding: '24px', borderRadius: '16px', border: '1px solid #E5E0D8' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#162923', color: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', marginBottom: '12px' }}>2</span>
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px' }}>Shoulder Width</h3>
              <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.5, margin: 0 }}>
                Measure across upper back from the tip of the left shoulder bone horizontally to the right shoulder bone.
              </p>
            </div>

            <div style={{ background: '#F8F6F3', padding: '24px', borderRadius: '16px', border: '1px solid #E5E0D8' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#162923', color: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', marginBottom: '12px' }}>3</span>
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px' }}>Sleeve Length</h3>
              <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.5, margin: 0 }}>
                From shoulder bone tip down along the outside of slightly bent arm to the base of the thumb wrist.
              </p>
            </div>

            <div style={{ background: '#F8F6F3', padding: '24px', borderRadius: '16px', border: '1px solid #E5E0D8' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#162923', color: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', marginBottom: '12px' }}>4</span>
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px' }}>Jacket Length</h3>
              <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.5, margin: 0 }}>
                From the base of the back collar seam vertically straight down to desired hemline (typically lower knuckle).
              </p>
            </div>
          </div>
        </section>

        {/* Bespoke Custom Sizing CTA */}
        <section style={{ background: 'linear-gradient(135deg, #162923 0%, #1F3B33 100%)', color: '#fff', padding: '36px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#C9A84C', margin: '0 0 6px' }}>
              Require a Bespoke Custom Fit?
            </h3>
            <p style={{ fontSize: '13px', color: '#E8D5A8', margin: 0, maxWidth: '540px', lineHeight: 1.5 }}>
              Enter your exact custom measurements when placing an order or consult with our master pattern cutters via video call.
            </p>
          </div>
          <Link
            href="/custom-order"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '50px', background: '#C9A84C', color: '#162923', fontWeight: 800, fontSize: '13px', textDecoration: 'none' }}
          >
            Submit Custom Measurements <ArrowRight size={16} />
          </Link>
        </section>

      </main>

    </div>
  );
}
