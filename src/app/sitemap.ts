import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const BASE_URL = 'https://daroodi.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static Core Pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${BASE_URL}/collections`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/custom-order`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/bulk-events`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/our-heritage`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/journal`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/sitemap`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];

  // Server-side Supabase queries
  const supabase = await createClient();

  // Dynamic Product Pages
  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .select('slug, updated_at, created_at');

  if (productsError) {
    console.error('sitemap: failed to load products', productsError);
  }

  const productPages: MetadataRoute.Sitemap = (productsData || []).map((prod: any) => ({
    url: `${BASE_URL}/shop/${prod.slug}`,
    lastModified: new Date(prod.updated_at || prod.created_at || now),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Dynamic Journal Articles — only include published posts on the public sitemap
  const { data: journalData, error: journalError } = await supabase
    .from('journal_posts')
    .select('slug, published_at, status')
    .eq('status', 'published');

  if (journalError) {
    console.error('sitemap: failed to load journal posts', journalError);
  }

  const journalPages: MetadataRoute.Sitemap = (journalData || []).map((post: any) => ({
    url: `${BASE_URL}/journal/${post.slug}`,
    lastModified: new Date(post.published_at || now),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticPages, ...productPages, ...journalPages];
}