import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get('q') || '').trim();
    const status = (url.searchParams.get('status') || '').trim();
    const provider = (url.searchParams.get('provider') || '').trim();
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'));
    const limit = Math.min(200, Math.max(1, Number(url.searchParams.get('limit') || '20')));

    let query = supabaseAdmin.from('payments').select(
      'id, order_id, user_id, provider, provider_order_id, provider_payment_id, amount, currency, status, payment_method, error_code, error_description, created_at, updated_at',
      { count: 'exact' }
    );

    if (q) {
      query = query.or(
        `order_id.ilike.%${q}%,provider_order_id.ilike.%${q}%,provider_payment_id.ilike.%${q}%,payment_method.ilike.%${q}%,provider.ilike.%${q}%`,
        { foreignTable: undefined }
      );
    }
    if (status) query = query.eq('status', status);
    if (provider) query = query.eq('provider', provider);

    const start = (page - 1) * limit;
    const end = start + limit - 1;
    const ordered = query.order('created_at', { ascending: false }).range(start, end);
    const { data, error, count } = await ordered;
    if (error) throw error;

    const payments = (data ?? []) as Array<Record<string, any>>;
    const userIds = [...new Set(payments.map((payment) => payment.user_id).filter(Boolean) as string[])];

    let customerMap: Record<string, { email?: string | null; phone?: string | null; full_name?: string | null }> = {};
    if (userIds.length > 0) {
      const profilesRes = await supabaseAdmin
        .from('profiles')
        .select('user_id, email, phone, full_name')
        .in('user_id', userIds);

      if (profilesRes.error) throw profilesRes.error;
      customerMap = Object.fromEntries(
        (profilesRes.data ?? []).map((profile: any) => [String(profile.user_id), {
          email: profile.email ?? null,
          phone: profile.phone ?? null,
          full_name: profile.full_name ?? null,
        }])
      );
    }

    const enrichedPayments = payments.map((payment) => ({
      ...payment,
      customer: payment.user_id ? customerMap[String(payment.user_id)] ?? null : null,
    }));

    return NextResponse.json({ payments: enrichedPayments, total: Number(count ?? 0) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('admin payments error', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
