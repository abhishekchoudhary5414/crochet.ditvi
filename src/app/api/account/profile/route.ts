import { NextRequest, NextResponse } from 'next/server';
import { getUserFromAuthHeader } from '@/lib/authServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromAuthHeader(req);
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ profile: data || { user_id: user.id, email: user.email } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromAuthHeader(req);
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const body = await req.json();
    const payload = {
      user_id: user.id,
      first_name: body.first_name || null,
      last_name: body.last_name || null,
      full_name: body.full_name || `${body.first_name || ''} ${body.last_name || ''}`.trim() || null,
      email: body.email || user.email || null,
      phone: body.phone || null,
      profile_image: body.profile_image || null,
      metadata: body.metadata || {},
    };

    const { data: existing } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    let data;
    let error;

    if (existing) {
      ({ data, error } = await supabaseAdmin
        .from('profiles')
        .update(payload)
        .eq('user_id', user.id)
        .select('*')
        .single());
    } else {
      ({ data, error } = await supabaseAdmin.from('profiles').insert(payload).select('*').single());
    }

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ profile: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
