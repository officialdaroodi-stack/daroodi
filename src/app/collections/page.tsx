'use client';

import React from 'react';
import Link from 'next/link';

export default function CollectionsPage() {
  return (
    <div className="page-collections">
      {/* ─── Hero ───────────────────────────────────────────────── */}
      <section className="col-hero" aria-labelledby="col-hero-heading">
        <div className="col-hero-bg" aria-hidden="true">
          <div className="col-hero-blob col-hero-blob-1"></div>
          <div className="col-hero-blob col-hero-blob-2"></div>
        </div>
        <div className="container col-hero-grid">
          <div className="col-hero-content">
            <nav className="col-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Collections</span>
            </nav>
            <span className="eyebrow">Four Tiers of Craft</span>
            <h1 id="col-hero-heading">
              Our <em>Collections</em>
            </h1>
            <p className="col-hero-lede">
              From heirloom Platinum ceremonial coats to everyday Essentials — every tier is 100% hand-embroidered by master artisans in our atelier and made to your measurements.
            </p>
            <div className="col-hero-stats">
              <div className="col-stat-card">
                <strong>4</strong>
                <span>Curated Tiers</span>
              </div>
              <div className="col-stat-card">
                <strong>50+</strong>
                <span>Designs</span>
              </div>
              <div className="col-stat-card">
                <strong>XS–3XL+</strong>
                <span>Custom Fit</span>
              </div>
            </div>
          </div>
          <div className="col-hero-visual">
            <div className="col-hero-3d" id="colHero3d">
              <div className="col-stack-card col-stack-1">
                <img
                  src="https://daroodi.com/wp-content/uploads/2026/06/Mens-Premium-Prince-Coat-4.webp"
                  alt="Platinum prince coat with gold embroidery"
                  width={220}
                  height={290}
                />
                <span className="col-stack-badge col-badge-platinum">Platinum</span>
              </div>
              <div className="col-stack-card col-stack-2">
                <img
                  src="https://daroodi.com/wp-content/uploads/2026/06/Womens-Burgundy-Wool-Blazer-4.webp"
                  alt="Gold collection burgundy wool blazer"
                  width={200}
                  height={270}
                />
                <span className="col-stack-badge col-badge-gold">Gold</span>
              </div>
              <div className="col-stack-card col-stack-3">
                <img
                  src="https://daroodi.com/wp-content/uploads/2026/06/Black-Blazer-3.webp"
                  alt="Silver collection Art Deco blazer"
                  width={190}
                  height={260}
                />
                <span className="col-stack-badge col-badge-silver">Silver</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Sticky Tier Navigation ─────────────────────────────── */}
      <nav className="col-tier-nav" aria-label="Collection tiers">
        <div className="container col-tier-nav-inner">
          <a href="#platinum" className="col-tier-pill col-tier-pill--platinum is-active">
            Platinum
          </a>
          <a href="#gold" className="col-tier-pill col-tier-pill--gold">
            Gold
          </a>
          <a href="#silver" className="col-tier-pill col-tier-pill--silver">
            Silver
          </a>
          <a href="#essentials" className="col-tier-pill col-tier-pill--essentials">
            Essentials
          </a>
        </div>
      </nav>

      {/* ─── Platinum Tier ──────────────────────────────────────── */}
      <section className="col-showcase col-showcase--platinum" id="platinum" aria-labelledby="platinum-heading">
        <div className="container">
          <div className="col-showcase-grid">
            <div className="col-showcase-visual">
              <div className="col-frame-3d">
                <div className="col-frame-shadow"></div>
                <div className="col-frame-inner">
                  <img
                    src="https://daroodi.com/wp-content/uploads/2026/06/Premium-Taupe-Longline-Embroidered-Tuxedo-Coat-3.webp"
                    alt="Platinum taupe longline embroidered tuxedo coat"
                    loading="lazy"
                  />
                  <span className="col-frame-tier">Platinum Collection</span>
                </div>
              </div>
            </div>
            <div className="col-showcase-copy">
              <span className="col-tier-label col-tier-label--platinum">Tier 01 · Flagship</span>
              <h2 id="platinum-heading">Platinum Collection</h2>
              <p className="col-showcase-desc">
                The pinnacle of Daroodi craftsmanship. Heirloom-grade velvets, crystal accents and multi-layer Zardozi embroidery reserved for black-tie galas, nikkah ceremonies and milestone celebrations.
              </p>
              <ul className="col-features">
                <li>Premium velvet, brocade &amp; cashmere blends</li>
                <li>Crystal, sequin &amp; multi-thread Zardozi</li>
                <li>5–6 week bespoke lead time</li>
                <li>
                  From <strong>£900</strong>
                </li>
              </ul>
              <Link href="/shop" className="btn btn-primary">
                Shop Platinum →
              </Link>
            </div>
          </div>
          <div className="col-products-row">
            <Link href="/shop/mens-premium-velvet-prince-coat" className="col-product-card">
              <div className="col-product-img">
                <img
                  src="https://daroodi.com/wp-content/uploads/2026/06/Premium-Taupe-Longline-Embroidered-Tuxedo-Coat-3.webp"
                  alt="Taupe longline tuxedo coat"
                  loading="lazy"
                />
              </div>
              <div className="col-product-info">
                <h4>Taupe Longline Tuxedo Coat</h4>
                <span>£1,250</span>
              </div>
            </Link>
            <Link href="/shop/mens-premium-velvet-prince-coat" className="col-product-card">
              <div className="col-product-img">
                <img
                  src="https://daroodi.com/wp-content/uploads/2026/06/Mens-Premium-Prince-Coat-4.webp"
                  alt="Men's premium prince coat"
                  loading="lazy"
                />
              </div>
              <div className="col-product-info">
                <h4>Men&apos;s Premium Prince Coat</h4>
                <span>£950</span>
              </div>
            </Link>
            <Link href="/shop" className="col-product-card col-product-more">
              <div className="col-product-more-inner">
                <span>+12 more</span>
                <strong>View All Platinum</strong>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Gold Tier ─────────────────────────────────────────── */}
      <section className="col-showcase col-showcase--gold col-showcase--reverse" id="gold" aria-labelledby="gold-heading">
        <div className="container">
          <div className="col-showcase-grid">
            <div className="col-showcase-visual">
              <div className="col-frame-3d">
                <div className="col-frame-shadow"></div>
                <div className="col-frame-inner">
                  <img
                    src="https://daroodi.com/wp-content/uploads/2026/06/Black-Brocade-Tuxedo-Jacket-3.webp"
                    alt="Gold collection black brocade tuxedo jacket"
                    loading="lazy"
                  />
                  <span className="col-frame-tier">Gold Collection</span>
                </div>
              </div>
            </div>
            <div className="col-showcase-copy">
              <span className="col-tier-label col-tier-label--gold">Tier 02 · Celebrations</span>
              <h2 id="gold-heading">Gold Collection</h2>
              <p className="col-showcase-desc">
                Rich metallic threadwork and botanical motifs on wool, velvet and brocade. The go-to choice for weddings, Eid gatherings and cultural celebrations where detail matters.
              </p>
              <ul className="col-features">
                <li>Gold &amp; silver metallic thread embroidery</li>
                <li>Traditional floral &amp; celestial motifs</li>
                <li>3–4 week standard lead time</li>
                <li>
                  From <strong>£700</strong>
                </li>
              </ul>
              <Link href="/shop" className="btn btn-primary">
                Shop Gold →
              </Link>
            </div>
          </div>
          <div className="col-products-row">
            <Link href="/shop" className="col-product-card">
              <div className="col-product-img">
                <img
                  src="https://daroodi.com/wp-content/uploads/2026/06/Womens-Burgundy-Wool-Blazer-4.webp"
                  alt="Burgundy wool blazer gold collar"
                  loading="lazy"
                />
              </div>
              <div className="col-product-info">
                <h4>Burgundy Wool Blazer</h4>
                <span>£750</span>
              </div>
            </Link>
            <Link href="/shop" className="col-product-card">
              <div className="col-product-img">
                <img
                  src="https://daroodi.com/wp-content/uploads/2026/06/Black-Brocade-Tuxedo-Jacket-3.webp"
                  alt="Black brocade tuxedo jacket"
                  loading="lazy"
                />
              </div>
              <div className="col-product-info">
                <h4>Black Brocade Tuxedo</h4>
                <span>£850</span>
              </div>
            </Link>
            <Link href="/shop" className="col-product-card col-product-more">
              <div className="col-product-more-inner">
                <span>+18 more</span>
                <strong>View All Gold</strong>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Silver Tier ────────────────────────────────────────── */}
      <section className="col-showcase col-showcase--silver" id="silver" aria-labelledby="silver-heading">
        <div className="container">
          <div className="col-showcase-grid">
            <div className="col-showcase-visual">
              <div className="col-frame-3d">
                <div className="col-frame-shadow"></div>
                <div className="col-frame-inner">
                  <img
                    src="https://daroodi.com/wp-content/uploads/2026/06/Ivory-White-Linen-Tailored-Blazer-4.webp"
                    alt="Silver collection ivory linen blazer"
                    loading="lazy"
                  />
                  <span className="col-frame-tier">Silver Collection</span>
                </div>
              </div>
            </div>
            <div className="col-showcase-copy">
              <span className="col-tier-label col-tier-label--silver">Tier 03 · Modern Formal</span>
              <h2 id="silver-heading">Silver Collection</h2>
              <p className="col-showcase-desc">
                Clean geometric embroidery and Art Deco lines on tailored blazers and linen pieces. Designed for modern boardrooms, evening dinners and refined everyday elegance.
              </p>
              <ul className="col-features">
                <li>Linear &amp; geometric embroidery patterns</li>
                <li>Linen, wool blend &amp; lightweight fabrics</li>
                <li>3–4 week standard lead time</li>
                <li>
                  From <strong>£550</strong>
                </li>
              </ul>
              <Link href="/shop" className="btn btn-primary">
                Shop Silver →
              </Link>
            </div>
          </div>
          <div className="col-products-row">
            <Link href="/shop" className="col-product-card">
              <div className="col-product-img">
                <img
                  src="https://daroodi.com/wp-content/uploads/2026/06/Ivory-White-Linen-Tailored-Blazer-4.webp"
                  alt="Ivory white linen blazer"
                  loading="lazy"
                />
              </div>
              <div className="col-product-info">
                <h4>Ivory Linen Blazer</h4>
                <span>£650</span>
              </div>
            </Link>
            <Link href="/shop" className="col-product-card">
              <div className="col-product-img">
                <img
                  src="https://daroodi.com/wp-content/uploads/2026/06/Black-Blazer-3.webp"
                  alt="Black blazer silver Art Deco"
                  loading="lazy"
                />
              </div>
              <div className="col-product-info">
                <h4>Black Art Deco Blazer</h4>
                <span>£600</span>
              </div>
            </Link>
            <Link href="/shop" className="col-product-card col-product-more">
              <div className="col-product-more-inner">
                <span>+10 more</span>
                <strong>View All Silver</strong>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Essentials Tier ────────────────────────────────────── */}
      <section className="col-showcase col-showcase--essentials col-showcase--reverse" id="essentials" aria-labelledby="essentials-heading">
        <div className="container">
          <div className="col-showcase-grid">
            <div className="col-showcase-visual">
              <div className="col-frame-3d">
                <div className="col-frame-shadow"></div>
                <div className="col-frame-inner">
                  <img
                    src="https://daroodi.com/wp-content/uploads/2026/06/Mens-Navy-Blue-Slim-Suit-Coat-3.webp"
                    alt="Essentials navy blue slim suit coat"
                    loading="lazy"
                  />
                  <span className="col-frame-tier">Essentials Collection</span>
                </div>
              </div>
            </div>
            <div className="col-showcase-copy">
              <span className="col-tier-label col-tier-label--essentials">Tier 04 · Everyday Luxury</span>
              <h2 id="essentials-heading">Essentials Collection</h2>
              <p className="col-showcase-desc">
                Entry-level handcrafted pieces with quality stitching and fabrics. Smart luxury for those discovering Daroodi — without compromising on artisan embroidery or custom sizing.
              </p>
              <ul className="col-features">
                <li>Quality wool &amp; cotton blends</li>
                <li>Focused embroidery accents</li>
                <li>2–3 week lead time</li>
                <li>
                  From <strong>£450</strong>
                </li>
              </ul>
              <Link href="/shop" className="btn btn-primary">
                Shop Essentials →
              </Link>
            </div>
          </div>
          <div className="col-products-row">
            <Link href="/shop" className="col-product-card">
              <div className="col-product-img">
                <img
                  src="https://daroodi.com/wp-content/uploads/2026/06/Mens-Navy-Blue-Slim-Suit-Coat-3.webp"
                  alt="Navy blue slim suit coat"
                  loading="lazy"
                />
              </div>
              <div className="col-product-info">
                <h4>Navy Slim Suit Coat</h4>
                <span>£680</span>
              </div>
            </Link>
            <Link href="/shop" className="col-product-card">
              <div className="col-product-img">
                <img
                  src="https://daroodi.com/wp-content/uploads/2026/06/Black-Wool-Blend-Tailored-Blazer-11.webp"
                  alt="Gold floral wool blazer"
                  loading="lazy"
                />
              </div>
              <div className="col-product-info">
                <h4>Gold Floral Blazer</h4>
                <span>£720</span>
              </div>
            </Link>
            <Link href="/shop" className="col-product-card col-product-more">
              <div className="col-product-more-inner">
                <span>+8 more</span>
                <strong>View All Essentials</strong>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Compare ────────────────────────────────────────────── */}
      <section className="col-compare" aria-labelledby="compare-heading">
        <div className="container">
          <header className="section-header section-header--styled center">
            <div className="section-ornament" aria-hidden="true">
              <span className="ornament-line"></span>
              <span className="ornament-gem">◆</span>
              <span className="ornament-line"></span>
            </div>
            <span className="eyebrow">At a Glance</span>
            <h2 id="compare-heading">Compare Our Tiers</h2>
            <p className="section-desc">
              Every collection is fully hand-embroidered — the difference is fabric grade, embroidery complexity and occasion.
            </p>
          </header>
          <div className="col-compare-wrap">
            <table className="col-compare-table">
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col">Platinum</th>
                  <th scope="col">Gold</th>
                  <th scope="col">Silver</th>
                  <th scope="col">Essentials</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Embroidery depth</td>
                  <td>Multi-layer Zardozi</td>
                  <td>Metallic floral</td>
                  <td>Geometric linear</td>
                  <td>Accent details</td>
                </tr>
                <tr>
                  <td>Fabric grade</td>
                  <td>Velvet &amp; brocade</td>
                  <td>Wool &amp; velvet</td>
                  <td>Linen &amp; blends</td>
                  <td>Cotton &amp; wool</td>
                </tr>
                <tr>
                  <td>Best for</td>
                  <td>Ceremonies</td>
                  <td>Weddings</td>
                  <td>Business formal</td>
                  <td>Everyday</td>
                </tr>
                <tr>
                  <td>Lead time</td>
                  <td>5–6 weeks</td>
                  <td>3–4 weeks</td>
                  <td>3–4 weeks</td>
                  <td>2–3 weeks</td>
                </tr>
                <tr>
                  <td>Price from</td>
                  <td>£900</td>
                  <td>£700</td>
                  <td>£550</td>
                  <td>£450</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── Bespoke Consultation CTA ───────────────────────────── */}
      <section className="col-bespoke" aria-labelledby="bespoke-heading">
        <div className="container">
          <div className="col-bespoke-card">
            <div className="col-bespoke-glow" aria-hidden="true"></div>
            <div className="col-bespoke-inner">
              <span className="eyebrow">Not Sure Which Tier?</span>
              <h2 id="bespoke-heading">Book a Bespoke Consultation</h2>
              <p>
                Our stylists will help you choose the right collection, fabric and embroidery style for your occasion — with a custom quote within 24 hours.
              </p>
              <div className="col-bespoke-actions">
                <Link href="/custom-order" className="btn btn-primary">
                  Request Custom Piece
                </Link>
                <a href="https://wa.me/923001215532" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
