'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const PRODUCTS = [
  {
    name: 'Taupe Longline Embroidered Tuxedo Coat',
    price: '£1,250',
    image: '/uploads/2026/06/Premium-Taupe-Longline-Embroidered-Tuxedo-Coat-3.webp',
    link: '/shop/premium-taupe-longline-embroidered-tuxedo-coat',
    tier: 'Platinum',
  },
  {
    name: "Men's Premium Prince Coat",
    price: '£950',
    image: '/uploads/2026/06/Mens-Premium-Prince-Coat-2.webp',
    link: '/shop/mens-premium-prince-coat',
    tier: 'Platinum',
  },
  {
    name: 'Burgundy Wool Blazer — Gold Collar',
    price: '£750',
    image: '/uploads/2026/06/Womens-Burgundy-Wool-Blazer.webp',
    link: '/shop/burgundy-wool-blazer-gold-collar',
    tier: 'Gold',
  },
  {
    name: 'Black Brocade Tuxedo Jacket',
    price: '£850',
    image: '/uploads/2026/06/Black-Brocade-Tuxedo-Jacket-3.webp',
    link: '/shop/black-brocade-tuxedo-jacket',
    tier: 'Gold',
  },
  {
    name: 'Ivory White Linen Blazer',
    price: '£650',
    image: '/uploads/2026/06/Ivory-White-Linen-Tailored-Blazer-4.webp',
    link: '/shop/ivory-white-linen-tailored-blazer',
    tier: 'Silver',
  },
  {
    name: 'Black Blazer — Art Deco Silver',
    price: '£600',
    image: '/uploads/2026/06/Black-Blazer-3.webp',
    link: '/shop/black-blazer-silver-art-deco',
    tier: 'Silver',
  },
  {
    name: 'Gold Floral Wool Blazer',
    price: '£720',
    image: '/uploads/2026/06/Black-Wool-Blend-Tailored-Blazer-5.webp',
    link: '/shop/black-wool-blend-tailored-blazer-gold-floral',
    tier: 'Gold',
  },
  {
    name: 'Navy Blue Slim Suit Coat',
    price: '£680',
    image: '/uploads/2026/06/Mens-Navy-Blue-Slim-Suit-Coat-3.webp',
    link: '/shop/mens-navy-blue-slim-suit-coat',
    tier: 'Essentials',
  },
];

export default function HomePage() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const heroSceneRef = useRef<HTMLDivElement>(null);
  const total = PRODUCTS.length;
  const radius = 360;

  // 3D Carousel Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % total);
    }, 4500);
    return () => clearInterval(timer);
  }, [total]);

  // Hero 3D Parallax Tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroSceneRef.current) return;
      const rect = heroSceneRef.current.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateY = ((e.clientX - centerX) / rect.width) * 10;
      const rotateX = ((centerY - e.clientY) / rect.height) * 6;
      heroSceneRef.current.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + total) % total);
  };

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % total);
  };

  return (
    <div className="home-root">
      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="hero" id="hero" aria-labelledby="hero-heading">
        <div className="hero-bg">
          <div className="hero-blob blob-1"></div>
          <div className="hero-blob blob-2"></div>
          <div className="hero-particles" id="particles">
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className="particle"
                style={{
                  top: `${(i * 17) % 95}%`,
                  left: `${(i * 23) % 95}%`,
                  animationDelay: `${(i * 0.4) % 5}s`,
                  animationDuration: `${4 + (i % 4)}s`,
                }}
              />
            ))}
          </div>
        </div>
        <div className="container hero-grid">
          <div className="hero-content">
            <span className="eyebrow">Artisan Tailoring · Ships Worldwide</span>
            <h1 id="hero-heading">
              Wearable Art, <em>Stitched</em> by Hand
            </h1>
            <p className="hero-sub">
              Daroodi creates made-to-order embroidered coats, blazers and formal pieces for clients who value slow craftsmanship over fast fashion. Each garment is built in our atelier and delivered to your door — from London to Dubai, Toronto to Sydney.
            </p>
            <div className="hero-cta">
              <Link href="/shop" className="btn btn-primary">
                Shop the Collection
              </Link>
              <Link href="/custom-order" className="btn btn-outline">
                Request a Custom Piece
              </Link>
            </div>
            <ul className="hero-trust" aria-label="Brand highlights">
              <li>
                <strong>100%</strong> hand-embroidered
              </li>
              <li>
                <strong>40+</strong> countries shipped
              </li>
              <li>
                <strong>XS–3XL+</strong> custom sizing
              </li>
            </ul>
          </div>
          <div className="hero-visual">
            <div className="hero-3d-scene" id="hero3d" ref={heroSceneRef}>
              <div className="hero-frame">
                <div className="frame-corner tl"></div>
                <div className="frame-corner tr"></div>
                <div className="frame-corner bl"></div>
                <div className="frame-corner br"></div>
                <img
                  src="/uploads/2026/06/Mens-Premium-Prince-Coat-2.webp"
                  alt="Men's premium embroidered prince coat in deep green velvet with gold threadwork"
                  className="hero-image"
                  width={480}
                  height={620}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/uploads/2026/05/hero-coat.jpg';
                  }}
                />
              </div>
              <div className="floating-card card-1">
                <img
                  src="/uploads/2026/06/Womens-Burgundy-Wool-Blazer.webp"
                  alt="Women's burgundy wool blazer with gold celestial collar embroidery"
                  width={140}
                  height={180}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/uploads/2026/05/womens-coat-1.jpg';
                  }}
                />
              </div>
              <div className="floating-card card-2">
                <img
                  src="/uploads/2026/06/Black-Brocade-Tuxedo-Jacket-3.webp"
                  alt="Black brocade tuxedo jacket with hand-stitched detailing"
                  width={140}
                  height={180}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/uploads/2026/06/Black-Brocade-Tuxedo-Jacket.webp';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Marquee ──────────────────────────────────────────────── */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <span>Hand Embroidery</span>
          <span className="dot">·</span>
          <span>Premium Wool &amp; Velvet</span>
          <span className="dot">·</span>
          <span>Made to Order</span>
          <span className="dot">·</span>
          <span>Global Delivery</span>
          <span className="dot">·</span>
          <span>Custom Sizing</span>
          <span className="dot">·</span>
          <span>Platinum · Gold · Silver</span>
          <span className="dot">·</span>
          <span>Hand Embroidery</span>
          <span className="dot">·</span>
          <span>Premium Wool &amp; Velvet</span>
          <span className="dot">·</span>
          <span>Made to Order</span>
          <span className="dot">·</span>
          <span>Global Delivery</span>
          <span className="dot">·</span>
          <span>Custom Sizing</span>
          <span className="dot">·</span>
          <span>Platinum · Gold · Silver</span>
          <span className="dot">·</span>
        </div>
      </div>

      {/* ─── Collections ──────────────────────────────────────────── */}
      <section className="collections" id="collections" aria-labelledby="collections-heading">
        <div className="container">
          <header className="section-header section-header--styled center">
            <div className="section-ornament" aria-hidden="true">
              <span className="ornament-line"></span>
              <span className="ornament-gem">◆</span>
              <span className="ornament-line"></span>
            </div>
            <span className="eyebrow">Shop by Tier</span>
            <h2 id="collections-heading">Find Your Level of Detail</h2>
            <p className="section-desc">
              From refined everyday blazers to statement ceremonial coats — choose the embroidery depth and fabric grade that fits your occasion and budget.
            </p>
          </header>
          <div className="tiers-grid">
            <Link href="/collections#platinum" className="tier-card tier-platinum">
              <span className="tier-num">01</span>
              <h3>Platinum</h3>
              <p>
                Heirloom-grade fabrics, crystal accents and the most intricate multi-layer embroidery for black-tie and milestone events.
              </p>
              <span className="tier-link">View Platinum →</span>
            </Link>
            <Link href="/collections#gold" className="tier-card tier-gold">
              <span className="tier-num">02</span>
              <h3>Gold</h3>
              <p>
                Rich metallic threadwork and botanical motifs on wool, velvet and brocade — ideal for weddings and cultural celebrations.
              </p>
              <span className="tier-link">View Gold →</span>
            </Link>
            <Link href="/collections#silver" className="tier-card tier-silver">
              <span className="tier-num">03</span>
              <h3>Silver</h3>
              <p>
                Clean geometric embroidery and Art Deco lines on tailored blazers for modern formal and business settings.
              </p>
              <span className="tier-link">View Silver →</span>
            </Link>
            <Link href="/collections#essentials" className="tier-card tier-popular">
              <span className="tier-num">04</span>
              <h3>Essentials</h3>
              <p>
                Entry-level handcrafted pieces with quality stitching and fabrics — smart luxury without the ceremony price tag.
              </p>
              <span className="tier-link">View Essentials →</span>
            </Link>
          </div>
          <div className="center mt-lg">
            <Link href="/collections" className="btn btn-outline">
              Explore All Collections
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 3D Product Showcase ──────────────────────────────────── */}
      <section className="showcase" id="products" aria-labelledby="products-heading">
        <div className="container">
          <header className="section-header center">
            <span className="eyebrow">New Arrivals</span>
            <h2 id="products-heading">Featured Embroidered Pieces</h2>
            <p>
              Curated selections from our latest collection — each piece available to order in your size with optional custom embroidery.
            </p>
          </header>
        </div>
        <div className="carousel-3d-wrapper">
          <div className="carousel-3d" id="carousel3d" role="region" aria-label="Featured products carousel">
            {PRODUCTS.map((prod, i) => {
              let offset = i - carouselIndex;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;

              const angleStep = 360 / total;
              const angle = offset * angleStep;
              const rad = (angle * Math.PI) / 180;
              const x = Math.sin(rad) * radius;
              const z = Math.cos(rad) * radius - radius;
              const scale = offset === 0 ? 1 : 0.78;
              const opacity = Math.abs(offset) <= 2 ? 1 : 0.25;
              const zIndex = offset === 0 ? 10 : 5 - Math.abs(offset);

              return (
                <div
                  key={i}
                  className={`carousel-item ${offset === 0 ? 'active' : ''}`}
                  style={{
                    transform: `translateX(${x}px) translateZ(${z}px) scale(${scale})`,
                    opacity: opacity,
                    zIndex: zIndex,
                  }}
                  onClick={() => setCarouselIndex(i)}
                >
                  <div className="carousel-item-inner">
                    <img
                      src={prod.image}
                      alt={`${prod.name} — bespoke embroidered ${prod.tier} collection`}
                      loading="lazy"
                    />
                    <div className="carousel-item-info">
                      <h4>{prod.name}</h4>
                      <span className="price">{prod.price}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="carousel-controls">
            <button className="carousel-btn prev" id="carouselPrev" onClick={prevSlide} aria-label="Previous product">
              ←
            </button>
            <div className="carousel-dots" id="carouselDots">
              {PRODUCTS.map((_, idx) => (
                <button
                  key={idx}
                  className={`carousel-dot ${idx === carouselIndex ? 'active' : ''}`}
                  onClick={() => setCarouselIndex(idx)}
                  aria-label={`Go to product ${idx + 1}`}
                />
              ))}
            </div>
            <button className="carousel-btn next" id="carouselNext" onClick={nextSlide} aria-label="Next product">
              →
            </button>
          </div>
        </div>
        <div className="container">
          <div className="products-grid" id="productsGrid">
            {PRODUCTS.map((prod, idx) => (
              <Link key={idx} href={prod.link} className="product-card">
                <div className="product-image-wrap">
                  <img src={prod.image} alt={`${prod.name} — Daroodi ${prod.tier}`} loading="lazy" />
                  <span className="product-badge">{prod.tier}</span>
                  <span className="product-quick-view">View Product</span>
                </div>
                <div className="product-info">
                  <h4>{prod.name}</h4>
                  <span className="price">
                    <span className="from">From </span>
                    {prod.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="center mt-lg">
            <Link href="/shop" className="btn btn-primary">
              See All 50+ Products
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Categories (Curated Lines by Tier) ───────────────────── */}
      <section className="categories" aria-labelledby="categories-heading">
        <div className="section-deco section-deco--categories" aria-hidden="true">
          <span className="deco-ring deco-ring-1"></span>
          <span className="deco-ring deco-ring-2"></span>
        </div>
        <div className="container">
          <header className="section-header section-header--styled center">
            <div className="section-ornament" aria-hidden="true">
              <span className="ornament-line"></span>
              <span className="ornament-gem">◆</span>
              <span className="ornament-line"></span>
            </div>
            <span className="eyebrow">Curated Lines</span>
            <h2 id="categories-heading">Shop by Collection Tier</h2>
            <p className="section-desc">
              From heirloom ceremonial coats to refined everyday tailored blazers — explore our hallmark collections.
            </p>
          </header>
          <div className="categories-grid">
            <Link href="/collections#platinum" className="category-card">
              <div className="category-img-wrap">
                <img
                  src="/uploads/2026/06/Mens-Premium-Prince-Coat-2.webp"
                  alt="Platinum bespoke heirloom coats"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/uploads/2026/05/hero-coat.jpg'; }}
                />
                <span className="category-num">01</span>
              </div>
              <div className="category-body">
                <h3>Platinum Collection</h3>
                <span>Heirloom ceremonial coats &amp; 120+ hr zardozi →</span>
              </div>
            </Link>
            <Link href="/collections#gold" className="category-card">
              <div className="category-img-wrap">
                <img
                  src="/uploads/2026/06/Black-Wool-Blend-Tailored-Blazer-5.webp"
                  alt="Gold collection embroidered formal blazers"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/uploads/2026/05/womens-coat-1.jpg'; }}
                />
                <span className="category-num">02</span>
              </div>
              <div className="category-body">
                <h3>Gold Collection</h3>
                <span>Rich metallic threadwork &amp; botanical motifs →</span>
              </div>
            </Link>
            <Link href="/collections#silver" className="category-card">
              <div className="category-img-wrap">
                <img
                  src="/uploads/2026/06/Womens-Burgundy-Wool-Blazer.webp"
                  alt="Silver collection tailored blazers"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/uploads/2026/06/Mens-Premium-Prince-Coat-4.webp'; }}
                />
                <span className="category-num">03</span>
              </div>
              <div className="category-body">
                <h3>Silver Collection</h3>
                <span>Art Deco lines &amp; structured wool tailoring →</span>
              </div>
            </Link>
            <Link href="/collections#essentials" className="category-card">
              <div className="category-img-wrap">
                <img
                  src="/uploads/2026/06/Black-Brocade-Tuxedo-Jacket-3.webp"
                  alt="Popular and Essentials tailored pieces"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/uploads/2026/06/Black-Wool-Blend-Tailored-Blazer.webp'; }}
                />
                <span className="category-num">04</span>
              </div>
              <div className="category-body">
                <h3>Popular &amp; Essentials</h3>
                <span>Bespoke brocades &amp; everyday statement luxury →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── About / Craft ────────────────────────────────────────── */}
      <section className="craft" id="craft" aria-labelledby="craft-heading">
        <div className="section-deco section-deco--craft" aria-hidden="true">
          <span className="deco-dots"></span>
        </div>
        <div className="container">
          <header className="section-header section-header--styled center craft-header-mobile">
            <div className="section-ornament" aria-hidden="true">
              <span className="ornament-line"></span>
              <span className="ornament-gem">◆</span>
              <span className="ornament-line"></span>
            </div>
            <span className="eyebrow">Why Daroodi</span>
            <h2 id="craft-heading">
              Slow Fashion, <em>Real</em> Craftsmanship
            </h2>
            <p className="section-desc">
              Every stitch tells a story — discover how our atelier brings heritage embroidery to modern luxury wear.
            </p>
          </header>
        </div>
        <div className="container craft-grid">
          <div className="craft-visual">
            <div className="craft-image-stack craft-stack-desktop">
              <img
                src="/uploads/2026/06/Mens-Premium-Prince-Coat-4.webp"
                alt="Gold thread hand embroidery on velvet prince coat"
                className="stack-img stack-1"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = '/uploads/2026/05/hero-coat.jpg'; }}
              />
              <img
                src="/uploads/2026/06/Womens-Burgundy-Wool-Blazer-4.webp"
                alt="Artisan hand-stitching botanical motifs on wool blazer"
                className="stack-img stack-2"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = '/uploads/2026/05/womens-coat-1.jpg'; }}
              />
              <img
                src="/uploads/2026/06/Black-Brocade-Tuxedo-Jacket-3.webp"
                alt="Finished bespoke brocade tuxedo coat on tailor mannequin"
                className="stack-img stack-3"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = '/uploads/2026/06/Black-Brocade-Tuxedo-Jacket.webp'; }}
              />
            </div>
            <div className="craft-scroll-gallery" aria-label="Craftsmanship gallery">
              <figure className="craft-slide craft-slide-1">
                <img
                  src="/uploads/2026/06/Mens-Premium-Prince-Coat-4.webp"
                  alt="100% Hand Embroidery"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/uploads/2026/05/hero-coat.jpg'; }}
                />
                <figcaption>100% Hand Embroidery</figcaption>
              </figure>
              <figure className="craft-slide craft-slide-2">
                <img
                  src="/uploads/2026/06/Womens-Burgundy-Wool-Blazer-4.webp"
                  alt="Master Atelier Stitching"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/uploads/2026/05/womens-coat-1.jpg'; }}
                />
                <figcaption>Master Atelier Stitching</figcaption>
              </figure>
              <figure className="craft-slide craft-slide-3">
                <img
                  src="/uploads/2026/06/Black-Brocade-Tuxedo-Jacket-3.webp"
                  alt="Bespoke Tailoring"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/uploads/2026/06/Black-Brocade-Tuxedo-Jacket.webp'; }}
                />
                <figcaption>Bespoke Tailoring</figcaption>
              </figure>
            </div>
          </div>
          <div className="craft-content">
            <header className="section-header craft-header-desktop">
              <span className="eyebrow">Why Daroodi</span>
              <h2>
                Slow Fashion, <em>Real</em> Craftsmanship
              </h2>
            </header>
            <p>
              Most &quot;luxury&quot; labels outsource to machines. Daroodi works differently — every coat and blazer passes through the hands of skilled embroiderers who have spent years mastering techniques passed down through generations.
            </p>
            <p>
              We source premium wools, velvets and silks, then apply hand-guided embroidery that adds texture, weight and character no printer can replicate. The result is clothing that looks exceptional in person and lasts for years.
            </p>
            <ul className="craft-list">
              <li>Made-to-order — no mass production, no dead stock</li>
              <li>Embroidery techniques including zardozi, dabka and resham</li>
              <li>Ships securely to the UK, Europe, North America, Australia &amp; the Gulf</li>
              <li>Custom sizing from XS through 3XL and beyond</li>
            </ul>
            <Link href="/our-heritage" className="btn btn-primary">
              Learn About Our Atelier
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Process ─────────────────────────────────────────────── */}
      <section className="process" id="process" aria-labelledby="process-heading">
        <div className="container">
          <header className="section-header center">
            <span className="eyebrow">How It Works</span>
            <h2 id="process-heading">From First Message to Your Doorstep</h2>
            <p>Ordering bespoke embroidery should feel personal, not complicated. Here is how we guide every client.</p>
          </header>
          <div className="process-steps">
            <article className="process-step">
              <div className="step-icon">01</div>
              <h3>Choose or Customize</h3>
              <p>Pick a ready design from our shop or tell us what you need — fabric, colour, embroidery style and occasion.</p>
            </article>
            <article className="process-step">
              <div className="step-icon">02</div>
              <h3>Share Your Measurements</h3>
              <p>Send your sizes using our guide, or book a video consultation and we will walk you through it step by step.</p>
            </article>
            <article className="process-step">
              <div className="step-icon">03</div>
              <h3>We Craft Your Garment</h3>
              <p>Our atelier team cuts, stitches and embroiders your piece by hand. Typical lead time is 3–6 weeks depending on complexity.</p>
            </article>
            <article className="process-step">
              <div className="step-icon">04</div>
              <h3>Delivered Worldwide</h3>
              <p>Your finished garment is quality-checked, carefully packed and shipped with tracking to your address anywhere in the world.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────────── */}
      <section className="testimonials" aria-labelledby="reviews-heading">
        <div className="container">
          <header className="section-header section-header--styled center">
            <div className="section-ornament" aria-hidden="true">
              <span className="ornament-line"></span>
              <span className="ornament-gem">◆</span>
              <span className="ornament-line"></span>
            </div>
            <span className="eyebrow">Client Feedback</span>
            <h2 id="reviews-heading">Trusted by Customers Across Four Continents</h2>
            <p className="section-desc">
              Real reviews from clients who chose Daroodi for weddings, celebrations and bespoke formal wear.
            </p>
          </header>

          <div className="trustpilot-banner">
            <div className="trustpilot-score">
              <div className="tp-stars" aria-hidden="true">
                <span className="tp-star filled"></span>
                <span className="tp-star filled"></span>
                <span className="tp-star filled"></span>
                <span className="tp-star filled"></span>
                <span className="tp-star filled"></span>
              </div>
              <div className="tp-rating">
                <strong>4.9</strong>
                <span>Excellent</span>
              </div>
            </div>
            <div className="trustpilot-brand">
              <svg className="tp-logo" width="100" height="24" viewBox="0 0 126 31" aria-hidden="true">
                <path fill="#00B67A" d="M25.5 0h-8.1L12 8.1 6.6 0H0l6.6 9.9L0 19.8h6.6l5.4-8.1 5.4 8.1h8.1l-6.6-9.9L25.5 0z" />
                <path fill="#191919" d="M38.4 23.5V7.9h4.6v15.6h-4.6zm2.3-17.8c-1.5 0-2.5-1-2.5-2.3s1-2.3 2.5-2.3 2.5 1 2.3 2.5-1 2.1-2.5 2.1zm12.1 17.8l-6.2-15.6h4.9l3.4 9.5 3.4-9.5h4.9l-6.2 15.6h-4.2zm18.8 0V7.9h4.3v2.1c1.2-1.6 3-2.5 5.3-2.5 4.2 0 6.8 2.8 6.8 7.5v8.5h-4.6v-7.9c0-2.8-1.4-4.3-3.8-4.3-2.4 0-4 1.7-4 4.5v7.7h-4.6zm24.1 0l-6.2-15.6h4.9l3.4 9.5 3.4-9.5h4.9l-6.2 15.6h-4.2z" />
              </svg>
              <span className="tp-label">
                Rated on <strong>Trustpilot</strong>
              </span>
            </div>
            <a
              href="https://www.trustpilot.com/evaluate/daroodi.com"
              className="btn btn-trustpilot"
              target="_blank"
              rel="noopener noreferrer"
            >
              Write a Review
            </a>
          </div>

          <div className="testimonials-grid">
            <article className="review-card">
              <div className="review-card-top">
                <div className="tp-stars tp-stars-sm" aria-label="5 out of 5 stars">
                  <span className="tp-star filled"></span>
                  <span className="tp-star filled"></span>
                  <span className="tp-star filled"></span>
                  <span className="tp-star filled"></span>
                  <span className="tp-star filled"></span>
                </div>
                <span className="review-verified">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Verified
                </span>
              </div>
              <blockquote className="review-quote">
                <span className="quote-mark" aria-hidden="true">
                  &quot;
                </span>
                The embroidery is beyond expectation. The quality, the attention to detail and the overall experience was exceptional.
              </blockquote>
              <footer className="review-author">
                <div className="review-avatar" aria-hidden="true">
                  AK
                </div>
                <div className="review-meta">
                  <cite>Arthur K.</cite>
                  <span>London, UK · 2 weeks ago</span>
                </div>
              </footer>
            </article>

            <article className="review-card">
              <div className="review-card-top">
                <div className="tp-stars tp-stars-sm" aria-label="5 out of 5 stars">
                  <span className="tp-star filled"></span>
                  <span className="tp-star filled"></span>
                  <span className="tp-star filled"></span>
                  <span className="tp-star filled"></span>
                  <span className="tp-star filled"></span>
                </div>
                <span className="review-verified">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Verified
                </span>
              </div>
              <blockquote className="review-quote">
                <span className="quote-mark" aria-hidden="true">
                  &quot;
                </span>
                Second time ordering and quality is exactly what was promised. Truly a luxury experience from start to finish.
              </blockquote>
              <footer className="review-author">
                <div className="review-avatar" aria-hidden="true">
                  FA
                </div>
                <div className="review-meta">
                  <cite>Fahad A.</cite>
                  <span>Riyadh, Saudi Arabia · 1 month ago</span>
                </div>
              </footer>
            </article>

            <article className="review-card">
              <div className="review-card-top">
                <div className="tp-stars tp-stars-sm" aria-label="5 out of 5 stars">
                  <span className="tp-star filled"></span>
                  <span className="tp-star filled"></span>
                  <span className="tp-star filled"></span>
                  <span className="tp-star filled"></span>
                  <span className="tp-star filled"></span>
                </div>
                <span className="review-verified">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Verified
                </span>
              </div>
              <blockquote className="review-quote">
                <span className="quote-mark" aria-hidden="true">
                  &quot;
                </span>
                The craftsmanship is outstanding. Ordered to Australia and the quality is unmatched — worth every penny.
              </blockquote>
              <footer className="review-author">
                <div className="review-avatar" aria-hidden="true">
                  GM
                </div>
                <div className="review-meta">
                  <cite>Greg M.</cite>
                  <span>Sydney, Australia · 3 weeks ago</span>
                </div>
              </footer>
            </article>
          </div>

          <div className="testimonials-footer">
            <a
              href="https://www.trustpilot.com/review/daroodi.com"
              className="trustpilot-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              See all reviews on Trustpilot →
            </a>
          </div>
        </div>
      </section>

      {/* ─── FAQs ─────────────────────────────────────────────────── */}
      <section className="faq" id="faq" aria-labelledby="faq-heading">
        <div className="container">
          <header className="section-header center">
            <span className="eyebrow">Common Questions</span>
            <h2 id="faq-heading">Everything You Need to Know</h2>
          </header>
          <div className="faq-list">
            <details className="faq-item">
              <summary>What types of clothing does Daroodi make?</summary>
              <p>
                We specialize in embroidered coats, blazers, tuxedo jackets, overcoats, and formal outerwear for men and women. Many designs can also be adapted for weddings, graduations, Eid, corporate events and cultural ceremonies.
              </p>
            </details>
            <details className="faq-item">
              <summary>Do you offer custom sizing and bespoke orders?</summary>
              <p>
                Yes. Every garment can be made to your exact measurements from XS to 3XL and above. You can also request custom embroidery patterns, fabric choices and colour combinations through our bespoke service.
              </p>
            </details>
            <details className="faq-item">
              <summary>Which countries do you ship to?</summary>
              <p>
                We deliver worldwide including the United Kingdom, United States, Canada, Australia, UAE, Saudi Arabia, and most of Europe. Shipping times and customs duties vary by destination — contact us for a quote.
              </p>
            </details>
            <details className="faq-item">
              <summary>How long does a made-to-order piece take?</summary>
              <p>
                Standard orders typically take 3–4 weeks. Complex bespoke embroidery or Platinum-tier pieces may require 5–6 weeks. We will confirm your timeline when you place your order.
              </p>
            </details>
            <details className="faq-item">
              <summary>What is the difference between Platinum, Gold and Silver collections?</summary>
              <p>
                Platinum features the finest fabrics and most elaborate embroidery including crystal accents. Gold uses rich metallic threads and traditional motifs. Silver focuses on clean, modern geometric embroidery. Essentials offers quality handcraft at a more accessible price point.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ───────────────────────────────────────────── */}
      <section className="cta-banner" aria-labelledby="cta-heading">
        <div className="container cta-inner">
          <div className="cta-content">
            <h2 id="cta-heading">
              Ready to Invest in Something <em>Made for You</em>?
            </h2>
            <p>Browse our collection or start a custom commission today. Our team responds within 24 hours.</p>
            <div className="cta-buttons">
              <Link href="/shop" className="btn btn-white btn-lg">
                Shop Now
              </Link>
              <Link href="/custom-order" className="btn btn-outline-white btn-lg">
                Start Custom Order
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
