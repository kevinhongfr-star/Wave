# WAVE Phase 1 — Foundation

**Duration**: ~20 hours
**Batches**: 3
**Goal**: Establish database foundation, implement Campaign CRUD, fix critical bugs, migrate data

---

## Batch 1.1: Database Schema + Bug Fixes (8h)

### T-1.1.1: Create `content_pieces` table [2h]
**Priority**: CRITICAL
**File**: `supabase/migrations/001_create_content_pieces.sql`

**Task**:
Execute DDL from `01_DATA_MODEL.md` §2.1 to create `content_pieces` table with all columns, constraints, and indexes.

**Acceptance Criteria**:
- Table created with all columns matching spec
- All CHECK constraints enforced
- All indexes created
- Can insert and query records via Supabase REST API

---

### T-1.1.2: Create `campaigns` table (new) [1.5h]
**Priority**: CRITICAL
**File**: `supabase/migrations/002_create_campaigns.sql`

**Task**:
Execute DDL from `01_DATA_MODEL.md` §2.2. Note: This replaces the fake campaign concept. The existing `build_tracker` table remains for legacy tracking, but `campaigns` is the new source of truth.

**Acceptance Criteria**:
- Table created per spec
- All constraints and indexes in place
- Test insert of sample campaign record

---

### T-1.1.3: Create junction tables [1.5h]
**Priority**: CRITICAL
**File**: `supabase/migrations/003_create_junction_tables.sql`

**Task**:
Create `campaign_content` and `campaign_mailing` junction tables per spec §2.3 and §2.5.

**Acceptance Criteria**:
- Both tables created with proper FK references
- UNIQUE constraints enforced
- Indexes created

---

### T-1.1.4: Fix Distribution `preview_text` bug [1h]
**Priority**: CRITICAL
**Files**: `src/app/dashboard/distribution/page.tsx`, `src/app/dashboard/distribution/DistributionClient.tsx`

**Task**:
The current distribution query selects `preview_text` column which doesn't exist in `sequence_emails` table. Fix the query to only select existing columns.

**Current broken query**:
```sql
SELECT id, sequence_id, order_num, subject, body, preview_text, delay_days
FROM sequence_emails
```

**Fix**:
```sql
SELECT id, sequence_id, order_num, subject, body, delay_days
FROM sequence_emails
```

Also fix the UI to derive a preview from `body` instead:
```tsx
const preview = email.body?.substring(0, 100) + '...'
```

**Acceptance Criteria**:
- Distribution page loads without errors
- Email sequences display correctly with body preview
- No console errors

---

### T-1.1.5: Fix Dashboard Quick Action links [1h]
**Priority**: HIGH
**File**: `src/app/dashboard/DashboardClient.tsx`

**Task**:
Fix incorrect Quick Action links that point to wrong URLs. Update to correct routes.

**Acceptance Criteria**:
- All Quick Action buttons navigate to correct pages
- No 404 errors when clicking

---

### T-1.1.6: Create views [1h]
**Priority**: MEDIUM
**File**: `supabase/migrations/004_create_views.sql`

**Task**:
Create the 4 views defined in `01_DATA_MODEL.md` §5: `v_campaign_overview`, `v_repurposing_chains`, `v_distribution_calendar`, `v_inbound_pipeline`.

**Acceptance Criteria**:
- All views queryable
- Return expected data

---

## Batch 1.2: Campaign CRUD + UI (7h)

### T-1.2.1: Campaigns API routes [2h]
**Priority**: CRITICAL
**Files**:
- `src/app/api/campaigns/route.ts`
- `src/app/api/campaigns/[id]/route.ts`

**Task**:
Implement GET (list), POST (create), GET (single), PATCH (update), DELETE (archive) per `02_API_ROUTES.md` §3.

**Acceptance Criteria**:
- All endpoints return correct data
- Pagination works
- Filtering by status/type/channel works
- Creating campaign returns 201
- Deleting sets status to 'archived'

---

### T-1.2.2: Campaigns page — server component [1.5h]
**Priority**: HIGH
**File**: `src/app/dashboard/campaigns/page.tsx`

**Task**:
Rewrite campaigns page server component to fetch real data from new `campaigns` table (via view `v_campaign_overview`). Remove all `build_phase` grouping logic.

**Acceptance Criteria**:
- Page fetches real campaigns from Supabase
- Displays campaign list with status, type, dates, linked content count
- Loading state shown during fetch
- Error state if fetch fails

---

### T-1.2.3: Campaigns page — client component [2.5h]
**Priority**: HIGH
**File**: `src/app/dashboard/campaigns/CampaignsClient.tsx`

**Task**:
Build interactive campaigns client:
1. **Campaign list** with status filter tabs (All / Planning / Active / Paused / Completed)
2. **Create campaign dialog** with form fields: name, description, type, priority, dates, goal, channel
3. **Edit campaign** inline or dialog
4. **Archive campaign** with confirmation
5. **Campaign detail view** showing linked content, contacts, distribution, inbound

**Acceptance Criteria**:
- Can create campaign via dialog
- Can filter by status
- Can edit campaign details
- Can archive campaign
- All actions persist to Supabase via API

---

### T-1.2.4: Campaign-content linking [1h]
**Priority**: MEDIUM
**File**: `src/app/api/campaigns/[id]/content/route.ts`

**Task**:
Implement link/unlink endpoints. Add UI buttons on campaign detail to link existing content pieces.

**Acceptance Criteria**:
- Can link content to campaign
- Can unlink content
- Junction table correctly populated
- Campaign detail shows linked content

---

## Batch 1.3: Content Hub + Data Migration (5h)

### T-1.3.1: Content API routes [1.5h]
**Priority**: CRITICAL
**Files**:
- `src/app/api/content/route.ts`
- `src/app/api/content/[id]/route.ts`

**Task**:
Implement full CRUD per `02_API_ROUTES.md` §2.

**Acceptance Criteria**:
- All endpoints functional
- Filtering by type/status/source works
- Full-text search on title/description
- Pagination works

---

### T-1.3.2: Content Hub page — rewrite [2h]
**Priority**: HIGH
**Files**:
- `src/app/dashboard/content/page.tsx`
- `src/app/dashboard/content/ContentClient.tsx`

**Task**:
Rewrite Content Calendar page as "Content Hub":
1. Rename "Content Calendar" → "Content Hub" in sidebar and page title
2. Replace calendar view with grid/list view of content pieces
3. Add type/status/source filters
4. Add "Add Content" button with create dialog
5. Show Notion link if `notion_page_id` present
6. Add repurposing chain indicator (shows how many derivatives exist)

**Acceptance Criteria**:
- Page shows real content from `content_pieces` table
- Filters work correctly
- Can create new content piece
- Notion links functional
- Repurposing count visible per piece

---

### T-1.3.3: Data migration — assets → content_pieces [1h]
**Priority**: MEDIUM
**File**: `supabase/migrations/005_migrate_assets.sql`

**Task**:
Execute migration SQL from `01_DATA_MODEL.md` §4 to populate `content_pieces` from existing `assets` table.

**Acceptance Criteria**:
- All valid assets migrated to content_pieces
- No duplicates
- Original assets table untouched (kept for reference)

---

### T-1.3.4: Data migration — campaign_contacts → mailing_list [0.5h]
**Priority**: MEDIUM
**File**: `supabase/migrations/006_migrate_contacts.sql`

**Task**:
Execute migration from `01_DATA_MODEL.md` §4 to create `mailing_list` table and import from `campaign_contacts`.

**Acceptance Criteria**:
- `mailing_list` table created per spec §2.4
- Unique contacts imported from campaign_contacts
- Segment tags populated from campaign associations

---

## Batch 1 Summary

| Metric | Value |
|--------|-------|
| Total tickets | 12 |
| Critical bugs fixed | 2 (Distribution query, Dashboard links) |
| New tables | 5 (content_pieces, campaigns, campaign_content, mailing_list, campaign_mailing) |
| New API routes | 4 |
| Pages rewritten | 2 (Campaigns, Content Hub) |
| Estimated hours | 20h |

### Post-Batch 1 State
- ✅ All critical bugs fixed
- ✅ Database schema complete for Phase 1
- ✅ Campaign CRUD fully functional
- ✅ Content Hub showing real data
- ✅ Data migrated from legacy tables
- 🔄 Remaining: Repurposing, Distribution rewrite, Inbound, Templates, Analytics

---

*Document generated: 2026-07-20 | Author: NEXUS Agent*
