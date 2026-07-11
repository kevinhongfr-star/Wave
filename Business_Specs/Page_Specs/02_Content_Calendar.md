# WAVE Business Spec — Page 2: Content Calendar

**Version:** 2.0 | **Date:** 2026-07-11 | **Status:** Draft for Kevin Review
**Builds on:** TICKET-009 through TICKET-020 (existing — static grid, modal-only editing, basic status workflow)
**Gap tickets:** CAL-001 through CAL-015

---

## 1. Purpose

The Content Calendar is the operational heart of WAVE. It's where Echo, Maria, Carl, and Kevin plan, create, schedule, and track every piece of content across every channel.

**Today's problem:** The current implementation is a static HTML table with 5 hardcoded rows. TICKET-009 adds a calendar grid, TICKET-010 adds a modal for creation, and TICKET-011 adds a basic status dropdown. This is functional but clunky — every edit requires opening a modal, every schedule change requires a form submission, and there's zero AI assistance.

**What this spec delivers:** A Notion-like content calendar where you can:
- Edit any field inline (click the cell, type, done)
- Select 20 items and bulk-change status, owner, or date
- Ask AI to suggest optimal publish times
- Drag content between days/channels
- See content gaps at a glance
- Create content in 2 seconds with Cmd+K inline creation
- Preview how content will look on LinkedIn/email/blog before publishing

---

## 2. Business Requirements

### 2.1 Multi-View Calendar (not just a table)

| View | Purpose | When Used |
|------|---------|-----------|
| **Table** | Dense data view, inline editing, bulk ops | Daily operations, quick edits |
| **Calendar** (month) | Visual schedule, conflict spotting, drag-and-drop | Weekly planning, team sync |
| **Board** (Kanban) | Status workflow visualization | Sprint planning, bottleneck identification |
| **Timeline** (Gantt-like) | Campaign timelines, content series overlap | Campaign planning, quarterly review |

Default view: **Table** (most used for daily work). User preference stored in localStorage.

### 2.2 Inline Editing (Notion-style)

Every cell in the table is editable inline:

| Column | Edit Type | Behavior |
|--------|-----------|----------|
| Title | Text input | Click → select all text → type → Enter to save, Esc to cancel |
| Status | Dropdown pill | Click → dropdown with status options → select → instant update |
| Channel | Dropdown with icons | Click → dropdown with channel icons → select → instant update |
| Owner | Avatar dropdown | Click → dropdown with team members → select → instant update |
| Due Date | Date picker | Click → date picker opens → select → instant update |
| Campaign | Dropdown (searchable) | Click → searchable dropdown of campaigns → select → instant link |
| Tags | Tag input | Click → type to add tags, click x to remove → instant update |
| Priority | Number/color selector | Click → 1-5 selector → instant update |

**Save behavior:** Every inline edit triggers an immediate Supabase PATCH (optimistic UI — update shows instantly, rollback if API fails). No "Save" button needed.

### 2.3 Bulk Operations

| Action | How Triggered | What Happens |
|--------|--------------|---------------|
| Multi-select | Checkbox on each row + Shift+click for range | Selected rows highlight blue |
| Bulk status change | Select rows → toolbar appears → [Change Status ▾] | All selected items update to new status |
| Bulk assign owner | Select rows → [Assign Owner ▾] | All selected items get new owner |
| Bulk reschedule | Select rows → [Move Dates ▾] | Opens date picker, shifts all by same delta |
| Bulk add tag | Select rows → [Add Tag ▾] | Adds tag to all selected items |
| Bulk delete | Select rows → [Delete] | Confirmation dialog, soft delete |
| Bulk duplicate | Select rows → [Duplicate] | Creates copies with "(Copy)" suffix, status = draft |
| Select all | Checkbox in header → selects all visible (after filters) | Shows count: "147 selected" |

**Bulk toolbar:** Appears floating above table when ≥1 item selected. Shows count + available actions. Disappears when selection cleared.

### 2.4 AI Scheduling Assistant

**When triggered:**
- User clicks [AI Suggest] button in toolbar
- User creates new content and focuses the "Due Date" field
- User selects content items and clicks [AI Optimize Schedule]

**What it does:**
1. Analyzes last 90 days of content performance by channel (opens, clicks, engagement)
2. Identifies optimal publish days/times per channel
3. Detects scheduling conflicts (2+ LinkedIn posts same day)
4. Detects content gaps (no BRIDGE content in 14 days)
5. Returns recommendations: "Move 'BRIDGE Case Study' from Wed Jul 16 to Tue Jul 15 8:00am — Tuesday LinkedIn posts get 2.4x more engagement"

**AI can also:**
- Suggest content for gaps: "No SHIFT-QUEST content in 21 days. Consider: 'Leadership Assessment ROI' LinkedIn post"
- Auto-schedule a batch: Select 5 draft items → [AI Auto-Schedule] → AI assigns optimal dates/times based on channel performance data
- Warn about over-scheduling: "You have 4 LinkedIn posts scheduled for Monday — recommend spreading across the week"

### 2.5 Drag-and-Drop (Calendar View)

- Drag content card from one day to another → updates scheduled_date
- Drag content card from one channel column to another → updates channel
- Drag to edge of calendar → auto-scrolls to next week/month
- Visual feedback: ghost preview of where card will land
- Conflict warning: if dropping on a day that already has 3+ items on that channel, show amber indicator

### 2.6 Quick Create (Cmd+K / Inline)

**Two ways to create content:**

1. **Keyboard shortcut (Cmd+K or Ctrl+K):** Opens a command palette at top of table. Type content title → Enter → creates as draft with today's date. Can then edit inline.
2. **Inline new row:** Click "+ New row" at bottom of table (or press Enter on last row) → creates empty row with focus on title cell. Fill in fields inline.
3. **From template:** Click [+ From Template] → shows template gallery → select template → creates new row with template fields pre-filled.

### 2.7 Content Preview (Channel Simulation)

Before publishing, preview how content will look on each channel:

| Channel | Preview Shows |
|---------|--------------|
| LinkedIn | LinkedIn post card (profile pic, text, hashtags, engagement mock) |
| Email | Email client preview (subject line, preview text, body rendering) |
| Blog/Website | Browser mockup with title, hero image, body |
| Podcast | Podcast player mockup with episode title, description |
| YouTube | YouTube thumbnail + title + description preview |

**Access:** Click [Preview] button on any content row → opens side panel with channel-specific preview. Uses actual content body + channel formatting rules.

### 2.8 Content Gap Detection

AI-powered analysis shown as a subtle banner above the calendar:

```
┌─────────────────────────────────────────────────────────────────┐
│ 💡 Content Gaps Detected:                                       │
│ • No BRIDGE content published in 18 days (avg: 3/week)         │
│ • No podcast content scheduled for next 2 weeks                 │
│ • SHIFT-DRIVE has 0 content pieces in July (campaign active)   │
│ [Auto-fill gaps with AI suggestions]                            │
└─────────────────────────────────────────────────────────────────┘
```

### 2.9 Filtering & Sorting

**Filters (combinable, saved as views):**
- By status (multi-select)
- By channel (multi-select)
- By owner (multi-select)
- By campaign (dropdown)
- By product/cluster (tags)
- By date range (date picker)
- By priority (1-5)
- By content type (newsletter, LinkedIn, podcast, etc.)

**Sorting:**
- Click any column header to sort (asc/desc toggle)
- Multi-sort: Shift+click additional columns
- Default sort: due_date ASC, priority DESC

**Saved Views:**
- User can save current filter+sort as a named view
- Views appear as tabs above the table: "All", "This Week", "My Content", "Needs Review", "Overdue"
- Views are per-user, stored in Supabase `user_preferences`

---

## 3. User Requirements

| User | What They Need From Content Calendar | Priority |
|------|--------------------------------------|----------|
| **Kevin** | See all content at a glance, spot gaps, approve content inline, AI scheduling suggestions | P0 |
| **Echo** | Plan weekly content across channels, create quickly, see conflicts, bulk schedule | P0 |
| **Maria** | See email content schedule, link to sequences, preview email rendering | P0 |
| **Carl** | See webinar/podcast schedule, registration content linked, preview podcast pages | P1 |
| **Valentina** | See what's ready for website publishing, content status for deployment | P1 |
| **Vanjulla** | See podcast-related content, promo schedule, episode tracking | P1 |
| **NEXUS** | Content status for AI briefs, pipeline health metrics, gap detection data | P1 |

---

## 4. UX Requirements (Notion-like feel)

### 4.1 Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Content Calendar                                    [Filter ▾] [⚙] │
├─────────────────────────────────────────────────────────────────┤
│ [All] [This Week] [My Content] [Needs Review] [Overdue] [+ Save]│
├─────────────────────────────────────────────────────────────────┤
│ 💡 Content Gaps: No BRIDGE content in 18 days, no podcast...   │
│    [Auto-fill with AI] [Dismiss]                                │
├─────────────────────────────────────────────────────────────────┤
│ [Table] [Calendar] [Board] [Timeline]    [AI Suggest] [+ New]  │
├─────────────────────────────────────────────────────────────────┤
│ ☐ │ Status    │ Title              │ Channel  │ Owner │ Due    │
│───┼───────────┼────────────────────┼══════════┼═══════┼════════│
│ ☐ │ ●Published│ AI in Leadership   │ LinkedIn │ Echo  │ Jul 10 │
│ ☐ │ ●In Review│ Q3 Newsletter      │ Email    │ Maria │ Jul 12 │
│ ☐ │ ● Draft   │ Diagnostic Intel.. │ Blog     │ Xuemei│ Jul 15 │
│ ☐ │ ●Scheduled│ Podcast Ep.3 Promo │ Social   │ Vanj. │ Jul 14 │
│ ☐ │ ● Idea    │ Cross-Cultural..   │ LinkedIn │ Carl  │ Jul 18 │
│ ☐ │           │ + New row          │          │       │        │
├─────────────────────────────────────────────────────────────────┤
│ Showing 5 of 147 content pieces                    [← Prev] [Next →]│
└─────────────────────────────────────────────────────────────────┘
```

**When items selected (bulk mode):**
```
├─────────────────────────────────────────────────────────────────┤
│ 12 selected │ [Status ▾] [Owner ▾] [Move Dates] [Add Tag] [🗑] [⧉]│
├─────────────────────────────────────────────────────────────────┤
```

### 4.2 Inline Editing Interaction

1. **Single click on cell** → cell enters edit mode (highlighted border, cursor appears)
2. **Text cells:** Full text selected, start typing to replace
3. **Dropdown cells (Status, Channel, Owner):** Dropdown opens immediately
4. **Date cells:** Date picker opens
5. **Enter or Tab** → saves and moves to next cell
6. **Escape** → cancels edit, restores previous value
7. **Click outside** → saves and exits edit mode
8. **Visual feedback:** Edited cells show subtle green flash (200ms) to confirm save

### 4.3 Calendar View

```
┌─────────────────────────────────────────────────────────────────┐
│ ← July 2026 →                                    [Today] [Month ▾]│
├──────┬──────┬──────┬──────┬──────┬──────┬──────────────────────┤
│ Mon  │ Tue  │ Wed  │ Thu  │ Fri  │ Sat  │ Sun                  │
├──────┼──────┼──────┼──────┼──────┼──────┼──────────────────────┤
│      │      │ 1    │ 2    │ 3    │ 4    │ 5                    │
│      │      │ 📧   │ 📝   │ 🔗   │      │                      │
│      │      │ 14:00│ 09:00│ 10:00│      │                      │
├──────┼──────┼──────┼──────┼──────┼──────┼──────────────────────┤
│ 6    │ 7    │ 8    │ 9    │ 10   │ 11   │ 12                   │
│ 📝   │ 📝   │ 🔗   │ 📧   │ 🔗📝│      │ 📧                   │
│ 09:00│ 09:00│ 10:00│ 14:00│09:00│      │ 14:00                │
│      │      │ ⚠️   │      │ 🔗   │      │                      │
├──────┼──────┼──────┼──────┼──────┼──────┼──────────────────────┤
│ 13   │ 14   │ 15   │ 16   │ 17   │ 18   │ 19                   │
│ 📝   │ 🔗📝│ 📝   │ 📧   │ 🔗   │ 🔗   │                      │
│      │10:00│09:00│ 14:00│      │10:00│                          │
│      │      │      │      │      │ ⚠️   │                      │
└──────┴──────┴──────┴──────┴──────┴──────┴──────────────────────┘

📝 Blog/Article  📧 Email  🔗 LinkedIn/Social  🎙 Podcast  🎥 Video
⚠️ = 3+ items on same channel (conflict warning)
```

**Calendar interactions:**
- Click a day → shows side panel with that day's content (inline editable)
- Drag content card to different day → reschedules
- Click + on empty day → creates new content for that date
- Hover on content card → shows tooltip with full title, owner, status

### 4.4 Board View (Kanban)

```
┌────────────┬────────────┬────────────┬────────────┬────────────┐
│   Idea     │   Draft    │   Review   │  Approved  │  Published │
│    (5)     │    (12)    │    (3)     │    (8)     │   (119)    │
├────────────┼────────────┼────────────┼────────────┼────────────┤
│ ┌────────┐ │ ┌────────┐ │ ┌────────┐ │ ┌────────┐ │ ┌────────┐ │
│ │Cross-  │ │ │Diagnos-│ │ │Q3 News-│ │ │AI Lead-│ │ │5 tips  │ │
│ │Cultural│ │ │tic Int.│ │ │letter  │ │ │ership  │ │ │for Q3  │ │
│ │Webinar │ │ │Blog    │ │ │        │ │ │        │ │ │        │ │
│ │Recap   │ │ │Xuemei  │ │ │Maria   │ │ │Echo    │ │ │Echo    │ │
│ │Carl    │ │ │Jul 15  │ │ │Jul 12  │ │ │Jul 10  │ │ │Jul 8   │ │
│ │Jul 18  │ │ │        │ │ │        │ │ │        │ │ │        │ │
│ └────────┘ │ └────────┘ │ └────────┘ │ └────────┘ │ └────────┘ │
│ ┌────────┐ │ ┌────────┐ │            │ ┌────────┐ │            │
│ │BRIDGE  │ │ │Podcast │ │            │ │Webinar │ │            │
│ │case    │ │ │Ep.3    │ │            │ │Recap   │ │            │
│ │study   │ │ │Promo   │ │            │ │        │ │            │
│ └────────┘ │ └────────┘ │            │ └────────┘ │            │
└────────────┴────────────┴────────────┴────────────┴────────────┘
```

- Drag card between columns → changes status
- Click card → expands inline (accordion style, no modal)
- Column headers show count

### 4.5 Animation & Micro-Interactions

- Inline edit save: subtle green border flash (200ms)
- Bulk select: checkbox animation (scale 0→1, 150ms)
- Drag-and-drop: ghost preview with 50% opacity
- Status change: pill color transition (300ms ease)
- AI suggestion banner: slide down from top (200ms)
- New row creation: row slides in from top (200ms)
- Filter application: table rows fade out/in (150ms)

---

## 5. Design Requirements

### 5.1 Table View Design

- **Row height:** 40px default, 48px when hovered (subtle expansion for readability)
- **Cell padding:** 8px horizontal, 10px vertical
- **Column widths:** Resizable (drag column border). Default: Status 100px, Title 300px (flex), Channel 120px, Owner 100px, Due 100px, Campaign 150px
- **Alternating rows:** Very subtle background alternation (2% opacity difference)
- **Hover state:** Row background changes to var(--color-background-alt)
- **Selected state:** Row background changes to rgba(193, 8, 171, 0.05) (brand tint)
- **Editing state:** Cell gets 2px border in brand color, slight scale (1.02)

### 5.2 Status Pill Design

| Status | Color | Icon |
|--------|-------|------|
| Idea | Gray | ○ |
| Draft | Amber | ◐ |
| In Review | Blue | ● |
| Approved | Green | ✓ |
| Scheduled | Purple | ◷ |
| Published | Green (bright) | ✓ |
| Archived | Gray (muted) | ✕ |

### 5.3 Component Library (new components needed)

| Component | Used In | Reference |
|-----------|---------|-----------|
| `EditableCell` | All table views | Notion's inline text editing |
| `StatusDropdown` | Content, Campaigns | Linear's status picker |
| `AvatarDropdown` | Content (owner), Campaigns | Notion's person picker |
| `DatePicker` | Content (due date) | Calendly's date picker |
| `BulkToolbar` | All table views | Notion's bulk action bar |
| `ViewSwitcher` | Content Calendar header | Linear's view switcher |
| `FilterBar` | Content, Campaigns | Notion's filter UI |
| `ContentPreview` | Content (side panel) | Custom — channel-specific preview |
| `AISuggestionBanner` | Content Calendar (top) | Custom — gap detection |
| `CommandPalette` | Cmd+K quick create | Linear's command menu |
| `CalendarGrid` | Calendar view | Notion Calendar's month view |
| `KanbanBoard` | Board view | Linear's board view |
| `TimelineView` | Timeline view | Notion's timeline |

---

## 6. Technical Backend Wiring

### 6.1 Supabase Schema Additions

```sql
-- Extend content_assets table (add columns not in original schema)
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS priority INT DEFAULT 3 CHECK (priority BETWEEN 1 AND 5);
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS ai_schedule_score FLOAT; -- AI-suggested timing confidence
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS content_body TEXT; -- Full content body for preview
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS preview_data JSONB; -- Channel-specific preview data
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS performance_data JSONB; -- Post-publish metrics
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS content_score FLOAT; -- AI-computed quality score (0-100)

-- Content calendar (scheduling details, separate from asset definition)
CREATE TABLE IF NOT EXISTS content_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES content_assets(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  channel TEXT NOT NULL,
  published_url TEXT,
  published_at TIMESTAMPTZ,
  actual_performance JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved views (user preferences for filter/sort combinations)
CREATE TABLE IF NOT EXISTS saved_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  view_type TEXT DEFAULT 'table' CHECK (view_type IN ('table','calendar','board','timeline')),
  filters JSONB DEFAULT '{}',
  sort JSONB DEFAULT '[]',
  column_order TEXT[] DEFAULT '{}',
  column_widths JSONB DEFAULT '{}',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content gaps tracking (AI-detected)
CREATE TABLE IF NOT EXISTS content_gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product TEXT,
  cluster TEXT,
  channel TEXT,
  days_since_last_content INT,
  avg_frequency FLOAT,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  ai_suggestion TEXT
);

-- Performance index for AI scheduling
CREATE INDEX idx_content_schedule_date ON content_schedule(scheduled_date);
CREATE INDEX idx_content_assets_tags ON content_assets USING GIN(tags);
CREATE INDEX idx_content_assets_campaign ON content_assets(campaign_id);
CREATE INDEX idx_saved_views_user ON saved_views(user_id);
```

### 6.2 API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/content` | GET | List content with filters, sort, pagination |
| `/api/content` | POST | Create new content asset |
| `/api/content/[id]` | PATCH | Update content (inline edit, bulk) |
| `/api/content/[id]` | DELETE | Soft delete content |
| `/api/content/bulk` | PATCH | Bulk update (status, owner, date, tags) |
| `/api/content/bulk` | POST | Bulk duplicate |
| `/api/content/views` | GET | Get user's saved views |
| `/api/content/views` | POST | Save new view |
| `/api/content/views/[id]` | PATCH | Update saved view |
| `/api/content/schedule/ai` | POST | AI scheduling optimization |
| `/api/content/gaps` | GET | Detect content gaps |
| `/api/content/preview/[id]` | GET | Generate channel-specific preview |
| `/api/content/score/[id]` | POST | AI content quality scoring |

### 6.3 Supabase Realtime

```typescript
// Subscribe to content_assets changes (for multi-user editing)
supabase
  .channel('content-calendar')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'content_assets' },
    (payload) => {
      // Update local state
      // Show "Echo just edited 'Q3 Newsletter'" toast if different user
      // Highlight changed row briefly
    }
  )
  .subscribe()

// Subscribe to content_gaps for banner updates
supabase
  .channel('content-gaps')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'content_gaps' },
    (payload) => {
      // Update gap banner
    }
  )
  .subscribe()
```

### 6.4 Optimistic Updates Pattern

```typescript
// Every inline edit uses optimistic UI
async function updateCell(assetId: string, field: string, value: any) {
  // 1. Update local state immediately
  setContent(prev => prev.map(item => 
    item.id === assetId ? { ...item, [field]: value } : item
  ))
  
  // 2. Show saving indicator on cell (subtle spinner)
  setSavingCell(`${assetId}-${field}`)
  
  // 3. Send to Supabase
  const { error } = await supabase
    .from('content_assets')
    .update({ [field]: value, updated_at: new Date().toISOString() })
    .eq('id', assetId)
  
  // 4. On error: rollback and show toast
  if (error) {
    setContent(prev => prev.map(item => 
      item.id === assetId ? { ...item, [field]: originalValue } : item
    ))
    toast.error(`Failed to update ${field}`)
  }
  
  // 5. Clear saving indicator
  clearSavingCell(`${assetId}-${field}`)
}
```

---

## 7. AI Layer Specification

### 7.1 AI Scheduling Persona

```yaml
name: "Content Strategist"
role: "Optimal content scheduling and gap detection"
model: deepseek-chat (flash)
temperature: 0.4
max_tokens: 500
system_prompt: |
  You are LYC Partners' Content Strategist AI.
  Analyze content performance data and suggest optimal scheduling.
  
  RULES:
  - Base suggestions on actual performance data, not assumptions
  - Consider channel-specific patterns (LinkedIn: Tue-Thu mornings, Email: Tue/Wed/Thu 10am)
  - Detect conflicts: never suggest 2+ pieces on same channel same day
  - Detect gaps: flag products/clusters with no content in 14+ days
  - Be specific: "Move X from Mon to Tue 8am" not "try different timing"
  - Consider campaign deadlines and event dates
  - Account for content type (newsletters need more lead time than social posts)
  
  OUTPUT FORMAT:
  1. Scheduling recommendations (specific, actionable)
  2. Conflict warnings (if any)
  3. Content gaps (if any)
  4. Confidence score (0-100) for each suggestion
```

### 7.2 AI Content Scoring

When content is created or updated, AI computes a quality score:

```yaml
scoring_criteria:
  - title_clarity: "Is the title specific and compelling? (0-20)"
  - audience_fit: "Does it match target persona/cluster? (0-20)"
  - timing_relevance: "Is it timely? Tied to current events/campaigns? (0-20)"
  - channel_optimization: "Is it formatted for the target channel? (0-20)"
  - actionability: "Does it drive a clear next step for the reader? (0-20)"
  
output:
  total_score: 0-100
  breakdown: { criteria: score }
  suggestions: ["Make title more specific", "Add CTA for webinar registration"]
```

### 7.3 AI Auto-Schedule

```typescript
// POST /api/content/schedule/ai
async function aiAutoSchedule(assetIds: string[]) {
  // 1. Fetch content details
  const assets = await supabase.from('content_assets').select('*').in('id', assetIds)
  
  // 2. Fetch performance data (last 90 days)
  const performance = await supabase
    .from('content_schedule')
    .select('channel, scheduled_date, actual_performance')
    .gte('scheduled_date', subDays(new Date(), 90))
    .not('actual_performance', 'is', null)
  
  // 3. Fetch existing schedule (to detect conflicts)
  const existing = await supabase
    .from('content_schedule')
    .select('scheduled_date, channel')
    .gte('scheduled_date', new Date())
  
  // 4. Build AI prompt
  const prompt = `
    CONTENT TO SCHEDULE:
    ${assets.map(a => `- ${a.title} (${a.channel}, ${a.type})`).join('\n')}
    
    PERFORMANCE DATA (last 90 days):
    ${performance.map(p => `- ${p.channel} on ${p.scheduled_date}: ${JSON.stringify(p.actual_performance)}`).join('\n')}
    
    EXISTING SCHEDULE:
    ${existing.map(e => `- ${e.scheduled_date}: ${e.channel}`).join('\n')}
    
    SUGGEST OPTIMAL DATES/TIMES FOR EACH CONTENT PIECE.
    AVOID CONFLICTS (2+ on same channel same day).
    OUTPUT AS JSON: [{ asset_id, suggested_date, suggested_time, reason, confidence }]
  `
  
  // 5. Call DeepSeek
  const result = await callDeepSeek(prompt)
  
  // 6. Update schedule
  for (const rec of result) {
    await supabase.from('content_schedule').upsert({
      asset_id: rec.asset_id,
      scheduled_date: rec.suggested_date,
      scheduled_time: rec.suggested_time,
      channel: assets.find(a => a.id === rec.asset_id).channel
    })
  }
  
  return result
}
```

### 7.4 Inline AI Actions

| Action | Trigger | What Happens |
|--------|---------|--------------|
| **[AI Suggest Date]** | Click on empty due date cell | AI suggests optimal date based on channel performance |
| **[AI Score]** | Click on content row | AI computes content quality score, shows breakdown |
| **[AI Auto-Schedule]** | Select drafts → click button | AI schedules all selected drafts optimally |
| **[AI Fill Gaps]** | Click on gap banner | AI generates content ideas for detected gaps |
| **[AI Optimize Title]** | Right-click on title cell | AI suggests 3 alternative titles |
| **[AI Summarize]** | Content has long body | AI generates summary for social posts |

---

## 8. Tickets (CAL-001 through CAL-015)

| Ticket | Title | Priority | Effort | Dependencies |
|--------|-------|----------|--------|--------------|
| CAL-001 | Extend `content_assets` table with new columns (priority, tags, content_body, preview_data, performance_data, content_score) | P0 | 2h | T-002 |
| CAL-002 | Create `content_schedule` table + migrate existing scheduling data | P0 | 3h | T-002 |
| CAL-003 | Build `EditableCell` component (text, dropdown, date, tag variants) | P0 | 6h | — |
| CAL-004 | Build inline editing for all content table columns | P0 | 5h | CAL-001, CAL-003 |
| CAL-005 | Implement optimistic update pattern with Supabase | P0 | 4h | CAL-004, T-002 |
| CAL-006 | Build `BulkToolbar` component + multi-select logic | P0 | 5h | CAL-004 |
| CAL-007 | Build bulk API endpoints (`/api/content/bulk`) — update, delete, duplicate | P0 | 4h | T-002 |
| CAL-008 | Build `ViewSwitcher` (Table / Calendar / Board / Timeline) | P0 | 6h | — |
| CAL-009 | Build Calendar view (month grid, drag-and-drop reschedule) | P0 | 8h | CAL-002, CAL-008 |
| CAL-010 | Build Board view (Kanban by status, drag between columns) | P1 | 6h | CAL-008 |
| CAL-011 | Build `CommandPalette` (Cmd+K quick create) | P1 | 4h | CAL-005 |
| CAL-012 | Build `FilterBar` with saved views + `saved_views` table | P1 | 5h | CAL-001, T-002 |
| CAL-013 | Build AI Scheduling Assistant (`/api/content/schedule/ai`) | P1 | 6h | CAL-002, T-004 |
| CAL-014 | Build Content Gap Detection + banner (`/api/content/gaps`) | P1 | 4h | CAL-002, T-004 |
| CAL-015 | Build `ContentPreview` side panel (LinkedIn, Email, Blog, Podcast mockups) | P2 | 6h | CAL-001 |

**Total: 74 hours**

### Ticket Details (P0)

**CAL-001: Extend content_assets table**
- Add priority (INT 1-5), tags (TEXT[]), content_body (TEXT), preview_data (JSONB), performance_data (JSONB), content_score (FLOAT)
- Create indexes on tags (GIN), campaign_id
- Migration script for existing data

**CAL-003: EditableCell component**
- 4 variants: TextEdit, DropdownEdit, DateEdit, TagEdit
- TextEdit: click → input field, Enter saves, Esc cancels
- DropdownEdit: click → dropdown appears, selection saves immediately
- DateEdit: click → date picker, selection saves
- TagEdit: click → tag input, Enter adds tag, x removes
- All variants: focus ring, save animation, error rollback

**CAL-004: Inline editing for all columns**
- Wire EditableCell to each column in content table
- Status column → StatusDropdown variant
- Channel column → DropdownEdit with channel icons
- Owner column → AvatarDropdown
- Due Date column → DateEdit
- Campaign column → DropdownEdit (searchable)
- Tags column → TagEdit
- Title column → TextEdit

**CAL-005: Optimistic update pattern**
- Generic `useOptimisticUpdate` hook
- Local state updates immediately
- API call in background
- Rollback on error with toast notification
- Cell-level saving indicator

**CAL-006: BulkToolbar + multi-select**
- Checkbox on each row
- Shift+click for range selection
- Cmd/Ctrl+click for individual toggle
- Header checkbox for select-all-visible
- Floating toolbar appears with count + actions
- Actions: Change Status, Assign Owner, Move Dates, Add Tag, Delete, Duplicate

**CAL-008: ViewSwitcher**
- Segmented control: [Table] [Calendar] [Board] [Timeline]
- Persists user's last view in localStorage
- Each view is a separate component, lazy-loaded
- Transition animation between views (200ms fade)

**CAL-009: Calendar view**
- Month grid with content cards per day
- Cards show: channel icon, truncated title, status color
- Drag-and-drop between days (reschedules)
- Conflict warning (amber glow if 3+ on same channel same day)
- Click day → side panel with day's content (inline editable)
- Navigation: ← → month arrows, Today button
- Color-coded by channel

---

## 9. Acceptance Criteria

- [ ] Every cell in table view is editable inline (no modal required)
- [ ] Inline edits save instantly (optimistic UI, <100ms perceived)
- [ ] Multi-select works (checkbox, Shift+click, Cmd+click, select-all)
- [ ] Bulk toolbar appears with ≥1 selection, offers all bulk actions
- [ ] 4 views work: Table, Calendar (month), Board (Kanban), Timeline
- [ ] Drag-and-drop works in Calendar view (reschedule by dragging)
- [ ] Drag-and-drop works in Board view (change status by dragging)
- [ ] Cmd+K opens command palette for quick content creation
- [ ] AI Scheduling suggests optimal dates based on performance data
- [ ] AI Content Gap detection shows gap banner with suggestions
- [ ] Content Preview shows channel-specific rendering
- [ ] Saved views persist across sessions
- [ ] Filters are combinable and saveable
- [ ] Multi-user editing shows live updates (Supabase Realtime)
- [ ] All animations <300ms, page loads <2s
- [ ] Mobile responsive (table collapses to card list on mobile)
- [ ] Matches Notion/Linear aesthetic (clean, fast, no clunkiness)

---

*Next: Page 3 — Template & Asset Library (AI generation, bulk creation, drag-to-calendar)*
