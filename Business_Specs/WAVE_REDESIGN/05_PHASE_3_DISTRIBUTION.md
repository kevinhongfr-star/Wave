# WAVE Phase 3 — Distribution + Inbound + Mailing List

**Duration**: ~20 hours
**Batches**: 3
**Prerequisites**: Phase 1 + 2 complete (campaigns, content_pieces, repurposing_jobs exist)
**Goal**: Build distribution management, mailing list UI, and inbound tracker — completing the marketing operations loop

---

## Batch 3.1: Distribution Rewrite (7h)

### T-3.1.1: Create `distribution_log` table [1h]
**Priority**: CRITICAL
**File**: `supabase/migrations/008_create_distribution_log.sql`

**Task**:
Create `distribution_log` table per spec §2.7 with all columns, constraints, and indexes.

**Acceptance Criteria**:
- Table created and queryable
- FK references to content_pieces and campaigns valid

---

### T-3.1.2: Distribution API routes [2h]
**Priority**: CRITICAL
**Files**:
- `src/app/api/distribution/route.ts` — GET list, POST create
- `src/app/api/distribution/[id]/route.ts` — PATCH update
- `src/app/api/distribution/calendar/route.ts` — GET calendar view

**Task**:
Implement all distribution endpoints per `02_API_ROUTES.md` §5.

**Acceptance Criteria**:
- Can create distribution entries
- Can list with filters (channel, status, campaign, date range)
- Calendar endpoint returns date-grouped data
- Upcoming filter works

---

### T-3.1.3: Distribution page — server component [1h]
**Priority**: HIGH
**File**: `src/app/dashboard/distribution/page.tsx`

**Task**:
Rewrite server component to fetch from `distribution_log` table + `v_distribution_calendar` view. Remove dependency on broken `sequence_emails.preview_text`.

**Acceptance Criteria**:
- Fetches real distribution data
- Shows upcoming and past distributions
- Error handling for empty/error states

---

### T-3.1.4: Distribution page — client component rewrite [3h]
**Priority**: HIGH
**File**: `src/app/dashboard/distribution/DistributionClient.tsx`

**Task**:
Complete rewrite with two view modes:

1. **List View**:
   - Table of distribution entries: Content, Channel, Campaign, Scheduled, Status, Recipients, Actions
   - Status filter: All / Scheduled / Sent / Failed
   - Channel filter tabs: All / Email / LinkedIn / Website / Social
   - "Schedule Distribution" button → create dialog

2. **Calendar View**:
   - Monthly calendar showing scheduled distributions
   - Color-coded by channel
   - Click to see details
   - Navigate months

3. **Create Distribution Dialog**:
   - Select content piece (from content_pieces)
   - Select campaign (optional)
   - Select channel
   - Set scheduled date/time
   - Add notes
   - "Schedule" button

**Acceptance Criteria**:
- List view shows all distributions with correct data
- Calendar view renders correctly
- Can create new distribution entry
- Filters work for both views
- Status badges correct
- Responsive on laptop screens

---

## Batch 3.2: Mailing List + Inbound (8h)

### T-3.2.1: Create `inbound` table [0.5h]
**Priority**: CRITICAL
**File**: `supabase/migrations/009_create_inbound.sql`

**Task**:
Create `inbound` table per spec §2.8.

**Acceptance Criteria**:
- Table created with all columns and constraints

---

### T-3.2.2: Mailing List API routes [1.5h]
**Priority**: HIGH
**Files**:
- `src/app/api/mailing-list/route.ts`
- `src/app/api/mailing-list/[id]/route.ts`
- `src/app/api/mailing-list/import/route.ts`
- `src/app/api/mailing-list/segments/route.ts`
- `src/app/api/mailing-list/stats/route.ts`

**Task**:
Implement all mailing list endpoints per `02_API_ROUTES.md` §6.

**Acceptance Criteria**:
- CRUD for contacts works
- Bulk import processes correctly
- Segments endpoint returns tag counts
- Stats endpoint returns health metrics

---

### T-3.2.3: Mailing List page [2.5h]
**Priority**: HIGH
**Files**:
- `src/app/dashboard/mailing-list/page.tsx` (new)
- `src/app/dashboard/mailing-list/MailingListClient.tsx` (new)

**Task**:
Build new Mailing List page:

1. **Stats bar**: Total active, unsubscribed, bounced, engagement score, monthly growth
2. **Contact table**: Email, Name, Company, Role, Source, Segments, Status, Last Activity
3. **Search bar**: Search by name/email/company
4. **Segment filter**: Filter by segment tags (multi-select)
5. **Status filter**: Active / Unsubscribed / Bounced / All
6. **Add contact dialog**: Single contact form
7. **Import button**: CSV upload → bulk import API
8. **Export button**: Download filtered contacts as CSV
9. **Contact detail slide-out**: Full contact info, campaign associations, engagement history

**Acceptance Criteria**:
- Shows all contacts from mailing_list table
- Search and filters work
- Can add single contact
- Can import CSV
- Stats calculated correctly
- Segments filter shows correct tag counts

---

### T-3.2.4: Inbound API routes [1.5h]
**Priority**: HIGH
**Files**:
- `src/app/api/inbound/route.ts`
- `src/app/api/inbound/[id]/route.ts`
- `src/app/api/inbound/pipeline/route.ts`

**Task**:
Implement all inbound endpoints per `02_API_ROUTES.md` §7.

**Acceptance Criteria**:
- Can create inbound leads
- Can update status through pipeline
- Pipeline endpoint returns grouped counts
- Filters work

---

### T-3.2.5: Inbound page [2.5h]
**Priority**: HIGH
**Files**:
- `src/app/dashboard/inbound/page.tsx` (new)
- `src/app/dashboard/inbound/InboundClient.tsx` (new)

**Task**:
Build inbound tracker page:

1. **Pipeline Kanban view** (default):
   - Columns: New → Acknowledged → Qualified → In Progress → Responded → Closed
   - Cards show: contact name, company, source, urgency badge, received date
   - Drag-and-drop to change status
   - Color by urgency (red=urgent, orange=high, blue=medium, gray=low)

2. **Table view** (toggle):
   - Sortable columns
   - Filterable by status, source, urgency, campaign

3. **Create inbound dialog**:
   - Contact info fields
   - Source selector
   - Campaign link (optional)
   - Message/notes
   - Urgency selector

4. **Detail panel**:
   - Full contact info
   - Status timeline
   - Response notes
   - Campaign linkage
   - Quick status update buttons

**Acceptance Criteria**:
- Pipeline Kanban renders correctly
- Can drag cards between columns
- Can create new inbound lead
- Filters work in table view
- Urgency color coding correct
- Pipeline summary stats shown

---

## Batch 3.3: Templates + Cross-Module Linking (5h)

### T-3.3.1: Create `templates` table [0.5h]
**Priority**: MEDIUM
**File**: `supabase/migrations/010_create_templates.sql`

**Task**:
Create `templates` table per spec §2.9.

**Acceptance Criteria**:
- Table created with all columns
- JSONB columns functional

---

### T-3.3.2: Templates API + AI generation [1.5h]
**Priority**: MEDIUM
**Files**:
- `src/app/api/templates/route.ts`
- `src/app/api/templates/[id]/route.ts`
- `src/app/api/templates/[id]/generate/route.ts`

**Task**:
Implement template CRUD + AI generation endpoint. The generate endpoint:
1. Loads template structure + variables
2. Interpolates user-provided variables
3. Calls DeepSeek with template prompt
4. Returns generated content

**Acceptance Criteria**:
- Template CRUD works
- AI generation fills template with variables
- Generated content returned

---

### T-3.3.3: Templates page rewrite [2h]
**Priority**: MEDIUM
**Files**:
- `src/app/dashboard/templates/page.tsx`
- `src/app/dashboard/templates/TemplatesClient.tsx`

**Task**:
Rewrite templates page:
1. Template library grid (cards by type)
2. Template detail view with variable editor
3. "Generate with AI" button → variable form → DeepSeek call → preview output
4. Create/edit template dialog
5. Template preview (rendered output, not raw HTML)

**Fix**: Current template preview shows raw HTML tags. Fix to render properly or show formatted preview.

**Acceptance Criteria**:
- Templates displayed as cards, not raw HTML
- Can create new templates
- AI generation works end-to-end
- Preview renders correctly
- Template categories filterable

---

### T-3.3.4: Campaign-contact linking UI [1h]
**Priority**: MEDIUM
**File**: `src/app/api/campaigns/[id]/contacts/route.ts` + CampaignsClient update

**Task**:
Build UI to add mailing list contacts to campaigns:
1. In campaign detail view, "Add Contacts" button
2. Dialog with segment filter or contact search
3. Selected contacts linked via `campaign_mailing` junction table
4. Show linked contacts count and list in campaign detail

**Acceptance Criteria**:
- Can search and add contacts to campaign
- Segment-based bulk add works
- Campaign detail shows linked contacts

---

## Batch 3 Summary

| Metric | Value |
|--------|-------|
| Total tickets | 12 |
| New tables | 2 (distribution_log, inbound, templates) |
| New pages | 2 (Mailing List, Inbound) |
| Rewritten pages | 1 (Distribution) |
| New API routes | 9 |
| Kanban board | 1 (Inbound pipeline) |
| Estimated hours | 20h |

### Post-Batch 3 State
- ✅ Distribution fully rewritten with real data
- ✅ Mailing list management operational
- ✅ Inbound tracker with Kanban pipeline
- ✅ Templates with AI generation
- ✅ All modules linked (campaigns ↔ content, campaigns ↔ contacts, content ↔ distribution)
- 🔄 Remaining: Analytics dashboard, UI polish, responsive sidebar

---

*Document generated: 2026-07-20 | Author: NEXUS Agent*
