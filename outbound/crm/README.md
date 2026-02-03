# CRM (local + share)

**Source of truth:** the Samba share copy:
- `/home/mrchris/share/openclaw-workspace/outbound/crm/`

OpenClaw will sync nightly and will always treat the share CRM as authoritative.

## Files
- `sponsors.csv`
- `people.csv`
- `events.csv`
- `influencers.csv`
- `exports/` (print/import exports like badge vendor lists)

## How to edit
- Edit the CSVs on the **share** using Google Sheets or Excel (import → edit → export back to CSV).
- Do not rename the header columns.

## Status conventions
- Sponsors: Prospect | Contacted | Warm | Negotiating | Won | Lost | Parked
- People: Target | Reached Out | Response | Scheduled | Met | Parked
- Events: Planned | Booked | Attending | Covered | Skipped

## Notes
- If you and the bot edit the same file at the same time, last write wins. If you’re about to do a big edit, tell the bot “hold CRM updates for 10 minutes.”
