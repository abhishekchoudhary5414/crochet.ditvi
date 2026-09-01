import { NextRequest, NextResponse } from 'next/server';
import { getUserFromAuthHeader } from '@/lib/authServer';
import { getOrderWithItems } from '@/lib/ordersServer';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromAuthHeader(req);
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const { order, items, profile } = await getOrderWithItems(id);

    if (!order) return NextResponse.json({ error: 'order not found' }, { status: 404 });
    if (order.user_id !== user.id) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

    return NextResponse.json({ order, items, profile });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
