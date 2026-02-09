'use client';

import Link from 'next/link';
import { BottomNav } from "@/components/BottomNav";
import { useEffect, useState } from 'react';
import { QrCardTile } from '@/components/QrCardTile';
import { listMyCards, toggleMyFavorite, type CloudCard } from '@/lib/cloudCards';

export default function AppHome() {
  const [cards, setCards] = useState<CloudCard[]>([]);

  useEffect(() => {
    listMyCards().then(setCards).catch(() => null);
  }, []);

  const favorites = cards.filter((c) => !!c.is_favorite);

  return (
    <div className="min-h-dvh px-5 py-8 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">Home</div>
          <div className="text-white/70">Welcome — your favorite QR Cards</div>
          <div className="text-xs text-white/50 mt-1">QR Cards are dynamic QR codes you can update after printing.</div>
        </div>
        <Link href="/app/cards/new/" className="rounded-2xl px-4 py-2 bg-white/10 hover:bg-white/15">
          + Add QR Card
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {favorites.length === 0 ? (
          <div className="qrlife-card rounded-2xl p-4 text-white/70">
            No favorites yet. Open <b>QR Cards</b> and tap the heart on cards you want pinned here.
          </div>
        ) : (
          favorites.map((c) => (
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
                isFavorite: !!c.is_favorite,
              }}
              onToggleFavorite={async (id) => {
                const current = cards.find((x) => x.id === id)?.is_favorite ?? false;
                await toggleMyFavorite(id, !!current);
                const fresh = await listMyCards();
                setCards(fresh);
              }}
            />
          ))
        )}
      </div>

      <div className="mt-8 text-xs text-white/50">
        Storage: <span className="text-emerald-300">Cloud sync enabled</span>
      </div>

      <BottomNav />
    </div>
  );
}
