import asyncio
import os
import base64
from playwright.async_api import async_playwright

BASE_DIR = "/home/ijtiba-rana/Desktop/daroodi (2)/daroodi-app/scripts/presentation"
SCREENSHOTS_DIR = os.path.join(BASE_DIR, "screenshots")
PDF_OUTPUT = "/home/ijtiba-rana/Desktop/daroodi (2)/daroodi-app/scripts/presentation/Daroodi_CRM_Lead_Agent_Master_Guide_and_Passwords.pdf"

def get_b64(filename):
    path = os.path.join(SCREENSHOTS_DIR, filename)
    if os.path.exists(path):
        with open(path, "rb") as f:
            return f"data:image/png;base64,{base64.b64encode(f.read()).decode('utf-8')}"
    return ""

async def build_crm_pdf():
    print("=== Generating Dedicated CRM & Lead Agent Master PDF ===")
    
    img_login = get_b64('crm_00_login.png')
    img_tab1 = get_b64('crm_01_dashboard_console.png')
    img_tab2 = get_b64('crm_02_campaigns_folder.png')
    img_tab3 = get_b64('crm_03_sent_outreach_logs.png')
    img_tab4 = get_b64('crm_04_inbox_responses.png')
    img_tab5 = get_b64('crm_05_analytics_and_reports.png')
    img_tab6 = get_b64('crm_06_crm_and_lead_database.png')
    img_tab7 = get_b64('crm_07_smtp_and_templates.png')
    img_tab8 = get_b64('crm_08_outreach_direct.png')
    img_tab9 = get_b64('crm_09_rag_knowledge_hub.png')
    img_tab10 = get_b64('crm_10_product_catalog.png')
    img_tab11 = get_b64('crm_11_bulk_campaign.png')

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
  
  @page {{
    size: A4;
    margin: 15mm 15mm 15mm 15mm;
  }}
  
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #1A2E28;
    background: #FFFFFF;
    line-height: 1.5;
    font-size: 11pt;
  }}

  .page {{
    page-break-after: always;
    position: relative;
    padding-bottom: 20px;
  }}
  .page:last-child {{
    page-break-after: avoid;
  }}

  /* Luxury Cover */
  .cover {{
    height: 1000px;
    background: radial-gradient(circle at 20% 30%, #1A2738 0%, #0A1017 100%);
    color: #FFFFFF;
    padding: 60px 50px;
    display: flex;
    flex-direction: column;
    justifyContent: space-between;
    border: 3px solid #38BDF8;
    border-radius: 8px;
  }}
  .cover-header {{
    display: flex;
    align-items: center;
    gap: 18px;
  }}
  .emblem {{
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #38BDF8, #0284C7);
    color: #0A1017;
    font-family: 'Cinzel', serif;
    font-size: 32px;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(56, 189, 248, 0.5);
  }}
  .brand-title {{
    font-family: 'Cinzel', serif;
    font-size: 30px;
    font-weight: 800;
    letter-spacing: 0.15em;
    color: #E0F2FE;
  }}
  .cover-badge {{
    display: inline-block;
    background: rgba(56, 189, 248, 0.2);
    border: 1px solid #38BDF8;
    color: #BAE6FD;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 16px;
  }}
  .cover-title {{
    font-family: 'Cinzel', serif;
    font-size: 40px;
    font-weight: 800;
    line-height: 1.15;
    color: #FFFFFF;
    margin-bottom: 16px;
  }}
  .cover-subtitle {{
    font-size: 16px;
    color: #CBD5E1;
    max-width: 580px;
    line-height: 1.6;
  }}
  .cover-footer {{
    border-top: 1px solid rgba(56, 189, 248, 0.3);
    padding-top: 24px;
    display: flex;
    justifyContent: space-between;
    font-size: 11px;
    color: #38BDF8;
  }}

  /* Section Header */
  .section-title {{
    font-family: 'Cinzel', serif;
    font-size: 18pt;
    color: #0F172A;
    border-bottom: 2px solid #0284C7;
    padding-bottom: 8px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }}
  .section-badge {{
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 9.5pt;
    font-weight: 800;
    color: #0284C7;
    background: #F0F9FF;
    border: 1px solid #BAE6FD;
    padding: 4px 12px;
    border-radius: 12px;
    letter-spacing: 0.05em;
  }}

  /* Vault Card */
  .vault-card {{
    background: #0B132B;
    color: #FFFFFF;
    border: 2px solid #38BDF8;
    border-radius: 10px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  }}
  .vault-header {{
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid rgba(56, 189, 248, 0.3);
    padding-bottom: 12px;
    margin-bottom: 16px;
  }}
  .vault-title {{
    font-family: 'Cinzel', serif;
    color: #E0F2FE;
    font-size: 14pt;
    font-weight: 800;
    letter-spacing: 0.05em;
  }}
  .cred-table {{
    width: 100%;
    border-collapse: collapse;
  }}
  .cred-table td {{
    padding: 8px 10px;
    font-size: 10pt;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }}
  .cred-table td:first-child {{
    font-weight: 700;
    color: #38BDF8;
    width: 32%;
  }}
  .cred-table td:last-child {{
    font-family: 'JetBrains Mono', monospace;
    color: #FFFFFF;
    font-weight: 600;
    background: rgba(0,0,0,0.25);
    border-radius: 4px;
    padding-left: 10px;
  }}

  /* Two Column Tab Layout */
  .tab-grid {{
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }}
  .tab-screenshot {{
    width: 100%;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    margin-bottom: 10px;
  }}
  .box {{
    background: #F8FAFC;
    border-left: 4px solid #0284C7;
    padding: 10px 14px;
    margin-bottom: 8px;
    border-radius: 0 6px 6px 0;
  }}
  .box.gold {{
    background: #FEFCE8;
    border-left-color: #EAB308;
  }}
  .box.cyan {{
    background: #F0F9FF;
    border-left-color: #0284C7;
  }}
  .box-label {{
    font-weight: 800;
    text-transform: uppercase;
    font-size: 8pt;
    color: #0F172A;
    letter-spacing: 0.08em;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
  }}
  .box.gold .box-label {{
    color: #854D0E;
  }}
  .box.cyan .box-label {{
    color: #0369A1;
  }}
  .box-desc {{
    font-size: 9pt;
    color: #334155;
    line-height: 1.45;
  }}

  .action-list {{
    list-style: none;
    padding-left: 0;
  }}
  .action-list li {{
    position: relative;
    padding-left: 16px;
    margin-bottom: 3px;
    font-size: 9pt;
    color: #334155;
  }}
  .action-list li::before {{
    content: "▸";
    position: absolute;
    left: 0;
    color: #0284C7;
    font-weight: 900;
  }}

  .footer-meta {{
    display: flex;
    justifyContent: space-between;
    border-top: 1px solid #E2E8F0;
    padding-top: 8px;
    font-size: 8pt;
    color: #64748B;
    margin-top: 14px;
  }}
</style>
</head>
<body>

  <!-- PAGE 1: COVER -->
  <div class="page cover">
    <div class="cover-header">
      <div class="emblem">⚡</div>
      <div class="brand-title">DAROODI AI LEAD AGENT</div>
    </div>
    
    <div>
      <div class="cover-badge">INTELLIGENCE PLATFORM • RESTRICTED ACCESS</div>
      <h1 class="cover-title">Autonomous AI B2B Lead Agent &amp; CRM Master Guide</h1>
      <p class="cover-subtitle">
        Operational manual, credential vault, and complete walkthrough of all 11 modules of the automated lead generation, cold outreach, and response orchestration suite at <strong>daroodi-lead-agent.vercel.app</strong>.
      </p>
    </div>

    <div class="cover-footer">
      <div>Daroodi Global Enterprise • B2B Acquisition &amp; High-Net-Worth Outreach</div>
      <div>Production Release • September 2026</div>
    </div>
  </div>

  <!-- PAGE 2: CREDENTIALS & SYSTEM ARCHITECTURE -->
  <div class="page">
    <div class="section-title">
      <span>1. CRM Master Credentials Vault</span>
      <span class="section-badge">SECURITY VAULT</span>
    </div>

    <div class="vault-card">
      <div class="vault-header">
        <span style="font-size: 18pt;">🔐</span>
        <span class="vault-title">Production CRM &amp; AI Agent Access Keys</span>
      </div>
      <table class="cred-table">
        <tr>
          <td>Live CRM URL</td>
          <td>https://daroodi-lead-agent.vercel.app</td>
        </tr>
        <tr>
          <td>Login Gateway</td>
          <td>https://daroodi-lead-agent.vercel.app/login</td>
        </tr>
        <tr>
          <td>Username / Agent ID</td>
          <td>daroodi_admin</td>
        </tr>
        <tr>
          <td>Master Password</td>
          <td>Daroodi@2026#Luxury</td>
        </tr>
        <tr>
          <td>Connected Main Storefront</td>
          <td>https://www.daroodi.com</td>
        </tr>
        <tr>
          <td>Main Super Admin Email</td>
          <td>admin@daroodi.com</td>
        </tr>
        <tr>
          <td>Main Super Admin Password</td>
          <td>DaroodiMasterAdmin2026!#</td>
        </tr>
        <tr>
          <td>Platform Architecture</td>
          <td>Next.js + Vercel Edge + AI Autonomous Agents</td>
        </tr>
      </table>
    </div>

    <h3 style="color: #0F172A; font-size: 12pt; margin: 16px 0 8px;">CRM Login Screen (Live Capture)</h3>
    <img src="{img_login}" class="tab-screenshot" style="max-height: 220px; object-fit: cover;" alt="CRM Login Screen" />

    <div class="box cyan">
      <div class="box-label">⚡ System Purpose &amp; Value Proposition</div>
      <div class="box-desc">
        The <strong>Daroodi Lead Agent</strong> acts as an autonomous sales and client acquisition engine for Daroodi Haute Couture. It automates prospect scraping (via Apify &amp; VPS actors), filters high-fit luxury retailers, event organizers, and wedding planners, drafts hyper-personalized outreach using RAG knowledge, and handles multi-channel follow-ups.
      </div>
    </div>

    <div class="footer-meta">
      <span>Daroodi Lead Agent • Master Operations Guide</span>
      <span>Page 2</span>
    </div>
  </div>

  <!-- PAGE 3: TABS 1 & 2 - DASHBOARD CONSOLE & CAMPAIGNS -->
  <div class="page">
    <div class="section-title">
      <span>2. Console Hub &amp; Campaigns Folder</span>
      <span class="section-badge">TABS 1 &amp; 2</span>
    </div>

    <div style="margin-bottom: 20px;">
      <h3 style="color: #0F172A; font-size: 12pt; margin-bottom: 4px;">Tab 1: ⚜ Dashboard Console</h3>
      <img src="{img_tab1}" class="tab-screenshot" style="max-height: 210px; object-fit: cover;" alt="Dashboard Console" />
      <div class="box">
        <div class="box-label">What It Is</div>
        <div class="box-desc">The central executive lead generation command center. Displays total Apify scraped leads, VPS leads, qualified prospects, review queues, and average brand fit score. Features the instant <strong>📄 Generate &amp; Print PDF Report</strong> engine.</div>
      </div>
      <div class="box gold">
        <div class="box-label">What To Do</div>
        <ul class="action-list">
          <li>Monitor total active pipeline leads and qualified prospect counts.</li>
          <li>Click 'Run agents' to trigger autonomous lead gathering and scoring.</li>
          <li>Select date ranges and click 'Generate &amp; Print PDF Report' for stakeholder briefings.</li>
        </ul>
      </div>
    </div>

    <div>
      <h3 style="color: #0F172A; font-size: 12pt; margin-bottom: 4px;">Tab 2: Campaigns Folder</h3>
      <img src="{img_tab2}" class="tab-screenshot" style="max-height: 210px; object-fit: cover;" alt="Campaigns Folder" />
      <div class="box">
        <div class="box-label">What It Is</div>
        <div class="box-desc">Structured directory of all active and past outreach campaigns (e.g. B2B Boutique Retailers, Luxury Wedding Planners UK, High-Net-Worth Groom Styling).</div>
      </div>
      <div class="box gold">
        <div class="box-label">What To Do</div>
        <ul class="action-list">
          <li>Launch the Campaign Wizard to create new B2B targeted outreach sequences.</li>
          <li>Review campaign status badges (ACTIVE vs. PAUSED).</li>
          <li>Filter campaigns by niche, target country, or seasonal wedding collection.</li>
        </ul>
      </div>
    </div>

    <div class="footer-meta">
      <span>Daroodi Lead Agent • Master Operations Guide</span>
      <span>Page 3</span>
    </div>
  </div>

  <!-- PAGE 4: TABS 3 & 4 - OUTREACH LOGS & INBOX RESPONSES -->
  <div class="page">
    <div class="section-title">
      <span>3. Outreach Logs &amp; Inbox Responses</span>
      <span class="section-badge">TABS 3 &amp; 4</span>
    </div>

    <div style="margin-bottom: 20px;">
      <h3 style="color: #0F172A; font-size: 12pt; margin-bottom: 4px;">Tab 3: Sent Outreach Logs</h3>
      <img src="{img_tab3}" class="tab-screenshot" style="max-height: 210px; object-fit: cover;" alt="Sent Outreach Logs" />
      <div class="box">
        <div class="box-label">What It Is</div>
        <div class="box-desc">Audit trail of every single email dispatched by the automated AI agent. Records recipient email, campaign name, timestamp, deliverability status, and subject line.</div>
      </div>
      <div class="box gold">
        <div class="box-label">What To Do</div>
        <ul class="action-list">
          <li>Verify daily email send volumes to remain within safe SMTP deliverability thresholds.</li>
          <li>Inspect delivery confirmation timestamps to optimize dispatch hours.</li>
          <li>Flag any bounced addresses to maintain immaculate domain reputation.</li>
        </ul>
      </div>
    </div>

    <div>
      <h3 style="color: #0F172A; font-size: 12pt; margin-bottom: 4px;">Tab 4: Inbox (Responses)</h3>
      <img src="{img_tab4}" class="tab-screenshot" style="max-height: 210px; object-fit: cover;" alt="Inbox Responses" />
      <div class="box">
        <div class="box-label">What It Is</div>
        <div class="box-desc">Unified response inbox. Automatically aggregates incoming replies from prospective boutique partners, wedding coordinators, and bespoke clients.</div>
      </div>
      <div class="box gold">
        <div class="box-label">What To Do</div>
        <ul class="action-list">
          <li>Review replies flagged as 'Hot Lead' or 'Meeting Requested'.</li>
          <li>Take over high-value conversations directly or dispatch regional country managers.</li>
          <li>Forward bulk tailoring inquiries to the Daroodi Master Atelier.</li>
        </ul>
      </div>
    </div>

    <div class="footer-meta">
      <span>Daroodi Lead Agent • Master Operations Guide</span>
      <span>Page 4</span>
    </div>
  </div>

  <!-- PAGE 5: TABS 5 & 6 - ANALYTICS & CRM LEAD DATABASE -->
  <div class="page">
    <div class="section-title">
      <span>4. Analytics &amp; CRM Lead Database</span>
      <span class="section-badge">TABS 5 &amp; 6</span>
    </div>

    <div style="margin-bottom: 20px;">
      <h3 style="color: #0F172A; font-size: 12pt; margin-bottom: 4px;">Tab 5: Analytics &amp; Reports</h3>
      <img src="{img_tab5}" class="tab-screenshot" style="max-height: 210px; object-fit: cover;" alt="Analytics &amp; Reports" />
      <div class="box">
        <div class="box-label">What It Is</div>
        <div class="box-desc">Comprehensive outreach performance analytics. Tracks open rates, reply rates, positive sentiment percentages, bounce rates, and conversion pipeline progress.</div>
      </div>
      <div class="box gold">
        <div class="box-label">What To Do</div>
        <ul class="action-list">
          <li>Compare performance between different email templates and subject lines.</li>
          <li>Identify top-converting geographic markets (e.g. UK vs. UAE vs. US).</li>
          <li>Optimize outreach schedules based on engagement heatmaps.</li>
        </ul>
      </div>
    </div>

    <div>
      <h3 style="color: #0F172A; font-size: 12pt; margin-bottom: 4px;">Tab 6: CRM &amp; Lead Database</h3>
      <img src="{img_tab6}" class="tab-screenshot" style="max-height: 210px; object-fit: cover;" alt="CRM &amp; Lead Database" />
      <div class="box">
        <div class="box-label">What It Is</div>
        <div class="box-desc">The master prospect directory. Stores prospect names, company names, verified emails, phone numbers, enrichment scores, and deal pipeline stages.</div>
      </div>
      <div class="box gold">
        <div class="box-label">What To Do</div>
        <ul class="action-list">
          <li>Search and filter prospects by industry, location, or qualification score.</li>
          <li>Manually add VIP high-net-worth leads for private boutique outreach.</li>
          <li>Export lead records to CSV for integration with external CRM systems.</li>
        </ul>
      </div>
    </div>

    <div class="footer-meta">
      <span>Daroodi Lead Agent • Master Operations Guide</span>
      <span>Page 5</span>
    </div>
  </div>

  <!-- PAGE 6: TABS 7 & 8 - SMTP TEMPLATES & OUTREACH DIRECT -->
  <div class="page">
    <div class="section-title">
      <span>5. SMTP Templates &amp; Direct Outreach</span>
      <span class="section-badge">TABS 7 &amp; 8</span>
    </div>

    <div style="margin-bottom: 20px;">
      <h3 style="color: #0F172A; font-size: 12pt; margin-bottom: 4px;">Tab 7: SMTP &amp; Templates</h3>
      <img src="{img_tab7}" class="tab-screenshot" style="max-height: 210px; object-fit: cover;" alt="SMTP &amp; Templates" />
      <div class="box">
        <div class="box-label">What It Is</div>
        <div class="box-desc">Email infrastructure and template repository. Manages SMTP sending accounts, sender names, warming settings, and dynamic template variables (e.g. {{first_name}}, {{company}}, {{curated_coat}}).</div>
      </div>
      <div class="box gold">
        <div class="box-label">What To Do</div>
        <ul class="action-list">
          <li>Create persuasive cold outreach email copies reflecting Daroodi's royal heritage.</li>
          <li>Configure SMTP sending limits (e.g. 50–100 emails/day) to safeguard inbox deliverability.</li>
          <li>Test email spam scores before activating mass outreach campaigns.</li>
        </ul>
      </div>
    </div>

    <div>
      <h3 style="color: #0F172A; font-size: 12pt; margin-bottom: 4px;">Tab 8: Outreach Direct</h3>
      <img src="{img_tab8}" class="tab-screenshot" style="max-height: 210px; object-fit: cover;" alt="Outreach Direct" />
      <div class="box">
        <div class="box-label">What It Is</div>
        <div class="box-desc">Single-lead outreach studio. Allows sales executives to craft bespoke 1-to-1 emails to high-profile partners with instant test sending and preview capabilities.</div>
      </div>
      <div class="box gold">
        <div class="box-label">What To Do</div>
        <ul class="action-list">
          <li>Send custom partnership proposals to celebrity stylists or high-profile groom clients.</li>
          <li>Attach bespoke bridal lookbooks and custom pricing tiers.</li>
          <li>Review real-time email previews before dispatching.</li>
        </ul>
      </div>
    </div>

    <div class="footer-meta">
      <span>Daroodi Lead Agent • Master Operations Guide</span>
      <span>Page 6</span>
    </div>
  </div>

  <!-- PAGE 7: TABS 9, 10, 11 - RAG KNOWLEDGE, CATALOG & BULK CAMPAIGN -->
  <div class="page">
    <div class="section-title">
      <span>6. RAG Hub, Product Catalog &amp; Bulk Engine</span>
      <span class="section-badge">TABS 9, 10, 11</span>
    </div>

    <div style="margin-bottom: 18px;">
      <h3 style="color: #0F172A; font-size: 11pt; margin-bottom: 4px;">Tab 9: RAG Knowledge Hub</h3>
      <img src="{img_tab9}" class="tab-screenshot" style="max-height: 180px; object-fit: cover;" alt="RAG Knowledge Hub" />
      <div class="box-desc" style="font-size: 8.5pt;">The AI agent's brain. Houses brand history, embroidery craft techniques (Zardozi, Tilla, Resham), pricing rules, and sizing guides. The AI uses this vector base to craft accurate, brand-aligned email answers.</div>
    </div>

    <div style="margin-bottom: 18px;">
      <h3 style="color: #0F172A; font-size: 11pt; margin-bottom: 4px;">Tab 10: Product Catalog</h3>
      <img src="{img_tab10}" class="tab-screenshot" style="max-height: 180px; object-fit: cover;" alt="Product Catalog" />
      <div class="box-desc" style="font-size: 8.5pt;">Synchronized product catalog. Provides the AI agent with real-time access to Daroodi's masterpiece coats, images, prices, and fabric compositions for inclusion in outreach emails.</div>
    </div>

    <div>
      <h3 style="color: #0F172A; font-size: 11pt; margin-bottom: 4px;">Tab 11: 📢 Bulk Campaign</h3>
      <img src="{img_tab11}" class="tab-screenshot" style="max-height: 180px; object-fit: cover;" alt="Bulk Campaign" />
      <div class="box-desc" style="font-size: 8.5pt;">Mass personalized outreach execution. Upload CSV lists of vetted prospects, map personalization columns, set sending delays, and launch automated campaign queues.</div>
    </div>

    <div class="footer-meta">
      <span>Daroodi Lead Agent • Master Operations Guide</span>
      <span>Page 7</span>
    </div>
  </div>

  <!-- PAGE 8: OPERATIONAL SOPs & CRM WORKFLOW -->
  <div class="page">
    <div class="section-title">
      <span>7. Operational SOPs &amp; Lead Flow</span>
      <span class="section-badge">PLAYBOOK</span>
    </div>

    <div class="box cyan" style="margin-bottom: 16px;">
      <div class="box-label">🚀 Step-by-Step Campaign Launch Routine</div>
      <ul class="action-list">
        <li><strong>Step 1 (Scraping):</strong> In Dashboard Console, run scrapers for target keywords (e.g. "luxury wedding planner London").</li>
        <li><strong>Step 2 (Qualification):</strong> AI agent scores each lead based on website quality, social following, and relevance.</li>
        <li><strong>Step 3 (Template Selection):</strong> In SMTP &amp; Templates, choose the appropriate luxury couture introduction copy.</li>
        <li><strong>Step 4 (Launch):</strong> In Campaigns Folder or Bulk Campaign, launch the queue with 60-second dispatch intervals.</li>
        <li><strong>Step 5 (Closing):</strong> When responses arrive in Inbox, tag warm leads and connect them to Daroodi's atelier sales team.</li>
      </ul>
    </div>

    <div class="box gold" style="margin-bottom: 16px;">
      <div class="box-label">🔑 Integrated Credentials Quick Reference</div>
      <table class="cred-table" style="background: #0B132B; border-radius: 6px; padding: 12px;">
        <tr>
          <td style="color: #38BDF8;">CRM Portal</td>
          <td style="color: #fff;">https://daroodi-lead-agent.vercel.app</td>
        </tr>
        <tr>
          <td style="color: #38BDF8;">CRM User</td>
          <td style="color: #fff;">daroodi_admin</td>
        </tr>
        <tr>
          <td style="color: #38BDF8;">CRM Pass</td>
          <td style="color: #fff;">Daroodi@2026#Luxury</td>
        </tr>
        <tr>
          <td style="color: #38BDF8;">Flagship Admin</td>
          <td style="color: #fff;">admin@daroodi.com / DaroodiMasterAdmin2026!#</td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin-top: 40px; padding: 20px; border: 1px solid #E2E8F0; border-radius: 8px; background: #F8FAFC;">
      <div style="font-family: 'Cinzel', serif; font-size: 15pt; font-weight: 800; color: #0F172A; margin-bottom: 4px;">DAROODI AI LEAD AGENT</div>
      <div style="font-size: 9pt; color: #64748B;">High-Performance B2B Client Acquisition for Haute Couture</div>
      <div style="font-size: 8.5pt; color: #0284C7; font-weight: 700; margin-top: 8px;">End of Official CRM Documentation</div>
    </div>

    <div class="footer-meta">
      <span>Daroodi Lead Agent • Master Operations Guide</span>
      <span>Page 8</span>
    </div>
  </div>

</body>
</html>"""

    html_path = os.path.join(BASE_DIR, "crm_master_guide.html")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print("CRM HTML created:", html_path)

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            executable_path='/usr/bin/google-chrome',
            args=['--no-sandbox', '--disable-setuid-sandbox']
        )
        page = await browser.new_page()
        await page.goto(f"file://{html_path}", wait_until='networkidle')
        await page.wait_for_timeout(2000)

        print("Rendering CRM PDF...")
        await page.pdf(
            path=PDF_OUTPUT,
            format="A4",
            print_background=True,
            margin={"top": "0mm", "bottom": "0mm", "left": "0mm", "right": "0mm"}
        )
        print("CRM PDF generated successfully:", PDF_OUTPUT)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(build_crm_pdf())
