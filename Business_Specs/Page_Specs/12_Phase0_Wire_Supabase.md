# WAVE Business Spec — Phase 0: Wire Supabase to Existing UI

**Version:** 1.0 | **Date:** 2026-07-16 | **Author:** NEXUS
**For:** Trae (Engineering)
**Prerequisite:** Supabase tables exist (72 tables migrated), client.ts/server.ts exist
**Tickets:** P0-001 through P0-006 (6 tickets, ~25h estimated)
**Goal:** Transform WAVE from static mockup to functional app with real data

---

## Current State

- 10 pages exist with hardcoded mock data (`const items = [...]`)
- Supabase client libraries exist but are never imported
- No `.env` file, no auth, no database queries
- 72 tables created in Supabase, 2 tables seeded with data (assets: 107 records, build_tracker: ~503 records)

## What Phase 0 Delivers

After Phase 0, WAVE displays real data from Supabase, supports basic CRUD, and has auth. Users can log in and see their actual assets, content calendar, templates — not mock data.

---

## P0-001 | Environment Setup & Auth
**Module:** Infrastructure | **Priority:** P0 | **Est:** 4h

**What:** Configure environment variables, Supabase connection, and basic auth (email/password login).

**Tasks:**
1. Create `wave-app/.env.local` with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://rnnlteyqmtxkzllbohuu.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key_from_supabase>
   SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
   ```
2. Create `wave-app/.env.example` (no real keys, just placeholders)
3. Update `src/middleware.ts` to protect `/dashboard/*` routes (redirect to `/login` if not authenticated)
4. Create `/login` page with email + password form
5. Create `/auth/callback` route handler for Supabase auth callback
6. Add `.env.local` to `.gitignore`

**SQL (run in Supabase if not exists):**
```sql
-- Check if auth.users has any users; if not, create Kevin's account via Supabase dashboard
-- Auth is handled by Supabase Auth (email/password)
-- No custom table needed for Phase 0
```

**Acceptance:**
- [ ] `npm run dev` starts without errors
- [ ] `/login` page loads, accepts email + password
- [ ] Successful login redirects to `/dashboard`
- [ ] Unauthenticated access to `/dashboard/*` redirects to `/login`
- [ ] Logout button in TopBar clears session
- [ ] `.env.local` not committed to git

---

## P0-002 | Dashboard — Real Data from Supabase
**Module:** Module 1 (Dashboard) | **Priority:** P0 | **Est:** 5h

**What:** Replace hardcoded KPIs and activity feed with real Supabase queries.

**Current page:** `src/app/dashboard/page.tsx` (hardcoded `kpis`, `recentActivity`, `agentStatus`)

**Data mapping:**
| Current Mock | Supabase Source |
|--------------|-----------------|
| "Content Pieces: 147" | `SELECT COUNT(*) FROM content_calendar WHERE status NOT IN ('archived')` |
| "Email Sequences: 18" | `SELECT COUNT(*) FROM email_sequences` |
| "Active Journeys: 7" | `SELECT COUNT(*) FROM journeys WHERE status = 'active'` |
| "Upcoming Events: 5" | `SELECT COUNT(*) FROM events WHERE start_at > NOW() AND status != 'cancelled'` |
| Recent activity feed | `SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 6` |
| Agent status | Hardcode for now (Phase 2: real agent tracking) |

**New code structure:**
```typescript
// src/app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const [
    { count: contentCount },
    { count: sequenceCount },
    { count: journeyCount },
    { count: eventCount },
    { data: recentActivity }
  ] = await Promise.all([
    supabase.from('content_calendar').select('*', { count: 'exact', head: true }).neq('status', 'archived'),
    supabase.from('email_sequences').select('*', { count: 'exact', head: true }),
    supabase.from('journeys').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('events').select('*', { count: 'exact', head: true }).gt('start_at', new Date().toISOString()).neq('status', 'cancelled'),
    supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(6)
  ])
  
  // Render with real counts...
}
```

**Acceptance:**
- [ ] Dashboard shows real counts from Supabase (not hardcoded "147", "18", etc.)
- [ ] Recent activity shows actual rows from `activity_log` table (or empty state if table is empty)
- [ ] Loading state while queries execute
- [ ] Error state if Supabase connection fails (graceful fallback, not crash)
- [ ] Page is a Server Component (no "use client" needed for read-only data)

---

## P0-003 | Content Calendar — Real Data + Status Change
**Module:** Module 2 (Content Calendar) | **Priority:** P0 | **Est:** 5h

**What:** Replace hardcoded content list with Supabase query. Add ability to change status (idea → draft → review → published).

**Current page:** `src/app/dashboard/content/page.tsx` (hardcoded `items` array)

**Data mapping:**
| Current Mock | Supabase Source |
|--------------|-----------------|
| Content table | `SELECT * FROM content_calendar ORDER BY due_date DESC` |
| Status column | `status` field (map to colors: idea=gray, draft=yellow, review=blue, published=green) |
| Title, channel, date, author | `title`, `channel`, `due_date`, `assigned_to` |

**New features:**
1. Status dropdown on each row (select → updates `status` column)
2. Client Component for interactive status change:
   ```typescript
   'use client'
   async function updateStatus(id: string, newStatus: string) {
     const supabase = createBrowserClient()
     await supabase.from('content_calendar').update({ status: newStatus }).eq('id', id)
     router.refresh() // re-fetch server component
   }
   ```

**Acceptance:**
- [ ] Content page shows real rows from `content_calendar` table
- [ ] Empty state if no rows (not blank page)
- [ ] Status dropdown on each row, clicking updates the database
- [ ] Optimistic UI update (status changes immediately, then confirms)
- [ ] Error handling if update fails (toast notification)
- [ ] Page refreshes data after status change

---

## P0-004 | Assets & Templates — Real Data
**Module:** Module 3 (Templates/Assets) | **Priority:** P0 | **Est:** 4h

**What:** Replace hardcoded templates page with real data from `assets` and `templates` tables.

**Current page:** `src/app/dashboard/templates/page.tsx`

**Data mapping:**
| Current Mock | Supabase Source |
|--------------|-----------------|
| Template cards | `SELECT * FROM templates ORDER BY created_at DESC` |
| Asset library (new section) | `SELECT * FROM assets ORDER BY created_at DESC` |

**Tasks:**
1. Update templates page to query `templates` table
2. Add "Assets" tab or section that queries `assets` table (the 107 Notion-imported records)
3. Display asset metadata: `name`, `asset_category`, `status`, `notion_phase`, `asset_format`
4. Add filter by `asset_category` (dropdown: all, email, webinar, workshop, etc.)

**Acceptance:**
- [ ] Templates page shows real templates from database
- [ ] Assets section shows the 107 imported Notion assets
- [ ] Category filter works (filters client-side or server-side)
- [ ] Clicking an asset opens detail view (read-only for Phase 0)
- [ ] Loading and empty states

---

## P0-005 | Events & Journeys — Real Data
**Module:** Module 7 (Events) + Module 5 (Journeys) | **Priority:** P1 | **Est:** 4h

**What:** Replace hardcoded events and journeys pages with real Supabase data.

**Current pages:**
- `src/app/dashboard/events/page.tsx`
- `src/app/dashboard/journeys/page.tsx`

**Data mapping:**
| Page | Supabase Source |
|------|-----------------|
| Events | `SELECT * FROM events ORDER BY start_at DESC` |
| Journeys | `SELECT * FROM journeys ORDER BY created_at DESC` |

**Tasks:**
1. Events page: query `events` table, display title, type, start_at, status, registration_count
2. Journeys page: query `journeys` table, display name, trigger_type, status, enrolled_count
3. Both pages: click row → detail view (read-only for Phase 0)

**Acceptance:**
- [ ] Events page shows real events (or empty state)
- [ ] Journeys page shows real journeys (or empty state)
- [ ] Date formatting (start_at → human-readable)
- [ ] Status badges with colors
- [ ] Loading and error states

---

## P0-006 | Analytics, Distribution, Repurposing, Agents — Real Data
**Module:** Modules 4, 6, 8 | **Priority:** P1 | **Est:** 3h

**What:** Replace remaining hardcoded pages with real data. Low-complexity — same pattern as above.

**Pages to update:**
- `src/app/dashboard/analytics/page.tsx` → query `campaign_metrics` or aggregate from other tables
- `src/app/dashboard/distribution/page.tsx` → query `distribution_tasks` table
- `src/app/dashboard/repurposing/page.tsx` → query `repurposing_maps` + `repurposing_derivatives`
- `src/app/dashboard/agents/page.tsx` → hardcode agent list for now (Phase 2: real tracking)

**Tasks:**
1. Each page: replace `const data = [...]` with Supabase query
2. Follow same pattern: Server Component for data fetching, Client Component for interactivity
3. Empty states for all pages (not blank)

**Acceptance:**
- [ ] All 4 pages show real data (or meaningful empty states)
- [ ] No hardcoded mock data remaining in any page
- [ ] Consistent loading/error states across all pages
- [ ] Agents page still shows hardcoded list (ok for Phase 0)

---

## Acceptance Criteria Summary

After all 6 tickets complete:

| Check | Status |
|-------|--------|
| User can log in at `/login` | ✅ |
| Dashboard shows real counts | ✅ |
| Content calendar shows real rows, status can be changed | ✅ |
| Assets page shows 107 Notion-imported assets | ✅ |
| Templates page shows real templates | ✅ |
| Events/Journeys show real data | ✅ |
| Analytics/Distribution/Repurposing show real data | ✅ |
| No hardcoded mock data in any page (except agents) | ✅ |
| All pages have loading + empty + error states | ✅ |
| `.env.local` not committed to git | ✅ |

**Total effort: ~25h | ~1 week for Trae**

---

## What Phase 0 Does NOT Include

- Creating new content, templates, events (only read + status change)
- Complex forms (multi-field create/edit)
- File uploads (attachments, images)
- Email sending, distribution execution
- Agent tracking, automation
- LMS, programs, podcasts (Phase 1/2/3)
- Notion sync service (NOTION-006)
- Advanced filters, search, pagination

**Phase 0 = make the app alive. Phase 1+ = add features.**

---

## Deployment Checklist

After Phase 0 is complete:

1. [ ] Add environment variables to Vercel project settings
2. [ ] Set `rootDirectory=wave-app` in Vercel (already done per git log)
3. [ ] Deploy to Vercel (auto-deploy on push to master)
4. [ ] Test login flow in production
5. [ ] Verify Supabase connection from production (CORS, keys)
6. [ ] Create Kevin's user account in Supabase Auth
7. [ ] Smoke test: login → dashboard → content → status change

---

*Spec by NEXUS. 6 tickets, ~25h. Turns WAVE from static mockup to functional app. Ready for Trae execution.*
