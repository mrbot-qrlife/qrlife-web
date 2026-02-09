'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { BottomNav } from '@/components/BottomNav';
import { QrCardTile } from '@/components/QrCardTile';
import { listMyCards, type CloudCard } from '@/lib/cloudCards';

export default function QrCardsPage() {
  const [cards, setCards] = useState<CloudCard[]>([]);

  useEffect(() => {
    listMyCards().then(setCards).catch(() => null);
  }, []);

  return (
    <div className="min-h-dvh px-5 py-8 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">QR Cards</div>
          <div className="text-white/70">All of your synced cards</div>
        </div>
        <Link href="/app/cards/new/" className="rounded-2xl px-4 py-2 bg-white/10 hover:bg-white/15">
          + Add QR Card
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {cards.length === 0 ? (
          <div className="qrlife-card rounded-2xl p-4 text-white/70">
            No QR Cards yet. Click <b>+ Add QR Card</b> to create your first one.
          </div>
        ) : (
          cards.map((c) => (
            <QrCardTile
              key={c.id}
              card={{
                id: c.id,
                slug: c.slug,
                name: c.name,
                scans: c.scans_count ?? 0,
                lastScannedAt: c.last_scanned_at ?? undefined,
                active: c.active,
                isCloud: true,
              }}
            />
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
