import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const isPaidStatus = (value?: string | null) => {
  const status = (value ?? '').toLowerCase();
  return ['paid', 'success', 'successful', 'captured', 'completed', 'complete'].includes(status) || status.includes('paid') || status.includes('success') || status.includes('captured');
};

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error === 'unauthorized') return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (error === 'forbidden') return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  try {
    const [{ count: oCount }, { count: uCount }] = await Promise.all([
      supabaseAdmin.from('orders').select('id', { head: true }),
      supabaseAdmin.from('profiles').select('id', { head: true }),
    ]);

    const { data: paymentRows, error: paidError } = await supabaseAdmin
      .from('payments')
      .select('amount, status');

    if (paidError) throw paidError;

    const paidPayments = (paymentRows ?? []).filter((payment) => isPaidStatus(payment.status));
    const successfulPayments = paidPayments.length;
    const revenue = paidPayments.reduce((total, payment) => total + Number(payment.amount ?? 0), 0);

    return NextResponse.json({
      orders: oCount ?? 0,
      users: uCount ?? 0,
      successfulPayments,
      revenue,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('admin stats error', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
