# QRLife Web — Progress

Last updated: 2026-02-05

## MVP Checklist (web + staging deploy)

### UI / UX
- [x] QRLife theme (colors/gradient/card styling)
- [x] Dashboard skeleton (`/app`) with QR card tiles (mock data)
- [x] New card editor skeleton (`/app/cards/new`) (mock)
- [ ] Edit existing card screen (`/app/cards/{id}`)
- [ ] Add social link modal (Facebook/IG/YT/X/etc.)

### Core functionality
- [ ] Data storage (DB layer) for cards + links (local first, Supabase later)
- [ ] Public card page: `/c/{slug}` (public by default)
- [ ] QR download: PNG/SVG
- [ ] Scan tracking endpoint + counters (scans + last scanned)

### Safety
- [x] Safe Browsing integration scaffold (WARN mode when key missing)
- [ ] Safe Browsing HARD BLOCK (turn on when Google API key is provided)

### Auth
- [ ] Email/password login
- [ ] Google login

### Deploy
- [ ] Staging deploy (Vercel)
- [ ] Production deploy under qrlife.me (DNS)

## Current status
- We have a working, themed UI skeleton and two key pages live in the repo.
- Next focus: storage + public card page + QR download + scan tracking.

## Percent complete (rough)
- Completed: 4 / 15 items (~27%)
