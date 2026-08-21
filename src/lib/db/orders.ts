import { supabase } from '@/lib/supabase/client';
import { Order, OrderStatus } from '@/lib/types';
import { INITIAL_ORDERS } from '@/lib/mockData';

const ORDERS_STORAGE_KEY = 'daroodi_db_orders';

export async function getOrders(): Promise<Order[]> {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    }

    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(data));
      }
      return data as Order[];
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
    }
    return INITIAL_ORDERS;
  } catch {
    return INITIAL_ORDERS;
  }
}

export async function createOrder(order: Order): Promise<Order> {
  try {
    await supabase.from('orders').insert(order);
  } catch {
    // Fallback
  }

  if (typeof window !== 'undefined') {
    const existing = await getOrders();
    const updated = [order, ...existing];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
  }

  return order;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  try {
    await supabase.from('orders').update({ status }).eq('id', orderId);
  } catch {
    // Fallback
  }

  if (typeof window !== 'undefined') {
    const existing = await getOrders();
    const updated = existing.map((o) => (o.id === orderId ? { ...o, status, updated_at: new Date().toISOString() } : o));
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
  }
}
