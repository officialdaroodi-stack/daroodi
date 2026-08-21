'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_ORDERS, INITIAL_COMMISSIONS, INITIAL_PAYOUTS } from '@/lib/mockData';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Download,
  CheckCircle,
  ArrowRight,
  PieChart,
  BarChart3,
  Calendar,
} from 'lucide-react';

export default function FinanceOverviewPage() {
  const [timeframe, setTimeframe] = useState<'6m' | '1y' | '30d'>('6m');
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  const grossRevenue = 18450;
  const netProfit = 9820;
  const totalCommissionApproved = INITIAL_COMMISSIONS.filter((c) => c.status === 'approved').reduce((acc, c) => acc + c.commission_amount, 0);
  const pendingApprovals = INITIAL_COMMISSIONS.filter((c) => c.status === 'pending_approval');
  const pendingApprovalAmount = pendingApprovals.reduce((acc, c) => acc + c.commission_amount, 0);
  const totalDisbursed = INITIAL_PAYOUTS.filter((p) => p.status === 'completed').reduce((acc, p) => acc + p.amount, 0);

  // Revenue chart data
  const chartData = [
    { month: 'Mar', rev: 9200, profit: 4600, orders: 7 },
    { month: 'Apr', rev: 12400, profit: 6200, orders: 10 },
    { month: 'May', rev: 15800, profit: 8100, orders: 13 },
    { month: 'Jun', rev: 14200, profit: 7400, orders: 11 },
    { month: 'Jul', rev: 21600, profit: 11400, orders: 17 },
    { month: 'Aug', rev: 28900, profit: 15200, orders: 22 },
  ];

  const maxVal = 32000;
  const svgWidth = 640;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  // Calculate coordinates for smooth line
  const points = chartData.map((d, i) => {
    const x = paddingX + (i / (chartData.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - (d.rev / maxVal) * (svgHeight - paddingY * 2);
    return { x, y, ...d };
  });

  const profitPoints = chartData.map((d, i) => {
    const x = paddingX + (i / (chartData.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - (d.profit / maxVal) * (svgHeight - paddingY * 2);
    return { x, y, ...d };
  });

  const revPath = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
  const revArea = `${revPath} L ${points[points.length - 1].x},${svgHeight - paddingY} L ${points[0].x},${svgHeight - paddingY} Z`;

  const profitPath = `M ${profitPoints.map(p => `${p.x},${p.y}`).join(' L ')}`;

  const handleExport = () => {
    alert('Exporting Daroodi Luxury P&L Financial Report (CSV & PDF)...');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#162923', margin: 0 }}>
            Financial Performance &amp; Revenue Analytics
          </h1>
          <p style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>
            Real-time atelier P&amp;L, net profit margins, and global partner disbursements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleExport}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #E5E0D8', color: '#162923', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
          >
            <Download size={15} /> Export P&amp;L Report
          </button>
          <Link
            href="/admin/finance/payouts"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', background: '#162923', color: '#C9A84C', textDecoration: 'none', fontWeight: 700, fontSize: '13px' }}
          >
            Commission Approvals ({pendingApprovals.length}) →
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E5E0D8', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '11px', color: '#888', fontWeight: 700, textTransform: 'uppercase' }}>Gross Revenue (YTD)</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#162923', margin: '6px 0 2px' }}>£102,100</div>
          <span style={{ fontSize: '12px', color: '#1B5E20', fontWeight: 700 }}>+34.8% vs last quarter</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E5E0D8', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '11px', color: '#888', fontWeight: 700, textTransform: 'uppercase' }}>Net Profit Margin</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#162923', margin: '6px 0 2px' }}>£54,720 (53.6%)</div>
          <span style={{ fontSize: '12px', color: '#1B5E20', fontWeight: 700 }}>High bespoke artisan yield</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E5E0D8', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '11px', color: '#888', fontWeight: 700, textTransform: 'uppercase' }}>Commissions Approved</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#162923', margin: '6px 0 2px' }}>£{totalCommissionApproved.toFixed(2)}</div>
          <span style={{ fontSize: '12px', color: '#888' }}>For country sales leaders</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E5E0D8', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '11px', color: '#888', fontWeight: 700, textTransform: 'uppercase' }}>Disbursed Payouts</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#162923', margin: '6px 0 2px' }}>£{totalDisbursed.toFixed(2)}</div>
          <span style={{ fontSize: '12px', color: '#1B5E20', fontWeight: 700 }}>✓ All accounts cleared</span>
        </div>
      </div>

      {/* ─── GRAPH SECTION ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '28px' }}>
        
        {/* Revenue & Profit Growth Chart */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '20px', border: '1px solid #E5E0D8', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#162923', margin: 0 }}>Monthly Revenue vs Net Profit</h2>
              <span style={{ fontSize: '12px', color: '#888' }}>Real-time atelier revenue curve with 24k gold accents</span>
            </div>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#162923' }} />
                <span>Gross Revenue</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#C9A84C' }} />
                <span>Net Profit</span>
              </div>
            </div>
          </div>

          {/* SVG Vector Chart */}
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: '240px', overflow: 'visible' }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#162923" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#162923" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = svgHeight - paddingY - ratio * (svgHeight - paddingY * 2);
                return (
                  <g key={idx}>
                    <line x1={paddingX} y1={y} x2={svgWidth - paddingX} y2={y} stroke="#F0ECE4" strokeDasharray="3 3" />
                    <text x={paddingX - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#999">
                      £{(maxVal * ratio / 1000).toFixed(0)}k
                    </text>
                  </g>
                );
              })}

              {/* Area & Curves */}
              <path d={revArea} fill="url(#revGrad)" />
              <path d={revPath} fill="none" stroke="#162923" strokeWidth="3.5" strokeLinecap="round" />
              <path d={profitPath} fill="none" stroke="#C9A84C" strokeWidth="3" strokeDasharray="5 4" strokeLinecap="round" />

              {/* Data Points */}
              {points.map((p, idx) => (
                <g key={idx} onMouseEnter={() => setHoveredMonth(idx)} onMouseLeave={() => setHoveredMonth(null)} style={{ cursor: 'pointer' }}>
                  <circle cx={p.x} cy={p.y} r={hoveredMonth === idx ? 7 : 4.5} fill="#162923" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx={profitPoints[idx].x} cy={profitPoints[idx].y} r={hoveredMonth === idx ? 6 : 4} fill="#C9A84C" stroke="#FFFFFF" strokeWidth="2" />
                  <text x={p.x} y={svgHeight - 10} textAnchor="middle" fontSize="11" fontWeight="700" fill="#666">
                    {p.month}
                  </text>
                  {hoveredMonth === idx && (
                    <g>
                      <rect x={p.x - 55} y={p.y - 48} width="110" height="40" rx="8" fill="#162923" />
                      <text x={p.x} y={p.y - 32} textAnchor="middle" fontSize="11" fontWeight="800" fill="#C9A84C">
                        £{p.rev.toLocaleString()} Rev
                      </text>
                      <text x={p.x} y={p.y - 18} textAnchor="middle" fontSize="10" fill="#FFFFFF">
                        £{p.profit.toLocaleString()} Profit ({p.orders} orders)
                      </text>
                    </g>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Cost & Margin Breakdown */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '20px', border: '1px solid #E5E0D8', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#162923', margin: 0 }}>Garment Margin Breakdown</h2>
            <span style={{ fontSize: '12px', color: '#888' }}>Unit economics of bespoke haute couture</span>

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                  <span>Net Operating Profit</span>
                  <span style={{ color: '#1B5E20' }}>53.6% (£777/unit)</span>
                </div>
                <div style={{ height: '8px', background: '#F0ECE4', borderRadius: '50px', overflow: 'hidden' }}>
                  <div style={{ width: '53.6%', height: '100%', background: '#162923' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                  <span>Zardozi Master Artisan Needlework</span>
                  <span style={{ color: '#C9A84C' }}>24.2% (£350/unit)</span>
                </div>
                <div style={{ height: '8px', background: '#F0ECE4', borderRadius: '50px', overflow: 'hidden' }}>
                  <div style={{ width: '24.2%', height: '100%', background: '#C9A84C' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                  <span>Italian Silk Velvet &amp; Zari Threads</span>
                  <span>14.5% (£210/unit)</span>
                </div>
                <div style={{ height: '8px', background: '#F0ECE4', borderRadius: '50px', overflow: 'hidden' }}>
                  <div style={{ width: '14.5%', height: '100%', background: '#666' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                  <span>DHL Express Worldwide Shipping &amp; Ins</span>
                  <span>7.7% (£112/unit)</span>
                </div>
                <div style={{ height: '8px', background: '#F0ECE4', borderRadius: '50px', overflow: 'hidden' }}>
                  <div style={{ width: '7.7%', height: '100%', background: '#999' }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: '#F8F6F3', padding: '12px 16px', borderRadius: '12px', marginTop: '16px', border: '1px solid #E5E0D8' }}>
            <span style={{ fontSize: '11px', color: '#162923', fontWeight: 700 }}>Average Order Value (AOV):</span>
            <strong style={{ display: 'block', fontSize: '16px', color: '#162923' }}>£1,450.00</strong>
          </div>
        </div>

      </div>

      {/* Payouts Ledger Table */}
      <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E5E0D8', overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #E5E0D8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#162923', margin: 0 }}>Completed Salary &amp; Commission Dispatches</h2>
          <span style={{ fontSize: '12px', color: '#888' }}>Verified banking transactions</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#F8F6F3', borderBottom: '1px solid #E5E0D8' }}>
              <th style={{ padding: '12px 20px' }}>Recipient / Account</th>
              <th style={{ padding: '12px 20px' }}>Disbursed Amount</th>
              <th style={{ padding: '12px 20px' }}>Channel</th>
              <th style={{ padding: '12px 20px' }}>Transaction Ref</th>
              <th style={{ padding: '12px 20px' }}>Authorized By</th>
              <th style={{ padding: '12px 20px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {INITIAL_PAYOUTS.map((pay) => (
              <tr key={pay.id} style={{ borderBottom: '1px solid #F0ECE4' }}>
                <td style={{ padding: '14px 20px' }}>
                  <strong style={{ color: '#162923', display: 'block' }}>{pay.recipient?.full_name}</strong>
                  <span style={{ fontSize: '11px', color: '#888' }}>{pay.recipient?.email}</span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <strong style={{ color: '#162923', fontSize: '15px' }}>£{pay.amount.toFixed(2)}</strong>
                </td>
                <td style={{ padding: '14px 20px' }}>{pay.payout_method}</td>
                <td style={{ padding: '14px 20px' }}>
                  <code style={{ background: '#F8F6F3', padding: '2px 6px', borderRadius: '4px' }}>{pay.transaction_reference}</code>
                </td>
                <td style={{ padding: '14px 20px', color: '#666' }}>Chief Finance Officer</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ background: '#E8F5E9', color: '#1B5E20', padding: '4px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: 700 }}>
                    ✓ {pay.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
