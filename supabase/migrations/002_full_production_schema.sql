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
