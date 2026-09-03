import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await requireAdmin(req);
    if (error === 'unauthorized') return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    if (error === 'forbidden') return NextResponse.json({ error: 'forbidden' }, { status: 403 });

    const { id } = await params;
    const { payment_status } = await req.json();

    if (!payment_status) return NextResponse.json({ error: 'payment_status required' }, { status: 400 });

    const normalized = String(payment_status).trim().toLowerCase();
    const allowed = ['paid', 'pending', 'failed', 'cancelled'];
    if (!allowed.includes(normalized)) {
      return NextResponse.json({ error: 'invalid payment_status' }, { status: 400 });
    }

    const { data: payment, error: paymentErr } = await supabaseAdmin
      .from('payments')
      .update({ status: normalized, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (paymentErr) throw paymentErr;

    if (payment?.order_id) {
      const { data: currentOrder, error: currentOrderErr } = await supabaseAdmin
        .from('orders')
        .select('order_status')
        .eq('id', payment.order_id)
        .single();

      if (currentOrderErr && currentOrderErr.code !== 'PGRST116') throw currentOrderErr;

      await supabaseAdmin
        .from('orders')
        .update({
          payment_status: normalized,
          order_status: currentOrder?.order_status || 'pending',
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.order_id);
    }

    return NextResponse.json({ payment });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
