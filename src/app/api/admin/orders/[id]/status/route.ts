import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrderWithItems } from '@/lib/ordersServer';
import { sendOrderDeliveredEmail } from '@/lib/emailServer';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await requireAdmin(req);
    if (error === 'unauthorized') return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    if (error === 'forbidden') return NextResponse.json({ error: 'forbidden' }, { status: 403 });

    const { id } = await params;
    const body = await req.json();
    const { order_status, payment_status } = body ?? {};

    const nextOrderStatus = order_status ? String(order_status).trim() : undefined;
    const nextPaymentStatus = payment_status ? String(payment_status).trim().toLowerCase() : undefined;

    const updates: Record<string, string> = {};
    if (nextOrderStatus) updates.order_status = nextOrderStatus;
    if (nextPaymentStatus) updates.payment_status = nextPaymentStatus;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'order_status or payment_status required' }, { status: 400 });
    }

    const { data: order, error: updateErr } = await supabaseAdmin
      .from('orders')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (updateErr) throw updateErr;

    if (nextPaymentStatus) {
      const { error: paymentErr } = await supabaseAdmin
        .from('payments')
        .update({ status: nextPaymentStatus, updated_at: new Date().toISOString() })
        .eq('order_id', id);

      if (paymentErr) throw paymentErr;
    }

    if (nextOrderStatus === 'delivered') {
      const { order: fullOrder, profile } = await getOrderWithItems(id);
      const email = profile?.email || (fullOrder.metadata as { shipping_address?: { email?: string } })?.shipping_address?.email;
      const name = profile?.full_name || profile?.first_name || 'Customer';

      if (email) {
        await sendOrderDeliveredEmail({
          to: email,
          customerName: name,
          orderNumber: fullOrder.order_number,
        });
      }
    }

    return NextResponse.json({ order });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
