'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from 'next/link';
import { BottomNav } from "@/components/BottomNav";
import { SocialIcon } from '@/components/SocialIcon';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { makeId, upsertCard, type SocialKind } from '@/lib/storage';

async function createCardInSupabase(input: {
  name: string;
  jobTitle?: string;
  bio?: string;
  active: boolean;
  links: Array<{ kind: SocialKind; url: string }>;
}) {
  const res = await fetch('/api/cards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: input.name,
      jobTitle: input.jobTitle,
      bio: input.bio,
      active: input.active,
      links: input.links,
    }),
  });
  const json = await res.json();
  if (!res.ok || !json?.ok) throw new Error(json?.error ?? 'Failed to create card');
  return json.card as { id: string; slug: string };
}


const kinds: Array<{ kind: SocialKind; label: string; placeholder: string }> = [
  { kind: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
  { kind: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/you' },
  { kind: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@you' },
  { kind: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@you' },
  { kind: 'x', label: 'X', placeholder: 'https://x.com/you' },
  { kind: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/you' },
  { kind: 'website', label: 'Website', placeholder: 'https://example.com' },
];

export default function NewCard() {
  const router = useRouter();
  const id = useMemo(() => makeId(), []);

  const DRAFT_KEY = 'qrlife.newcard.draft.v1';

  const [active, setActive] = useState(true);
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [bio, setBio] = useState('');
  const [links, setLinks] = useState<Array<{ kind: SocialKind; url: string }>>([]);
  const [newKind, setNewKind] = useState<SocialKind>('facebook');
  const [kindOpen, setKindOpen] = useState(false);
  const [kindOpenUp, setKindOpenUp] = useState(false);
  const kindBtnRef = useRef<HTMLButtonElement | null>(null);
  const [newUrl, setNewUrl] = useState('');

  // Draft persistence: prevents losing fields if the page refreshes or remounts.
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (typeof d.active === 'boolean') setActive(d.active);
      if (typeof d.name === 'string') setName(d.name);
      if (typeof d.jobTitle === 'string') setJobTitle(d.jobTitle);
      if (typeof d.bio === 'string') setBio(d.bio);
      if (Array.isArray(d.links)) setLinks(d.links);
      if (typeof d.newKind === 'string') setNewKind(d.newKind as SocialKind);
      if (typeof d.newUrl === 'string') setNewUrl(d.newUrl);
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ active, name, jobTitle, bio, links, newKind, newUrl })
      );
    } catch {
      // ignore
    }
  }, [active, name, jobTitle, bio, links, newKind, newUrl]);

  function normalizeLinkInput(kind: SocialKind, raw: string) {
    let v = raw.trim();
    if (!v) return '';

    // Accept bare handles like @mrchris or mrchris
    if (v.startsWith('@')) v = v.slice(1);

    // If it already looks like a URL, keep it (but add https:// if missing).
    const hasScheme = /^https?:\/\//i.test(v);
    const looksLikeDomain = /\./.test(v) || v.includes('/');
    if (hasScheme) return v;

    // If user pasted a domain/path without scheme, assume https.
    if (looksLikeDomain && kind !== 'tiktok' && kind !== 'x' && kind !== 'instagram' && kind !== 'youtube' && kind !== 'facebook' && kind !== 'linkedin') {
      return `https://${v}`;
    }

    // Kind-based handle expansion
    switch (kind) {
      case 'instagram':
        return `https://instagram.com/${v}`;
      case 'x':
        return `https://x.com/${v}`;
      case 'tiktok':
        return `https://tiktok.com/@${v}`;
      case 'youtube':
        // Accept @handle or channel URL fragment
        return `https://youtube.com/@${v}`;
      case 'facebook':
        return `https://facebook.com/${v}`;
      case 'linkedin':
        // default to personal profile
        return v.startsWith('company/') || v.startsWith('in/')
          ? `https://linkedin.com/${v}`
          : `https://linkedin.com/in/${v}`;
      case 'website':
        return `https://${v}`;
      default:
        return looksLikeDomain ? `https://${v}` : v;
    }
  }

  function previewUrl() {
    const url = normalizeLinkInput(newKind, newUrl);
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function addLink() {
    const url = normalizeLinkInput(newKind, newUrl);
    if (!url) return;

    // Allow multiple links per network, but prevent exact duplicates.
    const dup = links.some((l) => l.kind === newKind && l.url === url);
    if (dup) {
      alert('That link is already added.');
      return;
    }

    setLinks((prev) => [...prev, { kind: newKind, url }]);

    // Keep the input text so you can tweak it (e.g., add a second FB page).
    // If you want it to clear instead later, we can add a toggle.
  }

  async function save() {
    if (!name.trim()) {
      alert('QR Card Name is required');
      return;
    }

    const trimmed = {
      name: name.trim(),
      jobTitle: jobTitle.trim() || undefined,
      bio: bio.trim() || undefined,
      active,
      links,
    };

    // Try Supabase first (real slugs + public pages)
    try {
      const created = await createCardInSupabase(trimmed);
      try {
        window.sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        // ignore
      }
      router.push(`/c/${encodeURIComponent(created.slug)}`);
      return;
    } catch (e: any) {
      console.warn('Supabase create failed, falling back to local storage:', e);
    }

    // Fallback: local-only MVP
    upsertCard({
      id,
      name: trimmed.name,
      jobTitle: trimmed.jobTitle,
      bio: trimmed.bio,
      active: trimmed.active,
      links: trimmed.links,
    });
    try {
      window.sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
    router.push(`/app/cards/edit/?id=${encodeURIComponent(id)}`);
  }

  const placeholder = kinds.find((k) => k.kind === newKind)?.placeholder ?? 'https://...';

  return (
    <div className="min-h-dvh px-5 py-8 max-w-xl mx-auto">
      <Link href="/app/" className="text-white/70 hover:text-white">← Back</Link>
      <h1 className="mt-4 text-2xl font-bold">New QR Card</h1>

      <div className="mt-5 qrlife-card rounded-2xl">
        <div className="px-4 py-3 bg-[color:var(--qrlife-purple)] flex items-center justify-between">
          <div className="font-semibold">My Information</div>
          <button
            onClick={() => setActive((v) => !v)}
            className={`h-6 w-11 rounded-full relative ${active ? 'bg-emerald-400/80' : 'bg-white/20'}`}
            aria-label="Toggle active"
          >
            <div className={`h-5 w-5 rounded-full bg-white absolute top-0.5 transition-all ${active ? 'right-0.5' : 'left-0.5'}`} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3" placeholder="QR Card Name" />
          <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3" placeholder="Job Title (Optional)" />
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 min-h-28" placeholder="Bio (Optional)" />

          <div className="pt-2">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Social Networks</div>
            </div>

            <div className="mt-2 flex gap-2 items-stretch">
              <div className="relative">
                <button
                  ref={kindBtnRef}
                  type="button"
                  onClick={() => {
                    const next = !kindOpen;
                    if (next) {
                      // Decide whether to open upward based on viewport space
                      const r = kindBtnRef.current?.getBoundingClientRect();
                      if (r) {
                        const spaceBelow = window.innerHeight - r.bottom;
                        const spaceAbove = r.top;
                        setKindOpenUp(spaceBelow < 320 && spaceAbove > spaceBelow);
                      }
                    }
                    setKindOpen(next);
                  }}
                  className="h-full rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-2 inline-flex items-center gap-2"
                  aria-haspopup="listbox"
                  aria-expanded={kindOpen}
                >
                  <span className="text-white/90">
                    <SocialIcon kind={newKind} size={16} />
                  </span>
                  <span className="text-sm">{kinds.find((k) => k.kind === newKind)?.label ?? newKind}</span>
                  <span className="text-white/50 text-xs">▾</span>
                </button>

                {kindOpen && (
                  <div
                    className={`absolute z-10 w-56 rounded-2xl bg-slate-950/90 border border-white/10 shadow-2xl backdrop-blur max-h-80 overflow-y-auto overscroll-contain ${
                      kindOpenUp ? 'bottom-full mb-2' : 'top-full mt-2'
                    }`}
                    role="listbox"
                  >
                    {kinds.map((k) => (
                      <button
                        key={k.kind}
                        type="button"
                        onClick={() => {
                          setNewKind(k.kind);
                          setKindOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 inline-flex items-center gap-2 hover:bg-white/10 ${
                          k.kind === newKind ? 'bg-white/10' : ''
                        }`}
                      >
                        <span className="text-white/90">
                          <SocialIcon kind={k.kind} size={16} />
                        </span>
                        <span className="text-sm text-white/90">{k.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <input
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addLink();
                  }
                  if (e.key === 'Escape') {
                    setKindOpen(false);
                  }
                }}
                className="flex-1 rounded-xl bg-white/10 border border-white/10 px-3 py-2"
                placeholder={placeholder}
              />
              <button
                type="button"
                onClick={previewUrl}
                className="rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-2"
                title="Open link in a new tab to test"
              >
                Test
              </button>
              <button type="button" onClick={addLink} className="rounded-xl bg-[color:var(--qrlife-purple)] px-4 py-2">
                Add
              </button>
            </div>

            {links.length > 0 && (
              <div className="mt-3 space-y-2 text-sm">
                {links.map((l, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-white/85">
                        {/* icon */}
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 border border-white/10">
                          <SocialIcon kind={l.kind} size={16} />
                        </span>
                      </span>
                      <div className="capitalize text-white/90">{l.kind}</div>
                    </div>
                    <div className="text-white/60 truncate max-w-[60%]">{l.url}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 flex items-center justify-end gap-2">
            <Link href="/app/" className="rounded-xl px-4 py-2 bg-white/10 hover:bg-white/15">Cancel</Link>
            <button onClick={save} className="rounded-xl px-4 py-2 bg-[color:var(--qrlife-teal)] text-slate-950 font-semibold">
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 text-xs text-white/60">
        Safety check status: <span className="text-amber-300">WARN mode</span> (Safe Browsing key not configured yet)
      </div>

      <BottomNav />
    </div>
  );
}
