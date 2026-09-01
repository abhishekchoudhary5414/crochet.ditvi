import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: NextRequest) {
  const { error, user } = await requireAdmin(req);
  if (error === 'unauthorized') return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (error === 'forbidden') return NextResponse.json({ error: 'forbidden' }, { status: 403 });


  try {
    const { data: orders, error: ordersErr } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersErr) throw ordersErr;

    type Order = { id: string; user_id?: string | null } & Record<string, unknown>;
    type Profile = { user_id?: string | null; full_name?: string | null; first_name?: string | null; last_name?: string | null; email?: string | null; phone?: string | null };

    const ordersList = (orders ?? []) as Order[];
    const userIds = [...new Set(ordersList.map((o) => o.user_id).filter(Boolean) as string[])];
    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('user_id, full_name, first_name, last_name, email, phone')
      .in('user_id', userIds);

    const profilesList = (profiles ?? []) as Profile[];
    const profileMap: Record<string, Profile> = Object.fromEntries(profilesList.map((p) => [String(p.user_id), p]));

    const enriched = ordersList.map((o) => ({
      ...o,
      customer: profileMap[String(o.user_id)] || null,
    }));

    return NextResponse.json({ orders: enriched, admin: user?.email });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
