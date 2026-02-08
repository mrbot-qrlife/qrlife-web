import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';

function iconLabel(kind: string) {
  return kind;
}

export default async function PublicCardBySlugPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  const sb = supabaseServer();

  const { data: card, error } = await sb
    .from('qrlife_cards')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    return (
      <div className="min-h-dvh px-5 py-10 max-w-xl mx-auto">
        <Link href="/" className="text-white/80 hover:text-white font-semibold">QRLife</Link>
        <div className="mt-6 qrlife-card rounded-2xl p-4 text-white/75">
          Error loading card: {error.message}
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-dvh px-5 py-10 max-w-xl mx-auto">
        <Link href="/" className="text-white/80 hover:text-white font-semibold">QRLife</Link>
        <div className="mt-6 qrlife-card rounded-2xl p-4 text-white/75">Card not found.</div>
      </div>
    );
  }

  const { data: links } = await sb
    .from('qrlife_links')
    .select('*')
    .eq('card_id', card.id)
    .order('sort', { ascending: true });

  // Record scan (server-side) best-effort.
  // For MVP: count every page load as a scan.
  await sb.from('qrlife_scans').insert({ card_id: card.id, referrer: '' }).then(() => null);

  return (
    <div className="min-h-dvh px-5 py-10 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-white/80 hover:text-white font-semibold">QRLife</Link>
        <Link href="/app/" className="rounded-xl px-3 py-2 bg-white/10 hover:bg-white/15 text-sm">Open App</Link>
      </div>

      <div className="mt-6 qrlife-card rounded-3xl overflow-hidden">
        <div className="px-5 py-5 bg-gradient-to-br from-[color:var(--qrlife-purple)]/90 via-[color:var(--qrlife-bg1)]/60 to-[color:var(--qrlife-teal)]/35">
          <div className="text-white/70 text-xs">QRLife Card</div>
          <div className="text-2xl font-extrabold tracking-tight">{card.name}</div>
          {card.job_title && <div className="text-white/85 mt-1">{card.job_title}</div>}
        </div>

        <div className="p-5 space-y-4">
          {!card.active ? (
            <div className="rounded-2xl bg-amber-300/10 border border-amber-200/20 p-4 text-amber-100/90">
              This QR Card is currently inactive.
            </div>
          ) : (
            <>
              {card.bio && (
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-white/85 leading-relaxed">
                  {card.bio}
                </div>
              )}

              <div className="space-y-2">
                {links?.length ? (
                  links.map((l: any) => (
                    <a
                      key={l.id}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group block rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-4"
                    >
                      <div className="text-xs text-white/60 capitalize">{iconLabel(l.kind)}</div>
                      <div className="font-semibold break-all group-hover:underline">{l.label ?? l.url}</div>
                    </a>
                  ))
                ) : (
                  <div className="text-white/60 text-sm">No links added yet.</div>
                )}
              </div>

              <div className="pt-1 flex items-center justify-between text-xs text-white/50">
                <div>
                  Scans: <span className="text-white/80">{card.scans_count ?? 0}</span>
                </div>
                <div className="text-white/40">@{card.slug}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
