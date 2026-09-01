import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error === 'unauthorized') return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (error === 'forbidden') return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  try {
    const { count: oCount } = await supabaseAdmin.from('orders').select('id', { head: true });
    const { count: uCount } = await supabaseAdmin.from('profiles').select('id', { head: true });
    const paymentsRes = await supabaseAdmin.from('payments').select('amount');
    const paymentsList = paymentsRes.data ?? [];
    const revenue = (paymentsList as { amount?: number | string }[]).reduce((acc, p) => acc + Number(p.amount || 0), 0);

    return NextResponse.json({ orders: oCount ?? 0, users: uCount ?? 0, revenue });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('admin stats error', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
