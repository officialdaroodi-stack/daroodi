import asyncio
import os
import base64
from playwright.async_api import async_playwright

BASE_DIR = "/home/ijtiba-rana/Desktop/daroodi (2)/daroodi-app/scripts/presentation"
SCREENSHOTS_DIR = os.path.join(BASE_DIR, "screenshots")
PDF_OUTPUT = "/home/ijtiba-rana/Desktop/daroodi (2)/daroodi-app/scripts/presentation/Daroodi_ERP_Platform_Master_Guide_and_Passwords.pdf"

def get_b64_image(filename):
    path = os.path.join(SCREENSHOTS_DIR, filename)
    if os.path.exists(path):
        with open(path, "rb") as f:
            return f"data:image/png;base64,{base64.b64encode(f.read()).decode('utf-8')}"
    return ""

async def build_pdf():
    print("=== Generating Master PDF with Passwords & Dashboard Tabs ===")
    
    # Preload screenshots
    img_home = get_b64_image('01_storefront_home.png')
    img_shop = get_b64_image('02_storefront_shop.png')
    img_login = get_b64_image('03_auth_login_page.png')
    img_overview = get_b64_image('04_admin_overview.png')
    img_users = get_b64_image('05_admin_users.png')
    img_products = get_b64_image('06_admin_products_catalog.png')
    img_orders = get_b64_image('07_admin_orders.png')
    img_finance = get_b64_image('08_admin_finance.png')
    img_payouts = get_b64_image('09_admin_payouts.png')
    img_marketing = get_b64_image('10_admin_marketing.png')
    img_country = get_b64_image('11_admin_country_managers.png')
    img_posts = get_b64_image('12_admin_posts.png')
    img_pages = get_b64_image('13_admin_pages.png')
    img_reviews = get_b64_image('14_admin_reviews_qna.png')
    img_analytics = get_b64_image('15_admin_visitor_analytics.png')
    img_settings = get_b64_image('16_admin_settings_tracking.png')

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
    background: radial-gradient(circle at 20% 30%, #16382E 0%, #081512 100%);
    color: #FFFFFF;
    padding: 60px 50px;
    display: flex;
    flex-direction: column;
    justifyContent: space-between;
    border: 3px solid #C9A84C;
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
    background: linear-gradient(135deg, #C9A84C, #96752D);
    color: #081512;
    font-family: 'Cinzel', serif;
    font-size: 32px;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(201, 168, 76, 0.5);
  }}
  .brand-title {{
    font-family: 'Cinzel', serif;
    font-size: 30px;
    font-weight: 800;
    letter-spacing: 0.15em;
    color: #F4E8C1;
  }}
  .cover-badge {{
    display: inline-block;
    background: rgba(201, 168, 76, 0.2);
    border: 1px solid #C9A84C;
    color: #F4E8C1;
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
    font-size: 42px;
    font-weight: 800;
    line-height: 1.15;
    color: #FFFFFF;
    margin-bottom: 16px;
  }}
  .cover-subtitle {{
    font-size: 16px;
    color: #DDD4C6;
    max-width: 580px;
    line-height: 1.6;
  }}
  .cover-footer {{
    border-top: 1px solid rgba(201, 168, 76, 0.3);
    padding-top: 24px;
    display: flex;
    justifyContent: space-between;
    font-size: 11px;
    color: #C9A84C;
  }}

  /* Section Header */
  .section-title {{
    font-family: 'Cinzel', serif;
    font-size: 20pt;
    color: #0F241E;
    border-bottom: 2px solid #C9A84C;
    padding-bottom: 8px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }}
  .section-badge {{
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 10pt;
    font-weight: 800;
    color: #C9A84C;
    background: #0F241E;
    padding: 4px 12px;
    border-radius: 12px;
    letter-spacing: 0.05em;
  }}

  /* Vault Card */
  .vault-card {{
    background: #0F241E;
    color: #FFFFFF;
    border: 2px solid #C9A84C;
    border-radius: 10px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  }}
  .vault-header {{
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid rgba(201, 168, 76, 0.3);
    padding-bottom: 12px;
    margin-bottom: 16px;
  }}
  .vault-title {{
    font-family: 'Cinzel', serif;
    color: #F4E8C1;
    font-size: 15pt;
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
    color: #C9A84C;
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
    border: 1px solid #E2D9CC;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    margin-bottom: 12px;
  }}
  .box {{
    background: #FAF8F5;
    border-left: 4px solid #0F241E;
    padding: 12px 16px;
    margin-bottom: 10px;
    border-radius: 0 6px 6px 0;
  }}
  .box.gold {{
    background: #FDFBF4;
    border-left-color: #C9A84C;
  }}
  .box-label {{
    font-weight: 800;
    text-transform: uppercase;
    font-size: 8.5pt;
    color: #0F241E;
    letter-spacing: 0.08em;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
  }}
  .box.gold .box-label {{
    color: #8C6F2D;
  }}
  .box-desc {{
    font-size: 9.5pt;
    color: #334D44;
    line-height: 1.5;
  }}

  .action-list {{
    list-style: none;
    padding-left: 0;
  }}
  .action-list li {{
    position: relative;
    padding-left: 18px;
    margin-bottom: 4px;
    font-size: 9.5pt;
    color: #2D3748;
  }}
  .action-list li::before {{
    content: "▸";
    position: absolute;
    left: 0;
    color: #C9A84C;
    font-weight: 900;
  }}

  .footer-meta {{
    display: flex;
    justifyContent: space-between;
    border-top: 1px solid #E2D9CC;
    padding-top: 8px;
    font-size: 8pt;
    color: #718096;
    margin-top: 16px;
  }}
</style>
</head>
<body>

  <!-- PAGE 1: COVER -->
  <div class="page cover">
    <div class="cover-header">
      <div class="emblem">D</div>
      <div class="brand-title">DAROODI HAUTE COUTURE</div>
    </div>
    
    <div>
      <div class="cover-badge">RESTRICTED / EXECUTIVE CLEARANCE</div>
      <h1 class="cover-title">Atelier ERP &amp; Digital Flagship Master Platform Guide</h1>
      <p class="cover-subtitle">
        Comprehensive operations manual, master credential vault, and architectural walkthrough for the Daroodi Super Admin ERP suite, covering all 13 management modules on <strong>daroodi.com</strong>.
      </p>
    </div>

    <div class="cover-footer">
      <div>Maison Daroodi • Bespoke Luxury Embroidered Prince Coats</div>
      <div>Production Release • Updated September 2026</div>
    </div>
  </div>

  <!-- PAGE 2: CREDENTIALS VAULT & ARCHITECTURE -->
  <div class="page">
    <div class="section-title">
      <span>1. Master Credentials Vault</span>
      <span class="section-badge">CRITICAL ACCESS</span>
    </div>

    <div class="vault-card">
      <div class="vault-header">
        <span style="font-size: 18pt;">🔐</span>
        <span class="vault-title">Production Environment Security Keys</span>
      </div>
      <table class="cred-table">
        <tr>
          <td>Live Storefront URL</td>
          <td>https://www.daroodi.com</td>
        </tr>
        <tr>
          <td>Super Admin Direct Portal</td>
          <td>https://www.daroodi.com/admin</td>
        </tr>
        <tr>
          <td>Staff Authentication Gateway</td>
          <td>https://www.daroodi.com/auth/login</td>
        </tr>
        <tr>
          <td>Super Admin Email</td>
          <td>admin@daroodi.com</td>
        </tr>
        <tr>
          <td>Super Admin Master Password</td>
          <td>DaroodiMasterAdmin2026!#</td>
        </tr>
        <tr>
          <td>Customer Account Portal</td>
          <td>https://www.daroodi.com/account</td>
        </tr>
        <tr>
          <td>Supabase Database URL</td>
          <td>https://iqoerhpaetfbwwiqaeyn.supabase.co</td>
        </tr>
        <tr>
          <td>AI CRM &amp; Lead Agent Portal</td>
          <td>https://daroodi-lead-agent.vercel.app</td>
        </tr>
        <tr>
          <td>CRM Agent Username</td>
          <td>daroodi_admin</td>
        </tr>
        <tr>
          <td>CRM Agent Password</td>
          <td>Daroodi@2026#Luxury</td>
        </tr>
        <tr>
          <td>GitHub Code Repository</td>
          <td>officialdaroodi-stack/daroodi (Branch: main)</td>
        </tr>
        <tr>
          <td>Hosting &amp; Edge CDN</td>
          <td>Vercel Production (Auto-Deploy on Push to main)</td>
        </tr>
      </table>
    </div>

    <div class="box gold">
      <div class="box-label">👑 Role-Based Access Control (RBAC) Hierarchy</div>
      <div class="box-desc">
        The platform enforces 6 distinct user privilege tiers:<br>
        <strong>1. Super Admin:</strong> Unrestricted master governance across all 13 modules, database records, and settings.<br>
        <strong>2. Production Manager:</strong> Catalog maintenance, inventory control, and ACF craftsmanship specifications.<br>
        <strong>3. Master Tailor:</strong> Active client commission oversight, tailoring stages, and client measurements matrix.<br>
        <strong>4. Finance Manager:</strong> Revenue auditing, commission payouts ledger, and financial reporting.<br>
        <strong>5. Country Head / Agent:</strong> Regional client sales management and referral commission tracking.<br>
        <strong>6. Customer:</strong> Personal profile, measurement storage, and bespoke order tracking.
      </div>
    </div>

    <div class="box">
      <div class="box-label">⚡ Automatic Role Routing Architecture</div>
      <div class="box-desc">
        When signing in at <code>/auth/login</code>, the system automatically checks the user's role:
        Customers land safely on <code>/account</code> to inspect their commissions. Any staff or Super Admin member is automatically routed to <code>/admin</code>. If an administrator visits <code>/account</code>, the server automatically forwards them directly to the admin dashboard.
      </div>
    </div>

    <div class="footer-meta">
      <span>Daroodi Haute Couture • Master Operations Guide</span>
      <span>Page 2</span>
    </div>
  </div>

  <!-- PAGE 3: TAB 1 - OVERVIEW & TAB 2 - USERS -->
  <div class="page">
    <div class="section-title">
      <span>2. Overview &amp; User Governance</span>
      <span class="section-badge">TABS 1 &amp; 2</span>
    </div>

    <div style="margin-bottom: 24px;">
      <h3 style="color: #0F241E; font-size: 13pt; margin-bottom: 6px;">Tab 1: Overview &amp; Executive KPIs (<code>/admin</code>)</h3>
      <img src="{img_overview}" class="tab-screenshot" style="max-height: 220px; object-fit: cover;" alt="Overview Tab" />
      <div class="box">
        <div class="box-label">What It Is</div>
        <div class="box-desc">The primary executive cockpit displaying live Gross Merchandise Value (GMV), active bespoke commissions, total orders, commission liabilities, and conversion rates in real time.</div>
      </div>
      <div class="box gold">
        <div class="box-label">What To Do</div>
        <ul class="action-list">
          <li>Review daily gross revenues and incoming client commissions.</li>
          <li>Monitor active order throughput across tailoring production queues.</li>
          <li>Identify urgent customer requests requiring master tailor review.</li>
        </ul>
      </div>
    </div>

    <div>
      <h3 style="color: #0F241E; font-size: 13pt; margin-bottom: 6px;">Tab 2: User Hierarchy &amp; Roles (<code>/admin/users</code>)</h3>
      <img src="{img_users}" class="tab-screenshot" style="max-height: 220px; object-fit: cover;" alt="Users Tab" />
      <div class="box">
        <div class="box-label">What It Is</div>
        <div class="box-desc">Enterprise user management suite. Displays all registered accounts, emails, roles, and registration dates with direct role promotion and permission controls.</div>
      </div>
      <div class="box gold">
        <div class="box-label">What To Do</div>
        <ul class="action-list">
          <li>Promote atelier team members to Production Manager, Master Tailor, or Finance Manager.</li>
          <li>Audit staff access logs and adjust permissions when team responsibilities change.</li>
          <li>Maintain separation of duties to ensure robust security compliance.</li>
        </ul>
      </div>
    </div>

    <div class="footer-meta">
      <span>Daroodi Haute Couture • Master Operations Guide</span>
      <span>Page 3</span>
    </div>
  </div>

  <!-- PAGE 4: TAB 3 - PRODUCTS & ACF SPECS -->
  <div class="page">
    <div class="section-title">
      <span>3. Catalog &amp; Direct Image Uploads</span>
      <span class="section-badge">TAB 3</span>
    </div>

    <div>
      <h3 style="color: #0F241E; font-size: 13pt; margin-bottom: 6px;">Tab 3: Products &amp; ACF Specs (<code>/admin/products</code>)</h3>
      <img src="{img_products}" class="tab-screenshot" style="max-height: 240px; object-fit: cover;" alt="Products Tab" />
      
      <div class="box">
        <div class="box-label">What It Is</div>
        <div class="box-desc">The core inventory and masterpiece catalog system. Controls titles, slugs, prices, collections (Platinum, Gold, Silver, Bespoke Essentials), fabric compositions, hand-embroidery hours, care instructions, and image galleries.</div>
      </div>

      <div class="box gold" style="border-left: 4px solid #10B981; background: #F0FDF4;">
        <div class="box-label" style="color: #065F46;">✨ Direct File Upload Feature (New!)</div>
        <div class="box-desc" style="color: #065F46;">
          Under Tab 4 (Media &amp; Gallery) of the Product Editor:
          <br>• <strong>Primary Featured Image:</strong> Click the <strong>📁 Upload New</strong> button to select an image from your computer. It immediately saves to storage and sets the primary preview.
          <br>• <strong>Multi-Photo Gallery:</strong> Click the gold <strong>📁 Upload Photos</strong> button to select multiple high-resolution angles at once. They appear instantly in the visual thumbnail grid with 1-click delete buttons.
        </div>
      </div>

      <div class="box">
        <div class="box-label">What To Do</div>
        <ul class="action-list">
          <li>Click <strong>+ Create Masterpiece</strong> to introduce a new coat design to the storefront.</li>
          <li>Enter bespoke pricing: Base Price, Regular Price, and optional Sale Price.</li>
          <li>Fill ACF Specifications: Embroidery Technique (Zardozi, Tilla, Resham), Fabric, and Lead Time.</li>
          <li>Upload gallery photos directly from your device and click <strong>Save &amp; Publish</strong>.</li>
        </ul>
      </div>
    </div>

    <div class="footer-meta">
      <span>Daroodi Haute Couture • Master Operations Guide</span>
      <span>Page 4</span>
    </div>
  </div>

  <!-- PAGE 5: TAB 4 - ORDERS & TAB 5 - FINANCE -->
  <div class="page">
    <div class="section-title">
      <span>4. Orders, Measurements &amp; Finance</span>
      <span class="section-badge">TABS 4 &amp; 5</span>
    </div>

    <div style="margin-bottom: 24px;">
      <h3 style="color: #0F241E; font-size: 13pt; margin-bottom: 6px;">Tab 4: Orders &amp; Bespoke Measurements (<code>/admin/orders</code>)</h3>
      <img src="{img_orders}" class="tab-screenshot" style="max-height: 220px; object-fit: cover;" alt="Orders Tab" />
      <div class="box">
        <div class="box-label">What It Is</div>
        <div class="box-desc">The tailoring production pipeline. Tracks all bespoke client commissions with exact body measurement matrices (Chest, Waist, Hip, Shoulder, Sleeve, Neck, Inseam, Height), client contact details, and tailoring milestones.</div>
      </div>
      <div class="box gold">
        <div class="box-label">What To Do</div>
        <ul class="action-list">
          <li>Review client body measurements with the master cutter prior to fabric cutting.</li>
          <li>Update order stages: Consultation → Cutting → Embroidery → Assembly → Fitting → Dispatched.</li>
          <li>Click direct WhatsApp links to notify clients with tailoring photos and courier tracking.</li>
        </ul>
      </div>
    </div>

    <div>
      <h3 style="color: #0F241E; font-size: 13pt; margin-bottom: 6px;">Tab 5: Revenue &amp; Financial Analytics (<code>/admin/finance</code>)</h3>
      <img src="{img_finance}" class="tab-screenshot" style="max-height: 220px; object-fit: cover;" alt="Finance Tab" />
      <div class="box">
        <div class="box-label">What It Is</div>
        <div class="box-desc">Financial reporting ledger summarizing gross revenue, net atelier profit, average order values (AOV), and payment method distribution (Stripe, Bank Transfer, Cash on Delivery).</div>
      </div>
      <div class="box gold">
        <div class="box-label">What To Do</div>
        <ul class="action-list">
          <li>Audit monthly revenue curves to identify wedding season demand spikes.</li>
          <li>Verify payment settlement statuses and reconcile banking records.</li>
          <li>Analyze profitability across bespoke tiers (Platinum vs. Gold vs. Silver).</li>
        </ul>
      </div>
    </div>

    <div class="footer-meta">
      <span>Daroodi Haute Couture • Master Operations Guide</span>
      <span>Page 5</span>
    </div>
  </div>

  <!-- PAGE 6: TABS 6 & 7 - COMMISSIONS & MARKETING -->
  <div class="page">
    <div class="section-title">
      <span>5. Commissions &amp; Global Campaigns</span>
      <span class="section-badge">TABS 6 &amp; 7</span>
    </div>

    <div style="margin-bottom: 24px;">
      <h3 style="color: #0F241E; font-size: 13pt; margin-bottom: 6px;">Tab 6: Commission Approvals &amp; Payouts (<code>/admin/finance/payouts</code>)</h3>
      <img src="{img_payouts}" class="tab-screenshot" style="max-height: 220px; object-fit: cover;" alt="Payouts Tab" />
      <div class="box">
        <div class="box-label">What It Is</div>
        <div class="box-desc">Automated sales agent compensation ledger. Calculates referral commissions earned by regional ambassadors and country managers on completed bespoke orders.</div>
      </div>
      <div class="box gold">
        <div class="box-label">What To Do</div>
        <ul class="action-list">
          <li>Audit pending commission claims against confirmed dispatched orders.</li>
          <li>Approve verified agent earnings and disburse payments via wire transfer.</li>
          <li>Maintain transparent commission logs for tax compliance and auditing.</li>
        </ul>
      </div>
    </div>

    <div>
      <h3 style="color: #0F241E; font-size: 13pt; margin-bottom: 6px;">Tab 7: Global Marketing Campaigns (<code>/admin/marketing</code>)</h3>
      <img src="{img_marketing}" class="tab-screenshot" style="max-height: 220px; object-fit: cover;" alt="Marketing Tab" />
      <div class="box">
        <div class="box-label">What It Is</div>
        <div class="box-desc">Promotion and discount voucher engine. Enables administrators to create percentage or fixed discount coupons, seasonal flash banners, and private VIP invitation vouchers.</div>
      </div>
      <div class="box gold">
        <div class="box-label">What To Do</div>
        <ul class="action-list">
          <li>Generate custom promo codes (e.g. ROYALWEDDING2026, VIPDAROODI).</li>
          <li>Set expiration dates, minimum spend thresholds, and maximum usage quotas.</li>
          <li>Publish top announcement banners across the storefront.</li>
        </ul>
      </div>
    </div>

    <div class="footer-meta">
      <span>Daroodi Haute Couture • Master Operations Guide</span>
      <span>Page 6</span>
    </div>
  </div>

  <!-- PAGE 7: TABS 8, 9 & 10 - AGENTS, POSTS, PAGES -->
  <div class="page">
    <div class="section-title">
      <span>6. Agents, Editorial &amp; Storefront Pages</span>
      <span class="section-badge">TABS 8, 9, 10</span>
    </div>

    <div style="margin-bottom: 20px;">
      <h3 style="color: #0F241E; font-size: 12pt; margin-bottom: 4px;">Tab 8: Country Heads &amp; Regional Agents (<code>/admin/marketing/country-managers</code>)</h3>
      <img src="{img_country}" class="tab-screenshot" style="max-height: 180px; object-fit: cover;" alt="Country Managers" />
      <div class="box-desc" style="font-size: 9pt;">Oversee international sales directors in key luxury hubs (London, Dubai, New York, Lahore). Assign territories, set quarterly bespoke quotas, and monitor regional closing rates.</div>
    </div>

    <div style="margin-bottom: 20px;">
      <h3 style="color: #0F241E; font-size: 12pt; margin-bottom: 4px;">Tab 9: Editorial Journal CMS (<code>/admin/posts</code>)</h3>
      <img src="{img_posts}" class="tab-screenshot" style="max-height: 180px; object-fit: cover;" alt="Posts Tab" />
      <div class="box-desc" style="font-size: 9pt;">Publish articles in the Daroodi Journal celebrating royal craftsmanship traditions, groom styling guides, and fabric care. Optimize meta titles and tags to boost organic search rankings.</div>
    </div>

    <div>
      <h3 style="color: #0F241E; font-size: 12pt; margin-bottom: 4px;">Tab 10: Storefront Pages CMS (<code>/admin/pages</code>)</h3>
      <img src="{img_pages}" class="tab-screenshot" style="max-height: 180px; object-fit: cover;" alt="Pages Tab" />
      <div class="box-desc" style="font-size: 9pt;">Maintain copy and hero photography across static pages: Our Heritage, Atelier Archive, Sahib Ali Foundation, Terms &amp; Conditions, and International Shipping Policies.</div>
    </div>

    <div class="footer-meta">
      <span>Daroodi Haute Couture • Master Operations Guide</span>
      <span>Page 7</span>
    </div>
  </div>

  <!-- PAGE 8: TABS 11, 12, 13 - REVIEWS, ANALYTICS, SETTINGS -->
  <div class="page">
    <div class="section-title">
      <span>7. Reviews, Analytics &amp; Tracking Integrations</span>
      <span class="section-badge">TABS 11, 12, 13</span>
    </div>

    <div style="margin-bottom: 20px;">
      <h3 style="color: #0F241E; font-size: 12pt; margin-bottom: 4px;">Tab 11: Customer Reviews &amp; Q&amp;A (<code>/admin/cms</code>)</h3>
      <img src="{img_reviews}" class="tab-screenshot" style="max-height: 180px; object-fit: cover;" alt="Reviews Tab" />
      <div class="box-desc" style="font-size: 9pt;">Review and publish client testimonials. Pin 5-star wedding reviews to product pages and reply to customer inquiries regarding fabric samples and delivery schedules.</div>
    </div>

    <div style="margin-bottom: 20px;">
      <h3 style="color: #0F241E; font-size: 12pt; margin-bottom: 4px;">Tab 12: Visitor Traffic Analytics (<code>/admin/analytics</code>)</h3>
      <img src="{img_analytics}" class="tab-screenshot" style="max-height: 180px; object-fit: cover;" alt="Analytics Tab" />
      <div class="box-desc" style="font-size: 9pt;">Analyze real-time visitor traffic, top product views, geographic client locations (UK, US, UAE, PK), and mobile vs. desktop visitor ratios.</div>
    </div>

    <div>
      <h3 style="color: #0F241E; font-size: 12pt; margin-bottom: 4px;">Tab 13: Tracking Pixels &amp; Integrations (<code>/admin/settings</code>)</h3>
      <img src="{img_settings}" class="tab-screenshot" style="max-height: 180px; object-fit: cover;" alt="Settings Tab" />
      <div class="box-desc" style="font-size: 9pt;">Install marketing pixels without developer intervention. Enter your GA4 Measurement ID, GTM Container ID, Meta Pixel, and TikTok Pixel. Scripts go live immediately upon saving.</div>
    </div>

    <div class="footer-meta">
      <span>Daroodi Haute Couture • Master Operations Guide</span>
      <span>Page 8</span>
    </div>
  </div>

  <!-- PAGE 9: STOREFRONT CUSTOMER EXPERIENCE -->
  <div class="page">
    <div class="section-title">
      <span>8. Live Storefront Flagship</span>
      <span class="section-badge">DAROODI.COM</span>
    </div>

    <div style="margin-bottom: 20px;">
      <h3 style="color: #0F241E; font-size: 13pt; margin-bottom: 6px;">Storefront Flagship Homepage (<code>https://www.daroodi.com</code>)</h3>
      <img src="{img_home}" class="tab-screenshot" style="max-height: 240px; object-fit: cover;" alt="Homepage" />
      <div class="box">
        <div class="box-label">Client Digital Experience</div>
        <div class="box-desc">Features an interactive 3D hero carousel, Trustpilot five-star credentials, royal heritage narrative, and high-conversion collection entry points (Platinum, Gold, Silver).</div>
      </div>
    </div>

    <div>
      <h3 style="color: #0F241E; font-size: 13pt; margin-bottom: 6px;">Masterpiece Catalog (<code>https://www.daroodi.com/shop</code>)</h3>
      <img src="{img_shop}" class="tab-screenshot" style="max-height: 240px; object-fit: cover;" alt="Shop" />
      <div class="box gold">
        <div class="box-label">Product Showcase &amp; Sizing Matrix</div>
        <div class="box-desc">Each coat features multi-angle photography, fabric weights, hand-embroidery hours, lead time estimates, and an interactive bespoke inquiry modal.</div>
      </div>
    </div>

    <div class="footer-meta">
      <span>Daroodi Haute Couture • Master Operations Guide</span>
      <span>Page 9</span>
    </div>
  </div>

  <!-- PAGE 10: DAILY OPERATIONS CHECKLIST & RUNBOOK -->
  <div class="page">
    <div class="section-title">
      <span>9. Operational SOPs &amp; Checklist</span>
      <span class="section-badge">BEST PRACTICES</span>
    </div>

    <div class="box gold" style="margin-bottom: 16px;">
      <div class="box-label">🌅 Daily Morning Executive Routine</div>
      <ul class="action-list">
        <li><strong>09:00 AM:</strong> Sign into <code>https://www.daroodi.com/auth/login</code> as Super Admin.</li>
        <li><strong>09:05 AM:</strong> Review Overview KPIs for overnight client inquiries and orders.</li>
        <li><strong>09:15 AM:</strong> In Orders &amp; Measurements, inspect new sizing submissions and verify with Master Tailor.</li>
        <li><strong>09:30 AM:</strong> Advance completed garments to 'Dispatched' and trigger WhatsApp notifications.</li>
      </ul>
    </div>

    <div class="box" style="margin-bottom: 16px;">
      <div class="box-label">👗 Masterpiece Publishing SOP</div>
      <ul class="action-list">
        <li>Prepare high-resolution photos of new coat designs (front, back, embroidery close-ups).</li>
        <li>Open Products &amp; ACF Specs tab (<code>/admin/products</code>) and click '+ Create Masterpiece'.</li>
        <li>Use the direct upload button to upload photos straight from your device into the gallery.</li>
        <li>Set accurate fabric composition, embroidery hours, and lead time in weeks.</li>
        <li>Click 'Save &amp; Publish' — the product is live on daroodi.com immediately.</li>
      </ul>
    </div>

    <div class="box" style="margin-bottom: 16px;">
      <div class="box-label">🛡️ Security &amp; Disaster Recovery</div>
      <ul class="action-list">
        <li>Super Admin credentials must only be shared with authorized C-suite executives.</li>
        <li>Database backups are automatically maintained by Supabase PostgreSQL.</li>
        <li>Application code is securely versioned in GitHub (<code>officialdaroodi-stack/daroodi</code>) with instant Vercel rollbacks if required.</li>
      </ul>
    </div>

    <div style="text-align: center; margin-top: 40px; padding: 20px; border: 1px solid #E2D9CC; border-radius: 8px; background: #FAF8F5;">
      <div style="font-family: 'Cinzel', serif; font-size: 16pt; font-weight: 800; color: #0F241E; margin-bottom: 4px;">DAROODI HAUTE COUTURE</div>
      <div style="font-size: 9.5pt; color: #718096;">Excellence in Bespoke Embroidered Couture • London • Dubai • Lahore</div>
      <div style="font-size: 8.5pt; color: #C9A84C; font-weight: 700; margin-top: 8px;">End of Official Master Platform Documentation</div>
    </div>

    <div class="footer-meta">
      <span>Daroodi Haute Couture • Master Operations Guide</span>
      <span>Page 10</span>
    </div>
  </div>

</body>
</html>"""

    html_path = os.path.join(BASE_DIR, "master_guide_report.html")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print("Master guide HTML created:", html_path)

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            executable_path='/usr/bin/google-chrome',
            args=['--no-sandbox', '--disable-setuid-sandbox']
        )
        page = await browser.new_page()
        await page.goto(f"file://{html_path}", wait_until='networkidle')
        await page.wait_for_timeout(2000)

        print("Rendering PDF...")
        await page.pdf(
            path=PDF_OUTPUT,
            format="A4",
            print_background=True,
            margin={"top": "0mm", "bottom": "0mm", "left": "0mm", "right": "0mm"}
        )
        print("Master PDF generated successfully:", PDF_OUTPUT)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(build_pdf())
