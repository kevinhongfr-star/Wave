# WAVE Business Spec — Page 7: Events & Registration (EXPANDED)

**Version:** 2.1 | **Date:** 2026-07-12 | **Status:** Draft for Kevin Review
**Supersedes:** TICKET-062 through TICKET-071 (existing v1.0 — 10 tickets, ~36h)
**Builds on:** Content Calendar (Page 2), Distribution Engine (Page 4), B2C Journey Engine (Page 5), Pricing & Product Catalog (Module 9)
**New tickets:** EVT-001 through EVT-072
**Total effort:** 228h (up from ~36h)
**Integrates:** 12 Audit Criteria (C1-C12) + Infrastructure Components (INFRA-100 to INFRA-112)
**Depends on:** Module 9 product catalog (event pricing pulls from products table, discount engine, capacity tracking)

---

## 1. Purpose

The Events & Registration module is WAVE's revenue-generating event infrastructure. It answers:

1. **"What events are we running?"** — Full event CRUD with types, templates, and recurring series
2. **"How do people register and pay?"** — Registration form builder + CNY payment integration (Stripe + WeChat Pay)
3. **"What does it cost?"** — Tiered pricing (early-bird, regular, VIP, founding member) pulled from product catalog
4. **"How full is it?"** — Real-time capacity tracking with waitlist management
5. **"Who signed up?"** — Lead collection, auto-scoring, B2B signal detection
6. **"What happens after?"** — Automated confirmations, reminders, post-event journeys, cross-sell triggers
7. **"Was it worth it?"** — Event ROI: revenue, attendance rate, conversion to next tier, lead quality

It must feel like **Calendly's booking flow + Eventbrite's registration + Notion's form builder** — not a clunky enterprise event management system.

**Current state (what exists today):**
- Basic event creation form (title, date, description)
- Static registration form builder (no conditional logic, no pricing tiers)
- Stripe integration (USD only, no WeChat Pay, no discount logic)
- Simple email reminders (no sequence, no Feishu integration)
- Registration list view (no scoring, no B2B signal detection)
- No capacity tracking
- No waitlist
- No tiered pricing
- No Council-specific features
- No product catalog integration
- No post-event journey automation

**Expansion scope (what this spec adds):**

| Area | Current | Expanded |
|------|---------|----------|
| Event types | Generic "event" | 8 types: workshop, webinar, Council meeting, diagnostic presentation, networking, masterclass, assessment session, custom |
| Registration forms | Basic fields | 20+ field types, conditional logic, custom branding, multi-step forms |
| Pricing | None | Tiered: early-bird, regular, VIP, founding member, multi-seat — from product catalog |
| Payments | Stripe USD | Stripe CNY + WeChat Pay + invoice generation + refund handling |
| Capacity | None | Real-time seats tracking, waitlist, sold-out display, "X/Y spots filled" |
| Discounts | None | Integrated with Module 9 discount engine: early-bird 15%, founding 40-50%, Council founding 20% |
| Reminders | Single email | Multi-channel sequence: email + Feishu + SMS, with countdown (7d, 3d, 1d, 1h) |
| Lead scoring | Basic | Auto-score from registration data: company size, role, source, product history |
| B2B signals | None | Detect: PE affiliation, C-suite title, multi-registrant from same company |
| Post-event | None | Automated journey: thank you → recording → cross-sell → next event invite |
| Council events | None | Tier selection (Individual/Corporate/PE), capacity per tier (60/10/5), founding member tracking |
| Templates | None | Pre-built: workshop template, webinar template, Council meeting template, diagnostic presentation |
| Analytics | None | Revenue, attendance rate, conversion rate, lead quality, cost per registration, ROI |
| Embed | Basic | Embeddable registration form, social sharing with UTM tracking, custom landing pages |
| Recurring | None | Recurring event series (weekly webinar, monthly workshop, quarterly Council) |
| AI features | None | Optimal pricing suggestion, attendee matching, post-event follow-up personalization |

---

## 2. Business Requirements

### 2.1 Functional Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-1 | Create event with full metadata: type, title, description, date/time, location, capacity, pricing | P0 | Links to product in catalog |
| FR-2 | 8 event types with type-specific fields | P0 | Workshop has facilitator, webinar has platform link, Council has tier capacity |
| FR-3 | Registration form builder: 20+ field types, conditional logic, multi-step | P0 | Notion-style block editing |
| FR-4 | Public registration page: mobile-responsive, pricing tiers, capacity indicator | P0 | Custom URL: wave.lyc-partners.ai/event/{slug} |
| FR-5 | Tiered pricing: early-bird, regular, VIP, founding member — from product catalog | P0 | Auto-calculated from discount rules |
| FR-6 | Payment integration: Stripe CNY + WeChat Pay | P0 | Invoice generation, refund handling |
| FR-7 | Capacity management: real-time seats, waitlist, sold-out | P0 | "42/60 spots filled" |
| FR-8 | Discount engine integration: apply discount rules from Module 9 | P0 | Never-discount enforcement |
| FR-9 | Confirmation sequence: email + Feishu + calendar invite | P0 | Immediately on registration |
| FR-10 | Reminder sequence: 7d, 3d, 1d, 1h before event | P1 | Multi-channel, customizable |
| FR-11 | Registration management: list, check-in, edit, cancel, refund | P0 | Inline editing, bulk actions |
| FR-12 | Lead scoring: auto-score from registration data | P1 | Integrates with B2C Journey Engine |
| FR-13 | B2B signal detection: PE affiliation, C-suite, multi-registrant | P1 | Triggers B2B journey |
| FR-14 | Post-event automation: thank you → recording → cross-sell → next event | P1 | Configurable per event type |
| FR-15 | Event templates: pre-built for common event types | P1 | Clone and customize |
| FR-16 | Recurring events: series support (weekly, monthly, quarterly) | P2 | Auto-create instances |
| FR-17 | Embeddable registration form: iframe + JS snippet | P1 | For website, WeChat articles |
| FR-18 | Social sharing: shareable link with UTM tracking | P1 | Track registrations by source |
| FR-19 | Event analytics: revenue, attendance, conversion, ROI | P1 | Per event and aggregate |
| FR-20 | Council-specific: tier selection, per-tier capacity, founding member tracking | P0 | Individual/Corporate/PE |
| FR-21 | Multi-seat registration: register 3+ people at once with group discount | P1 | Auto-apply multi-product discount |
| FR-22 | Waitlist management: auto-promote when spots open | P1 | Configurable promotion rules |
| FR-23 | Custom registration fields per event: dietary, accessibility, pre-event survey | P2 | Conditional on event type |
| FR-24 | Event-specific product linking: event sells a product (workshop → product catalog) | P0 | Revenue tracks to product |
| FR-25 | AI pricing suggestion: based on similar past events, suggest optimal price | P2 | DeepSeek analysis |
| FR-26 | Attendee matching: suggest connections between attendees (for networking) | P2 | Based on industry, role |
| FR-27 | Post-event survey: auto-generate and send | P2 | NPS, feedback, next steps |
| FR-28 | Certificate generation: attendance certificates for workshops | P2 | Branded, auto-sent |
| FR-29 | Sponsor/co-host management: add sponsors to event page | P2 | Logo, link, description |
| FR-30 | Live polling/Q&A integration: embed interactive features | P2 | For workshops and webinars |

### 2.2 Event Types & Type-Specific Configuration

| Type | Duration | Capacity Range | Pricing Model | Type-Specific Fields |
|------|----------|---------------|---------------|---------------------|
| Workshop | 2-3h online / half-day | 10-50 | Tiered (early-bird/regular/VIP) | Facilitator, materials, hands-on exercises |
| Webinar | 45-60 min | 50-500 | Free or low-ticket | Platform link, recording toggle, Q&A |
| Council Meeting | 2-3h | 60 (Individual), 10 (Corporate), 5 (PE) | Membership (annual) | Tier capacity, agenda, Chatham House Rule |
| Diagnostic Presentation | 60-90 min | 5-20 | Included in diagnostic | Presenter, findings deck, follow-up actions |
| Networking | 2-3h | 20-80 | Free (members) or tiered | Venue, dress code, matching preferences |
| Masterclass | 3-4h / multi-session | 15-30 | Premium (high-ticket) | Instructor, curriculum, prerequisites |
| Assessment Session | 60-120 min | 1-10 | Per-seat (METRIX) | Assessment type, facilitator, debrief |
| Custom | Any | Any | Any | Fully configurable |

### 2.3 Pricing Architecture

**Event pricing pulls from product catalog (Module 9):**

| Product | Event Type | Base Price | Early-Bird (15% off) | VIP (1.5x) | Founding (40-50% off) |
|---------|-----------|-----------|---------------------|-----------|----------------------|
| Workshop (online 2-3h) | Workshop | ¥3,000 | ¥2,550 | ¥4,500 | ¥1,500-1,800 |
| Workshop (half-day) | Workshop | ¥6,000 | ¥5,100 | ¥9,000 | ¥3,000-3,600 |
| Monthly Webinar | Webinar | ¥0 (free) | N/A | N/A | N/A |
| Council Annual (Individual) | Council Meeting | ¥12,000/yr | N/A | N/A | ¥9,600 (founding 20%) |
| Council Annual (Corporate) | Council Meeting | ¥30,000/yr | N/A | N/A | ¥24,000 (founding 20%) |
| Council Annual (PE Partner) | Council Meeting | ¥50,000/yr | N/A | N/A | After founding: never discount |
| METRIX Assessment | Assessment | ¥200-500 | ¥170-425 | N/A | N/A |
| Masterclass (single) | Masterclass | ¥5,000-8,000 | ¥4,250-6,800 | ¥7,500-12,000 | N/A |
| Diagnostic Presentation | Diagnostic | ¥0 (included) | N/A | N/A | N/A |
| Networking (members) | Networking | ¥0 | N/A | N/A | N/A |
| Networking (non-members) | Networking | ¥500 | ¥425 | N/A | N/A |

**Pricing rules (from Module 9 discount engine):**

| Rule | Trigger | Discount | Applied To | Never If |
|------|---------|----------|-----------|----------|
| `early_bird` | Registration 14+ days before | 15% off | All paid events | Product has `never_discount=true` |
| `founding_client` | First 3 registrations for new event type | 40-50% off | Workshops, masterclasses | Never-discount products |
| `council_founding` | First 30 Council members | 20% off first year | Council tiers | PE after 5 filled |
| `multi_seat` | 3+ seats in one registration | 10% off total | Workshops, masterclasses | — |
| `bundle_event` | Event + product bundle | Per-bundle discount | Council+Workshop bundle | — |

**Capacity limits (from product catalog):**

| Event/Product | Total Capacity | Per-Tier Limits |
|---------------|---------------|-----------------|
| Council Individual | 60 members | 60 |
| Council Corporate | 10 companies | 10 |
| Council PE Partner | 5 PE firms | 5 |
| Workshop (online) | 50 seats | — |
| Workshop (half-day) | 30 seats | — |
| Masterclass | 20 seats | — |
| Assessment Session | 10 seats | — |
| Networking | 80 seats | — |
| Webinar | 500 seats | — |

---

## 3. User Requirements

### 3.1 User Roles & Permissions

| Role | Event CRUD | Form Builder | Pricing Config | Registration View | Check-in | Analytics | Discount Override |
|------|-----------|-------------|----------------|-------------------|----------|-----------|-------------------|
| Kevin (CTO) | Full | Full | Full | Full | Full | Full | Full |
| Carl (Events) | Full | Full | Read (events) | Full | Full | Full | Event discounts only |
| Echo (Content) | Read | Read | None | Own events | Own events | Read | None |
| Maria (Email) | Read | Read | None | Read | None | Read | None |
| NEXUS (PM) | Full | Full | Full | Full | Full | Full | Kevin approval required |
| Xuemei (Scripts) | Read | None | None | Read | None | None | None |

### 3.2 Key User Flows

**Flow 1: Create a workshop event**
1. Navigate to Events → "New Event" → select "Workshop"
2. Fill: title, date/time, duration, location (online/in-person/hybrid)
3. Link to product catalog: select "Workshop (online 2-3h)" → auto-loads pricing (¥3,000 base)
4. Configure pricing tiers: early-bird (¥2,550, deadline 14 days before), regular (¥3,000), VIP (¥4,500, includes 1:1 follow-up)
5. Set capacity: 50 seats → system shows real-time counter
6. Build registration form: drag fields (name, email, company, role, dietary needs, "What do you want to learn?")
7. Configure confirmation sequence: email + Feishu + calendar invite
8. Configure reminder sequence: 7d, 3d, 1d, 1h
9. Configure post-event automation: thank you email → recording link → cross-sell diagnostic
10. Save → event goes live, public registration page created at `/event/{slug}`

**Flow 2: Manage Council registration**
1. Navigate to Events → "Council Annual Meeting" → select "Council Meeting"
2. System auto-loads 3-tier capacity: Individual (60), Corporate (10), PE (5)
3. Real-time display: "42/60 Individual | 7/10 Corporate | 3/5 PE"
4. PE tier shows "SOLD OUT" when 5/5 filled → waitlist only
5. Registration form includes tier selection dropdown
6. Pricing pulled from product catalog: ¥12K/¥30K/¥50K
7. Founding member discount auto-applied if within first 30 members
8. After registration: member receives welcome kit email + calendar invite + onboarding journey

**Flow 3: Registration day check-in**
1. Navigate to Event → Registrations → Check-in view
2. Search by name or scan QR code
3. Mark as checked in → system logs time
4. Walk-in registration: quick form (name, email, company) → auto-create + check-in
5. No-show tracking: compare registered vs checked-in

**Flow 4: Post-event lead processing**
1. Event ends → system auto-triggers post-event journey
2. Attendees scored: role (C-suite +20, VP +15, Manager +5), company size (500+ +10, 1000+ +20), engagement (asked questions +10, stayed full duration +5)
3. B2B signals detected: PE affiliation → flag for Kevin, multi-registrant from same company → flag for Carl
4. Cross-sell rules triggered: attended workshop → suggest diagnostic (within 14 days), attended diagnostic presentation → suggest booking diagnostic
5. Journey engine creates personalized follow-up sequences per lead score tier

**Flow 5: Embed registration on website**
1. Navigate to Event → Share → "Embed Form"
2. Copy iframe code or JS snippet
3. Paste into website (Valentina manages website)
4. Registrations via embed auto-tagged with source `website_embed`
5. Track conversion: page views → form opens → registrations completed

---

## 4. UX Requirements

### 4.1 Events List View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Events                                              [+ New Event]          │
├─────────────────────────────────────────────────────────────────────────────┤
│  [All] [Upcoming] [Past] [Draft] [Workshop] [Webinar] [Council] [Master]   │
│  [Search: ____________________] [Date Range: ____ to ____]                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🟢 AI Leadership Workshop                     Jul 19, 14:00        │   │
│  │    Workshop | Online | 32/50 seats  ▓▓▓▓▓▓▓▓░░ 64%               │   │
│  │    ¥3,000 (early-bird ¥2,550 until Jul 5)  |  Revenue: ¥76,800    │   │
│  │    [Manage] [Registrations (32)] [Analytics] [Edit]                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🔵 Council Q3 Meeting                         Jul 25, 15:00        │   │
│  │    Council | Shanghai | Ind: 42/60 | Corp: 7/10 | PE: 3/5         │   │
│  │    ¥12K-50K/yr  |  Revenue: ¥864,000  |  52 members               │   │
│  │    [Manage] [Members (52)] [Analytics] [Edit]                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🟡 Monthly Webinar: China Talent Outlook       Aug 2, 19:00       │   │
│  │    Webinar | Online | 128/500 registered  ▓▓▓░░░░░░░ 26%          │   │
│  │    Free  |  Revenue: ¥0  |  Lead gen event                        │   │
│  │    [Manage] [Registrations (128)] [Analytics] [Edit]               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ⚪ BRIDGE Diagnostic Presentation (Chen Corp)   Jul 15, 10:00     │   │
│  │    Diagnostic | Online | 8/20 registered                            │   │
│  │    Included in diagnostic  |  Revenue: ¥0 (already billed)         │   │
│  │    [Manage] [Attendees (8)] [Edit]                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Event Creation — Multi-Step Builder

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  New Event                                                    Step 2 of 5   │
│  [● Basics] [○ Pricing] [● Form] [○ Automation] [○ Publish]               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  EVENT BASICS                                                                │
│                                                                              │
│  Type:          [Workshop ▼] (workshop | webinar | council | diagnostic |   │
│                               networking | masterclass | assessment | custom)│
│                                                                              │
│  Title:         [AI Leadership Workshop — Shanghai             ] (inline)    │
│  Description:   [Half-day intensive workshop on AI leadership... ] (block)   │
│                                                                              │
│  Date:          [July 19, 2026]   Time: [14:00 - 17:00]                     │
│  Location:      [Online — Zoom ▼]   Address: [Zoom link auto-generated]     │
│                                                                              │
│  Linked Product: [Workshop (online, half-day intensive) ▼]                  │
│                   → Auto-loads: ¥6,000 base, capacity 30                     │
│                                                                              │
│  FACILITATOR                                                                 │
│  Name:          [Kevin Hong ▼]   Role: [Lead Facilitator]                    │
│  Bio:           [Pulls from team_member profile — editable inline]           │
│                                                                              │
│  MATERIALS                                                                   │
│  [+ Add Material] — PDF, slide deck, pre-read, workbook                      │
│  └── AI_Leadership_Workbook.pdf (attached)                                   │
│  └── Pre-read: Chapter 3 of "AI Leadership" (link)                          │
│                                                                              │
│  [← Back]                                                      [Next: Pricing →] │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Pricing Configuration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Pricing — AI Leadership Workshop                             Step 2 of 5   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  BASE PRICE (from product catalog)                                           │
│  Product: Workshop (online, half-day intensive)                              │
│  Base:    ¥6,000                                                             │
│  [Override: ______] (only if this event has different pricing)               │
│                                                                              │
│  PRICING TIQUES                                                               │
│  ┌──────────────┬────────────┬──────────────┬─────────────┐                │
│  │ Early-Bird   │ Regular    │ VIP          │ Founding    │                │
│  │ ¥5,100       │ ¥6,000     │ ¥9,000       │ ¥3,000      │                │
│  │ (15% off)    │ (base)     │ (1.5x)       │ (50% off)   │                │
│  │ Until Jul 5  │ After Jul 5│ + 1:1 debrief│ First 3     │                │
│  │ [Edit]       │ [Edit]     │ [Edit]       │ [Edit]      │                │
│  └──────────────┴────────────┴──────────────┴─────────────┘                │
│                                                                              │
│  DISCOUNT RULES (from Module 9)                                              │
│  ☑ Early-bird: 15% off if registered 14+ days before     [Auto-apply]      │
│  ☑ Founding client: 50% off first 3 registrations        [Auto-apply]      │
│  ☐ Multi-seat: 10% off for 3+ seats from same company    [Manual apply]    │
│  ☐ Bundle: Council+Workshop — 18% off                    [Auto-apply]      │
│                                                                              │
│  NEVER-DISCOUNT CHECK                                                        │
│  ℹ️ Product "Workshop (half-day)" is NOT on never-discount list              │
│  ℹ️ Max discount allowed: 50% (founding client)                             │
│  ⚠️ 1 founding discount remaining (2 of 3 used)                             │
│                                                                              │
│  CAPACITY                                                                    │
│  Total seats: [30]   Waitlist: [☑ Enable]                                   │
│  Seats remaining: 30 (event not yet published)                               │
│  ▓░░░░░░░░░ 0% filled                                                       │
│                                                                              │
│  REVENUE PROJECTION                                                          │
│  If 80% full (24 seats): ¥144,000 - ¥153,000 (mix of tiers)                │
│  Break-even: 8 registrations (¥48,000)                                       │
│                                                                              │
│  [← Back]                                                      [Next: Form →] │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.4 Registration Form Builder

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Registration Form — AI Leadership Workshop                   Step 3 of 5   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  FORM FIELDS (drag to reorder, click to edit)                               │
│                                                                              │
│  ┌─── STEP 1: Basic Information ──────────────────────────────────────┐    │
│  │  📝 Short Text: "Full Name"            [Required] [Inline edit]    │    │
│  │  📧 Email: "Email Address"             [Required]                  │    │
│  │  🏢 Short Text: "Company"              [Required]                  │    │
│  │  💼 Dropdown: "Job Title / Role"       [Required]                  │    │
│  │     Options: C-Suite, VP/Director, Manager, Consultant, Other     │    │
│  │  📱 Phone: "Phone Number"              [Optional]                  │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─── STEP 2: Professional Context ───────────────────────────────────┐    │
│  │  🌍 Dropdown: "Industry"                 [Required]                │    │
│  │  🏗️ Number: "Company Size (employees)"   [Required]                │    │
│  │  🎯 Paragraph: "What's your biggest AI leadership challenge?"      │    │
│  │     [Required]                                                     │    │
│  │  📊 Checkbox Group: "Topics of Interest"  [Optional]               │    │
│  │     ☐ AI Strategy  ☐ Team Building  ☐ Change Management           │    │
│  │     ☐ Ethics & Governance  ☐ ROI Measurement  ☐ Other             │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─── STEP 3: Logistics ──────────────────────────────────────────────┐    │
│  │  🍽️ Dropdown: "Dietary Requirements"   [Conditional: in-person]    │    │
│  │  ♿ Short Text: "Accessibility Needs"   [Optional]                  │    │
│  │  🔗 Dropdown: "How did you hear about us?"  [Required]             │    │
│  │     Options: LinkedIn, Newsletter, Podcast, Referral, Council,    │    │
│  │              Website, Webinar, Other                               │    │
│  │  ☑️ Checkbox: "I agree to receive follow-up communications"        │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  CONDITIONAL LOGIC                                                           │
│  Rule 1: IF "Job Title" contains "C-Suite" → SHOW field "Board Experience" │
│  Rule 2: IF Location = "In-Person" → SHOW "Dietary Requirements"           │
│  Rule 3: IF "Company Size" > 1000 → SHOW "Annual Revenue Range"           │
│  [+ Add Condition]                                                          │
│                                                                              │
│  FORM SETTINGS                                                               │
│  ☑ Multi-step (3 steps)    ☑ Progress bar    ☑ Save & resume              │
│  ☑ Auto-detect company (email domain → company info)                       │
│  ☑ Require business email (no gmail/qq/163)                                │
│                                                                              │
│  [← Back]                                                [Next: Auto →]    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.5 Public Registration Page

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │  AI Leadership Workshop                                               │  │
│  │  Half-Day Intensive — Shanghai                                        │  │
│  │                                                                       │  │
│  │  July 19, 2026 | 14:00 - 17:00 CST | Online (Zoom)                  │  │
│  │  Facilitator: Kevin Hong                                              │  │
│  │                                                                       │  │
│  │  ─────────────────────────────────────────────                        │  │
│  │                                                                       │  │
│  │  PRICING                                                              │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                   │  │
│  │  │ Early-Bird  │  │  Regular    │  │    VIP      │                   │  │
│  │  │  ¥5,100     │  │  ¥6,000     │  │  ¥9,000     │                   │  │
│  │  │ until Jul 5 │  │  after Jul 5│  │  + 1:1 call │                   │  │
│  │  │ [SELECT]    │  │  [SELECT]   │  │  [SELECT]   │                   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                   │  │
│  │                                                                       │  │
│  │  ─────────────────────────────────────────────                        │  │
│  │                                                                       │  │
│  │  CAPACITY                                                             │  │
│  │  32 / 50 seats filled  ▓▓▓▓▓▓▓▓░░ 64%                               │  │
│  │  ⚠️ 18 seats remaining                                               │  │
│  │                                                                       │  │
│  │  ─────────────────────────────────────────────                        │  │
│  │                                                                       │  │
│  │  WHAT YOU'LL LEARN                                                    │  │
│  │  • How to build an AI leadership strategy for your organization       │  │
│  │  • The 5 competencies of AI-era leaders                               │  │
│  │  • Real case studies from China, US, and EU                          │  │
│  │  • A practical framework you can implement Monday morning             │  │
│  │                                                                       │  │
│  │  ─────────────────────────────────────────────                        │  │
│  │                                                                       │  │
│  │  [REGISTER NOW →]                                                    │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.6 Registration Management View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  AI Leadership Workshop — Registrations (32)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  [All (32)] [Confirmed (30)] [Waitlist (2)] [Checked-in (0)] [No-show (0)] │
│  [Search: ___________________] [Tier: All ▼] [Score: All ▼]               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Name          | Company     | Tier      | Price   | Score | Status        │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Sarah Chen    | TechCorp    │ VIP       │ ¥9,000  │ 85    │ ✅ Confirmed   │
│  Zhang Wei     | PE Fund A   │ Regular   │ ¥6,000  │ 92    │ ✅ Confirmed   │
│  Li Ming       | StartupXYZ  │ Early-Bird│ ¥5,100  │ 45    │ ✅ Confirmed   │
│  Wang Fang     | MFG Group   │ Founding  │ ¥3,000  │ 78    │ ✅ Confirmed   │
│  John Park     | GlobalPE    │ Regular   │ ¥6,000  │ 88    │ ⏳ Waitlist    │
│  ...           | ...         | ...       | ...     | ...   | ...           │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  SUMMARY                                                                     │
│  Revenue: ¥163,800  |  Avg Score: 72  |  B2B Signals: 4  |  PE: 2        │
│  Checked in: 0/32  |  No-shows: 0  |  Waitlist: 2                          │
│                                                                              │
│  [Bulk Actions ▼] [Export CSV] [Send Reminder] [Check-in All]              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Data Model

### 5.1 New Supabase Tables

**Table: `events`**

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | auto | Primary key |
| `title` | TEXT | yes | Event title |
| `slug` | TEXT | yes | URL-safe identifier |
| `type` | ENUM | yes | `workshop`, `webinar`, `council`, `diagnostic_presentation`, `networking`, `masterclass`, `assessment`, `custom` |
| `description` | JSONB | no | Block-based description (Notion-style) |
| `short_description` | TEXT | no | One-liner for cards |
| `start_time` | TIMESTAMPTZ | yes | Event start |
| `end_time` | TIMESTAMPTZ | yes | Event end |
| `timezone` | TEXT | yes | Default: `Asia/Shanghai` |
| `location_type` | ENUM | yes | `online`, `in_person`, `hybrid` |
| `location_address` | TEXT | no | Physical address |
| `location_url` | TEXT | no | Zoom/Teams link |
| `capacity_total` | INTEGER | yes | Total seats |
| `capacity_registered` | INTEGER | auto | Current registrations (excluding waitlist) |
| `capacity_waitlist` | INTEGER | auto | Waitlist count |
| `product_id` | UUID | no | Linked product from catalog |
| `status` | ENUM | yes | `draft`, `published`, `cancelled`, `completed`, `postponed` |
| `early_bird_price` | INTEGER | no | Early-bird price (CNY) |
| `early_bird_deadline` | TIMESTAMPTZ | no | When early-bird expires |
| `regular_price` | INTEGER | no | Regular price (CNY) |
| `vip_price` | INTEGER | no | VIP price (CNY) |
| `vip_includes` | TEXT | no | What VIP adds |
| `founding_price` | INTEGER | no | Founding client price (CNY) |
| `founding_limit` | INTEGER | no | Max founding registrations (default 3) |
| `founding_used` | INTEGER | auto | Founding registrations used |
| `currency` | TEXT | yes | Default: `CNY` |
| `waitlist_enabled` | BOOLEAN | yes | Default: true |
| `registration_deadline` | TIMESTAMPTZ | no | When registration closes |
| `requires_approval` | BOOLEAN | no | Manual approval required |
| `requires_payment` | BOOLEAN | no | Payment required to confirm |
| `facilitator_ids` | UUID[] | no | Team member IDs |
| `materials` | JSONB | no | Attached files/links |
| `post_event_automation_id` | UUID | no | Linked automation flow |
| `recurring_series_id` | UUID | no | If part of recurring series |
| `utm_source` | TEXT | no | Default UTM for sharing |
| `total_revenue_cny` | INTEGER | auto | Sum of all registration payments |
| `total_attendees` | INTEGER | auto | Checked-in count |
| `created_by` | UUID | yes | Who created |
| `created_at` | TIMESTAMPTZ | auto | |
| `updated_at` | TIMESTAMPTZ | auto | |

**Table: `event_registrations`**

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | auto | Primary key |
| `event_id` | UUID | yes | FK → events |
| `contact_id` | UUID | no | FK → contacts (if exists) |
| `first_name` | TEXT | yes | |
| `last_name` | TEXT | yes | |
| `email` | TEXT | yes | |
| `company` | TEXT | no | |
| `job_title` | TEXT | no | |
| `role_category` | ENUM | no | `c_suite`, `vp_director`, `manager`, `consultant`, `other` |
| `industry` | TEXT | no | |
| `company_size` | INTEGER | no | Employee count |
| `phone` | TEXT | no | |
| `dietary_needs` | TEXT | no | |
| `accessibility_needs` | TEXT | no | |
| `referral_source` | TEXT | no | How they heard about us |
| `tier_selected` | ENUM | no | `early_bird`, `regular`, `vip`, `founding` |
| `price_paid_cny` | INTEGER | no | Actual amount paid |
| `discount_applied` | TEXT | no | Which discount rule |
| `discount_percent` | FLOAT | no | % discount |
| `bundle_id` | UUID | no | If purchased via bundle |
| `payment_status` | ENUM | yes | `pending`, `paid`, `refunded`, `waived`, `complimentary` |
| `payment_method` | ENUM | no | `stripe`, `wechat_pay`, `invoice`, `complimentary` |
| `payment_id` | TEXT | no | External payment reference |
| `registration_status` | ENUM | yes | `pending`, `confirmed`, `waitlisted`, `cancelled`, `checked_in`, `no_show` |
| `lead_score` | INTEGER | auto | Auto-calculated score |
| `b2b_signals` | JSONB | no | `{pe_affiliation: bool, c_suite: bool, multi_registrant: bool, company_size_flag: bool}` |
| `utm_source` | TEXT | no | Registration source tracking |
| `utm_medium` | TEXT | no | |
| `utm_campaign` | TEXT | no | |
| `embed_source` | TEXT | no | If registered via embed |
| `custom_field_responses` | JSONB | no | Answers to custom form fields |
| `checked_in_at` | TIMESTAMPTZ | no | Check-in timestamp |
| `confirmation_sent_at` | TIMESTAMPTZ | no | |
| `reminder_count` | INTEGER | auto | Number of reminders sent |
| `waitlist_position` | INTEGER | no | Position in waitlist |
| `notes` | TEXT | no | Internal notes |
| `created_at` | TIMESTAMPTZ | auto | |
| `updated_at` | TIMESTAMPTZ | auto | |

**Table: `event_reminders`**

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | auto | Primary key |
| `event_id` | UUID | yes | FK → events |
| `registration_id` | UUID | yes | FK → event_registrations |
| `type` | ENUM | yes | `confirmation`, `reminder_7d`, `reminder_3d`, `reminder_1d`, `reminder_1h`, `post_event_thank_you`, `post_event_recording`, `post_event_cross_sell` |
| `channel` | ENUM | yes | `email`, `feishu`, `sms` |
| `scheduled_at` | TIMESTAMPTZ | yes | When to send |
| `sent_at` | TIMESTAMPTZ | no | When actually sent |
| `status` | ENUM | yes | `scheduled`, `sent`, `failed`, `skipped` |
| `template_id` | UUID | no | Email/Feishu template used |
| `content_snapshot` | JSONB | no | Rendered content at send time |

**Table: `event_templates`**

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | auto | Primary key |
| `name` | TEXT | yes | Template name |
| `type` | ENUM | yes | Event type this template is for |
| `description` | TEXT | no | |
| `default_form_fields` | JSONB | no | Pre-configured form fields |
| `default_pricing` | JSONB | no | Default pricing tiers |
| `default_capacity` | INTEGER | no | |
| `default_automation` | JSONB | no | Default post-event automation |
| `default_reminders` | JSONB | no | Default reminder schedule |
| `created_by` | UUID | yes | |
| `created_at` | TIMESTAMPTZ | auto | |

**Table: `event_recurring_series`**

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | auto | Primary key |
| `name` | TEXT | yes | Series name |
| `frequency` | ENUM | yes | `weekly`, `biweekly`, `monthly`, `quarterly` |
| `day_of_week` | TEXT | no | e.g., "Thursday" |
| `time` | TIME | no | Default time |
| `template_event_id` | UUID | no | Base event to clone |
| `auto_create_days_ahead` | INTEGER | no | Auto-create instances N days ahead |
| `active` | BOOLEAN | yes | |
| `created_at` | TIMESTAMPTZ | auto | |

**Table: `event_waitlist`**

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | auto | Primary key |
| `event_id` | UUID | yes | FK → events |
| `registration_id` | UUID | yes | FK → event_registrations |
| `position` | INTEGER | yes | Queue position |
| `tier_preference` | ENUM | no | Preferred tier when promoted |
| `status` | ENUM | yes | `waiting`, `promoted`, `expired`, `withdrawn` |
| `promoted_at` | TIMESTAMPTZ | no | When they were promoted from waitlist |
| `created_at` | TIMESTAMPTZ | auto | |

### 5.2 Supabase Views

**View: `event_summary`**

```sql
CREATE VIEW event_summary AS
SELECT 
  e.id,
  e.title,
  e.type,
  e.start_time,
  e.end_time,
  e.status,
  e.capacity_total,
  e.capacity_registered,
  e.capacity_waitlist,
  ROUND(100.0 * e.capacity_registered / NULLIF(e.capacity_total, 0)) AS fill_rate_percent,
  e.total_revenue_cny,
  e.total_attendees,
  COUNT(er.id) FILTER (WHERE er.registration_status = 'confirmed') AS confirmed_count,
  COUNT(er.id) FILTER (WHERE er.registration_status = 'waitlisted') AS waitlist_count,
  COUNT(er.id) FILTER (WHERE er.registration_status = 'checked_in') AS checked_in_count,
  AVG(er.lead_score) AS avg_lead_score,
  COUNT(er.id) FILTER (WHERE er.b2b_signals IS NOT NULL) AS b2b_signal_count
FROM events e
LEFT JOIN event_registrations er ON e.id = er.event_id
GROUP BY e.id;
```

**View: `event_revenue_by_type`**

```sql
CREATE VIEW event_revenue_by_type AS
SELECT 
  e.type,
  COUNT(DISTINCT e.id) AS total_events,
  SUM(er.price_paid_cny) AS total_revenue_cny,
  COUNT(er.id) AS total_registrations,
  AVG(er.price_paid_cny) AS avg_price_cny,
  COUNT(er.id) FILTER (WHERE er.registration_status = 'checked_in') AS total_attendees,
  ROUND(100.0 * COUNT(er.id) FILTER (WHERE er.registration_status = 'checked_in') 
    / NULLIF(COUNT(er.id) FILTER (WHERE er.registration_status = 'confirmed'), 0)) AS attendance_rate
FROM events e
LEFT JOIN event_registrations er ON e.id = er.event_id
WHERE er.payment_status = 'paid'
GROUP BY e.type;
```

---

## 6. API Endpoints

### 6.1 Events CRUD

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/events` | List events (filter by type, status, date range) | Required |
| GET | `/api/events/:id` | Get event details | Required |
| POST | `/api/events` | Create event | Required |
| PATCH | `/api/events/:id` | Update event | Required |
| DELETE | `/api/events/:id` | Delete event (soft) | Required |
| POST | `/api/events/:id/publish` | Publish event | Required |
| POST | `/api/events/:id/cancel` | Cancel event | Required |
| POST | `/api/events/:id/clone` | Clone event as draft | Required |

### 6.2 Registration

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/events/:id/registrations` | List registrations for event | Required |
| POST | `/api/events/:id/register` | Public registration (no auth) | Public |
| GET | `/api/registrations/:id` | Get registration details | Required |
| PATCH | `/api/registrations/:id` | Update registration | Required |
| POST | `/api/registrations/:id/check-in` | Check in attendee | Required |
| POST | `/api/registrations/:id/cancel` | Cancel registration | Required |
| POST | `/api/registrations/:id/refund` | Process refund | Required |
| POST | `/api/registrations/bulk-check-in` | Bulk check-in | Required |
| POST | `/api/registrations/bulk-action` | Bulk status change | Required |

### 6.3 Pricing & Payment

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/events/:id/pricing` | Get pricing tiers (from product catalog) | Public |
| POST | `/api/events/:id/pricing/validate` | Validate pricing against discount rules | Required |
| POST | `/api/events/:id/apply-discount` | Apply discount to registration | Required |
| POST | `/api/payments/create-intent` | Create Stripe/WeChat payment intent | Public |
| POST | `/api/payments/webhook` | Payment webhook handler | System |
| GET | `/api/payments/:id/status` | Check payment status | Required |
| POST | `/api/payments/:id/refund` | Initiate refund | Required |

### 6.4 Waitlist

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/events/:id/waitlist/join` | Join waitlist | Public |
| GET | `/api/events/:id/waitlist` | Get waitlist | Required |
| POST | `/api/waitlist/:id/promote` | Promote from waitlist | Required |
| POST | `/api/waitlist/:id/withdraw` | Withdraw from waitlist | Public |

### 6.5 Automation

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/events/:id/automation` | Get automation config | Required |
| PATCH | `/api/events/:id/automation` | Update automation config | Required |
| POST | `/api/events/:id/reminders/test` | Send test reminder | Required |
| POST | `/api/events/:id/post-event/trigger` | Manually trigger post-event flow | Required |

### 6.6 Analytics

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/events/:id/analytics` | Event analytics (revenue, attendance, conversion) | Required |
| GET | `/api/events/:id/lead-scores` | Lead score distribution | Required |
| GET | `/api/events/analytics/summary` | All-events analytics summary | Required |
| GET | `/api/events/analytics/revenue-by-type` | Revenue breakdown by event type | Required |

### 6.7 Public

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/event/:slug` | Public registration page | Public |
| GET | `/api/embed/:event_id/form` | Embeddable registration form | Public |
| GET | `/api/embed/:event_id/script` | JS embed snippet | Public |

---

## 7. Integration Architecture

### 7.1 Module Dependencies

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EVENTS & REGISTRATION                                │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                     │
│  │ Event CRUD   │  │ Form Builder │  │ Registration │                     │
│  │              │  │              │  │ Management   │                     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                     │
│         │                  │                  │                              │
│         ▼                  ▼                  ▼                              │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │                    EVENTS CORE ENGINE                         │          │
│  └──────┬──────────┬──────────┬──────────┬──────────┬──────────┘          │
│         │          │          │          │          │                        │
│    ┌────▼───┐ ┌────▼───┐ ┌───▼────┐ ┌───▼────┐ ┌───▼─────┐              │
│    │PRODUCT │ │DISCOUNT│ │PAYMENT │ │JOURNEY │ │ANALYTICS│              │
│    │CATALOG │ │ENGINE  │ │GATEWAY │ │ENGINE  │ │ENGINE   │              │
│    └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬─────┘              │
│        │          │          │          │          │                        │
└────────┼──────────┼──────────┼──────────┼──────────┼────────────────────────┘
         │          │          │          │          │
    ┌────▼────┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐ ┌───▼────┐
    │ MODULE 9│ │MODULE │ │STRIPE │ │PAGE 5 │ │PAGE 8  │
    │ Pricing │ │9 Disc.│ │WeChat │ │B2C    │ │Anal.   │
    │&Catalog │ │Engine │ │Pay    │ │Journey│ │& Intel.│
    └─────────┘ └───────┘ └───────┘ └───────┘ └────────┘
```

### 7.2 Data Flow

1. **Event creation** → pulls pricing from `products` table (Module 9) → applies discount rules
2. **Registration** → public form → creates `event_registrations` row → triggers confirmation
3. **Payment** → Stripe/WeChat webhook → updates `payment_status` → updates `events.total_revenue_cny`
4. **Capacity** → each confirmed registration increments `capacity_registered` → if full, new registrations go to waitlist
5. **Lead scoring** → on registration, auto-calculate `lead_score` + detect `b2b_signals` → push to B2C Journey Engine
6. **Post-event** → event marked `completed` → triggers post-event automation → creates journey steps for each attendee
7. **Cross-sell** → post-event journey checks `cross_sell_rules` (Module 9) → suggests relevant products
8. **Analytics** → aggregates into `event_summary` and `event_revenue_by_type` views → feeds Dashboard

### 7.3 Council-Specific Integration

```
Council Registration Flow:

1. User selects tier (Individual ¥12K / Corporate ¥30K / PE ¥50K)
2. System checks capacity for selected tier:
   - Individual: 42/60 → available
   - Corporate: 7/10 → available
   - PE: 5/5 → SOLD OUT → waitlist only
3. System checks founding member eligibility:
   - If first 30 members → apply 20% founding discount
   - If PE tier AND founding members filled → NEVER DISCOUNT (hard block)
4. Registration confirmed → create/update contact → mark as Council member
5. Post-registration journey:
   - Welcome email with Council benefits
   - Calendar invite for next Council meeting
   - Onboarding journey (if new member)
   - Cross-sell: Workshop invitation (Council+Workshop bundle)
6. Revenue tracked in `revenue_records` (Module 9) with `tier=council`
```

---

## 8. AI Features

### 8.1 AI Personas

**Event Pricing Advisor**
- Model: `deepseek-pro` (temperature 0.3)
- Frequency: On event creation
- Input: Event type, target audience, similar past events, current phase
- Output: Suggested pricing tiers, early-bird deadline, capacity recommendation
- Example: "Based on 3 similar workshops, ¥5,000-6,000 regular price achieves 70%+ fill rate. Early-bird at ¥4,250 drives 40% of registrations in first week."

**Post-Event Follow-Up Writer**
- Model: `deepseek-flash` (temperature 0.5)
- Frequency: After each event completion
- Input: Event type, attendee list, lead scores, B2B signals, cross-sell rules
- Output: Personalized follow-up email per attendee segment
- Example: "For C-suite attendees (score 80+): 'Great to have you at the workshop. Based on your company's AI maturity score, I'd recommend starting with a PRISM diagnostic. Here's a founding-client rate...' "

**Attendee Matcher** (for networking events)
- Model: `deepseek-flash` (temperature 0.4)
- Frequency: 24h before networking event
- Input: Attendee profiles (industry, role, company, interests)
- Output: Suggested connections: "Sarah Chen (TechCorp AI VP) should meet Zhang Wei (PE Fund A) — both interested in AI governance"

### 8.2 AI Triggers

| Trigger | Model | Temperature | Input | Output |
|---------|-------|-------------|-------|--------|
| Event created | deepseek-pro | 0.3 | Event type, audience, past data | Pricing suggestion |
| Event completed | deepseek-flash | 0.5 | Attendee data, lead scores | Follow-up emails |
| Networking event (24h before) | deepseek-flash | 0.4 | Attendee profiles | Connection suggestions |
| Low registration (7d before, <30% full) | deepseek-pro | 0.3 | Event data, channel data | Promotion strategy |
| Waitlist full | deepseek-flash | 0.4 | Waitlist data | Alternative event suggestions |

---

## 9. Background Jobs

| Job | Frequency | Description |
|-----|-----------|-------------|
| `send_event_reminders` | Every hour | Check and send due reminders (7d, 3d, 1d, 1h) |
| `expire_early_bird` | Every hour | Switch pricing from early-bird to regular when deadline passes |
| `promote_waitlist` | Every 30 min | When registration cancelled → promote next in waitlist |
| `calculate_lead_scores` | Every 15 min | Re-score new registrations based on updated rules |
| `detect_b2b_signals` | On registration | Flag PE affiliation, C-suite, multi-registrant |
| `trigger_post_event_flow` | On event completion | Start post-event automation for all attendees |
| `sync_event_to_calendar` | On event publish/update | Push event to content calendar (Page 2) |
| `generate_event_report` | 24h after event | Compile attendance, revenue, lead quality report |
| `cleanup_expired_waitlist` | Daily | Remove waitlist entries older than event date |
| `recurring_event_creator` | Daily | Auto-create upcoming instances of recurring series |

---

## 10. Ticket List

### 10.1 Event Creation & Management (EVT-001 to EVT-010)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| EVT-001 | Events table schema + Supabase migration | 3h | P0 | INFRA-100 |
| EVT-002 | Event CRUD API endpoints | 5h | P0 | EVT-001 |
| EVT-003 | Events list view UI (filter, search, type tabs) | 5h | P0 | EVT-002 |
| EVT-004 | Event creation — multi-step builder (5 steps) | 8h | P0 | EVT-003 |
| EVT-005 | Event type selector with type-specific fields | 4h | P0 | EVT-004 |
| EVT-006 | Product catalog integration (link event → product) | 4h | P0 | EVT-004, CAT-001 |
| EVT-007 | Event editing (inline + full edit mode) | 3h | P1 | EVT-004 |
| EVT-008 | Event deletion (soft delete + confirmation) | 1h | P2 | EVT-004 |
| EVT-009 | Event status management (draft → published → completed) | 3h | P0 | EVT-004 |
| EVT-010 | Event cloning (duplicate as draft) | 2h | P2 | EVT-004 |

### 10.2 Registration Form Builder (EVT-011 to EVT-019)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| EVT-011 | Form builder engine (field types, validation) | 6h | P0 | EVT-004 |
| EVT-012 | 20+ field types (text, email, dropdown, checkbox, paragraph, etc.) | 5h | P0 | EVT-011 |
| EVT-013 | Conditional logic engine (show/hide fields based on responses) | 5h | P1 | EVT-012 |
| EVT-014 | Multi-step form support (step navigation, progress bar) | 4h | P0 | EVT-011 |
| EVT-015 | Form preview mode (see what registrants see) | 2h | P1 | EVT-014 |
| EVT-016 | Auto-detect company from email domain | 3h | P2 | EVT-012 |
| EVT-017 | Business email validation (block gmail/qq/163) | 1h | P1 | EVT-012 |
| EVT-018 | Custom form fields per event (dietary, accessibility, survey) | 3h | P2 | EVT-012 |
| EVT-019 | Form response storage + export | 2h | P1 | EVT-011 |

### 10.3 Public Registration Page (EVT-020 to EVT-026)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| EVT-020 | Public registration page layout (responsive) | 5h | P0 | EVT-014 |
| EVT-021 | Pricing tier display (card selector with prices) | 3h | P0 | EVT-020 |
| EVT-022 | Capacity indicator ("X/Y spots filled" + progress bar) | 2h | P0 | EVT-020 |
| EVT-023 | Sold-out state + waitlist signup | 3h | P1 | EVT-022 |
| EVT-024 | Custom event URL (/event/{slug}) | 2h | P0 | EVT-020 |
| EVT-025 | Event page SEO (meta tags, Open Graph, structured data) | 2h | P1 | EVT-024 |
| EVT-026 | Social sharing buttons (WeChat, LinkedIn, email) | 2h | P1 | EVT-024 |

### 10.4 Pricing & Payment (EVT-027 to EVT-037)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| EVT-027 | Tiered pricing engine (early-bird/regular/VIP/founding) | 5h | P0 | EVT-006 |
| EVT-028 | Early-bird deadline auto-switch | 2h | P0 | EVT-027 |
| EVT-029 | Discount engine integration (from Module 9) | 4h | P0 | EVT-027, CAT-030 |
| EVT-030 | Never-discount enforcement (hard block) | 2h | P0 | EVT-029 |
| EVT-031 | Founding client tracking (limit 3, auto-apply) | 3h | P0 | EVT-029 |
| EVT-032 | Multi-seat registration (3+ seats, group discount) | 3h | P1 | EVT-027 |
| EVT-033 | Stripe CNY payment integration | 6h | P0 | EVT-027 |
| EVT-034 | WeChat Pay integration | 6h | P0 | EVT-027 |
| EVT-035 | Invoice generation (PDF, CNY, with company details) | 3h | P1 | EVT-033 |
| EVT-036 | Refund processing (full/partial, reason tracking) | 3h | P1 | EVT-033 |
| EVT-037 | Payment webhook handler (confirm, fail, refund) | 3h | P0 | EVT-033, EVT-034 |

### 10.5 Capacity & Waitlist (EVT-038 to EVT-043)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| EVT-038 | Real-time capacity counter (Supabase Realtime) | 3h | P0 | EVT-001 |
| EVT-039 | Waitlist table + join/withdraw flow | 3h | P1 | EVT-038 |
| EVT-040 | Auto-promote from waitlist on cancellation | 2h | P1 | EVT-039 |
| EVT-041 | Waitlist position display ("You are #3 in line") | 1h | P1 | EVT-039 |
| EVT-042 | Per-tier capacity (Council: 60/10/5) | 3h | P0 | EVT-038 |
| EVT-043 | Waitlist expiration cleanup job | 1h | P2 | EVT-039 |

### 10.6 Registration Management (EVT-044 to EVT-051)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| EVT-044 | Event registrations table schema | 2h | P0 | EVT-001 |
| EVT-045 | Registrations list view (filter, search, tier tabs) | 4h | P0 | EVT-044 |
| EVT-046 | Registration detail view (full info, payment, notes) | 3h | P0 | EVT-045 |
| EVT-047 | Check-in flow (search/scan QR → mark checked in) | 3h | P0 | EVT-045 |
| EVT-048 | Bulk actions (bulk check-in, bulk status change, bulk export) | 3h | P1 | EVT-045 |
| EVT-049 | Registration edit (change tier, update info, reassign) | 2h | P1 | EVT-046 |
| EVT-050 | Registration cancellation + refund trigger | 2h | P1 | EVT-046 |
| EVT-051 | Walk-in registration (quick form at event) | 2h | P1 | EVT-045 |

### 10.7 Confirmation & Reminders (EVT-052 to EVT-058)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| EVT-052 | Event reminders table schema | 1h | P0 | EVT-001 |
| EVT-053 | Confirmation sequence (email + Feishu + calendar invite) | 4h | P0 | EVT-052 |
| EVT-054 | Reminder sequence (7d, 3d, 1d, 1h) | 3h | P1 | EVT-052 |
| EVT-055 | Reminder job (hourly check + send) | 3h | P1 | EVT-054 |
| EVT-056 | Multi-channel reminder (email + Feishu + SMS) | 4h | P1 | EVT-054 |
| EVT-057 | Reminder template builder (customize per event) | 3h | P2 | EVT-054 |
| EVT-058 | Reminder analytics (open rate, send count) | 2h | P2 | EVT-055 |

### 10.8 Lead Collection & B2B Signals (EVT-059 to EVT-064)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| EVT-059 | Auto lead scoring engine (role, company size, source, history) | 5h | P1 | EVT-044 |
| EVT-060 | B2B signal detection (PE affiliation, C-suite, multi-registrant) | 4h | P1 | EVT-059 |
| EVT-061 | Multi-registrant detection (same company → flag) | 2h | P1 | EVT-060 |
| EVT-062 | Lead score display in registration list | 2h | P1 | EVT-059 |
| EVT-063 | B2B signal push to B2C Journey Engine (Page 5) | 3h | P1 | EVT-060, JOUR-015 |
| EVT-064 | Lead score export + segment filter | 2h | P2 | EVT-059 |

### 10.9 Post-Event Automation (EVT-065 to EVT-070)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| EVT-065 | Post-event automation config (per event type) | 4h | P1 | EVT-009 |
| EVT-066 | Post-event thank you email (auto-send on completion) | 2h | P1 | EVT-065 |
| EVT-067 | Post-event recording delivery (email with recording link) | 2h | P1 | EVT-066 |
| EVT-068 | Post-event cross-sell trigger (check Module 9 rules) | 3h | P1 | EVT-065, CAT-020 |
| EVT-069 | Post-event survey (auto-generate + send) | 3h | P2 | EVT-065 |
| EVT-070 | Post-event report generation (attendance, revenue, leads) | 3h | P1 | EVT-065 |

### 10.10 Event Templates & Recurring (EVT-071 to EVT-076)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| EVT-071 | Event templates table + seed data | 2h | P1 | EVT-001 |
| EVT-072 | Template selector in event creation | 2h | P1 | EVT-071 |
| EVT-073 | Pre-built templates (workshop, webinar, Council, diagnostic) | 3h | P1 | EVT-072 |
| EVT-074 | Recurring series table + configuration | 3h | P2 | EVT-001 |
| EVT-075 | Auto-create recurring event instances | 3h | P2 | EVT-074 |
| EVT-076 | Recurring series management view | 2h | P2 | EVT-075 |

### 10.11 Embed & Share (EVT-077 to EVT-080)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| EVT-077 | Embeddable registration form (iframe) | 4h | P1 | EVT-020 |
| EVT-078 | JS embed snippet generator | 2h | P1 | EVT-077 |
| EVT-079 | UTM tracking for embed + social shares | 2h | P1 | EVT-077 |
| EVT-080 | Custom landing page builder (for event promotion) | 4h | P2 | EVT-020 |

### 10.12 Council-Specific (EVT-081 to EVT-085)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| EVT-081 | Council tier selection in registration (Individual/Corporate/PE) | 3h | P0 | EVT-042 |
| EVT-082 | Per-tier capacity display ("42/60 Individual | 7/10 Corp | 3/5 PE") | 2h | P0 | EVT-081 |
| EVT-083 | PE tier sold-out state + waitlist | 2h | P0 | EVT-082 |
| EVT-084 | Council founding member tracking (first 30) | 2h | P0 | EVT-031 |
| EVT-085 | Council member welcome journey (post-registration) | 3h | P1 | EVT-084, JOUR-001 |

### 10.13 Analytics & Intelligence (EVT-086 to EVT-092)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| EVT-086 | Event summary view (Supabase view) | 2h | P1 | EVT-044 |
| EVT-087 | Event analytics dashboard (revenue, attendance, conversion) | 5h | P1 | EVT-086 |
| EVT-088 | Revenue by event type breakdown | 3h | P1 | EVT-087 |
| EVT-089 | Lead quality analytics (score distribution, B2B signals) | 3h | P1 | EVT-087 |
| EVT-090 | Event ROI calculator (revenue vs cost, conversion to next tier) | 3h | P1 | EVT-087 |
| EVT-091 | Attendance rate tracking (registered vs checked-in) | 2h | P1 | EVT-047 |
| EVT-092 | Export event analytics to CSV/PDF | 2h | P2 | EVT-087 |

### 10.14 AI Features (EVT-093 to EVT-097)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| EVT-093 | AI pricing advisor (suggest pricing on event creation) | 4h | P2 | EVT-004 |
| EVT-094 | AI post-event follow-up writer (personalized per segment) | 4h | P2 | EVT-065 |
| EVT-095 | AI attendee matcher (for networking events) | 4h | P2 | EVT-059 |
| EVT-096 | AI low-registration alert (suggest promotion strategy) | 3h | P2 | EVT-087 |
| EVT-097 | AI waitlist optimization (suggest alternative events) | 2h | P2 | EVT-039 |

### 10.15 Retrofit & Integration (EVT-098 to EVT-102)

| ID | Ticket | Effort | Priority | Dependencies |
|----|--------|--------|----------|-------------|
| EVT-098 | Sync events to Content Calendar (Page 2) | 3h | P1 | EVT-009, CAL-015 |
| EVT-099 | Event promotion via Distribution Engine (Page 4) | 3h | P1 | EVT-009, DIST-001 |
| EVT-100 | Post-event content → Content Repurposing (Page 6) | 3h | P1 | EVT-070, REP-001 |
| EVT-101 | Event revenue → Dashboard (Page 1) | 2h | P1 | EVT-087, DASH-020 |
| EVT-102 | Event templates → Template Library (Page 3) | 2h | P2 | EVT-073, TPL-001 |

---

## 11. Effort Summary

| Section | Tickets | Effort |
|---------|---------|--------|
| 10.1 Event Creation & Management | 10 | 34h |
| 10.2 Registration Form Builder | 9 | 29h |
| 10.3 Public Registration Page | 7 | 19h |
| 10.4 Pricing & Payment | 11 | 37h |
| 10.5 Capacity & Waitlist | 6 | 13h |
| 10.6 Registration Management | 8 | 21h |
| 10.7 Confirmation & Reminders | 7 | 18h |
| 10.8 Lead Collection & B2B Signals | 6 | 18h |
| 10.9 Post-Event Automation | 6 | 17h |
| 10.10 Event Templates & Recurring | 6 | 15h |
| 10.11 Embed & Share | 4 | 12h |
| 10.12 Council-Specific | 5 | 12h |
| 10.13 Analytics & Intelligence | 7 | 20h |
| 10.14 AI Features | 5 | 17h |
| 10.15 Retrofit & Integration | 5 | 13h |
| **TOTAL** | **102** | **275h** |

*Note: Revised from initial estimate of 72 tickets / 228h. Expanded to 102 tickets / 275h to cover all functional requirements with proper granularity.*

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
| **Module 7: Events & Registration (Page 7)** | **102** | **275h** |
| Module 8: Analytics & Intelligence (Page 8) | — | — |
| Module 9: Pricing & Product Catalog | 78 | 261h |
| Cross-Page Infrastructure | 13 | 80h |
| Per-Page Retrofit (est.) | 36 | 154h |
| **GRAND TOTAL** | **609+** | **1,931h+** |

*(Module 8 pending — next spec to write)*
