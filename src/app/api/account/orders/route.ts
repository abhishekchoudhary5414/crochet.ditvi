import { NextRequest, NextResponse } from 'next/server';
import { getUserFromAuthHeader } from '@/lib/authServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromAuthHeader(req);
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (ordersError) return NextResponse.json({ error: ordersError.message }, { status: 500 });

    const orderIds = (orders ?? []).map((order) => order.id).filter(Boolean);
    let paymentStatusMap: Record<string, string> = {};

    if (orderIds.length > 0) {
      const { data: payments, error: paymentError } = await supabaseAdmin
        .from('payments')
        .select('order_id, status, created_at')
        .in('order_id', orderIds)
        .order('created_at', { ascending: false });

      if (paymentError) return NextResponse.json({ error: paymentError.message }, { status: 500 });

      for (const payment of payments ?? []) {
        const orderId = String(payment.order_id ?? '');
        if (!orderId || paymentStatusMap[orderId]) continue;
        paymentStatusMap[orderId] = String(payment.status || 'pending');
      }
    }

    const enrichedOrders = (orders ?? []).map((order) => ({
      ...order,
      payment_status: paymentStatusMap[String(order.id)] || order.payment_status || 'pending',
      latest_payment_status: paymentStatusMap[String(order.id)] || order.payment_status || 'pending',
    }));

    return NextResponse.json({ orders: enrichedOrders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
