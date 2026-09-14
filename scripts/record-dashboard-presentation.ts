#!/usr/bin/env tsx
/**
 * Daroodi Admin Dashboard — Automated Video Presentation
 * 
 * This script uses Playwright to:
 * 1. Display HTML slides explaining each dashboard section
 * 2. Navigate through the live admin dashboard
 * 3. Record the entire presentation as a video
 * 
 * Requirements:
 *   npm install playwright @playwright/test
 *   npx playwright install chromium
 * 
 * Usage:
 *   npm run record-presentation
 */

import { chromium, Browser, Page } from 'playwright';
import { writeFileSync } from 'fs';
import { join } from 'path';

const SLIDES_HTML_PATH = join(process.cwd(), 'scripts', 'presentation-slides.html');
const VIDEO_OUTPUT_PATH = join(process.cwd(), 'dashboard-presentation.webm');
const DASHBOARD_URL = process.env.DASHBOARD_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@daroodi.com';
const ADMIN_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD || 'DaroodiMasterAdmin2026!#';

// Slide content
const SLIDES = [
  {
    title: 'Daroodi Admin Dashboard',
    subtitle: 'WordPress-like CMS for Luxury E-commerce',
    bullets: [
      'Full-featured content management system',
      'Real-time analytics & tracking',
      'Product, order & user management',
      'Blog CMS + dynamic pages',
      'Google Analytics, TikTok & Facebook Pixel integration'
    ],
    duration: 6000,
  },
  {
    title: 'Authentication & Access Control',
    subtitle: 'Secure, role-based permissions',
    bullets: [
      'Session-based auth powered by Supabase',
      'Role hierarchy: super_admin → admin → country_manager → customer',
      'Middleware protects /admin/* and /account/* routes',
      'Password reset via magic link',
      'Cannot delete yourself or other super admins'
    ],
    duration: 7000,
  },
  {
    title: 'Dashboard Overview',
    subtitle: 'Real-time business metrics',
    bullets: [
      'Total revenue from completed orders',
      'Active products & stock levels',
      'Pending orders requiring action',
      'Recent orders table with quick filters',
      'Quick actions: Add product, view orders, manage users'
    ],
    duration: 6000,
  },
  {
    title: 'Products Management',
    subtitle: 'Complete product catalog control',
    bullets: [
      'CRUD operations: Create, Read, Update, Delete',
      'Image upload (hero + gallery)',
      'SKU, stock quantity, pricing',
      'Collection assignment (Platinum, Gold, Silver, Essentials)',
      'SEO fields (meta title, meta description)',
      'Publish/unpublish toggle'
    ],
    duration: 7000,
  },
  {
    title: 'Collections System',
    subtitle: 'Organize products by tier',
    bullets: [
      '4 curated tiers: Platinum, Gold, Silver, Essentials',
      'Each collection has: title, description, hero image, price range',
      'Sort order controls homepage display',
      'Products assigned to exactly one collection',
      'Collection pages auto-generate at /shop'
    ],
    duration: 6000,
  },
  {
    title: 'Orders & Sales',
    subtitle: 'Track every transaction',
    bullets: [
      'View all orders across the site',
      'Filter by status: pending, processing, shipped, delivered, cancelled',
      'Search by order ID, customer email, or name',
      'Update order status (mark as shipped/delivered)',
      'View line items, shipping address, payment status',
      'Export orders to CSV'
    ],
    duration: 7000,
  },
  {
    title: 'Journal (Blog) CMS',
    subtitle: 'WordPress-like blog editor',
    bullets: [
      'Write & publish blog posts',
      'Markdown or HTML content support',
      'Featured image (homepage) + cover image (post page)',
      'SEO fields per post',
      'Draft vs. published workflow',
      'Auto-generate slug from title',
      'Posts render at /journal/[slug]'
    ],
    duration: 7000,
  },
  {
    title: 'Dynamic Pages CMS',
    subtitle: 'Create any page with custom slug',
    bullets: [
      'Create pages like /about-us, /wholesale, /terms',
      'Full content editor (Markdown/HTML)',
      'Pages render with site header & footer',
      'SEO fields per page',
      'Publish/unpublish toggle',
      'No code required — just write and publish'
    ],
    duration: 6000,
  },
  {
    title: 'Analytics & Tracking',
    subtitle: 'First-party event tracking + integrations',
    bullets: [
      'Track page views, visitors, sessions',
      'Custom events: add_to_cart, checkout, purchase',
      'Top pages, referrers, devices, browsers',
      'Real-time visitor count',
      'Conversion funnel visualization',
      'Integrate GA4, TikTok Pixel, Facebook Pixel'
    ],
    duration: 7000,
  },
  {
    title: 'Settings & Integrations',
    subtitle: 'Inject tracking codes & configure site',
    bullets: [
      'Paste Google Analytics 4 tracking ID',
      'Paste TikTok Pixel ID',
      'Paste Facebook Pixel ID',
      'Custom JavaScript injection (Hotjar, Intercom, etc.)',
      'SMTP email configuration',
      'Site-wide SEO defaults'
    ],
    duration: 6000,
  },
  {
    title: 'User Management',
    subtitle: 'Control access & permissions',
    bullets: [
      'List all users (admins, country managers, customers)',
      'Create new users with email + password',
      'Assign roles: super_admin, admin, country_manager, customer',
      'Edit user roles (promote/demote)',
      'Delete users (with safety checks)',
      'View user order history'
    ],
    duration: 6000,
  },
  {
    title: 'Finance & Commissions',
    subtitle: 'Track revenue & payouts',
    bullets: [
      'Total revenue dashboard',
      'Country manager commission tracking',
      'Pending vs. paid commissions',
      'Mark payouts as paid (bulk action)',
      'Export financial reports to CSV',
      'Commission rate configuration per manager'
    ],
    duration: 6000,
  },
  {
    title: 'Storefront Pages',
    subtitle: 'Public-facing pages powered by CMS',
    bullets: [
      'Homepage: collections, featured products, journal posts',
      '/shop: product catalog with filters',
      '/journal: blog index',
      '/track-order: customer order lookup',
      '/account: customer dashboard (auth required)',
      'Dynamic CMS pages at /[slug]'
    ],
    duration: 6000,
  },
  {
    title: 'Technical Architecture',
    subtitle: 'Modern, scalable stack',
    bullets: [
      'Next.js 16.3 App Router (47 routes)',
      'Supabase PostgreSQL (10 tables with RLS)',
      'Supabase Auth (cookie-based sessions)',
      'Tailwind CSS styling',
      'Playwright automated testing',
      'Vercel-ready deployment'
    ],
    duration: 6000,
  },
  {
    title: 'Ready to Go Live',
    subtitle: 'Deploy in minutes',
    bullets: [
      '1. Run npm run db:setup (applies migrations + seeds data)',
      '2. Configure environment variables on Vercel',
      '3. Deploy to production',
      '4. Login at /auth/login with admin credentials',
      '5. Start managing your luxury e-commerce site',
      '',
      'Documentation: DASHBOARD_GUIDE.md'
    ],
    duration: 8000,
  },
];

// Generate HTML slides
function generateSlidesHTML(): string {
  const slideElements = SLIDES.map((slide, index) => `
    <div class="slide" data-slide="${index}">
      <div class="slide-content">
        <h1>${slide.title}</h1>
        <h2>${slide.subtitle}</h2>
        <ul>
          ${slide.bullets.map(b => b ? `<li>${b}</li>` : '<li class="spacer"></li>').join('')}
        </ul>
        <div class="slide-number">${index + 1} / ${SLIDES.length}</div>
      </div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1920, initial-scale=1">
  <title>Daroodi Admin Dashboard Presentation</title>
  <style>
    :root {
      --surface-0: #05070C;
      --surface-1: #0A0D12;
      --surface-2: #0F131C;
      --surface-3: #161D2B;
      --surface-4: #1E2636;
      --accent: #E9A568;
      --text: #F8F9FA;
      --text-muted: #9CA3AF;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      background: linear-gradient(135deg, var(--surface-0) 0%, var(--surface-2) 100%);
      color: var(--text);
      overflow: hidden;
      width: 1920px;
      height: 1080px;
    }

    .slide {
      display: none;
      width: 1920px;
      height: 1080px;
      padding: 120px 160px;
      position: relative;
    }

    .slide.active {
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.6s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .slide-content {
      max-width: 1600px;
      width: 100%;
    }

    h1 {
      font-size: clamp(64px, 5vw, 96px);
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 24px;
      background: linear-gradient(135deg, var(--text) 0%, var(--accent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    h2 {
      font-size: clamp(32px, 2.5vw, 48px);
      font-weight: 400;
      color: var(--text-muted);
      margin-bottom: 64px;
      letter-spacing: -0.01em;
    }

    ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    li {
      font-size: clamp(28px, 2vw, 40px);
      line-height: 1.6;
      padding-left: 48px;
      position: relative;
      color: var(--text);
    }

    li:not(.spacer)::before {
      content: '';
      position: absolute;
      left: 0;
      top: 16px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent);
    }

    li.spacer {
      height: 12px;
    }

    .slide-number {
      position: absolute;
      bottom: 80px;
      right: 160px;
      font-size: 24px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .logo {
      position: absolute;
      top: 60px;
      left: 160px;
      font-size: 32px;
      font-weight: 600;
      letter-spacing: 0.05em;
      color: var(--accent);
    }
  </style>
</head>
<body>
  <div class="logo">DAROODI</div>
  ${slideElements}
  
  <script>
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    
    function showSlide(n) {
      slides.forEach(s => s.classList.remove('active'));
      if (slides[n]) slides[n].classList.add('active');
    }
    
    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }
    
    // Show first slide
    showSlide(0);
    
    // Expose for Playwright control
    window.showSlide = showSlide;
    window.nextSlide = nextSlide;
    window.totalSlides = slides.length;
  </script>
</body>
</html>`;
}

// Main recording function
async function recordPresentation() {
  console.log('🎬 Starting Daroodi Dashboard Presentation Recording\n');

  // Generate slides HTML
  const slidesHTML = generateSlidesHTML();
  writeFileSync(SLIDES_HTML_PATH, slidesHTML, 'utf-8');
  console.log(`✓ Generated slides HTML at ${SLIDES_HTML_PATH}\n`);

  // Launch browser
  const browser = await chromium.launch({
    headless: false, // Show browser so we can see the recording
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: process.cwd(),
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();

  try {
    // Part 1: Show slides
    console.log('📊 Part 1: Presentation Slides\n');
    await page.goto(`file://${SLIDES_HTML_PATH}`);
    await page.waitForTimeout(1000);

    for (let i = 0; i < SLIDES.length; i++) {
      console.log(`   Slide ${i + 1}/${SLIDES.length}: ${SLIDES[i].title}`);
      await page.evaluate((slideIndex) => {
        (window as any).showSlide(slideIndex);
      }, i);
      await page.waitForTimeout(SLIDES[i].duration);
    }

    // Part 2: Live dashboard walkthrough
    console.log('\n🖥️  Part 2: Live Dashboard Walkthrough\n');

    // Check if dev server is running
    console.log(`   Checking if dashboard is running at ${DASHBOARD_URL}...`);
    try {
      await page.goto(DASHBOARD_URL, { timeout: 5000 });
    } catch (err) {
      console.log('\n❌ Dashboard not running. Please start it with:');
      console.log('   npm run dev\n');
      console.log('   Then re-run this script.');
      await browser.close();
      process.exit(1);
    }

    // Login
    console.log('   Logging in as admin...');
    await page.goto(`${DASHBOARD_URL}/auth/login`);
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${DASHBOARD_URL}/admin`, { timeout: 10000 });
    await page.waitForTimeout(3000);

    console.log('   ✓ Logged in successfully');

    // Dashboard sections to showcase
    const sections = [
      { name: 'Overview', url: '/admin', duration: 5000 },
      { name: 'Products', url: '/admin/products', duration: 6000 },
      { name: 'Orders', url: '/admin/orders', duration: 6000 },
      { name: 'Blog Posts (Journal CMS)', url: '/admin/posts', duration: 6000 },
      { name: 'Storefront Pages CMS', url: '/admin/pages', duration: 5000 },
      { name: 'Reviews & Q&A', url: '/admin/cms', duration: 4000 },
      { name: 'Visitor Analytics', url: '/admin/analytics', duration: 6000 },
      { name: 'Tracking & Integrations', url: '/admin/settings', duration: 5000 },
      { name: 'Users', url: '/admin/users', duration: 5000 },
      { name: 'Finance', url: '/admin/finance', duration: 5000 },
      { name: 'My Sales', url: '/admin/my-sales', duration: 4000 },
      { name: 'Country Managers', url: '/admin/marketing/country-managers', duration: 5000 },
    ];

    for (const section of sections) {
      console.log(`   Showcasing: ${section.name}`);
      await page.goto(`${DASHBOARD_URL}${section.url}`);
      await page.waitForTimeout(section.duration);
      
      // Scroll down to show more content
      await page.evaluate(() => window.scrollBy(0, 400));
      await page.waitForTimeout(1500);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1000);
    }

    // Show storefront
    console.log('\n🏪 Part 3: Storefront Pages\n');
    
    const storefrontPages = [
      { name: 'Homepage', url: '/', duration: 6000 },
      { name: 'Shop', url: '/shop', duration: 6000 },
      { name: 'Product Detail', url: '/shop/mens-midnight-navy-velvet-duster-coat', duration: 5000 },
      { name: 'Journal', url: '/journal', duration: 5000 },
      { name: 'Journal Post', url: '/journal/what-is-zardozi-hand-embroidery-the-definitive-guide', duration: 5000 },
      { name: 'Collections', url: '/collections', duration: 4000 },
      { name: 'Track Order', url: '/track-order', duration: 4000 },
      { name: 'Contact', url: '/contact', duration: 4000 },
    ];

    for (const storePage of storefrontPages) {
      console.log(`   Showcasing: ${storePage.name}`);
      await page.goto(`${DASHBOARD_URL}${storePage.url}`);
      await page.waitForTimeout(storePage.duration);
      
      // Scroll through page
      await page.evaluate(() => window.scrollBy(0, 600));
      await page.waitForTimeout(1500);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1000);
    }

    console.log('\n✅ Recording complete!\n');
    console.log('   Closing browser and saving video...');

  } catch (error) {
    console.error('\n❌ Error during recording:', error);
  } finally {
    await context.close();
    await browser.close();

    // Video is saved automatically by Playwright
    console.log('\n🎥 Video saved. Look for a .webm file in the project root.\n');
    console.log('   The file will be named something like:');
    console.log('   video-<timestamp>.webm\n');
    console.log('   You can convert it to MP4 with ffmpeg:');
    console.log('   ffmpeg -i video.webm -c:v libx264 -c:a aac dashboard-presentation.mp4\n');
  }
}

// Run
recordPresentation().catch(console.error);
