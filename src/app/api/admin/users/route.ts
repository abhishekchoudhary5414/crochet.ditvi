import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const isPaidStatus = (value?: string | null) => {
  const status = (value ?? '').toLowerCase();
  return ['paid', 'success', 'successful', 'captured', 'completed', 'complete'].includes(status) || status.includes('paid') || status.includes('success') || status.includes('captured');
};

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return NextResponse.json({ error }, { status: 403 });

  try {
    const { data: usersData, error: usersErr } = await supabaseAdmin.auth.admin.listUsers();
    if (usersErr) throw usersErr;

    const { data: profiles, error: profErr } = await supabaseAdmin.from('profiles').select('*');
    if (profErr) throw profErr;

    type SupabaseUser = { id: string; email?: string | null; created_at?: string | null };
    type Profile = { user_id?: string | null; full_name?: string | null; first_name?: string | null; last_name?: string | null; phone?: string | null };

    const usersList = (usersData?.users ?? []) as SupabaseUser[];
    const profilesList = (profiles ?? []) as Profile[];
    const userIds = usersList.map((u) => u.id);

    let orderSummary: Record<string, { count: number; totalSpent: number; paidAmount: number; unpaidAmount: number; lastOrderDate: string | null; status: string }> = {};
    if (userIds.length > 0) {
      const { data: orders, error: ordersErr } = await supabaseAdmin
        .from('orders')
        .select('user_id, total_amount, order_status, payment_status, created_at')
        .in('user_id', userIds);

      if (ordersErr) throw ordersErr;
      for (const order of orders ?? []) {
        const userId = String(order.user_id ?? '');
        if (!userId) continue;
        const current = orderSummary[userId] ?? { count: 0, totalSpent: 0, paidAmount: 0, unpaidAmount: 0, lastOrderDate: null, status: 'new' };
        const total = Number(order.total_amount ?? 0);
        current.count += 1;
        current.totalSpent += total;

        if (order.created_at && (!current.lastOrderDate || new Date(order.created_at) > new Date(current.lastOrderDate))) {
          current.lastOrderDate = order.created_at;
        }

        if (isPaidStatus(order.payment_status)) {
          current.paidAmount += total;
        } else {
          current.unpaidAmount += total;
        }

        current.status = current.count > 0 ? 'active' : 'new';
        orderSummary[userId] = current;
      }
    }

    let paymentSummary: Record<string, { paidAmount: number; unpaidAmount: number }> = {};
    if (userIds.length > 0) {
      const { data: payments, error: paymentsErr } = await supabaseAdmin
        .from('payments')
        .select('user_id, amount, status')
        .in('user_id', userIds);

      if (paymentsErr) throw paymentsErr;
      for (const payment of payments ?? []) {
        const userId = String(payment.user_id ?? '');
        if (!userId) continue;
        const current = paymentSummary[userId] ?? { paidAmount: 0, unpaidAmount: 0 };
        const amount = Number(payment.amount ?? 0);
        if (isPaidStatus(payment.status)) {
          current.paidAmount += amount;
        } else {
          current.unpaidAmount += amount;
        }
        paymentSummary[userId] = current;
      }
    }

    const combined = usersList.map((u) => {
      const p = profilesList.find((pr) => pr.user_id === u.id);
      const summary = orderSummary[u.id] ?? { count: 0, totalSpent: 0, paidAmount: 0, unpaidAmount: 0, lastOrderDate: null, status: 'new' };
      const payment = paymentSummary[u.id] ?? { paidAmount: 0, unpaidAmount: 0 };

      return {
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        full_name: p?.full_name || `${p?.first_name || ''} ${p?.last_name || ''}`.trim(),
        phone: p?.phone,
        orders_count: summary.count,
        total_spent: summary.totalSpent,
        paid_amount: payment.paidAmount || summary.paidAmount,
        unpaid_amount: payment.unpaidAmount || summary.unpaidAmount,
        last_order_date: summary.lastOrderDate,
        status: summary.count > 0 ? 'active' : 'new',
      };
    });

    return NextResponse.json({ ok: true, users: combined });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
