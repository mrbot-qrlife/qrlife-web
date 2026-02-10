'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';
import { SocialIcon } from '@/components/SocialIcon';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { createMyCard, type SocialKind } from '@/lib/cloudCards';
import { buildWifiPayload, encodeUrlForwardMeta, encodeWifiMeta, isValidAbsoluteHttpUrl, type QrType, type WifiFrame } from '@/lib/qrCreate';

const types: Array<{ type: QrType; label: string; desc: string }> = [
  { type: 'personal', label: 'Personal', desc: 'Profile + social links' },
  { type: 'business', label: 'Business', desc: 'Business profile + links' },
  { type: 'influencer', label: 'Influencer', desc: 'Creator profile + links' },
  { type: 'event_campaign', label: 'Event/Campaign', desc: 'Campaign destination card' },
  { type: 'wifi', label: 'Wi-Fi', desc: 'Connect guests to Wi-Fi quickly' },
  { type: 'url_forward', label: 'URL Forward', desc: 'Track then redirect to destination URL' },
];

const kinds: Array<{ kind: SocialKind; label: string; placeholder: string }> = [
  { kind: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
  { kind: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/you' },
  { kind: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@you' },
  { kind: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@you' },
  { kind: 'x', label: 'X', placeholder: 'https://x.com/you' },
  { kind: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/you' },
  { kind: 'website', label: 'Website', placeholder: 'https://example.com' },
];

const DRAFT_KEY = 'qrlife.newcard.draft.v2';
const LAST_TYPE_KEY = 'qrlife.newcard.lasttype';

function normalizeLinkInput(kind: SocialKind, raw: string) {
  let v = raw.trim();
  if (!v) return '';
  if (v.startsWith('@')) v = v.slice(1);

  const hasScheme = /^https?:\/\//i.test(v);
  const looksLikeDomain = /\./.test(v) || v.includes('/');
  if (hasScheme) return v;

  if (looksLikeDomain && !['tiktok', 'x', 'instagram', 'youtube', 'facebook', 'linkedin'].includes(kind)) {
    return `https://${v}`;
  }

  switch (kind) {
    case 'instagram': return `https://instagram.com/${v}`;
    case 'x': return `https://x.com/${v}`;
    case 'tiktok': return `https://tiktok.com/@${v}`;
    case 'youtube': return `https://youtube.com/@${v}`;
    case 'facebook': return `https://facebook.com/${v}`;
    case 'linkedin': return v.startsWith('company/') || v.startsWith('in/') ? `https://linkedin.com/${v}` : `https://linkedin.com/in/${v}`;
    case 'website': return `https://${v}`;
    default: return looksLikeDomain ? `https://${v}` : v;
  }
}

export default function NewCard() {
  const router = useRouter();
  const search = useSearchParams();
  const selectedType = (search.get('type') as QrType | null) ?? null;

  const [active, setActive] = useState(true);
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [bio, setBio] = useState('');
  const [links, setLinks] = useState<Array<{ kind: SocialKind; url: string }>>([]);
  const [newKind, setNewKind] = useState<SocialKind>('facebook');
  const [newUrl, setNewUrl] = useState('');

  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA2' | 'WPA' | 'WEP' | 'NONE'>('WPA2');
  const [wifiHidden, setWifiHidden] = useState(false);
  const [wifiFrame, setWifiFrame] = useState<WifiFrame>('classic');

  const [destinationUrl, setDestinationUrl] = useState('');

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
      if (typeof d.wifiSsid === 'string') setWifiSsid(d.wifiSsid);
      if (typeof d.wifiPassword === 'string') setWifiPassword(d.wifiPassword);
      if (typeof d.wifiEncryption === 'string') setWifiEncryption(d.wifiEncryption);
      if (typeof d.wifiHidden === 'boolean') setWifiHidden(d.wifiHidden);
      if (typeof d.wifiFrame === 'string') setWifiFrame(d.wifiFrame as WifiFrame);
      if (typeof d.destinationUrl === 'string') setDestinationUrl(d.destinationUrl);

      if (!selectedType && d.lastType) {
        router.replace(`/app/cards/new?type=${encodeURIComponent(d.lastType)}`);
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          active, name, jobTitle, bio, links, newKind, newUrl,
          wifiSsid, wifiPassword, wifiEncryption, wifiHidden, wifiFrame, destinationUrl,
          lastType: selectedType,
        })
      );
      if (selectedType) window.sessionStorage.setItem(LAST_TYPE_KEY, selectedType);
    } catch {
      // ignore
    }
  }, [active, name, jobTitle, bio, links, newKind, newUrl, wifiSsid, wifiPassword, wifiEncryption, wifiHidden, wifiFrame, destinationUrl, selectedType]);

  const formTitle = useMemo(() => {
    return types.find((t) => t.type === selectedType)?.label ?? 'New QR';
  }, [selectedType]);

  function addLink() {
    const url = normalizeLinkInput(newKind, newUrl);
    if (!url) return;
    if (links.some((l) => l.kind === newKind && l.url === url)) {
      alert('That link is already added.');
      return;
    }
    setLinks((prev) => [...prev, { kind: newKind, url }]);
  }

  function startWith(type: QrType) {
    router.push(`/app/cards/new?type=${encodeURIComponent(type)}`);
  }

  async function saveShared() {
    if (!selectedType) return;
    if (!name.trim()) {
      alert('Name is required');
      return;
    }
    const created = await createMyCard({
      qrType: selectedType,
      name: name.trim(),
      jobTitle: jobTitle.trim() || undefined,
      bio: bio.trim() || undefined,
      active,
      links,
    });
    router.push(`/app/cards/edit/?id=${encodeURIComponent(created.id)}`);
  }

  async function saveWifi() {
    if (!wifiSsid.trim()) {
      alert('Wi-Fi SSID is required');
      return;
    }
    if (wifiEncryption !== 'NONE' && !wifiPassword.trim()) {
      alert('Wi-Fi password is required unless encryption is NONE');
      return;
    }

    const payload = buildWifiPayload({
      ssid: wifiSsid.trim(),
      password: wifiPassword,
      encryption: wifiEncryption,
      hidden: wifiHidden,
    });

    const created = await createMyCard({
      qrType: 'wifi',
      name: name.trim() || `Wi-Fi: ${wifiSsid.trim()}`,
      bio: encodeWifiMeta({ payload, frame: wifiFrame }),
      active,
      links: [],
      wifi: {
        ssid: wifiSsid.trim(),
        password: wifiPassword,
        encryption: wifiEncryption,
        hidden: wifiHidden,
      },
    });

    console.info('[analytics] qr_published', { qr_type: 'wifi', frame: wifiFrame });

    router.push(`/app/cards/edit/?id=${encodeURIComponent(created.id)}`);
  }

  async function saveUrlForward() {
    const destination = destinationUrl.trim();
    if (!destination) {
      alert('Destination URL is required');
      return;
    }
    if (!isValidAbsoluteHttpUrl(destination)) {
      alert('Destination URL must be a valid absolute http/https URL');
      return;
    }
    if (!name.trim()) {
      alert('Name is required');
      return;
    }

    const created = await createMyCard({
      qrType: 'url_forward',
      name: name.trim(),
      bio: encodeUrlForwardMeta(destination),
      active,
      links: [{ kind: 'website', url: destination, label: bio.trim() || undefined }],
      urlForward: { destinationUrl: destination },
    });

    router.push(`/app/cards/edit/?id=${encodeURIComponent(created.id)}`);
  }

  async function onSave() {
    try {
      if (selectedType === 'wifi') return saveWifi();
      if (selectedType === 'url_forward') return saveUrlForward();
      return saveShared();
    } catch (e: any) {
      alert(e?.message ?? 'Failed to create card');
    }
  }

  return (
    <div className="min-h-dvh px-5 py-8 max-w-xl mx-auto">
      <Link href="/app/" className="text-white/70 hover:text-white">← Back</Link>

      {!selectedType && (
        <>
          <h1 className="mt-4 text-2xl font-bold">Choose QR Type</h1>
          <div className="mt-4 space-y-3">
            {types.map((t) => (
              <button
                key={t.type}
                onClick={() => startWith(t.type)}
                className="w-full text-left rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-3"
              >
                <div className="font-semibold">{t.label}</div>
                <div className="text-sm text-white/70">{t.desc}</div>
              </button>
            ))}
          </div>
        </>
      )}

      {selectedType && (
        <>
          <div className="mt-4 flex items-center justify-between gap-2">
            <h1 className="text-2xl font-bold">New {formTitle} QR</h1>
            <button
              type="button"
              className="rounded-xl px-3 py-2 bg-white/10 hover:bg-white/15"
              onClick={() => router.push('/app/cards/new')}
            >
              Change type
            </button>
          </div>

          <div className="mt-5 qrlife-card rounded-2xl">
            <div className="px-4 py-3 bg-[color:var(--qrlife-purple)] flex items-center justify-between">
              <div className="font-semibold">Configuration</div>
              <button
                onClick={() => setActive((v) => !v)}
                className={`h-6 w-11 rounded-full relative ${active ? 'bg-emerald-400/80' : 'bg-white/20'}`}
                aria-label="Toggle active"
              >
                <div className={`h-5 w-5 rounded-full bg-white absolute top-0.5 transition-all ${active ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {(selectedType === 'personal' || selectedType === 'business' || selectedType === 'influencer' || selectedType === 'event_campaign') && (
                <>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3" placeholder="Name" />
                  <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3" placeholder="Job Title (Optional)" />
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 min-h-28" placeholder="Bio (Optional)" />

                  <div className="pt-2">
                    <div className="font-semibold">Social Networks</div>
                    <div className="mt-2 flex gap-2 items-stretch">
                      <select
                        value={newKind}
                        onChange={(e) => setNewKind(e.target.value as SocialKind)}
                        className="rounded-xl bg-white/10 border border-white/10 px-3 py-2"
                      >
                        {kinds.map((k) => <option key={k.kind} value={k.kind}>{k.label}</option>)}
                      </select>
                      <input
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLink(); } }}
                        className="flex-1 rounded-xl bg-white/10 border border-white/10 px-3 py-2"
                        placeholder={kinds.find((k) => k.kind === newKind)?.placeholder ?? 'https://...'}
                      />
                      <button type="button" onClick={addLink} className="rounded-xl bg-[color:var(--qrlife-purple)] px-4 py-2">Add</button>
                    </div>
                    {links.length > 0 && (
                      <div className="mt-3 space-y-2 text-sm">
                        {links.map((l, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 border border-white/10"><SocialIcon kind={l.kind} size={16} /></span>
                              <div className="capitalize text-white/90">{l.kind}</div>
                            </div>
                            <div className="text-white/60 truncate max-w-[60%]">{l.url}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {selectedType === 'wifi' && (
                <>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3" placeholder="Display Name (Optional)" />
                  <input value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3" placeholder="SSID (Required)" />
                  <select value={wifiEncryption} onChange={(e) => setWifiEncryption(e.target.value as 'WPA2' | 'WPA' | 'WEP' | 'NONE')} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3">
                    <option value="WPA2">WPA2</option>
                    <option value="WPA">WPA</option>
                    <option value="WEP">WEP</option>
                    <option value="NONE">NONE</option>
                  </select>
                  <input
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3"
                    placeholder={wifiEncryption === 'NONE' ? 'Password not required' : 'Password (Required)'}
                    disabled={wifiEncryption === 'NONE'}
                  />
                  <label className="inline-flex items-center gap-2 text-sm text-white/85">
                    <input type="checkbox" checked={wifiHidden} onChange={(e) => setWifiHidden(e.target.checked)} /> Hidden SSID
                  </label>
                  <div>
                    <div className="text-sm text-white/80 mb-2">Border / Frame</div>
                    <div className="grid grid-cols-2 gap-2">
                      {(['classic', 'rounded', 'minimal', 'bold'] as WifiFrame[]).map((frame) => (
                        <button
                          key={frame}
                          type="button"
                          onClick={() => setWifiFrame(frame)}
                          className={`rounded-xl border px-3 py-2 text-sm capitalize ${wifiFrame === frame ? 'bg-[color:var(--qrlife-purple)] border-white/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                        >
                          {frame}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {selectedType === 'url_forward' && (
                <>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3" placeholder="Name (Required)" />
                  <input value={destinationUrl} onChange={(e) => setDestinationUrl(e.target.value)} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3" placeholder="Destination URL (https://...)" />
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 min-h-20" placeholder="Notes (Optional)" />
                </>
              )}

              <div className="pt-4 flex items-center justify-end gap-2">
                <button type="button" onClick={() => router.push('/app/cards/new')} className="rounded-xl px-4 py-2 bg-white/10 hover:bg-white/15">Back to types</button>
                <button onClick={onSave} className="rounded-xl px-4 py-2 bg-[color:var(--qrlife-teal)] text-slate-950 font-semibold">Save</button>
              </div>
            </div>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}
