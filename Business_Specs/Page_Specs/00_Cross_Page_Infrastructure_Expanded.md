# WAVE Business Spec — Cross-Page Infrastructure (EXPANDED)

**Version:** 2.1 | **Date:** 2026-07-11 | **Status:** Draft for Kevin Review
**Scope:** Platform-level capabilities used by ALL pages (Dashboard, Calendar, Templates, Distribution, Journeys, Repurposing, Events, Analytics)
**Gap tickets:** INFRA-100 through INFRA-112 (13 new infrastructure tickets)
**Total effort:** 80h (~3 weeks)
**Dependency:** Must be built BEFORE per-page retrofit tickets (DASH-037+, CAL-043+, TPL-060+, DIST-067+)

---

## 1. Purpose

WAVE's page specs define rich, interactive surfaces. But the audit revealed 12 systemic gaps that no single page can fix alone — they require **platform-level infrastructure** built once and consumed everywhere.

**What this spec delivers:**
1. **Resizable Panel System** — every panel on every page can be resized by dragging edges
2. **Split View Component** — view two things side-by-side on any page
3. **Focus Mode Engine** — one toggle hides everything except top priorities
4. **Milestone Tracker** — "Next milestone → steps remaining → progress" on every page
5. **Workspace Memory** — resume exactly where you left off on any page
6. **Layout Presets** — save/switch named workspace configurations
7. **Next Action Callout** — persistent "DO THIS NOW" banner on every page
8. **Cross-Page Drag-and-Drop** — drag items across page boundaries
9. **Priority Engine** — centralized priority scoring for all items across all pages
10. **Guided Flow Engine** — step-by-step wizards with progress + resume
11. **Global Presence System** — see who's active, what they're doing, across all pages
12. **Inline Target Editor** — click any number/target/threshold → edit → save
13. **Unified Health Score** — single 0-100 score per page, always visible

**The Kevin Standard (what these 13 capabilities enable):**

| Capability | What It Enables |
|-----------|----------------|
| Resize + Split | "I want to see my content calendar AND the template I'm working from, side by side, with the calendar wider" |
| Focus Mode | "I have 20 minutes. Show me ONLY the 3 most urgent things. Hide everything else." |
| Milestone Tracker | "I see: 'Q3 BRIDGE Push launch in 8 days. 3/5 steps done. Next: approve 2 content pieces.'" |
| Workspace Memory | "I open WAVE. It scrolls to where I was. My filters are still set. The template I was editing is highlighted." |
| Layout Presets | "Morning: I switch to 'Review' preset — feed expanded, KPIs hidden. Deep work: 'Create' preset — editor full-width." |
| Next Action | "Top of every page screams: 'Approve 3 content pieces overdue' or 'Send welcome sequence — 47 waiting'" |
| Cross-Page Drag | "I drag a template from Templates page → drop on Calendar → content is created and scheduled" |
| Priority Engine | "Everything across WAVE has a single priority score. I always know what's #1, #2, #3" |
| Guided Flows | "Create campaign: Step 1 define goal ✓ → Step 2 select templates → Step 3 build calendar → ... → Step 6 launch" |
| Global Presence | "I see Echo is active on Calendar. Maria is editing Welcome Sequence. Carl is idle." |
| Inline Targets | "Revenue target shows €25K. I click it, type €30K, Enter. Done. No settings page." |
| Health Score | "Content Calendar shows 78/100. I click it: breakdown shows AI score 82, deadline compliance 65, approval bottlenecks 71." |

---

## 2. Business Requirements

### 2.1 Resizable Panel System (INFRA-100)

**Core concept:** Every page is composed of panels. Every panel edge that borders another panel (or the page edge) is draggable to resize.

**Panel types:**
| Panel Type | Min Width | Max Width | Min Height | Max Height | Default |
|-----------|-----------|-----------|------------|------------|---------|
| Sidebar (folder tree, filter panel) | 180px | 400px | 100% viewport | 100% viewport | 240px |
| Main content area | 400px | 100% | 300px | 100% | flex-grow |
| Detail panel (side drawer) | 300px | 600px | 100% viewport | 100% viewport | 420px |
| Top section (KPIs, brief, health) | 100% | 100% | 80px | 400px | auto |
| Bottom section (feed, timeline) | 100% | 100% | 150px | 80vh | auto |
| Split pane (left) | 200px | 80% | 100% | 100% | 50% |
| Split pane (right) | 200px | 80% | 100% | 100% | 50% |

**Resize behavior:**
- Hover panel edge → cursor changes to `col-resize` or `row-resize`
- Edge highlights (2px brand color) on hover
- Drag → live preview (other panel shrinks/grows in real-time)
- Release → size saved to `user_workspace_memory.panel_sizes[page_id]` (JSONB)
- Double-click edge → reset to default size
- Min/max constraints enforced (can't resize below min or above max)

**Touch/mobile:**
- Touch target: 12px wide drag handle (visually 2px, but touch area 12px)
- Long-press on handle → shows "Reset size" option
- No resize on mobile (<768px) — panels stack vertically

**Persistence:**
- Sizes stored per user, per page, per layout preset
- Format: `{ "page": "calendar", "sidebar_width": 280, "detail_panel_width": 380, "kpi_section_height": 120 }`
- Loaded on page mount, applied before render (no flash of wrong size)

### 2.2 Split View Component (INFRA-101)

**Core concept:** Any page can be split into 2 panes (horizontal or vertical). Each pane is independently scrollable. Each pane can host any component.

**Split modes:**
| Mode | Description | Use Case |
|------|-------------|----------|
| Horizontal (left/right) | Divider runs vertically. Left pane + Right pane. | Template editor (left) + Asset library (right) |
| Vertical (top/bottom) | Divider runs horizontally. Top pane + Bottom pane. | Calendar (top) + Content detail (bottom) |
| Nested | Split within a split. Max 2 levels. | Calendar (left) → [Timeline (top-left) + List (bottom-left)] |

**Divider behavior:**
- Draggable (same as panel resize)
- Double-click → reset to 50/50
- Hover → shows collapse button on each side
- Click collapse → pane collapses to 40px strip (icon-only), click again to expand
- Split ratio saved in workspace memory

**Pane content:**
- Each pane can host any WAVE component (list, editor, calendar, timeline, etc.)
- Pane header shows component name + [×] to close + [⇔] to swap sides
- Drag component from sidebar → drop on pane to populate
- Empty pane shows: "Drop a component here" with available components listed

**Presets per page:**
- Calendar: [Table | Detail Panel] horizontal split
- Templates: [Editor | Asset Library] horizontal split
- Distribution: [Sequence Timeline | Email Editor] horizontal split
- Dashboard: No split (dashboard is single-pane by nature)

### 2.3 Focus Mode Engine (INFRA-102)

**Core concept:** Toggle Focus Mode → all non-essential UI hides → only top priority items + next action remain visible. Esc to exit.

**Focus Mode behavior per page:**

| Page | What Stays Visible | What Hides |
|------|-------------------|------------|
| Dashboard | Top 3 action feed items (by priority). Next Action banner. KPIs collapse to single health score. | Brief, schedule, agents, channel health, campaigns — all hidden. |
| Content Calendar | Top 3 priority content items (overdue first, then by due date). Filters collapse to "Urgent" only. | Other content rows, sidebar, secondary sections. |
| Templates | "Recommended for your next content" card. Recently used. Active editing session. | Full gallery, folders, analytics. |
| Distribution | Sequences needing attention (declining metrics, paused, errors). Next send countdown. | Full sequence list, analytics, calendar. |

**Focus Mode UI:**
- Toggle: `Cmd+Shift+F` or button in header
- Active state: header bar turns amber, "FOCUS MODE" badge appears, [Exit] button visible
- Transition: non-essential elements fade out (300ms), priority items scale up slightly (1.02x)
- Exit: `Esc` or click [Exit] or `Cmd+Shift+F` again
- State persisted per page in workspace memory

**Focus Mode + AI:**
- When Focus Mode activates, AI recalculates top 3 based on: due date, priority score, dependency status, AI recommendation
- If no items are urgent, AI shows: "Nothing urgent. Here's what to work on next for [milestone]"

### 2.4 Milestone Tracker Component (INFRA-103)

**Core concept:** Every page shows relevant milestones. Each milestone has steps, progress, countdown. Click → see detail.

**Milestone data model:**
```
Milestone:
  id: UUID
  title: string          // "Q3 BRIDGE Push Launch"
  target_date: date      // 2026-07-20
  status: enum           // upcoming, in_progress, completed, at_risk, overdue
  progress: float        // 0.0 to 1.0
  steps: Step[]          // ordered list of steps
  related_module: string // which page this belongs to
  related_id: UUID       // specific record (campaign, event, etc.)
  owner: string          // user responsible
  color: string          // derived from status + days_remaining

Step:
  title: string          // "Approve 2 content pieces"
  completed: boolean
  completed_at: timestamp
  completed_by: string
  action_url: string     // deep link to execute this step
  order: int
```

**Milestone display (compact — in page header or sidebar):**
```
┌─────────────────────────────────────────────────────┐
│ 🎯 NEXT MILESTONE                                   │
│ Q3 BRIDGE Push Launch          [8 days remaining]   │
│ ████████████░░░░░░░░  60%                          │
│                                                     │
│ ✓ Define campaign goals                             │
│ ✓ Select templates (4/4)                            │
│ ✓ Create content calendar (12/15)                   │
│ ○ Approve 2 content pieces        ← YOU ARE HERE    │
│ ○ Schedule distribution                             │
│                                                     │
│ [→ Continue: Approve content]                       │
└─────────────────────────────────────────────────────┘
```

**Milestone rules:**
- Only shows NEXT milestone (closest target_date that's not completed)
- If multiple milestones at same level, shows the one with lowest progress (most at-risk)
- "YOU ARE HERE" marker on first incomplete step
- [→ Continue] button deep-links to the exact page + item for that step
- Color coding: 🟢 on track (>14 days or >70% progress), 🟡 at risk (7-14 days or 40-70%), 🔴 urgent (<7 days or <40%)
- Completed milestones: archived, shown in "Past milestones" expandable section

**Per-page relevance:**
- Dashboard: shows cross-app milestones (from all modules)
- Calendar: shows content-related milestones (campaign launches, content deadlines)
- Templates: shows template-related milestones (template set completion, brand update)
- Distribution: shows distribution milestones (sequence launches, campaign sends)
- Journeys: shows journey milestones (flow completion, cross-sell targets)
- Events: shows event milestones (registration targets, event dates)

### 2.5 Workspace Memory System (INFRA-104)

**Core concept:** Every page remembers exactly where you were. Open the page → resume seamlessly.

**What's remembered per page:**

| Memory | Type | Example |
|--------|------|---------|
| Scroll position | int (px) | Calendar table scrolled to row 47 |
| Active view | string | "board" (vs table, calendar, timeline) |
| Active filters | JSONB | { status: "draft", channel: "linkedin", owner: "echo" } |
| Selected items | UUID[] | [content_id_1, content_id_2] |
| Open panels | string[] | ["detail_panel", "comments_panel"] |
| Panel sizes | JSONB | { sidebar: 280, detail: 420 } |
| Last edited item | UUID | The last content row you edited |
| Last search query | string | "BRIDGE case study" |
| Expanded sections | string[] | ["brief_overview", "campaign_3"] |
| Focus mode active | boolean | true/false |
| Sort column + direction | string | "scheduled_date:asc" |

**Memory data model:**
```sql
CREATE TABLE user_workspace_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  page_id TEXT NOT NULL,       -- 'dashboard', 'calendar', 'templates', 'distribution', etc.
  scroll_position INT DEFAULT 0,
  active_view TEXT,
  active_filters JSONB DEFAULT '{}',
  selected_items UUID[] DEFAULT '{}',
  open_panels TEXT[] DEFAULT '{}',
  panel_sizes JSONB DEFAULT '{}',
  last_edited_item UUID,
  last_search_query TEXT,
  expanded_sections TEXT[] DEFAULT '{}',
  focus_mode_active BOOLEAN DEFAULT FALSE,
  sort_config JSONB DEFAULT '{}',
  last_visited_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, page_id)
);
```

**Memory behavior:**
- Auto-saved: every 5 seconds (debounced) when state changes, and on page unload
- Auto-restored: on page load, before first render (no flash)
- Scroll restoration: uses `scrollRestoration: 'manual'` + saved position
- "Last edited" highlight: the last edited item gets a subtle brand-color left border for 30 seconds on page load
- Stale memory: if the item no longer exists (deleted), gracefully ignore that memory field
- Cross-device: stored in Supabase, so memory follows you across devices

### 2.6 Layout Preset System (INFRA-105)

**Core concept:** Save current layout as a named preset. Switch between presets with one click. Different presets for different modes of working.

**Preset data model:**
```sql
CREATE TABLE layout_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,           -- "Morning Review", "Deep Work", "Campaign Launch"
  page_id TEXT NOT NULL,        -- which page this preset applies to
  icon TEXT DEFAULT '⚡',       -- emoji icon for quick identification
  panel_sizes JSONB DEFAULT '{}',
  panel_visibility JSONB DEFAULT '{}',  -- which panels are shown/hidden
  split_config JSONB DEFAULT '{}',      -- split view configuration
  focus_mode BOOLEAN DEFAULT FALSE,
  active_filters JSONB DEFAULT '{}',
  sort_config JSONB DEFAULT '{}',
  is_default BOOLEAN DEFAULT FALSE,     -- default preset for this page
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Default presets per page (per role):**

| Page | Kevin Default | Echo Default | Maria Default |
|------|--------------|--------------|---------------|
| Dashboard | "Executive Overview": Brief expanded, Revenue + Campaign visible, Feed expanded | "Ops Overview": Schedule + Feed + Agent Status expanded | "Email Focus": Email KPIs + Channel Health expanded |
| Calendar | "Schedule View": Calendar view, campaign filter active | "Content Board": Board view, all statuses visible | "Review Mode": Table view, status=review filter |
| Templates | "Browse": Grid view, all categories | "Create": Editor + Assets split view | "Review": Board view, pending approval filter |
| Distribution | "Overview": All sequences + calendar split | "Build": Sequence editor full-width | "Analytics": Metrics focus, calendar hidden |

**Preset UI:**
- Preset switcher in page header (dropdown with icons)
- [💾 Save as preset] button → modal: name + icon
- Presets listed in sidebar or dropdown
- Default preset marked with ★
- [Manage presets] → reorder, rename, delete, set default
- Presets are per-user, not shared (yet)

### 2.7 Next Action Callout (INFRA-106)

**Core concept:** A persistent banner at the top of EVERY page showing the single most important thing to do right now. One click to execute.

**Next Action logic (Priority Engine output):**
1. Query all actionable items across all modules
2. Score each by: due date urgency (40%), AI recommendation (25%), dependency blocking (20%), user role match (15%)
3. Top 1 = Next Action
4. Top 2-3 = "Up next" (shown collapsed)

**Next Action display:**
```
┌─────────────────────────────────────────────────────────────────┐
│ ⚡ NEXT ACTION                                                  │
│                                                                 │
│ 📝 Approve "BRIDGE Case Study" — overdue 3 days                │
│    Priority: P1 | Assigned: Kevin | Channel: Website           │
│                                                                 │
│ [→ Review & Approve]    [⏭ Skip]    [⏰ Reschedule]            │
│                                                                 │
│ Up next: ○ Send welcome sequence (47 waiting)                  │
│          ○ Review LinkedIn post draft (Echo finished 2h ago)    │
└─────────────────────────────────────────────────────────────────┘
```

**Behavior:**
- Persistent: always visible at top of page (below header, above content)
- Collapsible: can collapse to single line ("⚡ Approve BRIDGE Case Study — overdue")
- Executable: [→ Review & Approve] navigates directly to the item, opens it, highlights the action button
- Skippable: [⏭ Skip] → marks as skipped for 4h, shows next item
- Real-time: updates as items are completed or new urgent items appear
- Dismissible: [×] hides for 30 min, then reappears
- Context-sensitive: the action button changes based on what's needed (Approve, Edit, Send, Review, etc.)

**Priority scoring formula:**
```
score = (
  urgency_score * 0.40 +      // days overdue or days until deadline
  ai_recommendation * 0.25 +   // AI's priority recommendation (0-1)
  blocking_score * 0.20 +      // how many items are blocked by this
  role_match * 0.15            // how well this matches current user's role
)

urgency_score = max(0, 1 - (days_until_due / 14))  // 1.0 if overdue, 0.0 if >14 days away
blocking_score = min(1.0, blocked_items / 5)        // 1.0 if 5+ items blocked
role_match = role_weights[current_user.role][item.required_role]
```

### 2.8 Cross-Page Drag-and-Drop (INFRA-107)

**Core concept:** Drag items from one page and drop them on another page. Creates related records automatically.

**Cross-page drag flows:**

| Source | Drag | Target | Result |
|--------|------|--------|--------|
| Templates page | Template card | Calendar page (date cell) | Creates content: template filled with variables, scheduled on that date |
| Templates page | Asset (image) | Calendar page (content detail) | Inserts asset into content body |
| Templates page | Asset (image) | Template page (editor) | Inserts asset at cursor position in editor |
| Calendar page | Content card | Distribution page (sequence) | Enrolls content in email sequence |
| Calendar page | Content card | Distribution page (calendar date) | Schedules content for multi-channel publish |
| Dashboard feed | Action item | Calendar page | Navigates to content with action context |
| Dashboard feed | Action item | Distribution page | Navigates to sequence/email with action context |

**Technical implementation:**
- Uses HTML5 Drag and Drop API + custom drag overlay
- Drag starts: creates drag preview (thumbnail + title)
- Drag crosses page boundary: user navigates to target page while holding drag (or uses split view)
- Drop zone highlights on hover (green border)
- Drop: creates record via API, shows success toast with [Undo]
- If drop target is invalid: shows error, doesn't create

**Alternative: Quick Move (for non-adjacent pages):**
- Right-click item → "Move to..." → select target page → item navigates to target page with context preserved
- Or: Cmd+drag → opens "Move to" dialog instead of requiring navigation

### 2.9 Priority Engine (INFRA-108)

**Core concept:** Central service that calculates a single priority score for every actionable item across WAVE. Used by: Next Action, Focus Mode, Feed sorting, Calendar ordering, all pages.

**Priority score dimensions:**

| Dimension | Weight | Description |
|-----------|--------|-------------|
| Time urgency | 40% | How close to deadline / how overdue |
| AI recommendation | 25% | AI's assessment of what should be done next |
| Blocking impact | 20% | How many other items are blocked by this |
| Role alignment | 15% | How well this matches the current user |

**Item types scored:**

| Item Type | Source Table | Urgency Calculation |
|-----------|-------------|-------------------|
| Content piece | content_assets | Days until scheduled_date or overdue from due_date |
| Email send | sequence_emails | Days until scheduled send or sequence stall |
| Approval request | template_approvals | Days since submitted (older = more urgent) |
| Journey step | journey_enrollments | Days waiting at current step |
| Event task | events | Days until event or registration deadline |
| AI insight | ai_insights | Confidence × age (high confidence + old = urgent) |
| Overdue payment | event_registrations | Days since payment due |
| Agent task | agent_tasks | Priority assigned by orchestrator |

**API:**
```
GET /api/priority/next-action?user_id=kevin
→ { item: { type, id, title, score, reason, action_url }, up_next: [...] }

GET /api/priority/score?type=content&id=xxx
→ { score: 0.87, breakdown: { urgency: 0.9, ai: 0.8, blocking: 0.7, role: 0.95 } }

GET /api/priority/top-n?n=10&user_id=kevin
→ { items: [{ type, id, title, score, action_url }, ...] }
```

**Refresh:** Priority scores recalculated every 15 minutes via cron. Also recalculated on-demand when items are created/updated/completed.

### 2.10 Guided Flow Engine (INFRA-109)

**Core concept:** Step-by-step wizards for major workflows. Progress visible. Resume from where you left off. Non-linear (can jump between steps).

**Flow data model:**
```sql
CREATE TABLE guided_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_type TEXT NOT NULL,       -- 'campaign_setup', 'sequence_creation', 'event_planning', 'content_series'
  title TEXT NOT NULL,
  steps JSONB NOT NULL,          -- Array of {title, description, component, validation, action_url}
  status TEXT DEFAULT 'active',  -- active, completed, abandoned
  progress FLOAT DEFAULT 0,
  current_step INT DEFAULT 0,
  user_id TEXT NOT NULL,
  context JSONB DEFAULT '{}',    -- Flow-specific data (campaign_id, sequence_id, etc.)
  completed_steps INT[] DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Pre-defined flows:**

| Flow | Steps | Trigger |
|------|-------|---------|
| **Campaign Setup** | 1. Define goal & KPIs → 2. Select product/cluster → 3. Choose templates → 4. Build content calendar → 5. Set up distribution → 6. Configure journeys → 7. Review & launch | "New Campaign" button |
| **Email Sequence Creation** | 1. Choose sequence type → 2. Define audience (mailing list) → 3. Build email timeline → 4. Write each email → 5. Set up A/B test → 6. Preview & test → 7. Activate | "New Sequence" button |
| **Event Planning** | 1. Define event details → 2. Set registration page → 3. Create promotional content → 4. Set up email sequence → 5. Configure reminders → 6. Monitor registrations → 7. Post-event follow-up | "New Event" button |
| **Content Series** | 1. Define series theme → 2. Choose content types → 3. Create outline for each part → 4. Build templates → 5. Generate content → 6. Schedule → 7. Set up cross-promotion | "New Series" button |
| **Template Creation** | 1. Choose template type → 2. Define variables → 3. Write structure → 4. Add AI prompts → 5. Test with sample data → 6. Brand check → 7. Publish | "New Template" button |

**Guided Flow UI:**
```
┌─────────────────────────────────────────────────────────────────┐
│ 📋 NEW CAMPAIGN — Q4 LEADERSHIP SUMMIT                    [×]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ① Goal    ② Product  ③ Templates  ④ Calendar  ⑤ Distribution │
│  ✓ Done    ✓ Done     ● Active     ○ Pending   ○ Pending      │
│  ────────  ────────   ═══════════  ─────────   ─────────      │
│                                                                 │
│  Step 4: Build Content Calendar                                │
│  ─────────────────────────────                                 │
│  Create 10 content pieces for this campaign.                    │
│  Suggested: 3 LinkedIn posts, 2 newsletter editions,           │
│             1 podcast episode, 1 case study, 1 video,          │
│             1 blog post, 1 webinar recap.                      │
│                                                                 │
│  [→ Open Calendar to build]                                    │
│                                                                 │
│  Or: [Use AI to auto-generate calendar]                        │
│                                                                 │
│  ← Back to Step 3                        Skip → Step 5        │
│                                                                 │
│  Progress: ████████░░░░░░░░░░░░  40% (2/5 steps done)         │
└─────────────────────────────────────────────────────────────────┘
```

**Behavior:**
- Steps are non-linear: can click any completed step to revisit, can skip ahead
- Each step has a primary action button that navigates to the relevant page with context
- "Use AI" option on most steps (generates draft, user reviews)
- Progress auto-saved to Supabase (resume from any device)
- Completion: confetti animation + summary + links to created records
- Abandoned flows: shown in sidebar "Resume: Campaign Setup (40% done)"

### 2.11 Global Presence System (INFRA-110)

**Core concept:** See who else is using WAVE, what page they're on, what they're editing. Click → see their recent activity.

**Presence data:**
```
UserPresence:
  user_id: string
  status: 'active' | 'idle' | 'away'
  current_page: string        // 'calendar', 'templates', etc.
  current_item: UUID | null   // specific record being viewed/edited
  current_action: string      // 'editing', 'viewing', 'idle'
  last_active_at: timestamp
  avatar_url: string
```

**Presence display:**
- Header bar: shows active team members as avatar circles
- Per-page: shows who else is on this page ("Echo is on this page")
- Per-item: shows who is viewing/editing the same item ("Maria is editing this template")
- Idle detection: no interaction for 5 min → "idle", 15 min → "away"
- Click avatar → side panel: user's recent activity (last 10 actions with timestamps)

**Technical:**
- Supabase Realtime: broadcast presence via `presence` channel
- Heartbeat: every 30 seconds, client sends "I'm here" ping
- If no ping for 60s → status changes to "idle"
- If no ping for 300s → status changes to "away"
- Privacy: presence is visible only to team members (RLS policy)

### 2.12 Inline Target Editor (INFRA-111)

**Core concept:** Any displayed number that represents a target, threshold, limit, or goal is editable inline. Click → type → Enter → saved.

**Editable number types:**
| Type | Example | Default | Stored In |
|------|---------|---------|-----------|
| KPI target | Revenue target | €25,000 | system_config |
| WIP limit | Board column limit | 5 items | user_dashboard_prefs |
| Alert threshold | Bounce rate alert | 5% | system_config |
| Schedule time | Daily brief generation | 6:00 AM | system_config |
| AI credit budget | Monthly DeepSeek budget | ¥500 | system_config |
| Campaign KPI target | Registration goal | 100 | campaigns table |

**Inline edit behavior:**
- Hover number → subtle underline appears (indicates clickable)
- Click → number becomes input field (same font/size, inline)
- Type new value → Enter to save, Esc to cancel
- On save: optimistic update + API call → toast: "Target updated: €25K → €30K" [Undo]
- Validation: number format, min/max bounds, unit consistency
- History: changes logged to `config_change_log` (who changed what, when, old → new)

**System config table:**
```sql
CREATE TABLE system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,       -- 'revenue_target', 'bounce_rate_threshold', etc.
  value JSONB NOT NULL,           -- { amount: 25000, currency: 'EUR' } or { percentage: 5 }
  label TEXT NOT NULL,            -- Human-readable label
  unit TEXT,                      -- '€', '%', 'items', 'minutes', etc.
  min_value JSONB,                -- Minimum allowed value
  max_value JSONB,                -- Maximum allowed value
  scope TEXT DEFAULT 'global',    -- 'global', 'user', 'campaign', 'page'
  scope_id TEXT,                  -- ID of scoped entity (user_id, campaign_id, etc.)
  updated_by TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE config_change_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID REFERENCES system_config(id),
  old_value JSONB,
  new_value JSONB,
  changed_by TEXT NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.13 Unified Health Score (INFRA-112)

**Core concept:** Every page has a single 0-100 health score. Always visible. Click → see breakdown. Color-coded.

**Health score per page:**

| Page | Dimensions (weights) |
|------|---------------------|
| Dashboard | Overall system health: AI brief quality (20%), feed freshness (20%), KPI trend (30%), agent activity (30%) |
| Content Calendar | Content health: AI content score avg (25%), deadline compliance (30%), approval throughput (25%), pipeline depth (20%) |
| Templates | Template health: usage rate (25%), brand score avg (25%), template freshness (25%), asset completeness (25%) |
| Distribution | Distribution health: deliverability (25%), engagement rate (25%), sequence completion (25%), list hygiene (25%) |
| Journeys | Journey health: enrollment rate (25%), completion rate (30%), conversion rate (25%), drop-off rate (20%) |
| Events | Event health: registration rate (30%), payment completion (25%), attendance rate (25%), satisfaction (20%) |
| Analytics | Data health: data completeness (30%), freshness (30%), accuracy (20%), coverage (20%) |

**Health score display:**
```
┌──────────────────────────────┐
│ CONTENT HEALTH               │
│                              │
│        78/100                │
│     ████████░░               │
│      🟡 GOOD                 │
│                              │
│  AI Score        82  ████░  │
│  Deadline Comp.  65  ███░░  │  ← red, clickable
│  Approval Rate   71  ████░  │
│  Pipeline Depth  88  ████░  │
│                              │
│  [→ See breakdown]           │
└──────────────────────────────┘
```

**Color coding:**
- 90-100: 🟢 Excellent (green)
- 70-89: 🟡 Good (amber/yellow)
- 50-69: 🟠 Needs Attention (orange)
- 0-49: 🔴 Critical (red)

**Click → breakdown:**
- Side panel slides in showing each dimension with detailed metrics
- Each dimension clickable → navigates to the relevant section
- Trend: shows health score over time (7-day sparkline)
- Recommendation: AI suggests what to improve ("Focus on deadline compliance — 3 items overdue")

**API:**
```
GET /api/health/{page_id}
→ { score: 78, trend: 'stable', dimensions: [{name, score, weight, details}], recommendation: string }
```

---

## 3. User Requirements

| User | Most Needed Infrastructure | Why |
|------|--------------------------|-----|
| **Kevin** | Next Action, Focus Mode, Milestone Tracker, Health Score | Needs to see what matters most in seconds. Context-switches constantly. |
| **Echo** | Split View, Workspace Memory, Cross-Page Drag, Guided Flows | Creates content across multiple pages. Needs to see template + calendar simultaneously. |
| **Maria** | Priority Engine, Inline Targets, Layout Presets | Manages emails + sequences. Needs to adjust thresholds without leaving her flow. |
| **Carl** | Milestone Tracker, Guided Flows, Presence | Event planning is multi-step. Needs to track progress and see team status. |
| **Valentina** | Workspace Memory, Layout Presets | Website publishing. Needs to resume where she left off across sessions. |
| **NEXUS** | Priority Engine, Health Score, Presence | Orchestrates agents. Needs system-wide visibility. |

---

## 4. UX Requirements

### 4.1 Global Layout Shell

Every page in WAVE sits inside a common shell:

```
┌─────────────────────────────────────────────────────────────────────┐
│ WAVE    [🔔 3]  [👥 Echo 🟢 Maria 🟢 Carl 🟡]  [⚡ NEXT]  [⚙] [?]│
├─────────────────────────────────────────────────────────────────────┤
│ ⚡ NEXT ACTION                                                      │
│ 📝 Approve "BRIDGE Case Study" — overdue 3 days                    │
│ [→ Review & Approve]  [⏭ Skip]  [⏰ Reschedule]                   │
│ Up next: ○ Send welcome sequence  ○ Review LinkedIn draft          │
├─────────────────────────────────────────────────────────────────────┤
│ 🎯 MILESTONE: Q3 BRIDGE Push — 8 days — 60% — [→ Continue]       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Health: 78/100 🟡]                                                │
│                                                                     │
│  ┌──────────┐ ┌──────────────────────────────┐ ┌───────────────┐  │
│  │ Sidebar  │ │                              │ │ Detail Panel  │  │
│  │  ←→     │ │       Main Content           │ │     ←→        │  │
│  │ 240px   │ │       (flex-grow)            │ │   420px       │  │
│  │ resize  │ │                              │ │   resize      │  │
│  │ handle  │ │                              │ │   handle      │  │
│  │         │ │                              │ │               │  │
│  └──────────┘ └──────────────────────────────┘ └───────────────┘  │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ [💾 Save layout] [📐 Presets: Morning ▾] [🔍 Focus: Off]          │
└─────────────────────────────────────────────────────────────────────┘
```

**Shell elements (always present):**
1. **Header bar**: Logo, notifications, team presence, next action toggle, settings
2. **Next Action banner**: collapsible, persistent, one-click actions
3. **Milestone strip**: compact, single-line, shows next milestone
4. **Health score badge**: top-left of content area, always visible
5. **Content area**: resizable panels (sidebar + main + detail)
6. **Footer bar**: save layout, preset switcher, focus mode toggle

### 4.2 Resizable Panel Wireframe

```
BEFORE RESIZE:                    DURING RESIZE:                    AFTER RESIZE:
┌─────┬────────┬─────┐           ┌──────┬──────┬────┐             ┌───────┬─────┬──────┐
│ Side │ Main   │ Det │           │ Side ═ Main ═ Det │             │ Side  │Main │ Det  │
│ 240  │ flex   │ 420 │           │ →→→  │      │←←  │             │ 320   │     │ 340  │
│      │        │     │           │      │      │    │             │       │     │      │
└─────┴────────┴─────┘           └──────┴──────┴────┘             └───────┴─────┴──────┘
                                                           cursor: col-resize
                                                           edge: 2px brand color
                                                           live preview during drag
```

### 4.3 Focus Mode Wireframe

```
NORMAL MODE:                        FOCUS MODE:
┌────────────────────────────────┐  ┌────────────────────────────────┐
│ Header                         │  │ Header [FOCUS MODE] [Exit]     │
├────────────────────────────────┤  ├────────────────────────────────┤
│ ⚡ Next Action                 │  │ ⚡ Approve BRIDGE Case Study   │
├────────────────────────────────┤  │                                │
│ 🎯 Milestone                   │  │ 1. 📝 BRIDGE Case Study       │
├────────────────────────────────┤  │    Overdue 3d [→ Review]       │
│ KPI cards (9 cards)            │  │                                │
├────────────────┬───────────────┤  │ 2. 📧 LinkedIn Post Draft      │
│ Action Feed    │ Schedule      │  │    Due today  [→ Review]       │
│ [All][Approvals│ ──●────●──    │  │                                │
│                │               │  │ 3. 📊 Q3 BRIDGE Push          │
│ ⚠️ Item 1     │ 🔗 Echo 9am   │  │    60% done    [→ Continue]    │
│ ✅ Item 2     │ 📧 Maria 2pm  │  │                                │
│ 💡 Item 3     │               │  │                                │
│ 🔗 Item 4     │               │  │ Everything else: HIDDEN         │
│ ...           │               │  │ No KPIs, no feed, no schedule   │
├────────────────┼───────────────┤  │                                │
│ Channel Health │ Agent Status  │  │ Press Esc to exit Focus Mode   │
└────────────────┴───────────────┘  └────────────────────────────────┘
```

### 4.4 Guided Flow Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│ 📋 CREATE EMAIL SEQUENCE                                  [×]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ① Type    ② Audience  ③ Timeline  ④ Emails  ⑤ A/B  ⑥ Review │
│  ✓ Done    ✓ Done      ● Active    ○ Pending  ○       ○        │
│  ────────  ────────    ═══════════ ───────── ─────── ───────── │
│                                                                 │
│  Step 3: Build Email Timeline                                  │
│  ─────────────────────────────                                 │
│                                                                 │
│  Day 0          Day 2          Day 5          Day 10           │
│  ┌──────┐  2d  ┌──────┐  3d  ┌──────┐  5d  ┌──────┐          │
│  │Email │────→│Email │────→│Email │────→│Email │              │
│  │  #1  │      │  #2  │      │  #3  │      │  #4  │           │
│  │Welcome│     │Value │      │ Case │      │ CTA  │            │
│  └──────┘      └──────┘      └──────┘      └──────┘           │
│                                                                 │
│  [+ Add email]  [Drag to reorder]  [Edit delays]               │
│                                                                 │
│  ← Back to Step 2                         Skip → Step 4        │
│                                                                 │
│  Progress: ████████████░░░░░░░░  50% (2/4 steps)               │
│  📝 Auto-saved · Resume anytime                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.5 Health Score Breakdown Wireframe

```
┌──────────────────────────────────────┐
│ CONTENT HEALTH BREAKDOWN      [×]    │
├──────────────────────────────────────┤
│                                      │
│         78/100  🟡 GOOD              │
│     ████████████████░░░░             │
│     ── 7-day trend: ──              │
│     ╭──╮╭╮╭──╮╭╮                    │
│                                      │
│  AI Content Score     82  ██████░   │
│  ├─ Avg clarity: 85                 │
│  ├─ Avg engagement: 79              │
│  └─ Avg brand fit: 81               │
│                                      │
│  Deadline Compliance  65  ████░     │ ← 🔴 click → Calendar filtered to overdue
│  ├─ 3 items overdue                 │
│  ├─ 5 items due this week           │
│  └─ 8 items on track                │
│                                      │
│  Approval Rate        71  ████░     │
│  ├─ 2 pending >48h                  │
│  └─ Avg approval time: 18h          │
│                                      │
│  Pipeline Depth       88  █████░    │
│  ├─ 47 items in pipeline            │
│  └─ Target: 40 minimum              │
│                                      │
│  💡 AI Recommendation:              │
│  "Focus on deadline compliance.      │
│   3 items overdue. [→ View overdue]" │
└──────────────────────────────────────┘
```

### 4.6 Presence & Activity Wireframe

```
Header:
┌─────────────────────────────────────────────────────────────┐
│ WAVE   [👥 ● Echo (Calendar) ● Maria (Templates) ○ Carl]  │
└────────────────────────────────────────────────────────────┘

Click Echo's avatar → side panel:
┌──────────────────────────────────────┐
│ Echo's Activity               [×]    │
├──────────────────────────────────────┤
│ 🟢 Active · On Calendar page         │
│ Editing: "AI in Leadership" (LI)     │
│                                      │
│ Recent:                              │
│ 12 min ago — Published LinkedIn post │
│ 25 min ago — Edited content draft    │
│ 1h ago — Approved newsletter content │
│ 2h ago — Created 3 content ideas     │
│ 3h ago — Rescheduled 2 items         │
└──────────────────────────────────────┘

Per-item presence (on template card):
┌──────────────────────────────┐
│ 📄 LinkedIn Post Template    │
│                 [👤 Echo]    │  ← Echo is viewing this template
│ Category: Social Media       │
│ Used: 34 times               │
└──────────────────────────────┘
```

---

## 5. Design Requirements

### 5.1 Resize Handle Design

| Property | Value |
|----------|-------|
| Visual width | 2px |
| Touch target | 12px (transparent padding on each side) |
| Default color | `border-default` (subtle) |
| Hover color | Brand `#C108AB` (2px, solid) |
| Active/dragging color | Brand `#C108AB` (3px, solid) |
| Cursor | `col-resize` (vertical edge) / `row-resize` (horizontal edge) |
| Transition | 150ms ease on color change |

### 5.2 Next Action Banner Design

| Property | Value |
|----------|-------|
| Background | `#FEF3C7` (amber-50) when urgent, `#F0FDF4` (green-50) when normal |
| Left border | 4px solid — amber if overdue, brand if normal |
| Height | 80px expanded, 36px collapsed |
| Action button | Brand background, white text, 8px radius |
| Skip button | Ghost button (transparent, brand text) |
| Animation | Slide down from top (200ms ease-out) on appear |
| Font | 14px bold title, 12px normal description |

### 5.3 Health Score Badge Design

| Property | Value |
|----------|-------|
| Size | 64×64px circle |
| Position | Top-left of content area |
| Score number | 24px Bold Crimson Pro |
| Ring | SVG circle stroke, color based on score range |
| Hover | Expands to show breakdown tooltip |
| Click | Opens breakdown side panel |
| Colors | 🟢 #059669 (90+), 🟡 #D97706 (70-89), 🟠 #EA580C (50-69), 🔴 #DC2626 (<50) |

### 5.4 Focus Mode Transition

| Element | Normal → Focus | Focus → Normal |
|---------|---------------|----------------|
| Non-essential panels | Opacity 0 + height 0 (300ms) | Opacity 1 + height auto (300ms) |
| Priority items | Scale 1.02 + shadow-sm (300ms) | Scale 1.0 + no shadow (300ms) |
| Header | "FOCUS MODE" badge fades in | Badge fades out |
| Background | Subtle darken (overlay 5% black) | Normal |
| Next Action | Stays visible (always shown in focus) | Normal |

### 5.5 Guided Flow Step Indicator

| State | Visual |
|-------|--------|
| Completed | 🟢 Green circle with ✓, solid line connecting |
| Active | 🔵 Brand circle with step number, pulsing ring |
| Pending | ⚪ Gray circle with step number, dashed line |
| Skipped | ⚪ Gray circle with → arrow, dashed line |
| Hover | Tooltip with step title + description |

---

## 6. Technical Backend Wiring

### 6.1 Supabase Schema

```sql
-- Workspace Memory (INFRA-104)
CREATE TABLE IF NOT EXISTS user_workspace_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  page_id TEXT NOT NULL,
  scroll_position INT DEFAULT 0,
  active_view TEXT,
  active_filters JSONB DEFAULT '{}',
  selected_items UUID[] DEFAULT '{}',
  open_panels TEXT[] DEFAULT '{}',
  panel_sizes JSONB DEFAULT '{}',
  last_edited_item UUID,
  last_search_query TEXT,
  expanded_sections TEXT[] DEFAULT '{}',
  focus_mode_active BOOLEAN DEFAULT FALSE,
  sort_config JSONB DEFAULT '{}',
  last_visited_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, page_id)
);
CREATE INDEX idx_workspace_memory_user ON user_workspace_memory(user_id);

-- Layout Presets (INFRA-105)
CREATE TABLE IF NOT EXISTS layout_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  page_id TEXT NOT NULL,
  icon TEXT DEFAULT '⚡',
  panel_sizes JSONB DEFAULT '{}',
  panel_visibility JSONB DEFAULT '{}',
  split_config JSONB DEFAULT '{}',
  focus_mode BOOLEAN DEFAULT FALSE,
  active_filters JSONB DEFAULT '{}',
  sort_config JSONB DEFAULT '{}',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_layout_presets_user ON layout_presets(user_id, page_id);

-- Milestones (INFRA-103)
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  target_date DATE NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming','in_progress','completed','at_risk','overdue')),
  progress FLOAT DEFAULT 0 CHECK (progress BETWEEN 0 AND 1),
  steps JSONB NOT NULL DEFAULT '[]',
  related_module TEXT,
  related_id UUID,
  owner TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_milestone_next ON milestones(target_date, status) WHERE status != 'completed';

-- Guided Flows (INFRA-109)
CREATE TABLE IF NOT EXISTS guided_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_type TEXT NOT NULL,
  title TEXT NOT NULL,
  steps JSONB NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','completed','abandoned')),
  progress FLOAT DEFAULT 0,
  current_step INT DEFAULT 0,
  user_id TEXT NOT NULL,
  context JSONB DEFAULT '{}',
  completed_steps INT[] DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_guided_flows_active ON guided_flows(user_id, status) WHERE status = 'active';

-- System Config (INFRA-111)
CREATE TABLE IF NOT EXISTS system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  label TEXT NOT NULL,
  unit TEXT,
  min_value JSONB,
  max_value JSONB,
  scope TEXT DEFAULT 'global' CHECK (scope IN ('global','user','campaign','page')),
  scope_id TEXT,
  updated_by TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Config Change Log (INFRA-111)
CREATE TABLE IF NOT EXISTS config_change_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID REFERENCES system_config(id),
  old_value JSONB,
  new_value JSONB,
  changed_by TEXT NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Priority Scores Cache (INFRA-108)
CREATE TABLE IF NOT EXISTS priority_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type TEXT NOT NULL,
  item_id UUID NOT NULL,
  user_id TEXT,  -- NULL = global priority (not user-specific)
  score FLOAT NOT NULL CHECK (score BETWEEN 0 AND 1),
  breakdown JSONB NOT NULL,  -- { urgency: 0.9, ai: 0.8, blocking: 0.7, role: 0.95 }
  reason TEXT,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(item_type, item_id, user_id)
);
CREATE INDEX idx_priority_top ON priority_scores(score DESC, calculated_at DESC);

-- Health Scores Cache (INFRA-112)
CREATE TABLE IF NOT EXISTS health_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL,
  score INT NOT NULL CHECK (score BETWEEN 0 AND 100),
  dimensions JSONB NOT NULL,
  recommendation TEXT,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_id)
);

-- Health Score History (for trend sparkline)
CREATE TABLE IF NOT EXISTS health_score_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL,
  score INT NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_health_history ON health_score_history(page_id, recorded_at DESC);

-- Seed system_config defaults
INSERT INTO system_config (key, value, label, unit, scope) VALUES
  ('revenue_target', '{"amount": 25000, "currency": "EUR"}', 'Monthly Revenue Target', '€', 'global'),
  ('bounce_rate_threshold', '{"percentage": 5}', 'Email Bounce Rate Alert Threshold', '%', 'global'),
  ('brief_generation_time', '{"hour": 6, "minute": 0}', 'Daily Brief Generation Time', '', 'global'),
  ('ai_monthly_budget', '{"amount": 500, "currency": "CNY"}', 'Monthly DeepSeek API Budget', '¥', 'global'),
  ('content_pipeline_minimum', '{"count": 40}', 'Minimum Content Pipeline Depth', 'items', 'global'),
  ('approval_sla_hours', '{"hours": 48}', 'Approval SLA (hours before flagged)', 'hours', 'global')
ON CONFLICT (key) DO NOTHING;
```

### 6.2 API Routes

| Route | Method | Purpose | Request | Response |
|-------|--------|---------|---------|----------|
| `/api/infra/workspace-memory` | GET | Get workspace memory for page | `?page_id=` | `{ memory: {...} }` |
| `/api/infra/workspace-memory` | PATCH | Update workspace memory | `{ page_id, updates }` | `{ ok }` |
| `/api/infra/layout-presets` | GET | List presets for page | `?page_id=` | `{ presets: [...] }` |
| `/api/infra/layout-presets` | POST | Create new preset | `{ name, page_id, config }` | `{ preset }` |
| `/api/infra/layout-presets/[id]` | PATCH | Update preset | `{ updates }` | `{ ok }` |
| `/api/infra/layout-presets/[id]` | DELETE | Delete preset | — | `{ ok }` |
| `/api/infra/milestones` | GET | Get milestones (next + all) | `?scope=next\|all&module=` | `{ next: {...}, all: [...] }` |
| `/api/infra/milestones` | POST | Create milestone | `{ title, target_date, steps }` | `{ milestone }` |
| `/api/infra/milestones/[id]` | PATCH | Update milestone (steps, progress) | `{ updates }` | `{ ok }` |
| `/api/infra/milestones/[id]/complete-step` | POST | Mark step complete | `{ step_index }` | `{ ok, progress }` |
| `/api/infra/priority/next-action` | GET | Get next action for user | `?user_id=` | `{ item: {...}, up_next: [...] }` |
| `/api/infra/priority/score` | GET | Get priority score for item | `?type=&id=` | `{ score, breakdown }` |
| `/api/infra/priority/top-n` | GET | Top N priority items | `?n=10&user_id=` | `{ items: [...] }` |
| `/api/infra/health/[page_id]` | GET | Get health score for page | — | `{ score, dimensions, recommendation }` |
| `/api/infra/health/[page_id]/history` | GET | Health score history (7 days) | `?days=7` | `{ history: [...] }` |
| `/api/infra/config` | GET | Get system config values | `?scope=&scope_id=` | `{ config: [...] }` |
| `/api/infra/config/[key]` | PATCH | Update config value (inline edit) | `{ value }` | `{ ok, old_value }` |
| `/api/infra/config/[key]/history` | GET | Config change history | — | `{ changes: [...] }` |
| `/api/infra/guided-flows` | GET | Get active flows for user | `?user_id=` | `{ flows: [...] }` |
| `/api/infra/guided-flows` | POST | Start new guided flow | `{ flow_type, title }` | `{ flow }` |
| `/api/infra/guided-flows/[id]` | PATCH | Update flow (step, progress) | `{ updates }` | `{ ok }` |
| `/api/infra/guided-flows/[id]/complete-step` | POST | Mark step complete | `{ step_index }` | `{ ok, progress }` |
| `/api/infra/presence` | POST | Update user presence | `{ page, item, action }` | `{ ok }` |
| `/api/infra/presence/team` | GET | Get team presence | — | `{ users: [...] }` |

### 6.3 Realtime Subscriptions

```javascript
// 1. Presence (INFRA-110)
const presenceChannel = supabase.channel('global-presence', {
  config: { presence: { key: user_id } }
})
  .on('presence', { event: 'sync' }, () => {
    const state = presenceChannel.presenceState()
    setTeamPresence(state)
  })
  .on('presence', { event: 'join' }, ({ key, newPresences }) => {
    toast(`${newPresences[0].name} joined`)
  })
  .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    // User went offline
  })
  .subscribe()

// Heartbeat: broadcast presence every 30s
setInterval(() => {
  presenceChannel.track({
    page: currentPage,
    item: currentItem,
    action: currentAction,
    last_active: new Date().toISOString()
  })
}, 30000)

// 2. Priority updates (INFRA-108)
supabase.channel('priority-updates')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'priority_scores' }, (payload) => {
    // Refresh next action banner if top priority changed
    if (payload.new.item_id === currentNextAction?.id) {
      refreshNextAction()
    }
  })
  .subscribe()

// 3. Health score updates (INFRA-112)
supabase.channel('health-updates')
  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'health_scores' }, (payload) => {
    if (payload.new.page_id === currentPage) {
      setHealthScore(payload.new)
    }
  })
  .subscribe()

// 4. Milestone updates (INFRA-103)
supabase.channel('milestone-updates')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'milestones' }, (payload) => {
    refreshMilestones()
  })
  .subscribe()
```

### 6.4 Background Cron Jobs

| Job | Schedule | Purpose |
|-----|----------|---------|
| `recalculate_priorities` | Every 15 min | Recalculate priority scores for all open items |
| `recalculate_health` | Every 30 min | Recalculate health scores for all pages |
| `snapshot_health_history` | Daily at midnight | Copy current health scores to history table |
| `update_milestone_status` | Every hour | Check milestones: update status (at_risk if <7 days, overdue if past date) |
| `cleanup_workspace_memory` | Weekly | Remove memory for pages that no longer exist |
| `cleanup_stale_presence` | Every 2 min | Set presence to 'idle' if no heartbeat for 60s, 'away' if 300s |
| `abandon_stale_flows` | Daily | Set guided flows to 'abandoned' if no update in 14 days |

### 6.5 Performance Budget

| Metric | Target |
|--------|--------|
| Workspace memory load (on page mount) | <50ms (single query, cached) |
| Priority score API response | <200ms |
| Health score API response | <200ms |
| Presence broadcast | <100ms (Realtime) |
| Panel resize (drag) | 60fps (CSS only, no API calls during drag) |
| Layout preset switch | <100ms (instant, local state) |
| Focus Mode toggle | <300ms (CSS transitions) |
| Next Action banner update | <500ms (Realtime trigger) |
| Total infrastructure bundle size | <15KB gzipped |

---

## 7. AI Layer Specification

### 7.1 AI Persona: Priority Advisor

```yaml
name: "Priority Advisor"
role: "Calculate and explain priority scores"
model: deepseek-chat
temperature: 0.3
max_tokens: 500
system_prompt: |
  You are a priority calculation advisor for WAVE.
  You receive structured data about items needing attention.
  For each item, you assess:
  - Time urgency (is it overdue? how close to deadline?)
  - Business impact (revenue, reach, dependencies)
  - Effort required (quick win vs major task)
  - Strategic alignment (does it advance current milestones?)
  
  Output a priority score (0-1) and a one-line reason.
  Be specific with data. No filler.
```

**Prompt template:**
```
Calculate priority for the following items:
Items: {{items_json}}
Current user: {{user_name}} (role: {{role}})
Active milestone: {{milestone_title}} ({{progress}}% done, {{days_remaining}} days left)

For each item, output:
{
  "item_id": "...",
  "score": 0.0-1.0,
  "reason": "one-line explanation",
  "suggested_action": "what to do"
}
Sort by score descending.
```

### 7.2 AI Persona: Health Analyst

```yaml
name: "Health Analyst"
role: "Analyze page health and recommend improvements"
model: deepseek-chat
temperature: 0.4
max_tokens: 300
system_prompt: |
  You are a health analyst for WAVE pages.
  You receive dimension scores and underlying metrics.
  You identify the weakest dimension and provide a specific,
  actionable recommendation to improve it.
  Be concise. One recommendation, not a list.
```

**Prompt template:**
```
Page: {{page_id}}
Health score: {{score}}/100
Dimensions:
{{dimensions_json}}

Provide:
1. One-line overall assessment
2. Weakest dimension and why
3. Specific next action to improve (with link context)
```

### 7.3 AI Persona: Focus Mode Curator

```yaml
name: "Focus Mode Curator"
role: "Select top 3 items for focus mode"
model: deepseek-chat
temperature: 0.2
max_tokens: 400
system_prompt: |
  You are a focus curator. When a user enters Focus Mode,
  you select the top 3 items they should work on RIGHT NOW.
  Consider: deadlines, dependencies, AI recommendations,
  and the user's current milestone progress.
  Explain each choice in one line.
```

### 7.4 Insight Types (from AI layer)

| Insight | Trigger | Confidence |
|---------|---------|------------|
| Priority shift | Item priority score changes >0.3 in 4h | 0.9 |
| Health decline | Page health score drops >10 points in 24h | 0.85 |
| Milestone at risk | Milestone progress <50% with <7 days remaining | 0.9 |
| Bottleneck detected | >5 items waiting on same approval for >24h | 0.95 |
| Focus recommendation | User hasn't completed any items in 2h during work hours | 0.7 |

---

## 8. Tickets (INFRA-100 through INFRA-112)

| Ticket | Title | Priority | Effort | Dependencies |
|--------|-------|----------|--------|--------------|
| INFRA-100 | Build Resizable Panel System (drag handles, min/max, persistence) | P0 | 8h | T-002 |
| INFRA-101 | Build Split View Component (horizontal/vertical, collapse, presets) | P0 | 6h | INFRA-100 |
| INFRA-102 | Build Focus Mode Engine (toggle, hide/show, AI curation) | P0 | 5h | INFRA-108 |
| INFRA-103 | Build Milestone Tracker (data model, UI, per-page integration, countdown) | P0 | 8h | T-002 |
| INFRA-104 | Build Workspace Memory System (auto-save, auto-restore, per-page) | P0 | 4h | T-002 |
| INFRA-105 | Build Layout Preset System (save, switch, default per role, manage) | P1 | 6h | INFRA-100, INFRA-104 |
| INFRA-106 | Build Next Action Callout (priority-powered, persistent, executable) | P0 | 4h | INFRA-108 |
| INFRA-107 | Build Cross-Page Drag-and-Drop (drag overlay, drop zones, record creation) | P1 | 8h | INFRA-100 |
| INFRA-108 | Build Priority Engine (scoring formula, API, cron, AI advisor) | P0 | 6h | T-002, T-004 |
| INFRA-109 | Build Guided Flow Engine (step wizard, progress, resume, AI assist) | P1 | 10h | T-002 |
| INFRA-110 | Build Global Presence System (Realtime, heartbeat, avatar bar, activity) | P1 | 6h | T-002 |
| INFRA-111 | Build Inline Target Editor (click-to-edit, validation, change log) | P1 | 4h | T-002 |
| INFRA-112 | Build Unified Health Score (dimensions, API, AI analyst, breakdown panel) | P0 | 5h | T-002, T-004 |

**Total: 13 tickets | ~80 hours | ~3 weeks**

### Effort Breakdown by Priority

| Priority | Tickets | Hours | % |
|----------|---------|-------|---|
| P0 | 7 | 40h | 50% |
| P1 | 6 | 40h | 50% |

### Implementation Phases

**Phase 1 (P0 Core, 40h, ~2 weeks):**
INFRA-100 → 104, 106, 108, 112
→ Delivers: Resizable panels, split view, focus mode, milestones, workspace memory, next action, priority engine, health score
→ **This alone transforms every page from "static admin panel" to "interactive command center"**

**Phase 2 (P1 Enhanced, 40h, ~1.5 weeks):**
INFRA-105, 107, 109, 110, 111
→ Delivers: Layout presets, cross-page drag, guided flows, team presence, inline target editor
→ **This adds the "creative tool" feel — Canva-level layout freedom + team awareness**

---

## 9. Acceptance Criteria

### Phase 1 (P0)
- [ ] Every panel on every page has draggable resize handles
- [ ] Panel sizes persist per user per page (reload → same sizes)
- [ ] Split view works: horizontal and vertical, each pane independently scrollable
- [ ] Split view divider draggable, collapse/expand works
- [ ] Focus Mode toggle (`Cmd+Shift+F`) hides non-essential UI, shows top 3 items
- [ ] Focus Mode uses AI to select top 3 based on priority
- [ ] Milestone tracker shows next milestone with countdown + steps + progress on every page
- [ ] Milestone "Continue" button deep-links to the relevant page/step
- [ ] Workspace memory restores: scroll position, active filters, selected items, open panels on page load
- [ ] Workspace memory auto-saves every 5s and on page unload
- [ ] Next Action banner shows at top of every page with highest-priority item
- [ ] Next Action [→] button navigates directly to the item with action highlighted
- [ ] Priority engine calculates scores for all item types every 15 min
- [ ] Health score displayed on every page (0-100, color-coded)
- [ ] Health score click → breakdown panel with dimensions + AI recommendation

### Phase 2 (P1)
- [ ] Layout presets: save, switch, delete, set default per page
- [ ] Default presets per role load on first visit
- [ ] Cross-page drag works: Template → Calendar creates content
- [ ] Cross-page drag works: Content → Distribution creates schedule
- [ ] Guided flows: at least Campaign Setup and Sequence Creation flows work
- [ ] Guided flow progress auto-saves, resume from any device
- [ ] Team presence shows active members in header bar
- [ ] Per-item presence shows who else is viewing/editing
- [ ] Inline target editor: click any KPI target → edit → save → change logged
- [ ] All infrastructure works with Supabase Realtime (no polling)

---

## 10. Component Architecture

### 10.1 Component Tree (Global Shell)

```
WaveApp
├── AppShell (layout wrapper, provides resize context)
│   ├── Header
│   │   ├── Logo
│   │   ├── NotificationBell
│   │   ├── TeamPresence (INFRA-110)
│   │   │   └── UserAvatar (×N, clickable → ActivityPanel)
│   │   ├── NextActionToggle (opens/closes NextActionBar)
│   │   └── SettingsButton
│   ├── NextActionBar (INFRA-106, collapsible)
│   │   ├── PrimaryAction (item title + [→ Execute])
│   │   ├── UpNext (collapsed list of next 2-3 items)
│   │   └── SkipButton
│   ├── MilestoneStrip (INFRA-103, single-line)
│   │   ├── MilestoneTitle
│   │   ├── ProgressBar
│   │   ├── Countdown
│   │   └── ContinueButton
│   ├── PageContent (per-page content renders here)
│   │   ├── ResizablePanelGroup (INFRA-100)
│   │   │   ├── SidePanel (resizable)
│   │   │   ├── MainPanel (flex-grow)
│   │   │   │   ├── HealthBadge (INFRA-112, always visible)
│   │   │   │   └── PageSpecificContent
│   │   │   └── DetailPanel (resizable, collapsible)
│   │   └── SplitView (INFRA-101, optional)
│   │       ├── LeftPane
│   │       └── RightPane
│   └── FooterBar
│       ├── SaveLayoutButton (INFRA-105)
│       ├── PresetSwitcher (INFRA-105)
│       └── FocusModeToggle (INFRA-102)
├── FocusModeOverlay (INFRA-102, shown when focus mode active)
├── GuidedFlowOverlay (INFRA-109, shown when flow active)
├── HealthBreakdownPanel (INFRA-112, side panel)
├── PresenceActivityPanel (INFRA-110, side panel)
└── CrossPageDragOverlay (INFRA-107, global drag layer)
```

### 10.2 Key Component Interfaces

```typescript
// INFRA-100: Resizable Panel System
interface ResizablePanelGroupProps {
  panels: PanelConfig[];
  onResize: (sizes: Record<string, number>) => void;
  persistKey: string;  // user_id + page_id for workspace memory
  direction: 'horizontal' | 'vertical';
}

interface PanelConfig {
  id: string;
  minSize: number;
  maxSize: number;
  defaultSize: number;
  collapsible?: boolean;
  children: ReactNode;
}

// INFRA-102: Focus Mode
interface FocusModeProps {
  active: boolean;
  onToggle: () => void;
  priorityItems: PriorityItem[];  // From INFRA-108
  pageId: string;
}

// INFRA-103: Milestone Tracker
interface MilestoneStripProps {
  milestone: Milestone | null;
  onContinue: (stepIndex: number) => void;
}

interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  progress: number;
  steps: MilestoneStep[];
  status: 'upcoming' | 'in_progress' | 'at_risk' | 'overdue';
  daysRemaining: number;
}

// INFRA-106: Next Action Callout
interface NextActionBarProps {
  item: PriorityItem | null;
  upNext: PriorityItem[];
  onExecute: () => void;
  onSkip: () => void;
  onReschedule: () => void;
  collapsed: boolean;
}

interface PriorityItem {
  type: string;
  id: string;
  title: string;
  score: number;
  reason: string;
  actionUrl: string;
  actionLabel: string;
  urgency: 'overdue' | 'today' | 'this_week' | 'upcoming';
}

// INFRA-108: Priority Engine
interface PriorityEngine {
  getNextAction(userId: string): Promise<PriorityItem>;
  getTopN(n: number, userId: string): Promise<PriorityItem[]>;
  getScore(type: string, id: string): Promise<{ score: number; breakdown: Breakdown }>;
}

// INFRA-109: Guided Flow
interface GuidedFlowProps {
  flow: GuidedFlow;
  onStepComplete: (stepIndex: number) => void;
  onStepNavigate: (stepIndex: number) => void;
  onAbandon: () => void;
}

interface GuidedFlow {
  id: string;
  type: string;
  title: string;
  steps: FlowStep[];
  currentStep: number;
  progress: number;
  completedSteps: number[];
}

// INFRA-110: Presence
interface TeamPresenceProps {
  users: UserPresence[];
  onAvatarClick: (userId: string) => void;
}

interface UserPresence {
  userId: string;
  name: string;
  avatarUrl: string;
  status: 'active' | 'idle' | 'away';
  currentPage: string;
  currentItem?: string;
  currentAction: string;
}

// INFRA-112: Health Score
interface HealthBadgeProps {
  score: number;
  trend: 'up' | 'down' | 'stable';
  pageId: string;
  onClick: () => void;  // Opens breakdown panel
}

interface HealthBreakdown {
  score: number;
  dimensions: HealthDimension[];
  recommendation: string;
  history: number[];  // 7-day sparkline
}
```

---

## Appendix: Integration with Per-Page Retrofit

Once INFRA-100 to INFRA-112 are built, the per-page retrofit tickets consume them:

| Infrastructure | Used By |
|---------------|---------|
| INFRA-100 (Resize) | All pages: DASH-031, CAL-047, TPL-063, DIST-072 |
| INFRA-101 (Split View) | TPL-064, DIST-073 |
| INFRA-102 (Focus Mode) | DASH-038, CAL-043 |
| INFRA-103 (Milestones) | DASH-039, CAL-045 |
| INFRA-104 (Workspace Memory) | DASH-040, CAL-046, TPL-067, DIST-075 |
| INFRA-105 (Layout Presets) | DASH-041, TPL-069, DIST-077 |
| INFRA-106 (Next Action) | All pages (global) |
| INFRA-107 (Cross-Page Drag) | CAL-048, TPL drag-to-calendar, DIST cross-page |
| INFRA-108 (Priority Engine) | All pages (DASH-037, focus mode, feed sorting) |
| INFRA-109 (Guided Flows) | Campaign, sequence, event, content series wizards |
| INFRA-110 (Presence) | DASH-044, TPL-059 enhancement, DIST-078 |
| INFRA-111 (Inline Targets) | DASH-037, DIST inline targets |
| INFRA-112 (Health Score) | All pages (per-page health badges) |

---

*Build order: Phase 1 (P0, 2 weeks) → Phase 2 (P1, 1.5 weeks) → Then per-page retrofit tickets.*
