import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function getUserFromAuthHeader(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  const m = auth.match(/Bearer\s+(.+)/i);
  const token = m ? m[1] : null;
  if (!token) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

export async function getAdminFromCookie(req: NextRequest) {
  const username = req.cookies.get('ditvi_admin_session')?.value;
  if (!username) return null;

  const { data, error } = await supabaseAdmin
    .from('admins')
    .select('*')
    .eq('username', username)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

export async function isAdminEmail(email: string | undefined | null) {
  if (!email) return false;
  const lower = email.trim().toLowerCase();
  const admins = (process.env.ADMIN_EMAILS || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (admins.includes(lower)) return true;

  const { data: userRow } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('email', lower)
    .maybeSingle();

  if (userRow?.role === 'admin') return true;

  const { data: profileRow } = await supabaseAdmin
    .from('profiles')
    .select('metadata')
    .eq('email', lower)
    .maybeSingle();

  return Boolean(profileRow?.metadata?.is_admin || profileRow?.metadata?.role === 'admin');
}

export async function requireAdmin(req: NextRequest) {
  const user = await getUserFromAuthHeader(req);
  if (user) {
    const isAdmin = await isAdminEmail(user.email);
    if (!isAdmin) return { user: null, error: 'forbidden' as const };
    return { user, error: null };
  }

  const admin = await getAdminFromCookie(req);
  if (!admin) return { user: null, error: 'unauthorized' as const };

  return { user: { id: admin.id, email: admin.email || `${admin.username}@local.admin`, username: admin.username }, error: null };
}
