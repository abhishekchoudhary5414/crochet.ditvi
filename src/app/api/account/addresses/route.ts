import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

async function getUserFromAuthHeader(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  const m = auth.match(/Bearer\s+(.+)/i);
  const token = m ? m[1] : null;
  if (!token) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromAuthHeader(req);
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const { data, error } = await supabaseAdmin.from('addresses').select('*').eq('user_id', user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ addresses: data });
  } catch (err: any) {
    console.error('addresses GET error', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromAuthHeader(req);
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const body = await req.json();
    const payload = {
      user_id: user.id,
      full_name: body.full_name,
      phone: body.phone,
      address_line_1: body.address_line_1,
      address_line_2: body.address_line_2 || null,
      landmark: body.landmark || null,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      country: body.country || 'India',
      address_type: body.address_type || 'Home',
      is_default: body.is_default || false,
    };

    const { data, error } = await supabaseAdmin.from('addresses').insert(payload).select('*').single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ address: data });
  } catch (err: any) {
    console.error('addresses POST error', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
