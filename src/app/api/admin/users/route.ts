import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return NextResponse.json({ error }, { status: 403 });

  try {
    const { data: usersData, error: usersErr } = await supabaseAdmin.auth.admin.listUsers();
    if (usersErr) throw usersErr;

    const { data: profiles, error: profErr } = await supabaseAdmin.from('profiles').select('*');
    if (profErr) throw profErr;

    type SupabaseUser = { id: string; email?: string | null; created_at?: string | null };
    type Profile = { user_id?: string | null; full_name?: string | null; first_name?: string | null; last_name?: string | null; phone?: string | null };

    const usersList = (usersData?.users ?? []) as SupabaseUser[];
    const profilesList = (profiles ?? []) as Profile[];

    const combined = usersList.map((u) => {
      const p = profilesList.find((pr) => pr.user_id === u.id);
      return {
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        full_name: p?.full_name || `${p?.first_name || ''} ${p?.last_name || ''}`.trim(),
        phone: p?.phone,
      };
    });

    return NextResponse.json({ ok: true, users: combined });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
