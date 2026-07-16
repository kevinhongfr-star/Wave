# WAVE Business Spec — Notion Data Integration (EXPANDED)

**Version:** 1.0 | **Date:** 2026-07-14 | **Author:** NEXUS
**For:** Trae (Engineering)
**Prerequisite:** Notion_Data_Integration_Spec.md (schema mapping)
**Tickets:** NOTION-001 through NOTION-015 (15 tickets, ~47h estimated)

---

## Overview

WAVE needs to import and sync data from two Notion databases (scope validated via live Notion API audit 2026-07-16):
- **Launch Assets** (107 WAVE-relevant records, 25 excluded — see exclusion rules below) → WAVE's `assets` table + Module 1 Dashboard
- **365 Build Tracker** (~503 WAVE-relevant records, ~99 excluded — website/brand/legal) → New `build_tracker` table + Module 1 Dashboard

These are operational data sources — not reference documents. The integration is bidirectional awareness (WAVE reads Notion, displays in dashboard, tracks sync health).

---

## NOTION-001 | Extend `assets` Table Schema
**Module:** Infrastructure | **Priority:** P0 | **Est:** 2h

**What:** Add columns to existing `assets` table to accommodate Launch Assets data from Notion.

**SQL:**
```sql
ALTER TABLE assets ADD COLUMN IF NOT EXISTS assigned_to TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS notion_phase TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS asset_priority TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS dependencies TEXT[];
ALTER TABLE assets ADD COLUMN IF NOT EXISTS product_layer TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS notion_asset_id TEXT UNIQUE;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS asset_category TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS asset_format TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ;
```

**Acceptance:**
- Migration runs without error on existing Supabase
- All 9 new columns nullable (backward compatible)
- `notion_asset_id` has UNIQUE constraint for sync dedup
- Index on `notion_phase` and `asset_priority` for dashboard queries

---

## NOTION-002 | Create `build_tracker` Table
**Module:** Infrastructure | **Priority:** P0 | **Est:** 1h

**What:** New table for 365 Build Tracker data. Simple — only title + phase are reliably populated.

**SQL:**
```sql
CREATE TABLE build_tracker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deliverable_number INTEGER UNIQUE,
  deliverable_name TEXT NOT NULL,
  build_phase TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Building',
  assigned_to TEXT,
  completed_at TIMESTAMPTZ,
  notion_page_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_build_tracker_phase ON build_tracker(build_phase);
CREATE INDEX idx_build_tracker_status ON build_tracker(status);
```

**Acceptance:**
- Table created with all columns
- `deliverable_number` and `notion_page_id` are UNIQUE
- Indexes on `build_phase` and `status`
- RLS policy: authenticated users can SELECT, service role can INSERT/UPDATE/DELETE

---

## NOTION-003 | Create `notion_sync_log` Table
**Module:** Infrastructure | **Priority:** P1 | **Est:** 1h

**What:** Audit trail for Notion sync operations.

**SQL:**
```sql
CREATE TABLE notion_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_db TEXT NOT NULL,
  sync_type TEXT NOT NULL DEFAULT 'full',
  records_fetched INTEGER DEFAULT 0,
  records_upserted INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_details TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

**Acceptance:**
- Table created, RLS restricted to service role
- Can query last sync time per source_db

---

## NOTION-004 | Seed Launch Assets Data (107 Records)
**Module:** Module 3 (Assets) | **Priority:** P0 | **Est:** 3h

**What:** Write a migration script that imports 107 WAVE-relevant Launch Assets from Notion into `assets` table. 25 records are excluded per scope audit.

**Exclusion rules — skip records where Category is:**
- `Web Page` (9 records) — CD-6 boundary, external website content
- `Search Material` (6 records) — VISTA scope (outbound sales)
- `LinkedIn Post` or `LinkedIn` (4 records) — external social media
- `Legal` or `Internal Ops` or `ICP` (5 records) — reference documents
- `Brand` (1 record) — reference PDF

**Data mapping:**
| Notion Field | Target Column |
|-------------|---------------|
| Asset Name | `name` |
| Asset ID | `notion_asset_id` |
| Assigned To | `assigned_to` |
| Status | `status` (map: Not Started→idea, In Progress→draft, Review→review, Done→approved) |
| Format | `asset_format` |
| Category | `asset_category` |
| Phase | `notion_phase` |
| Priority | `asset_priority` |
| Product Layer | `product_layer` |
| Dependencies | `dependencies` (parse comma-separated → text array) |

**Notion API details:**
- Database ID: `fe8bc7179ec2408c92f71c8e05998019`
- Paginate with `page_size: 100`, follow `next_cursor`
- Auth: `Authorization: Bearer <NOTION_API_TOKEN>`
- Header: `Notion-Version: 2022-06-28`

**Acceptance:**
- 107 WAVE-relevant assets imported (25 excluded per rules above)
- Status values mapped correctly (Not Started→idea, etc.)
- Dependencies parsed from "C1.1, C1.5" format to ["C1.1", "C1.5"]
- No duplicates on re-run (upsert on `notion_asset_id`)
- Script logs to `notion_sync_log` with count of skipped records

---

## NOTION-005 | Seed Build Tracker Data (~503 Records)
**Module:** Module 1 (Dashboard) | **Priority:** P0 | **Est:** 3h

**What:** Import ~503 WAVE-relevant Build Tracker records into `build_tracker` table. ~99 records excluded (website/brand/legal).

**IMPORTANT — Data quality issues found in Notion DB:**
- `Status` field: EMPTY for all 646 records — WAVE will use its own status system
- `Priority` field: EMPTY for all 646 records — WAVE will use its own priority system
- `Sub-Category` field: EMPTY for all 646 records — not imported
- `Product` field: 65% empty — import when present, NULL when absent
- 44 duplicate records found — deduplicate by deliverable_name before import

**Exclusion rules — skip records where Category is:**
- `Website` (83 records) — external website content, CD-6 boundary
- `Brand & Identity` (8 records) — design assets, not WAVE platform features
- `Legal` or `Internal Ops` (8 records) — reference documents

**Data mapping:**
| Notion Field | Target Column |
|-------------|---------------|
| Deliverable title | Parse "#NNN — Name" → `deliverable_number` + `deliverable_name` |
| Phase | `build_phase` |
| Category | `category` (new column — add if not exists) |
| Product | `product` (new column — nullable, 65% empty) |

**Parsing logic:**
```
Title format: "#424 — LYC Partners — LinkedIn Posts — Kevin Hong (Posts 51–55)"
→ deliverable_number = 424
→ deliverable_name = "LYC Partners — LinkedIn Posts — Kevin Hong (Posts 51–55)"
```

**Acceptance:**
- ~503 WAVE-relevant records imported (~99 excluded per rules above)
- Title parsed correctly (number extracted, name cleaned)
- `build_phase` stored as full string (e.g., "Phase 4 — Events & Programs")
- Status/Priority/SubCategory NOT imported (all empty in source)
- Deduplication applied (44 duplicates resolved by deliverable_name)
- Upsert on `notion_page_id` — safe to re-run

---

## NOTION-006 | Notion Sync Service — Core
**Module:** Infrastructure | **Priority:** P1 | **Est:** 4h

**What:** Edge function or backend service that syncs Notion databases to Supabase on a schedule.

**Requirements:**
- Full sync: fetch all records, upsert to target tables
- Incremental sync: use Notion's `last_edited_time` filter to fetch only changed records
- Schedule: daily at 02:00 UTC (or manual trigger via API)
- Store NOTION_API_TOKEN in Supabase vault (never in code)
- Log every sync to `notion_sync_log`

**Functions:**
- `syncLaunchAssets(mode: 'full' | 'incremental')` → upserts to `assets`
- `syncBuildTracker(mode: 'full' | 'incremental')` → upserts to `build_tracker`
- `getSyncStatus()` → returns last sync time + record counts per source

**Acceptance:**
- Full sync completes in <30 seconds
- Incremental sync fetches only changed records
- Errors logged to `notion_sync_log` with `error_details`
- Token stored in Supabase vault, not in env/code

---

## NOTION-007 | Notion Sync Error Handling & Retry
**Module:** Infrastructure | **Priority:** P2 | **Est:** 2h

**What:** Handle Notion API failures gracefully.

**Scenarios:**
- Rate limiting (Notion returns 429) → exponential backoff, max 3 retries
- Token expired/revoked → log error, send alert to `action_feed`
- Partial sync failure → record `records_failed` count, don't roll back successes
- Network timeout → retry once, then log failure

**Acceptance:**
- No data loss on transient API failures
- Alert generated in `action_feed` when sync fails 2+ consecutive times
- `notion_sync_log` accurately records partial success states

---

## NOTION-008 | Dashboard — Build Progress Widget
**Module:** Module 1 (Dashboard) | **Priority:** P0 | **Est:** 4h

**What:** New dashboard widget showing 365 Build Tracker progress.

**UI spec:**
- Horizontal bar chart: 6 phases on Y-axis, completion % on X-axis
- Each bar segmented by status: Building (amber), Complete (green), Blocked (red), Deferred (gray)
- Summary line: "X of 100 deliverables complete (Y%)"
- Click a phase bar → drill-down to filtered list of deliverables in that phase

**Data source:** `build_tracker` table, grouped by `build_phase` and `status`

**Acceptance:**
- Widget renders with correct data
- Click-to-drill-down works
- Updates when build_tracker data changes
- Mobile responsive

---

## NOTION-009 | Dashboard — Asset Pipeline Overview
**Module:** Module 1 (Dashboard) | **Priority:** P1 | **Est:** 3h

**What:** Dashboard widget showing asset distribution across Notion phases.

**UI spec:**
- 7-segment horizontal bar: ATTRACT, ENGAGE, ASSESS, RESOLVE, SUSTAIN, PROMOTE, OPS
- Each segment sized by record count
- Color-coded by phase (consistent with Notion phase colors)
- Hover shows: count + % of total
- Click segment → navigate to Module 3 (Asset Library) filtered by that phase

**Below bar:** Summary cards:
- Total assets: 132
- By status: Review (132) → will change as team works
- By priority: P0 (85), P1 (39), P2 (8)
- By format: MD (83), DOCX (17), PDF (11), PPTX (11), HTML (8), PNG (2)

**Data source:** `assets` table WHERE `notion_asset_id IS NOT NULL`

**Acceptance:**
- Accurate counts from database
- Click navigates to filtered asset list
- Responsive layout

---

## NOTION-010 | Dashboard — Asset Status Distribution
**Module:** Module 1 (Dashboard) | **Priority:** P2 | **Est:** 2h

**What:** Pie/donut chart showing asset status distribution.

**UI spec:**
- Donut chart with 4 segments: idea (gray), draft (blue), review (amber), approved (green)
- Center number: total assets
- Legend with count per status
- Click segment → filtered asset list

**Data source:** `assets` table, grouped by `status`

**Acceptance:**
- Accurate distribution
- Click interaction works
- Updates on data change

---

## NOTION-011 | Dependency Graph — Asset Relationships
**Module:** Module 3 (Assets) | **Priority:** P2 | **Est:** 4h

**What:** Visual display of asset dependencies in the asset detail view.

**UI spec:**
- On asset detail page, show "Dependencies" section
- List of dependent assets (from `dependencies` array) as clickable links
- Visual indicator: which dependencies are complete vs in-progress
- Reverse dependencies: "This asset is required by: [list]"

**Data source:** `assets.dependencies` column + self-referencing via `notion_asset_id`

**Acceptance:**
- Dependencies displayed as clickable list
- Status indicator per dependency
- Reverse dependencies computed and shown
- Handles missing dependencies gracefully (asset ID referenced but not found)

---

## NOTION-012 | Asset Library — Phase Filter
**Module:** Module 3 (Assets) | **Priority:** P1 | **Est:** 2h

**What:** Add Notion phase as a filter dimension in the asset library.

**Implementation:**
- New filter dropdown: "Phase" with options: All, ATTRACT, ENGAGE, ASSESS, RESOLVE, SUSTAIN, PROMOTE, OPS
- New filter dropdown: "Priority" with options: All, P0, P1, P2
- New filter dropdown: "Assigned To" with options: All, Kevin, NEXUS, James
- Filters combinable with existing filters (status, category, format)
- Active filters shown as pills, removable individually

**Data source:** `assets.notion_phase`, `assets.asset_priority`, `assets.assigned_to`

**Acceptance:**
- All 3 new filters work independently and combined
- Filter state persists in URL query params
- "Clear all filters" resets everything

---

## NOTION-013 | Seed Data Validation
**Module:** Infrastructure | **Priority:** P1 | **Est:** 2h

**What:** Validation script to verify imported data matches Notion source.

**Checks:**
- Record count: `assets` WHERE notion_asset_id IS NOT NULL = 132
- Record count: `build_tracker` = 100
- Spot-check 5 random assets: name + status + phase match Notion
- Spot-check 5 random build items: number + name + phase match Notion
- All dependency references valid (referenced ID exists in assets)
- No orphaned records (every notion_asset_id maps to a real Notion page)

**Output:** Validation report with pass/fail per check.

**Acceptance:**
- Script runs and produces clear pass/fail report
- All checks pass after fresh import
- Can be re-run after syncs to detect drift

---

## NOTION-014 | Sync Health — Dashboard Indicator
**Module:** Module 1 (Dashboard) | **Priority:** P2 | **Est:** 2h

**What:** Small indicator on dashboard showing Notion sync health.

**UI spec:**
- Small badge in dashboard footer or settings area
- Green dot + "Last synced: 2h ago" when healthy
- Yellow dot + "Last synced: 25h ago" when stale (>24h)
- Red dot + "Sync failed" with error message when broken
- Click → opens sync log detail

**Data source:** `notion_sync_log` — latest record per `source_db`

**Acceptance:**
- Health status computed from last sync time
- Color thresholds: <24h = green, 24-48h = yellow, >48h or error = red
- Clickable to view sync details

---

## NOTION-015 | Supabase Edge Function — Manual Sync Trigger
**Module:** Infrastructure | **Priority:** P2 | **Est:** 3h

**What:** API endpoint to manually trigger a Notion sync (for debugging and on-demand refresh).

**Endpoint:** `POST /functions/v1/notion-sync`

**Request body:**
```json
{
  "source": "all" | "launch_assets" | "build_tracker",
  "mode": "full" | "incremental"
}
```

**Response:**
```json
{
  "success": true,
  "sync_id": "uuid",
  "records_fetched": 132,
  "records_upserted": 5,
  "records_failed": 0,
  "duration_ms": 4523
}
```

**Acceptance:**
- Authenticated users only (Supabase auth)
- Returns sync results immediately
- Logs to `notion_sync_log`
- Idempotent — safe to call multiple times

---

## Summary

| Ticket | Module | Priority | Est | What |
|--------|--------|----------|-----|------|
| NOTION-001 | Infra | P0 | 2h | Extend `assets` table |
| NOTION-002 | Infra | P0 | 1h | Create `build_tracker` table |
| NOTION-003 | Infra | P1 | 1h | Create `notion_sync_log` table |
| NOTION-004 | Mod 3 | P0 | 3h | Seed 132 launch assets |
| NOTION-005 | Mod 1 | P0 | 2h | Seed 100 build tracker records |
| NOTION-006 | Infra | P1 | 4h | Notion sync service core |
| NOTION-007 | Infra | P2 | 2h | Sync error handling |
| NOTION-008 | Mod 1 | P0 | 4h | Dashboard build progress widget |
| NOTION-009 | Mod 1 | P1 | 3h | Dashboard asset pipeline overview |
| NOTION-010 | Mod 1 | P2 | 2h | Dashboard asset status distribution |
| NOTION-011 | Mod 3 | P2 | 4h | Asset dependency graph |
| NOTION-012 | Mod 3 | P1 | 2h | Asset library phase/priority filters |
| NOTION-013 | Infra | P1 | 2h | Seed data validation |
| NOTION-014 | Mod 1 | P2 | 2h | Sync health indicator |
| NOTION-015 | Infra | P2 | 3h | Manual sync trigger API |
| **Total** | | | **37h** | **15 tickets** |

**Build order for Trae:**
1. NOTION-001 → 002 → 003 (schema first)
2. NOTION-004 → 005 (import data)
3. NOTION-013 (validate import)
4. NOTION-008 (first visible output — build progress on dashboard)
5. NOTION-012 → 009 → 010 (asset library + dashboard widgets)
6. NOTION-006 → 007 → 015 (sync service)
7. NOTION-011 → 014 (polish)
