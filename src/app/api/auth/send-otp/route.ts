import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import crypto from 'crypto';
import { sendOtpEmail } from '@/lib/emailServer';
import fs from 'fs/promises';
import path from 'path';

const LOCAL_OTPS_FILE = path.join(process.cwd(), '.local_otps.json');

async function readLocalOtps() {
  try {
    const txt = await fs.readFile(LOCAL_OTPS_FILE, 'utf8');
    return JSON.parse(txt || '[]');
  } catch {
    return [];
  }
}

async function writeLocalOtps(rows: unknown[]) {
  try {
    await fs.writeFile(LOCAL_OTPS_FILE, JSON.stringify(rows, null, 2), 'utf8');
  } catch (e) {
    console.warn('writeLocalOtps failed', e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });

    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existing = existingUsers?.users?.find((user) => user.email?.toLowerCase() === String(email).toLowerCase());
    if (existing) {
      return NextResponse.json({ error: 'already registered' }, { status: 409 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHash('sha256').update(otp + salt).digest('hex');
    const otpHash = `${salt}:${hash}`;
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    try {
      await supabaseAdmin.from('email_otps').insert({
        email,
        otp_hash: otpHash,
        expires_at: expiresAt,
        attempt_count: 0,
        is_used: false,
      });
    } catch {
      const rows = await readLocalOtps();
      rows.push({
        id: crypto.randomUUID(),
        email,
        otp_hash: otpHash,
        expires_at: expiresAt,
        attempt_count: 0,
        is_used: false,
        created_at: new Date().toISOString(),
      });
      await writeLocalOtps(rows);
    }

    const res = await sendOtpEmail(email, otp);
    if (!res || res.ok === false) {
      console.error('sendOtpEmail failed', res);
      return NextResponse.json({ error: 'email-send-failed', details: res }, { status: 502 });
    }

    return NextResponse.json({ ok: true, via: res.via || 'emailjs' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('send-otp error', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
