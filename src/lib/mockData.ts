import { Collection, Product, UserProfile, Order, Commission, Payout, JournalPost, CMSBlock } from './types';

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

import allProductsData from './all_products_catalog.json';

export const INITIAL_PRODUCTS: Product[] = allProductsData.map((p) => ({
  ...p,
  collection: INITIAL_COLLECTIONS.find((c) => c.id === p.collection_id) || INITIAL_COLLECTIONS[0],
})) as unknown as Product[];


export const INITIAL_JOURNAL_POSTS: JournalPost[] = [
  {
    id: 'post-001',
    slug: 'what-is-zardozi-hand-embroidery-the-definitive-guide',
    title: 'What Is Zardozi Hand Embroidery? The Definitive Guide',
    excerpt: 'Explore the 500-year history of Zardozi needlework, genuine 24k bullion coils, and why this slow art form remains the pinnacle of luxury menswear.',
    content: `### The Imperial Heritage of Zardozi Needlework
Zardozi—derived from the Persian words *zar* (gold) and *dozi* (embroidery)—is an ancient court embroidery technique originally reserved for royal coronation robes, velvet tents of emperors, and scabbards of maharajas.

### The Tools of the Master Ustad
1. **The Karchob Loom**: A heavy horizontal wooden frame that holds rich Italian silk velvet taut under extreme tension.
2. **Ari (Needle Hook)**: A sharp pencil-fine awl hooked at the tip, enabling artisans to manipulate metal coils with sub-millimeter dexterity.
3. **Dabka & Bullion Coils**: Microscopic coiled springs of gold and silver-plated wire cut into millimeter fragments and hand-threaded onto fabric.

### Why Machine Embroidery Cannot Replicate Zardozi
Modern industrial machines can produce flat satin stitches, but they cannot sculpt three-dimensional bullion relief or adjust thread tension across velvet nap without crushing the pile. Each Daroodi garment takes up to 140 hours of focused manual needlework.`,
    cover_image_url: '/uploads/2026/06/Mens-Premium-Prince-Coat-4.webp',
    published_at: '2026-08-15',
    read_time_minutes: 6,
    author: 'Master Ustad Tariq Mansoor',
  },
  {
    id: 'post-002',
    slug: 'history-of-the-prince-coat',
    title: 'The History of the Prince Coat: From Mughal Durbars to Global Galas',
    excerpt: 'How the aristocratic Nehru/Jodhpur jacket evolved into the modern embroidered Prince Coat worn at international black-tie galas.',
    content: `### The Royal Evolution of the High-Collar Silhouette
The Prince Coat combines the structured mandarin collar of the historic *Achkan* with the clean-cut chest canvas and shoulder drape of British bespoke tailoring.

### Styling for Modern Evening Wear:
- **Trousers**: Match with structured barathea wool or silk-blend trousers with a crisp quarter-break.
- **Footwear**: Custom velvet Albert slippers with monogram crests or wholecut black Oxford leather shoes.
- **Lapel Accent**: Pair with bespoke enamel cufflinks and hand-turned metal buttons.`,
    cover_image_url: '/uploads/2026/06/Burgundy-Blazer-·-Silver-Art-Deco.webp',
    published_at: '2026-08-12',
    read_time_minutes: 5,
    author: 'Sarmad Daroodi, Creative Director',
  },
  {
    id: 'post-003',
    slug: 'dabka-coil-work-explained',
    title: 'Dabka Coil Work Explained: The Anatomy of Metallic Bullion',
    excerpt: 'A masterclass into how micro-coiled brass and silver wires create the shimmering dimensional relief on Daroodi lapels.',
    content: `### The Physics of Hand-Coiled Metallic Wire
Dabka is crafted by tightly coiling razor-thin wire around needle mandates to form miniature hollow springs. The artisan cuts each spring into precise 2mm segments before anchoring them to the fabric with hidden silk stitches.

When light hits these faceted coils, it reflects across hundreds of microscopic angles, producing the luminous glow distinctive to Daroodi Platinum pieces.`,
    cover_image_url: '/uploads/2026/06/Black-Brocade-Tuxedo-Jacket.webp',
    published_at: '2026-08-08',
    read_time_minutes: 4,
    author: 'Hamza Khan, Senior Pattern Cutter',
  },
  {
    id: 'post-004',
    slug: 'caring-for-velvet-garments',
    title: 'Caring for Velvet Garments: Archival Storage & Maintenance',
    excerpt: 'Essential tips for protecting heavy silk velvet and gold bullion embroidery from humidity, creases, and wear.',
    content: `### Preserving Heirloom Textile Integrity
- **Hanging**: Always use wide-shoulder contoured wooden hangers to preserve shoulder pad architecture.
- **Breathing**: Store only in natural breathable cotton garment bags; avoid sealed plastic covers that trap ambient moisture.
- **Creases**: Never iron velvet directly. Use a handheld vertical steamer from the inside lining, or hang in a humid room.
- **Cleaning**: Specialist dry clean only with certified couture textile preservationists.`,
    cover_image_url: '/uploads/2026/06/Burgundy-Velvet-Tuxedo-Jacket.webp',
    published_at: '2026-08-01',
    read_time_minutes: 4,
    author: 'Daroodi Atelier Conservation Desk',
  },
  {
    id: 'post-005',
    slug: 'black-tie-dress-code-uk-vs-usa',
    title: 'Black Tie Dress Code: UK vs. USA Sartorial Distinctions',
    excerpt: 'Navigating evening formalwear protocols between British royalty galas and American red carpet galas.',
    content: `### Understanding Regional Formalwear Nuances
In British traditional etiquette, formal evening invitations specify strict Black Tie or White Tie protocols. However, modern international galas in London, Dubai, and New York increasingly celebrate elevated statement coats that honor heritage craftsmanship while respecting dress codes.`,
    cover_image_url: '/uploads/2026/05/daroodi-ceremonial-robes.jpg',
    published_at: '2026-07-25',
    read_time_minutes: 5,
    author: 'Sarmad Daroodi, Creative Director',
  },
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-admin-01',
    email: 'admin@daroodi.com',
    full_name: 'Sarmad Daroodi (Chief Maison Master)',
    role: 'super_admin',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr-prod-mgr',
    email: 'production@daroodi.com',
    full_name: 'Master Ustad Tariq Mansoor',
    role: 'product_manager',
    created_at: '2026-01-05T00:00:00Z',
  },
  {
    id: 'usr-cm-uk',
    email: 'uk.sales@daroodi.com',
    full_name: 'Sir Arthur Sterling (UK Regional Partner)',
    role: 'country_sales_manager',
    assigned_country: 'GB',
    commission_rate: 0.12,
    created_at: '2026-01-10T00:00:00Z',
  },
  {
    id: 'usr-cm-ae',
    email: 'dubai.sales@daroodi.com',
    full_name: 'Rashid Al-Fardan (UAE Regional Partner)',
    role: 'country_sales_manager',
    assigned_country: 'AE',
    commission_rate: 0.10,
    created_at: '2026-01-12T00:00:00Z',
  },
  {
    id: 'usr-cm-us',
    email: 'us.sales@daroodi.com',
    full_name: 'Kamran Siddiqui (US & Canada Partner)',
    role: 'country_sales_manager',
    assigned_country: 'US',
    commission_rate: 0.10,
    created_at: '2026-01-15T00:00:00Z',
  },
];

export const INITIAL_COMMISSIONS: Commission[] = [
  {
    id: 'comm-101',
    order_id: 'ord-10482',
    recipient_id: 'usr-cm-uk',
    recipient: INITIAL_USERS[2],
    tier_level: 'country_manager_override',
    order_amount: 1450,
    rate: 0.12,
    commission_amount: 174.00,
    status: 'approved',
    approved_by: 'usr-admin-01',
    created_at: '2026-08-18T15:00:00Z',
  },
  {
    id: 'comm-102',
    order_id: 'ord-10483',
    recipient_id: 'usr-cm-ae',
    recipient: INITIAL_USERS[3],
    tier_level: 'country_manager_override',
    order_amount: 1150,
    rate: 0.10,
    commission_amount: 115.00,
    status: 'approved',
    approved_by: 'usr-admin-01',
    created_at: '2026-08-16T10:00:00Z',
  },
  {
    id: 'comm-103',
    order_id: 'ord-10485',
    recipient_id: 'usr-cm-us',
    recipient: INITIAL_USERS[4],
    tier_level: 'country_manager_override',
    order_amount: 1450,
    rate: 0.10,
    commission_amount: 145.00,
    status: 'pending_approval',
    created_at: '2026-08-05T17:00:00Z',
  },
];

export const INITIAL_PAYOUTS: Payout[] = [
  {
    id: 'pay-001',
    recipient_id: 'usr-cm-uk',
    recipient: INITIAL_USERS[2],
    amount: 174.00,
    currency: 'GBP',
    payout_method: 'Barclays International Wire',
    transaction_reference: 'TXN-GB-8930419',
    status: 'completed',
    disbursed_by: 'usr-admin-01',
    disbursed_at: '2026-08-19T10:00:00Z',
    created_at: '2026-08-18T16:00:00Z',
  },
  {
    id: 'pay-002',
    recipient_id: 'usr-cm-ae',
    recipient: INITIAL_USERS[3],
    amount: 115.00,
    currency: 'GBP',
    payout_method: 'Emirates NBD Wire',
    transaction_reference: 'TXN-AE-4091840',
    status: 'completed',
    disbursed_by: 'usr-admin-01',
    disbursed_at: '2026-08-17T11:30:00Z',
    created_at: '2026-08-16T11:00:00Z',
  },
];

export const INITIAL_CMS_BLOCKS: CMSBlock[] = [
  {
    id: 'cms-hero',
    block_key: 'home_hero_banner',
    content_json: {
      headline: 'Imperial Handcrafted Haute Couture',
      tagline: 'Preserving 3 generations of Mughal royal needlework on pure Italian velvets.',
    },
    updated_at: '2026-08-22T00:00:00Z',
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-10482',
    order_number: 'DAR-10482',
    customer_id: 'cust-01',
    client_name: 'Lord Alistair Sterling',
    client_email: 'a.sterling@kensington-holdings.co.uk',
    client_country: 'GB',
    product_title: "Men's Imperial Gold Velvet Prince Coat",
    size: '42L (Custom Bespoke)',
    color: 'Imperial Emerald',
    status: 'in_production',
    order_type: 'bespoke_custom',
    currency: 'GBP',
    subtotal: 1450,
    discount_total: 0,
    tax_total: 0,
    shipping_total: 0,
    grand_total: 1450,
    total_amount_gbp: 1450,
    paid: true,
    payment_status: 'paid',
    payment_method: 'Stripe Luxury Vault (Visa Infinite)',
    shipping_address: {
      full_name: 'Lord Alistair Sterling',
      address_line1: '14 Kensington Palace Gardens',
      city: 'London',
      country: 'United Kingdom',
      postal_code: 'W8 4QP',
      phone: '+44 20 7946 0912',
      email: 'a.sterling@kensington-holdings.co.uk',
    },
    created_at: '2026-08-18T14:32:00Z',
    lead_time_weeks: 4,
  },
  {
    id: 'ord-10483',
    order_number: 'DAR-10483',
    customer_id: 'cust-02',
    client_name: 'Sheikh Hamdan Al-Maktoum',
    client_email: 'h.almaktoum@dubairoyal.ae',
    client_country: 'AE',
    product_title: 'Burgundy Art Deco Silver Embroidered Blazer',
    size: '44R (Bespoke)',
    color: 'Deep Burgundy',
    status: 'quality_check',
    order_type: 'bespoke_custom',
    currency: 'GBP',
    subtotal: 1150,
    discount_total: 0,
    tax_total: 0,
    shipping_total: 0,
    grand_total: 1150,
    total_amount_gbp: 1150,
    paid: true,
    payment_status: 'paid',
    payment_method: 'Emirates NBD Wire',
    shipping_address: {
      full_name: 'Sheikh Hamdan Al-Maktoum',
      address_line1: 'Al-Wasl Road, Jumeirah 1',
      city: 'Dubai',
      country: 'United Arab Emirates',
      postal_code: '00000',
      phone: '+971 4 301 8888',
      email: 'h.almaktoum@dubairoyal.ae',
    },
    created_at: '2026-08-16T09:15:00Z',
    lead_time_weeks: 3,
  },
  {
    id: 'ord-10484',
    order_number: 'DAR-10484',
    customer_id: 'cust-03',
    client_name: 'Dr. Tariq Mahmood',
    client_email: 'tariq.mahmood@harleystreet.com',
    client_country: 'GB',
    product_title: 'Black Silk Brocade Royal Tuxedo Jacket',
    size: '40R',
    color: 'Onyx Brocade',
    status: 'dispatched',
    order_type: 'ready_to_wear',
    currency: 'GBP',
    subtotal: 850,
    discount_total: 0,
    tax_total: 0,
    shipping_total: 0,
    grand_total: 850,
    total_amount_gbp: 850,
    paid: true,
    payment_status: 'paid',
    payment_method: 'Mastercard World Elite',
    shipping_address: {
      full_name: 'Dr. Tariq Mahmood',
      address_line1: '98 Harley Street',
      city: 'London',
      country: 'United Kingdom',
      postal_code: 'W1G 7HZ',
      phone: '+44 20 7580 4422',
      email: 'tariq.mahmood@harleystreet.com',
    },
    created_at: '2026-08-12T11:45:00Z',
    lead_time_weeks: 2,
  },
  {
    id: 'ord-10485',
    order_number: 'DAR-10485',
    customer_id: 'cust-04',
    client_name: 'Farhan Zaidi',
    client_email: 'farhan@siliconvalley-capital.com',
    client_country: 'US',
    product_title: "Men's Imperial Gold Velvet Prince Coat",
    size: '38R',
    color: 'Royal Midnight Navy',
    status: 'delivered',
    order_type: 'ready_to_wear',
    currency: 'GBP',
    subtotal: 1450,
    discount_total: 0,
    tax_total: 0,
    shipping_total: 0,
    grand_total: 1450,
    total_amount_gbp: 1450,
    paid: true,
    payment_status: 'paid',
    payment_method: 'American Express Centurion',
    shipping_address: {
      full_name: 'Farhan Zaidi',
      address_line1: '2400 Sand Hill Road, Suite 200',
      city: 'Menlo Park',
      state: 'CA',
      country: 'United States',
      postal_code: '94025',
      phone: '+1 650 854 0000',
      email: 'farhan@siliconvalley-capital.com',
    },
    created_at: '2026-08-05T16:20:00Z',
    lead_time_weeks: 4,
  },
];
