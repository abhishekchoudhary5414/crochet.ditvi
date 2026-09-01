import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

async function getUserIdFromAuthHeader(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  try {
    if (supabaseAdmin && (supabaseAdmin as any).auth && (supabaseAdmin as any).auth.getUser) {
      const r = await (supabaseAdmin as any).auth.getUser(token);
      return r?.data?.user?.id || null;
    }
  } catch (e) {
    console.warn('getUserIdFromAuthHeader failed', e);
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromAuthHeader(req);
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { data, error } = await (supabaseAdmin as any).from('wishlists').select('*').eq('user_id', userId);
    if (error) throw error;
    return NextResponse.json({ items: data || [] });
  } catch (err: any) {
    console.error('wishlist GET error', err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromAuthHeader(req);
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });

    const { data, error } = await (supabaseAdmin as any).from('wishlists').insert({ user_id: userId, product_id: productId }).select().limit(1);
    if (error) throw error;
    return NextResponse.json({ item: data?.[0] || null });
  } catch (err: any) {
    console.error('wishlist POST error', err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getUserIdFromAuthHeader(req);
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });

    const { data, error } = await (supabaseAdmin as any).from('wishlists').delete().eq('user_id', userId).eq('product_id', productId);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('wishlist DELETE error', err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
