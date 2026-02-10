import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    if (!id && !slug) {
      return NextResponse.json({ ok: false, error: 'id or slug is required' }, { status: 400 });
    }

    const sb = supabaseServer();
    let query = sb
      .from('qrlife_cards')
      .select('id,slug,name,job_title,bio,active')
      .limit(1);

    if (id) query = query.eq('id', id);
    if (slug) query = query.eq('slug', slug);

    const { data: card, error } = await query.maybeSingle();
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    if (!card) return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 });

    const { data: links, error: linksErr } = await sb
      .from('qrlife_links')
      .select('id,kind,url,label,sort')
      .eq('card_id', card.id)
      .order('sort', { ascending: true });

    if (linksErr) return NextResponse.json({ ok: false, error: linksErr.message }, { status: 500 });

    return NextResponse.json({ ok: true, card, links: links ?? [] });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
