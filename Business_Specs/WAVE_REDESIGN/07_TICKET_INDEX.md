# WAVE — Master Ticket Index

**Version**: 2.0
**Date**: 2026-07-20
**Total Tickets**: 48
**Total Estimated Hours**: 80h
**Author**: NEXUS Agent

---

## Summary

| Phase | Name | Batches | Tickets | Hours |
|-------|------|---------|---------|-------|
| 1 | Foundation | 3 | 12 | 20h |
| 2 | Repurposing Engine | 3 | 14 | 25h |
| 3 | Distribution + Inbound | 3 | 12 | 20h |
| 4 | Polish & Intelligence | 2 | 10 | 15h |
| **Total** | | **11** | **48** | **80h** |

---

## Phase 1: Foundation (20h)

### Batch 1.1 — Database Schema + Bug Fixes (8h)

| Ticket | Title | Priority | Hours | Status |
|--------|-------|----------|-------|--------|
| T-1.1.1 | Create `content_pieces` table | 🔴 CRITICAL | 2h | TODO |
| T-1.1.2 | Create `campaigns` table (new) | 🔴 CRITICAL | 1.5h | TODO |
| T-1.1.3 | Create junction tables (`campaign_content`, `campaign_mailing`) | 🔴 CRITICAL | 1.5h | TODO |
| T-1.1.4 | Fix Distribution `preview_text` bug | 🔴 CRITICAL | 1h | TODO |
| T-1.1.5 | Fix Dashboard Quick Action links | 🟡 HIGH | 1h | TODO |
| T-1.1.6 | Create database views | 🟡 MEDIUM | 1h | TODO |

### Batch 1.2 — Campaign CRUD + UI (7h)

| Ticket | Title | Priority | Hours | Status |
|--------|-------|----------|-------|--------|
| T-1.2.1 | Campaigns API routes | 🔴 CRITICAL | 2h | TODO |
| T-1.2.2 | Campaigns page — server component | 🟡 HIGH | 1.5h | TODO |
| T-1.2.3 | Campaigns page — client component | 🟡 HIGH | 2.5h | TODO |
| T-1.2.4 | Campaign-content linking | 🟡 MEDIUM | 1h | TODO |

### Batch 1.3 — Content Hub + Data Migration (5h)

| Ticket | Title | Priority | Hours | Status |
|--------|-------|----------|-------|--------|
| T-1.3.1 | Content API routes | 🔴 CRITICAL | 1.5h | TODO |
| T-1.3.2 | Content Hub page — rewrite | 🟡 HIGH | 2h | TODO |
| T-1.3.3 | Data migration — assets → content_pieces | 🟡 MEDIUM | 1h | TODO |
| T-1.3.4 | Data migration — campaign_contacts → mailing_list | 🟡 MEDIUM | 0.5h | TODO |

---

## Phase 2: Repurposing Engine (25h)

### Batch 2.1 — Repurposing Infrastructure (8h)

| Ticket | Title | Priority | Hours | Status |
|--------|-------|----------|-------|--------|
| T-2.1.1 | Create `repurposing_jobs` + `ai_jobs` tables | 🔴 CRITICAL | 1.5h | TODO |
| T-2.1.2 | Repurposing API routes (5 endpoints) | 🔴 CRITICAL | 2.5h | TODO |
| T-2.1.3 | DeepSeek integration utility | 🔴 CRITICAL | 2h | TODO |
| T-2.1.4 | Repurposing prompt templates (14 formats) | 🟡 HIGH | 2h | TODO |

### Batch 2.2 — Repurposing UI (10h)

| Ticket | Title | Priority | Hours | Status |
|--------|-------|----------|-------|--------|
| T-2.2.1 | Repurposing page — server component | 🟡 HIGH | 1.5h | TODO |
| T-2.2.2 | Repurposing page — client component | 🟡 HIGH | 4h | TODO |
| T-2.2.3 | AI execution endpoint | 🔴 CRITICAL | 2.5h | TODO |
| T-2.2.4 | Publish endpoint | 🟡 HIGH | 2h | TODO |

### Batch 2.3 — Chain Visualization + Polish (7h)

| Ticket | Title | Priority | Hours | Status |
|--------|-------|----------|-------|--------|
| T-2.3.1 | Repurposing chain view | 🟡 HIGH | 3h | TODO |
| T-2.3.2 | Content Hub — add repurposing actions | 🟡 MEDIUM | 1.5h | TODO |
| T-2.3.3 | Agent Bridge — AI jobs view | 🟡 MEDIUM | 2.5h | TODO |

---

## Phase 3: Distribution + Inbound + Mailing List (20h)

### Batch 3.1 — Distribution Rewrite (7h)

| Ticket | Title | Priority | Hours | Status |
|--------|-------|----------|-------|--------|
| T-3.1.1 | Create `distribution_log` table | 🔴 CRITICAL | 1h | TODO |
| T-3.1.2 | Distribution API routes (3 endpoints) | 🔴 CRITICAL | 2h | TODO |
| T-3.1.3 | Distribution page — server component | 🟡 HIGH | 1h | TODO |
| T-3.1.4 | Distribution page — client component rewrite | 🟡 HIGH | 3h | TODO |

### Batch 3.2 — Mailing List + Inbound (8h)

| Ticket | Title | Priority | Hours | Status |
|--------|-------|----------|-------|--------|
| T-3.2.1 | Create `inbound` table | 🔴 CRITICAL | 0.5h | TODO |
| T-3.2.2 | Mailing List API routes (5 endpoints) | 🟡 HIGH | 1.5h | TODO |
| T-3.2.3 | Mailing List page (new) | 🟡 HIGH | 2.5h | TODO |
| T-3.2.4 | Inbound API routes (3 endpoints) | 🟡 HIGH | 1.5h | TODO |
| T-3.2.5 | Inbound page — Kanban pipeline (new) | 🟡 HIGH | 2.5h | TODO |

### Batch 3.3 — Templates + Cross-Module Linking (5h)

| Ticket | Title | Priority | Hours | Status |
|--------|-------|----------|-------|--------|
| T-3.3.1 | Create `templates` table | 🟡 MEDIUM | 0.5h | TODO |
| T-3.3.2 | Templates API + AI generation | 🟡 MEDIUM | 1.5h | TODO |
| T-3.3.3 | Templates page rewrite | 🟡 MEDIUM | 2h | TODO |
| T-3.3.4 | Campaign-contact linking UI | 🟡 MEDIUM | 1h | TODO |

---

## Phase 4: Polish & Intelligence (15h)

### Batch 4.1 — Analytics + Error Handling (9h)

| Ticket | Title | Priority | Hours | Status |
|--------|-------|----------|-------|--------|
| T-4.1.1 | Dashboard stats API | 🟡 HIGH | 1.5h | TODO |
| T-4.1.2 | Dashboard rewrite — real KPIs | 🟡 HIGH | 2.5h | TODO |
| T-4.1.3 | Analytics page enhancement (charts) | 🟡 HIGH | 2.5h | TODO |
| T-4.1.4 | Error boundaries + loading states | 🟡 HIGH | 2.5h | TODO |

### Batch 4.2 — Responsive + Final Polish (6h)

| Ticket | Title | Priority | Hours | Status |
|--------|-------|----------|-------|--------|
| T-4.2.1 | Responsive sidebar | 🟡 HIGH | 2h | TODO |
| T-4.2.2 | TopBar fixes + a11y | 🟡 MEDIUM | 1.5h | TODO |
| T-4.2.3 | Toast notifications (sonner) | 🟡 MEDIUM | 1h | TODO |
| T-4.2.4 | Sidebar navigation update | 🟡 MEDIUM | 0.5h | TODO |
| T-4.2.5 | Final QA + edge cases | 🟡 MEDIUM | 1h | TODO |

---

## Priority Distribution

| Priority | Count | Hours |
|----------|-------|-------|
| 🔴 CRITICAL | 10 | 18.5h |
| 🟡 HIGH | 21 | 39h |
| 🟡 MEDIUM | 17 | 22.5h |
| **Total** | **48** | **80h** |

---

## Ticket Type Distribution

| Type | Count | Hours |
|------|-------|-------|
| Database (migrations) | 7 | 7.5h |
| API Routes | 17 | 21h |
| UI — Server Components | 5 | 7h |
| UI — Client Components | 10 | 25h |
| Integration (DeepSeek) | 3 | 6h |
| Bug Fixes | 2 | 2h |
| Data Migration | 2 | 1.5h |
| Polish/UX | 2 | 10h |
| **Total** | **48** | **80h** |

---

## New Dependencies to Install

```json
{
  "recharts": "^2.12.0",
  "react-hook-form": "^7.51.0",
  "zod": "^3.22.0",
  "@hookform/resolvers": "^3.3.0",
  "date-fns": "^3.6.0",
  "sonner": "^1.4.0",
  "framer-motion": "^11.0.0"
}
```

---

## File Structure (New Files)

```
src/
├── app/
│   ├── api/
│   │   ├── content/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── campaigns/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       ├── content/route.ts
│   │   │       └── contacts/route.ts
│   │   ├── repurposing/
│   │   │   ├── route.ts
│   │   │   ├── batch/route.ts
│   │   │   ├── chains/[source_id]/route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       ├── execute/route.ts
│   │   │       └── publish/route.ts
│   │   ├── distribution/
│   │   │   ├── route.ts
│   │   │   ├── calendar/route.ts
│   │   │   └── [id]/route.ts
│   │   ├── mailing-list/
│   │   │   ├── route.ts
│   │   │   ├── import/route.ts
│   │   │   ├── segments/route.ts
│   │   │   ├── stats/route.ts
│   │   │   └── [id]/route.ts
│   │   ├── inbound/
│   │   │   ├── route.ts
│   │   │   ├── pipeline/route.ts
│   │   │   └── [id]/route.ts
│   │   ├── templates/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── generate/route.ts
│   │   ├── dashboard/
│   │   │   └── stats/route.ts
│   │   └── agents/
│   │       ├── jobs/route.ts
│   │       ├── stats/route.ts
│   │       └── repurpose/route.ts
│   └── dashboard/
│       ├── error.tsx
│       ├── loading.tsx
│       ├── mailing-list/
│       │   ├── page.tsx
│       │   └── MailingListClient.tsx
│       └── inbound/
│           ├── page.tsx
│           └── InboundClient.tsx
├── components/
│   ├── ErrorBoundary.tsx
│   ├── Toast.tsx
│   └── layout/
│       └── MobileNav.tsx
└── lib/
    └── deepseek/
        ├── client.ts
        └── prompts.ts
```

**Total new files: ~50**

---

## Migration Files

```
supabase/migrations/
├── 001_create_content_pieces.sql
├── 002_create_campaigns.sql
├── 003_create_junction_tables.sql
├── 004_create_views.sql
├── 005_migrate_assets.sql
├── 006_migrate_contacts.sql
├── 007_create_repurposing_tables.sql
├── 008_create_distribution_log.sql
├── 009_create_inbound.sql
└── 010_create_templates.sql
```

---

*Document generated: 2026-07-20 | Author: NEXUS Agent | Version 2.0*
