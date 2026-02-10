import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const sb = supabaseServer();
    const { searchParams } = new URL(req.url);

    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (!id && !slug) {
      return NextResponse.json(
        { error: 'id or slug is required' },
        { status: 400 }
      );
    }

    let query = sb
      .from('qrlife_cards')
      .select('id,slug,name,job_title,bio,active');

    if (id) query = query.eq('id', id);
    if (slug) query = query.eq('slug', slug);

    const { data: card, error } = await query.maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!card) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ card });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
