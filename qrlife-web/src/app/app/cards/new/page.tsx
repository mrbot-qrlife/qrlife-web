'use client';

import Link from 'next/link';
import { BottomNav } from "@/components/BottomNav";
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { makeId, upsertCard, type SocialKind } from '@/lib/storage';

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

  const [active, setActive] = useState(true);
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [bio, setBio] = useState('');
  const [links, setLinks] = useState<Array<{ kind: SocialKind; url: string }>>([]);
  const [newKind, setNewKind] = useState<SocialKind>('facebook');
  const [newUrl, setNewUrl] = useState('');

  function addLink() {
    const url = newUrl.trim();
    if (!url) return;
    setLinks((prev) => [...prev, { kind: newKind, url }]);
    setNewUrl('');
  }

  function save() {
    if (!name.trim()) {
      alert('QR Card Name is required');
      return;
    }
    upsertCard({
      id,
      name: name.trim(),
      jobTitle: jobTitle.trim() || undefined,
      bio: bio.trim() || undefined,
      active,
      links,
    });
    router.push(`/app/cards/edit/?id=${encodeURIComponent(id)}`);
  }

  const placeholder = kinds.find((k) => k.kind === newKind)?.placeholder ?? 'https://...';

  return (
    <div className="min-h-dvh px-5 py-8 max-w-xl mx-auto">
      <Link href="/app/" className="text-white/70 hover:text-white">← Back</Link>
      <h1 className="mt-4 text-2xl font-bold">New QR Card</h1>

      <div className="mt-5 qrlife-card rounded-2xl overflow-hidden">
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

            <div className="mt-2 flex gap-2">
              <select
                value={newKind}
                onChange={(e) => setNewKind(e.target.value as SocialKind)}
                className="rounded-xl bg-white/10 border border-white/10 px-3 py-2"
              >
                {kinds.map((k) => (
                  <option key={k.kind} value={k.kind}>
                    {k.label}
                  </option>
                ))}
              </select>
              <input
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="flex-1 rounded-xl bg-white/10 border border-white/10 px-3 py-2"
                placeholder={placeholder}
              />
              <button onClick={addLink} className="rounded-xl bg-[color:var(--qrlife-purple)] px-4 py-2">
                Add
              </button>
            </div>

            {links.length > 0 && (
              <div className="mt-3 space-y-2 text-sm">
                {links.map((l, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                    <div className="capitalize">{l.kind}</div>
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
