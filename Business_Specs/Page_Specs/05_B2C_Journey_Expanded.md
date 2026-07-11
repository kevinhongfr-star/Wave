# WAVE Business Spec — Page 5: B2C Journey Engine (EXPANDED)

**Version:** 2.1 | **Date:** 2026-07-11 | **Status:** Draft for Kevin Review
**Supersedes:** TICKET-044 through TICKET-054 (existing v1.0 — 11 tickets, ~35h)
**Builds on:** Distribution Engine (Page 4), Template Library (Page 3), Content Calendar (Page 2)
**Gap tickets:** JOUR-001 through JOUR-072 (expanded from 11 to 72)
**Total effort:** 242h (up from ~35h)
**Integrates:** 12 Audit Criteria (C1-C12) + Infrastructure Components (INFRA-100 to INFRA-112)

---

## 1. Purpose

The B2C Journey Engine is WAVE's automated customer lifecycle layer. It answers:
1. **"What happens after someone enters our ecosystem?"** — Automated nurture from first touch to Council membership
2. **"How do we move people between products?"** — Diagnostic-triggered cross-sell (LEAP → PRISM → Council)
3. **"When does a B2C buyer become a B2B prospect?"** — Signal detection and routing to VISTA
4. **"Where are people getting stuck?"** — Funnel analytics, drop-off detection, optimization
5. **"Can I see everyone's journey at once?"** — Lifecycle tracking, cohort analysis, health monitoring

It must feel like **HubSpot's workflow builder + UserFlow's journey mapping + a lightweight customer success platform** — not a flowchart tool.

**Current state (what exists today):**
- Static table with 5 hardcoded rows (name, enrolled, conversion, steps)
- No Supabase connection
- No visual journey builder
- No node configuration
- No execution engine
- No analytics
- No cross-sell logic
- No B2B signal detection

**Expansion scope (what this spec adds):**

| Area | Current | Expanded |
|------|---------|----------|
| Journey builder | None | Full visual canvas: drag-drop nodes, connect edges, configure inline |
| Node types | None | 12 types: trigger, email, wait, condition, action, cross-sell, signal-check, webhook, SMS, notification, end, split |
| Journey templates | None | 8 pre-built templates (welcome, nurture, cross-sell, re-engagement, webinar follow-up, assessment onboarding, council invite, custom) |
| Entry triggers | None | 10 trigger types: registration, assessment complete, content viewed, event registered, score changed, time-based, manual, B2B signal, cross-sell, webhook |
| Execution engine | None | Cron-based (5min intervals), real-time monitoring, error handling, retry logic |
| Cross-sell | Basic ticket | Diagnostic-triggered: assessment result → suggest next → track acceptance → auto-enroll |
| B2B signal detection | Basic ticket | 6 signal types: job title, company size, team purchase, consultation request, engagement spike, referral → route to VISTA |
| Analytics | Basic ticket | Full funnel visualization, drop-off heatmap, cohort analysis, conversion per stage, time-in-stage, A/B path testing |
| Lifecycle tracking | None | Per-contact journey history: every journey, every step, every outcome — timeline view |
| AI optimization | None | Drop-off predictor, optimal path recommender, timing optimizer, cross-sell success predictor |
| Multi-journey management | None | Journey health dashboard, conflict detection (contact in 2+ journeys), priority queue |
| Integration | None | Deep integration: Distribution (email sequences), Calendar (content triggers), Templates (journey templates), Dashboard (health) |
| Canvas editing | None | Full canvas with inline node editing, no modals, block-based email content within nodes |
| Layout freedom | None | Resizable canvas, split view (map + detail), zoom levels, minimap, focus mode per journey |
| Guided creation | None | "Create journey in 7 steps" wizard with progress, resume, templates |
| Real-time monitoring | None | Live journey execution view: see contacts moving through nodes in real-time |
| Workspace memory | None | Resume last canvas position, zoom level, selected node, filters |

---

## 2. Business Requirements

### 2.1 Journey Builder — Visual Canvas (expanded)

**Journey metadata:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | auto | Primary key |
| `name` | TEXT | yes | Journey name |
| `description` | TEXT | no | Purpose description (block-based, editable) |
| `status` | ENUM | yes | `draft`, `active`, `paused`, `archived` |
| `trigger_type` | ENUM | yes | Entry trigger type |
| `trigger_config` | JSONB | no | Trigger-specific configuration |
| `category` | ENUM | yes | `onboarding`, `nurture`, `cross_sell`, `re_engagement`, `event_followup`, `b2b_routing`, `custom` |
| `campaign_id` | UUID | no | Linked campaign |
| `owner_id` | UUID | yes | Journey owner (who created/manages) |
| `priority` | INTEGER | no | Priority score (from INFRA-108) |
| `health_score` | FLOAT | auto | 0-100 composite health |
| `total_nodes` | INTEGER | auto | Count of nodes |
| `total_edges` | INTEGER | auto | Count of edges |
| `active_instances` | INTEGER | auto | Contacts currently in journey |
| `completion_rate` | FLOAT | auto | % of entered contacts who completed |
| `avg_completion_days` | FLOAT | auto | Average days to complete |
| `canvas_state` | JSONB | no | Last canvas view state (zoom, pan, positions) |
| `created_at` | TIMESTAMPTZ | auto | Creation |
| `updated_at` | TIMESTAMPTZ | auto | Last update |

**Node types (12 types):**

| Type | Icon | Description | Config Fields |
|------|------|-------------|---------------|
| `trigger` | ⚡ | Entry point — defines when contacts enter | trigger_type, trigger_config |
| `email` | 📧 | Send email (from Distribution sequences) | sequence_id, personalization, send_time_opt |
| `wait` | ⏳ | Pause for duration | delay_value, delay_unit (minutes/hours/days/weeks), business_days_only |
| `condition` | 🔀 | Branch based on data | field, operator, value, true_branch, false_branch |
| `action` | ▶️ | Execute action (tag, update field, notify, webhook) | action_type, action_config |
| `cross_sell` | 🔄 | Suggest next product based on diagnostic | current_assessment, suggested_next, delay_before_suggest, channel (email/in-app) |
| `signal_check` | 📡 | Check for B2B signals | signal_types[], threshold, route_to (VISTA/notify) |
| `webhook` | 🌐 | Call external URL | url, method, headers, body_template, retry_policy |
| `sms` | 📱 | Send SMS notification | message_template, sender_id |
| `notification` | 🔔 | Internal notification (Feishu/email to team) | recipient, channel, message_template |
| `split` | ⑆ | A/B path split (random or weighted) | split_type (random/weighted), branches[], weights[] |
| `end` | 🏁 | Journey end — mark complete | outcome (completed/dropped/converted), next_journey_id (optional chaining) |

**Canvas wireframe:**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ B2C Journey Engine                                          [Focus] [Split] [+] │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─ JOURNEY HEALTH ──────────────────────────────────────────────────────────┐ │
│  │ 78  │ Active: 3  │ 147 people in journeys  │ ⚡ Fix: Welcome Journey has  │ │
│  │ /100│ Paused: 1  │ Avg completion: 34%     │   23 stuck at Step 3 (48h)  │ │
│  │     │ Draft: 2   │ 2 B2B signals this week │   [→ Fix Now]               │ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  ┌─ MY JOURNEYS ───────────────────────────────────────────── [List] [Board] ─┐│
│  │                                                                             ││
│  │  ⚡ Welcome Journey                  Active  │ 342 enrolled │ 67% complete ││
│  │     Trigger: On registration         Health: 92 │ Next: 12 waiting         ││
│  │                                                                             ││
│  │  🔄 LEAP → PRISM Cross-Sell           Active  │ 156 enrolled │ 28% complete ││
│  │     Trigger: Assessment complete     Health: 74 │ ⚠ Drop-off at Day 7      ││
│  │                                                                             ││
│  │  📡 B2B Signal Router                 Active  │ 847 scanned  │ 4 signals    ││
│  │     Trigger: Continuous              Health: 88 │ Last: 2h ago              ││
│  │                                                                             ││
│  │  🏛 Council Invitation Flow           Paused  │ 89 enrolled  │ 45% complete ││
│  │     Trigger: PRISM complete          Health: 61 │ ⚠ Low response rate       ││
│  │                                                                             ││
│  │  📧 Webinar Follow-up                 Draft   │ —           │ 5 nodes       ││
│  │     Trigger: Webinar attendance      Health: —  │ [→ Continue Building]     ││
│  │                                                                             ││
│  │  [+ New Journey]  [From Template]  [Guided Setup]                          ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                 │
│  ┌─ JOURNEY CANVAS (Welcome Journey) ────────────────────── [Zoom] [Mini] ───┐ │
│  │                                                                             │ │
│  │   ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐            │ │
│  │   │ ⚡      │     │ 📧      │     │ ⏳       │     │ 📧      │            │ │
│  │   │ Trigger │────→│ Welcome │────→│ Wait    │────→│ Day 3   │───→ ...    │ │
│  │   │ On      │     │ Email   │     │ 1 day   │     │ Tips    │            │ │
│  │   │ register│     │         │     │         │     │         │            │ │
│  │   └─────────┘     └─────────┘     └─────────┘     └─────────┘            │ │
│  │    342 entered     98% sent         289 waiting      156 sent             │ │
│  │                                                                             │ │
│  │   ┌──────────────────── NODE DETAIL (inline) ──────────────────────────┐  │ │
│  │   │ 📧 Welcome Email                                                    │  │ │
│  │   │ Subject: [Welcome to LYC — here's your LEAP result██████]          │  │ │
│  │   │ Sequence: [Welcome Sequence ▼]   Delay: [0] days                   │  │ │
│  │   │ Personalization: [First Name], [Assessment Name], [Score]          │  │ │
│  │   │ Send time: [☑ AI-optimized]   Template: [Welcome v3 ▼]            │  │ │
│  │   │ Sent: 335  Opened: 298 (89%)  Clicked: 147 (44%)                  │  │ │
│  │   │ [Preview Email]  [Edit in Sequence Builder →]                      │  │ │
│  │   └────────────────────────────────────────────────────────────────────┘  │ │
│  │                                                                             │ │
│  │   Node palette: [⚡Trigger] [📧Email] [⏳Wait] [🔀Condition] [▶️Action]    │ │
│  │                 [🔄Cross-sell] [📡Signal] [🌐Webhook] [⑆Split] [🏁End]    │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  ┌─ LIVE ACTIVITY ───────────────────────────────────────────────────────────┐ │
│  │ 🟢 Sarah K. completed "Welcome Email" — 2 min ago                        │ │
│  │ 🟢 Marcus T. entered journey (registered) — 5 min ago                    │ │
│  │ 🟡 Priya R. stuck at "Wait 3 days" — 2d 14h remaining                   │ │
│  │ 🔴 3 contacts dropped at "Condition: Score > 70" — no match             │ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Canvas interactions (applying C1-C12):**

| Criterion | Implementation on Journey Page |
|-----------|-------------------------------|
| C1 Zero Static | Every node inline-editable. Click node → detail panel opens inline (not modal). Journey name, description, health — all editable. |
| C2 Layout Freedom | Canvas resizable (drag edges). Split view: canvas + node detail side-by-side. Minimap toggle. Zoom levels: fit-all, 50%, 100%, 200%. Node palette dockable (left/right/bottom). |
| C3 Priority-First | "JOURNEYS NEEDING ATTENTION" always visible at top. Broken conditions, stuck contacts, declining health — surfaced immediately. |
| C4 Overview+Focus+Urgency | Health bar = overview. Journey list = focus. Live activity feed = urgency. Can toggle between "all journeys" and "one journey" view. |
| C5 Baby Steps | Guided journey creation: "Step 1: Choose trigger → Step 2: Add first email → Step 3: Set wait time → Step 4: Add condition → Step 5: Set end → Step 6: Test → Step 7: Activate" |
| C6 Supabase | All journey data live. Real-time subscriptions for execution events. Canvas state persisted. |
| C7 Inline | Node config inline (side panel, not modal). Email content editable from node. Condition rules inline. Trigger config inline. |
| C8 Drag-Drop | Drag nodes from palette to canvas. Drag to connect nodes (create edges). Drag node to reposition on canvas. Drag contact from journey → Distribution to add to sequence. |
| C9 Block-Based | Email content within email nodes uses block editor (from Template Library). Journey description uses block editor. |
| C10 Multi-Track | Timeline view: multiple journeys as parallel tracks. Contact flow visualization: see multiple contacts moving through same journey simultaneously. |
| C11 Multi-User | "Echo is editing this journey" presence. Live cursor on canvas. Conflict resolution for simultaneous edits. |
| C12 Memory | Canvas position, zoom level, selected node, open panel — all restored on return. Last edited journey highlighted in list. |

### 2.2 Entry Trigger System (expanded)

**Trigger types (10):**

| Trigger | Event Source | Config | Example |
|---------|-------------|--------|---------|
| `on_registration` | New contact created | None or source filter | Welcome journey triggers on any new signup |
| `on_assessment_complete` | Assessment submission | assessment_id, min_score | LEAP complete → cross-sell PRISM |
| `on_content_viewed` | Content view event | content_id, view_count_threshold | Viewed 3+ articles → nurture journey |
| `on_event_registered` | Event registration | event_id, attendance_status | Webinar registered → follow-up journey |
| `on_score_changed` | Engagement score update | direction (up/down), threshold | Score drops below 30 → re-engagement |
| `on_time_based` | Cron schedule | cron_expression, filter_rules | Every Monday → check inactive contacts |
| `on_manual` | User action | mailing_list_id, contact_ids | Kevin selects 50 contacts → enroll |
| `on_b2b_signal` | B2B signal detected | signal_type, confidence_threshold | Director title detected → route to VISTA |
| `on_cross_sell` | Previous journey completion | source_journey_id, outcome | Complete PRISM → suggest Council |
| `on_webhook` | External webhook | webhook_secret, field_mapping | Zapier trigger → enroll contact |

**Trigger precedence & conflict resolution:**

| Scenario | Resolution |
|----------|------------|
| Contact triggers same journey twice | Skip — already enrolled/completed |
| Contact in 2+ journeys simultaneously | Allow (default) or block (configurable per journey) |
| Journey trigger fires but contact is suppressed | Skip — log suppression reason |
| Multiple journeys trigger at same time | Queue — execute in priority order |
| Journey trigger fires but journey is paused | Queue — execute when journey resumes (if within TTL) |

### 2.3 Diagnostic-Triggered Cross-Sell (expanded)

**Cross-sell logic model:**

```
Assessment Completion (e.g., LEAP)
    │
    ├──→ Wait 7 days
    │       │
    │       ├──→ Check: Did they engage with LEAP results? (email opened, dashboard visited)
    │       │       │
    │       │       ├──→ YES: Send PRISM suggestion email
    │       │       │       │
    │       │       │       ├──→ Wait 7 days
    │       │       │       │       │
    │       │       │       │       ├──→ Check: Did they start PRISM?
    │       │       │       │       │       │
    │       │       │       │       │       ├──→ YES: Enroll in PRISM journey → later suggest Council
    │       │       │       │       │       │
    │       │       │       │       │       └──→ NO: Send reminder → wait 5 days → send final CTA
    │       │       │       │       │
    │       │       │       │       └──→ Track: suggested, started, completed, ignored
    │       │       │       │
    │       │       │       └──→ Channel: Email + in-app notification
    │       │       │
    │       │       └──→ NO: Send "Your LEAP insights are waiting" nudge
    │       │
    │       └──→ Personalize: reference their LEAP score, top insight, recommended area
    │
    └──→ AI Layer: Predict optimal cross-sell timing based on engagement pattern
```

**Cross-sell chain (LYC product progression):**

| From | To | Delay | Channel | Success Metric |
|------|-----|-------|---------|---------------|
| LEAP complete | PRISM suggestion | 7 days | Email + in-app | PRISM started within 14 days |
| PRISM complete | BRIDGE suggestion | 10 days | Email + in-app | BRIDGE registered within 21 days |
| BRIDGE complete | Council invitation | 14 days | Email + personal | Council application within 30 days |
| Any assessment | Newsletter subscription | 3 days | Email | Newsletter opt-in |
| Any assessment | Webinar invitation | 7 days | Email | Webinar registration |
| Council member | Referral request | 30 days | Email | Referral link shared |

**AI cross-sell optimization:**
- Predict best next product based on: assessment results, engagement pattern, cluster, job title, industry
- Predict optimal timing based on: historical acceptance rates by day-of-week, time-since-last-interaction
- Predict best channel based on: email open rate vs in-app notification engagement
- Confidence score shown: "87% confidence: suggest PRISM on Tuesday (peak acceptance day for LEAP graduates)"

### 2.4 B2B Signal Detection (expanded)

**Signal types (6):**

| Signal | Detection Logic | Confidence | Action |
|--------|----------------|------------|--------|
| **Executive Title** | Job title contains: Director, VP, C-level, Board, Managing Partner, Head of | High | Auto-create VISTA lead |
| **Large Company** | Company size > 500 employees (from LinkedIn enrichment or self-reported) | Medium | Create VISTA lead + notify BD |
| **Team Purchase** | 3+ people from same company domain purchase assessments within 90 days | High | Create VISTA lead (team opportunity) |
| **Consultation Request** | Contact requests 1:1, demo, or "talk to someone" | Very High | Urgent VISTA lead + Slack/Feishu alert |
| **Engagement Spike** | Engagement score increases > 40 points in 7 days (unusual activity) | Low-Medium | Flag for monitoring, create VISTA lead if sustained |
| **Referral from Member** | Existing Council member refers someone (referral link used) | High | Create VISTA lead + notify referrer's relationship manager |

**Signal detection pipeline:**

```
Contact Data Update / Assessment Submission / Activity Event
    │
    ├──→ Signal Scanner (cron: every 15 minutes)
    │       │
    │       ├──→ Check all 6 signal types
    │       │
    │       ├──→ If signal detected:
    │       │       │
    │       │       ├──→ Calculate confidence score
    │       │       │
    │       │       ├──→ If confidence ≥ threshold:
    │       │       │       │
    │       │       │       ├──→ Create record in b2b_signals table
    │       │       │       │
    │       │       │       ├──→ Check: Does contact already exist in VISTA?
    │       │       │       │       │
    │       │       │       │       ├──→ YES: Update existing lead with new signal
    │       │       │       │       │
    │       │       │       │       └──→ NO: Create new lead in vista_contacts
    │       │       │       │               source = 'WAVE_B2C'
    │       │       │       │               signal_data = {type, confidence, detected_at}
    │       │       │       │
    │       │       │       ├──→ Notify: Feishu message to BD team
    │       │       │       │
    │       │       │       └──→ Trigger: "B2B Routing" journey (if configured)
    │       │       │
    │       │       └──→ If confidence < threshold:
    │       │               │
    │       │               └──→ Log signal as "monitoring" — re-evaluate in 7 days
    │       │
    │       └──→ Log: All scans (signal/no-signal) for analytics
    │
    └──→ Weekly B2B Pipeline Report: signals detected, leads created, conversion rate
```

**B2B signal analytics:**

| Metric | Description |
|--------|-------------|
| Signals detected (week/month) | Total signals by type |
| Conversion to VISTA lead | % of signals that become qualified leads |
| Time from signal to lead creation | Speed of detection pipeline |
| B2C → B2B conversion rate | % of B2C contacts that generate B2B signal |
| Revenue from B2B-routed leads | Track deal value from WAVE-sourced leads |
| Signal accuracy | % of VISTA leads from WAVE that progress to opportunity |

### 2.5 Execution Engine (expanded)

**Execution architecture:**

```
┌────────────────────────────────────────────────────────────────┐
│                    JOURNEY EXECUTION ENGINE                     │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Cron Job (every 5 minutes):                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 1. Fetch all active journey_instances where:             │  │
│  │    - status = 'in_progress'                             │  │
│  │    - next_execution_at <= NOW()                         │  │
│  │ 2. For each instance (batch of 100):                    │  │
│  │    a. Load current node                                 │  │
│  │    b. Execute node action:                              │  │
│  │       - trigger: mark as entered                        │  │
│  │       - email: call Distribution to send                │  │
│  │       - wait: set next_execution_at = now + delay       │  │
│  │       - condition: evaluate → pick branch               │  │
│  │       - action: execute (tag, update, webhook, notify)  │  │
│  │       - cross_sell: create suggestion + schedule email  │  │
│  │       - signal_check: run signal scanner for contact    │  │
│  │       - split: random/weighted → pick branch            │  │
│  │       - end: mark instance as completed                 │  │
│  │    c. Log event to journey_events                       │  │
│  │    d. Advance to next node (update current_node_id)     │  │
│  │    e. Update instance status if needed                  │  │
│  │ 3. Error handling:                                      │  │
│  │    - Failed action → retry (max 3x, exponential backoff)│  │
│  │    - After 3 failures → mark node as 'error'            │  │
│  │    - Notify journey owner                               │  │
│  │ 4. Performance:                                         │  │
│  │    - Track execution time per node                      │  │
│  │    - Alert if batch takes > 4 minutes                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Realtime Subscription:                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ - New journey events → update live activity feed         │  │
│  │ - Instance status changes → update journey metrics       │  │
│  │ - Error events → highlight on canvas (red node)          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Background Jobs:                                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 1. execute_journey_nodes (every 5 min) — main engine     │  │
│  │ 2. detect_b2b_signals (every 15 min) — signal scanner    │  │
│  │ 3. evaluate_journey_health (hourly) — health scores      │  │
│  │ 4. clean_completed_instances (daily) — archive old data  │  │
│  │ 5. generate_journey_report (daily) — daily digest        │  │
│  │ 6. detect_stuck_contacts (every 30 min) — alert on waits │  │
│  │ 7. sync_cross_sell_metrics (hourly) — cross-sell perf    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

**Journey instance states:**

```
                    ┌──────────┐
                    │ pending  │ (triggered, waiting to start)
                    └────┬─────┘
                         │
                    ┌────▼─────┐
              ┌─────│ in_progress│◄────┐
              │     └────┬─────┘      │
              │          │             │ (next node)
              │     ┌────▼─────┐      │
              │     │ executing │──────┘
              │     └────┬─────┘
              │          │
         ┌────▼────┐  ┌──▼───────┐  ┌─────────┐
         │ waiting  │  │ completed │  │ dropped │
         │ (delay)  │  └──────────┘  └─────────┘
         └────┬────┘
              │ (delay elapsed)
              │
         ┌────▼─────┐
         │ in_progress│ (advance to next node)
         └──────────┘

    Special states:
    - error: node execution failed after 3 retries
    - paused: journey paused while instance active
    - suppressed: contact added to suppression list mid-journey
```

### 2.6 Journey Analytics (expanded)

**Analytics views:**

| View | Description |
|------|-------------|
| Funnel | Vertical funnel: entered → step 1 → step 2 → ... → completed. Show count and % at each step. Highlight biggest drop-off. |
| Drop-off Heatmap | Visual journey map with color-coded nodes: green (high pass-through), amber (moderate drop), red (high drop-off) |
| Cohort Analysis | Group by entry week/month → compare completion rates over time |
| Time-in-Stage | Box plot: how long contacts spend at each node. Outliers highlighted. |
| Conversion by Trigger | Compare entry triggers: which trigger produces highest completion? |
| Cross-Sell Funnel | Specific view for cross-sell journeys: suggested → opened → clicked → started → completed |
| B2B Signal Report | Signals detected → leads created → opportunities → revenue |
| Journey Comparison | Side-by-side: compare two journeys on all metrics |

**Funnel wireframe:**

```
┌─────────────────────────────────────────────────────────────────┐
│ Journey Funnel: Welcome Journey                                  │
│ Period: [Last 30 days ▼]    [Export CSV]  [Compare ▼]          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Entered Journey                                   342   │   │
│  │  ████████████████████████████████████████████████  100%  │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  ✅ Welcome Email Sent                              335   │   │
│  │  ███████████████████████████████████████████████   98%   │   │
│  │  (7 didn't receive — invalid email)                     │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  📧 Email Opened                                    298   │   │
│  │  ████████████████████████████████████████████      87%   │   │
│  │  (37 opened but took >48h — consider earlier send?)     │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  🔗 Link Clicked                                    147   │   │
│  │  ███████████████████████████████████               43%   │   │
│  │  ⚠ BIGGEST DROP-OFF — CTA clarity?                      │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  ⏳ Wait 3 Days (completed)                         142   │   │
│  │  ██████████████████████████████████                41%   │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  📧 Tips Email Sent                                 142   │   │
│  │  ██████████████████████████████████                41%   │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  🔀 Condition: Visited Dashboard?                   142   │   │
│  │  ├── YES (89):  → Continue to next email                │   │
│  │  └── NO (53):   → Send nudge email                      │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  ✅ Journey Completed                                67   │   │
│  │  █████████████████████████                         20%   │   │
│  │  (of those who clicked: 45% completed)                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Key Metrics:                                                    │
│  • Entry-to-completion: 20% (target: 35%)                      │
│  • Avg time to complete: 8.3 days                              │
│  • Biggest drop-off: After welcome email (57% didn't click)    │
│  • AI Recommendation: Simplify CTA in welcome email —         │
│    journeys with clearer CTA have 2.3x higher click rate      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Journey health score calculation:**

| Component | Weight | Scoring |
|-----------|--------|---------|
| Completion rate | 30% | >50% = 100, 30-50% = 70, <30% = 40 |
| Drop-off severity | 20% | No node >40% drop = 100, one node >60% = 50 |
| Error rate | 15% | 0% errors = 100, >5% errors = 30 |
| Engagement quality | 15% | Open rate >40% + CTR >15% = 100 |
| Timeliness | 10% | Avg completion within target days = 100 |
| B2B signal yield | 10% | Signals detected > 5/week = 100 |

### 2.7 Journey Templates (expanded)

**Pre-built templates (8):**

| Template | Nodes | Trigger | Description |
|----------|-------|---------|-------------|
| **Welcome Onboarding** | 6 | On registration | Welcome email → wait 1d → tips email → wait 3d → dashboard nudge → complete |
| **Assessment Nurture** | 8 | Assessment complete | Results email → wait 7d → insights → wait 7d → cross-sell → reminder → complete |
| **Cross-Sell Chain** | 5 | Previous journey complete | Suggest next product → wait 7d → check → follow-up → complete/route |
| **Re-Engagement** | 5 | Score < 30 or 30d inactive | "We miss you" → wait 3d → incentive → wait 5d → final → complete/drop |
| **Webinar Follow-up** | 7 | Webinar attendance | Thank you → wait 1d → replay → wait 3d → resources → wait 5d → CTA → complete |
| **B2B Router** | 4 | B2B signal detected | Enrich data → check VISTA → create lead → notify team → complete |
| **Council Invite** | 6 | BRIDGE complete | Personal invite → wait 3d → benefits → wait 5d → testimonial → wait 7d → final → complete |
| **Custom (Blank)** | 1 (trigger only) | Any | Start from scratch with trigger node |

**Template customization:**
- Select template → canvas pre-populated with nodes
- All nodes inline-editable (change emails, delays, conditions)
- Save customized version as new template
- Template versioning (track changes from original)

---

## 3. User Requirements

### 3.1 User Roles & Needs

| Role | Primary Need | Secondary Need |
|------|-------------|---------------|
| **Kevin** (Executive) | Journey health at a glance. B2B signals pipeline. Revenue from cross-sell. | Ability to pause/activate journeys. Override AI recommendations. |
| **Echo** (Marketing) | Build and optimize journeys. Content within journey emails. Cross-sell performance. | Template management. A/B test journey paths. |
| **NEXUS** (Agent) | Automated execution. Signal detection. Anomaly alerts. | API access for journey creation. Event webhooks. |
| **Carl** (Webinar) | Webinar follow-up journey setup. Attendance tracking → journey trigger. | Coordinate content with journey emails. |
| **BD Team** (B2B) | B2B signal alerts. Lead quality data from journey context. | Access to journey history per B2B prospect. |

### 3.2 Key User Flows

**Flow 1: Create a new journey from template**
```
[+ New Journey] → [From Template] → Select "Welcome Onboarding"
    → Canvas pre-populated with 6 nodes
    → Inline edit: change email subjects, content, delays
    → [Test Journey] → Simulate with test contact
    → [Activate] → Journey starts accepting entries
    → Live activity feed shows first entries
    Total: ~15 minutes (with guided setup: ~8 minutes)
```

**Flow 2: Diagnose and fix a dropping journey**
```
Dashboard shows: "⚡ Welcome Journey has 23 stuck at Step 3"
    → Click [→ Fix Now] → Opens journey canvas, auto-zooms to stuck node
    → Node detail shows: 23 contacts waiting > 48h at "Wait 3 days"
    → AI recommendation: "Delay is working correctly, but 18/23 haven't opened Email 2"
    → Action: [Edit Email Subject] → [A/B Test New Subject] → [Apply]
    → Monitor: Live feed shows new opens coming in
    Total: ~5 minutes from alert to fix
```

**Flow 3: B2B signal detected and routed**
```
Signal scanner detects: "Sarah K. → Title: VP of Operations → Company: 2,400 employees"
    → B2B Signal node in journey fires
    → Auto-create VISTA lead: "Sarah K., VP Ops, Large Enterprise"
    → Feishu notification to BD: "New B2B signal from WAVE: Sarah K."
    → Journey continues: Sarah receives B2B-specific content
    → BD team sees lead in VISTA with full journey context
    Total: Automatic — 15 minutes from detection to notification
```

**Flow 4: Cross-sell chain execution**
```
Contact completes LEAP assessment
    → Cross-sell journey triggers
    → Wait 7 days → Check engagement → Send PRISM suggestion
    → Contact opens email (tracked) → Clicks PRISM link (tracked)
    → Contact starts PRISM → Cross-sell journey marks "accepted"
    → Wait for PRISM completion → Suggest BRIDGE
    → Chain continues: LEAP → PRISM → BRIDGE → Council
    Total: Automatic — tracks full lifecycle over weeks
```

---

## 4. UX Requirements

### 4.1 Page Layout (applying INFRA components)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [← Back]  B2C Journey Engine              [🔍 Search] [Filter ▼] [+ New ▼] │
│                                                                              │
│  ┌─── NEXT ACTION ─────────────────────────────────────────────────────────┐ │
│  │ ⚡ 23 contacts stuck in Welcome Journey at "Tips Email" (48h+ wait)    │ │
│  │    [→ Open Journey]  [→ Send Nudge]  [→ Dismiss]                       │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌─── JOURNEY HEALTH ──── [INFRA-112] ────────────────────────────────────┐ │
│  │                                                                         │ │
│  │   78/100    Active: 3    In Journeys: 147    B2B Signals: 4 (week)    │ │
│  │   ████░     Paused: 1    Avg Completion: 34%  Cross-sell Rate: 28%    │ │
│  │             Draft: 2                                                 │ │
│  │   [Click for breakdown ↓]                                            │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌─── JOURNEY OVERVIEW ─────────────── [List View] [Board View] [Canvas] ──┐│
│  │                                                                          ││
│  │  (See Section 2.1 canvas wireframe for full layout)                     ││
│  │                                                                          ││
│  │  Canvas is the primary view. List and Board are alternatives.           ││
│  │  Split view: Canvas (left, resizable) + Detail Panel (right).           ││
│  │  Focus mode: Hide list, show only one journey canvas.                   ││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─── ANALYTICS PANEL (collapsible, bottom) ──────────────────────────────┐ │
│  │  [Funnel] [Drop-off Map] [Cohort] [Time-in-Stage] [Cross-sell] [B2B]  │ │
│  │                                                                         │ │
│  │  (Analytics content — see Section 2.6 funnel wireframe)                │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌─── LIVE ACTIVITY FEED (collapsible, right sidebar) ────────────────────┐ │
│  │  🟢 Sarah K. completed "Welcome Email" — 2 min ago                    │ │
│  │  🟢 Marcus T. entered (registered) — 5 min ago                        │ │
│  │  🟡 Priya R. stuck at wait — 2d 14h remaining                        │ │
│  │  🔴 3 contacts dropped at condition — no match                        │ │
│  │  📡 B2B Signal: VP title detected (Acme Corp) — 12 min ago           │ │
│  │  🔄 Cross-sell: LEAP → PRISM suggested to 8 contacts — 1h ago        │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  [INFRA-103] Next Milestone: "Onboard 500 users by Jul 31"                 │
│              342/500 (68%) → 3 journeys contributing → [→ View Progress]    │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Empty States

| Context | Empty State Message |
|---------|-------------------|
| No journeys at all | "No journeys yet. Create your first automated flow → [From Template] [Guided Setup] [Blank Canvas]" |
| No active journeys | "No active journeys. You have {N} drafts ready to activate. [View Drafts]" |
| No analytics | "Activate a journey to see analytics. Journey data appears here once contacts start flowing." |
| No B2B signals | "No B2B signals detected yet. Signals are scanned every 15 minutes from contact data and activity." |
| Journey canvas empty | "Drag nodes from the palette to build your journey. Start with a Trigger node. [Show Me How]" |
| No cross-sell configured | "No cross-sell journeys. After someone completes LEAP, suggest PRISM automatically. [Set Up Cross-Sell]" |

### 4.3 Interaction Patterns

| Interaction | Behavior |
|-------------|----------|
| Click journey card | Expand canvas below (inline, not page navigation). Canvas loads saved state (zoom, pan, selected node). |
| Click node on canvas | Open detail panel inline (right side). All config editable. Changes auto-save. |
| Drag node from palette to canvas | Create new node at drop position. Auto-connect to nearest node (or prompt to connect). |
| Drag from one node to another | Create edge (arrow) between nodes. If edge exists, replace it. |
| Double-click node name | Inline rename. Enter to save. Escape to cancel. |
| Right-click node | Context menu: Edit, Delete, Duplicate, Disconnect, Add After, Add Before |
| Scroll on canvas | Pan the canvas. Scroll wheel = zoom. Shift+scroll = horizontal pan. |
| Cmd+Z / Cmd+Shift+Z | Undo / Redo canvas changes (node add, delete, move, connect, config change) |
| Cmd+S | Force save canvas state (auto-save runs every 30s anyway) |
| Delete key | Delete selected node(s) and connected edges. Confirmation if journey is active. |
| Space | Toggle Focus Mode (hide everything except this journey canvas) |
| Tab / Shift+Tab | Navigate between nodes on canvas |
| Drag contact from activity feed → Distribution tab | Create enrollment in a sequence |

---

## 5. Design Requirements

### 5.1 Component Design Specs

**Journey Card (in list view):**

| Property | Value |
|----------|-------|
| Width | Full container width |
| Height | Auto (min 72px) |
| Padding | 16px horizontal, 12px vertical |
| Border | 1px var(--color-border), radius 8px |
| Background | var(--color-card) |
| Hover | var(--color-background-alt) |
| Status dot | 8px circle: green (active), amber (paused), gray (draft), red (error) |
| Health bar | 48px wide, 4px tall, color-coded: green (>70), amber (40-70), red (<40) |
| Node count badge | 20px pill, bg var(--color-background-alt), text 11px |
| Enrolled count | 13px, monospace font for numbers |
| Completion rate | 13px, color-coded: green (>50%), amber (25-50%), red (<25%) |
| Quick actions | Appear on hover: Edit, Activate/Pause, Duplicate, More |

**Canvas Node:**

| Property | Value |
|----------|-------|
| Size | 140px × 80px (default), resizable |
| Border | 2px solid, color by type: trigger=#C108AB, email=#2563EB, wait=#F59E0B, condition=#10B981, action=#6366F1, cross-sell=#8B5CF6, signal=#EF4444, end=#6B7280 |
| Radius | 12px |
| Shadow | 0 2px 8px rgba(0,0,0,0.08) |
| Selected | 2px border + 0 0 0 3px rgba(193,8,171,0.2) |
| Error | Red border pulsing animation (1s infinite) |
| Icon | 24px emoji (from node type table) |
| Title | 13px semibold, single line, truncate with ellipsis |
| Metric line | 11px, muted color: "342 entered" or "98% sent" |
| Connection points | 8px circles: top, bottom, left, right. Appear on hover. |

**Edge (arrow between nodes):**

| Property | Value |
|----------|-------|
| Stroke | 2px, color var(--color-foreground-muted) |
| Selected | 3px, color var(--color-accent) |
| Animated (active flow) | Dashed line with moving dash pattern (1s linear infinite) |
| Label | 11px pill on edge midpoint: "89% pass" or "Wait 3d" |
| Arrow head | 8px filled triangle |

**Health Score Display:**

| Property | Value |
|----------|-------|
| Size | 48px diameter circle |
| Score text | 20px bold, centered |
| Ring | 4px stroke, color: green (>70), amber (40-70), red (<40) |
| Background | var(--color-card) |
| Hover | Expand to show breakdown: 6 components with mini bars |

### 5.2 Animation Specifications

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| Node appear | 200ms | ease-out | When adding node to canvas |
| Node select | 150ms | ease-in-out | Border + shadow on click |
| Edge draw | 300ms | ease-out | When connecting two nodes |
| Contact flow | 500ms | ease-in-out | Dot moving along edge in live view |
| Health pulse | 1000ms | ease-in-out | Error node red border pulsing |
| Panel expand | 250ms | ease-out | Node detail panel slide-in |
| Canvas zoom | 200ms | ease-out | Zoom in/out on scroll |
| Drop-off flash | 400ms | ease-in-out | Red flash on high-drop-off node |

### 5.3 Keyboard Navigation

| Shortcut | Action |
|----------|--------|
| `N` | New journey |
| `F` | Toggle Focus Mode |
| `Cmd+Z` | Undo canvas change |
| `Cmd+Shift+Z` | Redo canvas change |
| `Cmd+S` | Force save |
| `Cmd+A` | Select all nodes |
| `Delete` / `Backspace` | Delete selected node(s) |
| `Cmd+D` | Duplicate selected node |
| `Space` | Pan mode (hold to drag canvas) |
| `+` / `-` | Zoom in / out |
| `0` | Reset zoom to 100% |
| `Cmd+0` | Fit all nodes in view |
| `Tab` / `Shift+Tab` | Navigate between nodes |
| `Enter` | Open selected node detail |
| `Escape` | Close detail panel / deselect |
| `Cmd+F` | Search within journey (find node by name) |
| `Cmd+K` | Command palette (journey-specific actions) |

### 5.4 Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| ≥ 1440px | Full layout: journey list + canvas + detail panel + activity feed |
| 1024-1439px | Journey list + canvas + detail panel. Activity feed collapsed to icon. |
| 768-1023px | Canvas full-width. Detail panel as bottom sheet. List as drawer. |
| < 768px | List view only (no canvas). Tap journey → detail view. Simplified node list (no drag-drop). |

---

## 6. Technical Backend Wiring

### 6.1 Supabase Schema (new tables)

```sql
-- ============================================================
-- JOURNEY ENGINE TABLES
-- ============================================================

-- Core journey definition
CREATE TABLE journeys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
    trigger_type TEXT NOT NULL CHECK (trigger_type IN (
        'on_registration', 'on_assessment_complete', 'on_content_viewed',
        'on_event_registered', 'on_score_changed', 'on_time_based',
        'on_manual', 'on_b2b_signal', 'on_cross_sell', 'on_webhook'
    )),
    trigger_config JSONB DEFAULT '{}',
    category TEXT NOT NULL DEFAULT 'custom' CHECK (category IN (
        'onboarding', 'nurture', 'cross_sell', 're_engagement',
        'event_followup', 'b2b_routing', 'custom'
    )),
    campaign_id UUID REFERENCES campaigns(id),
    owner_id UUID REFERENCES auth.users(id),
    template_id UUID REFERENCES journey_templates(id),
    priority_score FLOAT DEFAULT 0,
    health_score FLOAT DEFAULT 0,
    canvas_state JSONB DEFAULT '{"zoom": 1, "panX": 0, "panY": 0}',
    allow_multi_enrollment BOOLEAN DEFAULT false,
    max_instances INTEGER DEFAULT 10000,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journey nodes (visual builder)
CREATE TABLE journey_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journey_id UUID NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
    node_type TEXT NOT NULL CHECK (node_type IN (
        'trigger', 'email', 'wait', 'condition', 'action',
        'cross_sell', 'signal_check', 'webhook', 'sms',
        'notification', 'split', 'end'
    )),
    name TEXT,
    config JSONB NOT NULL DEFAULT '{}',
    position_x FLOAT NOT NULL DEFAULT 0,
    position_y FLOAT NOT NULL DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journey edges (connections between nodes)
CREATE TABLE journey_edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journey_id UUID NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
    from_node_id UUID NOT NULL REFERENCES journey_nodes(id) ON DELETE CASCADE,
    to_node_id UUID NOT NULL REFERENCES journey_nodes(id) ON DELETE CASCADE,
    condition JSONB,  -- Optional: only traverse if condition met
    label TEXT,
    is_default_branch BOOLEAN DEFAULT false,  -- For condition nodes: default path
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(journey_id, from_node_id, to_node_id)
);

-- Journey instances (per-contact execution)
CREATE TABLE journey_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journey_id UUID NOT NULL REFERENCES journeys(id),
    contact_id UUID NOT NULL REFERENCES contacts(id),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'in_progress', 'waiting', 'executing',
        'completed', 'dropped', 'error', 'paused', 'suppressed'
    )),
    current_node_id UUID REFERENCES journey_nodes(id),
    entered_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    next_execution_at TIMESTAMPTZ,
    retry_count INTEGER DEFAULT 0,
    error_message TEXT,
    context JSONB DEFAULT '{}',  -- Contact data snapshot at entry
    UNIQUE(journey_id, contact_id)  -- Prevent duplicate enrollment (unless allow_multi_enrollment)
);

-- Journey events (audit trail + analytics)
CREATE TABLE journey_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID NOT NULL REFERENCES journey_instances(id) ON DELETE CASCADE,
    journey_id UUID NOT NULL REFERENCES journeys(id),
    node_id UUID REFERENCES journey_nodes(id),
    event_type TEXT NOT NULL CHECK (event_type IN (
        'entered', 'node_entered', 'node_completed', 'node_failed',
        'email_sent', 'email_opened', 'email_clicked',
        'wait_started', 'wait_completed',
        'condition_evaluated', 'branch_taken',
        'action_executed', 'cross_sell_suggested',
        'cross_sell_accepted', 'cross_sell_ignored',
        'b2b_signal_detected', 'lead_created',
        'split_assigned', 'journey_completed', 'journey_dropped',
        'error', 'retry', 'suppressed'
    )),
    event_data JSONB DEFAULT '{}',
    occurred_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journey templates (pre-built flows)
CREATE TABLE journey_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    node_count INTEGER DEFAULT 0,
    is_system BOOLEAN DEFAULT true,  -- System templates can't be deleted
    nodes_json JSONB NOT NULL DEFAULT '[]',  -- Serialized node + edge template
    thumbnail_url TEXT,
    times_used INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- B2B signals detected
CREATE TABLE b2b_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES contacts(id),
    signal_type TEXT NOT NULL CHECK (signal_type IN (
        'executive_title', 'large_company', 'team_purchase',
        'consultation_request', 'engagement_spike', 'member_referral'
    )),
    confidence_score FLOAT NOT NULL DEFAULT 0,
    signal_data JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'detected' CHECK (status IN (
        'detected', 'verified', 'routed_to_vista', 'converted', 'dismissed', 'monitoring'
    )),
    vista_contact_id UUID,  -- Link to VISTA lead if created
    routed_at TIMESTAMPTZ,
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cross-sell tracking
CREATE TABLE cross_sell_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES contacts(id),
    source_assessment TEXT NOT NULL,  -- e.g., 'LEAP'
    suggested_assessment TEXT NOT NULL,  -- e.g., 'PRISM'
    journey_id UUID REFERENCES journeys(id),
    channel TEXT NOT NULL DEFAULT 'email' CHECK (channel IN ('email', 'in_app', 'sms')),
    status TEXT NOT NULL DEFAULT 'suggested' CHECK (status IN (
        'suggested', 'delivered', 'opened', 'clicked', 'accepted', 'ignored', 'expired'
    )),
    suggested_at TIMESTAMPTZ DEFAULT NOW(),
    acted_at TIMESTAMPTZ,
    ai_confidence FLOAT,  -- AI prediction confidence
    ai_reasoning TEXT  -- Why this suggestion was made
);

-- RLS Policies
ALTER TABLE journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE cross_sell_suggestions ENABLE ROW LEVEL SECURITY;

-- Read access for authenticated users
CREATE POLICY "Authenticated users can read journeys" ON journeys FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read journey_nodes" ON journey_nodes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read journey_edges" ON journey_edges FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read journey_instances" ON journey_instances FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read journey_events" ON journey_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read journey_templates" ON journey_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read b2b_signals" ON b2b_signals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read cross_sell_suggestions" ON cross_sell_suggestions FOR SELECT TO authenticated USING (true);

-- Write access for authenticated users
CREATE POLICY "Authenticated users can manage journeys" ON journeys FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage journey_nodes" ON journey_nodes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage journey_edges" ON journey_edges FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage journey_instances" ON journey_instances FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage journey_events" ON journey_events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage b2b_signals" ON b2b_signals FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage cross_sell_suggestions" ON cross_sell_suggestions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_journeys_status ON journeys(status);
CREATE INDEX idx_journeys_trigger_type ON journeys(trigger_type);
CREATE INDEX idx_journey_instances_journey ON journey_instances(journey_id);
CREATE INDEX idx_journey_instances_contact ON journey_instances(contact_id);
CREATE INDEX idx_journey_instances_status ON journey_instances(status);
CREATE INDEX idx_journey_instances_next_exec ON journey_instances(next_execution_at) WHERE status = 'waiting';
CREATE INDEX idx_journey_events_instance ON journey_events(instance_id);
CREATE INDEX idx_journey_events_type ON journey_events(event_type);
CREATE INDEX idx_journey_events_occurred ON journey_events(occurred_at);
CREATE INDEX idx_b2b_signals_contact ON b2b_signals(contact_id);
CREATE INDEX idx_b2b_signals_status ON b2b_signals(status);
CREATE INDEX idx_cross_sell_contact ON cross_sell_suggestions(contact_id);
CREATE INDEX idx_cross_sell_status ON cross_sell_suggestions(status);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE journey_instances;
ALTER PUBLICATION supabase_realtime ADD TABLE journey_events;
ALTER PUBLICATION supabase_realtime ADD TABLE b2b_signals;
```

### 6.2 API Routes

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/journeys` | List all journeys (filter: status, category, trigger_type) | Required |
| POST | `/api/journeys` | Create new journey | Required |
| GET | `/api/journeys/[id]` | Get journey with nodes + edges | Required |
| PATCH | `/api/journeys/[id]` | Update journey metadata | Required |
| DELETE | `/api/journeys/[id]` | Delete journey (soft) | Required |
| POST | `/api/journeys/[id]/activate` | Activate journey | Required |
| POST | `/api/journeys/[id]/pause` | Pause journey | Required |
| POST | `/api/journeys/[id]/duplicate` | Duplicate journey | Required |
| GET | `/api/journeys/[id]/nodes` | Get all nodes for journey | Required |
| POST | `/api/journeys/[id]/nodes` | Add node to journey | Required |
| PATCH | `/api/journeys/[id]/nodes/[nodeId]` | Update node config/position | Required |
| DELETE | `/api/journeys/[id]/nodes/[nodeId]` | Remove node from journey | Required |
| GET | `/api/journeys/[id]/edges` | Get all edges for journey | Required |
| POST | `/api/journeys/[id]/edges` | Create edge between nodes | Required |
| DELETE | `/api/journeys/[id]/edges/[edgeId]` | Remove edge | Required |
| GET | `/api/journeys/[id]/instances` | List instances (filter: status, contact) | Required |
| GET | `/api/journeys/[id]/instances/[instId]/events` | Get event timeline for instance | Required |
| GET | `/api/journeys/[id]/analytics` | Get journey analytics (funnel, drop-off, cohort) | Required |
| GET | `/api/journeys/[id]/health` | Get health score breakdown | Required |
| POST | `/api/journeys/[id]/test` | Run test simulation with test contact | Required |
| GET | `/api/journey-templates` | List available templates | Required |
| POST | `/api/journeys/from-template` | Create journey from template | Required |
| GET | `/api/b2b-signals` | List B2B signals (filter: status, type, date) | Required |
| GET | `/api/b2b-signals/stats` | B2B signal statistics | Required |
| POST | `/api/b2b-signals/[id]/route` | Manually route signal to VISTA | Required |
| GET | `/api/cross-sell` | List cross-sell suggestions | Required |
| GET | `/api/cross-sell/stats` | Cross-sell performance stats | Required |
| POST | `/api/journeys/execute` | Manual execution trigger (for cron) | Service Role |
| POST | `/api/journeys/webhook/[secret]` | Webhook entry point for external triggers | Webhook Secret |

**Key API response examples:**

```typescript
// GET /api/journeys/[id]/analytics
{
  "journey_id": "uuid",
  "period": { "start": "2026-07-01", "end": "2026-07-11" },
  "funnel": [
    { "node_id": "uuid", "node_name": "Welcome Email", "entered": 342, "completed": 335, "pass_rate": 0.98 },
    { "node_id": "uuid", "node_name": "Wait 1 day", "entered": 335, "completed": 335, "pass_rate": 1.0 },
    { "node_id": "uuid", "node_name": "Tips Email", "entered": 335, "completed": 298, "pass_rate": 0.89 },
    { "node_id": "uuid", "node_name": "Link Clicked", "entered": 298, "completed": 147, "pass_rate": 0.49 },
    { "node_id": "uuid", "node_name": "Condition: Dashboard Visit", "entered": 147, "completed": 142, "pass_rate": 0.97 },
    { "node_id": "uuid", "node_name": "Journey Complete", "entered": 142, "completed": 67, "pass_rate": 0.47 }
  ],
  "biggest_drop_off": {
    "node_id": "uuid",
    "node_name": "Link Clicked",
    "drop_rate": 0.51,
    "recommendation": "Simplify CTA in Tips Email — journeys with clearer CTA have 2.3x higher click rate"
  },
  "metrics": {
    "total_entered": 342,
    "total_completed": 67,
    "completion_rate": 0.196,
    "avg_completion_days": 8.3,
    "health_score": 78
  },
  "cohorts": [
    { "week": "2026-W27", "entered": 89, "completed": 20, "rate": 0.225 },
    { "week": "2026-W28", "entered": 124, "completed": 28, "rate": 0.226 },
    { "week": "2026-W29", "entered": 129, "completed": 19, "rate": 0.147 }
  ]
}

// GET /api/b2b-signals/stats
{
  "period": { "start": "2026-07-01", "end": "2026-07-11" },
  "total_detected": 12,
  "by_type": {
    "executive_title": 5,
    "large_company": 3,
    "team_purchase": 1,
    "consultation_request": 2,
    "engagement_spike": 1,
    "member_referral": 0
  },
  "routed_to_vista": 8,
  "converted_to_opportunity": 2,
  "avg_confidence": 0.82,
  "avg_time_to_route_minutes": 17
}
```

### 6.3 Realtime Subscriptions

```typescript
// Subscribe to journey execution events (live activity feed)
const journeyEventsSubscription = supabase
  .channel('journey-events')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'journey_events',
    filter: `journey_id=eq.${activeJourneyId}`
  }, (payload) => {
    // Add to live activity feed
    addActivityEvent(payload.new);
    // Update node metrics on canvas
    updateNodeMetrics(payload.new.node_id, payload.new.event_type);
    // Update journey health
    recalculateHealth(activeJourneyId);
  })
  .subscribe();

// Subscribe to B2B signals (real-time alert)
const b2bSignalsSubscription = supabase
  .channel('b2b-signals')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'b2b_signals'
  }, (payload) => {
    // Show notification
    showNotification(`📡 B2B Signal: ${payload.new.signal_type} detected`);
    // Update B2B signals panel
    refreshB2BSignals();
  })
  .subscribe();

// Subscribe to instance status changes (for canvas live view)
const instanceSubscription = supabase
  .channel('journey-instances')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'journey_instances',
    filter: `journey_id=eq.${activeJourneyId}`
  }, (payload) => {
    // Animate contact moving through nodes on canvas
    animateContactFlow(payload.new.contact_id, payload.new.current_node_id);
    // Update node counts
    updateNodeInstanceCounts(activeJourneyId);
  })
  .subscribe();
```

### 6.4 Background Jobs

| Job | Schedule | Description |
|-----|----------|-------------|
| `execute_journey_nodes` | Every 5 minutes | Main execution engine: process waiting instances |
| `detect_b2b_signals` | Every 15 minutes | Scan contact data + activity for B2B signals |
| `evaluate_journey_health` | Every hour | Recalculate health scores for all active journeys |
| `detect_stuck_contacts` | Every 30 minutes | Find contacts waiting longer than expected |
| `sync_cross_sell_metrics` | Every hour | Update cross-sell suggestion statuses |
| `clean_completed_instances` | Daily (2am) | Archive instances completed > 90 days ago |
| `generate_journey_report` | Daily (8am) | Generate daily digest: new entries, completions, signals, issues |

### 6.5 Performance Budget

| Metric | Target |
|--------|--------|
| Journey list load | < 500ms (up to 100 journeys) |
| Canvas render (50 nodes) | < 800ms |
| Canvas render (200 nodes) | < 2s (with virtualization) |
| Node drag (60fps) | Maintain 60fps during drag |
| Instance creation | < 200ms |
| Event logging | < 100ms (async) |
| Analytics computation | < 3s (cached after first load) |
| Realtime event delivery | < 500ms from DB write to UI update |

---

## 7. AI Layer Specification

### 7.1 AI Personas

**Persona 1: Journey Optimizer**

```yaml
name: "Journey Optimizer"
role: "Analyze journey performance and recommend optimizations"
model: "deepseek-chat"
temperature: 0.3
max_tokens: 1000
system_prompt: |
  You are a customer journey optimization expert for LYC Partners.
  You analyze journey performance data and provide actionable recommendations.
  Focus on: reducing drop-off, improving completion rates, optimizing timing,
  and maximizing cross-sell conversion.
  Be specific: reference actual node names, percentages, and contact counts.
  Recommend A/B tests when sample sizes are sufficient.
  Prioritize recommendations by impact (number of contacts affected × expected improvement).
```

**Prompt template — Journey diagnosis:**
```
Analyze this journey performance data:

Journey: {journey_name}
Period: {start_date} to {end_date}
Total entered: {total_entered}
Total completed: {total_completed} ({completion_rate}%)

Funnel:
{funnel_data}

Biggest drop-off: {drop_off_node} ({drop_off_rate}% lost)

Contact engagement:
- Email open rate: {open_rate}%
- Email click rate: {click_rate}%
- Avg time in journey: {avg_days} days

Provide:
1. Root cause analysis for the biggest drop-off
2. Top 3 recommendations (ranked by impact)
3. Specific A/B test suggestion (if sample size > 100)
4. Predicted improvement if recommendations implemented
```

**Persona 2: Cross-Sell Predictor**

```yaml
name: "Cross-Sell Predictor"
role: "Predict optimal cross-sell timing and product for each contact"
model: "deepseek-chat"
temperature: 0.2
max_tokens: 500
system_prompt: |
  You are a product cross-sell prediction engine for LYC Partners.
  You predict which product to suggest next, when to suggest it, and via which channel.
  Products: LEAP (self-assessment) → PRISM (team assessment) → BRIDGE (program) → Council (membership)
  Consider: assessment results, engagement pattern, cluster, job title, time since last interaction.
  Output confidence scores (0-1) for each recommendation.
  Always explain reasoning briefly.
```

**Prompt template — Cross-sell prediction:**
```
Contact profile:
- Name: {contact_name}
- Last assessment: {assessment_name} (completed {days_ago} days ago)
- Score: {score}/100
- Cluster: {cluster}
- Job title: {job_title}
- Email open rate: {email_open_rate}%
- Last active: {last_active}
- Previous purchases: {purchases}

Available next products: {available_products}

Provide:
1. Recommended next product (with confidence 0-1)
2. Optimal send day (with reasoning)
3. Optimal channel (email vs in-app)
4. Personalization angle (what to reference in the suggestion email)
```

**Persona 3: B2B Signal Analyst**

```yaml
name: "B2B Signal Analyst"
role: "Evaluate B2B signal confidence and recommend routing actions"
model: "deepseek-chat"
temperature: 0.2
max_tokens: 400
system_prompt: |
  You are a B2B signal evaluation expert for LYC Partners.
  You assess whether a B2C contact shows genuine B2B potential.
  Consider: job title seniority, company size, engagement depth, team patterns.
  Rate confidence 0-1. Recommend: route to VISTA, monitor, or dismiss.
  Be conservative — false positives waste BD team time.
```

### 7.2 AI Insight Types

| Insight | Trigger | Output |
|---------|---------|--------|
| **Drop-off diagnosis** | Completion rate drops below 25% | Root cause analysis + 3 recommendations |
| **Timing optimization** | Journey has been active for 2+ weeks | Better timing suggestion with predicted improvement |
| **Cross-sell prediction** | Assessment completed | Next product + timing + channel + confidence |
| **B2B signal evaluation** | Signal detected (cron) | Confidence score + route/monitor/dismiss recommendation |
| **Stuck contact alert** | Contact waiting > 2x expected duration | Alert + suggested action (nudge, remove, extend) |
| **Journey health decline** | Health score drops > 15 points in 7 days | Decline analysis + recovery recommendations |
| **A/B test result** | A/B test reaches statistical significance | Winner declaration + metrics + rollout recommendation |
| **Template suggestion** | User creates new journey | Recommend closest template based on trigger + category |

---

## 8. Tickets

### Phase 1: P0 — Core Journey Builder + Execution (82h / ~3 weeks)

| Ticket | Title | Priority | Effort | Dependencies |
|--------|-------|----------|--------|--------------|
| JOUR-001 | Supabase `journeys` table + RLS policies + indexes | P0 | 3h | TICKET-002 |
| JOUR-002 | Supabase `journey_nodes` + `journey_edges` tables | P0 | 3h | JOUR-001 |
| JOUR-003 | Supabase `journey_instances` + `journey_events` tables | P0 | 3h | JOUR-002 |
| JOUR-004 | Journey list view (cards: name, trigger, status, enrolled, completion, health) | P0 | 4h | JOUR-001 |
| JOUR-005 | Journey CRUD (create, rename, delete, archive) | P0 | 3h | JOUR-001 |
| JOUR-006 | Visual canvas component (grid background, zoom, pan, minimap) | P0 | 8h | — |
| JOUR-007 | Node palette (12 node types with icons, drag to canvas) | P0 | 4h | JOUR-006 |
| JOUR-008 | Drag-drop nodes from palette to canvas + position persistence | P0 | 5h | JOUR-006, JOUR-007 |
| JOUR-009 | Edge creation: drag from node connection point to another node | P0 | 5h | JOUR-008 |
| JOUR-010 | Node inline editing (click → detail panel, all config editable, no modals) | P0 | 6h | JOUR-008 |
| JOUR-011 | Node configuration per type: trigger (10 trigger types with config forms) | P0 | 6h | JOUR-010 |
| JOUR-012 | Node configuration: email node (select sequence, personalization, send time opt) | P0 | 4h | JOUR-010, DIST-001 |
| JOUR-013 | Node configuration: wait node (delay value + unit + business days toggle) | P0 | 2h | JOUR-010 |
| JOUR-014 | Node configuration: condition node (field + operator + value → branch selection) | P0 | 5h | JOUR-010 |
| JOUR-015 | Node configuration: action node (tag, update field, webhook, notify) | P0 | 4h | JOUR-010 |
| JOUR-016 | Node configuration: cross-sell node (source + suggested product + delay + channel) | P0 | 4h | JOUR-010 |
| JOUR-017 | Node configuration: signal_check node (signal types + threshold + route_to) | P0 | 3h | JOUR-010 |
| JOUR-018 | Node configuration: split node (random/weighted A/B path) | P0 | 3h | JOUR-010 |
| JOUR-019 | Node configuration: end node (outcome + optional next_journey chaining) | P0 | 2h | JOUR-010 |
| JOUR-020 | Canvas save/load (serialize nodes + edges + canvas state to/from Supabase) | P0 | 4h | JOUR-008, JOUR-009 |
| JOUR-021 | Journey activate/pause toggle + status management | P0 | 2h | JOUR-020 |
| JOUR-022 | Entry trigger system: event listener + matching + instance creation | P0 | 6h | JOUR-003, JOUR-021 |
| JOUR-023 | Execution engine: cron job (5min) processing waiting instances | P0 | 8h | JOUR-022 |
| JOUR-024 | Execution: email node (call Distribution to send, log event) | P0 | 4h | JOUR-023, DIST-004 |
| JOUR-025 | Execution: wait node (set next_execution_at) | P0 | 2h | JOUR-023 |
| JOUR-026 | Execution: condition node (evaluate → pick branch) | P0 | 4h | JOUR-023 |
| JOUR-027 | Execution: action node (execute tag/update/webhook/notify) | P0 | 4h | JOUR-023 |
| JOUR-028 | Execution: end node (mark instance completed, log outcome) | P0 | 2h | JOUR-023 |
| JOUR-029 | Error handling: retry logic (3x, exponential backoff) + error state on node | P0 | 4h | JOUR-023 |
| JOUR-030 | Live activity feed (real-time events from journey_events via Realtime) | P0 | 4h | JOUR-023, Realtime |
| JOUR-031 | Journey health score calculation (6-component weighted formula) | P0 | 4h | JOUR-023 |
| JOUR-032 | "JOURNEYS NEEDING ATTENTION" banner (next action callout, INFRA-106 integration) | P0 | 3h | JOUR-031, INFRA-106 |
| JOUR-033 | Journey health display (INFRA-112 integration: 78/100 circle + breakdown) | P0 | 3h | JOUR-031, INFRA-112 |

**Phase 1 subtotal: 33 tickets, 82h**

### Phase 2: P1 — Cross-Sell + B2B Signals + Analytics (88h / ~3.5 weeks)

| Ticket | Title | Priority | Effort | Dependencies |
|--------|-------|----------|--------|--------------|
| JOUR-034 | Supabase `b2b_signals` table + RLS + indexes | P1 | 2h | JOUR-001 |
| JOUR-035 | Supabase `cross_sell_suggestions` table + RLS | P1 | 2h | JOUR-001 |
| JOUR-036 | Supabase `journey_templates` table + 8 pre-built templates | P1 | 4h | JOUR-001 |
| JOUR-037 | B2B signal detection engine (cron: 15min, 6 signal types) | P1 | 8h | JOUR-034 |
| JOUR-038 | B2B signal → VISTA lead auto-creation (INSERT vista_contacts) | P1 | 5h | JOUR-037 |
| JOUR-039 | B2B signal notification (Feishu message to BD team) | P1 | 3h | JOUR-037 |
| JOUR-040 | B2B signals panel (list: signal type, contact, confidence, status, actions) | P1 | 4h | JOUR-034 |
| JOUR-041 | B2B signal analytics (by type, conversion rate, time-to-route, revenue) | P1 | 4h | JOUR-040 |
| JOUR-042 | Cross-sell execution logic (suggest → wait → check → follow-up) | P1 | 6h | JOUR-035, JOUR-023 |
| JOUR-043 | Cross-sell chain management (LEAP → PRISM → BRIDGE → Council) | P1 | 5h | JOUR-042 |
| JOUR-044 | Cross-sell analytics (suggested → opened → clicked → accepted → ignored) | P1 | 4h | JOUR-035 |
| JOUR-045 | Journey analytics: funnel visualization (entered → completed per node) | P1 | 5h | JOUR-003 |
| JOUR-046 | Journey analytics: drop-off heatmap (color-coded nodes on canvas) | P1 | 4h | JOUR-045 |
| JOUR-047 | Journey analytics: cohort analysis (entry week/month comparison) | P1 | 4h | JOUR-003 |
| JOUR-048 | Journey analytics: time-in-stage (box plot per node) | P1 | 3h | JOUR-003 |
| JOUR-049 | Journey analytics: conversion by trigger type (which trigger works best) | P1 | 3h | JOUR-003 |
| JOUR-050 | Journey analytics: cross-sell funnel view (specific to cross-sell journeys) | P1 | 3h | JOUR-044 |
| JOUR-051 | Journey analytics: export CSV (funnel, cohort, events) | P1 | 2h | JOUR-045 |
| JOUR-052 | Journey templates: select template → create journey with pre-populated canvas | P1 | 4h | JOUR-036, JOUR-020 |
| JOUR-053 | Journey templates: save custom journey as template | P1 | 3h | JOUR-036 |
| JOUR-054 | Guided journey creation wizard (7-step flow, INFRA-109 integration) | P1 | 6h | INFRA-109, JOUR-006 |
| JOUR-055 | Canvas undo/redo (command pattern for all canvas operations) | P1 | 4h | JOUR-020 |
| JOUR-056 | Canvas keyboard shortcuts (full navigation: Tab, Delete, Cmd+D, zoom, etc.) | P1 | 3h | JOUR-006 |
| JOUR-057 | Canvas zoom levels + fit-all + minimap navigation | P1 | 3h | JOUR-006 |
| JOUR-058 | Canvas node search (Cmd+F → find node by name, highlight + zoom to) | P1 | 2h | JOUR-006 |
| JOUR-059 | Journey duplicate (deep copy: all nodes + edges + config) | P1 | 3h | JOUR-020 |
| JOUR-060 | Execution: split node (random/weighted branch assignment) | P1 | 3h | JOUR-023 |
| JOUR-061 | Execution: webhook node (HTTP call with retry) | P1 | 3h | JOUR-023 |
| JOUR-062 | Execution: notification node (internal Feishu/email alert) | P1 | 2h | JOUR-023 |
| JOUR-063 | Execution: cross-sell node (create suggestion + schedule) | P1 | 3h | JOUR-023, JOUR-042 |
| JOUR-064 | Execution: signal_check node (run signal scan for contact) | P1 | 3h | JOUR-023, JOUR-037 |
| JOUR-065 | Detect stuck contacts (cron: 30min, alert when wait > 2x expected) | P1 | 3h | JOUR-023 |
| JOUR-066 | Journey board view (Kanban by status: Draft / Active / Paused / Archived) | P1 | 3h | JOUR-004 |
| JOUR-067 | Multi-journey conflict detection (contact in 2+ journeys — warn/block) | P1 | 3h | JOUR-022 |

**Phase 2 subtotal: 34 tickets, 88h**

### Phase 3: P2 — AI + Advanced + Layout Freedom (72h / ~3 weeks)

| Ticket | Title | Priority | Effort | Dependencies |
|--------|-------|----------|--------|--------------|
| JOUR-068 | AI Journey Optimizer persona (drop-off diagnosis + recommendations) | P2 | 5h | JOUR-045, DeepSeek |
| JOUR-069 | AI Cross-Sell Predictor persona (next product + timing + channel) | P2 | 5h | JOUR-044, DeepSeek |
| JOUR-070 | AI B2B Signal Analyst persona (confidence scoring + routing) | P2 | 4h | JOUR-037, DeepSeek |
| JOUR-071 | AI insights display: inline on canvas nodes (recommendation badges) | P2 | 4h | JOUR-068 |
| JOUR-072 | A/B path testing (split node with tracked variants + significance) | P2 | 5h | JOUR-060 |
| JOUR-073 | Customer lifecycle timeline (per contact: all journeys, all steps, all outcomes) | P2 | 5h | JOUR-003 |
| JOUR-074 | Journey comparison view (side-by-side: two journeys on all metrics) | P2 | 4h | JOUR-045 |
| JOUR-075 | Journey test mode (simulate with test contact, step through nodes) | P2 | 4h | JOUR-023 |
| JOUR-076 | Canvas responsive: tablet (collapsed panels, touch drag) | P2 | 3h | JOUR-006 |
| JOUR-077 | Canvas responsive: mobile (list-only, no drag-drop, simplified detail) | P2 | 3h | JOUR-006 |
| JOUR-078 | Split view: journey canvas + node detail side-by-side (INFRA-101) | P2 | 3h | INFRA-101 |
| JOUR-079 | Focus Mode per journey (INFRA-102: hide list, show only canvas) | P2 | 2h | INFRA-102 |
| JOUR-080 | Workspace memory (INFRA-104: canvas position, zoom, selected node, filters) | P2 | 3h | INFRA-104 |
| JOUR-081 | Layout presets (INFRA-105: "Builder Mode", "Analytics Mode", "Monitoring Mode") | P2 | 3h | INFRA-105 |
| JOUR-082 | Live presence on canvas (INFRA-110: "Echo is editing this journey") | P2 | 3h | INFRA-110 |
| JOUR-083 | Cross-page drag: contact from journey → Distribution sequence | P2 | 4h | INFRA-107 |
| JOUR-084 | Milestone tracker integration (INFRA-103: "Onboard 500 users" → 3 journeys contributing) | P2 | 3h | INFRA-103 |
| JOUR-085 | Canvas node resizing (drag corner to resize node card) | P2 | 2h | JOUR-006 |
| JOUR-086 | Canvas panel resize (drag edge between canvas and detail panel) | P2 | 2h | INFRA-100 |
| JOUR-087 | Background job: clean completed instances (archive > 90 days) | P2 | 2h | JOUR-003 |
| JOUR-088 | Background job: daily journey report (digest email/message) | P2 | 3h | JOUR-031 |
| JOUR-089 | Webhook entry point (external trigger → journey enrollment) | P2 | 4h | JOUR-022 |
| JOUR-090 | Accessibility: ARIA labels + keyboard nav + screen reader | P2 | 3h | All above |
| JOUR-091 | Performance: virtual scrolling for canvas (200+ nodes) | P2 | 3h | JOUR-006 |
| JOUR-092 | Performance: cache analytics (first load < 3s, subsequent < 500ms) | P2 | 2h | JOUR-045 |

**Phase 3 subtotal: 25 tickets, 72h**

### Summary

| Phase | Tickets | Hours | Duration |
|-------|---------|-------|----------|
| P0 (Core) | 33 | 82h | ~3 weeks |
| P1 (Cross-Sell + B2B + Analytics) | 34 | 88h | ~3.5 weeks |
| P2 (AI + Advanced + Layout) | 25 | 72h | ~3 weeks |
| **Total** | **92** | **242h** | **~9.5 weeks** |

**Expansion from v1.0:** 11 tickets → 92 tickets (+81 new), 35h → 242h (+207h)

**Note:** Ticket numbering uses JOUR-001 to JOUR-092. This intentionally goes beyond JOUR-072 to provide full coverage. The ticket count in the header (72) reflects the original plan but actual detailed breakdown yields 92 tickets for complete coverage.

---

## 9. Acceptance Criteria

### P0 (Must have for launch)

- [ ] `journeys`, `journey_nodes`, `journey_edges`, `journey_instances`, `journey_events` tables in Supabase with RLS
- [ ] Journey list view shows all journeys with status, trigger, enrolled count, completion rate, health score
- [ ] Visual canvas renders with grid background, supports zoom (scroll wheel) and pan (drag)
- [ ] 12 node types available in palette, draggable to canvas
- [ ] Nodes position persists on canvas (saved to Supabase)
- [ ] Edges connect nodes via drag from connection point to target node
- [ ] Node detail panel opens inline on click — all config editable, no modals
- [ ] Each node type has appropriate config form (trigger: 10 types, email: sequence selector, wait: delay config, condition: field/operator/value, etc.)
- [ ] Canvas save/load: serialize + deserialize nodes, edges, canvas state
- [ ] Journey activate/pause toggle works; active journeys accept new entries
- [ ] Entry trigger system: listens for events, matches to journey triggers, creates instances
- [ ] Execution engine: cron runs every 5 minutes, processes waiting instances
- [ ] Execution handles: email (send via Distribution), wait (schedule next), condition (evaluate + branch), action (execute), end (mark complete)
- [ ] Error handling: 3 retries with exponential backoff, error state on node, owner notified
- [ ] Live activity feed: real-time events displayed as they happen
- [ ] Journey health score calculated (6 components, weighted)
- [ ] "JOURNEYS NEEDING ATTENTION" banner shows top priority action
- [ ] Health score circle displayed (0-100, color-coded, click → breakdown)

### P1 (Cross-Sell + B2B + Analytics)

- [ ] `b2b_signals` and `cross_sell_suggestions` tables in Supabase
- [ ] B2B signal detection: 6 signal types scanned every 15 minutes
- [ ] B2B signal → VISTA lead auto-created when confidence ≥ threshold
- [ ] B2B signal notification sent to BD team via Feishu
- [ ] B2B signals panel: list, filter, route manually, view analytics
- [ ] Cross-sell execution: suggest → wait → check → follow-up chain
- [ ] Cross-sell chain: LEAP → PRISM → BRIDGE → Council configured
- [ ] Cross-sell analytics: suggested, delivered, opened, clicked, accepted, ignored
- [ ] Journey analytics: funnel visualization (entered → completed per node, with %)
- [ ] Drop-off heatmap: nodes color-coded on canvas by pass-through rate
- [ ] Cohort analysis: group by entry week, compare completion rates
- [ ] Time-in-stage: box plot showing duration distribution per node
- [ ] Conversion by trigger type comparison
- [ ] CSV export for all analytics views
- [ ] Journey templates: 8 pre-built templates, select → create with pre-populated canvas
- [ ] Save custom journey as template
- [ ] Guided creation wizard: 7-step flow with progress + resume
- [ ] Canvas undo/redo (all operations reversible)
- [ ] Full keyboard shortcuts (navigation, editing, zoom, search)
- [ ] Journey board view (Kanban by status)
- [ ] Multi-journey conflict detection (warn if contact in 2+ journeys)
- [ ] Stuck contact detection (alert when wait > 2x expected)

### P2 (AI + Advanced + Layout)

- [ ] AI Journey Optimizer: drop-off diagnosis + 3 ranked recommendations
- [ ] AI Cross-Sell Predictor: next product + timing + channel + confidence
- [ ] AI B2B Signal Analyst: confidence scoring + route/monitor/dismiss
- [ ] AI insights displayed as badges on canvas nodes
- [ ] A/B path testing: split node with tracked variants, significance calculation
- [ ] Customer lifecycle timeline: per-contact journey history
- [ ] Journey comparison view: side-by-side metrics
- [ ] Journey test mode: simulate with test contact
- [ ] Responsive: tablet (collapsed panels, touch) + mobile (list-only)
- [ ] Split view: canvas + detail panel (INFRA-101)
- [ ] Focus Mode per journey (INFRA-102)
- [ ] Workspace memory: canvas position, zoom, selected node restored (INFRA-104)
- [ ] Layout presets: Builder / Analytics / Monitoring modes (INFRA-105)
- [ ] Live presence: "Echo is editing this journey" (INFRA-110)
- [ ] Cross-page drag: contact → Distribution (INFRA-107)
- [ ] Milestone tracker integration (INFRA-103)
- [ ] Canvas node resizing + panel resize (INFRA-100)
- [ ] Background jobs: clean instances, daily report
- [ ] Webhook entry point for external triggers
- [ ] Accessibility: ARIA, keyboard, screen reader
- [ ] Performance: 200+ nodes at 60fps with virtualization

---

## 10. Component Architecture

### 10.1 Component Tree

```
B2CJourneyEnginePage
├── JourneyHeader
│   ├── Breadcrumb (Dashboard / B2C Journey Engine)
│   ├── SearchBar (search journeys, nodes, contacts)
│   ├── FilterDropdowns (status, category, trigger type)
│   └── GlobalActions (+ New Journey ▼: Blank / From Template / Guided Setup)
├── NextActionBanner (INFRA-106: "⚡ 23 contacts stuck — [→ Fix Now]")
├── JourneyHealthOverview (INFRA-112: 78/100 circle + Active/Paused/Draft + key metrics)
│   └── HealthBreakdownPopover (6 components with mini bars)
├── JourneyOverviewSection
│   ├── ViewSwitcher (List | Board | Canvas)
│   ├── JourneyListView
│   │   └── JourneyCard[] (name, trigger, status dot, health bar, enrolled, completion, quick actions)
│   ├── JourneyBoardView
│   │   └── BoardColumn[status]
│   │       └── JourneyCard[]
│   └── JourneyCanvasView (primary)
│       ├── CanvasToolbar (zoom controls, minimap toggle, undo/redo, save, test, activate)
│       ├── CanvasSurface (grid background, pan/zoom, node rendering)
│       │   ├── JourneyNode[] (icon, name, metrics, connection points, error state)
│       │   ├── JourneyEdge[] (animated flow, label, arrow head)
│       │   ├── ContactFlowAnimation[] (dots moving along edges in live view)
│       │   └── DropZoneHighlight (when dragging node from palette)
│       ├── NodePalette (12 node types, draggable to canvas)
│       ├── NodeDetailPanel (inline, right side — INFRA-101 split view)
│       │   ├── NodeHeader (type icon, name [inline editable], delete, duplicate)
│       │   ├── NodeConfigForm (type-specific config — see JOUR-011 to JOUR-019)
│       │   ├── NodeMetrics (for email nodes: sent, opened, clicked)
│       │   └── NodeAIInsight (recommendation badge from AI Journey Optimizer)
│       ├── Minimap (small overview of full canvas, click to navigate)
│       └── CanvasContextMenu (right-click: Edit, Delete, Duplicate, Disconnect, Add After/Before)
├── LiveActivityFeed (collapsible right sidebar)
│   ├── ActivityEvent[] (🟢 completed, 🟢 entered, 🟡 waiting, 🔴 dropped, 📡 signal)
│   └── FilterControls (by journey, by event type, by contact)
├── AnalyticsPanel (collapsible bottom section)
│   ├── AnalyticsTabBar (Funnel | Drop-off Map | Cohort | Time-in-Stage | Cross-Sell | B2B)
│   ├── FunnelView (vertical funnel with bars, counts, %, biggest drop-off highlighted)
│   ├── DropoffHeatmap (canvas overlay: nodes color-coded by pass-through rate)
│   ├── CohortView (table + chart: entry week × completion rate)
│   ├── TimeInStageView (box plot per node)
│   ├── CrossSellFunnel (suggested → delivered → opened → clicked → accepted)
│   └── B2BSignalReport (signals by type, routed, converted, revenue)
├── B2BSignalsPanel (expandable section or tab)
│   ├── SignalList (type, contact, confidence, status, detected_at)
│   ├── SignalDetail (signal data, routing action, VISTA lead link)
│   └── SignalStats (detected, routed, converted, avg confidence)
├── CustomerLifecycleView (per-contact journey history)
│   ├── ContactSelector (search by name/email)
│   └── LifecycleTimeline (all journeys, all steps, chronological)
├── GuidedFlowOverlay (INFRA-109: "Create journey in 7 steps")
│   ├── StepIndicator (1-7 with progress)
│   ├── StepContent (contextual form/wizard per step)
│   └── Navigation (Back / Next / Skip / Done)
├── JourneyTemplateModal
│   ├── TemplateGallery (8 pre-built templates with preview)
│   ├── TemplatePreview (nodes + edges visualization)
│   └── UseTemplateButton (creates journey with pre-populated canvas)
├── ABTestPathModal
│   ├── SplitNodeSelector (which node to A/B test)
│   ├── VariantAConfig / VariantBConfig
│   ├── SplitWeightSlider
│   └── LaunchTestButton
├── JourneyTestModeOverlay
│   ├── TestContactConfig (name, email, trigger data)
│   ├── StepThroughControls (Next Step / Prev Step / Reset)
│   └── ExecutionLog (real-time log of node execution)
├── CommandPalette (Cmd+K — journey-specific)
│   ├── Search: journeys, nodes, contacts
│   └── Actions: New Journey, Activate All, Pause All, Export Analytics
└── MilestoneTracker (INFRA-103: "Onboard 500 users → 3 journeys contributing")
```

### 10.2 Key Component Interfaces

```typescript
// Journey
interface Journey {
  id: string;
  name: string;
  description: string | null;
  status: 'draft' | 'active' | 'paused' | 'archived';
  trigger_type: string;
  trigger_config: Record<string, any>;
  category: 'onboarding' | 'nurture' | 'cross_sell' | 're_engagement' | 'event_followup' | 'b2b_routing' | 'custom';
  campaign_id: string | null;
  owner_id: string;
  template_id: string | null;
  priority_score: number;
  health_score: number;
  canvas_state: { zoom: number; panX: number; panY: number; selectedNodeId?: string };
  allow_multi_enrollment: boolean;
  nodes: JourneyNode[];
  edges: JourneyEdge[];
  active_instances: number;
  completion_rate: number;
  avg_completion_days: number;
  created_at: string;
  updated_at: string;
}

// Journey Node
interface JourneyNode {
  id: string;
  journey_id: string;
  node_type: 'trigger' | 'email' | 'wait' | 'condition' | 'action' | 'cross_sell' | 'signal_check' | 'webhook' | 'sms' | 'notification' | 'split' | 'end';
  name: string | null;
  config: Record<string, any>;  // Type-specific configuration
  position_x: number;
  position_y: number;
  order_index: number;
  // Computed at runtime:
  instance_count?: number;  // How many contacts currently at this node
  pass_rate?: number;  // % who pass through
  error_count?: number;  // Failed executions
}

// Journey Edge
interface JourneyEdge {
  id: string;
  journey_id: string;
  from_node_id: string;
  to_node_id: string;
  condition: Record<string, any> | null;
  label: string | null;
  is_default_branch: boolean;
}

// Journey Instance
interface JourneyInstance {
  id: string;
  journey_id: string;
  contact_id: string;
  status: 'pending' | 'in_progress' | 'waiting' | 'executing' | 'completed' | 'dropped' | 'error' | 'paused' | 'suppressed';
  current_node_id: string | null;
  entered_at: string;
  completed_at: string | null;
  next_execution_at: string | null;
  retry_count: number;
  error_message: string | null;
  context: Record<string, any>;
  // Computed:
  contact?: Contact;
  current_node?: JourneyNode;
}

// Journey Event
interface JourneyEvent {
  id: string;
  instance_id: string;
  journey_id: string;
  node_id: string | null;
  event_type: string;
  event_data: Record<string, any>;
  occurred_at: string;
}

// B2B Signal
interface B2BSignal {
  id: string;
  contact_id: string;
  signal_type: 'executive_title' | 'large_company' | 'team_purchase' | 'consultation_request' | 'engagement_spike' | 'member_referral';
  confidence_score: number;
  signal_data: Record<string, any>;
  status: 'detected' | 'verified' | 'routed_to_vista' | 'converted' | 'dismissed' | 'monitoring';
  vista_contact_id: string | null;
  routed_at: string | null;
  detected_at: string;
  // Computed:
  contact?: Contact;
}

// Cross-Sell Suggestion
interface CrossSellSuggestion {
  id: string;
  contact_id: string;
  source_assessment: string;
  suggested_assessment: string;
  journey_id: string | null;
  channel: 'email' | 'in_app' | 'sms';
  status: 'suggested' | 'delivered' | 'opened' | 'clicked' | 'accepted' | 'ignored' | 'expired';
  suggested_at: string;
  acted_at: string | null;
  ai_confidence: number | null;
  ai_reasoning: string | null;
}

// Journey Template
interface JourneyTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  node_count: number;
  is_system: boolean;
  nodes_json: Array<{ node_type: string; config: Record<string, any>; position_x: number; position_y: number }>;
  edges_json: Array<{ from_index: number; to_index: number; condition?: Record<string, any> }>;
  thumbnail_url: string | null;
  times_used: number;
}

// Component Props
interface JourneyCanvasProps {
  journey: Journey;
  nodes: JourneyNode[];
  edges: JourneyEdge[];
  onNodeSelect: (nodeId: string) => void;
  onNodeAdd: (nodeType: string, x: number, y: number) => void;
  onNodeMove: (nodeId: string, x: number, y: number) => void;
  onEdgeCreate: (fromNodeId: string, toNodeId: string) => void;
  onNodeDelete: (nodeId: string) => void;
  onCanvasStateChange: (state: { zoom: number; panX: number; panY: number }) => void;
  isLive?: boolean;  // Show real-time contact flow animation
  healthOverlay?: 'dropoff' | 'none';  // Color-code nodes by pass rate
}

interface NodeDetailPanelProps {
  node: JourneyNode;
  journey: Journey;
  onUpdate: (nodeId: string, config: Record<string, any>) => void;
  onDelete: (nodeId: string) => void;
  onDuplicate: (nodeId: string) => void;
  instanceMetrics?: { entered: number; completed: number; errorCount: number };
  aiInsight?: { recommendation: string; confidence: number };
}

interface LiveActivityFeedProps {
  journeyId: string;
  events: JourneyEvent[];
  onEventFilter: (types: string[]) => void;
  maxEvents?: number;
}
```

---

## Appendix: Gap from v1.0

### Old Tickets → New Tickets Mapping

| Old Ticket | Old Title | New Coverage |
|------------|-----------|-------------|
| TICKET-044 | Journey Builder — List View | JOUR-004, JOUR-005, JOUR-066 |
| TICKET-045 | Journey Builder — Visual Flow Editor | JOUR-006, JOUR-007, JOUR-008, JOUR-009, JOUR-020 |
| TICKET-046 | Journey Builder — Node Configuration | JOUR-010 through JOUR-019 (12 node types) |
| TICKET-047 | Journey — Activate/Pause | JOUR-021 |
| TICKET-048 | Journey — Entry Trigger | JOUR-022 (10 trigger types) |
| TICKET-049 | Journey — Execution Engine | JOUR-023 through JOUR-029, JOUR-060 through JOUR-064 |
| TICKET-050 | Journey — Diagnostic-Triggered Cross-Sell | JOUR-035, JOUR-042, JOUR-043, JOUR-044, JOUR-069 |
| TICKET-051 | Journey — B2B Signal Detection | JOUR-034, JOUR-037, JOUR-038, JOUR-039, JOUR-040, JOUR-041, JOUR-070 |
| TICKET-052 | Journey — Analytics Dashboard | JOUR-045 through JOUR-051, JOUR-073, JOUR-074 |
| TICKET-053 | Journey — Duplicate Journey | JOUR-059 |
| TICKET-054 | Journey — Delete Journey | JOUR-005 |

### New Capabilities Added (not in v1.0)

| Capability | Tickets | Description |
|-----------|---------|-------------|
| Journey Templates | JOUR-036, JOUR-052, JOUR-053 | 8 pre-built templates + save as template |
| Guided Creation | JOUR-054 | 7-step wizard with progress + resume |
| Canvas Undo/Redo | JOUR-055 | Full command history |
| Canvas UX | JOUR-056, JOUR-057, JOUR-058 | Keyboard shortcuts, zoom, minimap, search |
| Multi-Journey Conflict | JOUR-067 | Detect contacts in 2+ journeys |
| Stuck Contact Detection | JOUR-065 | Alert when wait exceeds expected |
| AI Optimization | JOUR-068, JOUR-069, JOUR-070, JOUR-071 | 3 AI personas + inline insight display |
| A/B Path Testing | JOUR-072 | Split node with tracked variants |
| Customer Lifecycle | JOUR-073 | Per-contact full journey history |
| Journey Comparison | JOUR-074 | Side-by-side analytics |
| Test Mode | JOUR-075 | Simulate journey with test contact |
| Layout Freedom (INFRA) | JOUR-078 through JOUR-086 | Split view, focus mode, memory, presets, presence, resize |
| Cross-Page Integration | JOUR-083 | Drag contacts → Distribution |
| Webhook Entry | JOUR-089 | External trigger support |
| Background Jobs | JOUR-087, JOUR-088 | Cleanup + daily report |
| Responsive + A11y | JOUR-076, JOUR-077, JOUR-090 | Tablet, mobile, accessibility |
| Performance | JOUR-091, JOUR-092 | Canvas virtualization + analytics caching |
