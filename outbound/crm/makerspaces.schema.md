# Makerspaces data model (Viking Voyage 2026)

Recommendation: create a **new source-of-truth file**:
- `outbound/crm/makerspaces.csv`

Rationale:
- A makerspace is an organization/location (semi-static). Events/tours/classes are separate records that can reference a makerspace via an ID.
- Keeps `events.csv` focused on time-bound items, while allowing multiple events/visits per makerspace.

## Proposed `makerspaces.csv` schema
Required columns (minimal viable):
- `makerspace_id` (string, stable slug/uuid; e.g., `dallas-makerspace-carrollton-tx`)
- `name`
- `city`
- `state` (2-letter)
- `country` (default `US`)
- `website` (canonical)

Strongly recommended:
- `source_urls` (pipe-separated; e.g., directory listing URLs)
- `category` (enum-ish): `makerspace|hackerspace|fab_lab|tool_library|community_shop|other`
- `public_access` (enum): `open_to_public|members_only|mixed|unknown`
- `day_pass_available` (`yes|no|unknown`)
- `intro_required` (`yes|no|unknown`) — orientation/safety class requirement
- `guest_policy_notes` (text)
- `key_tools` (pipe-separated): `3d_printing|laser|cnc|woodshop|metalshop|electronics|textiles|ceramics|welding|other`
- `rv_parking_notes` (text) — nearby options, on-site ok?, street parking limits
- `contact_email`
- `contact_form_url`
- `contact_phone`
- `social_instagram`
- `social_facebook`
- `lat` (decimal)
- `lon` (decimal)
- `geocode_precision` (`rooftop|parcel|street|city|unknown`)
- `address_1` / `address_2` / `postal_code` (optional; useful for precise nav)
- `hours` (text) or `hours_url`
- `membership_price_notes` (text)
- `last_verified` (YYYY-MM-DD)
- `status` (`active|closed|unknown`)
- `dupe_of_makerspace_id` (blank unless merged)

Voyage planning helpers:
- `route_month_hint` (multi; pipe-separated, e.g., `Mar|Apr`)
- `route_region_hint` (multi; e.g., `Gulf|TX|Southwest|Rockies|PNW|CA|Midwest|Southeast`)
- `priority` (`A|B|C`) — A = must-contact, B = nice-to-have, C = opportunistic
- `notes_internal`

## Companion tables (optional but powerful)
1) `route_segments.csv` (month -> states/region)
- `segment_id`, `month`, `region`, `states` (pipe-separated), `start_date`, `end_date`

2) `makerspace_visits.csv` (planned/actual visits; like events but visit-specific)
- `visit_id`, `makerspace_id`, `planned_date_start`, `planned_date_end`, `status` (`planned|requested|confirmed|completed|skipped`), `host_contact`, `requirements`, `outcome_notes`

## Deduping approach (practical)
- Normalize `name` (lowercase, strip punctuation, collapse whitespace, remove stopwords like “inc”, “makerspace”, “hackerspace”).
- Normalize `website` (force https, strip `www.`, strip trailing `/`, remove tracking params).
- Primary match key: normalized domain + city/state.
- Secondary: fuzzy match on normalized name within same metro area.
- Keep all discovered listing pages in `source_urls`.

## Filtering by route months/regions
Fast path (no lat/lon):
- Populate `route_month_hint` and/or `route_region_hint` from `state` using `route_segments.csv`.

Better path (with lat/lon):
- Store route as a polyline by month; filter makerspaces within N miles of that month’s line OR within bounding boxes around base-camp metros.
