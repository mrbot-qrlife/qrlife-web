/* eslint-disable @typescript-eslint/no-explicit-any */

import express from 'express';
import cors from 'cors';
import basicAuth from 'express-basic-auth';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const app = express();

const PORT = Number(process.env.PORT ?? 8787);
const HOST = process.env.HOST ?? '0.0.0.0';

const USERNAME = process.env.DASH_USER ?? 'admin';
const PASSWORD = process.env.DASH_PASS ?? '';

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

if (!PASSWORD) {
  // Safer default: refuse to run without explicit password when binding to network.
  console.error(
    '[openclaw-dashboard] Refusing to start: set DASH_PASS (and optionally DASH_USER).\n' +
      'Example: DASH_USER=admin DASH_PASS="change-me" npm run dev'
  );
  process.exit(1);
}

app.use(
  basicAuth({
    users: { [USERNAME]: PASSWORD },
    challenge: true,
    realm: 'OpenClaw Dashboard',
  })
);

app.get('/api/ping', (_req, res) => {
  res.json({ ok: true, now: new Date().toISOString() });
});

async function runOpenClaw(args: string[]) {
  // Call the installed OpenClaw CLI; rely on local config (~/.openclaw/openclaw.json)
  const { stdout } = await execFileAsync('openclaw', args, {
    timeout: 30_000,
    maxBuffer: 10 * 1024 * 1024,
  });
  return stdout;
}

app.get('/api/health', async (_req, res) => {
  try {
    const raw = await runOpenClaw(['health', '--json']);
    res.type('json').send(raw);
  } catch (err: any) {
    res.status(500).json({ ok: false, error: String(err?.message ?? err) });
  }
});

app.get('/api/status', async (_req, res) => {
  try {
    const raw = await runOpenClaw(['status', '--json', '--usage']);
    res.type('json').send(raw);
  } catch (err: any) {
    res.status(500).json({ ok: false, error: String(err?.message ?? err) });
  }
});

app.get('/api/cron/jobs', async (req, res) => {
  try {
    const includeAll = req.query.all === '1' || req.query.all === 'true';
    const raw = await runOpenClaw(['cron', 'list', '--json', ...(includeAll ? ['--all'] : [])]);
    res.type('json').send(raw);
  } catch (err: any) {
    res.status(500).json({ ok: false, error: String(err?.message ?? err) });
  }
});

app.get('/api/cron/runs', async (req, res) => {
  try {
    const id = String(req.query.id ?? '');
    const limit = String(req.query.limit ?? '50');
    if (!id) {
      res.status(400).json({ ok: false, error: 'Missing required query param: id' });
      return;
    }
    const raw = await runOpenClaw(['cron', 'runs', '--id', id, '--limit', limit]);
    // cron runs output is usually JSONL; return as text and let UI parse.
    res.type('text/plain').send(raw);
  } catch (err: any) {
    res.status(500).json({ ok: false, error: String(err?.message ?? err) });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`[openclaw-dashboard] listening on http://${HOST}:${PORT}`);
});
