import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get('q') || '').trim();
    const status = (url.searchParams.get('status') || '').trim();
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'));
    const limit = Math.min(200, Math.max(1, Number(url.searchParams.get('limit') || '20')));

    let query = supabaseAdmin.from('payments').select('id, order_id, provider_payment_id, amount, status, created_at', { count: 'exact' });
    if (q) query = query.or(`order_id.ilike.%${q}%,provider_payment_id.ilike.%${q}%`);
    if (status) query = query.eq('status', status);

    const start = (page - 1) * limit;
    const end = start + limit - 1;
    const ordered = query.order('created_at', { ascending: false }).range(start, end);
    const { data, error, count } = await ordered;
    if (error) throw error;
    return NextResponse.json({ payments: data ?? [], total: Number(count ?? 0) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('admin payments error', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
