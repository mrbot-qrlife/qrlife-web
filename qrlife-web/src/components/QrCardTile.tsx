import Link from 'next/link';
import { Download, ToggleLeft, ToggleRight } from 'lucide-react';

export type QrCardSummary = {
  id: string;
  name: string;
  scans: number;
  lastScannedAt?: string;
  active: boolean;
};

export function QrCardTile({ card }: { card: QrCardSummary }) {
  return (
    <div className="qrlife-card rounded-2xl overflow-hidden">
      <div className="px-4 py-3 bg-[color:var(--qrlife-purple)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center text-sm font-semibold">
            QR
          </div>
          <div className="font-semibold">{card.name}</div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs opacity-80">{card.active ? 'Active' : 'Inactive'}</span>
          {card.active ? <ToggleRight className="opacity-90" /> : <ToggleLeft className="opacity-70" />}
        </div>
      </div>
      <div className="px-4 py-4 text-sm text-white/90">
        <div className="flex items-center justify-between">
          <div>
            <div className="opacity-70">Scans:</div>
            <div className="text-lg font-semibold">{card.scans}</div>
          </div>
          <div className="text-right">
            <div className="opacity-70">Last scanned:</div>
            <div className="font-medium">{card.lastScannedAt ?? '—'}</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Link
            href={`/app/cards/${card.id}`}
            className="inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2"
          >
            Edit
          </Link>
          <Link
            href={`/app/cards/${card.id}/qr`}
            className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--qrlife-teal)]/90 hover:bg-[color:var(--qrlife-teal)] px-4 py-2 text-slate-950 font-semibold"
          >
            <Download size={16} /> Download QR
          </Link>
        </div>
      </div>
    </div>
  );
}
