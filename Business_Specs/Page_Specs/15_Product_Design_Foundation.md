# Product Design Foundation

**Deliverable:** Entity Relationships, Information Architecture, User Flows, Prototype Reconciliation  
**Date:** 2026-07-17  
**Effort:** ~17h (4h + 4h + 6h + 3h)  
**Purpose:** Establish product structure before building pages

---

## Part 1: Entity Relationship Diagram (4h)

### Core Entities (from Supabase Schema)

#### 0. Shared Core (Cross-App)
```
┌─────────────────┐
│   companies     │
├─────────────────┤
│ id (PK)         │
│ name            │
│ domain          │
│ industry        │
│ size            │
│ region          │
│ tier            │
│ status          │
│ metadata (JSONB)│
└────────┬────────┘
         │ 1:N
         ▼
┌─────────────────┐
│   contacts      │
├─────────────────┤
│ id (PK)         │
│ email (unique)  │
│ first_name      │
│ last_name       │
│ company_id (FK) │──► companies.id
│ source          │
│ tags[]          │
│ tier            │
│ b2b_readiness   │
│ metadata (JSONB)│
└────────┬────────┘
         │ N:M (via contact_app_mapping)
         ▼
┌─────────────────────┐
│ contact_app_mapping │
├─────────────────────┤
│ contact_id (FK)     │──► contacts.id
│ app_name            │
│ app_contact_id      │
└─────────────────────┘
```

#### 1. Dashboard & Intelligence
```
┌─────────────────┐       ┌─────────────────┐
│  action_feed    │       │   ai_briefs     │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ type            │       │ brief_type      │
│ title           │       │ content         │
│ priority        │       │ generated_for   │
│ source_module   │       │ generated_at    │
│ resolved        │       └─────────────────┘
│ read_by[]       │
│ metadata (JSONB)│       ┌─────────────────────┐
└─────────────────┘       │ kpi_daily_snapshots │
                          ├─────────────────────┤
┌─────────────────┐       │ id (PK)             │
│  ai_insights    │       │ metric_name         │
├─────────────────┤       │ metric_value        │
│ id (PK)         │       │ snapshot_date       │
│ module          │       └─────────────────────┘
│ insight_type    │
│ content         │       ┌─────────────────────┐
│ status          │       │ agent_daily_metrics │
│ confidence      │       ├─────────────────────┤
└─────────────────┘       │ id (PK)             │
                          │ agent_name          │
                          │ tasks_completed     │
                          │ tasks_failed        │
                          │ tokens_used         │
                          │ metric_date         │
                          └─────────────────────┘
```

#### 2. Content Calendar
```
┌─────────────────┐
│     assets      │
├─────────────────┤
│ id (PK)         │
│ title           │
│ asset_type      │
│ status          │
│ channel         │
│ scheduled_date  │
│ content_body    │
│ metadata (JSONB)│
└────────┬────────┘
         │ 1:N
         ▼
┌─────────────────────┐
│  content_schedule   │
├─────────────────────┤
│ id (PK)             │
│ asset_id (FK)       │──► assets.id
│ scheduled_date      │
│ channel             │
│ status              │
└─────────────────────┘

┌─────────────────────┐
│  content_versions   │
├─────────────────────┤
│ id (PK)             │
│ asset_id (FK)       │──► assets.id
│ version_number      │
│ content_snapshot    │
└─────────────────────┘

┌─────────────────────┐
│  content_comments   │
├─────────────────────┤
│ id (PK)             │
│ asset_id (FK)       │──► assets.id
│ user_id             │
│ content             │
└─────────────────────┘
```

#### 3. Templates & Assets
```
┌─────────────────┐
│   templates     │
├─────────────────┤
│ id (PK)         │
│ name            │
│ template_type   │
│ category        │
│ content_body    │
│ tags[]          │
│ usage_count     │
│ metadata (JSONB)│
└─────────────────┘
```

#### 4. Distribution & Campaigns
```
┌─────────────────┐       ┌─────────────────────┐
│    campaigns    │       │  email_sequences    │
├─────────────────┤       ├─────────────────────┤
│ id (PK)         │       │ id (PK)             │
│ name            │       │ name                │
│ campaign_type   │       │ sequence_type       │
│ status          │       │ total_emails        │
│ start_date      │       │ metadata (JSONB)    │
│ end_date        │       └────────┬────────────┘
│ budget          │                │ 1:N
│ metadata (JSONB)│                ▼
└─────────────────┘       ┌─────────────────────┐
                          │  sequence_emails    │
                          ├─────────────────────┤
                          │ id (PK)             │
                          │ sequence_id (FK)    │──► email_sequences.id
                          │ email_number        │
                          │ subject             │
                          │ body                │
                          │ delay_days          │
                          └─────────────────────┘
```

#### 5. Journeys & Automation
```
┌─────────────────┐
│    journeys     │
├─────────────────┤
│ id (PK)         │
│ name            │
│ journey_type    │
│ status          │
│ entry_trigger   │
│ steps (JSONB)   │
│ metadata (JSONB)│
└────────┬────────┘
         │ 1:N
         ▼
┌─────────────────────┐
│  journey_instances  │
├─────────────────────┤
│ id (PK)             │
│ journey_id (FK)     │──► journeys.id
│ contact_id (FK)     │──► contacts.id
│ current_step        │
│ status              │
│ started_at          │
│ completed_at        │
└─────────────────────┘

┌─────────────────────┐
│   journey_actions   │
├─────────────────────┤
│ id (PK)             │
│ instance_id (FK)    │──► journey_instances.id
│ action_type         │
│ action_data (JSONB) │
│ executed_at         │
│ status              │
└─────────────────────┘
```

#### 6. Events & Webinars
```
┌─────────────────┐
│     events      │
├─────────────────┤
│ id (PK)         │
│ title           │
│ event_type      │
│ start_time      │
│ end_time        │
│ location        │
│ capacity        │
│ price           │
│ status          │
│ metadata (JSONB)│
└────────┬────────┘
         │ 1:N
         ▼
┌─────────────────────┐
│  event_registrations│
├─────────────────────┤
│ id (PK)             │
│ event_id (FK)       │──► events.id
│ contact_id (FK)     │──► contacts.id
│ status              │
│ payment_status      │
│ checked_in          │
└─────────────────────┘
```

#### 7. Analytics & Reporting
```
┌─────────────────────┐
│  campaign_metrics   │
├─────────────────────┤
│ id (PK)             │
│ campaign_id (FK)    │──► campaigns.id
│ metric_date         │
│ impressions         │
│ clicks              │
│ conversions         │
│ revenue             │
└─────────────────────┘

┌─────────────────────┐
│   channel_metrics   │
├─────────────────────┤
│ id (PK)             │
│ channel             │
│ metric_date         │
│ metric_name         │
│ metric_value        │
└─────────────────────┘
```

### Entity Relationship Summary

**Core Entities (referenced everywhere):**
- `companies` → `contacts` (1:N)
- `contacts` ↔ `apps` (N:M via contact_app_mapping)

**Content Domain:**
- `assets` → `content_schedule` (1:N)
- `assets` → `content_versions` (1:N)
- `assets` → `content_comments` (1:N)
- `templates` (standalone)

**Distribution Domain:**
- `campaigns` (standalone, but references assets via metadata)
- `email_sequences` → `sequence_emails` (1:N)

**Journey Domain:**
- `journeys` → `journey_instances` (1:N)
- `journey_instances` → `journey_actions` (1:N)
- `journey_instances` → `contacts` (N:1)

**Events Domain:**
- `events` → `event_registrations` (1:N)
- `event_registrations` → `contacts` (N:1)

**Analytics Domain:**
- `campaigns` → `campaign_metrics` (1:N)
- `channels` → `channel_metrics` (1:N)

**Intelligence Domain:**
- `action_feed` (standalone, references modules)
- `ai_briefs` (standalone)
- `ai_insights` (standalone, references modules)
- `kpi_daily_snapshots` (standalone)
- `agent_daily_metrics` (standalone)

---

## Part 2: Information Architecture (4h)

### Current React App Structure (WRONG)
```
Sidebar (flat, no grouping)
├── Dashboard
├── Content Calendar
├── Templates
├── Distribution
├── Journeys
├── Repurposing
├── Events
├── Analytics
└── Agent Bridge
```

**Problems:**
- No logical grouping
- No hierarchy
- Pages are isolated (no cross-navigation)
- Naming doesn't match functionality

### HTML Prototype Structure (CORRECT)
```
Sidebar (5 groups)
├── Overview
│   └── Dashboard
├── Content
│   ├── Calendar (actual calendar view)
│   ├── Assets (library with tabs/filters)
│   ├── Templates
│   └── Repurposing
├── Distribution
│   ├── Email Sequences
│   ├── Mailing Lists
│   ├── Registrations
│   └── Channels
├── Journey
│   ├── B2C Journey (visual pipeline)
│   ├── Triggers
│   └── VISTA Handoff
└── Intelligence
    ├── Analytics (charts, not tables)
    └── Campaigns
```

**Advantages:**
- Logical grouping by domain
- Clear hierarchy
- Cross-navigation via breadcrumbs
- Naming matches functionality

### Recommended Information Architecture

```
WAVE Platform
│
├── 1. OVERVIEW
│   └── Dashboard
│       ├── KPIs (revenue, leads, content output)
│       ├── B2C Journey Pipeline (visual)
│       ├── Channel Split (donut chart)
│       ├── Recent Activity (timeline)
│       ├── Performance (30d) (bar charts)
│       └── Quick Actions
│
├── 2. CONTENT
│   ├── Calendar
│   │   ├── Month/Week/Day views
│   │   ├── Create content modal
│   │   ├── Drag-and-drop rescheduling
│   │   └── Filter by channel/type/status
│   │
│   ├── Assets
│   │   ├── List view with tabs (All/Published/Scheduled/Draft)
│   │   ├── Detail view (click asset → see versions, comments, schedule)
│   │   ├── Create/Edit forms
│   │   ├── Bulk operations
│   │   └── Export CSV
│   │
│   ├── Templates
│   │   ├── Card/Grid view (not table)
│   │   ├── Template preview modal
│   │   ├── Create/Edit forms
│   │   ├── Brand kit integration
│   │   └── Usage tracking
│   │
│   └── Repurposing
│       ├── Project list
│       ├── Create project (select source asset)
│       ├── Output gallery (see all derivatives)
│       └── Pipeline visualization
│
├── 3. DISTRIBUTION
│   ├── Email Sequences
│   │   ├── List view (26 sequences)
│   │   ├── Detail view (click sequence → see all emails)
│   │   ├── Email editor (split-pane: preview + edit)
│   │   ├── Create/Edit sequence forms
│   │   └── Performance metrics per sequence
│   │
│   ├── Mailing Lists
│   │   ├── List segments
│   │   ├── Create/Edit segment (filter builder)
│   │   ├── Contact count per segment
│   │   └── Import/Export contacts
│   │
│   ├── Registrations
│   │   ├── Event registrations list
│   │   ├── Check-in status
│   │   ├── Payment status
│   │   └── Export attendee list
│   │
│   └── Channels
│       ├── Channel list (Email, LinkedIn, Website, Podcast, etc.)
│       ├── Channel configuration
│       ├── Integration status
│       └── Channel-specific metrics
│
├── 4. JOURNEY
│   ├── B2C Journey
│   │   ├── Visual pipeline (7 stages: Awareness → Retain)
│   │   ├── Click stage → see contacts in that stage
│   │   ├── Journey builder (drag-drop nodes)
│   │   ├── Contact inspector (see individual journey)
│   │   └── Journey performance metrics
│   │
│   ├── Triggers
│   │   ├── Trigger list
│   │   ├── Create/Edit trigger
│   │   ├── Trigger conditions builder
│   │   └── Trigger activity log
│   │
│   └── VISTA Handoff
│       ├── Pending handoffs (B2B signals)
│       ├── Handoff history
│       ├── Handoff criteria configuration
│       └── VISTA integration status
│
├── 5. INTELLIGENCE
│   ├── Analytics
│   │   ├── Overview (charts: trends, funnel, ROI)
│   │   ├── Campaign performance
│   │   ├── Channel performance
│   │   ├── Content performance
│   │   ├── Custom reports
│   │   └── Export reports
│   │
│   └── Campaigns
│       ├── Campaign list
│       ├── Create/Edit campaign
│       ├── Campaign detail (assets, metrics, timeline)
│       └── Campaign ROI calculator
│
└── 6. AGENTS (separate from main nav)
    ├── Agent Bridge
    │   ├── Agent cards (Echo, NEXUS, etc.)
    │   ├── Agent detail (activity timeline, tasks, logs)
    │   ├── Approval queue (actions requiring human review)
    │   └── Agent performance metrics
    │
    └── Settings
        ├── User profile
        ├── Team management
        ├── Integrations
        └── Preferences
```

### Navigation Patterns

**Primary Navigation (Sidebar):**
- 5 main groups: Overview, Content, Distribution, Journey, Intelligence
- Agents/Settings separate (lower priority)
- Active state with left border indicator
- Badge counts for actionable items

**Secondary Navigation (TopBar):**
- Breadcrumb trail: Overview > Dashboard
- Quick search (Cmd+K)
- Notifications bell
- User menu

**Tertiary Navigation (Within Pages):**
- Tabs (e.g., Assets: All/Published/Scheduled/Draft)
- Filters (channel, type, status, date range)
- View switcher (List/Grid/Calendar/Kanban)
- Sort options

**Cross-Page Navigation:**
- Click email → navigate to Email Sequence detail
- Click template → slide-out panel showing template usage
- Click contact → navigate to contact detail (across apps)
- Click campaign → navigate to campaign detail with assets list

### Progressive Disclosure

**Level 1: Summary (List/Grid views)**
- See all items with key metadata
- Quick filters and search
- Bulk operations

**Level 2: Detail (Click item)**
- Full item details
- Related items (e.g., asset → schedule, comments, versions)
- Edit actions

**Level 3: Edit (Click edit)**
- Form with validation
- Preview mode
- Save/Cancel actions

**Level 4: Advanced (Click advanced)**
- Metadata editor (JSON)
- Version history
- Audit log

---

## Part 3: Core User Flows (6h)

### Flow 1: Create and Distribute Content

**User Goal:** Create a newsletter and schedule it for distribution

**Flow:**
```
1. User navigates to Content > Calendar
   └─ Sees month view with existing content

2. User clicks "+ New Content" button
   └─ Modal opens with content creation form

3. User fills form:
   - Title: "Newsletter #16"
   - Type: Newsletter
   - Channel: Email
   - Scheduled date: 2026-07-28
   - Content body: [writes content]
   
4. User clicks "Save"
   └─ Asset created with status="draft"
   └─ Content schedule entry created
   └─ Modal closes, calendar shows new content

5. User clicks on newsletter in calendar
   └─ Detail view opens (slide-out or new page)
   └─ Shows: content, schedule, versions, comments

6. User clicks "Edit"
   └─ Form opens with pre-filled data
   └─ User updates content
   └─ User clicks "Save"
   └─ New version created (version 2)

7. User clicks "Mark as Ready for Review"
   └─ Status changes to "in_review"
   └─ Notification sent to reviewer

8. Reviewer approves
   └─ Status changes to "scheduled"
   └─ Content appears in Distribution queue

9. On scheduled date:
   └─ Email sequence triggered
   └─ Newsletter sent to mailing list
   └─ Status changes to "published"
   └─ Metrics tracked in Analytics
```

**Touchpoints:**
- Calendar (create, view, reschedule)
- Asset detail (edit, version, comment)
- Distribution queue (schedule, send)
- Analytics (track performance)

**Entities Involved:**
- assets (create, update)
- content_schedule (create, update)
- content_versions (create)
- content_comments (create)
- email_sequences (trigger)
- campaign_metrics (track)

---

### Flow 2: Build a Nurture Journey

**User Goal:** Create a 5-email nurture sequence for new leads

**Flow:**
```
1. User navigates to Distribution > Email Sequences
   └─ Sees list of 26 existing sequences

2. User clicks "+ New Sequence"
   └─ Form opens:
     - Name: "New Lead Nurture"
     - Type: Nurture
     - Total emails: 5

3. User clicks "Create"
   └─ Sequence created
   └─ Navigates to sequence detail

4. Sequence detail shows:
   - List of 5 email slots (empty)
   - "Add Email" button for each slot

5. User clicks "Add Email" on slot 1
   └─ Email editor opens (split-pane)
   └─ Left: preview, Right: edit form
   └─ User fills:
     - Subject: "Welcome to LYC"
     - Delay: 0 days (immediate)
     - Body: [writes email]
   └─ User clicks "Save"
   └─ Email 1 created

6. User repeats for emails 2-5:
   - Email 2: "Our Approach" (delay: 3 days)
   - Email 3: "Case Study" (delay: 7 days)
   - Email 4: "Webinar Invite" (delay: 14 days)
   - Email 5: "Next Steps" (delay: 21 days)

7. User clicks "Activate Sequence"
   └─ Status changes to "active"
   └─ Sequence ready to trigger

8. User navigates to Journey > Triggers
   └─ Clicks "+ New Trigger"
   └─ Form opens:
     - Trigger name: "New Lead Registration"
     - Condition: contact.tags contains "new_lead"
     - Action: start sequence "New Lead Nurture"
   └─ User clicks "Save"
   └─ Trigger created and active

9. When new lead registers:
   └─ Trigger fires
   └─ Journey instance created
   └─ Email 1 sent immediately
   └─ Email 2 scheduled (3 days later)
   └─ Journey progress tracked
```

**Touchpoints:**
- Email Sequences list (create, view)
- Sequence detail (add emails, activate)
- Email editor (create, edit, preview)
- Triggers (create, configure)
- Journey instances (track progress)

**Entities Involved:**
- email_sequences (create, update)
- sequence_emails (create, update)
- journeys (reference)
- journey_instances (create)
- journey_actions (create)
- contacts (trigger)

---

### Flow 3: Set Up Event + Track Attendees

**User Goal:** Create a webinar, manage registrations, track attendance

**Flow:**
```
1. User navigates to Events (or Intelligence > Campaigns > Create Event)
   └─ Sees list of events

2. User clicks "+ New Event"
   └─ Event wizard opens (multi-step form)

3. Step 1: Basic Info
   - Title: "BRIDGE Webinar: AI in Marketing"
   - Type: Webinar
   - Date: 2026-08-15
   - Time: 14:00-15:30
   - Location: Zoom (URL)
   - Capacity: 200
   - Price: Free

4. Step 2: Registration Settings
   - Registration required: Yes
   - Approval required: No
   - Confirmation email: Yes
   - Reminder emails: Yes (1 day before, 1 hour before)

5. Step 3: Content
   - Description: [writes description]
   - Speaker bios
   - Agenda
   - Resources (PDF, slides)

6. User clicks "Create Event"
   └─ Event created with status="draft"
   └─ Registration page generated

7. User clicks "Publish Event"
   └─ Status changes to "published"
   └─ Registration page live
   └─ Event added to Content Calendar

8. Promote event:
   - Navigate to Content > Calendar
   - Create content: "Webinar Announcement" (LinkedIn, Email, Website)
   - Link to registration page

9. Track registrations:
   - Navigate to Distribution > Registrations
   - See list of registrants
   - Filter by status (registered, confirmed, cancelled)
   - Export attendee list

10. Day of event:
    - Check-in attendees (mark as checked_in)
    - Track no-shows

11. Post-event:
    - Upload recording
    - Send follow-up email to attendees
    - Send recording to no-shows
    - Track engagement in Analytics

12. Measure success:
    - Navigate to Analytics > Campaigns
    - See event metrics:
      - Registrations: 186
      - Attendance rate: 68%
      - Engagement score: 4.2/5
      - Leads generated: 23
```

**Touchpoints:**
- Events list (create, view)
- Event wizard (multi-step form)
- Registrations (track, export, check-in)
- Content Calendar (promote)
- Analytics (measure)

**Entities Involved:**
- events (create, update)
- event_registrations (create, update)
- contacts (register)
- content_schedule (promote)
- campaign_metrics (track)

---

### Flow 4: Review Agent Activity + Approve Actions

**User Goal:** Review what AI agents did, approve actions requiring human review

**Flow:**
```
1. User navigates to Agents > Agent Bridge
   └─ Sees agent cards:
     - Echo (Newsletter Agent)
     - NEXUS (Repurposing Agent)
     - Valentina (Website Agent)
     - etc.

2. User clicks on Echo card
   └─ Agent detail page opens
   └─ Shows:
     - Agent status (active/inactive)
     - Recent activity timeline
     - Tasks completed (today, week, month)
     - Performance metrics
     - Pending approvals

3. User reviews activity timeline:
   - 09:00 - Echo generated newsletter draft #16
   - 09:05 - Echo sent to review queue
   - 10:30 - Reviewer approved
   - 10:35 - Echo scheduled for 2026-07-28

4. User sees "Pending Approvals" section:
   - 3 actions awaiting review
   - Click "View All"

5. Approval queue opens:
   - Action 1: Echo wants to publish newsletter #16
     - Preview content
     - Approve / Reject / Edit
   - Action 2: NEXUS wants to repurpose webinar into 8 assets
     - Preview output list
     - Approve / Reject
   - Action 3: Valentina wants to update homepage
     - Preview changes
     - Approve / Reject

6. User clicks on Action 1:
   └─ Preview opens (side-by-side: current vs proposed)
   └─ User reviews content
   └─ User clicks "Approve"
   └─ Action executed
   └─ Status changes to "approved"
   └─ Notification sent to Echo

7. User clicks on Action 2:
   └─ Preview shows 8 derivative assets
   └─ User reviews list
   └─ User clicks "Approve with edits"
   └─ Form opens to adjust output
   └─ User removes 2 assets, keeps 6
   └─ User clicks "Save"
   └─ NEXUS executes with modified scope

8. User reviews agent performance:
   - Tasks completed: 47 (this week)
   - Tasks failed: 2
   - Tokens used: 125,000
   - Success rate: 96%

9. User adjusts agent settings:
   - Increase auto-approval threshold
   - Add new approval rule
   - Schedule agent downtime
```

**Touchpoints:**
- Agent Bridge (overview, agent cards)
- Agent detail (activity, performance)
- Approval queue (review, approve, reject)
- Agent settings (configure)

**Entities Involved:**
- agent_daily_metrics (track)
- action_feed (create, update)
- notification_log (create)
- assets (created by agents)
- approval_queue (custom table, not in schema yet)

**Missing Entity:**
```sql
CREATE TABLE IF NOT EXISTS approval_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  action_data JSONB NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Flow 5: Repurpose Content Across Channels

**User Goal:** Take a webinar recording and create 8 derivative assets

**Flow:**
```
1. User navigates to Content > Repurposing
   └─ Sees list of repurposing projects

2. User clicks "+ New Project"
   └─ Form opens:
     - Source asset: Select webinar recording
     - Target outputs: Check all that apply:
       ☑ Blog post
       ☑ LinkedIn posts (3)
       ☑ Newsletter section
       ☑ Podcast teaser
       ☑ Executive brief
       ☑ Social quotes (2)
     - Agent: NEXUS (Repurposing Agent)

3. User clicks "Create Project"
   └─ Repurposing project created
   └─ NEXUS agent triggered

4. NEXUS processes source asset:
   - Transcribes webinar (if video)
   - Extracts key points
   - Generates 8 derivative assets

5. User receives notification:
   - "NEXUS completed repurposing project"
   - Click to view outputs

6. User navigates to project detail:
   └─ Shows pipeline:
     - Source: BRIDGE Webinar (2h video)
     - Outputs: 8 assets generated
     - Status: Ready for review

7. User reviews each output:
   - Blog post: 1,200 words, ready to publish
   - LinkedIn post 1: 300 words, ready
   - LinkedIn post 2: 250 words, ready
   - LinkedIn post 3: 280 words, ready
   - Newsletter section: 400 words, ready
   - Podcast teaser: 60 seconds audio, ready
   - Executive brief: 2 pages, ready
   - Social quote 1: image + text, ready
   - Social quote 2: image + text, ready

8. User approves all outputs:
   └─ Status changes to "approved"
   └─ Assets added to Asset Library
   └─ Each asset linked to source webinar

9. User schedules outputs:
   - Navigate to Content > Calendar
   - See all 8 assets in draft status
   - Drag-and-drop to schedule:
     - Blog post: 2026-07-20 (Website)
     - LinkedIn post 1: 2026-07-21
     - LinkedIn post 2: 2026-07-23
     - LinkedIn post 3: 2026-07-25
     - Newsletter section: 2026-07-28 (in newsletter #16)
     - Podcast teaser: 2026-07-22 (Podcast Ep.5)
     - Executive brief: 2026-07-24 (Email sequence)
     - Social quotes: 2026-07-21, 2026-07-23 (LinkedIn)

10. Track performance:
    - Navigate to Analytics
    - See repurposing metrics:
      - Source: 1 webinar (2h)
      - Outputs: 8 assets
      - Repurpose ratio: 1:8
      - Total reach: 12,000 impressions
      - Engagement: 847 interactions
```

**Touchpoints:**
- Repurposing list (create, view)
- Repurposing detail (review outputs)
- Asset Library (see generated assets)
- Calendar (schedule outputs)
- Analytics (track performance)

**Entities Involved:**
- assets (source + derivatives)
- repurposing_projects (custom table, not in schema yet)
- content_schedule (schedule derivatives)
- campaign_metrics (track performance)

**Missing Entity:**
```sql
CREATE TABLE IF NOT EXISTS repurposing_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_asset_id UUID REFERENCES assets(id),
  agent_name TEXT,
  target_outputs JSONB, -- array of output types
  outputs_generated INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending, processing, ready, approved, published
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS repurposing_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES repurposing_projects(id),
  asset_id UUID REFERENCES assets(id),
  output_type TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Part 4: Prototype Reconciliation (3h)

### HTML Prototype Strengths (KEEP)

#### 1. **Navigation Structure** ✅
- 5 logical groups: Overview, Content, Distribution, Journey, Intelligence
- Clear hierarchy with group labels
- Badge counts for actionable items
- Active state with left border

**Keep as-is. Implement in React Sidebar component.**

#### 2. **Calendar View** ✅
- Actual calendar grid (not table)
- Month view with day cells
- Color-coded events by type
- Click to create content
- Drag-and-drop to reschedule

**Keep design. Implement with react-day-picker + @dnd-kit.**

#### 3. **Dashboard Layout** ✅
- KPI row (4 cards)
- Journey pipeline (visual stages)
- Channel split (donut chart)
- Recent activity (timeline)
- Performance metrics (bar charts)

**Keep layout. Wire to Supabase for real data.**

#### 4. **Journey Pipeline** ✅
- 7-stage horizontal pipeline
- Stage counts
- Active stage highlighting
- Click stage to see contacts

**Keep design. Wire to journey_instances table.**

#### 5. **Design Tokens** ✅
- Color palette (primary, success, warning, danger, info)
- Typography scale (Libre Baskerville + DM Sans)
- Spacing system
- Border radius (0px - hard edges)
- Shadows and transitions

**Keep as-is. Already in globals.css.**

#### 6. **Component Patterns** ✅
- Cards with header/body
- Tables with hover states
- Badges (color-coded)
- Progress bars
- Tags
- Buttons (primary, secondary, ghost)

**Keep patterns. Implement as shared components.**

#### 7. **Modal System** ✅
- Overlay with backdrop
- Header/body/footer sections
- Close button
- Form integration

**Keep pattern. Implement with Radix UI Dialog.**

#### 8. **Toast Notifications** ✅
- Fixed position (bottom-right)
- Auto-dismiss
- Color-coded by type

**Keep pattern. Implement with sonner.**

#### 9. **Tabs** ✅
- Horizontal tabs
- Active state with bottom border
- Count badges

**Keep pattern. Implement with Radix UI Tabs.**

#### 10. **Forms** ✅
- Label + input pattern
- Focus states
- Validation (visual)
- Form rows (2-column)

**Keep pattern. Implement with react-hook-form + zod.**

---

### HTML Prototype Weaknesses (REBUILD)

#### 1. **Asset Library** ⚠️
**Current:** Basic table with tabs
**Need:** Card/grid view with thumbnails, filters, bulk ops

**Rebuild with:**
- Grid view (3-4 columns)
- Thumbnail previews
- Filter sidebar
- Bulk select + actions
- Sort options

#### 2. **Email Sequence Editor** ⚠️
**Current:** Not shown in prototype
**Need:** Split-pane editor (preview + edit)

**Rebuild with:**
- Split-pane layout
- Live preview
- Subject line character counter
- Template variable insertion
- Send time optimization

#### 3. **Journey Builder** ⚠️
**Current:** Pipeline visualization only
**Need:** Visual builder with drag-drop nodes

**Rebuild with:**
- Canvas with drag-drop
- Node library (email, delay, condition, etc.)
- Connection lines
- Zoom/pan controls
- Inline editing

#### 4. **Analytics Dashboard** ⚠️
**Current:** Basic bar charts (CSS-only)
**Need:** Interactive charts with drill-down

**Rebuild with:**
- Recharts library
- Line charts (trends)
- Bar charts (comparisons)
- Pie/donut charts (distribution)
- Funnel charts (journey)
- Interactive tooltips
- Export to CSV/PDF

#### 5. **Agent Bridge** ⚠️
**Current:** Not shown in prototype
**Need:** Agent cards, detail pages, approval queue

**Rebuild with:**
- Agent cards (status, metrics)
- Activity timeline
- Approval queue
- Performance charts
- Configuration panel

#### 6. **Mobile Responsiveness** ⚠️
**Current:** Basic (sidebar hidden, grid stacked)
**Need:** Full mobile experience

**Rebuild with:**
- Hamburger menu
- Swipeable cards
- Touch-friendly buttons (44px min)
- Table → card view transformation
- Modal full-screen on mobile

#### 7. **Accessibility** ⚠️
**Current:** Not addressed
**Need:** WCAG AA compliance

**Rebuild with:**
- Keyboard navigation
- Focus states
- ARIA labels
- Color contrast verification
- Screen reader testing

#### 8. **Empty States** ⚠️
**Current:** Not shown
**Need:** Welcoming empty states with CTAs

**Rebuild with:**
- Illustrations/icons
- "Get started" guidance
- Quick actions
- Sample data option

#### 9. **Loading States** ⚠️
**Current:** Not shown
**Need:** Skeleton loaders for all views

**Rebuild with:**
- Skeleton cards
- Skeleton tables
- Skeleton charts
- Progress indicators

#### 10. **Error States** ⚠️
**Current:** Not shown
**Need:** Error boundaries with retry

**Rebuild with:**
- Error boundary component
- Inline error messages
- Retry actions
- Offline state handling

---

### Migration Plan

#### Phase 1: Foundation (Week 1)
1. Create shared UI components from prototype patterns:
   - Button, Card, Badge, Tag, Progress
   - Table, Tabs, Modal, Toast
   - Form inputs (Text, Select, Checkbox, Radio)
2. Implement navigation structure (5 groups)
3. Set up routing
4. Add loading/error/empty states

#### Phase 2: Core Pages (Weeks 2-4)
1. Dashboard (wire to Supabase)
2. Calendar (implement with react-day-picker)
3. Assets (grid view with filters)
4. Templates (card view with preview)

#### Phase 3: Distribution (Weeks 5-6)
1. Email Sequences (list + detail)
2. Email Editor (split-pane)
3. Mailing Lists (segment builder)
4. Channels (configuration)

#### Phase 4: Journey (Weeks 7-9)
1. Journey Pipeline (visual stages)
2. Journey Builder (drag-drop canvas)
3. Triggers (condition builder)
4. VISTA Handoff (queue)

#### Phase 5: Intelligence (Weeks 10-11)
1. Analytics (charts with recharts)
2. Campaigns (list + detail)
3. Reports (custom builder)

#### Phase 6: Polish (Weeks 12-13)
1. Mobile responsiveness
2. Accessibility audit
3. Animation/micro-interactions
4. Performance optimization

---

## Summary

### What We Learned

1. **Entity Model is Solid** — Supabase schema covers all core entities with proper relationships

2. **Information Architecture Needs Fix** — HTML prototype has correct 5-group structure, React app has flat navigation

3. **User Flows Reveal Missing Features** — 5 core flows show what pages need to support (forms, detail views, approvals, etc.)

4. **Prototype is Visual Reference** — HTML prototype shows intended design, React app should match it

5. **Missing Tables Needed** — approval_queue, repurposing_projects, repurposing_outputs

### What to Do Next

1. **Add missing tables** to Supabase schema (approval_queue, repurposing_projects, repurposing_outputs)

2. **Restructure Sidebar** to match HTML prototype (5 groups)

3. **Build shared components** from prototype patterns

4. **Implement core flows** in order:
   - Content creation → Calendar
   - Email sequences → Distribution
   - Journey building → Journey
   - Agent approvals → Agent Bridge

5. **Wire to Supabase** as you build each page

### Effort Estimate

- Entity Relationship Diagram: 4h ✅ (this document)
- Information Architecture: 4h ✅ (this document)
- Core User Flows: 6h ✅ (this document)
- Prototype Reconciliation: 3h ✅ (this document)
- **Total: 17h** ✅

### Deliverables

✅ This document (15_Product_Design_Foundation.md)
✅ Entity relationship diagrams
✅ Information architecture (current vs recommended)
✅ 5 core user flows with touchpoints and entities
✅ Prototype reconciliation (keep vs rebuild)
✅ Migration plan (6 phases, 13 weeks)

