import { makeSlugCode } from '@/lib/slug';
import { supabaseBrowser } from '@/lib/supabase/client';

export type SocialKind =
  | 'facebook'
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'x'
  | 'linkedin'
  | 'website'
  | 'custom';

export type CloudCard = {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  job_title?: string | null;
  bio?: string | null;
  active: boolean;
  scans_count: number;
  last_scanned_at?: string | null;
  created_at: string;
  updated_at: string;
};

export async function requireUserId(): Promise<string> {
  const sb = supabaseBrowser();
  const { data, error } = await sb.auth.getUser();
  if (error || !data.user) throw new Error('Not signed in');
  return data.user.id;
}

export async function listMyCards() {
  const sb = supabaseBrowser();
  const userId = await requireUserId();
  const { data, error } = await sb
    .from('qrlife_cards')
    .select('id,user_id,slug,name,job_title,bio,active,scans_count,last_scanned_at,created_at,updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as CloudCard[];
}

export async function getMyCard(cardId: string) {
  const sb = supabaseBrowser();
  const userId = await requireUserId();
  const { data, error } = await sb
    .from('qrlife_cards')
    .select('id,user_id,slug,name,job_title,bio,active,scans_count,last_scanned_at,created_at,updated_at')
    .eq('id', cardId)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return (data as CloudCard | null) ?? null;
}

export async function getMyCardLinks(cardId: string) {
  const sb = supabaseBrowser();
  const { data, error } = await sb
    .from('qrlife_links')
    .select('id,card_id,kind,url,label,sort')
    .eq('card_id', cardId)
    .order('sort', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Array<{ id: string; card_id: string; kind: SocialKind; url: string; label?: string | null; sort: number }>;
}

export async function createMyCard(input: {
  name: string;
  jobTitle?: string;
  bio?: string;
  active: boolean;
  links: Array<{ kind: SocialKind; url: string; label?: string }>;
}) {
  const sb = supabaseBrowser();
  const userId = await requireUserId();

  let slug = makeSlugCode(6);
  for (let i = 0; i < 10; i += 1) {
    const { data } = await sb.from('qrlife_cards').select('id').eq('slug', slug).maybeSingle();
    if (!data) break;
    slug = makeSlugCode(6);
  }

  const { data: card, error } = await sb
    .from('qrlife_cards')
    .insert({
      user_id: userId,
      slug,
      name: input.name,
      job_title: input.jobTitle ?? null,
      bio: input.bio ?? null,
      active: input.active,
    })
    .select('*')
    .single();
  if (error) throw error;

  if (input.links.length) {
    const rows = input.links.map((l, idx) => ({
      card_id: card.id,
      kind: l.kind,
      url: l.url,
      label: l.label ?? null,
      sort: idx,
    }));
    const { error: linkError } = await sb.from('qrlife_links').insert(rows);
    if (linkError) throw linkError;
  }

  return card as CloudCard;
}

export async function updateMyCard(
  cardId: string,
  input: { name: string; jobTitle?: string; bio?: string; active: boolean; links: Array<{ kind: SocialKind; url: string; label?: string }> }
) {
  const sb = supabaseBrowser();
  const userId = await requireUserId();

  const { data: card, error } = await sb
    .from('qrlife_cards')
    .update({
      name: input.name,
      job_title: input.jobTitle ?? null,
      bio: input.bio ?? null,
      active: input.active,
    })
    .eq('id', cardId)
    .eq('user_id', userId)
    .select('*')
    .single();
  if (error) throw error;

  const { error: delErr } = await sb.from('qrlife_links').delete().eq('card_id', cardId);
  if (delErr) throw delErr;

  if (input.links.length) {
    const rows = input.links.map((l, idx) => ({
      card_id: cardId,
      kind: l.kind,
      url: l.url,
      label: l.label ?? null,
      sort: idx,
    }));
    const { error: linkErr } = await sb.from('qrlife_links').insert(rows);
    if (linkErr) throw linkErr;
  }

  return card as CloudCard;
}
