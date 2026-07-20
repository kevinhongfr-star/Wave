# Trae Briefing: Phase 0 Continuation

**Date**: 2026-07-20  
**Base Commit**: `b758e44` (master)  
**Branch**: Work directly on master or create feature branch  
**Discard**: `trae/agent-Ifazma` branch (outdated, 40+ commits behind master)

---

## Current State (What's Done)

### Phase 0 Core ✅ COMPLETE
**Commit**: `b758e44` — "Phase 0: Wire Supabase backend"

**What's working**:
1. **Supabase Connection**
   - `.env.local` configured (not committed, in .gitignore)
   - `createAdminClient()` in `src/lib/supabase/server.ts` uses service role key
   - Bypasses RLS for all tables (internal tool, single user)

2. **Dashboard Page** (`src/app/dashboard/page.tsx`)
   - Server component fetches real counts: 30 products, 26 sequences, 132 assets, 291 build tasks
   - Client component `DashboardClient.tsx` renders UI
   - `export const dynamic = 'force-dynamic'` ensures fresh data

3. **Content Calendar** (`src/app/dashboard/content/page.tsx`)
   - Pulls from `build_tracker` table (291 deliverables)
   - Server component + `ContentClient.tsx`

4. **Distribution** (`src/app/dashboard/distribution/page.tsx`)
   - Pulls from `email_sequences` table (26 sequences)
   - Server component + `DistributionClient.tsx`

5. **Templates/Products** (`src/app/dashboard/templates/page.tsx`)
   - Pulls from `products` table (30 products)
   - Server component + `TemplatesClient.tsx`

**Vercel Deployment**: https://wave-seven.vercel.app
- Env vars set: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Auto-deploys from master branch

---

## Phase 0 Remaining (Your Tasks)

### Task 1: Assets Page (Standalone)
**Priority**: HIGH  
**Effort**: ~2-3h  
**Table**: `assets` (132 rows)

**Files to create/modify**:
- `src/app/dashboard/assets/page.tsx` — Server component
- `src/app/dashboard/assets/AssetsClient.tsx` — Client component

**Requirements**:
- Fetch from `assets` table
- Display: name, type, status, assigned_to, file_url, asset_priority
- Filter by: type, status, assigned_to
- Link to file_url if available

**Pattern to follow**: Look at `src/app/dashboard/templates/page.tsx` and `TemplatesClient.tsx`

---

### Task 2: Analytics Page (Aggregation Queries)
**Priority**: MEDIUM  
**Effort**: ~4-5h  
**Tables**: Multiple (products, email_sequences, assets, build_tracker)

**Files to modify**:
- `src/app/dashboard/analytics/page.tsx` — Server component
- `src/app/dashboard/analytics/AnalyticsClient.tsx` — Client component

**Requirements**:
- Aggregation queries:
  - Asset status distribution (count by status)
  - Build task completion rate (completed vs total)
  - Products by tier/category
  - Email sequences by type/status
- Display as cards/charts (use existing chart components if available, or simple stats)

**Pattern to follow**: Dashboard page pattern + multiple queries in `Promise.all()`

---

### Task 3: Agents Page (AI Agent Status Display)
**Priority**: LOW  
**Effort**: ~2h  
**Data Source**: Static (no Supabase table yet)

**Files to modify**:
- `src/app/dashboard/agents/page.tsx`

**Requirements**:
- Display agent status cards (Echo, Maria, Emily, Carl, Valentina)
- Show: name, role, status (active/idle), last action
- Currently hardcoded in Trae's old branch — can keep static for now
- Future: may wire to agent execution logs

---

### Task 4: Calendar Page (Events)
**Priority**: LOW  
**Effort**: ~3-4h  
**Table**: Does NOT exist yet

**Options**:
- **Option A**: Create `events` table in Supabase first (needs schema design)
- **Option B**: Keep as static placeholder page for now

**Recommendation**: Skip for now. Create a static page with placeholder message "Events table pending design". Kevin will decide if/when to create events table.

---

### Task 5: Journeys Page
**Priority**: LOW  
**Effort**: ~3-4h  
**Table**: Does NOT exist yet

**Same as Calendar**: Keep static placeholder for now. `journey_pipeline` table pending design.

---

## Architecture Pattern (MANDATORY)

All new pages MUST follow this pattern:

### Server Component (`page.tsx`)
```tsx
import { createAdminClient } from '@/lib/supabase/server'
import PageClient from './PageClient'

export const dynamic = 'force-dynamic'

export default async function PageNamePage() {
  const supabase = await createAdminClient()
  
  if (!supabase) {
    return <div className="p-6">Supabase not configured</div>
  }

  // Fetch data
  const { data } = await supabase
    .from('table_name')
    .select('*')
    .order('created_at', { ascending: false })

  return <PageClient data={data || []} />
}
```

### Client Component (`PageClient.tsx`)
```tsx
'use client'

export default function PageClient({ data }) {
  // Render UI
  return (
    <div className="animate-fade-in-up">
      {/* Page content */}
    </div>
  )
}
```

**Key points**:
- Server component fetches data using `createAdminClient()`
- Client component receives data as props
- `export const dynamic = 'force-dynamic'` on server component
- All database access goes through `createAdminClient()` (service role key)
- Never use `createClient()` (anon key) — it's blocked by RLS

---

## Supabase Tables (What's Available)

| Table | Rows | Key Columns |
|-------|------|-------------|
| `products` | 30 | id, name, tier, category, base_price_cny, pricing_model, status |
| `email_sequences` | 26 | id, name, type, status, trigger_type, campaign_id |
| `sequence_emails` | 102 | id, sequence_id, order_num, subject, body, delay_days |
| `assets` | 132 | id, name, type, folder_id, status, file_url, assigned_to, asset_priority |
| `build_tracker` | 291 | id, deliverable_number, deliverable_name, build_phase, status, assigned_to |

**Tables that DON'T exist yet**:
- `events` (Calendar page)
- `journey_pipeline` (Journeys page)

---

## Acceptance Criteria

For each page you build:
- [ ] Server component fetches from Supabase (except static pages)
- [ ] Client component renders data correctly
- [ ] `export const dynamic = 'force-dynamic'` on server components
- [ ] Error handling (empty state, Supabase not configured)
- [ ] Follows existing design system (Libre Baskerville + DM Sans, fuchsia accent, zero radius)
- [ ] Responsive (mobile + desktop)
- [ ] Commits to master (or feature branch that gets merged)

---

## Git Workflow

```bash
# If working on master directly:
git pull origin master
# ... make changes ...
git add .
git commit -m "Phase 0: Add Assets page — wire to Supabase"
git push origin master

# If working on feature branch:
git checkout -b phase-0-assets
git pull origin master
# ... make changes ...
git add .
git commit -m "Phase 0: Add Assets page — wire to Supabase"
git push origin phase-0-assets
# Then create PR to master
```

---

## Questions?

If you need clarification on:
- **Supabase schema**: Check `Business_Specs/supabase_full_migration.sql`
- **Design system**: Check `Business_Specs/Page_Specs/13_UI_UX_Design_System.md`
- **Product specs**: Check `Business_Specs/Page_Specs/` directory
- **Architecture**: Look at existing wired pages (Dashboard, Content, Distribution, Templates)

---

## Priority Order

1. **Assets Page** (HIGH) — uses existing table, clear specs
2. **Analytics Page** (MEDIUM) — aggregation queries, more complex
3. **Agents Page** (LOW) — static for now, quick win
4. **Calendar/Journeys** (LOW) — skip until tables are designed

**Total estimated effort**: ~11-14h

---

## Summary

**Start from**: `b758e44` (master)  
**Discard**: `trae/agent-Ifazma` branch  
**Build**: Assets → Analytics → Agents → (Calendar/Journeys later)  
**Pattern**: Server component + Client component + `createAdminClient()`  
**Deploy**: Auto-deploys to Vercel on push to master

Ready when you are.
