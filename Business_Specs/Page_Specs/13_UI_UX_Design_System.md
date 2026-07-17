# UI/UX Design System & User Experience

**Phase:** UI/UX Foundation + Full Product Interface Build  
**Tickets:** 18 original tickets → **revised to ~85 tickets across 4 priority tiers**  
**Original Estimate:** ~60h total  
**Revised Estimate:** **810h total** (671h page redesigns + 139h technical infrastructure)  
**Revision Date:** 2026-07-17  
**Dependencies:** None (can run parallel to Phase 0 or before)

---

## ⚠️ CRITICAL REVISION NOTICE

**The original 60h estimate was wrong. The actual work is 810h — 13.5x the original estimate.**

### Why the original estimate was wrong:
The original spec assumed "polish" work — adding loading states, improving responsive design, adding animations to an already-functional UI. 

**The reality discovered during deep-dive audit:**
- 9 of 10 pages are **single tables with 5 hardcoded rows**
- No buttons, no forms, no detail views, no filtering, no search
- No empty/loading/error states
- No create/edit/delete functionality
- Supabase is installed but **never imported** (zero queries)
- The HTML prototype (1,108 lines) is **more complete than the React app**

**This isn't polish — it's building the actual product interface.**

### Detailed audit documents:
- **[14_UI_UX_Page_By_Page_Deep_Dive.md](14_UI_UX_Page_By_Page_Deep_Dive.md)** — 671h of page redesign work
- **[14B_UI_UX_Technical_Infrastructure_Audit.md](14B_UI_UX_Technical_Infrastructure_Audit.md)** — 139h of infrastructure work

---

## Current State Assessment (Post-Audit)

### What exists:
- 10 pages, ~1,082 lines of UI code (18 source files total)
- shadcn/ui + Tailwind CSS with well-structured design tokens
- Consistent CSS variables for light/dark themes
- Basic responsive grid
- Dashboard is the only "rich" page (KPIs, activity feed, agent status, quick actions)
- HTML prototype (1,108 lines) that demonstrates the intended design

### What's missing (everything else):
- **Forms:** No create/edit/delete forms on any page
- **Detail views:** No drill-down, no detail pages
- **Data interaction:** No filtering, sorting, searching, pagination
- **Content Calendar:** Not a calendar — it's a table. No calendar/list/kanban views
- **Analytics:** Not charts — it's a table. No visualizations
- **Journeys:** No visual builder, no drag-and-drop nodes
- **Templates:** No visual previews, no card/grid view
- **Distribution:** No creation, no scheduling, no channel config
- **Events:** No creation, no attendee management, no payments
- **Agents:** No detail views, no task lists, no logs
- **Empty/loading/error states:** None on any page
- **Supabase integration:** Zero queries, no .env file
- **Missing dependencies:** No react-hook-form, zod, recharts, @dnd-kit, react-quill, @tanstack/react-table, date-fns, react-day-picker, sonner, @radix-ui (most), cmdk
- **Dark mode:** Incomplete — Sidebar and TopBar have hardcoded colors

---

## Revised Effort Breakdown

### By Priority Tier

| Priority | Description | Effort | Timing |
|----------|-------------|--------|--------|
| **P0** | Critical fixes for go-live | 46h | Before/during Phase 0 |
| **P1** | Core page redesigns | 379h | During Wave 1-2 |
| **P2** | Secondary pages + responsive | 232h | Wave 2-3 |
| **P3** | Polish & advanced features | 113h | Wave 3-4 |
| **Infrastructure** | Dependencies, config, shared components | 139h | Before any page work |
| | **TOTAL** | **810h** | |

### P0: Critical Fixes (46h) — Before Go-Live
From [14A Audit](14_UI_UX_Page_By_Page_Deep_Dive.md):
- Empty states for all 10 pages (5h)
- Loading skeletons for all pages (4h)
- Error boundaries + error states (4h)
- Mobile sidebar (hamburger menu) (3h)
- Basic responsive fixes (5h)
- Dark mode fix for Sidebar/TopBar (2h)
- Supabase .env configuration (1h)
- Basic form validation patterns (5h)
- Toast notification system (2h)
- Dashboard Supabase wiring (15h)

### Infrastructure Foundation (139h) — Before Any Page Work
From [14B Audit](14B_UI_UX_Technical_Infrastructure_Audit.md):

**P0 Infrastructure (27h):**
- Install missing dependencies (2h)
- Create .env.local + .env.example (1h)
- Create shared UI components directory (4h)
- Create TypeScript type definitions (4h)
- Fix dark mode in Sidebar/TopBar (2h)
- Create API route structure (4h)
- Create auth middleware (4h)
- Create loading/error boundary components (3h)
- Create toast notification system (3h)

**P1 Infrastructure (72h):**
- Wire Supabase client + auth (8h)
- Create data fetching hooks (6h)
- Create form handling system with react-hook-form + zod (8h)
- Create table component with @tanstack/react-table (6h)
- Create chart components with recharts (8h)
- Create date picker with react-day-picker (4h)
- Create drag-and-drop system with @dnd-kit (8h)
- Create rich text editor with react-quill (6h)
- Create file upload system (4h)
- Create search/filter components (6h)
- Create pagination system (4h)
- Create modal/drawer system (4h)

**P2 Infrastructure (40h):**
- Mobile responsive utilities (6h)
- Accessibility testing setup (4h)
- Keyboard navigation system (6h)
- Screen reader testing (4h)
- Performance optimization (6h)
- Testing infrastructure (8h)
- CI/CD pipeline (6h)

### P1: Core Page Redesigns (307h)
From [14A Audit](14_UI_UX_Page_By_Page_Deep_Dive.md):

| Page | Current State | Required Work | Effort |
|------|--------------|---------------|--------|
| Dashboard | KPIs + activity (155 lines) | Wire to Supabase, add Focus Today, revenue KPIs | 20-26h |
| Content Calendar | Single table (67 lines) | Calendar/List/Kanban views, create form, filters, drag-drop | 40-50h |
| Templates | Single table (67 lines) | Card/grid view, create form, brand kit, tags | 30-40h |
| Distribution | Single table (67 lines) | Campaign creation, channel config, queue view, A/B testing | 45-55h |
| Journeys | Single table (67 lines) | Visual journey builder (drag-drop), contact inspector | 60-80h |
| Repurposing | Single table (67 lines) | Project creation, output gallery, pipeline visualization | 35-45h |
| Events | Single table (76 lines) | Event wizard, attendee mgmt, payments, check-in | 50-60h |
| Analytics | Single table (76 lines) | Charts, funnel, campaign ROI, custom reports | 50-60h |
| Agents | Single table (76 lines) | Agent cards, detail pages, activity timeline, logs | 35-45h |
| **Total** | | | **~307h** |

### P2: Secondary Work (232h)
- Mobile responsive for all pages (60h)
- Advanced filtering/sorting/search (40h)
- Bulk operations (20h)
- Export functionality (25h)
- Advanced form validation (20h)
- Keyboard shortcuts (15h)
- Context menus (12h)
- Quick actions system (10h)
- Breadcrumb improvements (5h)
- Notification center (25h)

### P3: Polish (113h)
- Animation & micro-interactions (25h)
- Custom illustrations for empty states (15h)
- Onboarding tour (20h)
- Theme customization (10h)
- Advanced data visualization (20h)
- Performance optimization (10h)
- Cross-browser testing (8h)
- Final accessibility audit (5h)

---

## Original Tickets (Retained for Reference)

The original 18 tickets (UX-001 through UX-018) are now **subsumed** into the revised priority tiers above. They remain valid as scope descriptions but their effort estimates are superseded by the audit findings.

### Phase A: UI/UX Foundation (Original: 25h → Revised: 46h P0 + 27h Infrastructure)
- UX-001: Design Token System → Already done ✅ (globals.css is well-structured)
- UX-002: Component Library → **Expanded to 27h infrastructure work**
- UX-003: Dashboard Interaction → **Expanded to 20-26h (full Supabase wiring)**
- UX-004: Content Calendar Workflow → **Expanded to 40-50h (3 view modes)**
- UX-005: Template Library UX → **Expanded to 30-40h (card view + brand kit)**
- UX-006: Navigation & IA → Remains ~2h
- UX-007: Mobile Layout Dashboard → **Expanded to 60h (all pages mobile)**
- UX-008: Mobile Layout Tables → **Subsumed into P2 mobile work**

### Phase B: UI/UX Iteration (Original: 35h → Revised: subsumed into P1-P3)
- UX-009: Loading & Error States → **Expanded to P0 (13h for all pages)**
- UX-010: Journey Builder UI → **Expanded to 60-80h (visual builder)**
- UX-011: Email Sequence Editor → **Subsumed into Distribution page (45-55h)**
- UX-012: Event Registration Flow → **Expanded to 50-60h (full wizard)**
- UX-013: Accessibility Audit → **Expanded to P2 (accessibility from day one)**
- UX-014: Animation & Micro-interactions → Remains in P3 (25h)
- UX-015: Icon System → Remains in P3
- UX-016: Empty States & Onboarding → **Expanded to P0 (5h) + P3 (20h onboarding)**
- UX-017: Analytics Dashboard Charts → **Expanded to 50-60h (full analytics)**
- UX-018: KPI Widgets → **Subsumed into Dashboard (20-26h)**

---

## Updated Execution Strategy

### Recommended: Phased Infrastructure-First Approach

**Wave 1 (Immediate, 4-5 weeks): Infrastructure + P0 = 73h**
1. Infrastructure P0 (27h) — Install dependencies, create .env, shared components
2. UI/UX P0 (19h) — Empty states, loading, error handling, mobile sidebar
3. Supabase wiring P0 (27h from Phase 0 spec) — Wire database to app

**Wave 2 (Short-term, 3-4 months): P1 Pages + Infrastructure P1 = 686h**
1. Infrastructure P1 (72h) — Data hooks, forms, tables, charts, drag-drop
2. Dashboard redesign (20-26h)
3. Content Calendar redesign (40-50h)
4. Templates redesign (30-40h)
5. Distribution redesign (45-55h)
6. Journeys redesign (60-80h) — Most complex page
7. Repurposing redesign (35-45h)

**Wave 3 (Medium-term, 3-4 months): P2 Pages + Infrastructure P2 = 509h**
1. Events redesign (50-60h)
2. Analytics redesign (50-60h)
3. Agents redesign (35-45h)
4. Infrastructure P2 (40h)
5. P2 secondary work (232h) — Mobile, filtering, bulk ops, exports

**Wave 4 (Long-term, 2-3 months): P3 Polish = 113h**
1. Animation & micro-interactions
2. Onboarding tour
3. Advanced visualizations
4. Final accessibility audit

### Total Timeline: ~12-16 months

---

## Go-Live Minimum

**To have a functional (not pretty) WAVE app:**
- Phase 0: Wire Supabase (25h)
- Infrastructure P0: Dependencies + config + shared components (27h)
- UI/UX P0: Empty/loading/error states (19h)
- Dashboard wired to Supabase (15h of the 20-26h)
- **Minimum go-live: ~86h (3-4 weeks)**

**To have a usable WAVE app:**
- Above + Content Calendar + Templates + Distribution (40+30+45 = 115h)
- **Usable go-live: ~201h (8-10 weeks)**

---

## Key Lessons

1. **Never estimate UI work without reading the code.** The original 60h assumed functional pages needed polish. The reality was non-functional pages needed to be built.

2. **HTML prototypes are valuable.** The 1,108-line HTML prototype shows what the product should look like. The React app should use it as visual reference.

3. **Design system quality ≠ product quality.** The CSS tokens and Tailwind config are excellent. But design systems don't create functionality.

4. **Supabase integration is not optional.** The app has zero data connectivity. Every page needs database wiring, not just UI improvements.

5. **"Table" is not a page.** A table with 5 hardcoded rows is a placeholder, not a product feature. Each "table page" needs forms, detail views, filtering, search, pagination, empty/loading/error states.

---

## Acceptance Criteria (Revised)

**Go-live minimum:**
- Supabase connected with .env configuration
- All pages show real data from database (no hardcoded arrays)
- Empty states, loading skeletons, error boundaries on all pages
- Mobile sidebar functional
- Dark mode complete
- Dashboard shows live KPIs

**Usable product:**
- All 9 content pages have create/edit/delete forms
- Content Calendar has at least list + one other view
- Analytics has at least basic charts
- Journeys has visual builder (even if basic)
- All pages responsive on tablet
- Search and filtering on all list pages

**Complete product:**
- All P1-P2 work complete
- Mobile responsive on all pages
- Full accessibility compliance
- Onboarding flow
- Animation and polish

---

## Notes

- This spec has been **completely revised** based on deep-dive audit findings (2026-07-17)
- Original 60h estimate → Revised 810h estimate
- See [14A](14_UI_UX_Page_By_Page_Deep_Dive.md) and [14B](14B_UI_UX_Technical_Infrastructure_Audit.md) for detailed breakdowns
- The HTML prototype at `HTML_Prototype/WAVE_Full_Prototype.html` should be used as visual reference
- All estimates assume using existing shadcn/ui + Tailwind stack
- All work is code-based, no Figma/design tool deliverables
- Accessibility is mandatory from day one, not audited later
