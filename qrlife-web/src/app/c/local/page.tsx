'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { SocialIcon } from '@/components/SocialIcon';
import { getCard, recordLocalScan, type QrCard, type SocialKind } from '@/lib/storage';

export default function PublicCardPage({ params }: { params: { id: string } }) {
  const id = params?.id ?? '';
  const [card, setCard] = useState<QrCard | undefined>();

  const scanKey = useMemo(() => {
    // avoid repeatedly incrementing scans when the user refreshes
    // (prototype behavior; real scan tracking will be server-side)
    return id ? `qrlife.public.scan.v1:${id}` : '';
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const c = getCard(id);
    setCard(c);

    // record a scan once per browser session per card
    if (scanKey) {
      try {
        const already = window.sessionStorage.getItem(scanKey);
        if (!already) {
          window.sessionStorage.setItem(scanKey, '1');
          recordLocalScan(id);
          setCard(getCard(id));
        }
      } catch {
        // ignore storage errors
      }
    }
  }, [id, scanKey]);

  const initials = (card?.name ?? 'QR')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');

  return (
    <div className="min-h-dvh px-5 py-10 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-white/80 hover:text-white font-semibold">
          QRLife
        </Link>
        <Link href="/app/" className="rounded-xl px-3 py-2 bg-white/10 hover:bg-white/15 text-sm">
          Open App
        </Link>
      </div>

      {/* Hero */}
      <div className="mt-6 qrlife-card rounded-3xl overflow-hidden">
        <div className="relative px-5 pt-7 pb-5 bg-gradient-to-br from-[color:var(--qrlife-purple)]/90 via-[color:var(--qrlife-bg1)]/60 to-[color:var(--qrlife-teal)]/35">
          <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(circle at 20% 10%, rgba(255,255,255,0.18), transparent 35%), radial-gradient(circle at 85% 20%, rgba(255,255,255,0.12), transparent 40%)' }} />

          <div className="relative flex items-start gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
              <div className="h-14 w-14 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg">
                {initials || 'QR'}
              </div>
            </div>

            <div className="flex-1">
              <div className="text-white/70 text-xs">QRLife Card</div>
              <div className="text-2xl font-extrabold tracking-tight">{card?.name ?? 'QRLife Card'}</div>
              {card?.jobTitle ? (
                <div className="text-white/85 mt-1">{card.jobTitle}</div>
              ) : (
                <div className="text-white/60 mt-1 text-sm">Dynamic QR • update links anytime</div>
              )}

              {card && !card.active && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-300/15 border border-amber-200/25 px-3 py-1 text-xs text-amber-100">
                  Inactive
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {!card ? (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-white/75">
              <div className="font-semibold">This QR Card isn’t available on this device yet.</div>
              <div className="mt-2 text-xs text-white/55">
                MVP note: cards are currently stored locally in the browser that created them. Cloud sync is coming next.
              </div>
              <div className="mt-4">
                <Link href="/app/" className="inline-flex rounded-xl px-4 py-2 bg-white/10 hover:bg-white/15 text-sm">
                  Open the app
                </Link>
              </div>
            </div>
          ) : !card.active ? (
            <div className="rounded-2xl bg-amber-300/10 border border-amber-200/20 p-4 text-amber-100/90">
              This QR Card is currently inactive.
            </div>
          ) : (
            <>
              {card.bio && (
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-white/85 leading-relaxed">
                  {card.bio}
                </div>
              )}

              <div className="space-y-2">
                {card.links?.length ? (
                  card.links.map((l, idx) => {
                    return (
                      <a
                        key={idx}
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group block rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-11 w-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-white/85">
                              <SocialIcon kind={l.kind} size={18} />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs text-white/60 capitalize">{l.kind}</div>
                              <div className="font-semibold truncate group-hover:underline">{l.label ?? l.url}</div>
                              <div className="text-xs text-white/45 truncate">{l.url}</div>
                            </div>
                          </div>
                          <div className="text-white/50 text-xs">↗</div>
                        </div>
                      </a>
                    );
                  })
                ) : (
                  <div className="text-white/60 text-sm">No links added yet.</div>
                )}
              </div>

              <div className="pt-1 flex items-center justify-between text-xs text-white/50">
                <div>
                  Scans (prototype/local): <span className="text-white/80">{card.scans}</span>
                </div>
                <div className="text-white/40">ID: {id}</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 text-xs text-white/50">
        Safety note: URL reputation checks + hard blocking will be enabled when the Safe Browsing key is configured.
      </div>
    </div>
  );
}
