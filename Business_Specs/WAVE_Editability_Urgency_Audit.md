# WAVE — Editability, Layout Freedom & Urgency Audit

**Version:** 1.0 | **Date:** 2026-07-11 | **Author:** NEXUS
**Status:** Gap analysis across Pages 1-4 expanded specs
**Triggered by:** Kevin's directive — *"All needs to be fully editable, with customizable layout, with layout in terms of priorities, focusing on moving the immediate next step wherever I look at, giving sense of overview, focus, and urgency, and pushing for baby steps towards next milestones, and fully editable like Notion or Evernote, or Canva, or Riverside or CapCut would be. Nothing static. And all connected to/from Supabase."*

---

## The 12 Criteria (Extrapolated from Kevin's Logic)

| # | Criterion | What It Means | Reference Product |
|---|-----------|--------------|-------------------|
| C1 | **Zero Static Elements** | Every display is also an edit surface. No read-only tables. No hardcoded values. Everything clickable → editable. | Notion |
| C2 | **Freeform Layout Control** | User can rearrange panels, resize sections, show/hide blocks, pin favorites, create custom workspace views. Not just drag-reorder — full canvas control. | Canva |
| C3 | **Priority-First Architecture** | Wherever you look, the "next action" is immediately visible. Not buried in a menu. The page screams: "DO THIS NEXT." | Linear |
| C4 | **Overview + Focus + Urgency** | Simultaneously: big picture (all data) + laser focus (what matters NOW) + urgency (what's overdue/at-risk). Three layers visible at once. | Bloomberg Terminal |
| C5 | **Baby Steps Toward Milestones** | Progressive guidance. Not "here's everything" but "here's your next step → then this → then this." Checkpoint-driven. | Duolingo |
| C6 | **Full Supabase Connectivity** | All data live. No hardcoded seed data in production. Real-time subscriptions. Optimistic updates. Everything reads/writes Supabase. | — |
| C7 | **Inline Everything** | No modals for editing. No separate pages for detail. Edit in context. Side panels for detail, not page navigation. | Notion |
| C8 | **Drag-and-Drop Everywhere** | Reorder items, move between sections, drag across pages, drop to schedule, rearrange layout. Every element draggable where it makes sense. | CapCut |
| C9 | **Block-Based Editing** | Rich content editing with blocks, slash commands, inline formatting, embed, media insertion. Not a text input — a full editor. | Notion / CapCut |
| C10 | **Multi-Track Timeline** | For scheduling, sequences, journeys — timeline with tracks/lanes, zoom levels, scrub, snap, overlap detection. | Riverside / CapCut |
| C11 | **Real-Time Multi-User** | See who else is here. See their cursor/selection. No conflicts. Live presence. | Notion / Figma |
| C12 | **Workspace Memory** | App remembers where you left off. Scroll position, open panels, filter state, last edited item. Resume exactly where you were. | Evernote |

---

## Page-by-Page Audit

### Page 1: Dashboard

| Criterion | Status | What's There | What's Missing |
|-----------|--------|-------------|----------------|
| C1 Zero Static | 🟡 Partial | KPI cards clickable → drill down. Feed items have inline actions. | KPI cards themselves not editable (can't change target values inline). Brief section not editable (can't annotate/edit AI's words). Revenue target not editable inline. |
| C2 Layout Freedom | 🟡 Partial | Drag-and-drop section reorder. Section visibility toggle. User prefs stored. | **No panel resize.** No split views. No pinning a section to always be visible. No "floating" widgets. No custom widget creation (user can't add their own Supabase query as a card). No saved layout presets ("Morning view", "Review view"). |
| C3 Priority-First | 🟢 Good | Feed sorted by priority. Contextual quick actions appear based on state. Overdue items highlighted. | **No "YOUR TOP 3" persistent banner.** No forced focus mode that hides everything except the #1 action. No "If you do one thing today" call-out. Priority is in the feed, not in the layout itself. |
| C4 Overview+Focus+Urgency | 🟢 Good | KPIs = overview. Feed = focus. Overdue/warning items = urgency. | **No unified "health score"** that combines all metrics into one number. No "at a glance: are we winning?" indicator beyond the brief's green/yellow/red. No countdown to nearest deadline. |
| C5 Baby Steps | 🟡 Partial | Brief recommends actions. Contextual quick actions. | **No step-by-step milestone tracker.** No "Next milestone: Webinar Jul 18 → 3 steps remaining → [Step 1] [Step 2] [Step 3]" with progress. No checklist that guides through a campaign launch. |
| C6 Supabase Connected | 🟢 Good | All KPIs from Supabase. Realtime subscriptions. Cross-app sync. | KPI targets/targets not in Supabase (hardcoded €25K). User preferences in Supabase ✅. |
| C7 Inline Everything | 🟢 Good | Feed actions inline. Brief expand inline. KPI drill-down inline. | **Can't edit KPI targets inline.** Can't add custom feed filters inline (need settings page). Can't edit quick actions inline (need drag reorder but not inline edit of action itself). |
| C8 Drag-and-Drop | 🟡 Partial | Section reorder ✅. Quick action reorder ✅. | **Can't drag feed items to other pages** (e.g., drag overdue content → Calendar to reschedule). Can't drag KPI cards to rearrange within the KPI row. Can't drag brief recommendations to execute. |
| C9 Block Editing | ⚪ N/A | Dashboard isn't a content editing surface. | Could add: **editable notes/annotations section** where Kevin can write freeform notes that persist. |
| C10 Multi-Track Timeline | 🟡 Partial | Today's Schedule is a timeline. | **Single track only.** No multi-track (e.g., one track per channel, overlapping events visible). No zoom. No scroll to future dates from dashboard. |
| C11 Real-Time Multi-User | 🔴 Missing | No presence indicators on dashboard. | **No "Echo is publishing right now" live indicator.** No "Maria is reviewing emails" presence. Could show who's active in the system. |
| C12 Workspace Memory | 🔴 Missing | Not specified. | **No scroll position memory.** No "last viewed section" highlighting. No resume-from-where-you-left-off. |

### Page 2: Content Calendar

| Criterion | Status | What's There | What's Missing |
|-----------|--------|-------------|----------------|
| C1 Zero Static | 🟢 Excellent | Every cell inline editable. No modals. Inline creation. Cmd+K. | Content score is read-only (by design). But: **can't edit AI scoring criteria inline** (weights, rules). |
| C2 Layout Freedom | 🟡 Partial | 4 view modes (Table/Calendar/Board/Timeline). Filters persist. | **No panel resize** (can't make sidebar wider, can't split view: calendar + detail side-by-side). No custom view creation beyond the 4 preset views. No "my layout" saved arrangements. **Can't hide columns by dragging them off.** |
| C3 Priority-First | 🟢 Good | Priority dots on every row. WIP limits per column. Conflict detection. | **No "FOCUS MODE"** that shows ONLY the 3 highest-priority items due today. No "WHAT'S MY NEXT CONTENT TASK?" callout. Priority exists but isn't *screamed*. |
| C4 Overview+Focus+Urgency | 🟢 Good | Content gaps detection. Overdue flagging. Campaign progress bars. | **No unified content health score.** No "X items need attention RIGHT NOW" counter at top. No countdown to next campaign milestone. |
| C5 Baby Steps | 🟡 Partial | AI auto-fill gaps. AI scheduling suggestions. | **No guided content creation flow.** No "To fill BRIDGE gap → Step 1: Choose template → Step 2: Fill variables → Step 3: Review → Step 4: Schedule." No milestone checklist per campaign. |
| C6 Supabase Connected | 🟢 Good | All content from Supabase. Realtime for multi-user. Optimistic updates. | ✅ Fully connected. |
| C7 Inline Everything | 🟢 Excellent | Every cell editable. Inline creation. No modals. Content detail panel (side). | **Comments not fully inline** (need to open panel). Version history not inline (need panel). |
| C8 Drag-and-Drop | 🟢 Excellent | Drag calendar cards to reschedule. Drag board cards to change status. Drag timeline bars. | **Can't drag content from Calendar → Distribution** (to schedule a publish). Can't drag from external sources into calendar. |
| C9 Block Editing | 🟡 Partial | Content body editable in side panel (rich text). | **Not full block editor here** (that's in Template page). Content body in calendar is limited. Could have inline rich text editing of content body from the table view. |
| C10 Multi-Track Timeline | 🟢 Good | Gantt/Timeline view with campaign grouping, drag bars, zoom. | **No channel tracks** (one lane per channel showing overlaps). No "my content" vs "all content" track toggle. |
| C11 Real-Time Multi-User | 🟢 Good | Live avatars on rows being edited. "Echo is editing this row." | **No cursor presence** (can't see WHERE in the document someone is editing). No selection highlighting. |
| C12 Workspace Memory | 🔴 Missing | Filters persist ✅. | **No scroll position memory.** No "last edited content" highlight. No resume-from-last-position. |

### Page 3: Template & Asset Library

| Criterion | Status | What's There | What's Missing |
|-----------|--------|-------------|----------------|
| C1 Zero Static | 🟡 Partial | Templates editable via rich editor. Assets draggable. | **Template gallery is grid/list/board — but can't inline-edit template metadata from the card.** Need to open template to edit. Card-level info (title, category, tags) should be inline-editable like Content Calendar cells. |
| C2 Layout Freedom | 🔴 Weak | Grid/list/board views. Folder sidebar. | **No panel resize** (can't make folder tree wider/narrower). No custom layout. No split view (template + asset side-by-side). No "pin" frequently-used folders. No saved workspace arrangements. **No freeform canvas for template design** (this is the biggest gap — it should feel like Canva). |
| C3 Priority-First | 🔴 Missing | Recently used ✅. Favorites ✅. | **No "RECOMMENDED FOR YOUR NEXT CONTENT" card.** No "Based on your content calendar gaps, use this template." No priority ordering of templates by urgency of need. Templates are organized by category, not by "what you should use NOW." |
| C4 Overview+Focus+Urgency | 🔴 Weak | Template analytics (usage, performance). | **No "TEMPLATE HEALTH AT A GLANCE"** dashboard. No "3 templates need updating (outdated brand)." No "Star templates this week" highlight. Analytics exist but not surfaced as urgency. |
| C5 Baby Steps | 🔴 Missing | Template → variables → generate → edit flow exists. | **No guided creation wizard.** No "Create LinkedIn post in 4 steps" with progress indicator. No "Start from this template → fill these 3 variables → generate → review → publish." Should be a progressive disclosure flow, not just "here's the editor, figure it out." |
| C6 Supabase Connected | 🟢 Good | Templates, assets, folders all in Supabase. Storage buckets. | ✅ Fully connected. |
| C7 Inline Everything | 🟡 Partial | Rich editor is inline (block-based). Variables inline. | **Can't inline-edit template card metadata.** Need to open template to rename/recategorize. Tags not inline-editable on cards. Folder structure not rearrangeable without opening. |
| C8 Drag-and-Drop | 🟢 Good | Drag assets to editor. Drag templates to calendar. Drag files to upload. Folder drag-move. | **Can't drag multiple templates to create a bundle.** Can't drag a template card to reorder in the gallery. Can't drag assets between folders visually. |
| C9 Block Editing | 🟢 Excellent | Full Notion-style block editor. Slash commands. Inline AI blocks. | ✅ Best-in-class for this criterion. |
| C10 Multi-Track Timeline | ⚪ N/A | Not a timeline-based surface. | Could add: **Template version timeline** — visual timeline of template versions with diff preview. |
| C11 Real-Time Multi-User | 🟡 Partial | Live editing indicators (TPL-059). | **No cursor presence.** No "Echo is editing this template" on the card. No collaborative editing (only indicators). |
| C12 Workspace Memory | 🔴 Missing | Not specified. | **No "last used templates" auto-shown.** No scroll position memory. No "you were editing Template X, continue?" prompt. |

### Page 4: Distribution Engine

| Criterion | Status | What's There | What's Missing |
|-----------|--------|-------------|----------------|
| C1 Zero Static | 🟡 Partial | Email sequence builder: drag-reorder. Mailing list filter builder. | **Sequence emails not inline-editable from timeline.** Need to click into email to edit subject/body. **Mailing list not inline-editable** (can't rename/toggle from list view). **Automation rules not inline-editable.** |
| C2 Layout Freedom | 🔴 Weak | Sequence builder is a timeline. Mailing list is a table. | **No panel resize.** No split view (sequence + email detail side-by-side). No custom layout. No "pin" active sequence to top. No saved filter presets. **Distribution page has no customizable layout at all** — it's a fixed layout of sequence list → detail → calendar. |
| C3 Priority-First | 🔴 Missing | Sequence status groups. | **No "NEEDS ATTENTION" section.** No "3 sequences have declining open rates." No "This email's bounce rate is 8% — fix now." No "Welcome sequence has 47 people waiting — advance them." Priority is not surfaced. |
| C4 Overview+Focus+Urgency | 🔴 Weak | Multi-channel calendar. Analytics dashboard. | **No unified distribution health overview.** No "THIS WEEK: 12 sends across 3 channels. 2 need attention." No combined view of all channels' performance in one glance. Analytics are per-section, not unified. |
| C5 Baby Steps | 🔴 Missing | Sequence builder exists. Automation rule builder exists. | **No guided setup wizard.** No "Create your first email sequence in 5 steps." No "Your mailing list is empty → [import contacts] [add manually] [sync from events]." No progressive onboarding within the tool itself. |
| C6 Supabase Connected | 🟢 Good | All sequences, lists, schedules, metrics in Supabase. Cron jobs. | ✅ Fully connected. |
| C7 Inline Everything | 🔴 Weak | Most actions require clicking into detail. | **Sequence email subject/body not inline-editable from timeline.** Mailing list contacts not inline-editable. Calendar scheduling requires modal. Suppression list not inline-editable. A/B test results require navigating to detail page. |
| C8 Drag-and-Drop | 🟢 Good | Drag-reorder emails in sequence. Drag content to calendar slots. | **Can't drag sequence to duplicate.** Can't drag mailing list to add to another list. Can't drag automation rule to reorder priority. |
| C9 Block Editing | 🔴 Missing | Email body is HTML editor. | **Not block-based.** Should be Notion-style block editor for email body too. No slash commands. No inline AI generation within email body. |
| C10 Multi-Track Timeline | 🟡 Partial | Email sequence timeline (single track). Multi-channel calendar (week view). | **Sequence timeline is single-track.** No multi-track showing all active sequences simultaneously. Calendar has channel rows ✅ but no zoom/scrub. No "all sends this week" unified timeline. |
| C11 Real-Time Multi-User | 🔴 Missing | Not specified. | **No "Maria is editing this sequence" presence.** No collaboration indicators. Distribution is a solo experience. |
| C12 Workspace Memory | 🔴 Missing | Not specified. | **No "last viewed sequence" highlight.** No scroll position memory. No resume. |

---

## Cross-Page Gaps (Missing Everywhere)

| Gap | Description | Impact |
|-----|-------------|--------|
| **G1: No Panel Resize** | No page allows resizing panels/sidebars/columns. Fixed layouts only. | Users with different screen sizes or preferences can't optimize their view. |
| **G2: No Split View** | Can't view two things side-by-side (e.g., template + calendar, sequence + email detail). | Constant context-switching between pages. |
| **G3: No Focus Mode** | No page has a "focus mode" that hides everything except the top priority items. | Information overload. Can't zero in on what matters. |
| **G4: No Milestone Tracker** | No page shows "Next milestone: X → Steps remaining → Progress." | Users don't see how daily tasks connect to bigger goals. |
| **G5: No Workspace Memory** | No page remembers scroll position, open panels, last edited item. | Every session starts from scratch. |
| **G6: No "Next Action" Callout** | No page has a persistent, prominent "DO THIS NOW" element. | Users have to scan to find what's urgent. |
| **G7: No Freeform Canvas** | Every page is a fixed layout (header + sections). No Canva-like freedom. | Layouts can't adapt to different workflows. |
| **G8: No Cross-Page Drag** | Can't drag items between pages (e.g., template → calendar, content → distribution). | Work requires multiple steps where one drag should suffice. |
| **G9: No Saved Layout Presets** | Can't save and switch between layout configurations. | Can't have "Morning review" vs "Deep work" vs "Quick check" views. |
| **G10: No Inline Target Editing** | KPI targets, WIP limits, thresholds are hardcoded/config, not inline-editable. | Can't adjust goals without going to settings. |
| **G11: No Live Presence (Cross-Page)** | Only Calendar has presence indicators. Others have none. | No sense of team activity across the platform. |
| **G12: No Guided Flows** | No page has step-by-step wizards or progressive disclosure. | Users face full complexity immediately. |

---

## Extrapolated Logic: The "Kevin Standard"

Kevin's references (Notion, Evernote, Canva, Riverside, CapCut) share these principles that must apply to EVERY page:

### Principle 1: The Canvas Model
Every page is a **canvas**, not a **form**. Users can:
- Drag any panel to any position
- Resize any panel by dragging edges
- Show/hide any panel
- Pin panels to keep them visible
- Save canvas arrangements as named presets
- Have different canvas per project/campaign/context

### Principle 2: The Action-First Surface
Every page must answer within 2 seconds:
- **"What needs my attention RIGHT NOW?"** → Highlighted section, pulsing indicator
- **"What's my next step?"** → Explicit call-to-action button, always visible
- **"How am I doing overall?"** → Health score, progress bars, trend arrows
- **"What's the deadline?"** → Countdown timer to nearest milestone

### Principle 3: The Progressive Disclosure Model
Never show everything at once. Instead:
- **Layer 1**: Health score + next action (always visible)
- **Layer 2**: Summary cards with drill-down (1 click)
- **Layer 3**: Full detail (expand inline, not navigate away)
- **Layer 4**: Historical/advanced data (side panel or tab)

### Principle 4: The Baby Steps Engine
Every major workflow is broken into guided steps:
- Campaign creation: "Step 1: Define goal → Step 2: Select templates → Step 3: Build content calendar → Step 4: Set up distribution → Step 5: Launch → Step 6: Monitor"
- Each step has a clear "Done ✓" state and "Next →" button
- Progress saved — can resume from where you left off
- Steps are non-linear (can jump back, skip ahead)

### Principle 5: Everything is Live
- All data from Supabase, real-time
- All edits optimistic (show immediately, sync in background)
- All targets/thresholds/limits user-configurable inline
- All views saveable and shareable

### Principle 6: The Team Layer
- See who else is active (presence)
- See what they're working on (activity feed per person)
- No conflicts (last-write-wins with undo, or operational transforms)
- Handoff gestures ("I'm done, over to you")

---

## Recommended New Tickets (Cross-Page Infrastructure)

These are **platform-level capabilities** that must be built once and used by all pages:

| Ticket | Title | Effort | Description |
|--------|-------|--------|-------------|
| INFRA-100 | **Resizable Panel System** | 8h | CSS Grid/Flex-based resizable panels with drag handles. Any panel edge can be dragged to resize. Min/max constraints. Persist sizes in user prefs. |
| INFRA-101 | **Split View Component** | 6h | `<SplitView>` component: horizontal or vertical split, draggable divider, each pane independently scrollable. Used on all pages. |
| INFRA-102 | **Focus Mode Engine** | 5h | Global "Focus Mode" toggle. When active: hides all non-essential panels, shows only top 3 priority items + next action. Persists per page. Keyboard shortcut: `Cmd+Shift+F`. |
| INFRA-103 | **Milestone Tracker Component** | 8h | `<MilestoneTracker>` component: shows next milestone, steps to get there, progress. Data from Supabase `milestones` table. Each page shows relevant milestones. |
| INFRA-104 | **Workspace Memory System** | 4h | Per-user, per-page memory: scroll position, open panels, active filters, last edited item. Restored on page load. Stored in `user_workspace_memory` table. |
| INFRA-105 | **Layout Preset System** | 6h | Save current layout as named preset. Switch between presets. Per-page presets. Share presets with team. Default presets per role. |
| INFRA-106 | **Next Action Callout** | 4h | `<NextAction>` persistent banner at top of every page. Shows single highest-priority action with one-click execute. Data from priority engine (INFRA-108). |
| INFRA-107 | **Cross-Page Drag-and-Drop** | 8h | Enable dragging items across page boundaries. Uses HTML5 drag API + global drop zone registry. Template→Calendar, Content→Distribution, Feed→any page. |
| INFRA-108 | **Priority Engine** | 6h | Central priority calculation service. Combines: due date, dependency status, AI recommendation, user role, historical behavior → single priority score per item. Used by all pages. |
| INFRA-109 | **Guided Flow Engine** | 10h | `<GuidedFlow>` component: step-by-step wizard with progress, resume capability, non-linear navigation. Used for campaign creation, sequence setup, event planning, etc. |
| INFRA-110 | **Global Presence System** | 6h | WebSocket-based presence: who's online, what they're viewing, what they're editing. Shown as avatars on all pages. Click → see their recent activity. |
| INFRA-111 | **Inline Target Editor** | 4h | All KPI targets, WIP limits, thresholds, goals editable inline. Click number → type new value → Enter to save. Stored in Supabase `system_config` table. |
| INFRA-112 | **Unified Health Score** | 5h | Single 0-100 score per page combining all relevant metrics. Displayed prominently. Color-coded. Click → see breakdown. |

**Total new infrastructure: ~80h across 13 tickets**

---

## Per-Page Additional Tickets Needed

### Page 1: Dashboard (+8 tickets, ~32h)

| Ticket | Title | Effort |
|--------|-------|--------|
| DASH-037 | Editable KPI targets (click number → edit → save to Supabase) | 3h |
| DASH-038 | "YOUR TOP 3" persistent priority banner (always visible, above everything) | 4h |
| DASH-039 | Milestone countdown section (next deadline, steps remaining, progress) | 5h |
| DASH-040 | Workspace memory (scroll position, last expanded section, brief read state) | 3h |
| DASH-041 | Layout presets ("Morning Review", "Revenue Focus", "Campaign Launch") | 4h |
| DASH-042 | Annotatable brief (Kevin can add notes/highlights to brief sections) | 4h |
| DASH-043 | Drag feed items to other pages (drop on Calendar to reschedule, etc.) | 5h |
| DASH-044 | Live team presence bar ("Echo active · Maria active · Carl idle") | 4h |

### Page 2: Content Calendar (+6 tickets, ~28h)

| Ticket | Title | Effort |
|--------|-------|--------|
| CAL-043 | Focus Mode for calendar (show only top 3 priority items due today) | 4h |
| CAL-044 | Inline content health score per row (composite of: AI score, deadline proximity, approval status) | 4h |
| CAL-045 | Milestone progress per campaign (inline in campaign column) | 5h |
| CAL-046 | Workspace memory (scroll position, last edited content, active view) | 3h |
| CAL-047 | Column resize + reorder + show/hide with drag | 5h |
| CAL-048 | Cross-page drag: content → Distribution page (creates schedule entry) | 7h |

### Page 3: Template Library (+10 tickets, ~42h)

| Ticket | Title | Effort |
|--------|-------|--------|
| TPL-060 | Inline-editable template card metadata (title, tags, category — without opening) | 4h |
| TPL-061 | "RECOMMENDED FOR YOU" section (based on content calendar gaps + recent usage) | 6h |
| TPL-062 | Guided creation wizard (step-by-step: choose template → fill variables → generate → review → publish) | 8h |
| TPL-063 | Panel resize (folder tree width, gallery grid density, preview panel) | 3h |
| TPL-064 | Split view: template editor + asset library side-by-side | 4h |
| TPL-065 | Template gallery drag-reorder (custom ordering per user) | 3h |
| TPL-066 | Template version timeline (visual timeline of all versions with diff) | 5h |
| TPL-067 | Workspace memory (last used templates, scroll position, active folder) | 3h |
| TPL-068 | Template health dashboard (outdated templates, unused templates, star performers) | 4h |
| TPL-069 | Layout presets ("Creation Mode" = editor + assets, "Browsing Mode" = gallery full-width) | 2h |

### Page 4: Distribution (+12 tickets, ~52h)

| Ticket | Title | Effort |
|--------|-------|--------|
| DIST-067 | Inline-editable sequence emails from timeline (click email node → edit subject/body inline) | 6h |
| DIST-068 | "NEEDS ATTENTION" section (declining sequences, high bounce, stale lists) | 5h |
| DIST-069 | Block-based email body editor (Notion-style, replacing HTML editor) | 8h |
| DIST-070 | Multi-track sequence timeline (all active sequences as parallel tracks) | 6h |
| DIST-071 | Guided sequence creation wizard ("Create welcome sequence in 5 steps") | 5h |
| DIST-072 | Panel resize (sequence list width, timeline height, email detail panel) | 3h |
| DIST-073 | Split view: sequence timeline + email detail side-by-side | 4h |
| DIST-074 | Inline-editable mailing lists (rename, toggle active, edit filters from list view) | 4h |
| DIST-075 | Workspace memory (last viewed sequence, scroll position, active filters) | 3h |
| DIST-076 | Unified distribution overview (this week: X sends, Y channels, Z issues) | 5h |
| DIST-077 | Layout presets ("Sequence Builder" = timeline focus, "Analytics" = metrics focus) | 3h |
| DIST-078 | Live presence for distribution ("Maria is editing Welcome Sequence") | 3h |

---

## Updated Totals

| Page | Previous Tickets | Previous Hours | New Tickets | New Hours | Total Tickets | Total Hours |
|------|-----------------|----------------|-------------|-----------|---------------|-------------|
| Cross-Page Infrastructure | — | — | 13 | 80h | 13 | 80h |
| Page 1: Dashboard | 36 | 126h | 8 | 32h | 44 | 158h |
| Page 2: Content Calendar | 42 | 175h | 6 | 28h | 48 | 203h |
| Page 3: Template Library | 66 | 190h | 10 | 42h | 76 | 232h |
| Page 4: Distribution | 66 | 218h | 12 | 52h | 78 | 270h |
| **TOTAL** | **210** | **709h** | **49** | **234h** | **259** | **943h** |

---

## Visual Summary: What's Missing (Heat Map)

```
                    C1  C2  C3  C4  C5  C6  C7  C8  C9  C10 C11 C12
Page 1 Dashboard    🟡  🟡  🟢  🟢  🟡  🟢  🟢  🟡  ⚪  🟡  🔴  🔴
Page 2 Calendar     🟢  🟡  🟢  🟢  🟡  🟢  🟢  🟢  🟡  🟢  🟢  🔴
Page 3 Templates    🟡  🔴  🔴  🔴  🔴  🟢  🟡  🟢  🟢  ⚪  🟡  🔴
Page 4 Distribution 🟡  🔴  🔴  🔴  🔴  🟢  🔴  🟢  🔴  🟡  🔴  🔴

🟢 Good  🟡 Partial  🔴 Missing  ⚪ N/A
```

**Pattern:** Page 2 (Content Calendar) is the strongest — closest to Kevin's standard.
**Biggest gaps:** Pages 3 and 4 — need significant work on layout freedom, priority-first design, guided flows, and inline editing.

---

## Recommendation

1. **Build INFRA-100 to INFRA-112 first** (80h, 3 weeks) — these are platform capabilities that every page needs. Without them, each page will reinvent the wheel.

2. **Then retrofit Pages 3 and 4** — they have the biggest gaps against Kevin's standard. Pages 1 and 2 are closer but still need focus mode, workspace memory, and milestone tracking.

3. **Add "Kevin's Dashboard" concept** — a special dashboard view that Kevin sees, optimized for executive overview + cross-app visibility + revenue tracking + agent oversight. Different from Echo's operational view or Maria's email-focused view.

4. **Consider a "Command Palette" per page** — not just global Cmd+K, but context-sensitive command palettes per page (Calendar: "Schedule all drafts", Distribution: "Pause all sequences", etc.).

