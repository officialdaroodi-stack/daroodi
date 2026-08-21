# 🏛️ Daroodi | Luxury Bespoke E-Commerce & Enterprise ERP Web App

A full-stack, enterprise-grade luxury e-commerce platform and multi-role ERP/CMS system built with **Next.js (App Router)**, **TypeScript**, **Supabase (PostgreSQL)**, and **Vanilla CSS tokens**, designed for 1-click deployment on **Vercel** connected to **GitHub**.

---

## 🌟 Architecture & Features

### 1. 🛍️ Exact 3D Luxury Storefront:
- **3D Floating Header Pill:** Emerald 3-bar hamburger button, search badge, account badge, live shopping bag counter.
- **3D Numbered Mobile Drawer:** Animated cards for `01 Home`, `02 Collections`, `03 Shop`, `04 Bespoke`, `05 Atelier`, `06 Journal`, `07 ERP Portal`, plus quick action badges (`SEARCH`, `ACCOUNT`, `SHOP`).
- **3D Floating Glassmorphism Bottom Tab Bar:** Dedicated Home, Collections, About, Account tabs, and center elevated **Shop FAB** button.
- **Collections 4 Tiers of Craft (`/collections`):** Platinum Collection, Gold Heritage, Silver Classic, Atelier Essentials with sticky jump pills and comparison matrix.
- **Product Catalog & Detail (`/shop`, `/shop/[slug]`):** Filter by tier, search, sort, gallery zoom, size selector, and full **ACF Pro Custom Fields** (fabric composition, care instructions, embroidery stitch technique, highlights, pack bundles, stylist advice, and size guide).
- **Bespoke Custom Order Studio (`/custom-order`):** Comprehensive body measurement intake (Chest, Shoulder, Waist, Hips, Sleeve, Jacket Length, Fit Preference, and Special Tailoring notes).
- **Editorial Style Journal (`/journal`, `/journal/[slug]`):** Luxury article archive and reader.
- **Real-Time 7-Stage Order Tracker (`/track-order`):** Live visualizer for `Pending` $\rightarrow$ `Processing` $\rightarrow$ `In Tailoring` $\rightarrow$ `Quality Check` $\rightarrow$ `Shipped` $\rightarrow$ `Completed`.
- **Master Footer:** Official social channels (Instagram, Facebook, TikTok, YouTube, WhatsApp), newsletter signup, and trust badges.

---

### 2. 🏢 Hierarchical Multi-Role ERP & Headless CMS (`/admin`):
- 👑 **Super Admin (`super_admin`):** Full master god-mode across all users, global store reports, system audit logs, and permission overrides.
- 🛡️ **Admin (`admin`):** Operational store management and subordinate user management.
- 💻 **Developers:**
  - 🎨 *Frontend / CMS Dev (`dev_frontend`):* Live Headless CMS block editor for homepage banners, announcement text, typography, and SEO metadata.
  - ⚙️ *Backend Dev (`dev_backend`):* Supabase PostgreSQL health inspector, database table telemetry, and API webhook logs.
- 📦 **Product & Order Operations:**
  - 🛍️ *Product Manager (`product_manager`):* Product CRUD with ACF attributes, pricing, and 7-stage order status lifecycle modifier.
  - ✏️ *Product Editor (`product_editor`):* Catalog entry and media manager.
  - 🔍 *Order Checker (`order_checker`):* Custom measurement inspection card and tailor fulfillment notes.
- 💰 **Finance Manager (`finance_manager`):** Gross revenue analytics, net margins, partner commission approvals, and salary/payout disbursements.
- 📢 **Marketing Admin (`marketing_admin`):** Global marketing campaign asset hub with WhatsApp/video share engines and Country Sales Head appointment.
- 🗺️ **Country Sales Head (`country_sales_manager`):** National territory manager recruiting and overseeing Regional Sales Agents with tiered override commissions.
- 📍 **Regional Sales Agent (`regional_sales_agent`):** Personal affiliate dashboard with unique referral link generator, commission ledger, and payout withdrawal requests.

---

## 🚀 Quick Start & Local Development

```bash
# 1. Navigate to the app directory
cd daroodi-app

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment on Vercel with Supabase & GitHub

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "feat: complete Daroodi Next.js Luxury Storefront and Enterprise ERP"
git push origin main
```

### Step 2: Supabase Setup
1. Create a new project on [Supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of `supabase/migrations/001_initial_schema.sql` and run the query.

### Step 3: 1-Click Vercel Deployment
1. Go to [Vercel.com](https://vercel.com) and click **"New Project"**.
2. Select your GitHub repository.
3. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-supabase-anon-key`
4. Click **Deploy**.
