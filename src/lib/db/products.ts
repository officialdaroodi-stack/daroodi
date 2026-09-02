import { createClient } from '@/lib/supabase/client';
import { Product } from '@/lib/types';

export async function getProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as Product) || null;
}

export async function saveProduct(product: Product): Promise<Product> {
  const supabase = createClient();
  const { error } = await supabase.from('products').upsert(product as any);
  if (error) throw error;
  return product;
}

export async function deleteProduct(productId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from('products').delete().eq('id', productId);
  if (error) throw error;
  return true;
}
