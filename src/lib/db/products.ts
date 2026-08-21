import { supabase } from '@/lib/supabase/client';
import { Product } from '@/lib/types';
import { INITIAL_PRODUCTS } from '@/lib/mockData';

const PRODUCTS_STORAGE_KEY = 'daroodi_master_products_v3_exact';

export async function getProducts(): Promise<Product[]> {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      }
      return INITIAL_PRODUCTS;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(data));
    }
    return data as Product[];
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await getProducts();
  const found = all.find((p) => p.slug === slug);
  return found || null;
}

export async function saveProduct(product: Product): Promise<Product> {
  try {
    await supabase.from('products').upsert(product);
  } catch {
    // Graceful fallback to client persistence
  }

  if (typeof window !== 'undefined') {
    const existing = await getProducts();
    const index = existing.findIndex((p) => p.id === product.id);
    let updated: Product[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = product;
    } else {
      updated = [product, ...existing];
    }
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
  }

  return product;
}

export async function deleteProduct(productId: string): Promise<boolean> {
  try {
    await supabase.from('products').delete().eq('id', productId);
  } catch {
    // Graceful fallback
  }

  if (typeof window !== 'undefined') {
    const existing = await getProducts();
    const updated = existing.filter((p) => p.id !== productId);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
  }

  return true;
}
