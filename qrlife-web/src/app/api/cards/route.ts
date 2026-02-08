/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase/server';
import { makeSlug } from '@/lib/slug';

const BodySchema = z.object({
  name: z.string().min(1).max(120),
  jobTitle: z.string().max(120).optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
  active: z.boolean().default(true),
  links: z
    .array(
      z.object({
        kind: z.string().min(1).max(24),
        url: z.string().url().max(500),
        label: z.string().max(120).optional().nullable(),
      })
    )
    .default([]),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = BodySchema.parse(json);

    const sb = supabaseServer();

    // Generate a unique slug (best-effort loop)
    let slug = makeSlug(body.name);
    for (let attempt = 0; attempt < 5; attempt++) {
      const { data: existing } = await sb
        .from('qrlife_cards')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (!existing) break;
      slug = makeSlug(body.name);
    }

    const { data: card, error: cardErr } = await sb
      .from('qrlife_cards')
      .insert({
        slug,
        name: body.name,
        job_title: body.jobTitle ?? null,
        bio: body.bio ?? null,
        active: body.active,
      })
      .select('*')
      .single();

    if (cardErr) {
      return NextResponse.json({ ok: false, error: cardErr.message }, { status: 500 });
    }

    if (body.links.length) {
      const rows = body.links.map((l, idx) => ({
        card_id: card.id,
        kind: l.kind,
        url: l.url,
        label: l.label ?? null,
        sort: idx,
      }));
      const { error: linkErr } = await sb.from('qrlife_links').insert(rows);
      if (linkErr) {
        // Leave card created; return warning.
        return NextResponse.json({ ok: true, card, warning: linkErr.message });
      }
    }

    return NextResponse.json({ ok: true, card });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message ?? e) }, { status: 400 });
  }
}
