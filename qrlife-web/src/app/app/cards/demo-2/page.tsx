import Link from 'next/link';

export default function EditDemo2() {
  return (
    <div className="min-h-dvh px-5 py-8 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/app/" className="text-white/70 hover:text-white">← Back</Link>
        <Link href="/app/cards/demo-2/qr/" className="rounded-xl px-3 py-2 bg-white/10 hover:bg-white/15">Download QR</Link>
      </div>
      <h1 className="mt-4 text-2xl font-bold">Edit QR Card</h1>
      <div className="text-white/60 text-sm">(Prototype) Card: demo-2</div>
      <div className="mt-5 qrlife-card rounded-2xl p-4">Coming soon…</div>
    </div>
  );
}
