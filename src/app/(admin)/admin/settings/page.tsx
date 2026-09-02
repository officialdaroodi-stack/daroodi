'use client';

import React, { useEffect, useState } from 'react';
import { getTrackingSettings, saveTrackingSettings } from '@/lib/db/settings';
import { TrackingSettings } from '@/lib/types';
import {
  BarChart3,
  Music2,
  Code2,
  Save,
  CheckCircle,
  Plug,
} from 'lucide-react';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid #E5E0D8',
  fontSize: '13px',
  fontFamily: 'monospace',
};

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #E5E0D8',
  borderRadius: '16px',
  padding: '22px',
  marginBottom: '18px',
};

const badge = (active: boolean): React.CSSProperties => ({
  fontSize: '10px',
  fontWeight: 800,
  padding: '3px 10px',
  borderRadius: '20px',
  background: active ? '#E8F5E9' : '#F4F1EA',
  color: active ? '#1B5E20' : '#999',
  border: `1px solid ${active ? '#C8E6C9' : '#E5E0D8'}`,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<TrackingSettings>({
    ga4_measurement_id: '',
    gtm_container_id: '',
    meta_pixel_id: '',
    tiktok_pixel_id: '',
    custom_head_scripts: '',
    custom_body_scripts: '',
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrackingSettings()
      .then((s) => {
        setSettings(s);
      })
      .catch((err) => {
        console.error('Failed to load tracking settings:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveTrackingSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const set = (key: keyof TrackingSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setSettings((prev) => ({ ...prev, [key]: e.target.value }));

  if (loading) return <div style={{ padding: '40px' }}>Loading settings…</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#162923', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Plug size={24} /> Settings — Tracking &amp; Integrations
        </h1>
        <p style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>
          Install Google Analytics, Google Tag Manager, Meta (Facebook) Pixel and TikTok Pixel — exactly like adding plugins in WordPress. Scripts go live on the storefront immediately after saving.
        </p>
      </div>

      <form onSubmit={handleSave}>
        {/* Google */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#162923', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={18} color="#C9A84C" /> Google
            </h2>
            <span style={badge(!!(settings.ga4_measurement_id || settings.gtm_container_id))}>
              {(settings.ga4_measurement_id || settings.gtm_container_id) ? 'Installed' : 'Not installed'}
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#888', margin: '0 0 16px' }}>
            Use <strong>GTM</strong> if you manage all tags in Google Tag Manager (recommended). Otherwise paste a GA4 Measurement ID for a direct gtag.js install — if both are set, GTM wins to avoid double counting.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>GA4 Measurement ID</label>
              <input type="text" placeholder="G-XXXXXXXXXX" value={settings.ga4_measurement_id || ''} onChange={set('ga4_measurement_id')} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Google Tag Manager Container ID</label>
              <input type="text" placeholder="GTM-XXXXXXX" value={settings.gtm_container_id || ''} onChange={set('gtm_container_id')} style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Meta */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#162923', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#1877F2', fontSize: '18px', fontWeight: 800 }}>f</span> Meta (Facebook &amp; Instagram) Pixel
            </h2>
            <span style={badge(!!settings.meta_pixel_id)}>{settings.meta_pixel_id ? 'Installed' : 'Not installed'}</span>
          </div>
          <p style={{ fontSize: '12px', color: '#888', margin: '0 0 16px' }}>
            Fires <code>PageView</code>, <code>ViewContent</code>, <code>AddToCart</code>, <code>InitiateCheckout</code> and <code>Purchase</code> automatically.
          </p>
          <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Pixel ID</label>
          <input type="text" placeholder="e.g. 1234567890123456" value={settings.meta_pixel_id || ''} onChange={set('meta_pixel_id')} style={{ ...inputStyle, maxWidth: '420px' }} />
        </div>

        {/* TikTok */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#162923', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Music2 size={18} color="#000" /> TikTok Pixel
            </h2>
            <span style={badge(!!settings.tiktok_pixel_id)}>{settings.tiktok_pixel_id ? 'Installed' : 'Not installed'}</span>
          </div>
          <p style={{ fontSize: '12px', color: '#888', margin: '0 0 16px' }}>
            Fires <code>Browse</code>, <code>ViewContent</code>, <code>AddToCart</code>, <code>InitiateCheckout</code> and <code>CompletePayment</code> automatically.
          </p>
          <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Pixel ID</label>
          <input type="text" placeholder="e.g. C4A5B6C7D8E9F0G1H2I3" value={settings.tiktok_pixel_id || ''} onChange={set('tiktok_pixel_id')} style={{ ...inputStyle, maxWidth: '420px' }} />
        </div>

        {/* Custom code */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#162923', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code2 size={18} color="#162923" /> Custom Code Injection
          </h2>
          <p style={{ fontSize: '12px', color: '#888', margin: '0 0 16px' }}>
            Paste any third-party snippet (Hotjar, Klaviyo, Pinterest Tag, live-chat widgets, verification meta tags…). Raw HTML is allowed.
          </p>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Inject into <code>&lt;head&gt;</code>
            </label>
            <textarea
              rows={4}
              placeholder={'<script>…</script>\n<meta name="google-site-verification" content="…" />'}
              value={settings.custom_head_scripts || ''}
              onChange={set('custom_head_scripts')}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Inject before <code>&lt;/body&gt;</code>
            </label>
            <textarea
              rows={4}
              placeholder={'<script>…</script>'}
              value={settings.custom_body_scripts || ''}
              onChange={set('custom_body_scripts')}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="submit"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#162923', color: '#C9A84C', border: '1px solid #C9A84C', padding: '12px 28px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}
          >
            <Save size={15} /> Save &amp; Publish Integrations
          </button>
          {saved && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1B5E20', fontSize: '13px', fontWeight: 700 }}>
              <CheckCircle size={16} /> Live on the storefront now
            </span>
          )}
        </div>

        {settings.updated_at && (
          <p style={{ fontSize: '11px', color: '#999', marginTop: '14px' }}>
            Last updated: {new Date(settings.updated_at).toLocaleString()}
          </p>
        )}
      </form>
    </div>
  );
}
