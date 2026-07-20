# WAVE Audit V2: Real Data, Campaigns, Repurposing — What Exists vs What's Needed

**Version:** 2.0 | **Date:** 2026-07-20 | **Author:** NEXUS  
**Status:** Audit Complete + Spec Ready  
**For:** Trae (Engineering) + Kevin (Review)

---

## 1. Executive Summary

Kevin asked 4 questions:
1. **Can you add people to campaigns?** → NO. No campaigns table exists. Current "campaigns" are derived from build_tracker groups.
2. **Can you connect to real Notion content?** → NO. Notion integration was specced (Notion_Data_Integration_Spec.md) but never built. Supabase has the data but no sync mechanism.
3. **Can you repurpose content?** → NO. Repurposing page is static with 5 hardcoded items.
4. **Can you create real campaigns with real data?** → NO. See #1.

**The honest answer:** Right now WAVE is a read-only dashboard displaying Supabase data with broken UI (11 bugs from audit V1). It has zero write-back, zero campaign management, zero Notion sync, and zero repurposing functionality.

**What follows:** Line-by-line audit of what exists, then specs for what's needed to make each feature real.

---

## 2. Page-by-Page Deep Audit — What Actually Works vs What's Fake

### 2.1 Campaigns Page — COMPLETELY FAKE

**File:** `src/app/dashboard/campaigns/page.tsx` + `CampaignsClient.tsx`

**What the code does:**
```typescript
// page.tsx line 8-37 — "campaigns" are derived from build_tracker groups
const db = await createAdminClient()
const { data: buildData } = await db.from('build_tracker').select('id, deliverable_number, deliverable_name, build_phase, status, assigned_to')

// Group by build_phase and call each group a "campaign"
const grouped: Record<string, any[]> = {}
for (const item of buildData) {
  const phase = item.build_phase || 'Unassigned'
  if (!grouped[phase]) grouped[phase] = []
  grouped[phase].push(item)
}

const campaigns = Object.entries(grouped).map(([phase, items]) => ({
  id: phase,
  name: phase,
  status: 'planning',              // ← HARDCODED — every campaign is "planning"
  content_count: items.length,
  build_phase: phase,
  start_date: items[0]?.created_at || new Date().toISOString(),
  owner: items[0]?.assigned_to || null,  // ← assigned_to is NULL for all 291 rows
}))
```

**What this means:**
- There are 5 "campaigns" (= 5 build phases)
- Every campaign has status "planning" (hardcoded)
- Every campaign has owner = null (assigned_to is null for all 291 build_tracker rows)
- "content_count" is just how many build_tracker items are in each phase
- There is NO campaigns table in Supabase
- There is NO way to add people to a campaign
- There is NO campaign start/end date, budget, KPIs, or actual campaign data
- The "Create Campaign" button is `disabled` with tooltip "Coming soon"

**Verdict:** This is not a campaign management system. It's a build_tracker groupby view wearing a "campaigns" costume.

---

### 2.2 Repurposing Page — COMPLETELY STATIC

**File:** `src/app/dashboard/repurposing/page.tsx`

```typescript
const repurposingData = [
  { id: 1, source: 'Webinar Recording', title: 'China Leadership Webinar', ... },
  { id: 2, source: 'Diagnostic Report', title: 'Executive Assessment', ... },
  { id: 3, source: 'Blog Post', title: 'AI in Talent Development', ... },
  { id: 4, source: 'Sales Deck', title: 'DEX AI Platform Overview', ... },
  { id: 5, source: 'Podcast Episode', title: 'Leadership Unplugged Ep.1', ... },
]
```

**What this means:**
- 5 hardcoded items. Not from Supabase. Not from Notion.
- No actual repurposing engine. No AI transformation. No DeepSeek call.
- "Status" is just a visual tag (completed/processing/pending)
- No connection to the 132 assets in Supabase
- No ability to select real content and repurpose it
- The "Repurpose" button on each card shows an alert

**Verdict:** Pure UI mockup. Zero functionality.

---

### 2.3 Events Page — COMPLETELY STATIC

**File:** `src/app/dashboard/events/page.tsx`

```typescript
const events = [
  { id: 1, title: 'China Leadership Webinar', date: 'Jul 15, 2026', ... },
  { id: 2, title: 'DEX AI Executive Briefing', date: 'Jul 22, 2026', ... },
  { id: 3, title: 'SHIFT Program Launch', date: 'Aug 5, 2026', ... },
  { id: 4, title: 'Council Advisory Session', date: 'Aug 19, 2026', ... },
  { id: 5, title: 'Annual Summit', date: 'Sep 12, 2026', ... },
]
```

**Verdict:** 5 fake events. No Supabase. No registration. No attendees.

---

### 2.4 B2C Journeys Page — COMPLETELY STATIC

**File:** `src/app/dashboard/journeys/page.tsx`

```typescript
const journeys = [
  { id: 1, name: 'Diagnostic → Program Upsell', ... },
  { id: 2, name: 'Webinar → Council Invitation', ... },
  { id: 3, name: 'Content → Assessment → Sales', ... },
  { id: 4, name: 'Newsletter → Event Registration', ... },
  { id: 5, name: 'Free Resource → Email Sequence', ... },
]
```

**Verdict:** 5 fake journeys. No Supabase. No automation. No tracking.

---

### 2.5 Agent Bridge — 100% MOCKED

**File:** `src/app/dashboard/agents/AgentsClient.tsx` (1,262 lines)

**What's fake:**
1. All 5 agents defined in-component — no Supabase query
2. Activity feed: hardcoded array
3. Error logs: `agent.id === 'carl' ? 'Calendar sync timeout' : 'API rate limit exceeded'`
4. `handleRefresh()`: sets loading=true for 1.5s, fetches nothing
5. Agent config "Save": shows `alert('Settings saved!')` — nothing persisted
6. Status simulation: `useEffect` randomly flips status every 5-15s
7. KPI metrics: hardcoded numbers

**Verdict:** This is a UI prototype. No real agent execution. No real logs. No Supabase.

---

### 2.6 Distribution Page — SUPABASE WIRED BUT BROKEN

**File:** `src/app/dashboard/distribution/page.tsx`

**Bug:** Line 8 selects `preview_text` column which doesn't exist in `sequence_emails` table → query returns 42703 error → emailData = null → ALL sequences show 0 emails.

**Fix:** Remove `preview_text` from select (1 line change).

---

### 2.7 Templates Page — SUPABASE WIRED BUT BROKEN

**File:** `src/app/dashboard/templates/TemplatesClient.tsx`

**Bugs:**
1. "Generate with AI" → setTimeout 1.5s → returns hardcoded template string. No DeepSeek.
2. Template preview renders HTML as raw text (not using dangerouslySetInnerHTML)
3. "Duplicate" / "Delete" → `alert()` only, nothing happens

---

### 2.8 Dashboard / Content / Assets / Analytics — SUPABASE WIRED WITH DATA BUGS

These 4 pages DO query Supabase and show real data, but:
- Content Calendar: dates are import timestamps (all Jul 15), all status "Building"
- Dashboard: Quick Actions link to wrong pages
- Sidebar: badges show wrong numbers
- Analytics: date filters meaningless (all dates identical)

---

## 3. What's Needed — Feature by Feature

### 3.1 REAL CAMPAIGNS (Kevin: "add people, create campaigns with real data")

#### Current State
No campaigns table. Zero campaign management. Build tracker groups only.

#### Required Schema

```sql
-- New campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  campaign_type TEXT NOT NULL,        -- 'email_sequence', 'nurture', 'event_promo', 'content_drip', 'advisory_outreach'
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed', 'archived'
  
  -- Campaign metadata
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  target_audience TEXT,               -- 'b2c_individual', 'b2b_corporate', 'advisory', 'c_suite', 'all'
  product_layer TEXT,                 -- Links to which product layer this campaign promotes
  
  -- Ownership
  owner TEXT,                         -- 'Kevin', 'NEXUS', 'James', etc.
  assigned_team TEXT[],               -- Array of team members
  
  -- Metrics
  target_contacts INTEGER DEFAULT 0,
  emails_sent INTEGER DEFAULT 0,
  open_rate DECIMAL(5,2) DEFAULT 0,
  click_rate DECIMAL(5,2) DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  
  -- Linking
  linked_sequence_id UUID REFERENCES email_sequences(id),  -- Which email sequence powers this campaign
  linked_assets UUID[],               -- Which assets are used in this campaign
  linked_events UUID[],               -- Which events are part of this campaign
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign members / contacts
CREATE TABLE campaign_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_company TEXT,
  contact_role TEXT,                  -- 'CHRO', 'L&D Director', 'CEO', etc.
  segment TEXT,                       -- 'hot_lead', 'warm_lead', 'cold', 'existing_client', 'council_member'
  status TEXT DEFAULT 'pending',      -- 'pending', 'sent', 'opened', 'clicked', 'replied', 'converted'
  added_at TIMESTAMPTZ DEFAULT NOW(),
  last_interaction_at TIMESTAMPTZ,
  UNIQUE(campaign_id, contact_email)
);

-- Campaign activity log
CREATE TABLE campaign_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES campaign_contacts(id),
  action TEXT NOT NULL,               -- 'email_sent', 'email_opened', 'email_clicked', 'reply_received', 'meeting_booked', 'status_changed'
  details JSONB,                      -- Free-form: { email_subject, link_clicked, etc. }
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Required Pages
1. **Campaigns list** — Real table with status, dates, owner, contact count, open rate
2. **Campaign detail** — View/edit campaign, see contacts, activity timeline, linked sequences
3. **Add contacts** — Form to add people (name, email, company, role, segment)
4. **Link sequences** — Connect an email_sequence to a campaign
5. **Campaign creation** — Full form (not disabled button)
6. **Campaign status management** — Change status from draft → active → paused → completed

#### API Routes Needed
```
POST   /api/campaigns                  — Create campaign
PATCH  /api/campaigns/[id]             — Update campaign
DELETE /api/campaigns/[id]             — Delete campaign
POST   /api/campaigns/[id]/contacts    — Add contacts
DELETE /api/campaigns/[id]/contacts/[cid] — Remove contact
GET    /api/campaigns/[id]/activity    — Get activity log
```

#### Effort Estimate: ~16-20h (Trae)

---

### 3.2 REAL NOTION CONTENT CONNECTION

#### Current State
- Notion integration spec exists (`Notion_Data_Integration_Spec.md`) — never built
- Supabase has 132 assets and 291 build_tracker items (imported once from Notion)
- No sync mechanism. Data is frozen at import time.
- No connection to actual Notion page content (the 44 child pages with reference docs)

#### What "Connect to Real Content" Means

There are TWO different things:

**A) Sync operational data (assets + build_tracker from Notion DBs)**
- Already specced. Needs a sync script running periodically.
- Update existing records when Notion changes.
- Add `notion_sync_log` table for tracking.

**B) Access Notion page content (the actual documents)**
- The 44 child pages in Notion contain brand guidelines, product definitions, email copy, etc.
- These are NOT in Supabase. They're in Notion pages.
- To "connect" means: when a user clicks an asset in WAVE, they can see the actual Notion document content.

#### Required Schema

```sql
-- Extend assets table with Notion page reference
ALTER TABLE assets ADD COLUMN IF NOT EXISTS notion_page_url TEXT;  -- Direct link to Notion page
ALTER TABLE assets ADD COLUMN IF NOT EXISTS notion_content_preview TEXT;  -- First 500 chars of page content
ALTER TABLE assets ADD COLUMN IF NOT EXISTS notion_last_synced TIMESTAMPTZ;

-- Content library (for repurposing — actual content blocks from Notion)
CREATE TABLE content_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content_type TEXT NOT NULL,         -- 'webinar_deck', 'email_copy', 'blog_post', 'diagnostic_spec', 'sales_deck', 'podcast_script'
  source TEXT NOT NULL,               -- 'notion', 'supabase', 'manual'
  notion_page_id TEXT,                -- Notion page ID for sync
  notion_url TEXT,                    -- Direct link to Notion page
  raw_content TEXT,                   -- Full text content (for AI repurposing)
  word_count INTEGER,
  language TEXT DEFAULT 'en',
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notion sync log
CREATE TABLE notion_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_db TEXT NOT NULL,            -- 'launch_assets', 'build_tracker', 'content_pages'
  records_synced INTEGER,
  records_updated INTEGER,
  records_created INTEGER,
  errors JSONB,
  sync_started_at TIMESTAMPTZ,
  sync_completed_at TIMESTAMPTZ
);
```

#### Required Integration

**Notion API sync script** (runs as Vercel cron or manual trigger):
1. Query Notion databases for asset updates
2. Update Supabase records
3. Optionally fetch page content blocks for content_library
4. Log sync results

**API Routes:**
```
POST /api/notion/sync          — Trigger manual sync
GET  /api/notion/status        — Last sync time + stats
GET  /api/content              — List content_library items
GET  /api/content/[id]         — Get single content item (with raw_content for AI)
```

#### Effort Estimate: ~20-24h (Trae)
- 8h: Notion API integration script
- 8h: Content library schema + API routes
- 4h: WAVE UI integration (asset detail shows Notion link + content preview)
- 4h: Sync cron + error handling

---

### 3.3 REAL REPURPOSING

#### Current State
5 hardcoded items. Zero connection to real assets or content.

#### What Real Repurposing Means

Take an existing content piece (from content_library or assets) and transform it into different formats using DeepSeek AI:

- Webinar recording → blog post + social media posts + email newsletter
- Diagnostic report → case study + sales one-pager + LinkedIn post
- Podcast episode → transcript → blog post → social clips
- Sales deck → email sequence → landing page copy

#### Required Schema

```sql
CREATE TABLE repurposing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_content_id UUID REFERENCES content_library(id),
  source_type TEXT NOT NULL,          -- 'webinar', 'diagnostic', 'blog', 'podcast', 'deck', 'email_sequence'
  target_format TEXT NOT NULL,        -- 'blog_post', 'social_post', 'email_newsletter', 'case_study', 'one_pager', 'linkedin_post'
  
  -- Job status
  status TEXT DEFAULT 'pending',      -- 'pending', 'processing', 'completed', 'failed'
  
  -- AI processing
  deepseek_prompt TEXT,               -- The prompt sent to DeepSeek
  deepseek_response TEXT,             -- The generated output
  deepseek_model TEXT,                -- 'deepseek-chat' or 'deepseek-reasoner'
  deepseek_tokens_used INTEGER,
  deepseek_cost_cny DECIMAL(10,4),
  
  -- Output
  output_content TEXT,                -- Final repurposed content
  output_format TEXT,                 -- 'markdown', 'html', 'plain_text'
  output_word_count INTEGER,
  
  -- Quality
  human_reviewed BOOLEAN DEFAULT FALSE,
  human_edits TEXT,                   -- What Kevin changed
  quality_score INTEGER,              -- 1-10 rating
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

#### Required Flow

1. User selects a source content piece (from content_library)
2. User selects target format (blog post, social media, email, etc.)
3. WAVE generates a DeepSeek prompt based on source content + target format
4. DeepSeek API generates the repurposed content
5. User reviews, edits if needed, approves
6. Output saved to repurposing_jobs and linked back to assets

#### API Routes

```
POST /api/repurpose              — Start repurposing job (calls DeepSeek)
GET  /api/repurpose              — List all repurposing jobs
GET  /api/repurpose/[id]         — Get job result
PATCH /api/repurpose/[id]        — Update (human edits, quality score)
POST /api/repurpose/[id]/retry   — Retry failed job
```

#### DeepSeek Prompt Templates

```python
# Webinar → Blog Post
WEBINAR_TO_BLOG = """You are a professional content writer for DEX AI, a leadership intelligence firm.

Transform this webinar content into a professional blog post.

WEBINAR CONTENT:
{source_content}

REQUIREMENTS:
- 800-1200 words
- Professional tone, active voice
- Include 3-5 key takeaways as bullet points
- Add a compelling headline
- End with a clear CTA related to DEX AI's diagnostic services
- Use "professionals" not "users", "clients" not "customers"
- Never use the word "free"

OUTPUT: Markdown formatted blog post"""

# Diagnostic → Case Study
DIAGNOSTIC_TO_CASE_STUDY = """Transform this diagnostic assessment into a professional case study.

SOURCE: {source_content}

STRUCTURE:
1. Challenge (what the organization faced)
2. Approach (how DEX AI diagnostics identified the issue)
3. Findings (key insights from the assessment)
4. Recommendations (actionable next steps)
5. Impact (expected outcomes)

TONE: Executive-level, data-driven, confidential (no company names)."""
```

#### Effort Estimate: ~16-20h (Trae)
- 6h: Repurposing schema + API routes
- 6h: DeepSeek integration (prompt templates, API calls)
- 4h: UI (select source, select format, show results, edit)

---

### 3.4 REAL EVENTS (Bonus — Kevin didn't ask but it's related)

#### Current State
5 hardcoded events.

#### Required Schema

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL,           -- 'webinar', 'workshop', 'summit', 'advisory_session', 'networking'
  status TEXT DEFAULT 'planning',     -- 'planning', 'published', 'in_progress', 'completed', 'cancelled'
  
  -- Scheduling
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  timezone TEXT DEFAULT 'Asia/Shanghai',
  registration_deadline TIMESTAMPTZ,
  
  -- Capacity & registration
  max_attendees INTEGER,
  registered_count INTEGER DEFAULT 0,
  
  -- Linking
  linked_campaign_id UUID REFERENCES campaigns(id),
  linked_products UUID[],             -- Which products this event promotes
  
  -- Speaker/host
  host_name TEXT,
  host_title TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  attendee_name TEXT NOT NULL,
  attendee_email TEXT NOT NULL,
  attendee_company TEXT,
  attendee_title TEXT,
  status TEXT DEFAULT 'registered',   -- 'registered', 'confirmed', 'attended', 'no_show', 'cancelled'
  registered_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Effort Estimate: ~12-16h (Trae)

---

## 4. Priority Matrix

| Feature | Kevin Asked? | Depends On | Effort | Priority |
|---------|-------------|------------|--------|----------|
| **P0 Bug Fixes** (11 bugs) | Yes (audit) | Nothing | 4-6h | 🔴 DO FIRST |
| **Campaigns** (real) | ✅ Yes | Nothing new (new table) | 16-20h | 🔴 HIGH |
| **Notion Content Sync** | ✅ Yes | Notion API key | 20-24h | 🔴 HIGH |
| **Repurposing** (real) | ✅ Yes | Content Library (from Notion sync) | 16-20h | 🟡 MEDIUM |
| **Events** (real) | ❌ No | Nothing new | 12-16h | 🟡 MEDIUM |
| **Journeys** (real) | ❌ No | Campaigns + Events + Email Sequences | 20-24h | 🟢 LATER |
| **Agents** (real) | ❌ No | Agent execution framework | 24-32h | 🟢 LATER |

**Total for all features: ~112-142h**

**Realistic Phase 1 (2 weeks):** P0 bugs (6h) + Campaigns (20h) + Notion sync (24h) = ~50h

---

## 5. What Trae Needs To Build Next (Priority Order)

### Sprint 1: P0 Bug Fixes (4-6h)
See `AUDIT_V1_DEEP_CODE.md` for the exact 11 bugs and fixes.

### Sprint 2: Real Campaigns (16-20h)
1. Create `campaigns`, `campaign_contacts`, `campaign_activity` tables
2. Build API routes (CRUD + contacts + activity)
3. Rewrite CampaignsClient to use real data
4. Add contact management UI
5. Add campaign creation form

### Sprint 3: Notion Content Connection (20-24h)
1. Create `content_library`, `notion_sync_log` tables
2. Build Notion API sync script
3. Build content library API routes
4. Add Notion URL links to assets page
5. Build content library browser UI

### Sprint 4: Real Repurposing (16-20h)
1. Create `repurposing_jobs` table
2. Build DeepSeek integration (prompt templates)
3. Build repurposing API routes
4. Rewrite RepurposingClient with real data
5. Add review/edit/approve flow

---

## 6. Answer to Kevin's Questions (Summary)

| Question | Current Answer | What's Needed |
|----------|---------------|---------------|
| **Can I add people to campaigns?** | ❌ No campaigns exist | Create campaigns table + contacts table + API routes (16-20h) |
| **Can I connect to Notion content?** | ❌ No Notion sync built | Notion API integration + content_library table (20-24h) |
| **Can I repurpose content?** | ❌ Page is fake | content_library + repurposing_jobs + DeepSeek integration (16-20h) |
| **Can I create real campaigns?** | ❌ Button is disabled | Same as #1 — campaigns table + CRUD API + UI (included in 16-20h) |

**Bottom line:** The current WAVE app is a read-only dashboard prototype. To make it a real working platform for campaign management, content connection, and repurposing, we need ~50h of Trae's time for Phase 1 (bugs + campaigns + Notion sync).

The architecture is sound. Supabase is connected. The UI is built. What's missing is: real tables for campaigns/events/repurposing, API routes for write operations, and the Notion sync bridge.

---

## Appendix: Supabase Tables — Current vs Required

### Current (5 tables)
| Table | Rows | Used By | Status |
|-------|------|---------|--------|
| products | 30 | Templates, Pricing | ✅ Working |
| email_sequences | 26 | Distribution | 🔴 Broken (preview_text bug) |
| sequence_emails | 102 | Distribution | 🔴 Broken (preview_text bug) |
| assets | 132 | Assets page | ✅ Working |
| build_tracker | 291 | Dashboard, Content, Campaigns | ⚠️ Working but limited |

### Required Additions (Phase 1)
| Table | Purpose | Priority |
|-------|---------|----------|
| campaigns | Real campaign management | 🔴 P0 |
| campaign_contacts | People in campaigns | 🔴 P0 |
| campaign_activity | Campaign event log | 🔴 P0 |
| content_library | Notion content for repurposing | 🔴 P0 |
| notion_sync_log | Track Notion sync operations | 🟡 P1 |
| repurposing_jobs | AI repurposing pipeline | 🟡 P1 |
| events | Real event management | 🟡 P1 |
| event_registrations | Event attendees | 🟡 P1 |

