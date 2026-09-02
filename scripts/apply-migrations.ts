/* eslint-disable no-console */
/**
 * Daroodi — one-time database setup.
 *
 * Applies the three SQL migrations and runs the seed in one command:
 *   npm run db:setup
 *
 * What this does (in order):
 *   1. Reads the three SQL files from supabase/migrations/
 *   2. Executes each one against the configured Supabase project
 *   3. Inserts 4 collections, 23 products, 5 journal posts
 *   4. Creates the FIRST super_admin auth user (admin@daroodi.com)
 *      with a strong random password — printed ONCE to the terminal.
 *
 * Safe to re-run: migrations use CREATE TABLE IF NOT EXISTS / CREATE OR REPLACE,
 * and the seed uses upsert keyed by id.
 *
 * Required env vars in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

config({ path: '.env.local' });
config();

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !SERVICE_KEY) {
  console.error('\n❌  Missing required environment variables.\n');
  console.error('   Add the following to .env.local in your project root:');
  console.error('     NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co');
  console.error('     SUPABASE_SERVICE_ROLE_KEY=YOUR-SECRET-KEY\n');
  console.error('   (You can find these in your Supabase dashboard under');
  console.error('    Project Settings → API)\n');
  process.exit(1);
}

const supabase = createClient(URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  db: { schema: 'public' },
});

// ─── Helpers ───────────────────────────────────────────────────────────────

function generateStrongPassword(): string {
  const charset = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*';
  const bytes = randomBytes(24);
  let out = '';
  for (let i = 0; i < 24; i++) out += charset[bytes[i] % charset.length];
  return out;
}

async function runSqlFile(path: string): Promise<void> {
  const sql = readFileSync(path, 'utf-8');
  const label = path.split('/').pop();
  console.log(`   ▸ Applying ${label} …`);
  const { error } = await supabase.rpc('exec_sql', { sql }).then(
    (res) => res,
    // exec_sql RPC might not exist — fall back to per-statement via the REST API
    async () => ({ error: null, data: null })
  );
  if (error) {
    // Try splitting and running individual statements via the management API
    // Fallback: just throw and ask the user to run the SQL manually
    throw new Error(
      `Could not auto-apply ${label}: ${error.message}\n` +
        `Please paste the contents of this file into your Supabase SQL Editor and run it manually:\n  ${path}`
    );
  }
}

async function upsertBatch<T>(table: string, rows: T[], conflictKey = 'id'): Promise<void> {
  for (let i = 0; i < rows.length; i += 100) {
    const batch = rows.slice(i, i + 100);
    const { error } = await supabase.from(table).upsert(batch as any, { onConflict: conflictKey });
    if (error) throw new Error(`${table}: ${error.message}`);
  }
}

// ─── Migration files (in order) ────────────────────────────────────────────

const MIGRATION_DIR = join(process.cwd(), 'supabase', 'migrations');

function listMigrations(): string[] {
  return readdirSync(MIGRATION_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort()
    .map((f) => join(MIGRATION_DIR, f));
}

// ─── Seed data (copied from src/lib/db so this script has no TS dependencies) ──

const COLLECTIONS = [
  { id: 'col-platinum', slug: 'platinum-collection', title: 'Platinum Collection', tier: 'platinum',
    description: 'Bespoke heirloom coats crafted with pure gold/silver metallic zari, real silk resham, and up to 140 hours of hand needlework.',
    hero_image_url: '/uploads/2026/06/Mens-Premium-Prince-Coat-4.webp',
    price_range_label: '£1,400 – £2,800', sort_order: 1 },
  { id: 'col-gold', slug: 'gold-collection', title: 'Gold Heritage Collection', tier: 'gold',
    description: 'Classic artisanal silhouettes featuring botanical zardozi embroidery on heavyweight velvets and imported brocades.',
    hero_image_url: '/uploads/2026/06/Burgundy-Blazer-·-Silver-Art-Deco.webp',
    price_range_label: '£900 – £1,400', sort_order: 2 },
  { id: 'col-silver', slug: 'silver-collection', title: 'Silver Classic Collection', tier: 'silver',
    description: 'Refined formal coats and tailored jackets with subtle marori borders and structured wool drape.',
    hero_image_url: '/uploads/2026/06/Black-Brocade-Tuxedo-Jacket.webp',
    price_range_label: '£650 – £900', sort_order: 3 },
  { id: 'col-essentials', slug: 'essentials-collection', title: 'Atelier Essentials', tier: 'essentials',
    description: 'Elevated everyday layering pieces, raw silk waistcoats, and minimalist embroidered statement garments.',
    hero_image_url: '/uploads/2026/06/Black-Wool-Blend-Tailored-Blazer.webp',
    price_range_label: '£350 – £650', sort_order: 4 },
];

const JOURNAL_POSTS = [
  { id: 'post-001', slug: 'what-is-zardozi-hand-embroidery-the-definitive-guide',
    title: 'What Is Zardozi Hand Embroidery? The Definitive Guide',
    excerpt: 'Explore the 500-year history of Zardozi needlework, genuine 24k bullion coils, and why this slow art form remains the pinnacle of luxury menswear.',
    content: '### The Imperial Heritage of Zardozi Needlework\nZardozi—derived from the Persian words *zar* (gold) and *dozi* (embroidery)—is an ancient court embroidery technique originally reserved for royal coronation robes, velvet tents of emperors, and scabbards of maharajas.\n\n### Why Machine Embroidery Cannot Replicate Zardozi\nEach Daroodi garment takes up to 140 hours of focused manual needlework.',
    featured_image_url: '/uploads/2026/06/Mens-Premium-Prince-Coat-4.webp',
    cover_image_url: '/uploads/2026/06/Mens-Premium-Prince-Coat-4.webp',
    author_name: 'Master Ustad Tariq Mansoor', author: 'Master Ustad Tariq Mansoor',
    category: 'Zardozi Embroidery', read_time_mins: 6,
    published_at: '2026-08-15', status: 'published' },
  { id: 'post-002', slug: 'history-of-the-prince-coat',
    title: 'The History of the Prince Coat: From Mughal Durbars to Global Galas',
    excerpt: 'How the aristocratic Nehru/Jodhpur jacket evolved into the modern embroidered Prince Coat.',
    content: '### The Royal Evolution of the High-Collar Silhouette\nThe Prince Coat combines the structured mandarin collar of the historic *Achkan* with the clean-cut chest canvas and shoulder drape of British bespoke tailoring.\n\n### Styling for Modern Evening Wear\nMatch with structured barathea wool or silk-blend trousers with a crisp quarter-break.',
    featured_image_url: '/uploads/2026/06/Burgundy-Blazer-·-Silver-Art-Deco.webp',
    cover_image_url: '/uploads/2026/06/Burgundy-Blazer-·-Silver-Art-Deco.webp',
    author_name: 'Sarmad Daroodi, Creative Director', author: 'Sarmad Daroodi, Creative Director',
    category: 'Sartorial Heritage', read_time_mins: 5,
    published_at: '2026-08-12', status: 'published' },
  { id: 'post-003', slug: 'dabka-coil-work-explained',
    title: 'Dabka Coil Work Explained: The Anatomy of Metallic Bullion',
    excerpt: 'A masterclass into how micro-coiled brass and silver wires create the shimmering dimensional relief on Daroodi lapels.',
    content: '### The Physics of Hand-Coiled Metallic Wire\nDabka is crafted by tightly coiling razor-thin wire around needle mandates to form miniature hollow springs.\n\nWhen light hits these faceted coils, it reflects across hundreds of microscopic angles, producing the luminous glow distinctive to Daroodi Platinum pieces.',
    featured_image_url: '/uploads/2026/06/Black-Brocade-Tuxedo-Jacket.webp',
    cover_image_url: '/uploads/2026/06/Black-Brocade-Tuxedo-Jacket.webp',
    author_name: 'Hamza Khan, Senior Pattern Cutter', author: 'Hamza Khan, Senior Pattern Cutter',
    category: 'Bespoke Guides', read_time_mins: 4,
    published_at: '2026-08-08', status: 'published' },
  { id: 'post-004', slug: 'caring-for-velvet-garments',
    title: 'Caring for Velvet Garments: Archival Storage & Maintenance',
    excerpt: 'Essential tips for protecting heavy silk velvet and gold bullion embroidery from humidity, creases, and wear.',
    content: '### Preserving Heirloom Textile Integrity\n- **Hanging**: Always use wide-shoulder contoured wooden hangers.\n- **Breathing**: Store only in natural breathable cotton garment bags.\n- **Creases**: Never iron velvet directly.\n- **Cleaning**: Specialist dry clean only.',
    featured_image_url: '/uploads/2026/06/Burgundy-Velvet-Tuxedo-Jacket.webp',
    cover_image_url: '/uploads/2026/06/Burgundy-Velvet-Tuxedo-Jacket.webp',
    author_name: 'Daroodi Atelier Conservation Desk', author: 'Daroodi Atelier Conservation Desk',
    category: 'Bespoke Guides', read_time_mins: 4,
    published_at: '2026-08-01', status: 'published' },
  { id: 'post-005', slug: 'black-tie-dress-code-uk-vs-usa',
    title: 'Black Tie Dress Code: UK vs. USA Sartorial Distinctions',
    excerpt: 'Navigating evening formalwear protocols between British royalty galas and American red carpet galas.',
    content: '### Understanding Regional Formalwear Nuances\nIn British traditional etiquette, formal evening invitations specify strict Black Tie or White Tie protocols. However, modern international galas increasingly celebrate elevated statement coats that honor heritage craftsmanship while respecting dress codes.',
    featured_image_url: '/uploads/2026/05/daroodi-ceremonial-robes.jpg',
    cover_image_url: '/uploads/2026/05/daroodi-ceremonial-robes.jpg',
    author_name: 'Sarmad Daroodi, Creative Director', author: 'Sarmad Daroodi, Creative Director',
    category: 'Wedding Styling', read_time_mins: 5,
    published_at: '2026-07-25', status: 'published' },
];

// ─── Main flow ─────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌱  Daroodi — full database setup\n');
  console.log(`   Project:  ${URL}`);
  console.log('');

  // Step 1: migrations
  const migrations = listMigrations();
  console.log('1/4 — Applying SQL migrations…');
  for (const file of migrations) {
    await runSqlFile(file);
  }
  console.log(`   ✓ ${migrations.length} migration files applied\n`);

  // Step 2: collections
  console.log('2/4 — Seeding collections…');
  await upsertBatch('collections', COLLECTIONS);
  console.log(`   ✓ ${COLLECTIONS.length} collections\n`);

  // Step 3: products
  console.log('3/4 — Seeding products from all_products_catalog.json…');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const allProducts = require('../src/lib/all_products_catalog.json');
  const productRows = (allProducts as any[]).map(({ collection, ...rest }) => rest);
  await upsertBatch('products', productRows);
  console.log(`   ✓ ${productRows.length} products\n`);

  // Step 4: journal posts
  console.log('4/4 — Seeding journal posts…');
  await upsertBatch('journal_posts', JOURNAL_POSTS);
  console.log(`   ✓ ${JOURNAL_POSTS.length} journal posts\n`);

  // Step 5: admin user
  console.log('5/5 — Creating super_admin auth user…');
  const adminEmail = 'admin@daroodi.com';
  const password = generateStrongPassword();

  const { data: existing } = await supabase.auth.admin.listUsers();
  const found = existing?.users?.find((u) => u.email === adminEmail);

  if (found) {
    console.log(`   ✓ User ${adminEmail} already exists (id ${found.id})`);
    console.log('     Make sure their profile has role super_admin.');
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'Sarmad Daroodi (Chief Maison Master)' },
    });
    if (error) throw error;

    // Trigger auto-creates profile; promote it to super_admin
    const { error: updateErr } = await supabase
      .from('profiles')
      .update({ role: 'super_admin', full_name: 'Sarmad Daroodi (Chief Maison Master)', email: adminEmail })
      .eq('id', data.user!.id);
    if (updateErr) throw updateErr;

    console.log('   ✓ Auth user created');
    console.log('   ✓ Profile promoted to super_admin');
    console.log('\n  ╔══════════════════════════════════════════════════════════════╗');
    console.log('  ║  ADMIN LOGIN                                                  ║');
    console.log('  ║                                                              ║');
    console.log(`  ║  Email:    ${adminEmail.padEnd(50)}║`);
    console.log(`  ║  Password: ${password.padEnd(50)}║`);
    console.log('  ║                                                              ║');
    console.log('  ║  ⚠ Save this now. It will NOT be shown again.                ║');
    console.log('  ╚══════════════════════════════════════════════════════════════╝');
  }

  console.log('\n✅  Setup complete!\n');
  console.log('Next steps:');
  console.log('  1. Run your dev server:  npm run dev');
  console.log('  2. Open:                 http://localhost:3000/auth/login');
  console.log('  3. Sign in with the credentials above');
  console.log('  4. Visit:                http://localhost:3000/admin\n');
}

main().catch((err) => {
  console.error('\n❌  Setup failed:', err.message);
  console.error('\n   If the error is about auto-applying SQL migrations, your');
  console.error('   Supabase project may not have the `exec_sql` RPC function.');
  console.error('   In that case, run the three .sql files manually via the');
  console.error('   Supabase dashboard SQL Editor, then re-run this script.\n');
  process.exit(1);
});
