import { supabaseAdmin } from '@/lib/supabaseAdmin';

export function generateOrderNumber() {
  return `DC-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;
}

export function generateReceiptNumber() {
  return `RCP-${Date.now().toString(36).toUpperCase()}`;
}

function normalizePaymentStatus(value: unknown) {
  const status = String(value ?? '').trim().toLowerCase();

  if (['paid', 'success', 'successful', 'succeeded', 'captured', 'completed', 'confirmed', 'authorized'].includes(status)) {
    return 'paid';
  }

  if (['failed', 'failure', 'cancelled', 'canceled', 'rejected', 'expired'].includes(status)) {
    return status === 'cancelled' || status === 'canceled' ? 'cancelled' : 'failed';
  }

  if (['pending', 'created', 'initiated', 'processing', 'in_progress', 'in-progress'].includes(status)) {
    return 'pending';
  }

  return status || 'pending';
}

export async function getOrderWithItems(orderId: string) {
  const { data: order, error: orderErr } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();
  if (orderErr) throw orderErr;

  const { data: payment, error: paymentErr } = await supabaseAdmin
    .from('payments')
    .select('status')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (paymentErr && paymentErr.code !== 'PGRST116') throw paymentErr;

  if (payment?.status) {
    const normalized = normalizePaymentStatus(payment.status);
    order.payment_status = normalized;
    order.last_payment_status = normalized;
  } else if (!order.payment_status) {
    order.payment_status = 'pending';
    order.last_payment_status = 'pending';
  }

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
