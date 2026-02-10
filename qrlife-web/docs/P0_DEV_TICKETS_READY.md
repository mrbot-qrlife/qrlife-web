# QRLife P0 Dev Tickets (Ready)

## P0-1: Restore Create Flow Type Picker
**Goal:** User must select QR type before form.

**Scope**
- Add screen: Personal, Business, Influencer, Event/Campaign, Wi-Fi, URL Forward
- Route each type to its form

**Acceptance Criteria**
- Type picker appears on every Create New QR flow
- Each option navigates correctly
- Back navigation preserves selection
- Analytics event: `create_started` includes `qr_type`

---

## P0-2: Type-Specific Validation Engine
**Goal:** Prevent invalid QR creation data.

**Rules**
- Wi-Fi: SSID required, encryption enum, password conditional
- URL Forward: valid absolute URL only
- Personal/Business/Influencer/Event: required fields per spec

**Acceptance Criteria**
- Inline validation errors shown before publish
- Invalid data never reaches publish endpoint
- Unit tests for each type validator

---

## P0-3: Wi-Fi QR Builder + Border Selector
**Goal:** Build working Wi-Fi QR generator.

**Scope**
- Fields: SSID, password, encryption (WPA2 default), hidden toggle
- Generate Wi-Fi QR payload
- Border/frame selector (MVP gallery)

**Acceptance Criteria**
- Generated Wi-Fi QR joins network on iOS/Android scan flows
- Border selection persists on save/export
- Analytics event: `qr_published` with `qr_type=wifi`

---

## P0-4: URL Forward QR with Tracking
**Goal:** Track scans then redirect.

**Scope**
- URL input + validation
- Redirect endpoint logs scan event then 302

**Acceptance Criteria**
- Scan triggers event + redirect under 500ms p95
- Invalid destination blocked at create time
- Analytics event: `redirect_fired` includes destination hostname

---

## P0-5: Event/Campaign Attribution
**Goal:** Track placement/source performance.

**Scope**
- Fields: campaign_name, placement_label, source, medium, campaign, member_code(optional)

**Acceptance Criteria**
- Attribution fields saved with QR
- Reporting can group by placement/source/member
- Event scans increment correct attribution bucket

---

## P0-6: Core Analytics Event Pipeline
**Goal:** Capture truth-source metrics.

**Events**
- `create_started`, `create_completed`, `qr_published`, `qr_scanned`, `claim_started`, `claim_completed`, `redirect_fired`

**Acceptance Criteria**
- All events timestamped and queryable
- Daily aggregate query returns real counts
- Missing event paths covered by tests

---

## P0-7: Admin Reporting Endpoint (MVP)
**Goal:** Surface scanned-not-claimed pipeline.

**Scope**
- Endpoint returning: campaigns sent, scans(24h), unique scanners, claims completed, scanned-not-claimed open, trigger counts

**Acceptance Criteria**
- Endpoint powers daily report format exactly
- Top 10 unclaimed campaigns sortable by scans/recency
- No estimated values; null when unavailable
