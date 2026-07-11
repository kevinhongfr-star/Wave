# WAVE Business Spec — Page 2: Content Calendar (EXPANDED)

**Version:** 2.1 | **Date:** 2026-07-11 | **Status:** Draft for Kevin Review
**Supersedes:** 02_Content_Calendar.md (v2.0 — 15 tickets)
**Builds on:** TICKET-009 through TICKET-020 (existing — static grid, modal-only editing, basic status workflow)
**Gap tickets:** CAL-001 through CAL-042 (expanded from 15 to 42)

---

## 1. Purpose

The Content Calendar is the operational heart of WAVE. Every piece of content across every channel lives here — planned, created, reviewed, scheduled, published, and measured.

**Today's problem:** Static HTML table with 5 hardcoded rows. TICKET-009 adds a calendar grid (click opens modal). TICKET-010 adds modal-only creation. TICKET-011 adds basic status dropdown. Every action requires a modal. Zero AI. Zero bulk ops. Zero inline editing. Zero collaboration.

**What this spec delivers:** A Notion/Linear-grade content operations platform where:
- Every cell is editable inline (click, type, done — no modal)
- Bulk operations on 100+ items in seconds
- AI suggests optimal publish times and detects content gaps
- 4 views: Table, Calendar, Board, Timeline — all synced to same data
- Drag-and-drop between days, channels, statuses
- Preview content as it will appear on each channel before publishing
- Real-time collaboration (see who's editing what)
- Cmd+K command palette for instant creation
- Content quality scoring by AI before publishing
- Version history with rollback
- Comments and mentions per content piece
- Full keyboard navigation (power users never touch mouse)

---

## 2. Business Requirements

### 2.1 Multi-View System (4 views, same data)

| View | Purpose | Primary User | Key Interaction |
|------|---------|-------------|-----------------|
| **Table** | Dense data, inline editing, bulk ops | Echo (daily), Maria | Click cell → edit inline |
| **Calendar** (month) | Visual schedule, conflict spotting | Kevin (weekly plan), Carl | Drag card → reschedule |
| **Board** (Kanban) | Status workflow, bottleneck ID | Kevin (review), Echo | Drag card → change status |
| **Timeline** (Gantt) | Campaign timelines, series overlap | Kevin (quarterly) | Drag edge → extend dates |

**View sync:** All 4 views read from same Supabase tables. Switching views = switching the UI layer, not the data. Filters and selections persist across view switches.

**Default view per user:**
- Echo: Table (daily editing work)
- Kevin: Board (status overview) or Calendar (schedule check)
- Maria: Table (email content management)
- Carl: Calendar (event-adjacent content scheduling)

### 2.2 Table View — Inline Editing (Notion-grade)

**Every cell is editable. No modal required for any field.**

| Column | Edit Type | Interaction | Validation |
|--------|-----------|-------------|------------|
| **Checkbox** | Toggle | Click → select/deselect | — |
| **Title** | Text input | Click → select all text → type → Enter saves, Esc cancels | Required, max 200 chars |
| **Status** | Status pill dropdown | Click → dropdown appears → select → instant save | Must follow workflow (can't go backwards without confirmation) |
| **Type** | Icon dropdown | Click → dropdown with type icons → select | Required |
| **Channel** | Icon dropdown | Click → dropdown with channel icons + colors → select | Required |
| **Owner** | Avatar dropdown | Click → searchable dropdown with team avatars → select | Required |
| **Due Date** | Date picker | Click → calendar picker → select date → instant save | Required, must be ≥ today for new content |
| **Campaign** | Searchable dropdown | Click → type to search campaigns → select → instant link | Optional |
| **Priority** | Color dots (1-5) | Click → 5-dot selector → select | Default: 3 |
| **Tags** | Tag input | Click → type to add, click × to remove → instant save | Free-form, auto-suggest from existing tags |
| **Content Score** | Read-only badge | Hover → shows AI scoring breakdown | AI-computed, not user-editable |
| **Scheduled Time** | Time picker | Click → time dropdown (30min intervals) | Optional |

**Inline edit behavior (detailed):**
1. Click cell → cell enters edit mode (2px brand border, slight scale 1.01)
2. Text cells: all text auto-selected, start typing to replace
3. Dropdown cells: dropdown opens immediately on click
4. Date cells: date picker opens below cell (anchored, not centered modal)
5. **Enter** → saves, moves to cell below (like spreadsheet)
6. **Tab** → saves, moves to cell right
7. **Shift+Tab** → saves, moves to cell left
8. **Escape** → cancels, restores previous value
9. **Click outside** → saves and exits edit mode
10. **Visual feedback:** Saved cell shows subtle green border flash (200ms)
11. **Error feedback:** If save fails → red border flash + toast "Failed to save: [reason]" + value reverts

**Status workflow enforcement:**
```
Idea → Draft → In Review → Approved → Scheduled → Published
                                      ↘ Archived (from any status)

Backward moves require confirmation:
"In Review" → "Draft": "Move back to Draft? This will remove reviewer assignment."
"Approved" → "In Review": "Un-approve this content? It will need re-approval."
```

**Keyboard navigation (spreadsheet-style):**
- **Arrow keys** → move between cells (like Google Sheets)
- **Enter** → enter edit mode on current cell
- **Escape** → exit edit mode
- **Delete** → clear cell value (with undo)
- **Space** → toggle checkbox
- **Cmd+Enter** → save and create new row below

### 2.3 Bulk Operations (expanded)

**Selection modes:**

| Action | How | Visual |
|--------|-----|--------|
| Single select | Click checkbox | Row highlights blue |
| Range select | Shift+click checkbox | All rows between highlight |
| Toggle select | Cmd/Ctrl+click checkbox | Individual toggle |
| Select all visible | Click header checkbox | All filtered rows select |
| Select all (ignoring filter) | Click header checkbox twice | "Select all 147 items" banner appears |
| Deselect all | Click any non-row area, or Esc | Selection clears |

**Bulk toolbar (appears when ≥1 selected):**

```
┌─────────────────────────────────────────────────────────────────┐
│ 12 selected │ [Status ▾] [Owner ▾] [Move ▾] [Tag ▾] [Type ▾] │
│             │ [⧉ Duplicate] [🗑 Delete] [🤖 AI Schedule]       │
│             │ [Deselect all]                                    │
└─────────────────────────────────────────────────────────────────┘
```

**Bulk actions (detailed):**

| Action | Flow | Confirmation | Undo |
|--------|------|-------------|------|
| **Change Status** | Click → dropdown → select status | If backward: "Move 12 items back to Draft?" | Yes (undo toast 5s) |
| **Assign Owner** | Click → avatar dropdown → select | None | Yes |
| **Move Dates** | Click → date picker → "Move forward/back by X days" or "Set to specific date" | "Move 12 items from Jul 15 to Jul 18?" | Yes |
| **Add Tag** | Click → tag input → type tag → Enter | None | Yes (remove tag) |
| **Change Type** | Click → type dropdown → select | None | Yes |
| **Change Channel** | Click → channel dropdown → select | "Change 12 items to LinkedIn? Check for conflicts." | Yes |
| **Change Campaign** | Click → campaign dropdown → select | None | Yes |
| **Change Priority** | Click → priority dots → select | None | Yes |
| **Duplicate** | Click → "Duplicate 12 items as drafts?" | Yes | — |
| **Delete** | Click → "Delete 12 items? This is a soft delete." | Yes (type count to confirm if >5) | Yes (restore) |
| **AI Schedule** | Click → AI analyzes all selected, suggests optimal dates | "AI suggests moving 8/12 items to different dates. Apply?" | Yes |
| **Export Selected** | Click → downloads CSV of selected items only | None | — |
| **Approve All** | Click → "Approve 12 items?" (only if all in Review) | Yes | Yes |
| **Send to Review** | Click → "Move 12 items to In Review?" (only if all Draft) | Yes | Yes |

**Undo mechanism:**
- After bulk action, toast appears: "12 items updated. [Undo]" (5s)
- Clicking Undo reverts all items to previous state
- Undo stored in localStorage (session-based, cleared on refresh)

### 2.4 Content Creation (expanded)

**5 ways to create content:**

| Method | Trigger | Behavior |
|--------|---------|----------|
| **Inline new row** | Click "+ New row" at bottom, or Enter on last row, or `N` key | Empty row appears at bottom, focus on title cell |
| **Cmd+K quick create** | `Cmd+K` → type title → Enter | Creates as draft with today's date, then edit inline |
| **From template** | Click [+ From Template] or Cmd+K → "template: ..." | Template gallery → select → creates row with template fields pre-filled |
| **AI generate** | Click [+ AI Generate] or Cmd+K → "ai: ..." | AI content generation dialog → select output → creates row |
| **From campaign** | Campaign page → [Add Content] | Creates row with campaign pre-linked |

**Inline creation (detailed):**
1. Empty row appears (either at bottom or at clicked position)
2. Title cell auto-focused
3. User types title → Tab → selects type → Tab → selects channel → Tab → selects owner → Tab → picks date
4. Each field saves on Tab/Enter
5. Row persists even if only title filled (status = Draft, no date = unscheduled)
6. If user clicks away without filling required fields → row stays as draft with warning badge "Missing: channel, date"

**AI Content Generation (detailed):**

```
┌─────────────────────────────────────────────────────────────────┐
│ Generate Content with AI                          [×]           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ What do you need?                                               │
│ ┌───────────────────────────────────────────────────────────┐  │
│ │ A LinkedIn post about BRIDGE diagnostic intelligence...   │  │
│ └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│ Channel: [LinkedIn ▾]    Type: [Post ▾]    Tone: [Professional ▾]│
│ Product: [BRIDGE ▾]     Cluster: [CHRO ▾]                      │
│                                                                 │
│ [Generate]                                                       │
│                                                                 │
│ ─── Generated Output ───                                        │
│                                                                 │
│ Title: "Why 73% of Executive Assessments Miss the Mark"         │
│                                                                 │
│ Body:                                                           │
│ Most leadership assessments measure what's easy to measure...   │
│ [Full text here...]                                             │
│                                                                 │
│ [✓ Use this] [↻ Regenerate] [✏ Edit before using]              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**AI generation options:**
- Generate 3 variants → user picks best
- Generate for multiple channels at once (LinkedIn post + Email blurb + Blog outline from one prompt)
- Adjust length (short/medium/long)
- Adjust tone (professional/conversational/authoritative/storytelling)

### 2.5 Calendar View (expanded)

**Month grid with content cards:**

```
┌─────────────────────────────────────────────────────────────────┐
│ ← July 2026 →                              [Today] [Month ▾]   │
├──────┬──────┬──────┬──────┬──────┬──────┬──────────────────────┤
│ Mon  │ Tue  │ Wed  │ Thu  │ Fri  │ Sat  │ Sun                  │
├──────┼──────┼──────┼──────┼──────┼──────┼──────────────────────┤
│      │      │ 1    │ 2    │ 3    │ 4    │ 5                    │
│      │      │      │      │      │      │                      │
├──────┼──────┼──────┼──────┼──────┼──────┼──────────────────────┤
│ 6    │ 7    │ 8    │ 9    │ 10   │ 11   │ 12                   │
│ 🔗   │ 🔗   │ 🔗📧│ 🔗   │ 🔗📝│      │ 📧                   │
│Echo  │Echo  │Echo  │Maria │Echo  │      │Maria                 │
│      │      │⚠️Maria│      │Xuemei│      │                      │
├──────┼──────┼──────┼──────┼──────┼──────┼──────────────────────┤
│ 13   │ 14   │ 15   │ 16   │ 17   │ 18   │ 19                   │
│ 📝   │ 🔗📝│ 🔗📝│ 📧   │ 🔗   │ 🔗🎙│                      │
│Xuemei│Echo  │Xuemei│Maria │Echo  │Echo  │                      │
│      │Vanj. │Carl  │      │      │Carl  │                      │
├──────┼──────┼──────┼──────┼──────┼──────┼──────────────────────┤
│ 20   │ 21   │ 22   │ 23   │ 24   │ 25   │ 26                   │
│      │      │      │      │      │      │                      │
├──────┼──────┼──────┼──────┼──────┼──────┼──────────────────────┤
│ 27   │ 28   │ 29   │ 30   │ 31   │      │                      │
│      │      │      │      │      │      │                      │
└──────┴──────┴──────┴──────┴──────┴──────┴──────────────────────┘

🔗 LinkedIn/Social  📧 Email  📝 Blog/Article  🎙 Podcast  🎥 Video
⚠️ = conflict (2+ same channel same day)
```

**Card design (on calendar):**
- Height: proportional to content count in that day
- Shows: channel icon (color), truncated title (1 line), owner avatar
- Status indicated by border color (draft=amber, review=blue, approved=green, published=green-bright)
- Overdue: red left border
- Hover: tooltip with full title, owner, status, scheduled time

**Drag-and-drop (detailed):**
1. Click and hold card → card lifts (box-shadow, scale 1.03, opacity 0.9)
2. Drag to target day → target day highlights (light blue background)
3. If target has conflict (3+ same channel) → target shows amber border + tooltip "3 LinkedIn posts on this day"
4. Drop → card animates to new position → Supabase update → toast: "Moved to Jul 15. [Undo]"
5. Drop outside calendar → cancels (card returns to original position)

**Day detail (click on day):**
- Side panel slides in from right
- Shows all content for that day, sorted by time
- Each item is inline editable (same as table view)
- [+ Add content for this day] button at bottom

**Navigation:**
- ← → arrows: previous/next month
- Today button: jump to current month
- Month/Week toggle (week view shows 7-day columns with hourly rows)

### 2.6 Board View (Kanban) (expanded)

```
┌────────────┬────────────┬────────────┬────────────┬────────────┬──────────┐
│   Idea     │   Draft    │  In Review │  Approved  │ Scheduled  │ Published│
│    (5)     │    (12)    │    (3)     │    (8)     │    (6)     │  (119)   │
│            │            │            │            │            │          │
│ ┌────────┐ │ ┌────────┐ │ ┌────────┐ │ ┌────────┐ │ ┌────────┐│ ┌──────┐│
│ │Cross-  │ │ │Diagnos-│ │ │Q3 News-│ │ │AI Lead-│ │ │Webinar ││ │5 tips││
│ │Cultural│ │ │tic Int.│ │ │letter  │ │ │ership  │ │ │Recap   ││ │for Q3││
│ │Webinar │ │ │Blog    │ │ │        │ │ │        │ │ │        ││ │      ││
│ │Recap   │ │ │Xuemei  │ │ │Maria   │ │ │Echo    │ │ │Carl    ││ │Echo  ││
│ │Carl    │ │ │Jul 15  │ │ │Jul 12  │ │ │Jul 10  │ │ │Jul 20  ││ │Jul 8 ││
│ │P3 ●●●○○│ │ │P2 ●●●○○│ │ │P1 ●●●●●│ │ │P1 ●●●●○│ │ │P1 ●●●●●││ │      ││
│ │BRIDGE  │ │ │BRIDGE  │ │ │        │ │ │        │ │ │🔗LI    ││ │      ││
│ │🔗LI    │ │ │📝Blog  │ │ │        │ │ │        │ │ │        ││ │      ││
│ └────────┘ │ └────────┘ │ └────────┘ │ └────────┘ │ └────────┘│ └──────┘│
│ ┌────────┐ │ ┌────────┐ │            │ ┌────────┐ │ ┌────────┐│          │
│ │AI Lead-│ │ │Podcast │ │            │ │Case    │ │ │Podcast ││          │
│ │ership  │ │ │Ep.3    │ │            │ │Study   │ │ │Ep.3    ││          │
│ │Princi- │ │ │Promo   │ │            │ │v2      │ │ │Promo   ││          │
│ │ples    │ │ │Vanj.   │ │            │ │Xuemei  │ │ │        ││          │
│ └────────┘ │ └────────┘ │            │ └────────┘ │ └────────┘│          │
│            │            │            │            │            │          │
│ [+ Add]    │ [+ Add]    │ [+ Add]    │ [+ Add]    │ [+ Add]    │          │
└────────────┴────────────┴────────────┴────────────┴────────────┴──────────┘
```

**Card content:**
- Title (truncated to 2 lines)
- Channel icon + color
- Owner avatar
- Due date (relative: "in 3 days" or "Jul 15")
- Priority dots (1-5)
- Campaign tag (if linked)
- Content score badge (if scored)
- Overdue: red top border

**Card interactions:**
- Click → card expands inline (accordion, shows more detail: full description, tags, comments count)
- Double-click → navigates to full content detail page
- Drag to another column → status changes (with workflow enforcement)
- Right-click → context menu: [Edit] [Duplicate] [Move to...] [Delete] [AI Score] [Preview]

**Column features:**
- Column header: status name + count + WIP limit indicator
- WIP limits: configurable per column (e.g., "In Review" max 5) — shows warning when exceeded
- [+ Add] at bottom of each column → creates new card in that status
- Column collapse: click header → collapses to thin strip (to focus on other columns)

**Swim lanes (optional):**
- Toggle: group cards within columns by channel, owner, or campaign
- E.g., "In Review" column shows sub-rows: LinkedIn, Email, Blog, Podcast

### 2.7 Timeline View (Gantt-like)

```
┌─────────────────────────────────────────────────────────────────┐
│ Timeline: All Content                              [Week ▾] [→] │
├──────────┬──────────────────────────────────────────────────────┤
│          │ Jul 7   Jul 14   Jul 21   Jul 28   Aug 4            │
│          │ ═══════╪══════════╪══════════╪══════════╪══         │
├──────────┼──────────────────────────────────────────────────────┤
│ BRIDGE   │                                                      │
│ Push     │ ░░░░░░████████████████░░░░░░░░░░░░░░░░░░░           │
│          │  12 content pieces across 4 weeks                    │
├──────────┼──────────────────────────────────────────────────────┤
│ Gravitas │                                                      │
│ Shift    │       ░░░░░░░░████████████████████░░░░░░            │
│          │       10 pieces (5 published, 5 in progress)        │
├──────────┼──────────────────────────────────────────────────────┤
│ Summit   │                                                      │
│ Promo    │ ████████████████████████████                          │
│          │ 8 pieces (7 published, 1 scheduled)                  │
├──────────┼──────────────────────────────────────────────────────┤
│ LinkedIn │ 🔗──🔗──🔗──🔗──🔗──🔗──🔗──                        │
│ (Echo)   │ M   W   F   M   W   F   M                           │
├──────────┼──────────────────────────────────────────────────────┤
│ Email    │    📧──────📧──────📧──────                          │
│ (Maria)  │    Tue     Tue     Tue                               │
├──────────┼──────────────────────────────────────────────────────┤
│ Podcast  │         🎙──────────🎙──────                          │
│ (Carl)   │         Ep.3        Ep.4                             │
└──────────┴──────────────────────────────────────────────────────┘

░░░ = planned/draft  ████████ = scheduled/published  ─── = time span
```

**Features:**
- Group by: Campaign (default), Channel, Owner, Product
- Zoom: Day / Week / Month
- Drag bar edge → extend/shorten content date range
- Drag bar → move entire content block to different dates
- Dependencies: draw arrows between related content (e.g., blog → LinkedIn post → email)
- Milestones: mark key dates (event date, campaign deadline)
- Critical path highlight: shows which content blocks, if delayed, would impact campaign deadline

### 2.8 Content Preview (expanded)

**Side panel preview for each channel:**

| Channel | Preview Layout | What's Shown |
|---------|---------------|--------------|
| **LinkedIn** | LinkedIn post card mockup | Profile pic, name (Kevin Hong), headline, post text, hashtags, like/comment/share buttons (static), engagement estimate |
| **Email** | Email client mockup | From: line, subject, preview text, body rendered in email HTML style, CTA button preview, unsubscribe footer |
| **Blog/Website** | Browser mockup | URL bar (lyc-partners.com/blog/...), page title, hero image placeholder, body text rendered, author bio, related posts sidebar |
| **Podcast** | Podcast player mockup | Album art, episode title, description, play button, duration, platform links (Spotify, Apple) |
| **YouTube** | YouTube thumbnail mockup | 16:9 thumbnail area, video title, description, tags, channel info |

**Preview interactions:**
- Click [Preview] on any content row → side panel slides in
- Toggle between channels (if content is planned for multiple)
- [Copy text] button → copies formatted text to clipboard
- [Edit in preview] → minor edits possible in preview mode (title, hashtags)
- AI suggestion bar at bottom: "Consider adding 3-5 hashtags for LinkedIn" or "Subject line could be punchier: [suggestion]"

### 2.9 Content Gap Detection & AI Suggestions (expanded)

**Gap detection runs daily, produces banner:**

```
┌─────────────────────────────────────────────────────────────────┐
│ 💡 Content Intelligence                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ GAPS DETECTED:                                                  │
│ • No BRIDGE content in 18 days (target: 3/week)     [Fix →]   │
│ • No podcast content scheduled for next 2 weeks     [Fix →]   │
│ • SHIFT-DRIVE has 0 content pieces in July          [Fix →]   │
│ • Newsletter open rate declining (42% → 35%)        [Fix →]   │
│                                                                 │
│ SUGGESTIONS:                                                    │
│ • Tue/Thu 8-9am LinkedIn posts get 2.4x engagement  [Apply]   │
│ • "Executive Assessment" topic trending in your sector [Use]   │
│ • Repurpose webinar recording into 4 LinkedIn posts  [Create]  │
│                                                                 │
│ [Auto-fill all gaps with AI] [Dismiss all] [Settings]           │
└─────────────────────────────────────────────────────────────────┘
```

**[Fix →] per gap:** Opens inline creation with AI-suggested content (pre-filled title, type, channel, suggested date)
**[Apply]:** AI reschedules affected content to suggested times
**[Use]:** Creates new content from AI suggestion
**[Create]:** AI generates derivative content from existing source (e.g., webinar → 4 social posts)
**[Auto-fill all gaps]:** AI creates + schedules content for all detected gaps (requires review before publishing)

### 2.10 Content Relationships & Derivatives

**Visual derivative flow (inline, not separate page):**

```
Content Detail Panel:
┌─────────────────────────────────────────────────────────────────┐
│ Source: "Executive Assessment ROI" (Blog, Published Jul 5)     │
│                                                                 │
│ Derivatives:                                                    │
│ ├── 🔗 LinkedIn post "3 Signs Your Assessment Is Wrong" (Jul 7)│
│ ├── 🔗 LinkedIn post "Why Surveys Fail Leaders" (Jul 10)       │
│ ├── 📧 Email blurb in Newsletter #12 (Jul 12)                  │
│ └── 🎙 Podcast Ep.2 mention (Jul 15)                           │
│                                                                 │
│ [+ Create derivative] [View flow diagram]                       │
└─────────────────────────────────────────────────────────────────┘
```

**Relationship types:**
- Source → Derivative (content spawned from another piece)
- Series (content part of a series: "Leadership Principles" Part 1, 2, 3)
- Campaign link (content linked to campaign)
- Event link (content promoting or recapping an event)
- Template origin (content created from template)

### 2.11 Version History & Rollback

**Every content piece tracks changes:**

```
Version History Panel:
┌─────────────────────────────────────────────────────────────────┐
│ Version History: "AI in Leadership: 5 Principles"              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ v3 — Current                    Echo — Jul 10, 14:30           │
│ Status: Published                                               │
│ Changed: status (Approved → Published)                          │
│                                              [View] [Restore]   │
│                                                                 │
│ v2                            Echo — Jul 10, 09:15             │
│ Status: Approved                                                │
│ Changed: body text (added section 5), title (minor edit)        │
│                                              [View] [Restore]   │
│                                                                 │
│ v1                            Echo — Jul 8, 16:00              │
│ Status: Draft                                                   │
│ Created from template "LinkedIn Post - Thought Leadership"      │
│                                              [View] [Restore]   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Version tracking:**
- Auto-saves version on every status change
- Auto-saves version on significant text edits (>20% change)
- Manual save version: [Save version] button in content detail
- Restore: click [Restore] → confirms → creates new version from old content
- Diff view: see what changed between versions (highlighted additions/deletions)

### 2.12 Comments & Mentions

**Per-content comment thread:**

```
┌─────────────────────────────────────────────────────────────────┐
│ Comments (3)                                     [Add comment]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Kevin — Jul 9, 10:30                                           │
│ "Can we add a specific data point about assessment ROI?"        │
│                                                        [Reply]  │
│                                                                 │
│   Echo — Jul 9, 11:00                                          │
│   "Added in v2. Also included BRIDGE case study numbers."       │
│                                                        [Reply]  │
│                                                                 │
│ Maria — Jul 10, 08:00                                          │
│ "@Kevin should we also send this as an email blurb?"            │
│                                                        [Reply]  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- @mentions team members (triggers notification)
- Thread replies (nested 1 level)
- Resolve comment (marks as resolved, collapses)
- Comment on specific text (select text → comment appears anchored to it)
- AI comments: AI can auto-comment with suggestions ("Consider adding CTA", "Title could be more specific")

### 2.13 Filtering, Sorting & Saved Views (expanded)

**Filter bar (combinable):**

```
┌─────────────────────────────────────────────────────────────────┐
│ [Status ▾] [Channel ▾] [Owner ▾] [Campaign ▾] [Product ▾]    │
│ [Date range ▾] [Priority ▾] [Tags ▾] [Content Score ▾]       │
│                                                                  │
│ Active filters: Status = Draft, Owner = Echo       [Clear all]  │
└─────────────────────────────────────────────────────────────────┘
```

**Filter types:**
| Filter | Options | Multi-select |
|--------|---------|-------------|
| Status | Idea, Draft, In Review, Approved, Scheduled, Published | Yes |
| Channel | LinkedIn, Email, Blog, Podcast, YouTube, Social, Website | Yes |
| Owner | Echo, Maria, Carl, Xuemei, Vanjulla, Kevin, Valentina | Yes |
| Campaign | All campaigns (searchable) | Yes |
| Product | SPARK, BRIDGE, MOSAIC, FORGE, SHIFT-QUEST, SHIFT-LEAP, SHIFT-DRIVE, Advisory, Coaching, Signal Council, Intelligence | Yes |
| Cluster | CHRO, CEO, PE Partner, VP/Director, All | Yes |
| Date range | Date picker (from/to) + presets: Today, This Week, This Month, Overdue, Next 7 days | No |
| Priority | 1-5 dots | Yes |
| Tags | All existing tags (searchable, auto-suggest) | Yes |
| Content Score | Range slider 0-100 | No |
| Has derivative | Yes/No/Only sources/Only derivatives | No |

**Sorting:**
- Click column header → sort ascending → click again → descending
- Multi-sort: Shift+click additional columns
- Default: Due date ASC, Priority DESC
- Sort options: Title, Status, Channel, Owner, Due Date, Campaign, Priority, Content Score, Created Date, Last Modified

**Saved Views:**
- [Save view] button → names current filter + sort + visible columns
- Views appear as tabs: [All] [This Week] [My Content] [Needs Review] [Overdue] [+ Save]
- Views are per-user, stored in `saved_views` table
- Share view: generate URL with filter params → anyone with link sees same view
- View templates: system-provided views (e.g., "Content Ready to Publish", "Needs AI Score")

### 2.14 Import/Export & Integrations

| Feature | Format | Details |
|---------|--------|---------|
| Export CSV | .csv | All visible columns, respects filters, includes content body |
| Export JSON | .json | Full data export for backup/migration |
| Import CSV | .csv | Map columns to fields, validate, preview before import |
| Google Calendar sync | 2-way | Content scheduled dates sync to Google Calendar as events |
| Outlook Calendar sync | 2-way | Same for Outlook |
| Zapier/Make webhook | Outbound | Webhook on content status change (for external tools) |
| RSS feed | Outbound | Published content generates RSS feed entry |

### 2.15 Content Scheduling & Publishing Workflow

**Scheduling states:**

```
Content Lifecycle:
Idea → Draft → In Review → Approved → Scheduled → Publishing → Published → Archived
                                                ↘ Cancelled (from any pre-published state)

Publishing flow:
1. Status = "Scheduled" (date/time set)
2. At scheduled time → status auto-changes to "Publishing"
3. Agent (Echo/NEXUS) publishes to channel
4. Status → "Published" + published_url recorded
5. After 48h → performance_data auto-populated (engagement metrics)
6. If publish fails → status reverts to "Scheduled" + error logged + action_feed item created
```

**Scheduling rules:**
- Cannot schedule in the past (unless back-dating for record-keeping)
- Conflict warning: 2+ pieces on same channel same day → amber warning (user can override)
- Hard conflict: 3+ on same channel same day → red warning, requires confirmation
- AI auto-scheduling respects all conflict rules

---

## 3. User Requirements

| User | What They Need | Priority |
|------|---------------|----------|
| **Kevin** | See all content at a glance, spot gaps, approve inline, AI scheduling, campaign timeline | P0 |
| **Echo** | Plan weekly content, create quickly, see conflicts, bulk schedule, preview before publish | P0 |
| **Maria** | See email content schedule, link to sequences, preview email rendering, bulk edit | P0 |
| **Carl** | See webinar/podcast schedule, registration content, preview podcast pages | P1 |
| **Valentina** | See what's ready for website, content status for deployment | P1 |
| **Vanjulla** | See podcast content, promo schedule, episode tracking | P1 |
| **Xuemei** | See assigned content, deadlines, submit for review | P1 |
| **NEXUS** | Content status data for AI briefs, pipeline metrics, gap detection | P1 |

---

## 4. UX Requirements (Notion/Linear-grade)

### 4.1 Complete Table View Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Content Calendar                              🔍 [Filter ▾] [⚙]│
├─────────────────────────────────────────────────────────────────┤
│ 💡 4 content gaps detected • 3 AI suggestions ready            │
│    [View intelligence] [Dismiss]                                │
├─────────────────────────────────────────────────────────────────┤
│ [All] [This Week] [My Content] [Needs Review] [Overdue] [+ ▾] │
├─────────────────────────────────────────────────────────────────┤
│ [Table] [Calendar] [Board] [Timeline]      [🤖 AI] [+ New] [⬇]│
├─────────────────────────────────────────────────────────────────┤
│ Status    │ Type │ Title         │ Ch  │ Owner │ Due    │ Camp  │
│───────────┼──────┼───────────────┼═════┼═══════┼════════┼═══════│
│ ●Draft    │ 📝   │ Diagnostic... │ Blog│ Xuemei│ Jul 15 │BRIDGE │
│ ●Review   │ 📧   │ Q3 Newsletter │Email│ Maria │ Jul 12 │ —     │
│ ●Scheduled│ 🔗   │ AI Leader...  │ LI  │ Echo  │ Jul 14 │ —     │
│ ●Published│ 🔗   │ 5 Principles  │ LI  │ Echo  │ Jul 10 │SHIFT  │
│ ●Idea     │ 🎙   │ Cross-Cult..  │ Pod │ Carl  │ Jul 18 │ —     │
│           │      │ + New row     │     │       │        │       │
├─────────────────────────────────────────────────────────────────┤
│ 147 pieces │ 5 shown │ Page 1/15 │ [←] [→]    Showing: All    │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Content Detail Panel (slides from right)

```
┌──────────────────────────────────────┐
│ [← Back]          [Preview] [⋯ More]│
├──────────────────────────────────────┤
│                                      │
│ AI in Leadership: 5 Principles       │
│ ●Published │ 🔗 LinkedIn │ Echo     │
│ Jul 10, 2026 │ SHIFT-QUEST           │
│                                      │
│ ─── Content ───                      │
│ [Edit inline] [AI Score: 87/100]    │
│                                      │
│ Leadership isn't about having all... │
│ [Full content body here]             │
│                                      │
│ ─── Metadata ───                     │
│ Tags: leadership, principles, AI     │
│ Campaign: SHIFT-Quest Launch         │
│ Priority: ●●●●○ (4)                  │
│ Source: Original                      │
│ Derivatives: 3 pieces                 │
│                                      │
│ ─── Schedule ───                     │
│ Scheduled: Jul 10, 09:00             │
│ Published: Jul 10, 09:02             │
│ URL: linkedin.com/posts/...          │
│ Performance: 347 engagements, 23 ... │
│                                      │
│ ─── Versions ───                     │
│ v3 (current) — Echo, Jul 10          │
│ v2 — Echo, Jul 9                     │
│ v1 — Echo, Jul 8                     │
│                                      │
│ ─── Comments (3) ───                 │
│ Kevin: "Add data point..."           │
│ Echo: "Added in v2..."               │
│ Maria: "Email blurb too?"            │
│ [Add comment...]                     │
│                                      │
│ ─── AI Suggestions ───               │
│ • Consider adding CTA for webinar    │
│ • Hashtags could be more targeted    │
│ [Apply all] [Dismiss]                │
│                                      │
└──────────────────────────────────────┘
```

### 4.3 Keyboard Shortcuts (full map)

| Shortcut | Action | Context |
|----------|--------|---------|
| `N` | New content row | Calendar page |
| `Cmd+K` / `Ctrl+K` | Command palette | Global |
| `/` | Focus search | Global |
| `Enter` | Edit selected cell | Table view |
| `Escape` | Cancel edit / close panel | Any |
| `Tab` | Next cell (save current) | Editing |
| `Shift+Tab` | Previous cell (save current) | Editing |
| `↑↓←→` | Navigate cells | Table view |
| `Space` | Toggle checkbox | Table view |
| `Delete` | Clear cell / soft delete selected | Table view |
| `Cmd+Z` / `Ctrl+Z` | Undo last action | Global |
| `Cmd+Shift+Z` | Redo | Global |
| `Cmd+A` | Select all visible | Table view |
| `Cmd+D` | Duplicate selected | Table view |
| `Cmd+Enter` | Save + new row below | Editing |
| `Cmd+S` | Save view | Filter bar |
| `1` | Switch to Table view | Calendar page |
| `2` | Switch to Calendar view | Calendar page |
| `3` | Switch to Board view | Calendar page |
| `4` | Switch to Timeline view | Calendar page |
| `F` | Toggle filters | Calendar page |
| `?` | Show keyboard shortcuts | Global |

### 4.4 Empty States

| State | Message | CTA |
|-------|---------|-----|
| No content at all | "No content yet. Start planning your content calendar." | [+ Create first piece] |
| No content in filter | "No content matches these filters." | [Clear filters] [+ Create anyway] |
| No campaigns | "No campaigns created yet." | [+ Create campaign] |
| No content for today | "Nothing scheduled for today." | [+ Schedule something] |
| Calendar view, empty month | "No content scheduled this month." | [+ Add content] [View as Table] |
| Loading | Skeleton animation matching layout | — |
| Error loading | "Failed to load content. Check your connection." | [Retry] |

---

## 5. Design Requirements

### 5.1 Table Column Specifications

| Column | Min Width | Default Width | Max Width | Resizable | Sortable |
|--------|-----------|---------------|-----------|-----------|----------|
| Checkbox | 32px | 32px | 32px | No | No |
| Status | 80px | 100px | 120px | Yes | Yes |
| Type | 60px | 80px | 100px | Yes | Yes |
| Title | 150px | 300px | flex | Yes | Yes |
| Channel | 80px | 120px | 150px | Yes | Yes |
| Owner | 80px | 100px | 120px | Yes | Yes |
| Due Date | 80px | 100px | 120px | Yes | Yes |
| Campaign | 100px | 150px | 200px | Yes | Yes |
| Priority | 60px | 80px | 100px | Yes | Yes |
| Tags | 100px | 200px | 300px | Yes | No |
| Score | 50px | 60px | 80px | Yes | Yes |

### 5.2 Channel Visual System

| Channel | Icon | Color | Badge Background |
|---------|------|-------|-----------------|
| LinkedIn | 🔗 | #0A66C2 | rgba(10,102,194,0.1) |
| Email | 📧 | #C108AB | rgba(193,8,171,0.1) |
| Blog | 📝 | #059669 | rgba(5,150,105,0.1) |
| Podcast | 🎙 | #7C3AED | rgba(124,58,237,0.1) |
| YouTube | 🎥 | #DC2626 | rgba(220,38,38,0.1) |
| Website | 🌐 | #2563EB | rgba(37,99,235,0.1) |
| Social | 📱 | #D97706 | rgba(217,119,6,0.1) |

### 5.3 Content Type Visual System

| Type | Icon | Used For |
|------|------|----------|
| Post | 📄 | LinkedIn posts, social posts |
| Article | 📝 | Blog posts, articles |
| Newsletter | 📧 | Email newsletters |
| Episode | 🎙 | Podcast episodes |
| Video | 🎥 | YouTube videos |
| Promo | 📣 | Event promotions |
| Case Study | 📊 | Case studies, whitepapers |
| Template | 📋 | Templates |

### 5.4 Animation Specification

| Interaction | Animation | Duration |
|-------------|-----------|----------|
| Cell enter edit mode | Border appears + slight scale | 150ms |
| Cell save success | Green border flash | 200ms |
| Cell save error | Red border flash + shake | 300ms |
| Row select | Checkbox scale + row background | 150ms |
| Bulk toolbar appear | Slide down from top + fade | 200ms |
| View switch | Fade out old + fade in new | 200ms |
| Calendar card drag | Lift (shadow) + ghost preview | 150ms |
| Board card drag | Lift + column highlight | 150ms |
| Side panel open | Slide from right | 250ms |
| Command palette open | Scale from 95% + fade | 150ms |
| Filter apply | Rows fade out/in | 150ms |
| New row insert | Slide in from top | 200ms |
| AI suggestion banner | Slide down | 200ms |
| Toast notification | Slide from right | 200ms |

---

## 6. Technical Backend Wiring

### 6.1 Supabase Schema (expanded)

```sql
-- Extended content_assets (add to CAL-001)
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS priority INT DEFAULT 3 CHECK (priority BETWEEN 1 AND 5);
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS content_body TEXT;
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS preview_data JSONB;
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS performance_data JSONB;
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS content_score FLOAT CHECK (content_score BETWEEN 0 AND 100);
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS ai_score_breakdown JSONB;
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS source_asset_id UUID REFERENCES content_assets(id);
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS series_name TEXT;
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS series_order INT;
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS related_event_id UUID;
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS template_id UUID;
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS published_url TEXT;
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS version INT DEFAULT 1;
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS parent_id UUID;  -- for duplicate tracking

-- Content schedule (separate from asset definition)
CREATE TABLE IF NOT EXISTS content_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES content_assets(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  channel TEXT NOT NULL,
  published_url TEXT,
  published_at TIMESTAMPTZ,
  publish_error TEXT,
  actual_performance JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content versions (history tracking)
CREATE TABLE IF NOT EXISTS content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES content_assets(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  title TEXT,
  content_body TEXT,
  status TEXT,
  changed_by TEXT,
  changed_fields TEXT[],  -- which fields changed
  diff_snapshot JSONB,  -- what changed
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_versions_asset ON content_versions(asset_id, version_number DESC);

-- Content comments
CREATE TABLE IF NOT EXISTS content_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES content_assets(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES content_comments(id),  -- for replies
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  mention_users TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_comments_asset ON content_comments(asset_id, created_at);

-- Saved views
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
  is_shared BOOLEAN DEFAULT FALSE,
  share_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content gaps (AI-detected)
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
  ai_suggestion TEXT,
  ai_suggested_content JSONB  -- pre-filled content for quick creation
);

-- Content edit activity (for real-time collaboration)
CREATE TABLE IF NOT EXISTS content_edit_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES content_assets(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  field TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);
CREATE INDEX idx_edit_activity_asset ON content_edit_activity(asset_id) WHERE ended_at IS NULL;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_assets_tags ON content_assets USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_content_assets_campaign ON content_assets(campaign_id);
CREATE INDEX IF NOT EXISTS idx_content_assets_series ON content_assets(series_name) WHERE series_name IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_content_schedule_date ON content_schedule(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_content_schedule_channel_date ON content_schedule(channel, scheduled_date);
```

### 6.2 API Routes (expanded)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/content` | GET | List content (filters, sort, pagination) |
| `/api/content` | POST | Create content asset |
| `/api/content/[id]` | GET | Get single content with all details |
| `/api/content/[id]` | PATCH | Update content (inline edit) |
| `/api/content/[id]` | DELETE | Soft delete content |
| `/api/content/[id]/versions` | GET | Version history for content |
| `/api/content/[id]/versions/[v]` | GET | Get specific version |
| `/api/content/[id]/restore` | POST | Restore to previous version |
| `/api/content/[id]/comments` | GET | Comments thread |
| `/api/content/[id]/comments` | POST | Add comment |
| `/api/content/[id]/comments/[c]` | PATCH | Resolve/edit comment |
| `/api/content/[id]/score` | POST | Trigger AI content scoring |
| `/api/content/[id]/preview` | GET | Generate channel preview |
| `/api/content/[id]/derivatives` | GET | Get derivative content |
| `/api/content/bulk` | PATCH | Bulk update (status, owner, date, tags, etc.) |
| `/api/content/bulk` | POST | Bulk duplicate |
| `/api/content/bulk/delete` | POST | Bulk soft delete |
| `/api/content/bulk/ai-schedule` | POST | AI auto-schedule selected items |
| `/api/content/generate` | POST | AI content generation |
| `/api/content/gaps` | GET | Get content gaps |
| `/api/content/gaps/fix` | POST | AI auto-fill gaps |
| `/api/content/conflicts` | POST | Check scheduling conflicts |
| `/api/content/export` | GET | Export as CSV/JSON |
| `/api/content/import` | POST | Import from CSV |
| `/api/content/views` | GET | Get user's saved views |
| `/api/content/views` | POST | Save new view |
| `/api/content/views/[id]` | PATCH | Update saved view |
| `/api/content/views/[id]` | DELETE | Delete saved view |
| `/api/content/activity` | GET | Get current edit activity (who's editing what) |
| `/api/content/activity` | POST | Report edit activity (for collaboration) |
| `/api/calendar/sync` | POST | Sync to Google/Outlook Calendar |
| `/api/calendar/sync/status` | GET | Calendar sync status |

### 6.3 Supabase Realtime

```typescript
// 1. Content changes (inline editing, multi-user)
supabase
  .channel('content-calendar')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'content_assets' },
    (payload) => {
      // Update local state
      // If different user edited: show "Echo just edited 'Q3 Newsletter'" toast
      // Highlight changed row briefly (blue flash, 500ms)
    }
  )
  .subscribe()

// 2. Edit activity (live cursors / who's editing)
supabase
  .channel('content-edit-activity')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'content_edit_activity' },
    (payload) => {
      // Show avatar indicator on the row being edited by another user
      // "Echo is editing this row" tooltip on hover
    }
  )
  .subscribe()

// 3. New comments
supabase
  .channel('content-comments')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'content_comments' },
    (payload) => {
      // Update comment count badge on content row
      // If user mentioned: show notification
    }
  )
  .subscribe()

// 4. Schedule changes (drag-and-drop reschedule)
supabase
  .channel('content-schedule')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'content_schedule' },
    (payload) => {
      // Update calendar view in real-time
      // Update conflict detection
    }
  )
  .subscribe()
```

### 6.4 Performance Optimization

| Technique | Implementation |
|-----------|---------------|
| **Virtual scrolling** | Table uses react-window or @tanstack/virtual — only renders visible rows (handles 1000+ rows smoothly) |
| **Lazy loading views** | Calendar, Board, Timeline components are lazy-loaded (React.lazy) |
| **Debounced inline edits** | Text input debounced 500ms before API call (not every keystroke) |
| **Optimistic updates** | All inline edits update UI immediately, API in background |
| **Pagination** | Table paginates at 50 rows per page (cursor-based) |
| **Query caching** | React Query with stale-while-revalidate strategy |
| **Image lazy loading** | Preview images lazy-loaded when panel opens |
| **Bundle splitting** | Each view is a separate chunk (code splitting by route) |

---

## 7. AI Layer Specification

### 7.1 AI Content Generation Persona

```yaml
name: "LYC Content Creator"
role: "Generate high-quality content for LYC Partners channels"
model: deepseek-chat (pro for long-form, flash for short)
temperature: 0.6
max_tokens: 2000 (long-form), 500 (short-form)

system_prompt: |
  You are LYC Partners' senior content creator.
  Write in Kevin Hong's voice: authoritative, data-driven, concise.
  
  RULES:
  - Never use corporate jargon or buzzwords
  - Lead with insight, not introduction
  - Use specific numbers and examples
  - Match the channel's format:
    - LinkedIn: 150-300 words, hook in first line, line breaks, 3-5 hashtags
    - Email: Subject line + preview text + body, clear CTA
    - Blog: 800-1500 words, structured with headers, data-backed
    - Podcast: Episode description, 100-200 words, intriguing
  - Always include a CTA relevant to the product/cluster
  - Reference LYC products naturally (not forced)
  
  TARGET PERSONAS:
  - CHRO: cares about assessment validity, leadership development ROI
  - CEO: cares about strategic advantage, organizational performance
  - PE Partner: cares about portfolio company leadership quality
  - VP/Director: cares about practical tools, team performance
  
  OUTPUT: Return structured JSON { title, body, hashtags[], cta, suggested_image_description }
```

### 7.2 AI Content Scoring Persona

```yaml
name: "Content Quality Analyst"
role: "Score content quality before publishing"
model: deepseek-chat (flash)
temperature: 0.2
max_tokens: 300

system_prompt: |
  Score the content on 5 criteria (0-20 each, total 0-100):
  
  1. TITLE_CLARITY: Is the title specific, compelling, and clear?
  2. AUDIENCE_FIT: Does it match the target persona/cluster?
  3. TIMING_RELEVANCE: Is it timely? Tied to current events/campaigns?
  4. CHANNEL_OPTIMIZATION: Is it formatted correctly for the target channel?
  5. ACTIONABILITY: Does it drive a clear next step for the reader?
  
  OUTPUT FORMAT:
  {
    "total_score": 87,
    "breakdown": {
      "title_clarity": 18,
      "audience_fit": 19,
      "timing_relevance": 15,
      "channel_optimization": 17,
      "actionability": 18
    },
    "suggestions": [
      "Title could be more specific — consider adding a number or outcome",
      "Add a clearer CTA for the Leadership Summit registration"
    ]
  }
```

### 7.3 AI Scheduling Persona

```yaml
name: "Content Strategist"
role: "Optimal scheduling and gap detection"
model: deepseek-chat (flash)
temperature: 0.3
max_tokens: 800

system_prompt: |
  Analyze content performance data and scheduling patterns.
  
  INPUT:
  - Last 90 days of content with performance data
  - Current schedule (next 30 days)
  - Campaign deadlines and event dates
  - Content gaps by product/cluster
  
  OUTPUT:
  1. Timing recommendations (specific date/time per content piece)
  2. Conflict warnings (over-scheduling)
  3. Content gap alerts (products/clusters with no content)
  4. Repurposing suggestions (existing content that could be derivative)
  5. Confidence score per recommendation (0-1)
  
  CHANNEL PATTERNS (use as baseline, adjust with actual data):
  - LinkedIn: Tue-Thu 8-9am best, avoid Friday afternoon
  - Email: Tue/Wed/Thu 10am best, avoid Monday morning
  - Blog: Tue/Wed mornings for B2B
  - Podcast: Thursday release (weekend listening)
  
  FORMAT: JSON [{ recommendation_type, target_asset_id, suggested_date, suggested_time, reason, confidence }]
```

### 7.4 AI Insight Engine

**Runs daily at 6am, produces:**

| Insight Type | Detection | Suggested Action |
|-------------|-----------|-----------------|
| Content gap | No content for product in 14+ days | [Create content with AI] |
| Timing opportunity | Channel X performs best on day Y | [Reschedule to suggested time] |
| Engagement drop | Open rate / engagement down >15% | [Analyze and adjust] |
| Overload warning | 3+ on same channel same day | [Spread schedule] |
| Repurpose opportunity | High-performing content >30 days old | [Create derivative] |
| Series suggestion | 3+ related pieces on same topic | [Create series] |
| Campaign risk | Campaign ending in 7d with <50% content done | [Prioritize campaign content] |
| Stale draft | Draft sitting >14 days without progress | [Complete or archive] |
| Template underuse | Template not used in 30+ days | [Use template] |
| Cross-sell content | Assessment completions → program eligibility | [Create nurture content] |

---

## 8. Tickets (CAL-001 through CAL-042)

### Original 15 tickets (from v2.0, refined)

| Ticket | Title | Priority | Effort | Dependencies |
|--------|-------|----------|--------|--------------|
| CAL-001 | Extend `content_assets` table (priority, tags, content_body, score, relationships, version) | P0 | 3h | T-002 |
| CAL-002 | Create `content_schedule` + `content_versions` + `content_comments` tables | P0 | 3h | T-002 |
| CAL-003 | Build `EditableCell` component (text, dropdown, date, tag, priority variants) | P0 | 6h | — |
| CAL-004 | Wire inline editing for all table columns | P0 | 5h | CAL-001, CAL-003 |
| CAL-005 | Build optimistic update pattern (`useOptimisticUpdate` hook) | P0 | 4h | CAL-004 |
| CAL-006 | Build `BulkToolbar` + multi-select (checkbox, Shift+click, Cmd+click) | P0 | 5h | CAL-004 |
| CAL-007 | Build bulk API endpoints (update, delete, duplicate, AI schedule) | P0 | 5h | T-002 |
| CAL-008 | Build `ViewSwitcher` (Table / Calendar / Board / Timeline) | P0 | 4h | — |
| CAL-009 | Build Calendar view (month grid, drag-and-drop reschedule) | P0 | 8h | CAL-002, CAL-008 |
| CAL-010 | Build Board view (Kanban by status, drag between columns) | P1 | 6h | CAL-008 |
| CAL-011 | Build Command Palette (Cmd+K — search, create, AI commands) | P0 | 6h | CAL-005 |
| CAL-012 | Build `FilterBar` + saved views system + `saved_views` table | P1 | 5h | CAL-001 |
| CAL-013 | Build AI Scheduling Assistant (performance analysis, conflict detection) | P1 | 6h | CAL-002 |
| CAL-014 | Build Content Gap Detection + intelligence banner | P1 | 4h | CAL-002 |
| CAL-015 | Build Content Preview side panel (LinkedIn, Email, Blog, Podcast mockups) | P2 | 6h | CAL-001 |

### New 27 tickets (expansion)

| Ticket | Title | Priority | Effort | Dependencies |
|--------|-------|----------|--------|--------------|
| CAL-016 | Build keyboard navigation system (arrow keys, Enter, Tab, Escape — spreadsheet-style) | P0 | 4h | CAL-004 |
| CAL-017 | Build status workflow enforcement (backward move confirmations) | P0 | 2h | CAL-004 |
| CAL-018 | Build undo system for bulk actions (localStorage session stack) | P0 | 3h | CAL-006 |
| CAL-019 | Build inline content creation (new row at bottom, Enter to create, field-by-field) | P0 | 4h | CAL-005 |
| CAL-020 | Build AI Content Generation dialog (prompt → 3 variants → select → create) | P1 | 6h | CAL-005 |
| CAL-021 | Build content version history panel (list, view, restore, diff) | P1 | 5h | CAL-002 |
| CAL-022 | Build content comments system (thread, replies, mentions, resolve) | P1 | 5h | CAL-002 |
| CAL-023 | Build content detail side panel (full content view, metadata, versions, comments) | P0 | 5h | CAL-021, CAL-022 |
| CAL-024 | Build Timeline/Gantt view (campaign grouping, drag bars, zoom) | P2 | 8h | CAL-008 |
| CAL-025 | Build real-time collaboration (edit activity tracking, live avatars on rows) | P2 | 5h | CAL-002 |
| CAL-026 | Build AI Content Scoring (per-content score, breakdown, suggestions) | P1 | 4h | CAL-005 |
| CAL-027 | Build content relationships UI (derivative flow, series grouping, link types) | P1 | 5h | CAL-001 |
| CAL-028 | Build Calendar week view (7-day columns, hourly rows) | P1 | 4h | CAL-009 |
| CAL-029 | Build Board swim lanes (group by channel/owner/campaign within columns) | P2 | 4h | CAL-010 |
| CAL-030 | Build Board WIP limits (configurable per column, warning when exceeded) | P2 | 2h | CAL-010 |
| CAL-031 | Build conflict detection (real-time, on schedule change, visual indicators) | P0 | 3h | CAL-002 |
| CAL-032 | Build content import from CSV (column mapping, validation, preview) | P2 | 4h | CAL-001 |
| CAL-033 | Build content export (CSV + JSON, respects filters, includes body) | P1 | 2h | CAL-012 |
| CAL-034 | Build Google/Outlook Calendar sync (2-way, content → calendar events) | P2 | 6h | CAL-002 |
| CAL-035 | Build publishing automation (scheduled → auto-publish via agent, webhook) | P1 | 5h | CAL-002, T-005 |
| CAL-036 | Build virtual scrolling for table (handle 1000+ rows smoothly) | P0 | 3h | CAL-004 |
| CAL-037 | Build full keyboard shortcuts map (see Section 4.3, all shortcuts) | P1 | 3h | CAL-016 |
| CAL-038 | Build responsive layout (mobile card list, tablet compressed table) | P1 | 4h | All views |
| CAL-039 | Build content series management (group parts, order, series name) | P2 | 3h | CAL-001 |
| CAL-040 | Build AI auto-fill gaps (detect → suggest → create → schedule, review required) | P1 | 5h | CAL-014, CAL-020 |
| CAL-041 | Build webhook system (content status change → external notification) | P2 | 3h | CAL-002 |
| CAL-042 | Build accessibility layer (ARIA labels, full keyboard nav, screen reader) | P1 | 4h | All components |

**Total: 42 tickets | ~175 hours**

### Effort Breakdown

| Priority | Tickets | Hours | % of Total |
|----------|---------|-------|------------|
| P0 | 15 | 66h | 38% |
| P1 | 17 | 73h | 42% |
| P2 | 10 | 36h | 20% |

### Implementation Phases

**Phase 1 (P0 — Core editing, 66h, ~2.5 weeks):**
CAL-001, 002, 003, 004, 005, 006, 007, 008, 009, 011, 016, 017, 018, 019, 031, 036
→ Delivers: Inline editing on all cells, bulk operations with undo, 2 views (Table + Calendar), keyboard navigation, command palette, conflict detection, virtual scrolling

**Phase 2 (P1 — AI + Collaboration, 73h, ~3 weeks):**
CAL-010, 012, 013, 014, 020, 021, 022, 023, 026, 027, 028, 033, 035, 037, 038, 040, 042
→ Delivers: Board view, AI generation + scoring + scheduling + gaps, saved views, version history, comments, content detail panel, week view, export, publishing automation, keyboard shortcuts, responsive, accessibility

**Phase 3 (P2 — Advanced, 36h, ~1.5 weeks):**
CAL-015, 024, 025, 029, 030, 032, 034, 039, 041
→ Delivers: Content preview, Timeline view, real-time collaboration, swim lanes, WIP limits, CSV import, calendar sync, series management, webhooks

---

## 9. Acceptance Criteria

### Core (P0)
- [ ] Every table cell editable inline (no modal for any field)
- [ ] Inline edits save instantly (optimistic UI, <100ms perceived)
- [ ] Keyboard navigation works (arrows, Enter, Tab, Escape — spreadsheet-style)
- [ ] Status workflow enforced (backward moves require confirmation)
- [ ] Multi-select works (checkbox, Shift+click, Cmd+click, header select-all)
- [ ] Bulk toolbar appears with ≥1 selection, all actions functional
- [ ] Undo works for all bulk actions (5s toast, localStorage)
- [ ] Inline content creation (new row, field-by-field, persists as draft)
- [ ] 4 views functional: Table, Calendar (month), Board, Timeline
- [ ] Calendar drag-and-drop reschedules content
- [ ] Board drag-and-drop changes status
- [ ] Command palette (Cmd+K) works for search + create + AI commands
- [ ] Conflict detection shows warnings on over-scheduling
- [ ] Virtual scrolling handles 1000+ rows smoothly
- [ ] Saved views persist and are switchable

### Enhanced (P1)
- [ ] AI content generation produces 3 variants, creates on selection
- [ ] AI content scoring shows score + breakdown + suggestions per content
- [ ] AI scheduling suggests optimal dates based on performance data
- [ ] AI gap detection shows banner + auto-fill option
- [ ] Content version history viewable with restore capability
- [ ] Comments system works (thread, mentions, resolve)
- [ ] Content detail panel shows all metadata + versions + comments
- [ ] Week view in Calendar (hourly rows)
- [ ] Export works (CSV + JSON)
- [ ] Publishing automation (scheduled → auto-publish at time)
- [ ] Full keyboard shortcut map implemented
- [ ] Responsive: mobile shows card list, tablet shows compressed table
- [ ] Accessibility: ARIA labels, keyboard nav, screen reader compatible

### Advanced (P2)
- [ ] Content preview shows channel-specific rendering (LinkedIn, Email, Blog, Podcast)
- [ ] Timeline/Gantt view with campaign grouping and drag bars
- [ ] Real-time collaboration shows who's editing what (live avatars)
- [ ] Board swim lanes (group by channel/owner/campaign)
- [ ] Board WIP limits with warnings
- [ ] CSV import with column mapping and validation
- [ ] Google/Outlook Calendar 2-way sync
- [ ] Content series management (group parts, order)
- [ ] Webhook system for external notifications

---

## 10. Component Architecture

### 10.1 Component Tree

```
ContentCalendarPage
├── IntelligenceBanner (content gaps + AI suggestions)
├── SavedViewTabs ([All] [This Week] [My Content] [+ Save])
├── ViewSwitcher ([Table] [Calendar] [Board] [Timeline])
├── FilterBar (combinable filters + clear all)
├── ViewContainer (switches based on selected view)
│   ├── TableView
│   │   ├── BulkToolbar (appears on selection)
│   │   ├── ContentTable
│   │   │   ├── ContentRow (×N, virtualized)
│   │   │   │   ├── EditableCell (×per column)
│   │   │   │   │   ├── TextEdit
│   │   │   │   │   ├── StatusDropdown
│   │   │   │   │   ├── IconDropdown (Type, Channel)
│   │   │   │   │   ├── AvatarDropdown (Owner)
│   │   │   │   │   ├── DatePicker
│   │   │   │   │   ├── SearchableDropdown (Campaign)
│   │   │   │   │   ├── PriorityDots
│   │   │   │   │   └── TagInput
│   │   │   │   ├── CollaborationIndicator (live avatar)
│   │   │   │   └── ConflictWarning (if applicable)
│   │   │   └── NewRowTrigger (+ New row / Enter)
│   │   └── Pagination
│   ├── CalendarView
│   │   ├── CalendarHeader (month nav, today, view toggle)
│   │   ├── CalendarGrid (7 × 5/6)
│   │   │   ├── CalendarDay (×35/42)
│   │   │   │   ├── ContentCard (×per day, draggable)
│   │   │   │   └── ConflictIndicator (if 3+ same channel)
│   │   │   └── DayDetailPanel (click day → side panel)
│   │   └── WeekView (optional toggle)
│   ├── BoardView
│   │   ├── BoardColumn (×6 statuses)
│   │   │   ├── ColumnHeader (status, count, WIP limit)
│   │   │   ├── ContentCard (×N, draggable)
│   │   │   │   ├── CardExpanded (accordion on click)
│   │   │   │   └── CardContextMenu (right-click)
│   │   │   └── AddCardButton
│   │   └── SwimLaneToggle (group by channel/owner/campaign)
│   └── TimelineView
│       ├── TimelineHeader (date scale, zoom)
│       ├── TimelineRow (×per group: campaign/channel/owner)
│       │   ├── TimelineBar (×per content, draggable edges)
│       │   └── Milestone (event dates, deadlines)
│       └── DependencyLine (SVG arrows between related content)
├── ContentDetailPanel (slides from right)
│   ├── ContentHeader (title, status, channel, owner)
│   ├── ContentBody (editable, rich text)
│   ├── MetadataSection (tags, priority, campaign, relationships)
│   ├── ScheduleSection (date, time, published URL, performance)
│   ├── VersionHistory (collapsible list)
│   ├── CommentsSection (thread + add)
│   └── AISuggestions (score, recommendations)
├── ContentPreviewPanel (slides from right, separate from detail)
│   ├── ChannelSelector (tabs: LinkedIn, Email, Blog, Podcast, YouTube)
│   └── ChannelPreview (mockup rendering)
├── AIGenerateDialog (modal)
│   ├── PromptInput
│   ├── OptionsSelector (channel, type, tone, product, cluster)
│   ├── GeneratedOutput (3 variants)
│   └── ActionButtons [Use] [Regenerate] [Edit]
├── CommandPalette (Cmd+K overlay)
└── UndoToast (appears after bulk actions)
```

---

*Next iteration: Kevin to confirm scope. Then Page 3: Template & Asset Library.*
