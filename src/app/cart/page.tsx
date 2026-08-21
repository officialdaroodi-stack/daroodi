'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderCompleteNumber, setOrderCompleteNumber] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: 'Lord Arthur Pendelton',
    email: 'customer@example.com',
    phone: '+44 7911 123456',
    address: '45 Mayfair Court, Berkeley Square',
    city: 'London',
    country: 'United Kingdom',
    postalCode: 'W1J 5AW',
    paymentMethod: 'card',
  });

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderNum = `DAR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderCompleteNumber(orderNum);
    clearCart();
    setIsCheckingOut(false);
  };

  if (orderCompleteNumber) {
    return (
      <div style={{ maxWidth: '700px', margin: '60px auto', padding: '40px 20px', background: 'var(--white)', borderRadius: 'var(--radius-xl)', textAlign: 'center', border: '1px solid var(--cream-300)', boxShadow: 'var(--shadow-3d-card)' }}>
        <CheckCircle size={64} color="var(--green-700)" style={{ margin: '0 auto 16px' }} />
        <h1 style={{ fontSize: '2.4rem', color: 'var(--green-900)' }}>Order Confirmed!</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--slate-700)', marginTop: '8px' }}>
          Your bespoke order reference: <strong style={{ color: 'var(--green-700)' }}>{orderCompleteNumber}</strong>
        </p>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', marginTop: '12px', lineHeight: 1.6 }}>
          Our master tailor is reviewing your specifications and measurements. We will update you via email and WhatsApp.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '30px' }}>
          <Link href="/track-order" className="btn-3d-primary">
            Track Tailoring Progress →
          </Link>
          <Link href="/shop" className="btn-3d-secondary">
            Continue Browsing
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--green-900)', marginBottom: '12px' }}>Your Shopping Bag is Empty</h1>
        <p style={{ color: 'var(--slate-500)', marginBottom: '24px' }}>Explore our made-to-order imperial coats and blazers.</p>
        <Link href="/shop" className="btn-3d-primary">
          Explore Catalog <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 16px 100px' }}>
      <h1 style={{ fontSize: '2.6rem', color: 'var(--green-900)', marginBottom: '32px' }}>
        Your Luxury Shopping Bag
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'flex-start' }}>
        {/* Cart Item List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cart.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--white)',
                border: '1px solid var(--cream-300)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
                boxShadow: 'var(--shadow-3d-card)',
              }}
            >
              <img
                src={item.product.featured_image_url}
                alt={item.product.title}
                style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '10px' }}
              />

              <div style={{ flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--green-900)', marginBottom: '4px' }}>
                  {item.product.title}
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
                  Size: <strong style={{ color: 'var(--green-900)' }}>{item.selectedSize}</strong>
                  {item.selectedColor && <span> · Color: {item.selectedColor}</span>}
                </div>
                {item.isCustomSizing && item.measurements && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--green-700)', marginTop: '4px', background: 'var(--green-50)', padding: '4px 8px', borderRadius: '6px', display: 'inline-block' }}>
                    ✨ Custom Measure: {item.measurements.chest}&quot; Chest · {item.measurements.shoulder}&quot; Shoulder · {item.measurements.waist}&quot; Waist
                  </div>
                )}
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--green-700)', marginTop: '8px' }}>
                  £{(item.product.sale_price_gbp || item.product.base_price_gbp) * item.quantity}
                </div>
              </div>

              <button
                onClick={() => removeFromCart(idx)}
                style={{ background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', padding: '8px' }}
                aria-label="Remove Item"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary & Checkout Form */}
        <div
          style={{
            background: 'var(--white)',
            border: '1px solid var(--cream-300)',
            borderRadius: 'var(--radius-xl)',
            padding: '30px',
            boxShadow: 'var(--shadow-3d-card)',
          }}
        >
          <h2 style={{ fontSize: '1.4rem', color: 'var(--green-900)', marginBottom: '20px' }}>
            Order Summary
          </h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
            <span>Subtotal</span>
            <strong>£{subtotal}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
            <span>Worldwide DHL Express</span>
            <strong style={{ color: 'var(--green-700)' }}>FREE (Complimentary)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.95rem' }}>
            <span>Bespoke Pattern Cut</span>
            <strong style={{ color: 'var(--green-700)' }}>INCLUDED</strong>
          </div>

          <div style={{ borderTop: '1px solid var(--cream-300)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 700, color: 'var(--green-900)', marginBottom: '24px' }}>
            <span>Total</span>
            <span>£{subtotal}</span>
          </div>

          {isCheckingOut ? (
            <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--cream-300)' }}
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--cream-300)' }}
              />
              <input
                type="tel"
                placeholder="Phone / WhatsApp"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--cream-300)' }}
              />
              <input
                type="text"
                placeholder="Delivery Address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--cream-300)' }}
              />

              <button
                type="submit"
                className="btn-3d-primary"
                style={{ padding: '14px', fontSize: '1rem', width: '100%', justifyContent: 'center', marginTop: '10px' }}
              >
                Complete Bespoke Order (£{subtotal})
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsCheckingOut(true)}
              className="btn-3d-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'center' }}
            >
              Proceed to Luxury Checkout <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
