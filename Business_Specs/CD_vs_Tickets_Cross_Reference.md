# CD Instructions vs 733 WAVE Tickets — Cross-Reference Analysis

**Version:** 1.0 | **Date:** 2026-07-16 | **Author:** NEXUS
**Input:** 14 CD instruction files (Notion content production specs) + 733 existing WAVE tickets
**Purpose:** Determine which existing tickets need updating, what's new, and what gaps exist

---

## Executive Summary

The 14 CD files define **content deliverables** produced by Notion AI (sales decks, email sequences, training modules, research reports, etc.). The 733 WAVE tickets define **platform features** built by Trae (UI components, APIs, database schemas).

**Key finding: They are complementary layers, not overlapping.** WAVE is the machine; CDs are the fuel. The existing 733 tickets cover ~75% of the platform infrastructure needed to support CD content delivery. The remaining 25% represents gaps — mostly around content viewing, B2C course delivery (LMS features), interactive tools, and program delivery management.

**Totals from 14 CDs:**
- 79 Notion AI chat sessions required
- ~130+ distinct content deliverables
- 7 content categories: Sales, Diagnostic, Communication, Training, Program, Research, B2C

---

## 1. CD Inventory — What Notion Is Building

| CD | Title | Chats | Deliverables | Content Type |
|----|-------|-------|-------------|--------------|
| CD-1 | Sales Decks | 3 | 3 slide decks (20+18+16 slides) | Sales collateral |
| CD-2 | Sales Tools | 6 | 6 interactive documents | Sales enablement |
| CD-3 | Diagnostic Delivery | 4 | 2 report templates + 2 workshop decks | Diagnostic output |
| CD-4 | Email Sequences | 5 | 36 email/communication templates | Outreach content |
| CD-5 | Council & Advisory | 5 | 7 documents + 2 discovery scripts | Advisory infrastructure |
| CD-6 | Website Copy | 5 | 5 website pages | External content |
| CD-7a | Training Modules 1-5 | 5 | 5 facilitator guides (2hr each) | Training content |
| CD-7b | Training Modules 6-10 | 5 | 5 facilitator guides (1.5-3hr each) | Training content |
| CD-8 | Program Blueprints | 8 | 8 program delivery documents | Program content |
| CD-9 | SHIFT Module Decks | 10 | 10 slide decks (25-30 slides each) | Program content |
| CD-10 | Workbooks + Capstones + Webinars | 8 | 3 workbooks + 3 capstones + 5 webinar decks | Program materials |
| CD-11 | Research + Cases + Newsletter | 8 | 4 reports + 10 cases + 1 template + 4 issues | Thought leadership |
| CD-12 | Podcast Framework | 3 | 1 architecture doc + 42 episode briefs | Content engine |
| CD-13 | B2C Course Content | 4 | 4 complete courses (3-4 lessons each) | B2C learning |
| **Total** | | **79** | **~130+** | |

---

## 2. Module-by-Module Mapping

### Module 1: Dashboard (DASH-001 to DASH-036, 36 tickets)
**CD relevance:** INDIRECT — Dashboard displays metrics about CD deliverable progress
**Coverage:** ✅ ADEQUATE
- DASH widgets show build_tracker progress (NOTION-008)
- Asset pipeline overview (NOTION-009) shows content production status
- No changes needed — dashboard reflects data, not content

### Module 2: Content Calendar (CAL-001 to CAL-044, 44 tickets)
**CD relevance:** HIGH — Calendar schedules when CD content gets produced/published
**Coverage:** ✅ ADEQUATE
- Multi-view system handles content scheduling across all CD types
- Content types need extending to include: `podcast_episode`, `research_report`, `case_study`, `newsletter_issue`, `b2c_course`, `training_module`
- **Update needed:** CAL content_type enum to include CD-specific types

### Module 3: Template Library (TPL-001 to TPL-066, 66 tickets)
**CD relevance:** HIGH — Stores CD deliverables as assets
**Coverage:** ✅ MOSTLY ADEQUATE
- Template storage handles document-based CD deliverables
- Brand consistency scoring (TPL) aligns with CD brand guidelines
- **Gap:** No rich-content viewer for Notion page body content. CDs store content IN Notion pages; WAVE stores metadata. Need a "View in Notion" deep link or embedded viewer.
- **Update needed:** Add `notion_page_url` field to asset detail view for deep-linking

### Module 4: Distribution Engine (DIST-001 to DIST-066, 66 tickets)
**CD relevance:** CRITICAL — Distributes CD-4 email sequences, CD-11 newsletter, CD-10 webinar invites
**Coverage:** ✅ STRONG
- Email sequence builder directly supports CD-4's 36 templates
- Mailing list segmentation supports persona-based distribution (CD-4's 4 personas × 5 stages)
- **Gap:** Newsletter-specific features (issue numbering, subscriber preference management, template structure per CD-11 spec)
- **Update needed:** Add newsletter-specific metadata to distribution schema

### Module 5: B2C Journey Engine (JOUR-001 to JOUR-092, 92 tickets)
**CD relevance:** HIGH — Delivers B2C courses (CD-13), tracks diagnostic-triggered cross-sell
**Coverage:** ⚠️ PARTIAL — MAJOR GAP
- Journey builder handles marketing automation well
- Diagnostic-triggered cross-sell (JOUR-003) aligns with CD-2's cross-sell playbook
- **MAJOR GAP:** CD-13 defines 4 complete B2C courses with video scripts, readings, exercises, quizzes. Module 5 has NO LMS (Learning Management System) features:
  - No video playback/embedding
  - No quiz/assessment engine
  - No lesson progress tracking
  - No certificate generation
  - No course enrollment/completion tracking
- **New tickets needed:** ~15-20 LMS-specific tickets (see Section 4)

### Module 6: Content Repurposing (REP-001 to REP-078, 78 tickets)
**CD relevance:** MODERATE — Repurposes CD research into other formats
**Coverage:** ✅ ADEQUATE
- Derivative type system handles: research → newsletter, podcast → clips, webinar → blog
- **Update needed:** Add derivative types for: `podcast_episode`, `research_report_excerpt`, `case_study_adaptation`

### Module 7: Events & Registration (EVT-001 to EVT-102, 102 tickets)
**CD relevance:** HIGH — Manages webinars (CD-10), workshops (CD-3/8), programs (CD-8/9)
**Coverage:** ✅ STRONG
- EVT-081 to EVT-085 covers Council-specific events (CD-5)
- Registration, pricing, waitlist support all event types
- **Gap:** Program delivery management (multi-session programs like SHIFT-QUEST with 12 sessions). Current EVT handles individual events, not multi-session program enrollment.
- **Update needed:** Add "Program" event type with multi-session support

### Module 8: Analytics & Intelligence (ANA-001 to ANA-105, 105 tickets)
**CD relevance:** MODERATE — Measures CD content performance
**Coverage:** ✅ ADEQUATE
- Content performance analytics (ANA-029 to ANA-036) tracks engagement
- Revenue intelligence (ANA-015 to ANA-023) tracks CD-driven revenue
- **Update needed:** Add CD-specific KPIs (course completion rate, podcast downloads, newsletter open rate)

### Module 9: Pricing & Product Catalog (CAT-001 to CAT-078, 78 tickets)
**CD relevance:** HIGH — CD pricing defines the catalog entries
**Coverage:** ✅ STRONG
- Product catalog directly maps to CD pricing (diagnostics, programs, advisory tiers, B2C courses)
- Bundle architecture (CAT-021 to CAT-030) maps to CD bundle specs
- Cross-sell matrix (CAT-031 to CAT-042) maps to CD-2's cross-sell playbook
- **Update needed:** Add B2C course products ($199-$299) and podcast as free products

### Module 10: Notion Integration (NOTION-001 to NOTION-015, 15 tickets)
**CD relevance:** CRITICAL — Syncs CD metadata from Notion to WAVE
**Coverage:** ⚠️ NEEDS EXTENSION
- Current sync covers Launch Assets DB + Build Tracker DB
- CD files instruct Notion AI to create rows in Build Tracker DB with content in page bodies
- **Gap:** No sync of Notion PAGE BODY content — only metadata syncs
- **Update needed:** NOTION-016+ for page body content sync or deep-link strategy

---

## 3. Coverage Scorecard

| CD | Primary Module | Coverage | Status | Action |
|----|---------------|----------|--------|--------|
| CD-1 Sales Decks | Mod 3 (Templates) | 80% | ✅ | Add Notion deep-link |
| CD-2 Sales Tools | Mod 3 + Mod 5 + Mod 9 | 70% | ⚠️ | New: ROI Calculator UI |
| CD-3 Diagnostic Delivery | Mod 8 (Analytics) | 75% | ✅ | Add report template viewer |
| CD-4 Email Sequences | Mod 4 (Distribution) | 95% | ✅ | Newsletter extension |
| CD-5 Council & Advisory | Mod 7 (Events) + Mod 9 | 85% | ✅ | Advisory service menu page |
| CD-6 Website Copy | NONE (external) | 0% | ℹ️ | Intentional — not WAVE scope |
| CD-7a/b Training Modules | Mod 7 (Events) | 60% | ⚠️ | Training delivery tracking |
| CD-8 Program Blueprints | Mod 7 + Mod 9 | 70% | ⚠️ | Multi-session program mgmt |
| CD-9 SHIFT Module Decks | Mod 7 (Events) | 60% | ⚠️ | Same as CD-7a/b |
| CD-10 Workbooks/Webinars | Mod 3 + Mod 7 | 70% | ⚠️ | Capstone submission tracking |
| CD-11 Research/Newsletter | Mod 3 + Mod 4 | 80% | ✅ | Newsletter template structure |
| CD-12 Podcast | Mod 2 + Mod 6 | 50% | ⚠️ | Podcast episode tracking |
| CD-13 B2C Courses | Mod 5 (Journey) | 30% | 🔴 | LMS features needed |

---

## 4. Gap Analysis — New Tickets Needed

### Gap 1: B2C LMS Features (CRITICAL — ~18 new tickets)
CD-13 defines 4 complete courses with video, readings, exercises, quizzes. Module 5 (Journey) cannot deliver these without LMS capabilities.

**New LMS tickets (LMS-001 to LMS-018):**
- LMS-001: Course enrollment & payment
- LMS-002: Lesson player (video + reading tabs)
- LMS-003: Exercise/worksheet viewer (fillable)
- LMS-004: Quiz engine (multiple choice + short answer)
- LMS-005: Progress tracking (lesson completion, course %)
- LMS-006: Certificate generation on completion
- LMS-007: Diagnostic discount code issuance
- LMS-008: Course catalog page (public-facing)
- LMS-009: Student dashboard (my courses, progress)
- LMS-010: Course completion webhook → Journey trigger
- LMS-011: Video hosting integration (Supabase Storage or external)
- LMS-012: Quiz answer key management
- LMS-013: Course instructor notes
- LMS-014: Team enrollment (group pricing $999/5)
- LMS-015: Course review & rating
- LMS-016: Course prerequisite enforcement
- LMS-017: B2C student communication (completion, nudge)
- LMS-018: Course analytics (completion rate, time-to-complete, quiz scores)

**Estimated effort:** ~65h

### Gap 2: Interactive ROI Calculator (HIGH — ~4 new tickets)
CD-2 defines an interactive ROI Calculator used LIVE during sales calls. No existing ticket covers this.

**New tickets (TOOL-001 to TOOL-004):**
- TOOL-001: ROI Calculator UI (input fields, real-time calculation, visual output)
- TOOL-002: Calculator scenario presets (SPARK ROI, BRIDGE ROI, MOSAIC ROI, Bundle ROI)
- TOOL-003: Calculator share/link (generate shareable results URL)
- TOOL-004: Calculator integration with CRM (log calculator usage per prospect)

**Estimated effort:** ~12h

### Gap 3: Podcast Episode Management (MEDIUM — ~6 new tickets)
CD-12 defines 42 episodes across 4 tracks. No existing ticket tracks podcast production/publishing.

**New tickets (POD-001 to POD-006):**
- POD-001: Podcast episode tracker (status: planned, recorded, edited, published)
- POD-002: Episode detail (title, track, guest, show notes, audio file)
- POD-003: Publishing workflow (approve → distribute to Spotify/Apple/LinkedIn)
- POD-004: Podcast analytics (downloads, listen-through rate, subscriber growth)
- POD-005: Guest management (contact, bio, recording date, follow-up)
- POD-006: Calendar integration (publishing schedule)

**Estimated effort:** ~20h

### Gap 4: Program Delivery Management (MEDIUM — ~8 new tickets)
CD-8/9 define multi-session programs (SHIFT-QUEST: 12 sessions over 6 months). Module 7 handles individual events but not program-level enrollment and milestone tracking.

**New tickets (PROG-001 to PROG-008):**
- PROG-001: Program enrollment (cohort-based, participant roster)
- PROG-002: Session attendance tracking
- PROG-003: Participant milestone tracker (workbook completion, capstone status)
- PROG-004: Cohort analytics (attendance rate, completion rate, NPS)
- PROG-005: Program facilitator dashboard (upcoming sessions, participant status)
- PROG-006: Capstone submission & review workflow
- PROG-007: Program completion certificate
- PROG-008: Post-program cross-sell trigger (→ Advisory, → Council)

**Estimated effort:** ~28h

### Gap 5: Notion Content Deep-Link (LOW — ~2 new tickets)
CDs store content in Notion page bodies. WAVE has metadata but can't display the content.

**New tickets (NOTION-016 to NOTION-017):**
- NOTION-016: Asset detail "View Content" button → deep-link to Notion page
- NOTION-017: Notion page content preview (fetch first 500 chars via API for preview card)

**Estimated effort:** ~5h

---

## 5. Existing Tickets Requiring Updates

| Ticket Range | Update | Reason |
|-------------|--------|--------|
| CAL-001 to CAL-044 | Add content_type values | Support podcast_episode, research_report, case_study, newsletter_issue, b2c_course, training_module |
| DIST-001 to DIST-066 | Add newsletter template structure | CD-11 defines specific newsletter format (subject, preview, hook, insight, bullets, diagnostic corner, action, upcoming) |
| EVT-001 to EVT-102 | Add "Program" event type | Multi-session programs (SHIFT-QUEST, coaching arcs) need program-level grouping |
| CAT-001 to CAT-078 | Add B2C course products | CD-13 defines 4 courses at $199-$299 price points |
| ANA-001 to ANA-105 | Add LMS + podcast KPIs | Course completion rate, podcast downloads, newsletter open rate |
| TPL-001 to TPL-066 | Add Notion deep-link field | CD content lives in Notion page bodies, not in WAVE storage |
| JOUR-001 to JOUR-092 | Add LMS completion trigger | Course completion → trigger next journey step |

---

## 6. Summary — Recommended Actions

### Immediate (no new tickets — just updates to existing specs):
1. Update CAL content_type enum (5 min spec change)
2. Update CAT product catalog to include B2C courses (15 min spec change)
3. Update DIST newsletter schema (10 min spec change)
4. Update TPL to add Notion deep-link field (5 min spec change)

### Short-term (new ticket batches to add):
5. **LMS-001 to LMS-018** (65h) — CRITICAL for CD-13 B2C courses
6. **TOOL-001 to TOOL-004** (12h) — HIGH for CD-2 ROI Calculator
7. **NOTION-016 to NOTION-017** (5h) — LOW effort, immediate value
8. **PROG-001 to PROG-008** (28h) — MEDIUM for CD-8/9 program delivery
9. **POD-001 to POD-006** (20h) — MEDIUM for CD-12 podcast

### Not WAVE scope:
10. CD-6 (Website Copy) — External website content, not managed by WAVE

### New totals after gaps filled:
- Existing: 733 tickets, ~2,319h
- New: 38 tickets, ~130h
- **Grand total: 771 tickets, ~2,449h**

---

## 7. Build Priority for New Tickets

**Phase 1 (P0 — Launch blockers):**
- LMS-001 to LMS-009 (core course delivery) — 45h
- TOOL-001 to TOOL-002 (ROI calculator core) — 8h
- NOTION-016 (deep-link) — 3h

**Phase 2 (P1 — Should have):**
- LMS-010 to LMS-018 (LMS advanced) — 20h
- PROG-001 to PROG-005 (program management core) — 18h
- TOOL-003 to TOOL-004 (calculator advanced) — 4h
- NOTION-017 (content preview) — 2h

**Phase 3 (P2 — Nice to have):**
- POD-001 to POD-006 (podcast) — 20h
- PROG-006 to PROG-008 (program advanced) — 10h

---

*Analysis by NEXUS. 14 CD files cross-referenced against 733 WAVE tickets. Ready for Kevin's review before writing updated specs.*
