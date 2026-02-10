Subject: QRLife Scope Reset + March 1 Delivery Priorities

Hi Tiny Screen Labs team,

I’m resetting QRLife priorities effective immediately so we can ship a stable web release target by March 1.

## 1) Priority outcome
A working web app alpha with reliable create -> scan -> claim flow, and measurable analytics.

## 2) Must-ship scope (P0)
1. Restore **Create New QR Type Picker** with 6 types:
   - Personal
   - Business
   - Influencer
   - Event/Campaign
   - Wi-Fi
   - URL Forward
2. Type-specific forms + validation
3. Wi-Fi QR builder (SSID/password/encryption)
4. URL-forward QR with scan tracking + redirect
5. Event/campaign attribution fields (placement/source/member)
6. Core analytics events:
   - create_started
   - create_completed
   - qr_published
   - qr_scanned
   - claim_started
   - claim_completed
   - redirect_fired
7. Admin reporting endpoint (scanned-not-claimed summary)

## 3) Environment constraints
- Keep current production domain behavior stable.
- Build/test in alpha environment first.
- No local-only dependencies for alpha.

## 4) Delivery cadence
- Daily written update (done / blocked / next)
- Every ticket must include acceptance criteria and test evidence
- Escalate blockers within 24 hours

## 5) Immediate request
Please confirm within 24 hours:
- Team owner per P0 item
- ETA per item
- Blockers/risk list
- First demo date

Thanks,
MrChris
