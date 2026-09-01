import { supabaseAdmin } from '@/lib/supabaseAdmin';

export function generateOrderNumber() {
  return `DC-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;
}

export function generateReceiptNumber() {
  return `RCP-${Date.now().toString(36).toUpperCase()}`;
}

export async function getOrderWithItems(orderId: string) {
  const { data: order, error: orderErr } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();
  if (orderErr) throw orderErr;

  const { data: items, error: itemsErr } = await supabaseAdmin
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);
  if (itemsErr) throw itemsErr;

  let profile = null;
  if (order.user_id) {
    const { data } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', order.user_id)
      .maybeSingle();
    profile = data;
  }

  return { order, items: items || [], profile };
}
