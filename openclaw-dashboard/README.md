# OpenClaw Dashboard (Prometheus-ish)

Local web dashboard for OpenClaw status + cron health, designed for LAN access.

## Features
- Gateway up/down + channel snapshot (via `openclaw health/status --json`)
- Cron job list + selected job details
- Basic graphs of cron runs (OK vs FAIL buckets)
- Basic Auth login

## Quick start (dev)

```bash
cd openclaw-dashboard
npm install

# REQUIRED (do not leave as change-me)
export DASH_USER=admin
export DASH_PASS='set-a-strong-password'

npm run dev
```

- Web UI: http://<host>:5173
- API server: http://<host>:8787

## Notes
- This dashboard shells out to the local `openclaw` CLI, so it must run on the same machine as OpenClaw.
- Auth is Basic Auth (simple + works well on LAN). For internet exposure, put it behind a real reverse proxy + TLS.
