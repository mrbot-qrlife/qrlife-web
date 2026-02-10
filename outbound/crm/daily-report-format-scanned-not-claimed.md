# Daily Report Format — Scanned but Not Claimed

Run daily at 9:00 AM ET.
Use only real numbers from campaign/scan logs.

## Subject
QRLife Daily: Scanned Not Claimed ({{report_date}})

## 1) Snapshot (today)
- Campaigns sent: {{campaigns_sent_today}}
- Total active campaigns: {{active_campaigns}}
- Total scans (24h): {{scans_24h}}
- Unique scanners (24h): {{unique_scanners_24h}}
- Claims completed (24h): {{claims_completed_24h}}
- **Scanned but not claimed (open): {{scanned_not_claimed_open}}**

## 2) Priority follow-up list (top 10)
For each lead:
- Brand/Lead: {{brand_or_person}}
- Campaign: {{campaign_name}}
- Scans: {{scan_count}} (Unique: {{unique_scanners}})
- First scan: {{first_scan_at}}
- Last activity: {{last_activity_at}}
- Follow-up stage: {{followup_stage}}
- Next action due: {{next_followup_at}}
- Reason: {{second_reachout_reason}}

## 3) Triggers fired today
- No scan in 72h: {{trigger_no_scan_72h_count}}
- Scanned not claimed 48h: {{trigger_scanned_unclaimed_48h_count}}
- High-interest unclaimed (>=3 scans): {{trigger_high_interest_count}}
- Claim started not completed 24h: {{trigger_claim_started_not_completed_count}}

## 4) Behind schedule / risks
- Follow-ups overdue: {{followups_overdue_count}}
- Leads with scans but no follow-up set: {{missing_next_followup_count}}
- Data gaps (if any): {{data_gap_notes}}

## 5) Today’s execution plan
- Must-send follow-ups: {{must_send_count}}
- Priority brands: {{priority_brand_list}}
- Owner: MrChris

## 6) Notes
- If a metric is unavailable, print: "Unavailable (no source data)".
- Never estimate numbers.

---

## Optional CSV extract for daily report
`outbound/crm/daily-scanned-not-claimed-{{YYYY-MM-DD}}.csv`

Columns:
campaign_id,brand_or_person,campaign_name,scan_count,unique_scanners,first_scan_at,last_scan_at,claimed_at,followup_stage,next_followup_at,second_reachout_reason,status
