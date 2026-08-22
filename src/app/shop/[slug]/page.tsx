'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { INITIAL_PRODUCTS } from '@/lib/mockData';
import { useCart } from '@/context/CartContext';
import { CustomMeasurements } from '@/lib/types';
import {
  Sparkles,
  Scissors,
  ShoppingBag,
  MessageCircle,
  Truck,
  RotateCcw,
  X,
  Ruler,
  ChevronDown,
  ChevronUp,
  Phone,
  Share2,
} from 'lucide-react';

const FALLBACK_IMAGE = '/uploads/2026/06/Mens-Premium-Prince-Coat-4.webp';

export default function SingleProductPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const slug = params?.slug as string;

  const product = INITIAL_PRODUCTS.find((p) => p.slug === slug) || INITIAL_PRODUCTS[0];

  const [activeImage, setActiveImage] = useState(product.featured_image_url || FALLBACK_IMAGE);

  React.useEffect(() => {
    if (product?.featured_image_url) {
      setActiveImage(product.featured_image_url);
    }
  }, [product]);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>(
    product.acf_meta?.product_colors?.[0]?.name || 'Imperial Emerald'
  );
  const [isCustomSizing, setIsCustomSizing] = useState(false);
  const [selectedPackIndex, setSelectedPackIndex] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Accordion open states
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    description: true,
    sizing: false,
    shipping: false,
    promise: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Mobile Bar Submenus State
  const [showChatSubmenu, setShowChatSubmenu] = useState(false);
  const [showShareSubmenu, setShowShareSubmenu] = useState(false);

  // Bundle Pricing Multiplier
  const packPriceAddon = selectedPackIndex === 1 ? 200 : selectedPackIndex === 2 ? 430 : 0;
  const basePrice = product.sale_price_gbp || product.base_price_gbp;
  const currentPrice = basePrice + packPriceAddon;

  // Custom Measurements State
  const [measurements, setMeasurements] = useState<CustomMeasurements>({
    chest: 40,
    shoulder: 18,
    waist: 34,
    hips: 40,
    sleeve_length: 25,
    jacket_length: 30,
    fit_preference: 'tailored',
    special_notes: '',
  });

  const handleAddToCart = () => {
    addToCart(
      product,
      1,
      isCustomSizing ? 'Custom Bespoke' : selectedSize,
      selectedColor,
      isCustomSizing,
      isCustomSizing ? measurements : undefined
    );
    alert(`Added "${product.title}" to your Shopping Bag!`);
  };

  // 4 Related Products
  const relatedProducts = INITIAL_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  // 4 Best Deal Curated Complements
  const bestDeals = INITIAL_PRODUCTS.slice(1, 5);

  // 4 Journal Style Articles
  const journalPosts = [
    {
      title: 'The Art of Zardozi: From Royal Courts to Modern Black-Tie',
      date: 'Aug 12, 2026',
      image: '/uploads/2026/06/Mens-Slate-Blue-Double-Breasted-Overcoat-3.webp',
      slug: 'art-of-zardozi-heritage',
    },
    {
      title: 'How to Choose Your Wedding Prince Coat: The Complete Guide',
      date: 'Jul 29, 2026',
      image: '/uploads/2026/06/Premium-Chocolate-Brown-Embellished-Tuxedo-Blazer-3.webp',
      slug: 'prince-coat-wedding-guide',
    },
    {
      title: 'Velvet vs. Brocade: Selecting the Right Ceremonial Fabric',
      date: 'Jul 15, 2026',
      image: '/uploads/2026/06/Womens-Antique-Ivory-Silk-Velvet-Gown-Coat-4.webp',
      slug: 'velvet-vs-brocade-fabrics',
    },
    {
      title: 'Mastering Made-to-Measure: Taking Flawless Body Measurements',
      date: 'Jun 30, 2026',
      image: '/uploads/2026/06/Ivory-White-Linen-Tailored-Blazer-4.webp',
      slug: 'taking-perfect-body-measurements',
    },
  ];

  return (
    <div className="daroodi-sp-wrapper">
      {/* ─── Breadcrumb ─────────────────────────────────────────── */}
      <nav className="daroodi-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/shop">Shop</Link>
        <span>/</span>
        <Link href={`/collections#${product.collection?.tier?.toLowerCase() || 'platinum'}`}>
          {product.collection?.tier || 'Platinum'} Collection
        </Link>
        <span>/</span>
        <span className="current">{product.title}</span>
      </nav>

      {/* ─── 2-Column Product Grid ──────────────────────────────── */}
      <div className="daroodi-sp-grid">
        {/* LEFT COLUMN: Pinned Sticky Gallery */}
        <div className="daroodi-gallery-col">
          <div className="daroodi-main-image-wrap">
            <span className="daroodi-sale-badge">
              ✦ Made-To-Order · {product.collection?.tier || 'Platinum'}
            </span>
            <img
              src={activeImage}
              alt={product.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
              }}
            />
          </div>

          {/* Thumbnails */}
          <div className="daroodi-thumbnails">
            {(product.gallery_images && product.gallery_images.length > 0
              ? product.gallery_images
              : [product.featured_image_url || FALLBACK_IMAGE]
            ).map((img, idx) => (
              <div
                key={idx}
                className={`daroodi-thumb ${activeImage === img ? 'active' : ''}`}
                onClick={() => setActiveImage(img)}
              >
                <img
                  src={img}
                  alt={`Angle ${idx + 1}`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Product Details & Accordions */}
        <div className="daroodi-info-col">
          <div className="daroodi-card">
            <div className="daroodi-tier-tag">
              👑 {product.collection?.tier || 'Platinum'} Collection · Heirloom Tier
            </div>

            <h1 className="daroodi-product-title">{product.title}</h1>

            {/* Rating */}
            <div className="daroodi-rating-row">
              <div className="daroodi-stars">★★★★★</div>
              <span className="daroodi-review-count">5.0 (3 Verified Client Reviews)</span>
              <span className="daroodi-write-review" onClick={() => setShowReviewModal(true)}>
                Write a Review
              </span>
            </div>

            {/* Price */}
            <div className="daroodi-price-row">
              <span className="daroodi-current-price">£{currentPrice.toFixed(2)}</span>
              {product.regular_price_gbp && (
                <span className="daroodi-original-price">
                  £{(product.regular_price_gbp + packPriceAddon).toFixed(2)}
                </span>
              )}
              <span className="daroodi-save-badge">Includes Complimentary Sizing</span>
            </div>

            {/* Pack Bundle Options */}
            {product.acf_meta?.pack_options && product.acf_meta.pack_options.length > 0 && (
              <div>
                <div className="daroodi-section-label">
                  <span>Select Ensemble Configuration</span>
                  <span style={{ fontSize: '11px', color: 'var(--daroodi-green)', textTransform: 'none' }}>
                    Bundle &amp; Save
                  </span>
                </div>
                <div className="daroodi-packs">
                  {product.acf_meta.pack_options.map((pack, idx) => (
                    <div
                      key={idx}
                      className={`daroodi-pack-item ${selectedPackIndex === idx ? 'active' : ''}`}
                      onClick={() => setSelectedPackIndex(idx)}
                    >
                      <div>
                        <strong style={{ fontSize: '13px', color: 'var(--daroodi-black)' }}>
                          {pack.title}
                        </strong>
                        <p style={{ fontSize: '11px', color: 'var(--daroodi-gray)', margin: '2px 0 0' }}>
                          {pack.subtitle}
                        </p>
                      </div>
                      {pack.badge && <span className="daroodi-pack-badge">{pack.badge}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Color Canvas Swatches */}
            {product.acf_meta?.product_colors && (
              <div>
                <div className="daroodi-section-label">
                  <span>Color Canvas: <strong>{selectedColor}</strong></span>
                </div>
                <div className="daroodi-color-swatches">
                  {product.acf_meta.product_colors.map((c) => (
                    <div
                      key={c.name}
                      className={`daroodi-swatch-box ${selectedColor === c.name ? 'active' : ''}`}
                      onClick={() => setSelectedColor(c.name)}
                    >
                      <div className="daroodi-swatch" style={{ background: c.hex }} title={c.name} />
                      <span className="daroodi-swatch-name">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Size Options */}
            <div>
              <div className="daroodi-section-label">
                <span>Select Size</span>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '12px',
                    color: 'var(--daroodi-green)',
                    textDecoration: 'underline',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Ruler size={13} /> Size Guide
                </button>
              </div>

              <div className="daroodi-sizes">
                {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    className={`daroodi-size-btn ${!isCustomSizing && selectedSize === sz ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedSize(sz);
                      setIsCustomSizing(false);
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              {/* Custom Measurements Accordion Toggle */}
              <div
                className="daroodi-custom-measure-toggle"
                onClick={() => setIsCustomSizing(!isCustomSizing)}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={15} color="var(--daroodi-gold)" /> Or Request Made-To-Measure Dimensions
                </span>
                <span style={{ color: 'var(--daroodi-green)', fontSize: '12px' }}>
                  {isCustomSizing ? '▲ Close' : '▼ Expand'}
                </span>
              </div>

              {isCustomSizing && (
                <div style={{ background: '#FAF8F5', padding: '16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--daroodi-border)' }}>
                  <p style={{ fontSize: '11px', color: 'var(--daroodi-gray)', marginBottom: '12px' }}>
                    Enter your dimensions in inches. Our head master drafts your individual pattern to the quarter-inch.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700 }}>Chest (in)</label>
                      <input
                        type="number"
                        step="0.25"
                        value={measurements.chest}
                        onChange={(e) => setMeasurements({ ...measurements, chest: parseFloat(e.target.value) || 0 })}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--daroodi-border)', background: '#fff' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700 }}>Shoulder (in)</label>
                      <input
                        type="number"
                        step="0.25"
                        value={measurements.shoulder}
                        onChange={(e) => setMeasurements({ ...measurements, shoulder: parseFloat(e.target.value) || 0 })}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--daroodi-border)', background: '#fff' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700 }}>Waist (in)</label>
                      <input
                        type="number"
                        step="0.25"
                        value={measurements.waist}
                        onChange={(e) => setMeasurements({ ...measurements, waist: parseFloat(e.target.value) || 0 })}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--daroodi-border)', background: '#fff' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700 }}>Sleeve (in)</label>
                      <input
                        type="number"
                        step="0.25"
                        value={measurements.sleeve_length}
                        onChange={(e) => setMeasurements({ ...measurements, sleeve_length: parseFloat(e.target.value) || 0 })}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--daroodi-border)', background: '#fff' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="daroodi-action-row">
              <button onClick={handleAddToCart} className="daroodi-btn-cart">
                <ShoppingBag size={18} /> Add to Bag (£{currentPrice.toFixed(2)})
              </button>
              <a
                href={`https://wa.me/923001215532?text=${encodeURIComponent(`Salam Daroodi! I want to order ${product.title} (£${currentPrice}) in ${selectedColor}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="daroodi-btn-wa"
              >
                <MessageCircle size={18} /> WhatsApp Order
              </a>
            </div>

            {/* Stylist Card */}
            <div className="daroodi-stylist-card">
              <div className="daroodi-stylist-avatar">D</div>
              <div style={{ flexGrow: 1 }}>
                <strong style={{ fontSize: '13px', color: 'var(--daroodi-green)', display: 'block' }}>
                  Daroodi Stylist &amp; Concierge Service
                </strong>
                <p style={{ fontSize: '12px', color: 'var(--daroodi-gray)', margin: '2px 0 0' }}>
                  Speak directly with our master tailor for bespoke fitting advice.
                </p>
              </div>
              <a
                href="https://wa.me/923001215532"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '12px', fontWeight: 700, color: 'var(--daroodi-green)', textDecoration: 'underline' }}
              >
                Chat Now →
              </a>
            </div>

            {/* Guarantees */}
            <div className="daroodi-guarantees">
              <div className="daroodi-guarantee-item">
                <Scissors size={18} color="var(--daroodi-green)" />
                <span>100% Hand Embroidery</span>
              </div>
              <div className="daroodi-guarantee-item">
                <Truck size={18} color="var(--daroodi-green)" />
                <span>DHL Express Worldwide</span>
              </div>
              <div className="daroodi-guarantee-item">
                <RotateCcw size={18} color="var(--daroodi-green)" />
                <span>Free Size Adjustment</span>
              </div>
            </div>

            {/* ─── PRODUCT ACCORDIONS ──────────────────────────────── */}
            <div className="daroodi-accordion-wrap">
              {/* Accordion 1: Description & Specs */}
              <div className={`daroodi-acc-item ${openAccordions.description ? 'open' : ''}`}>
                <button
                  type="button"
                  className="daroodi-acc-header"
                  onClick={() => toggleAccordion('description')}
                >
                  <span>Garment Description &amp; Craftsmanship</span>
                  {openAccordions.description ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordions.description && (
                  <div className="daroodi-acc-content">
                    <p style={{ marginTop: '10px' }}>{product.description}</p>
                    <ul style={{ paddingLeft: '18px', margin: '8px 0', lineHeight: 1.6 }}>
                      <li><strong>Fabric:</strong> {product.acf_meta?.fabric_composition || 'Italian Silk Micro-Velvet'}</li>
                      <li><strong>Embroidery:</strong> {product.acf_meta?.embroidery_technique || 'Hand Zardozi & Metallic Dabka'}</li>
                      <li><strong>Structure:</strong> Full floating horsehair canvas lapels</li>
                      <li><strong>Care:</strong> {product.acf_meta?.care_instructions || 'Specialist Dry Clean Only'}</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 2: Sizing & Fit */}
              <div className={`daroodi-acc-item ${openAccordions.sizing ? 'open' : ''}`}>
                <button
                  type="button"
                  className="daroodi-acc-header"
                  onClick={() => toggleAccordion('sizing')}
                >
                  <span>Bespoke Sizing &amp; Custom Fit Guide</span>
                  {openAccordions.sizing ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordions.sizing && (
                  <div className="daroodi-acc-content">
                    <p style={{ marginTop: '10px' }}>
                      Every Daroodi garment is handcrafted to order. Choose standard sizing (XS to 3XL) or enter your chest, shoulder, waist, and sleeve measurements for a bespoke custom pattern drafted to the quarter-inch.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Shipping & Delivery */}
              <div className={`daroodi-acc-item ${openAccordions.shipping ? 'open' : ''}`}>
                <button
                  type="button"
                  className="daroodi-acc-header"
                  onClick={() => toggleAccordion('shipping')}
                >
                  <span>Worldwide Shipping &amp; Delivery</span>
                  {openAccordions.shipping ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordions.shipping && (
                  <div className="daroodi-acc-content">
                    <p style={{ marginTop: '10px' }}>
                      We ship worldwide via DHL Express with full end-to-end tracking. Transit times after handcrafting completion: UK/Europe (3-4 days), USA/Canada (4-5 days), UAE/Gulf (2-3 days), Australia (5-6 days).
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 4: Quality Promise */}
              <div className={`daroodi-acc-item ${openAccordions.promise ? 'open' : ''}`}>
                <button
                  type="button"
                  className="daroodi-acc-header"
                  onClick={() => toggleAccordion('promise')}
                >
                  <span>Our Quality &amp; Heritage Promise</span>
                  {openAccordions.promise ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordions.promise && (
                  <div className="daroodi-acc-content">
                    <p style={{ marginTop: '10px' }}>
                      100% authentic hand needlework created by generational master artisans in Pakistan. If any fit adjustments are required upon delivery, our atelier provides complimentary alterations support.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECTION 1: 4 CARDS PER ROW — "Complete Your Royal Look" ─── */}
      <div className="daroodi-section-block">
        <header className="section-header section-header--styled center">
          <div className="section-ornament" aria-hidden="true">
            <span className="ornament-line"></span>
            <span className="ornament-gem">◆</span>
            <span className="ornament-line"></span>
          </div>
          <span className="eyebrow">Curated Complements</span>
          <h2 style={{ fontFamily: 'Libre Baskerville, serif', fontSize: '26px', color: 'var(--daroodi-black)' }}>
            Complete Your Royal Look
          </h2>
        </header>

        <div className="daroodi-4col-grid">
          {relatedProducts.map((rel) => (
            <Link key={rel.id} href={`/shop/${rel.slug}`} className="product-card">
              <div className="product-image-wrap">
                <img
                  src={rel.featured_image_url || FALLBACK_IMAGE}
                  alt={rel.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                />
                <span className="product-badge">{rel.collection?.tier || 'Gold'}</span>
                <span className="product-quick-view">Inspect Garment</span>
              </div>
              <div className="product-info">
                <h4>{rel.title}</h4>
                <span className="price">From £{rel.base_price_gbp.toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── SECTION 2: 4 CARDS PER ROW — "Atelier Best Deals & Complements" ─ */}
      <div className="daroodi-section-block">
        <header className="section-header section-header--styled center">
          <div className="section-ornament" aria-hidden="true">
            <span className="ornament-line"></span>
            <span className="ornament-gem">◆</span>
            <span className="ornament-line"></span>
          </div>
          <span className="eyebrow">Atelier Specials</span>
          <h2 style={{ fontFamily: 'Libre Baskerville, serif', fontSize: '26px', color: 'var(--daroodi-black)' }}>
            Featured Masterpiece Deals
          </h2>
        </header>

        <div className="daroodi-4col-grid">
          {bestDeals.map((deal) => (
            <Link key={deal.id} href={`/shop/${deal.slug}`} className="daroodi-deal-card">
              <div className="daroodi-deal-img-wrap">
                <img
                  src={deal.featured_image_url || FALLBACK_IMAGE}
                  alt={deal.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                />
                <span className="daroodi-hot-badge">🔥 Hot Deal</span>
              </div>
              <div className="daroodi-deal-body">
                <h4 className="daroodi-deal-title">{deal.title}</h4>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '8px' }}>
                  <span className="daroodi-deal-price">£{deal.base_price_gbp.toFixed(2)}</span>
                  {deal.regular_price_gbp && (
                    <span style={{ fontSize: '13px', color: '#999', textDecoration: 'line-through' }}>
                      £{deal.regular_price_gbp.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── SECTION 3: 4 CARDS PER ROW — "Atelier Journal & Style Guides" ── */}
      <div className="daroodi-section-block">
        <header className="section-header section-header--styled center">
          <div className="section-ornament" aria-hidden="true">
            <span className="ornament-line"></span>
            <span className="ornament-gem">◆</span>
            <span className="ornament-line"></span>
          </div>
          <span className="eyebrow">Editorial</span>
          <h2 style={{ fontFamily: 'Libre Baskerville, serif', fontSize: '26px', color: 'var(--daroodi-black)' }}>
            The Daroodi Style Journal
          </h2>
        </header>

        <div className="daroodi-4col-grid">
          {journalPosts.map((post, idx) => (
            <Link key={idx} href={`/journal/${post.slug}`} className="product-card" style={{ textDecoration: 'none' }}>
              <div className="product-image-wrap" style={{ aspectRatio: '16/10' }}>
                <img
                  src={post.image}
                  alt={post.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                />
              </div>
              <div className="product-info">
                <span style={{ fontSize: '11px', color: 'var(--daroodi-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {post.date}
                </span>
                <h4 style={{ fontSize: '13px', marginTop: '4px', lineHeight: 1.4 }}>{post.title}</h4>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── Size Guide Modal ────────────────────────────────────── */}
      {showSizeGuide && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '20px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--daroodi-black)', margin: 0 }}>
                Daroodi Sizing Guide
              </h2>
              <button onClick={() => setShowSizeGuide(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left', marginBottom: '20px' }}>
              <thead>
                <tr style={{ background: 'var(--daroodi-cream)', borderBottom: '2px solid var(--daroodi-border)' }}>
                  <th style={{ padding: '10px' }}>Size</th>
                  <th style={{ padding: '10px' }}>Chest</th>
                  <th style={{ padding: '10px' }}>Shoulder</th>
                  <th style={{ padding: '10px' }}>Length</th>
                  <th style={{ padding: '10px' }}>Sleeve</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--daroodi-border)' }}><td style={{ padding: '10px' }}><strong>XS</strong></td><td>36&quot;</td><td>17.0&quot;</td><td>28.5&quot;</td><td>24.0&quot;</td></tr>
                <tr style={{ borderBottom: '1px solid var(--daroodi-border)' }}><td style={{ padding: '10px' }}><strong>S</strong></td><td>38&quot;</td><td>17.5&quot;</td><td>29.0&quot;</td><td>24.5&quot;</td></tr>
                <tr style={{ borderBottom: '1px solid var(--daroodi-border)' }}><td style={{ padding: '10px' }}><strong>M</strong></td><td>40&quot;</td><td>18.0&quot;</td><td>30.0&quot;</td><td>25.0&quot;</td></tr>
                <tr style={{ borderBottom: '1px solid var(--daroodi-border)' }}><td style={{ padding: '10px' }}><strong>L</strong></td><td>42&quot;</td><td>18.5&quot;</td><td>30.5&quot;</td><td>25.5&quot;</td></tr>
                <tr style={{ borderBottom: '1px solid var(--daroodi-border)' }}><td style={{ padding: '10px' }}><strong>XL</strong></td><td>44&quot;</td><td>19.0&quot;</td><td>31.0&quot;</td><td>26.0&quot;</td></tr>
                <tr style={{ borderBottom: '1px solid var(--daroodi-border)' }}><td style={{ padding: '10px' }}><strong>2XL</strong></td><td>46&quot;</td><td>19.5&quot;</td><td>31.5&quot;</td><td>26.5&quot;</td></tr>
                <tr><td style={{ padding: '10px' }}><strong>3XL</strong></td><td>48&quot;</td><td>20.0&quot;</td><td>32.0&quot;</td><td>27.0&quot;</td></tr>
              </tbody>
            </table>

            <button onClick={() => setShowSizeGuide(false)} className="btn btn-primary" style={{ width: '100%' }}>
              Close Size Guide
            </button>
          </div>
        </div>
      )}

      {/* ─── Review Modal ────────────────────────────────────────── */}
      {showReviewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '20px', maxWidth: '460px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--daroodi-black)', margin: 0 }}>
                Write a Client Review
              </h2>
              <button onClick={() => setShowReviewModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for submitting your verified review!');
                setShowReviewModal(false);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Your Name</label>
                <input type="text" required placeholder="e.g. Tariq Mansoor" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--daroodi-border)' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Rating</label>
                <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--daroodi-border)' }}>
                  <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                  <option value={4}>★★★★☆ (4 Stars - Great)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Good)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Review</label>
                <textarea rows={3} required placeholder="Describe the embroidery, fabric, and fit..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--daroodi-border)' }}></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── Exact Single Product Mobile Sticky Pill Bar from WooCommerce ─── */}
      <div className="daroodi-mobile-bar" id="daroodi-mobile-bar">
        {/* Chat Submenu (shown above Chat tile) */}
        <div className={`daroodi-chat-submenu ${showChatSubmenu ? 'show' : ''}`} id="daroodi-chat-submenu">
          <a
            href={`https://wa.me/923001215532?text=${encodeURIComponent(`Hi Daroodi! I am interested in ${product.title} (£${currentPrice.toFixed(2)}). Can you help me with this product?`)}`}
            className="daroodi-submenu-btn daroodi-submenu-wa"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle size={14} />
            <span>WhatsApp</span>
          </a>
          <a
            href="tel:+923001215532"
            className="daroodi-submenu-btn daroodi-submenu-call"
            aria-label="Call Style Consultant"
          >
            <Phone size={14} />
            <span>Call</span>
          </a>
        </div>

        {/* Share Submenu (shown above Share tile) */}
        <div className={`daroodi-share-submenu ${showShareSubmenu ? 'show' : ''}`} id="daroodi-share-submenu">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this premium design on Daroodi: ${product.title} - ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
            className="daroodi-share-btn daroodi-share-wa"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
          >
            <MessageCircle size={15} />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
            className="daroodi-share-btn daroodi-share-fb"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
          >
            <Share2 size={15} />
          </a>
          <button
            type="button"
            className="daroodi-share-btn daroodi-share-link"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Product link copied to clipboard!');
              }
            }}
            aria-label="Copy Product Link"
          >
            <Sparkles size={15} />
          </button>
        </div>

        <div className="daroodi-mobile-bar-row">
          {/* Share Icon Button */}
          <button
            type="button"
            className="daroodi-mobile-tile daroodi-mobile-share-tile"
            id="daroodi-mobile-share-btn"
            aria-label="Share Product Link"
            onClick={() => {
              setShowShareSubmenu(!showShareSubmenu);
              if (showChatSubmenu) setShowChatSubmenu(false);
            }}
          >
            <Share2 size={20} />
            <span>Share</span>
          </button>

          {/* Chat Icon Button (Triggers Submenu) */}
          <button
            type="button"
            className="daroodi-mobile-tile daroodi-mobile-chat-tile"
            id="daroodi-mobile-chat-btn"
            aria-label="Chat and Call Options"
            onClick={() => {
              setShowChatSubmenu(!showChatSubmenu);
              if (showShareSubmenu) setShowShareSubmenu(false);
            }}
          >
            <MessageCircle size={20} />
            <span>Chat</span>
          </button>

          {/* CTA Actions (Custom Order + Shop) */}
          <div className="daroodi-mobile-cta-group">
            <Link
              href={`/custom-order?product=${product.slug}`}
              className="daroodi-mobile-btn-custom-cta"
            >
              <span>Custom Order</span>
            </Link>
            <button
              type="button"
              onClick={handleAddToCart}
              className="daroodi-mobile-btn-cart-cta"
              aria-label="Add to Bag"
            >
              <span>
                <ShoppingBag size={14} /> Shop
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
