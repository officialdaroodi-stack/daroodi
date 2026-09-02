-- ==============================================================================
-- DAROODI LUXURY ATELIER — COMPLETE MASTER DATABASE SCHEMA
-- ==============================================================================

-- Helper function to execute migrations programmatically
CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- ==============================================================================
-- DAROODI LUXURY PLATFORM & ENTERPRISE ERP SCHEMA FOR SUPABASE (POSTGRESQL)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom Role Enum
CREATE TYPE user_role_enum AS ENUM (
  'super_admin',
  'admin',
  'dev_frontend',
  'dev_backend',
  'product_manager',
  'product_editor',
  'order_checker',
  'finance_manager',
  'marketing_admin',
  'country_sales_manager',
  'regional_sales_agent',
  'customer'
);

-- 3. Profiles Table (Hierarchical User Model)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role_enum DEFAULT 'customer' NOT NULL,
  manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_country TEXT,
  assigned_region TEXT,
  commission_rate NUMERIC(5, 4) DEFAULT 0.1000,
  bank_details JSONB DEFAULT '{}'::jsonb,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Collections Table (4-Tiers of Craft)
CREATE TABLE collections (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('platinum', 'gold', 'silver', 'essentials')),
  description TEXT NOT NULL,
  hero_image_url TEXT NOT NULL,
  price_range_label TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Products Table (With Full ACF Pro Fields Schema)
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  collection_id TEXT REFERENCES collections(id) ON DELETE SET NULL,
  base_price_gbp NUMERIC(10, 2) NOT NULL,
  regular_price_gbp NUMERIC(10, 2),
  sale_price_gbp NUMERIC(10, 2),
  description TEXT NOT NULL,
  featured_image_url TEXT NOT NULL,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  stock_status TEXT DEFAULT 'made_to_order' CHECK (stock_status IN ('in_stock', 'made_to_order', 'out_of_stock')),
  is_featured BOOLEAN DEFAULT false,
  lead_time_weeks INT DEFAULT 4,
  acf_meta JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Product Variants Table
CREATE TABLE product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  size TEXT NOT NULL,
  color TEXT,
  price_override_gbp NUMERIC(10, 2),
  stock_qty INT DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. Orders Table
CREATE TYPE order_status_enum AS ENUM (
  'pending',
  'processing',
  'in_tailoring',
  'quality_check',
  'shipped',
  'completed',
  'cancelled'
);

CREATE TYPE order_type_enum AS ENUM (
  'ready_to_wear',
  'bespoke_custom',
  'bulk_event'
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  agent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status order_status_enum DEFAULT 'pending' NOT NULL,
  order_type order_type_enum DEFAULT 'ready_to_wear' NOT NULL,
  currency TEXT DEFAULT 'GBP' NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  discount_total NUMERIC(10, 2) DEFAULT 0,
  tax_total NUMERIC(10, 2) DEFAULT 0,
  shipping_total NUMERIC(10, 2) DEFAULT 0,
  grand_total NUMERIC(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  payment_method TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. Order Items Table
CREATE TABLE order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  variant_id TEXT REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity INT DEFAULT 1 NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  selected_size TEXT,
  selected_color TEXT,
  is_custom_sizing BOOLEAN DEFAULT false
);

-- 9. Custom Measurements Table
CREATE TABLE custom_measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  chest NUMERIC(5, 2),
  shoulder NUMERIC(5, 2),
  waist NUMERIC(5, 2),
  hips NUMERIC(5, 2),
  sleeve_length NUMERIC(5, 2),
  jacket_length NUMERIC(5, 2),
  neck NUMERIC(5, 2),
  bicep NUMERIC(5, 2),
  height_ft TEXT,
  weight_kg NUMERIC(5, 2),
  fit_preference TEXT CHECK (fit_preference IN ('slim', 'tailored', 'comfort')),
  special_notes TEXT,
  reference_images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. Commissions Table
CREATE TABLE commissions (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tier_level TEXT NOT NULL CHECK (tier_level IN ('direct_agent', 'country_manager_override', 'ambassador')),
  order_amount NUMERIC(10, 2) NOT NULL,
  rate NUMERIC(5, 4) NOT NULL,
  commission_amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending_approval' CHECK (status IN ('pending_approval', 'approved', 'disbursed', 'rejected')),
  approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. Payouts Table
CREATE TABLE payouts (
  id TEXT PRIMARY KEY,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'GBP' NOT NULL,
  payout_method TEXT NOT NULL,
  transaction_reference TEXT,
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  disbursed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  disbursed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. Headless CMS Blocks & Journal Posts
CREATE TABLE cms_blocks (
  id TEXT PRIMARY KEY,
  block_key TEXT UNIQUE NOT NULL,
  content_json JSONB NOT NULL,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE journal_posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  featured_image_url TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  category TEXT,
  read_time_mins INT DEFAULT 5,
  published_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published'))
);

-- 13. System Audit Logs Table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Products & Collections: Public Read Access
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can view collections" ON collections FOR SELECT USING (true);
CREATE POLICY "Public can view published journal posts" ON journal_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view cms blocks" ON cms_blocks FOR SELECT USING (true);

-- Profiles: Users can view their own profile, Admins & Super Admins can view all
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
  )
);

-- Orders: Customers view own, Admins & PMs view all, Agents view their referrals
CREATE POLICY "Customers view own orders" ON orders FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "Agents view referred orders" ON orders FOR SELECT USING (agent_id = auth.uid());
CREATE POLICY "Staff can manage all orders" ON orders FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'product_manager', 'order_checker', 'finance_manager')
  )
);
-- ==============================================================================
-- DAROODI PRODUCTION DATABASE SCHEMA (POSTGRESQL / SUPABASE)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Collections Table
CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('platinum', 'gold', 'silver', 'essentials')),
  description TEXT NOT NULL,
  hero_image_url TEXT NOT NULL,
  price_range_label TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Products Table (Complete ACF Pro Schema)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  collection_id TEXT REFERENCES collections(id) ON DELETE SET NULL,
  base_price_gbp NUMERIC(10, 2) NOT NULL,
  regular_price_gbp NUMERIC(10, 2),
  sale_price_gbp NUMERIC(10, 2),
  description TEXT NOT NULL,
  featured_image_url TEXT NOT NULL,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  stock_status TEXT DEFAULT 'made_to_order' CHECK (stock_status IN ('in_stock', 'made_to_order', 'out_of_stock')),
  is_featured BOOLEAN DEFAULT false,
  lead_time_weeks INT DEFAULT 4,
  category TEXT DEFAULT 'Prince Coats',
  acf_meta JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Verified Product Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  verified BOOLEAN DEFAULT true,
  photos JSONB DEFAULT '[]'::jsonb,
  upvotes INT DEFAULT 0,
  status TEXT DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Product Questions & Answers (Q&A)
CREATE TABLE IF NOT EXISTS product_questions (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT,
  question TEXT NOT NULL,
  answer TEXT,
  is_answered BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Journal / Blog Posts Table
CREATE TABLE IF NOT EXISTS journal_posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  featured_image_url TEXT NOT NULL,
  author_name TEXT DEFAULT 'Daroodi Master Stylist',
  category TEXT DEFAULT 'Sartorial Heritage',
  read_time_mins INT DEFAULT 5,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  status TEXT DEFAULT 'pending' NOT NULL,
  currency TEXT DEFAULT 'GBP' NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  discount_total NUMERIC(10, 2) DEFAULT 0,
  tax_total NUMERIC(10, 2) DEFAULT 0,
  shipping_total NUMERIC(10, 2) DEFAULT 0,
  grand_total NUMERIC(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_status TEXT DEFAULT 'unpaid',
  payment_method TEXT NOT NULL,
  items JSONB DEFAULT '[]'::jsonb NOT NULL,
  measurements JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_questions_product ON product_questions(product_id);
CREATE INDEX IF NOT EXISTS idx_journal_slug ON journal_posts(slug);
-- ==============================================================================
-- DAROODI — CMS, AUTH, AND ANALYTICS TABLES
-- Migration 003 — additive to 001 + 002. Safe to run on top of existing schema.
-- ==============================================================================

-- Reviews: extend or create
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  author_name TEXT NOT NULL,
  author_email TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  verified BOOLEAN DEFAULT true,
  photos JSONB DEFAULT '[]'::jsonb,
  upvotes INT DEFAULT 0,
  status TEXT DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS product_questions (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  user_name TEXT NOT NULL,
  user_email TEXT,
  question TEXT NOT NULL,
  answer TEXT,
  is_answered BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- CMS Pages (storefront standalone pages)
CREATE TABLE IF NOT EXISTS cms_pages (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  show_in_footer BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Site settings (key-value store for tracking + integrations)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- First-party analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event TEXT NOT NULL,
  path TEXT NOT NULL,
  referrer TEXT,
  session_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  device TEXT,
  browser TEXT,
  country TEXT,
  value NUMERIC(12, 2),
  currency TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add the missing columns to journal_posts from migration 001 (tolerate if they exist)
ALTER TABLE journal_posts ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE journal_posts ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
ALTER TABLE journal_posts ADD COLUMN IF NOT EXISTS author_name TEXT;
ALTER TABLE journal_posts ADD COLUMN IF NOT EXISTS author TEXT;
ALTER TABLE journal_posts ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;
ALTER TABLE journal_posts ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE journal_posts ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE journal_posts ALTER COLUMN featured_image_url DROP NOT NULL;

-- Add columns the app expects on products
ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tier TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity INT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS categories JSONB DEFAULT '[]'::jsonb;

-- Add columns the app expects on profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add tracking columns to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS client_country TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS agent TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS measurements JSONB;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS product_title TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS size TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS color TEXT;

-- Useful indexes
CREATE INDEX IF NOT EXISTS idx_journal_posts_status ON journal_posts(status);
CREATE INDEX IF NOT EXISTS idx_journal_posts_published_at ON journal_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_cms_pages_status ON cms_pages(status);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor ON analytics_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- ==============================================================================
-- ROW LEVEL SECURITY
-- ==============================================================================

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Public read: published CMS pages & reviews
DROP POLICY IF EXISTS "Public can view published cms_pages" ON cms_pages;
CREATE POLICY "Public can view published cms_pages" ON cms_pages FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Public can view approved reviews" ON reviews;
CREATE POLICY "Public can view approved reviews" ON reviews FOR SELECT
  USING (status = 'approved');

-- Analytics: anyone can write (public, first-party)
DROP POLICY IF EXISTS "Public can write analytics" ON analytics_events;
CREATE POLICY "Public can write analytics" ON analytics_events FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Staff can view analytics" ON analytics_events;
CREATE POLICY "Staff can view analytics" ON analytics_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin', 'dev_frontend', 'dev_backend', 'marketing_admin')
    )
  );

-- Site settings: staff read, super_admin/admin write
DROP POLICY IF EXISTS "Staff can view settings" ON site_settings;
CREATE POLICY "Staff can view settings" ON site_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin', 'dev_frontend', 'dev_backend', 'marketing_admin')
    )
  );

DROP POLICY IF EXISTS "Admins can manage settings" ON site_settings;
CREATE POLICY "Admins can manage settings" ON site_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin', 'dev_frontend', 'dev_backend')
    )
  );

-- CMS pages: staff write
DROP POLICY IF EXISTS "Staff can manage cms_pages" ON cms_pages;
CREATE POLICY "Staff can manage cms_pages" ON cms_pages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin', 'dev_frontend', 'dev_backend', 'marketing_admin')
    )
  );

-- Reviews & questions: staff moderate, public inserts
DROP POLICY IF EXISTS "Public can write reviews" ON reviews;
CREATE POLICY "Public can write reviews" ON reviews FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can write questions" ON product_questions;
CREATE POLICY "Public can write questions" ON product_questions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Staff can manage reviews" ON reviews;
CREATE POLICY "Staff can manage reviews" ON reviews FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin', 'product_manager', 'order_checker')
    )
  );

DROP POLICY IF EXISTS "Staff can manage questions" ON product_questions;
CREATE POLICY "Staff can manage questions" ON product_questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin', 'product_manager', 'order_checker')
    )
  );

-- Function: create a profile row whenever a new auth.users row is inserted
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 'customer')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
