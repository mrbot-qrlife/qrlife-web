import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { decodeUrlForwardMeta, isValidAbsoluteHttpUrl } from '@/lib/qrCreate';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const sb = supabaseServer();

  const { data: card, error } = await sb
    .from('qrlife_cards')
    .select('id,slug,bio,active')
    .eq('slug', params.slug)
    .maybeSingle();

  const origin = new URL(req.url).origin;

  if (error || !card) {
    return NextResponse.redirect(new URL('/404', origin));
  }

  if (!card.active) {
    return NextResponse.redirect(new URL(`/c/${params.slug}`, origin));
  }

  let destination = decodeUrlForwardMeta(card.bio)?.destinationUrl;

  if (!destination) {
    const { data: links } = await sb
      .from('qrlife_links')
      .select('url,kind,sort')
      .eq('card_id', card.id)
      .order('sort', { ascending: true })
      .limit(1);

    destination = links?.[0]?.url;
  }

  if (!destination || !isValidAbsoluteHttpUrl(destination)) {
    return NextResponse.redirect(new URL(`/c/${params.slug}`, origin));
  }

  try {
    const hostname = new URL(destination).hostname;
    console.info('[analytics] redirect_fired', { qr_type: 'url_forward', destination_hostname: hostname, slug: params.slug });
  } catch {
    // ignore
  }

  await sb.from('qrlife_scans').insert({ card_id: card.id, referrer: 'url_forward' }).then(() => null);

  return NextResponse.redirect(destination, 302);
}
