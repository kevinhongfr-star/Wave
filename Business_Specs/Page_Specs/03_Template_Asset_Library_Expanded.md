# WAVE Business Spec — Page 3: Template & Asset Library (EXPANDED)

**Version:** 2.1 | **Date:** 2026-07-11 | **Status:** Draft for Kevin Review
**Supersedes:** TICKET-021 through TICKET-030 (existing v1.0 — 10 tickets, ~24h)
**Builds on:** Module 1 Content Calendar (Page 2), DeepSeek API infrastructure
**Gap tickets:** TPL-001 through TPL-040 (expanded from 10 to 40)
**Total effort:** 190h (up from ~24h)

---

## 1. Purpose

The Template & Asset Library is the content creation engine of WAVE. It answers:
1. **"What content do I need?"** → AI recommends templates based on campaign, product, cluster, and channel
2. **"How do I create it fast?"** → Rich editor + AI generation from template + variables
3. **"Where's the brand asset?"** → Centralized media library with folders, tags, and preview
4. **"Is this on-brand?"** → AI brand consistency scoring before publishing
5. **"What worked before?"** → Template usage analytics and performance correlation

It must feel like **Notion's template gallery + Figma's asset library + Canva's brand kit** — not a file system dump.

**Current state (what exists today):**
- Static table with 5 hardcoded rows
- No Supabase connection
- No AI generation
- No rich editor (just text display)
- No asset management (no images, no files)
- No brand guidelines enforcement
- No template categories or organization
- No drag-to-calendar from template
- No template analytics

**Expansion scope (what this spec adds):**

| Area | Current | Expanded |
|------|---------|----------|
| Template list | Static table, 5 hardcoded rows | Supabase-backed grid/list/board with filters, search, sort, virtual scrolling |
| Editor | None | Block-based rich editor (Notion-style) with slash commands |
| AI generation | None | Template → variables → DeepSeek → 3 variants → select & edit |
| Brand scoring | None | AI-powered brand consistency check (0-100) with suggestions |
| Asset library | None | Full media library: images, docs, videos with folders/tags/preview |
| Template organization | Flat list | Categories, sub-categories, tags, favorites, recently used |
| Drag-to-calendar | None | Drag template/asset directly onto Content Calendar |
| Version control | Basic version table | Full diff view, branching, restore, auto-save |
| Template sharing | None | Team sharing, read-only locks, approval workflow |
| Template analytics | None | Usage count, conversion correlation, performance by template type |
| Bulk operations | None | Bulk create assets from template, bulk tag, bulk export |
| Keyboard shortcuts | None | Full keyboard navigation + slash commands in editor |
| Import/Export | .md only | .md, .json, .docx, .html import/export + Canva/Figma link support |
| Content scoring | None | AI quality scoring: clarity, engagement, SEO, brand fit |
| Responsive | Desktop only | Mobile browse + create, tablet full editing |
| Accessibility | None | ARIA, keyboard nav, screen reader |

---

## 2. Business Requirements

### 2.1 Template Library (expanded)

**Template types (12 types):**

| Type | Icon | Description | Default Variables |
|------|------|-------------|-------------------|
| Newsletter | 📧 | Email newsletter editions | `{{issue_number}}`, `{{headline}}`, `{{sections}}` |
| Webinar Promo | 🎥 | Webinar invitation + reminder sequence | `{{webinar_title}}`, `{{date}}`, `{{speaker}}`, `{{registration_link}}` |
| LinkedIn Post | 💼 | Thought leadership, case study, insight | `{{topic}}`, `{{hook}}`, `{{cta}}`, `{{hashtags}}` |
| Email Sequence | 📨 | Multi-email drip sequences | `{{sequence_name}}`, `{{trigger}}`, `{{emails[]}}` |
| Exec Brief | 📊 | Executive briefing document | `{{period}}`, `{{metrics}}`, `{{insights}}`, `{{recommendations}}` |
| Podcast Notes | 🎙️ | Show notes + transcript template | `{{episode}}`, `{{guest}}`, `{{topics}}`, `{{links}}` |
| YouTube Description | ▶️ | Video description + timestamps | `{{video_title}}`, `{{chapters}}`, `{{links}}` |
| Landing Page | 🌐 | Registration/sales page | `{{headline}}`, `{{value_prop}}`, `{{social_proof}}`, `{{cta}}` |
| Case Study | 📋 | Client success story | `{{client}}`, `{{challenge}}`, `{{solution}}`, `{{results}}` |
| Social Carousel | 🖼️ | Multi-slide visual content | `{{title_slide}}`, `{{slides[]}}`, `{{cta_slide}}` |
| Registration Form | 📝 | Event registration form | `{{event_name}}`, `{{fields[]}}`, `{{pricing}}` |
| Report/Whitepaper | 📄 | Long-form content | `{{title}}`, `{{executive_summary}}`, `{{chapters[]}}`, `{{appendix}}` |

**Template metadata per template:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | auto | Primary key |
| `name` | TEXT | yes | Template display name |
| `type` | ENUM | yes | One of 12 types above |
| `category` | TEXT | no | Organization category (e.g., "Lead Nurturing", "Thought Leadership") |
| `description` | TEXT | no | Short description for card view |
| `content` | JSONB | yes | Block-based content (Notion-like blocks) |
| `variables` | JSONB | yes | Variable definitions: `[{name, type, required, default, options}]` |
| `brand_guidelines` | JSONB | no | Brand rules for this template type (tone, length, structure) |
| `thumbnail_url` | TEXT | no | Preview thumbnail (auto-generated or uploaded) |
| `is_system` | BOOLEAN | no | System templates can't be deleted (only archived) |
| `is_locked` | BOOLEAN | no | Locked = read-only, must copy to edit |
| `locked_by` | UUID | no | User who locked this template |
| `usage_count` | INTEGER | auto | How many times this template was used |
| `avg_content_score` | FLOAT | auto | Average AI content score of assets created from this template |
| `created_by` | UUID | auto | Creator |
| `updated_by` | UUID | auto | Last editor |
| `created_at` | TIMESTAMPTZ | auto | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | auto | Last update timestamp |
| `version` | INTEGER | auto | Version number (auto-incremented on save) |
| `parent_version` | UUID | no | Previous version ID (for version history) |
| `status` | ENUM | yes | `draft`, `active`, `archived` |
| `tags` | TEXT[] | no | Array of tags for filtering |
| `channel` | TEXT | no | Primary channel this template targets |
| `estimated_time` | INTEGER | no | Estimated time to fill this template (minutes) |
| `ai_prompt_template` | TEXT | no | Custom AI prompt override for this template |

**Template views:**

| View | Layout | Description |
|------|--------|-------------|
| Grid | Card grid (3-4 columns) | Thumbnail + name + type badge + usage count |
| List | Table | All metadata columns, sortable |
| Board | Kanban by type | Columns = template types, cards = templates |
| Favorites | Card grid | Starred/favorited templates only |
| Recent | Card grid | Last 20 used templates |
| My Templates | Card grid | Templates created by current user |
| System | Card grid | System-provided templates (read-only) |

**Search & filter:**
- Full-text search across name, description, content body, tags
- Filter by: type, category, status, channel, tags, created_by, is_system, is_locked
- Sort by: name, usage_count (most popular), avg_content_score (highest quality), updated_at (recently edited), created_at (newest)
- Combined filters persist in URL query params (shareable filtered views)

### 2.2 Block-Based Rich Editor

**Editor architecture (Notion-style):**

Content is stored as an array of blocks, not a single HTML string. Each block has a type and content.

**Block types:**

| Block Type | Description | Toolbar Actions |
|-----------|-------------|-----------------|
| `paragraph` | Standard text paragraph | Bold, italic, underline, strikethrough, link, code |
| `heading_1` | H1 heading | — |
| `heading_2` | H2 heading | — |
| `heading_3` | H3 heading | — |
| `bullet_list` | Unordered list | Indent, outdent, checkbox conversion |
| `numbered_list` | Ordered list | Indent, outdent |
| `todo_list` | Checkbox list | Check/uncheck |
| `quote` | Block quote | — |
| `code` | Code block (syntax highlighted) | Language selector |
| `callout` | Highlighted callout box | Icon + color picker |
| `divider` | Horizontal rule | — |
| `image` | Image block | Upload, URL, alt text, caption, alignment |
| `variable` | Template variable `{{name}}` | Click to fill, highlight color |
| `ai_block` | AI-generated content placeholder | Generate, regenerate, accept, reject |
| `embed` | Embedded content (video, form, etc.) | URL + preview |
| `table` | Simple table | Add/remove rows & columns |
| `toggle` | Collapsible section | Title + nested content |

**Slash commands:**
Type `/` in the editor to open a command palette with:
- Block type insertion (e.g., `/heading`, `/bullet`, `/image`)
- Template variable insertion (e.g., `/product_name`, `/date`)
- AI commands (e.g., `/ai-write`, `/ai-expand`, `/ai-shorten`, `/ai-rewrite`)
- Template insertion (e.g., `/cta-block`, `/header-block`)

**Keyboard shortcuts:**

| Shortcut | Action |
|----------|--------|
| `/` | Open slash command palette |
| `Cmd+B` | Bold |
| `Cmd+I` | Italic |
| `Cmd+U` | Underline |
| `Cmd+K` | Insert link |
| `Cmd+Shift+H` | Heading 1 (cycle H1→H2→H3→paragraph) |
| `Cmd+Shift+8` | Bullet list |
| `Cmd+Shift+7` | Numbered list |
| `Cmd+Shift+1` | Todo list |
| `Cmd+Z` | Undo |
| `Cmd+Shift+Z` | Redo |
| `Cmd+Enter` | Save template |
| `Escape` | Close command palette / deselect block |
| `↑/↓` | Navigate between blocks |
| `Tab` | Indent list item |
| `Shift+Tab` | Outdent list item |
| `Cmd+/` | Toggle variable highlight visibility |

**Inline variable editing:**
- Variables appear as highlighted pills: `{{product_name}}` in yellow background
- Clicking a variable opens a popover to:
  - Set a default value for preview
  - Change variable name
  - Mark as required/optional
  - Set variable type (text, date, number, email, url, enum)
  - Set enum options if type is enum

### 2.3 AI Template Generation

**Flow: Template → Variables → AI → Variants → Select**

1. User selects a template from the library
2. Variable input form appears (auto-generated from template's variable definitions)
   - Text fields with placeholder hints
   - Date pickers for date variables
   - Dropdowns for enum variables
   - Auto-suggest from Supabase (products, clusters, campaigns)
3. User fills variables (or clicks "AI Auto-Fill" to let AI suggest values)
4. User clicks "Generate with AI" → calls DeepSeek API
5. System returns 3 content variants (different approaches/angles)
6. User previews each variant with variables rendered
7. User selects best variant → enters editor → edits → saves

**AI Generation parameters:**

| Parameter | Value | Notes |
|-----------|-------|-------|
| Model | DeepSeek Pro | Quality > speed for content |
| Temperature | 0.7 | Creative but controlled |
| Max tokens | 2000 | Adjust per template type |
| System prompt | LYC Brand Guidelines (doc 01) | Injected from `brand_guidelines` table |
| User prompt | Template content + variables + tone instruction | Built from `ai_prompt_template` field |

**AI variant differentiation:**
- Variant A: Professional/formal tone
- Variant B: Conversational/storytelling tone
- Variant C: Data-driven/analytical tone

**AI Auto-Fill variables:**
When user clicks "AI Auto-Fill", DeepSeek analyzes:
- Selected product/cluster context (from Supabase)
- Recent content performance (which angles worked)
- Campaign goals (if template linked to campaign)
- Channel best practices
And suggests variable values.

### 2.4 Brand Consistency Scoring

**Scoring criteria (5 dimensions, 0-100 each → weighted average → 0-100 total):**

| Criterion | Weight | How Measured |
|-----------|--------|--------------|
| Brand Voice | 25% | DeepSeek compares content tone against brand guidelines |
| Structure Compliance | 20% | Required sections present? (CTA, social proof, etc.) |
| Length Optimization | 15% | Word count within channel-ideal range |
| Variable Completeness | 20% | All required variables filled with meaningful values |
| Actionability | 20% | Has clear CTA? Reader knows what to do next? |

**Score display:**
- Score badge on each content asset: green (≥80), amber (60-79), red (<60)
- Detailed breakdown in side panel (radar chart)
- AI suggestions for improvement (per criterion)
- "Fix with AI" button → AI rewrites to address specific issues

### 2.5 Asset Library (Media)

**Asset types:**

| Type | Formats | Preview | Storage |
|------|---------|---------|---------|
| Image | PNG, JPG, SVG, WebP | Thumbnail + lightbox | Supabase Storage |
| Document | PDF, DOCX, MD | First-page preview | Supabase Storage |
| Video | MP4, WebM | Video thumbnail + player | Supabase Storage |
| Audio | MP3, WAV | Waveform preview | Supabase Storage |
| Design | FIG link, CANVA link | Embedded preview | External link |

**Asset metadata:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Display name |
| `type` | ENUM | Image, document, video, audio, design |
| `file_url` | TEXT | Supabase Storage URL |
| `thumbnail_url` | TEXT | Auto-generated thumbnail |
| `file_size` | INTEGER | File size in bytes |
| `mime_type` | TEXT | MIME type |
| `dimensions` | JSONB | Width/height for images/videos |
| `duration` | INTEGER | Duration in seconds for video/audio |
| `folder_id` | UUID | Parent folder |
| `tags` | TEXT[] | Tags for filtering |
| `alt_text` | TEXT | Accessibility alt text |
| `created_by` | UUID | Uploader |
| `created_at` | TIMESTAMPTZ | Upload timestamp |
| `usage_count` | INTEGER | How many times used in content |

**Folder structure:**
- Hierarchical folders (max 5 levels deep)
- Drag-and-drop to move assets between folders
- Smart folders (auto-populated by rules):
  - "Recently Used" — last 30 days
  - "Unused" — not referenced in any content asset > 90 days
  - "By Product" — auto-categorized by product tag
  - "By Campaign" — auto-categorized by campaign link

**Asset actions:**
- Upload (drag-and-drop or file picker, multi-file)
- Preview (lightbox for images, inline player for video/audio)
- Edit metadata (name, tags, alt text, folder)
- Replace file (keep same metadata, swap file)
- Copy URL (for use in content)
- Insert into editor (at cursor position)
- Download
- Delete (soft delete, confirmation required)

### 2.6 Template Analytics

**Per-template metrics:**

| Metric | Source | Description |
|--------|--------|-------------|
| Usage Count | `content_assets` WHERE template_id = X | Total times template was used |
| Last Used | MAX(created_at) from above | Most recent usage |
| Avg Content Score | AVG(content_score) from generated assets | Average AI brand score |
| Avg Time to Publish | AVG(time from creation to scheduled) | How fast people fill this template |
| Conversion Rate | Registrations / content pieces created from template | For nurture templates |
| Performance Score | Avg engagement of content created from this template | Cross-reference with analytics |

**Template health indicators:**
- 🟢 High-performer: >20 uses, avg score >80
- 🟡 Underutilized: <5 uses in 90 days
- 🔴 Low-quality: avg score <60
- ⭐ Star: top 10% by combined usage × score

### 2.7 Template Sharing & Approval

**Sharing modes:**

| Mode | Description |
|------|-------------|
| Private | Only creator can see/edit |
| Team | Visible to all team members, edit by creator only |
| Shared | Visible to all, anyone can edit (with version tracking) |
| System | Visible to all, locked (must copy to edit), managed by admin |

**Approval workflow:**
1. Editor creates/modifies template → status = `draft`
2. Editor submits for review → status = `in_review`, notification to reviewer
3. Reviewer approves → status = `active`, template available to all
4. Reviewer rejects with comments → status = `draft`, notification to editor
5. Active template can be locked → status = `active` + `is_locked = true`

**Template comments:**
- Threaded comments on any template
- @mentions trigger notifications
- Resolve/unresolve
- AI auto-comments: suggests improvements based on brand guidelines

### 2.8 Drag-to-Calendar Integration

**Interaction:**
- From template card view, user can drag a template directly onto the Content Calendar
- Drop zone: any date cell in the calendar
- On drop:
  1. Opens quick-create modal pre-filled with template
  2. Variables shown for quick fill
  3. "Create" → new content asset scheduled on that date
  4. "Customize first" → opens full editor before scheduling

**From asset library:**
- Drag an asset (image, document) into the content editor
- Drop into image block → auto-fills the image URL
- Drop into editor → auto-inserts as appropriate block type

### 2.9 Bulk Operations

| Operation | Description |
|-----------|-------------|
| Bulk create from template | Select template → set variable values → generate N content variants at once |
| Bulk tag | Select multiple assets → add/remove tags |
| Bulk move | Select multiple assets → move to folder |
| Bulk export | Select multiple templates → export as ZIP (each as .md) |
| Bulk duplicate | Select multiple templates → create copies |
| Bulk archive | Select multiple templates → archive |
| Bulk status change | Select multiple content assets → change status |

### 2.10 Import & Export

**Import formats:**
- Markdown (.md) → parse into blocks
- JSON (.json) → import template with variables
- DOCX (.docx) → convert to blocks (headings, paragraphs, lists, images)
- HTML (.html) → convert to blocks
- Google Docs link → fetch and convert (requires OAuth)

**Export formats:**
- Markdown (.md) — blocks → markdown
- JSON (.json) — full template with variables
- DOCX (.docx) — blocks → Word document
- PDF (.pdf) — blocks → styled PDF
- HTML (.html) — blocks → HTML with inline CSS

---

## 3. User Requirements

### 3.1 By Role

| Requirement | Echo (Content) | Xuemei (Writer) | NEXUS (AI) | Carl (Webinar) | Kevin (Approver) |
|-------------|:-:|:-:|:-:|:-:|:-:|
| Browse templates by type | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create new template from scratch | ✓ | ✓ | — | ✓ | — |
| AI generate content from template | ✓ | ✓ | ✓ | ✓ | — |
| Edit template in rich editor | ✓ | ✓ | — | — | — |
| Review & approve templates | — | — | — | — | ✓ |
| Upload/manage media assets | ✓ | — | — | ✓ | — |
| View template analytics | ✓ | — | ✓ | — | ✓ |
| Drag template to calendar | ✓ | ✓ | — | ✓ | — |
| Check brand consistency score | ✓ | ✓ | ✓ | — | ✓ |
| Lock/unlock system templates | — | — | — | — | ✓ |
| Bulk create content from template | ✓ | — | ✓ | — | — |
| Comment on templates | ✓ | ✓ | ✓ | ✓ | ✓ |

### 3.2 Key User Flows

**Flow 1: Create content from template (primary flow)**
```
Browse library → Select template → Preview
  → Click "Use Template"
  → Fill variables (manual or AI auto-fill)
  → Click "Generate with AI" → 3 variants
  → Select variant → Edit in rich editor
  → Check brand score → Fix issues if needed
  → Save as content asset → Schedule in calendar
```

**Flow 2: Create a new template**
```
Click "+ New Template" → Select type
  → Open rich editor → Build template with blocks
  → Add variables ({{name}}) → Set variable types
  → Preview with sample values
  → Save as draft → Submit for review
  → Reviewer approves → Template goes active
```

**Flow 3: Upload and use media assets**
```
Drag files to upload area → Files process
  → Auto-generate thumbnails
  → Add tags, alt text, move to folder
  → In editor: click image block → Select from library
  → Or drag asset from library into editor
```

**Flow 4: Template analytics review**
```
Navigate to Template Library → Switch to "Analytics" view
  → See templates ranked by usage × quality
  → Identify underutilized templates → Archive or improve
  → Identify high-performers → Duplicate for new campaign
  → See avg content score → Identify templates that need better AI prompts
```

---

## 4. UX Requirements

### 4.1 Page Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Template & Asset Library                                                │
│                                                                         │
│ [Tabs: Templates | Assets | Analytics]                                  │
│                                                                         │
│ ┌─ Templates Tab ─────────────────────────────────────────────────────┐ │
│ │                                                                     │ │
│ │ [Search templates...]     [Type ▼] [Category ▼] [Channel ▼] [+ New]│ │
│ │                                                                     │ │
│ │ [Grid] [List] [Board]     Favorites ★ | Recent | My Templates      │ │
│ │                                                                     │ │
│ │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐              │ │
│ │ │ 📧       │ │ 💼       │ │ 🎥       │ │ 📊       │              │ │
│ │ │Newsletter│ │LinkedIn  │ │Webinar   │ │Exec      │              │ │
│ │ │          │ │Post      │ │Promo     │ │Brief     │              │ │
│ │ │          │ │          │ │          │ │          │              │ │
│ │ │ Uses: 47 │ │ Uses: 123│ │ Uses: 23 │ │ Uses: 8  │              │ │
│ │ │ Score: 85│ │ Score: 91│ │ Score: 78│ │ Score: 88│              │ │
│ │ │          │ │          │ │          │ │          │              │ │
│ │ │ [Use] [⋯]│ │ [Use][⋯]│ │ [Use][⋯]│ │ [Use][⋯]│              │ │
│ │ └──────────┘ └──────────┘ └──────────┘ └──────────┘              │ │
│ │                                                                     │ │
│ │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐              │ │
│ │ │ 📨       │ │ 🎙️       │ │ ▶️       │ │ 🌐       │              │ │
│ │ │Email     │ │Podcast   │ │YouTube   │ │Landing   │              │ │
│ │ │Sequence  │ │Notes     │ │Desc      │ │Page      │              │ │
│ │ │          │ │          │ │          │ │          │              │ │
│ │ │ Uses: 34 │ │ Uses: 15 │ │ Uses: 12 │ │ Uses: 19 │              │ │
│ │ │ Score: 82│ │ Score: 76│ │ Score: 71│ │ Score: 89│              │ │
│ │ │          │ │          │ │          │ │          │              │ │
│ │ │ [Use] [⋯]│ │ [Use][⋯]│ │ [Use][⋯]│ │ [Use][⋯]│              │ │
│ │ └──────────┘ └──────────┘ └──────────┘ └──────────┘              │ │
│ │                                                                     │ │
│ │ Showing 8 of 47 templates            [< 1 2 3 ... >]              │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Template Card Design

```
┌──────────────────────────┐
│ ★  📧            [⋮ ⚙]  │  ← Star toggle, type icon, more menu
│                          │
│  Newsletter Template     │  ← Name (truncated at 2 lines)
│  Standard edition format │  ← Description (1 line, truncated)
│                          │
│  ┌────────────────────┐  │
│  │  Preview thumbnail │  │  ← Auto-generated from template content
│  │  (first 3 lines)   │  │
│  └────────────────────┘  │
│                          │
│  Uses: 47  Score: 85     │  ← Usage count + avg brand score
│  ████████░░ 85%          │  ← Score progress bar (color-coded)
│                          │
│  [Use Template]          │  ← Primary CTA
│                          │
│  Echo · Updated 2d ago   │  ← Creator + last update
└──────────────────────────┘
```

### 4.3 Template Use Flow (Modal)

```
┌─────────────────────────────────────────────────────┐
│ Use Template: Newsletter                    [✕]     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Fill Variables:                                    │
│  ┌─────────────────────────────────────────────┐   │
│  │ Issue Number     [42                    ]   │   │
│  │ Headline         [AI-Powered Diag...    ]   │   │
│  │ Key Message      [                      ]   │   │
│  │ Tone             [Professional ▼]           │   │
│  │ Target Cluster   [Executive ▼]              │   │
│  │ Target Product   [SPARK ▼]                  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [✨ AI Auto-Fill Variables]                       │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  Template Preview (with variables filled):          │
│  ┌─────────────────────────────────────────────┐   │
│  │ # LYC Partners Newsletter — Issue 42        │   │
│  │                                             │   │
│  │ ## AI-Powered Diagnostic Assessment:        │   │
│  │    Transforming Executive Decision-Making   │   │
│  │                                             │   │
│  │ Dear {{first_name}},                        │   │
│  │                                             │   │
│  │ In today's rapidly evolving...              │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  [Generate 3 AI Variants]   [Skip — Edit Manually] │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 4.4 AI Variants Selection

```
┌─────────────────────────────────────────────────────┐
│ Select Best Variant                          [✕]     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─ Variant A: Professional ──────────────────┐    │
│  │ Score: 88/100                               │    │
│  │ "This data-driven approach positions SPARK  │    │
│  │  as the analytical solution for..."         │    │
│  │                              [Preview] [✓]  │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─ Variant B: Conversational ────────────────┐    │
│  │ Score: 82/100                               │    │
│  │ "Imagine walking into your next board       │    │
│  │  meeting with complete clarity on..."       │    │
│  │                              [Preview] [✓]  │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─ Variant C: Story-Driven ──────────────────┐    │
│  │ Score: 79/100                               │    │
│  │ "When a Fortune 500 CEO realized her        │    │
│  │  team was making decisions based on..."     │    │
│  │                              [Preview] [✓]  │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  [🔄 Regenerate]   Selected: Variant A  [Continue →]│
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 4.5 Rich Editor

```
┌─────────────────────────────────────────────────────────────────┐
│ Editing: Newsletter Issue 42               Draft  [Save] [Pub]  │
├─────────────────────────────────────────────────────────────────┤
│ ┌─── Tool Bar ──────────────────────────────────────────────┐  │
│ │ [B] [I] [U] [S] [🔗] [H▼] [•≡] [1.] [☑] [""] [</>] [⊞] │  │
│ └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  # LYC Partners Newsletter — Issue 42                          │
│                                                                 │
│  ## AI-Powered Diagnostic Assessment                           │
│                                                                 │
│  Dear {{first_name}},                              ← variable  │
│                                        (highlighted in yellow) │
│  In today's rapidly evolving business landscape,               │
│  organizations face an unprecedented challenge:                │
│  making data-driven decisions without...                       │
│                                                                 │
│  > "The best leaders don't guess — they diagnose."             │
│                                                                 │
│  ┌─ AI Suggestion ─────────────────────────────┐               │
│  │ 💡 Consider adding a specific statistic      │               │
│  │    here to strengthen your opening.          │               │
│  │    [Apply] [Dismiss] [Regenerate]           │               │
│  └─────────────────────────────────────────────┘               │
│                                                                 │
│  - Point one about the diagnostic approach                      │
│  - Point two about {{product_name}} capabilities                │
│  - Point three with measurable outcomes                         │
│                                                                 │
│  [CTA Block]                                                    │
│  ┌──────────────────────────────────────┐                       │
│  │ 📅 Register for our upcoming webinar │                       │
│  │ [Register Now →]                     │                       │
│  └──────────────────────────────────────┘                       │
│                                                                 │
│  /  ← slash command active                                      │
│                                                                 │
│  ┌─ Slash Commands ──┐                                          │
│  │ Heading           │                                          │
│  │ Bullet List       │                                          │
│  │ Image             │                                          │
│  │ Variable: {{...}} │                                          │
│  │ AI: Write         │                                          │
│  │ AI: Expand        │                                          │
│  │ AI: Rewrite       │                                          │
│  │ Callout           │                                          │
│  │ Divider           │                                          │
│  └───────────────────┘                                          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Brand Score: 85/100 ████░  |  Words: 342  |  Vars: 3/4 filled  │
│ [Check Brand Score]  [Preview]  [Save Draft]  [Schedule →]     │
└─────────────────────────────────────────────────────────────────┘
```

### 4.6 Brand Score Detail Panel

```
┌─────────────────────────────────────┐
│ Brand Consistency Score             │
│                                     │
│        Overall: 85/100              │
│        ████████░░                   │
│                                     │
│  ┌─ Radar Chart ─────────────────┐  │
│  │         Voice: 92             │  │
│  │        /     \                │  │
│  │  Structure  Actionability    │  │
│  │     78        85             │  │
│  │       \     /                │  │
│  │    Length: 80  Vars: 88      │  │
│  └──────────────────────────────┘  │
│                                     │
│  Suggestions:                       │
│  ┌─────────────────────────────┐   │
│  │ ⚠️ Structure (78/100)       │   │
│  │ Missing: Social proof       │   │
│  │ section. Consider adding    │   │
│  │ a client testimonial.       │   │
│  │ [Fix with AI] [Dismiss]     │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ ⚠️ Length (80/100)          │   │
│  │ 342 words. Ideal for        │   │
│  │ newsletter: 400-500 words.  │   │
│  │ [Expand with AI] [Dismiss]  │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Re-check Score]                   │
└─────────────────────────────────────┘
```

### 4.7 Assets Tab

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Assets                                                                  │
│                                                                         │
│ [📁 Folders: All > Marketing > Q3 Campaign]  [Search assets...] [Upload]│
│                                                                         │
│ ┌─ Sidebar ──┐ ┌─ Asset Grid ──────────────────────────────────────┐  │
│ │             │ │                                                    │  │
│ │ 📁 All      │ │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐            │  │
│ │ 📁 Marketing│ │ │ 🖼️   │ │ 🖼️   │ │ 📄   │ │ 🎥   │            │  │
│ │   📁 Q3 Camp│ │ │      │ │      │ │      │ │      │            │  │
│ │   📁 Q2 Camp│ │ │hero- │ │logo- │ │case- │ │demo- │            │  │
│ │ 📁 Products │ │ │banner│ │white │ │study │ │video │            │  │
│ │   📁 SPARK  │ │ │      │ │      │ │      │ │      │            │  │
│ │   📁 WAVE   │ │ │2400× │ │500×  │ │2.3MB │ │45MB  │            │  │
│ │   📁 DEX    │ │ │1200  │ │500   │ │      │ │      │            │  │
│ │ 📁 Events   │ │ └──────┘ └──────┘ └──────┘ └──────┘            │  │
│ │ 📁 Brand    │ │                                                    │  │
│ │   📁 Logos  │ │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐            │  │
│ │   📁 Colors │ │ │ 🖼️   │ │ 🖼️   │ │ 🎵   │ │ 🔗   │            │  │
│ │ 📁 Team     │ │ │      │ │      │ │      │ │      │            │  │
│ │             │ │ │head- │ │team- │ │pod-  │ │figma │            │  │
│ │ Smart:      │ │ │shots │ │photo │ │ep12  │ │link  │            │  │
│ │ ⭐ Recent   │ │ │      │ │      │ │      │ │      │            │  │
│ │ 🗑️ Unused   │ │ └──────┘ └──────┘ └──────┘ └──────┘            │  │
│ │             │ │                                                    │  │
│ └─────────────┘ │ 16 assets • 234 MB total      [Grid] [List]      │  │
│                  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.8 Empty States

| State | Message | Action |
|-------|---------|--------|
| No templates | "No templates yet. Create your first or start with AI." | [Create Template] [Generate with AI] |
| No assets | "Drop files here or click Upload to add assets." | [Upload] |
| No search results | "No templates match your search. Try different keywords." | [Clear Filters] |
| No analytics | "No template usage data yet. Start creating content to see analytics." | [Browse Templates] |
| Brand score unavailable | "AI scoring requires brand guidelines. Set up in Settings." | [Go to Settings] |

---

## 5. Design Requirements

### 5.1 Component Library

| Component | Specs |
|-----------|-------|
| Template Card | 280×220px, border-radius: 12px, shadow-sm, hover: shadow-md + translateY(-2px), transition: 200ms |
| Variable Pill | Inline, background: #FEF3C7, border: 1px solid #F59E0B, border-radius: 4px, padding: 2px 6px, font: 12px mono |
| Score Badge | Pill, 32×20px, border-radius: 10px, green(≥80)/amber(60-79)/red(<60), font: 11px bold |
| Asset Thumbnail | 160×120px, border-radius: 8px, object-fit: cover, hover: overlay with actions |
| Slash Command Menu | Floating, 200px wide, max-height: 240px, scroll, shadow-lg, border-radius: 8px |
| Variant Card | Full width, border: 2px solid border-default, selected: border-primary + bg-primary-5%, shadow on hover |
| Brand Score Radar | 180×180px SVG, 5 axes, filled area with 30% opacity, stroke: primary |
| Folder Tree | Sidebar, indent 16px per level, chevron expand/collapse, drag handle on hover |
| Upload Zone | Dashed border: 2px dashed border-default, bg on dragover: bg-primary-5%, min-height: 120px |

### 5.2 Interactions & Animations

| Interaction | Animation |
|-------------|-----------|
| Template card hover | translateY(-2px) + shadow increase, 200ms ease |
| Drag template to calendar | Card lifts (scale 1.05, shadow-xl), ghost preview follows cursor |
| Slash command appear | Fade in + translateY(-4px), 150ms ease-out |
| AI generating | Skeleton pulse on content area, spinner + "Generating variant X of 3..." |
| Variant selected | Border color transition + slight scale (1.02), 200ms |
| Brand score update | Number count-up animation (300ms), radar chart path morph |
| Asset upload | Progress bar per file, completion → thumbnail fade-in |
| Template save | Flash green on save button + toast "Template saved" |
| Block drag reorder | Lift block (shadow-md), other blocks smoothly shift position |

### 5.3 Responsive Breakpoints

| Breakpoint | Layout Changes |
|------------|---------------|
| Desktop (>1024px) | Full grid (4 cols), sidebar visible, full editor |
| Tablet (768-1024px) | Grid (3 cols), sidebar collapsible, editor with toolbar |
| Mobile (<768px) | Grid (2 cols) → List view default, no sidebar, simplified editor (read-only preview + edit button → full screen) |

### 5.4 Keyboard Navigation (Template Library)

| Key | Action |
|-----|--------|
| `↑/↓/←/→` | Navigate template cards |
| `Enter` | Open template / Use template |
| `Space` | Preview template (modal) |
| `Cmd+K` | Global search (templates + assets) |
| `Cmd+N` | New template |
| `Cmd+U` | Upload asset |
| `Cmd+F` | Focus search bar |
| `1/2/3` | Switch view (Grid/List/Board) |
| `S` | Toggle star/favorite |
| `Delete` | Archive selected (with confirmation) |
| `Cmd+A` | Select all (in current view) |
| `Escape` | Close modal / deselect |

---

## 6. Technical Backend Wiring

### 6.1 Supabase Schema

```sql
-- ═══════════════════════════════════════════════════════════════
-- TABLE: templates (expanded from v1.0)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'newsletter', 'webinar_promo', 'linkedin_post', 'email_sequence',
    'exec_brief', 'podcast_notes', 'youtube_description', 'landing_page',
    'case_study', 'social_carousel', 'registration_form', 'report_whitepaper'
  )),
  category TEXT,
  description TEXT,
  content JSONB NOT NULL DEFAULT '[]'::jsonb,  -- Block-based content
  variables JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{name, type, required, default, options}]
  brand_guidelines JSONB,
  thumbnail_url TEXT,
  is_system BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  locked_by UUID REFERENCES auth.users(id),
  usage_count INTEGER DEFAULT 0,
  avg_content_score FLOAT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'active', 'archived')),
  sharing_mode TEXT DEFAULT 'team' CHECK (sharing_mode IN ('private', 'team', 'shared', 'system')),
  tags TEXT[] DEFAULT '{}',
  channel TEXT,
  estimated_time INTEGER,
  ai_prompt_template TEXT,
  version INTEGER DEFAULT 1,
  parent_version UUID REFERENCES templates(id),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_templates_type ON templates(type);
CREATE INDEX idx_templates_status ON templates(status);
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_tags ON templates USING gin(tags);
CREATE INDEX idx_templates_search ON templates USING gin(
  to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(description, ''))
);
CREATE INDEX idx_templates_created_by ON templates(created_by);
CREATE INDEX idx_templates_usage ON templates(usage_count DESC);

-- ═══════════════════════════════════════════════════════════════
-- TABLE: template_versions (expanded from asset_versions)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE template_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content JSONB NOT NULL,
  variables JSONB,
  name TEXT,
  changes_summary TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(template_id, version_number)
);

CREATE INDEX idx_template_versions_tid ON template_versions(template_id);

-- ═══════════════════════════════════════════════════════════════
-- TABLE: assets (media library)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'document', 'video', 'audio', 'design')),
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  dimensions JSONB,         -- {width, height} for images/video
  duration INTEGER,         -- seconds for video/audio
  folder_id UUID REFERENCES asset_folders(id),
  tags TEXT[] DEFAULT '{}',
  alt_text TEXT,
  usage_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ    -- soft delete
);

CREATE INDEX idx_assets_type ON assets(type);
CREATE INDEX idx_assets_folder ON assets(folder_id);
CREATE INDEX idx_assets_tags ON assets USING gin(tags);
CREATE INDEX idx_assets_search ON assets USING gin(
  to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(alt_text, ''))
);
CREATE INDEX idx_assets_deleted ON assets(deleted_at) WHERE deleted_at IS NULL;

-- ═══════════════════════════════════════════════════════════════
-- TABLE: asset_folders
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE asset_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  parent_id UUID REFERENCES asset_folders(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_asset_folders_parent ON asset_folders(parent_id);

-- ═══════════════════════════════════════════════════════════════
-- TABLE: template_comments
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE template_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES template_comments(id),  -- for threading
  content TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT false,
  mentions UUID[] DEFAULT '{}',  -- user IDs @mentioned
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_template_comments_tid ON template_comments(template_id);

-- ═══════════════════════════════════════════════════════════════
-- TABLE: template_analytics
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE template_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES content_assets(id),
  event_type TEXT NOT NULL CHECK (event_type IN (
    'template_used', 'content_generated', 'content_scheduled',
    'content_published', 'content_viewed'
  )),
  content_score FLOAT,
  metadata JSONB,  -- extra data per event
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_template_analytics_tid ON template_analytics(template_id);
CREATE INDEX idx_template_analytics_event ON template_analytics(event_type);
CREATE INDEX idx_template_analytics_date ON template_analytics(created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- TABLE: template_approvals
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE template_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('submitted', 'approved', 'rejected', 'revision_requested')),
  reviewer_id UUID REFERENCES auth.users(id),
  comments TEXT,
  submitted_by UUID REFERENCES auth.users(id),
  submitted_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX idx_template_approvals_tid ON template_approvals(template_id);
CREATE INDEX idx_template_approvals_status ON template_approvals(status);
```

### 6.2 Supabase Storage Buckets

```sql
-- Assets bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true);

-- Policy: authenticated users can upload
CREATE POLICY "Users can upload assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'assets' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy: anyone can read assets
CREATE POLICY "Anyone can read assets"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'assets');

-- Auto-generate thumbnails on upload (Supabase Edge Function)
-- Function: on_asset_upload → generate thumbnail → store in assets/thumbnails/
```

### 6.3 API Routes

| Method | Route | Description | Request | Response |
|--------|-------|-------------|---------|----------|
| GET | `/api/templates` | List templates | `?type=&category=&status=&search=&sort=&page=&limit=` | `{data: Template[], total, page}` |
| GET | `/api/templates/:id` | Get template detail | — | `{data: Template}` |
| POST | `/api/templates` | Create template | `{name, type, content, variables, ...}` | `{data: Template}` |
| PATCH | `/api/templates/:id` | Update template | `{name?, content?, variables?, status?, ...}` | `{data: Template}` |
| DELETE | `/api/templates/:id` | Archive template | — | `{success: true}` |
| POST | `/api/templates/:id/duplicate` | Duplicate template | — | `{data: Template}` |
| POST | `/api/templates/:id/lock` | Lock/unlock template | `{locked: bool}` | `{data: Template}` |
| POST | `/api/templates/:id/use` | Record template usage | `{asset_id}` | `{data: {usage_count}}` |
| GET | `/api/templates/:id/analytics` | Template analytics | `?period=30d` | `{data: Analytics}` |
| POST | `/api/templates/:id/versions` | Create version snapshot | `{changes_summary}` | `{data: TemplateVersion}` |
| GET | `/api/templates/:id/versions` | List versions | — | `{data: TemplateVersion[]}` |
| POST | `/api/templates/:id/versions/:vid/restore` | Restore version | — | `{data: Template}` |
| POST | `/api/templates/:id/comments` | Add comment | `{content, parent_id?, mentions?}` | `{data: Comment}` |
| GET | `/api/templates/:id/comments` | List comments | — | `{data: Comment[]}` |
| PATCH | `/api/templates/:id/comments/:cid` | Update comment | `{content?, is_resolved?}` | `{data: Comment}` |
| POST | `/api/templates/:id/submit-review` | Submit for approval | — | `{data: Approval}` |
| POST | `/api/templates/:id/approve` | Approve template | `{comments?}` | `{data: Approval}` |
| POST | `/api/templates/:id/reject` | Reject template | `{comments}` | `{data: Approval}` |
| POST | `/api/templates/generate` | AI generate from template | `{template_id, variables, tone?}` | `{data: {variants: string[]}}` |
| POST | `/api/templates/brand-score` | AI brand consistency score | `{template_id, content}` | `{data: {score, breakdown, suggestions}}` |
| POST | `/api/templates/import` | Import template | File upload (md/json/docx) | `{data: Template}` |
| GET | `/api/templates/:id/export` | Export template | `?format=md|json|docx|pdf` | File download |
| POST | `/api/templates/bulk` | Bulk operations | `{ids, operation, params}` | `{data: {affected: number}}` |
| GET | `/api/assets` | List assets | `?type=&folder_id=&tags=&search=&page=&limit=` | `{data: Asset[], total, page}` |
| POST | `/api/assets/upload` | Upload asset(s) | Multipart file upload | `{data: Asset}` |
| PATCH | `/api/assets/:id` | Update asset metadata | `{name?, tags?, alt_text?, folder_id?}` | `{data: Asset}` |
| DELETE | `/api/assets/:id` | Delete asset (soft) | — | `{success: true}` |
| POST | `/api/assets/:id/replace` | Replace file | Multipart file upload | `{data: Asset}` |
| GET | `/api/asset-folders` | List folders | `?parent_id=` | `{data: Folder[]}` |
| POST | `/api/asset-folders` | Create folder | `{name, parent_id?}` | `{data: Folder}` |
| PATCH | `/api/asset-folders/:id` | Rename/move folder | `{name?, parent_id?}` | `{data: Folder}` |
| DELETE | `/api/asset-folders/:id` | Delete folder | — | `{success: true}` |

### 6.4 Realtime Subscriptions

| Channel | Events | Purpose |
|---------|--------|---------|
| `templates:{id}` | UPDATE | Template content changed by another user |
| `templates:{id}:comments` | INSERT, UPDATE, DELETE | New/edited/resolved comments |
| `templates:{id}:approval` | UPDATE | Approval status change |
| `assets:uploads` | INSERT | New asset uploaded (for team view) |

### 6.5 Caching Strategy

| Data | Cache | TTL | Invalidation |
|------|-------|-----|--------------|
| Template list | SWR (stale-while-revalidate) | 30s | On template create/update/archive |
| Template detail | SWR | 10s | On Realtime update |
| Asset list | SWR | 30s | On asset upload/delete |
| Template analytics | SWR | 5min | On template usage event |
| Brand guidelines | Local storage | 1h | On settings change |
| AI generation result | No cache | — | — (always fresh) |

### 6.6 Performance Budget

| Metric | Target |
|--------|--------|
| Template list load (50 templates) | < 500ms |
| Template editor render | < 200ms |
| AI generation (3 variants) | < 15s |
| Brand score calculation | < 5s |
| Asset upload (10MB image) | < 3s |
| Search results (full-text) | < 300ms |
| Virtual scroll (1000+ assets) | 60fps scroll |

---

## 7. AI Layer Specification

### 7.1 AI Personas

**Persona: Content Creator**
```yaml
name: "LYC Content Creator"
role: "Generate content from templates following brand guidelines"
model: deepseek-pro
temperature: 0.7
max_tokens: 2000
system_prompt: |
  You are the LYC Partners content creator. You write professional, insightful
  content that reflects LYC's brand voice:
  - Authoritative but approachable
  - Data-driven but human
  - Strategic but actionable
  - No jargon unless industry-standard
  - Always include a clear CTA
  
  You have access to the template structure and variables. Generate content
  that fits the template format exactly, filling all variable placeholders
  with contextually appropriate content.
  
  Brand guidelines: {brand_guidelines}
  Template type: {template_type}
  Channel: {channel}
```

**Persona: Brand Auditor**
```yaml
name: "LYC Brand Auditor"
role: "Score content for brand consistency and suggest improvements"
model: deepseek-pro
temperature: 0.3
max_tokens: 1000
system_prompt: |
  You are the LYC Partners brand auditor. Evaluate content against these
  5 dimensions (0-100 each):
  
  1. Brand Voice (25%): Does the tone match LYC's authoritative-yet-approachable voice?
  2. Structure Compliance (20%): Are all required sections present (CTA, social proof, etc.)?
  3. Length Optimization (15%): Is word count within the ideal range for this channel?
  4. Variable Completeness (20%): Are all required variables filled with meaningful content?
  5. Actionability (20%): Is there a clear CTA? Does the reader know what to do next?
  
  For each dimension, provide:
  - Score (0-100)
  - One-line explanation
  - Specific improvement suggestion (if score < 80)
  
  Return JSON: {overall_score, breakdown: [{criterion, score, explanation, suggestion}]}
```

**Persona: Variable Suggester**
```yaml
name: "LYC Variable Suggester"
role: "Suggest optimal variable values based on context"
model: deepseek-flash
temperature: 0.5
max_tokens: 500
system_prompt: |
  You are helping fill template variables with optimal values.
  
  Given:
  - Template type and content
  - Product context (from database)
  - Target cluster/audience
  - Channel requirements
  - Recent content performance data
  
  Suggest values for each variable that will maximize engagement
  based on what's worked historically.
  
  Return JSON: {variables: [{name, suggested_value, reasoning}]}
```

**Persona: Content Improver**
```yaml
name: "LYC Content Improver"
role: "Rewrite content to address brand score issues"
model: deepseek-pro
temperature: 0.6
max_tokens: 2000
system_prompt: |
  You are improving existing content to better match LYC brand guidelines.
  
  Given:
  - Original content
  - Brand score breakdown with specific issues
  - Brand guidelines
  
  Rewrite the content to address each issue while preserving the original
  meaning and structure. Make minimal changes — only fix what's flagged.
  
  Return the improved content in the same block format.
```

### 7.2 AI Prompt Templates

**Content Generation Prompt:**
```
Template: {template_name}
Type: {template_type}
Channel: {channel}

Template Content (block structure):
{template_content_blocks}

Variables to fill:
{variables_with_values}

Tone: {tone}
Target Audience: {cluster}
Product Focus: {product}

Generate 3 content variants:
- Variant A: Professional/formal approach
- Variant B: Conversational/storytelling approach  
- Variant C: Data-driven/analytical approach

Each variant must:
1. Follow the template block structure exactly
2. Fill all variable placeholders with contextually appropriate values
3. Maintain LYC brand voice (see guidelines below)
4. Include a clear, actionable CTA
5. Be between {min_words}-{max_words} words

Brand Guidelines:
{brand_guidelines_text}
```

**Brand Scoring Prompt:**
```
Content to evaluate:
{content_text}

Template type: {template_type}
Channel: {channel}
Required variables: {required_variables}
Brand guidelines: {brand_guidelines_text}

Evaluate on 5 dimensions:
1. Brand Voice (weight: 25%)
2. Structure Compliance (weight: 20%)
3. Length Optimization (weight: 15%) — ideal range: {ideal_word_range}
4. Variable Completeness (weight: 20%)
5. Actionability (weight: 20%)

Return JSON with scores and specific suggestions.
```

### 7.3 AI Insight Types

| Insight | Trigger | Action |
|---------|---------|--------|
| Template underused | Template with <5 uses in 90 days | Suggest archiving or promoting |
| Template low score | Avg content score <60 for last 5 uses | Suggest improving AI prompt template |
| Variable gap | Common variable left empty across uses | Suggest adding default value or AI auto-fill |
| Content opportunity | No content scheduled for a channel in 7 days | Suggest template + generate content |
| Template duplication | Two templates with >80% content similarity | Suggest merging |
| Asset unused | Asset not used in any content for 90 days | Suggest archiving or deleting |
| Best performer | Template with highest usage × score this month | Highlight in "Top Templates" |

---

## 8. Tickets

### Phase 1: P0 — Core Library + Editor + AI Generation (70h / ~3 weeks)

| Ticket | Title | Priority | Effort | Dependencies |
|--------|-------|----------|--------|--------------|
| TPL-001 | Supabase `templates` table + RLS policies | P0 | 3h | TICKET-002 |
| TPL-002 | Template list — Grid view (Supabase-backed) | P0 | 4h | TPL-001 |
| TPL-003 | Template list — List view | P0 | 2h | TPL-002 |
| TPL-004 | Template list — Board view (Kanban by type) | P0 | 3h | TPL-002 |
| TPL-005 | Template search (full-text) + multi-filter | P0 | 4h | TPL-002 |
| TPL-006 | Template sort (usage, score, date, name) | P0 | 1h | TPL-002 |
| TPL-007 | Template card component (thumbnail, score badge, usage) | P0 | 3h | TPL-002 |
| TPL-008 | Template preview modal (render blocks, highlight variables) | P0 | 3h | TPL-007 |
| TPL-009 | Block-based rich editor — core (paragraph, heading, list) | P0 | 8h | TPL-001 |
| TPL-010 | Rich editor — slash commands | P0 | 4h | TPL-009 |
| TPL-011 | Rich editor — variable blocks (`{{name}}` pills) | P0 | 3h | TPL-009 |
| TPL-012 | Rich editor — image blocks (upload + URL) | P0 | 3h | TPL-009, TPL-020 |
| TPL-013 | Template create form (type selection + editor) | P0 | 3h | TPL-009 |
| TPL-014 | Template edit flow (load from Supabase, save, version) | P0 | 3h | TPL-013 |
| TPL-015 | Template "Use" flow (variable input form) | P0 | 4h | TPL-008 |
| TPL-016 | AI content generation (DeepSeek → 3 variants) | P0 | 6h | TPL-015, TICKET-004 |
| TPL-017 | Variant selection UI + edit before save | P0 | 3h | TPL-016 |
| TPL-018 | Content-to-Calendar: save as content asset + schedule | P0 | 3h | TPL-017, CAL-019 |
| TPL-019 | Template categories + tag management | P0 | 2h | TPL-001 |
| TPL-020 | Supabase `assets` + `asset_folders` tables + RLS | P0 | 3h | TICKET-002 |
| TPL-021 | Asset upload (drag-and-drop + file picker, multi-file) | P0 | 4h | TPL-020 |
| TPL-022 | Asset grid view (thumbnails, type icons, metadata) | P0 | 3h | TPL-021 |
| TPL-023 | Asset preview (lightbox for images, player for video/audio) | P0 | 3h | TPL-022 |
| TPL-024 | Asset folder tree (sidebar, create, rename, drag-move) | P0 | 3h | TPL-020 |
| TPL-025 | Asset metadata edit (name, tags, alt text, folder) | P0 | 2h | TPL-022 |
| TPL-026 | Insert asset into editor (from library → image block) | P0 | 2h | TPL-012, TPL-022 |

**Phase 1 subtotal: 26 tickets, 70h**

### Phase 2: P1 — AI Intelligence + Scoring + Organization (62h / ~2.5 weeks)

| Ticket | Title | Priority | Effort | Dependencies |
|--------|-------|----------|--------|--------------|
| TPL-027 | AI brand consistency scoring (5-dimension, DeepSeek) | P1 | 5h | TPL-017, TICKET-004 |
| TPL-028 | Brand score UI (badge on cards, detail panel with radar chart) | P1 | 4h | TPL-027 |
| TPL-029 | AI suggestions for improvement (per criterion) | P1 | 3h | TPL-027 |
| TPL-030 | "Fix with AI" — rewrite to address issues | P1 | 4h | TPL-029 |
| TPL-031 | AI auto-fill variables | P1 | 4h | TPL-015, TICKET-004 |
| TPL-032 | Template version history panel (list, view, restore, diff) | P1 | 4h | TPL-014 |
| TPL-033 | Template comments (threaded, @mentions, resolve) | P1 | 4h | TPL-001 |
| TPL-034 | Template sharing modes (private/team/shared/system) | P1 | 3h | TPL-001 |
| TPL-035 | Template approval workflow (submit → review → approve/reject) | P1 | 4h | TPL-034 |
| TPL-036 | Template lock/unlock (read-only, copy-to-edit) | P1 | 2h | TPL-035 |
| TPL-037 | Favorites system (star/unstar, favorites view) | P1 | 1h | TPL-002 |
| TPL-038 | Recently used tracking + view | P1 | 1h | TPL-015 |
| TPL-039 | Template analytics dashboard | P1 | 5h | TPL-001, template_analytics table |
| TPL-040 | Template health indicators (performer/underutilized/low-quality) | P1 | 2h | TPL-039 |
| TPL-041 | Smart folders (Recently Used, Unused, By Product, By Campaign) | P1 | 3h | TPL-024 |
| TPL-042 | Asset tags + search | P1 | 2h | TPL-022 |
| TPL-043 | Content scoring on save (auto-check when saving content asset) | P1 | 2h | TPL-027, CAL-019 |
| TPL-044 | Rich editor — AI blocks (inline generate/expand/rewrite) | P1 | 4h | TPL-009, TPL-016 |
| TPL-045 | Rich editor — callout, toggle, table, embed blocks | P1 | 3h | TPL-009 |
| TPL-046 | Rich editor — auto-save (debounced, every 30s) | P1 | 2h | TPL-009 |

**Phase 2 subtotal: 20 tickets, 62h**

### Phase 3: P2 — Drag-Drop + Import/Export + Advanced (58h / ~2 weeks)

| Ticket | Title | Priority | Effort | Dependencies |
|--------|-------|----------|--------|--------------|
| TPL-047 | Drag template to Content Calendar | P2 | 4h | TPL-002, CAL-019 |
| TPL-048 | Drag asset into editor | P2 | 3h | TPL-022, TPL-009 |
| TPL-049 | Bulk create content from template (N variants) | P2 | 4h | TPL-016 |
| TPL-050 | Bulk operations (tag, move, archive, duplicate) | P2 | 3h | TPL-002, TPL-022 |
| TPL-051 | Import: Markdown + JSON | P2 | 3h | TPL-009 |
| TPL-052 | Import: DOCX + HTML (with conversion to blocks) | P2 | 5h | TPL-009 |
| TPL-053 | Export: Markdown + JSON + DOCX + PDF | P2 | 4h | TPL-009 |
| TPL-054 | Bulk export as ZIP | P2 | 2h | TPL-053 |
| TPL-055 | Template thumbnail auto-generation (first 3 lines preview) | P2 | 3h | TPL-007 |
| TPL-056 | Keyboard shortcuts (full navigation + slash commands) | P2 | 3h | TPL-002, TPL-009 |
| TPL-057 | Command palette (Cmd+K for templates + assets) | P2 | 3h | TPL-002 |
| TPL-058 | Virtual scrolling (template grid 100+ items) | P2 | 2h | TPL-002 |
| TPL-059 | Realtime collaboration (live editing indicators) | P2 | 4h | TPL-009, Realtime |
| TPL-060 | Responsive: tablet breakpoints | P2 | 2h | TPL-002 |
| TPL-061 | Responsive: mobile browse + simplified view | P2 | 3h | TPL-002 |
| TPL-062 | Accessibility: ARIA labels + keyboard nav + screen reader | P2 | 3h | All above |
| TPL-063 | Asset replace file (keep metadata) | P2 | 1h | TPL-022 |
| TPL-064 | Template duplicate/copy | P2 | 1h | TPL-002 |
| TPL-065 | Template archive/restore | P2 | 1h | TPL-001 |
| TPL-066 | AI insight: template underused / low score / content gap | P2 | 3h | TPL-039, DASH-029 |

**Phase 3 subtotal: 20 tickets, 58h**

### Summary

| Phase | Tickets | Hours | Duration |
|-------|---------|-------|----------|
| P0 (Core) | 26 | 70h | ~3 weeks |
| P1 (AI Intelligence) | 20 | 62h | ~2.5 weeks |
| P2 (Advanced) | 20 | 58h | ~2 weeks |
| **Total** | **66** | **190h** | **~7.5 weeks** |

**Expansion from v1.0:** 10 tickets → 66 tickets (+56 new), 24h → 190h (+166h)

---

## 9. Acceptance Criteria

### P0 (Must have for launch)

- [ ] Templates load from Supabase with real-time updates
- [ ] 3 view modes (Grid, List, Board) work with filters and search
- [ ] Block-based editor supports all core block types (paragraph, headings, lists, images, variables)
- [ ] Slash commands work for block insertion and AI actions
- [ ] Template "Use" flow: select → fill variables → AI generate 3 variants → select → edit → save
- [ ] AI content generation returns 3 variants in <15 seconds
- [ ] Brand guidelines injected into AI prompts
- [ ] Generated content saves as content asset in Content Calendar
- [ ] Asset library: upload, preview, organize in folders, tag, search
- [ ] Assets can be inserted into editor (drag or click)
- [ ] Template categories and tags filter correctly
- [ ] All API routes return correct data with authentication
- [ ] RLS policies prevent unauthorized access
- [ ] Responsive on desktop and tablet

### P1 (AI intelligence + collaboration)

- [ ] Brand consistency scoring shows 0-100 with 5-dimension breakdown
- [ ] AI suggestions for improvement are actionable
- [ ] "Fix with AI" rewrites content addressing specific issues
- [ ] AI auto-fill suggests variable values from context
- [ ] Version history: list, view each, restore, diff between versions
- [ ] Comments: threaded, @mentions, resolve/unresolve
- [ ] Approval workflow: submit → review → approve/reject with comments
- [ ] Template sharing modes control visibility correctly
- [ ] Lock/unlock prevents accidental edits
- [ ] Template analytics: usage count, avg score, conversion rate
- [ ] Template health indicators (green/yellow/red/star)
- [ ] Smart folders auto-populate correctly
- [ ] Rich editor: AI inline blocks (generate/expand/rewrite)
- [ ] Auto-save every 30s (debounced)

### P2 (Polish + advanced)

- [ ] Drag template from library → drop on Content Calendar → creates scheduled content
- [ ] Drag asset from library → drop into editor → inserts image
- [ ] Bulk create: select template, set N, generate N content variants
- [ ] Bulk operations: tag, move, archive, duplicate, export
- [ ] Import: MD, JSON, DOCX, HTML with block conversion
- [ ] Export: MD, JSON, DOCX, PDF
- [ ] Keyboard shortcuts: full navigation without mouse
- [ ] Command palette (Cmd+K) searches templates + assets
- [ ] Virtual scrolling handles 1000+ assets at 60fps
- [ ] Realtime: see other users editing same template
- [ ] Mobile: browse templates and assets (read-only with edit button)
- [ ] Accessibility: ARIA, keyboard, screen reader
- [ ] Template thumbnail auto-generation
- [ ] AI insights: detect underused templates, low scores, content gaps

---

## 10. Component Architecture

### 10.1 Component Tree

```
TemplateLibraryPage
├── LibraryHeader
│   ├── TabBar (Templates | Assets | Analytics)
│   └── ViewSwitcher (Grid | List | Board)
├── TemplateTab
│   ├── TemplateToolbar
│   │   ├── SearchBar (full-text + filters)
│   │   ├── FilterDropdowns (type, category, channel, status)
│   │   ├── SortDropdown (usage, score, date, name)
│   │   ├── QuickViews (Favorites, Recent, My Templates, System)
│   │   └── NewTemplateButton
│   ├── TemplateGrid (virtual scrolling)
│   │   └── TemplateCard[] 
│   │       ├── TypeIcon
│   │       ├── Thumbnail
│   │       ├── Name + Description
│   │       ├── ScoreBadge
│   │       ├── UsageCount
│   │       ├── StarToggle
│   │       ├── MoreMenu (duplicate, archive, export, lock)
│   │       └── UseButton
│   ├── TemplateList (table view)
│   │   └── TemplateListRow[]
│   └── TemplateBoard (kanban view)
│       └── BoardColumn[type]
│           └── TemplateCard[]
├── AssetTab
│   ├── AssetSidebar
│   │   ├── FolderTree
│   │   │   └── FolderNode[] (recursive)
│   │   └── SmartFolders (Recent, Unused, By Product, By Campaign)
│   ├── AssetToolbar
│   │   ├── SearchBar
│   │   ├── TagFilter
│   │   ├── UploadButton
│   │   └── ViewSwitcher (Grid | List)
│   ├── UploadZone (drag-and-drop area)
│   │   └── UploadProgress[] (per file)
│   └── AssetGrid (virtual scrolling)
│       └── AssetCard[]
│           ├── Thumbnail (image preview / type icon)
│           ├── Name + FileSize
│           ├── Tags
│           └── ActionOverlay (on hover: preview, edit, download, delete)
├── AnalyticsTab
│   ├── TemplateHealthCards (top performers, underutilized, low quality)
│   ├── TemplateRanking (sorted by usage × score)
│   └── TemplateDetailAnalytics (on card click)
│       ├── UsageChart (line chart over time)
│       ├── ScoreChart (avg content score over time)
│       ├── ConversionRate
│       └── RecentUses[] (content assets created from this template)
├── TemplatePreviewModal
│   ├── BlockRenderer (renders template content blocks)
│   ├── VariableHighlight (yellow pills)
│   └── UseTemplateButton
├── TemplateUseModal
│   ├── VariableForm
│   │   └── VariableInput[] (text/date/dropdown per variable type)
│   ├── AIAutoFillButton
│   ├── TemplatePreview (with filled variables)
│   ├── GenerateVariantsButton
│   └── ManualEditButton
├── VariantSelectionModal
│   ├── VariantCard[] (3 cards)
│   │   ├── Tone (Professional/Conversational/Data-driven)
│   │   ├── ScoreBadge
│   │   ├── Preview (first 5 lines)
│   │   ├── FullPreviewButton
│   │   └── SelectButton
│   ├── RegenerateButton
│   └── ContinueButton
├── TemplateEditor
│   ├── EditorToolbar (formatting + block type insertion)
│   ├── BlockEditor
│   │   └── Block[] (paragraph, heading, list, image, variable, etc.)
│   ├── SlashCommandMenu (floating, filtered by input)
│   ├── VariablePopover (on variable click)
│   └── AISuggestionInline (on AI block)
├── BrandScorePanel
│   ├── OverallScore (number + progress bar)
│   ├── RadarChart (5 dimensions)
│   ├── CriterionDetail[] (score + explanation + suggestion + Fix button)
│   └── RecheckButton
├── TemplateVersionPanel
│   ├── VersionList
│   │   └── VersionItem[] (number, editor, timestamp, summary)
│   ├── VersionPreview (render blocks at that version)
│   ├── RestoreButton
│   └── DiffView (side-by-side comparison)
├── TemplateComments
│   ├── CommentThread[]
│   │   ├── Comment (content, author, timestamp, mentions)
│   │   ├── ReplyButton
│   │   └── ResolveButton
│   └── NewCommentForm (with @mention autocomplete)
├── AssetPreviewModal (lightbox)
│   ├── ImageZoomPan
│   ├── VideoPlayer
│   ├── AudioPlayer
│   └── MetadataPanel (name, size, dimensions, tags, alt text)
└── AssetUploadProgress
    └── FileProgressItem[] (name, progress bar, status, cancel)
```

### 10.2 Key Component Interfaces

```typescript
// Template Card
interface TemplateCardProps {
  template: Template;
  onView: (id: string) => void;
  onUse: (id: string) => void;
  onStar: (id: string) => void;
  onDragStart: (template: Template) => void;
  isSelected: boolean;
  isDragging?: boolean;
}

// Template data model
interface Template {
  id: string;
  name: string;
  type: TemplateType;
  category: string | null;
  description: string | null;
  content: ContentBlock[];
  variables: TemplateVariable[];
  thumbnail_url: string | null;
  is_system: boolean;
  is_locked: boolean;
  usage_count: number;
  avg_content_score: number;
  status: 'draft' | 'in_review' | 'active' | 'archived';
  sharing_mode: 'private' | 'team' | 'shared' | 'system';
  tags: string[];
  channel: string | null;
  version: number;
  created_by: string;
  updated_at: string;
}

// Block-based content
type ContentBlock = 
  | { type: 'paragraph'; content: InlineContent[] }
  | { type: 'heading'; level: 1|2|3; content: InlineContent[] }
  | { type: 'bullet_list'; items: InlineContent[][] }
  | { type: 'numbered_list'; items: InlineContent[][] }
  | { type: 'todo_list'; items: { content: InlineContent[]; checked: boolean }[] }
  | { type: 'quote'; content: InlineContent[] }
  | { type: 'code'; language: string; content: string }
  | { type: 'callout'; icon: string; color: string; content: InlineContent[] }
  | { type: 'divider' }
  | { type: 'image'; url: string; alt: string; caption?: string; width?: number }
  | { type: 'variable'; name: string; defaultValue?: string }
  | { type: 'ai_block'; prompt: string; result?: string; status: 'pending'|'done'|'error' }
  | { type: 'embed'; url: string; provider: string }
  | { type: 'table'; rows: InlineContent[][]; columns: number }
  | { type: 'toggle'; title: string; children: ContentBlock[] };

type InlineContent = 
  | { type: 'text'; text: string; bold?: boolean; italic?: boolean; underline?: boolean; strikethrough?: boolean; code?: boolean; link?: string }
  | { type: 'variable'; name: string; display: string };

// Template variable
interface TemplateVariable {
  name: string;
  type: 'text' | 'date' | 'number' | 'email' | 'url' | 'enum';
  required: boolean;
  default?: string;
  options?: string[]; // for enum type
  description?: string;
}

// AI variant
interface AIVariant {
  content: ContentBlock[];
  tone: 'professional' | 'conversational' | 'data_driven';
  score: number;
  word_count: number;
}

// Brand score
interface BrandScore {
  overall: number;
  breakdown: {
    criterion: 'voice' | 'structure' | 'length' | 'variables' | 'actionability';
    score: number;
    weight: number;
    explanation: string;
    suggestion: string | null;
  }[];
}

// Asset
interface Asset {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video' | 'audio' | 'design';
  file_url: string;
  thumbnail_url: string | null;
  file_size: number;
  mime_type: string;
  dimensions: { width: number; height: number } | null;
  duration: number | null;
  folder_id: string | null;
  tags: string[];
  alt_text: string | null;
  usage_count: number;
  created_at: string;
}

// Template analytics
interface TemplateAnalytics {
  template_id: string;
  usage_count: number;
  last_used: string | null;
  avg_content_score: number;
  avg_time_to_publish: number; // minutes
  conversion_rate: number; // 0-1
  performance_score: number; // 0-100
  health: 'high_performer' | 'underutilized' | 'low_quality' | 'star';
  recent_uses: {
    asset_id: string;
    asset_name: string;
    created_at: string;
    content_score: number;
    published: boolean;
  }[];
}
```

---

## Appendix: Gap from v1.0

| Existing Ticket | Coverage in Expanded Spec |
|----------------|--------------------------|
| TICKET-021 (List View) | TPL-002, TPL-003, TPL-004 (Grid + List + Board, Supabase-backed) |
| TICKET-022 (Preview Modal) | TPL-008 (expanded with block rendering + variable highlight) |
| TICKET-023 (Create/Edit) | TPL-009, TPL-010, TPL-011, TPL-013, TPL-014 (block editor + slash commands + variables) |
| TICKET-024 (AI Generation) | TPL-016, TPL-017 (3 variants, brand voice, per-channel formatting) |
| TICKET-025 (Versioning) | TPL-032 (expanded with diff view, branching, auto-save) |
| TICKET-026 (Tagging & Search) | TPL-005, TPL-019, TPL-042 (full-text search + tag cloud + smart folders) |
| TICKET-027 (Duplicate) | TPL-064 |
| TICKET-028 (Delete) | TPL-065 (archive/restore, soft delete) |
| TICKET-029 (Import) | TPL-051, TPL-052 (MD + JSON + DOCX + HTML) |
| TICKET-030 (Export) | TPL-053, TPL-054 (MD + JSON + DOCX + PDF + bulk ZIP) |

**New capabilities (not in v1.0):**
- Block-based rich editor (Notion-style)
- AI brand consistency scoring (5 dimensions)
- Full media asset library (images, video, audio, documents)
- Folder organization + smart folders
- Drag-to-calendar from template
- Drag assets into editor
- Template analytics (usage, score, conversion)
- Template sharing modes + approval workflow
- Template comments (@mentions, threaded)
- Bulk operations (create, tag, move, export)
- Virtual scrolling for large libraries
- Realtime collaboration indicators
- Keyboard shortcuts + command palette
- Responsive design
- Accessibility
- 6 new Supabase tables
- 4 AI personas
- 33 API endpoints
