/* eslint-disable @typescript-eslint/no-explicit-any */

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8787';

async function apiGet(path: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res;
}

export async function getPing() {
  return (await (await apiGet('/api/ping')).json()) as { ok: boolean; now: string };
}

export async function getHealth() {
  return (await (await apiGet('/api/health')).json()) as any;
}

export async function getStatus() {
  return (await (await apiGet('/api/status')).json()) as any;
}

export async function getCronJobs(all = false) {
  const q = all ? '?all=true' : '';
  return (await (await apiGet(`/api/cron/jobs${q}`)).json()) as any;
}

export async function getCronRuns(jobId: string, limit = 200) {
  const res = await apiGet(`/api/cron/runs?id=${encodeURIComponent(jobId)}&limit=${limit}`);
  const text = await res.text();
  // JSONL → objects
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return { parseError: true, raw: l };
      }
    });
}
