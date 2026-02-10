# Tonight Task Pack (Prepared for Morning)

## 1) Product Requirements Pack
- [x] QR Types + Templates + Analytics spec
- [x] March 1 execution plan

## 2) Engineering Ticket Seeds (ready to copy into PM tool)

### P0-1 Restore Create Flow Type Picker
- Add pre-create type selection screen with 6 choices
- Wire navigation to type-specific forms

### P0-2 Type-Specific Validation
- Personal/business/influencer/event/wifi/url-forward validation rules

### P0-3 Wi-Fi QR Builder
- SSID/password/encryption + QR payload generation
- Wi-Fi border gallery placeholder

### P0-4 URL Forward QR
- Destination URL validation
- Redirect endpoint with scan logging event

### P0-5 Campaign Attribution Fields
- Add source/placement/member labels for event_campaign QR

### P0-6 Analytics Events
- create_started, create_completed, qr_published, qr_scanned, claim_started, claim_completed, redirect_fired

### P0-7 Admin Report Endpoint (MVP)
- scanned_not_claimed summary endpoint
- trigger counts for follow-ups

## 3) Morning Checklist
- Confirm alpha domain and env vars
- Smoke test create->scan->claim for each QR type
- Start top-10 sponsor outreach using prepared queue
