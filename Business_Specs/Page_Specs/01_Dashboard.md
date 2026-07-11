# WAVE Business Spec — Page 1: Dashboard

**Version:** 2.0 | **Date:** 2026-07-11 | **Status:** Draft for Kevin Review
**Builds on:** TICKET-006 (existing — static KPI cards + hardcoded activity feed)
**Gap tickets:** DASH-001 through DASH-012

---

## 1. Purpose

The Dashboard is the single entry point for all WAVE users. It answers three questions in under 5 seconds:
1. **What's happening right now?** (real-time status)
2. **What needs my attention?** (action items, blockers, overdue)
3. **What's the AI saying?** (executive brief with recommendations)

It must feel like opening Notion — clean, fast, everything you need at a glance, with inline actions (not just links to other pages).

---

## 2. Business Requirements

### 2.1 Real-time KPI Cards (replace static numbers)

| KPI | Source | Refresh | Action on Click |
|-----|--------|---------|-----------------|
| Content in Pipeline | `content_assets` WHERE status IN ('idea','draft','review') | Realtime | Opens Content Calendar filtered to pipeline |
| Publishing This Week | `content_assets` WHERE scheduled_date BETWEEN now AND now+7d | Realtime | Opens calendar week view |
| Email Sequences Active | `email_sequences` WHERE status = 'active' | Realtime | Opens Distribution page filtered to active |
| Journey Conversions (30d) | `journey_metrics` WHERE created_at > now-30d | Hourly | Opens Journey Analytics |
| Upcoming Events (30d) | `events` WHERE start_at BETWEEN now AND now+30d | Realtime | Opens Events page |
| Open Registrations | `event_registrations` WHERE payment_status IN ('pending','confirmed') | Realtime | Opens Registrations list |
| Campaigns Active | `campaigns` WHERE status = 'active' | Realtime | Opens Campaign list |
| AI Credits Remaining | DeepSeek API usage tracker | On-demand | Opens Settings → API Usage |

### 2.2 Action Feed (replaces static "Recent Activity")

Not just a log — an **actionable queue**. Each item has:
- What happened
- Who/what triggered it
- What you can do (button inline)
- When it happened

**Feed types:**

| Type | Example | Inline Action |
|------|---------|---------------|
| Approval needed | "Podcast show notes ready for review" | [Review] [Approve] [Edit] |
| Overdue | "LinkedIn post due Jul 8 — still in Draft" | [Open] [Reschedule] [Mark done] |
| Milestone | "Webinar registrations hit 100" | [View attendees] [Send reminder] |
| AI insight | "LinkedIn posts perform 3x better on Tue/Thu 8-9am" | [Apply suggestion] [Dismiss] |
| Agent action | "Echo published 'Q3 Newsletter' to website" | [View content] [Undo] |
| Cross-app | "DEX AI: 12 new assessment completions → nurture eligible" | [View contacts] [Start journey] |

### 2.3 Executive Brief (AI-generated, replaces static text)

A 3-5 sentence paragraph at the top of the dashboard, regenerated daily at 6:00 AM (or on-demand), summarizing:
- What happened in the last 24 hours
- What's coming in the next 7 days
- Top risk or opportunity
- One recommended action

**Persona:** Chief of Staff — concise, data-driven, no fluff. Speaks to Kevin directly.

**Prompt template:**
```
You are NEXUS, Kevin's Chief of Staff for LYC Partners marketing operations.
Generate a brief executive summary of WAVE platform status.

CONTEXT (from Supabase):
- Content: {content_stats} (published this week, in pipeline, overdue)
- Email: {email_stats} (sequences active, sends last 7d, open rates)
- Journeys: {journey_stats} (active journeys, new enrollments, conversion rates)
- Events: {event_stats} (upcoming, registrations, revenue)
- Campaigns: {campaign_stats} (active, KPI progress)
- Agents: {agent_stats} (actions taken in last 24h)
- Cross-app: {vista_stats} (new inbound leads), {dexai_stats} (new registrations)

OUTPUT FORMAT:
1. One sentence: overall status (green/yellow/red) and why
2. One sentence: biggest win in last 24h
3. One sentence: biggest risk or blocker
4. One sentence: recommended action for today
5. (Optional) One sentence: cross-app insight

TONE: Direct. Data-backed. No corporate speak. Under 80 words total.
```

### 2.4 Quick Actions Bar (always visible)

Persistent bar at top-right with the 5 most-used actions:
1. [+ Content] — opens inline creation (not modal)
2. [Send Email] — opens sequence selector
3. [Create Event] — opens event form
4. [Generate Brief] — forces AI brief regeneration
5. [Sync All] — triggers Supabase → VISTA/DEX AI sync

---

## 3. User Requirements

| User | What They Need From Dashboard | Priority |
|------|-------------------------------|----------|
| **Kevin** | Executive brief, campaign ROI, cross-app insights, red flags | P0 |
| **Echo** | What content is due today, what needs approval, publishing conflicts | P0 |
| **Maria** | Email sequence performance, mailing list stats, pending sends | P0 |
| **Carl** | Upcoming events, registration counts, reminder status | P1 |
| **Valentina** | Website publishing queue, content ready for deployment | P1 |
| **Emily** | Pending registrations, payment issues, form submissions | P1 |
| **NEXUS** | Agent actions log, cross-app sync status, AI credit usage | P1 |

---

## 4. UX Requirements (Notion-like feel)

### 4.1 Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ [Quick Actions: +Content | Send Email | Create Event | ↻ Sync] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Executive Brief (AI-generated, 3-5 lines, collapsible)        │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 🟢 WAVE is green. Published 12 pieces this week. Risk:    │ │
│  │ Webinar on Jul 18 has only 40 registrations (target: 100).│ │
│  │ Recommend: Boost LinkedIn promo for webinar.              │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
├──────────────┬──────────────┬──────────────┬──────────────────┤
│ Content      │ Email        │ Journeys     │ Events           │
│ In Pipeline  │ Active       │ Conversions  │ Registrations    │
│    [147]     │    [18]      │   [340]      │    [847]         │
│  +12% ↑      │  +3 new     │  +8% ↑       │  +56 today       │
│  [→ View]    │  [→ View]   │  [→ View]    │  [→ View]        │
├──────────────┴──────────────┴──────────────┴──────────────────┤
│                                                                 │
│  Action Feed                                                    │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ⚠️ LinkedIn post due Jul 8 — still Draft      [Open] [→]  │ │
│  │ ✅ Echo published "AI in Leadership"          [View] [↩]  │ │
│  │ 💡 AI: Tue/Thu 8am posts get 3x engagement    [Apply]     │ │
│  │ 🔔 DEX AI: 12 new assessments → nurture ready [View]      │ │
│  │ ⚠️ Webinar Jul 18: 40/100 registrations       [Boost]     │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Today's Content              │ Agent Status                   │
│  ┌────────────────────────┐   │ ┌──────────────────────────┐  │
│  │ 09:00 LinkedIn - Echo  │   │ │ 🟢 Echo - Published 2    │  │
│  │ 14:00 Newsletter-Maria │   │ │ 🟢 Maria - Sent 1,240    │  │
│  │ 16:00 Podcast - Carl   │   │ │ 🟡 Emily - Idle 3h       │  │
│  └────────────────────────┘   │ └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Interaction Patterns

- **KPI cards are clickable** — click opens filtered view of that module (uses Next.js router push with query params)
- **Executive brief is collapsible** — click to expand/collapse, remembers state in localStorage
- **Action feed is infinite scroll** — loads 10 items, loads more on scroll
- **Inline actions on feed items** — buttons directly on the feed item, not requiring navigation
- **Quick actions open inline creation** — [+ Content] opens an inline form below the brief (not a modal overlay)
- **Real-time updates** — Supabase realtime pushes new feed items, new KPI values, no page refresh needed
- **Dark mode** — respects system preference, stored in user settings
- **Mobile responsive** — single column on mobile, KPI cards stack, feed full-width

### 4.3 Empty States

- No content in pipeline → "No content in pipeline. [Create your first piece]"
- No active campaigns → "No active campaigns. [Start a campaign]"
- AI brief loading → Skeleton animation with "Analyzing your operations..."
- No action items → "All clear! Nothing needs your attention right now."

---

## 5. Design Requirements

### 5.1 Visual Language (matches Notion/Linear/Replit aesthetic)

- **Cards:** Subtle border (1px var(--color-border)), 8px border-radius, 16px padding, no heavy shadows
- **KPI numbers:** 32px bold serif font, 11px uppercase label above, delta badge below
- **Action feed:** Clean list, no cards — just dividers, icon on left, text center, action right
- **Colors:** Use semantic colors (success=green, warning=amber, error=red, info=blue) — not random
- **Spacing:** Consistent 4px grid (4, 8, 12, 16, 24, 32, 48px)
- **Typography:** Crimson Pro for headings, Inter for body — no mixing
- **Animations:** Subtle fade-in on page load (200ms), smooth transitions on hover (150ms), no bouncing/spinning

### 5.2 Component Library (new components needed)

| Component | Used In | Notion-equivalent |
|-----------|---------|-------------------|
| `KpiCard` | Dashboard, Analytics, Campaign detail | Linear's stat cards |
| `ActionFeedItem` | Dashboard, Campaign detail | Notion's activity log |
| `InlineCreateForm` | Dashboard, Content, Templates | Notion's inline new page |
| `StatusPill` | All tables | Linear's status badges |
| `AgentIndicator` | Dashboard, Agents page | Vercel's deployment status |
| `BriefCard` | Dashboard (executive brief) | Custom — collapsible AI summary |
| `QuickActionBar` | Dashboard (persistent top bar) | Linear's command bar |

---

## 6. Technical Backend Wiring

### 6.1 Supabase Queries (real-time)

```typescript
// KPI: Content in pipeline
const { data } = await supabase
  .from('content_assets')
  .select('id, status')
  .in('status', ['idea', 'draft', 'review', 'approved'])

// KPI: Publishing this week
const weekStart = startOfWeek(new Date())
const weekEnd = endOfWeek(new Date())
const { data } = await supabase
  .from('content_assets')
  .select('id, scheduled_date')
  .gte('scheduled_date', weekStart)
  .lte('scheduled_date', weekEnd)

// KPI: Email sequences active
const { data } = await supabase
  .from('email_sequences')
  .select('id')
  .eq('status', 'active')

// Action feed (latest 20)
const { data } = await supabase
  .from('action_feed')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(20)

// Today's content schedule
const today = format(new Date(), 'yyyy-MM-dd')
const { data } = await supabase
  .from('content_assets')
  .select('title, channel, owner, scheduled_time, status')
  .eq('scheduled_date', today)
  .order('scheduled_time')
```

### 6.2 Supabase Realtime Subscriptions

```typescript
// Subscribe to action_feed inserts
supabase
  .channel('dashboard-feed')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'action_feed' },
    (payload) => {
      // Prepend new item to feed, show toast
    }
  )
  .subscribe()

// Subscribe to content_assets updates
supabase
  .channel('dashboard-content')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'content_assets' },
    (payload) => {
      // Refetch KPI counts
    }
  )
  .subscribe()
```

### 6.3 API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/dashboard/kpis` | GET | Returns all 8 KPI values |
| `/api/dashboard/feed` | GET | Returns action feed (paginated) |
| `/api/dashboard/brief` | GET | Returns cached AI brief (or generates new) |
| `/api/dashboard/brief/regenerate` | POST | Forces AI brief regeneration |
| `/api/dashboard/today` | GET | Returns today's content schedule |
| `/api/dashboard/agents` | GET | Returns agent status |
| `/api/sync/inbound` | POST | Cross-app sync endpoint (VISTA/DEX AI) |

### 6.4 New Supabase Tables

```sql
-- Action Feed
CREATE TABLE action_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT CHECK (type IN ('approval_needed','overdue','milestone','ai_insight','agent_action','cross_app','system')),
  title TEXT NOT NULL,
  description TEXT,
  priority INT DEFAULT 2 CHECK (priority BETWEEN 1 AND 5),
  source_module TEXT,
  source_id UUID,
  action_label TEXT,
  action_url TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_feed_unresolved ON action_feed(resolved, created_at DESC);

-- AI Briefs Cache
CREATE TABLE ai_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generated_date DATE NOT NULL UNIQUE,
  content TEXT NOT NULL,
  context_snapshot JSONB,
  model_used TEXT DEFAULT 'deepseek-chat',
  tokens_used INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.5 Cross-App Sync (VISTA / DEX AI → WAVE)

```typescript
// POST /api/sync/inbound
export async function POST(req: Request) {
  const { source, event_type, payload } = await req.json()
  await supabase.from('action_feed').insert({
    type: 'cross_app',
    title: `${source}: ${payload.summary}`,
    source_module: source,
    action_label: payload.action_label,
    action_url: payload.action_url
  })
  return Response.json({ ok: true })
}
```

---

## 7. AI Layer Specification

### 7.1 Executive Brief — AI Persona

```yaml
name: "NEXUS Chief of Staff"
role: "Executive Operations Summary"
model: deepseek-chat (flash)
temperature: 0.3
max_tokens: 200
system_prompt: |
  You are NEXUS, Chief of Staff for LYC Partners marketing operations.
  Give Kevin a 30-second briefing on what matters.
  - Lead with status (green/yellow/red) and why
  - Be specific with numbers
  - One win, one risk, one action
  - No corporate jargon. Under 80 words.
```

### 7.2 AI Insight Engine (feeds into Action Feed)

Runs every 4 hours, scans WAVE data for patterns:

```yaml
insight_types:
  - timing_optimization: "LinkedIn posts perform 3x better on Tue/Thu 8-9am"
  - content_gap: "No content published for BRIDGE product in 14 days"
  - engagement_drop: "Newsletter open rate dropped 15% in last 3 sends"
  - journey_bottleneck: "Journey 'Webinar Follow-up' has 40% drop-off at Step 3"
  - registration_velocity: "Event registrations slowing — 5/day vs avg 15/day"
  - cross_sell_signal: "23 contacts completed LEAP assessment — SHIFT-DRIVE ready"
```

### 7.3 Inline AI Actions

- **[Regenerate Brief]** — forces new brief generation with current data
- **[Ask NEXUS]** — opens inline chat: "What should I focus on today?"
- **[Dismiss Insight]** — marks as not relevant (suppresses similar for 7 days)

---

## 8. Tickets (DASH-001 to DASH-012)

| Ticket | Title | Priority | Effort | Dependencies |
|--------|-------|----------|--------|--------------|
| DASH-001 | Replace hardcoded KPIs with Supabase queries | P0 | 4h | T-002, T-003 |
| DASH-002 | Create `action_feed` table + seed data | P0 | 2h | T-002 |
| DASH-003 | Build Action Feed component with infinite scroll | P0 | 4h | DASH-002 |
| DASH-004 | Build Inline Action buttons on feed items | P0 | 3h | DASH-003 |
| DASH-005 | Create Executive Brief component (collapsible) | P0 | 3h | T-004 |
| DASH-006 | Build `/api/dashboard/brief` route (cache+generate) | P0 | 3h | DASH-005 |
| DASH-007 | Create `ai_briefs` table + caching logic | P1 | 1h | T-002 |
| DASH-008 | Build Quick Actions Bar (persistent top-right) | P1 | 2h | — |
| DASH-009 | Build Inline Create Form ([+ Content] action) | P1 | 4h | T-010 |
| DASH-010 | Wire Supabase Realtime for feed + KPI updates | P1 | 3h | DASH-001, DASH-003 |
| DASH-011 | Build AI Insight Engine (cron, 4h interval) | P2 | 5h | T-004, DASH-002 |
| DASH-012 | Build cross-app sync endpoint (`/api/sync/inbound`) | P1 | 3h | DASH-002 |

**Total: 37 hours**

---

## 9. Acceptance Criteria

- [ ] All KPI cards show real Supabase data (not hardcoded)
- [ ] KPI cards update in real-time (no page refresh)
- [ ] Executive brief auto-generates at 6:00 AM daily
- [ ] Brief can be manually regenerated
- [ ] Action feed shows actionable items with inline buttons
- [ ] Inline buttons perform actions or navigate with context
- [ ] Quick Actions bar always visible
- [ ] [+ Content] opens inline form (not modal)
- [ ] Cross-app events from VISTA/DEX AI appear in feed within 30s
- [ ] Mobile responsive
- [ ] Empty states with helpful CTAs
- [ ] Page loads <2s
- [ ] Matches Notion/Linear aesthetic

---

*Next: Page 2 — Content Calendar (inline editing, bulk ops, AI scheduling)*
