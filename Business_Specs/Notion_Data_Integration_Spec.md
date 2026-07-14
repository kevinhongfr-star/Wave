# Notion → WAVE Data Integration Spec

**Version:** 1.0 | **Date:** 2026-07-14 | **Author:** NEXUS
**For:** Trae (Engineering)
**Status:** Ready for Build

---

## 1. Context

WAVE's operational data lives in two Notion databases that need to be integrated into WAVE's Supabase backend:

| Source | Records | What It Is |
|--------|---------|------------|
| **LYC Launch Assets** (DB2) | 132 | Complete asset inventory — every marketing asset with status, phase, format, category, priority, dependencies, assignee |
| **365 Build Tracker** (DB3) | 100 | High-level build progress tracker — deliverables across 6 phases, all in "Building" status |

**What this is NOT:** The Agent Build Context (44 child pages) contains reference documents (brand guidelines, product definitions, etc.). These are human-written content — not operational data. WAVE does not import them.

---

## 2. Source Database Schemas

### 2.1 LYC Launch Assets (132 records)

| Field | Type | Values | Notes |
|-------|------|--------|-------|
| Asset Name | title | Free text | e.g., "Webinar 1 Deck — The China Leadership Gap" |
| Asset ID | rich_text | Alphanumeric | e.g., "B1.1", "C1.22", "F1.6" |
| Assigned To | select | Kevin, NEXUS, James | |
| Status | select | Not Started, In Progress, Review, Done | Currently ALL = Review |
| Format | rich_text | MD(83), DOCX(17), PDF(11), PPTX(11), HTML(8), PNG(2) | |
| Category | select | 25 values — Email Sequences(13), Diagnostic Ops(11), Web Pages(9), Question Banks(8), Diagnostic Specs(8), etc. | |
| Phase | select | ASSESS(34), PROMOTE(28), ENGAGE(21), RESOLVE(20), ATTRACT(14), SUSTAIN(10), OPS(5) | |
| Priority | select | P0(85), P1(39), P2(8) | |
| Product Layer | rich_text | Layer 1-5 + Cross-layer + Internal | 7 distinct values |
| Dependencies | rich_text | Comma-separated Asset IDs | e.g., "C1.1, C1.5, C1.9" |

### 2.2 365 Build Tracker (100 records)

| Field | Type | Values | Notes |
|-------|------|--------|-------|
| Deliverable | title | "#NNN — Name" format | Range #329–#424 |
| Phase | select | Phase 1–6 | Foundation(2), Product Assets(11), Commercial Layer(20), Events & Programs(33), Website(18), Ops & Legal(16) |
| Status | status | Building | ALL records = Building |

**Critical:** All other fields (Journey Stage, Persona, Product, Format, Category, Build Notes) are currently EMPTY (0% population). Only title + phase are reliable.

---

## 3. Schema Changes Required

### 3.1 Extend `assets` Table (Module 3)

The existing `assets` table needs new columns to accommodate Launch Assets data:

```sql
-- Add columns to existing assets table
ALTER TABLE assets ADD COLUMN IF NOT EXISTS assigned_to TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS notion_phase TEXT;           -- ATTRACT, ENGAGE, ASSESS, RESOLVE, SUSTAIN, PROMOTE, OPS
ALTER TABLE assets ADD COLUMN IF NOT EXISTS asset_priority TEXT;         -- P0, P1, P2
ALTER TABLE assets ADD COLUMN IF NOT EXISTS dependencies TEXT[];         -- Array of asset IDs
ALTER TABLE assets ADD COLUMN IF NOT EXISTS product_layer TEXT;          -- Layer 1-5 mapping
ALTER TABLE assets ADD COLUMN IF NOT EXISTS notion_asset_id TEXT UNIQUE; -- For sync dedup (e.g., "B1.1")
ALTER TABLE assets ADD COLUMN IF NOT EXISTS asset_category TEXT;         -- 25 categories from Notion
ALTER TABLE assets ADD COLUMN IF NOT EXISTS asset_format TEXT;           -- MD, DOCX, PDF, PPTX, HTML, PNG
ALTER TABLE assets ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ;  -- Notion sync timestamp
```

### 3.2 New Table: `build_tracker`

For 365 Build Tracker data — powers the Dashboard build progress widget:

```sql
CREATE TABLE build_tracker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deliverable_number INTEGER UNIQUE,                          -- #329, #345, etc.
  deliverable_name TEXT NOT NULL,
  build_phase TEXT NOT NULL,                                  -- Phase 1-6
  status TEXT NOT NULL DEFAULT 'Building',                    -- Building, Complete, Blocked, Deferred
  assigned_to TEXT,
  completed_at TIMESTAMPTZ,
  notion_page_id TEXT UNIQUE,                                 -- For sync dedup
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for dashboard queries
CREATE INDEX idx_build_tracker_phase ON build_tracker(build_phase);
CREATE INDEX idx_build_tracker_status ON build_tracker(status);
```

### 3.3 New Table: `notion_sync_log`

Tracks Notion sync operations for debugging:

```sql
CREATE TABLE notion_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_db TEXT NOT NULL,                                    -- 'launch_assets' or 'build_tracker'
  sync_type TEXT NOT NULL,                                    -- 'full' or 'incremental'
  records_fetched INTEGER DEFAULT 0,
  records_upserted INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_details TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

### 3.4 Mapping Reference: Notion Phase → WAVE Module

| Notion Phase | WAVE Module | What It Means |
|-------------|-------------|---------------|
| ATTRACT | Module 2 (Content Calendar) | Content to attract professionals (newsletter, podcast, LinkedIn) |
| ENGAGE | Module 7 (Events) + Module 2 | Webinar/workshop decks and ops |
| ASSESS | Module 5 (Journey) + Module 3 | Diagnostic specs, question banks, report templates |
| RESOLVE | Module 5 (Journey) | Advisory proposals, delivery, search materials |
| SUSTAIN | Module 5 (Journey) | Retainer, Invitation Council materials |
| PROMOTE | Module 2 + Module 4 (Distribution) | Web pages, email sequences, promotional assets |
| OPS | Module 1 (Dashboard) | Internal operations, governance, checklists |

### 3.5 Mapping Reference: Notion Product Layer → WAVE `products` Table

| Notion Product Layer | WAVE Product Tier |
|---------------------|-------------------|
| Layer 1: Forum | `free` (Executive Introduction) |
| Layer 2: Assessment | `low_ticket` / `mid_ticket` (diagnostics) |
| Layer 3: Resolution | `high_ticket` (advisory) |
| Layer 4: Search | `search` (executive search) |
| Layer 5: Invitation Council | `council` |
| Cross-layer | Multiple products |
| Internal Operations | Not a product |

---

## 4. Data Migration Notes

1. **All 132 Launch Assets are in "Review" status** — this is the current Notion state. WAVE should import as-is. Status will change as team works in WAVE.
2. **Dependencies are comma-separated Asset IDs** — parse and store as text array. Validate references exist.
3. **365 Build Tracker has sparse data** — only title + phase. Don't over-engineer the schema; keep it simple.
4. **Notion API pagination** — DB2 has 132 records (needs 2 pages at page_size=100). DB3 has 100 records (1 page).
5. **Sync strategy** — Initial full import, then daily incremental sync using Notion's `last_edited_time` filter.

---

## 5. Notion API Connection

- **Token:** Stored in Supabase vault as `NOTION_API_TOKEN`
- **API:** `https://api.notion.com/v1/`
- **Version header:** `Notion-Version: 2022-06-28`
- **DB2 ID:** `fe8bc7179ec2408c92f71c8e05998019`
- **DB3 ID:** `9b6980dc1f714daa83226363647fd22d`
