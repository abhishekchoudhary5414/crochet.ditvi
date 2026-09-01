import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { token, email, newPassword } = await req.json();
    if (!token || !email || !newPassword) return NextResponse.json({ error: 'missing fields' }, { status: 400 });

    // Find latest reset row for this email
    // lookup user_id from profiles
    const lookup = await supabaseAdmin.from('profiles').select('user_id').eq('email', email).limit(1).maybeSingle();
    const userId = lookup?.data?.user_id;
    if (!userId) return NextResponse.json({ error: 'user not found' }, { status: 404 });

    const { data: rows, error: fetchErr } = await supabaseAdmin.from('password_resets').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1);
    if (fetchErr) throw fetchErr;
    const row = rows && rows[0];
    if (!row) return NextResponse.json({ error: 'reset token not found' }, { status: 400 });
    if (row.is_used) return NextResponse.json({ error: 'token already used' }, { status: 400 });
    if (new Date(row.expires_at) < new Date()) return NextResponse.json({ error: 'token expired' }, { status: 400 });

    // verify token
    const [salt, storedHash] = (row.token_hash || '').split(':');
    const hash = crypto.createHash('sha256').update(token + salt).digest('hex');
    if (hash !== storedHash) return NextResponse.json({ error: 'invalid token' }, { status: 400 });

    // mark used
    await supabaseAdmin.from('password_resets').update({ is_used: true }).eq('id', row.id);

    // Attempt to update the user's password via Supabase Admin API.
    // This requires a properly configured `supabaseAdmin` (service role key) and the real `@supabase/supabase-js`.
    try {
      if ((supabaseAdmin as any).auth && (supabaseAdmin as any).auth.admin && (supabaseAdmin as any).auth.admin.updateUserById) {
        // we already resolved `userId` above (profiles.user_id -> auth.users.id)
        await (supabaseAdmin as any).auth.admin.updateUserById(userId, { password: newPassword });
        return NextResponse.json({ ok: true });
      }
    } catch (e) {
      console.warn('supabase admin update attempt failed', e);
    }

    return NextResponse.json({ ok: false, message: 'Reset-password not implemented: server lacks Supabase admin support. Ensure @supabase/supabase-js is installed and SUPABASE_SERVICE_ROLE_KEY is set.' }, { status: 501 });
  } catch (err: any) {
    console.error('reset-password error', err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
