# Notion Database Scope Audit — What Actually Integrates into WAVE

**Version:** 1.0 | **Date:** 2026-07-16 | **Author:** NEXUS
**Method:** Live query of all 3 Notion databases via API. Not assumptions — actual data audit.

---

## Executive Summary

| Database | Total Records | WAVE-Relevant | NOT WAVE Scope |
|----------|--------------|---------------|----------------|
| DB1: Agent Build Context | 47 pages | **0** | 47 |
| DB2: Launch Assets | 132 records | **107** (81%) | 25 (19%) |
| DB3: Build Tracker | 646 records (602 unique) | **503** (84%) | 99 (16%) |
| **TOTAL** | **825** | **610** (74%) | **215** (26%) |

---

## DB1: Agent Build Context (47 pages) — 0 WAVE-relevant

**Verdict: REFERENCE ONLY. No sync needed.**

All 47 pages are static reference documents — brand guidelines, product definitions, positioning, personas, journey maps, competitive landscape. They don't change state, have no status to track, don't feed WAVE workflows.

Notable: There are TWO sets of pages 00-20 (likely from different versions). Both are reference material.

3 WAVE-specific pages at the bottom (Product Spec, BRD, Intelligence Layer) are already in GitHub repo.

**Integration pattern:** WAVE deep-links to these pages (NOTION-016), doesn't sync their content.

---

## DB2: Launch Assets (132 records) — 107 WAVE-relevant

### ✅ WAVE-RELEVANT (107)

| Phase | Category | Count | WAVE Module |
|-------|----------|-------|-------------|
| ASSESS | Diagnostic Specs | 8 | Mod 3 (Templates) |
| ASSESS | Question Banks | 8 | Mod 3 |
| ASSESS | Report Templates | 4 | Mod 3 |
| ASSESS | Diagnostic Ops | 10 | Mod 3 + Mod 8 |
| ASSESS | Assessment Platform | 4 | Infrastructure |
| PROMOTE | Email Sequences | 13 | Mod 4 (Distribution) |
| PROMOTE | Promotional | 4 | Mod 3 |
| PROMOTE | Event Ops | 1 | Mod 7 (Events) |
| ENGAGE | Webinar (Deck + Ops) | 11 | Mod 7 |
| ENGAGE | Workshop (Materials + Ops) | 10 | Mod 7 |
| RESOLVE | Advisory (Delivery + Proposals) | 14 | Mod 7/9 |
| SUSTAIN | Council + Retainer | 10 | Mod 7/9 |
| ATTRACT | Newsletter | 5 | Mod 4 |
| ATTRACT | Podcast | 5 | POD-001+ |
| OPS | Report Tpl + Diagnostic Ops | 2 | Mod 3 |
| | **Total** | **107** | |

### ❌ NOT WAVE SCOPE (25)

| Category | Count | Reason |
|----------|-------|--------|
| Web Pages | 9 | External website (CD-6 boundary) |
| Search Materials | 6 | VISTA scope (outbound sales) |
| LinkedIn | 4 | External social media |
| Internal Ops/Legal/ICP | 4 | Reference docs, not operational |
| Brand Foundation | 1 | Reference PDF |
| Event Graphics | 1 | PNG signage — not trackable asset |
| | **25** | |

---

## DB3: Build Tracker (646 records → 602 unique) — 503 WAVE-relevant

### ✅ WAVE-RELEVANT (~503 after dedup)

| Category | Count | WAVE Module |
|----------|-------|-------------|
| Program Deliverable | 124 | Programs (PROG) |
| Report Template | 100 | Mod 3 |
| Product Brochure | 48 | Mod 3 |
| Sales Playbook | 25 | Mod 3 |
| Email Sequence | 25 | Mod 4 |
| Module Deck | 20 | Mod 7 / Programs |
| Workbook + Workbook/Event | 20 | Programs |
| Sales Infrastructure | 11 | Mod 3 |
| One-Pager | 8 | Mod 3 |
| Online Course | 8 | LMS |
| Event / Webinar | 5 | Mod 7 |
| B2C Portal + Marketing | 9 | LMS / Mod 5 |
| Sales Deck | 4 | Mod 3 |
| FAQ | 4 | Mod 3 |
| Platform Spec | 3 | Infrastructure |
| Pricing | 3 | Mod 9 |
| ROI Calculator | 1 | Tools |
| Journey Asset | 1 | Mod 5 |
| No-category (WAVE content)* | 128 | Mixed |
| | **~503** | |

*128 no-category records in Phase 4 (programs, 45), Phase 3 (commercial, 22), Phase 2 (product, 12), Phase 6 content assets (newsletters 5, case studies 10, research 4), Phase 1 (2) — all WAVE-relevant.

### ❌ NOT WAVE SCOPE (~99 after dedup)

| Category / Phase | Count | Reason |
|-----------------|-------|--------|
| Website (categorized) | 62 | External website (CD-6) |
| No-category + Phase 5 | 21 | Also website content |
| Brand & Identity | 8 | Design assets |
| Legal / Ops | 8 | Legal/compliance docs |
| | **~99** | |

### DB3 Data Quality Issues

| Issue | Detail | Recommendation |
|-------|--------|---------------|
| 44 duplicate records | Same name appears 2-4 times | Dedup by name before sync |
| Status: 646/646 EMPTY | No status tracking exists | Don't import. WAVE defines own status. |
| Priority: 646/646 EMPTY | Not populated | Don't import. |
| Sub-Category: 646/646 EMPTY | Not populated | Ignore. |
| Product: 422/646 EMPTY | 65% missing | Import when present, nullable. |

---

## Impact on Existing Specs

### What changes:
1. **NOTION-004:** Should filter to 107 assets (not 132). Add WHERE clause excluding Web Pages, LinkedIn, Search, Legal, Brand categories.
2. **NOTION-005:** Should import ~503 unique records (not 291). Re-run dedup with category filtering.
3. **NOTION-006:** Add exclusion rules for non-WAVE categories on ongoing sync.
4. **Supabase re-seeding needed:** Current 132 assets → should be 107. Current 291 build_tracker → should be ~503.

### What doesn't change:
- All 38 new tickets (LMS/Tools/Programs/Podcast) — still needed
- All 7 existing ticket amendments — still valid
- Phase 1/2/3 build plan — unchanged
- Grand total: 771 tickets, ~2,449h

---

## What WAVE Integrates vs. What It Doesn't

**WAVE integrates (metadata + deep-link):**
- 107 launch assets from DB2
- ~503 build deliverables from DB3
- Deep-links to DB1 reference pages (no content sync)

**WAVE does NOT integrate:**
- 215 non-WAVE records (external website, social, legal, search)
- DB1 page content (reference docs — deep-link only)
- Empty fields (Status, Priority, Sub-Category from DB3)

**The principle:** WAVE tracks operational assets it needs to manage. Reference material, external channel content, and legal docs stay in Notion with deep-links from WAVE.

---

*Audit by NEXUS. Live Notion API queries on 2026-07-16.*
