/* eslint-disable no-console */
/**
 * Daroodi — one-time database seed.
 *
 * Run AFTER you've applied the SQL migrations:
 *   1. Apply 001_initial_schema.sql
 *   2. Apply 002_full_production_schema.sql
 *   3. Apply 003_cms_auth_full.sql
 *   4. npm install tsx --save-dev
 *   5. npm run seed
 *
 * What this does:
 *   - Inserts 4 collections
 *   - Inserts 23 products from src/lib/all_products_catalog.json
 *   - Inserts 5 editorial journal posts
 *   - Creates the FIRST super_admin auth user with a strong random password
 *     (printed to console — copy it, this is the only time it will be shown)
 *
 * Re-running is safe: it skips rows that already exist by id.
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

// Load .env.local first, then .env
config({ path: '.env.local' });
config();

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ----- Password generator: 20+ chars, strong, easy to read aloud -----
function generateStrongPassword(): string {
  const charset = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*';
  const bytes = randomBytes(24);
  let out = '';
  for (let i = 0; i < 24; i++) out += charset[bytes[i] % charset.length];
  return out;
}

const COLLECTIONS = [
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

const JOURNAL_POSTS = [
  {
    id: 'post-001',
    slug: 'what-is-zardozi-hand-embroidery-the-definitive-guide',
    title: 'What Is Zardozi Hand Embroidery? The Definitive Guide',
    excerpt: 'Explore the 500-year history of Zardozi needlework, genuine 24k bullion coils, and why this slow art form remains the pinnacle of luxury menswear.',
    content: `### The Imperial Heritage of Zardozi Needlework\nZardozi—derived from the Persian words *zar* (gold) and *dozi* (embroidery)—is an ancient court embroidery technique originally reserved for royal coronation robes, velvet tents of emperors, and scabbards of maharajas.\n\n### The Tools of the Master Ustad\n1. **The Karchob Loom**: A heavy horizontal wooden frame that holds rich Italian silk velvet taut under extreme tension.\n2. **Ari (Needle Hook)**: A sharp pencil-fine awl hooked at the tip, enabling artisans to manipulate metal coils with sub-millimeter dexterity.\n3. **Dabka & Bullion Coils**: Microscopic coiled springs of gold and silver-plated wire cut into millimeter fragments and hand-threaded onto fabric.\n\n### Why Machine Embroidery Cannot Replicate Zardozi\nModern industrial machines can produce flat satin stitches, but they cannot sculpt three-dimensional bullion relief or adjust thread tension across velvet nap without crushing the pile. Each Daroodi garment takes up to 140 hours of focused manual needlework.`,
    featured_image_url: '/uploads/2026/06/Mens-Premium-Prince-Coat-4.webp',
    cover_image_url: '/uploads/2026/06/Mens-Premium-Prince-Coat-4.webp',
    author_name: 'Master Ustad Tariq Mansoor',
    author: 'Master Ustad Tariq Mansoor',
    category: 'Zardozi Embroidery',
    read_time_mins: 6,
    published_at: '2026-08-15',
    status: 'published',
  },
  {
    id: 'post-002',
    slug: 'history-of-the-prince-coat',
    title: 'The History of the Prince Coat: From Mughal Durbars to Global Galas',
    excerpt: 'How the aristocratic Nehru/Jodhpur jacket evolved into the modern embroidered Prince Coat worn at international black-tie galas.',
    content: `### The Royal Evolution of the High-Collar Silhouette\nThe Prince Coat combines the structured mandarin collar of the historic *Achkan* with the clean-cut chest canvas and shoulder drape of British bespoke tailoring.\n\n### Styling for Modern Evening Wear\n- **Trousers**: Match with structured barathea wool or silk-blend trousers with a crisp quarter-break.\n- **Footwear**: Custom velvet Albert slippers with monogram crests or wholecut black Oxford leather shoes.\n- **Lapel Accent**: Pair with bespoke enamel cufflinks and hand-turned metal buttons.`,
    featured_image_url: '/uploads/2026/06/Burgundy-Blazer-·-Silver-Art-Deco.webp',
    cover_image_url: '/uploads/2026/06/Burgundy-Blazer-·-Silver-Art-Deco.webp',
    author_name: 'Sarmad Daroodi, Creative Director',
    author: 'Sarmad Daroodi, Creative Director',
    category: 'Sartorial Heritage',
    read_time_mins: 5,
    published_at: '2026-08-12',
    status: 'published',
  },
  {
    id: 'post-003',
    slug: 'dabka-coil-work-explained',
    title: 'Dabka Coil Work Explained: The Anatomy of Metallic Bullion',
    excerpt: 'A masterclass into how micro-coiled brass and silver wires create the shimmering dimensional relief on Daroodi lapels.',
    content: `### The Physics of Hand-Coiled Metallic Wire\nDabka is crafted by tightly coiling razor-thin wire around needle mandates to form miniature hollow springs. The artisan cuts each spring into precise 2mm segments before anchoring them to the fabric with hidden silk stitches.\n\nWhen light hits these faceted coils, it reflects across hundreds of microscopic angles, producing the luminous glow distinctive to Daroodi Platinum pieces.`,
    featured_image_url: '/uploads/2026/06/Black-Brocade-Tuxedo-Jacket.webp',
    cover_image_url: '/uploads/2026/06/Black-Brocade-Tuxedo-Jacket.webp',
    author_name: 'Hamza Khan, Senior Pattern Cutter',
    author: 'Hamza Khan, Senior Pattern Cutter',
    category: 'Bespoke Guides',
    read_time_mins: 4,
    published_at: '2026-08-08',
    status: 'published',
  },
  {
    id: 'post-004',
    slug: 'caring-for-velvet-garments',
    title: 'Caring for Velvet Garments: Archival Storage & Maintenance',
    excerpt: 'Essential tips for protecting heavy silk velvet and gold bullion embroidery from humidity, creases, and wear.',
    content: `### Preserving Heirloom Textile Integrity\n- **Hanging**: Always use wide-shoulder contoured wooden hangers to preserve shoulder pad architecture.\n- **Breathing**: Store only in natural breathable cotton garment bags; avoid sealed plastic covers that trap ambient moisture.\n- **Creases**: Never iron velvet directly. Use a handheld vertical steamer from the inside lining, or hang in a humid room.\n- **Cleaning**: Specialist dry clean only with certified couture textile preservationists.`,
    featured_image_url: '/uploads/2026/06/Burgundy-Velvet-Tuxedo-Jacket.webp',
    cover_image_url: '/uploads/2026/06/Burgundy-Velvet-Tuxedo-Jacket.webp',
    author_name: 'Daroodi Atelier Conservation Desk',
    author: 'Daroodi Atelier Conservation Desk',
    category: 'Bespoke Guides',
    read_time_mins: 4,
    published_at: '2026-08-01',
    status: 'published',
  },
  {
    id: 'post-005',
    slug: 'black-tie-dress-code-uk-vs-usa',
    title: 'Black Tie Dress Code: UK vs. USA Sartorial Distinctions',
    excerpt: 'Navigating evening formalwear protocols between British royalty galas and American red carpet galas.',
    content: `### Understanding Regional Formalwear Nuances\nIn British traditional etiquette, formal evening invitations specify strict Black Tie or White Tie protocols. However, modern international galas in London, Dubai, and New York increasingly celebrate elevated statement coats that honor heritage craftsmanship while respecting dress codes.`,
    featured_image_url: '/uploads/2026/05/daroodi-ceremonial-robes.jpg',
    cover_image_url: '/uploads/2026/05/daroodi-ceremonial-robes.jpg',
    author_name: 'Sarmad Daroodi, Creative Director',
    author: 'Sarmad Daroodi, Creative Director',
    category: 'Wedding Styling',
    read_time_mins: 5,
    published_at: '2026-07-25',
    status: 'published',
  },
];

async function upsert<T>(table: string, rows: T[], conflictKey = 'id') {
  for (let i = 0; i < rows.length; i += 100) {
    const batch = rows.slice(i, i + 100);
    const { error } = await supabase.from(table).upsert(batch as any, { onConflict: conflictKey });
    if (error) throw new Error(`${table}: ${error.message}`);
  }
}

async function main() {
  console.log('🌱 Seeding Daroodi database...\n');

  console.log('1/4 — collections...');
  await upsert('collections', COLLECTIONS);
  console.log(`  ✓ ${COLLECTIONS.length} collections`);

  console.log('2/4 — products (from src/lib/all_products_catalog.json)...');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const allProducts = require('../src/lib/all_products_catalog.json');
  const productRows = (allProducts as any[]).map((p) => {
    let colId = p.collection_id;
    if (!['col-platinum', 'col-gold', 'col-silver', 'col-essentials'].includes(colId)) {
      const tierLower = (p.tier || '').toLowerCase();
      if (tierLower.includes('platinum')) colId = 'col-platinum';
      else if (tierLower.includes('gold')) colId = 'col-gold';
      else if (tierLower.includes('silver')) colId = 'col-silver';
      else colId = 'col-essentials';
    }

    const acf_meta = {
      ...(p.acf_meta || {}),
      wp_id: p.wp_id,
      categories: p.categories,
      tags: p.tags,
      tier: p.tier,
      attributes: p.attributes,
      stock_quantity: p.stock_quantity,
    };
    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      collection_id: colId,
      base_price_gbp: p.base_price_gbp || 0,
      regular_price_gbp: p.regular_price_gbp || p.base_price_gbp || 0,
      sale_price_gbp: p.sale_price_gbp || null,
      description: p.description || '',
      featured_image_url: p.featured_image_url || '',
      gallery_images: p.gallery_images || [],
      stock_status: p.stock_status || 'made_to_order',
      is_featured: !!p.is_featured,
      lead_time_weeks: p.lead_time_weeks || 4,
      category: p.category || p.categories?.[0] || 'Prince Coats',
      acf_meta: acf_meta,
    };
  });
  await upsert('products', productRows);
  console.log(`  ✓ ${productRows.length} products`);

  console.log('3/4 — journal posts...');
  const journalRows = JOURNAL_POSTS.map((j) => ({
    id: j.id,
    slug: j.slug,
    title: j.title,
    excerpt: j.excerpt,
    content_markdown: (j as any).content_markdown || (j as any).content || '',
    featured_image_url: j.featured_image_url,
    author_name: j.author_name || 'Daroodi Master Stylist',
    category: j.category || 'Sartorial Heritage',
    read_time_mins: j.read_time_mins || 5,
    status: j.status || 'published',
    published_at: j.published_at ? new Date(j.published_at).toISOString() : new Date().toISOString(),
  }));
  await upsert('journal_posts', journalRows);
  console.log(`  ✓ ${journalRows.length} journal posts`);

  console.log('4/4 — super_admin auth user...');
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@daroodi.com';
  const password = process.env.ADMIN_INITIAL_PASSWORD || generateStrongPassword();

  // Check if user already exists
  const { data: existing } = await supabase.auth.admin.listUsers();
  const found = existing?.users?.find((u) => u.email === adminEmail);

  if (found) {
    console.log(`  ✓ User ${adminEmail} already exists (id ${found.id})`);

    // If an explicit password is configured, sync it so the operator's
    // chosen credentials always work (idempotent re-runs).
    if (process.env.ADMIN_INITIAL_PASSWORD) {
      const { error: pwErr } = await supabase.auth.admin.updateUserById(found.id, {
        password: process.env.ADMIN_INITIAL_PASSWORD,
        email_confirm: true,
      });
      if (pwErr) {
        console.warn(`    ⚠ Could not reset password: ${pwErr.message}`);
      } else {
        console.log('    ✓ Password synced from ADMIN_INITIAL_PASSWORD');
      }
    }

    // Ensure the profile exists and has the super_admin role
    const { error: roleErr } = await supabase
      .from('profiles')
      .upsert(
        {
          id: found.id,
          email: adminEmail,
          full_name: 'Sarmad Daroodi (Chief Maison Master)',
          role: 'super_admin',
        },
        { onConflict: 'id' }
      );
    if (roleErr) {
      console.warn(`    ⚠ Could not promote profile role: ${roleErr.message}`);
    } else {
      console.log('    ✓ Profile role confirmed: super_admin');
    }
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'Sarmad Daroodi (Chief Maison Master)' },
    });
    if (error) throw error;

    // The handle_new_user trigger auto-inserts a profile with role=customer.
    // Promote it to super_admin.
    const { error: updateErr } = await supabase
      .from('profiles')
      .update({
        role: 'super_admin',
        full_name: 'Sarmad Daroodi (Chief Maison Master)',
        email: adminEmail,
      })
      .eq('id', data.user!.id);
    if (updateErr) throw updateErr;

    console.log('  ✓ Auth user created');
    console.log('  ✓ Profile promoted to super_admin');
    console.log('\n  ╔══════════════════════════════════════════════════════════════╗');
    console.log(`  ║  ADMIN LOGIN                                                  ║`);
    console.log(`  ║                                                              ║`);
    console.log(`  ║  Email:    ${adminEmail.padEnd(50)}║`);
    console.log(`  ║  Password: ${password.padEnd(50)}║`);
    console.log(`  ║                                                              ║`);
    console.log(`  ║  ⚠ Save this now. It will NOT be shown again.                ║`);
    console.log('  ╚══════════════════════════════════════════════════════════════╝');
  }

  console.log('\n✅ Seed complete.');
  console.log('\nNext steps:');
  console.log('  1. npm run dev');
  console.log('  2. Visit http://localhost:3000/auth/login');
  console.log('  3. Sign in with the credentials above');
  console.log('  4. Go to /admin and explore the CMS');
}

main().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
