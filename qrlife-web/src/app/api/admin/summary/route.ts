import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

function getAdminAllowlist() {
  const raw = process.env.ADMIN_EMAILS || '';
  return raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function GET(req: Request) {
  try {
    const auth = req.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) return NextResponse.json({ ok: false, error: 'Missing bearer token' }, { status: 401 });

    const sb = supabaseServer();

    const { data: userData, error: userErr } = await sb.auth.getUser(token);
    if (userErr || !userData.user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const email = (userData.user.email || '').toLowerCase();
    const admins = getAdminAllowlist();
    const isAdmin = admins.includes(email);
    if (!isAdmin) {
      return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
    }

    const [{ count: cardCount }, { count: scanCount }, usersResp] = await Promise.all([
      sb.from('qrlife_cards').select('*', { count: 'exact', head: true }),
      sb.from('qrlife_scans').select('*', { count: 'exact', head: true }),
      sb.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    ]);

    const userCount = usersResp?.data?.users?.length ?? 0;

    const { data: recentCards } = await sb
      .from('qrlife_cards')
      .select('id,user_id,slug,name,active,scans_count,created_at,updated_at')
      .order('updated_at', { ascending: false })
      .limit(25);

    const userIds = Array.from(new Set((recentCards ?? []).map((c) => c.user_id).filter(Boolean)));
    let userEmailMap: Record<string, string> = {};

    if (userIds.length > 0) {
      userEmailMap = Object.fromEntries(
        (usersResp?.data?.users ?? [])
          .filter((u) => userIds.includes(u.id))
          .map((u) => [u.id, u.email || ''])
      );
    }

    return NextResponse.json({
      ok: true,
      stats: {
        users: userCount ?? 0,
        cards: cardCount ?? 0,
        scans: scanCount ?? 0,
      },
      recentCards: (recentCards ?? []).map((c) => ({
        ...c,
        owner_email: userEmailMap[c.user_id] ?? null,
      })),
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
