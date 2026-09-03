import asyncio
import os
import subprocess
from playwright.async_api import async_playwright

OUTPUT_DIR = "/home/ijtiba-rana/Desktop/daroodi (2)/daroodi-app/scripts/presentation"
SCREENSHOTS_DIR = os.path.join(OUTPUT_DIR, "screenshots")
VIDEO_DIR = os.path.join(OUTPUT_DIR, "raw_video")
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)
os.makedirs(VIDEO_DIR, exist_ok=True)

# Slides metadata for video and PDF
SLIDES = [
    {
        "tab_id": "intro",
        "category": "EXECUTIVE PLATFORM BRIEFING",
        "title": "Daroodi Haute Couture Maison & ERP Platform",
        "subtitle": "Comprehensive Architecture, Operations & Master Passwords Guide",
        "url": "https://www.daroodi.com",
        "what_it_is": "A custom enterprise e-commerce & bespoke tailoring ERP platform custom-tailored for Daroodi Haute Couture. Built with Next.js Turbopack, Supabase PostgreSQL, and Cloudflare/Vercel global edge infrastructure.",
        "what_to_do": "• Access the live storefront to view bespoke embroidered coats and bridal couture.\n• Use Super Admin credentials to oversee global sales, bespoke orders, and marketing.\n• Review this presentation and PDF documentation for credentials and operational SOPs.",
        "pro_tip": "All administrative functions are protected by cryptographic row-level security (RLS) and require staff-tier authentication.",
        "live_target": "https://www.daroodi.com"
    },
    {
        "tab_id": "storefront",
        "category": "CLIENT EXPERIENCE",
        "title": "Live Storefront & Bespoke Customer Experience",
        "subtitle": "Discovering Masterpieces, Collections & Tailoring Studio",
        "url": "https://www.daroodi.com",
        "what_it_is": "The customer-facing digital flagship for Daroodi. Features interactive 3D hero carousels, collection showcases (Platinum, Gold, Silver, Bespoke Essentials), curated journal editorials, and bespoke inquiry studios.",
        "what_to_do": "• Explore curated collections and filter products by price, fabric, or occasion.\n• Review product detail pages with high-definition multi-angle galleries and ACF craftsmanship breakdowns.\n• Test client bespoke ordering and bag checkout flow.",
        "pro_tip": "All product images are served in compressed WebP format for fast sub-second mobile page loads.",
        "live_target": "https://www.daroodi.com/shop"
    },
    {
        "tab_id": "auth",
        "category": "SECURITY & ACCESS",
        "title": "Super Admin Authentication Portal",
        "subtitle": "Secure Staff Sign-in & Automatic Role-Based Routing",
        "url": "https://www.daroodi.com/auth/login",
        "what_it_is": "The unified authentication gate. Uses Supabase Auth session tokens. Automatically detects user privileges: customers are routed to /account, while staff and Super Admins are automatically routed to /admin.",
        "what_to_do": "• Navigate to https://www.daroodi.com/auth/login\n• Enter Super Admin credentials: admin@daroodi.com / DaroodiMasterAdmin2026!#\n• System automatically authenticates and forwards you into the Super Admin ERP suite.",
        "pro_tip": "If an admin user visits /account, the system instantly auto-redirects them to /admin.",
        "live_target": "https://www.daroodi.com/auth/login"
    },
    {
        "tab_id": "overview",
        "category": "ADMIN TAB 1 / 13",
        "title": "Overview & Executive KPIs",
        "subtitle": "Real-Time Atelier Performance & Operational Intelligence",
        "url": "https://www.daroodi.com/admin",
        "what_it_is": "The central executive command cockpit. Displays gross merchandise value (GMV), active bespoke commissions, global orders, agent commission liabilities, and conversion velocity.",
        "what_to_do": "• Monitor gross revenue and total bespoke commissions placed today.\n• Track the active order pipeline across all tailoring production stages.\n• Identify urgent bespoke client inquiries requiring immediate master tailor consultation.",
        "pro_tip": "Refresh metrics at the start of each morning shift to align production capacity with daily client orders.",
        "live_target": "https://www.daroodi.com/admin"
    },
    {
        "tab_id": "users",
        "category": "ADMIN TAB 2 / 13",
        "title": "User Hierarchy & Role-Based Access Control (RBAC)",
        "subtitle": "Managing Staff Privileges, Tailor Access & Country Heads",
        "url": "https://www.daroodi.com/admin/users",
        "what_it_is": "Enterprise role management dashboard. Governs access tiers across: Super Admin, Master Tailor, Production Manager, Country Head, Regional Agent, and VIP Clients.",
        "what_to_do": "• Review registered staff accounts and their active role levels.\n• Promote team members to Production Manager or Finance Manager roles.\n• Revoke privileges or adjust permissions when staff duties change.",
        "pro_tip": "Super Admin accounts have full database access and can grant or revoke privileges on demand.",
        "live_target": "https://www.daroodi.com/admin/users"
    },
    {
        "tab_id": "products",
        "category": "ADMIN TAB 3 / 13",
        "title": "Catalog & ACF Craftsmanship Specifications",
        "subtitle": "Masterpiece Inventory, Pricing & Direct Image Upload Gallery",
        "url": "https://www.daroodi.com/admin/products",
        "what_it_is": "Comprehensive product catalog management. Manages product titles, pricing tiers, stock status, hand-embroidery hours, fabric compositions, and multi-image galleries with direct file uploads.",
        "what_to_do": "• Click 'Create Masterpiece' or click 'Edit' on any existing coat or tuxedo.\n• Upload primary featured images and multiple gallery photos directly from your computer.\n• Enter detailed ACF specs: embroidery technique, care instructions, and lead time in weeks.",
        "pro_tip": "The new direct upload button automatically uploads images to storage and links them instantly to the product record.",
        "live_target": "https://www.daroodi.com/admin/products"
    },
    {
        "tab_id": "orders",
        "category": "ADMIN TAB 4 / 13",
        "title": "Bespoke Orders & Client Measurements Matrix",
        "subtitle": "Tailoring Stages, Custom Sizing & WhatsApp Dispatch",
        "url": "https://www.daroodi.com/admin/orders",
        "what_it_is": "The heartbeat of the Daroodi atelier. Tracks every bespoke client commission, custom body measurements (chest, waist, hip, shoulder, sleeves, height), and active production stages.",
        "what_to_do": "• View client bespoke orders and check exact client body measurements.\n• Advance orders through tailoring stages: Consultation → Fabric Cutting → Hand Embroidery → Fitting → Dispatched.\n• Click direct WhatsApp buttons to contact clients with live production updates and tracking numbers.",
        "pro_tip": "Always verify client measurements with the master tailor before advancing orders to the Fabric Cutting stage.",
        "live_target": "https://www.daroodi.com/admin/orders"
    },
    {
        "tab_id": "finance",
        "category": "ADMIN TAB 5 / 13",
        "title": "Financial Control & Revenue Analytics",
        "subtitle": "Monthly GMV, Profit Margins & Payment Distribution",
        "url": "https://www.daroodi.com/admin/finance",
        "what_it_is": "Executive financial ledger and analytics suite. Summarizes gross merchandise volume, average order values (AOV), net profits, payment method splits, and historical growth trends.",
        "what_to_do": "• Review monthly revenue trajectories and profit margins.\n• Audit payment gateways and check transaction settlement statuses.\n• Analyze average order values across different regional client groups.",
        "pro_tip": "Filter revenue by custom date ranges to audit seasonal wedding demand and bespoke bridal peaks.",
        "live_target": "https://www.daroodi.com/admin/finance"
    },
    {
        "tab_id": "payouts",
        "category": "ADMIN TAB 6 / 13",
        "title": "Commission Approvals & Payout Ledger",
        "subtitle": "Auditing Agent Earnings, Country Head Splits & Disbursals",
        "url": "https://www.daroodi.com/admin/finance/payouts",
        "what_it_is": "Agent commission ledger. Automatically calculates commission percentages earned by regional agents and country managers for referred bespoke sales.",
        "what_to_do": "• Review pending agent commission claims against completed client orders.\n• Approve verified commissions for payment processing.\n• Export payout records for bank wire transfer or accounting integration.",
        "pro_tip": "Only approve commissions after the client order has been fully dispatched and accepted by the client.",
        "live_target": "https://www.daroodi.com/admin/finance/payouts"
    },
    {
        "tab_id": "marketing",
        "category": "ADMIN TAB 7 / 13",
        "title": "Global Marketing Campaigns & Promo Codes",
        "subtitle": "Seasonal Promotions, VIP Discount Vouchers & Banner Engine",
        "url": "https://www.daroodi.com/admin/marketing",
        "what_it_is": "Marketing campaign manager. Creates and governs discount coupons, seasonal flash sales, VIP invitation codes, and site-wide promotional announcements.",
        "what_to_do": "• Create custom promo codes with percentage or fixed currency deductions.\n• Set expiration dates and usage limits for private VIP clientele.\n• Launch seasonal wedding season campaigns with custom banner messages.",
        "pro_tip": "Use minimum order value thresholds to protect profit margins on heavily embroidered couture pieces.",
        "live_target": "https://www.daroodi.com/admin/marketing"
    },
    {
        "tab_id": "country_managers",
        "category": "ADMIN TAB 8 / 13",
        "title": "Country Heads & International Agent Network",
        "subtitle": "Overseeing Regional Sales Reps in UK, UAE, US & Pakistan",
        "url": "https://www.daroodi.com/admin/marketing/country-managers",
        "what_it_is": "International sales representative governance. Manages country directors and regional sales ambassadors responsible for private client consultations in major luxury hubs.",
        "what_to_do": "• Assign country managers to specific luxury territories (e.g. London, Dubai, New York, Lahore).\n• Track quarterly sales quotas, conversion metrics, and client feedback per region.\n• Review regional agent inquiries and assign new bridal inquiries to local reps.",
        "pro_tip": "Assigning dedicated country managers to high-net-worth regions significantly boosts bespoke conversion rates.",
        "live_target": "https://www.daroodi.com/admin/marketing/country-managers"
    },
    {
        "tab_id": "posts",
        "category": "ADMIN TAB 9 / 13",
        "title": "Editorial Journal & Haute Couture Blog CMS",
        "subtitle": "Publishing Articles, Styling Guides & Heritage Stories",
        "url": "https://www.daroodi.com/admin/posts",
        "what_it_is": "Headless editorial publishing engine. Powers the Daroodi Journal with articles on royal embroidery traditions, grooming etiquette, and groom style inspirations.",
        "what_to_do": "• Draft and publish new editorial articles with featured imagery and excerpt summaries.\n• Configure SEO metadata (slugs, meta titles, tags) to drive organic search traffic.\n• Feature stories on the homepage to highlight artisan hand-embroidery heritage.",
        "pro_tip": "Regularly publishing styling guides improves search rankings for luxury Prince Coats and bespoke groomswear keywords.",
        "live_target": "https://www.daroodi.com/admin/posts"
    },
    {
        "tab_id": "pages",
        "category": "ADMIN TAB 10 / 13",
        "title": "Storefront Pages & Custom Content CMS",
        "subtitle": "Managing Heritage, Archive, Foundation & Policy Content",
        "url": "https://www.daroodi.com/admin/pages",
        "what_it_is": "Content management system for static and informational pages. Controls page copy, hero banners, and layout blocks for Our Heritage, Sahib Ali Foundation, Atelier Archive, and FAQs.",
        "what_to_do": "• Edit informational content for brand heritage and social impact initiatives.\n• Update terms of service, bespoke sizing guides, and international shipping policies.\n• Preview page drafts prior to live storefront publication.",
        "pro_tip": "Keep sizing guides and care policies updated to set clear client expectations for bespoke lead times.",
        "live_target": "https://www.daroodi.com/admin/pages"
    },
    {
        "tab_id": "cms",
        "category": "ADMIN TAB 11 / 13",
        "title": "Customer Reviews, Trust & Bespoke Q&A",
        "subtitle": "Moderating Client Testimonials, Star Ratings & Product FAQs",
        "url": "https://www.daroodi.com/admin/cms",
        "what_it_is": "Reputation and social proof management suite. Allows administrators to review, approve, and highlight verified client testimonials, Trustpilot ratings, and customer Q&A.",
        "what_to_do": "• Approve verified reviews from distinguished clients and brides.\n• Answer customer inquiries regarding fabric weights and bespoke delivery timelines.\n• Pin 5-star testimonials to collection showcase pages.",
        "pro_tip": "Authentic client testimonials displaying photos of wedding attire build trust for international bespoke orders.",
        "live_target": "https://www.daroodi.com/admin/cms"
    },
    {
        "tab_id": "analytics",
        "category": "ADMIN TAB 12 / 13",
        "title": "Visitor Traffic & Geographic Analytics",
        "subtitle": "Real-Time Traffic Monitoring, Top Products & Device Splits",
        "url": "https://www.daroodi.com/admin/analytics",
        "what_it_is": "Storefront traffic analysis module. Tracks visitor counts, top-performing product views, geographic origins (UK, US, UAE, PK, EU), and mobile vs. desktop visitor ratios.",
        "what_to_do": "• Check peak traffic times and top-performing coat designs this week.\n• Analyze geographic visitor distribution to optimize regional marketing spend.\n• Verify mobile browsing performance and optimize page load speeds.",
        "pro_tip": "Over 75% of luxury bespoke inquiries originate from mobile devices; ensure product images remain compressed.",
        "live_target": "https://www.daroodi.com/admin/analytics"
    },
    {
        "tab_id": "settings",
        "category": "ADMIN TAB 13 / 13",
        "title": "Tracking Pixels & Third-Party Integrations",
        "subtitle": "Google Analytics 4, GTM, Meta Pixel, TikTok & Custom Scripts",
        "url": "https://www.daroodi.com/admin/settings",
        "what_it_is": "No-code marketing tag and pixel injection system. Allows administrators to install tracking tools (GA4, Google Tag Manager, Meta Pixel, TikTok Pixel, custom script tags) without developer intervention.",
        "what_to_do": "• Paste your GA4 Measurement ID (G-XXXXXXXXXX) or GTM Container ID (GTM-XXXXXXX).\n• Enter your Meta (Facebook) Pixel ID and TikTok Pixel ID for ad conversion tracking.\n• Inject custom chat widgets or marketing scripts into the <head> or <body> tags.",
        "pro_tip": "Scripts go live on the storefront immediately upon clicking 'Save Tracking Settings'.",
        "live_target": "https://www.daroodi.com/admin/settings"
    },
    {
        "tab_id": "summary",
        "category": "OPERATIONAL CONCLUSION",
        "title": "Master Credentials Vault & Operational Checklist",
        "subtitle": "Quick Reference for Daroodi Super Admin & Management",
        "url": "https://www.daroodi.com/admin",
        "what_it_is": "Executive reference card containing all critical platform URLs, credentials, and daily maintenance routines for the Daroodi digital flagship.",
        "what_to_do": "• Keep master credentials confidential and change passwords periodically.\n• Monitor bespoke orders daily and maintain prompt client communication.\n• Use the new direct image upload tool in Catalog & ACF Specs to expand product collections.",
        "pro_tip": "Store this master PDF in a secure location for all authorized atelier executives and directors.",
        "live_target": "https://www.daroodi.com/admin"
    }
]

def generate_slide_html(slide, index, total):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    width: 1920px;
    height: 1080px;
    background: radial-gradient(circle at 10% 20%, #122B24 0%, #091713 100%);
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #FFFFFF;
    display: flex;
    flex-direction: column;
    justifyContent: space-between;
    padding: 60px 80px;
    position: relative;
    overflow: hidden;
  }}
  /* Luxury Gold Borders & Accents */
  body::before {{
    content: '';
    position: absolute;
    top: 24px; left: 24px; right: 24px; bottom: 24px;
    border: 1.5px solid rgba(201, 168, 76, 0.35);
    pointer-events: none;
    border-radius: 12px;
  }}
  body::after {{
    content: '';
    position: absolute;
    top: 30px; left: 30px; right: 30px; bottom: 30px;
    border: 1px solid rgba(201, 168, 76, 0.15);
    pointer-events: none;
    border-radius: 8px;
  }}
  .header {{
    display: flex;
    justifyContent: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(201, 168, 76, 0.25);
    padding-bottom: 24px;
    position: relative;
    z-index: 10;
  }}
  .brand {{
    display: flex;
    align-items: center;
    gap: 16px;
  }}
  .brand-emblem {{
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #C9A84C 0%, #8C6F2D 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cinzel', serif;
    font-weight: 800;
    font-size: 24px;
    color: #091713;
    box-shadow: 0 4px 15px rgba(201, 168, 76, 0.4);
  }}
  .brand-text {{
    font-family: 'Cinzel', serif;
    font-size: 28px;
    font-weight: 800;
    letter-spacing: 0.15em;
    color: #F4E8C1;
  }}
  .badge {{
    background: rgba(201, 168, 76, 0.15);
    border: 1px solid #C9A84C;
    color: #F4E8C1;
    padding: 8px 20px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }}
  .slide-count {{
    font-size: 16px;
    font-weight: 700;
    color: rgba(201, 168, 76, 0.8);
    letter-spacing: 0.05em;
  }}
  .content {{
    display: flex;
    flex-direction: column;
    gap: 32px;
    position: relative;
    z-index: 10;
    max-width: 1720px;
    margin-top: 10px;
  }}
  .category {{
    color: #C9A84C;
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 12px;
  }}
  .category::before {{
    content: '';
    display: inline-block;
    width: 28px;
    height: 2px;
    background: #C9A84C;
  }}
  .title {{
    font-family: 'Cinzel', serif;
    font-size: 52px;
    font-weight: 800;
    color: #FFFFFF;
    line-height: 1.15;
    text-shadow: 0 4px 20px rgba(0,0,0,0.5);
  }}
  .subtitle {{
    font-size: 24px;
    font-weight: 500;
    color: #DDD5C7;
    margin-top: -12px;
  }}
  .grid {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    margin-top: 12px;
  }}
  .card {{
    background: rgba(18, 43, 36, 0.7);
    border: 1px solid rgba(201, 168, 76, 0.3);
    border-radius: 16px;
    padding: 32px;
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  }}
  .card-header {{
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 12px;
  }}
  .card-icon {{
    font-size: 24px;
  }}
  .card-title {{
    font-size: 18px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #C9A84C;
  }}
  .card-body {{
    font-size: 19px;
    line-height: 1.6;
    color: #E6E1D8;
    white-space: pre-line;
  }}
  .pro-tip {{
    background: linear-gradient(90deg, rgba(201, 168, 76, 0.12) 0%, rgba(201, 168, 76, 0.03) 100%);
    border-left: 4px solid #C9A84C;
    padding: 16px 24px;
    border-radius: 0 12px 12px 0;
    font-size: 18px;
    color: #F4E8C1;
    display: flex;
    align-items: center;
    gap: 14px;
  }}
  .footer {{
    display: flex;
    justifyContent: space-between;
    align-items: center;
    border-top: 1px solid rgba(201, 168, 76, 0.25);
    padding-top: 20px;
    position: relative;
    z-index: 10;
  }}
  .live-pill {{
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(201, 168, 76, 0.4);
    padding: 8px 18px;
    border-radius: 8px;
    font-family: monospace;
    font-size: 15px;
    color: #6EE7B7;
  }}
  .live-dot {{
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #10B981;
    box-shadow: 0 0 10px #10B981;
  }}
  .confidential {{
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.15em;
    color: rgba(201, 168, 76, 0.7);
    text-transform: uppercase;
  }}
</style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <div class="brand-emblem">D</div>
      <div class="brand-text">DAROODI HAUTE COUTURE</div>
    </div>
    <div class="badge">SUPER ADMIN MASTER PRESENTATION</div>
    <div class="slide-count">{index} / {total}</div>
  </div>

  <div class="content">
    <div>
      <div class="category">{slide['category']}</div>
      <h1 class="title">{slide['title']}</h1>
      <div class="subtitle">{slide['subtitle']}</div>
    </div>

    <div class="grid">
      <div class="card">
        <div class="card-header">
          <span class="card-icon">💎</span>
          <span class="card-title">What It Is &amp; Core Purpose</span>
        </div>
        <div class="card-body">{slide['what_it_is']}</div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-icon">⚡</span>
          <span class="card-title">What To Do &amp; Key Operational Actions</span>
        </div>
        <div class="card-body">{slide['what_to_do']}</div>
      </div>
    </div>

    <div class="pro-tip">
      <span>💡</span>
      <span><strong>Operational Pro-Tip:</strong> {slide['pro_tip']}</span>
    </div>
  </div>

  <div class="footer">
    <div class="live-pill">
      <div class="live-dot"></div>
      <span>Target: {slide['url']}</span>
    </div>
    <div class="confidential">Strictly Confidential — Authorized Atelier Personnel Only</div>
  </div>
</body>
</html>"""
