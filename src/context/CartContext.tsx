'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, CustomMeasurements } from '@/lib/types';
import { trackEvent } from '@/lib/analytics';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, size: string, color?: string, isCustom?: boolean, measurements?: CustomMeasurements) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('daroodi_cart') : null;
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved cart', e);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('daroodi_cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (
    product: Product,
    quantity: number,
    size: string,
    color?: string,
    isCustom?: boolean,
    measurements?: CustomMeasurements
  ) => {
    const unitPrice = product.sale_price_gbp || product.base_price_gbp;
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color &&
          !isCustom
      );

      if (existingIndex > -1 && !isCustom) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prev,
        {
          product,
          quantity,
          selectedSize: size,
          selectedColor: color,
          isCustomSizing: isCustom,
          measurements,
        },
      ];
    });

    // Track the commerce event for analytics + pixels
    trackEvent('add_to_cart', {
      value: unitPrice * quantity,
      currency: 'GBP',
      metadata: {
        item_id: product.id,
        item_name: product.title,
        item_category: product.tier || product.acf_meta?.embroidery_technique,
        price: unitPrice,
        quantity,
        size,
        color,
        is_custom: !!isCustom,
      },
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.product.sale_price_gbp || item.product.base_price_gbp) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
