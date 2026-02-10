# QRLife Spec — QR Types, Templates, and Analytics

## Goal
Restore and formalize the QR type picker in Create Flow so users choose intent first, then generate the right QR + landing experience.

## QR Types (Phase 1)
1. Personal Card
2. Business Card
3. Influencer Card
4. Event / Marketing Campaign Card
5. Wi-Fi QR
6. URL Forward QR

---

## 1) Personal Card
**Use case:** family/friends, trusted circle.

### Required fields
- Display name
- Profile image (optional)
- Phone
- Email (optional)
- Social links
- Address (optional)

### Template style
- Clean, warm, personal visual language
- "homie" vibe, minimal corporate styling

### Analytics
- scans_total
- unique_scanners
- first_scan_at / last_scan_at

---

## 2) Business Card
**Use case:** professional networking / work identity.

### Required fields
- Name
- Title
- Company
- Business phone
- Business email
- Website
- LinkedIn

### Template style
- Corporate, clean, high-contrast

### Analytics
- scans_total
- unique_scanners
- CTR on CTA buttons (website, call, email)

---

## 3) Influencer Card
**Use case:** creator profile, fast social follow conversion.

### Required fields
- Handle/name
- Primary platform
- Link hub
- Contact/booking email

### Template style
- Dynamic, bold, fun backgrounds

### Analytics
- scans_total
- unique_scanners
- link clicks by platform
- follows proxy (where available)

---

## 4) Event / Marketing Campaign Card
**Use case:** temporary events, team competitions, campaign attribution.

### Required fields
- Campaign name
- Campaign owner
- Start/end date
- Landing target type (QRLife card)
- UTM / tracking tags (source, medium, campaign)

### Optional fields
- Team member code (for leaderboard)
- Placement label (RV, car, bus, flyer, ad video)

### Template style
- Campaign-branded; can vary per event

### Analytics (critical)
- scans_total
- unique_scanners
- scans_by_variant (placement/source/person)
- claims_started / claims_completed
- conversion_rate

---

## 5) Wi-Fi QR
**Use case:** quick Wi-Fi join flow.

### Required fields
- SSID
- Password
- Encryption (default WPA2, options: WPA/WPA2/WPA3/None)
- Hidden network toggle

### Render
- QR content format for Wi-Fi payload
- No profile landing card required

### Style system
- Border/frame gallery ("Scan for Wi-Fi", mascot/router frames, etc.)

### Analytics
- scans_total
- unique_scanners

---

## 6) URL Forward QR
**Use case:** redirect to a URL while tracking scans.

### Required fields
- Destination URL (validated)

### Behavior
- Scan -> QRLife logs event -> 302 redirect to destination

### Analytics
- scans_total
- unique_scanners
- redirects_total
- top ref contexts (if available)

---

## Create Flow UX (must restore)
1. Tap: **Create New QR**
2. **Type Picker Screen** (6 options)
3. **Type-specific form**
4. **Template/Style selection** (card templates or Wi-Fi borders)
5. **Preview**
6. **Publish**
7. **Share + download QR**

---

## Data Model Additions
- qr_type ENUM: personal|business|influencer|event_campaign|wifi|url_forward
- template_id (nullable)
- border_id (wifi only)
- campaign_id (event_campaign only)
- destination_url (url_forward only)
- wifi_ssid / wifi_encryption / wifi_hidden (wifi only)

---

## Acceptance Criteria (Phase 1)
- User sees QR type picker before creation
- All 6 types can be created successfully
- Type-specific validation works
- Published QR scans successfully
- Analytics events fire for all QR types
- Event/Campaign type supports attribution labels
