import { supabase } from '@/lib/supabase/client';
import { CMSPage } from '@/lib/types';

const PAGES_STORAGE_KEY = 'daroodi_db_pages';

const INITIAL_PAGES: CMSPage[] = [
  {
    id: 'page-001',
    slug: 'about-the-maison',
    title: 'About the Maison',
    excerpt: 'The story of Daroodi — a heritage atelier crafting bespoke prince coats for modern royalty.',
    content: `### A Heritage of Imperial Craftsmanship\n\nDaroodi is a luxury atelier dedicated to the art of hand-embroidered menswear. Each garment is cut, canvassed, and finished by master artisans using techniques passed down through generations of Mughal court embroiderers.\n\n### Our Atelier\n\nFrom our Lahore workshop, over 40 artisans practice zardozi, dabka, and bullion-wire embroidery — slow crafts that cannot be replicated by machine.`,
    status: 'published',
    show_in_footer: false,
    seo_title: 'About Daroodi | Heritage Luxury Atelier',
    seo_description: 'Discover the story of Daroodi, a heritage atelier crafting bespoke hand-embroidered prince coats and haute couture menswear.',
    created_at: '2026-08-01',
  },
];

export async function getPages(includeDrafts = true): Promise<CMSPage[]> {
  let pages: CMSPage[] = INITIAL_PAGES;
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(PAGES_STORAGE_KEY);
      if (stored) {
        pages = JSON.parse(stored);
      } else {
        const { data } = await supabase
          .from('cms_pages')
          .select('*')
          .order('created_at', { ascending: false });
        if (data && data.length > 0) {
          pages = data as CMSPage[];
        }
        localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(pages));
      }
    }
  } catch {
    // Graceful fallback to seed pages
  }

  return includeDrafts ? pages : pages.filter((p) => p.status === 'published');
}

export async function getPageBySlug(slug: string): Promise<CMSPage | null> {
  const all = await getPages(false);
  return all.find((p) => p.slug === slug) || null;
}

export async function savePage(page: CMSPage): Promise<CMSPage> {
  const payload: CMSPage = { ...page, updated_at: new Date().toISOString() };
  try {
    await supabase.from('cms_pages').upsert(payload);
  } catch {
    // Graceful fallback
  }

  if (typeof window !== 'undefined') {
    const existing = await getPages(true);
    const index = existing.findIndex((p) => p.id === page.id);
    const updated = index >= 0
      ? existing.map((p) => (p.id === page.id ? payload : p))
      : [payload, ...existing];
    localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(updated));
  }

  return payload;
}

export async function deletePage(pageId: string): Promise<boolean> {
  try {
    await supabase.from('cms_pages').delete().eq('id', pageId);
  } catch {
    // Graceful fallback
  }

  if (typeof window !== 'undefined') {
    const existing = await getPages(true);
    localStorage.setItem(
      PAGES_STORAGE_KEY,
      JSON.stringify(existing.filter((p) => p.id !== pageId))
    );
  }

  return true;
}
