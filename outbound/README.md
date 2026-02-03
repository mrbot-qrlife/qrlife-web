# OpenClaw Outputs (share-friendly)

This folder contains all files generated for MrChris.

## Directory layout
- `outbound/route/` — route drafts + itinerary docs
- `outbound/crm/` — CRM CSVs
  - `sponsors.csv`
  - `people.csv`
  - `events.csv`
  - `influencers.csv`
  - `exports/` — print/import exports (badge vendor lists, etc.)
- `outbound/sponsor-kit/` — one-pagers, tier sheets, outreach templates
- `outbound/social/` — social counts + tracking artifacts
- `outbound/assets/` — images/logos/templates used for thumbnails, PDFs, badges

## Convention
- Filenames: `kebab-case` and include year when relevant (e.g., `viking-voyage-2026-route.md`).
- CSVs are the source of truth for CRM/trackers.
- Anything intended to be shared externally goes in `outbound/` (not in `memory/`).
