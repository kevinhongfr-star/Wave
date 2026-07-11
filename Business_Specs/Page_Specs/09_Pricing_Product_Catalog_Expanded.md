# WAVE Business Spec — Module 9: Pricing & Product Catalog (EXPANDED)

**Version:** 2.1 | **Date:** 2026-07-12 | **Status:** Draft for Kevin Review
**Precedes:** Page 7 (Events), Page 8 (Analytics) — both depend on product catalog
**Retrofit scope:** Pages 1-6 must integrate product catalog (see Section 8 retrofit tickets)
**New tickets:** CAT-001 through CAT-078
**Total effort:** 205h
**Source document:** LYC_Pricing_Strategy_Market_Penetration_Playbook.md (2026-07-12)
**Integrates:** 12 Audit Criteria (C1-C12) + Infrastructure Components (INFRA-100 to INFRA-112)

---

## 1. Purpose

The Pricing & Product Catalog is WAVE's commercial backbone. Every other module references it:

- **Content Calendar** → tags content by product/tier it promotes
- **Template Library** → pricing page templates, proposal templates with tier-specific pricing
- **Distribution Engine** → tier-specific messaging (free content vs paid workshop promo)
- **B2C Journey Engine** → cross-sell rules reference products, bundles, and pricing tiers
- **Content Repurposing** → content that promotes specific tiers
- **Events** → tiered pricing (early-bird, regular, VIP, founding member)
- **Analytics** → revenue tracking by tier, product, bundle
- **Dashboard** → revenue by tier, cross-sell conversion, bundle uptake

It answers 5 questions:
1. **"What do we sell?"** — Product catalog (7 tiers, ~30 products, CNY pricing)
2. **"What does it cost?"** — Pricing rules (base price, discounts, bundles, phases)
3. **"What goes together?"** — Cross-sell matrix (10 configurable rules)
4. **"What's bundled?"** — Bundle architecture (6 named bundles)
5. **"How is it performing?"** — Revenue tracking (by tier, product, bundle, validation)

**Current state (what exists today):**
- Hardcoded product mentions in BRD (LEAP $295, PRISM $495, BRIDGE $15K-$50K)
- USD pricing (should be CNY)
- No product management UI
- No pricing rules engine
- No bundle support
- No discount enforcement
- No cross-sell matrix configuration
- No revenue tracking by tier

**Expansion scope (what this spec adds):**

| Area | Current | Expanded |
|------|---------|----------|
| Product catalog | Hardcoded mentions | Full CRUD: 7 tiers, ~30 products, CNY pricing, target buyers, descriptions |
| Pricing engine | None | Rule-based: base price, discount rules, phase-based pricing, never-discount enforcement |
| Bundles | None | 6 named bundles with component products, bundle pricing, % saved display |
| Cross-sell matrix | Hardcoded in Page 5 | Configurable rules engine: "if bought X → suggest Y" with conditions |
| Discount rules | None | Founding client (40-50% off), annual (15-20% off), early-bird (15%), never-discount list |
| Phase-based pricing | None | 4 phases (Wedge → Prove → Scale → Premium) with different rules per phase |
| Revenue tracking | Campaign ROI only | Revenue by tier, product, bundle, cross-sell conversion, validation signals |
| Council tiers | Not supported | 3 tiers (Individual ¥12K, Corporate ¥30K, PE ¥50K) with capacity limits |
| DEX AI pricing | Not supported | Starter ¥500, Pro ¥5K/mo, Enterprise ¥15-30K/mo, credit system |
| Validation tracking | None | Per-product success signals (sold at price X? → validate or drop tier) |

---

## 2. Business Requirements

### 2.1 Product Catalog

**Product metadata:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | auto | Primary key |
| `name` | TEXT | yes | Product name (e.g., "PRISM Diagnostic") |
| `slug` | TEXT | yes | URL-safe identifier (e.g., "prism-diagnostic") |
| `description` | TEXT | yes | Full description (block-based, editable) |
| `short_description` | TEXT | no | One-liner for cards/lists |
| `tier` | ENUM | yes | `free`, `low_ticket`, `mid_ticket`, `high_ticket`, `search`, `council`, `platform` |
| `category` | ENUM | yes | `diagnostic`, `coaching`, `advisory`, `workshop`, `content`, `search`, `membership`, `platform`, `bundle`, `mapping` |
| `base_price_cny` | INTEGER | yes | Base price in CNY (0 for free) |
| `price_range_min` | INTEGER | no | Minimum price (for variable pricing) |
| `price_range_max` | INTEGER | no | Maximum price |
| `currency` | TEXT | yes | Default: `CNY` |
| `pricing_model` | ENUM | yes | `one_time`, `monthly`, `annual`, `per_session`, `per_credit`, `percentage_fee`, `retainer` |
| `duration_weeks` | INTEGER | no | Engagement duration |
| `target_buyer` | TEXT | no | Who buys this (role/title) |
| `positioning` | TEXT | no | How to position it (one-liner) |
| `competes_against` | TEXT | no | What it competes with |
| `price_anchor` | TEXT | no | Price anchoring reference |
| `status` | ENUM | yes | `active`, `draft`, `archived`, `coming_soon` |
| `never_discount` | BOOLEAN | no | If true, discount engine blocks all discounts |
| `capacity_total` | INTEGER | no | Max seats/spots (for workshops, Council) |
| `capacity_filled` | INTEGER | auto | Current bookings |
| `requires_proof` | BOOLEAN | no | Whether this product requires case study proof before selling |
| `proof_stage` | ENUM | no | `not_needed`, `building`, `ready` |
| `cross_sell_targets` | UUID[] | no | Product IDs this can cross-sell to |
| `prerequisite_products` | UUID[] | no | Products that should be bought first |
| `phase_availability` | ENUM[] | no | Which phases this is available in: `wedge`, `prove`, `scale`, `premium` |
| `founding_client_eligible` | BOOLEAN | no | Can use founding client discount |
| `seo_keywords` | TEXT[] | no | For content tagging |
| `created_at` | TIMESTAMPTZ | auto | |
| `updated_at` | TIMESTAMPTZ | auto | |

**Default products to seed (30 products):**

**Tier 1 — FREE:**
1. LinkedIn Content (3x/week) — ¥0
2. Newsletter (weekly) — ¥0
3. Podcast (weekly) — ¥0
4. Webinar (monthly, 45 min) — ¥0
5. Initial diagnostic teaser (15 min) — ¥0

**Tier 2 — LOW-TICKET:**
6. Workshop (online, 2-3 hours) — ¥2,000-5,000
7. Workshop (online, half-day intensive) — ¥5,000-8,000
8. Insights Report (single issue) — ¥1,500-3,000
9. Talent Market Map (one market/role) — ¥3,000-8,000
10. The Council (annual membership) — ¥8,000-15,000/year *(note: this is the entry-level Council, Tier 6 has the full tiers)*
11. DEX AI Starter Credits — ¥500-2,000

**Tier 3 — MID-TICKET:**
12. Diagnostic (PRISM) — ¥8,000-25,000
13. Diagnostic (BRIDGE) — ¥8,000-25,000
14. Diagnostic (MOSAIC) — ¥8,000-25,000
15. Diagnostic (SPARK) — ¥8,000-25,000
16. Diagnostic (FORGE) — ¥8,000-25,000
17. Executive Coaching (6 sessions) — ¥18,000-36,000
18. Executive Coaching (12 sessions) — ¥30,000-60,000
19. Training Program (custom, 3 sessions) — ¥15,000-30,000
20. Syndicate Intelligence Subscription — ¥30,000-60,000/year
21. DEX AI Pro Subscription — ¥5,000-15,000/month
22. Mapping Project (full market scan) — ¥15,000-40,000

**Tier 4 — HIGH-TICKET:**
23. Advisory Project (single product) — ¥40,000-80,000
24. Advisory Project (multi-product) — ¥80,000-150,000
25. HQ-China Alignment Program (BRIDGE full) — ¥60,000-120,000
26. AI Transformation Program (SPARK full) — ¥80,000-150,000
27. Retainer (monthly advisory) — ¥15,000-30,000/month
28. PE Portfolio Talent Review (annual) — ¥80,000-150,000
29. DEX AI Enterprise License — ¥15,000-30,000/month

**Tier 5 — SEARCH:**
30. Retained Executive Search — 25-30% of first-year comp (¥75,000-200,000 typical)
31. Contingent Search — 20-25% of first-year comp (¥50,000-150,000 typical)
32. Search + Diagnostic Bundle — Search fee + ¥15K diagnostic (10-15% bundle discount)
33. Mapping-to-Search Pipeline — ¥15K mapping credited to search fee

**Tier 6 — THE COUNCIL:**
34. Council Individual Member — ¥12,000/year (60 max)
35. Council Corporate Member — ¥30,000/year (10 max)
36. Council PE Partner Member — ¥50,000/year (5 max)

**Tier 7 — PLATFORM (DEX AI):**
37. DEX AI Starter — ¥500 (10 credits)
38. DEX AI Pro — ¥5,000/month (100 credits + monthly report)
39. DEX AI Enterprise — ¥15,000-30,000/month (unlimited)
40. Credit Top-Up — ¥50/credit
41. METRIX Assessment (standalone) — ¥200-500 per assessment
42. Team Diagnostic (up to 10 people) — ¥3,000-8,000

### 2.2 Pricing Rules Engine

**Discount rules:**

| Rule ID | Condition | Discount | Frame As | Never If |
|---------|-----------|----------|----------|----------|
| `founding_client` | First 3 buyers of a diagnostic product | 40-50% off | "Founding client rate" | Product has `never_discount=true` |
| `annual_commitment` | 12-month retainer commitment | 15-20% off monthly | "Annual partnership rate" | — |
| `early_bird` | Event registration 14+ days before | 15% off | "Early-bird pricing" | — |
| `council_founding` | Council founding member (first 30) | 20% off first year | "Founding member rate" | Council at capacity |
| `multi_product` | 2+ products in single purchase | 20-30% off total | "Program rate" | — |
| `bundle_discount` | Pre-defined bundle purchased | Per-bundle discount | "Bundle rate" | — |

**Never-discount products (hardcoded):**
- Executive search (signals desperation)
- Retainers after first 3 clients
- Platform subscriptions (discounting SaaS before launch)
- The Council after founding members are filled
- Anything after client has said yes

**Phase-based pricing rules:**

| Phase | Months | Active Rules |
|-------|--------|-------------|
| `wedge` | 1-2 | Search at full price, diagnostics bundled (free), workshops at cost |
| `prove` | 2-4 | First paid diagnostics at founding rate, workshops at 50% off |
| `scale` | 4-6 | Diagnostics at full price, retainers at annual rate, Council founding |
| `premium` | 6+ | Full pricing architecture, no discounts except strategic |

### 2.3 Bundle Architecture

**6 named bundles:**

| Bundle | Components | Individual Price | Bundle Price | Discount |
|--------|-----------|-----------------|-------------|---------|
| `search_diagnose` | Retained search + diagnostic | ¥120-220K | ¥110-200K | 8-10% |
| `diagnose_develop` | Diagnostic + 6-month coaching | ¥50K | ¥40K | 20% |
| `diagnose_transform` | Diagnostic + advisory project | ¥80K | ¥65K | 19% |
| `full_program_ascent` | Diagnostic + coaching + workshop + retainer | ¥85K | ¥68K | 20% |
| `pe_portfolio` | Annual talent review + 2 searches + retainer | ¥340K | ¥280K | 18% |
| `council_workshop` | Annual membership + 2 workshop seats | ¥22K | ¥18K | 18% |

**Bundle metadata:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Bundle name |
| `slug` | TEXT | URL-safe identifier |
| `description` | TEXT | Full description |
| `component_product_ids` | UUID[] | Products included |
| `individual_total_cny` | INTEGER | Sum of component base prices |
| `bundle_price_cny` | INTEGER | Bundle price |
| `discount_percent` | FLOAT | Calculated discount % |
| `savings_cny` | INTEGER | individual_total - bundle_price |
| `status` | ENUM | `active`, `draft`, `archived` |
| `phase_availability` | ENUM[] | Which phases |
| `max_discount_override` | INTEGER | Allow override up to this % |

### 2.4 Cross-Sell Matrix

**10 configurable rules:**

| Rule ID | If Bought | Suggest | Introduction Script | Condition |
|---------|-----------|---------|-------------------|-----------|
| `xs_search_diag` | Executive Search | Diagnostic | "We found your VP. Here's their leadership profile. Want to see team fit?" | After placement start |
| `xs_prism_coaching` | PRISM Diagnostic | Coaching | "Your brand assessment shows X. Here's a 6-month coaching arc." | After results delivered |
| `xs_bridge_workshop` | BRIDGE Diagnostic | Workshop | "Your HQ-China gap is clear. Bring your team to our alignment workshop." | After results delivered |
| `xs_spark_advisory` | SPARK Diagnostic | Advisory | "Your AI readiness score is 35/100. Here's a 6-month roadmap." | Score < 50 |
| `xs_workshop_diag` | Workshop | Diagnostic | "You saw the framework. Here's what it looks like for YOUR team." | Within 14 days |
| `xs_coaching_retainer` | Coaching (completing) | Retainer | "Your coaching is going well. Want ongoing advisory access?" | Session 4+ |
| `xs_mapping_search` | Mapping Project | Search | "We mapped the market. Here are the top 5 candidates. Want us to approach them?" | After delivery |
| `xs_council_workshop` | Council Member | Workshop | "As a Council member, you get priority seating + 20% off workshops." | Ongoing |
| `xs_dexai_starter_pro` | DEX AI Starter (8+ credits used) | Pro Subscription | "You've used 8 of 10 credits. Here's what unlimited looks like." | Credits ≥ 8 |
| `xs_retainer_search` | Retainer Client | Search | "Your retainer includes quarterly talent reviews. Found any hard-to-fill roles?" | During retainer |

**Cross-sell rule metadata:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Rule name |
| `source_product_id` | UUID | Product that triggers the rule |
| `target_product_id` | UUID | Product to suggest |
| `condition_type` | ENUM | `after_purchase`, `after_delivery`, `score_threshold`, `time_based`, `usage_threshold`, `ongoing` |
| `condition_config` | JSONB | Rule-specific conditions (e.g., `{"score_below": 50}`) |
| `delay_days` | INTEGER | Days after trigger before suggesting |
| `introduction_script` | TEXT | What to say when suggesting |
| `channel` | ENUM | `email`, `in_app`, `call_script`, `all` |
| `priority` | INTEGER | Higher = shown first |
| `success_rate` | FLOAT | Tracked: % of suggestions accepted |
| `total_suggestions` | INTEGER | Tracked |
| `total_acceptances` | INTEGER | Tracked |
| `status` | ENUM | `active`, `paused`, `archived` |

### 2.5 Revenue Tracking Schema

**Revenue record:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `product_id` | UUID | What was sold |
| `bundle_id` | UUID | If sold as part of a bundle |
| `contact_id` | UUID | Who bought it |
| `company_id` | UUID | Buyer's company |
| `tier` | ENUM | Pricing tier at time of sale |
| `base_price_cny` | INTEGER | List price |
| `actual_price_cny` | INTEGER | What was actually paid |
| `discount_applied` | TEXT | Which discount rule was used |
| `discount_percent` | FLOAT | % discount |
| `phase` | ENUM | Which phase the sale occurred in |
| `is_founding_client` | BOOLEAN | Whether this was a founding client sale |
| `is_bundle` | BOOLEAN | Whether this was a bundle sale |
| `cross_sell_from_id` | UUID | If this was a cross-sell, what triggered it |
| `cross_sell_rule_id` | UUID | Which rule generated this sale |
| `validation_signal` | BOOLEAN | Whether this sale validates the price point |
| `salesperson` | TEXT | Who closed the deal |
| `sale_date` | DATE | When it closed |
| `payment_status` | ENUM | `pending`, `paid`, `refunded`, `in_progress` |
| `notes` | TEXT | Internal notes |

**Validation tracking:**

Per product, track:
- How many sold at full price vs discounted
- Whether the price point "validated" (someone paid without negotiation)
- If not validated → suggest dropping one tier
- Price history (was it ever sold at a different price?)

---

## 3. User Requirements

### 3.1 User Roles & Permissions

| Role | Catalog CRUD | Pricing Rules | Bundles | Cross-Sell | Revenue View | Discount Override |
|------|-------------|---------------|---------|------------|-------------|-------------------|
| Kevin (CTO) | Full | Full | Full | Full | Full | Full |
| Echo (Content) | Read | Read | Read | Read | Read (own products) | None |
| Carl (Events) | Read (events) | Read | Read | Read | Read (events) | Event discounts only |
| Maria (Email) | Read | Read | Read | Read | Read | None |
| NEXUS (PM) | Full | Full | Full | Full | Full | Kevin approval required |

### 3.2 Key User Flows

**Flow 1: Add a new product**
1. Navigate to Products → "New Product"
2. Select tier, category, pricing model
3. Fill in name, description, price range, target buyer
4. Set positioning, competes_against, price_anchor
5. Configure: never_discount? founding_client_eligible? phase_availability?
6. Save → product appears in catalog

**Flow 2: Create a bundle**
1. Navigate to Bundles → "New Bundle"
2. Select 2+ component products
3. System auto-calculates individual total
4. Enter bundle price → system shows discount % and savings
5. Add description, set phase availability
6. Save → bundle available for purchase/suggestion

**Flow 3: Configure a cross-sell rule**
1. Navigate to Cross-Sell → "New Rule"
2. Select source product (what was bought)
3. Select target product (what to suggest)
4. Set condition (when to suggest)
5. Write introduction script
6. Set channel, priority, delay
7. Save → rule activates, suggestions appear in journeys

**Flow 4: Apply a discount**
1. Select product/booking/registration
2. System shows available discount rules (founding, annual, early-bird, etc.)
3. If product has `never_discount=true`, discount button is disabled with explanation
4. Select rule → system calculates new price
5. Confirm → discount logged, price updated

**Flow 5: Track validation**
1. Navigate to Analytics → Validation
2. See per-product: sold X at ¥Y price, Z negotiated, W validated
3. If a product hasn't validated at its price → system suggests "Try ¥X (one tier down)"
4. Kevin reviews and decides

---

## 4. UX Requirements

### 4.1 Product Catalog View

```
┌─────────────────────────────────────────────────────────────────────┐
│  Products                                    [+ New Product]        │
├─────────────────────────────────────────────────────────────────────┤
│  [All] [Free] [Low] [Mid] [High] [Search] [Council] [Platform]    │
│  [Search: ______________________] [Status: All ▼]                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🔵 PRISM Diagnostic                    Mid-Ticket  Active  │   │
│  │ ¥8,000 - ¥25,000  |  2-4 weeks  |  CHROs, VPs, GMs        │   │
│  │ Positioning: "Data-driven talent intelligence"             │   │
│  │ Suggests → Coaching (3 accepted / 12 suggested = 25%)      │   │
│  │ Validation: ✅ Validated at ¥15K (2 sold)                  │   │
│  │ [Edit] [View Details] [Pricing History]                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🟡 BRIDGE Diagnostic                     Mid-Ticket  Active │   │
│  │ ¥8,000 - ¥25,000  |  2-4 weeks  |  Expats, China GMs       │   │
│  │ Positioning: "HQ-China alignment intelligence"             │   │
│  │ Suggests → Workshop (1 accepted / 5 suggested = 20%)       │   │
│  │ Validation: ⚠️ Not yet validated (0 sold at full price)    │   │
│  │ [Edit] [View Details] [Try Lower Price?]                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🔴 Executive Search                      Search  Active     │   │
│  │ 25-30% of first-year comp  |  ¥75K-¥200K typical          │   │
│  │ NEVER DISCOUNT  |  Available: All phases                    │   │
│  │ [Edit] [View Details]                                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**UX principles:**
- **Inline editing** (C1): Click any field to edit — price, status, positioning
- **Filter by tier** (C3): One click to see all Mid-Ticket products
- **Validation status visible** (C4): ✅/⚠️/❌ per product
- **Cross-sell performance inline** (C4): "3 accepted / 12 suggested = 25%"
- **Never-discount badge** (C3): 🔴 visual indicator
- **Drag to reorder** (C8): Priority ordering within tier
- **Slash commands** (C9): In description field, `/` opens block menu

### 4.2 Bundle Builder

```
┌─────────────────────────────────────────────────────────────────────┐
│  Bundle: Diagnose + Develop                               [Save]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Bundle Name: [Diagnose + Develop                    ] (inline)    │
│  Description: [Full diagnostic + 6-month coaching arc... ] (inline)│
│                                                                      │
│  ─── Component Products ───────────────────────────────────────    │
│                                                                      │
│  [Drag to reorder]                                                   │
│  1. 📦 PRISM Diagnostic            ¥15,000  [Remove] [Edit]       │
│  2. 📦 Executive Coaching (6 sess)  ¥30,000  [Remove] [Edit]       │
│                                                                      │
│  [+ Add Product]  [Search products...]                              │
│                                                                      │
│  ─── Pricing ──────────────────────────────────────────────────    │
│                                                                      │
│  Individual Total:    ¥45,000                                        │
│  Bundle Price:       [¥36,000] (inline editable)                    │
│  Discount:           20%                                             │
│  Client Saves:       ¥9,000                                          │
│                                                                      │
│  ─── Display Preview ───────────────────────────────────────────    │
│                                                                      │
│  ┌─────────────────────────────────────────────────┐               │
│  │ Diagnose + Develop                               │               │
│  │ Full diagnostic + 6-month coaching arc           │               │
│  │                                                   │               │
│  │ ~~¥45,000~~  ¥36,000  (Save 20%)                │               │
│  │ [Enroll Now]                                      │               │
│  └─────────────────────────────────────────────────┘               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.3 Cross-Sell Matrix View

```
┌─────────────────────────────────────────────────────────────────────┐
│  Cross-Sell Matrix                            [+ New Rule]          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐         │
│  │   Search     │────→│  Diagnostic  │────→│  Coaching    │         │
│  │              │     │              │     │              │         │
│  │   25% conv. │     │   20% conv. │     │   33% conv. │         │
│  └─────────────┘     └─────────────┘     └─────────────┘         │
│         │                    │                    │                  │
│         ▼                    ▼                    ▼                  │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐         │
│  │   Workshop   │     │  Advisory    │     │  Retainer    │         │
│  │              │     │              │     │              │         │
│  │   15% conv. │     │   40% conv. │     │   50% conv. │         │
│  └─────────────┘     └─────────────┘     └─────────────┘         │
│                                                                      │
│  ─── Rules Table ──────────────────────────────────────────────    │
│                                                                      │
│  │ Rule            │ If Bought    │ Suggest    │ Conv. │ Status │  │
│  │ xs_prism_coach  │ PRISM        │ Coaching   │ 25%   │ Active │  │
│  │ xs_bridge_work  │ BRIDGE       │ Workshop   │ 20%   │ Active │  │
│  │ xs_spark_adv    │ SPARK (<50)  │ Advisory   │ 40%   │ Active │  │
│  │ xs_workshop_dg  │ Workshop     │ Diagnostic │ 15%   │ Active │  │
│  │ xs_coach_ret    │ Coaching     │ Retainer   │ 33%   │ Active │  │
│  │ xs_mapping_src  │ Mapping      │ Search     │ 30%   │ Active │  │
│                                                                      │
│  [Click any row to edit inline]  [Drag to reorder by priority]     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.4 Revenue Dashboard (Product View)

```
┌─────────────────────────────────────────────────────────────────────┐
│  Revenue by Product                              This Quarter ▼    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─── Revenue by Tier ──────────────────────────────────────────┐  │
│  │                                                               │  │
│  │  Search     ████████████████████  ¥180K (62%)                │  │
│  │  Mid        ████████████          ¥85K (29%)                 │  │
│  │  Low        ███                   ¥20K (7%)                  │  │
│  │  Council    ██                    ¥15K (5%)                  │  │
│  │  Platform   █                     ¥5K (2%)                   │  │
│  │                                                               │  │
│  │  Total: ¥305K  |  Target: ¥400K  |  76% of target           │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌─── Validation Status ────────────────────────────────────────┐  │
│  │                                                               │  │
│  │  ✅ Validated (sold at full price without negotiation):      │  │
│  │     Search (3), PRISM (2), Workshop ¥5K (1)                  │  │
│  │                                                               │  │
│  │  ⚠️ Not validated (needs more sales or price adjustment):    │  │
│  │     BRIDGE (0 sold), SPARK (0 sold), Coaching ¥30K (0 sold)  │  │
│  │                                                               │  │
│  │  💡 Suggestion: BRIDGE at ¥25K not validating.              │  │
│  │     Try ¥15K (one tier down) → see if 2+ buyers emerge.     │  │
│  │                                                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌─── Bundle Performance ───────────────────────────────────────┐  │
│  │                                                               │  │
│  │  │ Bundle              │ Sold │ Revenue │ vs Individual │    │  │
│  │  │ Search+Diagnose     │  1   │ ¥110K   │ +¥10K saved   │    │  │
│  │  │ Diagnose+Develop    │  2   │ ¥72K    │ +¥18K saved   │    │  │
│  │  │ Council+Workshop    │  3   │ ¥54K    │ +¥12K saved   │    │  │
│  │                                                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌─── Cross-Sell Performance ───────────────────────────────────┐  │
│  │                                                               │  │
│  │  │ Rule              │ Suggested │ Accepted │ Conv. │ Rev.  │  │
│  │  │ PRISM → Coaching  │    12     │    3     │  25%  │ ¥90K │  │
│  │  │ BRIDGE → Workshop │     5     │    1     │  20%  │ ¥5K  │  │
│  │  │ SPARK → Advisory  │     5     │    2     │  40%  │ ¥80K │  │
│  │  │ Mapping → Search  │     3     │    1     │  33%  │ ¥100K│  │
│  │                                                               │  │
│  │  Total cross-sell revenue: ¥275K (58% of total)             │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Design Requirements

### 5.1 Component Design

**Product card:**
- Height: 80px (compact) / 120px (expanded)
- Left: Tier color indicator (4px bar: blue=free, green=low, teal=mid, gold=high, red=search, purple=council, orange=platform)
- Middle: Name, price range, target buyer, positioning
- Right: Validation badge (✅/⚠️/❌), cross-sell conversion %, status pill
- Hover: Expand to show description, phase availability
- Click: Opens inline editor (no modal)

**Bundle card:**
- Shows component products as chips
- Price comparison: ~~individual~~ → bundle price with savings badge
- Visual preview of how it displays to buyers
- Inline edit: drag components to reorder, click price to edit

**Cross-sell node (in journey builder):**
- Shows source → target products
- Conversion rate badge
- Click to edit rule inline
- Drag to connect different products

**Revenue widget:**
- Bar chart: revenue by tier (horizontal bars)
- Validation list: ✅/⚠️ per product
- Bundle performance: mini table
- Cross-sell performance: mini table with conversion rates

### 5.2 Color System

| Tier | Color | Hex |
|------|-------|-----|
| Free | Blue | `#2196F3` |
| Low-Ticket | Green | `#4CAF50` |
| Mid-Ticket | Teal | `#009688` |
| High-Ticket | Gold | `#C8962E` |
| Search | Red | `#E53E3E` |
| Council | Purple | `#7B1FA2` |
| Platform | Orange | `#FF9800` |

### 5.3 Animations

- Product status change: 200ms fade
- Price edit: Number rolls (like a slot machine, 300ms)
- Validation badge: Pulse animation when status changes
- Cross-sell suggestion: Slide-in from right when triggered

---

## 6. Technical Backend Wiring

### 6.1 Supabase Schema

```sql
-- Products catalog
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    tier TEXT NOT NULL CHECK (tier IN ('free','low_ticket','mid_ticket','high_ticket','search','council','platform')),
    category TEXT NOT NULL CHECK (category IN ('diagnostic','coaching','advisory','workshop','content','search','membership','platform','bundle','mapping')),
    base_price_cny INTEGER NOT NULL DEFAULT 0,
    price_range_min INTEGER,
    price_range_max INTEGER,
    currency TEXT NOT NULL DEFAULT 'CNY',
    pricing_model TEXT NOT NULL CHECK (pricing_model IN ('one_time','monthly','annual','per_session','per_credit','percentage_fee','retainer')),
    duration_weeks INTEGER,
    target_buyer TEXT,
    positioning TEXT,
    competes_against TEXT,
    price_anchor TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active','draft','archived','coming_soon')),
    never_discount BOOLEAN DEFAULT FALSE,
    capacity_total INTEGER,
    capacity_filled INTEGER DEFAULT 0,
    requires_proof BOOLEAN DEFAULT FALSE,
    proof_stage TEXT DEFAULT 'not_needed' CHECK (proof_stage IN ('not_needed','building','ready')),
    cross_sell_targets UUID[] DEFAULT '{}',
    prerequisite_products UUID[] DEFAULT '{}',
    phase_availability TEXT[] DEFAULT '{wedge,prove,scale,premium}',
    founding_client_eligible BOOLEAN DEFAULT FALSE,
    seo_keywords TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bundles
CREATE TABLE bundles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    component_product_ids UUID[] NOT NULL,
    individual_total_cny INTEGER NOT NULL,
    bundle_price_cny INTEGER NOT NULL,
    discount_percent FLOAT,
    savings_cny INTEGER,
    status TEXT DEFAULT 'draft' CHECK (status IN ('active','draft','archived')),
    phase_availability TEXT[] DEFAULT '{wedge,prove,scale,premium}',
    max_discount_override INTEGER DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cross-sell rules
CREATE TABLE cross_sell_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    source_product_id UUID REFERENCES products(id),
    target_product_id UUID REFERENCES products(id),
    condition_type TEXT CHECK (condition_type IN ('after_purchase','after_delivery','score_threshold','time_based','usage_threshold','ongoing')),
    condition_config JSONB DEFAULT '{}',
    delay_days INTEGER DEFAULT 0,
    introduction_script TEXT,
    channel TEXT DEFAULT 'all' CHECK (channel IN ('email','in_app','call_script','all')),
    priority INTEGER DEFAULT 0,
    success_rate FLOAT DEFAULT 0,
    total_suggestions INTEGER DEFAULT 0,
    total_acceptances INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active','paused','archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Revenue records
CREATE TABLE revenue_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    bundle_id UUID REFERENCES bundles(id),
    contact_id UUID REFERENCES contacts(id),
    company_id UUID REFERENCES companies(id),
    tier TEXT NOT NULL,
    base_price_cny INTEGER NOT NULL,
    actual_price_cny INTEGER NOT NULL,
    discount_applied TEXT,
    discount_percent FLOAT DEFAULT 0,
    phase TEXT CHECK (phase IN ('wedge','prove','scale','premium')),
    is_founding_client BOOLEAN DEFAULT FALSE,
    is_bundle BOOLEAN DEFAULT FALSE,
    cross_sell_from_product_id UUID,
    cross_sell_rule_id UUID REFERENCES cross_sell_rules(id),
    validation_signal BOOLEAN DEFAULT FALSE,
    salesperson TEXT,
    sale_date DATE NOT NULL,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','refunded','in_progress')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pricing phases (configurable)
CREATE TABLE pricing_phases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL CHECK (slug IN ('wedge','prove','scale','premium')),
    start_month INTEGER NOT NULL,
    end_month INTEGER,
    description TEXT,
    active_rules JSONB DEFAULT '{}',
    status TEXT DEFAULT 'active' CHECK (status IN ('active','upcoming','completed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discount rules (configurable)
CREATE TABLE discount_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    condition_type TEXT NOT NULL,
    condition_config JSONB DEFAULT '{}',
    discount_percent FLOAT NOT NULL,
    max_discount_percent FLOAT,
    frame_as TEXT NOT NULL,
    never_discount_product_ids UUID[] DEFAULT '{}',
    phase_applicable TEXT[] DEFAULT '{wedge,prove,scale,premium}',
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active','paused','archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Validation tracking
CREATE TABLE price_validations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) NOT NULL,
    price_tested_cny INTEGER NOT NULL,
    total_offered INTEGER DEFAULT 0,
    total_sold_full_price INTEGER DEFAULT 0,
    total_sold_negotiated INTEGER DEFAULT 0,
    total_not_sold INTEGER DEFAULT 0,
    validated BOOLEAN DEFAULT FALSE,
    suggested_next_price_cny INTEGER,
    notes TEXT,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_tier ON products(tier);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_revenue_product ON revenue_records(product_id);
CREATE INDEX idx_revenue_date ON revenue_records(sale_date);
CREATE INDEX idx_revenue_tier ON revenue_records(tier);
CREATE INDEX idx_cross_sell_source ON cross_sell_rules(source_product_id);
CREATE INDEX idx_cross_sell_status ON cross_sell_rules(status);

-- RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cross_sell_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_validations ENABLE ROW LEVEL SECURITY;

-- Policies: All authenticated users can read; only admin role can write
CREATE POLICY "All users can read products" ON products FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage products" ON products FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
-- (Similar policies for other tables)
```

### 6.2 API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products` | List all products (with tier/category/status filters) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product |
| PATCH | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Archive product |
| GET | `/api/products/:id/revenue` | Revenue history for a product |
| GET | `/api/products/:id/validation` | Validation status for a product |
| GET | `/api/bundles` | List all bundles |
| POST | `/api/bundles` | Create bundle |
| PATCH | `/api/bundles/:id` | Update bundle |
| GET | `/api/cross-sell-rules` | List all rules |
| POST | `/api/cross-sell-rules` | Create rule |
| PATCH | `/api/cross-sell-rules/:id` | Update rule |
| GET | `/api/cross-sell-rules/:id/performance` | Conversion stats |
| GET | `/api/revenue` | Revenue query (by tier, product, date range, phase) |
| GET | `/api/revenue/summary` | Revenue summary (totals by tier, product, bundle) |
| POST | `/api/revenue` | Record a sale |
| GET | `/api/discount-rules` | List discount rules |
| POST | `/api/discount-rules/apply` | Apply discount to a product/booking |
| GET | `/api/phases` | Current phase and phase history |
| GET | `/api/validations` | Validation status for all products |

### 6.3 Background Jobs

| Job | Schedule | Description |
|-----|----------|-------------|
| `validate_cross_sell_rates` | Every 6 hours | Recalculate success_rate for all cross-sell rules |
| `check_price_validations` | Daily | Check if any product needs price adjustment suggestion |
| `revenue_daily_summary` | Daily at 23:00 | Aggregate daily revenue by tier/product/bundle |
| `update_capacity` | On registration | Update capacity_filled for events/Council |
| `phase_progression_check` | Weekly | Check if current phase should advance |

---

## 7. AI Layer Specification

### 7.1 Persona: Pricing Strategist

```yaml
name: Pricing Strategist
role: Analyze sales data and recommend pricing adjustments
model: deepseek-pro
temperature: 0.3
max_tokens: 1000
system_prompt: |
  You are LYC Partners' pricing strategist. You analyze sales data to determine
  whether a product's price point is validated (someone paid without negotiation)
  or needs adjustment.
  
  Rules:
  - A price is "validated" when 2+ buyers pay the listed price without negotiation
  - If a product has 5+ offers but 0 sales, suggest dropping one tier
  - If a product has 3+ sales at full price, suggest raising the price 10-20%
  - Never suggest discounting search, retainers (after 3 clients), or platform subscriptions
  - Always frame suggestions in terms of "what the data says" not "what I think"
  
  Output format:
  - Product name and current price
  - Validation status (validated/not validated/insufficient data)
  - Recommendation (hold/raise/drop tier)
  - Suggested next price
  - Reasoning (2-3 sentences based on data)
```

**When triggered:**
- Daily: Check all products with 0 sales after 5+ offers
- On demand: Kevin asks "what should I adjust?"
- After each sale: Update validation status

### 7.2 Persona: Cross-Sell Optimizer

```yaml
name: Cross-Sell Optimizer
role: Analyze cross-sell performance and suggest rule improvements
model: deepseek-flash
temperature: 0.4
max_tokens: 800
system_prompt: |
  You are LYC Partners' cross-sell optimizer. You analyze which cross-sell rules
  are working and which need adjustment.
  
  Rules:
  - Rules with <10% conversion after 10+ suggestions → suggest pausing or rewriting script
  - Rules with >40% conversion → suggest increasing priority or broadening conditions
  - Rules with 0 suggestions → check if trigger conditions are too narrow
  - Always suggest specific script rewrites, not just "improve the script"
  
  Output format:
  - Rule name and current conversion
  - Assessment (working/needs adjustment/failing)
  - Specific recommendation (new script, pause, broaden conditions, etc.)
```

**When triggered:**
- Weekly: Review all active cross-sell rules
- After each cross-sell suggestion: Log outcome for future analysis

### 7.3 Persona: Bundle Recommender

```yaml
name: Bundle Recommender
role: Suggest new bundle combinations based on purchase patterns
model: deepseek-flash
temperature: 0.5
max_tokens: 600
system_prompt: |
  You are LYC Partners' bundle strategist. You analyze purchase patterns to
  suggest new product bundles that would increase average deal size.
  
  Rules:
  - Look for products frequently bought together (within 30 days)
  - Suggest bundles when 3+ contacts bought the same 2 products independently
  - Bundle discount should be 15-25% (enough to incentivize, not erode margin)
  - Never bundle search with anything (search is the wedge, not bundleable)
  - Always calculate the individual total, bundle price, and savings
  
  Output format:
  - Bundle name suggestion
  - Component products
  - Individual total vs suggested bundle price
  - Expected conversion (based on individual product sales velocity)
  - Reasoning
```

**When triggered:**
- Monthly: Analyze purchase patterns
- On demand: Kevin asks "what bundles should we create?"

---

## 8. Tickets

### 8.1 Product Catalog (CAT-001 to CAT-020)

| Ticket | Title | Priority | Hours | Dependencies |
|--------|-------|----------|-------|-------------|
| CAT-001 | Products table + RLS + indexes | P0 | 4h | INFRA-100 |
| CAT-002 | Seed 42 default products | P0 | 6h | CAT-001 |
| CAT-003 | Product list API (GET /api/products) | P0 | 3h | CAT-001 |
| CAT-004 | Product CRUD API (POST/PATCH/DELETE) | P0 | 4h | CAT-001 |
| CAT-005 | Product list page (tier tabs, search, filters) | P0 | 6h | CAT-003 |
| CAT-006 | Product card component (inline edit, validation badge) | P0 | 5h | CAT-005 |
| CAT-007 | Product detail/edit page (inline, no modal) | P0 | 5h | CAT-006 |
| CAT-008 | Product creation form (guided: tier → category → pricing → positioning) | P1 | 4h | CAT-007 |
| CAT-009 | Capacity tracking (Council tiers, workshop seats) | P1 | 3h | CAT-001 |
| CAT-010 | Proof stage tracking (not_needed → building → ready) | P1 | 2h | CAT-001 |
| CAT-011 | Never-discount enforcement (disable discount button, show reason) | P0 | 3h | CAT-006 |
| CAT-012 | Product archive + restore | P2 | 2h | CAT-004 |
| CAT-013 | SEO keywords tagging | P2 | 2h | CAT-007 |
| CAT-014 | Product search (full-text across name, description, positioning) | P1 | 3h | CAT-003 |
| CAT-015 | Product export (CSV, for proposals) | P2 | 2h | CAT-003 |
| CAT-016 | Product import (CSV bulk upload) | P2 | 3h | CAT-001 |
| CAT-017 | Cross-sell targets field (select which products this cross-sells to) | P1 | 3h | CAT-007 |
| CAT-018 | Prerequisite products field (what should be bought first) | P1 | 2h | CAT-007 |
| CAT-019 | Phase availability selector | P1 | 2h | CAT-007 |
| CAT-020 | Founding client eligibility toggle | P1 | 1h | CAT-007 |

### 8.2 Bundles (CAT-021 to CAT-030)

| Ticket | Title | Priority | Hours | Dependencies |
|--------|-------|----------|-------|-------------|
| CAT-021 | Bundles table + RLS | P0 | 3h | INFRA-100 |
| CAT-022 | Seed 6 default bundles | P0 | 3h | CAT-021, CAT-002 |
| CAT-023 | Bundle CRUD API | P0 | 4h | CAT-021 |
| CAT-024 | Bundle builder page (add/remove components, auto-calculate pricing) | P0 | 6h | CAT-023 |
| CAT-025 | Bundle display preview (how buyer sees it) | P1 | 3h | CAT-024 |
| CAT-026 | Bundle analytics (which bundles sell, conversion rates) | P1 | 4h | CAT-023 |
| CAT-027 | Bundle in registration flow (select bundle vs individual products) | P1 | 4h | CAT-024 |
| CAT-028 | Bundle discount enforcement (max_discount_override) | P1 | 2h | CAT-024 |
| CAT-029 | Bundle archive + restore | P2 | 2h | CAT-023 |
| CAT-030 | AI: Bundle Recommender (monthly purchase pattern analysis) | P2 | 4h | CAT-026, DeepSeek |

### 8.3 Cross-Sell Matrix (CAT-031 to CAT-042)

| Ticket | Title | Priority | Hours | Dependencies |
|--------|-------|----------|-------|-------------|
| CAT-031 | Cross-sell rules table + RLS | P0 | 3h | INFRA-100 |
| CAT-032 | Seed 10 default cross-sell rules | P0 | 3h | CAT-031, CAT-002 |
| CAT-033 | Cross-sell rules CRUD API | P0 | 4h | CAT-031 |
| CAT-034 | Cross-sell matrix visualization (flow diagram) | P0 | 6h | CAT-033 |
| CAT-035 | Cross-sell rule editor (inline, source → target, conditions) | P0 | 5h | CAT-034 |
| CAT-036 | Condition builder (after_purchase, score_threshold, etc.) | P1 | 4h | CAT-035 |
| CAT-037 | Introduction script editor (block-based) | P1 | 3h | CAT-035 |
| CAT-038 | Cross-sell performance tracking (suggested → accepted → revenue) | P0 | 5h | CAT-033 |
| CAT-039 | Cross-sell in journey builder (drag cross-sell node onto canvas) | P1 | 5h | CAT-035, JOUR-xxx |
| CAT-040 | Cross-sell trigger engine (check conditions, fire suggestions) | P0 | 5h | CAT-036 |
| CAT-041 | AI: Cross-Sell Optimizer (weekly rule performance review) | P2 | 4h | CAT-038, DeepSeek |
| CAT-042 | Cross-sell A/B testing (different scripts for same rule) | P2 | 5h | CAT-040 |

### 8.4 Pricing & Discount Engine (CAT-043 to CAT-055)

| Ticket | Title | Priority | Hours | Dependencies |
|--------|-------|----------|-------|-------------|
| CAT-043 | Pricing phases table + seed 4 phases | P0 | 3h | INFRA-100 |
| CAT-044 | Discount rules table + seed default rules | P0 | 4h | INFRA-100 |
| CAT-045 | Discount application API (POST /api/discount-rules/apply) | P0 | 4h | CAT-044 |
| CAT-046 | Discount UI in registration/booking flows | P0 | 5h | CAT-045 |
| CAT-047 | Never-discount enforcement (UI + API validation) | P0 | 3h | CAT-011, CAT-045 |
| CAT-048 | Phase-based pricing (auto-apply rules based on current phase) | P1 | 4h | CAT-043, CAT-044 |
| CAT-049 | Founding client tracker (count, limit to first N) | P1 | 3h | CAT-044 |
| CAT-050 | Early-bird timer (auto-expire after event date - 14 days) | P1 | 3h | CAT-044 |
| CAT-051 | Annual commitment discount (auto-apply for 12-month retainers) | P1 | 2h | CAT-044 |
| CAT-052 | Multi-product discount (auto-apply when 2+ products in cart) | P1 | 3h | CAT-044 |
| CAT-053 | Discount usage tracking (per-rule usage count, limit enforcement) | P1 | 3h | CAT-044 |
| CAT-054 | Discount audit log (who applied what, when, to whom) | P2 | 2h | CAT-045 |
| CAT-055 | AI: Pricing Strategist (daily validation check) | P2 | 4h | CAT-056, DeepSeek |

### 8.5 Revenue Tracking (CAT-056 to CAT-065)

| Ticket | Title | Priority | Hours | Dependencies |
|--------|-------|----------|-------|-------------|
| CAT-056 | Revenue records table + RLS | P0 | 3h | INFRA-100 |
| CAT-057 | Revenue recording API (POST /api/revenue) | P0 | 3h | CAT-056 |
| CAT-058 | Revenue query API (by tier, product, date range, phase) | P0 | 4h | CAT-056 |
| CAT-059 | Revenue summary API (totals by tier/product/bundle) | P0 | 3h | CAT-056 |
| CAT-060 | Revenue dashboard page (charts, tables, filters) | P0 | 6h | CAT-058, CAT-059 |
| CAT-061 | Revenue by tier chart (horizontal bar chart) | P1 | 3h | CAT-060 |
| CAT-062 | Revenue by product table | P1 | 3h | CAT-060 |
| CAT-063 | Revenue by bundle table | P1 | 2h | CAT-060 |
| CAT-064 | Cross-sell revenue attribution | P1 | 3h | CAT-060, CAT-038 |
| CAT-065 | Revenue export (CSV, for reporting) | P2 | 2h | CAT-060 |

### 8.6 Validation Tracking (CAT-066 to CAT-072)

| Ticket | Title | Priority | Hours | Dependencies |
|--------|-------|----------|-------|-------------|
| CAT-066 | Price validations table + RLS | P1 | 2h | INFRA-100 |
| CAT-067 | Validation status badges on product cards | P1 | 3h | CAT-066, CAT-006 |
| CAT-068 | Validation dashboard (per-product: offered, sold, validated?) | P1 | 4h | CAT-066 |
| CAT-069 | Auto-suggest price adjustment (if not validated after N offers) | P1 | 3h | CAT-068, CAT-055 |
| CAT-070 | Validation signal recording (on revenue record creation) | P1 | 2h | CAT-057 |
| CAT-071 | Price history tracking (was it ever sold at different price?) | P2 | 3h | CAT-066 |
| CAT-072 | Validation notifications (alert Kevin when product needs attention) | P2 | 2h | CAT-069 |

### 8.7 Integration & Retrofit (CAT-073 to CAT-078)

| Ticket | Title | Priority | Hours | Dependencies |
|--------|-------|----------|-------|-------------|
| CAT-073 | Dashboard: Revenue by tier widget | P1 | 3h | CAT-060, DASH-xxx |
| CAT-074 | Content Calendar: Tag content by product/tier it promotes | P1 | 3h | CAT-001, CAL-xxx |
| CAT-075 | Distribution: Tier-specific messaging templates | P1 | 3h | CAT-001, DIST-xxx |
| CAT-076 | Journey Engine: Cross-sell node uses product catalog | P0 | 4h | CAT-031, JOUR-xxx |
| CAT-077 | Events: Tiered pricing from product catalog | P0 | 4h | CAT-001, Page 7 expansion |
| CAT-078 | Analytics: Revenue by tier/product/bundle integration | P0 | 4h | CAT-060, Page 8 expansion |

### 8.8 Effort Summary

| Section | Tickets | Hours |
|---------|---------|-------|
| Product Catalog | 20 | 61h |
| Bundles | 10 | 36h |
| Cross-Sell Matrix | 12 | 51h |
| Pricing & Discount | 13 | 41h |
| Revenue Tracking | 10 | 32h |
| Validation Tracking | 7 | 19h |
| Integration & Retrofit | 6 | 21h |
| **Total** | **78** | **261h** |

*Note: Corrected from initial estimate of 205h — actual is 261h after detailed breakdown.*

---

## 9. Acceptance Criteria

### P0 (Must have for MVP)

- [ ] All 42 default products seeded with correct tier, price, pricing model
- [ ] Product CRUD works (create, read, update, archive)
- [ ] Product list page with tier filter tabs
- [ ] Product card shows validation status and cross-sell conversion
- [ ] All 6 bundles seeded with correct component products and pricing
- [ ] Bundle builder allows adding/removing components, auto-calculates pricing
- [ ] All 10 cross-sell rules seeded and editable
- [ ] Cross-sell matrix visualization shows product flow
- [ ] Cross-sell performance tracking (suggested → accepted → revenue)
- [ ] Discount rules seeded (founding, annual, early-bird, council founding, multi-product, bundle)
- [ ] Never-discount enforcement works (search, retainers, platform, Council at capacity)
- [ ] Revenue recording API works
- [ ] Revenue dashboard shows totals by tier, product, bundle
- [ ] Phase-based pricing: current phase determines which rules apply
- [ ] All 12 audit criteria met (inline editing, no modals, Supabase live, etc.)

### P1 (Should have)

- [ ] AI: Pricing Strategist runs daily, suggests price adjustments
- [ ] AI: Cross-Sell Optimizer runs weekly, suggests rule improvements
- [ ] Validation dashboard with per-product status
- [ ] Auto-suggest price drop when product not validated
- [ ] Capacity tracking for Council tiers and workshops
- [ ] Cross-sell in journey builder (drag node onto canvas)
- [ ] Bundle in registration flow
- [ ] Revenue export to CSV
- [ ] Discount audit log

### P2 (Nice to have)

- [ ] AI: Bundle Recommender analyzes purchase patterns monthly
- [ ] Cross-sell A/B testing
- [ ] Product import/export CSV
- [ ] Price history tracking
- [ ] Validation notifications

---

## 10. Component Architecture

```
<PricingModule>
├── <ProductCatalog>
│   ├── <TierTabs> — Free | Low | Mid | High | Search | Council | Platform
│   ├── <ProductSearchBar>
│   ├── <ProductCard> × N
│   │   ├── <ValidationBadge> — ✅/⚠️/❌
│   │   ├── <CrossSellBadge> — "3/12 = 25%"
│   │   ├── <NeverDiscountBadge> — 🔴
│   │   ├── <InlineEditor> — click any field to edit
│   │   └── <StatusPill> — Active | Draft | Archived
│   ├── <ProductDetail> — expanded view (inline, no modal)
│   └── <ProductCreationForm> — guided: tier → category → pricing → positioning
│
├── <BundleBuilder>
│   ├── <ComponentProductList> — drag to reorder
│   ├── <PricingCalculator> — individual total → bundle price → savings
│   ├── <DisplayPreview> — how buyer sees it
│   └── <BundleAnalytics> — which bundles sell
│
├── <CrossSellMatrix>
│   ├── <FlowDiagram> — visual product → product flow
│   ├── <RuleTable> — inline editable
│   ├── <RuleEditor> — source → target → conditions → script
│   ├── <PerformanceTracker> — suggested → accepted → revenue
│   └── <ConditionBuilder> — after_purchase, score_threshold, etc.
│
├── <PricingEngine>
│   ├── <PhaseSelector> — current phase + rules
│   ├── <DiscountApplicator> — select rule → auto-calculate
│   ├── <NeverDiscountGuard> — blocks forbidden discounts
│   └── <DiscountAuditLog>
│
├── <RevenueDashboard>
│   ├── <RevenueByTierChart> — horizontal bar chart
│   ├── <RevenueByProductTable>
│   ├── <RevenueByBundleTable>
│   ├── <CrossSellRevenueAttribution>
│   └── <PhaseProgressIndicator>
│
└── <ValidationTracker>
    ├── <ValidationDashboard> — per-product: offered, sold, validated?
    ├── <PriceAdjustmentSuggestion> — AI-powered
    └── <PriceHistoryTimeline>
</PricingModule>
```

---

## Appendix: Gap from Pricing Strategy Document

| Document Section | What It Defines | WAVE Coverage |
|-----------------|----------------|---------------|
| §1 Pricing Philosophy | 3 rules, anchor problem | Encoded in never-discount rules + phase logic |
| §2 Complete Pricing Table | 7 tiers, ~42 products | Product catalog (CAT-001 to CAT-020) |
| §3 Market Penetration | 4 phases (Wedge → Premium) | Pricing phases (CAT-043, CAT-048) |
| §4 Cross-Sell Map | 10 rules | Cross-sell matrix (CAT-031 to CAT-042) |
| §5 Positioning Strategy | Per-tier positioning | Product positioning field |
| §6 Discount & Bundle Rules | 6 discount rules, 6 bundles | Discount engine (CAT-043 to CAT-055) + Bundles (CAT-021 to CAT-030) |
| §7 Validation Playbook | Per-product validation method | Validation tracking (CAT-066 to CAT-072) |
| §8 First 90 Days | Revenue priorities | Revenue dashboard (CAT-056 to CAT-065) |
| §9 Key Decisions | 5 decisions for Kevin | Not systemizable — human decisions |

**Updated grand total across all specs:**

| Spec | Tickets | Hours |
|------|---------|-------|
| Page 1 Dashboard | 36 | 126h |
| Page 2 Content Calendar | 42 | 175h |
| Page 3 Template Library | 66 | 190h |
| Page 4 Distribution | 66 | 218h |
| Page 5 B2C Journey | 92 | 242h |
| Page 6 Content Repurposing | 78 | 210h |
| Cross-Page Infrastructure | 13 | 80h |
| **Module 9: Pricing & Product Catalog** | **78** | **261h** |
| Per-Page Retrofit (not started) | 36 | 154h |
| **GRAND TOTAL** | **509** | **1,656h** |
