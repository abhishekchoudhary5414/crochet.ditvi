import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
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

async function verifyOtpRecord(email: string, otp: string) {
  let row: Record<string, unknown> | null = null;

  try {
    const { data: rows } = await supabaseAdmin
      .from('email_otps')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1);
    row = rows?.[0] ?? null;
  } catch {
    const rows = await readLocalOtps();
    const filtered = rows
      .filter((r: { email: string }) => r.email === email)
      .sort(
        (a: { created_at: string }, b: { created_at: string }) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    row = filtered[0] ?? null;
  }

  if (!row) return { ok: false as const, error: 'no otp found', status: 400 };
  if (row.is_used) return { ok: false as const, error: 'otp already used', status: 400 };
  if (new Date(row.expires_at as string) < new Date()) return { ok: false as const, error: 'otp expired', status: 400 };
  if ((row.attempt_count as number || 0) >= 5) return { ok: false as const, error: 'too many attempts', status: 429 };

  const [salt, storedHash] = String(row.otp_hash || '').split(':');
  const hash = crypto.createHash('sha256').update(otp + salt).digest('hex');
  if (hash !== storedHash) {
    try {
      await supabaseAdmin
        .from('email_otps')
        .update({ attempt_count: (row.attempt_count as number || 0) + 1 })
        .eq('id', row.id);
    } catch {
      const rows = await readLocalOtps();
      const idx = rows.findIndex((r: { id: string }) => r.id === row!.id);
      if (idx !== -1) {
        rows[idx].attempt_count = (rows[idx].attempt_count || 0) + 1;
        await writeLocalOtps(rows);
      }
    }
    return { ok: false as const, error: 'invalid otp', status: 400 };
  }

  try {
    await supabaseAdmin.from('email_otps').update({ is_used: true }).eq('id', row.id);
  } catch {
    const rows = await readLocalOtps();
    const idx = rows.findIndex((r: { id: string }) => r.id === row!.id);
    if (idx !== -1) {
      rows[idx].is_used = true;
      await writeLocalOtps(rows);
    }
  }

  return { ok: true as const, row };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp, password, fullName, phone } = body as {
      email: string;
      otp: string;
      password?: string;
      fullName?: string;
      phone?: string;
    };

    if (!email || !otp) {
      return NextResponse.json({ error: 'email and otp required' }, { status: 400 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'password must be at least 8 characters' }, { status: 400 });
    }

    if (!fullName || fullName.trim().length < 2) {
      return NextResponse.json({ error: 'full name is required' }, { status: 400 });
    }

    if (!phone || phone.trim().length < 10) {
      return NextResponse.json({ error: 'valid phone number is required' }, { status: 400 });
    }

    const verification = await verifyOtpRecord(email, otp);
    if (!verification.ok) {
      return NextResponse.json({ error: verification.error }, { status: verification.status });
    }

    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existing = existingUsers?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (existing) {
      return NextResponse.json({ error: 'already registered' }, { status: 409 });
    }

    let userId: string;

    if (existing) {
      await supabaseAdmin.auth.admin.updateUserById(existing.id, {
        password,
        email_confirm: true,
      });
      userId = existing.id;
    } else {
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (createErr || !created.user) {
        return NextResponse.json({ error: createErr?.message || 'Failed to create account' }, { status: 500 });
      }

      userId = created.user.id;
    }

    await supabaseAdmin.from('profiles').upsert(
      {
        user_id: userId,
        email,
        full_name: fullName.trim(),
        first_name: fullName.trim().split(' ')[0] || null,
        last_name: fullName.trim().split(' ').slice(1).join(' ') || null,
        phone: phone.trim(),
      },
      { onConflict: 'user_id' }
    );

    try {
      const passwordHash = await bcrypt.hash(password, 12);
      await supabaseAdmin.from('users').upsert(
        {
          email: email.toLowerCase(),
          password_hash: passwordHash,
          is_verified: true,
          last_login: new Date().toISOString(),
        },
        { onConflict: 'email' }
      );
    } catch (e) {
      console.warn('failed to upsert into public.users', e);
    }

    return NextResponse.json({ ok: true, userId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('verify-otp error', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
