import { supabase } from '@/lib/supabase/client';
import { JournalPost } from '@/lib/types';
import { INITIAL_JOURNAL_POSTS } from '@/lib/mockData';

const JOURNAL_STORAGE_KEY = 'daroodi_db_journal';

export async function getJournalPosts(): Promise<JournalPost[]> {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(JOURNAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    }

    const { data } = await supabase
      .from('journal_posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (data && data.length > 0) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(data));
      }
      return data as JournalPost[];
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(INITIAL_JOURNAL_POSTS));
    }
    return INITIAL_JOURNAL_POSTS;
  } catch {
    return INITIAL_JOURNAL_POSTS;
  }
}

export async function getJournalPostBySlug(slug: string): Promise<JournalPost | null> {
  const all = await getJournalPosts();
  return all.find((p) => p.slug === slug) || null;
}

export async function saveJournalPost(post: JournalPost): Promise<JournalPost> {
  try {
    await supabase.from('journal_posts').upsert(post);
  } catch {
    // Fallback
  }

  if (typeof window !== 'undefined') {
    const existing = await getJournalPosts();
    const index = existing.findIndex((p) => p.id === post.id);
    let updated: JournalPost[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = post;
    } else {
      updated = [post, ...existing];
    }
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updated));
  }

  return post;
}

export async function deleteJournalPost(postId: string): Promise<boolean> {
  try {
    await supabase.from('journal_posts').delete().eq('id', postId);
  } catch {
    // Fallback
  }

  if (typeof window !== 'undefined') {
    const existing = await getJournalPosts();
    localStorage.setItem(
      JOURNAL_STORAGE_KEY,
      JSON.stringify(existing.filter((p) => p.id !== postId))
    );
  }

  return true;
}
