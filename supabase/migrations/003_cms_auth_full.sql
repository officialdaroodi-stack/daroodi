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
