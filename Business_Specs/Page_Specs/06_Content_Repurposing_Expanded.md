# WAVE Business Spec — Page 6: Content Repurposing Engine (EXPANDED)

**Version:** 2.1 | **Date:** 2026-07-11 | **Status:** Draft for Kevin Review
**Supersedes:** TICKET-055 through TICKET-061 (existing v1.0 — 7 tickets, ~21h)
**Builds on:** Content Calendar (Page 2), Template Library (Page 3), Distribution Engine (Page 4)
**New tickets:** REP-001 through REP-078
**Total effort:** 210h (up from ~21h)
**Integrates:** 12 Audit Criteria (C1-C12) + Infrastructure Components (INFRA-100 to INFRA-112)

---

## 1. Purpose

The Content Repurposing Engine is WAVE's content multiplication layer. It answers:
1. **"What can this one piece of content become?"** — AI maps 1 source → 10+ derivatives across channels
2. **"How do we generate all those derivatives without rewriting everything?"** — DeepSeek transforms source content into channel-specific formats automatically
3. **"Where does each derivative stand?"** — Tree view tracking from source through every derivative to published
4. **"Is the multiplication worth it?"** — ROI per source: reach multiplication, cost per derivative, engagement per format
5. **"What worked best last time?"** — Performance analytics per derivative type → informs next map

It must feel like **Canva's content generator + Notion's block editing + Zapier's automation flow** — not a file management tool or a spreadsheet of derivatives.

**Current state (what exists today):**
- Static table with 5 hardcoded rows (title, source, outputs, date)
- No Supabase connection
- No repurposing map builder
- No AI generation
- No derivative tracking
- No ROI metrics
- No channel-specific formatting
- No performance analytics
- No approval workflow

**Expansion scope (what this spec adds):**

| Area | Current | Expanded |
|------|---------|----------|
| Map builder | None | Visual tree: source at center, derivatives branching out by channel |
| AI generation | None | DeepSeek transforms source → 10+ channel-specific derivatives |
| Derivative types | None | 14 types: article, LinkedIn post (×3 formats), newsletter excerpt, podcast script, YouTube description, Twitter/X thread, carousel, infographic text, quote cards, email sequence, executive brief, case study, blog summary, social captions |
| Source types | None | 8 types: webinar recording, podcast episode, case study, assessment report, workshop recording, board report, research paper, live event notes |
| Channel routing | None | Each derivative auto-linked to distribution channel + owner + template |
| Approval workflow | None | AI draft → human review → approve/edit → schedule → publish |
| Performance tracking | None | Per-derivative: views, engagement, conversions, time-to-publish |
| ROI dashboard | Basic ticket | Full multiplication metrics: source reach × derivative count × engagement rate |
| Repurposing templates | None | Pre-built maps: "Webinar → 12 pieces", "Podcast → 8 pieces", "Case Study → 10 pieces" |
| Batch mode | None | Select multiple sources → generate all derivatives in one run |
| Content extraction | None | AI extracts: key quotes, statistics, themes, action items, audience questions |
| Deduplication | None | Prevents generating duplicate content across maps |
| Integration | None | Deep: Calendar (source scheduling), Templates (derivative templates), Distribution (auto-publish), Analytics (performance) |
| Canvas editing | None | Visual tree with inline editing, drag to reassign owner/channel, expand/collapse branches |
| Layout freedom | None | Split view (tree + content preview), zoom levels, filter by channel/status/owner, focus mode per map |

---

## 2. Business Requirements

### 2.1 Functional Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-1 | Create repurposing map: link 1 source asset to N derivative definitions | P0 | Source must exist in content_assets |
| FR-2 | AI-generate repurposing map: suggest optimal derivative mix for a source type | P0 | Based on source type + historical performance |
| FR-3 | Define each derivative: type, channel, template, owner, due date offset, word/format constraints | P0 | Inline in tree, not modal |
| FR-4 | Trigger generation: when source is published OR manually triggered | P0 | Auto on publish or click "Generate" |
| FR-5 | AI-generate each derivative using source content + template + channel constraints | P0 | DeepSeek flash for speed |
| FR-6 | Review workflow: AI draft → owner reviews → edits inline → approves → scheduled | P0 | No modal — inline editing |
| FR-7 | Auto-schedule approved derivatives to Distribution Engine | P1 | Links to content_schedules |
| FR-8 | Tree visualization: source → derivative branches with status color coding | P0 | Visual, not just table |
| FR-9 | Real-time status tracking: pending → generating → draft → review → approved → scheduled → published | P0 | Supabase Realtime |
| FR-10 | Performance tracking per derivative: views, engagement, conversions | P1 | From analytics integrations |
| FR-11 | ROI dashboard: multiplication ratio, reach expansion, cost per derivative, time-to-publish | P1 | Per source and aggregate |
| FR-12 | Repurposing templates: pre-built maps for common source types | P1 | "Webinar → 12 pieces" etc. |
| FR-13 | Content extraction: AI pulls key quotes, stats, themes, action items from source | P0 | Used for derivative generation |
| FR-14 | Batch mode: select multiple sources → generate all maps at once | P2 | For content-heavy weeks |
| FR-15 | Deduplication: flag if derivative content overlaps >80% with existing published content | P1 | Prevents audience fatigue |
| FR-16 | Derivative versioning: regenerate, edit, track versions | P1 | Same as content_assets versioning |
| FR-17 | Channel-specific auto-formatting: word count, hashtags, mentions, image dimensions | P1 | LinkedIn ≠ newsletter ≠ YouTube |
| FR-18 | Owner notification: Feishu alert when derivative is ready for review | P1 | With direct link to derivative |
| FR-19 | Map cloning: duplicate a successful map for a new source | P2 | "Use this map again" |
| FR-20 | Archive: completed maps archive after all derivatives published | P2 | Clean workspace |

### 2.2 Derivative Type Specifications

| Derivative Type | Channel | Owner | Template | Avg Word Count | Format Constraints |
|----------------|---------|-------|----------|---------------|-------------------|
| Blog Article | Website | Valentina | Blog Post | 1,200-2,000 | H2/H3 structure, images, CTA |
| LinkedIn Post (Insight) | LinkedIn | Echo | LinkedIn Insight | 200-400 | Hook + insight + CTA, 3-5 hashtags |
| LinkedIn Post (Story) | LinkedIn | Echo | LinkedIn Story | 300-500 | Personal narrative + lesson |
| LinkedIn Carousel | LinkedIn | Echo | Carousel Text | 8-12 slides | One idea per slide, visual notes |
| Newsletter Excerpt | Email | Maria | Newsletter Section | 150-300 | Teaser + "read more" link |
| Podcast Script | Podcast | Xuemei | Podcast Script | 1,500-3,000 | Intro + 3 segments + outro |
| YouTube Description | YouTube | Echo | YouTube Desc | 200-400 | Timestamps + links + keywords |
| Twitter/X Thread | Twitter/X | Echo | Thread | 5-12 tweets | Hook + 1 idea per tweet + CTA |
| Social Captions (IG) | Instagram | Echo | Social Caption | 100-200 | Visual context + hashtags |
| Quote Cards | Multi | Echo | Quote Card Text | 15-30 per quote | 3-5 quotes, attribution |
| Executive Brief | Internal | NEXUS | Exec Brief | 300-500 | Key takeaways + action items |
| Email Sequence | Email | Maria | Email Seq | 3-5 emails, 200 each | Nurture flow from source topic |
| Case Study | Website | Echo | Case Study | 800-1,200 | Challenge → approach → result |
| Infographic Text | Multi | Echo | Infographic | 500-800 | Data points + narrative flow |

### 2.3 Source Content Types

| Source Type | Input Format | Extraction Method | Typical Derivative Count |
|-------------|-------------|-------------------|------------------------|
| Webinar Recording | Video + transcript | AI transcription + summary | 10-14 derivatives |
| Podcast Episode | Audio file | AI transcription + key moments | 6-10 derivatives |
| Case Study | Document (PDF/Doc) | AI extraction + restructuring | 8-12 derivatives |
| Assessment Report | Structured data (JSON) | Data insights + narrative | 5-8 derivatives |
| Workshop Recording | Video + slides | AI transcription + slide extraction | 10-14 derivatives |
| Board Report | Presentation (PPTX) | AI summary + key metrics | 4-6 derivatives |
| Research Paper | Document | AI abstraction + key findings | 6-8 derivatives |
| Live Event Notes | Text notes | AI structuring + expansion | 5-8 derivatives |

---

## 3. User Requirements

### 3.1 User Role Needs

| User | Primary Needs | Key Views | Frequency |
|------|--------------|-----------|-----------|
| **Echo** (Content) | Create maps, review AI drafts, publish derivatives | Tree view, content editor, calendar | Daily |
| **Valentina** (Website) | Receive blog articles for publishing | My assignments queue | 2-3x/week |
| **Maria** (Email) | Review newsletter excerpts, schedule email sequences | My assignments queue, email preview | Daily |
| **Xuemei** (Scripts) | Review podcast scripts, edit before recording | My assignments queue, script editor | Per episode |
| **NEXUS** (Orchestrator) | Monitor ROI, trigger batch repurposing, quality control | ROI dashboard, health overview | Weekly + automated |
| **Kevin** (CTO) | Executive view: content multiplication efficiency | ROI summary, top performers | Weekly |

### 3.2 Key User Flows

**Flow 1: Create Repurposing Map (Manual)**
```
Select source asset → Click "Create Map" → Tree appears with source at center
→ Click "+" to add derivative → Select type, channel, template, owner, offset
→ Repeat for each derivative (or use AI suggest)
→ Click "Activate Map" → Status: Active
→ When source publishes → Trigger generation (Flow 2)
```

**Flow 2: AI Generation Pipeline**
```
Trigger (source published OR manual "Generate")
→ AI extracts: key quotes, stats, themes, action items, audience questions
→ For each derivative in map:
  → Load template + channel constraints + source extraction
  → Call DeepSeek with structured prompt
  → Save draft to repurposing_derivatives (status: 'draft')
  → Notify owner via Feishu
→ Owner reviews: edit inline → Approve → Auto-schedule to Distribution
→ Track through to published
```

**Flow 3: Review & Publish**
```
Owner receives notification → Opens derivative in context (no modal)
→ Reads AI draft → Edits inline (block editor)
→ Checks against brand guidelines (auto-validated)
→ Clicks "Approve" → Status: approved
→ Auto-schedules to Distribution Engine (channel-specific timing)
→ When published → Status: published → Analytics start tracking
```

**Flow 4: Batch Repurposing**
```
Select multiple source assets (checkbox in calendar or list)
→ Click "Batch Create Maps"
→ For each source: AI auto-selects best template based on source type
→ Review all maps in batch view → Edit if needed
→ Click "Activate All" → Queue generation
→ Monitor progress in batch dashboard
```

---

## 4. UX Requirements

### 4.1 Page Layout (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Repurposing Engine                          [+ New Map] [Batch] [⚙]  │
│  Transform one piece into ten. Automatically.                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌── OVERVIEW BAR ──────────────────────────────────────────────────┐  │
│  │  📊 23 maps │ 187 derivatives │ 142 published │ 1.8x mult avg   │  │
│  │  🔄 12 in progress │ ⏳ 8 awaiting review │ ⚡ 3 overdue        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌── MAP LIST / TREE VIEW (toggle) ─────────────────────────────────┐  │
│  │                                                                    │  │
│  │  ┌─ MAP VIEW (selected) ──────────────────────────────────────┐   │  │
│  │  │                                                            │   │  │
│  │  │    ┌─────────────────┐                                     │   │  │
│  │  │    │  SOURCE:        │                                     │   │  │
│  │  │    │  BRIDGE Webinar │                                     │   │  │
│  │  │    │  Jul 10, 2026   │                                     │   │  │
│  │  │    │  ✅ Published   │                                     │   │  │
│  │  │    └────────┬────────┘                                     │   │  │
│  │  │             │                                               │   │  │
│  │  │    ┌────────┼────────────────────────────────┐             │   │  │
│  │  │    │        │        │        │        │      │             │   │  │
│  │  │    ▼        ▼        ▼        ▼        ▼      ▼             │   │  │
│  │  │  🟢       🟢       🟡       🟡       🔵     ⚪           │   │  │
│  │  │  Blog     LinkedIn  Newsletter Podcast  Twitter  Exec       │   │  │
│  │  │  Article  Carousel  Excerpt   Script   Thread   Brief       │   │  │
│  │  │  ✅Pub    ✅Pub     📝Edit   🎧Draft  📅Sched  ⏳Pend       │   │  │
│  │  │  Valentina Echo     Maria    Xuemei   Echo     NEXUS       │   │  │
│  │  │                                                            │   │  │
│  │  │  ┌─ EXPAND BRANCH (click any derivative) ──────────────┐   │   │  │
│  │  │  │  LinkedIn Carousel                                    │   │   │  │
│  │  │  │  ┌─────────────────────────────────────────────────┐ │   │   │  │
│  │  │  │  │ [Content Preview — editable inline]             │ │   │   │  │
│  │  │  │  │                                                 │ │   │   │  │
│  │  │  │  │ ## 5 Leadership Traps That Kill Innovation     │ │   │   │  │
│  │  │  │  │                                                 │ │   │   │  │
│  │  │  │  │ Slide 1: The question isn't "Are you           │ │   │   │  │
│  │  │  │  │ innovative?" It's "Are you blocking it?"       │ │   │   │  │
│  │  │  │  │                                                 │ │   │   │  │
│  │  │  │  │ Slide 2: Trap #1 — The Approval Bottleneck    │ │   │   │  │
│  │  │  │  │ When every decision needs 3 signatures...      │ │   │   │  │
│  │  │  │  │                                                 │ │   │   │  │
│  │  │  │  │ [...editable block content...]                  │ │   │   │  │
│  │  │  │  └─────────────────────────────────────────────────┘ │   │   │  │
│  │  │  │  [📝 Edit] [🔄 Regenerate] [✅ Approve] [📅 Schedule]│   │   │  │
│  │  │  └─────────────────────────────────────────────────────┘   │   │  │
│  │  └────────────────────────────────────────────────────────────┘   │  │
│  │                                                                    │  │
│  │  ── OR: LIST VIEW ───────────────────────────────────────────────  │  │
│  │  Status │ Source              │ Derivative      │ Owner   │ Due   │  │
│  │  ✅ Pub │ BRIDGE Webinar      │ Blog Article    │ Valentina│ Jul11│  │
│  │  ✅ Pub │ BRIDGE Webinar      │ LinkedIn Carousel│ Echo    │ Jul11│  │
│  │  📝 Edit│ BRIDGE Webinar      │ Newsletter Exc. │ Maria   │ Jul12│  │
│  │  🎧 Draft│ BRIDGE Webinar     │ Podcast Script  │ Xuemei  │ Jul13│  │
│  │  📅 Sched│ BRIDGE Webinar     │ Twitter Thread  │ Echo    │ Jul12│  │
│  │  ⏳ Pend │ BRIDGE Webinar     │ Exec Brief      │ NEXUS   │ Jul14│  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌── ROI PANEL (collapsible) ───────────────────────────────────────┐  │
│  │  This Map: 1 source → 6 derivatives                              │  │
│  │  Source reach: 340 │ Derivative reach: 2,100 │ Multiplier: 6.2x │  │
│  │  Avg time-to-publish: 18h │ Cost: $0.42/derivative (DeepSeek)   │  │
│  │                                                                    │  │
│  │  Best performer: LinkedIn Carousel (890 views, 34 engagements)   │  │
│  │  Worst performer: Exec Brief (internal only — no external reach) │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Interaction Patterns

| Pattern | Behavior | Standard |
|---------|----------|----------|
| Create map | Click source → "+ New Map" → tree appears → add derivatives inline | C7: No modal |
| Edit derivative | Click derivative → content expands inline → edit blocks | C1 + C9: Block editing |
| Regenerate | Click "🔄 Regenerate" → new AI draft, previous saved as version | Version control |
| Approve | Click "✅ Approve" → status changes → auto-schedule triggers | One-click action |
| Reassign | Drag derivative to different owner column | C8: Drag-and-drop |
| Reorder | Drag derivatives up/down to change priority order | C8: Drag-and-drop |
| Zoom | Scroll wheel on tree view → zoom in/out | Familiar pattern |
| Filter | Channel/status/owner filter bar above tree | Inline controls |
| Split view | Left: tree/list. Right: content preview/editor | INFRA-101 |
| Focus mode | Click map → everything else fades → just this map + its derivatives | INFRA-102 |

### 4.3 Empty States

| State | Message | Action |
|-------|---------|--------|
| No maps created | "No repurposing maps yet. Select a published content piece to create your first map." | "Browse Content" button |
| Map with no derivatives | "This map has no derivatives defined. Add your first derivative or let AI suggest a mix." | "+ Add Derivative" + "✨ AI Suggest" |
| All derivatives published | "✅ All 8 derivatives published. Total reach: 3,400 (10x source). Great multiplication." | "Create New Map" or "Archive" |
| Generation failed | "AI generation failed for [derivative]. Retry or edit manually." | "🔄 Retry" button |

---

## 5. Design Requirements

### 5.1 Component Specifications

**RepurposingTreeNode Component:**
```typescript
interface RepurposingTreeNode {
  id: string;
  derivative_type: DerivativeType;
  channel: DistributionChannel;
  owner: TeamMember;
  template_id: string;
  status: DerivativeStatus;
  content_preview: string;           // First 100 chars
  word_count_target: number;
  due_date_offset_days: number;
  actual_due_date?: Date;
  generated_at?: Date;
  approved_at?: Date;
  published_at?: Date;
  performance?: {
    views: number;
    engagements: number;
    conversions: number;
  };
  is_expanded: boolean;
  on_expand: () => void;
  on_approve: () => void;
  on_regenerate: () => void;
  on_edit: (content: string) => void;
  on_reassign: (new_owner: TeamMember) => void;
}

type DerivativeStatus = 'pending' | 'extracting' | 'generating' | 'draft' | 'review' | 'approved' | 'scheduled' | 'published' | 'failed';
type DerivativeType = 'blog_article' | 'linkedin_insight' | 'linkedin_story' | 'linkedin_carousel' | 'newsletter_excerpt' | 'podcast_script' | 'youtube_description' | 'twitter_thread' | 'social_caption' | 'quote_cards' | 'executive_brief' | 'email_sequence' | 'case_study' | 'infographic_text';
```

**RepurposingTreeView Component:**
```typescript
interface RepurposingTreeView {
  map_id: string;
  source_asset: ContentAsset;
  derivatives: RepurposingTreeNode[];
  view_mode: 'tree' | 'list';
  filter: {
    channel?: DistributionChannel;
    status?: DerivativeStatus;
    owner?: TeamMember;
  };
  on_add_derivative: (type: DerivativeType) => void;
  on_ai_suggest: () => void;
  on_generate_all: () => void;
  on_batch_approve: (ids: string[]) => void;
}
```

### 5.2 Status Color System

| Status | Color | Icon | Badge Style |
|--------|-------|------|-------------|
| Pending | Slate | ⏳ | `bg-slate-100 text-slate-700` |
| Extracting | Blue | 🔍 | `bg-blue-100 text-blue-700` (animated) |
| Generating | Ocean | ⚡ | `bg-ocean-100 text-ocean-700` (animated) |
| Draft | Amber | 📝 | `bg-amber-100 text-amber-700` |
| Review | Teal | 👁 | `bg-teal-100 text-teal-700` |
| Approved | Green | ✅ | `bg-green-100 text-green-700` |
| Scheduled | Indigo | 📅 | `bg-indigo-100 text-indigo-700` |
| Published | Fuchsia | 🟢 | `bg-fuchsia-100 text-fuchsia-700` |
| Failed | Red | ❌ | `bg-red-100 text-red-700` |

### 5.3 Animation Specifications

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| Tree branch expand | 200ms | ease-out | Click source → branches animate out |
| Derivative appear | 150ms | ease-in | New derivative fades + slides in |
| Status change | 300ms | ease-in-out | Badge color cross-fades |
| Generate pulse | 1.5s | loop | "Generating..." pulsing animation |
| ROI counter | 500ms | ease-out | Numbers count up on load |

---

## 6. Technical Backend Wiring

### 6.1 Supabase Schema

```sql
-- Repurposing Maps (1 source → N derivatives definition)
CREATE TABLE repurposing_maps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_asset_id UUID NOT NULL REFERENCES content_assets(id),
    name TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
    template_id UUID REFERENCES repurposing_templates(id),  -- NULL if custom
    created_by UUID NOT NULL REFERENCES auth.users(id),
    activated_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    canvas_state JSONB DEFAULT '{"zoom": 1, "pan": {"x": 0, "y": 0}}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Repurposing Derivatives (each output piece)
CREATE TABLE repurposing_derivatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    map_id UUID NOT NULL REFERENCES repurposing_maps(id) ON DELETE CASCADE,
    derivative_type TEXT NOT NULL,
    channel TEXT NOT NULL,
    template_id UUID REFERENCES templates(id),
    owner UUID NOT NULL REFERENCES auth.users(id),
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending', 'extracting', 'generating', 'draft', 'review',
        'approved', 'scheduled', 'published', 'failed'
    )),
    due_date_offset_days INT NOT NULL DEFAULT 1,
    actual_due_date TIMESTAMPTZ,
    content JSONB,                    -- Block-based content (Notion-style)
    word_count INT,
    generation_prompt TEXT,           -- For debugging/replay
    generation_tokens INT,
    version INT DEFAULT 1,
    parent_version_id UUID REFERENCES repurposing_derivatives(id),
    content_extraction_id UUID REFERENCES content_extractions(id),
    scheduled_asset_id UUID REFERENCES content_assets(id),
    published_url TEXT,
    published_at TIMESTAMPTZ,
    performance JSONB DEFAULT '{"views": 0, "engagements": 0, "conversions": 0}',
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Extractions (AI-extracted key content from source)
CREATE TABLE content_extractions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_asset_id UUID NOT NULL REFERENCES content_assets(id),
    extraction_type TEXT DEFAULT 'full' CHECK (extraction_type IN ('full', 'quotes', 'stats', 'themes', 'action_items', 'questions')),
    key_quotes JSONB,                 -- Array of notable quotes
    key_statistics JSONB,             -- Array of data points
    key_themes JSONB,                 -- Array of themes/topics
    action_items JSONB,               -- Array of action items
    audience_questions JSONB,         -- Array of questions from audience
    summary TEXT,                     -- AI-generated summary
    tokens_used INT,
    model TEXT DEFAULT 'deepseek-flash',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Repurposing Templates (pre-built maps)
CREATE TABLE repurposing_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,               -- "Webinar → 12 pieces"
    source_type TEXT NOT NULL,         -- webinar, podcast, case_study, etc.
    description TEXT,
    derivative_definitions JSONB NOT NULL,  -- Array of {type, channel, template_id, offset_days, word_count_target}
    expected_derivative_count INT,
    is_active BOOLEAN DEFAULT true,
    usage_count INT DEFAULT 0,
    success_score DECIMAL(3,2),        -- 0.00-1.00 based on historical performance
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Derivative Generation Logs (audit trail)
CREATE TABLE derivative_generation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    derivative_id UUID NOT NULL REFERENCES repurposing_derivatives(id),
    action TEXT NOT NULL CHECK (action IN ('generate', 'regenerate', 'approve', 'reject', 'edit', 'schedule', 'publish')),
    prompt_used TEXT,
    model TEXT,
    tokens_used INT,
    duration_ms INT,
    result TEXT,                      -- 'success' or error message
    performed_by UUID REFERENCES auth.users(id),  -- NULL if automated
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Derivative Performance (updated from analytics)
CREATE TABLE derivative_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    derivative_id UUID NOT NULL REFERENCES repurposing_derivatives(id),
    channel TEXT NOT NULL,
    metric_date DATE NOT NULL,
    views INT DEFAULT 0,
    engagements INT DEFAULT 0,
    clicks INT DEFAULT 0,
    conversions INT DEFAULT 0,
    reach INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(derivative_id, metric_date)
);

-- Indexes
CREATE INDEX idx_repurposing_maps_source ON repurposing_maps(source_asset_id);
CREATE INDEX idx_repurposing_maps_status ON repurposing_maps(status);
CREATE INDEX idx_repurposing_derivatives_map ON repurposing_derivatives(map_id);
CREATE INDEX idx_repurposing_derivatives_owner ON repurposing_derivatives(owner);
CREATE INDEX idx_repurposing_derivatives_status ON repurposing_derivatives(status);
CREATE INDEX idx_content_extractions_source ON content_extractions(source_asset_id);
CREATE INDEX idx_derivative_performance_derivative ON derivative_performance(derivative_id);
CREATE INDEX idx_derivative_performance_date ON derivative_performance(metric_date);

-- RLS
ALTER TABLE repurposing_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE repurposing_derivatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_extractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE repurposing_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE derivative_generation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE derivative_performance ENABLE ROW LEVEL SECURITY;

-- Policies (same pattern as other tables)
CREATE POLICY "Team members can view maps" ON repurposing_maps FOR SELECT TO authenticated USING (true);
CREATE POLICY "Team members can create maps" ON repurposing_maps FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Team members can update maps" ON repurposing_maps FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Team members can view derivatives" ON repurposing_derivatives FOR SELECT TO authenticated USING (true);
CREATE POLICY "Team members can update derivatives" ON repurposing_derivatives FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Owners can update their derivatives" ON repurposing_derivatives FOR UPDATE TO authenticated USING (auth.uid() = owner);

CREATE POLICY "Team members can view extractions" ON content_extractions FOR SELECT TO authenticated USING (true);
CREATE POLICY "System can create extractions" ON content_extractions FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Team members can view templates" ON repurposing_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage templates" ON repurposing_templates FOR ALL TO authenticated USING (true);

CREATE POLICY "Team members can view logs" ON derivative_generation_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "System can create logs" ON derivative_generation_logs FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Team members can view performance" ON derivative_performance FOR SELECT TO authenticated USING (true);
CREATE POLICY "System can upsert performance" ON derivative_performance FOR ALL TO authenticated USING (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE repurposing_derivatives;
ALTER PUBLICATION supabase_realtime ADD TABLE repurposing_maps;
```

### 6.2 API Routes

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/repurposing/maps` | List all maps with filters |
| POST | `/api/repurposing/maps` | Create new repurposing map |
| GET | `/api/repurposing/maps/:id` | Get map with all derivatives |
| PATCH | `/api/repurposing/maps/:id` | Update map (activate, archive, canvas state) |
| DELETE | `/api/repurposing/maps/:id` | Soft delete map |
| POST | `/api/repurposing/maps/:id/generate-all` | Trigger generation for all pending derivatives |
| POST | `/api/repurposing/maps/:id/ai-suggest` | AI suggests optimal derivative mix |
| GET | `/api/repurposing/derivatives/:id` | Get derivative with content |
| PATCH | `/api/repurposing/derivatives/:id` | Update derivative (content, status, owner) |
| POST | `/api/repurposing/derivatives/:id/generate` | Generate/regenerate single derivative |
| POST | `/api/repurposing/derivatives/:id/approve` | Approve derivative → trigger scheduling |
| POST | `/api/repurposing/derivatives/:id/regenerate` | Regenerate with AI |
| GET | `/api/repurposing/extractions/:source_id` | Get or trigger content extraction |
| GET | `/api/repurposing/templates` | List repurposing templates |
| POST | `/api/repurposing/templates` | Create custom template from existing map |
| GET | `/api/repurposing/performance/:map_id` | Get performance metrics for a map |
| GET | `/api/repurposing/roi` | Aggregate ROI metrics across all maps |
| POST | `/api/repurposing/batch` | Batch create maps for multiple sources |

### 6.3 AI Prompt Templates

**Content Extraction Prompt:**
```
SYSTEM: You are a content analyst. Extract key elements from the following content for repurposing.

USER: Extract from this {source_type}:
1. KEY_QUOTES (3-5): Notable statements worth quoting directly
2. KEY_STATISTICS (2-5): Data points, numbers, percentages mentioned
3. KEY_THEMES (3-5): Main topics/themes discussed
4. ACTION_ITEMS (2-4): Practical advice or recommendations given
5. AUDIENCE_QUESTIONS (0-5): Questions from audience if applicable

Format as JSON:
{
  "key_quotes": [{"text": "...", "context": "...", "speaker": "..."}],
  "key_statistics": [{"value": "...", "context": "..."}],
  "key_themes": [{"theme": "...", "description": "..."}],
  "action_items": [{"item": "...", "priority": "high|medium|low"}],
  "audience_questions": [{"question": "...", "answer_summary": "..."}],
  "summary": "2-3 sentence summary of the entire content"
}

SOURCE CONTENT:
{source_content}
```

**Derivative Generation Prompt (LinkedIn Carousel example):**
```
SYSTEM: You are LYC Partners' content strategist. Create a LinkedIn carousel from the extracted content.

BRAND VOICE: Expert but not lecturing. Direct but not cold. Confident. Human.
FORMAT: 8-12 slides, one idea per slide, hook on slide 1, CTA on last slide.
CONSTRAINTS:
- Each slide: max 30 words
- Use short sentences. Line breaks between ideas.
- Include 1-2 relevant emojis max (not per slide, total)
- End with a question or call to action
- Add 3-5 hashtags at the very end (not in carousel)

CONTENT EXTRACTION:
{extraction_json}

TARGET: LinkedIn Carousel about "{topic}" for {cluster} audience.

Generate the carousel as JSON:
{
  "slides": [{"number": 1, "text": "..."}],
  "caption": "Post caption (150-200 words)",
  "hashtags": ["#", "#", "#"]
}
```

### 6.4 Background Jobs

| Job | Schedule | Purpose |
|-----|----------|---------|
| `repurposing-trigger-on-publish` | Event trigger (content_assets.status = 'published') | Auto-start generation for active maps |
| `repurposing-generation-worker` | Every 1 min | Process queued derivative generations |
| `repurposing-performance-sync` | Every 6 hours | Pull performance data from channel APIs |
| `repurposing-deduplication-check` | Every 1 hour | Flag potential content overlap |
| `repurposing-overdue-alert` | Every 2 hours | Alert on overdue derivatives |

### 6.5 Realtime Subscriptions

```typescript
// Monitor derivative status changes in real-time
supabase.channel('repurposing-status')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'repurposing_derivatives',
    filter: `map_id=eq.${mapId}`
  }, (payload) => {
    updateTreeStatus(payload.new.id, payload.new.status);
  })
  .subscribe();

// Monitor new extractions completing
supabase.channel('repurposing-extraction')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'content_extractions',
    filter: `source_asset_id=eq.${sourceId}`
  }, (payload) => {
    setExtractionReady(payload.new);
  })
  .subscribe();
```

---

## 7. AI Layer Specification

### 7.1 AI Personas

**Content Extraction Analyst**
```yaml
name: "Extraction Analyst"
role: "Analyze source content and extract repurposable elements"
model: deepseek-flash  # Speed matters for extraction
temperature: 0.3       # Precise extraction, low creativity
max_tokens: 2000
system_prompt: |
  You analyze content for repurposing. Extract: key quotes, statistics,
  themes, action items, and audience questions. Be precise — extract what
  was actually said, don't embellish. Attribute quotes to speakers when
  identifiable. Flag data points with context.
```

**Derivative Generator**
```yaml
name: "Content Transformer"
role: "Transform extracted content into channel-specific derivatives"
model: deepseek-flash  # Speed for multiple derivatives
temperature: 0.6       # Creative enough for engaging content, but on-brand
max_tokens: 4000
system_prompt: |
  You create content derivatives for LYC Partners. Brand voice: expert but
  not lecturing, direct but not cold, confident, human. Every piece must
  enforce the brand guidelines. Adapt length, format, and tone to the
  specific channel while maintaining the core message from the source.
  Never invent data or statistics — only use what was extracted.
```

**Repurposing Strategist**
```yaml
name: "Repurposing Strategist"
role: "Recommend optimal derivative mix based on source type and goals"
model: deepseek-pro    # Reasoning for strategy
temperature: 0.4       # Analytical but with strategic creativity
max_tokens: 1500
system_prompt: |
  You recommend content repurposing strategies. Given a source asset type,
  target audience, and campaign goals, suggest the optimal mix of
  derivatives. Consider: which channels drive most engagement for this
  cluster, what formats work best for this content type, what's the
  team's capacity this week, and what performed well historically.
  Always prioritize high-ROI derivatives (LinkedIn, newsletter) over
  low-ROI ones (executive brief for external campaigns).
```

### 7.2 Prompt Chaining

```
Source Content
    │
    ▼
[Extraction Analyst] → key_quotes, stats, themes, actions, questions
    │
    ├──→ [Repurposing Strategist] → optimal derivative mix (if no map defined)
    │
    ▼
For each derivative in map:
    ├──→ [Content Transformer + LinkedIn Carousel template] → Carousel JSON
    ├──→ [Content Transformer + Blog template] → Article markdown
    ├──→ [Content Transformer + Newsletter template] → Email HTML
    ├──→ [Content Transformer + Podcast template] → Script markdown
    └──→ [Content Transformer + ...] → ... per derivative
    │
    ▼
Each derivative saved as draft → Owner notified → Review → Approve → Schedule
```

---

## 8. Tickets

### 8.1 Complete Ticket List

| Ticket | Title | Priority | Effort | Dependencies | INFRA | Audit |
|--------|-------|----------|--------|--------------|-------|-------|
| **Phase: Data Layer (P0)** | | | **30h** | | | |
| REP-001 | `repurposing_maps` table + RLS + indexes | P0 | 2h | INFRA-100 | INFRA | C6 |
| REP-002 | `repurposing_derivatives` table + RLS + indexes | P0 | 2h | REP-001 | INFRA | C6 |
| REP-003 | `content_extractions` table + RLS | P0 | 2h | REP-001 | INFRA | C6 |
| REP-004 | `repurposing_templates` table + seed 8 templates | P0 | 3h | REP-001 | INFRA | C6 |
| REP-005 | `derivative_generation_logs` table | P0 | 1h | REP-002 | INFRA | C6 |
| REP-006 | `derivative_performance` table + RLS | P0 | 2h | REP-002 | INFRA | C6 |
| REP-007 | Realtime subscriptions for derivatives + maps | P0 | 2h | REP-001, REP-002 | INFRA | C6, C11 |
| REP-008 | Supabase Edge Function: trigger on source publish | P0 | 3h | REP-001 | INFRA | C6 |
| REP-009 | Seed data: 8 repurposing templates | P0 | 2h | REP-004 | INFRA | C5 |
| REP-010 | Storage bucket: derivative attachments | P0 | 1h | — | INFRA | C6 |
| REP-011 | API: CRUD for repurposing_maps | P0 | 3h | REP-001 | INFRA | C1 |
| REP-012 | API: CRUD for repurposing_derivatives | P0 | 3h | REP-002 | INFRA | C1 |
| REP-013 | API: content extraction trigger + retrieve | P0 | 3h | REP-003 | INFRA | C6 |
| REP-014 | API: repurposing templates list + create from map | P1 | 2h | REP-004 | INFRA | C1 |
| **Phase: Map Builder UI (P0)** | | | **38h** | | | |
| REP-015 | Repurposing page: empty state + overview bar | P0 | 2h | REP-011 | INFRA-104 | C3, C4 |
| REP-016 | Map list view: sortable, filterable table | P0 | 3h | REP-011 | INFRA-104 | C1, C3 |
| REP-017 | Create map: select source → empty tree appears | P0 | 3h | REP-012 | INFRA-102 | C1, C7 |
| REP-018 | Tree view: source node center, add derivative branches | P0 | 5h | REP-017 | INFRA-101 | C2, C8 |
| REP-019 | Add derivative: inline form (type, channel, template, owner, offset) | P0 | 4h | REP-018 | — | C1, C7 |
| REP-020 | AI suggest button: call Repurposing Strategist | P0 | 4h | REP-019 | — | C1 |
| REP-021 | Derivative node: status badge + owner avatar + preview | P0 | 3h | REP-018 | INFRA-106 | C3, C4 |
| REP-022 | Expand derivative: inline content preview | P0 | 3h | REP-021 | INFRA-101 | C7 |
| REP-023 | Inline content editing (block editor within tree) | P0 | 5h | REP-022 | — | C1, C7, C9 |
| REP-024 | Drag-to-reassign owner (drag node to different owner column) | P1 | 3h | REP-021 | INFRA-107 | C8 |
| REP-025 | Tree zoom + pan + minimap | P1 | 4h | REP-018 | — | C2 |
| REP-026 | Tree/list view toggle | P0 | 2h | REP-016, REP-018 | — | C2 |
| REP-027 | Filter bar: channel, status, owner, date range | P0 | 3h | REP-016 | INFRA-104 | C3 |
| REP-028 | Map status management: draft → active → completed → archived | P0 | 2h | REP-015 | — | C1 |
| **Phase: AI Generation Pipeline (P0)** | | | **40h** | | | |
| REP-029 | Content Extraction Analyst: prompt + DeepSeek call | P0 | 4h | REP-003 | — | C6 |
| REP-030 | Extraction UI: show extracted quotes/stats/themes | P0 | 3h | REP-029 | INFRA-101 | C4 |
| REP-031 | Content Transformer: LinkedIn carousel prompt + generation | P0 | 3h | REP-029 | — | C1 |
| REP-032 | Content Transformer: blog article prompt + generation | P0 | 3h | REP-029 | — | C1 |
| REP-033 | Content Transformer: newsletter excerpt prompt + generation | P0 | 2h | REP-029 | — | C1 |
| REP-034 | Content Transformer: podcast script prompt + generation | P0 | 3h | REP-029 | — | C1 |
| REP-035 | Content Transformer: Twitter thread prompt + generation | P0 | 2h | REP-029 | — | C1 |
| REP-036 | Content Transformer: YouTube description prompt + generation | P0 | 2h | REP-029 | — | C1 |
| REP-037 | Content Transformer: executive brief prompt + generation | P0 | 2h | REP-029 | — | C1 |
| REP-038 | Channel constraint engine: word count, format, hashtags | P0 | 4h | REP-031-037 | — | C1 |
| REP-039 | Generate all: queue all pending derivatives for generation | P0 | 3h | REP-031-038 | — | C5 |
| REP-040 | Generation progress: per-derivative status animation | P0 | 3h | REP-039 | INFRA-106 | C4 |
| REP-041 | Generation error handling: retry + manual fallback | P0 | 2h | REP-039 | — | C5 |
| REP-042 | Regenerate single derivative (with version tracking) | P1 | 3h | REP-031-038 | — | C1 |
| REP-043 | Version history: view previous generations | P1 | 2h | REP-042 | — | C1 |
| REP-044 | Generation logs: audit trail for all AI actions | P1 | 2h | REP-005 | — | C6 |
| **Phase: Review & Publish Workflow (P0)** | | | **32h** | | | |
| REP-045 | Review UI: inline edit with approve/regenerate buttons | P0 | 4h | REP-023 | INFRA-106 | C1, C3 |
| REP-046 | Approve → auto-create content_asset + schedule in Distribution | P0 | 4h | REP-045 | — | C6 |
| REP-047 | "My Assignments" view: all derivatives assigned to me | P0 | 3h | REP-027 | INFRA-103 | C3 |
| REP-048 | Owner notification: Feishu alert on draft ready | P0 | 2h | REP-045 | — | C11 |
| REP-049 | Batch approve: select multiple → approve all | P1 | 2h | REP-045 | — | C8 |
| REP-050 | Brand voice validation: AI check before approve | P1 | 3h | REP-045 | — | C1 |
| REP-051 | Deduplication check: flag >80% overlap with existing content | P1 | 3h | REP-012 | — | C1 |
| REP-052 | Schedule picker: choose publish date/time per derivative | P1 | 3h | REP-046 | INFRA-101 | C1 |
| REP-053 | Published state: link to published URL + performance | P0 | 2h | REP-046 | — | C6 |
| REP-054 | Calendar integration: derivatives appear in Content Calendar | P1 | 3h | REP-046 | — | C6 |
| REP-055 | Auto-publish trigger: source published → derivatives auto-queue | P0 | 3h | REP-008 | — | C6 |
| REP-056 | Workflow status pipeline visualization | P1 | 2h | REP-045 | INFRA-103 | C4, C5 |
| **Phase: ROI & Analytics (P1)** | | | **30h** | | | |
| REP-057 | ROI panel: source reach → derivative reach → multiplier | P1 | 4h | REP-006 | INFRA-101 | C4 |
| REP-058 | Per-derivative performance: views, engagements, conversions | P1 | 3h | REP-006 | — | C6 |
| REP-059 | Time-to-publish metric: source published → derivative published | P1 | 2h | REP-053 | — | C4 |
| REP-060 | Cost per derivative: DeepSeek token cost tracking | P1 | 2h | REP-005 | — | C4 |
| REP-061 | Best/worst performer identification | P1 | 3h | REP-058 | INFRA-108 | C3 |
| REP-062 | Aggregate ROI dashboard (all maps) | P1 | 4h | REP-057-061 | INFRA-103 | C4 |
| REP-063 | Channel performance comparison | P1 | 3h | REP-058 | — | C4 |
| REP-064 | Derivative type performance ranking | P1 | 3h | REP-058 | — | C3 |
| REP-065 | Historical trend: multiplication rate over time | P2 | 3h | REP-062 | — | C4 |
| REP-066 | Performance sync job: pull from channel APIs | P1 | 3h | REP-006 | — | C6 |
| **Phase: Templates & Batch (P1)** | | | **20h** | | | |
| REP-067 | Template gallery: browse 8 pre-built repurposing templates | P1 | 3h | REP-004 | INFRA-105 | C5 |
| REP-068 | Use template: apply to new source → auto-populate tree | P1 | 3h | REP-067 | — | C5 |
| REP-069 | Save as template: create template from successful map | P2 | 2h | REP-004 | — | C8 |
| REP-070 | Batch mode: select multiple sources → create maps | P2 | 4h | REP-017 | — | C8 |
| REP-071 | Batch progress dashboard | P2 | 3h | REP-070 | INFRA-106 | C4 |
| REP-072 | Map cloning: duplicate for new source | P2 | 2h | REP-017 | — | C8 |
| REP-073 | Template performance: which templates produce best ROI | P2 | 3h | REP-062 | — | C3 |
| **Phase: Polish & Integration (P1-P2)** | | | **20h** | | | |
| REP-074 | Focus mode: click map → everything else fades | P1 | 2h | REP-018 | INFRA-102 | C4 |
| REP-075 | Workspace memory: save tree position, filters, expanded nodes | P1 | 2h | REP-018 | INFRA-104 | C12 |
| REP-076 | Keyboard shortcuts: navigate tree, approve, expand | P2 | 2h | REP-018 | — | C7 |
| REP-077 | Cross-page drag: derivative → Distribution schedules it | P2 | 3h | REP-046 | INFRA-107 | C8 |
| REP-078 | Milestone integration: "Publish 5 derivatives this week" | P2 | 3h | REP-045 | INFRA-103 | C5 |
| | | | **210h** | | | |

### 8.2 Delivery Phases

| Phase | Tickets | Effort | Timeline | Focus |
|-------|---------|--------|----------|-------|
| **P0: Core** | REP-001 to REP-056 | 140h | 5 weeks | Data layer → Map builder → AI generation → Review workflow |
| **P1: Intelligence** | REP-057 to REP-076 | 52h | 2.5 weeks | ROI analytics → Templates → Polish |
| **P2: Scale** | REP-070 to REP-078 | 18h | 1 week | Batch mode → Cross-page drag → Milestones |

---

## 9. Acceptance Criteria

### 9.1 Phase 0 (P0) — Must Have

- [ ] Can create a repurposing map from any published content asset
- [ ] Tree visualization shows source → derivative branches with status
- [ ] Can add derivatives inline: type, channel, template, owner, offset — no modals
- [ ] AI "Suggest" button generates optimal derivative mix for source type
- [ ] Content extraction works: quotes, stats, themes, actions extracted from source
- [ ] AI generates at least 7 derivative types (blog, LinkedIn carousel, newsletter, podcast, Twitter, YouTube, exec brief)
- [ ] Channel constraints enforced (word count, format, hashtags)
- [ ] Generation progress visible per derivative (status animation)
- [ ] Owner can review AI draft inline (block editor, no modal)
- [ ] Approve → auto-creates content_asset + schedules in Distribution Engine
- [ ] Feishu notification sent to owner when derivative is ready for review
- [ ] "My Assignments" view shows all derivatives assigned to current user
- [ ] Real-time status updates via Supabase Realtime
- [ ] Published derivatives link to actual published URL
- [ ] Source publish auto-triggers generation for active maps

### 9.2 Phase 1 (P1) — Should Have

- [ ] ROI panel: source reach → derivative reach → multiplier ratio
- [ ] Per-derivative performance tracking (views, engagements, conversions)
- [ ] Time-to-publish metric per derivative
- [ ] Cost per derivative (DeepSeek token tracking)
- [ ] Best/worst performer identification
- [ ] Aggregate ROI dashboard across all maps
- [ ] 8 pre-built repurposing templates in gallery
- [ ] Can use template → auto-populate tree for new source
- [ ] Focus mode on individual map
- [ ] Workspace memory: tree position, filters, expanded nodes persisted
- [ ] Brand voice validation before approve
- [ ] Deduplication check (>80% overlap warning)

### 9.3 Phase 2 (P2) — Nice to Have

- [ ] Batch mode: select multiple sources → create all maps
- [ ] Map cloning for new source
- [ ] Cross-page drag: derivative → Distribution schedules it
- [ ] Milestone integration on repurposing page
- [ ] Historical trend: multiplication rate over time
- [ ] Save successful map as new template

---

## 10. Component Architecture

```
RepurposingEnginePage
├── OverviewBar
│   ├── MapCount
│   ├── DerivativeCount
│   ├── PublishedCount
│   ├── InProgressCount
│   └── OverdueAlert
├── ViewToggle (tree / list)
├── FilterBar
│   ├── ChannelFilter
│   ├── StatusFilter
│   ├── OwnerFilter
│   └── DateRangeFilter
├── RepurposingMapList (list view)
│   └── MapRow → click → MapDetail
├── RepurposingTreeView (tree view)
│   ├── SourceNode
│   │   └── SourceMetadata
│   ├── DerivativeBranch[] (tree branches)
│   │   ├── DerivativeNode
│   │   │   ├── StatusBadge
│   │   │   ├── OwnerAvatar
│   │   │   ├── ContentPreview
│   │   │   └── ActionButtons [Edit|Regenerate|Approve|Schedule]
│   │   └── ExpandedContent (block editor)
│   │       ├── BlockEditor
│   │       ├── ChannelConstraints
│   │       └── VersionHistory
│   ├── AddDerivativeButton
│   ├── AISuggestButton
│   └── GenerateAllButton
├── ROIPanel (collapsible)
│   ├── MultiplicationMetrics
│   ├── BestPerformer
│   └── CostPerDerivative
├── MyAssignmentsPanel
│   └── AssignmentCard[]
└── TemplateGallery (modal/sheet)
    ├── TemplateCard[]
    └── UseTemplateButton
```

---

## Appendix: Gap from v1.0

| Original Ticket | New Tickets | What Changed |
|----------------|-------------|-------------|
| TICKET-055 (Map Builder — Create) | REP-017 to REP-028 | Expanded from simple form to visual tree builder with inline editing, drag-drop, zoom/pan |
| TICKET-056 (Map Builder — AI) | REP-020, REP-029, REP-030 | Expanded from single "Generate" button to 3 AI personas, extraction pipeline, strategizing |
| TICKET-057 (Automated Generation) | REP-029 to REP-044, REP-055 | Expanded from single trigger to 14 derivative types, channel constraints, version tracking, error handling |
| TICKET-058 (Status Tracking) | REP-015 to REP-027, REP-045 to REP-056 | Expanded from basic table to visual tree, list/tree toggle, "My Assignments", workflow pipeline |
| TICKET-059 (ROI Metrics) | REP-057 to REP-066 | Expanded from 3 metrics to full ROI dashboard: multiplier, reach, cost, best/worst, channel comparison, historical trends |
| TICKET-060 (Edit Derivative) | REP-023, REP-045, REP-050 | Expanded from basic editor to inline block editor with brand voice validation, version history, regeneration |
| TICKET-061 (Delete Map) | REP-028 | Expanded from delete to full lifecycle: draft → active → completed → archived |

**New capabilities not in v1.0:**
- Content extraction pipeline (quotes, stats, themes)
- 8 pre-built repurposing templates
- Batch repurposing mode
- Deduplication checking
- Channel constraint engine
- "My Assignments" view
- Feishu owner notifications
- Cross-page drag (derivative → Distribution)
- Milestone integration
- Workspace memory for tree state

---

**Updated Grand Total (Pages 1-6 + Infrastructure):**

| Component | Tickets | Effort |
|-----------|---------|--------|
| P1 Dashboard | 36 | 126h |
| P2 Content Calendar | 42 | 175h |
| P3 Template Library | 66 | 190h |
| P4 Distribution Engine | 66 | 218h |
| P5 B2C Journey Engine | 92 | 242h |
| P6 Content Repurposing | 78 | 210h |
| Infrastructure | 13 | 80h |
| **TOTAL** | **393** | **1,241h** |

