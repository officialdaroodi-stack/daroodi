import { createClient } from '@/lib/supabase/client';
import { ProductReview } from '@/lib/types';

export async function getReviews(productId?: string): Promise<ProductReview[]> {
  const supabase = createClient();
  let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
  if (productId) query = query.eq('product_id', productId);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as ProductReview[];
}

export async function addReview(
  review: Omit<ProductReview, 'id' | 'created_at' | 'upvotes' | 'status'>
): Promise<ProductReview> {
  const supabase = createClient();
  const newRev: ProductReview = {
    ...review,
    id: `rev-${Date.now()}`,
    upvotes: 0,
    status: 'approved',
    created_at: new Date().toISOString(),
  };
  const { error } = await supabase.from('reviews').insert(newRev as any);
  if (error) throw error;
  return newRev;
}

export async function upvoteReview(reviewId: string): Promise<void> {
  const supabase = createClient();
  // Read-modify-write (acceptable for low-volume like/upvote)
  const { data } = await supabase.from('reviews').select('upvotes').eq('id', reviewId).single();
  if (!data) return;
  const next = (data.upvotes || 0) + 1;
  await supabase.from('reviews').update({ upvotes: next }).eq('id', reviewId);
}
