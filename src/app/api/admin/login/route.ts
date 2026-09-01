import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) return NextResponse.json({ error: 'username and password required' }, { status: 400 });

    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    if (!admin) return NextResponse.json({ error: 'invalid credentials' }, { status: 401 });

    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) return NextResponse.json({ error: 'invalid credentials' }, { status: 401 });

    const res = NextResponse.json({ ok: true, username: admin.username });
    res.cookies.set('ditvi_admin_session', String(admin.username), { path: '/', maxAge: 60 * 60 * 24, sameSite: 'lax' });
    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('admin login error', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
