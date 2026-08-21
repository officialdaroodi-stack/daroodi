import { MetadataRoute } from 'next';
import { INITIAL_PRODUCTS, INITIAL_COLLECTIONS, INITIAL_JOURNAL_POSTS } from '@/lib/mockData';

const BASE_URL = 'https://daroodi.com';

export default function sitemap(): MetadataRoute.Sitemap {
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

  // Dynamic Product Pages
  const productPages: MetadataRoute.Sitemap = INITIAL_PRODUCTS.map((prod) => ({
    url: `${BASE_URL}/shop/${prod.slug}`,
    lastModified: new Date(prod.updated_at || prod.created_at || now),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Dynamic Journal Articles
  const journalPages: MetadataRoute.Sitemap = INITIAL_JOURNAL_POSTS.map((post) => ({
    url: `${BASE_URL}/journal/${post.slug}`,
    lastModified: new Date(post.published_at || now),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticPages, ...productPages, ...journalPages];
}
