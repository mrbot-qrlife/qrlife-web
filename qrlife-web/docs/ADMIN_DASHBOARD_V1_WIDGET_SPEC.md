# Admin Dashboard V1 Widget Spec

## Objective
Give founder/operator a single screen showing adoption, campaign conversion, and follow-up queue health.

## Widget 1: KPI Strip (24h)
- New users
- QRs created
- Scans
- Unique scanners
- Claims completed
- Scanned-not-claimed open

## Widget 2: Funnel
- Created -> Published -> Scanned -> Claim Started -> Claimed
- Show counts + conversion rates between steps

## Widget 3: Scanned Not Claimed (Top 10)
Columns:
- Brand/Lead
- Campaign
- Scans
- Unique
- First scan
- Last activity
- Follow-up stage
- Next follow-up due

## Widget 4: Trigger Counters
- No scan in 72h
- Scanned not claimed 48h
- High-interest unclaimed (>=3 scans)
- Claim started not completed 24h

## Widget 5: Channel Performance
- Scans by channel/source (IG, Email, X, Other)
- Claims by channel
- Conversion rate by channel

## Widget 6: Placement Performance (Event/Campaign)
- Scans by placement label (RV, car, bus, flyer, ad video, etc.)
- Claims by placement
- Best/worst performer

## Widget 7: Daily Ops Panel
- Follow-ups overdue
- Missing data fields count
- Blockers manually entered by operator

## Data Constraints
- Real values only
- Null/Unavailable shown explicitly
- Timestamp all metrics and show timezone (America/New_York)

## API Requirements (MVP)
- `GET /api/admin/summary`
- `GET /api/admin/scanned-not-claimed?limit=10`
- `GET /api/admin/triggers`
- `GET /api/admin/channel-performance`
- `GET /api/admin/placement-performance`
