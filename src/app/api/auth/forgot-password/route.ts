import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import crypto from 'crypto';
import { sendResetEmail } from '@/lib/emailServer';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });

    const token = crypto.randomBytes(32).toString('hex');
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHash('sha256').update(token + salt).digest('hex');
    const tokenHash = `${salt}:${hash}`;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    // find profile by email to get user_id
    let userId: string | null = null;
    try {
      const lookup = await supabaseAdmin.from('profiles').select('user_id').eq('email', email).limit(1).maybeSingle();
      userId = lookup?.data?.user_id || null;
    } catch (e) {
      console.warn('profiles lookup failed', e);
    }

    // store reset record referencing user_id (if available) — schema expects user_id
    await supabaseAdmin.from('password_resets').insert({ user_id: userId, token_hash: tokenHash, expires_at: expiresAt, is_used: false, created_at: new Date().toISOString() });

    const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    await sendResetEmail(email, resetLink);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('forgot-password error', err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
