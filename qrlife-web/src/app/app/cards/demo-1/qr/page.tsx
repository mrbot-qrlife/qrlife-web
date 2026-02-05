import Link from 'next/link';
import QRCode from 'qrcode';

export default async function Demo1Qr() {
  const url = `https://example.com/demo-1`;
  const dataUrl = await QRCode.toDataURL(url, { errorCorrectionLevel: 'M', margin: 2, width: 512 });

  return (
    <div className="min-h-dvh px-5 py-8 max-w-xl mx-auto">
      <Link href="/app/cards/demo-1/" className="text-white/70 hover:text-white">← Back</Link>
      <h1 className="mt-4 text-2xl font-bold">Download QR</h1>
      <div className="text-white/60 text-sm">(Prototype) Destination: {url}</div>

      <div className="mt-6 qrlife-card rounded-2xl p-6 flex flex-col items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dataUrl} alt="QR" className="rounded-xl bg-white p-3" />
        <a
          className="rounded-xl px-4 py-2 bg-[color:var(--qrlife-teal)] text-slate-950 font-semibold"
          href={dataUrl}
          download={`qrlife-demo-1.png`}
        >
          Download PNG
        </a>
        <div className="text-xs text-white/60">Logo-in-center option coming next (ECC H + safe sizing).</div>
      </div>
    </div>
  );
}
