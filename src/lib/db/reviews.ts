import { supabase } from '@/lib/supabase/client';
import { ProductReview } from '@/lib/types';

const REVIEWS_STORAGE_KEY = 'daroodi_db_reviews';

const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: 'rev-1',
    product_id: 'prod-imperial-emerald-prince-coat',
    author_name: 'Shahid Khan',
    author_email: 'shahid.k@londonluxury.co.uk',
    rating: 5,
    title: 'Flawless Imperial Zardozi Needlework',
    comment: 'The zardozi bullion stitching on this velvet prince coat is breathtaking. Fits like a bespoke glove. Received countless compliments at my brother’s wedding in Mayfair. Truly slow luxury at its pinnacle.',
    verified: true,
    upvotes: 24,
    status: 'approved',
    created_at: '2026-07-14T10:00:00Z',
  },
  {
    id: 'rev-2',
    product_id: 'prod-imperial-emerald-prince-coat',
    author_name: 'Lord Julian Sterling',
    author_email: 'j.sterling@heritage-estates.com',
    rating: 5,
    title: 'Quarter-Inch Precision Custom Tailoring',
    comment: 'Exceptional craftsmanship. The made-to-measure bespoke form was followed down to the quarter inch. The floating canvas lapel and silk lining feel extraordinarily comfortable throughout long formal galas. DHL express shipping to London was prompt.',
    verified: true,
    upvotes: 18,
    status: 'approved',
    created_at: '2026-06-28T14:30:00Z',
  },
  {
    id: 'rev-3',
    product_id: 'prod-royal-midnight-velvet-coat',
    author_name: 'Dr. Daniyal Qureshi',
    author_email: 'daniyal.q@manchester.ac.uk',
    rating: 5,
    title: 'The Gold Bullion Detailing is Incredible',
    comment: 'Wore this for our formal reception in Manchester. The weight of the Italian velvet combined with the handcrafted gold Dabka embroidery is unmatched. You simply cannot find this caliber of tailoring in off-the-rack designer stores.',
    verified: true,
    upvotes: 15,
    status: 'approved',
    created_at: '2026-07-02T18:00:00Z',
  },
  {
    id: 'rev-4',
    product_id: 'prod-bordeaux-gold-dabka-prince-coat',
    author_name: 'Hamza Al-Maktoum',
    author_email: 'hamza.m@dubaiholdings.ae',
    rating: 5,
    title: 'Exquisite Regal Piece for Dubai Wedding',
    comment: 'Ordered custom bespoke measurements from Dubai. The master tailor verified all dimensions via WhatsApp prior to cutting the velvet. Delivered in an imperial wooden garment box.',
    verified: true,
    upvotes: 31,
    status: 'approved',
    created_at: '2026-08-01T09:15:00Z',
  },
];

export async function getReviews(productId?: string): Promise<ProductReview[]> {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
      let allReviews = stored ? JSON.parse(stored) : INITIAL_REVIEWS;
      if (productId) {
        return allReviews.filter((r: ProductReview) => r.product_id === productId || r.product_id.includes(productId) || productId.includes(r.product_id));
      }
      return allReviews;
    }

    const { data } = await supabase.from('reviews').select('*');
    if (data && data.length > 0) {
      if (productId) {
        return data.filter((r) => r.product_id === productId) as ProductReview[];
      }
      return data as ProductReview[];
    }
    return productId ? INITIAL_REVIEWS.filter((r) => r.product_id === productId) : INITIAL_REVIEWS;
  } catch {
    return productId ? INITIAL_REVIEWS.filter((r) => r.product_id === productId) : INITIAL_REVIEWS;
  }
}

export async function addReview(review: Omit<ProductReview, 'id' | 'created_at' | 'upvotes' | 'status'>): Promise<ProductReview> {
  const newRev: ProductReview = {
    ...review,
    id: `rev-${Date.now()}`,
    upvotes: 0,
    status: 'approved',
    created_at: new Date().toISOString(),
  };

  try {
    await supabase.from('reviews').insert(newRev);
  } catch {
    // Fallback
  }

  if (typeof window !== 'undefined') {
    const existing = await getReviews();
    const updated = [newRev, ...existing];
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
  }

  return newRev;
}

export async function upvoteReview(reviewId: string): Promise<void> {
  if (typeof window !== 'undefined') {
    const existing = await getReviews();
    const updated = existing.map((r) => (r.id === reviewId ? { ...r, upvotes: r.upvotes + 1 } : r));
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
  }
}
