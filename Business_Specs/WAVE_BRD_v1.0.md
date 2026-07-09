# WAVE — Business Requirements Document (BRD)
## Marketing Operations Platform | Version 1.0
**Date:** 2026-07-10  
**Author:** NEXUS (PM) | **Owner:** Kevin (CTO) | **Engineer:** Trae  
**Status:** Ready for Scoping

---

## 1. Executive Summary

WAVE is LYC Partners' third platform pillar alongside VISTA (BD Command Center) and DEX AI (Intelligent ATS). It manages the entire demand generation engine — from content planning through asset generation, distribution, registration, and B2C inbound journey orchestration.

**Core Value Proposition:**
- 1 diagnostic insight → 10+ content touchpoints (repurposing engine)
- Zero-human B2C sales funnel (fully automated)
- Unified marketing operations across 9 team members
- 3-week MVP build (Trae + NEXUS + Kevin)

**Target Users:**
- Echo (Content: newsletter, LinkedIn, podcast, webinar)
- Carl (Events: workshops, webinars, programs)
- Valentina (Website: Vercel publishing)
- Emily (Registration: payment, forms, lead collection)
- Maria (Email: sequences, lead management)
- Xuemei (Scripts: podcast + webinar writing)
- NEXUS (Orchestration: triggers, cross-agent coordination)

---

## 2. Platform Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         WAVE PLATFORM                           │
├─────────────────────────────────────────────────────────────────┤
│  Module 1: Content Command Center                               │
│  Module 2: Template & Asset Library                             │
│  Module 3: Distribution Engine                                  │
│  Module 4: B2C Journey Engine                                   │
│  Module 5: Content Repurposing Engine                           │
│  Module 6: Registration & Event Management                      │
│  Module 7: Analytics & Intelligence                             │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    INTEGRATION LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Supabase (DB) ←→ VISTA (BD) ←→ DEX AI (ATS) ←→ NEXUS (Orch)  │
└─────────────────────────────────────────────────────────────────┘
```

**Infrastructure Stack:**
- **Database:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Website:** Vercel (Valentina manages)
- **Podcast Hosting:** Ausha
- **Recording:** Riverside
- **AI Generation:** DeepSeek API (flash/pro models)
- **Email API:** TBD (SendGrid / Mailgun / MS Graph — Kevin to confirm)

---

## 3. Module Specifications

### 3.1 Module 1: Content Command Center

**Purpose:** Central hub for editorial calendar, campaign planning, and asset status tracking.

#### User Stories

**US-1.1: Editorial Calendar View**
- **As** Echo (content manager)
- **I want** a calendar view showing all planned content across channels
- **So that** I can see what's publishing when and avoid conflicts
- **Acceptance Criteria:**
  - Calendar displays content by day/week/month
  - Color-coded by content type (newsletter, LinkedIn, podcast, webinar, article, YouTube)
  - Shows content title, channel, status (draft/review/published), and owner
  - Click on item → opens asset detail modal
  - Drag-and-drop to reschedule (nice-to-have for MVP)

**US-1.2: Campaign Planning**
- **As** NEXUS (PM)
- **I want** to create campaigns tied to product launches (Phase 1A → 1B → 1C)
- **So that** all content supports strategic priorities
- **Acceptance Criteria:**
  - Campaign form: name, objective, target cluster (7 clusters), target product(s), start/end dates
  - Campaign view shows all linked content assets
  - Status tracking: planning → active → completed
  - Campaign KPIs: content count, distribution reach, conversions

**US-1.3: Asset Status Dashboard**
- **As** Echo
- **I want** to see all content assets and their production status
- **So that** I know what needs attention
- **Acceptance Criteria:**
  - Table view: title, type, channel, status, owner, due date
  - Filter by: type, channel, status, owner, campaign
  - Status workflow: idea → draft → review → approved → scheduled → published
  - Overdue items highlighted in red

**US-1.4: Cross-Channel Visibility**
- **As** NEXUS
- **I want** to see how content flows across channels (webinar → article → email → podcast)
- **So that** I can track the repurposing pipeline
- **Acceptance Criteria:**
  - Visual flow diagram showing content derivatives
  - Click any node → see asset details
  - Shows which assets originated from which source

#### Data Requirements
- `campaigns` table: id, name, objective, target_clusters (array), target_products (array), start_date, end_date, status, created_by, created_at
- `content_assets` table: id, title, type, channel, campaign_id, status, owner, due_date, source_asset_id (for derivatives), created_at, published_at
- `content_calendar` table: id, asset_id, scheduled_date, channel, published_url

---

### 3.2 Module 2: Template & Asset Library

**Purpose:** Centralized template repository for all content types, with AI-assisted generation.

#### User Stories

**US-2.1: Template Library**
- **As** Echo
- **I want** a library of templates for every content type
- **So that** I don't start from scratch every time
- **Acceptance Criteria:**
  - Template types: newsletter, webinar promo, exec brief, LinkedIn post, podcast show notes, YouTube description, email sequence, landing page, registration form
  - Each template has: name, type, description, markdown/HTML content, variables (placeholders)
  - Browse/search by type
  - Click template → preview + "Use Template" button

**US-2.2: AI-Assisted Content Generation**
- **As** Xuemei (script writer)
- **I want** AI to draft content from a template + diagnostic data
- **So that** I can focus on editing, not writing from zero
- **Acceptance Criteria:**
  - Select template → fill variables (product name, cluster, key message, tone)
  - Click "Generate with AI" → calls DeepSeek API
  - Returns draft content in 5-10 seconds
  - Brand voice enforcement (prompt includes LYC brand guidelines from doc 01)
  - Edit draft before saving

**US-2.3: Asset Versioning**
- **As** Echo
- **I want** to see version history for each asset
- **So that** I can track changes and revert if needed
- **Acceptance Criteria:**
  - Each asset has versions (v1, v2, v3...)
  - Version history shows: editor, timestamp, changes summary
  - Can revert to any previous version

**US-2.4: Asset Tagging & Search**
- **As** NEXUS
- **I want** to tag assets by product, cluster, and topic
- **So that** I can quickly find relevant content
- **Acceptance Criteria:**
  - Tags: product (11 products), cluster (7 clusters), topic (custom)
  - Search by title, tags, content body
  - Filter by multiple tags

#### Data Requirements
- `templates` table: id, name, type, description, content (markdown/HTML), variables (JSON), created_by, created_at
- `asset_versions` table: id, asset_id, version_number, content, editor, changes_summary, created_at
- `asset_tags` table: asset_id, tag_name, tag_type (product/cluster/topic)

---

### 3.3 Module 3: Distribution Engine

**Purpose:** Email sequences, mailing list management, scheduling, and multi-channel routing.

#### User Stories

**US-3.1: Email Sequence Builder**
- **As** Maria (email manager)
- **I want** to build email sequences (welcome, nurture, launch, cross-sell, re-engagement)
- **So that** leads receive automated, timely content
- **Acceptance Criteria:**
  - Sequence builder: name, trigger (e.g., "user completes LEAP"), email order
  - Each email: subject, preview text, content (from template), delay (e.g., "3 days after previous")
  - Preview entire sequence as timeline
  - Activate/deactivate sequence

**US-3.2: Mailing List Segmentation**
- **As** Maria
- **I want** to segment mailing lists by cluster, persona, diagnostic history, engagement
- **So that** I send the right content to the right people
- **Acceptance Criteria:**
  - List builder: name, filters (cluster IN [...], diagnostic_history IN [...], engagement_score > X)
  - Auto-updates as contacts change
  - Shows list size + preview of contacts
  - Can manually add/remove contacts

**US-3.3: Scheduling & Conflict Detection**
- **As** Echo
- **I want** to schedule content publication and detect conflicts
- **So that** I don't publish two webinars on the same day
- **Acceptance Criteria:**
  - Calendar view for scheduling
  - Conflict detection: warns if same channel has 2+ items on same day
  - Auto-suggests alternative dates
  - Supports channels: newsletter, LinkedIn, podcast, webinar, YouTube

**US-3.4: Multi-Channel Routing**
- **As** Echo
- **I want** to route content to the right channel automatically
- **So that** I don't manually post everywhere
- **Acceptance Criteria:**
  - Content type → channel mapping:
    - Newsletter → email (Maria)
    - LinkedIn post → LinkedIn API (Echo)
    - Podcast → Ausha (Echo)
    - Webinar → event platform (Carl)
    - Article → website (Valentina/Vercel)
    - YouTube → YouTube API (Echo)
  - Click "Publish" → routes to all configured channels

#### Data Requirements
- `email_sequences` table: id, name, trigger_type, trigger_config (JSON), status (active/inactive), created_by
- `sequence_emails` table: id, sequence_id, order, subject, preview_text, content, delay_days
- `mailing_lists` table: id, name, filters (JSON), auto_update (boolean), created_by
- `mailing_list_contacts` table: list_id, contact_id, added_at
- `content_schedules` table: id, asset_id, channel, scheduled_at, published_at, status, published_url

---

### 3.4 Module 4: B2C Journey Engine

**Purpose:** Fully automated B2C funnel from awareness to Council membership. Zero human sales.

#### User Stories

**US-4.1: Journey Builder**
- **As** NEXUS
- **I want** to design automated customer journeys
- **So that** B2C buyers move through the funnel without human intervention
- **Acceptance Criteria:**
  - Visual journey builder (drag-and-drop nodes)
  - Node types: trigger, email, wait, condition, action, end
  - Journey: name, description, entry trigger, status (draft/active/paused)
  - Preview journey as flowchart

**US-4.2: Diagnostic-Triggered Cross-Sell**
- **As** NEXUS
- **I want** the system to suggest related assessments after a user completes one
- **So that** we maximize LTV per customer
- **Acceptance Criteria:**
  - Trigger: user completes assessment (e.g., LEAP)
  - Logic: if LEAP completed → suggest PRISM (after 7 days) → suggest Council (after 14 days)
  - Cross-sell rules defined in journey config
  - Tracks: suggestion sent, suggestion accepted, suggestion ignored

**US-4.3: B2B Signal Detection**
- **As** NEXUS
- **I want** the system to detect B2B signals from B2C buyers
- **So that** we can route high-value prospects to VISTA for BD follow-up
- **Acceptance Criteria:**
  - B2B signals:
    - Job title contains "Director", "VP", "C-level", "Board"
    - Company size > 500 employees
    - Multiple team members from same company purchase assessments
    - User requests 1:1 consultation
  - When detected → auto-create lead in VISTA with source="WAVE_B2C"
  - Notify NEXUS + BD team

**US-4.4: Journey Analytics**
- **As** NEXUS
- **I want** to see journey performance metrics
- **So that** I can optimize conversion rates
- **Acceptance Criteria:**
  - Metrics: entry count, completion rate, avg time to complete, conversion by stage
  - Funnel visualization: show drop-off at each stage
  - Export data as CSV

#### Data Requirements
- `journeys` table: id, name, description, trigger_type, trigger_config (JSON), status, created_by, created_at
- `journey_nodes` table: id, journey_id, node_type, config (JSON), position_x, position_y
- `journey_edges` table: id, journey_id, from_node_id, to_node_id, condition (JSON)
- `journey_instances` table: id, journey_id, contact_id, status, current_node_id, started_at, completed_at
- `journey_events` table: id, instance_id, node_id, event_type, event_data (JSON), occurred_at

---

### 3.5 Module 5: Content Repurposing Engine

**Purpose:** Transform 1 webinar into 10+ content derivatives automatically.

#### User Stories

**US-5.1: Repurposing Map Builder**
- **As** Echo
- **I want** to define how one content piece should be repurposed
- **So that** I can automate the derivative creation
- **Acceptance Criteria:**
  - Select source asset (e.g., "BRIDGE Webinar - July 2026")
  - Define derivatives:
    - Article (website) → Valentina publishes
    - LinkedIn post (3 versions) → Echo posts
    - Newsletter excerpt → Maria sends
    - Podcast episode script → Xuemei writes, Echo produces
    - YouTube clip description → Echo posts
    - Executive brief → NEXUS reviews
  - Each derivative: template, owner, due date (relative to source publish date)
  - Save as "repurposing map"

**US-5.2: Automated Derivative Generation**
- **As** Echo
- **I want** the system to auto-generate derivatives from source content
- **So that** I don't manually rewrite everything
- **Acceptance Criteria:**
  - When source asset is published → trigger derivative generation
  - Call DeepSeek API with:
    - Source content (transcript, article, etc.)
    - Target template
    - Target channel constraints (word count, tone, format)
  - Generate drafts for all derivatives
  - Route to owners for review

**US-5.3: Repurposing Status Tracking**
- **As** NEXUS
- **I want** to see which derivatives are complete vs. pending
- **So that** I can track content multiplication ROI
- **Acceptance Criteria:**
  - Dashboard: source asset → derivative tree
  - Status for each derivative: pending, draft, review, approved, published
  - Time-to-publish for each derivative
  - ROI metric: 1 source → N derivatives

#### Data Requirements
- `repurposing_maps` table: id, source_asset_id, name, created_by, created_at
- `repurposing_derivatives` table: id, map_id, derivative_type, template_id, owner, due_date_offset_days, status, generated_content_id, published_at
- `derivative_generation_logs` table: id, derivative_id, prompt_used, api_response, tokens_used, created_at

---

### 3.6 Module 6: Registration & Event Management

**Purpose:** Unified registration system for webinars, workshops, programs, events. Emily owns this layer.

#### User Stories

**US-6.1: Event Creation**
- **As** Carl (event manager)
- **I want** to create events with registration forms
- **So that** attendees can sign up
- **Acceptance Criteria:**
  - Event form: title, type (webinar/workshop/program/event), date/time, duration, description, capacity, price (free or paid)
  - Registration form builder: custom fields (name, email, company, job title, dietary restrictions, etc.)
  - Generate unique registration URL
  - Embed registration form on website (Valentina publishes)

**US-6.2: Payment Integration**
- **As** Emily (payment manager)
- **I want** to collect payments for paid events
- **So that** we can monetize workshops and programs
- **Acceptance Criteria:**
  - Payment gateway: TBD (Stripe? — Kevin to confirm)
  - Pricing: single ticket, early bird, group discount
  - Payment status tracking: pending, paid, refunded
  - Auto-generate invoice/receipt

**US-6.3: Automated Confirmation & Reminders**
- **As** Emily
- **I want** the system to send confirmation emails and reminders
- **So that** attendees don't forget
- **Acceptance Criteria:**
  - On registration → send confirmation email with calendar invite
  - 7 days before → reminder email
  - 1 day before → reminder email
  - 1 hour before → reminder email
  - After event → follow-up email with recording/resources

**US-6.4: Lead Collection & Sorting**
- **As** Emily
- **I want** to collect lead data from registrations and sort by quality
- **So that** we can prioritize follow-up
- **Acceptance Criteria:**
  - Auto-create/update contact in Supabase from registration
  - Lead scoring: job title, company size, engagement history
  - Sort leads: hot (C-level, large company), warm (Director, mid-size), cold (other)
  - Export leads as CSV

#### Data Requirements
- `events` table: id, title, type, description, start_at, end_at, duration_minutes, capacity, price, registration_url, created_by, created_at
- `event_registrations` table: id, event_id, contact_id, registered_at, payment_status, ticket_type, custom_fields (JSON)
- `registration_forms` table: id, event_id, fields (JSON), created_at
- `event_reminders` table: id, event_id, contact_id, reminder_type, sent_at, scheduled_at

---

### 3.7 Module 7: Analytics & Intelligence

**Purpose:** Track content performance, email metrics, journey conversion, campaign ROI.

#### User Stories

**US-7.1: Content Performance Dashboard**
- **As** Echo
- **I want** to see how content performs by type and channel
- **So that** I can double down on what works
- **Acceptance Criteria:**
  - Metrics by content type: views, engagement, conversions
  - Metrics by channel: newsletter open rate, LinkedIn impressions, podcast downloads, webinar attendance
  - Top 10 content pieces (last 30 days)
  - Filter by date range, campaign, cluster

**US-7.2: Email Metrics**
- **As** Maria
- **I want** to see email performance (open rate, click rate, unsubscribe rate)
- **So that** I can optimize subject lines and content
- **Acceptance Criteria:**
  - Per-email metrics: sent, opened, clicked, unsubscribed, bounced
  - Per-sequence metrics: completion rate, conversion rate
  - A/B test results (if enabled)

**US-7.3: Journey Conversion Tracking**
- **As** NEXUS
- **I want** to see B2C journey conversion rates
- **So that** I can optimize the funnel
- **Acceptance Criteria:**
  - Funnel visualization: awareness → engagement → assessment → results → cross-sell → Council
  - Conversion rate at each stage
  - Drop-off analysis: where are we losing people?
  - Revenue attribution: which journey → which purchase?

**US-7.4: Campaign ROI**
- **As** NEXUS
- **I want** to see ROI per campaign
- **So that** I can justify marketing spend
- **Acceptance Criteria:**
  - Campaign metrics: content produced, reach, engagement, conversions, revenue
  - Cost tracking: hours spent, tools used, ad spend (if any)
  - ROI calculation: (revenue - cost) / cost
  - Compare campaigns side-by-side

**US-7.5: Repurposing ROI**
- **As** NEXUS
- **I want** to see how many derivatives we get from each source asset
- **So that** I can measure content multiplication efficiency
- **Acceptance Criteria:**
  - Source asset → derivative count
  - Time-to-publish for each derivative
  - Total reach across all derivatives
  - Cost per derivative (API tokens, human editing time)

#### Data Requirements
- `content_metrics` table: id, asset_id, metric_type (views/engagement/conversions), metric_value, recorded_at
- `email_metrics` table: id, email_id, sent_count, opened_count, clicked_count, unsubscribed_count, bounced_count, recorded_at
- `journey_metrics` table: id, journey_id, node_id, entry_count, exit_count, conversion_count, recorded_at
- `campaign_metrics` table: id, campaign_id, content_count, reach, engagement, conversions, revenue, cost, recorded_at

---

## 4. Integration Specifications

### 4.1 VISTA Integration (BD Command Center)

**Purpose:** Route B2B leads from WAVE to VISTA for BD follow-up.

**Integration Points:**
- B2B signal detection (Module 4, US-4.3) → create lead in `vista_contacts` table
- WAVE writes to Supabase → VISTA reads from Supabase (shared DB)
- No API calls needed (same database)

**Data Flow:**
```
WAVE detects B2B signal
  → INSERT INTO vista_contacts (source='WAVE_B2C', lead_score, company, job_title, ...)
  → NEXUS reads new lead → notifies BD team
```

**Acceptance Criteria:**
- Lead created in VISTA within 5 minutes of signal detection
- Lead includes: source, signal type, diagnostic history, engagement score
- No duplicate leads (check email uniqueness)

### 4.2 DEX AI Integration (Intelligent ATS)

**Purpose:** Share talent/search data between WAVE and DEX AI.

**Integration Points:**
- Event registrations → potential candidates for DEX AI
- Diagnostic results → talent profile data for DEX AI

**Data Flow:**
```
User registers for workshop in WAVE
  → INSERT INTO vista_contacts (with registration data)
  → DEX AI reads contact → enriches talent profile
```

**Acceptance Criteria:**
- Contact data shared in real-time (same Supabase DB)
- DEX AI can filter contacts by: event attendance, diagnostic history, engagement

### 4.3 NEXUS Integration (Orchestration)

**Purpose:** NEXUS orchestrates triggers, scheduling, cross-agent coordination.

**Integration Points:**
- WAVE writes events to `wave_events` table
- NEXUS reads events → triggers actions (e.g., "webinar published" → start repurposing)
- NEXUS doesn't call WAVE directly; it reads from DB

**Data Flow:**
```
Echo publishes webinar in WAVE
  → INSERT INTO wave_events (event_type='webinar_published', asset_id=123)
  → NEXUS cron job reads new events → triggers repurposing map
```

**Acceptance Criteria:**
- NEXUS reads events within 1 minute (cron job or Supabase realtime)
- NEXUS can trigger: repurposing, email sequences, cross-sell suggestions

### 4.4 External Integrations

**Email API (Maria):**
- TBD (SendGrid / Mailgun / MS Graph — Kevin to confirm)
- API keys stored in Supabase secrets
- WAVE calls email API to send sequences

**LinkedIn API (Echo):**
- Requires LinkedIn API access (Kevin to confirm)
- Post LinkedIn updates via API
- Track impressions, engagement

**Website Publishing (Valentina/Vercel):**
- WAVE generates content (markdown/HTML)
- Valentina publishes to Vercel (manual or automated via Git)
- Option: WAVE writes to Git repo → Vercel auto-deploys

**Podcast Hosting (Echo/Ausha):**
- Ausha API for uploading episodes
- Track downloads, subscribers

**Payment Gateway (Emily):**
- TBD (Stripe? — Kevin to confirm)
- API keys stored in Supabase secrets
- Handle payments, refunds, invoices

---

## 5. Phasing & Priority

### Phase 1: MVP (Week 1-2) — BRIDGE/IMPACT Launch Support
**Goal:** Get Echo and Carl operational for Phase 1A product launch.

**Modules:**
- Module 1: Content Command Center (editorial calendar, campaign planning)
- Module 2: Template & Asset Library (10 templates, no AI yet)
- Module 6: Registration & Event Management (basic event creation + registration)

**Why first:** Echo needs to plan content; Carl needs to register attendees. These are blocking Phase 1A launch.

### Phase 2: Automation (Week 2-3) — Email & Distribution
**Goal:** Automate email sequences and content distribution.

**Modules:**
- Module 3: Distribution Engine (email sequences, mailing lists, scheduling)
- Module 2 (AI): Add DeepSeek API for content generation

**Why second:** Maria needs email automation; Echo needs distribution to scale.

### Phase 3: B2C Funnel (Week 3-4) — Automated Sales
**Goal:** Launch B2C journey for LEAP/PRISM assessments.

**Modules:**
- Module 4: B2C Journey Engine (automated funnel, cross-sell)

**Why third:** B2C assessments (Phase 1B) launch after BRIDGE/IMPACT (Phase 1A).

### Phase 4: Multiplication (Week 4-5) — Repurposing Engine
**Goal:** 1 webinar → 10+ derivatives automatically.

**Modules:**
- Module 5: Content Repurposing Engine

**Why fourth:** Needs Phase 1-3 stable first; repurposing depends on templates + distribution.

### Phase 5: Intelligence (Week 5-6) — Analytics & Optimization
**Goal:** Track performance, optimize content strategy.

**Modules:**
- Module 7: Analytics & Intelligence

**Why last:** Needs data from Phase 1-4 to be meaningful.

---

## 6. Non-Functional Requirements

### 6.1 Performance
- Page load time: < 2 seconds
- API response time: < 500ms
- Database query time: < 100ms (with proper indexing)
- AI content generation: < 10 seconds

### 6.2 Scalability
- Support 10,000+ contacts in mailing lists
- Support 1,000+ content assets
- Support 100+ concurrent users (team members)
- Supabase handles scaling (PostgreSQL + CDN)

### 6.3 Security
- Role-based access control (RBAC):
  - Admin: Kevin, NEXUS
  - Content: Echo, Carl, Xuemei
  - Email: Maria
  - Registration: Emily
  - Website: Valentina
  - Read-only: interns (Vanjulla, Ava, Hareesha, Sumaya, Muhammad, Isam, Magnus, Raphael)
- All API keys stored in Supabase secrets (not in code)
- HTTPS only
- GDPR compliance: user data deletion on request

### 6.4 Maintainability
- Code documentation: every function has JSDoc comment
- Component-based architecture (React or Vue — Trae to decide)
- Environment variables for all config (API keys, DB URL)
- Git version control (this repo)

---

## 7. Success Metrics

### 7.1 MVP Success (End of Week 2)
- [ ] Echo can plan 30 days of content in calendar
- [ ] Carl can create event + registration form in < 5 minutes
- [ ] 10 templates available in library
- [ ] Editorial calendar matches Phase 1A launch plan

### 7.2 Phase 1A Launch Success (End of Week 4)
- [ ] BRIDGE webinar: 100+ registrations, 50+ attendees
- [ ] IMPACT webinar: 100+ registrations, 50+ attendees
- [ ] 5 email sequences active (welcome, nurture, launch, cross-sell, re-engagement)
- [ ] 1,000+ contacts in mailing lists

### 7.3 B2C Funnel Success (End of Week 8)
- [ ] 100+ LEAP assessments sold (B2C)
- [ ] 50+ PRISM assessments sold (B2C)
- [ ] 10% conversion rate: awareness → assessment purchase
- [ ] 5% conversion rate: assessment → Council membership

### 7.4 Content Multiplication Success (End of Week 10)
- [ ] 1 webinar → 10+ derivatives (avg)
- [ ] 50+ derivatives generated from 5 webinars
- [ ] 80% of derivatives published within 48 hours of source

---

## 8. Open Questions for Kevin

1. **Email API:** SendGrid, Mailgun, or MS Graph?
2. **Payment gateway:** Stripe? Or another provider?
3. **LinkedIn API:** Do we have access? If not, can we get it?
4. **YouTube channel:** Created yet? Who owns it?
5. **Council membership model:** Can people buy, or is it invite-only?
6. **Website publishing:** Manual (Valentina) or automated (WAVE → Git → Vercel)?
7. **AI content approval:** Should NEXUS review AI-generated content before publishing, or can Echo auto-approve?

---

## 9. Appendix

### 9.1 Product Reference (11 Products)
- LEAP, QUEST, COACH, DRIVE, IMPACT, BRIDGE, MOSAIC, FORGE, PRISM, SPARK, SHIFT
- Full specs: `Agent_Context_Docs_v2/08_Products_Assessments_Diagnostics_Specs.md`

### 9.2 Team Reference
- Kevin (CTO), NEXUS (PM), Trae (Engineer)
- Echo (Content), Carl (Events), Valentina (Website), Emily (Registration), Maria (Email), Xuemei (Scripts)
- Interns: Vanjulla, Ava, Hareesha, Sumaya, Muhammad, Isam, Magnus, Raphael

### 9.3 Brand Guidelines
- Primary: #0F1115 (near-black)
- Secondary: #F5F5F5 (light gray)
- Accent: #C108AB (fuchsia — minimal use)
- Fonts: Crimson Pro (headlines), Inter (body)
- Full guidelines: `Agent_Context_Docs_v2/01_Business_Model_Value_Proposition_Positioning.md`

---

**END OF BRD**
