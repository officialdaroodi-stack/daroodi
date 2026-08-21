// Daroodi Types & Data Model Definitions

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'dev_frontend'
  | 'dev_backend'
  | 'product_manager'
  | 'product_editor'
  | 'order_checker'
  | 'finance_manager'
  | 'marketing_admin'
  | 'country_sales_manager'
  | 'regional_sales_agent'
  | 'customer';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  manager_id?: string | null;
  assigned_country?: string | null;
  assigned_region?: string | null;
  commission_rate?: number; // e.g. 0.10 for 10%
  bank_details?: {
    bank_name?: string;
    account_title?: string;
    account_number?: string;
    iban?: string;
    paypal_email?: string;
    easypaisa_number?: string;
  };
  phone?: string;
  avatar_url?: string;
  created_at: string;
}

export type CollectionTier = 'platinum' | 'gold' | 'silver' | 'essentials';

export interface Collection {
  id: string;
  slug: string;
  title: string;
  tier: CollectionTier;
  description: string;
  hero_image_url: string;
  price_range_label: string;
  sort_order: number;
}

export interface ProductHighlight {
  highlight: string;
}

export interface ProductColor {
  name: string;
  hex: string;
  image_url?: string;
  color_image?: string | number;
  gallery_images?: Array<string | number>;
}

export interface PackOption {
  title: string;
  subtitle: string;
  quantity: number;
  discount_percent: number;
  price_override?: number;
  badge?: string;
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface ProductACFMeta {
  fabric_composition?: string;
  care_instructions?: string;
  embroidery_technique?: string;
  embroidery_hours?: number;
  embroidery_placement?: string[];
  accordion_description?: string;
  accordion_sizing?: string;
  accordion_care?: string;
  accordion_faqs?: ProductFAQ[];
  product_highlights?: ProductHighlight[];
  specifications?: Record<string, string>;
  product_colors?: ProductColor[];
  pack_options?: PackOption[];
  fit_details?: {
    fit_type?: string;
    model_info?: string;
    fit_description?: string;
  };
  style_consultant?: {
    stylist_name?: string;
    stylist_whatsapp?: string;
    stylist_image_url?: string;
    stylist_advice?: string;
  };
  product_faqs?: ProductFAQ[];
  size_guide?: {
    size_guide_image_url?: string;
    size_guide_text?: string;
  };
  upsell_crosssell_ids?: string[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL' | 'Custom';
  color?: string;
  price_override_gbp?: number;
  stock_qty: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  collection_id: string;
  collection?: Collection;
  base_price_gbp: number;
  regular_price_gbp?: number;
  sale_price_gbp?: number;
  description: string;
  featured_image_url: string;
  gallery_images: string[];
  stock_status: 'in_stock' | 'made_to_order' | 'out_of_stock';
  stock_quantity?: number;
  is_featured: boolean;
  lead_time_weeks: number;
  acf_meta: ProductACFMeta;
  variants?: ProductVariant[];
  created_at: string;
  updated_at?: string;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'in_production'
  | 'in_tailoring'
  | 'quality_check'
  | 'dispatched'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export type OrderType = 'ready_to_wear' | 'bespoke_custom' | 'bulk_event';

export interface CustomMeasurements {
  id?: string;
  order_id?: string;
  chest?: number;
  shoulder?: number;
  waist?: number;
  hips?: number;
  sleeve_length?: number;
  jacket_length?: number;
  neck?: number;
  bicep?: number;
  height_ft?: string;
  weight_kg?: number;
  fit_preference?: 'slim' | 'tailored' | 'comfort';
  special_notes?: string;
  reference_images?: string[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  variant_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  selected_size?: string;
  selected_color?: string;
  is_custom_sizing?: boolean;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string;
  customer?: UserProfile;
  client_name?: string;
  client_email?: string;
  client_country?: string;
  product_title?: string;
  size?: string;
  color?: string;
  total_amount_gbp?: number;
  paid?: boolean;
  lead_time_weeks?: number;
  agent_id?: string | null;
  agent?: UserProfile | null;
  status: OrderStatus;
  order_type: OrderType;
  currency: string;
  subtotal: number;
  discount_total: number;
  tax_total: number;
  shipping_total: number;
  grand_total: number;
  shipping_address: {
    full_name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state?: string;
    country: string;
    postal_code: string;
    phone: string;
    email: string;
  };
  payment_status: 'unpaid' | 'paid' | 'refunded';
  payment_method?: string;
  items?: OrderItem[];
  measurements?: CustomMeasurements | null;
  created_at: string;
  updated_at?: string;
}

export interface Commission {
  id: string;
  order_id: string;
  order?: Order;
  recipient_id: string;
  recipient?: UserProfile;
  tier_level: 'direct_agent' | 'country_manager_override' | 'ambassador';
  order_amount: number;
  rate: number;
  commission_amount: number;
  status: 'pending_approval' | 'approved' | 'disbursed' | 'rejected';
  approved_by?: string | null;
  created_at: string;
}

export interface Payout {
  id: string;
  recipient_id: string;
  recipient?: UserProfile;
  amount: number;
  currency: string;
  payout_method: string;
  transaction_reference?: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  disbursed_by?: string | null;
  disbursed_at?: string;
  created_at: string;
}

export interface CMSBlock {
  id: string;
  block_key: string;
  content_json: Record<string, any>;
  updated_by?: string;
  updated_at: string;
}

export interface JournalPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_markdown?: string;
  content?: string;
  cover_image_url?: string;
  featured_image_url?: string;
  author_id?: string;
  author_name?: string;
  author?: string;
  category?: string;
  read_time_mins?: number;
  read_time_minutes?: number;
  published_at: string;
  status?: 'draft' | 'published';
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor?: string;
  isCustomSizing?: boolean;
  measurements?: CustomMeasurements;
}

export interface ProductReview {
  id: string;
  product_id: string;
  author_name: string;
  author_email?: string;
  rating: number;
  title?: string;
  comment: string;
  verified: boolean;
  photos?: string[];
  upvotes: number;
  status: 'approved' | 'pending' | 'rejected';
  created_at: string;
}

export interface ProductQuestion {
  id: string;
  product_id: string;
  user_name: string;
  author_name?: string;
  user_email?: string;
  question: string;
  answer?: string;
  is_answered: boolean;
  created_at: string;
}

// ─── WooCommerce-Specific Types ───────────────────────────────────────────────

export type CurrencyCode = 'PKR' | 'USD' | 'GBP' | 'AED' | 'SAR' | 'CAD' | 'EUR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  country: string;
  countryCode: string;
  rateFromPKR: number;
}

export const CURRENCY_CONFIG: Record<CurrencyCode, CurrencyConfig> = {
  PKR: { code: 'PKR', symbol: '₨', country: 'Pakistan', countryCode: 'PK', rateFromPKR: 1 },
  USD: { code: 'USD', symbol: '$', country: 'United States', countryCode: 'US', rateFromPKR: 0.0035 },
  GBP: { code: 'GBP', symbol: '£', country: 'United Kingdom', countryCode: 'GB', rateFromPKR: 0.0028 },
  AED: { code: 'AED', symbol: 'د.إ', country: 'UAE', countryCode: 'AE', rateFromPKR: 0.013 },
  SAR: { code: 'SAR', symbol: '﷼', country: 'Saudi Arabia', countryCode: 'SA', rateFromPKR: 0.013 },
  CAD: { code: 'CAD', symbol: 'C$', country: 'Canada', countryCode: 'CA', rateFromPKR: 0.0048 },
  EUR: { code: 'EUR', symbol: '€', country: 'Europe', countryCode: 'EU', rateFromPKR: 0.0032 },
};

export type StockStatus = 'instock' | 'outofstock' | 'onbackorder';
export type ProductType = 'simple' | 'variable' | 'grouped' | 'external';

export interface WCProductImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_modified: string;
  type: ProductType;
  status: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  price_html: string;
  total_sales: number;
  stock_status: StockStatus;
  stock_quantity: number | null;
  average_rating: string;
  rating_count: number;
  parent_id: number;
  featured: boolean;
  catalog_visibility: string;
  categories: Array<{ id: number; name: string; slug: string }>;
  tags: Array<{ id: number; name: string; slug: string }>;
  images: WCProductImage[];
  attributes: WCProductAttribute[];
  variations: number[];
  meta_data: Record<string, unknown>;
}

export interface WCProductAttribute {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

export interface WCProductVariation {
  id: number;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_status: StockStatus;
  attributes: Array<{ name: string; option: string }>;
}

export interface WCReview {
  id: number;
  date_created: string;
  review: string;
  rating: number;
  verified: boolean;
  reviewer: string;
  reviewer_email: string;
}

// ─── Daroodi WooCommerce ACF Meta ────────────────────────────────────────────

export interface WooProductACF {
  // Color & Gallery
  product_colors?: ProductColor[];
  color_image?: string | number;
  gallery_images?: Array<string | number>;

  // Pricing & Offers
  pack_options?: PackOption[];
  allow_extra_discount?: boolean;

  // Product details
  product_highlights?: ProductHighlight[];
  fabric_composition?: string;
  care_instructions?: string;
  product_specifications?: Record<string, string>;
  specifications?: Record<string, string>;
  additional_details?: Array<{ detail_label?: string; detail_value?: string }>;

  // Size & Fit
  size_guide_image?: string | number;
  size_guide_text?: string;
  fit_type?: string;
  model_info?: string;
  fit_description?: string;

  // Style consultant
  stylist_name?: string;
  stylist_whatsapp?: string;
  stylist_image?: string | number;
  style_consultant?: {
    stylist_name?: string;
    stylist_whatsapp?: string;
    stylist_image?: string | number;
    stylist_advice?: string;
  };

  // FAQs
  product_faqs?: ProductFAQ[];

  // Visual
  badges_wide_image?: string | number;
  outfit_suggestions?: Array<{ outfit_title?: string; outfit_image?: string; outfit_link?: string }>;

  // Offers
  offer_upsell_method?: 'product' | 'manual';
  offer_upsell_product?: number | WCProduct;
  offer_upsell_manual?: {
    title?: string;
    price?: number;
    regular_price?: number;
    link?: string;
    image?: string | number;
  };
  offer_downsell_method?: 'product' | 'manual';
  offer_downsell_product?: number | WCProduct;
  offer_downsell_manual?: {
    title?: string;
    price?: number;
    regular_price?: number;
    link?: string;
    image?: string | number;
  };
  offer_crosssell_method?: 'product' | 'manual';
  offer_crosssell_product?: number | WCProduct;
  offer_crosssell_manual?: {
    title?: string;
    price?: number;
    regular_price?: number;
    link?: string;
    image?: string | number;
  };
}

// ─── Daroodi Unified Product (WC + ACF merged) ─────────────────────────────

export interface DaroodiProduct {
  // WooCommerce core
  id: number;
  slug: string;
  name: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  price_html: string;
  average_rating: string;
  rating_count: number;
  total_sales: number;
  stock_status: StockStatus;
  stock_quantity: number | null;
  type: ProductType;
  featured: boolean;
  images: WCProductImage[];
  attributes: WCProductAttribute[];
  variations: number[];
  categories: Array<{ id: number; name: string; slug: string }>;

  // Daroodi ACF
  acf: WooProductACF;

  // Resolved/derived fields
  sale_percent: number;
  is_on_sale: boolean;
  main_gallery: number[];
  color_galleries: Record<string, number[]>;
  size_terms: string[];
  upsell_data?: OfferData;
  downsell_data?: OfferData;
  crosssell_data?: OfferData;
  related_ids: number[];
  upsell_ids: number[];
  crosssell_ids: number[];
}

export interface OfferData {
  url: string;
  name: string;
  img: string;
  regular: number;
  now: number;
  is_on_sale: boolean;
}

// ─── Trust Badge ──────────────────────────────────────────────────────────────

export interface TrustBadge {
  icon: string;
  text: string;
}
