# Follow-up Templates by Trigger (QRLife Campaigns)

## Trigger A: No scan in 72h
**Condition:** `scan_count = 0` AND `first_sent_at >= 72h ago`

**DM template**
Hey {{name}} — quick bump in case this got buried.
I made your branded QRLife card draft so your team can claim it in seconds.
If helpful, I can resend the claim link + code.

**Email template**
Subject: Quick follow-up — your branded QR card draft is ready

Hi {{name}},
Just following up on my note. Your branded QRLife card draft is ready and can be claimed instantly with a private code.
Would you like me to resend the claim link and code?

Thanks,
MrChris

---

## Trigger B: Scanned but not claimed (48h)
**Condition:** `scan_count > 0` AND `claimed_at is blank` AND `first_scan_at >= 48h ago`

**DM template**
Hey {{name}} — looks like your card was viewed {{scan_count}} times.
Want me to transfer ownership now so your team can edit it and see live stats?
I can resend your private claim code.

**Email template**
Subject: Your QR card is getting scans — want ownership transfer?

Hi {{name}},
Your branded QR card has already received activity ({{scan_count}} scans / {{unique_scanners}} unique).
If you want, I can resend your private claim link/code so your team can take ownership and manage it directly.

Best,
MrChris

---

## Trigger C: High-interest unclaimed
**Condition:** `scan_count >= 3` AND `claimed_at is blank`

**DM template**
Great signal here — your card has {{scan_count}} scans already.
I can fast-track ownership handoff today so your team can update it and launch officially.
Want the claim code now?

---

## Trigger D: Claim started but not completed (24h)
**Condition:** `claim_started_at set` AND `claimed_at is blank` AND `claim_started_at >= 24h ago`

**DM template**
Looks like someone on your team started the claim flow.
Need me to re-send the claim link/code or help complete setup? Takes ~2 minutes.

**Email template**
Subject: Need help finishing your QR card claim?

Hi {{name}},
Looks like your team started the claim process but may not have completed it yet.
Happy to resend the link/code and help you finish setup.

---

## Trigger E: Claimed (onboarding)
**Condition:** `claimed_at set`

**DM template**
Nice — ownership transfer is complete ✅
Want me to set up campaign tags next so you can track scans by channel (IG, email, X) from day one?

**Email template**
Subject: Ownership complete — next step: campaign tracking

Hi {{name}},
Great news — your QR card ownership is complete.
If useful, I can configure campaign tracking tags so your team can break down scans by channel and timeframe.

---

## Trigger F: Claimed + inactive 7 days
**Condition:** `claimed_at set` AND `last_activity_at <= 7 days ago` AND `edit_count = 0`

**DM template**
Quick win idea: I can help publish your first optimized card version this week (headline + CTA + links) so your scan traffic converts better.
Want me to draft it for you?

---

## Trigger G: Multiple scans + no response after followup1
**Condition:** `scan_count >= 5` AND `followup_stage = followup1` AND no reply

**DM template**
Last ping from me — your card has steady interest ({{scan_count}} scans).
If timing’s bad, I can park this. If you want, I can still transfer ownership now and your team can launch later.
