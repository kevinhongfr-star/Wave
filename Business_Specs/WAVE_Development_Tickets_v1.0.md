# WAVE — Development Tickets for Trae

**Version:** 1.0  
**Date:** 2026-07-10  
**Total Tickets:** 87  
**Estimated Total Effort:** ~120 hours (3 weeks with full-time focus)

---

## Infrastructure & Setup (8 tickets)

### TICKET-001: Initialize Next.js Project
**Priority:** P0 | **Effort:** 2h | **Dependencies:** None

**Description:**
Set up Next.js 14+ project with TypeScript, Tailwind CSS, and required dependencies.

**Tasks:**
- `npx create-next-app@latest wave-app --typescript --tailwind --eslint`
- Install Supabase client: `npm install @supabase/supabase-js`
- Install DeepSeek SDK or create HTTP client
- Set up environment variables (.env.local)
- Configure Vercel deployment

**Acceptance Criteria:**
- [ ] `npm run dev` starts without errors
- [ ] Supabase client initializes successfully
- [ ] Environment variables load correctly
- [ ] Project deployed to Vercel (staging)

---

### TICKET-002: Supabase Schema & Migrations
**Priority:** P0 | **Effort:** 4h | **Dependencies:** TICKET-001

**Description:**
Create all database tables based on BRD data model specs.

**Tables to create:**
- `campaigns` (id, name, objective, target_clusters, target_products, start_date, end_date, status, created_by, created_at)
- `content_assets` (id, title, type, channel, campaign_id, status, owner, due_date, source_asset_id, created_at, published_at, published_url)
- `templates` (id, name, type, description, content, variables, created_by, created_at)
- `email_sequences` (id, name, trigger_type, trigger_config, status, created_by)
- `sequence_emails` (id, sequence_id, order, subject, preview_text, content, delay_days)
- `mailing_lists` (id, name, filters, auto_update, created_by)
- `journeys` (id, name, description, trigger_type, trigger_config, status, created_by)
- `events` (id, title, type, description, start_at, end_at, duration_minutes, capacity, price, registration_url, created_by)
- `event_registrations` (id, event_id, contact_id, registered_at, payment_status, ticket_type, custom_fields)
- `repurposing_maps` (id, source_asset_id, name, created_by)
- `repurposing_derivatives` (id, map_id, derivative_type, template_id, owner, due_date_offset_days, status)
- `content_metrics`, `email_metrics`, `journey_metrics`, `campaign_metrics` (analytics tables)

**Acceptance Criteria:**
- [ ] All tables created in Supabase
- [ ] Foreign keys configured correctly
- [ ] Indexes added for frequent queries
- [ ] RLS (Row Level Security) policies configured
- [ ] Migration script saved to `/supabase/migrations/`

---

### TICKET-003: Supabase Client & Auth Setup
**Priority:** P0 | **Effort:** 2h | **Dependencies:** TICKET-002

**Description:**
Configure Supabase client with authentication and real-time subscriptions.

**Tasks:**
- Create `lib/supabase.ts` with client initialization
- Set up Supabase Auth (email/password or magic link)
- Configure RLS policies for each table
- Set up real-time subscriptions

**Acceptance Criteria:**
- [ ] User can log in/log out
- [ ] RLS prevents unauthorized access
- [ ] Real-time subscriptions work (test with dummy data)
- [ ] Service role key used only in API routes (not client-side)

---

### TICKET-004: DeepSeek API Integration
**Priority:** P0 | **Effort:** 3h | **Dependencies:** TICKET-001

**Description:**
Create DeepSeek API client with flash and pro models.

**Tasks:**
- Create `lib/deepseek.ts` with `callDeepSeek()` function
- Support both flash (deepseek-chat) and pro (deepseek-reasoner) models
- Implement rate limiting (10 req/sec flash, 3 req/sec pro)
- Add error handling and retry logic
- Add token usage tracking

**Acceptance Criteria:**
- [ ] `callDeepSeek(prompt, { model: 'flash' })` returns response in < 3s
- [ ] `callDeepSeek(prompt, { model: 'pro' })` returns response in < 30s
- [ ] Rate limiting prevents API quota exceeded errors
- [ ] Token usage logged to `api_usage_logs` table

---

### TICKET-005: Layout & Navigation Shell
**Priority:** P1 | **Effort:** 3h | **Dependencies:** TICKET-001

**Description:**
Create app layout with sidebar navigation matching brand guidelines.

**Tasks:**
- Sidebar with WAVE logo + navigation links
- Topbar with breadcrumb navigation
- Brand colors: #0F1115 (primary), #F5F5F5 (secondary), #C108AB (accent)
- Fonts: Crimson Pro (headlines), Inter (body)
- Responsive design (mobile hamburger menu)

**Acceptance Criteria:**
- [ ] Sidebar displays all 7 module links
- [ ] Active page highlighted with fuchsia accent
- [ ] Topbar shows current location
- [ ] Mobile menu works on screens < 768px
- [ ] Matches HTML prototype visual design

---

### TICKET-006: Dashboard Page
**Priority:** P1 | **Effort:** 4h | **Dependencies:** TICKET-005

**Description:**
Create dashboard with KPI cards and executive brief.

**Tasks:**
- KPI cards: active campaigns, content published this week, email open rate, journey conversions
- Executive brief (AI-generated via DeepSeek)
- Recent activity feed
- Quick action buttons (Create Campaign, Schedule Content, Send Email)

**Acceptance Criteria:**
- [ ] KPI cards display real data from Supabase
- [ ] Executive brief auto-generates on page load
- [ ] Activity feed shows last 10 actions
- [ ] Quick action buttons open modals

---

### TICKET-007: Error Handling & Toast Notifications
**Priority:** P2 | **Effort:** 2h | **Dependencies:** TICKET-001

**Description:**
Global error handling and toast notification system.

**Tasks:**
- Create `components/Toast.tsx` with success/error/warning variants
- Create error boundary for unhandled exceptions
- API route error handling middleware
- Display validation errors in forms

**Acceptance Criteria:**
- [ ] Toast appears on successful actions (e.g., "Campaign created")
- [ ] Toast appears on errors (e.g., "Failed to save content")
- [ ] Error boundary catches crashes and shows friendly message
- [ ] Form validation errors display inline

---

### TICKET-008: Loading States & Skeletons
**Priority:** P2 | **Effort:** 2h | **Dependencies:** TICKET-005

**Description:**
Loading skeletons for all pages to improve perceived performance.

**Tasks:**
- Create skeleton components for cards, tables, charts
- Show skeletons while data loads from Supabase
- Add "Loading..." text for AI generation actions

**Acceptance Criteria:**
- [ ] Dashboard shows skeleton while KPIs load
- [ ] Content calendar shows skeleton while events load
- [ ] AI generation shows "Generating..." with spinner

---

## Module 1: Content Command Center (12 tickets)

### TICKET-009: Content Calendar Page — Grid View
**Priority:** P0 | **Effort:** 5h | **Dependencies:** TICKET-005, TICKET-002

**Description:**
Calendar view showing all planned content across channels.

**Tasks:**
- Calendar grid (day/week/month toggle)
- Color-coded by content type (newsletter, LinkedIn, podcast, webinar, article, YouTube)
- Click content → opens detail modal
- Drag-and-drop to reschedule (nice-to-have)

**Acceptance Criteria:**
- [ ] Calendar displays content from `content_assets` table
- [ ] Each content piece shows title, channel icon, status badge
- [ ] Click opens modal with full details
- [ ] Filter by channel, status, owner

---

### TICKET-010: Content Calendar — Create/Edit Content Modal
**Priority:** P0 | **Effort:** 4h | **Dependencies:** TICKET-009

**Description:**
Modal for creating and editing content assets.

**Tasks:**
- Form fields: title, type, channel, campaign, owner, due date, description
- Rich text editor for content body (or markdown)
- Save as draft or schedule for publishing
- Link to campaign (dropdown)

**Acceptance Criteria:**
- [ ] Modal opens on "New Content" button click
- [ ] Form validates required fields
- [ ] Saves to `content_assets` table
- [ ] Calendar refreshes to show new content

---

### TICKET-011: Content Calendar — Status Workflow
**Priority:** P1 | **Effort:** 3h | **Dependencies:** TICKET-009

**Description:**
Status workflow: idea → draft → review → approved → scheduled → published.

**Tasks:**
- Status dropdown in content detail modal
- Color-coded status badges
- Auto-update `published_at` when status = 'published'
- Filter by status on calendar view

**Acceptance Criteria:**
- [ ] Status changes save to database
- [ ] Published content shows green badge
- [ ] Overdue content (past due date, not published) shows red badge

---

### TICKET-012: Campaign Planning — List View
**Priority:** P0 | **Effort:** 3h | **Dependencies:** TICKET-002

**Description:**
Table view of all campaigns with status, date range, linked content count.

**Tasks:**
- Table columns: name, objective, target clusters, target products, start date, end date, status, content count
- Filter by status (planning, active, completed)
- Sort by date, status
- Click campaign → opens detail page

**Acceptance Criteria:**
- [ ] Table displays all campaigns from `campaigns` table
- [ ] Content count shows linked `content_assets` count
- [ ] Click navigates to campaign detail page

---

### TICKET-013: Campaign Planning — Create/Edit Campaign
**Priority:** P0 | **Effort:** 4h | **Dependencies:** TICKET-012

**Description:**
Form for creating and editing campaigns.

**Tasks:**
- Form fields: name, objective, target clusters (multi-select), target products (multi-select), start/end dates
- Save as draft or activate
- Auto-generate campaign description with AI (DeepSeek)

**Acceptance Criteria:**
- [ ] Form validates required fields
- [ ] Multi-select dropdowns for clusters (7 options) and products (11 options)
- [ ] Saves to `campaigns` table
- [ ] "Generate with AI" button calls DeepSeek to write description

---

### TICKET-014: Campaign Detail Page — Overview
**Priority:** P1 | **Effort:** 4h | **Dependencies:** TICKET-012

**Description:**
Campaign detail page showing overview, linked content, email sequences, KPIs.

**Tasks:**
- Campaign header: name, objective, dates, status
- Tabs: Overview, Content, Email Sequences, Analytics
- Overview tab: description, target clusters/products, linked content count, email sequences count
- KPIs: content count, total reach, total engagement, conversions, ROI

**Acceptance Criteria:**
- [ ] Overview displays campaign metadata
- [ ] KPIs calculate from linked content and email metrics
- [ ] Tabs switch without page reload

---

### TICKET-015: Campaign Detail Page — Content Tab
**Priority:** P1 | **Effort:** 3h | **Dependencies:** TICKET-014

**Description:**
Campaign detail page — Content tab showing all linked content assets.

**Tasks:**
- Table of linked `content_assets` (filtered by campaign_id)
- Columns: title, type, channel, status, owner, due date
- "Add Content" button → opens TICKET-010 modal with campaign pre-selected
- Bulk actions: change status, assign owner

**Acceptance Criteria:**
- [ ] Table shows only content linked to this campaign
- [ ] "Add Content" pre-fills campaign field
- [ ] Bulk actions update multiple content pieces

---

### TICKET-016: Campaign Detail Page — Email Sequences Tab
**Priority:** P1 | **Effort:** 4h | **Dependencies:** TICKET-014

**Description:**
Campaign detail page — Email Sequences tab showing linked sequences.

**Tasks:**
- Table of linked `email_sequences` (filtered by campaign_id)
- Columns: name, trigger, status, email count
- "Create Sequence" button → opens sequence builder

**Acceptance Criteria:**
- [ ] Table shows only sequences linked to this campaign
- [ ] Click sequence → opens sequence detail page

---

### TICKET-017: Asset Status Dashboard
**Priority:** P1 | **Effort:** 3h | **Dependencies:** TICKET-002

**Description:**
Table view of all content assets with filters and bulk actions.

**Tasks:**
- Table columns: title, type, channel, status, owner, due date
- Filters: type, channel, status, owner, campaign
- Bulk actions: change status, assign owner, delete
- Sort by due date, status, owner

**Acceptance Criteria:**
- [ ] Table displays all content assets
- [ ] Filters work (multi-select for type, channel, status, owner)
- [ ] Bulk actions update selected rows
- [ ] Overdue items highlighted in red

---

### TICKET-018: Cross-Channel Visibility — Derivative Flow
**Priority:** P2 | **Effort:** 5h | **Dependencies:** TICKET-009

**Description:**
Visual flow diagram showing content derivatives (source → derivatives).

**Tasks:**
- Tree diagram: source asset at top, derivatives branching below
- Click node → opens asset detail
- Color-code by channel

**Acceptance Criteria:**
- [ ] Diagram shows source_asset_id relationships
- [ ] Click node opens modal with asset details
- [ ] Diagram updates when new derivatives added

---

### TICKET-019: Content Calendar — Conflict Detection
**Priority:** P2 | **Effort:** 3h | **Dependencies:** TICKET-009

**Description:**
Warn user if scheduling 2+ content pieces on same channel same day.

**Tasks:**
- On content save, check for conflicts (same channel, same date)
- Display warning modal: "Conflict detected: 2 newsletters on July 15. Continue?"
- Suggest alternative dates

**Acceptance Criteria:**
- [ ] Warning appears when conflict detected
- [ ] User can override and continue
- [ ] Suggested dates don't have conflicts

---

### TICKET-020: Content Calendar — Export to CSV
**Priority:** P2 | **Effort:** 1h | **Dependencies:** TICKET-009

**Description:**
Export content calendar data to CSV for reporting.

**Tasks:**
- "Export CSV" button on calendar page
- Generate CSV with columns: title, type, channel, status, owner, due date, campaign

**Acceptance Criteria:**
- [ ] CSV downloads successfully
- [ ] CSV includes all visible content (respecting filters)

---

## Module 2: Template & Asset Library (10 tickets)

### TICKET-021: Template Library — List View
**Priority:** P0 | **Effort:** 3h | **Dependencies:** TICKET-002

**Description:**
Grid/list view of all templates with search and filters.

**Tasks:**
- Grid of template cards (name, type, description)
- Search by name
- Filter by type (newsletter, webinar promo, LinkedIn post, etc.)
- Click template → opens preview modal

**Acceptance Criteria:**
- [ ] Grid displays all templates from `templates` table
- [ ] Search filters in real-time
- [ ] Click opens preview modal

---

### TICKET-022: Template Library — Preview Modal
**Priority:** P0 | **Effort:** 3h | **Dependencies:** TICKET-021

**Description:**
Modal showing template preview with variables highlighted.

**Tasks:**
- Render template content (markdown/HTML)
- Highlight variables (e.g., `{{product_name}}`) in yellow
- "Use Template" button → creates new content asset from template

**Acceptance Criteria:**
- [ ] Template renders correctly
- [ ] Variables highlighted
- [ ] "Use Template" opens TICKET-010 modal with template pre-filled

---

### TICKET-023: Template Library — Create/Edit Template
**Priority:** P1 | **Effort:** 4h | **Dependencies:** TICKET-021

**Description:**
Form for creating and editing templates.

**Tasks:**
- Form fields: name, type, description, content (rich text editor), variables (JSON)
- Variable syntax: `{{variable_name}}`
- Preview template with sample variable values

**Acceptance Criteria:**
- [ ] Form validates required fields
- [ ] Variables parsed and stored as JSON
- [ ] Preview shows template with sample values

---

### TICKET-024: AI Content Generation — From Template
**Priority:** P0 | **Effort:** 5h | **Dependencies:** TICKET-023, TICKET-004

**Description:**
Generate content from template + variables using DeepSeek.

**Tasks:**
- Select template → fill variables (product, cluster, key message, tone)
- Click "Generate with AI" → calls `/api/intelligence/generate-content`
- Display generated draft in editor
- User edits draft before saving

**Acceptance Criteria:**
- [ ] AI generates content in < 10 seconds
- [ ] Generated content respects brand voice guidelines
- [ ] User can edit before saving
- [ ] Saves to `content_assets` table

---

### TICKET-025: Asset Versioning — History
**Priority:** P2 | **Effort:** 3h | **Dependencies:** TICKET-010

**Description:**
Show version history for each content asset.

**Tasks:**
- "Version History" tab in content detail modal
- Table: version number, editor, timestamp, changes summary
- "Revert to this version" button

**Acceptance Criteria:**
- [ ] Version history displays all versions
- [ ] "Revert" creates new version with old content

---

### TICKET-026: Asset Tagging & Search
**Priority:** P1 | **Effort:** 3h | **Dependencies:** TICKET-010

**Description:**
Tag content assets by product, cluster, topic. Search by tags.

**Tasks:**
- Tag input field in content detail modal
- Auto-suggest tags (product names, cluster names)
- Search bar: filter by tags
- Tag cloud on asset status dashboard

**Acceptance Criteria:**
- [ ] Tags save to `asset_tags` table
- [ ] Search returns matching assets
- [ ] Tag cloud shows top 10 tags

---

### TICKET-027: Template Library — Duplicate Template
**Priority:** P2 | **Effort:** 1h | **Dependencies:** TICKET-021

**Description:**
Duplicate an existing template.

**Tasks:**
- "Duplicate" button on template card
- Creates copy with "(Copy)" suffix

**Acceptance Criteria:**
- [ ] Duplicate button creates new template
- [ ] New template has same content, new name

---

### TICKET-028: Template Library — Delete Template
**Priority:** P2 | **Effort:** 1h | **Dependencies:** TICKET-021

**Description:**
Delete a template with confirmation.

**Tasks:**
- "Delete" button on template card
- Confirmation modal: "Are you sure?"
- Soft delete (mark as deleted, don't remove from DB)

**Acceptance Criteria:**
- [ ] Delete button removes template from list
- [ ] Confirmation modal prevents accidental deletion

---

### TICKET-029: Template Library — Import Template
**Priority:** P2 | **Effort:** 2h | **Dependencies:** TICKET-021

**Description:**
Import template from markdown file.

**Tasks:**
- "Import" button on template library page
- Upload .md file
- Parse markdown → create template

**Acceptance Criteria:**
- [ ] Import button opens file picker
- [ ] Markdown parsed into template content
- [ ] Template saved to database

---

### TICKET-030: Template Library — Export Template
**Priority:** P2 | **Effort:** 1h | **Dependencies:** TICKET-021

**Description:**
Export template as markdown file.

**Tasks:**
- "Export" button on template card
- Generate .md file with template content

**Acceptance Criteria:**
- [ ] Export button downloads .md file
- [ ] File contains template content

---

## Module 3: Distribution Engine (13 tickets)

### TICKET-031: Email Sequence Builder — List View
**Priority:** P0 | **Effort:** 3h | **Dependencies:** TICKET-002

**Description:**
Table view of all email sequences.

**Tasks:**
- Table columns: name, trigger, status, email count, campaign
- Filter by status (active, inactive, draft)
- Click sequence → opens builder

**Acceptance Criteria:**
- [ ] Table displays all sequences from `email_sequences` table
- [ ] Email count shows linked `sequence_emails` count

---

### TICKET-032: Email Sequence Builder — Create/Edit Sequence
**Priority:** P0 | **Effort:** 5h | **Dependencies:** TICKET-031

**Description:**
Form for creating email sequences with multiple emails.

**Tasks:**
- Sequence form: name, trigger type (manual, on campaign start, on assessment completion), trigger config
- Email list: add/remove emails, drag to reorder
- Each email form: subject, preview text, content (from template), delay days
- Save as draft or activate

**Acceptance Criteria:**
- [ ] Sequence saves to `email_sequences` table
- [ ] Emails save to `sequence_emails` table
- [ ] Drag-and-drop reorders emails
- [ ] "Activate" sets status = 'active'

---

### TICKET-033: Email Sequence Builder — Preview Timeline
**Priority:** P1 | **Effort:** 3h | **Dependencies:** TICKET-032

**Description:**
Visual timeline showing email sequence flow.

**Tasks:**
- Timeline: email 1 (day 0) → wait 3 days → email 2 (day 3) → wait 7 days → email 3 (day 10)
- Click email → opens email detail

**Acceptance Criteria:**
- [ ] Timeline displays all emails in sequence
- [ ] Delay days shown between emails
- [ ] Click opens email detail modal

---

### TICKET-034: Mailing List Builder — List View
**Priority:** P0 | **Effort:** 3h | **Dependencies:** TICKET-002

**Description:**
Table view of all mailing lists.

**Tasks:**
- Table columns: name, filters, contact count, auto-update
- Filter by auto-update (yes/no)
- Click list → opens builder

**Acceptance Criteria:**
- [ ] Table displays all lists from `mailing_lists` table
- [ ] Contact count shows linked contacts

---

### TICKET-035: Mailing List Builder — Create/Edit List
**Priority:** P0 | **Effort:** 5h | **Dependencies:** TICKET-034

**Description:**
Form for creating mailing lists with filters.

**Tasks:**
- List form: name, auto-update (yes/no)
- Filter builder: cluster IN [...], diagnostic_history IN [...], engagement_score > X
- Preview contacts matching filters
- Save list

**Acceptance Criteria:**
- [ ] List saves to `mailing_lists` table
- [ ] Filters save as JSON
- [ ] Preview shows matching contacts (top 10)

---

### TICKET-036: Mailing List — Manual Add/Remove Contacts
**Priority:** P1 | **Effort:** 3h | **Dependencies:** TICKET-035

**Description:**
Manually add or remove contacts from mailing list.

**Tasks:**
- "Add Contacts" button → search contacts, select, add
- "Remove" button on contact row → remove from list
- Bulk add/remove

**Acceptance Criteria:**
- [ ] Contacts save to `mailing_list_contacts` table
- [ ] List updates to show new contact count

---

### TICKET-037: Content Scheduling — Calendar View
**Priority:** P1 | **Effort:** 4h | **Dependencies:** TICKET-009

**Description:**
Calendar view for scheduling content publication.

**Tasks:**
- Calendar shows scheduled content (from `content_schedules` table)
- Click date → "Schedule Content" modal
- Select content asset, channel, scheduled date/time
- Conflict detection (same channel, same day)

**Acceptance Criteria:**
- [ ] Calendar displays scheduled content
- [ ] Schedule modal saves to `content_schedules` table
- [ ] Conflict detection warns user

---

### TICKET-038: Multi-Channel Routing — Publish Action
**Priority:** P0 | **Effort:** 5h | **Dependencies:** TICKET-037

**Description:**
Route content to appropriate channel (LinkedIn, Ausha, Vercel, etc.).

**Tasks:**
- "Publish" button on content detail modal
- Select channel(s): LinkedIn, podcast, newsletter, website, YouTube
- Call agent trigger route (`/api/trigger/echo`, etc.)
- Update `content_assets.status` = 'published'
- Update `content_assets.published_url`

**Acceptance Criteria:**
- [ ] Publish button triggers agent
- [ ] Agent writes to Supabase
- [ ] Content status updates to 'published'
- [ ] Published URL displays in content detail

---

### TICKET-039: Email Sequence — Send Action
**Priority:** P0 | **Effort:** 5h | **Dependencies:** TICKET-032

**Description:**
Send email sequence to mailing list.

**Tasks:**
- "Send Sequence" button on sequence detail page
- Select mailing list
- Call Maria agent (`/api/trigger/maria`)
- Log to `email_metrics` table

**Acceptance Criteria:**
- [ ] Send button triggers Maria agent
- [ ] Maria sends emails via email API
- [ ] Metrics log to `email_metrics` table

---

### TICKET-040: Email Sequence — Performance Metrics
**Priority:** P1 | **Effort:** 3h | **Dependencies:** TICKET-039

**Description:**
Display email sequence performance metrics.

**Tasks:**
- Metrics: sent, opened, clicked, unsubscribed, bounced
- Open rate, click rate, unsubscribe rate
- Per-email breakdown

**Acceptance Criteria:**
- [ ] Metrics display from `email_metrics` table
- [ ] Rates calculate correctly
- [ ] Per-email breakdown shows individual performance

---

### TICKET-041: Email Sequence — A/B Test (Optional)
**Priority:** P2 | **Effort:** 5h | **Dependencies:** TICKET-032

**Description:**
A/B test email subject lines or content.

**Tasks:**
- Create two variants (A and B)
- Split mailing list 50/50
- Send variant A to group A, variant B to group B
- Compare open rates after 24 hours

**Acceptance Criteria:**
- [ ] A/B test creates two email variants
- [ ] Mailing list splits evenly
- [ ] Results compare open rates

---

### TICKET-042: Email Sequence — Export Metrics
**Priority:** P2 | **Effort:** 1h | **Dependencies:** TICKET-040

**Description:**
Export email metrics to CSV.

**Tasks:**
- "Export CSV" button on sequence detail page
- Generate CSV with metrics

**Acceptance Criteria:**
- [ ] CSV downloads successfully

---

### TICKET-043: Mailing List — Auto-Update Logic
**Priority:** P1 | **Effort:** 4h | **Dependencies:** TICKET-035

**Description:**
Auto-update mailing list as contacts change.

**Tasks:**
- Cron job: every hour, re-evaluate filters
- Add new contacts matching filters
- Remove contacts no longer matching

**Acceptance Criteria:**
- [ ] Cron job runs hourly
- [ ] List updates automatically
- [ ] Contact count reflects changes

---

## Module 4: B2C Journey Engine (11 tickets)

### TICKET-044: Journey Builder — List View
**Priority:** P0 | **Effort:** 3h | **Dependencies:** TICKET-002

**Description:**
Table view of all B2C journeys.

**Tasks:**
- Table columns: name, trigger, status, entry count, completion rate
- Filter by status (draft, active, paused)
- Click journey → opens builder

**Acceptance Criteria:**
- [ ] Table displays all journeys from `journeys` table
- [ ] Completion rate calculates from `journey_instances`

---

### TICKET-045: Journey Builder — Visual Flow Editor
**Priority:** P0 | **Effort:** 8h | **Dependencies:** TICKET-044

**Description:**
Drag-and-drop journey builder with nodes and edges.

**Tasks:**
- Canvas with grid background
- Node types: trigger, email, wait, condition, action, end
- Drag nodes from sidebar to canvas
- Connect nodes with edges (arrows)
- Save journey (nodes → `journey_nodes`, edges → `journey_edges`)

**Acceptance Criteria:**
- [ ] Nodes drag-and-drop onto canvas
- [ ] Edges connect nodes
- [ ] Journey saves to database
- [ ] Journey loads correctly on re-open

---

### TICKET-046: Journey Builder — Node Configuration
**Priority:** P0 | **Effort:** 5h | **Dependencies:** TICKET-045

**Description:**
Configure each node type.

**Tasks:**
- Trigger node: select trigger type (assessment completed, content viewed, etc.)
- Email node: select email sequence
- Wait node: set delay (days, hours)
- Condition node: set condition (if assessment_score > X, then ...)
- Action node: select action (send email, create lead in VISTA, etc.)

**Acceptance Criteria:**
- [ ] Each node type opens config modal
- [ ] Config saves to `journey_nodes.config` (JSON)
- [ ] Validation prevents invalid configs

---

### TICKET-047: Journey — Activate/Pause
**Priority:** P1 | **Effort:** 2h | **Dependencies:** TICKET-045

**Description:**
Activate or pause a journey.

**Tasks:**
- "Activate" button → status = 'active'
- "Pause" button → status = 'paused'
- When active, new entries trigger journey

**Acceptance Criteria:**
- [ ] Activate button updates status
- [ ] Pause button updates status
- [ ] Active journeys trigger on new entries

---

### TICKET-048: Journey — Entry Trigger
**Priority:** P0 | **Effort:** 5h | **Dependencies:** TICKET-047

**Description:**
Trigger journey entry based on event (assessment completed, content viewed, etc.).

**Tasks:**
- Listen for events (Supabase Realtime or webhook)
- Match event to journey trigger
- Create `journey_instances` record
- Start journey execution

**Acceptance Criteria:**
- [ ] Journey triggers on matching event
- [ ] `journey_instances` record created
- [ ] Journey executes first node

---

### TICKET-049: Journey — Execution Engine
**Priority:** P0 | **Effort:** 8h | **Dependencies:** TICKET-048

**Description:**
Execute journey nodes in sequence.

**Tasks:**
- Cron job: every 5 minutes, check `journey_instances`
- For each active instance:
  - Execute current node (send email, wait, check condition)
  - Move to next node (based on edge)
  - Update `journey_instances.current_node_id`
- Log events to `journey_events` table

**Acceptance Criteria:**
- [ ] Cron job runs every 5 minutes
- [ ] Journey executes correctly
- [ ] Events log to `journey_events`

---

### TICKET-050: Journey — Diagnostic-Triggered Cross-Sell
**Priority:** P1 | **Effort:** 5h | **Dependencies:** TICKET-048

**Description:**
After assessment completion, suggest related assessments.

**Tasks:**
- Trigger: user completes LEAP
- Logic: wait 7 days → suggest PRISM → wait 7 days → suggest Council
- Create journey with cross-sell logic

**Acceptance Criteria:**
- [ ] Cross-sell journey triggers on assessment completion
- [ ] Suggestions send via email
- [ ] Tracks: suggestion sent, accepted, ignored

---

### TICKET-051: Journey — B2B Signal Detection
**Priority:** P1 | **Effort:** 5h | **Dependencies:** TICKET-048

**Description:**
Detect B2B signals from B2C buyers and route to VISTA.

**Tasks:**
- Check B2B signals: job title contains "Director", "VP", "C-level"; company size > 500; multiple team members from same company
- When detected → INSERT INTO `vista_contacts` with source='WAVE_B2C'
- Notify NEXUS via Feishu

**Acceptance Criteria:**
- [ ] B2B signals detected
- [ ] Lead created in VISTA
- [ ] NEXUS notified

---

### TICKET-052: Journey — Analytics Dashboard
**Priority:** P1 | **Effort:** 4h | **Dependencies:** TICKET-044

**Description:**
Journey performance metrics: entry count, completion rate, avg time, conversion by stage.

**Tasks:**
- Funnel visualization: show drop-off at each stage
- Metrics: entry count, completion rate, avg time to complete
- Export data as CSV

**Acceptance Criteria:**
- [ ] Funnel displays correctly
- [ ] Metrics calculate from `journey_instances` and `journey_events`
- [ ] Export works

---

### TICKET-053: Journey — Duplicate Journey
**Priority:** P2 | **Effort:** 2h | **Dependencies:** TICKET-044

**Description:**
Duplicate an existing journey.

**Tasks:**
- "Duplicate" button on journey list
- Creates copy with "(Copy)" suffix
- Copy all nodes and edges

**Acceptance Criteria:**
- [ ] Duplicate button creates new journey
- [ ] All nodes and edges copied

---

### TICKET-054: Journey — Delete Journey
**Priority:** P2 | **Effort:** 1h | **Dependencies:** TICKET-044

**Description:**
Delete a journey with confirmation.

**Tasks:**
- "Delete" button on journey list
- Confirmation modal
- Soft delete (mark as deleted)

**Acceptance Criteria:**
- [ ] Delete button removes journey from list
- [ ] Confirmation modal prevents accidental deletion

---

## Module 5: Content Repurposing Engine (7 tickets)

### TICKET-055: Repurposing Map Builder — Create Map
**Priority:** P0 | **Effort:** 5h | **Dependencies:** TICKET-004

**Description:**
Define how one content piece should be repurposed.

**Tasks:**
- Select source asset
- Add derivatives: type, channel, template, owner, due date offset
- Save as "repurposing map"

**Acceptance Criteria:**
- [ ] Map saves to `repurposing_maps` table
- [ ] Derivatives save to `repurposing_derivatives` table

---

### TICKET-056: Repurposing Map Builder — AI-Generated Map
**Priority:** P0 | **Effort:** 5h | **Dependencies:** TICKET-055, TICKET-004

**Description:**
AI suggests 10+ derivatives from source content.

**Tasks:**
- Click "Generate with AI" → calls `/api/intelligence/generate-repurposing-map`
- DeepSeek suggests derivatives
- User reviews/approves
- Save to database

**Acceptance Criteria:**
- [ ] AI generates 10+ derivatives
- [ ] User can edit before saving
- [ ] Map saves correctly

---

### TICKET-057: Repurposing — Automated Derivative Generation
**Priority:** P0 | **Effort:** 6h | **Dependencies:** TICKET-055

**Description:**
When source asset published, auto-generate derivatives.

**Tasks:**
- Trigger: source asset status = 'published'
- For each derivative: call DeepSeek to generate content
- Save drafts to `content_assets` table
- Route to owners for review

**Acceptance Criteria:**
- [ ] Derivatives auto-generate when source published
- [ ] Drafts save to database
- [ ] Owners notified via Feishu

---

### TICKET-058: Repurposing — Status Tracking Dashboard
**Priority:** P1 | **Effort:** 4h | **Dependencies:** TICKET-055

**Description:**
Dashboard showing source asset → derivative tree with status.

**Tasks:**
- Tree view: source at top, derivatives branching below
- Status for each derivative: pending, draft, review, approved, published
- Time-to-publish for each derivative

**Acceptance Criteria:**
- [ ] Tree displays correctly
- [ ] Status updates in real-time
- [ ] Time-to-publish calculates correctly

---

### TICKET-059: Repurposing — ROI Metrics
**Priority:** P1 | **Effort:** 3h | **Dependencies:** TICKET-058

**Description:**
Track repurposing ROI: 1 source → N derivatives.

**Tasks:**
- Metrics: derivative count, total reach, time-to-publish, cost per derivative
- Display on dashboard

**Acceptance Criteria:**
- [ ] Metrics calculate correctly
- [ ] Dashboard displays metrics

---

### TICKET-060: Repurposing — Edit Derivative
**Priority:** P1 | **Effort:** 2h | **Dependencies:** TICKET-055

**Description:**
Edit a derivative before publishing.

**Tasks:**
- Click derivative → opens content editor
- Edit content
- Save changes

**Acceptance Criteria:**
- [ ] Editor opens correctly
- [ ] Changes save to database

---

### TICKET-061: Repurposing — Delete Map
**Priority:** P2 | **Effort:** 1h | **Dependencies:** TICKET-055

**Description:**
Delete a repurposing map with confirmation.

**Tasks:**
- "Delete" button on map
- Confirmation modal
- Soft delete

**Acceptance Criteria:**
- [ ] Delete button removes map from list
- [ ] Confirmation modal prevents accidental deletion

---

## Module 6: Registration & Event Management (10 tickets)

### TICKET-062: Event Creation — Form
**Priority:** P0 | **Effort:** 4h | **Dependencies:** TICKET-002

**Description:**
Form for creating events.

**Tasks:**
- Form fields: title, type (webinar/workshop/program/event), date/time, duration, description, capacity, price
- Save event

**Acceptance Criteria:**
- [ ] Form validates required fields
- [ ] Event saves to `events` table

---

### TICKET-063: Registration Form Builder
**Priority:** P0 | **Effort:** 5h | **Dependencies:** TICKET-062

**Description:**
Build custom registration forms for events.

**Tasks:**
- Drag-and-drop form builder
- Field types: text, email, company, job title, dropdown, checkbox
- Save form to `registration_forms` table
- Generate unique registration URL

**Acceptance Criteria:**
- [ ] Form builder works (drag-and-drop)
- [ ] Form saves to database
- [ ] Registration URL generates correctly

---

### TICKET-064: Registration Page — Public Form
**Priority:** P0 | **Effort:** 4h | **Dependencies:** TICKET-063

**Description:**
Public registration page for attendees.

**Tasks:**
- Render registration form based on `registration_forms` config
- Validate inputs
- On submit → create `event_registrations` record
- Send confirmation email (via Emily agent)

**Acceptance Criteria:**
- [ ] Form renders correctly
- [ ] Validation works
- [ ] Registration saves to database
- [ ] Confirmation email sends

---

### TICKET-065: Payment Integration (Stripe)
**Priority:** P0 | **Effort:** 6h | **Dependencies:** TICKET-062

**Description:**
Integrate Stripe for paid events.

**Tasks:**
- Install Stripe SDK
- Create Stripe checkout session
- Handle webhook (payment succeeded/failed)
- Update `event_registrations.payment_status`

**Acceptance Criteria:**
- [ ] Checkout session creates successfully
- [ ] Webhook handles payment events
- [ ] Payment status updates correctly

---

### TICKET-066: Event Reminders — Automated Emails
**Priority:** P1 | **Effort:** 4h | **Dependencies:** TICKET-064

**Description:**
Send automated reminder emails before event.

**Tasks:**
- Cron job: daily at 9am
- Check events in next 7 days
- Send reminder emails to registered attendees
- Log to `event_reminders` table

**Acceptance Criteria:**
- [ ] Cron job runs daily
- [ ] Reminders send at correct intervals (7 days, 1 day, 1 hour)
- [ ] Reminders log to database

---

### TICKET-067: Event Registrations — List View
**Priority:** P0 | **Effort:** 3h | **Dependencies:** TICKET-064

**Description:**
Table view of all registrations for an event.

**Tasks:**
- Table columns: name, email, company, job title, registered_at, payment_status
- Filter by payment status
- Export as CSV

**Acceptance Criteria:**
- [ ] Table displays all registrations
- [ ] Filters work
- [ ] Export works

---

### TICKET-068: Lead Collection & Sorting
**Priority:** P1 | **Effort:** 4h | **Dependencies:** TICKET-067

**Description:**
Auto-score leads from registrations.

**Tasks:**
- Lead scoring: job title (C-level = 10, Director = 7, other = 3), company size (>500 = 10, >100 = 7, other = 3)
- Sort leads: hot (score > 15), warm (score 10-15), cold (score < 10)
- Display lead score on registration list

**Acceptance Criteria:**
- [ ] Lead scores calculate correctly
- [ ] Leads sort by score
- [ ] Score displays on registration list

---

### TICKET-069: Event — Edit Event
**Priority:** P1 | **Effort:** 2h | **Dependencies:** TICKET-062

**Description:**
Edit an existing event.

**Tasks:**
- "Edit" button on event detail page
- Opens form with pre-filled data
- Save changes

**Acceptance Criteria:**
- [ ] Edit button opens form
- [ ] Changes save to database

---

### TICKET-070: Event — Delete Event
**Priority:** P2 | **Effort:** 1h | **Dependencies:** TICKET-062

**Description:**
Delete an event with confirmation.

**Tasks:**
- "Delete" button on event detail page
- Confirmation modal
- Soft delete

**Acceptance Criteria:**
- [ ] Delete button removes event from list
- [ ] Confirmation modal prevents accidental deletion

---

### TICKET-071: Event — Embed Registration Form
**Priority:** P1 | **Effort:** 3h | **Dependencies:** TICKET-063

**Description:**
Generate embed code for registration form.

**Tasks:**
- "Embed" button on event detail page
- Generate iframe code
- Copy to clipboard

**Acceptance Criteria:**
- [ ] Embed code generates correctly
- [ ] Copy button works
- [ ] Iframe displays form correctly on external site

---

## Module 7: Analytics & Intelligence (9 tickets)

### TICKET-072: Content Performance Dashboard
**Priority:** P1 | **Effort:** 5h | **Dependencies:** TICKET-002

**Description:**
Dashboard showing content performance by type and channel.

**Tasks:**
- Metrics by content type: views, engagement, conversions
- Metrics by channel: newsletter open rate, LinkedIn impressions, podcast downloads, webinar attendance
- Top 10 content pieces (last 30 days)
- Filter by date range, campaign, cluster

**Acceptance Criteria:**
- [ ] Dashboard displays metrics from `content_metrics` table
- [ ] Charts render correctly
- [ ] Filters work

---

### TICKET-073: Email Metrics Dashboard
**Priority:** P1 | **Effort:** 4h | **Dependencies:** TICKET-002

**Description:**
Dashboard showing email performance.

**Tasks:**
- Per-email metrics: sent, opened, clicked, unsubscribed, bounced
- Per-sequence metrics: completion rate, conversion rate
- Charts: open rate over time, click rate over time

**Acceptance Criteria:**
- [ ] Dashboard displays metrics from `email_metrics` table
- [ ] Charts render correctly

---

### TICKET-074: Journey Conversion Dashboard
**Priority:** P1 | **Effort:** 4h | **Dependencies:** TICKET-002

**Description:**
Dashboard showing B2C journey conversion rates.

**Tasks:**
- Funnel visualization: awareness → engagement → assessment → results → cross-sell → Council
- Conversion rate at each stage
- Drop-off analysis

**Acceptance Criteria:**
- [ ] Funnel displays correctly
- [ ] Conversion rates calculate from `journey_instances`

---

### TICKET-075: Campaign ROI Dashboard
**Priority:** P1 | **Effort:** 4h | **Dependencies:** TICKET-002

**Description:**
Dashboard showing ROI per campaign.

**Tasks:**
- Campaign metrics: content produced, reach, engagement, conversions, revenue
- Cost tracking: hours spent, tools used, ad spend
- ROI calculation: (revenue - cost) / cost
- Compare campaigns side-by-side

**Acceptance Criteria:**
- [ ] Dashboard displays metrics from `campaign_metrics` table
- [ ] ROI calculates correctly
- [ ] Comparison view works

---

### TICKET-076: Repurposing ROI Dashboard
**Priority:** P1 | **Effort:** 3h | **Dependencies:** TICKET-058

**Description:**
Dashboard showing repurposing ROI.

**Tasks:**
- Source asset → derivative count
- Time-to-publish for each derivative
- Total reach across all derivatives
- Cost per derivative

**Acceptance Criteria:**
- [ ] Dashboard displays metrics from `repurposing_derivatives` table
- [ ] Metrics calculate correctly

---

### TICKET-077: AI Report Generator — Content Performance
**Priority:** P1 | **Effort:** 4h | **Dependencies:** TICKET-004

**Description:**
AI-generated content performance report.

**Tasks:**
- "Generate Report" button on content performance page
- Call DeepSeek with metrics data
- Display report (markdown)
- Export as PDF / email to team

**Acceptance Criteria:**
- [ ] Report generates in < 10 seconds
- [ ] Report includes insights and recommendations
- [ ] Export works

---

### TICKET-078: AI Report Generator — Campaign ROI
**Priority:** P1 | **Effort:** 4h | **Dependencies:** TICKET-004

**Description:**
AI-generated campaign ROI report.

**Tasks:**
- "Generate Report" button on campaign ROI page
- Call DeepSeek with metrics data
- Display report (markdown)
- Export as PDF / email to team

**Acceptance Criteria:**
- [ ] Report generates in < 10 seconds
- [ ] Report includes insights and recommendation

---

### TICKET-079: AI Report Generator — Journey Conversion
**Priority:** P1 | **Effort:** 4h | **Dependencies:** TICKET-004

**Description:**
AI-generated journey conversion report.

**Tasks:**
- "Generate Report" button on journey conversion page
- Call DeepSeek with metrics data
- Display report (markdown)
- Export as PDF / email to team

**Acceptance Criteria:**
- [ ] Report generates in < 10 seconds
- [ ] Report includes insights and recommendations

---

### TICKET-080: Scheduled Reports (Cron)
**Priority:** P2 | **Effort:** 3h | **Dependencies:** TICKET-077

**Description:**
Auto-generate reports on schedule.

**Tasks:**
- Weekly Monday: Content Performance Report
- On campaign end: Campaign ROI Report
- On journey completion: Journey Conversion Report
- Store reports in `reports` table

**Acceptance Criteria:**
- [ ] Cron jobs run on schedule
- Reports generate automatically

---

## Agent Bridge (7 tickets)

### TICKET-081: Agent Trigger Routes — Setup
**Priority:** P0 | **Effort:** 3h | **Dependencies:** TICKET-001

**Description:**
Create API routes to trigger Feishu agents.

**Tasks:**
- `/api/trigger/echo` → triggers Echo agent
- `/api/trigger/carl` → triggers Carl agent
- `/api/trigger/maria` → triggers Maria agent
- `/api/trigger/emily` → triggers Emily agent
- `/api/trigger/valentina` → triggers Valentina agent
- Call Feishu Messaging API to send message to agent group chat

**Acceptance Criteria:**
- [ ] Routes call Feishu Messaging API
- [ ] Message sends to correct group chat
- [ ] Payload includes action + context

---

### TICKET-082: Agent Trigger — Publish Content (Echo)
**Priority:** P0 | **Effort:** 3h | **Dependencies:** TICKET-081

**Description:**
Trigger Echo agent to publish content.

**Tasks:**
- On "Publish" button click → call `/api/trigger/echo`
- Payload: `{ action: "publish_content", asset_id: "...", channel: "linkedin" }`
- Echo agent publishes to LinkedIn → writes to Supabase

**Acceptance Criteria:**
- [ ] Trigger sends message to Echo group chat
- Echo publishes content
- Supabase updates

---

### TICKET-083: Agent Trigger — Send Email Sequence (Maria)
**Priority:** P0 | **Effort:** 3h | **Dependencies:** TICKET-081

**Description:**
Trigger Maria agent to send email sequence.

**Tasks:**
- On "Send Sequence" button click → call `/api/trigger/maria`
- Payload: `{ action: "send_sequence", sequence_id: "...", list_id: "..." }`
- Maria sends emails → writes metrics to Supabase

**Acceptance Criteria:**
- [ ] Trigger sends message to Maria group chat
- Maria sends emails
- Metrics log to Supabase

---

### TICKET-084: Agent Trigger — Register Attendee (Emily)
**Priority:** P0 | **Effort:** 3h | **Dependencies:** TICKET-081

**Description:**
Trigger Emily agent to send confirmation email.

**Tasks:**
- On registration submit → call `/api/trigger/emily`
- Payload: `{ action: "send_confirmation", registration_id: "..." }`
- Emily sends confirmation email → writes to Supabase

**Acceptance Criteria:**
- [ ] Trigger sends message to Emily group chat
- Emily sends confirmation
- Supabase updates

---

### TICKET-085: Supabase Realtime — Subscribe to Changes
**Priority:** P0 | **Effort:** 4h | **Dependencies:** TICKET-003

**Description:**
Subscribe to Supabase Realtime for instant UI updates.

**Tasks:**
- Subscribe to `content_assets` changes
- Subscribe to `event_registrations` changes
- Subscribe to `email_metrics` changes
- Update UI on changes

**Acceptance Criteria:**
- [ ] Realtime subscriptions work
- UI updates within 2 seconds of agent write

---

### TICKET-086: Agent Status Display
**Priority:** P1 | **Effort:** 3h | **Dependencies:** TICKET-081

**Description:**
Display agent status in UI (online/offline, last action).

**Tasks:**
- Agent status indicator (green dot = online, gray = offline)
- Last action timestamp
- Click agent → view recent actions

**Acceptance Criteria:**
- [ ] Status displays correctly
- Last action updates in real-time

---

### TICKET-087: Agent Logs — Audit Trail
**Priority:** P1 | **Effort:** 3h | **Dependencies:** TICKET-081

**Description:**
Log all agent actions for audit trail.

**Tasks:**
- Create `agent_logs` table: agent_name, action, payload, status, created_at
- Log every agent trigger
- Display logs in UI (filterable by agent, action)

**Acceptance Criteria:**
- [ ] Logs save to database
- Logs display in UI

---

## Summary

**Total Tickets:** 87  
**Total Estimated Effort:** ~120 hours (3 weeks full-time)

**Priority Breakdown:**
- P0 (Must-have): 42 tickets (~65 hours)
- P1 (Should-have): 35 tickets (~45 hours)
- P2 (Nice-to-have): 10 tickets (~10 hours)

**Module Breakdown:**
- Infrastructure & Setup: 8 tickets
- Module 1 (Content Command Center): 12 tickets
- Module 2 (Template & Asset Library): 10 tickets
- Module 3 (Distribution Engine): 13 tickets
- Module 4 (B2C Journey Engine): 11 tickets
- Module 5 (Content Repurposing Engine): 7 tickets
- Module 6 (Registration & Event Management): 10 tickets
- Module 7 (Analytics & Intelligence): 9 tickets
- Agent Bridge: 7 tickets

---

**END OF TICKETS**
