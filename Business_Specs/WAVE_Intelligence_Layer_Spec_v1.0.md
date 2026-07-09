# WAVE Intelligence Layer — Full Specification

**Version:** 1.0  
**Date:** 2026-07-10  
**Status:** Ready for implementation  
**Priority:** P0 — This is the brain. Without it, WAVE is a static dashboard.

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    WAVE (Next.js App)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │Content   │ │Templates │ │Journeys  │ │Analytics │      │
│  │Calendar  │ │& Assets  │ │& Funnels │ │& Reports │      │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘      │
│       │            │            │            │              │
│  ┌────▼────────────▼────────────▼────────────▼────────┐    │
│  │         Intelligence Layer (DeepSeek API)          │    │
│  │  ┌─────────────┐ ┌────────────┐ ┌──────────────┐  │    │
│  │  │Content Gen  │ │Campaign    │ │Journey       │  │    │
│  │  │Engine       │ │Optimizer   │ │Optimizer     │  │    │
│  │  └──────┬──────┘ └─────┬──────┘ └───────┬──────┘  │    │
│  └─────────┼───────────────┼─────────────────┼────────┘    │
│            │               │                 │              │
│  ┌─────────▼───────────────▼─────────────────▼────────┐    │
│  │              Action Engine                         │    │
│  │  ┌─────────────┐ ┌────────────┐ ┌──────────────┐  │    │
│  │  │Publish      │ │Email       │ │Registration  │  │    │
│  │  │Content      │ │Sequence    │ │Handler       │  │    │
│  │  └──────┬──────┘ └─────┬──────┘ └───────┬──────┘  │    │
│  └─────────┼───────────────┼─────────────────┼────────┘    │
│            │               │                 │              │
│  ┌─────────▼───────────────▼─────────────────▼────────┐    │
│  │              Report Generator                      │    │
│  │  ┌─────────────┐ ┌────────────┐ ┌──────────────┐  │    │
│  │  │Content      │ │Campaign    │ │Journey       │  │    │
│  │  │Performance  │ │ROI Report  │ │Conversion    │  │    │
│  │  └─────────────┘ └────────────┘ └──────────────┘  │    │
│  └────────────────────────────────────────────────────┘    │
│                            │                               │
│  ┌─────────────────────────▼──────────────────────────┐   │
│  │              Supabase (Data Layer)                 │   │
│  │  content_assets | campaigns | journeys | events    │   │
│  │  email_sequences | mailing_lists | registrations   │   │
│  └────────────────────────────────────────────────────┘   │
│                            │                               │
│  ┌─────────────────────────▼──────────────────────────┐   │
│  │         Agent Bridge (Feishu ↔ Supabase)           │   │
│  │  ECHO (content) | CARL (events) | MARIA (email)    │   │
│  │  EMILY (registration) | VALENTINA (website)        │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. DeepSeek API Integration

### 2.1 Configuration

**Environment variables (Vercel):**

```
DEEPSEEK_API_KEY=sk-YOUR_DEEPSEEK_API_KEY
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL_FLASH=deepseek-chat          # Fast responses (< 3s)
DEEPSEEK_MODEL_PRO=deepseek-reasoner        # Complex reasoning (< 30s)
```

**Helper module:** `lib/deepseek.ts`

```typescript
export async function callDeepSeek(
  prompt: string,
  options?: { model?: 'flash' | 'pro'; maxTokens?: number; temperature?: number }
): Promise<string>
```

### 2.2 Intelligence Routes — Replace All Hardcoded Logic

Every `/api/intelligence/*` route must call DeepSeek instead of if/else.

#### Route: `GET /api/intelligence/content/[id]/optimize`

**Purpose:** AI suggests improvements to content before publishing.

**Prompt template:**

```
You are a content optimization specialist. Given this content draft, suggest:
1. Headline improvements (3 alternatives, ranked by engagement potential)
2. Opening hook (rewrite first 2 sentences for maximum impact)
3. CTA optimization (make it more specific and action-oriented)
4. SEO/keyword suggestions (for web content)
5. Tone/voice adjustments (align with LYC Partners brand)

Content:
Title: {title}
Type: {content_type}
Channel: {channel}
Target cluster: {cluster_name}
Target product: {product_name}

Current draft:
{content_body}

Brand voice guidelines:
- Professional but approachable
- Data-driven, not hype-driven
- Focus on diagnostic insights, not generic advice
- Use active voice, avoid jargon

Output format (JSON):
{
  "headline_alternatives": ["...", "...", "..."],
  "opening_hook": "...",
  "cta_optimization": "...",
  "seo_keywords": ["...", "...", "..."],
  "tone_adjustments": "..."
}
```

**Output:** JSON `{ suggestions: object, confidence: number }`

---

#### Route: `GET /api/intelligence/campaign/[id]/optimize`

**Purpose:** AI analyzes campaign performance and suggests improvements.

**Prompt:**

```
You are a campaign optimization specialist. Given this campaign's performance data, recommend:
1. Top 3 underperforming content pieces and how to fix them
2. Top 3 high-performing content pieces and how to double down
3. Audience segmentation opportunities (which clusters respond best?)
4. Timing optimization (when should we publish more content?)
5. Channel optimization (which channels drive most conversions?)

Campaign: {campaign_name}
Duration: {start_date} to {end_date}
Target clusters: {clusters}
Target products: {products}

Performance data:
- Total content pieces: {content_count}
- Total reach: {reach}
- Total engagement: {engagement}
- Total conversions: {conversions}
- Cost: {cost}
- ROI: {roi}

Content breakdown:
{content_performance_json}

Cluster breakdown:
{cluster_performance_json}

Channel breakdown:
{channel_performance_json}

Output format (JSON):
{
  "underperforming_content": [
    {"title": "...", "issue": "...", "fix": "..."}
  ],
  "high_performing_content": [
    {"title": "...", "success_factor": "...", "recommendation": "..."}
  ],
  "segmentation_opportunities": ["...", "..."],
  "timing_recommendations": ["...", "..."],
  "channel_recommendations": ["...", "..."]
}
```

---

#### Route: `GET /api/intelligence/journey/[id]/optimize`

**Purpose:** AI analyzes B2C journey conversion rates and suggests improvements.

**Prompt:**

```
You are a conversion optimization specialist. Given this B2C journey's performance, recommend:
1. Top 3 drop-off points and how to fix them
2. Email subject line improvements (for low-open-rate emails)
3. CTA improvements (for low-click-rate emails)
4. Timing adjustments (are we sending too fast/slow?)
5. Cross-sell opportunities (what should we suggest after assessment completion?)

Journey: {journey_name}
Entry trigger: {trigger}
Total entries: {entry_count}
Completion rate: {completion_rate}%
Avg time to complete: {avg_time}

Stage-by-stage breakdown:
{stage_breakdown_json}

Email performance:
{email_performance_json}

Drop-off analysis:
{drop_off_json}

Output format (JSON):
{
  "drop_off_fixes": [
    {"stage": "...", "issue": "...", "fix": "...", "expected_improvement": "..."}
  ],
  "subject_line_alternatives": [
    {"original": "...", "alternative": "...", "rationale": "..."}
  ],
  "cta_improvements": [
    {"original": "...", "alternative": "...", "rationale": "..."}
  ],
  "timing_adjustments": ["...", "..."],
  "cross_sell_opportunities": ["...", "..."]
}
```

---

#### Route: `POST /api/intelligence/generate-content`

**Purpose:** AI generates content from template + diagnostic data.

**Request body:**

```json
{
  "template_id": "uuid",
  "variables": {
    "product_name": "BRIDGE",
    "cluster_name": "China/APAC Leaders",
    "key_message": "Board readiness requires cultural intelligence",
    "tone": "professional",
    "word_count": 500
  },
  "source_data": {
    "diagnostic_insights": "...",
    "research_data": "..."
  }
}
```

**DeepSeek prompt:**

```
You are a content writer for LYC Partners. Generate {content_type} content based on:

Template: {template_content}
Product: {product_name}
Target cluster: {cluster_name}
Key message: {key_message}
Tone: {tone}
Word count: ~{word_count} words

Source data:
{source_data}

Brand voice guidelines:
- Professional but approachable
- Data-driven, not hype-driven
- Focus on diagnostic insights, not generic advice
- Use active voice, avoid jargon
- Include specific examples or case studies when possible

Output format:
{
  "content": "...",
  "word_count": 500,
  "readability_score": 85,
  "seo_keywords": ["...", "..."],
  "suggested_headline": "..."
}
```

**Writes to:** `content_assets` table (status: 'draft')

---

#### Route: `POST /api/intelligence/generate-repurposing-map`

**Purpose:** AI suggests how to repurpose a source asset into 10+ derivatives.

**Request body:**

```json
{
  "source_asset_id": "uuid",
  "source_content": "...",
  "source_type": "webinar",
  "target_channels": ["article", "linkedin", "newsletter", "podcast", "youtube"]
}
```

**DeepSeek prompt:**

```
You are a content repurposing strategist. Given this {source_type}, suggest 10+ derivatives:

Source content:
{source_content}

Target channels: {target_channels}

For each derivative, specify:
1. Content type (article, LinkedIn post, newsletter excerpt, podcast script, YouTube description, etc.)
2. Target channel
3. Key angle/hook (what's the focus?)
4. Word count / duration
5. Template to use
6. Owner (Echo, Carl, Maria, Xuemei, Valentina)
7. Due date offset (days after source publish)

Output format (JSON array):
[
  {
    "derivative_type": "article",
    "channel": "website",
    "angle": "3 key insights from the webinar",
    "word_count": 800,
    "template_id": "uuid",
    "owner": "valentina",
    "due_date_offset_days": 1
  },
  ...
]
```

**Writes to:** `repurposing_maps` + `repurposing_derivatives` tables

---

## 3. Action Engine — Execute Buttons That Actually Work

### 3.1 Publish Content

**Route:** `POST /api/actions/publish-content`

**Flow:**

```
1. User clicks "Publish" on content asset
2. Frontend routes to appropriate channel:
   - LinkedIn → LinkedIn API (Echo agent)
   - Podcast → Ausha API (Echo agent)
   - Newsletter → Email API (Maria agent)
   - Article → Vercel (Valentina agent)
   - YouTube → YouTube API (Echo agent)
3. Each agent writes to Supabase:
   - Update `content_assets.status` = 'published'
   - Update `content_assets.published_url` = '...'
   - Update `content_assets.published_at` = now()
4. WAVE Realtime subscription detects change → UI updates
```

**Agent integration:**

```typescript
// Example: LinkedIn publish via Echo agent
POST /api/actions/publish-content
{
  "asset_id": "uuid",
  "channel": "linkedin"
}

→ Calls Feishu Messaging API → sends message to ECHO group chat
→ Echo agent reads message → publishes to LinkedIn → writes to Supabase
→ WAVE Realtime detects change → UI shows "Published"
```

---

### 3.2 Send Email Sequence

**Route:** `POST /api/actions/send-email-sequence`

**Flow:**

```
1. User clicks "Activate Sequence" on email sequence
2. Backend calls Maria agent via Feishu Messaging API
3. Maria agent:
   - Reads sequence config from `email_sequences` table
   - Reads mailing list from `mailing_lists` table
   - Calls email API (SendGrid/Mailgun/MS Graph)
   - Writes to `email_metrics` table
4. WAVE Realtime detects change → UI shows "Sent"
```

---

### 3.3 Create Campaign

**Route:** `POST /api/actions/create-campaign`

**Flow:**

```
1. User clicks "Create Campaign"
2. Frontend opens modal:
   - Campaign name
   - Objective
   - Target clusters (multi-select)
   - Target products (multi-select)
   - Start/end dates
3. User clicks "Generate with AI"
4. DeepSeek generates:
   - Campaign description
   - Content plan (10 content pieces with types, channels, owners, due dates)
   - Email sequence (3-email nurture sequence)
   - KPI targets
5. User reviews/approves
6. Creates record in `campaigns` table
7. Creates linked `content_assets` for each content piece
8. Creates linked `email_sequences` for nurture sequence
```

---

### 3.4 Generate Repurposing Map

**Route:** `POST /api/actions/generate-repurposing-map`

**Flow:**

```
1. User clicks "Generate Repurposing Map" on source asset
2. Backend calls `/api/intelligence/generate-repurposing-map`
3. DeepSeek suggests 10+ derivatives
4. User reviews/approves
5. Creates records in `repurposing_maps` + `repurposing_derivatives`
6. Routes derivatives to owners (Echo, Carl, Maria, Xuemei, Valentina)
7. Owners receive Feishu notifications with tasks
```

---

### 3.5 Register Attendee

**Route:** `POST /api/actions/register-attendee`

**Flow:**

```
1. User fills registration form (on website or in WAVE)
2. Backend creates record in `event_registrations` table
3. Emily agent receives Feishu notification
4. Emily agent:
   - Sends confirmation email via email API
   - Creates calendar invite
   - Updates `event_registrations.payment_status` (if paid event)
5. WAVE Realtime detects change → UI shows new registration
```

---

## 4. Report Generator

### 4.1 Report Types

| Report | Trigger | Output |
|---|---|---|
| Content Performance | Weekly + manual | Top content, engagement metrics, recommendations |
| Campaign ROI | Per campaign | Reach, engagement, conversions, ROI, recommendations |
| Journey Conversion | Per journey | Funnel breakdown, drop-off analysis, optimization suggestions |
| Repurposing ROI | Per source asset | Derivative count, reach, time-to-publish, cost per derivative |
| Email Metrics | Per sequence | Open rate, click rate, unsubscribe rate, recommendations |

### 4.2 Report UI

**Route:** `GET /api/reports/[type]`

**UI:**

- "Generate Report" button on every page
- Report renders as a rich card with:
  - Markdown-formatted content
  - Key metrics highlighted
  - "Copy to clipboard" button
  - "Export as PDF" button
  - "Email to..." button (sends via Maria agent)

### 4.3 Scheduled Reports

**Via Vercel Cron or Supabase Edge Functions:**

- Weekly Monday: Content Performance Report → auto-generated
- On campaign end: Campaign ROI Report → auto-generated
- On journey completion: Journey Conversion Report → auto-generated

---

## 5. Agent ↔ App Bridge

### 5.1 How Agents Write to Supabase

Each agent (Echo, Carl, Maria, Emily, Valentina) writes to Supabase via the Supabase Management API or Edge Functions. The WAVE app reads the same tables — so when agents write, the app updates.

| Agent | Writes to | WAVE displays |
|---|---|---|
| ECHO | `content_assets` (published content) | Content Calendar, Analytics |
| CARL | `events` (event details) | Registration page |
| MARIA | `email_metrics` (email performance) | Analytics, Email Sequences |
| EMILY | `event_registrations` (registrations) | Registrations page |
| VALENTINA | `content_assets.published_url` | Content Calendar |

### 5.2 Trigger Routes → Agent Group Chats

**Existing routes:** `/api/trigger/echo`, `/api/trigger/carl`, `/api/trigger/maria`, `/api/trigger/emily`, `/api/trigger/valentina`

**Required implementation:**

```
POST /api/trigger/echo → calls Feishu Messaging API → sends message to ECHO group chat
ECHO agent reads message → executes content production → writes to Supabase
WAVE Realtime subscription detects change → UI updates
```

**Payload to agent:**

```json
{
  "action": "publish_content",
  "asset_id": "uuid",
  "channel": "linkedin",
  "callback": "write_to_supabase"
}
```

### 5.3 UI Triggers

Each page gets a "Trigger Agent" button:

- Content Calendar → "Publish Content" (triggers ECHO)
- Events → "Send Reminders" (triggers EMILY)
- Email Sequences → "Send Sequence" (triggers MARIA)
- Registrations → "Export Leads" (triggers EMILY)

---

## 6. Real-Time Reactivity

### 6.1 Supabase Realtime Subscriptions

```typescript
// In Content Calendar, Analytics, Registrations pages:
supabase.channel('wave_changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'content_assets' }, (payload) => {
    updateContent(payload.new)
  })
  .on('postgres_changes', { event: '*', schema: 'public', table: 'event_registrations' }, (payload) => {
    addRegistration(payload.new)
  })
  .on('postgres_changes', { event: '*', schema: 'public', table: 'email_metrics' }, (payload) => {
    updateMetrics(payload.new)
  })
  .subscribe()
```

**Result:** When agents write to Supabase (publish content, send emails, register attendees), the WAVE UI updates instantly — content status changes, metrics update, new registrations appear. No manual refresh needed.

---

## 7. Implementation Priority

### Wave 1: Intelligence Layer (4-5 hours)

1. `lib/deepseek.ts` — API helper with flash + pro models
2. `/api/intelligence/content/[id]/optimize` — AI content suggestions
3. `/api/intelligence/campaign/[id]/optimize` — AI campaign analysis
4. `/api/intelligence/journey/[id]/optimize` — AI journey optimization
5. `POST /api/intelligence/generate-content` — AI content generation
6. `POST /api/intelligence/generate-repurposing-map` — AI repurposing suggestions

### Wave 2: Action Engine (4-5 hours)

1. `POST /api/actions/publish-content` — route to channels via agents
2. `POST /api/actions/send-email-sequence` — trigger Maria agent
3. `POST /api/actions/create-campaign` — AI generates campaign plan
4. `POST /api/actions/generate-repurposing-map` — AI generates derivative plan
5. `POST /api/actions/register-attendee` — create registration + confirmation

### Wave 3: Report Generator (2-3 hours)

1. `GET /api/reports/content-performance` — weekly content report
2. `GET /api/reports/campaign-roi` — per-campaign report
3. `GET /api/reports/journey-conversion` — per-journey report
4. "Generate Report" button on every page
5. "Export as PDF" / "Email to..." buttons

### Wave 4: Agent Bridge (3-4 hours)

1. Implement `/api/trigger/*` routes → Feishu Messaging API
2. "Trigger Agent" buttons on each page
3. Real-time display of agent-generated content
4. Supabase Realtime subscriptions on all pages

**Total: ~13-17 hours of focused implementation.**

---

## 8. Technical Constraints

1. **DeepSeek API only** — No Coze LLM for compute. All AI calls go through DeepSeek.
2. **Rate limits:** DeepSeek flash = 10 req/sec, pro = 3 req/sec. Batch operations must respect limits.
3. **Cost:** ~$0.01 per 1000 tokens (flash), ~$0.03 per 1000 tokens (pro). Content generation ≈ $0.05-0.10 per piece.
4. **Vercel limits:** Serverless functions timeout at 10s (Hobby) or 60s (Pro). Bulk operations must use streaming or chunked responses.
5. **Supabase Realtime:** Free tier supports 200 concurrent connections. Sufficient for team collaboration.

---

## 9. Acceptance Criteria

- Every "intelligence" route calls DeepSeek — zero hardcoded if/else logic
- Content generation produces coherent, on-brand draft in < 10 seconds
- Campaign optimization suggests actionable improvements based on performance data
- Journey optimization identifies drop-off points and suggests fixes
- Repurposing map generation suggests 10+ derivatives from 1 source asset
- "Publish Content" button routes to appropriate agent via Feishu
- "Send Email Sequence" button triggers Maria agent
- "Generate Report" produces a coherent AI-written summary
- "Trigger Agent" sends a message to the Feishu group chat
- Supabase changes appear in WAVE UI within 2 seconds (Realtime)
- All AI-generated content is editable before execution
- Every AI action is logged to `activities` table for audit trail

---

**END OF INTELLIGENCE LAYER SPEC**
