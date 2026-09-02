import { createClient } from '@/lib/supabase/client';
import { CMSPage } from '@/lib/types';

export async function getPages(includeDrafts = true): Promise<CMSPage[]> {
  const supabase = createClient();
  let query = supabase.from('cms_pages').select('*').order('created_at', { ascending: false });
  if (!includeDrafts) query = query.eq('status', 'published');
  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as unknown as CMSPage[];
}

export async function getPageBySlug(slug: string): Promise<CMSPage | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('cms_pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as CMSPage) || null;
}

export async function savePage(page: CMSPage): Promise<CMSPage> {
  const supabase = createClient();
  const payload: CMSPage = { ...page, updated_at: new Date().toISOString() };
  const { error } = await supabase.from('cms_pages').upsert(payload as any);
  if (error) throw error;
  return payload;
}

export async function deletePage(pageId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from('cms_pages').delete().eq('id', pageId);
  if (error) throw error;
  return true;
}
