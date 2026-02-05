import { QrCardTile, type QrCardSummary } from '@/components/QrCardTile';
import Link from 'next/link';

const mockCards: QrCardSummary[] = [
  { id: 'demo-1', name: 'QRlife.me', scans: 704, lastScannedAt: '11/12/2025', active: true },
  { id: 'demo-2', name: 'CamperWiFi', scans: 0, lastScannedAt: undefined, active: true },
];

export default function AppHome() {
  return (
    <div className="min-h-dvh px-5 py-8 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">Home</div>
          <div className="text-white/70">Welcome — your favorite QR Cards</div>
        </div>
        <Link
          href="/app/cards/new"
          className="rounded-2xl px-4 py-2 bg-white/10 hover:bg-white/15"
        >
          + Add QR Card
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {mockCards.map((c) => (
          <QrCardTile key={c.id} card={c} />
        ))}
      </div>

      <div className="mt-8 text-xs text-white/50">
        Safety check status: <span className="text-amber-300">WARN mode</span> (Safe Browsing API key not configured yet)
      </div>
    </div>
  );
}
