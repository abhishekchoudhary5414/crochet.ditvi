import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: NextRequest) {
  const { error, user } = await requireAdmin(req);
  if (error === 'unauthorized') return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (error === 'forbidden') return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get('q') || '').trim();
    const status = (url.searchParams.get('status') || '').trim();
    const payment = (url.searchParams.get('payment') || '').trim();
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'));
    const limit = Math.min(200, Math.max(1, Number(url.searchParams.get('limit') || '20')));

    // If payment filter is provided, fetch matching payment order ids first
    let paymentOrderIds: string[] | null = null;
    if (payment) {
      const payRes = await supabaseAdmin.from('payments').select('order_id').eq('status', payment);
      if (payRes.error) throw payRes.error;
      paymentOrderIds = (payRes.data || []).map((p: any) => String(p.order_id));
      if (paymentOrderIds.length === 0) {
        return NextResponse.json({ orders: [], total: 0, admin: user?.email });
      }
    }

    // Build base query with exact count
    let query = supabaseAdmin.from('orders').select('*', { count: 'exact' });
    if (q) {
      // search by order_number or id
      query = query.or(`order_number.ilike.%${q}%,id.eq.${q}`);
    }
    if (status) query = query.eq('order_status', status);
    if (paymentOrderIds) query = query.in('id', paymentOrderIds);

    // Order and paginate
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    const ordered = query.order('created_at', { ascending: false }).range(start, end);
    const { data: orders, error: ordersErr, count } = await ordered;
    if (ordersErr) throw ordersErr;

    type Order = { id: string; user_id?: string | null } & Record<string, unknown>;
    type Profile = { user_id?: string | null; full_name?: string | null; first_name?: string | null; last_name?: string | null; email?: string | null; phone?: string | null };

    const ordersList = (orders ?? []) as Order[];
    const userIds = [...new Set(ordersList.map((o) => o.user_id).filter(Boolean) as string[])];
    const profilesRes = await supabaseAdmin
      .from('profiles')
      .select('user_id, full_name, first_name, last_name, email, phone')
      .in('user_id', userIds);
    if (profilesRes.error) throw profilesRes.error;
    const profilesList = (profilesRes.data ?? []) as Profile[];
    const profileMap: Record<string, Profile> = Object.fromEntries(profilesList.map((p) => [String(p.user_id), p]));

      // Fetch addresses for orders if present
      const addressIds = [...new Set(ordersList.map((o) => (o as any).address_id).filter(Boolean) as string[])];
      let addressMap: Record<string, any> = {};
      if (addressIds.length > 0) {
        const addrRes = await supabaseAdmin
          .from('addresses')
          .select('id, full_name, phone, address_line_1, address_line_2, city, state, pincode')
          .in('id', addressIds);
        if (addrRes.error) throw addrRes.error;
        const addrList = addrRes.data ?? [];
        addressMap = Object.fromEntries(addrList.map((a: any) => [String(a.id), a]));
      }

    const enriched = ordersList.map((o) => ({
      ...o,
      customer: profileMap[String(o.user_id)] || null,
        address: addressMap[String((o as any).address_id)] || null,
      }));

    // Fetch latest payment status per order for displayed orders
    const orderIds = ordersList.map((o) => String(o.id));
    let paymentMap: Record<string, string> = {};
    if (orderIds.length > 0) {
      const payRes = await supabaseAdmin
        .from('payments')
        .select('order_id, status, created_at')
        .in('order_id', orderIds)
        .order('created_at', { ascending: false });
      if (payRes.error) throw payRes.error;
      const pays = payRes.data ?? [];
      // pick the latest status per order
      for (const p of pays) {
        const oid = String(p.order_id);
        if (!paymentMap[oid]) paymentMap[oid] = p.status || '';
      }
    }

    const withPayments = enriched.map((o) => ({
      ...o,
      last_payment_status: paymentMap[String(o.id)] || String((o as any).payment_status || 'unpaid'),
      paid: String((paymentMap[String(o.id)] || (o as any).payment_status || '')).toLowerCase() === 'paid',
    }));

    return NextResponse.json({ orders: withPayments, total: Number(count ?? 0), admin: user?.email });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
