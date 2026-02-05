# QRLife Web MVP — Spec (QR cards + hard-block bad domains)

## Decisions locked
- Bad/suspicious destination URLs: **HARD BLOCK** creation/update.
- QR cards: **public by default**.

## Primary user stories
1) As a user, I can **create a QR Card** with a name/title/bio and a set of social links.
2) As a user, I can **generate a QR code** that points to my public card URL.
3) As a user, I can **edit** the destination links on my card, and the system will **block** any link to a known-bad domain.
4) As a visitor, I can open a public card page and click the social links.

## MVP screens/pages
- Public:
  - `/c/{slug}` public card page
- Auth:
  - `/login`
- App (requires login):
  - `/app` dashboard list of cards
  - `/app/cards/new` create
  - `/app/cards/{id}` edit
  - `/app/cards/{id}/qr` download QR (PNG/SVG)

## Core data model
- users
- cards:
  - id, user_id, slug, name, job_title, bio, avatar_url, active, created_at, updated_at
- card_links:
  - id, card_id, kind (facebook|instagram|youtube|x|tiktok|linkedin|website|custom), url, label(optional), sort_order

## Validation + safety
- On create/update card_links.url:
  - normalize URL
  - extract hostname
  - check against bad-domain service/list
  - if flagged: reject with clear message

## Bad-domain check (implementation options)
- Option A: Google Safe Browsing API
- Option B: Custom blocklist in Google Sheet synced to DB/cache

## Deliverables
- Web app repo in workspace
- Deployed to staging
- Production deployment under qrlife.me (when DNS ready)
