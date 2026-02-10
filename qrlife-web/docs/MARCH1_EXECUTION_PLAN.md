# QRLife March 1 Execution Plan

## Constraints
- Keep current `qrlife.me` production untouched for now (WP Engine).
- Build and test new web flow in alpha environment.

## Environment Strategy
- Alpha web: `alpha.qrlife.me` (recommended) on Vercel
- Data/auth/storage: hosted Supabase project (non-local)
- No local-only dependencies in alpha path

## Milestones

### Milestone A (Now -> Feb 14): Foundation
- Confirm architecture map (frontend/backend/auth/storage/analytics)
- Deploy alpha environment
- Verify core auth + create + scan + claim works on alpha
- Restore QR type picker flow

### Milestone B (Feb 15 -> Feb 21): Core Product
- Implement all 6 QR types
- Implement template selector (cards) + border selector (Wi-Fi)
- Implement URL forward tracking
- Implement event/campaign attribution fields

### Milestone C (Feb 22 -> Feb 26): CRM + Campaign Engine
- CRM-to-card creation workflow
- Invite/claim code generation
- Outreach status tracking
- Triggered follow-up templates integration

### Milestone D (Feb 27 -> Mar 1): Launch Readiness
- Admin reporting portal (minimum viable)
- QA pass + bug burn-down
- Beta wave + issue triage
- Launch/no-launch gate review

## Launch Gate (Must pass)
- P0 bugs = 0
- Claim flow success >= 95% in test set
- Scan logging accuracy validated
- Daily metrics report running with real data
- Rollback plan documented
