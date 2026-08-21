'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProducts } from '@/lib/db/products';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import {
  Search,
  Filter,
  Grid3X3,
  LayoutGrid,
  Eye,
  ShoppingBag,
  Star,
  Check,
  Folder,
  X,
  Sparkles,
} from 'lucide-react';

const FALLBACK_IMAGE = '/uploads/2026/05/hero-coat.jpg';

export default function ShopPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  // Quick View Modal
  const [quickProduct, setQuickProduct] = useState<Product | null>(null);
  const [quickSize, setQuickSize] = useState<string>('M');
  const [quickColor, setQuickColor] = useState<string>('Default');
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  const categories = [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'prince-coat', name: 'Prince Coats', count: products.filter(p => p.title.toLowerCase().includes('prince') || p.title.toLowerCase().includes('coat')).length || 2 },
    { id: 'sherwani', name: 'Sherwanis', count: products.filter(p => p.title.toLowerCase().includes('sherwani') || p.title.toLowerCase().includes('tuxedo')).length || 2 },
    { id: 'blazer', name: 'Blazers & Jackets', count: products.filter(p => p.title.toLowerCase().includes('blazer')).length || 3 },
    { id: 'waistcoat', name: 'Waistcoats & Layering', count: products.filter(p => p.title.toLowerCase().includes('suit') || p.title.toLowerCase().includes('coat')).length || 1 },
  ];

  const filteredProducts = products.filter((prod) => {
    // Category match
    if (selectedCategory === 'prince-coat') {
      if (!prod.title.toLowerCase().includes('prince') && !prod.title.toLowerCase().includes('coat')) return false;
    } else if (selectedCategory === 'sherwani') {
      if (!prod.title.toLowerCase().includes('sherwani') && !prod.title.toLowerCase().includes('tuxedo')) return false;
    } else if (selectedCategory === 'blazer') {
      if (!prod.title.toLowerCase().includes('blazer')) return false;
    } else if (selectedCategory === 'waistcoat') {
      if (!prod.title.toLowerCase().includes('suit') && !prod.title.toLowerCase().includes('coat')) return false;
    }

    // Availability
    if (inStockOnly && prod.stock_status !== 'in_stock') return false;
    if (onSaleOnly && !prod.sale_price_gbp) return false;

    // Price
    const effectivePrice = prod.sale_price_gbp || prod.base_price_gbp;
    if (effectivePrice < minPrice || effectivePrice > maxPrice) return false;

    return true;
  }).sort((a, b) => {
    const priceA = a.sale_price_gbp || a.base_price_gbp;
    const priceB = b.sale_price_gbp || b.base_price_gbp;
    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return 0;
  });

  const handleCardAdd = (prod: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(
      prod,
      1,
      'M',
      prod.acf_meta?.product_colors?.[0]?.name || 'Standard'
    );
    setAddedId(prod.id);
    setTimeout(() => setAddedId(null), 1600);
  };

  const openQuickView = (prod: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickProduct(prod);
    setQuickSize('M');
    setQuickColor(prod.acf_meta?.product_colors?.[0]?.name || 'Imperial Emerald');
  };

  const handleModalAdd = () => {
    if (!quickProduct) return;
    addToCart(quickProduct, 1, quickSize, quickColor);
    alert(`Added "${quickProduct.title}" (${quickColor}, Size ${quickSize}) to bag!`);
    setQuickProduct(null);
  };

  return (
    <div className="daroodi-shop-page">
      <div className="daroodi-shop-container">
        
        {/* ─── Hero Header ────────────────────────────────────────── */}
        <div className="shop-hero-header">
          <div>
            <span className="shop-eyebrow">COLLECTIONS</span>
            <h1 className="shop-main-title">All Products</h1>
          </div>
          <div className="shop-count-badge">
            Showing <strong>{filteredProducts.length}</strong> masterpiece pieces
          </div>
        </div>

        {/* ─── 12-Column Grid Layout ──────────────────────────────── */}
        <div className="shop-layout-grid">
          
          {/* ─── Left Sidebar Filters ─────────────────────────────── */}
          <aside className="shop-sidebar">
            
            {/* Categories */}
            <div className="shop-filter-card">
              <div className="shop-filter-title">
                <Folder size={14} color="var(--daroodi-gold)" />
                <span>CATEGORIES</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`shop-category-link ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <span>{cat.name}</span>
                    <span className="shop-category-count">{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="shop-filter-card">
              <div className="shop-filter-title">AVAILABILITY</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={!inStockOnly && !onSaleOnly}
                    onChange={() => {
                      setInStockOnly(false);
                      setOnSaleOnly(false);
                    }}
                    style={{ accentColor: 'var(--daroodi-gold)' }}
                  />
                  <span>All Items</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    style={{ accentColor: 'var(--daroodi-gold)' }}
                  />
                  <span>Ready to Ship</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={onSaleOnly}
                    onChange={(e) => setOnSaleOnly(e.target.checked)}
                    style={{ accentColor: 'var(--daroodi-gold)' }}
                  />
                  <span>On Special Offer</span>
                </label>
              </div>
            </div>

            {/* Price Range */}
            <div className="shop-filter-card">
              <div className="shop-filter-title">PRICE RANGE (GBP)</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '11px', color: 'var(--daroodi-gray)', display: 'block', marginBottom: '2px' }}>Min (£)</span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    style={{ width: '100%', padding: '6px 10px', border: '1px solid var(--daroodi-border)', borderRadius: '10px', fontSize: '13px' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '11px', color: 'var(--daroodi-gray)', display: 'block', marginBottom: '2px' }}>Max (£)</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    style={{ width: '100%', padding: '6px 10px', border: '1px solid var(--daroodi-border)', borderRadius: '10px', fontSize: '13px' }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert('Price filters applied!')}
                style={{ marginTop: '14px', width: '100%', padding: '8px', borderRadius: '12px', background: 'var(--daroodi-green-dark)', color: '#FFFFFF', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
              >
                Apply Range
              </button>
            </div>

            {/* VIP Access Card */}
            <div className="shop-vip-card">
              <div className="shop-vip-title">Exclusive Atelier Access</div>
              <div className="shop-vip-text">
                Join the Daroodi Circle for private bridal drops and direct master tailor previews.
              </div>
              <button
                type="button"
                className="shop-vip-btn"
                onClick={() => alert('Welcome to the Daroodi VIP Circle!')}
              >
                Join Now
              </button>
            </div>

          </aside>

          {/* ─── Right Main Products Column ────────────────────────── */}
          <main>
            
            {/* Top Bar: Sort & View Toggle */}
            <div className="shop-top-bar">
              <div style={{ fontSize: '13px', color: 'var(--daroodi-gray)' }}>
                Showing <strong style={{ color: 'var(--daroodi-black)' }}>{filteredProducts.length}</strong> bespoke designs
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="shop-select-sort"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>

                <div className="shop-grid-toggle">
                  <button
                    type="button"
                    className={`shop-grid-btn ${gridCols === 4 ? 'active' : ''}`}
                    onClick={() => setGridCols(4)}
                    title="4 Columns"
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    type="button"
                    className={`shop-grid-btn ${gridCols === 3 ? 'active' : ''}`}
                    onClick={() => setGridCols(3)}
                    title="3 Columns"
                  >
                    <LayoutGrid size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* 3D Luxury Diamond Divider */}
            <div className="luxury-divider" aria-hidden="true"></div>

            {/* Products Grid */}
            <div className={`shop-product-grid ${gridCols === 4 ? 'cols-4' : 'cols-3'}`}>
              {filteredProducts.map((prod, idx) => {
                const effectivePrice = prod.sale_price_gbp || prod.base_price_gbp;
                const badgeText = idx === 0 ? 'NEW' : idx === 1 ? 'BEST' : idx === 3 ? 'HOT' : prod.collection?.tier?.toUpperCase() || 'PLATINUM';

                return (
                  <Link key={prod.id} href={`/shop/${prod.slug}`} className="shop-card">
                    <div className="shop-card-img-wrap">
                      <img
                        src={prod.featured_image_url || FALLBACK_IMAGE}
                        alt={prod.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                        }}
                      />
                      <span className="shop-card-badge-left">{badgeText}</span>
                      {prod.regular_price_gbp && (
                        <span className="shop-card-badge-right">
                          -{Math.round(((prod.regular_price_gbp - effectivePrice) / prod.regular_price_gbp) * 100)}%
                        </span>
                      )}
                      <button
                        type="button"
                        className="shop-quickview-btn"
                        onClick={(e) => openQuickView(prod, e)}
                      >
                        <Eye size={13} /> Quick View
                      </button>
                    </div>

                    <div className="shop-card-body">
                      <div>
                        <h2 className="shop-card-title">{prod.title}</h2>
                        <div className="shop-card-sub">
                          {prod.acf_meta?.fabric_composition?.split(',')[0] || 'Handcrafted Silk Velvet'}
                        </div>
                      </div>

                      <div>
                        <div className="shop-card-prices">
                          <span className="shop-card-price">£{effectivePrice.toFixed(2)}</span>
                          {prod.regular_price_gbp && (
                            <span className="shop-card-original">£{prod.regular_price_gbp.toFixed(2)}</span>
                          )}
                        </div>

                        <div className="shop-card-footer">
                          <div className="shop-card-stars">★★★★★</div>
                          <button
                            type="button"
                            className="shop-card-add-btn"
                            onClick={(e) => handleCardAdd(prod, e)}
                          >
                            {addedId === prod.id ? '✓ Added' : 'Add'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Load More Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
              <button
                type="button"
                onClick={() => alert('All current catalogue pieces loaded.')}
                style={{ padding: '12px 36px', border: '1.5px solid var(--daroodi-green-dark)', borderRadius: '50px', background: '#FFFFFF', color: 'var(--daroodi-green-dark)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'var(--daroodi-green-dark)';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.color = 'var(--daroodi-green-dark)';
                }}
              >
                Load More Products
              </button>
            </div>

          </main>
        </div>
      </div>

      {/* ─── Luxury Quick View Modal ─────────────────────────────── */}
      {quickProduct && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '20px' }}
          onClick={() => setQuickProduct(null)}
        >
          <div
            style={{ background: '#FFFFFF', width: '100%', maxWidth: '820px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', display: 'grid', gridTemplateColumns: '1fr 1fr' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Image Box */}
            <div style={{ background: 'var(--daroodi-green-dark)', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={quickProduct.featured_image_url || FALLBACK_IMAGE}
                alt={quickProduct.title}
                style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
              />
            </div>

            {/* Right Details */}
            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--daroodi-black)', margin: 0, lineHeight: 1.3 }}>
                      {quickProduct.title}
                    </h2>
                    <span style={{ fontSize: '12px', color: 'var(--daroodi-gray)' }}>
                      {quickProduct.collection?.tier || 'Platinum'} · Bespoke Collection
                    </span>
                  </div>
                  <button
                    onClick={() => setQuickProduct(null)}
                    style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: 'var(--daroodi-gray)' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--daroodi-green-dark)', marginTop: '12px' }}>
                  £{(quickProduct.sale_price_gbp || quickProduct.base_price_gbp).toFixed(2)}
                </div>

                {/* Color */}
                <div style={{ marginTop: '18px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Color: <strong>{quickColor}</strong>
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {(quickProduct.acf_meta?.product_colors || [{ name: 'Imperial Emerald', hex: '#0F241E' }]).map((c) => (
                      <div
                        key={c.name}
                        onClick={() => setQuickColor(c.name)}
                        style={{ width: '28px', height: '28px', borderRadius: '50%', background: c.hex, cursor: 'pointer', border: quickColor === c.name ? '2px solid var(--daroodi-green)' : '1px solid var(--daroodi-border)', transform: quickColor === c.name ? 'scale(1.15)' : 'scale(1)' }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div style={{ marginTop: '16px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Select Size
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['XS', 'S', 'M', 'L', 'XL'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setQuickSize(sz)}
                        style={{ minWidth: '36px', height: '32px', borderRadius: '8px', border: quickSize === sz ? '2px solid var(--daroodi-green)' : '1px solid var(--daroodi-border)', background: quickSize === sz ? 'var(--daroodi-green-dark)' : '#fff', color: quickSize === sz ? 'var(--daroodi-gold)' : 'var(--daroodi-black)', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={handleModalAdd}
                  style={{ flex: 1, padding: '12px', borderRadius: '50px', background: 'linear-gradient(135deg, var(--daroodi-gold), var(--daroodi-gold-light))', color: 'var(--daroodi-green-dark)', fontWeight: 800, fontSize: '13px', border: 'none', cursor: 'pointer' }}
                >
                  Add to Cart
                </button>
                <Link
                  href={`/shop/${quickProduct.slug}`}
                  style={{ flex: 1, padding: '12px', borderRadius: '50px', border: '1.5px solid var(--daroodi-green-dark)', color: 'var(--daroodi-green-dark)', fontWeight: 800, fontSize: '13px', textAlign: 'center', textDecoration: 'none', background: 'none' }}
                >
                  Full Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
