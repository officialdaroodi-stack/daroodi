'use client';

import React, { useEffect, useState } from 'react';
import {
  getAnalyticsSummary,
  clearAnalyticsEvents,
  AnalyticsSummary,
} from '@/lib/analytics';
import {
  Eye,
  Users,
  MousePointerClick,
  ShoppingCart,
  CreditCard,
  PoundSterling,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Trash2,
} from 'lucide-react';

const RANGES = [
  { label: 'Today', days: 1 },
  { label: '7 Days', days: 7 },
  { label: '30 Days', days: 30 },
  { label: '90 Days', days: 90 },
];

export default function AdminAnalyticsPage() {
  const [days, setDays] = useState(30);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);

  const reload = () => setSummary(getAnalyticsSummary(days));

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const handleClear = () => {
    if (confirm('Clear ALL stored first-party analytics events? This cannot be undone.')) {
      clearAnalyticsEvents();
      reload();
    }
  };

  if (!summary) return <div style={{ padding: '40px' }}>Loading analytics…</div>;

  const maxViews = Math.max(...summary.viewsByDay.map((d) => d.views), 1);
  const totalDeviceEvents = summary.deviceBreakdown.reduce((s, d) => s + d.count, 0) || 1;

  const kpis = [
    { label: 'Page Views', value: summary.totalPageViews, icon: Eye, color: '#162923' },
    { label: 'Unique Visitors', value: summary.uniqueVisitors, icon: Users, color: '#1F3B33' },
    { label: 'Sessions', value: summary.uniqueSessions, icon: MousePointerClick, color: '#315C4F' },
    { label: 'Add to Cart', value: summary.addToCarts, icon: ShoppingCart, color: '#8A6D2B' },
    { label: 'Checkouts', value: summary.checkouts, icon: CreditCard, color: '#8A6D2B' },
    { label: 'Tracked Revenue', value: `£${summary.revenue.toLocaleString()}`, icon: PoundSterling, color: '#C9A84C' },
  ];

  const deviceIcon = (device: string) =>
    device === 'mobile' ? <Smartphone size={15} /> : device === 'tablet' ? <Tablet size={15} /> : <Monitor size={15} />;

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '22px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#162923', margin: 0 }}>
            Site Analytics &amp; Visitor Behaviour
          </h1>
          <p style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>
            First-party tracking of every storefront visit and commerce event. Install GA4 / Meta / TikTok pixels from{' '}
            <a href="/admin/settings" style={{ color: '#162923', fontWeight: 700 }}>Settings → Integrations</a>.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setDays(r.days)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #162923',
                background: days === r.days ? '#162923' : '#fff',
                color: days === r.days ? '#C9A84C' : '#162923',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              {r.label}
            </button>
          ))}
          <button
            onClick={handleClear}
            title="Clear stored events"
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #FEB2B2', background: '#FFF5F5', color: '#C53030', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Trash2 size={13} /> Reset
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background: '#fff', border: '1px solid #E5E0D8', borderRadius: '14px', padding: '16px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: k.color, marginBottom: '8px' }}>
              <k.icon size={16} />
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#777' }}>{k.label}</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#162923' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Traffic chart */}
      <div style={{ background: '#fff', border: '1px solid #E5E0D8', borderRadius: '16px', padding: '22px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#162923', margin: '0 0 16px' }}>Daily Page Views &amp; Unique Visitors</h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '150px', borderBottom: '2px solid #E5E0D8', paddingBottom: '2px' }}>
          {summary.viewsByDay.map((d) => (
            <div
              key={d.date}
              title={`${d.date}: ${d.views} views · ${d.visitors} visitors`}
              style={{
                flex: 1,
                height: `${Math.max((d.views / maxViews) * 100, 2)}%`,
                background: 'linear-gradient(180deg, #C9A84C 0%, #162923 100%)',
                borderRadius: '3px 3px 0 0',
                minWidth: '4px',
                opacity: d.views === 0 ? 0.15 : 1,
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#999', marginTop: '6px' }}>
          <span>{summary.viewsByDay[0]?.date}</span>
          <span>{summary.viewsByDay[summary.viewsByDay.length - 1]?.date}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px', marginBottom: '24px' }}>
        {/* Top pages */}
        <div style={{ background: '#fff', border: '1px solid #E5E0D8', borderRadius: '16px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#162923', margin: '0 0 14px' }}>Top Pages</h3>
          {summary.topPages.length === 0 && <p style={{ color: '#999', fontSize: '13px' }}>No page views recorded yet.</p>}
          {summary.topPages.map((p) => (
            <div key={p.path} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #F4F1EA', fontSize: '13px' }}>
              <span style={{ color: '#162923', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>{p.path}</span>
              <strong style={{ color: '#8A6D2B' }}>{p.views}</strong>
            </div>
          ))}
        </div>

        {/* Referrers */}
        <div style={{ background: '#fff', border: '1px solid #E5E0D8', borderRadius: '16px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#162923', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={15} /> Traffic Sources
          </h3>
          {summary.topReferrers.length === 0 && <p style={{ color: '#999', fontSize: '13px' }}>No traffic recorded yet.</p>}
          {summary.topReferrers.map((r) => (
            <div key={r.source} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #F4F1EA', fontSize: '13px' }}>
              <span style={{ color: '#162923', fontWeight: 600 }}>{r.source}</span>
              <strong style={{ color: '#8A6D2B' }}>{r.visits}</strong>
            </div>
          ))}
        </div>

        {/* Devices & browsers */}
        <div style={{ background: '#fff', border: '1px solid #E5E0D8', borderRadius: '16px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#162923', margin: '0 0 14px' }}>Devices &amp; Browsers</h3>
          {summary.deviceBreakdown.map((d) => (
            <div key={d.device} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#162923', textTransform: 'capitalize' }}>
                  {deviceIcon(d.device)} {d.device}
                </span>
                <span style={{ color: '#777' }}>{Math.round((d.count / totalDeviceEvents) * 100)}%</span>
              </div>
              <div style={{ height: '7px', background: '#F4F1EA', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(d.count / totalDeviceEvents) * 100}%`, height: '100%', background: '#C9A84C' }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F4F1EA' }}>
            {summary.browserBreakdown.slice(0, 4).map((b) => (
              <div key={b.browser} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '4px 0', color: '#555' }}>
                <span>{b.browser}</span>
                <strong>{b.count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live event feed */}
      <div style={{ background: '#fff', border: '1px solid #E5E0D8', borderRadius: '16px', padding: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#162923', margin: '0 0 14px' }}>
          Recent Events <span style={{ color: '#999', fontWeight: 500, fontSize: '12px' }}>(latest {summary.recentEvents.length})</span>
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#999', borderBottom: '1px solid #E5E0D8' }}>
                <th style={{ padding: '8px 10px' }}>Time</th>
                <th style={{ padding: '8px 10px' }}>Event</th>
                <th style={{ padding: '8px 10px' }}>Page</th>
                <th style={{ padding: '8px 10px' }}>Device</th>
                <th style={{ padding: '8px 10px' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {summary.recentEvents.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '18px', textAlign: 'center', color: '#999' }}>
                    No events yet — browse the storefront in another tab and come back.
                  </td>
                </tr>
              )}
              {summary.recentEvents.map((e) => (
                <tr key={e.id} style={{ borderBottom: '1px solid #F4F1EA' }}>
                  <td style={{ padding: '8px 10px', color: '#777', whiteSpace: 'nowrap' }}>
                    {new Date(e.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <span style={{ background: '#F4F9F5', border: '1px solid #C8E6C9', color: '#162923', padding: '2px 8px', borderRadius: '20px', fontWeight: 700, fontSize: '11px' }}>
                      {e.event}
                    </span>
                  </td>
                  <td style={{ padding: '8px 10px', color: '#444', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.path}</td>
                  <td style={{ padding: '8px 10px', color: '#777', textTransform: 'capitalize' }}>{e.device}</td>
                  <td style={{ padding: '8px 10px', color: '#8A6D2B', fontWeight: 700 }}>
                    {e.value != null ? `£${e.value.toLocaleString()}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
