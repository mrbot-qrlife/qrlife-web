'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { BottomNav } from '@/components/BottomNav';
import { upsertCard, type SocialKind } from '@/lib/storage';

function normalizeUrl(input: string): string {
  let s = input.trim();
  if (!s) return s;
  // Add scheme if missing
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
  return s;
}

async function safeBrowsingCheck(): Promise<{ ok: boolean; mode: 'warn' | 'block'; reason?: string }> {
  // MVP: WARN mode until key/backend is wired.
  // Later: call a server-side endpoint that uses Google Safe Browsing.
  return { ok: true, mode: 'warn', reason: 'Safe Browsing key not configured yet (WARN mode).' };
}

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [result, setResult] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [canOpen, setCanOpen] = useState(false);

  const normalized = useMemo(() => normalizeUrl(result), [result]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let raf = 0;

    async function start() {
      try {
        setStatus('Requesting camera…');
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus('Scanning…');

        const tick = () => {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          if (!video || !canvas) {
            raf = requestAnimationFrame(tick);
            return;
          }
          const w = video.videoWidth;
          const h = video.videoHeight;
          if (w && h) {
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0, w, h);
              const img = ctx.getImageData(0, 0, w, h);
              const code = jsQR(img.data, w, h);
              if (code?.data) {
                setResult(code.data);
                setCameraOn(false);
                setStatus('QR found.');
                return; // stop loop; cleanup in effect cleanup
              }
            }
          }
          raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setStatus(`Camera error: ${msg || 'unknown'}`);
        setCameraOn(false);
      }
    }

    if (cameraOn) start();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [cameraOn]);

  useEffect(() => {
    // when result changes, run safety check
    (async () => {
      if (!result) return;
      setCanOpen(false);
      const check = await safeBrowsingCheck();
      if (check.mode === 'warn') {
        setStatus(check.reason || 'Safety check not configured (WARN mode).');
        setCanOpen(true);
        return;
      }
      if (!check.ok) {
        setStatus(check.reason || 'Blocked: unsafe destination.');
        setCanOpen(false);
        return;
      }
      setStatus('Safe link.');
      setCanOpen(true);
    })();
  }, [result]);

  async function onUpload(file: File) {
    setStatus('Reading image…');
    const bmp = await createImageBitmap(file);
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = bmp.width;
    canvas.height = bmp.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(bmp, 0, 0);
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(img.data, canvas.width, canvas.height);
    if (code?.data) {
      setResult(code.data);
      setStatus('QR found in image.');
    } else {
      setStatus('No QR code found in that image.');
    }
  }

  function saveAsQrCard() {
    if (!normalized) return;
    const id = Math.random().toString(36).slice(2, 10);
    upsertCard({
      id,
      name: 'Scanned QR',
      active: true,
      links: [{ kind: 'website' as SocialKind, url: normalized }],
    });
    setStatus('Saved as QR Card (local).');
  }

  return (
    <div className="min-h-dvh pb-28 px-5 py-8 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/app/" className="text-white/70 hover:text-white">← Back</Link>
      </div>
      <h1 className="mt-4 text-2xl font-bold">Scan</h1>
      <div className="text-white/60">Scan a QR code to preview the link, then choose to open or save it.</div>

      <div className="mt-6 qrlife-card rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCameraOn((v) => !v)}
            className="rounded-xl px-4 py-2 bg-[color:var(--qrlife-teal)] text-slate-950 font-semibold"
          >
            {cameraOn ? 'Stop camera' : 'Use camera'}
          </button>

          <label className="rounded-xl px-4 py-2 bg-white/10 hover:bg-white/15 cursor-pointer">
            Upload image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(f);
              }}
            />
          </label>
        </div>

        <div className="mt-4">
          <div className="text-xs text-white/60">Status</div>
          <div className="text-sm">{status || '—'}</div>
        </div>

        {cameraOn && (
          <div className="mt-4">
            <video ref={videoRef} className="w-full rounded-xl bg-black" playsInline muted />
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        <div className="mt-4">
          <div className="text-xs text-white/60">Detected link</div>
          <div className="mt-1 break-words rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm">
            {normalized || '—'}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            disabled={!canOpen}
            onClick={() => normalized && window.open(normalized, '_blank', 'noopener,noreferrer')}
            className={`rounded-xl px-4 py-2 font-semibold ${canOpen ? 'bg-white text-slate-950' : 'bg-white/10 text-white/40'}`}
          >
            Open in new tab
          </button>
          <button
            disabled={!normalized}
            onClick={saveAsQrCard}
            className={`rounded-xl px-4 py-2 ${normalized ? 'bg-[color:var(--qrlife-purple)]' : 'bg-white/10 text-white/40'}`}
          >
            Save as QR Card
          </button>
        </div>

        <div className="mt-4 text-xs text-white/60">
          Safe Browsing: <span className="text-amber-300">WARN mode</span> until API key is added.
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
