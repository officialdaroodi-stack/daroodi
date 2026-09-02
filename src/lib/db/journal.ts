import { createClient } from '@/lib/supabase/client';
import { JournalPost } from '@/lib/types';

export async function getJournalPosts(): Promise<JournalPost[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('journal_posts')
    .select('*')
    .order('published_at', { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as JournalPost[];
}

export async function getJournalPostBySlug(slug: string): Promise<JournalPost | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('journal_posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as JournalPost) || null;
}

export async function saveJournalPost(post: JournalPost): Promise<JournalPost> {
  const supabase = createClient();
  const { error } = await supabase.from('journal_posts').upsert(post as any);
  if (error) throw error;
  return post;
}

export async function deleteJournalPost(postId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from('journal_posts').delete().eq('id', postId);
  if (error) throw error;
  return true;
}
