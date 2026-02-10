# CRM (local)

This folder is the source-of-truth CRM for:
- sponsors/brands
- people-to-meet ("100 list")
- events/stops

Send updates via WhatsApp in plain text (or voice). I will append/normalize into these CSVs.

## Files
- `sponsors.csv`
- `people.csv`
- `events.csv`
- `campaigns.schema.csv` (campaign tracking schema for QRLife claim/scan workflow)
- `campaigns.sample.csv` (example row)
- `followup-templates-by-trigger-2026-02-10.md`
- `daily-report-format-scanned-not-claimed.md`

## Status conventions
- Sponsors: Prospect | Contacted | Warm | Negotiating | Won | Lost | Parked
- People: Target | Reached Out | Response | Scheduled | Met | Parked
- Events: Planned | Booked | Attending | Covered | Skipped
