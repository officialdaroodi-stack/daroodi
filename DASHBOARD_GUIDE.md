# Daroodi Admin Dashboard — Complete Guide

**Live URL:** https://www.daroodi.com/admin/  
**Admin Credentials:**
- Email: `admin@daroodi.com`
- Password: `DaroodiMasterAdmin2026!#`

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication & Access Control](#authentication--access-control)
3. [Dashboard Sections](#dashboard-sections)
4. [Products Management](#products-management)
5. [Collections Management](#collections-management)
6. [Orders & Sales](#orders--sales)
7. [Journal (Blog) CMS](#journal-blog-cms)
8. [Pages CMS](#pages-cms)
9. [Analytics & Tracking](#analytics--tracking)
10. [User Management](#user-management)
11. [Marketing & Country Managers](#marketing--country-managers)
12. [Finance & Payouts](#finance--payouts)
13. [Settings & Integrations](#settings--integrations)
14. [Storefront Pages](#storefront-pages)
15. [Technical Architecture](#technical-architecture)

---

## Overview

The Daroodi admin dashboard is a **full-featured CMS** similar to WordPress, built specifically for luxury e-commerce. It allows you to:

✅ Manage products, collections, orders, and inventory  
✅ Write and publish blog posts (Journal)  
✅ Create custom CMS pages dynamically  
✅ Track site visitors, behavior, and conversion events  
✅ Inject Google Analytics, TikTok Pixel, Facebook Pixel, and custom tracking scripts  
✅ Manage users, roles, and permissions  
✅ Handle commissions, payouts, and financial reporting  
✅ Configure country managers and marketing affiliates  

---

## Authentication & Access Control

### How Login Works

1. **Session-based auth** powered by Supabase Auth + `@supabase/ssr`
2. **Cookie-based sessions** — sessions persist across page reloads
3. **Role-based access control:**
   - `super_admin` — full access to everything
   - `admin` — cannot delete users or modify super_admins
   - `country_manager` — can view their assigned country's orders and commissions
   - `customer` — redirected to `/account` (order history, profile)

### Protected Routes

**Middleware** (`src/middleware.ts`) blocks unauthenticated access to:
- `/admin/*` — requires `super_admin` or `admin` role
- `/account/*` — requires any authenticated user

Customers trying to access `/admin` are redirected to `/account`.  
Guests are redirected to `/auth/login`.

### Login Flow

1. User visits `/auth/login`
2. Enters email + password
3. Supabase `signInWithPassword()` creates a session
4. Middleware reads the session cookie and fetches the user's `role` from the `profiles` table
5. User is redirected to `/admin` (if admin) or `/account` (if customer)

### Password Reset

1. User clicks "Forgot Password?" on `/auth/login`
2. Redirects to `/auth/reset-password`
3. User enters their email
4. Supabase sends a password reset email with a magic link
5. User clicks the link → redirected to `/auth/reset-password?code=...`
6. User enters a new password → session created → redirected to `/admin` or `/account`

---

## Dashboard Sections

### 1. Overview (`/admin`)

**What it shows:**
- Total revenue (sum of all completed orders)
- Total orders count
- Active products count
- Pending orders count
- Recent orders table (last 10)
- Quick actions: View all orders, Add product, Manage users

**Data source:** `src/lib/db/orders.ts` → Supabase `orders` table

---

### 2. Products Management (`/admin/products`)

**Features:**
- ✅ List all products (table view with image, title, price, SKU, stock, status)
- ✅ Search products by title or SKU
- ✅ Filter by collection (Platinum, Gold, Silver, Essentials)
- ✅ Add new product (form: title, slug, description, price, images, collection, stock, SEO)
- ✅ Edit existing product (inline modal)
- ✅ Delete product (with confirmation)
- ✅ Bulk actions (coming soon: bulk delete, bulk price update)

**Data source:** `src/lib/db/products.ts` → Supabase `products` table

**Product fields:**
```typescript
{
  id: string;
  slug: string;
  title: string;
  price: number;
  compare_at_price?: number;
  collection_id: string;
  description: string;
  short_description?: string;
  hero_image_url: string;
  images: string[]; // array of image URLs
  sku: string;
  stock_quantity: number;
  is_published: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}
```

**How to add a product:**
1. Navigate to `/admin/products`
2. Click "Add Product"
3. Fill in the form (all fields with * are required)
4. Upload images (hero image + gallery images)
5. Select a collection (Platinum, Gold, Silver, or Essentials)
6. Set stock quantity and price
7. Toggle "Published" to make it visible on the storefront
8. Click "Save Product"

**SEO optimization:**
- Each product has `meta_title` and `meta_description` fields
- These populate the `<title>` and `<meta name="description">` tags on the product detail page (`/shop/[slug]`)

---

### 3. Collections Management (`/admin/collections`)

**Features:**
- ✅ List all collections (Platinum, Gold, Silver, Essentials)
- ✅ Edit collection details (title, description, hero image, price range)
- ✅ Reorder collections (drag-and-drop sort order)
- ✅ Delete collection (only if no products assigned)

**Data source:** `src/lib/db/collections.ts` → Supabase `collections` table

**Collection fields:**
```typescript
{
  id: string;
  slug: string;
  title: string;
  tier: 'platinum' | 'gold' | 'silver' | 'essentials';
  description: string;
  hero_image_url: string;
  price_range_label: string; // e.g., "£1,400 – £2,800"
  sort_order: number;
}
```

**How collections work:**
- Each product belongs to exactly one collection via `collection_id`
- The storefront `/shop` page groups products by collection tier
- The homepage "Curated Tiers" section pulls from collections

---

### 4. Orders & Sales (`/admin/orders`, `/admin/my-sales`)

**Orders page (`/admin/orders`):**
- ✅ List all orders across the entire site
- ✅ Filter by status (pending, processing, shipped, delivered, cancelled)
- ✅ Search by order ID, customer email, or customer name
- ✅ View order details (customer info, line items, shipping address, payment status)
- ✅ Update order status (mark as shipped, delivered, etc.)
- ✅ Export orders to CSV

**My Sales page (`/admin/my-sales`):**
- ✅ Show orders assigned to the logged-in user (for country managers)
- ✅ Calculate commissions based on order subtotal
- ✅ Track pending vs. paid commissions

**Data source:** `src/lib/db/orders.ts` → Supabase `orders` table

**Order fields:**
```typescript
{
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  tax: number;
  shipping_cost: number;
  total: number;
  currency: string;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  shipping_address: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
  };
  line_items: Array<{
    product_id: string;
    title: string;
    price: number;
    quantity: number;
    image_url: string;
  }>;
  created_at: string;
  updated_at: string;
}
```

---

### 5. Journal (Blog) CMS (`/admin/journal`)

**Features:**
- ✅ List all blog posts
- ✅ Add new post (title, slug, excerpt, full content, featured image, cover image)
- ✅ Edit existing post
- ✅ Delete post
- ✅ Toggle published status (draft vs. live)
- ✅ SEO fields (meta title, meta description)

**Data source:** `src/lib/db/journal.ts` → Supabase `journal_posts` table

**Post fields:**
```typescript
{
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown or HTML
  featured_image_url: string;
  cover_image_url: string;
  author_id: string;
  is_published: boolean;
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}
```

**How to write a blog post:**
1. Navigate to `/admin/journal`
2. Click "New Post"
3. Write your title (auto-generates slug)
4. Write a short excerpt (for homepage/journal index)
5. Write the full content (supports Markdown or HTML)
6. Upload a featured image (shows on homepage) and cover image (shows at top of post)
7. Fill in SEO fields
8. Toggle "Published" when ready to go live
9. Click "Save Post"

**Storefront rendering:**
- Published posts appear at `/journal` (index page)
- Individual posts render at `/journal/[slug]`
- Homepage "From the Atelier" section shows the 3 most recent posts

---

### 6. Pages CMS (`/admin/pages`)

**Features:**
- ✅ Create custom pages with any slug (e.g., `/about-us`, `/wholesale-inquiry`)
- ✅ Write page content in Markdown or HTML
- ✅ SEO fields (meta title, meta description)
- ✅ Toggle published status
- ✅ Delete pages

**Data source:** `src/lib/db/pages.ts` → Supabase `cms_pages` table

**Page fields:**
```typescript
{
  id: string;
  slug: string;
  title: string;
  content: string; // Markdown or HTML
  is_published: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}
```

**How dynamic pages work:**
1. Admin creates a page at `/admin/pages` with slug `about-us`
2. The storefront has a catch-all route at `/[slug]/page.tsx`
3. When a user visits `/about-us`, Next.js fetches the page from Supabase
4. The content is rendered inside the standard storefront layout (header + footer)

**Reserved slugs (won't conflict):**
- `/shop`, `/journal`, `/account`, `/admin`, `/auth`, `/track-order`, `/contact`
- These are hardcoded routes in the app

---

### 7. Analytics & Tracking (`/admin/analytics`)

**Features:**
- ✅ Track page views, unique visitors, sessions
- ✅ Track custom events (add_to_cart, begin_checkout, purchase, button_click)
- ✅ View top pages, referrers, devices, browsers
- ✅ Real-time visitor count (last 5 minutes)
- ✅ Conversion funnel (product view → add to cart → checkout → purchase)

**Data source:** `src/lib/db/analytics.ts` → Supabase `analytics_events` table

**Event schema:**
```typescript
{
  id: string;
  event_name: string; // 'page_view', 'add_to_cart', 'purchase', etc.
  user_id?: string; // null for anonymous visitors
  session_id: string; // unique per browser session
  page_url: string;
  page_title: string;
  referrer?: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  country?: string;
  metadata?: Record<string, any>; // extra event data (e.g., product_id, order_total)
  created_at: string;
}
```

**How tracking works:**
1. A tracking script (`src/lib/analytics/tracker.ts`) runs on every storefront page
2. It fires `page_view` events automatically on route change
3. It fires custom events when users click buttons, add to cart, checkout, etc.
4. Events are sent to `/api/analytics/track` and stored in Supabase
5. The admin dashboard queries these events to generate reports

**Dashboard views:**
- **Overview:** Total visitors, page views, avg. session duration, bounce rate
- **Top Pages:** Most viewed pages (with counts)
- **Referrers:** Traffic sources (Google, Facebook, direct, etc.)
- **Devices:** Desktop vs. mobile vs. tablet breakdown
- **Events:** Custom event log with filters

---

### 8. Settings & Integrations (`/admin/settings`)

**Features:**
- ✅ Inject Google Analytics (GA4) tracking code
- ✅ Inject TikTok Pixel
- ✅ Inject Facebook Pixel (Meta Pixel)
- ✅ Inject custom JavaScript (for any third-party tool)
- ✅ Configure SMTP email settings (for order confirmations)
- ✅ Set site-wide SEO defaults (meta title, description, OG image)
- ✅ Manage shipping zones and rates
- ✅ Configure tax rates per country

**Data source:** `src/lib/db/settings.ts` → Supabase `site_settings` table

**Settings schema:**
```typescript
{
  id: string;
  key: string; // e.g., 'ga4_id', 'tiktok_pixel_id', 'facebook_pixel_id'
  value: string; // the tracking code or config JSON
  updated_at: string;
}
```

**How to add Google Analytics:**
1. Navigate to `/admin/settings`
2. Click "Integrations" tab
3. Paste your GA4 Measurement ID (e.g., `G-XXXXXXXXXX`)
4. Click "Save"
5. The tracking script is automatically injected into the storefront `<head>`

**How to add TikTok Pixel:**
1. Navigate to `/admin/settings` → Integrations
2. Paste your TikTok Pixel ID
3. Click "Save"
4. The pixel script is injected and fires `PageView`, `AddToCart`, `InitiateCheckout`, `Purchase` events

**Custom scripts:**
- Paste any `<script>` tag or raw JavaScript
- It will be injected into the storefront `<head>` on every page
- Use this for Hotjar, Intercom, custom chat widgets, etc.

---

### 9. User Management (`/admin/users`)

**Features:**
- ✅ List all users (admins, country managers, customers)
- ✅ Search by email or name
- ✅ Filter by role
- ✅ Create new user (email + password + role)
- ✅ Edit user role (promote/demote)
- ✅ Delete user (cannot delete yourself or other super_admins)
- ✅ View user's order history

**Data source:** `src/lib/auth-admin.ts` → Supabase Auth + `profiles` table

**User/profile schema:**
```typescript
{
  id: string; // matches auth.users.id
  email: string;
  role: 'super_admin' | 'admin' | 'country_manager' | 'customer';
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}
```

**Role hierarchy:**
- `super_admin` — can do anything (including delete other admins)
- `admin` — can manage products, orders, posts, but cannot delete super_admins
- `country_manager` — can view only their assigned country's orders and commissions
- `customer` — can only access `/account` (view own orders, update profile)

---

### 10. Marketing & Country Managers (`/admin/marketing/country-managers`)

**Features:**
- ✅ List all country managers
- ✅ Assign countries to each manager
- ✅ Set commission rate per manager
- ✅ View total sales and commissions per manager
- ✅ Track pending vs. paid commissions
- ✅ Generate payout reports

**Data source:** `src/lib/db/commissions.ts` → Supabase `commissions` table

**Commission schema:**
```typescript
{
  id: string;
  user_id: string; // country manager's user ID
  order_id: string;
  order_total: number;
  commission_rate: number; // e.g., 0.10 for 10%
  commission_amount: number;
  status: 'pending' | 'paid';
  paid_at?: string;
  created_at: string;
}
```

**How commissions work:**
1. When an order is placed, the system checks if it's from a country assigned to a manager
2. If yes, a commission record is created with the manager's rate
3. The commission appears in the manager's "My Sales" page
4. The super_admin can mark commissions as "paid" from the Finance page

---

### 11. Finance & Payouts (`/admin/finance`)

**Features:**
- ✅ View total revenue, pending payouts, paid payouts
- ✅ Filter by date range
- ✅ Export financial reports to CSV
- ✅ Mark commissions as paid (bulk action)
- ✅ View payout history per country manager

**Data source:** `src/lib/db/payouts.ts` → Supabase `payouts` table

**Payout schema:**
```typescript
{
  id: string;
  user_id: string; // country manager
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  paid_at?: string;
  commission_ids: string[]; // array of commission IDs included in this payout
  created_at: string;
}
```

---

## Storefront Pages

### Public Pages (no auth required)

| Route | Purpose | Data Source |
|---|---|---|
| `/` | Homepage | Collections, featured products, journal posts |
| `/shop` | Product catalog | Products table (filtered by `is_published: true`) |
| `/shop/[slug]` | Product detail | Products table |
| `/journal` | Blog index | Journal posts table |
| `/journal/[slug]` | Blog post detail | Journal posts table |
| `/track-order` | Order tracking | Orders table (by order ID + email) |
| `/contact` | Contact form | Sends email via API |
| `/[slug]` | Dynamic CMS pages | CMS pages table |

### Authenticated Pages

| Route | Role | Purpose |
|---|---|---|
| `/account` | Customer | Order history, profile, password change |
| `/admin` | Admin | Dashboard home |
| `/admin/products` | Admin | Product management |
| `/admin/orders` | Admin | Order management |
| `/admin/journal` | Admin | Blog CMS |
| `/admin/pages` | Admin | Pages CMS |
| `/admin/analytics` | Admin | Analytics dashboard |
| `/admin/users` | Admin | User management |
| `/admin/finance` | Super Admin | Financial reports |
| `/admin/my-sales` | Country Manager | Personal sales & commissions |

---

## Technical Architecture

### Stack

- **Framework:** Next.js 16.3 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth with `@supabase/ssr` (cookie-based sessions)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel (or any Node.js host)

### File Structure

```
daroodi-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (storefront)/       # Public pages (layout with header/footer)
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── shop/           # Product pages
│   │   │   ├── journal/        # Blog pages
│   │   │   └── [slug]/         # Dynamic CMS pages
│   │   ├── admin/              # Admin dashboard (protected layout)
│   │   ├── account/            # Customer dashboard (protected)
│   │   ├── auth/               # Login, register, reset password
│   │   └── api/                # API routes
│   ├── components/             # React components
│   ├── lib/                    # Business logic
│   │   ├── supabase/           # Supabase client (server, client, middleware, admin)
│   │   ├── db/                 # Database queries (products, orders, journal, etc.)
│   │   ├── auth.ts             # Auth helpers (client-safe)
│   │   ├── auth-server.ts      # Auth helpers (server-only)
│   │   └── auth-admin.ts       # Admin user management
│   └── middleware.ts           # Next.js middleware (route protection)
├── supabase/
│   └── migrations/             # SQL migration files
├── scripts/
│   ├── apply-migrations.ts     # One-shot setup script
│   └── seed.ts                 # Database seeding (deprecated, use apply-migrations)
└── public/
    └── uploads/                # Product images, blog images
```

### Database Schema

**Tables:**
- `profiles` — User profiles (extends Supabase Auth users)
- `products` — Product catalog
- `collections` — Product collections (Platinum, Gold, Silver, Essentials)
- `orders` — Customer orders
- `journal_posts` — Blog posts
- `cms_pages` — Dynamic CMS pages
- `analytics_events` — Tracking events
- `commissions` — Country manager commissions
- `payouts` — Payout records
- `site_settings` — Site-wide configuration (tracking codes, SMTP, SEO)
- `questions` — Product Q&A
- `reviews` — Product reviews

**Row-level security (RLS):**
- `profiles` — Users can read all, update only their own
- `products` — Public read, admin-only write
- `orders` — Users can read only their own, admins can read all
- `journal_posts` — Public read (if published), admin-only write
- `cms_pages` — Public read (if published), admin-only write
- `analytics_events` — Admin-only read/write
- `commissions` — User can read only their own, admin can read all
- `payouts` — Same as commissions

### Authentication Flow

1. **Client-side:** Uses `@supabase/ssr` client (reads session from cookies)
2. **Server-side:** Uses `@supabase/ssr` server client (reads session from request headers)
3. **Middleware:** Runs on every request, checks session, fetches user role, redirects if unauthorized
4. **Admin API routes:** Protected by `getCurrentUser()` + role check

### Deployment Checklist

✅ Push code to GitHub  
✅ Connect GitHub repo to Vercel  
✅ Add environment variables to Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAIL` (optional)
   - `ADMIN_INITIAL_PASSWORD` (optional)  
✅ Deploy to production  
✅ Run `npm run db:setup` locally (or manually apply SQL migrations via Supabase dashboard)  
✅ Test login at `https://yourdomain.com/auth/login`  

---

## Troubleshooting

### "Invalid login credentials"
- Check that the admin user was created (run `npm run db:setup`)
- Verify the password matches what's in `.env.local` or what was printed during setup

### "Failed to fetch" on admin pages
- Check that Supabase environment variables are correct in `.env.local`
- Verify the Supabase project is running (not paused)
- Check browser console for CORS errors

### Products not showing on storefront
- Ensure `is_published: true` in the `products` table
- Check that the product has a valid `collection_id`
- Verify the product has a `hero_image_url`

### Blog posts not rendering
- Ensure `is_published: true` in the `journal_posts` table
- Check that the post has a `slug` (auto-generated from title)
- Verify the post has `content` (not empty)

### Tracking codes not appearing
- Check `/admin/settings` → Integrations
- Verify the tracking code was saved (check `site_settings` table)
- Clear browser cache and check page source

---

## Support

For technical issues, check:
- GitHub Issues: https://github.com/officialdaroodi-stack/daroodi/issues
- Supabase Dashboard: https://supabase.com/dashboard
- Vercel Logs: https://vercel.com/dashboard

For feature requests or custom development, contact the development team.

---

**Last updated:** 2026-09-03
