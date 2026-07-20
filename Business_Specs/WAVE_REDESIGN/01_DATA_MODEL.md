# WAVE — Data Model Specification

**Version**: 2.0
**Date**: 2026-07-20
**Database**: Supabase PostgreSQL
**Author**: NEXUS Agent

---

## 1. Schema Overview

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  campaigns   │────▶│ campaign_content │◀────│  content_pieces   │
│              │     │    (junction)    │     │                   │
└──────┬───────┘     └─────────────────┘     └────────┬──────────┘
       │                                               │
       │            ┌─────────────────┐                │
       ├───────────▶│  distribution   │◀───────────────┤
       │            │     _log        │                │
       │            └─────────────────┘                │
       │                                               │
       │            ┌─────────────────┐                │
       └───────────▶│  repurposing    │◀───────────────┘
                    │     _jobs       │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ content_pieces  │  (output content)
                    │   (output_id)   │
                    └─────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  mailing_list   │────▶│campaign_contacts │◀────│   campaigns      │
│                 │     │   (junction)     │     │                   │
└─────────────────┘     └─────────────────┘     └──────────────────┘

┌─────────────────┐     ┌─────────────────┐
│    inbound      │────▶│   campaigns     │  (optional link)
│                 │     │                 │
└─────────────────┘     └─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│   templates     │     │   ai_jobs       │
│                 │     │                 │
└─────────────────┘     └─────────────────┘
```

---

## 2. Table Definitions

### 2.1 `content_pieces`
The central content table. Every piece of marketing content lives here.

```sql
CREATE TABLE content_pieces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Core metadata
    title TEXT NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN (
        'blog', 'video', 'webinar', 'podcast', 'newsletter',
        'social_post', 'case_study', 'white_paper', 'email_template',
        'presentation', 'infographic', 'diagnostic', 'other'
    )),
    description TEXT,
    
    -- Status tracking
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'idea', 'draft', 'in_progress', 'review', 'approved',
        'published', 'archived', 'deprecated'
    )),
    
    -- Source tracking
    source TEXT CHECK (source IN ('notion', 'manual', 'upload', 'ai_generated', 'repurposed')),
    source_url TEXT,                    -- Link to Notion page or original source
    notion_page_id TEXT,               -- Notion page ID if synced from Notion
    
    -- Ownership & classification
    owner TEXT DEFAULT 'Kevin',
    language TEXT DEFAULT 'en' CHECK (language IN ('en', 'zh', 'fr', 'ja')),
    industry_tag TEXT,                  -- e.g., 'automotive', 'tech', 'healthcare'
    cluster_tag TEXT,                   -- e.g., 'APAC', 'Europe', 'Americas'
    
    -- Content metadata
    word_count INTEGER,
    publish_date TIMESTAMPTZ,
    expiry_date TIMESTAMPTZ,
    
    -- Repurposing lineage
    parent_content_id UUID REFERENCES content_pieces(id),  -- If this was repurposed from another piece
    repurposing_job_id UUID,                                -- Which job created this (if repurposed)
    
    -- Storage
    file_url TEXT,                      -- URL to the actual file (if applicable)
    thumbnail_url TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_content_type ON content_pieces(content_type);
CREATE INDEX idx_content_status ON content_pieces(status);
CREATE INDEX idx_content_source ON content_pieces(source);
CREATE INDEX idx_content_parent ON content_pieces(parent_content_id);
CREATE INDEX idx_content_publish_date ON content_pieces(publish_date);
```

### 2.2 `campaigns`
Marketing campaigns — the organizational container for content distribution efforts.

```sql
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Core metadata
    name TEXT NOT NULL,
    description TEXT,
    campaign_type TEXT NOT NULL CHECK (campaign_type IN (
        'content',        -- Centered around a content piece
        'channel',        -- Centered around a channel
        'account',        -- Centered around target accounts
        'event',          -- Centered around an event
        'nurture',        -- Long-term nurture sequence
        'launch'          -- Product/service launch
    )),
    
    -- Status
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN (
        'planning', 'active', 'paused', 'completed', 'archived', 'cancelled'
    )),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Timeline
    start_date DATE,
    end_date DATE,
    launch_date DATE,
    
    -- Goals
    goal_type TEXT CHECK (goal_type IN ('leads', 'engagement', 'conversions', 'awareness', 'nurturing')),
    goal_target INTEGER,                  -- Numeric target (e.g., 50 leads)
    goal_current INTEGER DEFAULT 0,       -- Current progress
    
    -- Channel focus
    primary_channel TEXT CHECK (primary_channel IN (
        'email', 'linkedin', 'website', 'event', 'partner', 'social_media', 'multi'
    )),
    
    -- Ownership
    owner TEXT DEFAULT 'Kevin',
    assigned_to TEXT,
    
    -- Metrics (updated by analytics)
    total_contacts_reached INTEGER DEFAULT 0,
    total_inbound_generated INTEGER DEFAULT 0,
    total_content_pieces INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_campaign_status ON campaigns(status);
CREATE INDEX idx_campaign_type ON campaigns(campaign_type);
CREATE INDEX idx_campaign_channel ON campaigns(primary_channel);
```

### 2.3 `campaign_content` (Junction Table)
Links campaigns to content pieces. A campaign can have many content pieces; a content piece can feed many campaigns.

```sql
CREATE TABLE campaign_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    content_piece_id UUID NOT NULL REFERENCES content_pieces(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'primary' CHECK (role IN ('primary', 'supporting', 'follow_up', 'repurposed_output')),
    added_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(campaign_id, content_piece_id)
);

CREATE INDEX idx_cc_campaign ON campaign_content(campaign_id);
CREATE INDEX idx_cc_content ON campaign_content(content_piece_id);
```

### 2.4 `mailing_list`
Contact management for email distribution.

```sql
CREATE TABLE mailing_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Contact info
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    company TEXT,
    role TEXT,
    industry TEXT,
    
    -- Classification
    source TEXT CHECK (source IN ('import', 'webinar', 'event', 'inbound', 'manual', 'linkedin', 'partner')),
    segment_tags TEXT[] DEFAULT '{}',     -- Array of tags: {'APAC', 'C-Suite', 'Tech'}
    
    -- Status
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
        'active', 'unsubscribed', 'bounced', 'inactive', 'do_not_contact'
    )),
    
    -- Engagement tracking
    last_email_sent_at TIMESTAMPTZ,
    last_email_opened_at TIMESTAMPTZ,
    last_response_at TIMESTAMPTZ,
    engagement_score INTEGER DEFAULT 0,   -- 0-100 computed score
    
    -- Metadata
    linkedin_url TEXT,
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ml_email ON mailing_list(email);
CREATE INDEX idx_ml_status ON mailing_list(status);
CREATE INDEX idx_ml_source ON mailing_list(source);
CREATE INDEX idx_ml_segments ON mailing_list USING GIN(segment_tags);
```

### 2.5 `campaign_mailing` (Junction Table)
Links campaigns to mailing list contacts for targeted outreach.

```sql
CREATE TABLE campaign_mailing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    mailing_list_id UUID NOT NULL REFERENCES mailing_list(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'opened', 'responded', 'unsubscribed')),
    
    UNIQUE(campaign_id, mailing_list_id)
);

CREATE INDEX idx_cm_campaign ON campaign_mailing(campaign_id);
CREATE INDEX idx_cm_contact ON campaign_mailing(mailing_list_id);
```

### 2.6 `repurposing_jobs`
Each row = one transformation task (source content → target format).

```sql
CREATE TABLE repurposing_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Source
    source_content_id UUID NOT NULL REFERENCES content_pieces(id) ON DELETE CASCADE,
    
    -- Target
    target_format TEXT NOT NULL CHECK (target_format IN (
        'blog_post', 'linkedin_post', 'twitter_thread', 'email_sequence',
        'case_study', 'presentation', 'social_post', 'newsletter_section',
        'executive_summary', 'key_takeaways', 'faq', 'video_script',
        'podcast_show_notes', 'infographic_text', 'other'
    )),
    
    -- Job tracking
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN (
        'queued', 'processing', 'review', 'approved', 'published', 'failed', 'cancelled'
    )),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    
    -- AI processing
    ai_model TEXT CHECK (ai_model IN ('deepseek-flash', 'deepseek-pro')),
    ai_prompt TEXT,                     -- The prompt sent to DeepSeek
    ai_response TEXT,                   -- Raw AI output
    ai_tokens_used INTEGER,
    ai_cost_cny NUMERIC(10,4),
    ai_job_id TEXT,                     -- External job tracking ID
    
    -- Output
    output_content_id UUID REFERENCES content_pieces(id),  -- Created content piece (if published)
    
    -- Checklist
    checklist JSONB DEFAULT '{
        "quality_check": false,
        "brand_consistency": false,
        "platform_optimized": false,
        "seo_keywords": false,
        "cta_included": false
    }',
    
    -- Metadata
    created_by TEXT DEFAULT 'Kevin',
    notes TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rj_source ON repurposing_jobs(source_content_id);
CREATE INDEX idx_rj_status ON repurposing_jobs(status);
CREATE INDEX idx_rj_output ON repurposing_jobs(output_content_id);
CREATE INDEX idx_rj_format ON repurposing_jobs(target_format);
```

### 2.7 `distribution_log`
Every content distribution event is logged here.

```sql
CREATE TABLE distribution_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Linkage
    content_piece_id UUID NOT NULL REFERENCES content_pieces(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    sequence_id UUID REFERENCES email_sequences(id) ON DELETE SET NULL,  -- Existing table
    
    -- Distribution details
    channel TEXT NOT NULL CHECK (channel IN (
        'email', 'linkedin', 'website', 'social_media', 'partner_network', 'event', 'newsletter'
    )),
    distribution_type TEXT DEFAULT 'manual' CHECK (distribution_type IN (
        'manual', 'scheduled', 'sequence', 'automated'
    )),
    
    -- Timing
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN (
        'scheduled', 'sent', 'delivered', 'failed', 'cancelled'
    )),
    
    -- Tracking (email-specific)
    recipient_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    responded_count INTEGER DEFAULT 0,
    bounced_count INTEGER DEFAULT 0,
    
    -- External tracking
    external_id TEXT,                   -- MS Graph message ID or LinkedIn post ID
    external_url TEXT,                  -- Public URL of published content
    
    -- Metadata
    notes TEXT,
    sent_by TEXT DEFAULT 'Kevin',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dl_content ON distribution_log(content_piece_id);
CREATE INDEX idx_dl_campaign ON distribution_log(campaign_id);
CREATE INDEX idx_dl_channel ON distribution_log(channel);
CREATE INDEX idx_dl_status ON distribution_log(status);
CREATE INDEX idx_dl_sent_at ON distribution_log(sent_at);
```

### 2.8 `inbound`
Track all inbound leads and inquiries.

```sql
CREATE TABLE inbound (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Contact info
    contact_name TEXT NOT NULL,
    email TEXT,
    company TEXT,
    role TEXT,
    phone TEXT,
    
    -- Source
    source TEXT NOT NULL CHECK (source IN (
        'email_inquiry', 'website_form', 'webinar_registration', 'linkedin_message',
        'event', 'referral', 'partner', 'cold_outbound_response', 'other'
    )),
    source_detail TEXT,                 -- Specifics: which webinar, which event, etc.
    source_campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    
    -- Content
    message TEXT,                       -- Original message/inquiry
    interest_area TEXT,                 -- What they're interested in
    urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'urgent')),
    
    -- Status pipeline
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN (
        'new', 'acknowledged', 'qualified', 'in_progress', 'responded',
        'meeting_scheduled', 'proposal_sent', 'closed_won', 'closed_lost', 'no_response'
    )),
    
    -- Assignment
    assigned_to TEXT DEFAULT 'Kevin',
    
    -- Response tracking
    first_response_at TIMESTAMPTZ,
    response_method TEXT CHECK (response_method IN ('email', 'linkedin', 'phone', 'meeting')),
    response_notes TEXT,
    
    -- Outcome
    outcome TEXT,                       -- What happened (deal value, engagement type, etc.)
    closed_at TIMESTAMPTZ,
    
    -- Timestamps
    received_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inbound_status ON inbound(status);
CREATE INDEX idx_inbound_source ON inbound(source);
CREATE INDEX idx_inbound_campaign ON inbound(source_campaign_id);
CREATE INDEX idx_inbound_received ON inbound(received_at);
CREATE INDEX idx_inbound_urgency ON inbound(urgency);
```

### 2.9 `templates`
Reusable content templates.

```sql
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Metadata
    name TEXT NOT NULL,
    description TEXT,
    template_type TEXT NOT NULL CHECK (template_type IN (
        'email', 'linkedin_post', 'blog', 'social_post', 'presentation',
        'case_study', 'newsletter', 'webinar_outline', 'proposal'
    )),
    
    -- Content
    structure JSONB NOT NULL,           -- Template structure with variables
    variables JSONB DEFAULT '{}',       -- Variable definitions: {{"name": "type": "text", "required": true}}
    example_output TEXT,                -- Example of filled template
    
    -- Classification
    channel TEXT CHECK (channel IN ('email', 'linkedin', 'blog', 'social', 'presentation', 'all')),
    purpose TEXT CHECK (purpose IN ('outreach', 'nurture', 'thought_leadership', 'case_study', 'event', 'general')),
    industry TEXT,                      -- Specific industry template
    cluster TEXT,                       -- Specific cluster/region template
    
    -- AI enhancement
    ai_enabled BOOLEAN DEFAULT false,   -- Can DeepSeek fill this template?
    ai_prompt_template TEXT,            -- The prompt template for AI generation
    
    -- Usage tracking
    use_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMPTZ,
    
    -- Ownership
    created_by TEXT DEFAULT 'Kevin',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_templates_type ON templates(template_type);
CREATE INDEX idx_templates_channel ON templates(channel);
CREATE INDEX idx_templates_purpose ON templates(purpose);
```

### 2.10 `ai_jobs`
Track all AI operations (repurposing is a subset; this table covers all AI work).

```sql
CREATE TABLE ai_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Job type
    job_type TEXT NOT NULL CHECK (job_type IN (
        'repurposing', 'drafting', 'summarization', 'translation',
        'analysis', 'scoring', 'generation', 'other'
    )),
    
    -- Reference
    related_entity_type TEXT CHECK (related_entity_type IN (
        'content_piece', 'repurposing_job', 'campaign', 'inbound', 'template'
    )),
    related_entity_id UUID,
    
    -- AI config
    model TEXT NOT NULL CHECK (model IN ('deepseek-flash', 'deepseek-pro')),
    prompt TEXT NOT NULL,
    system_prompt TEXT,
    temperature NUMERIC(3,2) DEFAULT 0.7,
    max_tokens INTEGER DEFAULT 4000,
    
    -- Execution
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN (
        'queued', 'processing', 'completed', 'failed', 'retrying'
    )),
    response TEXT,
    tokens_input INTEGER,
    tokens_output INTEGER,
    cost_cny NUMERIC(10,4),
    duration_ms INTEGER,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    
    -- Metadata
    created_by TEXT DEFAULT 'Kevin',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_ai_status ON ai_jobs(status);
CREATE INDEX idx_ai_type ON ai_jobs(job_type);
CREATE INDEX idx_ai_model ON ai_jobs(model);
```

---

## 3. Existing Tables (Keep As-Is)

These tables already exist in Supabase and remain unchanged:
- `products` (30 rows) — LYC service catalog
- `email_sequences` (26 rows) — Email sequence definitions
- `sequence_emails` (102 rows) — Individual emails in sequences
- `assets` (132 rows) — Legacy asset tracking (superseded by content_pieces)
- `build_tracker` (291 rows) — Build progress tracking
- `campaign_contacts` (4,310 rows) — Legacy campaign contact assignments (data to migrate to mailing_list)

---

## 4. Data Migration Plan

### From `campaign_contacts` → `mailing_list`
```sql
-- Migrate unique contacts from campaign_contacts to mailing_list
INSERT INTO mailing_list (email, first_name, last_name, company, role, source, segment_tags)
SELECT DISTINCT ON (LOWER(email))
    email,
    first_name,
    last_name,
    company,
    job_title AS role,
    'import' AS source,
    ARRAY_AGG(DISTINCT campaign_id::TEXT) AS segment_tags
FROM campaign_contacts
WHERE email IS NOT NULL
GROUP BY email, first_name, last_name, company, job_title;
```

### From `assets` → `content_pieces` (selective)
```sql
-- Migrate assets that represent actual content
INSERT INTO content_pieces (title, content_type, status, source, source_url, file_url, notion_page_id)
SELECT
    name AS title,
    CASE type
        WHEN 'document' THEN 'blog'
        WHEN 'presentation' THEN 'presentation'
        WHEN 'spreadsheet' THEN 'other'
        ELSE 'other'
    END AS content_type,
    CASE status
        WHEN 'review' THEN 'review'
        WHEN 'approved' THEN 'approved'
        ELSE 'draft'
    END AS status,
    'notion' AS source,
    NULL AS source_url,
    file_url,
    notion_page_id
FROM assets
WHERE name IS NOT NULL;
```

---

## 5. Views (Pre-built Queries)

```sql
-- Campaign overview with counts
CREATE VIEW v_campaign_overview AS
SELECT
    c.*,
    COUNT(DISTINCT cc.content_piece_id) AS content_count,
    COUNT(DISTINCT cm.mailing_list_id) AS contact_count,
    COUNT(DISTINCT dl.id) AS distribution_count,
    COUNT(DISTINCT i.id) AS inbound_count
FROM campaigns c
LEFT JOIN campaign_content cc ON c.id = cc.campaign_id
LEFT JOIN campaign_mailing cm ON c.id = cm.campaign_id
LEFT JOIN distribution_log dl ON c.id = dl.campaign_id
LEFT JOIN inbound i ON c.id = i.source_campaign_id
GROUP BY c.id;

-- Content repurposing chains
CREATE VIEW v_repurposing_chains AS
SELECT
    cp.id AS source_id,
    cp.title AS source_title,
    cp.content_type AS source_type,
    rj.id AS job_id,
    rj.target_format,
    rj.status AS job_status,
    rj.output_content_id,
    output.title AS output_title,
    output.status AS output_status
FROM content_pieces cp
LEFT JOIN repurposing_jobs rj ON cp.id = rj.source_content_id
LEFT JOIN content_pieces output ON rj.output_content_id = output.id;

-- Distribution calendar (upcoming)
CREATE VIEW v_distribution_calendar AS
SELECT
    dl.*,
    cp.title AS content_title,
    cp.content_type,
    c.name AS campaign_name
FROM distribution_log dl
JOIN content_pieces cp ON dl.content_piece_id = cp.id
LEFT JOIN campaigns c ON dl.campaign_id = c.id
WHERE dl.scheduled_at >= NOW()
ORDER BY dl.scheduled_at;

-- Inbound pipeline summary
CREATE VIEW v_inbound_pipeline AS
SELECT
    status,
    COUNT(*) AS count,
    COUNT(*) FILTER (WHERE urgency = 'high' OR urgency = 'urgent') AS urgent_count,
    MIN(received_at) AS oldest
FROM inbound
GROUP BY status;
```

---

## 6. RLS Policies (Minimal — Solo User)

Even though Kevin is the sole user, basic RLS is recommended for data integrity:

```sql
-- Enable RLS on all tables
ALTER TABLE content_pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE mailing_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE repurposing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE distribution_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbound ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_mailing ENABLE ROW LEVEL SECURITY;

-- Allow all access via service role (server components)
-- No additional policies needed since we use service_role_key
```

---

*Document generated: 2026-07-20 | Author: NEXUS Agent | Version 2.0*
