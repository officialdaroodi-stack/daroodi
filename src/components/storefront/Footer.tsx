'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-newsletter">
        <div className="container footer-newsletter-inner">
          <div className="footer-newsletter-copy">
            <span className="footer-eyebrow">Stay Connected</span>
            <h3>Join the Connoisseur Club</h3>
            <p>Be first to know about new collections, bespoke slots and styling inspiration.</p>
          </div>
          <form
            className="footer-newsletter-form"
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for joining the Connoisseur Club!');
            }}
          >
            <label className="sr-only" htmlFor="footer-email">Email address</label>
            <input type="email" id="footer-email" name="email" placeholder="Your email address" required />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-body">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <Link href="/" className="footer-logo">
                <img src="/uploads/2026/05/cropped-Droodi-Logo.jpg" alt="Daroodi" width="44" height="44" />
                <span>Daroodi</span>
              </Link>
              <p>Handcrafted embroidered luxury for weddings, celebrations and refined everyday wear. Made to order, shipped worldwide.</p>
              <div className="footer-social">
                <a
                  href="https://www.instagram.com/officialdaroodi?igsh=cDM4aGFkNHFpc3Bl"
                  className="footer-social-link"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                </a>
                <a
                  href="https://www.facebook.com/share/17UwBqLvC2/"
                  className="footer-social-link"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </a>
                <a
                  href="https://www.tiktok.com/@daroodi.official7?_r=1&_t=ZN-961aKgmCHlH"
                  className="footer-social-link"
                  aria-label="TikTok"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.69a8.18 8.18 0 004.77 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>
                </a>
                <a
                  href="https://youtube.com/@daroodiofficial?si=G3SQthrEPEmeFwdi"
                  className="footer-social-link"
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33 2.78 2.78 0 001.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 001.94-2 29 29 0 00.46-5.33 29 29 0 00-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#0F241E"/></svg>
                </a>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-col">
                <h4>Shop Collections</h4>
                <ul>
                  <li><Link href="/shop">All Products</Link></li>
                  <li><Link href="/collections">Royal Collections</Link></li>
                  <li><Link href="/shop">Men&apos;s Prince Coats</Link></li>
                  <li><Link href="/shop">Embroidered Blazers</Link></li>
                  <li><Link href="/custom-order">Bespoke Custom Orders</Link></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Customer Care</h4>
                <ul>
                  <li><Link href="/shipping">Shipping &amp; Delivery</Link></li>
                  <li><Link href="/size-guide">Size &amp; Measurement Guide</Link></li>
                  <li><Link href="/refund-policy">Returns &amp; Alteration Guarantee</Link></li>
                  <li><Link href="/faq">Frequently Asked Questions</Link></li>
                  <li><Link href="/track-order">Track Order Production</Link></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>The Maison</h4>
                <ul>
                  <li><Link href="/our-heritage">Our Story &amp; Heritage</Link></li>
                  <li><Link href="/atelier-archive">Atelier Archive</Link></li>
                  <li><Link href="/sahib-ali-foundation">Sahib Ali Foundation</Link></li>
                  <li><Link href="/journal">The Daroodi Journal</Link></li>
                  <li><Link href="/sitemap">Store Directory &amp; Sitemap</Link></li>
                </ul>
              </div>
              <div className="footer-col footer-contact">
                <h4>Get in Touch</h4>
                <ul>
                  <li><a href="mailto:info@daroodi.com">info@daroodi.com</a></li>
                  <li><a href="tel:+923001215532">+92 300 1215532</a></li>
                  <li><Link href="/contact">Private Consultation</Link></li>
                  <li><a href="https://wa.me/923001215532" target="_blank" rel="noopener noreferrer">WhatsApp Concierge</a></li>
                </ul>
                <p className="footer-hours">Mon–Sat · Replies within 24 hrs</p>
              </div>
            </div>
          </div>

          <div className="footer-trust">
            <div className="trust-item">
              <span className="trust-icon">✦</span>
              <span>100% Hand-Embroidered</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">✦</span>
              <span>Made to Order</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">✦</span>
              <span>Ships Worldwide</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">✦</span>
              <span>Secure Checkout</span>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copy">© 2026 Daroodi Ltd. All rights reserved.</p>
            <div className="footer-legal">
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-conditions">Terms &amp; Conditions</Link>
              <Link href="/refund-policy">Returns Policy</Link>
              <Link href="/cookie-policy">Cookie Preferences</Link>
            </div>
            <div className="footer-payments" aria-label="Accepted payment methods">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>Amex</span>
              <span>PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
