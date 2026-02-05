'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { getCard } from '@/lib/storage';

function StatsInner() {
  const sp = useSearchParams();
  const id = sp.get('id') || '';
  const card = useMemo(() => (id ? getCard(id) : undefined), [id]);

  return (
    <div className="min-h-dvh pb-28 px-5 py-8 max-w-xl mx-auto">
      <Link href="/app/" className="text-white/70 hover:text-white">← Back</Link>
      <h1 className="mt-4 text-2xl font-bold">QR Card Stats</h1>
      <div className="text-white/60">(MVP) Local stats per card</div>

      <div className="mt-6 qrlife-card rounded-2xl p-4">
        <div className="font-semibold">{card?.name || 'Unknown card'}</div>
        <div className="mt-3 text-sm text-white/80">Scans: <b>{card?.scans ?? 0}</b></div>
        <div className="text-sm text-white/80">Last scanned: <b>{card?.lastScannedAt ?? '—'}</b></div>
        <div className="mt-4 text-xs text-white/60">Clicks tracking will appear here once public card pages are wired.</div>
      </div>

      <BottomNav />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-dvh px-5 py-8 max-w-xl mx-auto text-white/70">Loading…</div>}>
      <StatsInner />
    </Suspense>
  );
}
