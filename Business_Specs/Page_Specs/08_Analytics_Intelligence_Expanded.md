# WAVE Business Spec — Page 8: Analytics & Intelligence (EXPANDED)

**Version:** 2.1 | **Date:** 2026-07-12 | **Status:** Draft for Kevin Review
**Supersedes:** TICKET-072 through TICKET-087 (existing v1.0 — 16 tickets, ~55h)
**Builds on:** All modules (Dashboard, Content Calendar, Templates, Distribution, B2C Journey, Repurposing, Events, Pricing & Product Catalog)
**New tickets:** ANA-001 through ANA-098
**Total effort:** 312h (up from ~55h)
**Integrates:** 12 Audit Criteria (C1-C12) + Infrastructure Components (INFRA-100 to INFRA-112)
**Depends on:** Module 9 (revenue tracking, validation signals), Module 7 (event analytics), All other modules (data sources)

---

## 1. Purpose

The Analytics & Intelligence module is WAVE's brain. Every other module produces data; this module makes it actionable. It answers:

1. **"How is our content performing?"** — Content analytics: reach, engagement, conversion by channel, type, product, tier
2. **"What's our revenue picture?"** — Revenue intelligence: by tier, product, bundle, cross-sell attribution, validation
3. **"Are our events working?"** — Event analytics: revenue, attendance, lead quality, conversion to next tier
4. **"Is the B2C journey converting?"** — Journey analytics: step-by-step conversion, drop-off points, cross-sell rates
5. **"What's the ROI of each campaign?"** — Campaign ROI: cost, revenue, channel performance, content multiplication
6. **"What's the repurposing multiplier?"** — Repurposing ROI: source reach × derivative count × engagement per format
7. **"What should we do differently?"** — AI intelligence: trend detection, pricing validation, content recommendations, predictive insights
8. **"Are the agents working?"** — Agent monitoring: status, actions, logs, success rates

It must feel like **Notion's dashboards + Mixpanel's analytics + Stripe's revenue view** — not a spreadsheet dump or an enterprise BI tool.

**Current state (what exists today):**
- Static chart placeholders (no data)
- No Supabase connection
- No real-time updates
- No revenue tracking
- No cross-module analytics
- No AI report generation
- No scheduled reports
- No agent monitoring
- No pricing validation
- No predictive intelligence
- No campaign ROI calculation

**Expansion scope (what this spec adds):**

| Area | Current | Expanded |
|------|---------|----------|
| Content analytics | Placeholder chart | Full: views, engagement, conversion by channel/type/product/tier |
| Revenue intelligence | None | By tier, product, bundle, cross-sell, phase, validation |
| Event analytics | None | Revenue, attendance, lead quality, conversion, ROI |
| Journey analytics | None | Step-by-step conversion, drop-off, cross-sell rates |
| Campaign ROI | None | Cost, revenue, channel, content multiplication, per-campaign |
| Repurposing ROI | None | Source multiplication, cost per derivative, engagement per format |
| Email metrics | None | Open rate, click rate, conversion, by sequence/type |
| AI reports | None | Auto-generated: content, campaign, journey, revenue, event, pricing |
| Scheduled reports | None | Daily/weekly/monthly auto-send to Feishu/email |
| Pricing validation | None | Per-product: sold at full price? → validate or drop tier |
| Predictive intelligence | None | AI-driven: optimal pricing, content recommendations, churn risk |
| Agent monitoring | Basic status | Full: status, action log, success rate, error tracking |
| Real-time updates | None | Supabase Realtime across all dashboards |
| Market intelligence | None | External signal ingestion (industry news, competitor moves) |
| Custom dashboards | None | Drag-and-drop widget builder |
| Data export | None | CSV/PDF export for all reports |
| Alerts & thresholds | None | Configurable alerts (revenue target missed, conversion drop, etc.) |

---

## 2. Business Requirements

### 2.1 Functional Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-1 | Content performance dashboard: views, engagement, conversion by channel | P0 | Source: content_assets + distribution_logs |
| FR-2 | Revenue dashboard: by tier, product, bundle, cross-sell attribution | P0 | Source: revenue_records (Module 9) |
| FR-3 | Event analytics: revenue, attendance, lead quality, conversion | P0 | Source: events + event_registrations (Module 7) |
| FR-4 | Journey conversion dashboard: step-by-step, drop-off, cross-sell | P0 | Source: journey_steps + journey_logs (Page 5) |
| FR-5 | Campaign ROI: cost vs revenue, channel breakdown | P0 | Source: campaigns + revenue_records |
| FR-6 | Repurposing ROI: multiplication ratio, cost per derivative | P1 | Source: repurposing_maps + derivative_assets (Page 6) |
| FR-7 | Email metrics: open rate, click rate, conversion by sequence | P1 | Source: email_campaigns + email_events |
| FR-8 | AI report generator: auto-generate reports from data | P1 | DeepSeek-pro for analysis |
| FR-9 | Scheduled reports: daily/weekly/monthly auto-send | P1 | Feishu + email delivery |
| FR-10 | Pricing validation dashboard: per-product sell-at-price tracking | P0 | Source: price_validations (Module 9) |
| FR-11 | Predictive intelligence: AI-driven recommendations | P2 | Pricing, content, churn risk |
| FR-12 | Agent monitoring: status, actions, logs, success rates | P0 | Source: agent_logs |
| FR-13 | Real-time updates: Supabase Realtime on all dashboards | P0 | No manual refresh |
| FR-14 | Custom dashboard builder: drag-and-drop widgets | P2 | User-configurable layout |
| FR-15 | Data export: CSV/PDF for all reports | P1 | |
| FR-16 | Alerts & thresholds: configurable notifications | P1 | Revenue target, conversion drop, etc. |
| FR-17 | Market intelligence feed: external signals | P2 | News, competitor moves, industry trends |
| FR-18 | Funnel analytics: inbound funnel visualization | P1 | Content → lead → registration → purchase → cross-sell |
| FR-19 | Cohort analysis: track groups over time | P2 | By registration month, event, product |
| FR-20 | Benchmarking: compare current vs previous period | P1 | WoW, MoM, QoQ |
| FR-21 | Attribution tracking: which content/campaign drove revenue | P1 | Multi-touch attribution |
| FR-22 | KPI scorecards: per-role KPI views | P1 | Kevin: revenue, Echo: content, Carl: events |
| FR-23 | Anomaly detection: flag unusual patterns | P2 | AI-driven |
| FR-24 | Data retention policy: configurable per data type | P2 | 90d, 1yr, forever |
| FR-25 | API for external dashboards: expose analytics via API | P2 | For external BI tools if needed |

### 2.2 Dashboard Architecture

**7 dashboard views (tabs within Analytics page):**

| Tab | Name | Primary Audience | Key Metrics |
|-----|------|-----------------|-------------|
| 1 | Overview | Kevin | Revenue (MTD/QTD/YTD), pipeline, top products, alerts |
| 2 | Content | Echo | Reach, engagement, conversion, channel mix, content ROI |
| 3 | Revenue | Kevin | By tier, product, bundle, cross-sell, phase, validation |
| 4 | Events | Carl | Event revenue, attendance, lead quality, conversion |
| 5 | Journeys | Kevin/Maria | Step conversion, drop-off, cross-sell rates, journey ROI |
| 6 | Campaigns | Echo/Carl | Campaign cost, revenue, ROI, channel breakdown |
| 7 | Agents | Kevin/NEXUS | Agent status, action count, success rate, errors |

### 2.3 Revenue Intelligence (Deep Integration with Module 9)

**Revenue breakdown dimensions:**

| Dimension | Description | Source |
|-----------|-------------|--------|
| By pricing tier | Free, Low, Mid, High, Search, Council, Platform | revenue_records.tier |
| By product | Individual product revenue | revenue_records.product_id → products |
| By bundle | Bundle revenue + component attribution | revenue_records.bundle_id → bundles |
| By cross-sell | Revenue attributed to cross-sell rules | revenue_records.cross_sell_rule_id |
| By phase | Revenue in each pricing phase | revenue_records.phase |
| By discount | Revenue with/without discounts, discount depth | revenue_records.discount_applied |
| By validation | Revenue from validated vs unvalidated products | products.requires_proof + validation data |
| By channel | Which channel drove the sale | revenue_records.attribution_channel |
| By time | Daily, weekly, monthly, quarterly | revenue_records.sale_date |
| By customer | Revenue per contact/company | revenue_records.contact_id / company_id |

**Key revenue metrics:**

| Metric | Formula | Target (90-day) |
|--------|---------|-----------------|
| Total Revenue (MTD) | SUM(actual_price_cny) | ¥20-40K/month |
| Average Deal Size | Total Revenue / Deal Count | ¥8-15K |
| Revenue by Tier | SUM by tier | Track distribution |
| Cross-Sell Revenue | SUM where cross_sell_rule_id IS NOT NULL | 20%+ of total |
| Bundle Revenue | SUM where bundle_id IS NOT NULL | 15%+ of total |
| Full-Price Revenue | SUM where discount_applied IS NULL | 60%+ of total |
| Discount Depth | AVG(discount_percent) where applied | < 20% |
| Validation Rate | Products validated / Products offered | Track per product |
| Revenue Growth | MTD vs previous MTD | Positive trend |

### 2.4 Pricing Validation Intelligence

**Per-product validation tracking:**

| Status | Condition | Action |
|--------|-----------|--------|
| ✅ Validated | 2+ buyers paid full price | Keep price, confidence high |
| ⚠️ Testing | 1 buyer paid, or all with discount | Continue testing, don't change yet |
| ❌ Not validated | 5+ offers but 0 sales at full price | Consider dropping one tier |
| 🚫 Never tested | Product not yet offered | No data yet |

**Validation dashboard view:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  Pricing Validation                                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Product              │ Offered │ Sold Full │ Sold Disc │ Status    │
│  ─────────────────────────────────────────────────────────────────  │
│  PRISM Diagnostic     │   8     │   3       │   1       │ ✅ Valid. │
│  BRIDGE Diagnostic    │   5     │   0       │   2       │ ⚠️ Test.  │
│  Workshop (half-day)  │  12     │   4       │   2       │ ✅ Valid. │
│  Coaching (6-session) │   4     │   1       │   1       │ ⚠️ Test.  │
│  Council Individual   │   6     │   4       │   2       │ ✅ Valid. │
│  Executive Search     │   3     │   1       │   0       │ ⚠️ Test.  │
│  DEX AI Pro           │   0     │   0       │   0       │ 🚫 N/A   │
│                                                                      │
│  AI RECOMMENDATION                                                   │
│  ⚠️ BRIDGE Diagnostic: 5 offers, 0 full-price sales.               │
│     Suggestion: Try ¥6,000-15,000 (drop from ¥8,000-25,000).       │
│     Or: Bundle with Workshop to increase perceived value.            │
│                                                                      │
│  ⚠️ Coaching (6-session): Only 4 offered, 1 full-price.            │
│     Suggestion: Continue testing (need 2+ full-price to validate).  │
│     Consider founding-client rate for next 2 to build proof.        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.5 Content Performance Analytics

**Metrics per content asset:**

| Metric | Source | Description |
|--------|--------|-------------|
| Views / Impressions | Distribution logs | How many people saw it |
| Engagement | Distribution logs | Likes, comments, shares, saves |
| Click-through | Distribution logs | Clicks on links within content |
| Conversion | Journey logs | Registrations, purchases attributed to this content |
| Reach multiplication | Repurposing maps | Original reach + derivative reach |
| Cost per view | Content production cost / views | Efficiency metric |
| Time to publish | Content Calendar | From creation to publish |
| Channel performance | Distribution logs | Which channel works best for this type |

**Content analytics view:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  Content Performance                                [Last 30 days ▼] │
├─────────────────────────────────────────────────────────────────────┤
│  OVERVIEW                                                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │ 48       │ │ 125K     │ │ 3.2%     │ │ 847      │              │
│  │ Pieces   │ │ Views    │ │ Conv.    │ │ Leads    │              │
│  │ published│ │ (+18% MoM│ │ Rate     │ │ generated│              │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘              │
│                                                                      │
│  BY CHANNEL                                                          │
│  ┌───────────────────────────────────────────────────────────┐     │
│  │ LinkedIn   │ 52K views │ 1.8% CTR │ 312 leads │ ¥0.42/lead│   │
│  │ Newsletter │ 28K views │ 4.2% CTR │ 289 leads │ ¥0.55/lead│   │
│  │ Podcast    │ 18K views │ 0.8% CTR │  98 leads │ ¥1.20/lead│   │
│  │ Webinar    │ 12K views │ 8.5% CTR │  89 leads │ ¥0.80/lead│   │
│  │ WeChat     │  8K views │ 2.1% CTR │  45 leads │ ¥0.65/lead│   │
│  │ Other      │  7K views │ 1.2% CTR │  14 leads │ ¥2.10/lead│   │
│  └───────────────────────────────────────────────────────────┘     │
│                                                                      │
│  TOP PERFORMERS (by conversion)                                      │
│  1. "AI Leadership in China" (LinkedIn) — 8.2K views, 142 leads    │
│  2. "Q2 Talent Outlook" (Newsletter) — 6.1K views, 98 leads        │
│  3. "Diagnostic Webinar: PRISM" (Webinar) — 3.4K views, 89 leads   │
│                                                                      │
│  BY CONTENT TYPE → PROMOTES WHICH TIER                               │
│  Free content → Low-ticket workshop: 2.1% conversion                │
│  Free content → Mid-ticket diagnostic: 0.8% conversion              │
│  Workshop attendee → Diagnostic purchase: 15% conversion            │
│  Diagnostic → Coaching cross-sell: 25% conversion                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.6 Event Analytics

**Metrics per event:**

| Metric | Source | Description |
|--------|--------|-------------|
| Revenue | event_registrations.price_paid_cny | Total ticket revenue |
| Attendance rate | checked_in / confirmed | Show-up rate |
| Lead quality | AVG(lead_score) | Average lead score of attendees |
| B2B signals | b2b_signals count | PE, C-suite, multi-registrant flags |
| Conversion to next tier | Post-event journey → purchase | Workshop → Diagnostic, etc. |
| Cost per registration | Event cost / registrations | Efficiency |
| Revenue per seat | Total revenue / seats filled | Pricing effectiveness |
| Fill rate | registrations / capacity | Demand indicator |
| Waitlist size | waitlist count | Unmet demand |
| Post-event cross-sell | Cross-sell conversions within 30 days | Event as lead gen |

### 2.7 Campaign ROI

**Campaign definition:** A coordinated set of activities (content + events + emails + distribution) aimed at a specific goal (product launch, awareness, lead gen, etc.)

**ROI calculation:**

| Component | What to Track |
|-----------|--------------|
| Cost | Content production time × hourly rate + tool costs + ad spend + event costs |
| Revenue | Revenue from leads generated during campaign window |
| Attribution | Multi-touch: which content/events/emails contributed |
| ROI | (Revenue - Cost) / Cost × 100 |
| Payback period | Days from campaign start to break-even |

**Campaign ROI view:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  Campaign ROI                                     [All Time ▼]      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Campaign            │ Cost    │ Revenue │ ROI   │ Payback │ Status │
│  ─────────────────────────────────────────────────────────────────  │
│  PRISM Launch        │ ¥12,000 │ ¥89,000 │ 642%  │ 8 days  │ ✅ Done│
│  AI Workshop Series  │ ¥ 8,000 │ ¥45,000 │ 463%  │ 12 days │ ✅ Done│
│  Council Founding    │ ¥15,000 │ ¥360,000│ 2300% │ 5 days  │ ✅ Done│
│  Q3 Content Push     │ ¥ 5,000 │ ¥28,000 │ 460%  │ 18 days │ 🔄 Live│
│  DEX AI Beta         │ ¥20,000 │ ¥ 8,000 │ -60%  │ —       │ 🔄 Live│
│                                                                      │
│  AGGREGATE                                                           │
│  Total spend: ¥60,000 | Total revenue: ¥530,000 | Blended ROI: 783%│
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.8 Agent Monitoring

**Agent status tracking:**

| Agent | Status | Last Action | Actions Today | Success Rate | Errors |
|-------|--------|-------------|---------------|-------------|--------|
| Echo (Content) | 🟢 Online | Published LinkedIn post | 12 | 100% | 0 |
| Maria (Email) | 🟢 Online | Sent reminder sequence | 8 | 100% | 0 |
| Carl (Events) | 🟡 Idle | Last: Created workshop event | 3 | 100% | 0 |
| NEXUS (PM) | 🟢 Online | Analyzing pricing data | 24 | 96% | 1 |

**Agent action log:**

| Timestamp | Agent | Action | Status | Details |
|-----------|-------|--------|--------|---------|
| 10:32 | Echo | Published content | ✅ | LinkedIn: "AI Leadership" |
| 10:15 | Maria | Sent email batch | ✅ | 128 recipients, workshop reminder |
| 09:48 | NEXUS | Generated report | ✅ | Weekly revenue summary |
| 09:30 | Echo | Draft content | ✅ | Newsletter excerpt |
| 09:12 | Maria | Sent email | ❌ | Failed: SMTP timeout → retried → ✅ |

---

## 3. User Requirements

### 3.1 User Roles & Permissions

| Role | Overview | Content | Revenue | Events | Journeys | Campaigns | Agents | Custom Dash | Export |
|------|----------|---------|---------|--------|----------|-----------|--------|-------------|--------|
| Kevin (CTO) | Full | Full | Full | Full | Full | Full | Full | Full | Full |
| Echo (Content) | Summary | Full | Read | Read | Read | Full | Read | Own | CSV only |
| Carl (Events) | Summary | Read | Read | Full | Read | Read | Read | Own | CSV only |
| Maria (Email) | Summary | Read | Read | Read | Full | Read | Read | Own | CSV only |
| NEXUS (PM) | Full | Full | Full | Full | Full | Full | Full | Full | Full |

### 3.2 Key User Flows

**Flow 1: Kevin checks morning dashboard**
1. Open Analytics → Overview tab
2. See at a glance: Revenue MTD ¥42K (target ¥60K), 3 new registrations, 1 workshop this week (80% full), 2 alerts
3. Click into Revenue tab → see breakdown: Low-ticket ¥12K, Mid-ticket ¥18K, Council ¥12K
4. Check Pricing Validation → BRIDGE still not validated, PRISM validated ✅
5. See AI recommendation: "Consider bundling BRIDGE with Workshop to increase perceived value"
6. Click into Agents tab → all agents running normally
7. Close — total time: 2 minutes

**Flow 2: Echo reviews content performance**
1. Open Analytics → Content tab
2. See: 48 pieces published this month, 125K views, 3.2% conversion rate
3. Filter by channel → LinkedIn performing best (52K views, 312 leads)
4. See top performers → "AI Leadership in China" drove 142 leads
5. Check repurposing ROI → Webinar source generated 12 derivatives, 89 leads total
6. AI recommendation: "Webinar-to-derivative pipeline has highest ROI. Schedule 2 more webinars this month."
7. Export content report as CSV for team meeting

**Flow 3: Carl reviews event ROI**
1. Open Analytics → Events tab
2. See: 4 events this month, ¥163K revenue, 78% avg attendance, 72 avg lead score
3. See per-event breakdown: Workshop ¥76.8K (92% fill), Council ¥86.4K (87% fill)
4. Check conversion: 15% of workshop attendees booked diagnostic within 30 days
5. AI recommendation: "Workshop → Diagnostic conversion (15%) exceeds target (10%). Consider increasing workshop frequency."
6. See B2B signals: 4 PE-affiliated attendees this month

**Flow 4: Kevin reviews pricing validation**
1. Open Analytics → Revenue tab → Pricing Validation section
2. See per-product: PRISM validated ✅, Workshop validated ✅, BRIDGE testing ⚠️
3. Read AI recommendation: "BRIDGE: 5 offers, 0 full-price sales. Suggest drop to ¥6K-15K or bundle with Workshop."
4. Decide: keep testing for 2 more weeks, then decide
5. See phase status: Currently in "Prove" phase — founding rate diagnostics, 50% off workshops

**Flow 5: Scheduled report delivery**
1. Monday 9:00 AM: Weekly revenue report auto-generated and sent to Kevin via Feishu
2. Report includes: revenue MTD, by tier, top products, cross-sell rate, validation status, AI recommendations
3. Wednesday 10:00 AM: Weekly content report sent to Echo
4. First of month: Monthly comprehensive report to all stakeholders
5. Kevin can also trigger manual report generation anytime

---

## 4. UX Requirements

### 4.1 Overview Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Analytics — Overview                                        [This Month ▼] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│  │ ¥42,000    │ │ 7          │ │ 89         │ │ 2          │ │ 78%      │ │
│  │ Revenue    │ │ Products   │ │ Leads      │ │ Events     │ │ Avg      │ │
│  │ MTD        │ │ Sold       │ │ Generated  │ │ This Month │ │ Fill Rate│ │
│  │ (70% of    │ │ (+2 MoM)   │ │ (+12% MoM) │ │ (¥163K rev)│ │          │ │
│  │  target)   │ │            │ │            │ │            │ │          │ │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘ └──────────┘ │
│                                                                              │
│  REVENUE BY TIER                                    PIPELINE                 │
│  ┌─────────────────────────────────┐   ┌────────────────────────────────┐  │
│  │ ████████████ Low-Ticket  ¥12K   │   │ 28 leads in journey (active)   │  │
│  │ ██████████████████ Mid   ¥18K   │   │ 12 in diagnostic consideration │  │
│  │ ████████████ Council   ¥12K   │   │  5 in coaching proposal stage  │  │
│  │ ██████ High-Ticket    ¥0K    │   │  3 in Council evaluation       │  │
│  │ ▓▓▓▓▓▓▓▓ Search      ¥0K    │   │                                │  │
│  └─────────────────────────────────┘   └────────────────────────────────┘  │
│                                                                              │
│  ALERTS                                                                      │
│  ⚠️  Revenue at 70% of monthly target — 12 days remaining                  │
│  ⚠️  BRIDGE Diagnostic: 5 offers, 0 full-price sales — consider pricing    │
│  ✅ PRISM Diagnostic: validated at ¥15K (3 full-price sales)               │
│  ✅ Workshop series: 92% fill rate, 15% conversion to diagnostic            │
│                                                                              │
│  AGENT STATUS                                                                │
│  Echo 🟢 | Maria 🟢 | Carl 🟡 | NEXUS 🟢                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Revenue Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Analytics — Revenue                                         [This Month ▼] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐              │
│  │ ¥42,000    │ │ ¥11,667    │ │ 20%        │ │ 67%        │              │
│  │ Total      │ │ Avg Deal   │ │ Cross-Sell │ │ Full-Price │              │
│  │ Revenue    │ │ Size       │ │ Rate       │ │ Revenue    │              │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘              │
│                                                                              │
│  REVENUE BY TIER (bar chart)                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Low    Mid    High   Search  Council  Platform                     │   │
│  │  ¥12K   ¥18K   ¥0     ¥0      ¥12K    ¥0                           │   │
│  │  ████   ██████         ░       ████                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  REVENUE BY PRODUCT (top 10)                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Workshop (half-day)     │ ¥24,000 │ 4 sold │ ✅ Validated         │   │
│  │  Council Individual      │ ¥12,000 │ 1 sold │ ✅ Validated         │   │
│  │  PRISM Diagnostic        │ ¥15,000 │ 1 sold │ ✅ Validated         │   │
│  │  Workshop (online 2-3h)  │ ¥ 5,100 │ 1 sold │ ⚠️ Testing          │   │
│  │  BRIDGE Diagnostic       │ ¥ 0     │ 0 sold │ ⚠️ 5 offers, 0 sales │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  CROSS-SELL ATTRIBUTION                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  xs_prism_coaching:  0 conversions (3 suggestions)                  │   │
│  │  xs_workshop_diag:   2 conversions (8 suggestions) = 25%           │   │
│  │  xs_council_workshop:1 conversion (4 suggestions) = 25%            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  PHASE STATUS: PROVE (Month 2-4)                                             │
│  Active rules: Founding rate diagnostics, 50% off workshops                  │
│  Revenue in phase: ¥42,000                                                   │
│  Days remaining: 28                                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Funnel Analytics

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Analytics — Inbound Funnel                                  [Last 90 days]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  CONTENT REACH          125,000 views                              │   │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%                     │   │
│  │       ↓ 3.2% conversion                                           │   │
│  │  LEADS CAPTURED         4,000                                      │   │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 3.2%                                         │   │
│  │       ↓ 15% engaged                                               │   │
│  │  ENGAGED LEADS          600                                        │   │
│  │  ▓▓▓▓▓▓▓▓▓ 0.48%                                                   │   │
│  │       ↓ 33% registered                                            │   │
│  │  EVENT REGISTRATIONS    200                                        │   │
│  │  ▓▓▓▓ 0.16%                                                        │   │
│  │       ↓ 45% attended                                              │   │
│  │  ATTENDEES              90                                         │   │
│  │  ▓▓ 0.072%                                                         │   │
│  │       ↓ 15% purchased                                             │   │
│  │  CUSTOMERS              14                                         │   │
│  │  ▓ 0.011%                                                          │   │
│  │       ↓ 28% cross-sold                                            │   │
│  │  REPEAT/EXPANDED        4                                          │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  FUNNEL METRICS                                                              │
│  Content → Lead:       3.2%  (target: 3%+)  ✅                             │
│  Lead → Engaged:      15%   (target: 10%+) ✅                              │
│  Engaged → Registered: 33%  (target: 25%+) ✅                              │
│  Registered → Attended:45%  (target: 50%+) ⚠️ (improve reminders)          │
│  Attended → Purchased: 15%  (target: 10%+) ✅                              │
│  Purchased → Cross-sold: 28% (target: 20%+) ✅                             │
│  Overall: Content → Customer: 0.011%                                        │
│                                                                              │
│  BOTTLENECK: Registered → Attended (45%, below 50% target)                  │
│  AI SUGGESTION: Add 1-hour reminder (currently only 7d, 3d, 1d, 1h)         │
│  Consider: SMS reminder for high-value events                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Data Model

### 5.1 New Supabase Tables

**Table: `analytics_snapshots`**

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | auto | Primary key |
| `snapshot_date` | DATE | yes | Date of snapshot |
| `snapshot_type` | ENUM | yes | `daily`, `weekly`, `monthly` |
| `total_revenue_cny` | INTEGER | no | Period revenue |
| `revenue_by_tier` | JSONB | no | `{free: X, low: Y, mid: Z, ...}` |
| `revenue_by_product` | JSONB | no | `{product_id: revenue, ...}` |
| `total_leads` | INTEGER | no | New leads in period |
| `total_registrations` | INTEGER | no | New registrations |
| `total_customers` | INTEGER | no | New customers (first purchase) |
| `cross_sell_rate` | FLOAT | no | % of customers with cross-sell |
| `avg_deal_size_cny` | INTEGER | no | Average deal size |
| `content_published` | INTEGER | no | Pieces published |
| `content_views` | INTEGER | no | Total views |
| `content_conversion_rate` | FLOAT | no | Views → leads |
| `event_count` | INTEGER | no | Events held |
| `event_revenue_cny` | INTEGER | no | Event revenue |
| `event_avg_attendance_rate` | FLOAT | no | Avg attendance |
| `campaign_count` | INTEGER | no | Active campaigns |
| `campaign_roi_avg` | FLOAT | no | Average campaign ROI |
| `agent_actions_total` | INTEGER | no | Total agent actions |
| `agent_errors_total` | INTEGER | no | Total agent errors |
| `created_at` | TIMESTAMPTZ | auto | |

**Table: `campaigns`**

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | auto | Primary key |
| `name` | TEXT | yes | Campaign name |
| `description` | TEXT | no | Goal and strategy |
| `status` | ENUM | yes | `planning`, `active`, `paused`, `completed` |
| `start_date` | DATE | yes | |
| `end_date` | DATE | no | |
| `total_cost_cny` | INTEGER | no | Estimated or actual cost |
| `total_revenue_cny` | INTEGER | auto | Revenue attributed |
| `roi_percent` | FLOAT | auto | (revenue - cost) / cost * 100 |
| `payback_days` | INTEGER | no | Days to break-even |
| `linked_content_ids` | UUID[] | no | Content assets in campaign |
| `linked_event_ids` | UUID[] | no | Events in campaign |
| `linked_email_ids` | UUID[] | no | Email sequences in campaign |
| `linked_product_ids` | UUID[] | no | Products promoted |
| `target_leads` | INTEGER | no | Goal |
| `actual_leads` | INTEGER | auto | Generated |
| `target_revenue_cny` | INTEGER | no | Goal |
| `owner` | TEXT | no | Who runs it |
| `notes` | TEXT | no | |
| `created_at` | TIMESTAMPTZ | auto | |
| `updated_at` | TIMESTAMPTZ | auto | |

**Table: `agent_logs`**

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | auto | Primary key |
| `agent_name` | TEXT | yes | Echo, Maria, Carl, NEXUS, etc. |
| `action_type` | ENUM | yes | `publish`, `send_email`, `create_event`, `generate_report`, `analyze`, `trigger`, `error` |
| `action_description` | TEXT | yes | What was done |
| `status` | ENUM | yes | `success`, `failed`, `retrying`, `pending` |
| `details` | JSONB | no | Action-specific data |
| `error_message` | TEXT | no | If failed |
| `retry_count` | INTEGER | no | Number of retries |
| `duration_ms` | INTEGER | no | How long it took |
| `triggered_by` | TEXT | no | `manual`, `scheduled`, `event_trigger`, `api` |
| `created_at` | TIMESTAMPTZ | auto | |

**Table: `report_schedules`**

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | auto | Primary key |
| `name` | TEXT | yes | Report name |
| `report_type` | ENUM | yes | `revenue`, `content`, `events`, `campaign`, `journey`, `pricing_validation`, `comprehensive` |
| `frequency` | ENUM | yes | `daily`, `weekly`, `monthly`, `quarterly` |
| `delivery_day` | TEXT | no | e.g., "Monday" for weekly |
| `delivery_time` | TIME | no | e.g., "09:00" |
| `delivery_channel` | ENUM | yes | `feishu`, `email`, `both` |
| `recipients` | TEXT[] | yes | Who receives it |
| `format` | ENUM | yes | `summary`, `detailed`, `executive` |
| `include_sections` | TEXT[] | no | Which sections to include |
| `active` | BOOLEAN | yes | |
| `last_generated_at` | TIMESTAMPTZ | no | |
| `next_generation_at` | TIMESTAMPTZ | no | |
| `created_at` | TIMESTAMPTZ | auto | |

**Table: `alerts`**

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | auto | Primary key |
| `name` | TEXT | yes | Alert name |
| `metric` | TEXT | yes | What to monitor |
| `condition` | ENUM | yes | `above`, `below`, `equals`, `change_percent` |
| `threshold` | FLOAT | yes | Value to compare |
| `comparison_period` | ENUM | no | `daily`, `weekly`, `monthly` |
| `status` | ENUM | yes | `active`, `triggered`, `acknowledged`, `resolved` |
| `triggered_at` | TIMESTAMPTZ | no | When it fired |
| `triggered_value` | FLOAT | no | Actual value when triggered |
| `notification_sent` | BOOLEAN | no | |
| `acknowledged_by` | TEXT | no | Who acknowledged |
| `resolved_at` | TIMESTAMPTZ | no | |
| `created_at` | TIMESTAMPTZ | auto | |

**Table: `market_signals`**

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | auto | Primary key |
| `source` | TEXT | yes | Where signal came from |
| `type` | ENUM | yes | `competitor`, `industry`, `regulation`, `technology`, `market`, `client` |
| `title` | TEXT | yes | Signal title |
| `summary` | TEXT | yes | Brief description |
| `relevance` | ENUM | yes | `high`, `medium`, `low` |
| `affected_products` | UUID[] | no | Which products this affects |
| `affected_tiers` | TEXT[] | no | Which pricing tiers |
| `recommended_action` | TEXT | no | AI-suggested response |
| `status` | ENUM | yes | `new`, `reviewed`, `actioned`, `dismissed` |
| `reviewed_by` | TEXT | no | |
| `published_at` | TIMESTAMPTZ | no | When signal was published |
| `created_at` | TIMESTAMPTZ | auto | |

### 5.2 Supabase Views

**View: `revenue_summary`**

```sql
CREATE VIEW revenue_summary AS
SELECT 
  DATE_TRUNC('month', sale_date) AS month,
  tier,
  COUNT(*) AS deal_count,
  SUM(actual_price_cny) AS total_revenue_cny,
  AVG(actual_price_cny) AS avg_deal_size_cny,
  COUNT(*) FILTER (WHERE discount_applied IS NULL) AS full_price_count,
  COUNT(*) FILTER (WHERE cross_sell_rule_id IS NOT NULL) AS cross_sell_count,
  COUNT(*) FILTER (WHERE bundle_id IS NOT NULL) AS bundle_count,
  COUNT(*) FILTER (WHERE validation_signal = true) AS validated_count
FROM revenue_records
WHERE payment_status = 'paid'
GROUP BY month, tier;
```

**View: `content_performance_summary`**

```sql
CREATE VIEW content_performance_summary AS
SELECT 
  ca.content_type,
  ca.channel,
  COUNT(*) AS piece_count,
  SUM(COALESCE(dl.views, 0)) AS total_views,
  SUM(COALESCE(dl.engagements, 0)) AS total_engagements,
  SUM(COALESCE(dl.clicks, 0)) AS total_clicks,
  ROUND(AVG(COALESCE(dl.conversions, 0))::numeric, 2) AS avg_conversions
FROM content_assets ca
LEFT JOIN distribution_logs dl ON ca.id = dl.content_asset_id
WHERE ca.status = 'published'
GROUP BY ca.content_type, ca.channel;
```

**View: `funnel_metrics`**

```sql
CREATE VIEW funnel_metrics AS
SELECT 
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*) AS total_leads,
  COUNT(*) FILTER (WHERE engagement_score > 50) AS engaged_leads,
  COUNT(*) FILTER (WHERE has_registration = true) AS registered,
  COUNT(*) FILTER (WHERE has_attendance = true) AS attended,
  COUNT(*) FILTER (WHERE has_purchase = true) AS purchased,
  COUNT(*) FILTER (WHERE has_cross_sell = true) AS cross_sold
FROM contacts
GROUP BY month;
```

---

## 6. API Endpoints

### 6.1 Analytics Queries

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/analytics/overview` | Overview dashboard data | Required |
| GET | `/api/analytics/revenue` | Revenue breakdown (tier, product, bundle, time) | Required |
| GET | `/api/analytics/content` | Content performance (views, engagement, conversion) | Required |
| GET | `/api/analytics/events` | Event analytics (revenue, attendance, leads) | Required |
| GET | `/api/analytics/journeys` | Journey conversion analytics | Required |
| GET | `/api/analytics/campaigns` | Campaign ROI data | Required |
| GET | `/api/analytics/funnel` | Inbound funnel metrics | Required |
| GET | `/api/analytics/pricing-validation` | Pricing validation status per product | Required |
| GET | `/api/analytics/agents` | Agent status and metrics | Required |

### 6.2 Reports

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/reports/generate` | Generate report on demand | Required |
| GET | `/api/reports/schedules` | List report schedules | Required |
| POST | `/api/reports/schedules` | Create report schedule | Required |
| PATCH | `/api/reports/schedules/:id` | Update schedule | Required |
| DELETE | `/api/reports/schedules/:id` | Delete schedule | Required |
| GET | `/api/reports/:id/download` | Download generated report | Required |

### 6.3 Alerts

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/alerts` | List alerts | Required |
| POST | `/api/alerts` | Create alert | Required |
| PATCH | `/api/alerts/:id` | Update alert | Required |
| POST | `/api/alerts/:id/acknowledge` | Acknowledge alert | Required |
| POST | `/api/alerts/:id/resolve` | Resolve alert | Required |

### 6.4 Agent Logs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/agent-logs` | List agent actions (filter by agent, type, date) | Required |
| GET | `/api/agent-logs/status` | Current agent status | Required |
| GET | `/api/agent-logs/stats` | Agent success rates, error counts | Required |

### 6.5 Market Intelligence

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/market-signals` | List market signals (filter by type, relevance) | Required |
| POST | `/api/market-signals` | Add market signal (manual or API) | Required |
| PATCH | `/api/market-signals/:id` | Update signal status | Required |
| POST | `/api/market-signals/ingest` | Ingest from external sources | System |

### 6.6 Agent Triggers

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/agents/echo/publish` | Trigger Echo to publish content | Required |
| POST | `/api/agents/maria/send-sequence` | Trigger Maria to send email | Required |
| POST | `/api/agents/carl/create-event` | Trigger Carl to create event | Required |
| GET | `/api/agents/status` | All agents status | Required |

### 6.7 Data Export

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/export/revenue` | Export revenue data (CSV/PDF) | Required |
| GET | `/api/export/content` | Export content analytics (CSV/PDF) | Required |
| GET | `/api/export/events` | Export event data (CSV/PDF) | Required |
| GET | `/api/export/campaigns` | Export campaign data (CSV/PDF) | Required |

---

## 7. Integration Architecture

### 7.1 Module Dependencies

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     ANALYTICS & INTELLIGENCE                                │
│                                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│  │ Content │ │ Revenue │ │ Events  │ │ Journey │ │Campaign │            │
│  │ Perf.   │ │ Intel.  │ │ Anal.   │ │ Anal.   │ │ ROI     │            │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘            │
│       │           │           │           │           │                     │
│       ▼           ▼           ▼           ▼           ▼                     │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │                   ANALYTICS CORE ENGINE                       │          │
│  │  (Aggregation, Calculation, Real-time, Alerting)              │          │
│  └──────┬──────────┬──────────┬──────────┬──────────┬──────────┘          │
│         │          │          │          │          │                        │
│    ┌────▼───┐ ┌────▼───┐ ┌───▼────┐ ┌───▼────┐ ┌───▼─────┐              │
│    │  AI    │ │REPORTS │ │ ALERTS │ │ AGENTS │ │ MARKET  │              │
│    │REPORTS │ │SCHED.  │ │ENGINE  │ │MONITOR │ │INTELLIG.│              │
│    └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬─────┘              │
│        │          │          │          │          │                        │
└────────┼──────────┼──────────┼──────────┼──────────┼────────────────────────┘
         │          │          │          │          │
    ┌────▼────┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐ ┌───▼────┐
    │DEEPSEEK │ │FEISHU │ │FEISHU │ │AGENT  │ │EXTERNAL│
    │API      │ │EMAIL  │ │NOTIFY │ │SYSTEMS│ │SOURCES │
    └─────────┘ └───────┘ └───────┘ └───────┘ └────────┘

DATA SOURCES (read from all modules):
├── Page 1: Dashboard (KPI targets, status flags)
├── Page 2: Content Calendar (content production data)
├── Page 3: Template Library (template usage data)
├── Page 4: Distribution Engine (views, engagement, clicks)
├── Page 5: B2C Journey Engine (conversion, cross-sell data)
├── Page 6: Content Repurposing (multiplication, derivative data)
├── Page 7: Events & Registration (revenue, attendance, leads)
├── Module 9: Pricing & Product Catalog (revenue, validation, pricing)
└── Infrastructure: contacts, companies, campaigns
```

### 7.2 Data Flow

1. **All modules** write operational data to Supabase (content, events, registrations, revenue, journeys)
2. **Analytics engine** reads from all tables → aggregates into snapshots and views
3. **Real-time updates**: Supabase Realtime pushes changes to dashboard UI
4. **AI reports**: DeepSeek analyzes aggregated data → generates insights and recommendations
5. **Alerts engine**: Compares metrics against thresholds → triggers notifications
6. **Scheduled reports**: Cron job generates reports → sends via Feishu/email
7. **Agent monitoring**: Agent actions logged → status dashboard shows real-time
8. **Market intelligence**: External signals ingested → correlated with internal data

---

## 8. AI Features

### 8.1 AI Personas

**Revenue Analyst**
- Model: `deepseek-pro` (temperature 0.3)
- Frequency: Daily (morning brief) + on-demand
- Input: Revenue data, pricing validation, phase status, pipeline
- Output: Revenue summary, anomalies, recommendations
- Example: "Revenue MTD ¥42K (70% of target). At current pace, you'll hit ¥58K. To close the gap: prioritize 2 BRIDGE diagnostic demos this week (¥15-25K each). Workshop conversion is strong — consider adding one more session."

**Content Strategist**
- Model: `deepseek-pro` (temperature 0.4)
- Frequency: Weekly
- Input: Content performance data, channel metrics, audience engagement
- Output: Content recommendations, channel optimization, topic suggestions
- Example: "LinkedIn posts about AI leadership outperform other topics 3x. Webinar-to-derivative pipeline has highest ROI (89 leads from 1 source). Recommendation: 2 webinars/month + LinkedIn series on AI leadership."

**Pricing Advisor**
- Model: `deepseek-pro` (temperature 0.3)
- Frequency: Weekly + on pricing changes
- Input: Validation data, sales data, discount patterns, phase status
- Output: Price recommendations, validation status, phase transitions
- Example: "BRIDGE has 5 offers, 0 full-price sales. Two options: (1) Drop to ¥6K-15K range, or (2) Bundle with Workshop (perceived value increases). Recommend option 2 — preserves price positioning."

**Campaign Optimizer**
- Model: `deepseek-flash` (temperature 0.4)
- Frequency: Per campaign (mid-point and post-mortem)
- Input: Campaign cost, revenue, channel performance, content performance
- Output: ROI analysis, channel optimization, budget reallocation
- Example: "PRISM Launch: ¥12K spend, ¥89K revenue, 642% ROI. Best channel: LinkedIn (42% of leads). Worst: WeChat (3% of leads, highest cost per lead). Recommendation: Shift 30% of WeChat budget to LinkedIn for next campaign."

**Churn Risk Detector**
- Model: `deepseek-flash` (temperature 0.3)
- Frequency: Weekly
- Input: Customer activity, engagement data, time since last interaction
- Output: At-risk customers, recommended interventions
- Example: "3 Council members haven't engaged in 60+ days. Recommend: personal check-in from Kevin + invite to next exclusive event."

### 8.2 AI Report Templates

| Report | Frequency | Sections | Delivery |
|--------|-----------|----------|----------|
| Morning Revenue Brief | Daily (9 AM) | Revenue MTD, deals closed, pipeline, alerts | Feishu → Kevin |
| Weekly Content Report | Weekly (Wed 10 AM) | Content published, performance, recommendations | Feishu → Echo |
| Weekly Revenue Report | Weekly (Mon 9 AM) | Revenue by tier, product, validation, AI recs | Feishu → Kevin |
| Monthly Comprehensive | Monthly (1st, 10 AM) | All metrics, trends, AI analysis, next month plan | Feishu + Email → All |
| Campaign Post-Mortem | Per campaign | Cost, revenue, ROI, channel breakdown, learnings | Feishu → Kevin + Echo |
| Pricing Validation Update | Weekly | Per-product validation status, recommendations | Feishu → Kevin |
| Event Performance Summary | Per event | Attendance, revenue, lead quality, conversion | Feishu → Carl |

---

## 9. Background Jobs

| Job | Frequency | Description |
|-----|-----------|-------------|
| `aggregate_daily_snapshots` | Daily (midnight) | Calculate daily metrics → store in analytics_snapshots |
| `aggregate_weekly_snapshots` | Weekly (Monday 1 AM) | Weekly rollup |
| `aggregate_monthly_snapshots` | Monthly (1st, 1 AM) | Monthly rollup |
| `check_alerts` | Every 15 min | Compare metrics against alert thresholds |
| `generate_scheduled_reports` | Every hour | Check if any reports are due → generate and send |
| `update_revenue_summary` | Every 30 min | Refresh revenue views |
| `update_content_performance` | Every hour | Refresh content metrics |
| `update_funnel_metrics` | Every hour | Refresh funnel data |
| `ingest_market_signals` | Every 6 hours | Pull external signals (RSS, APIs) |
| `agent_health_check` | Every 5 min | Check agent status, detect errors |
| `cleanup_old_logs` | Weekly | Archive logs older than retention period |
| `anomaly_detection` | Daily | AI scans for unusual patterns |

---

## 10. Ticket List

### 10.1 Data Infrastructure (ANA-001 to ANA-008)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| ANA-001 | Analytics tables schema + Supabase migration | 4h | P0 | INFRA-100 |
| ANA-002 | Analytics snapshots aggregation engine | 5h | P0 | ANA-001 |
| ANA-003 | Supabase views (revenue_summary, content_performance, funnel_metrics) | 3h | P0 | ANA-001 |
| ANA-004 | Supabase Realtime subscriptions (all dashboards) | 4h | P0 | ANA-001 |
| ANA-005 | Background jobs: daily/weekly/monthly snapshots | 4h | P0 | ANA-002 |
| ANA-006 | Data retention policy implementation | 2h | P2 | ANA-001 |
| ANA-007 | Analytics API endpoints (overview, revenue, content, events, journeys) | 6h | P0 | ANA-003 |
| ANA-008 | Data export engine (CSV/PDF generation) | 4h | P1 | ANA-007 |

### 10.2 Overview Dashboard (ANA-009 to ANA-014)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| ANA-009 | Overview dashboard UI (KPI cards, revenue by tier, alerts) | 5h | P0 | ANA-007 |
| ANA-010 | KPI scorecards (per-role views: Kevin, Echo, Carl, Maria) | 4h | P1 | ANA-009 |
| ANA-011 | Alerts engine (threshold config, trigger, notification) | 5h | P1 | ANA-007 |
| ANA-012 | Alerts UI (list, acknowledge, resolve) | 3h | P1 | ANA-011 |
| ANA-013 | Benchmarking (WoW, MoM, QoQ comparisons) | 3h | P1 | ANA-009 |
| ANA-014 | Anomaly detection (AI-driven unusual pattern flagging) | 4h | P2 | ANA-009 |

### 10.3 Revenue Intelligence (ANA-015 to ANA-023)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| ANA-015 | Revenue dashboard UI (by tier, product, bundle, time) | 5h | P0 | ANA-007 |
| ANA-016 | Revenue by tier breakdown (chart + table) | 3h | P0 | ANA-015 |
| ANA-017 | Revenue by product ranking (top 10, with validation status) | 3h | P0 | ANA-015 |
| ANA-018 | Revenue by bundle (bundle revenue, component attribution) | 3h | P1 | ANA-015 |
| ANA-019 | Cross-sell attribution tracking (which rule drove revenue) | 3h | P1 | ANA-015 |
| ANA-020 | Discount depth analysis (how much discount given, by rule) | 2h | P1 | ANA-015 |
| ANA-021 | Revenue by phase (which phase generated what) | 2h | P1 | ANA-015 |
| ANA-022 | Revenue by customer (top customers, LTV) | 3h | P1 | ANA-015 |
| ANA-023 | Revenue forecasting (AI-driven projection) | 4h | P2 | ANA-015 |

### 10.4 Pricing Validation (ANA-024 to ANA-028)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| ANA-024 | Pricing validation dashboard UI | 4h | P0 | ANA-015 |
| ANA-025 | Validation status per product (validated/testing/not validated) | 3h | P0 | ANA-024 |
| ANA-026 | AI pricing recommendations (drop tier, bundle, keep testing) | 4h | P1 | ANA-025 |
| ANA-027 | Price history tracking (what was offered, what sold) | 3h | P1 | ANA-025 |
| ANA-028 | Phase transition alerts (when to move from Prove → Scale) | 2h | P1 | ANA-026 |

### 10.5 Content Performance (ANA-029 to ANA-036)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| ANA-029 | Content performance dashboard UI | 5h | P0 | ANA-007 |
| ANA-030 | Content by channel breakdown (views, engagement, conversion) | 3h | P0 | ANA-029 |
| ANA-031 | Content by type breakdown | 2h | P1 | ANA-029 |
| ANA-032 | Top performers ranking (by views, by conversion) | 2h | P1 | ANA-029 |
| ANA-033 | Content → tier conversion tracking (which content drives which tier) | 3h | P1 | ANA-030 |
| ANA-034 | Content cost per lead calculation | 2h | P1 | ANA-030 |
| ANA-035 | Content trend analysis (what's improving, what's declining) | 3h | P2 | ANA-029 |
| ANA-036 | AI content recommendations (topics, channels, formats) | 4h | P2 | ANA-029 |

### 10.6 Event Analytics (ANA-037 to ANA-043)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| ANA-037 | Event analytics dashboard UI | 4h | P0 | ANA-007 |
| ANA-038 | Event revenue breakdown (by type, by tier) | 3h | P0 | ANA-037 |
| ANA-039 | Attendance rate tracking (registered vs checked-in) | 2h | P0 | ANA-037 |
| ANA-040 | Lead quality analytics (score distribution, B2B signals) | 3h | P1 | ANA-037 |
| ANA-041 | Event → next tier conversion (workshop → diagnostic, etc.) | 3h | P1 | ANA-040 |
| ANA-042 | Event ROI calculator (revenue vs cost, per event) | 3h | P1 | ANA-038 |
| ANA-043 | Event benchmarking (compare event to similar past events) | 3h | P2 | ANA-037 |

### 10.7 Journey & Funnel Analytics (ANA-044 to ANA-050)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| ANA-044 | Journey conversion dashboard UI (step-by-step) | 5h | P0 | ANA-007 |
| ANA-045 | Funnel visualization (content → lead → registration → purchase) | 4h | P0 | ANA-044 |
| ANA-046 | Drop-off analysis (where do leads leave?) | 3h | P1 | ANA-044 |
| ANA-047 | Cross-sell conversion tracking (by rule) | 3h | P1 | ANA-044 |
| ANA-048 | Journey ROI (revenue generated per journey step) | 3h | P1 | ANA-044 |
| ANA-049 | Cohort analysis (track groups by registration month) | 4h | P2 | ANA-044 |
| ANA-050 | Attribution tracking (multi-touch: which content/event drove sale) | 4h | P1 | ANA-044 |

### 10.8 Campaign ROI (ANA-051 to ANA-056)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| ANA-051 | Campaigns table + CRUD API | 3h | P0 | ANA-001 |
| ANA-052 | Campaign ROI dashboard UI | 4h | P0 | ANA-051 |
| ANA-053 | Campaign cost tracking (content time + tools + events + ads) | 3h | P1 | ANA-052 |
| ANA-054 | Campaign revenue attribution (which revenue came from campaign) | 3h | P1 | ANA-053 |
| ANA-055 | Campaign channel breakdown (which channel performed best) | 2h | P1 | ANA-052 |
| ANA-056 | AI campaign optimizer (mid-point + post-mortem analysis) | 4h | P2 | ANA-054 |

### 10.9 Repurposing ROI (ANA-057 to ANA-060)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| ANA-057 | Repurposing ROI dashboard (multiplication, cost per derivative) | 4h | P1 | ANA-007 |
| ANA-058 | Source multiplication metrics (1 source → N derivatives → total reach) | 3h | P1 | ANA-057 |
| ANA-059 | Engagement per derivative type (which format performs best) | 2h | P1 | ANA-057 |
| ANA-060 | AI repurposing recommendations (best source types, best formats) | 3h | P2 | ANA-057 |

### 10.10 Email Metrics (ANA-061 to ANA-064)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| ANA-061 | Email metrics dashboard (open rate, click rate, conversion) | 4h | P1 | ANA-007 |
| ANA-062 | Email by sequence type (confirmation, reminder, nurture, cross-sell) | 2h | P1 | ANA-061 |
| ANA-063 | Email → journey conversion (which emails drive actions) | 3h | P1 | ANA-061 |
| ANA-064 | Email deliverability tracking (bounce, spam, unsubscribe) | 2h | P2 | ANA-061 |

### 10.11 AI Report Generation (ANA-065 to ANA-073)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| ANA-065 | AI report generation engine (DeepSeek integration) | 5h | P1 | ANA-007 |
| ANA-066 | Morning Revenue Brief template (daily, 9 AM) | 3h | P1 | ANA-065 |
| ANA-067 | Weekly Content Report template | 3h | P1 | ANA-065 |
| ANA-068 | Weekly Revenue Report template | 3h | P1 | ANA-065 |
| ANA-069 | Monthly Comprehensive Report template | 4h | P1 | ANA-065 |
| ANA-070 | Campaign Post-Mortem template | 3h | P1 | ANA-065 |
| ANA-071 | Pricing Validation Update template | 2h | P1 | ANA-065 |
| ANA-072 | Event Performance Summary template | 2h | P1 | ANA-065 |
| ANA-073 | On-demand report generation (user triggers any report) | 3h | P1 | ANA-065 |

### 10.12 Scheduled Reports & Delivery (ANA-074 to ANA-078)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| ANA-074 | Report schedules table + CRUD | 2h | P1 | ANA-001 |
| ANA-075 | Scheduled report generation job (cron) | 3h | P1 | ANA-074 |
| ANA-076 | Report delivery via Feishu | 3h | P1 | ANA-075 |
| ANA-077 | Report delivery via Email | 2h | P1 | ANA-075 |
| ANA-078 | Report schedule management UI | 3h | P2 | ANA-074 |

### 10.13 Agent Monitoring (ANA-079 to ANA-086)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| ANA-079 | Agent logs table + API | 3h | P0 | ANA-001 |
| ANA-080 | Agent status display UI (online/offline, last action) | 3h | P0 | ANA-079 |
| ANA-081 | Agent action log UI (filterable table) | 3h | P1 | ANA-079 |
| ANA-082 | Agent success rate tracking | 2h | P1 | ANA-080 |
| ANA-083 | Agent error tracking + alerting | 3h | P1 | ANA-081 |
| ANA-084 | Agent trigger API routes (Echo publish, Maria send, Carl create) | 4h | P0 | ANA-079 |
| ANA-085 | Agent health check job (every 5 min) | 2h | P0 | ANA-080 |
| ANA-086 | Agent audit trail export | 2h | P2 | ANA-081 |

### 10.14 Market Intelligence (ANA-087 to ANA-091)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| ANA-087 | Market signals table + API | 3h | P2 | ANA-001 |
| ANA-088 | Market signal ingestion job (RSS, APIs, news) | 4h | P2 | ANA-087 |
| ANA-089 | Market signals dashboard UI | 3h | P2 | ANA-087 |
| ANA-090 | Signal → product correlation (which signals affect which products) | 3h | P2 | ANA-089 |
| ANA-091 | AI signal analysis (summarize, recommend action) | 4h | P2 | ANA-089 |

### 10.15 Custom Dashboard & Advanced (ANA-092 to ANA-096)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| ANA-092 | Custom dashboard builder (drag-and-drop widgets) | 6h | P2 | ANA-009 |
| ANA-093 | Widget library (revenue, content, events, journey, KPI, chart) | 4h | P2 | ANA-092 |
| ANA-094 | Dashboard layout persistence (save/load per user) | 3h | P2 | ANA-092 |
| ANA-095 | Predictive intelligence (AI revenue projection, churn risk) | 5h | P2 | ANA-007 |
| ANA-096 | External API for BI tools | 3h | P2 | ANA-007 |

### 10.16 Retrofit & Integration (ANA-097 to ANA-098)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| ANA-097 | Analytics integration with Dashboard (Page 1 KPI widgets) | 3h | P1 | ANA-009, DASH-020 |
| ANA-098 | Analytics data feed to all module dashboards | 3h | P1 | ANA-007 |

---

## 11. Effort Summary

| Section | Tickets | Effort |
|---------|---------|--------|
| 10.1 Data Infrastructure | 8 | 32h |
| 10.2 Overview Dashboard | 6 | 24h |
| 10.3 Revenue Intelligence | 9 | 27h |
| 10.4 Pricing Validation | 5 | 14h |
| 10.5 Content Performance | 8 | 23h |
| 10.6 Event Analytics | 7 | 21h |
| 10.7 Journey & Funnel Analytics | 7 | 24h |
| 10.8 Campaign ROI | 6 | 19h |
| 10.9 Repurposing ROI | 4 | 12h |
| 10.10 Email Metrics | 4 | 10h |
| 10.11 AI Report Generation | 9 | 26h |
| 10.12 Scheduled Reports & Delivery | 5 | 13h |
| 10.13 Agent Monitoring | 8 | 22h |
| 10.14 Market Intelligence | 5 | 17h |
| 10.15 Custom Dashboard & Advanced | 5 | 21h |
| 10.16 Retrofit & Integration | 2 | 6h |
| **TOTAL** | **98** | **311h** |

*Note: Revised from initial estimate. 98 tickets covering all analytics, intelligence, AI reports, agent monitoring, and market intelligence.*

---

## 12. Updated Grand Total

| Module | Tickets | Effort |
|--------|---------|--------|
| Module 1: Dashboard (Page 1) | 36 | 126h |
| Module 2: Content Calendar (Page 2) | 42 | 175h |
| Module 3: Template & Asset Library (Page 3) | 66 | 190h |
| Module 4: Distribution Engine (Page 4) | 66 | 218h |
| Module 5: B2C Journey Engine (Page 5) | 92 | 242h |
| Module 6: Content Repurposing (Page 6) | 78 | 210h |
| Module 7: Events & Registration (Page 7) | 102 | 275h |
| **Module 8: Analytics & Intelligence (Page 8)** | **98** | **311h** |
| Module 9: Pricing & Product Catalog | 78 | 261h |
| Cross-Page Infrastructure | 13 | 80h |
| Per-Page Retrofit (est.) | 36 | 154h |
| **GRAND TOTAL** | **707** | **2,242h** |

*All 9 page/module specs complete. Remaining work: per-page retrofit tickets (36 tickets, 154h) to integrate infrastructure components + product catalog across all pages.*
