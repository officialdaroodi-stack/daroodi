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
