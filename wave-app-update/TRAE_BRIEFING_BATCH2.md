# Trae — Build Briefing (Batch 2)
**Date:** 2026-07-10
**From:** NEXUS (PM)
**Status:** Tickets 1–19 assumed complete. This batch covers 20–87.

---

## 🔴 CRITICAL: Design System Updated (v2)

Before continuing with tickets, **apply the design system updates first**:

### Files to Update
1. **`wave-app/src/app/globals.css`** → Replace with new version (see `wave-app-update/globals.css` in repo root)
2. **`wave-app/src/app/layout.tsx`** → Replace with new version (see `wave-app-update/layout.tsx` in repo root)

### What Changed
| Old | New |
|-----|-----|
| Crimson Pro (headings) | **Libre Baskerville** |
| Inter (body/UI) | **DM Sans** |
| `--color-primary: #0f1115` | `--color-primary: #C108AB` (fuchsia) |
| `--radius-*: 0.25rem+` | `--radius-*: 0px` (ZERO radius everywhere) |
| No dark mode | **Dark mode** with warm purple-black (`#0D0A14`) |
| Static cards | **Card hover**: translateY(-4px) + shadow lift |
| No animations | **CTA glow**, fade-in-up, shimmer skeletons |

### Hard Rules (DO NOT VIOLATE)
- **Zero border radius** on ALL elements except: badges (9999px), avatars (50%), chat bubbles
- **Fuchsia (#C108AB)** is the primary accent — use for CTAs, focus rings, active states
- **44px minimum** touch targets
- **16px font** on mobile inputs (prevents iOS zoom)
- **No emoji** in UI copy
- **Libre Baskerville** for headings, **DM Sans** for everything else

### Design Reference
Full spec: `wave-app-update/DESIGN_SYSTEM.md` in repo root.
Parent design doc: `Business_Specs/LYC_Intelligence_Design_Spec.md`

---

## Tickets Batch 2: TICKET-020 → TICKET-087

### Priority Breakdown
- **P0 (must-have for MVP):** ~28 tickets
- **P1 (automation & optimization):** ~23 tickets  
- **P2 (nice-to-have):** ~17 tickets

### Module Summary

#### Module 1: Content Command Center (Tickets 20)
| Ticket | Title | Priority | Est. |
|--------|-------|----------|------|
| TICKET-020 | Content Calendar — Export to CSV | P2 | 2h |

#### Module 2: Template & Asset Library (Tickets 21–30)
| Ticket | Title | Priority | Est. |
|--------|-------|----------|------|
| TICKET-021 | Template Library — List View | P0 | 4h |
| TICKET-022 | Template Library — Preview Modal | P0 | 3h |
| TICKET-023 | Template Library — Create/Edit | P0 | 4h |
| TICKET-024 | AI Content Generation — From Template | P1 | 5h |
| TICKET-025 | Asset Versioning — History | P1 | 3h |
| TICKET-026 | Asset Tagging & Search | P0 | 3h |
| TICKET-027 | Template — Duplicate | P2 | 1h |
| TICKET-028 | Template — Delete | P2 | 1h |
| TICKET-029 | Template — Import | P2 | 2h |
| TICKET-030 | Template — Export | P2 | 2h |

#### Module 3: Distribution Engine (Tickets 31–43)
| Ticket | Title | Priority | Est. |
|--------|-------|----------|------|
| TICKET-031 | Email Sequence Builder — List View | P0 | 3h |
| TICKET-032 | Email Sequence Builder — Create/Edit | P0 | 4h |
| TICKET-033 | Email Sequence — Preview Timeline | P1 | 3h |
| TICKET-034 | Mailing List Builder — List View | P0 | 3h |
| TICKET-035 | Mailing List Builder — Create/Edit | P0 | 3h |
| TICKET-036 | Mailing List — Manual Add/Remove | P1 | 2h |
| TICKET-037 | Content Scheduling — Calendar View | P1 | 4h |
| TICKET-038 | Multi-Channel Routing — Publish | P0 | 5h |
| TICKET-039 | Email Sequence — Send Action | P0 | 3h |
| TICKET-040 | Email Sequence — Performance Metrics | P1 | 3h |
| TICKET-041 | Email Sequence — A/B Test | P2 | 4h |
| TICKET-042 | Email Sequence — Export Metrics | P2 | 2h |
| TICKET-043 | Mailing List — Auto-Update Logic | P1 | 3h |

#### Module 4: B2C Journey Engine (Tickets 44–54)
| Ticket | Title | Priority | Est. |
|--------|-------|----------|------|
| TICKET-044 | Journey Builder — List View | P0 | 3h |
| TICKET-045 | Journey Builder — Visual Flow Editor | P0 | 8h |
| TICKET-046 | Journey Builder — Node Configuration | P0 | 5h |
| TICKET-047 | Journey — Activate/Pause | P0 | 2h |
| TICKET-048 | Journey — Entry Trigger | P0 | 4h |
| TICKET-049 | Journey — Execution Engine | P0 | 6h |
| TICKET-050 | Journey — Diagnostic Cross-Sell | P1 | 4h |
| TICKET-051 | Journey — B2B Signal Detection | P1 | 4h |
| TICKET-052 | Journey — Analytics Dashboard | P1 | 4h |
| TICKET-053 | Journey — Duplicate | P2 | 2h |
| TICKET-054 | Journey — Delete | P2 | 1h |

#### Module 5: Content Repurposing Engine (Tickets 55–61)
| Ticket | Title | Priority | Est. |
|--------|-------|----------|------|
| TICKET-055 | Repurposing Map Builder — Create | P1 | 4h |
| TICKET-056 | Repurposing Map — AI-Generated | P1 | 5h |
| TICKET-057 | Repurposing — Auto Derivative Gen | P1 | 5h |
| TICKET-058 | Repurposing — Status Tracking | P1 | 3h |
| TICKET-059 | Repurposing — ROI Metrics | P2 | 3h |
| TICKET-060 | Repurposing — Edit Derivative | P2 | 2h |
| TICKET-061 | Repurposing — Delete Map | P2 | 1h |

#### Module 6: Registration & Event Management (Tickets 62–71)
| Ticket | Title | Priority | Est. |
|--------|-------|----------|------|
| TICKET-062 | Event Creation — Form | P0 | 3h |
| TICKET-063 | Registration Form Builder | P0 | 4h |
| TICKET-064 | Registration Page — Public Form | P0 | 3h |
| TICKET-065 | Payment Integration (Stripe) | P1 | 5h |
| TICKET-066 | Event Reminders — Automated Emails | P1 | 3h |
| TICKET-067 | Event Registrations — List View | P0 | 2h |
| TICKET-068 | Lead Collection & Sorting | P0 | 3h |
| TICKET-069 | Event — Edit | P2 | 2h |
| TICKET-070 | Event — Delete | P2 | 1h |
| TICKET-071 | Event — Embed Registration | P2 | 2h |

#### Module 7: Analytics & Intelligence (Tickets 72–80)
| Ticket | Title | Priority | Est. |
|--------|-------|----------|------|
| TICKET-072 | Content Performance Dashboard | P0 | 4h |
| TICKET-073 | Email Metrics Dashboard | P1 | 3h |
| TICKET-074 | Journey Conversion Dashboard | P1 | 4h |
| TICKET-075 | Campaign ROI Dashboard | P1 | 3h |
| TICKET-076 | Repurposing ROI Dashboard | P2 | 3h |
| TICKET-077 | AI Report — Content Performance | P1 | 3h |
| TICKET-078 | AI Report — Campaign ROI | P2 | 3h |
| TICKET-079 | AI Report — Journey Conversion | P2 | 3h |
| TICKET-080 | Scheduled Reports (Cron) | P2 | 3h |

#### Agent Bridge (Tickets 81–87)
| Ticket | Title | Priority | Est. |
|--------|-------|----------|------|
| TICKET-081 | Agent Trigger Routes — Setup | P0 | 3h |
| TICKET-082 | Agent Trigger — Publish Content (Echo) | P1 | 3h |
| TICKET-083 | Agent Trigger — Send Email (Maria) | P1 | 3h |
| TICKET-084 | Agent Trigger — Register Attendee (Emily) | P1 | 3h |
| TICKET-085 | Supabase Realtime — Subscribe | P0 | 4h |
| TICKET-086 | Agent Status Display | P1 | 3h |
| TICKET-087 | Agent Logs — Audit Trail | P1 | 3h |

---

## Suggested Build Order

### Sprint 1 (Days 1–5): Foundation + Core Views
- Apply design system updates (globals.css, layout.tsx)
- TICKET-021 to 023 (Template Library)
- TICKET-031, 032, 034, 035 (Email & Mailing List basics)
- TICKET-044 to 047 (Journey Builder core)
- TICKET-062 to 064, 067, 068 (Event & Registration core)

### Sprint 2 (Days 6–10): Distribution & Intelligence
- TICKET-038, 039 (Multi-Channel Routing, Email Send)
- TICKET-045, 046, 048, 049 (Journey visual editor & engine)
- TICKET-055, 056, 057 (Repurposing engine)
- TICKET-072 (Content Performance Dashboard)
- TICKET-081, 085 (Agent bridge setup + Realtime)

### Sprint 3 (Days 11–15): Polish & Integration
- Remaining P1 tickets (analytics, AI reports, agent triggers)
- P2 tickets as time permits
- Integration testing, edge cases, error handling

---

## Key References
- BRD: `Business_Specs/WAVE_BRD_v1.0.md`
- Intelligence Layer Spec: `Business_Specs/WAVE_Intelligence_Layer_Spec_v1.0.md`
- Full ticket details: `Business_Specs/WAVE_Development_Tickets_v1.0.md`
- Design System: `wave-app-update/DESIGN_SYSTEM.md`
- Design Spec (parent): `Business_Specs/LYC_Intelligence_Design_Spec.md`
- HTML Prototype: `HTML_Prototype/WAVE_Full_Prototype.html` (for visual reference)
