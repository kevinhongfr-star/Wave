# 14B — UI/UX Technical Infrastructure Audit

**Version**: 1.0
**Date**: 2026-07-17
**Scope**: CSS, dependencies, architecture, configuration, file structure

---

## Executive Summary

The technical foundation is **better than the pages** — the design system is well-structured, tokens are properly defined, and the stack is modern (Next.js 15, React 19, Tailwind v4). But critical dependencies are missing (no chart library, no form library, no date picker, no drag-and-drop), Supabase is installed but never used, and there's no .env file.

---

## 1. CSS & Design System Audit

### What's Working ✅

**Design Tokens (globals.css)**
- Well-organized CSS custom properties
- Complete color palette (primary, semantic, neutral)
- Proper light/dark theme support
- Typography scale defined (Libre Baskerville + DM Sans)
- Zero border radius enforced (intentional design choice)
- Shadows, easing functions, spacing defined
- Accessibility: `:focus-visible`, `prefers-reduced-motion` support
- Skeleton loading animation defined
- Button variants (primary, secondary, ghost, danger)
- Card hover effects (translateY + shadow)
- Badge variants (success, warning, error, info, accent)
- CTA glow animation (subtle but effective)

**Design System Documentation (DESIGN_SYSTEM.md)**
- Clear version tracking (v2.0)
- Hard rules documented (zero radius, fuchsia accent, 44px touch targets)
- Color reference table
- Typography scale table
- Brand voice guidelines

**HTML Prototype (WAVE_Full_Prototype.html)**
- 1,108 lines of working HTML/CSS
- Demonstrates the design system can be implemented
- Shows what the final product should look like
- Design tokens match globals.css

### Critical Gaps ❌

**1. Dark Mode Incomplete**
- `globals.css` defines dark theme variables
- But Sidebar uses hardcoded colors: `bg-[#0F1115] text-white`
- TopBar uses: `bg-[rgba(13,10,20,0.92)]` (dark-specific)
- These don't respond to `[data-theme="dark"]`
- **Impact**: Sidebar and TopBar look wrong in light mode (always dark)

**Fix Required:**
```css
/* Sidebar should use CSS variables */
.sidebar {
  background: var(--color-sidebar-bg);
  color: var(--color-sidebar-text);
}
```

**2. Responsive Design Minimal**
- Only media query: `@media (max-width: 768px)` — disables card hover, adjusts font size
- No mobile layout for sidebar (hidden on mobile, no hamburger menu)
- No responsive table layouts (tables will overflow on mobile)
- No mobile navigation
- **Impact**: App is unusable on mobile/tablet

**3. No Component Library**
- CSS defines `.btn`, `.card`, `.badge`, `.input` styles
- But no React components wrap these
- Every page writes its own `<button className="btn btn-primary">`
- Inconsistent implementation
- No shared Modal, Form, Table, Dropdown components

**4. No Utility Classes for Common Patterns**
- No `.flex-center`, `.space-y-4`, `.grid-2`, `.grid-3`
- Every page reinvents layout
- Inconsistent spacing and alignment

**5. Skeleton Loading Defined But Not Used**
- `.skeleton` class exists with shimmer animation
- But no page uses it
- No loading states anywhere

---

## 2. Dependencies Audit

### Installed ✅

```json
{
  "next": "^15.1.0",              // ✅ Latest, App Router
  "react": "^19.0.0",             // ✅ Latest
  "@supabase/supabase-js": "^2.49.1",  // ✅ Installed but never imported
  "@supabase/ssr": "^0.5.2",      // ✅ SSR helpers
  "lucide-react": "^0.468.0",     // ✅ Icon library
  "clsx": "^2.1.1",               // ✅ className utility
  "tailwindcss": "^4.0.0"         // ✅ Latest
}
```

### Missing ❌

**Critical for MVP:**

| Dependency | Purpose | Effort to Add |
|------------|---------|---------------|
| `react-hook-form` | Form handling, validation | 2h |
| `@hookform/resolvers` | Schema validation (Zod) | 1h |
| `zod` | Schema validation | 1h |
| `date-fns` | Date formatting, manipulation | 1h |
| `react-day-picker` | Date picker component | 2h |
| `recharts` | Charts for Analytics page | 4h |
| `@dnd-kit/core` | Drag-and-drop (calendar, journeys) | 6h |
| `@dnd-kit/sortable` | Sortable lists | 2h |
| `react-quill` or `tiptap` | Rich text editor (templates, content) | 4h |
| `@tanstack/react-table` | Advanced tables (sorting, filtering, pagination) | 4h |

**Nice to Have:**

| Dependency | Purpose | Effort to Add |
|------------|---------|---------------|
| `sonner` or `react-hot-toast` | Toast notifications | 2h |
| `@radix-ui/react-dialog` | Modal component | 3h |
| `@radix-ui/react-dropdown-menu` | Dropdown menus | 2h |
| `@radix-ui/react-select` | Select component | 2h |
| `@radix-ui/react-tabs` | Tabs component | 2h |
| `framer-motion` | Advanced animations | 4h |
| `cmdk` | Command palette (Cmd+K search) | 3h |

**Total to Add Critical Dependencies: ~27h**

---

## 3. Supabase Integration Audit

### What Exists ✅

**Client Files (3 files, ~60 lines total)**
- `src/lib/supabase/client.ts` — Browser client
- `src/lib/supabase/server.ts` — Server client
- `src/lib/supabase/admin.ts` — Admin client (bypasses RLS)

**Properly Configured:**
- Checks for environment variables
- Returns `null` if missing (graceful degradation)
- Uses `@supabase/ssr` for Next.js App Router
- Admin client uses service role key

### Critical Gaps ❌

**1. Never Imported**
- Zero pages import Supabase clients
- Zero database queries anywhere
- All data hardcoded

**2. No .env File**
- No `.env.local` or `.env.example`
- No `NEXT_PUBLIC_SUPABASE_URL`
- No `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- No `SUPABASE_SERVICE_ROLE_KEY`
- **Impact**: App can't connect to database even if code existed

**3. No Data Models**
- No TypeScript types for database tables
- No generated types from Supabase schema
- No API routes to fetch data

**4. No Authentication**
- No login page
- No auth middleware
- No protected routes
- No user session management

**5. No Realtime Subscriptions**
- Supabase Realtime not used
- No live updates when data changes

### What's Needed

**Minimum to Wire Supabase (P0):**

1. Create `.env.local` with Supabase credentials (1h)
2. Generate TypeScript types from Supabase schema (1h)
3. Create API routes for each page (10 routes × 2h = 20h)
4. Update each page to fetch data (10 pages × 3h = 30h)
5. Add loading states (10 pages × 1h = 10h)
6. Add error handling (10 pages × 1h = 10h)

**Total P0 Supabase Wiring: ~72h**

---

## 4. File Structure Audit

### Current Structure

```
wave-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx              // Root layout (fonts, metadata)
│   │   ├── page.tsx                // Redirects to /dashboard
│   │   ├── globals.css             // Design tokens + styles
│   │   └── dashboard/
│   │       ├── layout.tsx          // Dashboard layout (Sidebar + TopBar)
│   │       ├── page.tsx            // Dashboard page (155 lines)
│   │       ├── content/page.tsx    // Content Calendar (67 lines)
│   │       ├── templates/page.tsx  // Templates (67 lines)
│   │       ├── distribution/page.tsx
│   │       ├── journeys/page.tsx
│   │       ├── repurposing/page.tsx
│   │       ├── events/page.tsx
│   │       ├── analytics/page.tsx
│   │       └── agents/page.tsx
│   ├── components/
│   │   └── layout/
│   │       ├── Sidebar.tsx         // Navigation (103 lines)
│   │       └── TopBar.tsx          // Top bar (66 lines)
│   └── lib/
│       ├── supabase/
│       │   ├── client.ts           // Browser client
│       │   ├── server.ts           // Server client
│       │   └── admin.ts            // Admin client
│       └── utils.ts                // cn() utility
└── package.json
```

**Total: 18 source files**

### Critical Gaps ❌

**1. No Shared UI Components**
- No `components/ui/` directory
- No Button, Card, Modal, Form, Table components
- Every page writes its own markup
- Inconsistent implementation

**2. No API Routes**
- No `app/api/` directory
- No server actions
- No data fetching layer

**3. No Auth**
- No `app/login/` or `app/auth/`
- No middleware.ts
- No protected routes

**4. No Types**
- No `types/` directory
- No shared TypeScript interfaces
- No generated Supabase types

**5. No Tests**
- No `__tests__/` or `*.test.tsx` files
- No test configuration

**6. No Documentation**
- No README in `wave-app/`
- No component documentation
- No API documentation

### Recommended Structure

```
wave-app/
├── src/
│   ├── app/
│   │   ├── (auth)/              // Auth routes
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── api/                 // API routes
│   │   │   ├── content/
│   │   │   ├── templates/
│   │   │   └── ...
│   │   └── dashboard/
│   │       └── ...              // Existing pages
│   ├── components/
│   │   ├── ui/                  // Shared UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Form.tsx
│   │   │   └── ...
│   │   └── layout/
│   │       ├── Sidebar.tsx
│   │       └── TopBar.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   ├── api/                 // API client functions
│   │   └── utils.ts
│   ├── types/                   // TypeScript types
│   │   ├── database.ts          // Generated from Supabase
│   │   └── api.ts
│   └── hooks/                   // Custom React hooks
│       ├── useSupabase.ts
│       └── useAuth.ts
├── .env.local                   // Environment variables
├── .env.example                 // Template for .env
├── middleware.ts                // Auth middleware
└── README.md
```

---

## 5. HTML Prototype vs React App

### HTML Prototype (WAVE_Full_Prototype.html)

**What It Is:**
- 1,108 lines of working HTML/CSS/JS
- Single-file prototype
- Demonstrates the design system
- Shows what the final product should look like

**What It Has That React App Doesn't:**
- More complete page layouts
- Better visual hierarchy
- More interactive elements (even if just CSS)
- Demonstrates responsive behavior

**What React App Has That HTML Doesn't:**
- React components (but minimal)
- Supabase integration (but unused)
- TypeScript (but no types)
- Next.js App Router

**Insight:**
The HTML prototype is **more complete** than the React app in terms of UI. The React app is a step backward in terms of visual completeness.

**Recommendation:**
Use the HTML prototype as the visual reference. Rebuild each page in React to match the prototype's quality, then add functionality.

---

## 6. Configuration Audit

### Missing Configuration ❌

**1. No .env File**
- No environment variables defined
- No Supabase credentials
- No API keys (DeepSeek, etc.)

**2. No tsconfig.json Customization**
- Using Next.js defaults
- No path aliases (e.g., `@/components`)
- No strict mode enabled

**3. No ESLint Customization**
- Using Next.js defaults
- No custom rules for the project

**4. No Prettier Configuration**
- No `.prettierrc`
- Inconsistent formatting

**5. No Vercel Configuration**
- No `vercel.json`
- No custom build settings
- No environment variables in Vercel dashboard

---

## 7. Development Workflow Audit

### What's Missing ❌

**1. No README**
- No setup instructions
- No development guide
- No deployment guide

**2. No Contribution Guidelines**
- No coding standards
- No PR template
- No code review process

**3. No CI/CD**
- No GitHub Actions
- No automated testing
- No automated deployment

**4. No Linting/Formatting**
- No pre-commit hooks
- No automated code quality checks

---

## Priority Matrix

### P0 — Must Fix Before Any Development (27h)

| Issue | Effort | Impact |
|-------|--------|--------|
| Create .env.local with Supabase credentials | 1h | Blocks all DB work |
| Generate TypeScript types from Supabase | 1h | Type safety |
| Add critical dependencies (react-hook-form, zod, date-fns, recharts, react-day-picker, @dnd-kit, react-quill, @tanstack/react-table) | 8h | Missing functionality |
| Fix dark mode (Sidebar, TopBar hardcoded colors) | 4h | Visual consistency |
| Add .env.example template | 1h | Onboarding |
| Add README with setup instructions | 2h | Onboarding |
| Add path aliases (tsconfig.json) | 1h | Developer experience |
| Add Prettier + ESLint config | 2h | Code quality |
| Create shared UI components (Button, Card, Modal, Form, Table) | 7h | Consistency |

**Total P0: 27h**

### P1 — Must Fix Before Go-Live (72h)

| Issue | Effort | Impact |
|-------|--------|--------|
| Wire Supabase to all pages (API routes + data fetching) | 50h | Functionality |
| Add authentication (login, middleware, protected routes) | 12h | Security |
| Add loading states (skeleton screens) | 5h | UX |
| Add error handling (error boundaries, toast notifications) | 5h | UX |

**Total P1: 72h**

### P2 — Should Fix Within 3 Months (40h)

| Issue | Effort | Impact |
|-------|--------|--------|
| Mobile responsive design (sidebar, tables, forms) | 15h | Mobile usage |
| Add tests (unit + integration) | 15h | Quality |
| Add CI/CD (GitHub Actions) | 5h | Automation |
| Add documentation (components, API) | 5h | Maintainability |

**Total P2: 40h**

---

## Updated Total Estimate

| Priority | Effort | Timeline |
|----------|--------|----------|
| P0 (Before development) | 27h | Week 1 |
| P1 (Before go-live) | 72h | Weeks 2-4 |
| P2 (Within 3 months) | 40h | Months 2-3 |
| **TOTAL** | **139h** | **3 months** |

---

## Combined Audit Summary

### Page-by-Page (14A): 671h
### Technical Infrastructure (14B): 139h
### **Total UI/UX Work: 810h**

### Comparison
- Previous UX estimate (UX-001 to UX-018): 60h
- **Actual work needed: 810h**
- **13.5x underestimation**

### To Go Live
- Phase 0 (Supabase wiring): 25h
- P0 pages + infrastructure: 19h + 27h = 46h
- P1 pages + infrastructure: 307h + 72h = 379h
- **Total to go-live: ~450h**

### Bottom Line
The technical foundation is solid (modern stack, good design tokens). But the app is missing critical dependencies, has no shared components, no Supabase integration, no authentication, and no configuration. The HTML prototype is more complete than the React app.

**This is not a polish job. This is building the product from the foundation up.**
