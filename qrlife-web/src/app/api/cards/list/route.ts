import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  try {
    const sb = supabaseServer();
    const { data, error } = await sb
      .from('qrlife_cards')
      .select('id,slug,name,active,scans_count,last_scanned_at,created_at,updated_at')
      .order('updated_at', { ascending: false });

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true, cards: data ?? [] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message ?? e) }, { status: 500 });
  }
}
