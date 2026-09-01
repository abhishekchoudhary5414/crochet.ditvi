import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authServer';

export async function GET(req: NextRequest) {
  const { user, error } = await requireAdmin(req);
  if (error) return NextResponse.json({ error }, { status: 403 });
  return NextResponse.json({ ok: true, user });
}
