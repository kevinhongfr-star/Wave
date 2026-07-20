# WAVE Phase 4 — Analytics, Polish & Production Readiness

**Duration**: ~15 hours
**Batches**: 2
**Prerequisites**: Phase 1-3 complete (all core tables and pages exist)
**Goal**: Build analytics dashboard, add error handling, responsive design, and production polish

---

## Batch 4.1: Analytics + Error Handling (9h)

### T-4.1.1: Dashboard stats API [1.5h]
**Priority**: HIGH
**File**: `src/app/api/dashboard/stats/route.ts`

**Task**:
Implement dashboard stats endpoint per `02_API_ROUTES.md` §9. Query all tables and aggregate:
- Campaigns: active count, planning, completed this month
- Content: total, created this month, published count
- Repurposing: queued, in-progress, completed this month
- Distribution: scheduled this week, sent this week
- Inbound: new count, this month total, conversion rate
- Mailing list: active count, growth this month

**Acceptance Criteria**:
- Returns all stats in single request
- Data matches actual table contents
- Handles empty tables gracefully (returns 0, not errors)

---

### T-4.1.2: Dashboard rewrite — real KPIs [2.5h]
**Priority**: HIGH
**Files**:
- `src/app/dashboard/page.tsx` (server component)
- `src/app/dashboard/DashboardClient.tsx` (client component)

**Task**:
Rewrite dashboard to show real, cross-module KPIs:

1. **KPI Cards Row** (6 cards):
   - Active Campaigns (count + trend)
   - Content This Month (count + trend)
   - Repurposing Jobs (active + completed)
   - Distributions (sent this week)
   - New Inbound (this week + trend)
   - Mailing List Health (active count + growth)

2. **Recent Activity Feed**:
   - Latest 10 events across all modules
   - "Campaign X created", "Content Y repurposed to blog", "Inbound from Z received"

3. **Quick Actions** (fixed links):
   - New Campaign → /dashboard/campaigns?new=true
   - New Content → /dashboard/content?new=true
   - Create Repurposing Job → /dashboard/repurposing?new=true
   - Log Inbound → /dashboard/inbound?new=true

4. **Pipeline Summary**:
   - Inbound pipeline mini-kanban (New → Responded → Closed)
   - Campaign status breakdown (Planning → Active → Completed)

5. **Charts** (using recharts):
   - Content production trend (last 6 months bar chart)
   - Distribution by channel (pie chart)
   - Inbound by source (bar chart)

**Acceptance Criteria**:
- All KPIs show real data from stats API
- Quick Action links work correctly
- Charts render with real data
- Recent activity populated
- Loading states during data fetch
- Error states if API fails

---

### T-4.1.3: Analytics page enhancement [2.5h]
**Priority**: HIGH
**Files**:
- `src/app/dashboard/analytics/page.tsx`
- `src/app/dashboard/analytics/AnalyticsClient.tsx`

**Task**:
Enhance analytics with real charts (recharts) and cross-module metrics:

1. **Campaign Performance Tab**:
   - Campaign list with metrics: content pieces, distributions, inbound generated
   - Goal vs actual progress bars

2. **Content Analytics Tab**:
   - Content production by type (stacked bar chart)
   - Repurposing throughput (source → outputs ratio)
   - Top content by distribution count

3. **Distribution Analytics Tab**:
   - Channel distribution breakdown (pie chart)
   - Monthly trend (line chart)
   - Email metrics: sent, opened, clicked (if data available)

4. **Mailing List Tab**:
   - List growth chart
   - Segment distribution (pie chart)
   - Engagement score distribution (histogram)

5. **Export**: CSV export for each tab (already partially built — enhance)

**Acceptance Criteria**:
- All charts render with real data
- Tabs switch correctly
- Data aggregations accurate
- CSV export works
- Responsive on laptop screens

---

### T-4.1.4: Error boundaries + loading states [2.5h]
**Priority**: HIGH
**Files**:
- `src/app/dashboard/error.tsx` (new)
- `src/app/dashboard/loading.tsx` (new)
- `src/app/dashboard/[module]/error.tsx` (new, for each module)
- `src/app/dashboard/[module]/loading.tsx` (new, for each module)
- `src/components/ErrorBoundary.tsx` (new)

**Task**:
Add error boundaries and loading states for every page:

1. **Global error boundary** (`dashboard/error.tsx`):
   - Friendly error message
   - "Try again" button
   - Report issue option

2. **Per-module error boundaries** (each page):
   - Module-specific error messages
   - Retry button that re-fetches data
   - Fallback UI (empty state, not white screen)

3. **Loading states** (each page):
   - Skeleton screens matching page layout
   - Table skeletons for list views
   - Card skeletons for dashboard

4. **API error handling**:
   - Consistent error response format
   - Toast notifications for failed operations
   - Optimistic UI with rollback on error

**Acceptance Criteria**:
- No white screen of death anywhere
- Loading skeletons show during data fetch
- Error states are informative and actionable
- Failed API calls show toast notifications
- Retry buttons work

---

## Batch 4.2: Responsive + Final Polish (6h)

### T-4.2.1: Responsive sidebar [2h]
**Priority**: HIGH
**Files**:
- `src/components/layout/Sidebar.tsx`
- `src/app/dashboard/layout.tsx`
- `src/components/layout/MobileNav.tsx` (new)

**Task**:
Make sidebar responsive:
1. Desktop (>1024px): Fixed sidebar as current
2. Tablet (768-1024px): Collapsed sidebar (icons only, expand on hover)
3. Mobile (<768px): Hidden sidebar, hamburger menu → slide-out drawer

Implementation:
- Remove hardcoded `ml-60` from layout
- Add responsive breakpoint detection
- Mobile: hamburger icon in TopBar → opens drawer overlay
- Drawer: full navigation, swipe-to-close
- Remember collapsed state in localStorage

**Acceptance Criteria**:
- Desktop: sidebar always visible, 240px wide
- Tablet: sidebar collapses to 64px icons-only
- Mobile: sidebar hidden, hamburger menu works
- Drawer closes on outside click / escape key
- Content area uses full width when sidebar hidden

---

### T-4.2.2: TopBar fixes + a11y [1.5h]
**Priority**: MEDIUM
**Files**:
- `src/components/layout/TopBar.tsx`
- `src/app/globals.css` (additions)

**Task**:
Fix TopBar functionality and accessibility:
1. **Search**: Make functional — search across all modules (content, campaigns, contacts)
   - Search input with debounced API call
   - Results dropdown grouped by module
   - Click result → navigate to item

2. **Notification bell**: Connect to real data
   - Show count of: new inbound, pending reviews, upcoming distributions
   - Dropdown with notification list

3. **Theme toggle**: Add system preference detection
   - `prefers-color-scheme` media query
   - Prevent FOUC with inline script in `<head>`
   - Persist preference in localStorage

4. **Accessibility**:
   - All icon buttons get `aria-label`
   - Focus management for dropdowns
   - Keyboard navigation (Tab, Escape, Enter)
   - Skip-nav link

**Acceptance Criteria**:
- Search returns real results across modules
- Notification bell shows accurate count
- Theme toggle respects system preference
- No FOUC on page load
- All buttons have aria-labels
- Keyboard navigation works

---

### T-4.2.3: Toast notifications + sonner integration [1h]
**Priority**: MEDIUM
**Files**:
- `src/components/Toast.tsx` (new)
- `src/app/dashboard/layout.tsx` (add Toaster)
- All client components (add toast calls)

**Task**:
Add sonner toast notification system:
- Success toast (green): "Campaign created", "Content saved", "Job completed"
- Error toast (red): "Failed to save", "API error"
- Info toast (blue): "3 jobs queued", "Import complete"
- Position: bottom-right
- Auto-dismiss: 4s (success/info), 6s (error)

**Acceptance Criteria**:
- All CRUD operations show success/error toasts
- Toasts don't block interaction
- Dismiss manually or auto-timeout

---

### T-4.2.4: Sidebar navigation update [0.5h]
**Priority**: MEDIUM
**File**: `src/components/layout/Sidebar.tsx`

**Task**:
Update sidebar to match new module structure:
- Remove old nav items that no longer match
- Add: Campaigns, Content Hub, Repurposing, Distribution, Mailing List, Inbound, Templates, Analytics, Agent Bridge
- Add icons for each (from lucide-react)
- Show active state correctly

**Acceptance Criteria**:
- All new pages accessible from sidebar
- Icons match module purpose
- Active highlight works
- Nav order matches spec §4

---

### T-4.2.5: Final QA + edge cases [1h]
**Priority**: MEDIUM

**Task**:
Final pass across all pages:
1. Empty states — every list page needs a friendly empty state with CTA
2. 404 handling — invalid URLs show friendly 404 page
3. Form validation — all forms use zod validation
4. Date formatting — consistent date display (use date-fns)
5. Number formatting — commas in large numbers, percentages
6. Loading → Content transitions — no layout shifts

**Acceptance Criteria**:
- No blank pages (all have empty states)
- Invalid URLs show 404 with navigation back
- All forms validate before submit
- Dates and numbers formatted consistently

---

## Batch 4 Summary

| Metric | Value |
|--------|-------|
| Total tickets | 10 |
| New components | 4 (ErrorBoundary, MobileNav, Toast, global search) |
| Rewritten pages | 2 (Dashboard, Analytics) |
| Charts added | recharts integration (5+ chart types) |
| Accessibility improvements | a11y labels, keyboard nav, skip-nav, focus management |
| Responsive | Sidebar + layout responsive (desktop/tablet/mobile) |
| Estimated hours | 15h |

### Post-Batch 4 State (FINAL)
- ✅ Analytics dashboard with real charts
- ✅ Error boundaries on every page
- ✅ Loading skeletons everywhere
- ✅ Responsive sidebar (desktop/tablet/mobile)
- ✅ Search functional across all modules
- ✅ Notification bell connected
- ✅ Dark mode with system preference detection
- ✅ Toast notifications for all actions
- ✅ Empty states on all list pages
- ✅ Form validation with zod
- ✅ Consistent date/number formatting

---

## Final Product State (All 4 Phases Complete)

| Module | Status |
|--------|--------|
| Dashboard | ✅ Real KPIs, charts, quick actions |
| Campaigns | ✅ Full CRUD, linked to content/contacts/distribution |
| Content Hub | ✅ Real content library with filters and Notion links |
| Repurposing | ✅ AI-powered, DeepSeek integrated, chain visualization |
| Distribution | ✅ Multi-channel, calendar view, scheduling |
| Mailing List | ✅ Contact management, segments, import/export |
| Inbound | ✅ Kanban pipeline, source tracking, campaign linkage |
| Templates | ✅ Template library with AI generation |
| Analytics | ✅ Cross-module charts, CSV export |
| Agent Bridge | ✅ AI job queue, token/cost tracking |
| Shell | ✅ Responsive sidebar, search, notifications, dark mode |

**Total estimated effort: 80 hours across 11 batches, 48 tickets**

---

*Document generated: 2026-07-20 | Author: NEXUS Agent*
