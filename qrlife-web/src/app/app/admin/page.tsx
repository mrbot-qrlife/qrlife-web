'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { supabaseBrowser } from '@/lib/supabase/client';

type AdminSummary = {
  ok: boolean;
  stats?: { users: number; cards: number; scans: number };
  recentCards?: Array<{
    id: string;
    user_id: string;
    owner_email?: string | null;
    slug: string;
    name: string;
    active: boolean;
    scans_count: number;
    updated_at: string;
  }>;
  error?: string;
};

export default function AdminPage() {
  const [data, setData] = useState<AdminSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      const sb = supabaseBrowser();
      const { data: sess } = await sb.auth.getSession();
      const token = sess.session?.access_token;
      if (!token) {
        setData({ ok: false, error: 'Not signed in' });
        setLoading(false);
        return;
      }

      const res = await fetch('/api/admin/summary', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = (await res.json()) as AdminSummary;
      setData(json);
      setLoading(false);
    }

    run().catch((err: unknown) => {
      setData({ ok: false, error: err instanceof Error ? err.message : String(err) });
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-dvh px-5 py-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/app/settings" className="text-white/70 hover:text-white">← Back</Link>
      </div>

      <h1 className="mt-4 text-2xl font-bold">Admin</h1>
      <p className="text-white/60 mt-1">Internal management view (allowlist only).</p>

      {loading ? (
        <div className="mt-6 qrlife-card rounded-2xl p-4 text-white/70">Loading admin dashboard…</div>
      ) : !data?.ok ? (
        <div className="mt-6 qrlife-card rounded-2xl p-4 text-amber-300">{data?.error || 'Not authorized'}</div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="qrlife-card rounded-2xl p-4"><div className="text-white/60 text-sm">Users</div><div className="text-2xl font-bold">{data.stats?.users ?? 0}</div></div>
            <div className="qrlife-card rounded-2xl p-4"><div className="text-white/60 text-sm">Cards</div><div className="text-2xl font-bold">{data.stats?.cards ?? 0}</div></div>
            <div className="qrlife-card rounded-2xl p-4"><div className="text-white/60 text-sm">Scans</div><div className="text-2xl font-bold">{data.stats?.scans ?? 0}</div></div>
          </div>

          <div className="mt-6 qrlife-card rounded-2xl p-4">
            <div className="font-semibold">Recent cards</div>
            <div className="mt-3 space-y-2 text-sm">
              {(data.recentCards ?? []).map((c) => (
                <div key={c.id} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                  <div className="font-medium">{c.name} <span className="text-white/50">(@{c.slug})</span></div>
                  <div className="text-white/60">Owner: {c.owner_email || c.user_id}</div>
                  <div className="text-white/60">Scans: {c.scans_count} · {c.active ? 'Active' : 'Inactive'}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}
