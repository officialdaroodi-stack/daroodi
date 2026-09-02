// Daroodi — Collections
//
// IMPORTANT: this file only contains the 4 product tier collections.
// All other data (users, products, orders, journal posts, etc.) lives in Supabase
// and is seeded via `scripts/seed.ts` (run once after migrations).
//
// If you are looking for INITIAL_PRODUCTS / INITIAL_USERS / INITIAL_ORDERS — they
// no longer exist. Read from the Supabase tables via the modules in `@/lib/db`.

import { Collection } from './types';

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col-platinum',
    slug: 'platinum-collection',
    title: 'Platinum Collection',
    tier: 'platinum',
    description: 'Bespoke heirloom coats crafted with pure gold/silver metallic zari, real silk resham, and up to 140 hours of hand needlework.',
    hero_image_url: '/uploads/2026/06/Mens-Premium-Prince-Coat-4.webp',
    price_range_label: '£1,400 – £2,800',
    sort_order: 1,
  },
  {
    id: 'col-gold',
    slug: 'gold-collection',
    title: 'Gold Heritage Collection',
    tier: 'gold',
    description: 'Classic artisanal silhouettes featuring botanical zardozi embroidery on heavyweight velvets and imported brocades.',
    hero_image_url: '/uploads/2026/06/Burgundy-Blazer-·-Silver-Art-Deco.webp',
    price_range_label: '£900 – £1,400',
    sort_order: 2,
  },
  {
    id: 'col-silver',
    slug: 'silver-collection',
    title: 'Silver Classic Collection',
    tier: 'silver',
    description: 'Refined formal coats and tailored jackets with subtle marori borders and structured wool drape.',
    hero_image_url: '/uploads/2026/06/Black-Brocade-Tuxedo-Jacket.webp',
    price_range_label: '£650 – £900',
    sort_order: 3,
  },
  {
    id: 'col-essentials',
    slug: 'essentials-collection',
    title: 'Atelier Essentials',
    tier: 'essentials',
    description: 'Elevated everyday layering pieces, raw silk waistcoats, and minimalist embroidered statement garments.',
    hero_image_url: '/uploads/2026/06/Black-Wool-Blend-Tailored-Blazer.webp',
    price_range_label: '£350 – £650',
    sort_order: 4,
  },
];
