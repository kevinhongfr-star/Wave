# WAVE Revised Roadmap Summary

**Revision Date:** 2026-07-17  
**Trigger:** Deep-dive UI/UX audit revealed app is 100% static (zero Supabase queries, 9/10 pages are single tables with 5 hardcoded rows)

---

## What Changed

| Metric | Before Audit | After Audit | Delta |
|--------|-------------|------------|-------|
| UI/UX effort | 60h | **810h** | +750h (13.5x) |
| Total project | ~2,534h | **~3,344h** | +810h |
| Total tickets | 795 | **~880** | +85 |
| Timeline | 10-13 months | **14-17 months** | +4 months |
| Go-live minimum | ~50h | **~86h** | +36h |

---

## Revised Wave Structure

### Wave 1: Foundation (Immediate, 4-5 weeks)
| Component | Tickets | Hours |
|-----------|---------|-------|
| Phase 0: Wire Supabase | 6 | 25h |
| Infrastructure P0: Dependencies + config | — | 27h |
| UI/UX P0: Empty/loading/error states | — | 19h |
| **Wave 1 Total** | **~6** | **71h** |

### Wave 2: Core Pages (Short-term, 3-4 months)
| Component | Tickets | Hours |
|-----------|---------|-------|
| Infrastructure P1: Data hooks, forms, tables, charts | — | 72h |
| Notion Integration | 15 | 37h |
| Dashboard redesign | ~8 | 23h |
| Content Calendar redesign | ~12 | 45h |
| Templates redesign | ~10 | 35h |
| Distribution redesign | ~12 | 50h |
| Journeys redesign | ~15 | 70h |
| Repurposing redesign | ~10 | 40h |
| **Wave 2 Total** | **~82** | **372h** |

### Wave 3: Secondary Pages (Medium-term, 3-4 months)
| Component | Tickets | Hours |
|-----------|---------|-------|
| Infrastructure P2: Mobile, accessibility, testing | — | 40h |
| Events redesign | ~12 | 55h |
| Analytics redesign | ~12 | 55h |
| Agents redesign | ~10 | 40h |
| P2 secondary work (mobile, filtering, exports) | ~20 | 232h |
| **Wave 3 Total** | **~54** | **422h** |

### Wave 4: Polish & Advanced (Long-term, 2-3 months)
| Component | Tickets | Hours |
|-----------|---------|-------|
| P3 polish (animations, onboarding, a11y) | ~10 | 113h |
| Phase 1-3: LMS, Tools, Program, Podcast | 38 | 130h |
| **Wave 4 Total** | **~48** | **243h** |

---

## Grand Total

| Category | Tickets | Hours |
|----------|---------|-------|
| Phase 0 (Supabase wiring) | 6 | 25h |
| Core Pages (00-09) | ~718 | ~2,282h |
| Notion Integration | 15 | 37h |
| Phase 1-3 (LMS/Tools/Podcast) | 38 | 130h |
| UI/UX Infrastructure | — | 139h |
| UI/UX P0 (Critical fixes) | — | 19h |
| UI/UX P1 (Page redesigns) | — | 307h |
| UI/UX P2 (Secondary) | — | 232h |
| UI/UX P3 (Polish) | — | 113h |
| **GRAND TOTAL** | **~880** | **~3,344h** |

---

## Key Documents

| Document | Purpose |
|----------|---------|
| [13_UI_UX_Design_System.md](Page_Specs/13_UI_UX_Design_System.md) | Revised UI/UX spec (810h) |
| [14_UI_UX_Page_By_Page_Deep_Dive.md](Page_Specs/14_UI_UX_Page_By_Page_Deep_Dive.md) | Page-by-page audit (671h) |
| [14B_UI_UX_Technical_Infrastructure_Audit.md](Page_Specs/14B_UI_UX_Technical_Infrastructure_Audit.md) | Infrastructure audit (139h) |
| [12_Phase0_Wire_Supabase.md](Page_Specs/12_Phase0_Wire_Supabase.md) | Phase 0 spec (25h) |
| [Trae_Briefing_Phase0.md](Trae_Briefing_Phase0.md) | Trae execution briefing |
| [supabase_full_migration.sql](supabase_full_migration.sql) | 72 tables, 847 lines |

---

## Immediate Next Steps

1. **Give Trae the Supabase keys** + updated Phase 0 briefing
2. **Install missing dependencies** (react-hook-form, zod, recharts, @dnd-kit, etc.)
3. **Create .env.local** with Supabase URL + key
4. **Wire Dashboard to Supabase** as proof of concept
5. **Create wave_config table** for ROI Calculator + Pricing JSON data
