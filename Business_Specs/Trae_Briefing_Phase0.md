# Trae Briefing — Phase 0: Wire Supabase to Existing UI

**Date:** 2026-07-17  
**From:** NEXUS  
**To:** Trae  
**Priority:** P0 (unblocks all other work)

---

## Current State

### Master Branch (what you should work on)
- 10 pages with **hardcoded mock data** (`const items = [...]`)
- Supabase client libraries exist but are **never imported** by any page
- No `.env` file, no auth, no database queries
- 72 tables created in Supabase, 2 tables seeded with data (assets: 107 records, build_tracker: ~503 records)
- All business specs, CD instructions, Notion audit, Phase specs are on master

### Your Branch (`trae/agent-Ifazma`)
- Last commit: July 10 (7 days ago)
- You built DeepSeek client library (good, but unused)
- You updated config files (vercel.json, package.json)
- **Problem:** Your branch deleted 8 of 10 pages (content, templates, events, etc.)
- **Problem:** Your branch is missing all recent master commits (specs, audit, Phase 0)

**Action required:** Discard your branch's app changes, pull master, start fresh from master's state.

---

## Phase 0 — What You Need to Build

**Goal:** Transform WAVE from static mockup to functional app with real data from Supabase.

**Spec file:** `Business_Specs/Page_Specs/12_Phase0_Wire_Supabase.md` (278 lines, 6 tickets)

### Ticket Summary

| ID | Title | Effort | What |
|----|-------|--------|------|
| P0-001 | Environment Setup & Auth | 4h | `.env.local`, middleware to protect routes, `/login` page |
| P0-002 | Dashboard — Real Data | 5h | Replace hardcoded KPIs with Supabase queries |
| P0-003 | Content Calendar — Real Data + Status Change | 5h | Query `content_calendar`, add status dropdown |
| P0-004 | Assets & Templates — Real Data | 4h | Query `assets` (107 records) + `templates` tables |
| P0-005 | Events & Journeys — Real Data | 4h | Query `events` + `journeys` tables |
| P0-006 | Remaining Pages — Real Data | 3h | Analytics, distribution, repurposing, agents |

**Total: ~25h | ~1 week**

---

## Step-by-Step Instructions

### Step 1: Sync with Master
```bash
git checkout master
git pull origin master
# Discard your branch's app changes — master has all the pages you need
```

### Step 2: Read the Spec
Open `Business_Specs/Page_Specs/12_Phase0_Wire_Supabase.md` and read all 6 tickets.

### Step 3: Start with P0-001 (Auth + Env)
1. Create `wave-app/.env.local` with Supabase credentials (I'll provide these separately)
2. Add `.env.local` to `.gitignore`
3. Create `wave-app/src/middleware.ts` to protect `/dashboard/*` routes
4. Create `/login` page (simple email + password form)
5. Create `/auth/callback` route handler
6. Test: login → redirects to dashboard, logout → redirects to login

### Step 4: P0-002 (Dashboard)
1. Open `wave-app/src/app/dashboard/page.tsx`
2. Replace hardcoded `kpis` array with Supabase queries:
   ```typescript
   import { createClient } from '@/lib/supabase/server'
   
   export default async function DashboardPage() {
     const supabase = await createClient()
     const { count } = await supabase.from('content_calendar').select('*', { count: 'exact', head: true })
     // ... render with real count
   }
   ```
3. Add loading state, error state, empty state
4. Test: dashboard shows real counts from database

### Step 5: P0-003 (Content Calendar + Status Change)
1. Open `wave-app/src/app/dashboard/content/page.tsx`
2. Replace hardcoded `items` with Supabase query
3. Add status dropdown (Client Component) that updates database on change
4. Use optimistic UI update + `router.refresh()`
5. Test: content list shows real rows, clicking status dropdown updates database

### Step 6: Continue with P0-004, P0-005, P0-006
Follow the same pattern: query table, replace hardcoded data, add loading/error/empty states.

### Step 7: Deploy
1. Add environment variables to Vercel project settings (I'll provide)
2. Push to master → auto-deploy
3. Test login flow in production
4. Verify Supabase connection from production

---

## Key Constraints

1. **Use master branch** — do NOT use your `trae/agent-Ifazma` branch for app changes
2. **Server Components by default** — only use `"use client"` for interactive elements (status dropdown, forms)
3. **Supabase client** — use `@/lib/supabase/server` for Server Components, `@/lib/supabase/client` for Client Components
4. **No hardcoded mock data** — every page must query Supabase or show meaningful empty state
5. **Loading + error + empty states** — all pages must handle these gracefully
6. **Auth required** — all `/dashboard/*` routes protected by middleware
7. **`.env.local` never committed** — add to `.gitignore`

---

## What You Can Keep from Your Branch

- `src/lib/deepseek.ts` — good work, keep it (but it's not used in Phase 0)
- `vercel.json` env var placeholders — good, keep it
- `package.json` dependency updates — good if they don't break anything

## What You Must Discard from Your Branch

- The deleted pages (content, templates, events, etc.) — master has them, you deleted them
- Any changes to `globals.css`, `layout.tsx`, `page.tsx` — master has the correct versions
- The merge commit that deleted files — start fresh from master

---

## Supabase Connection Info (for `.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=https://rnnlteyqmtxkzllbohuu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<I'll provide this>
SUPABASE_SERVICE_ROLE_KEY=<I'll provide this>
```

**Important:** The anon key is safe to expose in frontend code (RLS protects data). The service role key is secret — only use in Server Components, never in Client Components.

---

## Tables You'll Query

| Page | Table(s) | Notes |
|------|----------|-------|
| Dashboard | `content_calendar`, `email_sequences`, `journeys`, `events`, `activity_log` | Aggregate counts + recent activity |
| Content | `content_calendar` | Status change via UPDATE query |
| Templates | `templates` | Read-only for Phase 0 |
| Assets | `assets` | 107 Notion-imported records |
| Events | `events` | Read-only for Phase 0 |
| Journeys | `journeys` | Read-only for Phase 0 |
| Analytics | `campaign_metrics` or aggregate from other tables | May need to create view |
| Distribution | `distribution_tasks` | Read-only for Phase 0 |
| Repurposing | `repurposing_maps`, `repurposing_derivatives` | Read-only for Phase 0 |
| Agents | Hardcoded for now | Phase 2: real agent tracking |

---

## Acceptance Criteria (Phase 0 Complete)

- [ ] User can log in at `/login`
- [ ] Unauthenticated access to `/dashboard/*` redirects to `/login`
- [ ] Dashboard shows real counts from Supabase (not hardcoded "147", "18", etc.)
- [ ] Content calendar shows real rows, status can be changed
- [ ] Assets page shows 107 Notion-imported assets
- [ ] Templates page shows real templates
- [ ] Events/Journeys show real data (or empty state)
- [ ] All pages have loading + empty + error states
- [ ] No hardcoded mock data in any page (except agents)
- [ ] `.env.local` not committed to git
- [ ] App deployed to Vercel, login flow works in production

---

## Questions?

If anything is unclear, ask in the group chat. I'll respond.

**Start with P0-001. Get auth working first. Then move to P0-002 (dashboard). Then P0-003 (content + status change). The rest follow the same pattern.**

Good luck.

— NEXUS
