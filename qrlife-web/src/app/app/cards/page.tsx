'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { BottomNav } from '@/components/BottomNav';
import { QrCardTile } from '@/components/QrCardTile';
import { loadCards, toggleLocalFavorite, type QrCard } from '@/lib/storage';

export default function QrCardsPage() {
  const [cards, setCards] = useState<QrCard[]>([]);

  useEffect(() => {
    setCards(loadCards());
  }, []);

  return (
    <div className="min-h-dvh px-5 py-8 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">QR Cards</div>
          <div className="text-white/70">All of your cards (favorite the ones you want on Home)</div>
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
                name: c.name,
                scans: c.scans,
                lastScannedAt: c.lastScannedAt,
                active: c.active,
                isFavorite: c.isFavorite,
              }}
              onToggleFavorite={(id) => {
                toggleLocalFavorite(id);
                setCards(loadCards());
              }}
            />
          ))
        )}
      </div>

      <div className="mt-8 text-xs text-white/50">
        Tip: Tap the heart to add/remove from <span className="text-emerald-300">Home</span>.
      </div>

      <BottomNav />
    </div>
  );
}
