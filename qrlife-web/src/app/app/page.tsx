'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import Link from 'next/link';
import { BottomNav } from "@/components/BottomNav";
import { useEffect, useState } from 'react';
import { QrCardTile } from '@/components/QrCardTile';
import { loadCards, type QrCard } from '@/lib/storage';

type DbCard = {
  id: string;
  slug: string;
  name: string;
  active: boolean;
  scans_count: number;
  last_scanned_at?: string;
};

export default function AppHome() {
  const [cards, setCards] = useState<QrCard[]>([]);
  const [dbCards, setDbCards] = useState<DbCard[]>([]);

  useEffect(() => {
    // Local fallback list
    setCards(loadCards());

    // Supabase list
    fetch('/api/cards/list')
      .then((r) => r.json())
      .then((j) => {
        if (j?.ok) setDbCards(j.cards ?? []);
      })
      .catch(() => null);
  }, []);

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
        {dbCards.length > 0 && (
          <>
            <div className="text-xs text-white/60">Cloud cards (Supabase)</div>
            {dbCards.map((c) => (
              <QrCardTile
                key={c.id}
                card={{
                  id: c.slug,
                  name: c.name,
                  scans: c.scans_count ?? 0,
                  lastScannedAt: c.last_scanned_at,
                  active: c.active,
                  isCloud: true,
                }}
              />
            ))}
          </>
        )}

        <div className="text-xs text-white/60 mt-4">Local cards (browser)</div>
        {cards.length === 0 ? (
          <div className="qrlife-card rounded-2xl p-4 text-white/70">
            No local QR Cards yet. Click <b>+ Add QR Card</b> to create your first one.
          </div>
        ) : (
          cards.map((c) => (
            <QrCardTile
              key={c.id}
              card={{ id: c.id, name: c.name, scans: c.scans, lastScannedAt: c.lastScannedAt, active: c.active }}
            />
          ))
        )}
      </div>

      <div className="mt-8 text-xs text-white/50">
        Storage: <span className="text-emerald-300">Cloud + local</span> (Supabase live; full sync + login coming next)
      </div>

      <BottomNav />
    </div>
  );
}
