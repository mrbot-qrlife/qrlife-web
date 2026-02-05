import Link from 'next/link';
import { BottomNav } from "@/components/BottomNav";

const mock = [
  { day: 'Today', scans: 12, clicks: 8 },
  { day: 'Yesterday', scans: 9, clicks: 6 },
  { day: '2 days ago', scans: 4, clicks: 3 },
];

export default function ScansPage() {
  return (
    <div className="min-h-dvh px-5 py-8 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/app" className="text-white/70 hover:text-white">← Back</Link>
        <div className="text-sm text-white/60">(Prototype)</div>
      </div>
      <h1 className="mt-4 text-2xl font-bold">Analytics</h1>
      <div className="text-white/60">Scans + clicks reporting will live here.</div>

      <div className="mt-6 space-y-3">
        {mock.map((r) => (
          <div key={r.day} className="qrlife-card rounded-2xl p-4 flex items-center justify-between">
            <div className="font-semibold">{r.day}</div>
            <div className="text-sm text-white/80">Scans: <b>{r.scans}</b> · Clicks: <b>{r.clicks}</b></div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-xs text-white/60">
        Next: track BOTH scan events (landing on QR Card page) and link click events.
      </div>

      <BottomNav />
    </div>
  );
}
