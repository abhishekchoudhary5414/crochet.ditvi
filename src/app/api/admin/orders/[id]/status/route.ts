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
    const { order_status } = await req.json();

    if (!order_status) return NextResponse.json({ error: 'order_status required' }, { status: 400 });

    const { data: order, error: updateErr } = await supabaseAdmin
      .from('orders')
      .update({ order_status })
      .eq('id', id)
      .select('*')
      .single();

    if (updateErr) throw updateErr;

    if (order_status === 'delivered') {
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
