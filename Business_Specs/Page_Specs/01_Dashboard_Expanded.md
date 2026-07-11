# WAVE Business Spec — Page 1: Dashboard (EXPANDED)

**Version:** 2.1 | **Date:** 2026-07-11 | **Status:** Draft for Kevin Review
**Supersedes:** 01_Dashboard.md (v2.0 — 12 tickets)
**Builds on:** TICKET-006, TICKET-007, TICKET-008 (existing infrastructure)
**Gap tickets:** DASH-001 through DASH-036 (expanded from 12 to 36)

---

## 1. Purpose

The Dashboard is the single entry point for all WAVE users. It answers three questions in under 5 seconds:
1. **What's happening right now?** (real-time status)
2. **What needs my attention?** (action items, blockers, overdue)
3. **What's the AI saying?** (executive brief with recommendations)

It must feel like opening Notion — clean, fast, everything you need at a glance, with inline actions (not just links to other pages).

**Expansion scope (beyond v2.0):**
- KPI cards: sparklines, drill-downs, comparison periods, trend confidence
- Action Feed: filtering, time-grouping, read/unread, notification bell, full-page view
- Executive Brief: history, section expansion, follow-up questions, email delivery
- Agent Status: today's output, queue depth, pause/resume controls, action history
- Today's Schedule: horizontal timeline with inline actions
- Revenue Pipeline Mini: registration revenue snapshot
- Campaign Performance Snapshot: top 3 campaigns by KPI progress
- Channel Health: per-channel performance bars
- User Preferences: customizable layout, KPI visibility, feed filters
- Notification System: in-app, browser push, email digest, critical alerts
- AI Interaction: follow-up questions, insight acceptance tracking, confidence scores
- Accessibility: ARIA, keyboard navigation, screen reader
- Performance: caching strategy, lazy loading, bundle optimization

---

## 2. Business Requirements

### 2.1 Real-time KPI Cards (expanded)

| KPI | Source | Refresh | Comparison | Drill-Down |
|-----|--------|---------|------------|------------|
| Content in Pipeline | `content_assets` WHERE status IN ('idea','draft','review','approved') | Realtime | vs last week | → Content Calendar filtered to pipeline statuses |
| Publishing This Week | `content_schedule` WHERE scheduled_date BETWEEN now AND now+7d | Realtime | vs last week | → Content Calendar week view |
| Email Sequences Active | `email_sequences` WHERE status = 'active' | Realtime | vs last month | → Distribution page filtered to active |
| Journey Conversions (30d) | `journey_enrollments` WHERE completed_at > now-30d | Hourly | vs prior 30d | → Journey Analytics |
| Upcoming Events (30d) | `events` WHERE start_at BETWEEN now AND now+30d | Realtime | vs last month | → Events page |
| Open Registrations | `event_registrations` WHERE payment_status IN ('pending','confirmed') | Realtime | vs last week | → Registrations list |
| Campaigns Active | `campaigns` WHERE status = 'active' | Realtime | — | → Campaign list |
| Revenue This Month | `event_registrations` WHERE payment_status='confirmed' AND created_at > month_start | Hourly | vs last month | → Revenue breakdown by event/product |
| AI Credits Remaining | DeepSeek API usage tracker | On-demand | vs monthly budget | → Settings → API Usage |

**Sparkline:** Each KPI card shows a 7-day sparkline (mini line chart) showing the trend. Data from daily snapshots stored in `kpi_daily_snapshots` table.

**Trend Confidence:**
- Green ↑ with solid arrow = statistically significant change (>10% vs prior period)
- Green ↑ with dotted arrow = minor positive change (<10%)
- Red ↓ with solid arrow = statistically significant decline
- Gray → = no significant change

**Hover State:** Hovering a KPI card shows a tooltip with:
- Current value
- Previous period value
- Absolute change (+/-)
- Percentage change
- 7-day sparkline (larger)

**Click Behavior:** Clicking any KPI card navigates to the relevant page with filters pre-applied (via URL query params).

### 2.2 Action Feed (expanded)

**Feed types (expanded):**

| Type | Icon | Color | Example | Inline Actions |
|------|------|-------|---------|----------------|
| `approval_needed` | ✓ | Amber | "Podcast show notes ready for review" | [Review] [Approve] [Edit] [Reject] |
| `overdue` | ⚠ | Red | "LinkedIn post due Jul 8 — still in Draft" | [Open] [Reschedule] [Mark done] |
| `milestone` | ★ | Green | "Webinar registrations hit 100" | [View attendees] [Send reminder] |
| `ai_insight` | 💡 | Blue | "LinkedIn posts perform 3x better on Tue/Thu 8-9am" | [Apply] [Dismiss] [Details] |
| `agent_action` | 🤖 | Gray | "Echo published 'AI in Leadership' to website" | [View content] [Undo] |
| `cross_app` | 🔗 | Purple | "DEX AI: 12 new assessment completions → nurture eligible" | [View contacts] [Start journey] |
| `system` | ⚙ | Gray | "Supabase sync completed successfully" | [View logs] |
| `revenue` | $ | Green | "Payment received: €2,400 — Leadership Summit (12 registrations)" | [View receipt] |
| `warning` | ⚡ | Amber | "Email bounce rate hit 5% on last send" | [View details] [Adjust list] |
| `deadline` | 🕐 | Amber | "Campaign 'Q3 BRIDGE Push' ends in 3 days" | [View campaign] [Extend] |

**Time Grouping:**
- Feed items grouped by: Today, Yesterday, This Week, Earlier
- Each group has a sticky header
- Within groups, sorted by priority (1=highest) then created_at DESC

**Read/Unread:**
- Unread items have a subtle left border (3px, brand color)
- "Mark all read" button in feed header
- Clicking an item marks it as read
- Notification bell shows unread count

**Filtering:**
- Filter bar above feed: [All] [Approvals] [Overdue] [AI] [Agents] [Cross-app] [Revenue]
- Filters combinable with time range
- User's last filter selection remembered in localStorage

**Feed Actions (expanded):**
- [Approve] → changes content status to 'approved', marks item read, shows toast
- [Reject] → opens inline text input for rejection reason → sends to content owner
- [Reschedule] → opens inline date picker → updates scheduled_date
- [Apply] (AI insight) → executes the suggestion (e.g., reschedules content to suggested time)
- [Undo] (agent action) → reverses the agent's last action (if reversible)
- [Details] (AI insight) → expands inline to show AI's full analysis with data

**Full-Page View:**
- "View all" in feed header → navigates to `/dashboard/feed`
- Full page with advanced filtering, search, date range, export
- Paginated: 50 items per page

### 2.3 Executive Brief (expanded)

**Structure (5 sections, each collapsible):**

```
┌─────────────────────────────────────────────────────────────────┐
│ Executive Brief — Jul 11, 2026                    [↻] [📧] [📜]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 🟢 OVERALL STATUS: GREEN                                       │
│ Published 12 pieces this week (target: 10). Pipeline healthy.   │
│                                                 [▼ Expand]      │
│                                                                 │
│ 🏆 TOP WIN                                                     │
│ Webinar registrations hit 156 (target: 100).                    │
│ LinkedIn engagement up 34% vs prior week.                       │
│                                                 [▼ Expand]      │
│                                                                 │
│ ⚠️ TOP RISK                                                    │
│ No BRIDGE content published in 18 days.                         │
│ Email bounce rate hit 5% — may affect deliverability.           │
│                                                 [▼ Expand]      │
│                                                                 │
│ 🎯 RECOMMENDED ACTION                                          │
│ Prioritize BRIDGE case study (draft exists, due Jul 8).         │
│ Clean email list: 47 bounces in last 30 days.                   │
│                                                 [▼ Expand]      │
│                                                                 │
│ 🔗 CROSS-APP                                                   │
│ DEX AI: 23 new assessment completions → SHIFT-DRIVE ready.     │
│ VISTA: 3 meetings booked this week from inbound content.        │
│                                                 [▼ Expand]      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [Ask follow-up...]                                              │
└─────────────────────────────────────────────────────────────────┘
```

**Each expanded section shows:**
- Detailed data supporting the summary
- Specific numbers with links to source pages
- Related action feed items
- "Take action" buttons that execute directly

**Brief Actions:**
- [↻ Regenerate] — forces new brief generation with current data
- [📧 Email me] — sends brief to kevin.hong@lyc-partners.ai
- [📜 History] — opens brief history panel (last 30 days)
- [▼ Expand] — each section expands inline with detailed data
- [Ask follow-up...] — inline text input: "Why is BRIDGE content gap happening?" → AI answers with data

**Brief History:**
- Side panel slides in from right
- List of all past briefs (date, status color, first sentence)
- Click any brief → expands to full content
- Compare two briefs side-by-side (highlight changes)

**Follow-up Questions:**
- User types question in input at bottom of brief
- AI answers using current Supabase data as context
- Answer appears inline below the input
- Follow-up history preserved for 24h (session-based)

### 2.4 Quick Actions Bar (expanded)

**Persistent bar at top-right of dashboard:**

| Action | Icon | Keyboard | Behavior |
|--------|------|----------|----------|
| + Content | + | `N` | Opens inline creation row at top of Content Calendar |
| Send Email | ✉ | `E` | Opens sequence selector dropdown |
| Create Event | 📅 | `Shift+E` | Opens event creation form |
| Generate Brief | ↻ | `Shift+B` | Forces AI brief regeneration |
| Sync All | 🔄 | `Shift+S` | Triggers Supabase → VISTA/DEX AI sync |
| Search | 🔍 | `/` or `Cmd+K` | Opens global search/command palette |

**Customization:**
- Users can reorder actions (drag)
- Users can add/remove actions from a list of 15 available actions
- Layout preference stored in `user_preferences`

**Contextual Actions (appear based on state):**
- If overdue content exists → [Fix Schedule] appears
- If pending approvals > 3 → [Batch Approve] appears
- If event registrations low → [Boost Event] appears
- If AI insights unapplied > 5 → [Review Insights] appears

### 2.5 Agent Status (expanded)

**Each agent card shows:**

```
┌────────────────────────────────────┐
│ 🟢 Echo                    [⏸] [▸]│
│ Content & Distribution             │
│                                    │
│ Today: 3 published, 1 in review    │
│ Queue: 2 tasks pending             │
│ Avg response: 1.2s                 │
│                                    │
│ Last action: Published LinkedIn    │
│ "AI in Leadership" — 12 min ago   │
│                                    │
│ [View log] [Send task]            │
└────────────────────────────────────┘
```

**Agent Controls:**
- [⏸ Pause] — pauses agent's automated actions (shows confirmation)
- [▸ Resume] — resumes paused agent
- [View log] — opens agent's full action history (side panel)
- [Send task] — opens inline input to assign a specific task to the agent

**Agent Queue:**
- Shows pending tasks assigned to each agent
- Tasks can be reordered (priority)
- Tasks can be cancelled
- Shows estimated completion time

**Agent Metrics (daily):**
- Tasks completed today
- Tasks completed this week
- Average response time
- Error rate (actions that failed)
- Credit usage (DeepSeek tokens consumed)

### 2.6 Today's Schedule (new section)

**Horizontal timeline showing today's content:**

```
┌─────────────────────────────────────────────────────────────────┐
│ Today's Schedule — Jul 11                        [← ] [ →]     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  06:00    09:00    12:00    15:00    18:00    21:00            │
│  │        │        │        │        │        │                 │
│  │   ┌────┴────┐   │   ┌────┴────┐   │        │                │
│  │   │ 🔗 Echo │   │   │ 📧 Maria│   │        │                │
│  │   │LinkedIn │   │   │Newsletter│  │        │                │
│  │   │Post     │   │   │Send     │   │        │                │
│  │   │✅ Done  │   │   │⏳ 2:00  │   │        │                │
│  │   └─────────┘   │   └─────────┘   │        │                │
│  │        │   ┌────┴────┐   │        │        │                │
│  │        │   │ 🎙 Carl │   │        │        │                │
│  │        │   │ Podcast │   │        │        │                │
│  │        │   │ Record  │   │        │        │                │
│  │        │   │ ⏳ 3:00 │   │        │        │                │
│  │        │   └─────────┘   │        │        │                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Each item shows:**
- Time slot
- Channel icon + color
- Content title (truncated)
- Owner avatar
- Status: ✅ Done, ⏳ Upcoming, 🔴 Overdue, ⏸ Paused

**Interactions:**
- Click item → expands inline with content details
- [View] → navigates to content detail
- [Reschedule] → opens inline time picker
- [Boost] → for social posts, increases distribution priority
- Empty slots → clickable to create new content for that time

### 2.7 Revenue Pipeline Mini (new section)

**Compact revenue view:**

```
┌─────────────────────────────────────────┐
│ Revenue This Month               [→]    │
├─────────────────────────────────────────┤
│                                         │
│  €12,400 / €25,000 target               │
│  ████████████░░░░░░░░  49.6%            │
│                                         │
│  By source:                             │
│  Events:      €8,200 (66%)              │
│  Programs:    €3,100 (25%)              │
│  Assessments: €1,100 (9%)               │
│                                         │
│  Pending:  €4,200 (18 registrations)    │
│  Overdue:  €800 (3 registrations)       │
│                                         │
└─────────────────────────────────────────┘
```

**Click [→] → navigates to Analytics page with revenue focus**

### 2.8 Campaign Performance Snapshot (new section)

**Top 3 active campaigns by KPI progress:**

```
┌─────────────────────────────────────────────────────────────┐
│ Campaign Performance                           [View All]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Q3 BRIDGE Push                              ██████░ 78%   │
│  Content: 12/15 published │ Email: 3/4 sends │ Ends in 8d  │
│                                                             │
│  Gravitas Shift Launch                         ████░░░ 52%  │
│  Content: 5/10 published │ Podcast: 2/3 eps │ Ends in 21d  │
│                                                             │
│  Leadership Summit Promo                      ████████░ 92% │
│  Content: 8/8 published │ Reg: 156/100 │ Event in 5d       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.9 Channel Health (new section)

**Per-channel performance bars:**

```
┌─────────────────────────────────────────────────────────────┐
│ Channel Health (last 30 days)                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  LinkedIn   ████████████░░  847 engagements  ↑ 34%         │
│  Email      ██████████░░░░  2,340 opens (42% rate)  ↑ 5%   │
│  Website    ████████░░░░░░  1,204 visits  → 0%             │
│  Podcast    █████░░░░░░░░░  340 downloads  ↑ 12%           │
│  YouTube    ███░░░░░░░░░░░  89 views  ↓ 8%                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Each bar clickable → navigates to Analytics with channel filter applied**

---

## 3. User Requirements

| User | Dashboard Priority | Must-See Sections |
|------|-------------------|-------------------|
| **Kevin** | Executive overview, cross-app, revenue | Brief, Revenue, Campaign Performance, Cross-app feed |
| **Echo** | Content pipeline, publishing schedule | KPIs (content/publishing), Today's Schedule, Content feed |
| **Maria** | Email performance, lead status | KPIs (email/journeys), Channel Health (email), Revenue |
| **Carl** | Events, registrations | KPIs (events/registrations), Today's Schedule, Revenue |
| **Valentina** | Website publishing queue | KPIs (content), Channel Health (website) |
| **Vanjulla** | Podcast schedule | Today's Schedule, Agent Status (Echo) |
| **NEXUS** | System health, AI credits, sync status | KPIs (AI credits), Agent Status, System feed |

**Role-based default layout:**
- Kevin: Brief (expanded) + Revenue + Campaign + Feed
- Echo: Brief + Today's Schedule + Content KPIs + Feed
- Maria: Brief + Email KPIs + Channel Health + Revenue
- Carl: Brief + Event KPIs + Today's Schedule + Revenue

---

## 4. UX Requirements (Notion-like feel)

### 4.1 Complete Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ WAVE                        🔔(3)  [Quick Actions ▾]  [⚙] [?] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ Executive Brief — Jul 11                    [↻][📧][📜]  │   │
│ │ 🟢 GREEN. Published 12 this week. Win: webinar 156 reg.  │   │
│ │ Risk: BRIDGE gap 18d. Action: prioritize case study.     │   │
│ │ [▼ Expand sections]                         [Ask NEXUS...]│   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
├──────────┬──────────┬──────────┬──────────┬──────────┬────────┤
│ Content  │ Publish  │ Email    │ Journeys │ Events   │ Revenue│
│ Pipeline │ This Wk  │ Active   │ Conv 30d │ Registr. │ Month  │
│  [147]   │  [12]    │  [18]    │  [340]   │  [847]   │ €12.4K │
│  +12% ↑  │  +3 ↑    │  +3 new  │  +8% ↑   │  +56 today│ 49% ▓ │
│  [spark] │  [spark] │  [spark] │  [spark] │  [spark] │ [spark]│
├──────────┴──────────┴──────────┴──────────┴──────────┴────────┤
│                                                                 │
│ ┌───────────────────────────┐ ┌──────────────────────────────┐ │
│ │ Action Feed               │ │ Today's Schedule             │ │
│ │ [All][Approvals][Overdue] │ │ ──●────────●─────●────────── │ │
│ │                           │ │ 09:00    14:00   16:00       │ │
│ │ ⚠️ LI post due Jul 8      │ │ 🔗Echo   📧Maria  🎙Carl    │ │
│ │    [Open] [Reschedule]    │ │ LinkedIn  Newsletter Podcast  │ │
│ │ ✅ Echo published "AI..." │ │ ✅ Done    ⏳ 2:00   ⏳ 3:00  │ │
│ │    [View] [Undo]          │ │                              │ │
│ │ 💡 AI: Tue/Thu 3x better  │ │ [Reschedule] [Boost] [View]  │ │
│ │    [Apply] [Dismiss]      │ │                              │ │
│ │ 🔗 DEX: 12 new assess..  │ ├──────────────────────────────┤ │
│ │    [View] [Start journey] │ │ Campaign Performance         │ │
│ │ ⚡ Bounce rate 5%         │ │ Q3 BRIDGE Push  ██████░ 78% │ │
│ │    [Details] [Fix]        │ │ Summit Promo    ████████░ 92%│ │
│ │                           │ │ Gravitas Launch ████░░░ 52% │ │
│ │ [Mark all read] [View all]│ │                              │ │
│ └───────────────────────────┘ └──────────────────────────────┘ │
│                                                                 │
│ ┌───────────────────────────┐ ┌──────────────────────────────┐ │
│ │ Channel Health (30d)      │ │ Agent Status                 │ │
│ │ LinkedIn  ████████░  ↑34% │ │ 🟢 Echo  [⏸] 3 pub, 2 queue │ │
│ │ Email     ██████░░░  ↑ 5% │ │ 🟢 Maria [⏸] 1 sent, 1 queue│ │
│ │ Website   █████░░░░  → 0% │ │ 🟡 Emily [⏸] Idle 3h        │ │
│ │ Podcast   ███░░░░░░  ↑12% │ │ 🟢 Carl  [⏸] 1 created      │ │
│ │ YouTube   ██░░░░░░░  ↓ 8% │ │ 🟡 Val.  [⏸] Idle 1h        │ │
│ │                           │ │ [View all agents]             │ │
│ └───────────────────────────┘ └──────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Layout Customization

**Drag-and-drop sections:**
- Each section card can be dragged to reorder
- Layout saved per user in `user_preferences.dashboard_layout` (JSONB)
- Default layout based on user role (see Section 3)

**Section visibility toggle:**
- [⚙] button → shows section list with toggles
- Hidden sections collapse completely (no wasted space)
- Preference persisted

**Responsive breakpoints:**
- >1200px: Full layout as above (2-column grid for bottom sections)
- 768-1200px: Single column, all sections stack
- <768px: Compact mode — KPI cards as horizontal scroll, brief as one-liner, feed as card stack

### 4.3 Notification Bell

```
┌──────────────┐
│ 🔔 (3)       │
├──────────────┤
│ Unread (3)   │
│ ──────────── │
│ ⚠️ LI post overdue    2m ago │
│ 💡 AI insight ready   1h ago │
│ $ Payment received    3h ago │
│ ──────────── │
│ [Mark all read]           │
│ [Notification settings]   │
│ [View all →]              │
└──────────────┘
```

**Notification types trigger:**
- In-app (bell badge + dropdown)
- Browser push (if permission granted)
- Email digest (daily at 8am, or instant for critical: overdue, revenue >€1000)
- Critical alerts: immediate browser push + email for: payment failures, system errors, agent failures

### 4.4 Global Search / Command Palette (Cmd+K)

```
┌─────────────────────────────────────────────────────────────────┐
│ 🔍 Search content, campaigns, events, or type a command...     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  RECENT                                                         │
│  Content: "AI in Leadership"                       LinkedIn     │
│  Campaign: "Q3 BRIDGE Push"                        Active       │
│  Event: "Leadership Summit"                        Jul 18       │
│                                                                 │
│  QUICK ACTIONS                                                  │
│  Create new content                                Cmd+N        │
│  Generate executive brief                          Cmd+B        │
│  Sync with VISTA / DEX AI                          Cmd+S        │
│  Search content by title...                        /            │
│                                                                 │
│  AI COMMANDS                                                    │
│  "What should I focus on today?"                   Ask NEXUS    │
│  "Show me overdue content"                         Filter       │
│  "What's the BRIDGE content gap?"                  Analyze      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Search scope:**
- Content assets (by title, tag, campaign, owner)
- Campaigns (by name, status)
- Events (by name, date)
- Email sequences (by name, status)
- Templates (by name, type)
- Action feed items (by text)

---

## 5. Design Requirements

### 5.1 KPI Card Design (detailed)

```
┌────────────────────────────────────┐
│ CONTENT IN PIPELINE         📄     │
│                                    │
│            147                     │  ← 32px, bold, serif
│  +12% ↑  vs last week             │  ← 11px, green/red + delta
│                                    │
│  ╭─╮╭──╮╭╮╭──╮╭╮                 │  ← 7-day sparkline, 40px tall
│  ╰─╯╰──╯╰╯╰──╯╰╯                 │     Brand color for up, red for down
│                                    │
│  [→ View details]                  │  ← appears on hover
└────────────────────────────────────┘
```

- Card: 1px border, 8px radius, 16px padding, no shadow
- Hover: subtle background change + [→ View details] link appears
- Active/clicked: 2px brand border (brief flash, 300ms)
- Loading: skeleton animation (shimmer) matching card shape
- Error: subtle red border + "Failed to load" message + [Retry] button

### 5.2 Action Feed Item Design

```
┌─────────────────────────────────────────────────────────────┐
│ ⚠️  │ LinkedIn post "BRIDGE Case Study" due Jul 8 —       │
│     │ still in Draft                          2 hours ago  │
│     │                                                      │
│     │ [Open] [Reschedule] [Mark done]                      │
└─────────────────────────────────────────────────────────────┘
     ↑ 3px left border (amber for warning)
```

- Unread: 3px colored left border + slightly bolder text
- Read: no left border, normal weight
- Hover: background subtle highlight
- Actions: text buttons, not filled buttons (less visual weight)
- Expanded (AI insight): shows full analysis below with data table

### 5.3 Color System

| Element | Color | Usage |
|---------|-------|-------|
| Brand | #C108AB (magenta) | Primary actions, links, active states |
| Success | #059669 (green) | Published, positive deltas, revenue up |
| Warning | #D97706 (amber) | Overdue, needs attention, bounce rate |
| Error | #DC2626 (red) | Failed, critical alerts, revenue down |
| Info | #2563EB (blue) | AI insights, information, cross-app |
| Muted | var(--color-foreground-muted) | Timestamps, labels, secondary text |
| Sparkline up | #059669 | Trend going up |
| Sparkline down | #DC2626 | Trend going down |
| Sparkline flat | var(--color-foreground-muted) | No significant change |

### 5.4 Typography Scale

| Element | Size | Weight | Font |
|---------|------|--------|------|
| Page title | 28px | Bold | Crimson Pro (serif) |
| Section headers | 14px | Bold | Inter |
| KPI numbers | 32px | Bold | Crimson Pro |
| KPI labels | 10px | Bold, uppercase | Inter |
| Body text | 13px | Normal | Inter |
| Small text | 11px | Normal | Inter |
| Timestamps | 11px | Normal, muted | Inter |
| Badge text | 10px | Bold, uppercase | Inter |

### 5.5 Animation Specification

| Interaction | Animation | Duration | Easing |
|-------------|-----------|----------|--------|
| Page load | Fade in + slide up 8px | 200ms | ease-out |
| KPI number change | Count up/down | 500ms | ease-in-out |
| Feed item appear | Slide in from top + fade | 200ms | ease-out |
| Section expand | Height transition | 300ms | ease-in-out |
| Brief regenerate | Fade out old → fade in new | 400ms | ease |
| Sparkline draw | SVG stroke-dashoffset | 800ms | ease-out |
| Toast notification | Slide in from right | 200ms | ease-out |
| Command palette | Scale from 95% + fade | 150ms | ease-out |
| Drag-and-drop section | Transform + shadow lift | 200ms | ease |
| Hover state | Background color transition | 150ms | ease |
| Inline edit save | Border flash green | 200ms | ease |

---

## 6. Technical Backend Wiring

### 6.1 Supabase Schema (expanded)

```sql
-- Action Feed (expanded from v2.0)
CREATE TABLE IF NOT EXISTS action_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT CHECK (type IN (
    'approval_needed','overdue','milestone','ai_insight','agent_action',
    'cross_app','system','revenue','warning','deadline'
  )),
  title TEXT NOT NULL,
  description TEXT,
  priority INT DEFAULT 2 CHECK (priority BETWEEN 1 AND 5),
  source_module TEXT,  -- 'content','email','journey','event','campaign','agent','system'
  source_id UUID,      -- ID of the related record in source module
  action_label TEXT,   -- Primary action button text
  action_url TEXT,     -- URL to navigate to
  actions JSONB,       -- Array of {label, type, payload} for multiple actions
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,    -- User who resolved it
  read_by TEXT[] DEFAULT '{}',  -- Array of user IDs who read it
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_feed_unresolved ON action_feed(resolved, priority, created_at DESC);
CREATE INDEX idx_feed_type ON action_feed(type) WHERE resolved = FALSE;
CREATE INDEX idx_feed_read ON action_feed USING GIN(read_by);

-- AI Briefs Cache (expanded)
CREATE TABLE IF NOT EXISTS ai_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generated_date DATE NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  content JSONB NOT NULL,  -- Structured: {overall, win, risk, action, cross_app}
  content_text TEXT NOT NULL,  -- Plain text for email delivery
  context_snapshot JSONB,  -- Data used to generate the brief
  model_used TEXT DEFAULT 'deepseek-chat',
  tokens_used INT,
  follow_ups JSONB DEFAULT '[]',  -- Follow-up questions asked
  created_by TEXT DEFAULT 'system',
  UNIQUE(generated_date, created_by)
);

-- KPI Daily Snapshots (for sparklines)
CREATE TABLE IF NOT EXISTS kpi_daily_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date DATE NOT NULL,
  kpi_name TEXT NOT NULL,
  kpi_value FLOAT NOT NULL,
  kpi_context JSONB,  -- Additional data (breakdown, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(snapshot_date, kpi_name)
);

-- User Dashboard Preferences
CREATE TABLE IF NOT EXISTS user_dashboard_prefs (
  user_id TEXT PRIMARY KEY,
  layout JSONB DEFAULT '{}',  -- Section order and visibility
  kpi_visibility JSONB DEFAULT '[]',  -- Which KPIs to show
  feed_filters JSONB DEFAULT '{}',  -- Default feed filters
  brief_expand_state JSONB DEFAULT '{}',  -- Which brief sections are expanded
  quick_actions JSONB DEFAULT '[]',  -- Custom quick action order
  theme TEXT DEFAULT 'system',  -- light, dark, system
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification Log
CREATE TABLE IF NOT EXISTS notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,  -- 'in_app', 'browser_push', 'email', 'critical'
  feed_id UUID REFERENCES action_feed(id),
  title TEXT NOT NULL,
  body TEXT,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON notification_log(user_id, read, created_at DESC);

-- AI Insight Tracking
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,  -- 'timing_optimization', 'content_gap', 'engagement_drop', etc.
  title TEXT NOT NULL,
  description TEXT,
  data JSONB,  -- Supporting data
  confidence FLOAT CHECK (confidence BETWEEN 0 AND 1),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected','applied')),
  applied_at TIMESTAMPTZ,
  applied_by TEXT,
  result JSONB,  -- What happened after applying (if trackable)
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_insights_pending ON ai_insights(status) WHERE status = 'pending';

-- Cross-App Sync Log
CREATE TABLE IF NOT EXISTS cross_app_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_app TEXT NOT NULL,  -- 'VISTA', 'DEX_AI'
  source_event_id TEXT,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Daily Metrics
CREATE TABLE IF NOT EXISTS agent_daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  metric_date DATE NOT NULL,
  tasks_completed INT DEFAULT 0,
  tasks_failed INT DEFAULT 0,
  avg_response_ms INT,
  tokens_used INT DEFAULT 0,
  actions JSONB DEFAULT '[]',  -- Detailed action log
  UNIQUE(agent_name, metric_date)
);

-- Function: Auto-generate KPI snapshot daily
CREATE OR REPLACE FUNCTION generate_daily_kpi_snapshots()
RETURNS void AS $$
DECLARE
  kpis RECORD;
BEGIN
  -- Content pipeline
  INSERT INTO kpi_daily_snapshots (snapshot_date, kpi_name, kpi_value)
  SELECT CURRENT_DATE, 'content_pipeline',
    COUNT(*) FROM content_assets WHERE status IN ('idea','draft','review','approved')
  ON CONFLICT (snapshot_date, kpi_name) DO UPDATE SET kpi_value = EXCLUDED.kpi_value;

  -- Publishing this week
  INSERT INTO kpi_daily_snapshots (snapshot_date, kpi_name, kpi_value)
  SELECT CURRENT_DATE, 'publishing_this_week',
    COUNT(*) FROM content_schedule
    WHERE scheduled_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
  ON CONFLICT (snapshot_date, kpi_name) DO UPDATE SET kpi_value = EXCLUDED.kpi_value;

  -- Email sequences active
  INSERT INTO kpi_daily_snapshots (snapshot_date, kpi_name, kpi_value)
  SELECT CURRENT_DATE, 'email_sequences_active',
    COUNT(*) FROM email_sequences WHERE status = 'active'
  ON CONFLICT (snapshot_date, kpi_name) DO UPDATE SET kpi_value = EXCLUDED.kpi_value;

  -- Revenue this month
  INSERT INTO kpi_daily_snapshots (snapshot_date, kpi_name, kpi_value)
  SELECT CURRENT_DATE, 'revenue_month',
    COALESCE(SUM(amount), 0) FROM event_registrations
    WHERE payment_status = 'confirmed'
    AND created_at >= date_trunc('month', CURRENT_DATE)
  ON CONFLICT (snapshot_date, kpi_name) DO UPDATE SET kpi_value = EXCLUDED.kpi_value;

  -- Event registrations
  INSERT INTO kpi_daily_snapshots (snapshot_date, kpi_name, kpi_value)
  SELECT CURRENT_DATE, 'event_registrations',
    COUNT(*) FROM event_registrations WHERE payment_status IN ('pending','confirmed')
  ON CONFLICT (snapshot_date, kpi_name) DO UPDATE SET kpi_value = EXCLUDED.kpi_value;
END;
$$ LANGUAGE plpgsql;
```

### 6.2 API Routes (expanded)

| Route | Method | Purpose | Request | Response |
|-------|--------|---------|---------|----------|
| `/api/dashboard/kpis` | GET | All KPI values + sparklines | `?period=7d` | `{ kpis: [{name, value, delta, sparkline: []}], timestamp }` |
| `/api/dashboard/feed` | GET | Action feed (paginated) | `?types=&page=&limit=10` | `{ items: [], total, has_more }` |
| `/api/dashboard/feed/[id]/read` | PATCH | Mark feed item as read | `{ user_id }` | `{ ok }` |
| `/api/dashboard/feed/mark-all-read` | POST | Mark all feed items read | `{ user_id }` | `{ count }` |
| `/api/dashboard/feed/[id]/resolve` | POST | Resolve action item | `{ user_id, resolution }` | `{ ok }` |
| `/api/dashboard/brief` | GET | Get today's brief | `?date=` | `{ brief: { overall, win, risk, action, cross_app }, follow_ups }` |
| `/api/dashboard/brief/regenerate` | POST | Force brief regeneration | `{}` | `{ brief }` |
| `/api/dashboard/brief/follow-up` | POST | Ask follow-up question | `{ question, brief_id }` | `{ answer, sources }` |
| `/api/dashboard/brief/email` | POST | Email brief to user | `{ email }` | `{ sent }` |
| `/api/dashboard/today` | GET | Today's schedule timeline | `?date=` | `{ items: [{ time, title, channel, owner, status }] }` |
| `/api/dashboard/agents` | GET | Agent status + metrics | `?date=` | `{ agents: [{ name, status, today, queue, avg_response }] }` |
| `/api/dashboard/agents/[name]/pause` | POST | Pause an agent | `{}` | `{ ok }` |
| `/api/dashboard/agents/[name]/resume` | POST | Resume an agent | `{}` | `{ ok }` |
| `/api/dashboard/agents/[name]/task` | POST | Assign task to agent | `{ task, priority }` | `{ ok, task_id }` |
| `/api/dashboard/revenue` | GET | Revenue pipeline mini | `?period=month` | `{ total, target, by_source, pending, overdue }` |
| `/api/dashboard/campaigns` | GET | Top campaigns snapshot | `?limit=3` | `{ campaigns: [{ name, progress, content_count, end_date }] }` |
| `/api/dashboard/channels` | GET | Channel health metrics | `?period=30d` | `{ channels: [{ name, metric, value, delta }] }` |
| `/api/dashboard/prefs` | GET | User dashboard preferences | `{ user_id }` | `{ prefs }` |
| `/api/dashboard/prefs` | PATCH | Update preferences | `{ prefs }` | `{ ok }` |
| `/api/dashboard/notifications` | GET | Notification list | `?user_id=&read=` | `{ notifications: [], unread_count }` |
| `/api/dashboard/search` | GET | Global search (Cmd+K) | `?q=&scope=` | `{ results: [{ type, title, url, icon }] }` |
| `/api/sync/inbound` | POST | Cross-app sync (VISTA/DEX AI) | `{ source, event_type, payload }` | `{ ok, feed_id }` |
| `/api/sync/status` | GET | Cross-app sync health | `?app=` | `{ last_sync, pending, errors }` |

### 6.3 Supabase Realtime Subscriptions

```typescript
// 1. Action Feed — new items
supabase
  .channel('dashboard-feed')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'action_feed' },
    (payload) => {
      // 1. Prepend to feed
      // 2. Show toast notification
      // 3. Increment bell badge
      // 4. Play subtle sound (if enabled in prefs)
    }
  )
  .subscribe()

// 2. KPI changes — any content/email/event update
supabase
  .channel('dashboard-kpis')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'content_assets' },
    () => refetchKPIs()
  )
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'content_schedule' },
    () => refetchKPIs()
  )
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'email_sequences' },
    () => refetchKPIs()
  )
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'event_registrations' },
    () => { refetchKPIs(); refetchRevenue() }
  )
  .subscribe()

// 3. Agent status changes
supabase
  .channel('dashboard-agents')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'agent_daily_metrics' },
    (payload) => {
      // Update agent cards
    }
  )
  .subscribe()

// 4. Cross-app sync events
supabase
  .channel('dashboard-sync')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'cross_app_sync_log' },
    (payload) => {
      // Show "Synced from VISTA/DEX AI" toast
      // Add to feed if relevant
    }
  )
  .subscribe()
```

### 6.4 Caching Strategy

| Data | Cache Location | TTL | Invalidation |
|------|---------------|-----|--------------|
| KPI values | React Query (client) | 30s | Realtime subscription |
| Action feed | React Query | 60s | Realtime INSERT event |
| Executive brief | API route (server) | 24h | Manual regenerate or daily cron |
| Agent status | React Query | 15s | Realtime subscription |
| Channel health | React Query | 5min | Time-based |
| Revenue data | React Query | 5min | Realtime on registration insert |
| Sparklines | React Query | 1h | Daily (after snapshot generation) |
| User prefs | localStorage | Permanent | On PATCH API success |
| Search results | React Query | 30s | On data mutation |

### 6.5 Performance Budget

| Metric | Target |
|--------|--------|
| First Contentful Paint | <800ms |
| Largest Contentful Paint | <2s |
| Time to Interactive | <3s |
| KPI cards render | <500ms (from cache) |
| Brief render | <1s (from cache) |
| Feed first page | <800ms |
| Bundle size (dashboard page) | <150KB gzipped |
| Supabase queries per page load | <8 |

---

## 7. AI Layer Specification

### 7.1 Executive Brief — Persona (expanded)

```yaml
name: "NEXUS Chief of Staff"
role: "Executive Operations Summary + Advisor"
model: deepseek-chat (flash)
temperature: 0.3
max_tokens: 800
timeout: 15s

system_prompt: |
  You are NEXUS, Chief of Staff for LYC Partners marketing operations.
  You report to Kevin. You manage the WAVE platform.

  GENERATE A STRUCTURED BRIEF WITH 5 SECTIONS:
  
  1. OVERALL STATUS (green/yellow/red + 1 sentence why)
  2. TOP WIN (biggest positive development, with numbers)
  3. TOP RISK (biggest threat or gap, with numbers)
  4. RECOMMENDED ACTION (most impactful thing Kevin can do today)
  5. CROSS-APP (insights from VISTA outbound + DEX AI portal)
  
  RULES:
  - Be specific: use exact numbers, dates, names
  - Lead with what matters most
  - If nothing notable happened, say "Steady state. No flags."
  - Never use corporate jargon
  - Each section: 1-2 sentences max in summary
  - When expanded, provide supporting data
  - If you detect a pattern across data, call it out
  
  CONTEXT FORMAT:
  You will receive structured JSON data from Supabase.
  Use all sections. If a section has no data, note "No data available."

follow_up_prompt: |
  The user is asking a follow-up question about the brief.
  Answer using the same context data. Be specific with numbers.
  If you can take an action, suggest it: "Want me to [action]?"
```

### 7.2 AI Insight Engine (expanded)

**Insight types (12 categories):**

| Type | Detection Logic | Confidence | Action |
|------|----------------|------------|--------|
| `timing_optimization` | Compare publish time vs engagement rate per channel | 0.7-0.95 | [Reschedule to suggested time] |
| `content_gap` | No content for product/cluster in 14+ days | 0.9 | [Generate content idea] |
| `engagement_drop` | Open rate / engagement down >15% vs 4-week avg | 0.8 | [Analyze last 3 sends] |
| `journey_bottleneck` | >30% drop-off at specific journey step | 0.85 | [View journey step] |
| `registration_velocity` | Daily registrations <50% of 14-day avg | 0.75 | [Boost event promo] |
| `cross_sell_signal` | Assessment completions → program eligibility | 0.9 | [Start nurture journey] |
| `overload_warning` | 4+ content pieces on same channel same day | 0.95 | [Reschedule] |
| `template_underuse` | Template exists but not used in 30+ days | 0.7 | [Use template] |
| `agent_idle` | Agent idle >2h during business hours | 0.8 | [Assign task] |
| `revenue_anomaly` | Payment failures spike >3 in 24h | 0.9 | [Check payment system] |
| `seasonal_pattern` | Historical data shows engagement pattern | 0.6 | [Adjust schedule] |
| `competitor_signal` | External data (if connected) shows competitor move | 0.5 | [Review and respond] |

**Cron schedule:** Every 4 hours (6am, 10am, 2pm, 6pm)
**Suppression:** If user dismissed same insight type in last 7 days, don't regenerate

### 7.3 Inline AI Interaction

**Follow-up question flow:**
1. User types in [Ask follow-up...] input below brief
2. System sends to `/api/dashboard/brief/follow-up` with:
   - Question text
   - Brief ID (for context)
   - Current Supabase data snapshot
3. AI responds in 2-5 seconds
4. Response appears inline below input
5. Follow-up preserved for 24h session

**Example interactions:**
- "Why is BRIDGE content gap happening?" → "No BRIDGE content assigned to any owner since Jun 23. The last BRIDGE piece was 'Case Study: Executive Assessment' (published Jun 20). No drafts in pipeline. Suggest: assign BRIDGE content to Echo this week."
- "What's the revenue outlook?" → "€12,400 confirmed this month (49% of €25K target). €4,200 pending (18 registrations). At current pace, you'll hit ~€18K by month end. Gap: €7K. To close: push Leadership Summit early-bird (12 pending payments) and activate SHIFT-DRIVE assessment upsell to 23 completed LEASSESSMENT graduates."
- "Which agent is underperforming?" → "Emily (Registration) has been idle for 3 hours. Last action: processed 12 registrations at 14:00. No pending tasks in queue. Suggest: assign Emily to follow up on 3 overdue payment registrations (€800 total)."

---

## 8. Tickets (DASH-001 through DASH-036)

### Original 12 tickets (from v2.0, refined)

| Ticket | Title | Priority | Effort | Dependencies |
|--------|-------|----------|--------|--------------|
| DASH-001 | Build KPI query layer (8 KPIs from Supabase) | P0 | 4h | T-002, T-003 |
| DASH-002 | Create `action_feed` table + seed data | P0 | 2h | T-002 |
| DASH-003 | Build ActionFeed component with infinite scroll | P0 | 4h | DASH-002 |
| DASH-004 | Build inline action buttons on feed items | P0 | 3h | DASH-003 |
| DASH-005 | Build ExecutiveBrief component (collapsible sections) | P0 | 4h | T-004 |
| DASH-006 | Build `/api/dashboard/brief` route (cache+generate) | P0 | 3h | DASH-005 |
| DASH-007 | Create `ai_briefs` table + caching logic | P1 | 1h | T-002 |
| DASH-008 | Build QuickActionsBar (persistent, customizable) | P1 | 3h | — |
| DASH-009 | Build InlineCreateForm (quick content creation) | P1 | 4h | T-010 |
| DASH-010 | Wire Supabase Realtime for feed + KPI updates | P1 | 3h | DASH-001, DASH-003 |
| DASH-011 | Build AI Insight Engine (cron, 4h interval, 12 types) | P2 | 8h | T-004, DASH-002 |
| DASH-012 | Build cross-app sync endpoint (`/api/sync/inbound`) | P1 | 3h | DASH-002 |

### New 24 tickets (expansion)

| Ticket | Title | Priority | Effort | Dependencies |
|--------|-------|----------|--------|--------------|
| DASH-013 | Add sparklines to KPI cards (7-day trend from `kpi_daily_snapshots`) | P0 | 3h | DASH-001, DASH-019 |
| DASH-014 | Build KPI drill-down navigation (click → filtered page via query params) | P0 | 2h | DASH-001 |
| DASH-015 | Build KPI hover tooltip (detailed comparison data) | P1 | 2h | DASH-001 |
| DASH-016 | Build Action Feed filtering bar (by type, time, read status) | P0 | 3h | DASH-003 |
| DASH-017 | Build read/unread tracking for feed items (`read_by` array) | P1 | 2h | DASH-002 |
| DASH-018 | Build Notification Bell (badge count, dropdown, mark all read) | P0 | 4h | DASH-002, DASH-017 |
| DASH-019 | Create `kpi_daily_snapshots` table + daily cron job | P0 | 2h | T-002 |
| DASH-020 | Build Brief section expansion (each section collapsible with detail) | P0 | 3h | DASH-005 |
| DASH-021 | Build Brief follow-up question input + AI response | P1 | 4h | DASH-006 |
| DASH-022 | Build Brief history panel (last 30 days, side panel) | P2 | 3h | DASH-007 |
| DASH-023 | Build Brief email delivery (`/api/dashboard/brief/email`) | P2 | 2h | DASH-006 |
| DASH-024 | Build Today's Schedule timeline (horizontal, inline actions) | P0 | 5h | T-002 |
| DASH-025 | Build Agent Status expanded cards (metrics, pause/resume, task assign) | P1 | 5h | T-005 |
| DASH-026 | Create `agent_daily_metrics` table + agent reporting logic | P1 | 3h | T-005 |
| DASH-027 | Build Revenue Pipeline Mini section | P1 | 3h | T-002 |
| DASH-028 | Build Campaign Performance Snapshot (top 3 campaigns) | P1 | 3h | T-002 |
| DASH-029 | Build Channel Health section (per-channel bars) | P1 | 3h | T-002 |
| DASH-030 | Build Global Search / Command Palette (Cmd+K) | P0 | 6h | — |
| DASH-031 | Build User Dashboard Preferences (layout, KPI visibility, feed filters) | P1 | 4h | DASH-008 |
| DASH-032 | Create `user_dashboard_prefs` table + preference API | P1 | 2h | T-002 |
| DASH-033 | Build drag-and-drop section reordering | P2 | 4h | DASH-031 |
| DASH-034 | Build responsive layout (mobile/tablet breakpoints) | P1 | 4h | All DASH sections |
| DASH-035 | Build Notification System (browser push + email digest + critical alerts) | P1 | 5h | DASH-018 |
| DASH-036 | Build Accessibility layer (ARIA labels, keyboard nav, screen reader) | P1 | 3h | All DASH components |

**Total: 36 tickets | ~126 hours**

### Effort Breakdown by Priority

| Priority | Tickets | Hours | % of Total |
|----------|---------|-------|------------|
| P0 | 17 | 62h | 49% |
| P1 | 15 | 52h | 41% |
| P2 | 4 | 12h | 10% |

### Implementation Phases

**Phase 1 (P0 — Core, 62h, ~2 weeks):**
DASH-001 → 006, 013, 014, 016, 018, 019, 020, 024, 030
→ Delivers: Real KPIs with sparklines, actionable feed with filters, notification bell, structured brief with expandable sections, today's timeline, command palette

**Phase 2 (P1 — Enhanced, 52h, ~1.5 weeks):**
DASH-008, 009, 010, 012, 015, 017, 021, 025, 026, 027, 028, 029, 031, 032, 034, 035
→ Delivers: Customizable quick actions, realtime, agent controls, revenue/campaign/channel sections, user preferences, responsive, notifications

**Phase 3 (P2 — Polish, 12h, ~3 days):**
DASH-011, 022, 023, 033
→ Delivers: AI insight engine (12 types), brief history, brief email, drag-and-drop layout

---

## 9. Acceptance Criteria

### Core (P0)
- [ ] All 9 KPI cards show real Supabase data with 7-day sparklines
- [ ] KPI cards update in real-time via Supabase Realtime (no page refresh)
- [ ] KPI cards clickable → navigate to filtered page
- [ ] Executive brief auto-generates at 6:00 AM daily
- [ ] Brief has 5 collapsible sections with expandable detail
- [ ] Brief can be manually regenerated
- [ ] Action feed shows actionable items with inline buttons (multiple per item)
- [ ] Feed filterable by type (approvals, overdue, AI, agents, cross-app, revenue)
- [ ] Feed has read/unread tracking with notification bell
- [ ] Notification bell shows unread count + dropdown
- [ ] Today's Schedule shows horizontal timeline with inline actions
- [ ] Command palette (Cmd+K) works for search + quick actions + AI commands
- [ ] Cross-app events from VISTA/DEX AI appear in feed within 30s
- [ ] Daily KPI snapshots generated via cron
- [ ] Page loads <2s (FCP <800ms)

### Enhanced (P1)
- [ ] Quick Actions bar customizable (reorder, add/remove)
- [ ] Agent status shows today's metrics, queue, pause/resume controls
- [ ] Revenue Pipeline Mini shows monthly progress + breakdown
- [ ] Campaign Performance shows top 3 with progress bars
- [ ] Channel Health shows per-channel metrics with trends
- [ ] Brief follow-up questions work (inline AI chat)
- [ ] User preferences persist (layout, KPI visibility, feed filters)
- [ ] Mobile responsive (single column, compact mode)
- [ ] Browser push notifications work (with permission)
- [ ] Email digest sends at 8am daily

### Polish (P2)
- [ ] AI Insight Engine runs every 4h, detects 12 insight types
- [ ] Brief history panel shows last 30 days
- [ ] Brief can be emailed to user
- [ ] Dashboard sections can be reordered via drag-and-drop
- [ ] All sections have ARIA labels
- [ ] Full keyboard navigation works (Tab through all interactive elements)

---

## 10. Component Architecture

### 10.1 Component Tree

```
DashboardPage
├── NotificationBell
│   └── NotificationDropdown
├── QuickActionsBar
│   └── QuickActionButton (×N)
├── CommandPalette (Cmd+K, global overlay)
├── ExecutiveBrief
│   ├── BriefSection (×5, collapsible)
│   │   └── BriefDetail (expanded content)
│   ├── FollowUpInput
│   └── BriefActions [↻] [📧] [📜]
├── KPIGrid
│   └── KPICard (×9)
│       ├── SparklineChart
│       ├── TrendBadge
│       └── HoverTooltip
├── MainGrid (2-column on desktop)
│   ├── ActionFeed
│   │   ├── FeedFilterBar
│   │   ├── FeedItem (×N, infinite scroll)
│   │   │   └── InlineActions
│   │   └── FeedFooter [Mark all read] [View all]
│   └── TodaysSchedule
│       ├── TimelineBar
│       └── ScheduleItem (×N)
├── SecondaryGrid (2-column on desktop)
│   ├── ChannelHealth
│   │   └── ChannelBar (×5)
│   ├── CampaignSnapshot
│   │   └── CampaignCard (×3)
│   ├── RevenueMini
│   └── AgentStatus
│       └── AgentCard (×5)
│           ├── AgentMetrics
│           └── AgentControls [⏸] [▸] [View log]
└── DashboardSettings (drawer, layout customization)
```

### 10.2 Key Component Props

```typescript
// KPICard
interface KPICardProps {
  name: string;
  label: string;
  value: number;
  previousValue: number;
  unit?: string;  // '€', '%', ''
  sparkline: number[];  // 7 data points
  trend: 'up' | 'down' | 'flat';
  trendSignificant: boolean;
  onClick: () => void;  // Drill-down navigation
  loading?: boolean;
  error?: boolean;
}

// ActionFeedItem
interface ActionFeedItemProps {
  id: string;
  type: FeedType;
  title: string;
  description?: string;
  priority: number;
  actions: FeedAction[];
  sourceModule: string;
  sourceId?: string;
  isRead: boolean;
  createdAt: string;
  onAction: (action: FeedAction) => void;
  onMarkRead: () => void;
}

// ExecutiveBrief
interface ExecutiveBriefProps {
  date: string;
  status: 'green' | 'yellow' | 'red';
  sections: BriefSection[];
  onRegenerate: () => void;
  onEmail: () => void;
  onHistory: () => void;
  onFollowUp: (question: string) => Promise<string>;
}

// AgentCard
interface AgentCardProps {
  name: string;
  role: string;
  status: 'active' | 'idle' | 'paused' | 'error';
  todayMetrics: { completed: number; failed: number };
  queueDepth: number;
  avgResponseMs: number;
  lastAction: { text: string; time: string };
  onPause: () => void;
  onResume: () => void;
  onViewLog: () => void;
  onAssignTask: (task: string) => void;
}
```

---

*Next iteration: Kevin to confirm scope. Then expand Page 2: Content Calendar.*
