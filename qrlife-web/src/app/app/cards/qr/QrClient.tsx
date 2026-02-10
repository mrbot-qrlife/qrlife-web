'use client';

import Link from 'next/link';
import QRCode from 'qrcode';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { decodeUrlForwardMeta, decodeWifiMeta, type WifiFrame } from '@/lib/qrCreate';

type CardResponse = {
  ok: boolean;
  card?: { id: string; slug: string; name: string; bio?: string | null };
  error?: string;
};

export default function QrClient() {
  const sp = useSearchParams();
  const id = sp.get('id') || '';
  const slug = sp.get('slug') || '';

  const [dataUrl, setDataUrl] = useState<string>('');
  const [dest, setDest] = useState<string>('');
  const [wifiFrame, setWifiFrame] = useState<WifiFrame | null>(null);

  useEffect(() => {
    async function load() {
      const qs = slug ? `slug=${encodeURIComponent(slug)}` : id ? `id=${encodeURIComponent(id)}` : '';
      if (!qs) return;

      const res = await fetch(`/api/cards/get?${qs}`, { cache: 'no-store' });
      const json = (await res.json()) as CardResponse;
      if (!json.ok || !json.card) return;

      const wifiMeta = decodeWifiMeta(json.card.bio);
      if (wifiMeta) {
        setDest(wifiMeta.payload);
        setWifiFrame(wifiMeta.frame);
        return;
      }

      const forwardMeta = decodeUrlForwardMeta(json.card.bio);
      if (forwardMeta) {
        setDest(`${window.location.origin}/r/${json.card.slug}`);
        return;
      }

      setDest(`${window.location.origin}/c/${json.card.slug}`);
    }

    load().catch(() => null);
  }, [id, slug]);

  useEffect(() => {
    if (!dest) return;
    QRCode.toDataURL(dest, { errorCorrectionLevel: 'M', margin: 2, width: 512 }).then(setDataUrl);
  }, [dest]);

  const frameClass = useMemo(() => {
    switch (wifiFrame) {
      case 'rounded': return 'rounded-3xl bg-white/5 border-2 border-white/20 p-6';
      case 'minimal': return 'rounded-lg bg-white p-2';
      case 'bold': return 'rounded-2xl bg-white p-4 border-8 border-black';
      case 'classic': return 'rounded-xl bg-white p-3';
      default: return 'rounded-xl bg-white p-3';
    }
  }, [wifiFrame]);

  return (
    <div className="min-h-dvh px-5 py-8 max-w-xl mx-auto">
      <Link href={id ? `/app/cards/edit/?id=${encodeURIComponent(id)}` : '/app/'} className="text-white/70 hover:text-white">← Back</Link>
      <h1 className="mt-4 text-2xl font-bold">Download QR</h1>
      <div className="text-white/60 text-sm break-all">Destination: {dest || '—'}</div>

      <div className="mt-6 qrlife-card rounded-2xl p-6 flex flex-col items-center gap-4">
        {dataUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dataUrl} alt="QR" className={frameClass} />
            <a className="rounded-xl px-4 py-2 bg-[color:var(--qrlife-teal)] text-slate-950 font-semibold" href={dataUrl} download={`qrlife-${id || slug}.png`}>
              Download PNG
            </a>
          </>
        ) : (
          <div className="text-white/70">Loading QR…</div>
        )}
      </div>
    </div>
  );
}
