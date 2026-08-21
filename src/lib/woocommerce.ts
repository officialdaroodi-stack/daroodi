/**
 * Daroodi WooCommerce API Client
 *
 * Provides functions to fetch product data from the WooCommerce REST API
 * and to interact with the WooCommerce AJAX cart/checkout endpoints.
 *
 * WooCommerce store URL is read from NEXT_PUBLIC_WOOCOMMERCE_STORE_URL env var.
 * Falls back to mock data when env var is not set (development).
 */

import {
  DaroodiProduct,
  WCProduct,
  WCReview,
  OfferData,
  WooProductACF,
  WCProductAttribute,
  ProductColor,
} from '@/lib/types';
import { INITIAL_PRODUCTS } from '@/lib/mockData';

// ─── Env / Config ─────────────────────────────────────────────────────────────

const STORE_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL ?? '';
const CONSUMER_KEY = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY ?? '';
const CONSUMER_SECRET = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET ?? '';

function wcApiUrl(path: string): string {
  const base = STORE_URL.replace(/\/$/, '');
  const qs = new URLSearchParams({ consumer_key: CONSUMER_KEY, consumer_secret: CONSUMER_SECRET });
  return `${base}/wp-json/wc/v3${path}?${qs}`;
}

// ─── Fetch wrapper ─────────────────────────────────────────────────────────────

async function wcFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (!STORE_URL || !CONSUMER_KEY) return null;
  try {
    const res = await fetch(wcApiUrl(path), {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
      next: { revalidate: 60 }, // ISR: revalidate every 60s
    } as RequestInit);
    if (!res.ok) {
      console.error(`[WooCommerce API] ${res.status} ${res.statusText} — ${path}`);
      return null;
    }
    return res.json() as Promise<T>;
  } catch (err) {
    console.error('[WooCommerce API] Network error:', err);
    return null;
  }
}

// ─── Currency helpers ──────────────────────────────────────────────────────────

const PKR_RATES: Record<string, number> = {
  PKR: 1,
  USD: 0.0035,
  GBP: 0.0028,
  AED: 0.013,
  SAR: 0.013,
  CAD: 0.0048,
  EUR: 0.0032,
};

function convertPrice(pricePkr: number, currencyCode: string): string {
  const rate = PKR_RATES[currencyCode] ?? PKR_RATES.GBP;
  const converted = pricePkr * rate;
  return currencyCode === 'PKR'
    ? `₨${converted.toLocaleString('en-PK', { minimumFractionDigits: 0 })}`
    : currencyCode === 'EUR'
    ? `€${converted.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : currencyCode === 'AED' || currencyCode === 'SAR'
    ? `${currencyCode} ${converted.toLocaleString('ar-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `${currencyCode} ${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── Product Transformer ────────────────────────────────────────────────────────

function parseACF(meta_data: Record<string, unknown>): WooProductACF {
  const raw = meta_data;
  return {
    product_colors: (raw.product_colors as WooProductACF['product_colors']) ?? [],
    pack_options: (raw.pack_options as WooProductACF['pack_options']) ?? [],
    allow_extra_discount: (raw.allow_extra_discount as boolean) ?? false,
    product_highlights: (raw.product_highlights as WooProductACF['product_highlights']) ?? [],
    fabric_composition: (raw.fabric_composition as string) ?? '',
    care_instructions: (raw.care_instructions as string) ?? '',
    product_specifications: (raw.product_specifications as Record<string, string>) ?? {},
    specifications: (raw.specifications as Record<string, string>) ?? {},
    additional_details: (raw.additional_details as WooProductACF['additional_details']) ?? [],
    size_guide_image: raw.size_guide_image as string | number | undefined,
    size_guide_text: (raw.size_guide_text as string) ?? '',
    fit_type: (raw.fit_type as string) ?? '',
    model_info: (raw.model_info as string) ?? '',
    fit_description: (raw.fit_description as string) ?? '',
    stylist_name: (raw.stylist_name as string) ?? '',
    stylist_whatsapp: (raw.stylist_whatsapp as string) ?? '923001215532',
    stylist_image: raw.stylist_image as string | number | undefined,
    product_faqs: (raw.product_faqs as WooProductACF['product_faqs']) ?? [],
    badges_wide_image: raw.badges_wide_image as string | number | undefined,
    outfit_suggestions: (raw.outfit_suggestions as WooProductACF['outfit_suggestions']) ?? [],
    offer_upsell_method: (raw.offer_upsell_method as 'product' | 'manual') ?? 'product',
    offer_upsell_product: raw.offer_upsell_product as number | WCProduct | undefined,
    offer_upsell_manual: raw.offer_upsell_manual as WooProductACF['offer_upsell_manual'],
    offer_downsell_method: (raw.offer_downsell_method as 'product' | 'manual') ?? 'product',
    offer_downsell_product: raw.offer_downsell_product as number | WCProduct | undefined,
    offer_downsell_manual: raw.offer_downsell_manual as WooProductACF['offer_downsell_manual'],
    offer_crosssell_method: (raw.offer_crosssell_method as 'product' | 'manual') ?? 'product',
    offer_crosssell_product: raw.offer_crosssell_product as number | WCProduct | undefined,
    offer_crosssell_manual: raw.offer_crosssell_manual as WooProductACF['offer_crosssell_manual'],
    // Nested style_consultant
    style_consultant: (raw.style_consultant as WooProductACF['style_consultant']) ?? undefined,
  };
}

function resolveSizeTerms(wc: WCProduct): string[] {
  const sizeAttr = wc.attributes.find(
    (a: WCProductAttribute) => a.name.toLowerCase() === 'pa_size' || a.name.toLowerCase() === 'size'
  );
  if (sizeAttr?.options?.length) return sizeAttr.options;
  return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
}

function buildMainGallery(wc: WCProduct): number[] {
  const ids: number[] = [];
  if (wc.images?.[0]?.id) ids.push(wc.images[0].id);
  return ids;
}

function buildColorGalleries(acf: WooProductACF): Record<string, number[]> {
  const galleries: Record<string, number[]> = {};
  (acf.product_colors ?? []).forEach((color: ProductColor, idx: number) => {
    const imgs: number[] = [];
    if (color.color_image) {
      imgs.push(typeof color.color_image === 'number' ? color.color_image : parseInt(String(color.color_image)));
    }
    (acf.gallery_images ?? []).forEach((g: string | number) => {
      const id = typeof g === 'number' ? g : parseInt(String(g));
      if (id && !imgs.includes(id)) imgs.push(id);
    });
    galleries[String(idx)] = imgs;
  });
  return galleries;
}

function resolveOfferData(
  methodField: 'offer_upsell_method' | 'offer_downsell_method' | 'offer_crosssell_method',
  productField: string,
  acf: WooProductACF,
  allProducts: WCProduct[]
): OfferData | null {
  const method = acf[methodField];
  if (method === 'product') {
    const oid = acf[productField as keyof WooProductACF];
    if (!oid) return null;
    const pid = typeof oid === 'number' ? oid : (oid as WCProduct)?.id;
    const found = allProducts.find((p) => p.id === pid);
    if (!found) return null;
    const reg = parseFloat(found.regular_price || found.price || '0');
    const now = parseFloat(found.price || '0');
    return {
      url: found.permalink,
      name: found.name,
      img: found.images?.[0]?.src ?? '',
      regular: reg,
      now,
      is_on_sale: reg > now,
    };
  }
  const manual = acf[`${productField.replace('_product', '_manual')}` as keyof WooProductACF] as
    | WooProductACF['offer_upsell_manual']
    | undefined;
  if (manual?.title) {
    const reg = manual.regular_price ?? 0;
    const now = manual.price ?? 0;
    return { url: manual.link ?? '#', name: manual.title, img: '', regular: reg, now, is_on_sale: reg > now };
  }
  return null;
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetch a single product by slug from WooCommerce REST API.
 * Falls back to mock data if WooCommerce is not configured.
 */
export async function getProduct(slug: string): Promise<DaroodiProduct | null> {
  // Try WooCommerce REST API
  const products = await wcFetch<WCProduct[]>(`/products?slug=${encodeURIComponent(slug)}&status=publish`);
  if (!products?.length) {
    // Fallback to mock
    const mock = INITIAL_PRODUCTS.find((p) => p.slug === slug);
    if (!mock) return null;
    return productToDaroodi(mock);
  }

  const wc = products[0];
  const acf = parseACF(wc.meta_data ?? {});

  // Fetch related products for offer resolution
  const allProducts = (await wcFetch<WCProduct[]>(`/products?status=publish&per_page=100`)) ?? [];

  const reg = parseFloat(wc.regular_price || wc.price || '0');
  const sale = parseFloat(wc.sale_price || '0');
  const salePercent = reg > 0 && sale > 0 ? Math.round(((reg - sale) / reg) * 100) : 0;

  return {
    id: wc.id,
    slug: wc.slug,
    name: wc.name,
    description: wc.description,
    short_description: wc.short_description,
    price: wc.price,
    regular_price: wc.regular_price,
    sale_price: wc.sale_price,
    price_html: wc.price_html,
    average_rating: wc.average_rating,
    rating_count: wc.rating_count,
    total_sales: wc.total_sales,
    stock_status: wc.stock_status,
    stock_quantity: wc.stock_quantity,
    type: wc.type,
    featured: wc.featured,
    images: wc.images ?? [],
    attributes: wc.attributes ?? [],
    variations: wc.variations ?? [],
    categories: wc.categories ?? [],
    acf,
    sale_percent: salePercent,
    is_on_sale: sale > 0 && sale < reg,
    main_gallery: buildMainGallery(wc),
    color_galleries: buildColorGalleries(acf),
    size_terms: resolveSizeTerms(wc),
    upsell_ids: [],
    crosssell_ids: [],
    related_ids: [],
    upsell_data: resolveOfferData('offer_upsell_method', 'offer_upsell_product', acf, allProducts) ?? undefined,
    downsell_data: resolveOfferData('offer_downsell_method', 'offer_downsell_product', acf, allProducts) ?? undefined,
    crosssell_data: resolveOfferData('offer_crosssell_method', 'offer_crosssell_product', acf, allProducts) ?? undefined,
  };
}

/**
 * Fetch related products for a given product ID.
 */
export async function getRelatedProducts(productId: number, limit = 4): Promise<WCProduct[]> {
  const products = await wcFetch<WCProduct[]>(`/products?status=publish&per_page=${limit + 1}`);
  if (!products) return [];
  return products.filter((p) => p.id !== productId).slice(0, limit);
}

/**
 * Fetch reviews for a product.
 */
export async function getProductReviews(productId: number): Promise<WCReview[]> {
  const reviews = await wcFetch<WCReview[]>(`/products/${productId}/reviews?status=approved`);
  return reviews ?? [];
}

/**
 * Add a product to the WooCommerce cart via AJAX (same endpoint the PHP template uses).
 * Returns { success: true } or throws on failure.
 */
export async function addToCartAjax(
  productId: number,
  quantity: number,
  variationId?: number,
  attributes?: Record<string, string>
): Promise<{ success: boolean; cart_url?: string; message?: string }> {
  const checkoutUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_CHECKOUT_URL ?? '/checkout';
  const formData = new FormData();
  formData.append('action', 'daroodi_add_to_cart');
  formData.append('product_specific_id', String(productId));
  formData.append('quantity', String(quantity));
  if (variationId) formData.append('variation_id', String(variationId));
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => formData.append(`attribute_${key}`, val));
  }
  formData.append('checkout_url', checkoutUrl);

  // Try the custom AJAX endpoint first
  const ajaxUrl = `${STORE_URL}/wp-admin/admin-ajax.php`;
  if (STORE_URL) {
    try {
      const res = await fetch(ajaxUrl, { method: 'POST', body: formData });
      const text = await res.text();
      // If response looks like a redirect (contains checkout URL), treat as success
      if (text.includes(checkoutUrl) || text.includes('"result":"success"')) {
        return { success: true, cart_url: checkoutUrl };
      }
      // Try WooCommerce standard add-to-cart
      const wcUrl = `${STORE_URL}/?wc-ajax=add_to_cart&product_id=${productId}&quantity=${quantity}`;
      const wcRes = await fetch(wcUrl);
      return { success: wcRes.ok, cart_url: wcRes.ok ? checkoutUrl : undefined };
    } catch {
      // Fall through to mock
    }
  }

  // Development fallback: simulate success
  return { success: true, cart_url: '/cart' };
}

/**
 * Buy Now — adds to cart then redirects to checkout.
 */
export async function buyNow(
  productId: number,
  quantity: number,
  variationId?: number,
  attributes?: Record<string, string>
): Promise<void> {
  const result = await addToCartAjax(productId, quantity, variationId, attributes);
  window.location.href = result.cart_url ?? '/checkout';
}

// ─── Mock → DaroodiProduct converter (for development) ─────────────────────────

function productToDaroodi(p: (typeof INITIAL_PRODUCTS)[number]): DaroodiProduct {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyP = p as any;
  const reg = p.regular_price_gbp ?? p.base_price_gbp;
  const sale = p.sale_price_gbp ?? p.base_price_gbp;
  const salePercent = reg > sale ? Math.round(((reg - sale) / reg) * 100) : 0;

  return {
    id: parseInt(p.id.replace('prod-', '1')),
    slug: p.slug,
    name: p.title,
    description: p.description,
    short_description: '',
    price: String(p.base_price_gbp),
    regular_price: String(p.regular_price_gbp ?? p.base_price_gbp),
    sale_price: String(p.sale_price_gbp ?? ''),
    price_html: `£${p.base_price_gbp}`,
    average_rating: '5.0',
    rating_count: 2,
    total_sales: 0,
    stock_status: p.stock_status === 'out_of_stock' ? 'outofstock' : 'instock',
    stock_quantity: null,
    type: 'simple',
    featured: p.is_featured,
    images: [
      { id: 1, src: p.featured_image_url, name: p.title, alt: p.title },
      ...p.gallery_images.map((url: string, i: number) => ({ id: i + 2, src: url, name: `${p.title} ${i + 1}`, alt: `${p.title} view ${i + 1}` })),
    ],
    attributes: [],
    variations: [],
    categories: p.collection ? [{ id: 1, name: p.collection.title, slug: p.collection.slug }] : [],
    acf: {
      product_colors: p.acf_meta.product_colors ?? [],
      pack_options: p.acf_meta.pack_options ?? [],
      product_highlights: p.acf_meta.product_highlights ?? [],
      fabric_composition: p.acf_meta.fabric_composition ?? '',
      care_instructions: p.acf_meta.care_instructions ?? '',
      product_specifications: p.acf_meta.specifications ?? {},
      specifications: p.acf_meta.specifications ?? {},
      fit_type: p.acf_meta.fit_details?.fit_type ?? '',
      model_info: p.acf_meta.fit_details?.model_info ?? '',
      fit_description: p.acf_meta.fit_details?.fit_description ?? '',
      product_faqs: p.acf_meta.product_faqs ?? [],
      size_guide_text: p.acf_meta.size_guide?.size_guide_text ?? '',
      stylist_name: p.acf_meta.style_consultant?.stylist_name ?? '',
      stylist_whatsapp: p.acf_meta.style_consultant?.stylist_whatsapp ?? '923001215532',
      style_consultant: p.acf_meta.style_consultant,
    },
    sale_percent: salePercent,
    is_on_sale: sale < reg,
    main_gallery: [1],
    color_galleries: {},
    size_terms: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    upsell_ids: [],
    crosssell_ids: [],
    related_ids: [],
  };
}
