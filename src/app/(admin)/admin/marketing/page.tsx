'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, Users, Share2, Award, ArrowRight, Video, Copy } from 'lucide-react';

export default function MarketingOverviewPage() {
  const campaigns = [
    {
      id: 'camp-1',
      title: 'Imperial Wedding Season 2026',
      assetType: 'Video Reel + Photo Suite',
      shareUrl: 'https://daroodi.com/collections#platinum?ref=global_wedding',
      commissionBonus: '+2% Extra Gala Bonus',
    },
    {
      id: 'camp-2',
      title: 'Velvet Prince Coat Atelier Crafting',
      assetType: 'Behind-The-Scenes Documentary',
      shareUrl: 'https://daroodi.com/our-heritage?ref=craft_bts',
      commissionBonus: 'Standard 15%',
    },
  ];

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    alert(`Copied marketing link to clipboard:\n${url}`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--green-900)' }}>Marketing & Global Affiliate Hub</h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
            Empower country sales heads and regional agents with branded assets, video reels, and referral tracking.
          </p>
        </div>

        <Link href="/admin/marketing/country-managers" className="btn-3d-primary" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>
          <Users size={18} /> Manage Country Heads & Agents →
        </Link>
      </div>

      {/* Campaign Asset Center */}
      <div className="data-card">
        <div className="data-card-header">
          <h2 className="data-card-title">Live Marketing Campaigns & Video Assets</h2>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              style={{
                background: 'var(--cream-50)',
                border: '1px solid var(--cream-300)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', background: 'var(--green-900)', color: 'var(--gold-500)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase' }}>
                  {camp.assetType}
                </span>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--green-900)', margin: '6px 0 4px' }}>{camp.title}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--green-700)', fontWeight: 600 }}>{camp.commissionBonus}</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleCopy(camp.shareUrl)}
                  className="btn-3d-secondary"
                  style={{ padding: '8px 14px', fontSize: '0.82rem', gap: '6px' }}
                >
                  <Copy size={14} /> Copy Asset Link
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out Daroodi's latest bespoke collection: ${camp.shareUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-3d-primary"
                  style={{ padding: '8px 14px', fontSize: '0.82rem', gap: '6px' }}
                >
                  <Share2 size={14} /> Share on WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
