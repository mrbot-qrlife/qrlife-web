/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getCronJobs, getCronRuns, getHealth, getPing, getStatus } from './api';

function formatTs(ts: any) {
  if (!ts) return '—';
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return String(ts);
  return d.toLocaleString();
}

function Badge({ color, children }: { color: 'green' | 'amber' | 'red' | 'cyan'; children: any }) {
  const bg =
    color === 'green'
      ? 'rgba(34,197,94,0.14)'
      : color === 'amber'
        ? 'rgba(245,158,11,0.16)'
        : color === 'red'
          ? 'rgba(239,68,68,0.16)'
          : 'rgba(34,211,238,0.16)';
  const border =
    color === 'green'
      ? 'rgba(34,197,94,0.30)'
      : color === 'amber'
        ? 'rgba(245,158,11,0.28)'
        : color === 'red'
          ? 'rgba(239,68,68,0.28)'
          : 'rgba(34,211,238,0.28)';

  return (
    <span
      className="pill"
      style={{ background: bg, borderColor: border, color: 'rgba(255,255,255,0.85)' }}
    >
      {children}
    </span>
  );
}

export default function App() {
  const [ping, setPing] = useState<{ ok: boolean; now: string } | null>(null);
  const [health, setHealth] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [jobs, setJobs] = useState<any>(null);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [runs, setRuns] = useState<any[] | null>(null);
  const [err, setErr] = useState<string>('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setErr('');
        const [p, h, s, j] = await Promise.all([getPing(), getHealth(), getStatus(), getCronJobs(true)]);
        if (cancelled) return;
        setPing(p);
        setHealth(h);
        setStatus(s);
        setJobs(j);

        const firstJobId = j?.result?.jobs?.[0]?.id ?? j?.jobs?.[0]?.id;
        setSelectedJobId((cur) => cur || firstJobId || '');
      } catch (e: any) {
        if (cancelled) return;
        setErr(String(e?.message ?? e));
      }
    }

    load();
    const t = setInterval(load, 15_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadRuns() {
      if (!selectedJobId) return;
      try {
        const r = await getCronRuns(selectedJobId, 200);
        if (cancelled) return;
        setRuns(r);
      } catch (e: any) {
        if (cancelled) return;
        setRuns(null);
        setErr(String(e?.message ?? e));
      }
    }
    loadRuns();
    const t = setInterval(loadRuns, 30_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [selectedJobId]);

  const cronJobs = useMemo(() => {
    return jobs?.result?.jobs ?? jobs?.jobs ?? [];
  }, [jobs]);

  const selectedJob = useMemo(() => cronJobs.find((j: any) => j.id === selectedJobId), [cronJobs, selectedJobId]);

  const runSeries = useMemo(() => {
    if (!runs) return [];
    const points: Array<{ t: number; ok: number; fail: number }> = [];

    // Expect JSONL entries with e.g. startedAtMs/endedAtMs/ok
    for (const r of runs) {
      const t =
        r?.endedAtMs ??
        r?.startedAtMs ??
        (typeof r?.endedAt === 'string' ? Date.parse(r.endedAt) : undefined) ??
        (typeof r?.startedAt === 'string' ? Date.parse(r.startedAt) : undefined);
      if (!t || Number.isNaN(t)) continue;
      points.push({ t, ok: r?.lastStatus === 'ok' || r?.ok === true ? 1 : 0, fail: r?.lastStatus === 'error' || r?.ok === false ? 1 : 0 });
    }

    points.sort((a, b) => a.t - b.t);

    // bucket into 30-minute bins
    const bucketMs = 30 * 60 * 1000;
    const buckets = new Map<number, { t: number; ok: number; fail: number }>();
    for (const p of points) {
      const b = Math.floor(p.t / bucketMs) * bucketMs;
      const cur = buckets.get(b) ?? { t: b, ok: 0, fail: 0 };
      cur.ok += p.ok;
      cur.fail += p.fail;
      buckets.set(b, cur);
    }

    return Array.from(buckets.values());
  }, [runs]);

  const gatewayOk = health?.ok === true;
  const channelSummary = status?.result?.channels ?? status?.channels ?? null;

  return (
    <div style={{ padding: 18, maxWidth: 1220, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div className="h1">OpenClaw Dashboard</div>
          <div className="sub">Prometheus-ish vibes • refreshes every 15s • secured via Basic Auth</div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Badge color={gatewayOk ? 'green' : 'red'}>{gatewayOk ? 'GATEWAY UP' : 'GATEWAY DOWN'}</Badge>
          <Badge color="cyan">{ping ? `server: ${new Date(ping.now).toLocaleTimeString()}` : 'server: —'}</Badge>
        </div>
      </div>

      {err && (
        <div className="panel" style={{ marginTop: 14, padding: 14, borderColor: 'rgba(239,68,68,0.35)' }}>
          <div style={{ fontWeight: 800, color: 'rgba(255,255,255,0.9)' }}>Error</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>{err}</div>
        </div>
      )}

      <div className="grid" style={{ marginTop: 14 }}>
        <div className="panel" style={{ gridColumn: 'span 3', padding: 14 }}>
          <div className="kpi">
            <div className="kpi-label">Model</div>
            <div className="kpi-value" style={{ fontSize: 16, lineHeight: 1.2 }}>
              {status?.result?.agents?.defaults?.model?.primary ?? status?.agents?.defaults?.model?.primary ?? '—'}
            </div>
          </div>
        </div>

        <div className="panel" style={{ gridColumn: 'span 3', padding: 14 }}>
          <div className="kpi">
            <div className="kpi-label">Cron jobs</div>
            <div className="kpi-value">{cronJobs.length}</div>
          </div>
        </div>

        <div className="panel" style={{ gridColumn: 'span 3', padding: 14 }}>
          <div className="kpi">
            <div className="kpi-label">WhatsApp</div>
            <div className="kpi-value" style={{ fontSize: 16 }}>
              {channelSummary?.whatsapp?.ok ? 'OK' : channelSummary?.whatsapp ? 'ISSUE' : '—'}
            </div>
            <div className="sub" style={{ marginTop: 4 }}>
              {channelSummary?.whatsapp?.status ?? ''}
            </div>
          </div>
        </div>

        <div className="panel" style={{ gridColumn: 'span 3', padding: 14 }}>
          <div className="kpi">
            <div className="kpi-label">Gateway URL</div>
            <div className="kpi-value" style={{ fontSize: 14, fontWeight: 800 }}>
              {health?.result?.url ?? health?.url ?? 'local'}
            </div>
            <div className="sub" style={{ marginTop: 4 }}>
              {gatewayOk ? 'Healthy' : 'Unhealthy'}
            </div>
          </div>
        </div>

        <div className="panel" style={{ gridColumn: 'span 7', padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 900 }}>Cron runs (selected job)</div>
              <div className="sub">
                {selectedJob ? `${selectedJob.name ?? selectedJob.id}` : 'Pick a job'}
              </div>
            </div>

            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.9)',
                borderRadius: 12,
                padding: '10px 12px',
                minWidth: 280,
              }}
            >
              {cronJobs.map((j: any) => (
                <option key={j.id} value={j.id}>
                  {(j.name ?? j.id).slice(0, 80)}
                </option>
              ))}
            </select>
          </div>

          <div style={{ height: 260, marginTop: 10 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={runSeries} margin={{ top: 10, right: 18, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="ok" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.06} />
                  </linearGradient>
                  <linearGradient id="fail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="t"
                  tickFormatter={(v) => new Date(v).toLocaleTimeString()}
                  stroke="rgba(255,255,255,0.35)"
                />
                <YAxis allowDecimals={false} stroke="rgba(255,255,255,0.35)" />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15,23,42,0.92)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 14,
                  }}
                  labelFormatter={(v) => new Date(Number(v)).toLocaleString()}
                />
                <Area type="monotone" dataKey="ok" stroke="#22c55e" fill="url(#ok)" />
                <Area type="monotone" dataKey="fail" stroke="#ef4444" fill="url(#fail)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel" style={{ gridColumn: 'span 5', padding: 14 }}>
          <div style={{ fontWeight: 900 }}>Selected job details</div>
          <div className="sub">Next/last run snapshots (best-effort)</div>

          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
            <div className="panel" style={{ padding: 12, background: 'rgba(255,255,255,0.03)' }}>
              <div className="kpi-label">Job ID</div>
              <div style={{ fontWeight: 800, marginTop: 4, wordBreak: 'break-all' }}>{selectedJob?.id ?? '—'}</div>
            </div>

            <div className="panel" style={{ padding: 12, background: 'rgba(255,255,255,0.03)' }}>
              <div className="kpi-label">Schedule</div>
              <div style={{ fontWeight: 800, marginTop: 4 }}>{selectedJob?.schedule?.kind ? `${selectedJob.schedule.kind}` : '—'}</div>
              <div className="sub" style={{ marginTop: 6, wordBreak: 'break-word' }}>{selectedJob?.schedule?.expr ?? selectedJob?.schedule?.at ?? ''}</div>
            </div>

            <div className="panel" style={{ padding: 12, background: 'rgba(255,255,255,0.03)' }}>
              <div className="kpi-label">Last run</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 4 }}>
                <div style={{ fontWeight: 900 }}>{selectedJob?.lastStatus ?? '—'}</div>
                <Badge color={selectedJob?.lastStatus === 'ok' ? 'green' : selectedJob?.lastStatus ? 'red' : 'amber'}>
                  {selectedJob?.enabled === false ? 'DISABLED' : 'ENABLED'}
                </Badge>
              </div>
              <div className="sub" style={{ marginTop: 6 }}>{formatTs(selectedJob?.lastRunAtMs ?? selectedJob?.lastRunAt)}</div>
            </div>

            <div className="panel" style={{ padding: 12, background: 'rgba(255,255,255,0.03)' }}>
              <div className="kpi-label">Next run</div>
              <div style={{ fontWeight: 900, marginTop: 4 }}>{formatTs(selectedJob?.nextRunAtMs ?? selectedJob?.nextRunAt)}</div>
            </div>
          </div>
        </div>

        <div className="panel" style={{ gridColumn: 'span 12', padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ fontWeight: 900 }}>Raw snapshot</div>
            <div className="sub">Debug view (so you can verify what the CLI is returning)</div>
          </div>
          <pre
            style={{
              marginTop: 10,
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 14,
              padding: 12,
              overflowX: 'auto',
              color: 'rgba(255,255,255,0.75)',
              fontSize: 12,
              maxHeight: 220,
            }}
          >
            {JSON.stringify({ health, status, jobs: cronJobs.slice(0, 10), runs: runs?.slice(0, 5) }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
