import { createClient } from '@/lib/supabase/client';
import { Order, OrderStatus } from '@/lib/types';

export async function getOrders(): Promise<Order[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as Order[];
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as Order) || null;
}

export async function createOrder(order: Order): Promise<Order> {
  const supabase = createClient();
  const { error } = await supabase.from('orders').insert(order as any);
  if (error) throw error;
  return order;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);
  if (error) throw error;
}
