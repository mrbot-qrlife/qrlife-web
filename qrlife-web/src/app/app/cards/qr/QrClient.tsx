'use client';

import Link from 'next/link';
import QRCode from 'qrcode';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function QrClient() {
  const sp = useSearchParams();
  const id = sp.get('id') || '';
  const slug = sp.get('slug') || '';
  const [dataUrl, setDataUrl] = useState<string>('');

  const dest = slug
    ? `${window.location.origin}/c/${slug}`
    : id
      ? `${window.location.origin}/c/local/${id}`
      : '';

  useEffect(() => {
    if (!dest) return;
    QRCode.toDataURL(dest, { errorCorrectionLevel: 'M', margin: 2, width: 512 }).then(setDataUrl);
  }, [dest]);

  return (
    <div className="min-h-dvh px-5 py-8 max-w-xl mx-auto">
      <Link href={id ? `/app/cards/edit/?id=${encodeURIComponent(id)}` : '/app/'} className="text-white/70 hover:text-white">← Back</Link>
      <h1 className="mt-4 text-2xl font-bold">Download QR</h1>
      <div className="text-white/60 text-sm">(Prototype) Destination: {dest || '—'}</div>

      <div className="mt-6 qrlife-card rounded-2xl p-6 flex flex-col items-center gap-4">
        {dataUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dataUrl} alt="QR" className="rounded-xl bg-white p-3" />
            <a className="rounded-xl px-4 py-2 bg-[color:var(--qrlife-teal)] text-slate-950 font-semibold" href={dataUrl} download={`qrlife-${id}.png`}>
              Download PNG
            </a>
          </>
        ) : (
          <div className="text-white/70">Missing card id.</div>
        )}

        <div className="text-xs text-white/60">Logo-in-center option coming next (ECC H + safe sizing).</div>
      </div>
    </div>
  );
}
