import { NextRequest, NextResponse } from 'next/server';
import { getUserFromAuthHeader } from '@/lib/authServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromAuthHeader(req);
    const body = await req.json();
    const { orderId, reason } = body || {};

    if (!orderId) {
      return NextResponse.json({ error: 'orderId required' }, { status: 400 });
    }

    const { data: existingOrder, error: existingErr } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (existingErr && existingErr.code !== 'PGRST116') {
      throw existingErr;
    }

    if (!existingOrder) {
      return NextResponse.json({ error: 'order not found' }, { status: 404 });
    }

    if (user && existingOrder.user_id !== user.id) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    const { data: updatedOrder, error: updateErr } = await supabaseAdmin
      .from('orders')
      .update({
        order_status: existingOrder.order_status || 'pending',
        payment_status: 'canceled',
        metadata: {
          ...(existingOrder.metadata || {}),
          cancellation_reason: reason || 'Payment cancelled by user',
          payment_cancelled_at: new Date().toISOString(),
        },
      })
      .eq('id', orderId)
      .select('*')
      .single();

    if (updateErr) throw updateErr;

    await supabaseAdmin.from('payments').upsert(
      {
        order_id: orderId,
        user_id: existingOrder.user_id,
        provider: 'razorpay',
        amount: Number(existingOrder.total_amount || 0),
        currency: existingOrder.currency || 'INR',
        status: 'canceled',
        error_description: reason || 'Payment cancelled by user',
        metadata: {
          order_status: existingOrder.order_status || 'pending',
          cancelled_at: new Date().toISOString(),
        },
      },
      { onConflict: 'order_id' }
    );

    return NextResponse.json({ ok: true, order: updatedOrder });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('cancel payment error', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
