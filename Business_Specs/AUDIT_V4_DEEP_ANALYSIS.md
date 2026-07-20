# WAVE App — Deep Audit V4: Architecture, Security, Performance & Cross-Cutting Concerns

> Audit Date: 2026-07-20
> Auditor: NEXUS Agent
> Codebase: 27 source files, 3,721 LOC (TSX/TS) + 267 LOC (CSS)
> Live: https://wave-seven.vercel.app

---

## Executive Summary

WAVE is a **visually polished shell** with a clean design system, but has **critical architectural gaps** in security, error resilience, performance optimization, and accessibility. The app has **zero authentication**, **no error boundaries**, **no API layer**, and **no input validation**. It functions as a read-only Supabase dashboard with heavy hardcoded data on 4 pages.

**Overall Architecture Score: 2.0 / 10**

---

## 1. Architecture & Code Structure

### 1.1 File Organization ✅ GOOD
```
src/app/
  page.tsx                    → Landing (redirect to /dashboard)
  layout.tsx                  → Root layout (fonts, metadata)
  dashboard/
    layout.tsx                → Dashboard shell (Sidebar + TopBar)
    page.tsx + DashboardClient.tsx
    content/page.tsx + ContentClient.tsx
    distribution/page.tsx + DistributionClient.tsx
    templates/page.tsx + TemplatesClient.tsx
    assets/page.tsx + AssetsClient.tsx
    analytics/page.tsx + AnalyticsClient.tsx
    campaigns/page.tsx + CampaignsClient.tsx
    agents/page.tsx           → 100% client-side
    events/page.tsx           → 100% hardcoded
    journeys/page.tsx         → 100% hardcoded
    repurposing/page.tsx      → 100% hardcoded
src/components/layout/
    Sidebar.tsx, TopBar.tsx
src/lib/supabase/
    server.ts, admin.ts, client.ts
src/lib/utils.ts
```

**Pattern**: Server component fetches data → passes props to Client component. This is correct Next.js 15 App Router pattern. ✅

### 1.2 Critical Architecture Issues

| Issue | Severity | Detail |
|-------|----------|--------|
| **No API routes** | 🔴 CRITICAL | Zero `/api` directory. All data access is direct Supabase from server components. No middleware layer for validation, rate limiting, or business logic. |
| **No middleware.ts** | 🔴 CRITICAL | No route protection, no auth checks, no request interception at the edge. |
| **No error boundaries** | 🔴 CRITICAL | No `error.tsx` or `not-found.tsx` in any route segment. Any unhandled error crashes the entire page with a white screen. |
| **No loading states** | 🟡 HIGH | No `loading.tsx` in any route. Users see blank pages during server-side data fetching. |
| **Duplicate admin client** | 🟡 MEDIUM | Both `server.ts` and `admin.ts` export `createAdminClient()`. One uses dynamic import, the other static. Inconsistent and confusing. |
| **No shared component library** | 🟡 MEDIUM | Status badge logic (`getStatusBadge`) is duplicated in DashboardClient, ContentClient, CampaignsClient, and all 3 hardcoded pages. Should be a shared `<StatusBadge>` component. |
| **No shared types** | 🟡 MEDIUM | TypeScript interfaces are redefined in each file. Should have a `types/` directory with shared interfaces. |
| **Mixed hardcoded/server pages** | 🟡 MEDIUM | 4 pages (agents, events, journeys, repurposing) are 100% hardcoded while 7 pages use Supabase. Inconsistent data strategy. |

### 1.3 Code Duplication

**Status badge logic** is copy-pasted in at least 6 files:
- `DashboardClient.tsx` — getStatusBadge function
- `ContentClient.tsx` — STATUS_OPTIONS constant
- `CampaignsClient.tsx` — getStatusBadge function
- `events/page.tsx` — inline in JSX
- `journeys/page.tsx` — inline in JSX
- `repurposing/page.tsx` — inline in JSX

**Breadcrumb pattern** is copy-pasted in every page:
```tsx
<div className="flex items-center gap-2 text-[11px]...">
  <Link href="/dashboard">Dashboard</Link>
  <span>/</span>
  <span>Page Name</span>
</div>
```

**Card wrapper pattern** is repeated 20+ times:
```tsx
className="card bg-[var(--color-card)] border border-[var(--color-border)]"
```

---

## 2. Security Audit 🔴 CRITICAL

### 2.1 Authentication — NONE

| Aspect | Status | Detail |
|--------|--------|--------|
| User authentication | ❌ MISSING | No auth provider (no NextAuth, no Clerk, no Supabase Auth) |
| Route protection | ❌ MISSING | No middleware.ts to guard `/dashboard/*` routes |
| Session management | ❌ MISSING | No sessions, no cookies, no tokens |
| Role-based access | ❌ MISSING | No concept of user roles |
| API authentication | ❌ MISSING | No API routes exist, but future ones will need auth |

**Impact**: Anyone with the URL can access all data. Since the app uses service_role_key server-side, all Supabase RLS policies are bypassed.

### 2.2 Supabase Security

| Aspect | Status | Detail |
|--------|--------|--------|
| Service Role Key usage | ⚠️ RISKY | Used correctly server-side only, but gives unrestricted DB access |
| Anon Key exposure | ✅ OK | Only exposed client-side (by design), but client.ts is unused |
| RLS policies | ⚠️ IRRELEVANT | All queries use service_role key, bypassing RLS entirely |
| SQL injection | ✅ OK | Using Supabase JS client (parameterized queries), not raw SQL |

### 2.3 Missing Security Headers

`next.config.ts` is **empty** — no security headers configured:

```typescript
const nextConfig: NextConfig = {}  // ← Completely empty!
```

Missing headers:
- `X-Frame-Options` — vulnerable to clickjacking
- `X-Content-Type-Options` — MIME sniffing possible
- `Content-Security-Policy` — no CSP policy
- `Strict-Transport-Security` — HSTS not enforced
- `X-XSS-Protection` — no XSS filter header
- `Referrer-Policy` — no referrer control
- `Permissions-Policy` — no feature policy

### 2.4 Input Validation — NONE

- **No form validation** anywhere in the app
- **No sanitization** of user inputs
- **No CSRF protection** (no forms that submit, but future forms will be vulnerable)
- Search inputs (`ContentClient`, `CampaignsClient`, `TemplatesClient`) use client-side state only — no injection risk currently, but no sanitization either

### 2.5 Environment Variables

| Variable | Exposure | Risk |
|----------|----------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public (by design) | Low — this is the public project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (by design) | Medium — could be used for unauthorized queries if RLS is weak |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only ✅ | Critical if leaked — full DB access |

No `.env.local` or `.env.example` in the repo (good practice), but no documentation of required env vars either.

---

## 3. Performance Audit

### 3.1 Bundle & Loading

| Aspect | Status | Detail |
|--------|--------|--------|
| Code splitting | ✅ AUTO | Next.js App Router auto-splits by route |
| Server Components | ✅ GOOD | 7 pages use server components for data fetching |
| Client bundle size | ⚠️ CONCERN | `agents/page.tsx` is 565 lines of pure client code with no lazy loading |
| Image optimization | ❌ MISSING | No `next/image` usage anywhere. Assets page uses raw `file_url` strings |
| Font optimization | ✅ GOOD | Using `next/font/google` with `display: 'swap'` |
| Preloading | ❌ MISSING | No `<Link prefetch>` hints for navigation |
| `force-dynamic` | ⚠️ OVERUSE | All 7 server pages use `export const dynamic = 'force-dynamic'` — prevents any static caching |

### 3.2 Data Fetching Issues

| Issue | Impact | Detail |
|-------|--------|--------|
| No pagination | HIGH | `build_tracker` fetches up to 200 rows, `assets` fetches ALL rows. Will degrade as data grows. |
| No caching | MEDIUM | `force-dynamic` on every page means every navigation hits Supabase |
| N+1 query pattern | LOW | Distribution page fetches sequences + emails in parallel (good), but other pages could benefit from batched queries |
| No revalidation strategy | MEDIUM | No `revalidate` settings, no ISR, no client-side cache |
| Missing indexes | POTENTIAL | Unknown if Supabase tables have proper indexes for the query patterns used |

### 3.3 Rendering Performance

| Issue | Impact | Detail |
|-------|--------|--------|
| No virtualization | MEDIUM | Content Calendar renders all 291 items in DOM. Assets renders all 132 items. Will lag with more data. |
| No memoization | LOW | Client components don't use `React.memo`, `useMemo` (except 2 instances in CampaignsClient/AnalyticsClient) |
| Animation performance | LOW | CSS animations are GPU-friendly (transform/opacity), but `card:hover { translateY(-4px) }` on every card in a long list could cause jank |
| Agent Bridge interval | LOW | `setInterval` runs every 10s with `Math.random()` — pointless CPU usage for fake data |

---

## 4. Accessibility Audit (a11y) 🔴 CRITICAL

### 4.1 WCAG 2.1 Compliance Score: ~3/10

| Criterion | Status | Detail |
|-----------|--------|--------|
| **Keyboard navigation** | ⚠️ PARTIAL | Basic tab order works, `:focus-visible` outline exists. But sidebar group toggles use `<button>` without `aria-expanded`. |
| **Screen reader support** | ❌ POOR | No `aria-label` on icon-only buttons (search, bell, theme toggle). No `role` attributes. No `aria-live` regions for dynamic content. |
| **Skip navigation** | ❌ MISSING | No "Skip to content" link |
| **Color contrast** | ⚠️ PARTIAL | Fuchsia (#C108AB) on white passes AA for large text but may fail for small text. Muted text (#999999) on white (#FAFAFA) fails AA (contrast ratio ~3.5:1, needs 4.5:1). |
| **Alt text** | ❌ N/A | No images rendered (no `next/image` usage), so no missing alt text — but also no visual content |
| **Form labels** | ❌ MISSING | Search inputs have no `<label>` elements, only `placeholder` text |
| **Heading hierarchy** | ✅ GOOD | Proper h1 → h2/h3 hierarchy on most pages |
| **Reduced motion** | ✅ GOOD | `@media (prefers-reduced-motion: reduce)` properly disables animations |
| **Language** | ✅ GOOD | `<html lang="en">` is set |
| **Focus management** | ❌ POOR | No focus trap in modals (Agent Bridge detail panel, Template preview). Focus not restored on close. |
| **Touch targets** | ✅ GOOD | Buttons have `min-height: 44px` meeting WCAG touch target size |

### 4.2 Critical a11y Bugs

1. **Search input** in TopBar: `<input>` with only `placeholder`, no `<label>` or `aria-label`
2. **Theme toggle**: `<button>` with only an icon, no `aria-label="Toggle dark mode"`
3. **Notification bell**: Same issue — icon-only button without label
4. **Sidebar group toggle**: `<button>` missing `aria-expanded={expanded}`
5. **Agent Bridge detail panel**: Opens as a side panel but has no `role="dialog"` or `aria-modal`, no focus trap, no escape key handler
6. **Template preview modal**: Same issue — no dialog semantics

---

## 5. Responsive Design Audit

### 5.1 Breakpoint Coverage

| Breakpoint | Coverage | Detail |
|------------|----------|--------|
| Desktop (>1024px) | ✅ GOOD | Designed for desktop first |
| Tablet (768-1024px) | ⚠️ PARTIAL | Some grids adapt (`md:grid-cols-2`, `lg:grid-cols-4`) |
| Mobile (<768px) | ❌ BROKEN | **Sidebar is fixed 240px with no collapse/hamburger menu** |

### 5.2 Critical Responsive Issues

| Issue | Severity | Detail |
|-------|----------|--------|
| **Sidebar always visible** | 🔴 CRITICAL | `w-60 fixed` — sidebar takes 240px on mobile. Content area is pushed to `ml-60`. On a 375px iPhone, content area is only ~135px wide. |
| **No mobile navigation** | 🔴 CRITICAL | No hamburger menu, no drawer, no bottom nav. Mobile users cannot navigate. |
| **TopBar overflow** | 🟡 HIGH | Search bar + breadcrumb + theme toggle + bell button will overflow on small screens |
| **Table horizontal scroll** | ⚠️ MEDIUM | Events/Journeys/Repurposing tables have `overflow-x-auto` but no responsive card layouts for mobile |
| **Agent Bridge grid** | ⚠️ MEDIUM | 3-column grid (`lg:grid-cols-3`) doesn't stack well — detail panel + grid layout breaks on tablet |
| **Calendar sidebar** | ⚠️ MEDIUM | Content Calendar has a sidebar filter that may not collapse on mobile |

### 5.3 Dashboard Layout Rigidity

```tsx
// dashboard/layout.tsx
<div className="ml-60 flex-1 flex flex-col">  // ← Hard-coded 240px margin
```

This hard-coded margin means the entire app is broken below ~600px viewport width.

---

## 6. CSS & Design System Audit

### 6.1 Design Tokens ✅ GOOD

The design token system in `globals.css` is well-structured:
- Consistent naming: `--color-primary`, `--color-background`, etc.
- Opacity scale for accent color: `--color-accent-5` through `--color-accent-90`
- Semantic colors: success, warning, error, info
- Shadow scale: sm, md, lg
- Easing functions: out, spring, out-expo

### 6.2 Design System Issues

| Issue | Severity | Detail |
|-------|----------|--------|
| **Zero border-radius everywhere** | 🟡 DESIGN CHOICE | Global `border-radius: 0 !important` with only badge/avatar/chat exceptions. Creates very sharp, austere look. Intentional but may feel harsh. |
| **Dark mode incomplete** | 🟡 HIGH | CSS variables exist, toggle works, but: (1) No initial system preference detection — only checks `localStorage`. (2) `bg-[rgba(255,255,255,0.92)]` in TopBar is hardcoded, not using CSS vars for the alpha version. (3) Card hover shadow is set to `none` in dark mode — cards look flat. |
| **Inconsistent color usage** | 🟡 MEDIUM | Some components use CSS vars (`var(--color-primary)`), others hardcode `#C108AB`. Some use `var(--color-card)`, others hardcode `bg-[var(--color-card)]` vs `bg-white`. |
| **No spacing scale** | 🟡 MEDIUM | Spacing values are arbitrary: `p-4`, `p-5`, `p-6`, `gap-2`, `gap-3`, `gap-4` — no consistent spacing rhythm |
| **No animation library** | 🟢 OK | CSS-only animations (fade-in-up, shimmer, cta-glow). Lightweight but limited. No scroll-triggered animations, no staggered list animations. |
| **Font pairing** | ✅ GOOD | Libre Baskerville (serif) for headings + DM Sans (sans) for body. Professional pairing, properly loaded via `next/font`. |

### 6.3 Missing CSS Features

- No CSS custom properties for spacing/typography scale
- No utility classes for common patterns (`.card-with-header`, `.page-header`, etc.)
- No print stylesheet
- No high-contrast mode support
- No CSS containment (`contain: layout style paint`) for performance

---

## 7. Data Integrity & Error Resilience

### 7.1 Error Handling — CRITICALLY ABSENT

| Layer | Status | Detail |
|-------|--------|--------|
| **Server component errors** | ❌ NO HANDLING | If Supabase query fails, page crashes with unhandled error. No `try/catch`, no fallback UI. |
| **Client component errors** | ❌ NO HANDLING | No `ErrorBoundary` component anywhere. React errors crash the entire app. |
| **Network errors** | ❌ NO HANDLING | No retry logic, no offline detection, no error toast/notification system. |
| **404 handling** | ❌ MISSING | No `not-found.tsx` — hitting an invalid URL shows default Next.js 404 |
| **Loading states** | ❌ MISSING | No `loading.tsx` — users see blank page during server fetch |
| **Empty states** | ⚠️ PARTIAL | Some pages have "No items" messages, others don't |
| **Supabase connection failure** | ⚠️ PARTIAL | `createAdminClient()` returns `null` if env vars missing, and pages check for `if (!supabase)` — but show unstyled `<div>Supabase not configured</div>` |

### 7.2 Data Validation Issues

| Issue | Severity | Detail |
|-------|----------|--------|
| **No TypeScript runtime validation** | 🔴 HIGH | Data from Supabase is cast with `as any` or assumed to match interfaces. Schema changes will cause silent rendering bugs. |
| **Null safety** | 🟡 MEDIUM | Some fields handle null (`asset.assigned_to \|\| 'Unassigned'`), others don't |
| **Date parsing** | 🟡 MEDIUM | `new Date(item.created_at)` — assumes ISO string format. No validation. |
| **Array sorting** | 🟢 LOW | Date sorting is correct but verbose. Could use `localeCompare` for ISO strings. |

---

## 8. SEO & Metadata

| Aspect | Status | Detail |
|--------|--------|--------|
| **Root metadata** | ⚠️ MINIMAL | Only `title` and `description` set in root layout. No Open Graph, no Twitter cards, no favicon config. |
| **Per-page metadata** | ❌ MISSING | No `generateMetadata()` in any page. All pages have default title. |
| **Sitemap** | ❌ MISSING | No `sitemap.ts` |
| **Robots.txt** | ❌ MISSING | No `robots.ts` |
| **Canonical URLs** | ❌ MISSING | No canonical URL configuration |
| **Structured data** | ❌ MISSING | No JSON-LD or schema.org markup |

Note: Since WAVE is an internal tool, SEO is low priority. But if it ever becomes client-facing, this needs work.

---

## 9. Dark Mode Deep Dive

### 9.1 Implementation

```javascript
// TopBar.tsx
const saved = localStorage.getItem('lyc-theme')
if (saved === 'dark') {
  setDark(true)
  document.documentElement.dataset.theme = 'dark'
}
```

### 9.2 Issues

| Issue | Detail |
|-------|--------|
| **No system preference detection** | Doesn't check `prefers-color-scheme` on first load. Users who prefer dark mode at OS level still see light mode on first visit. |
| **FOUC (Flash of Unstyled Content)** | Theme is applied in `useEffect` (client-side), so there's a brief flash of light mode before dark mode kicks in. |
| **Incomplete dark overrides** | Only background, foreground, card, and border colors are overridden. The TopBar has a dark override but other hardcoded colors don't. |
| **Sidebar doesn't change** | Sidebar is always dark (`bg-[#0F1115]`) — which is fine, it's intentional. |
| **Charts in Analytics** | The custom DistributionBar component uses hardcoded colors that may not have enough contrast in dark mode. |
| **No transition on theme switch** | Theme changes are instant — no smooth crossfade. Can feel jarring. |

---

## 10. Dependency Analysis

### 10.1 Current Dependencies (7 total)

| Package | Version | Purpose | Assessment |
|---------|---------|---------|------------|
| `next` | ^15.1.0 | Framework | ✅ Latest stable |
| `react` | ^19.0.0 | UI library | ✅ Latest |
| `react-dom` | ^19.0.0 | DOM renderer | ✅ Latest |
| `@supabase/supabase-js` | ^2.49.1 | DB client | ✅ Current |
| `@supabase/ssr` | ^0.5.2 | SSR helpers | ✅ Current |
| `lucide-react` | ^0.468.0 | Icons | ✅ Good choice, tree-shakeable |
| `clsx` | ^2.1.1 | Class utility | ✅ Lightweight |

### 10.2 Missing Dependencies (Needed for Go-Live)

| Package | Purpose | Priority |
|---------|---------|----------|
| `next-auth` or `@clerk/nextjs` | Authentication | 🔴 P0 |
| `zod` | Schema validation | 🔴 P0 |
| `react-hook-form` + `@hookform/resolvers` | Form handling | 🟡 P1 |
| `@headlessui/react` or `@radix-ui/react-*` | Accessible modals/dialogs/dropdowns | 🟡 P1 |
| `recharts` or `@nivo/core` | Real charts for Analytics | 🟡 P1 |
| `date-fns` or `dayjs` | Date formatting/manipulation | 🟡 P1 |
| `framer-motion` | Advanced animations (optional) | 🟢 P2 |
| `sonner` or `react-hot-toast` | Toast notifications | 🟡 P1 |
| `@tanstack/react-query` | Client-side data fetching + caching | 🟡 P1 |

### 10.3 Dependency Risks

- **No lockfile visible in repo** — builds may be non-reproducible
- **No `npm audit` in CI** — no automated vulnerability scanning
- **Wide version ranges** (`^15.1.0`) — could pull breaking minor updates

---

## 11. Deployment & DevOps

### 11.1 Current Setup

| Aspect | Status |
|--------|--------|
| Hosting | Vercel (automatic deploys from `master`) |
| Build command | `npm run build` (via vercel.json) |
| Environment variables | 3 vars configured in Vercel |
| Preview deployments | ✅ Automatic per-commit |
| Custom domain | ❌ Not configured |

### 11.2 Missing DevOps

| Aspect | Status | Detail |
|--------|--------|--------|
| **CI/CD pipeline** | ❌ NONE | No GitHub Actions. No lint/test on PR. |
| **Testing** | ❌ NONE | No test files, no test framework, no test scripts |
| **Linting in CI** | ❌ NONE | ESLint config exists but not enforced |
| **Type checking** | ❌ NONE | TypeScript config exists but `tsc --noEmit` not in CI |
| **Monitoring** | ❌ NONE | No error tracking (Sentry), no analytics, no uptime monitoring |
| **Logging** | ❌ NONE | No structured logging. `console.log` only. |
| **Backup strategy** | ❌ NONE | No Supabase backup configuration visible |
| **Staging environment** | ❌ NONE | Only production exists |

---

## 12. Cross-Cutting Bug Summary (New from V4)

| # | Severity | Component | Bug |
|---|----------|-----------|-----|
| 12 | 🔴 CRITICAL | All pages | No error boundaries — any unhandled error crashes the app |
| 13 | 🔴 CRITICAL | All pages | No authentication — completely open access |
| 14 | 🔴 CRITICAL | Mobile | Sidebar never collapses — app is unusable below ~600px |
| 15 | 🔴 HIGH | next.config.ts | Empty config — zero security headers |
| 16 | 🟡 MEDIUM | Dark mode | No system preference detection, FOUC on load |
| 17 | 🟡 MEDIUM | All server pages | `force-dynamic` on every page prevents any caching/ISR |
| 18 | 🟡 MEDIUM | Assets/Content | No pagination — fetches all rows, will degrade with scale |
| 19 | 🟡 MEDIUM | TopBar | Search input has no `<label>` or `aria-label` (a11y) |
| 20 | 🟡 MEDIUM | TopBar | Theme toggle + bell have no `aria-label` (a11y) |
| 21 | 🟡 MEDIUM | Agent Bridge | Detail panel has no dialog semantics, no focus trap, no Escape key |
| 22 | 🟡 MEDIUM | Agent Bridge | `setInterval` with `Math.random()` wastes CPU for fake status changes |
| 23 | 🟡 MEDIUM | Sidebar | Group toggle buttons missing `aria-expanded` attribute |
| 24 | 🟢 LOW | Templates | AI generator "Generate" button is a no-op (no API to call) |
| 25 | 🟢 LOW | Analytics | Custom bar charts use hardcoded colors that may fail dark mode contrast |
| 26 | 🟢 LOW | All pages | Breadcrumb is duplicated in every page — should be a shared component |
| 27 | 🟢 LOW | Duplicate admin client | `server.ts` and `admin.ts` both export `createAdminClient` differently |
| 28 | 🟢 LOW | Dashboard | "Live from Supabase" label is misleading — data is static per-request, not real-time |
| 29 | 🟢 LOW | CSS | `border-radius: 0 !important` global override is heavy-handed |

**Combined with V1 (11 bugs): Total 29 known issues.**

---

## 13. Prioritized Fix Roadmap

### Phase 0 — Critical Fixes (8-12h) ← DO THIS FIRST
| Task | Effort | Impact |
|------|--------|--------|
| Add `error.tsx` to root + dashboard layout | 2h | Prevents white-screen crashes |
| Add `loading.tsx` to all routes | 2h | Eliminates blank page flashes |
| Fix Distribution `preview_text` query bug | 0.5h | Fixes broken page |
| Fix Dashboard Quick Action links | 0.5h | Fixes wrong navigation |
| Add responsive sidebar (hamburger menu) | 4h | Makes app usable on mobile |
| Add `aria-label` to all icon-only buttons | 1h | Basic a11y compliance |

### Phase 1 — Security Foundation (12-16h)
| Task | Effort | Impact |
|------|--------|--------|
| Add authentication (NextAuth or Clerk) | 8h | Protects the app |
| Add middleware.ts for route protection | 2h | Guards dashboard routes |
| Configure security headers in next.config.ts | 1h | Prevents clickjacking, XSS |
| Add Zod schemas for Supabase data validation | 3h | Runtime type safety |

### Phase 2 — Data & Functionality (20-28h)
| Task | Effort | Impact |
|------|--------|--------|
| Build API route layer (CRUD for campaigns) | 8h | Enables write operations |
| Create real campaigns table + migration | 4h | Real campaign management |
| Add pagination to Content/Assets | 3h | Performance at scale |
| Add toast notification system | 2h | User feedback on actions |
| Fix status badge duplication → shared component | 2h | Code maintainability |

### Phase 3 — Polish & UX (16-20h)
| Task | Effort | Impact |
|------|--------|--------|
| Dark mode: system preference + smooth transition | 3h | Better first impression |
| Add real charts to Analytics (recharts) | 4h | Meaningful data visualization |
| Agent Bridge: connect to real agent status API | 6h | Actually useful page |
| Events/Journeys/Repurposing: wire to Supabase | 6h | No longer hardcoded |
| Add not-found.tsx + empty states | 2h | Better error UX |

### Phase 4 — Production Readiness (8-12h)
| Task | Effort | Impact |
|------|--------|--------|
| Add CI/CD pipeline (GitHub Actions) | 3h | Automated testing + lint |
| Add error monitoring (Sentry) | 2h | Production error tracking |
| Add E2E tests (Playwright) for critical paths | 4h | Prevents regressions |
| Add per-page metadata + OG tags | 2h | Proper page titles |
| Performance audit + Core Web Vitals optimization | 2h | Faster load times |

---

## 14. Go-Live Readiness — Revised Score

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Visual Design | 7/10 | 15% | 1.05 |
| Data Wiring | 3/10 | 15% | 0.45 |
| Functionality | 2/10 | 15% | 0.30 |
| Security | 0.5/10 | 15% | 0.075 |
| Accessibility | 3/10 | 10% | 0.30 |
| Performance | 4/10 | 10% | 0.40 |
| Error Resilience | 1/10 | 10% | 0.10 |
| Mobile/Responsive | 2/10 | 5% | 0.10 |
| Code Quality | 4/10 | 5% | 0.20 |

### **Revised Overall Score: 3.0 / 10**

V3 estimate was 2.8/10 — consistent. The design carries the score; everything else is below 4/10.

---

## 15. What's Actually Working Well

To be fair, several things are genuinely good:

1. ✅ **Design token system** — professional, consistent, well-organized
2. ✅ **Server/Client component split** — correct Next.js 15 architecture
3. ✅ **Font pairing** — Libre Baskerville + DM Sans is elegant
4. ✅ **Sidebar navigation** — well-organized with grouped sections
5. ✅ **Assets page** — genuinely functional with real data, filters, and Notion links
6. ✅ **Analytics page** — real aggregations, working CSV export, custom bar charts
7. ✅ **Dashboard KPIs** — live Supabase counts, correctly displayed
8. ✅ **Reduced motion support** — respects user preferences
9. ✅ **Touch targets** — 44px minimum, meets WCAG
10. ✅ **Zero border-radius design** — bold, distinctive visual identity

---

*End of Deep Audit V4. Total issues identified: 29 (across V1-V4). Total estimated effort to go-live: ~80-90h for core functionality, ~120-150h for production readiness.*
