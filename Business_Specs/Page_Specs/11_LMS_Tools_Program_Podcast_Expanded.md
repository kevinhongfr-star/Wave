# WAVE Business Spec — Phase Gaps: LMS, Tools, Program Delivery, Podcast (EXPANDED)

**Version:** 1.0 | **Date:** 2026-07-16 | **Author:** NEXUS
**For:** Trae (Engineering)
**Derived from:** CD_vs_Tickets_Cross_Reference.md (14 CD files vs 733 tickets analysis)
**Tickets:** LMS-001 to LMS-018, TOOL-001 to TOOL-004, PROG-001 to PROG-008, POD-001 to POD-006, NOTION-016 to NOTION-017 (38 new tickets, ~130h)
**Depends on:** Module 5 (Journey Engine), Module 7 (Events), Module 9 (Product Catalog), Notion Integration

---

## Build Plan Overview

**3 Phases — 7 Batches — 38 Tickets — ~130h**

| Phase | Priority | Batches | Tickets | Hours | Gate |
|-------|----------|---------|---------|-------|------|
| Phase 1 | P0 — Launch Blockers | 1A, 1B, 1C | 12 | 56h | B2C courses sellable, ROI calculator usable on calls |
| Phase 2 | P1 — Feature Complete | 2A, 2B, 2C, 2D | 16 | 44h | Programs manageable, full LMS analytics |
| Phase 3 | P2 — Ecosystem Expansion | 3A, 3B | 10 | 30h | Podcast engine running, program certificates |

---

## PHASE 1 — LAUNCH BLOCKERS (P0) — 56h

### Batch 1A: LMS Core Foundation (LMS-001 to LMS-009) — 45h

**Why P0:** CD-13 defines 4 complete B2C courses (Governance Health Check, Cross-Border Intelligence, Career Resilience, AI Leadership Readiness) at $199-$299 each. Module 5 (Journey Engine) handles marketing automation but has zero LMS features. Without these 9 tickets, B2C courses cannot be delivered.

**CD-13 Course Specs (for reference):**

| Course | Duration | Price | Companion Diagnostic | Lessons |
|--------|----------|-------|---------------------|---------|
| Governance Health Check | 4 weeks, 3-4h total | $299 / $999 team(5) | BRIDGE (20% discount) | 4 lessons |
| Cross-Border Intelligence | 3 weeks, 2-3h total | $199 / $699 team(5) | MOSAIC (15% discount) | 3 lessons |
| Career Resilience | 3 weeks, 2-3h total | $249 / $849 team(5) | SPARK (15% discount) | 3 lessons |
| AI Leadership Readiness | 4 weeks, 3-4h total | $299 / $999 team(5) | SPARK (20% discount) | 4 lessons |

**Each lesson contains:** Video Script (15 min), Reading Material (1000-2000 words), Exercise/Worksheet (fillable), Quiz (5-10 questions with answer key)

---

#### LMS-001 | Course Catalog Schema & API
**Module:** LMS / Module 9 (Product Catalog) | **Priority:** P0 | **Est:** 4h

**What:** Create the database schema for courses, lessons, and enrollments. Link to product catalog.

**SQL:**
```sql
-- Course table
CREATE TABLE lms_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT, -- rich text / block content
  status TEXT NOT NULL DEFAULT 'draft', -- draft, published, archived
  price_cny DECIMAL(10,2) NOT NULL,
  team_price_cny DECIMAL(10,2),
  team_max_seats INTEGER DEFAULT 5,
  duration_weeks INTEGER,
  estimated_hours FLOAT,
  companion_diagnostic TEXT, -- 'SPARK', 'BRIDGE', 'MOSAIC'
  diagnostic_discount_pct INTEGER DEFAULT 0,
  prerequisite_course_id UUID REFERENCES lms_courses(id),
  cover_image_url TEXT,
  notion_page_id TEXT, -- deep link to Notion source content
  cd_reference TEXT, -- e.g., 'CD-13 Chat 1'
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lesson table
CREATE TABLE lms_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER,
  video_url TEXT, -- Supabase Storage or external
  video_duration_seconds INTEGER,
  reading_content TEXT, -- markdown / rich text
  reading_word_count INTEGER,
  exercise_content TEXT, -- markdown / rich text (fillable worksheet)
  quiz_id UUID, -- FK to lms_quizzes
  status TEXT NOT NULL DEFAULT 'draft', -- draft, published, archived
  notion_page_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollment table
CREATE TABLE lms_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES lms_courses(id),
  contact_id UUID NOT NULL REFERENCES contacts(id),
  enrollment_type TEXT NOT NULL DEFAULT 'individual', -- individual, team
  team_id UUID, -- if team enrollment
  status TEXT NOT NULL DEFAULT 'active', -- active, completed, cancelled, expired
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  discount_code_id UUID,
  payment_id UUID, -- link to payment record
  diagnostic_discount_code TEXT, -- generated on completion
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, contact_id)
);

-- Lesson progress table
CREATE TABLE lms_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES lms_enrollments(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lms_lessons(id),
  video_watched BOOLEAN DEFAULT FALSE,
  video_last_position_seconds INTEGER DEFAULT 0,
  reading_viewed BOOLEAN DEFAULT FALSE,
  exercise_completed BOOLEAN DEFAULT FALSE,
  exercise_submission TEXT, -- JSON or text
  quiz_attempted BOOLEAN DEFAULT FALSE,
  quiz_score DECIMAL(5,2),
  quiz_attempts INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(enrollment_id, lesson_id)
);

-- Indexes
CREATE INDEX idx_lms_courses_status ON lms_courses(status);
CREATE INDEX idx_lms_courses_slug ON lms_courses(slug);
CREATE INDEX idx_lms_lessons_course ON lms_lessons(course_id, sort_order);
CREATE INDEX idx_lms_enrollments_contact ON lms_enrollments(contact_id);
CREATE INDEX idx_lms_enrollments_course ON lms_enrollments(course_id);
CREATE INDEX idx_lms_progress_enrollment ON lms_lesson_progress(enrollment_id);
```

**Acceptance:**
- All 5 tables created with correct FK relationships
- `slug` unique on courses for public URL routing
- `UNIQUE(course_id, contact_id)` prevents double enrollment
- Indexes on all foreign keys and status fields
- RLS: contacts can SELECT own enrollments/progress, authenticated users can SELECT courses/lessons, service role full access

---

#### LMS-002 | Course Enrollment & Payment Flow
**Module:** LMS / Module 9 | **Priority:** P0 | **Est:** 6h

**What:** Enrollment page + payment integration for B2C courses. Individual and team enrollment.

**Requirements:**
- Public course detail page at `/courses/{slug}` — shows title, description, duration, price, lesson list, companion diagnostic info
- "Enroll Now" button → payment flow (Stripe CNY + WeChat Pay, reuse EVT payment infrastructure)
- Team enrollment: enter N emails (up to team_max_seats), pay team_price, each member gets individual enrollment
- Payment success → auto-create enrollment record, send confirmation email, trigger welcome journey
- Diagnostic discount code: auto-generate unique code on enrollment (companion diagnostic, discount_pct from course record)
- Apply discount code at checkout if user has one (from previous course completion)

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────┐
│ Course: Governance Health Check                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────┐  ┌──────────────────────────┐ │
│  │ [Cover Image]               │  │ $299 individual          │ │
│  │                             │  │ $999 team (up to 5)      │ │
│  │ 4 weeks · 3-4 hours         │  │                          │ │
│  │ Self-paced · Online         │  │ [Enroll Individual]      │ │
│  │                             │  │ [Enroll Team]            │ │
│  │ Companion: BRIDGE diagnostic│  │                          │ │
│  │ 20% discount on completion  │  │ Have a discount code?    │ │
│  │                             │  │ [Apply Code ▁▁▁▁]        │ │
│  └─────────────────────────────┘  └──────────────────────────┘ │
│                                                                  │
│  ┌─ CURRICULUM ──────────────────────────────────────────────┐ │
│  │ Lesson 1: What Is Governance Architecture?    30 min  ▶   │ │
│  │ Lesson 2: The 5 Forces Reshaping Governance   45 min  🔒  │ │
│  │ Lesson 3: Diagnosing Your Governance Gaps     40 min  🔒  │ │
│  │ Lesson 4: Building Your Improvement Plan      35 min  🔒  │ │
│  │                                                           │ │
│  │ Total: ~2.5 hours of content + exercises                  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─ COMPLETION OUTCOMES ─────────────────────────────────────┐ │
│  │ ✓ Governance self-assessment score                         │ │
│  │ ✓ 1-page improvement plan                                 │ │
│  │ ✓ Certificate of completion                                │ │
│  │ ✓ 20% discount code for BRIDGE diagnostic                  │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Acceptance:**
- Public course page renders with all metadata
- Payment flow completes (Stripe + WeChat Pay)
- Enrollment record created on payment success
- Team enrollment creates N individual enrollment records
- Confirmation email sent (reuse DIST email templates)
- Discount code generated and stored in enrollment record
- Welcome journey triggered (via JOUR engine webhook)

---

#### LMS-003 | Lesson Player — Video + Reading Tabs
**Module:** LMS | **Priority:** P0 | **Est:** 6h

**What:** The core learning interface. Each lesson has a video tab and a reading tab. Video player with progress tracking. Reading content rendered from markdown/rich text.

**Requirements:**
- Lesson player URL: `/courses/{slug}/lessons/{lesson_id}`
- Tab layout: [Video] [Reading] [Exercise] [Quiz] — tabs only shown if content exists
- Video player: HTML5 video (or embedded player for external URLs), tracks watch position to Supabase every 10 seconds
- Video completion: mark `video_watched = true` when 90%+ watched
- Reading tab: render markdown content with proper formatting (headers, lists, tables, blockquotes)
- Reading completion: mark `reading_viewed = true` when scrolled to bottom (or manually "Mark as Read" button)
- Progress auto-saves to `lms_lesson_progress` table
- Navigation: "Previous Lesson" / "Next Lesson" buttons, sidebar with all lessons + completion status
- Only enrolled contacts can access lesson content (403 for non-enrolled)

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Course                                    Lesson 2/4  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ ┌─ SIDEBAR ─┐  ┌─ LESSON CONTENT ────────────────────────────┐ │
│ │            │  │                                              │ │
│ │ ✅ L1: Gov │  │  [Video] [Reading] [Exercise] [Quiz]        │ │
│ │    Arch.   │  │  ──────────────────────────────────────────  │ │
│ │            │  │                                              │ │
│ │ ▶ L2: The  │  │  ┌──────────────────────────────────────┐   │ │
│ │    5 Forces│  │  │                                      │   │ │
│ │            │  │  │         VIDEO PLAYER                  │   │ │
│ │ 🔒 L3:     │  │  │         (HTML5 / embed)               │   │ │
│ │    Diagnosing│ │  │                                      │   │ │
│ │            │  │  │   Progress: ████████░░ 78%            │   │ │
│ │ 🔒 L4:     │  │  │                                      │   │ │
│ │    Plan    │  │  └──────────────────────────────────────┘   │ │
│ │            │  │                                              │ │
│ │ ─────────  │  │  Duration: 45 min | Watched: 35 min        │ │
│ │ Your       │  │                                              │ │
│ │ Progress:  │  │  [Mark Video as Watched]                    │ │
│ │ 25%        │  │                                              │ │
│ └────────────┘  └──────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Acceptance:**
- Video player loads and plays, progress tracked
- Reading content renders correctly from markdown
- Tab switching preserves scroll/video position
- Progress saves to Supabase in real-time
- Sidebar shows completion status for all lessons
- Non-enrolled users get 403

---

#### LMS-004 | Exercise/Worksheet Viewer (Fillable)
**Module:** LMS | **Priority:** P0 | **Est:** 5h

**What:** Fillable exercise/worksheet interface. Each lesson may have an exercise — fill-in activities, reflection prompts, self-assessment tools.

**Requirements:**
- Exercise tab in lesson player shows fillable content
- Exercise types: text input fields, textarea (long-form reflection), checkboxes (self-assessment), radio buttons (single choice), number inputs (scoring)
- Exercises stored as structured JSON in `exercise_content` field
- Auto-save: user input saved every 30 seconds to `exercise_submission` in `lms_lesson_progress`
- "Mark as Complete" button → sets `exercise_completed = true`
- Exercises can be revisited and edited after completion
- Print/export: "Download PDF" button generates a PDF of the blank worksheet (for offline use)

**Exercise Content JSON Structure:**
```json
{
  "sections": [
    {
      "title": "Governance Structure Audit",
      "instructions": "Rate your organization on each dimension (1-5):",
      "fields": [
        {"id": "q1", "type": "rating", "label": "Decision clarity — who decides what is documented", "min": 1, "max": 5},
        {"id": "q2", "type": "rating", "label": "Information quality — decision-makers have the data they need", "min": 1, "max": 5},
        {"id": "q3", "type": "textarea", "label": "Describe your biggest governance gap:"}
      ]
    },
    {
      "title": "90-Day Action Plan",
      "instructions": "Identify one governance improvement and plan your next steps:",
      "fields": [
        {"id": "action1", "type": "text", "label": "What will you change?"},
        {"id": "deadline", "type": "text", "label": "By when?"},
        {"id": "owner", "type": "text", "label": "Who owns it?"}
      ]
    }
  ]
}
```

**Acceptance:**
- Exercise renders from JSON schema
- All field types functional (rating, textarea, text, checkbox, radio, number)
- Auto-save works (30-second interval)
- Completion state persisted
- PDF export generates clean worksheet

---

#### LMS-005 | Quiz Engine
**Module:** LMS | **Priority:** P0 | **Est:** 5h

**What:** Quiz/assessment at the end of each lesson. Multiple choice + short answer questions with answer key validation.

**Requirements:**
- Quiz tab shows questions sequentially or all-at-once (configurable per quiz)
- Question types: `multiple_choice` (single correct), `multi_select` (multiple correct), `short_answer` (text match against answer key), `true_false`
- Answer key stored in `lms_quizzes` table (service role only — not exposed to client)
- On submit: compare answers against key, calculate score (%), store in `quiz_score`
- Multiple attempts allowed — track `quiz_attempts` count, keep highest score
- After submission: show score, show correct answers with explanations, option to retry
- Passing threshold configurable per course (default 70%)
- On passing: mark `quiz_attempted = true` + store score

**Quiz Schema:**
```sql
CREATE TABLE lms_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lms_lessons(id),
  title TEXT,
  passing_score DECIMAL(5,2) DEFAULT 70.00,
  max_attempts INTEGER DEFAULT 3,
  questions JSONB NOT NULL, -- array of question objects
  answer_key JSONB NOT NULL, -- encrypted/service-role only
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Question object structure:
-- {
--   "id": "q1",
--   "type": "multiple_choice",
--   "question": "Which is NOT one of the 5 traits of effective governance?",
--   "options": ["Decision clarity", "Information quality", "Revenue growth", "Board alignment"],
--   "correct": 2,
--   "explanation": "Revenue growth is a business outcome, not a governance trait."
-- }
```

**Acceptance:**
- Quiz renders questions correctly
- Submission calculates score accurately
- Multiple attempts tracked
- Passing threshold enforced
- Answer key never exposed to client-side
- Score persisted in `lms_lesson_progress`

---

#### LMS-006 | Progress Tracking & Course Completion
**Module:** LMS | **Priority:** P0 | **Est:** 4h

**What:** Track per-lesson and per-course progress. Generate completion when all lessons are done.

**Requirements:**
- Course progress % = (completed lessons / total lessons) × 100
- Lesson "completed" = video watched + reading viewed + exercise completed + quiz passed (whichever apply)
- When progress reaches 100%:
  - Set enrollment `status = 'completed'`, `completed_at = NOW()`
  - Generate diagnostic discount code (if companion_diagnostic configured)
  - Trigger completion webhook (for Journey Engine)
  - Send completion email
  - Generate certificate (LMS-007 handles the PDF)
- Student dashboard: shows all enrolled courses with progress bars
- Progress data feeds analytics (LMS-018)

**Acceptance:**
- Progress updates in real-time as user completes lesson components
- 100% completion triggers all downstream actions
- Diagnostic discount code auto-generated (format: `{DIAG_TYPE}-{ENROLLMENT_ID_SHORT}`)
- Completion email sent via Distribution Engine
- Student dashboard shows accurate progress across all courses

---

#### LMS-007 | Certificate Generation
**Module:** LMS | **Priority:** P0 | **Est:** 4h

**What:** Auto-generate branded PDF certificate on course completion.

**Requirements:**
- Certificate template: LYC branding, course title, participant name, completion date, unique certificate ID
- Generate PDF using server-side rendering (Puppeteer or similar)
- Store certificate URL in enrollment record
- Email certificate to participant on completion
- Certificate verifiable: unique URL `/certificates/{certificate_id}` shows verification page
- Certificate content: "This certifies that {name} has completed {course_title} on {date}"

**Certificate Schema Addition:**
```sql
ALTER TABLE lms_enrollments ADD COLUMN certificate_id TEXT;
ALTER TABLE lms_enrollments ADD COLUMN certificate_url TEXT;

CREATE TABLE lms_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES lms_enrollments(id),
  certificate_code TEXT UNIQUE NOT NULL, -- human-readable verification code
  participant_name TEXT NOT NULL,
  course_title TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE
);
```

**Acceptance:**
- PDF generated on course completion
- Certificate contains correct participant name, course, date
- Verification page accessible via public URL
- Certificate code unique and verifiable
- PDF emailed to participant

---

#### LMS-008 | Student Dashboard
**Module:** LMS | **Priority:** P0 | **Est:** 5h

**What:** "My Courses" page — enrolled courses, progress, certificates, diagnostic discounts.

**Requirements:**
- Route: `/my-courses` (authenticated)
- Show all enrolled courses with: title, progress %, status, enrolled date
- Active courses: "Continue Learning" button → last viewed lesson
- Completed courses: "View Certificate" button, diagnostic discount code (if applicable)
- Course cards show: cover image, title, progress bar, next lesson title, time remaining
- Empty state: "No courses yet" + link to course catalog
- Mobile responsive

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────┐
│ My Courses                                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ IN PROGRESS ─────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │ [IMG]  Governance Health Check                      │  │ │
│  │  │        Lesson 2/4 · The 5 Forces                    │  │ │
│  │  │        ████████░░░░░░░░ 38%                         │  │ │
│  │  │        [Continue Learning →]                        │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─ COMPLETED ───────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │ [IMG]  Career Resilience              Completed Jul 10│  │ │
│  │  │        ████████████████ 100%                         │  │ │
│  │  │        [View Certificate]  [BRIDGE Code: SPK-8f3a]   │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─ AVAILABLE ───────────────────────────────────────────────┐ │
│  │  Explore more courses →                                   │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Acceptance:**
- Dashboard shows all enrolled courses grouped by status
- Progress bars accurate and real-time
- "Continue Learning" goes to last viewed lesson
- Certificates and discount codes accessible for completed courses
- Mobile responsive

---

#### LMS-009 | Course Catalog Page (Public)
**Module:** LMS | **Priority:** P0 | **Est:** 6h

**What:** Public-facing course listing page. The "storefront" for B2C courses.

**Requirements:**
- Route: `/courses` (public, no auth required)
- Grid/list view of all published courses
- Each course card: cover image, title, duration, price, short description, "Learn More" button
- Course detail page: full description, curriculum outline, completion outcomes, pricing, "Enroll Now" button
- Filter/sort: by duration, price, diagnostic companion
- SEO: proper meta tags, structured data for course schema
- Mobile responsive
- Integration with product catalog (CAT module) for pricing consistency

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────┐
│ LYC B2C Academy — Where Leadership Intelligence Meets Results   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [All] [Governance] [Cross-Border] [Career] [AI]               │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ [Cover]      │  │ [Cover]      │  │ [Cover]      │         │
│  │              │  │              │  │              │         │
│  │ Governance   │  │ Cross-Border │  │ Career       │         │
│  │ Health Check │  │ Intelligence │  │ Resilience   │         │
│  │              │  │              │  │              │         │
│  │ 4 wks · $299│  │ 3 wks · $199│  │ 3 wks · $249│         │
│  │              │  │              │  │              │         │
│  │ Companion:   │  │ Companion:   │  │ Companion:   │         │
│  │ BRIDGE (-20%)│  │ MOSAIC (-15%)│  │ SPARK (-15%) │         │
│  │              │  │              │  │              │         │
│  │ [Learn More] │  │ [Learn More] │  │ [Learn More] │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Acceptance:**
- All published courses displayed
- Course detail page shows full content
- Enrollment flow starts from catalog
- Mobile responsive
- SEO meta tags present
- Loading time < 2 seconds

---

### Batch 1B: Sales Tools Core (TOOL-001 to TOOL-002) — 8h

**Why P0:** CD-2 defines an interactive ROI Calculator used LIVE during sales calls. This is a revenue-critical tool — Kevin uses it on calls with prospects. Without it, the calculator is a static Notion page instead of an interactive experience.

---

#### TOOL-001 | ROI Calculator — Interactive UI
**Module:** Sales Tools / Module 3 | **Priority:** P0 | **Est:** 5h

**What:** Interactive ROI calculator for use during sales calls. Input fields for prospect data, real-time calculation, visual output showing ROI.

**CD-2 Reference:** ROI Calculator Template with scenario presets for SPARK, BRIDGE, MOSAIC, and Bundle ROI.

**Calculator Logic:**
```
Input Variables:
- Current assessment tool spend (annual)
- Number of leadership decisions per year
- Average cost of a bad leadership decision ($500K+ industry standard)
- Number of cross-border mandates managed
- Estimated % improvement in decision quality with better data

ROI Calculation:
- Investment: diagnostic cost (from product catalog)
- Risk mitigated: (avg cost of bad decision) × (decisions per year) × (% improvement)
- ROI: (Risk mitigated - Investment) / Investment × 100
- Payback period: Investment / monthly value
```

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────┐
│ ROI Calculator                                    [Save] [Share] │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ YOUR SITUATION ──────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  Annual leadership development spend:  [$_50,000______]   │ │
│  │  Leadership decisions per year:         [__45_________]   │ │
│  │  Avg cost of a bad hire/promotion:      [$500,000______]  │ │
│  │  Cross-border mandates managed:         [__3___________]  │ │
│  │  Current assessment tool:               [None ▼]          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─ YOUR ROI ────────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐            │ │
│  │  │ SPARK     │  │ BRIDGE    │  │ MOSAIC    │            │ │
│  │  │           │  │           │  │           │            │ │
│  │  │ ROI: 847% │  │ ROI: 412% │  │ ROI: 267% │            │ │
│  │  │ Payback:  │  │ Payback:  │  │ Payback:  │            │ │
│  │  │ 2 weeks   │  │ 1 month   │  │ 2 months  │            │ │
│  │  │           │  │           │  │           │            │ │
│  │  │ [Select]  │  │ [Select]  │  │ [Select]  │            │ │
│  │  └───────────┘  └───────────┘  └───────────┘            │ │
│  │                                                            │ │
│  │  ┌─ VISUAL BREAKDOWN ─────────────────────────────────┐  │ │
│  │  │  ████████████████████████████ Risk Mitigated        │  │ │
│  │  │  ██                           Investment             │  │ │
│  │  │  ██████████████████████████   Net Return             │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  │                                                            │ │
│  │  [Download PDF Report]  [Email Results]                   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Requirements:**
- Real-time calculation as user types (debounced 300ms)
- Show ROI for all 3 diagnostics side-by-side + bundle option
- Visual bar chart showing investment vs risk mitigated vs net return
- "Download PDF Report" — generates a branded PDF with prospect's data + ROI breakdown
- "Email Results" — sends results to prospect's email (via Distribution Engine)
- All calculator usage logged to CRM (contact_id, inputs, results, timestamp)

**Acceptance:**
- Calculator computes ROI correctly per the formula above
- Real-time updates as inputs change
- PDF generation works
- Email sending works
- Usage logged per contact

---

#### TOOL-002 | ROI Calculator — Scenario Presets
**Module:** Sales Tools | **Priority:** P0 | **Est:** 3h

**What:** Pre-configured scenarios for common prospect profiles. One-click loads typical inputs for that scenario.

**Scenarios (from CD-2):**

| Scenario | Industry | Company Size | Key Inputs Pre-filled |
|----------|----------|-------------|----------------------|
| "Tech Executive, 500 people" | Technology | 500 employees | LD: 30/yr, Cost: $600K, Mandates: 2 |
| "Manufacturing CHRO, 2000 people" | Manufacturing | 2000 employees | LD: 80/yr, Cost: $450K, Mandates: 5 |
| "Financial Services VP, 1000 people" | Finance | 1000 employees | LD: 50/yr, Cost: $800K, Mandates: 3 |
| "Startup CEO, 50 people" | Technology | 50 employees | LD: 10/yr, Cost: $300K, Mandates: 0 |
| "PE Portfolio Company" | Private Equity | varies | LD: 20/yr, Cost: $500K, Mandates: 4 |

**Requirements:**
- "Load Scenario" dropdown at top of calculator
- Selecting a scenario pre-fills all input fields
- User can still modify any field after loading
- "Custom" option (default) = blank inputs
- Scenarios stored as JSON config (editable by admin)

**Acceptance:**
- All 5 scenarios load correctly
- Pre-filled values match the table above
- User can override any pre-filled value
- Admin can add/edit scenarios

---

### Batch 1C: Notion Content Bridge (NOTION-016) — 3h

**Why P0:** CD content lives in Notion page bodies. WAVE stores metadata (asset name, status, phase) but the actual content (sales deck scripts, email templates, training guides) is only in Notion. Without a deep-link, users can't access the content from WAVE.

---

#### NOTION-016 | Asset "View Content" Deep-Link
**Module:** Module 3 (Templates) / Notion Integration | **Priority:** P0 | **Est:** 3h

**What:** Add a "View Content" button to asset detail view that opens the corresponding Notion page in a new tab.

**Requirements:**
- Add `notion_page_url` field to asset detail view (if `notion_asset_id` or `notion_page_id` exists)
- Button: "View Content →" opens `https://notion.so/{page_id}` in new tab
- For build_tracker records: same deep-link from the `notion_page_id` field
- Fallback: if no Notion page ID, show "Content not available" message
- Icon: Notion logo icon next to the button for recognition

**Schema:**
```sql
-- notion_page_url is derivable from notion_asset_id or notion_page_id
-- No new table needed — just UI field exposure
ALTER TABLE assets ADD COLUMN IF NOT EXISTS notion_page_url TEXT;
ALTER TABLE build_tracker ADD COLUMN IF NOT EXISTS notion_page_url TEXT;

-- Populate from existing IDs
UPDATE assets SET notion_page_url = 'https://www.notion.so/' || REPLACE(notion_asset_id, '-', '')
WHERE notion_asset_id IS NOT NULL;

UPDATE build_tracker SET notion_page_url = 'https://www.notion.so/' || REPLACE(notion_page_id, '-', '')
WHERE notion_page_id IS NOT NULL;
```

**Acceptance:**
- "View Content" button visible on asset detail when Notion page exists
- Click opens correct Notion page in new tab
- Graceful fallback when no Notion page ID
- Works for both assets and build_tracker records

---

## PHASE 2 — FEATURE COMPLETE (P1) — 44h

### Batch 2A: LMS Advanced Features (LMS-010 to LMS-018) — 20h

**Why P1:** Core course delivery works after Phase 1. These are the advanced features that make the LMS production-ready: analytics, team management, communication, prerequisites.

---

#### LMS-010 | Course Completion Webhook → Journey Trigger
**Module:** LMS / Module 5 (Journey Engine) | **Priority:** P1 | **Est:** 2h

**What:** When a course is completed, fire a webhook that the Journey Engine can listen for. Enables automated post-completion journeys (cross-sell diagnostic, invite to program, etc.).

**Requirements:**
- On course completion (LMS-006), fire event: `lms.course_completed`
- Event payload: `{contact_id, course_id, course_slug, completion_date, diagnostic_discount_code, score_summary}`
- Journey Engine registers this as an entry trigger type: `on_course_complete`
- Default post-completion journey: "Course Done → Suggest Diagnostic → Nurture → Program Invite"
- Configurable per course (admin can set which journey to trigger)

**Acceptance:**
- Completion fires `lms.course_completed` event
- Journey Engine receives and processes the event
- Triggered journey starts within 60 seconds of completion
- Admin can configure which journey triggers per course

---

#### LMS-011 | Video Hosting Integration
**Module:** LMS / Infrastructure | **Priority:** P1 | **Est:** 3h

**What:** Video storage and streaming. Options: Supabase Storage (cheaper, simpler) or external (Mux, Cloudflare Stream).

**Requirements:**
- Default: Supabase Storage bucket `lms-videos` with signed URLs (prevent hotlinking)
- Upload interface: admin uploads video → stored in bucket → URL saved to `lms_lessons.video_url`
- Video format: MP4, max 2GB per file, auto-transcode to HLS for adaptive streaming (if using external)
- For Supabase Storage: serve MP4 directly with signed URL (expires in 1 hour, regenerated on page load)
- Video metadata: duration (auto-detected on upload), file size, resolution
- Fallback: support external video URLs (YouTube unlisted, Vimeo) for flexibility

**Supabase Storage Setup:**
```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('lms-videos', 'lms-videos', false);

-- RLS: authenticated users can read, service role can write
CREATE POLICY "Authenticated can read videos" ON storage.objects
FOR SELECT TO authenticated USING (bucket_id = 'lms-videos');
```

**Acceptance:**
- Admin can upload videos via WAVE UI
- Videos stored securely (not publicly accessible)
- Signed URLs generated for enrolled students only
- External URLs supported as fallback
- Video duration auto-detected

---

#### LMS-012 | Quiz Answer Key Management (Admin)
**Module:** LMS | **Priority:** P1 | **Est:** 2h

**What:** Admin interface for creating and managing quiz questions + answer keys.

**Requirements:**
- Quiz builder UI: add/edit/remove questions, set question type, define correct answers
- Import from Notion: if quiz content exists in Notion page body, parse and import
- Question types: multiple_choice, multi_select, short_answer, true_false
- For short_answer: define acceptable answers (array of strings, case-insensitive match)
- Preview mode: take the quiz as a student would see it
- Bulk operations: duplicate quiz, reorder questions, import from template

**Acceptance:**
- Admin can create quizzes with all 4 question types
- Answer key stored securely (not in client-side code)
- Preview mode works
- Import from Notion content works (when content structured correctly)

---

#### LMS-013 | Course Instructor Notes
**Module:** LMS | **Priority:** P1 | **Est:** 2h

**What:** Internal notes field per course/lesson for the instructor (Kevin). Not visible to students.

**Requirements:**
- "Instructor Notes" field on course and lesson edit pages
- Rich text / block-based editor
- Visible only to users with `admin` or `instructor` role
- Notes persist across sessions
- Use case: "This lesson's video needs re-recording", "Update exercise for Q3 cohort", etc.

**Schema:**
```sql
ALTER TABLE lms_courses ADD COLUMN instructor_notes TEXT;
ALTER TABLE lms_lessons ADD COLUMN instructor_notes TEXT;
```

**Acceptance:**
- Notes field visible to admin/instructor only
- Rich text editor functional
- Notes persist and are not visible to students

---

#### LMS-014 | Team Enrollment Management
**Module:** LMS | **Priority:** P1 | **Est:** 3h

**What:** Manage team enrollments — invite team members, track individual progress within a team, view team aggregate progress.

**Requirements:**
- Team enrollment (from LMS-002) creates a `team_id` group
- Team admin view: see all members, their progress, completion status
- Invite flow: team admin enters emails → invitation emails sent → recipients create account → auto-enrolled
- Seat management: see used/available seats, reassign seats from cancelled members
- Team progress dashboard: aggregate completion %, average quiz scores, time-to-complete
- Team certificate: generate team summary certificate showing all completions

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────┐
│ Team: Governance Health Check                 3/5 seats used     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ TEAM MEMBERS ────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  Sarah K.    ████████████████ 100%  ✅ Completed Jul 10   │ │
│  │  Marcus T.   ████████░░░░░░░░  50%  ▶ Lesson 2           │ │
│  │  Priya R.    ░░░░░░░░░░░░░░░░   0%  ⏳ Not started       │ │
│  │  [Empty]     [Invite Member]                              │ │
│  │  [Empty]     [Invite Member]                              │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─ TEAM SUMMARY ───────────────────────────────────────────┐ │
│  │  Avg Progress: 50%  |  Completed: 1/3  |  Avg Quiz: 82% │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Acceptance:**
- Team admin can invite members via email
- Invited members auto-enrolled on account creation
- Seat tracking accurate
- Team progress dashboard shows aggregate data
- Reassignment of cancelled seats works

---

#### LMS-015 | Course Review & Rating
**Module:** LMS | **Priority:** P1 | **Est:** 2h

**What:** Post-completion course rating (1-5 stars) + text review. Displayed on public course catalog.

**Requirements:**
- After completion: prompt "Rate this course" (1-5 stars) + optional text review
- Reviews stored in new `lms_reviews` table
- Average rating displayed on course catalog cards
- Admin can moderate (hide inappropriate reviews)
- Review prompt in completion email

**Schema:**
```sql
CREATE TABLE lms_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES lms_enrollments(id),
  course_id UUID NOT NULL REFERENCES lms_courses(id),
  contact_id UUID NOT NULL REFERENCES contacts(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(enrollment_id)
);

-- Add avg rating to courses
ALTER TABLE lms_courses ADD COLUMN avg_rating DECIMAL(2,1);
ALTER TABLE lms_courses ADD COLUMN review_count INTEGER DEFAULT 0;
```

**Acceptance:**
- Rating prompt shown after completion
- Average rating displayed on catalog
- One review per enrollment
- Admin can moderate reviews

---

#### LMS-016 | Course Prerequisite Enforcement
**Module:** LMS | **Priority:** P1 | **Est:** 2h

**What:** Some courses may require completion of another course first. Enforce at enrollment.

**Requirements:**
- `prerequisite_course_id` on `lms_courses` (already in schema from LMS-001)
- At enrollment: check if contact has completed the prerequisite course
- If not completed: show message "Please complete {prerequisite_name} first" + link to that course
- Admin override: can bypass prerequisite check manually
- Prerequisite chain: Course C requires B, B requires A → enrolling in C checks both

**Acceptance:**
- Prerequisite check enforced at enrollment
- Clear message when prerequisite not met
- Admin can bypass
- Chain enforcement works

---

#### LMS-017 | B2C Student Communication (Nudge + Completion)
**Module:** LMS / Module 4 (Distribution) | **Priority:** P1 | **Est:** 2h

**What:** Automated email communication for enrolled students — nudges for inactivity, congratulations for completion, diagnostic discount reminders.

**Requirements:**
- Inactivity nudge: if no lesson completed in 7 days → email "You haven't studied in a while"
- Progress milestone: 25%, 50%, 75% → congratulation emails
- Completion: already handled in LMS-006, but ensure Distribution Engine templates are created
- Diagnostic discount reminder: 3 days before discount code expires → reminder email
- All emails use Distribution Engine sequences (not hardcoded)

**Acceptance:**
- Inactivity nudge fires at 7 days
- Milestone emails fire at correct thresholds
- Discount reminder fires before expiry
- All emails use Distribution Engine (not hardcoded)

---

#### LMS-018 | Course Analytics Dashboard
**Module:** LMS / Module 8 (Analytics) | **Priority:** P1 | **Est:** 2h

**What:** Course-level and lesson-level analytics — completion rates, time-to-complete, quiz scores, revenue.

**Requirements:**
- Course-level metrics: enrollment count, completion rate, avg time-to-complete, avg quiz score, revenue, refund rate
- Lesson-level metrics: completion rate per lesson, avg time spent, video watch rate, quiz pass rate
- Cohort view: group by enrollment month, compare completion rates
- Funnel view: enrollment → lesson 1 → lesson 2 → ... → completion
- Revenue: course revenue, team vs individual, discount code usage
- Integration with Module 8 analytics infrastructure

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────┐
│ Course Analytics: Governance Health Check                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ OVERVIEW ────────────────────────────────────────────────┐ │
│  │  Enrolled: 47  |  Completed: 18 (38%)  |  Revenue: ¥98,500│ │
│  │  Avg Time: 3.2 days  |  Avg Quiz: 84%  |  Rating: 4.6/5  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─ LESSON FUNNEL ───────────────────────────────────────────┐ │
│  │  L1: 47 (100%) → L2: 38 (81%) → L3: 28 (60%) → L4: 18 (38%)│
│  │  ████████████████████  ████████████████  ████████████  ████████│
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─ QUIZ SCORES ─────────────────────────────────────────────┐ │
│  │  L1: 92% avg  |  L2: 87% avg  |  L3: 79% avg  |  L4: 84% avg│
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Acceptance:**
- All metrics calculated correctly from enrollment/progress data
- Lesson funnel visualization works
- Revenue figures accurate
- Data refreshes in real-time (Supabase subscriptions)

---

### Batch 2B: Program Delivery Core (PROG-001 to PROG-005) — 18h

**Why P1:** CD-8/9 define multi-session programs (SHIFT-QUEST: 12 sessions over 6 months, Advisory: ongoing, Coaching: ongoing). Module 7 (Events) handles individual events but not program-level enrollment, attendance tracking, or milestone management.

---

#### PROG-001 | Program Schema & Enrollment
**Module:** Program Delivery / Module 7 | **Priority:** P1 | **Est:** 4h

**What:** Database schema for programs (multi-session engagements) and participant enrollment.

**CD-8 Reference Programs:**
- P1.1 Advisory Program (3 tiers, ongoing, 2 sessions/month)
- P1.2 Governance Development Program — Force 1 (3 modules × 2.5hr + workbook + capstone)
- P2.1 Cross-Border Development — Force 2 (similar structure)
- P3.1 AI Leadership Development — Force 3 (similar structure)
- P3.3 Coaching Program (ongoing, session-based)

**SQL:**
```sql
-- Program table (represents a program type/template)
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  program_type TEXT NOT NULL, -- 'advisory', 'development', 'coaching', 'workshop_series'
  track TEXT, -- 'Force 1', 'Force 2', 'Force 3', 'Cross-Track'
  total_sessions INTEGER,
  duration_months INTEGER,
  session_frequency TEXT, -- 'weekly', 'biweekly', 'monthly'
  price_per_person DECIMAL(10,2),
  team_price DECIMAL(10,2),
  max_participants INTEGER,
  min_participants INTEGER,
  diagnostic_required TEXT, -- 'SPARK', 'BRIDGE', 'MOSAIC', or null
  workbook_included BOOLEAN DEFAULT FALSE,
  capstone_required BOOLEAN DEFAULT FALSE,
  certificate_on_completion BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, active, archived
  cd_reference TEXT, -- e.g., 'CD-8 Instruction 2'
  notion_page_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cohort (a specific instance of a program with start/end dates)
CREATE TABLE program_cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id),
  name TEXT NOT NULL, -- e.g., "Force 1 — Q3 2026"
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'enrolling', -- enrolling, active, completed, cancelled
  max_participants INTEGER,
  facilitator_id UUID REFERENCES contacts(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Program sessions (individual sessions within a cohort)
CREATE TABLE program_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID NOT NULL REFERENCES program_cohorts(id) ON DELETE CASCADE,
  session_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  session_date TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 150,
  session_type TEXT DEFAULT 'live', -- 'live', 'async', 'workshop', 'assessment'
  materials_url TEXT,
  recording_url TEXT,
  status TEXT DEFAULT 'scheduled', -- scheduled, completed, cancelled
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Program enrollment (participant in a cohort)
CREATE TABLE program_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID NOT NULL REFERENCES program_cohorts(id),
  contact_id UUID NOT NULL REFERENCES contacts(id),
  status TEXT NOT NULL DEFAULT 'active', -- active, completed, withdrawn, waitlisted
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  workbook_completed BOOLEAN DEFAULT FALSE,
  capstone_submitted BOOLEAN DEFAULT FALSE,
  capstone_url TEXT,
  nps_score INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cohort_id, contact_id)
);

-- Session attendance
CREATE TABLE program_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES program_sessions(id),
  enrollment_id UUID NOT NULL REFERENCES program_enrollments(id),
  attended BOOLEAN DEFAULT FALSE,
  check_in_at TIMESTAMPTZ,
  notes TEXT,
  UNIQUE(session_id, enrollment_id)
);

-- Indexes
CREATE INDEX idx_programs_status ON programs(status);
CREATE INDEX idx_cohorts_program ON program_cohorts(program_id);
CREATE INDEX idx_sessions_cohort ON program_sessions(cohort_id, session_number);
CREATE INDEX idx_prog_enrollments_cohort ON program_enrollments(cohort_id);
CREATE INDEX idx_prog_enrollments_contact ON program_enrollments(contact_id);
CREATE INDEX idx_prog_attendance_session ON program_attendance(session_id);
```

**Acceptance:**
- All 5 tables created with correct relationships
- Supports program → cohort → sessions hierarchy
- Enrollment unique per contact per cohort
- Attendance tracked per session per participant
- RLS appropriate for each table

---

#### PROG-002 | Session Attendance Tracking
**Module:** Program Delivery | **Priority:** P1 | **Est:** 3h

**What:** Facilitator interface for marking attendance at each session. Quick check-in flow.

**Requirements:**
- Session attendance view: list of enrolled participants with checkbox/toggle for each
- Quick actions: "Mark All Present", "Mark All Absent", then toggle individuals
- Attendance auto-creates `program_attendance` records
- Running attendance rate per participant (attended / total sessions so far)
- Low attendance alert: if participant attendance drops below 70% → notify facilitator
- Session notes field: facilitator can add notes per session (what was covered, key observations)

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────┐
│ Session 3/12 — Decision Architecture    Jul 23, 14:00-16:30    │
│ Governance Development Program — Force 1 (Q3 2026)             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ ATTENDANCE ──────────────────────────────────────────────┐ │
│  │  ✅ Sarah K. (CHRO, MHP)          Overall: 100% (3/3)    │ │
│  │  ✅ Marcus T. (VP, Codelco)       Overall: 100% (3/3)    │ │
│  │  ❌ Priya R. (Director, Remora)   Overall: 67% (2/3) ⚠   │ │
│  │  ✅ David F. (CEO, Astellas)      Overall: 100% (3/3)    │ │
│  │  ✅ Anne-Line H. (CHRO, ALH)      Overall: 100% (3/3)    │ │
│  │                                                            │ │
│  │  [Mark All Present]  [Save]  [Export CSV]                 │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─ SESSION NOTES ───────────────────────────────────────────┐ │
│  │  Covered decision-rights mapping exercise. Group discussion│ │
│  │  on cross-border approval workflows. Priya absent — send   │ │
│  │  recording + exercise template.                            │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Acceptance:**
- Facilitator can mark attendance quickly
- Running attendance rate calculated correctly
- Low attendance alert fires at <70%
- Session notes persist
- Export to CSV works

---

#### PROG-003 | Participant Milestone Tracker
**Module:** Program Delivery | **Priority:** P1 | **Est:** 3h

**What:** Track participant milestones within a program — workbook completion, capstone submission, assessment scores.

**Requirements:**
- Milestone types: `workbook_completed`, `capstone_submitted`, `capstone_approved`, `diagnostic_taken`, `assessment_score`
- Per-participant milestone view: which milestones are complete, which are pending
- Automated triggers: diagnostic completion (from LMS or standalone) auto-checks `diagnostic_taken`
- Capstone workflow: participant uploads → facilitator reviews → approve/request revision
- Milestone dashboard: matrix view of all participants × all milestones

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────┐
│ Participant Milestones — Force 1 Q3 2026                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ MILESTONE MATRIX ────────────────────────────────────────┐ │
│  │           │ BRIDGE  │Workbook│Capstone│Capstone│Sessions  │ │
│  │           │ Done    │ Done   │Submit  │Approved│ (9/12)   │ │
│  │───────────┼─────────┼────────┼────────┼────────┼──────────│ │
│  │ Sarah K.  │  ✅     │  ✅    │  ✅    │  ✅    │  9/9 ✅  │ │
│  │ Marcus T. │  ✅     │  ✅    │  📝    │  ⏳    │  8/9     │ │
│  │ Priya R.  │  ✅     │  ⏳    │  ❌    │  ❌    │  6/9 ⚠   │ │
│  │ David F.  │  ✅     │  ✅    │  ✅    │  ⏳    │  9/9 ✅  │ │
│  │ Anne-Line │  ❌     │  ⏳    │  ❌    │  ❌    │  7/9     │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Legend: ✅ Complete  ⏳ In Progress  ❌ Not Started  📝 Under Review│
└─────────────────────────────────────────────────────────────────┘
```

**Acceptance:**
- Milestone matrix view functional
- Per-participant status accurate
- Capstone submission workflow (upload → review → approve/revise)
- Diagnostic completion auto-detected
- Low-progress alerts for facilitator

---

#### PROG-004 | Cohort Analytics
**Module:** Program Delivery / Module 8 | **Priority:** P1 | **Est:** 4h

**What:** Program-level analytics — attendance rates, completion rates, NPS, revenue per cohort.

**Requirements:**
- Cohort dashboard: attendance rate, completion rate, avg milestone progress, NPS
- Revenue: cohort revenue (enrollments × price), cost per participant, margin
- Comparison: compare cohorts (Q1 vs Q2, Force 1 vs Force 2)
- Attrition analysis: who dropped out, at what session, why (if captured)
- Post-program outcomes: diagnostic uptake, advisory conversion, re-enrollment rate
- Export: PDF report per cohort

**Acceptance:**
- All metrics calculated from program data
- Cohort comparison view works
- Revenue accurate
- Post-program outcome tracking functional
- PDF export generates

---

#### PROG-005 | Facilitator Dashboard
**Module:** Program Delivery | **Priority:** P1 | **Est:** 4h

**What:** Facilitator's home view — upcoming sessions, participant status overview, action items.

**Requirements:**
- "My Programs" view: all cohorts where user is facilitator
- Per cohort: next session date/time, attendance rate, completion rate, action items
- Action items: "Review Marcus's capstone", "Follow up with Priya (absent 3x)", "Approve David's workbook"
- Session prep: 24h before session → notification with participant list, pre-session diagnostic scores, materials link
- Quick actions from dashboard: mark attendance, send message to participant, update milestone

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────┐
│ Facilitator Dashboard                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ UPCOMING ────────────────────────────────────────────────┐ │
│  │  📅 Jul 23, 14:00 — Session 3: Decision Architecture      │ │
│  │     Force 1 Q3 2026 · 5 participants · Room: Zoom         │ │
│  │     [View Materials] [Check Attendance] [Send Reminder]    │ │
│  │                                                            │ │
│  │  📅 Jul 30, 14:00 — Session 4: Execution Velocity         │ │
│  │     Force 1 Q3 2026 · 5 participants                      │ │
│  │     [View Materials] [Send Reminder]                       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─ ACTION ITEMS ────────────────────────────────────────────┐ │
│  │  🔴 Review Marcus T.'s capstone submission    (due Jul 20)│ │
│  │  🟡 Follow up: Priya R. absent 2 of 3 sessions           │ │
│  │  🟡 Anne-Line H. hasn't taken BRIDGE diagnostic yet       │ │
│  │  🟢 Approve David F.'s workbook               (submitted) │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─ COHORT HEALTH ───────────────────────────────────────────┐ │
│  │  Force 1 Q3: Attendance 93% | Completion 67% | NPS 9.2   │ │
│  │  Force 2 Q2: Attendance 87% | Completion 80% | NPS 8.8   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Acceptance:**
- Dashboard shows upcoming sessions with prep actions
- Action items auto-generated from milestone/attendance data
- Session prep notifications sent 24h before
- Cohort health summary visible at a glance

---

### Batch 2C: Sales Tools Advanced (TOOL-003 to TOOL-004) — 4h

---

#### TOOL-003 | ROI Calculator — Share/Link Results
**Module:** Sales Tools | **Priority:** P1 | **Est:** 2h

**What:** Generate a shareable link with calculator results. Send to prospects after calls.

**Requirements:**
- "Share Results" button on calculator → generates unique URL with encoded inputs
- Share page: read-only view of the prospect's inputs + ROI breakdown (no edit)
- URL format: `/tools/roi-calculator/results/{share_id}`
- Share link expires after 30 days (configurable)
- Track share opens (logged for CRM)

**Schema:**
```sql
CREATE TABLE tool_calculator_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id),
  scenario TEXT, -- which preset or 'custom'
  inputs JSONB NOT NULL,
  results JSONB NOT NULL,
  share_code TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Acceptance:**
- Share link generated and accessible
- Results display correctly on share page
- Link expires after 30 days
- View tracking works

---

#### TOOL-004 | ROI Calculator — CRM Integration
**Module:** Sales Tools / Module 8 | **Priority:** P1 | **Est:** 2h

**What:** Log all calculator usage to CRM. Track which prospects got calculator presentations, what inputs were used, and which diagnostic was recommended.

**Requirements:**
- On calculator use: log to `tool_calculator_usage` table (contact_id if known, inputs, results, recommended diagnostic, timestamp)
- On calculator share: log share event
- CRM view: per-contact history of calculator interactions
- Module 8 integration: calculator usage feeds into revenue intelligence (which diagnostics were pitched, conversion rate)

**Schema:**
```sql
CREATE TABLE tool_calculator_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id),
  session_id TEXT, -- browser session for anonymous tracking
  scenario TEXT,
  inputs JSONB NOT NULL,
  results JSONB NOT NULL,
  recommended_diagnostic TEXT,
  share_id UUID REFERENCES tool_calculator_shares(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_calc_usage_contact ON tool_calculator_usage(contact_id);
```

**Acceptance:**
- All calculator usage logged
- Per-contact history visible in CRM
- Revenue intelligence incorporates calculator data
- Anonymous usage tracked (for pre-contact stage)

---

### Batch 2D: Notion Content Preview (NOTION-017) — 2h

---

#### NOTION-017 | Notion Page Content Preview Card
**Module:** Module 3 / Notion Integration | **Priority:** P1 | **Est:** 2h

**What:** Fetch and display a content preview (first 500 chars) from Notion page body. Show as a preview card on asset detail view.

**Requirements:**
- On asset detail view: if `notion_page_id` exists, fetch page content via Notion API
- Extract first 500 characters of plain text from page body
- Display as a collapsible "Content Preview" card with "View Full Content →" link (opens Notion)
- Cache preview for 24 hours (don't re-fetch on every page load)
- Handle API failures gracefully (show "Preview unavailable" if fetch fails)

**Notion API:**
```
GET https://api.notion.com/v1/blocks/{page_id}/children
→ Extract text from paragraph blocks
→ Concatenate first 500 chars
```

**Acceptance:**
- Preview card shows first 500 chars of Notion content
- "View Full Content" links to Notion page
- Preview cached for 24h
- Graceful degradation on API failure

---

## PHASE 3 — ECOSYSTEM EXPANSION (P2) — 30h

### Batch 3A: Podcast Management (POD-001 to POD-006) — 20h

**Why P2:** CD-12 defines 42 episodes across 4 tracks ("Leaders in Motion" podcast). This is a content engine, not a launch blocker. Module 2 (Calendar) and Module 6 (Repurposing) handle some podcast-adjacent features, but dedicated podcast management is needed for production workflow and analytics.

**CD-12 Reference:**
- Podcast: "Leaders in Motion"
- Host: Kevin Hong
- Format: 25-35 min/episode, weekly (Wednesdays)
- 4 Tracks: A (Governance, 12ep), B (Cross-Border, 10ep), C (AI, 10ep), D (Career, 10ep)
- Distribution: Spotify, Apple Podcasts, LinkedIn, YouTube
- Total: 42 episode frameworks already defined in Notion

---

#### POD-001 | Podcast Episode Schema & Tracker
**Module:** Podcast / Module 2 | **Priority:** P2 | **Est:** 3h

**What:** Database schema for podcast episodes and episode status tracker.

**SQL:**
```sql
CREATE TABLE podcast_episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_number INTEGER UNIQUE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  track TEXT NOT NULL, -- 'A: Governance', 'B: Cross-Border', 'C: AI', 'D: Career'
  season INTEGER DEFAULT 1,
  description TEXT,
  show_notes TEXT, -- markdown
  guest_name TEXT,
  guest_email TEXT,
  guest_company TEXT,
  guest_bio TEXT,
  duration_minutes INTEGER,
  status TEXT NOT NULL DEFAULT 'planned',
    -- planned, outlined, script_complete, guest_confirmed,
    -- recorded, editing, review, approved, published, archived
  recorded_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  audio_url TEXT,
  video_url TEXT,
  spotify_url TEXT,
  apple_url TEXT,
  youtube_url TEXT,
  linkedin_url TEXT,
  cover_image_url TEXT,
  diagnostic_anchor TEXT, -- 'SPARK', 'BRIDGE', 'MOSAIC', 'FORGE'
  notion_page_id TEXT,
  cd_reference TEXT, -- e.g., 'CD-12 Track A Ep 3'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Podcast analytics
CREATE TABLE podcast_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id UUID NOT NULL REFERENCES podcast_episodes(id),
  date DATE NOT NULL,
  downloads INTEGER DEFAULT 0,
  streams INTEGER DEFAULT 0,
  completions INTEGER DEFAULT 0, -- listened to 90%+
  unique_listeners INTEGER DEFAULT 0,
  platform TEXT DEFAULT 'all', -- 'spotify', 'apple', 'youtube', 'all'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(episode_id, date, platform)
);

CREATE INDEX idx_podcast_status ON podcast_episodes(status);
CREATE INDEX idx_podcast_track ON podcast_episodes(track);
CREATE INDEX idx_podcast_analytics_episode ON podcast_analytics(episode_id, date);
```

**Acceptance:**
- Both tables created
- Status workflow covers full podcast lifecycle
- Track field maps to CD-12's 4 tracks
- Analytics supports per-platform tracking

---

#### POD-002 | Episode Detail & Production View
**Module:** Podcast | **Priority:** P2 | **Est:** 4h

**What:** Episode management page — metadata, production status, content, distribution links.

**Requirements:**
- Episode detail page with tabs: [Overview] [Production] [Content] [Distribution] [Analytics]
- Overview: title, track, episode number, status, guest info, diagnostic anchor
- Production: status tracker (planned → outlined → script → recorded → editing → review → approved → published), timestamps, notes
- Content: show notes editor (markdown), audio file upload, video file upload
- Distribution: links to Spotify, Apple, YouTube, LinkedIn — auto-populated on publish
- Analytics: embedded chart of downloads/listens over time
- Inline editing for all fields

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────┐
│ Ep 15: "The Board That Couldn't Decide"    Track A · Governance │
│ Status: ● Editing                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Overview] [Production] [Content] [Distribution] [Analytics]   │
│  ────────────────────────────────────────────────────────────── │
│                                                                  │
│  ┌─ PRODUCTION TIMELINE ─────────────────────────────────────┐ │
│  │  ✅ Planned (Jul 1) → ✅ Outlined (Jul 3) → ✅ Script (Jul 8)│ │
│  │  → ✅ Recorded (Jul 12) → ● Editing → ⏳ Review → ⏳ Publish│ │
│  │                                                            │ │
│  │  Guest: Anne-Line Hosotte (ALH Consulting)                │ │
│  │  Recorded: Jul 12, 2026 · 32 minutes                      │ │
│  │  Editor: Echo · Due: Jul 18                               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─ SHOW NOTES ──────────────────────────────────────────────┐ │
│  │  [Markdown Editor]                                         │ │
│  │  In this episode, Kevin and Anne-Line discuss...           │ │
│  │                                                            │ │
│  │  Key Moments:                                              │ │
│  │  03:24 — Why boards struggle with cross-border decisions   │ │
│  │  12:18 — The "governance gap" framework                    │ │
│  │  22:45 — Practical steps for CHROs                         │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Acceptance:**
- All tabs functional with inline editing
- Production timeline visualizes status progression
- Show notes editor supports markdown
- Audio/video file upload works
- Distribution links editable

---

#### POD-003 | Podcast Publishing Workflow
**Module:** Podcast / Module 4 | **Priority:** P2 | **Est:** 4h

**What:** Approval → distribute workflow. One-click publish to multiple platforms.

**Requirements:**
- Publishing checklist: audio uploaded ✅, show notes complete ✅, cover image ✅, guest approved ✅
- "Ready to Publish" badge when all checks pass
- Publish action: update status to `published`, set `published_at`, trigger distribution
- Distribution integrations (manual for now, API later):
  - Generate LinkedIn post text (auto-drafted from show notes)
  - Generate email announcement (for Distribution Engine)
  - Copy embed codes for website
- Post-publish: auto-update episode status, notify team, log to content calendar

**Acceptance:**
- Publishing checklist enforced
- Publish updates status and timestamps
- LinkedIn post text auto-generated
- Email announcement draft created
- Content calendar auto-updated

---

#### POD-004 | Podcast Analytics Dashboard
**Module:** Podcast / Module 8 | **Priority:** P2 | **Est:** 4h

**What:** Podcast-level and episode-level analytics — downloads, listens, subscriber growth, top episodes.

**Requirements:**
- Podcast overview: total downloads, avg downloads/episode, subscriber count, top track
- Episode comparison: bar chart of downloads per episode
- Track performance: which track performs best (A/B/C/D)
- Listener trends: downloads over time, growth rate
- Top episodes: ranked by downloads, completion rate
- Diagnostic correlation: episodes with diagnostic anchors → track diagnostic uptake
- Data input: manual CSV import from Spotify/Apple dashboards (or API when available)

**Acceptance:**
- Podcast-level metrics displayed
- Episode comparison chart works
- Track performance comparison visible
- CSV import functional
- Diagnostic correlation tracked

---

#### POD-005 | Guest Management
**Module:** Podcast | **Priority:** P2 | **Est:** 3h

**What:** Manage podcast guests — contact info, bio, recording logistics, follow-up.

**Requirements:**
- Guest profile: name, email, company, bio, photo, social links
- Guest pipeline: planned → contacted → confirmed → recorded → follow-up sent
- Pre-recording checklist: bio received, headshot received, topic confirmed, pre-call questions sent
- Post-recording: thank you email, episode link when published, diagnostic discount (if applicable)
- Guest → contact link: if guest is already in CRM, link to contact record
- Guest history: which episodes, which tracks, last recorded

**Acceptance:**
- Guest profiles created and searchable
- Pipeline status tracked
- Pre/post recording checklists functional
- Guest-CRM linking works
- Guest history visible

---

#### POD-006 | Podcast Calendar Integration
**Module:** Podcast / Module 2 | **Priority:** P2 | **Est:** 2h

**What:** Podcast publishing schedule integrated with Content Calendar.

**Requirements:**
- Each published episode auto-creates a Content Calendar event (content_type: `podcast_episode`)
- Publishing cadence visible in calendar view: weekly Wednesday slots
- Conflict detection: don't double-book publishing slots
- Content Calendar shows podcast episodes alongside other content (newsletters, research, social)
- Track-based color coding in calendar (Track A = blue, B = green, C = orange, D = purple)

**Acceptance:**
- Episodes auto-create calendar events
- Publishing cadence visible
- Color-coded by track
- No scheduling conflicts
- Integrated with other content types

---

### Batch 3B: Program Delivery Advanced (PROG-006 to PROG-008) — 10h

---

#### PROG-006 | Capstone Submission & Review Workflow
**Module:** Program Delivery | **Priority:** P2 | **Est:** 4h

**What:** Participants submit capstone projects → facilitator reviews → approve or request revision.

**Requirements:**
- Submission interface: upload document (PDF/DOCX) + text summary
- Review interface: facilitator sees submission, can add comments, approve or request revision
- Status flow: `not_submitted` → `submitted` → `under_review` → `approved` / `revision_requested`
- Revision: participant resubmits with changes, facilitator re-reviews
- Notifications: email on submission, on approval, on revision request
- Capstone template: provide a template document (from CD-8 blueprint specs)

**Acceptance:**
- Submission workflow functional
- Review/approve/revise cycle works
- Notifications sent at each status change
- Template downloadable
- Submission history preserved

---

#### PROG-007 | Program Completion Certificate
**Module:** Program Delivery | **Priority:** P2 | **Est:** 3h

**What:** Generate branded certificate on program completion (all milestones met).

**Requirements:**
- Completion criteria: all sessions attended (or minimum attendance threshold), workbook completed, capstone approved
- Certificate: LYC branding, program name, participant name, completion date, facilitator signature line, unique certificate code
- PDF generation (reuse LMS-007 certificate infrastructure)
- Verification page: `/certificates/program/{certificate_code}`
- Email certificate on completion
- Distinguish from LMS certificates: program certificate shows program name, cohort, and facilitator

**Acceptance:**
- Certificate generated when all milestones met
- PDF correctly branded
- Verification page works
- Email sent to participant
- Distinct from LMS course certificates

---

#### PROG-008 | Post-Program Cross-Sell Trigger
**Module:** Program Delivery / Module 5 | **Priority:** P2 | **Est:** 3h

**What:** On program completion, trigger cross-sell journey — suggest next program, advisory tier, or Council invitation.

**Requirements:**
- On program completion: fire event `program.completed`
- Cross-sell logic (configurable per program):
  - Force 1 completion → suggest Force 2 or Advisory Tier 1
  - Force 2 completion → suggest Force 3 or Advisory Tier 2
  - Advisory Tier 1 → suggest Tier 2 or Council invitation
  - Coaching completion → suggest program enrollment
- Integration with Journey Engine: trigger appropriate journey
- Integration with Events: suggest upcoming relevant events/programs
- Notification to Kevin: "X completed Force 1 — recommend Force 2"

**Acceptance:**
- Completion fires `program.completed` event
- Cross-sell journey triggered correctly
- Kevin notified of cross-sell opportunities
- Integration with Journey Engine functional
- Configurable per program

---

## EXISTING TICKET UPDATES

The following existing ticket ranges need minor spec updates to accommodate new content types and features. These are NOT new tickets — they're amendments to existing specs.

| Ticket Range | Update Required | Effort |
|-------------|----------------|--------|
| CAL-001 to CAL-044 | Add `content_type` enum values: `podcast_episode`, `research_report`, `case_study`, `newsletter_issue`, `b2c_course`, `training_module` | 0.5h |
| DIST-001 to DIST-066 | Add newsletter-specific metadata: `issue_number`, `template_structure` (subject, preview, hook, insight, bullets, diagnostic_corner, action, upcoming) | 1h |
| EVT-001 to EVT-102 | Add `program` event type with multi-session support (link to `program_cohorts` table) | 2h |
| CAT-001 to CAT-078 | Add B2C course products ($199-$299) to product catalog, add podcast as free content product | 1h |
| ANA-001 to ANA-105 | Add LMS KPIs (completion_rate, time_to_complete, quiz_avg_score) and podcast KPIs (downloads, listen_through_rate) | 1h |
| TPL-001 to TPL-066 | Add `notion_page_url` field to asset schema for deep-linking | 0.5h |
| JOUR-001 to JOUR-092 | Add `on_course_complete` and `on_program_complete` trigger types | 1h |
| **Total amendment effort** | | **7h** |

---

## APPENDIX A: TICKET SUMMARY

| ID | Title | Phase | Batch | Hours |
|----|-------|-------|-------|-------|
| LMS-001 | Course Catalog Schema & API | 1 | 1A | 4 |
| LMS-002 | Course Enrollment & Payment Flow | 1 | 1A | 6 |
| LMS-003 | Lesson Player — Video + Reading Tabs | 1 | 1A | 6 |
| LMS-004 | Exercise/Worksheet Viewer (Fillable) | 1 | 1A | 5 |
| LMS-005 | Quiz Engine | 1 | 1A | 5 |
| LMS-006 | Progress Tracking & Course Completion | 1 | 1A | 4 |
| LMS-007 | Certificate Generation | 1 | 1A | 4 |
| LMS-008 | Student Dashboard | 1 | 1A | 5 |
| LMS-009 | Course Catalog Page (Public) | 1 | 1A | 6 |
| LMS-010 | Course Completion Webhook → Journey Trigger | 2 | 2A | 2 |
| LMS-011 | Video Hosting Integration | 2 | 2A | 3 |
| LMS-012 | Quiz Answer Key Management (Admin) | 2 | 2A | 2 |
| LMS-013 | Course Instructor Notes | 2 | 2A | 2 |
| LMS-014 | Team Enrollment Management | 2 | 2A | 3 |
| LMS-015 | Course Review & Rating | 2 | 2A | 2 |
| LMS-016 | Course Prerequisite Enforcement | 2 | 2A | 2 |
| LMS-017 | B2C Student Communication | 2 | 2A | 2 |
| LMS-018 | Course Analytics Dashboard | 2 | 2A | 2 |
| TOOL-001 | ROI Calculator — Interactive UI | 1 | 1B | 5 |
| TOOL-002 | ROI Calculator — Scenario Presets | 1 | 1B | 3 |
| TOOL-003 | ROI Calculator — Share/Link Results | 2 | 2C | 2 |
| TOOL-004 | ROI Calculator — CRM Integration | 2 | 2C | 2 |
| NOTION-016 | Asset "View Content" Deep-Link | 1 | 1C | 3 |
| NOTION-017 | Notion Page Content Preview Card | 2 | 2D | 2 |
| PROG-001 | Program Schema & Enrollment | 2 | 2B | 4 |
| PROG-002 | Session Attendance Tracking | 2 | 2B | 3 |
| PROG-003 | Participant Milestone Tracker | 2 | 2B | 3 |
| PROG-004 | Cohort Analytics | 2 | 2B | 4 |
| PROG-005 | Facilitator Dashboard | 2 | 2B | 4 |
| PROG-006 | Capstone Submission & Review Workflow | 3 | 3B | 4 |
| PROG-007 | Program Completion Certificate | 3 | 3B | 3 |
| PROG-008 | Post-Program Cross-Sell Trigger | 3 | 3B | 3 |
| POD-001 | Podcast Episode Schema & Tracker | 3 | 3A | 3 |
| POD-002 | Episode Detail & Production View | 3 | 3A | 4 |
| POD-003 | Podcast Publishing Workflow | 3 | 3A | 4 |
| POD-004 | Podcast Analytics Dashboard | 3 | 3A | 4 |
| POD-005 | Guest Management | 3 | 3A | 3 |
| POD-006 | Podcast Calendar Integration | 3 | 3A | 2 |
| **TOTAL** | | | | **130** |

---

## APPENDIX B: PHASE GATES

| Phase | Gate Criteria | Tickets | Hours |
|-------|--------------|---------|-------|
| Phase 1 Complete | B2C courses can be enrolled, paid for, and completed end-to-end. ROI calculator works on live sales calls. Notion deep-links functional. | 12 | 56 |
| Phase 2 Complete | Full LMS with analytics, team enrollment, prerequisites. Programs manageable with attendance and milestones. Calculator shareable. | 16 | 44 |
| Phase 3 Complete | Podcast engine running (42 episodes manageable). Program certificates and cross-sell working. | 10 | 30 |

**Grand total after all phases: 771 tickets, ~2,449h**

---

*Spec by NEXUS. 38 new tickets across 3 phases, 7 batches. Derived from 14 CD instructions cross-referenced against 733 existing tickets. Ready for Trae execution.*
