# WAVE Phase 2 — Repurposing Engine

**Duration**: ~25 hours
**Batches**: 3
**Prerequisites**: Phase 1 complete (content_pieces + campaigns tables exist)
**Goal**: Build AI-powered content repurposing with DeepSeek integration, job tracking, and chain visualization

---

## Batch 2.1: Repurposing Infrastructure (8h)

### T-2.1.1: Create `repurposing_jobs` + `ai_jobs` tables [1.5h]
**Priority**: CRITICAL
**File**: `supabase/migrations/007_create_repurposing_tables.sql`

**Task**:
Create `repurposing_jobs` (spec §2.6) and `ai_jobs` (spec §2.9) tables with all columns, constraints, and indexes.

**Acceptance Criteria**:
- Both tables created and queryable
- CHECK constraints enforced
- FK references valid

---

### T-2.1.2: Repurposing API routes [2.5h]
**Priority**: CRITICAL
**Files**:
- `src/app/api/repurposing/route.ts` — GET list, POST create
- `src/app/api/repurposing/[id]/route.ts` — PATCH update
- `src/app/api/repurposing/batch/route.ts` — POST batch create
- `src/app/api/repurposing/chains/[source_id]/route.ts` — GET chain view

**Task**:
Implement all repurposing endpoints per `02_API_ROUTES.md` §4.

**Acceptance Criteria**:
- Can create single and batch repurposing jobs
- Can list jobs with filters (status, source, format)
- Can update job status and checklist
- Chain view returns full source→output tree

---

### T-2.1.3: DeepSeek integration utility [2h]
**Priority**: CRITICAL
**File**: `src/lib/deepseek/client.ts`

**Task**:
Create DeepSeek API client module:
```typescript
interface DeepSeekConfig {
  apiKey: string
  model: 'deepseek-chat' | 'deepseek-reasoner'  // flash/pro
  temperature?: number
  max_tokens?: number
}

async function callDeepSeek(
  prompt: string,
  systemPrompt?: string,
  config?: Partial<DeepSeekConfig>
): Promise<{
  content: string
  tokens_input: number
  tokens_output: number
  cost_cny: number
}>
```

Include:
- Retry logic (3 attempts with exponential backoff)
- Token counting
- Cost calculation (flash: ¥1/M tokens, pro: ¥4/M tokens)
- Error handling with meaningful messages
- Request timeout (60s)

**Environment Variables**:
- `DEEPSEEK_API_KEY` — stored in Vercel env vars

**Acceptance Criteria**:
- Can successfully call DeepSeek API
- Returns content + token usage + cost
- Retry logic works on transient failures
- Errors handled gracefully

---

### T-2.1.4: Repurposing prompt templates [2h]
**Priority**: HIGH
**File**: `src/lib/deepseek/prompts.ts`

**Task**:
Create prompt template library for each transformation type:

```typescript
const PROMPT_TEMPLATES: Record<TargetFormat, PromptTemplate> = {
  blog_post: {
    system: "You are a professional content writer...",
    template: "Transform the following {source_type} into a blog post...",
    variables: ['source_type', 'source_title', 'source_content', 'target_audience', 'tone']
  },
  linkedin_post: { ... },
  email_sequence: { ... },
  case_study: { ... },
  // ... all formats from spec
}
```

Each template must:
- Include system prompt for role/context
- Have parameterized variables
- Include output format instructions (markdown, word count, structure)
- Handle edge cases (missing content, too-short source)

**Acceptance Criteria**:
- All 14 target formats have prompt templates
- Templates produce well-structured output
- Variables properly interpolated

---

## Batch 2.2: Repurposing UI (10h)

### T-2.2.1: Repurposing page — server component [1.5h]
**Priority**: HIGH
**File**: `src/app/dashboard/repurposing/page.tsx`

**Task**:
Rewrite repurposing page server component:
1. Fetch repurposing jobs from Supabase
2. Fetch content pieces for source selection
3. Pass data to client component

**Acceptance Criteria**:
- Real data loaded from Supabase
- Error handling for fetch failures

---

### T-2.2.2: Repurposing page — client component [4h]
**Priority**: HIGH
**File**: `src/app/dashboard/repurposing/CampaignsClient.tsx` → rename to `RepurposingClient.tsx`

**Task**:
Build repurposing engine UI:

1. **Job queue view**: Table of all repurposing jobs with status badges
   - Columns: Source Content, Target Format, Status, Priority, AI Model, Created, Actions
   - Status badges: queued (gray), processing (blue), review (yellow), approved (green), published (purple), failed (red)

2. **Create job dialog**:
   - Source content selector (dropdown with search)
   - Target format selector (checkboxes, can select multiple)
   - Priority selector
   - AI model selector (flash/pro)
   - Optional notes/instructions
   - "Create Job(s)" button

3. **Batch create**: Select one source → multiple target formats → creates all jobs at once

4. **Job detail panel** (slide-out):
   - Source content preview
   - AI output preview (when available)
   - Checklist with checkboxes
   - Approve/Reject buttons
   - Publish button (creates output content_piece)

5. **Filter bar**: Status filter, format filter, source filter

**Acceptance Criteria**:
- Can create single and batch repurposing jobs
- Job queue shows real-time status
- Can view job details
- Checklist interactive
- Approve/reject workflow functional

---

### T-2.2.3: AI execution endpoint [2.5h]
**Priority**: CRITICAL
**File**: `src/app/api/repurposing/[id]/execute/route.ts`

**Task**:
Implement AI execution trigger:
1. Load job from DB
2. Load source content
3. Select appropriate prompt template
4. Call DeepSeek API
5. Store response in job record
6. Update token usage and cost
7. Update job status to 'review'

**Error Handling**:
- DeepSeek API failure → status = 'failed', store error
- Content not found → 404
- Invalid job status → 400

**Acceptance Criteria**:
- Clicking "Generate" triggers DeepSeek call
- Output stored in job record
- Status transitions: queued → processing → review
- Failed jobs show error message
- Token usage and cost recorded

---

### T-2.2.4: Publish endpoint [2h]
**Priority**: HIGH
**File**: `src/app/api/repurposing/[id]/publish/route.ts`

**Task**:
Implement publish flow:
1. Verify job status is 'approved'
2. Create new `content_pieces` record with:
   - `parent_content_id` = source content
   - `repurposing_job_id` = current job
   - `source` = 'repurposed'
   - Content from AI output
3. Update job: `output_content_id` = new content piece, status = 'published'

**Acceptance Criteria**:
- Publishing creates content_piece in DB
- Content piece linked back to source and job
- Job status updated to 'published'
- Can only publish approved jobs

---

## Batch 2.3: Chain Visualization + Polish (7h)

### T-2.3.1: Repurposing chain view [3h]
**Priority**: HIGH
**File**: `src/app/dashboard/repurposing/ChainView.tsx` (new component)

**Task**:
Build visual repurposing chain display:
- Source content at the top/left
- Branching lines to each derivative
- Each derivative shows format, status, creation date
- Click to navigate to derivative content
- Visual indicators: completed (green), in-progress (blue), queued (gray), failed (red)

**Design**:
```
[Webinar: AI Leadership]
    ├── ✅ Blog Post (published 2026-07-15)
    ├── ✅ LinkedIn Post (published 2026-07-16)
    ├── 🔄 Email Sequence (in review)
    └── ⏳ Case Study (queued)
```

**Acceptance Criteria**:
- Visual chain renders correctly
- Status indicators accurate
- Clickable to navigate
- Empty states for content with no derivatives

---

### T-2.3.2: Content Hub — add repurposing actions [1.5h]
**Priority**: MEDIUM
**Files**: `src/app/dashboard/content/ContentClient.tsx`

**Task**:
Add "Repurpose" button to each content piece in the Content Hub. Clicking opens the create repurposing job dialog pre-filled with the selected source.

Also add repurposing count badge showing how many derivatives exist.

**Acceptance Criteria**:
- "Repurpose" button visible on each content piece
- Clicking opens pre-filled job creation dialog
- Repurposing count shows correctly
- Links to chain view

---

### T-2.3.3: Agent Bridge — AI jobs view [2.5h]
**Priority**: MEDIUM
**Files**:
- `src/app/api/agents/jobs/route.ts`
- `src/app/api/agents/stats/route.ts`
- `src/app/dashboard/agents/page.tsx` (rewrite)

**Task**:
Rewrite Agent Bridge to show:
1. All AI jobs (not just repurposing) with status
2. Token usage dashboard (total tokens, cost, by model)
3. Job queue with retry/stop controls
4. Success/failure rate
5. Model comparison (flash vs pro usage)

**Acceptance Criteria**:
- Shows all AI jobs from `ai_jobs` table
- Token/cost stats calculated correctly
- Can retry failed jobs
- Can cancel queued jobs

---

## Batch 2 Summary

| Metric | Value |
|--------|-------|
| Total tickets | 14 |
| New tables | 2 (repurposing_jobs, ai_jobs) |
| New API routes | 7 |
| New components | 3 (RepurposingClient, ChainView, Agent Bridge rewrite) |
| DeepSeek integration | Full (client + prompts + execution) |
| Estimated hours | 25h |

### Post-Batch 2 State
- ✅ Full repurposing engine operational
- ✅ DeepSeek AI integration working
- ✅ Chain visualization functional
- ✅ AI jobs tracked and monitored
- 🔄 Remaining: Distribution rewrite, Inbound tracker, Templates, Analytics, Polish

---

*Document generated: 2026-07-20 | Author: NEXUS Agent*
