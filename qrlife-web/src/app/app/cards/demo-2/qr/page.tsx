import Link from 'next/link';
import QRCode from 'qrcode';

export default async function Demo2Qr() {
  const url = `https://example.com/demo-2`;
  const dataUrl = await QRCode.toDataURL(url, { errorCorrectionLevel: 'M', margin: 2, width: 512 });

  return (
    <div className="min-h-dvh px-5 py-8 max-w-xl mx-auto">
      <Link href="/app/cards/demo-2/" className="text-white/70 hover:text-white">← Back</Link>
      <h1 className="mt-4 text-2xl font-bold">Download QR</h1>
      <div className="text-white/60 text-sm">(Prototype) Destination: {url}</div>

      <div className="mt-6 qrlife-card rounded-2xl p-6 flex flex-col items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dataUrl} alt="QR" className="rounded-xl bg-white p-3" />
        <a className="rounded-xl px-4 py-2 bg-[color:var(--qrlife-teal)] text-slate-950 font-semibold" href={dataUrl} download={`qrlife-demo-2.png`}>
          Download PNG
        </a>
      </div>
    </div>
  );
}
