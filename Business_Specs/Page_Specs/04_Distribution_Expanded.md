# WAVE Business Spec — Page 4: Distribution Engine (EXPANDED)

**Version:** 2.1 | **Date:** 2026-07-11 | **Status:** Draft for Kevin Review
**Supersedes:** TICKET-031 through TICKET-043 (existing v1.0 — 13 tickets, ~52h)
**Builds on:** Module 1 Content Calendar (Page 2), Module 2 Template Library (Page 3)
**Gap tickets:** DIST-001 through DIST-048 (expanded from 13 to 48)
**Total effort:** 218h (up from ~52h)

---

## 1. Purpose

The Distribution Engine is WAVE's outbound execution layer. It answers:
1. **"What goes out, where, and when?"** — Unified scheduling across all channels
2. **"Who gets what?"** — Smart segmentation and mailing list management
3. **"Is it working?"** — Real-time performance per channel, per sequence, per campaign
4. **"What's next?"** — Automated sequences that run without manual intervention
5. **"Can I optimize?"** — AI-powered send time optimization, A/B testing, channel routing

It must feel like **Mailchimp's campaign manager + Buffer's multi-channel scheduler + a lightweight Zapier** — not a spreadsheet of links.

**Current state (what exists today):**
- Static table with 5 hardcoded rows
- No Supabase connection
- No email sequence builder
- No mailing list management
- No multi-channel publishing
- No scheduling calendar
- No performance metrics
- No automation

**Expansion scope (what this spec adds):**

| Area | Current | Expanded |
|------|---------|----------|
| Email sequences | None | Full builder: visual timeline, drag-reorder, delay logic, triggers, A/B variants |
| Mailing lists | None | Dynamic segmentation, auto-update, behavioral filters, suppression lists |
| Content scheduling | None | Multi-channel calendar with conflict detection + AI send time optimization |
| Multi-channel publish | None | LinkedIn, podcast (Ausha), newsletter (email), website (Vercel), YouTube — each with API integration |
| Email delivery | None | Real-time tracking: sent, delivered, opened, clicked, bounced, unsubscribed |
| Performance metrics | None | Per-email, per-sequence, per-channel, per-campaign dashboards with trends |
| A/B testing | Optional ticket | Full framework: subject line, content, send time — statistical significance |
| Automation | None | Sequence triggers: on event registration, assessment completion, campaign start, time-based |
| AI optimization | None | Best send time prediction, subject line scoring, channel recommendation |
| Campaign linking | None | Link distributions to campaigns — aggregate metrics by campaign |
| Suppression | None | Unsubscribe management, bounce handling, do-not-contact list |
| Webhooks | None | Outbound webhooks for delivery events (Zapier/Make integration) |
| Approval | None | Distribution approval workflow (review before publish) |

---

## 2. Business Requirements

### 2.1 Email Sequence Builder (expanded)

**Sequence types:**

| Type | Trigger | Use Case |
|------|---------|----------|
| Welcome | On registration/first login | Welcome new contacts, introduce LYC |
| Nurture | On assessment completion | Educational drip over 14-30 days |
| Launch | On campaign start / manual | Product/event announcement sequence |
| Cross-sell | On assessment N+1 completion | Suggest next product (LEAP → PRISM → Council) |
| Re-engagement | 30d no activity | Win-back sequence |
| Webinar Follow-up | On webinar attendance/no-show | Post-event nurture |
| Custom | Any trigger / manual | Flexible builder |

**Sequence metadata:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | auto | Primary key |
| `name` | TEXT | yes | Sequence name |
| `type` | ENUM | yes | One of 7 types above |
| `trigger_type` | ENUM | yes | `manual`, `on_registration`, `on_assessment_complete`, `on_campaign_start`, `on_event_attend`, `on_time_delay`, `on_score_change` |
| `trigger_config` | JSONB | no | Trigger-specific configuration (e.g., `{assessment_id: "LEAP"}`) |
| `status` | ENUM | yes | `draft`, `active`, `paused`, `archived` |
| `campaign_id` | UUID | no | Linked campaign |
| `mailing_list_id` | UUID | no | Target mailing list (for manual trigger) |
| `total_emails` | INTEGER | auto | Count of emails in sequence |
| `total_duration_days` | INTEGER | auto | Sum of all delay_days |
| `enrollment_count` | INTEGER | auto | Contacts currently in sequence |
| `completion_rate` | FLOAT | auto | % who complete all emails |
| `avg_open_rate` | FLOAT | auto | Average across all emails |
| `avg_click_rate` | FLOAT | auto | Average across all emails |
| `created_by` | UUID | auto | Creator |
| `created_at` | TIMESTAMPTZ | auto | Creation |
| `updated_at` | TIMESTAMPTZ | auto | Last update |

**Email within sequence:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | auto | Primary key |
| `sequence_id` | UUID | yes | Parent sequence |
| `order` | INTEGER | yes | Position in sequence |
| `subject` | TEXT | yes | Email subject line |
| `subject_variant_b` | TEXT | no | A/B test variant |
| `preview_text` | TEXT | no | Email preview/preheader text |
| `content` | JSONB | yes | Block-based content (from template) |
| `content_variant_b` | JSONB | no | A/B test content variant |
| `delay_days` | INTEGER | yes | Days after previous email (0 for first) |
| `delay_hours` | INTEGER | no | Additional hours (for precision) |
| `template_id` | UUID | no | Source template |
| `send_time_optimization` | BOOLEAN | no | AI-pick best time for each recipient |
| `ab_split_ratio` | FLOAT | no | 0.5 = 50/50 split |
| `ab_winner_criterion` | ENUM | no | `open_rate`, `click_rate`, `manual` |
| `status` | ENUM | yes | `draft`, `ready`, `sending`, `sent`, `paused` |
| `sent_count` | INTEGER | auto | How many received this email |
| `opened_count` | INTEGER | auto | How many opened |
| `clicked_count` | INTEGER | auto | How many clicked a link |
| `bounced_count` | INTEGER | auto | How many bounced |
| `unsubscribed_count` | INTEGER | auto | How many unsubscribed |

**Visual timeline:**
```
┌─────────────────────────────────────────────────────────────────────┐
│ Q3 Webinar Nurture Sequence                              [Active]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐        │
│  │ Email 1 │    │ Email 2 │    │ Email 3 │    │ Email 4 │        │
│  │ Day 0   │───→│ Day 3   │───→│ Day 7   │───→│ Day 14  │        │
│  │         │    │         │    │         │    │         │        │
│  │ Thanks  │    │ Here's  │    │ Case    │    │ Last    │        │
│  │ for     │    │ the     │    │ Study:  │    │ Chance  │        │
│  │ attending│   │ replay  │    │ How X   │    │ to      │        │
│  │         │    │         │    │ got Y   │    │ register│        │
│  │         │    │         │    │         │    │         │        │
│  │ Open:45%│    │ Open:38%│    │ Open:32%│    │ Open:28%│        │
│  │ CTR:12% │    │ CTR:8%  │    │ CTR:15% │    │ CTR:22% │        │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘        │
│                                                                     │
│  [+ Add Email]     Drag to reorder     [Preview Full Sequence]     │
│                                                                     │
│  Trigger: On webinar attendance    List: Webinar Attendees (342)   │
│  Enrolled: 287    Completion: 34%    Avg Open: 36%    Avg CTR: 14% │
└─────────────────────────────────────────────────────────────────────┘
```

**Sequence views:**

| View | Description |
|------|-------------|
| List | Table: name, type, status, emails, enrollment, completion rate, open rate |
| Board | Kanban by status: Draft / Active / Paused / Archived |
| Timeline | Visual Gantt-style: all sequences showing email timing on calendar |

### 2.2 Mailing List & Segmentation (expanded)

**List types:**

| Type | Description |
|------|-------------|
| Static | Manually curated — contacts added/removed by user |
| Dynamic (Smart) | Auto-populated by filter rules — updates hourly |
| Campaign | Auto-created for a campaign — contacts from campaign interactions |
| Event | Auto-created for an event — registrants/attendees |
| Segmented | Subset of another list with additional filters |

**Filter builder (dynamic lists):**

```
┌─────────────────────────────────────────────────────┐
│ Filter Rules:                                       │
│                                                     │
│  ┌─ Rule 1 ──────────────────────────────────────┐ │
│  │ [Cluster] [is one of] [Executive ▼]    [✕]   │ │
│  └───────────────────────────────────────────────┘ │
│  ┌─ Rule 2 ──────────────────────────────────────┐ │
│  │ [Engagement Score] [is greater than] [70] [✕] │ │
│  └───────────────────────────────────────────────┘ │
│  ┌─ Rule 3 ──────────────────────────────────────┐ │
│  │ [Completed Assessment] [includes] [LEAP ▼][✕] │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  Match: [All ▼] (AND) / [Any ▼] (OR)              │
│                                                     │
│  Available filters:                                 │
│  • Cluster (enum)                                   │
│  • Engagement Score (number range)                  │
│  • Completed Assessment (enum, multi)               │
│  • Registration Status (enum)                       │
│  • Last Active (date range)                         │
│  • Job Title (contains)                             │
│  • Company Size (enum)                              │
│  • Country (enum)                                   │
│  • Email Opened (in last X days)                    │
│  • Source (registration channel)                    │
│  • Tags (multi-select)                              │
│                                                     │
│  [+ Add Rule]                                       │
│                                                     │
│  Preview: 847 contacts match these filters          │
│  [Save as Dynamic List]                             │
└─────────────────────────────────────────────────────┘
```

**Suppression list:**
- Global do-not-contact list (email addresses)
- Per-sequence unsubscribe (contact unsubscribes from one sequence but stays on others)
- Bounce list (hard bounce = permanent suppression, soft bounce = 3-strike then suppress)
- Manual add (Kevin/Echo adds emails to suppress)
- Import suppression list (CSV)

**Contact management within lists:**
- Search contacts by name, email, company
- Filter by: list membership, engagement score, cluster, assessment history
- Bulk actions: add to list, remove from list, tag, export
- Contact detail: all lists they belong to, engagement timeline, assessment history

### 2.3 Content Scheduling & Calendar (expanded)

**Multi-channel calendar:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Distribution Calendar                                        [Week ▼]  │
│                                                                         │
│          Mon 14    Tue 15    Wed 16    Thu 17    Fri 18    Sat 19      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Email    │         │ [Newsletter #43]│         │         │      │   │
│  │         │         │ 1,240 contacts   │         │         │      │   │
│  ├─────────┼─────────┼─────────────────┼─────────┼─────────┼──────┤   │
│  │LinkedIn │ [AI Lead│         │ [Case Study│ [Thought │      │      │   │
│  │         │ Post]   │         │ Post]     │ Leadership│      │      │   │
│  │         │ 8am     │         │ 10am      │ 9am      │      │      │   │
│  ├─────────┼─────────┼─────────────────┼─────────┼─────────┼──────┤   │
│  │ Podcast │         │         │         │ [Ep.3   │         │      │   │
│  │         │         │         │         │ Upload] │         │      │   │
│  ├─────────┼─────────┼─────────────────┼─────────┼─────────┼──────┤   │
│  │ Website │         │ [Blog: Diag-    │         │         │      │      │   │
│  │         │         │ nostic AI]      │         │         │      │      │   │
│  ├─────────┼─────────┼─────────────────┼─────────┼─────────┼──────┤   │
│  │ YouTube │         │         │         │         │ [Short: │      │   │
│  │         │         │         │         │         │ AI Tips] │      │   │
│  └─────────┴─────────┴─────────────────┴─────────┴─────────┴──────┘   │
│                                                                         │
│  [+ Schedule Content]    [⚠ 2 conflicts detected]    [AI: Optimize]   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Conflict detection rules:**

| Severity | Condition | Action |
|----------|-----------|--------|
| ⚠️ Warning | 2+ items on same channel, same day | Amber warning on calendar + suggest alternative date |
| 🔴 Error | 2+ items on same channel, same hour | Red block — prevent scheduling, force reschedule |
| 💡 AI Suggestion | Channel under-utilized this week | "You haven't posted on LinkedIn in 5 days. Schedule one?" |

**AI Send Time Optimization:**
- Analyzes historical open/click rates by hour-of-day and day-of-week per channel
- Recommends optimal send time per content piece
- Shows confidence score: "Tuesday 9am — 78% confidence (based on 47 past sends)"
- Override: user can manually set time

**Channel-specific scheduling rules:**

| Channel | Best Days | Best Times | Frequency Guide |
|---------|-----------|------------|-----------------|
| Email/Newsletter | Tue, Wed, Thu | 8am-10am | 2-4x/month |
| LinkedIn | Tue, Wed, Thu | 8am-9am | 3-5x/week |
| Podcast | Tue, Wed | 6am (for morning commute) | 1-2x/week |
| YouTube | Fri, Sat | 2pm-4pm | 1-2x/week |
| Website/Blog | Any | 6am-8am | 2-4x/month |

### 2.4 Multi-Channel Publishing (expanded)

**Channel integrations:**

| Channel | Method | Auth | Capabilities | Status Tracking |
|---------|--------|------|--------------|-----------------|
| Email (Newsletter) | DeepSeek → email API | API key | Send, track opens/clicks, manage bounces | sent → delivered → opened → clicked |
| LinkedIn | LinkedIn API v2 | OAuth 2.0 | Post text, article, image, video | queued → published → impressions |
| Podcast (Ausha) | Ausha API | API key | Upload audio, show notes, publish | uploaded → processing → published |
| Website (Vercel) | GitHub + Vercel webhook | GitHub token | Create MDX post, trigger deploy | committed → deploying → live |
| YouTube | YouTube Data API v3 | OAuth 2.0 | Upload video, set metadata, publish | uploaded → processing → published |
| Webhook (Generic) | HTTP POST | URL + secret | POST content data to any URL | sent → acknowledged |

**Publishing flow per content piece:**

```
Content Asset (approved)
    │
    ├──→ Select channel(s)
    │       ├── Email → format as email HTML → schedule/send
    │       ├── LinkedIn → format for LinkedIn (char limit, hashtags) → schedule
    │       ├── Podcast → generate audio (DeepSeek TTS) + show notes → upload to Ausha
    │       ├── Website → generate MDX from blocks → commit to GitHub → Vercel deploys
    │       └── YouTube → generate description + tags → upload video
    │
    ├──→ Pre-publish checks
    │       ├── Brand score ≥ 60? (block if < 60)
    │       ├── All required variables filled?
    │       ├── Conflict detection pass?
    │       └── Approval status = approved?
    │
    ├──→ Schedule or Publish Now
    │       ├── Schedule → adds to calendar with countdown
    │       └── Publish Now → triggers immediately
    │
    └──→ Post-publish
            ├── Update content status → 'published'
            ├── Record published_url per channel
            ├── Log to distribution_log
            └── Trigger performance tracking
```

**Per-channel content formatting:**

| Channel | Max Length | Special Formatting | Auto-generated |
|---------|-----------|-------------------|----------------|
| Email | Unlimited | HTML with inline CSS, responsive | Unsubscribe link, preview text |
| LinkedIn | 3,000 chars | Line breaks, emojis OK, hashtags (3-5) | Hashtag suggestions, @mention check |
| Podcast | Unlimited | Show notes with timestamps | Chapter markers, intro/outro script |
| Website | Unlimited | MDX with components | Meta description, OG image, slug |
| YouTube | 5,000 chars | Timestamps, links, hashtags | Description, tags, thumbnail text |

### 2.5 Email Performance Analytics (expanded)

**Metrics hierarchy:**

```
Campaign Performance
    └── Sequence Performance
        └── Email Performance
            └── Individual Metrics
```

**Per-email metrics:**

| Metric | Source | Display |
|--------|--------|---------|
| Sent | `email_metrics.sent_count` | Number |
| Delivered | `email_metrics.delivered_count` | Number + % of sent |
| Opened | `email_metrics.opened_count` | Number + open rate % |
| Clicked | `email_metrics.clicked_count` | Number + click rate % |
| Bounced | `email_metrics.bounced_count` | Hard + soft breakdown |
| Unsubscribed | `email_metrics.unsubscribed_count` | Number + rate % |
| Spam Complaints | `email_metrics.spam_count` | Number (must be < 0.1%) |
| Open-to-Click Rate | clicked / opened | % |

**Per-sequence metrics:**

| Metric | Calculation | Display |
|--------|-------------|---------|
| Enrollment | Sum of all contacts who entered | Number |
| Completion Rate | completed / enrolled | % |
| Drop-off Point | Email where most contacts stop | Highlighted email in timeline |
| Total Sends | Sum across all emails | Number |
| Avg Open Rate | Mean of all email open rates | % with trend sparkline |
| Avg Click Rate | Mean of all email click rates | % with trend sparkline |
| Unsubscribe Rate | Total unsubs / total sends | % (must be < 0.5%) |

**Per-channel dashboard:**

| Channel | Metrics Shown |
|---------|--------------|
| Email | Sent, open rate, click rate, bounce rate, unsubscribe rate, revenue attribution |
| LinkedIn | Posts published, impressions, engagement rate, follower growth |
| Podcast | Episodes published, downloads (7d/30d), listen completion % |
| Website | Posts published, page views, avg time on page, conversion rate |
| YouTube | Videos published, views, watch time, subscriber growth |

**Trend analysis:**
- 7-day / 30-day / 90-day trend lines per metric
- Comparison: this period vs prior period (with % change)
- Anomaly detection: flag significant drops (>20% vs average)

### 2.6 A/B Testing Framework (expanded)

**Test types:**

| Test | What Varies | Sample Split | Winner Criterion |
|------|-------------|--------------|------------------|
| Subject Line | Email subject | 50/50 or 30/30/40 | Open rate after 24h |
| Content | Email body content | 50/50 | Click rate after 48h |
| Send Time | Delivery time | 50/50 | Open rate |
| CTA | Call-to-action text/link | 50/50 | Click rate |
| Channel | Same content, different channel | 33/33/33 | Engagement rate |

**A/B test flow:**
1. Create email with variant A and variant B
2. Set split ratio (default 50/50)
3. Set winner criterion + test duration (e.g., "open rate after 24h")
4. System splits list randomly (stratified by engagement score)
5. After test duration → declare winner
6. Auto-send winner to remaining contacts (if configured)

**Statistical significance:**
- Minimum sample size: 100 per variant
- Confidence level: 95%
- Display: "Variant A wins with 95% confidence (45% vs 38% open rate, n=620)"
- If not significant: "Inconclusive — difference too small to be statistically significant"

### 2.7 Automation & Triggers (expanded)

**Trigger types:**

| Trigger | Condition | Action |
|---------|-----------|--------|
| `on_registration` | New contact registers | Enroll in welcome sequence |
| `on_assessment_complete` | Contact completes assessment | Enroll in nurture sequence for that assessment |
| `on_campaign_start` | Campaign status → active | Activate all linked sequences |
| `on_event_attend` | Contact checks in to event | Enroll in follow-up sequence |
| `on_score_change` | Engagement score crosses threshold | Trigger re-engagement or escalation |
| `on_time_delay` | X days after previous action | Send next email in sequence |
| `on_content_published` | Content published to channel | Notify relevant sequences |
| `on_webinar_complete` | Webinar ends | Enroll attendees in follow-up, no-shows in reminder |
| `on_b2b_signal` | B2B signal detected | Notify VISTA (cross-app) |

**Automation builder:**
```
┌─────────────────────────────────────────────────────────────┐
│ Automation: LEAP Assessment → Nurture Sequence              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│  │ TRIGGER  │    │  WAIT    │    │  ACTION  │             │
│  │          │    │          │    │          │             │
│  │ Assessment│───→│ 3 days   │───→│ Send     │             │
│  │ Complete │    │          │    │ Email 1  │             │
│  │ (LEAP)   │    │          │    │          │             │
│  └──────────┘    └──────────┘    └──────────┘             │
│                                       │                    │
│                                  ┌────┴────┐              │
│                                  │  WAIT   │              │
│                                  │ 7 days  │              │
│                                  └────┬────┘              │
│                                       │                    │
│                                  ┌────┴────┐              │
│                                  │CONDITION│              │
│                                  │ Opened? │              │
│                                  └────┬────┘              │
│                              ┌────────┼────────┐          │
│                              Yes               No         │
│                              │                  │         │
│                         ┌────┴────┐        ┌────┴────┐   │
│                         │ Send    │        │ Send    │   │
│                         │ Email 2 │        │ Email 2b│   │
│                         │ (next)  │        │(reminder│   │
│                         │         │        │ subject) │   │
│                         └─────────┘        └─────────┘   │
│                                                             │
│  Status: [Active]    Enrolled: 1,247    Completed: 423     │
└─────────────────────────────────────────────────────────────┘
```

### 2.8 Distribution Approval Workflow

**Flow:**
1. Content scheduled for distribution → status = `pending_approval`
2. Notification to reviewer (Kevin/Echo)
3. Reviewer checks:
   - Content preview per channel
   - Send time optimization suggestion
   - Conflict check
   - Brand score
4. Approve → content proceeds to publish at scheduled time
5. Reject with comments → back to editor
6. Auto-approve rules (configurable):
   - Content score ≥ 90 AND no conflicts → auto-approve
   - System templates with no variable changes → auto-approve

---

## 3. User Requirements

### 3.1 By Role

| Requirement | Echo (Content) | Maria (Email) | NEXUS (AI) | Carl (Webinar) | Kevin (Approver) |
|-------------|:-:|:-:|:-:|:-:|:-:|
| Build email sequences | ✓ | ✓ | — | — | — |
| Create/manage mailing lists | ✓ | ✓ | — | — | — |
| Schedule content across channels | ✓ | — | — | ✓ | — |
| Publish content to channels | ✓ | ✓ | — | ✓ | — |
| View email performance metrics | ✓ | ✓ | ✓ | — | ✓ |
| Run A/B tests | — | ✓ | ✓ | — | — |
| Configure automation triggers | — | — | ✓ | — | — |
| Approve distributions | — | — | — | — | ✓ |
| View multi-channel calendar | ✓ | ✓ | ✓ | ✓ | ✓ |
| Manage suppression/unsubscribe | — | ✓ | ✓ | — | — |
| AI send time optimization | — | — | ✓ | — | — |
| Export metrics/reports | ✓ | ✓ | — | — | ✓ |

### 3.2 Key User Flows

**Flow 1: Build and send email sequence**
```
Create sequence → Set trigger + mailing list
  → Add emails (from template or scratch)
  → Set delay between emails
  → Preview timeline → Check conflicts
  → Configure A/B test (optional)
  → Activate sequence
  → Monitor: enrollment, opens, clicks, drop-off
  → Iterate: pause + modify underperforming emails
```

**Flow 2: Schedule multi-channel distribution**
```
Select approved content asset → Click "Distribute"
  → Select channels (LinkedIn, Email, Website, etc.)
  → Per-channel: preview formatted content, adjust if needed
  → Set schedule: per-channel optimal time (AI-suggested)
  → Conflict check → resolve if needed
  → Submit for approval (or auto-approve)
  → Approved → scheduled on calendar
  → At scheduled time → auto-publish to each channel
  → Track: per-channel performance in unified dashboard
```

**Flow 3: Segment and manage mailing list**
```
Create new list → Choose type (Dynamic/Static)
  → If dynamic: build filter rules → Preview matching contacts
  → Save list → Auto-updates hourly
  → Use list in: email sequences, campaign sends, export
  → Monitor: list size trend, engagement score distribution
```

---

## 4. UX Requirements

### 4.1 Page Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Distribution Engine                                                     │
│                                                                         │
│ [Tabs: Sequences | Calendar | Mailing Lists | Analytics | Automations]  │
│                                                                         │
│ ┌─ Sequences Tab ─────────────────────────────────────────────────────┐ │
│ │                                                                     │ │
│ │ [Search sequences...]   [Type ▼] [Status ▼]         [+ New Seq.]  │ │
│ │                                                                     │ │
│ │ ┌─ Active ──────────────────────────────────────────────────────┐  │ │
│ │ │                                                               │  │ │
│ │ │ ┌────────────────────────────────────────────────────────┐   │  │ │
│ │ │ │ 📨 Q3 Webinar Nurture                           [●]   │   │  │ │
│ │ │ │ 4 emails · 14 days · 287 enrolled · 34% completion    │   │  │ │
│ │ │ │ ████████░░░░░░░░░░░░ Open: 36%  CTR: 14%             │   │  │ │
│ │ │ └────────────────────────────────────────────────────────┘   │  │ │
│ │ │                                                               │  │ │
│ │ │ ┌────────────────────────────────────────────────────────┐   │  │ │
│ │ │ │ 📨 LEAP Assessment Welcome                      [●]   │   │  │ │
│ │ │ │ 5 emails · 21 days · 1,247 enrolled · 42% completion  │   │  │ │
│ │ │ │ ██████████░░░░░░░░░░ Open: 41%  CTR: 18%             │   │  │ │
│ │ │ └────────────────────────────────────────────────────────┘   │  │ │
│ │ └───────────────────────────────────────────────────────────────┘  │ │
│ │                                                                     │ │
│ │ ┌─ Draft ───────────────────────────────────────────────────────┐  │ │
│ │ │ ┌────────────────────────────────────────────────────────┐   │  │ │
│ │ │ │ 📝 Re-engagement Campaign                      [Draft]│   │  │ │
│ │ │ │ 3 emails · 30 days · Not active                       │   │  │ │
│ │ │ └────────────────────────────────────────────────────────┘   │  │ │
│ │ └───────────────────────────────────────────────────────────────┘  │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Sequence Detail View

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Back to Sequences                                                    │
│ Q3 Webinar Nurture                              [Draft] [● Active] [⋮] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ┌─ Overview ─────────────────────────────────────────────────────────┐ │
│ │ Trigger: On webinar attendance  │  List: Webinar Attendees (342)  │ │
│ │ Enrolled: 287  │  Completed: 98 (34%)  │  Active: 189             │ │
│ │ Avg Open: 36%  │  Avg CTR: 14%  │  Unsub: 2 (0.7%)              │ │
│ └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─ Timeline ────────────────────────────────────────────────────────┐  │
│ │                                                                    │ │
│ │  ┌─────────┐  3d  ┌─────────┐  4d  ┌─────────┐  7d  ┌─────────┐ │ │
│ │  │ Email 1 │─────→│ Email 2 │─────→│ Email 3 │─────→│ Email 4 │ │ │
│ │  │ Day 0   │      │ Day 3   │      │ Day 7   │      │ Day 14  │ │ │
│ │  │         │      │         │      │         │      │         │ │ │
│ │  │ Thanks  │      │ Replay  │      │ Case    │      │ Last    │ │ │
│ │  │ for     │      │ + Key   │      │ Study   │      │ Chance  │ │ │
│ │  │ attend. │      │ Takeaway│      │         │      │ to reg. │ │ │
│ │  │         │      │         │      │         │      │         │ │ │
│ │  │ 📊45%   │      │ 📊38%   │      │ 📊32%   │      │ 📊28%   │ │ │
│ │  │ 🖱12%   │      │ 🖱8%    │      │ 🖱15%   │      │ 🖱22%   │ │ │
│ │  └─────────┘      └─────────┘      └─────────┘      └─────────┘ │ │
│ │                                                                    │ │
│ │  Drag to reorder    [+ Add Email]    [Preview Full Sequence]      │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─ Email Detail: Email 1 ───────────────────────────────────────────┐  │
│ │ Subject: "Thanks for attending [Webinar Title]!"                   │ │
│ │ Preview: "Here's what you missed + the replay link..."             │ │
│ │ Delay: Day 0 (immediate after trigger)                             │ │
│ │ Template: Webinar Follow-up                                        │ │
│ │                                                                     │ │
│ │ ┌─ Content Preview ──────────────────────────────────────────┐    │ │
│ │ │ Hi {{first_name}},                                         │    │ │
│ │ │                                                             │    │ │
│ │ │ Thank you for attending [Webinar Title] yesterday.          │    │ │
│ │ │ Here's the replay link and key takeaways...                 │    │ │
│ │ │                                                             │    │ │
│ │ │ [Watch Replay →]                                           │    │ │
│ │ └─────────────────────────────────────────────────────────────┘    │ │
│ │                                                                     │ │
│ │ [Edit Email]  [A/B Test Subject]  [Preview in Inbox]               │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Email Performance Detail

```
┌─────────────────────────────────────────────────────────────────┐
│ Email 1: "Thanks for attending..."                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ Summary ────────────────────────────────────────────────┐  │
│  │ Sent: 287  │  Delivered: 281 (97.9%)  │  Opened: 129    │  │
│  │ Open Rate: 45.9%  │  Clicked: 34  │  CTR: 12.1%        │  │
│  │ Bounced: 4 (hard: 1, soft: 3)  │  Unsub: 0             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─ Engagement Over Time ───────────────────────────────────┐  │
│  │                                                           │  │
│  │  Opens ▁▂▄▆█▇▅▃▂▁                                        │  │
│  │  (peak at 4h after send, 80% within 24h)                 │  │
│  │                                                           │  │
│  │  Clicks ▁▃▅█▇▄▂▁                                        │  │
│  │  (peak at 6h after send)                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─ Top Clicked Links ──────────────────────────────────────┐  │
│  │ 1. [Watch Replay →] — 28 clicks (82% of all clicks)      │  │
│  │ 2. [Register for Next Webinar →] — 4 clicks (12%)        │  │
│  │ 3. [Download Slides →] — 2 clicks (6%)                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─ Device Breakdown ───────────────┐  ┌─ Client ──────────┐  │
│  │ 📱 Mobile: 62%                   │  │ Gmail: 45%        │  │
│  │ 💻 Desktop: 31%                  │  │ Outlook: 28%      │  │
│  │ 📧 Other: 7%                     │  │ Apple Mail: 18%   │  │
│  └──────────────────────────────────┘  │ Other: 9%         │  │
│                                         └───────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.4 Mailing List Builder

(See section 2.2 filter builder wireframe above)

### 4.5 Analytics Tab

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Analytics                                                     [30d ▼]  │
│                                                                         │
│ ┌─ Channel Overview ──────────────────────────────────────────────────┐│
│ │                                                                     ││
│ │  Email          LinkedIn       Podcast        Website       YouTube ││
│ │  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐  ┌──────┐ ││
│ │  │ Sent    │   │ Posts   │   │ Episodes│   │ Posts   │  │Videos│ ││
│ │  │ 12,480  │   │ 47      │   │ 8       │   │ 12      │  │  4   │ ││
│ │  │ ↑ 18%   │   │ ↑ 23%   │   │ → 0%    │   │ ↑ 8%    │  │ ↑33%│ ││
│ │  ├─────────┤   ├─────────┤   ├─────────┤   ├─────────┤  ├──────┤ ││
│ │  │ Open    │   │ Impr.   │   │ Downloads│  │ Views   │  │Views │ ││
│ │  │ Rate    │   │ 12,340  │   │ 2,847   │   │ 3,420   │  │ 1,240│ ││
│ │  │ 38%     │   │ ↑ 31%   │   │ ↑ 12%   │   │ ↑ 15%   │  │ ↑45%│ ││
│ │  ├─────────┤   ├─────────┤   ├─────────┤   ├─────────┤  ├──────┤ ││
│ │  │ Click   │   │ Engage  │   │ Complet.│   │ Conv.   │  │Watch │ ││
│ │  │ Rate    │   │ Rate    │   │ Rate    │   │ Rate    │  │ Time │ ││
│ │  │ 14%     │   │ 4.2%    │   │ 72%     │   │ 3.8%    │  │ 8.2m│ ││
│ │  │ ↑ 2pp   │   │ ↑ 0.5pp │   │ ↓ 3%    │   │ → 0%    │  │ ↑12%│ ││
│ │  └─────────┘   └─────────┘   └─────────┘   └─────────┘  └──────┘ ││
│ └─────────────────────────────────────────────────────────────────────┘│
│                                                                         │
│ ┌─ Email Performance Trend (30 days) ────────────────────────────────┐ │
│ │  50% ┤                                              ●              │ │
│ │      │   ●           ●                       ●                     │ │
│ │  40% ┤       ●   ●       ●       ●   ●   ●       ●               │ │
│ │      │   ●               ●   ●               ●                     │ │
│ │  30% ┤                                                             │ │
│ │      └──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──   │ │
│ │         Jul 1              Jul 15                      Jul 30      │ │
│ │                                                                     │ │
│ │  ── Open Rate  ── Click Rate  ── Industry Avg                      │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─ Campaign Attribution ─────────────────────────────────────────────┐ │
│ │ Campaign          │ Emails │ Opens │ Clicks │ Registrations │ Rev  │ │
│ │ Q3 Webinar Series │ 4,200  │ 1,512 │ 588    │ 87            │ $26K │ │
│ │ LEAP Launch       │ 3,100  │ 1,271 │ 434    │ 124           │ $37K │ │
│ │ Monthly Newsletter│ 5,180  │ 1,864 │ 726    │ 34            │ $10K │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.6 Empty States

| State | Message | Action |
|-------|---------|--------|
| No sequences | "No email sequences yet. Create your first automated sequence." | [Create Sequence] |
| No mailing lists | "No mailing lists. Build your first segment." | [Create List] |
| No scheduled content | "Nothing scheduled. Pick content from the calendar to schedule." | [Schedule Content] [Go to Content Calendar] |
| No analytics | "No distribution data yet. Send your first email or publish content to see metrics." | [Go to Sequences] |
| Sequence paused | "This sequence is paused. 189 contacts are waiting." | [Resume] [View Enrolled] |

---

## 5. Design Requirements

### 5.1 Component Library

| Component | Specs |
|-----------|-------|
| Sequence Card | 320×140px, border-radius: 12px, status dot (green=active, gray=draft, amber=paused), progress bar for completion rate |
| Timeline Email Node | 120×100px, border-radius: 10px, connected by arrow (delay label on arrow), drag handle for reorder |
| Channel Badge | Pill, 24×18px, color-coded per channel (email=blue, linkedin=blue-dark, podcast=purple, website=green, youtube=red) |
| Metric Card | 140×80px, large number + trend arrow + sparkline, color-coded trend (green=up, red=down, gray=flat) |
| Calendar Cell | Full width per day, rows per channel, content blocks within (color-coded by channel, click to expand) |
| Filter Rule Row | 320×36px, dropdown + operator dropdown + value input + remove button |
| A/B Test Card | Side-by-side comparison, winner highlighted with green border + crown icon |
| Engagement Chart | Line chart with gradient fill, 200×80px, hover tooltip with exact value |

### 5.2 Interactions & Animations

| Interaction | Animation |
|-------------|-----------|
| Timeline email drag | Node lifts (shadow-md), others shift smoothly, snap to position on drop |
| Email metric hover | Tooltip with breakdown appears above cursor, 150ms fade |
| Calendar conflict | Cell flashes amber/red, tooltip shows conflict detail |
| Sequence activate | Toggle slides, status dot transitions gray→green with pulse |
| A/B winner declared | Winner card scales up slightly + green glow, loser fades to 50% opacity |
| Send progress | Progress bar fills with percentage, real-time counter updates |

### 5.3 Keyboard Navigation

| Key | Action |
|-----|--------|
| `Cmd+K` | Global search (sequences, lists, scheduled content) |
| `Cmd+N` | New sequence |
| `Cmd+Shift+S` | Schedule content |
| `1/2/3/4/5` | Switch tabs (Sequences, Calendar, Lists, Analytics, Automations) |
| `Space` | Preview selected sequence |
| `Enter` | Open selected sequence detail |
| `Cmd+E` | Export current view as CSV |

---

## 6. Technical Backend Wiring

### 6.1 Supabase Schema

```sql
-- ═══════════════════════════════════════════════════════════════
-- TABLE: email_sequences (expanded from v1.0)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE email_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'welcome', 'nurture', 'launch', 'cross_sell',
    're_engagement', 'webinar_followup', 'custom'
  )),
  trigger_type TEXT NOT NULL CHECK (trigger_type IN (
    'manual', 'on_registration', 'on_assessment_complete',
    'on_campaign_start', 'on_event_attend', 'on_time_delay', 'on_score_change'
  )),
  trigger_config JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  campaign_id UUID REFERENCES campaigns(id),
  mailing_list_id UUID REFERENCES mailing_lists(id),
  total_emails INTEGER DEFAULT 0,
  total_duration_days INTEGER DEFAULT 0,
  enrollment_count INTEGER DEFAULT 0,
  completion_rate FLOAT DEFAULT 0,
  avg_open_rate FLOAT DEFAULT 0,
  avg_click_rate FLOAT DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_email_sequences_status ON email_sequences(status);
CREATE INDEX idx_email_sequences_type ON email_sequences(type);
CREATE INDEX idx_email_sequences_campaign ON email_sequences(campaign_id);
CREATE INDEX idx_email_sequences_trigger ON email_sequences(trigger_type);

-- ═══════════════════════════════════════════════════════════════
-- TABLE: sequence_emails (expanded from v1.0)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE sequence_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID NOT NULL REFERENCES email_sequences(id) ON DELETE CASCADE,
  "order" INTEGER NOT NULL,
  subject TEXT NOT NULL,
  subject_variant_b TEXT,
  preview_text TEXT,
  content JSONB NOT NULL,
  content_variant_b JSONB,
  delay_days INTEGER NOT NULL DEFAULT 0,
  delay_hours INTEGER DEFAULT 0,
  template_id UUID REFERENCES templates(id),
  send_time_optimization BOOLEAN DEFAULT false,
  ab_split_ratio FLOAT DEFAULT 0.5,
  ab_winner_criterion TEXT CHECK (ab_winner_criterion IN ('open_rate', 'click_rate', 'manual')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'sending', 'sent', 'paused')),
  sent_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  bounced_count INTEGER DEFAULT 0,
  unsubscribed_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(sequence_id, "order")
);

CREATE INDEX idx_sequence_emails_sid ON sequence_emails(sequence_id);
CREATE INDEX idx_sequence_emails_order ON sequence_emails(sequence_id, "order");

-- ═══════════════════════════════════════════════════════════════
-- TABLE: mailing_lists (expanded from v1.0)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE mailing_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'static' CHECK (type IN ('static', 'dynamic', 'campaign', 'event', 'segmented')),
  filters JSONB DEFAULT '[]'::jsonb,
  filter_match_mode TEXT DEFAULT 'all' CHECK (filter_match_mode IN ('all', 'any')),
  auto_update BOOLEAN DEFAULT false,
  parent_list_id UUID REFERENCES mailing_lists(id),
  contact_count INTEGER DEFAULT 0,
  campaign_id UUID REFERENCES campaigns(id),
  event_id UUID REFERENCES events(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_mailing_lists_type ON mailing_lists(type);
CREATE INDEX idx_mailing_lists_campaign ON mailing_lists(campaign_id);

-- ═══════════════════════════════════════════════════════════════
-- TABLE: mailing_list_contacts (expanded from v1.0)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE mailing_list_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES mailing_lists(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT now(),
  removed_at TIMESTAMPTZ,
  added_by UUID REFERENCES auth.users(id),
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'auto_filter', 'import', 'registration')),
  UNIQUE(list_id, contact_id)
);

CREATE INDEX idx_mlc_list ON mailing_list_contacts(list_id);
CREATE INDEX idx_mlc_contact ON mailing_list_contacts(contact_id);

-- ═══════════════════════════════════════════════════════════════
-- TABLE: content_schedules (expanded from v1.0)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE content_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES content_assets(id),
  channel TEXT NOT NULL CHECK (channel IN (
    'email', 'linkedin', 'podcast', 'website', 'youtube', 'webhook'
  )),
  scheduled_at TIMESTAMPTZ NOT NULL,
  published_at TIMESTAMPTZ,
  status TEXT DEFAULT 'scheduled' CHECK (status IN (
    'scheduled', 'pending_approval', 'approved', 'publishing',
    'published', 'failed', 'cancelled'
  )),
  published_url TEXT,
  channel_specific_content JSONB,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES auth.users(id),
  ai_send_time_score FLOAT,
  conflict_warning TEXT,
  campaign_id UUID REFERENCES campaigns(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_content_schedules_date ON content_schedules(scheduled_at);
CREATE INDEX idx_content_schedules_channel ON content_schedules(channel);
CREATE INDEX idx_content_schedules_status ON content_schedules(status);
CREATE INDEX idx_content_schedules_asset ON content_schedules(asset_id);

-- ═══════════════════════════════════════════════════════════════
-- TABLE: email_metrics
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE email_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id UUID NOT NULL REFERENCES sequence_emails(id),
  contact_id UUID NOT NULL REFERENCES contacts(id),
  event_type TEXT NOT NULL CHECK (event_type IN (
    'sent', 'delivered', 'opened', 'clicked', 'bounced_hard',
    'bounced_soft', 'unsubscribed', 'spam_complaint'
  )),
  clicked_url TEXT,
  device_type TEXT,
  email_client TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_email_metrics_email ON email_metrics(email_id);
CREATE INDEX idx_email_metrics_contact ON email_metrics(contact_id);
CREATE INDEX idx_email_metrics_event ON email_metrics(event_type);
CREATE INDEX idx_email_metrics_date ON email_metrics(created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- TABLE: sequence_enrollments
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE sequence_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID NOT NULL REFERENCES email_sequences(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id),
  current_email_order INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped', 'unsubscribed')),
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  dropped_at_email INTEGER,
  UNIQUE(sequence_id, contact_id)
);

CREATE INDEX idx_seq_enrollments_seq ON sequence_enrollments(sequence_id);
CREATE INDEX idx_seq_enrollments_contact ON sequence_enrollments(contact_id);
CREATE INDEX idx_seq_enrollments_status ON sequence_enrollments(status);

-- ═══════════════════════════════════════════════════════════════
-- TABLE: suppression_list
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE suppression_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN (
    'unsubscribe', 'bounce_hard', 'spam_complaint', 'manual', 'gdpr_request'
  )),
  scope TEXT DEFAULT 'global' CHECK (scope IN ('global', 'sequence_specific')),
  sequence_id UUID REFERENCES email_sequences(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(email, scope, sequence_id)
);

CREATE INDEX idx_suppression_email ON suppression_list(email);

-- ═══════════════════════════════════════════════════════════════
-- TABLE: ab_tests
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id UUID NOT NULL REFERENCES sequence_emails(id),
  test_type TEXT NOT NULL CHECK (test_type IN ('subject_line', 'content', 'send_time', 'cta', 'channel')),
  variant_a JSONB NOT NULL,
  variant_b JSONB NOT NULL,
  split_ratio FLOAT DEFAULT 0.5,
  winner_criterion TEXT NOT NULL,
  test_duration_hours INTEGER DEFAULT 24,
  status TEXT DEFAULT 'running' CHECK (status IN ('draft', 'running', 'completed', 'inconclusive')),
  winner TEXT CHECK (winner IN ('a', 'b', 'tie', 'inconclusive')),
  variant_a_metric FLOAT,
  variant_b_metric FLOAT,
  confidence_level FLOAT,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_ab_tests_email ON ab_tests(email_id);
CREATE INDEX idx_ab_tests_status ON ab_tests(status);

-- ═══════════════════════════════════════════════════════════════
-- TABLE: automation_rules
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL,
  trigger_config JSONB NOT NULL,
  conditions JSONB DEFAULT '[]'::jsonb,
  actions JSONB NOT NULL,
  status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error')),
  last_triggered_at TIMESTAMPTZ,
  trigger_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_automation_status ON automation_rules(status);
CREATE INDEX idx_automation_trigger ON automation_rules(trigger_type);

-- ═══════════════════════════════════════════════════════════════
-- TABLE: distribution_log
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE distribution_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES content_schedules(id),
  sequence_id UUID REFERENCES email_sequences(id),
  channel TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN (
    'scheduled', 'approved', 'published', 'failed', 'cancelled',
    'retry_scheduled', 'retry_failed'
  )),
  metadata JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_dist_log_channel ON distribution_log(channel);
CREATE INDEX idx_dist_log_date ON distribution_log(created_at DESC);
```

### 6.2 API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/sequences` | List sequences (filter, sort, paginate) |
| GET | `/api/sequences/:id` | Sequence detail with emails |
| POST | `/api/sequences` | Create sequence |
| PATCH | `/api/sequences/:id` | Update sequence |
| DELETE | `/api/sequences/:id` | Archive sequence |
| POST | `/api/sequences/:id/activate` | Activate sequence |
| POST | `/api/sequences/:id/pause` | Pause sequence |
| POST | `/api/sequences/:id/emails` | Add email to sequence |
| PATCH | `/api/sequences/:id/emails/:eid` | Update email in sequence |
| DELETE | `/api/sequences/:id/emails/:eid` | Remove email from sequence |
| POST | `/api/sequences/:id/emails/reorder` | Reorder emails |
| GET | `/api/sequences/:id/metrics` | Sequence performance metrics |
| GET | `/api/sequences/:id/emails/:eid/metrics` | Email-level metrics (opens, clicks, devices) |
| GET | `/api/sequences/:id/enrollments` | List enrolled contacts |
| POST | `/api/sequences/:id/enroll` | Enroll contact(s) |
| POST | `/api/sequences/:id/ab-test` | Create A/B test for email |
| GET | `/api/sequences/:id/ab-test` | Get A/B test results |
| GET | `/api/mailing-lists` | List mailing lists |
| GET | `/api/mailing-lists/:id` | List detail + contacts |
| POST | `/api/mailing-lists` | Create list |
| PATCH | `/api/mailing-lists/:id` | Update list (filters, name) |
| DELETE | `/api/mailing-lists/:id` | Delete list |
| POST | `/api/mailing-lists/:id/evaluate` | Re-evaluate dynamic list filters |
| POST | `/api/mailing-lists/:id/contacts` | Add contacts to list |
| DELETE | `/api/mailing-lists/:id/contacts/:cid` | Remove contact from list |
| GET | `/api/mailing-lists/:id/preview` | Preview contacts matching filters |
| GET | `/api/schedules` | List scheduled content (with date range) |
| POST | `/api/schedules` | Schedule content for distribution |
| PATCH | `/api/schedules/:id` | Reschedule / update |
| DELETE | `/api/schedules/:id` | Cancel scheduled content |
| POST | `/api/schedules/:id/approve` | Approve for publishing |
| POST | `/api/schedules/:id/publish` | Publish now |
| GET | `/api/schedules/conflicts` | Check scheduling conflicts |
| GET | `/api/schedules/ai-optimize` | Get AI send time recommendations |
| POST | `/api/distribution/publish` | Execute multi-channel publish |
| GET | `/api/distribution/status/:id` | Check publishing status |
| GET | `/api/analytics/overview` | Multi-channel analytics overview |
| GET | `/api/analytics/email` | Email-specific analytics |
| GET | `/api/analytics/channel/:channel` | Per-channel analytics |
| GET | `/api/analytics/campaign/:id` | Campaign attribution analytics |
| GET | `/api/analytics/trends` | Trend data for charts |
| GET | `/api/suppression` | List suppression entries |
| POST | `/api/suppression` | Add to suppression list |
| DELETE | `/api/suppression/:id` | Remove from suppression |
| POST | `/api/suppression/import` | Import suppression CSV |
| GET | `/api/automations` | List automation rules |
| POST | `/api/automations` | Create automation rule |
| PATCH | `/api/automations/:id` | Update rule |
| POST | `/api/automations/:id/activate` | Activate/deactivate |
| GET | `/api/distribution-log` | Audit log of all distribution events |

### 6.3 Realtime Subscriptions

| Channel | Events | Purpose |
|---------|--------|---------|
| `email_metrics:{email_id}` | INSERT | Real-time open/click updates on email detail view |
| `schedules:changes` | INSERT, UPDATE | Calendar updates when content is scheduled/rescheduled |
| `sequences:{id}:enrollments` | INSERT, UPDATE | Enrollment changes on sequence detail |
| `distribution:status` | UPDATE | Publishing status changes |

### 6.4 Caching Strategy

| Data | Cache | TTL | Invalidation |
|------|-------|-----|--------------|
| Sequence list | SWR | 30s | On sequence create/update |
| Sequence metrics | SWR | 60s | On Realtime email_metrics event |
| Mailing list contacts | SWR | 60s | On contact add/remove |
| Calendar view | SWR | 30s | On schedule create/change |
| Analytics overview | SWR | 5min | Time-based |
| AI send time recommendations | No cache | — | Always fresh |

### 6.5 Background Jobs

| Job | Schedule | Purpose |
|-----|----------|---------|
| `send_scheduled_content` | Every 5 minutes | Check `content_schedules` WHERE scheduled_at ≤ now AND status = 'approved' → publish |
| `advance_sequence_emails` | Every 15 minutes | Check enrollments WHERE next email delay has elapsed → send next email |
| `evaluate_dynamic_lists` | Every 1 hour | Re-evaluate all dynamic mailing list filters → add/remove contacts |
| `update_email_metrics` | Every 10 minutes | Sync with email provider API for latest opens/clicks/bounces |
| `resolve_ab_tests` | Every 1 hour | Check if A/B test duration elapsed → declare winner |
| `detect_anomalies` | Every 6 hours | Compare metrics to historical average → flag drops > 20% |

---

## 7. AI Layer Specification

### 7.1 AI Personas

**Persona: Send Time Optimizer**
```yaml
name: "LYC Send Time Optimizer"
role: "Recommend optimal send time per content per channel"
model: deepseek-flash
temperature: 0.3
max_tokens: 300
system_prompt: |
  Analyze historical distribution data to recommend optimal send times.
  Consider: day-of-week patterns, time-of-day engagement, channel-specific
  best practices, audience timezone distribution.
  
  Return JSON: {recommended_time, confidence, reasoning, alternatives[]}
```

**Persona: Subject Line Scorer**
```yaml
name: "LYC Subject Line Scorer"
role: "Score email subject lines for open rate potential"
model: deepseek-flash
temperature: 0.4
max_tokens: 200
system_prompt: |
  Score subject lines on: curiosity, urgency, personalization, clarity, length.
  Compare against historical open rates for similar subject lines.
  
  Return JSON: {score, breakdown[], suggestions[], predicted_open_rate}
```

**Persona: Channel Router**
```yaml
name: "LYC Channel Router"
role: "Recommend best channels for content distribution"
model: deepseek-flash
temperature: 0.3
max_tokens: 300
system_prompt: |
  Given content type, topic, and target audience, recommend the best
  distribution channels ranked by expected engagement.
  
  Consider: historical channel performance, content format fit,
  audience channel preferences, current channel load.
  
  Return JSON: {channels: [{channel, score, reasoning, optimal_time}]}
```

### 7.2 AI Insight Types

| Insight | Trigger | Action |
|---------|---------|--------|
| Sequence drop-off | >40% contacts drop at specific email | "Email 3 has 42% drop-off. Consider shortening or changing subject." |
| Low open rate | Sequence avg open < 25% | "Open rates declining. Test new subject line approaches." |
| Best performer | Sequence with highest completion rate | "LEAP Welcome has 67% completion — highest ever. Use as template for new sequences." |
| Channel underutilized | Channel has 0 scheduled items in 7 days | "No LinkedIn posts scheduled in 7 days. Your audience expects 3-5x/week." |
| Send time anomaly | Actual send time far from AI recommendation | "You scheduled at 2pm. Historical data suggests 9am gets 23% more opens." |
| List growth stall | Mailing list size unchanged for 14 days | "LEAP list hasn't grown in 14 days. Consider adding to registration flow." |
| Bounce spike | Bounce rate > 5% in last send | "Hard bounce rate spiked to 7.2%. Check email list quality." |
| Unsubscribe spike | Unsubscribe rate > 1% in last send | "Unsubscribe rate at 1.3% (threshold: 0.5%). Review content relevance." |

---

## 8. Tickets

### Phase 1: P0 — Core Sequences + Lists + Scheduling (78h / ~3 weeks)

| Ticket | Title | Priority | Effort | Dependencies |
|--------|-------|----------|--------|--------------|
| DIST-001 | Supabase `email_sequences` + `sequence_emails` tables + RLS | P0 | 3h | TICKET-002 |
| DIST-002 | Email sequence list view (Supabase-backed, status groups) | P0 | 3h | DIST-001 |
| DIST-003 | Sequence create/edit form (name, type, trigger, list) | P0 | 4h | DIST-002 |
| DIST-004 | Email builder within sequence (subject, preview, content, delay) | P0 | 5h | DIST-003 |
| DIST-005 | Visual timeline (email nodes connected by delay arrows) | P0 | 4h | DIST-004 |
| DIST-006 | Drag-to-reorder emails in timeline | P0 | 2h | DIST-005 |
| DIST-007 | Sequence activate/pause/activate toggle | P0 | 2h | DIST-004 |
| DIST-008 | Supabase `mailing_lists` + `mailing_list_contacts` tables | P0 | 3h | TICKET-002 |
| DIST-009 | Mailing list list view (static + dynamic) | P0 | 2h | DIST-008 |
| DIST-010 | Mailing list create/edit (name, type, filters) | P0 | 4h | DIST-009 |
| DIST-011 | Dynamic list filter builder (cluster, score, assessment, etc.) | P0 | 5h | DIST-010 |
| DIST-012 | Filter preview (show matching contacts count + top 10) | P0 | 2h | DIST-011 |
| DIST-013 | Manual add/remove contacts from list | P0 | 2h | DIST-010 |
| DIST-014 | Auto-update logic for dynamic lists (hourly cron) | P0 | 4h | DIST-011 |
| DIST-015 | Supabase `content_schedules` table + RLS | P0 | 2h | TICKET-002 |
| DIST-016 | Multi-channel calendar view (week default, channel rows) | P0 | 5h | DIST-015 |
| DIST-017 | Schedule content modal (select asset, channel, date/time) | P0 | 4h | DIST-016 |
| DIST-018 | Conflict detection (same channel, same day/hour warnings) | P0 | 3h | DIST-016 |
| DIST-019 | Supabase `email_metrics` table | P0 | 2h | DIST-001 |
| DIST-020 | Email metrics tracking (sent, delivered, opened, clicked, bounced) | P0 | 4h | DIST-019 |
| DIST-021 | Per-email performance display (metrics + rates) | P0 | 3h | DIST-020 |
| DIST-022 | Per-sequence performance summary (enrollment, completion, rates) | P0 | 3h | DIST-021 |
| DIST-023 | Multi-channel publish action (LinkedIn, email, website, podcast) | P0 | 6h | DIST-015, TICKET-038 |
| DIST-024 | Supabase `sequence_enrollments` table + enrollment logic | P0 | 4h | DIST-001 |
| DIST-025 | Sequence enrollment: trigger-based auto-enroll | P0 | 4h | DIST-024, DIST-014 |
| DIST-026 | Distribution log table + audit trail | P0 | 2h | DIST-015 |

**Phase 1 subtotal: 26 tickets, 78h**

### Phase 2: P1 — Analytics + A/B Testing + AI (72h / ~3 weeks)

| Ticket | Title | Priority | Effort | Dependencies |
|--------|-------|----------|--------|--------------|
| DIST-027 | Supabase `ab_tests` table + A/B test framework | P1 | 4h | DIST-004 |
| DIST-028 | A/B test creation UI (subject, content, send time variants) | P1 | 4h | DIST-027 |
| DIST-029 | A/B test results display (winner, confidence, metrics) | P1 | 3h | DIST-028 |
| DIST-030 | A/B test auto-resolve (cron checks duration, declares winner) | P1 | 3h | DIST-027 |
| DIST-031 | Email performance detail view (opens over time, click links, devices, clients) | P1 | 4h | DIST-021 |
| DIST-032 | Multi-channel analytics dashboard (overview cards per channel) | P1 | 5h | DIST-022 |
| DIST-033 | Email performance trend charts (open rate, click rate over time) | P1 | 3h | DIST-021 |
| DIST-034 | Campaign attribution analytics (aggregate by campaign) | P1 | 4h | DIST-032 |
| DIST-035 | Channel-specific deep-dive (per channel: detailed metrics) | P1 | 4h | DIST-032 |
| DIST-036 | Anomaly detection (flag >20% drops vs historical average) | P1 | 3h | DIST-020 |
| DIST-037 | AI send time optimization (historical analysis + recommendation) | P1 | 4h | DIST-020, TICKET-004 |
| DIST-038 | AI subject line scoring (predict open rate potential) | P1 | 3h | TICKET-004 |
| DIST-039 | AI channel router (recommend best channels for content) | P1 | 3h | TICKET-004 |
| DIST-040 | Supabase `suppression_list` table + management UI | P1 | 3h | DIST-008 |
| DIST-041 | Supabase `automation_rules` table + builder UI | P1 | 5h | DIST-001, DIST-008 |
| DIST-042 | Automation trigger execution (on registration, assessment, etc.) | P1 | 5h | DIST-041 |
| DIST-043 | Distribution approval workflow (pending → approve/reject) | P1 | 3h | DIST-016 |
| DIST-044 | CSV export: sequences, email metrics, mailing lists | P1 | 2h | DIST-022 |
| DIST-045 | Sequence board view (Kanban by status) | P1 | 2h | DIST-002 |
| DIST-046 | Realtime email metrics (Realtime subscription for live updates) | P1 | 2h | DIST-020, Realtime |

**Phase 2 subtotal: 20 tickets, 72h**

### Phase 3: P2 — Advanced + Webhooks + Responsive (68h / ~2.5 weeks)

| Ticket | Title | Priority | Effort | Dependencies |
|--------|-------|----------|--------|--------------|
| DIST-047 | Channel-specific content formatting (LinkedIn char limit, etc.) | P2 | 4h | DIST-023 |
| DIST-048 | Content pre-publish checks (brand score, variables, conflicts, approval) | P2 | 3h | DIST-023, TPL-027 |
| DIST-049 | Calendar month view + list view alternatives | P2 | 3h | DIST-016 |
| DIST-050 | Sequence timeline Gantt view (all sequences on calendar) | P2 | 4h | DIST-005, DIST-016 |
| DIST-051 | Mailing list segmented view (subset of another list) | P2 | 3h | DIST-010 |
| DIST-052 | Contact engagement timeline (per-contact: all emails sent, opened, clicked) | P2 | 3h | DIST-020 |
| DIST-053 | Suppression list import (CSV) + bulk add | P2 | 2h | DIST-040 |
| DIST-054 | Outbound webhooks for delivery events (configurable URL + secret) | P2 | 4h | DIST-026 |
| DIST-055 | Sequence template (pre-built sequences: welcome, nurture, etc.) | P2 | 3h | DIST-003 |
| DIST-056 | AI insights: drop-off detection, low open rate, channel underutilized | P2 | 4h | DIST-036, DIST-037 |
| DIST-057 | Keyboard shortcuts (full navigation) | P2 | 2h | All above |
| DIST-058 | Responsive: tablet breakpoints | P2 | 2h | All above |
| DIST-059 | Responsive: mobile browse + approve | P2 | 3h | All above |
| DIST-060 | Accessibility: ARIA labels + keyboard nav + screen reader | P2 | 3h | All above |
| DIST-061 | Virtual scrolling for large mailing lists (1000+ contacts) | P2 | 2h | DIST-009 |
| DIST-062 | Background job: advance sequence emails (cron) | P2 | 3h | DIST-024 |
| DIST-063 | Background job: send scheduled content (cron) | P2 | 3h | DIST-015 |
| DIST-064 | Background job: evaluate dynamic lists (cron) | P2 | 2h | DIST-014 |
| DIST-065 | Background job: sync email metrics from provider | P2 | 3h | DIST-020 |
| DIST-066 | Performance optimization (cache, lazy load, bundle size) | P2 | 2h | All above |

**Phase 3 subtotal: 20 tickets, 68h**

### Summary

| Phase | Tickets | Hours | Duration |
|-------|---------|-------|----------|
| P0 (Core) | 26 | 78h | ~3 weeks |
| P1 (Analytics + AI) | 20 | 72h | ~3 weeks |
| P2 (Advanced) | 20 | 68h | ~2.5 weeks |
| **Total** | **66** | **218h** | **~8.5 weeks** |

**Expansion from v1.0:** 13 tickets → 66 tickets (+53 new), 52h → 218h (+166h)

---

## 9. Acceptance Criteria

### P0 (Must have for launch)

- [ ] Email sequences CRUD from Supabase with status management
- [ ] Visual timeline shows emails connected by delay, drag-to-reorder works
- [ ] Sequence activate/pause toggles work, enrolled contacts tracked
- [ ] Mailing lists: static (manual) + dynamic (filter-based) with auto-update
- [ ] Filter builder supports 10+ filter types (cluster, score, assessment, etc.)
- [ ] Multi-channel calendar shows scheduled content by day/channel
- [ ] Schedule content modal: select asset, channel, date/time, conflict check
- [ ] Conflict detection warns on same-channel-same-day (amber) and same-hour (red)
- [ ] Email metrics tracked: sent, delivered, opened, clicked, bounced, unsubscribed
- [ ] Per-email and per-sequence performance displays correctly
- [ ] Multi-channel publish triggers agent routes (LinkedIn, email, website, podcast, YouTube)
- [ ] Sequence enrollment: trigger-based auto-enroll works for registration and assessment
- [ ] Distribution log records all publish/schedule/cancel events
- [ ] All API routes authenticated and RLS policies active

### P1 (Analytics + AI)

- [ ] A/B test: create variants, split list, track metrics, declare winner
- [ ] Statistical significance calculation (95% confidence, min 100 per variant)
- [ ] Email performance detail: opens over time chart, top clicked links, device/client breakdown
- [ ] Multi-channel analytics dashboard: overview cards with trends per channel
- [ ] Campaign attribution: aggregate metrics across all distribution by campaign
- [ ] Anomaly detection: flags >20% drops vs historical average
- [ ] AI send time optimization: recommends best time with confidence score
- [ ] AI subject line scoring: 0-100 score with breakdown and suggestions
- [ ] AI channel router: ranks channels by expected engagement
- [ ] Suppression list: global + per-sequence, import CSV, auto-add on bounce/unsubscribe
- [ ] Automation builder: visual trigger → condition → action flow
- [ ] Distribution approval workflow: pending → approve/reject with comments
- [ ] CSV export for sequences, metrics, lists
- [ ] Realtime email metrics updates on detail view

### P2 (Advanced)

- [ ] Per-channel content formatting (LinkedIn char limit, YouTube description, etc.)
- [ ] Pre-publish checks: brand score, variables, conflicts, approval — block if failing
- [ ] Calendar month view + list view alternatives
- [ ] Sequence Gantt view: all sequences visualized on timeline
- [ ] Contact engagement timeline (per contact: everything that happened)
- [ ] Outbound webhooks for delivery events (Zapier/Make compatible)
- [ ] Pre-built sequence templates (welcome, nurture, cross-sell, re-engagement)
- [ ] AI insights: drop-off detection, low open rate, channel underutilized, bounce spike
- [ ] Keyboard shortcuts: full navigation without mouse
- [ ] Responsive: tablet + mobile
- [ ] Accessibility: ARIA, keyboard, screen reader
- [ ] Background jobs: send scheduled content, advance sequences, evaluate lists, sync metrics
- [ ] Performance: handles 1000+ contact mailing lists at 60fps

---

## 10. Component Architecture

### 10.1 Component Tree

```
DistributionEnginePage
├── DistributionHeader
│   ├── TabBar (Sequences | Calendar | Mailing Lists | Analytics | Automations)
│   └── GlobalActions (+ New Sequence | Schedule Content)
├── SequencesTab
│   ├── SequenceToolbar
│   │   ├── SearchBar
│   │   ├── FilterDropdowns (type, status, campaign)
│   │   └── NewSequenceButton
│   ├── SequenceList (grouped by status: Active, Draft, Paused, Archived)
│   │   └── SequenceCard[]
│   │       ├── TypeIcon, Name, Status dot
│   │       ├── Email count, duration, enrollment, completion
│   │       ├── Progress bar (completion)
│   │       ├── Open rate + CTR badges
│   │       └── Actions (Edit, Activate/Pause, Duplicate, Archive)
│   └── SequenceBoard (Kanban by status)
│       └── BoardColumn[status]
│           └── SequenceCard[]
├── SequenceDetailView
│   ├── SequenceOverview (trigger, list, enrollment, completion, rates)
│   ├── EmailTimeline
│   │   ├── EmailNode[] (subject, metrics, delay arrows)
│   │   ├── DragHandle (reorder)
│   │   ├── AddEmailButton
│   │   └── PreviewFullSequenceButton
│   ├── EmailDetailPanel
│   │   ├── Subject + PreviewText editor
│   │   ├── Content preview (rendered blocks)
│   │   ├── Delay configuration
│   │   ├── A/B Test toggle
│   │   └── EditEmailButton, PreviewInInboxButton
│   ├── SequenceMetrics
│   │   ├── EnrollmentChart (over time)
│   │   ├── DropoffFunnel (per email)
│   │   └── TrendSparklines (open rate, CTR)
│   └── EnrollmentList
│       └── EnrolledContact[] (name, email, current step, status)
├── EmailPerformanceDetail
│   ├── MetricSummary (sent, delivered, opened, clicked, bounced, unsubscribed)
│   ├── EngagementOverTimeChart (opens + clicks timeline)
│   ├── TopClickedLinks (ranked list with click counts)
│   ├── DeviceBreakdown (mobile/desktop/other pie chart)
│   ├── EmailClientBreakdown (Gmail/Outlook/Apple/other bar chart)
│   └── ABTestResults (if applicable)
├── CalendarTab
│   ├── CalendarToolbar
│   │   ├── ViewSwitcher (Week | Month | List | Gantt)
│   │   ├── DateRangePicker
│   │   ├── ChannelFilter (checkboxes per channel)
│   │   └── ScheduleContentButton
│   ├── WeekCalendarView
│   │   ├── DayColumn[]
│   │   │   ├── ChannelRow[]
│   │   │   │   └── ContentBlock[] (color-coded, click to expand)
│   │   │   └── ConflictWarning (if detected)
│   │   └── AIRecommendationBanner ("LinkedIn empty — schedule a post?")
│   ├── MonthCalendarView
│   ├── ListCalendarView
│   └── ScheduleContentModal
│       ├── ContentAssetSelector (from Content Calendar)
│       ├── ChannelSelector (checkboxes + per-channel preview)
│       ├── DateTimePerChannel (AI-suggested + manual override)
│       ├── ConflictCheck (real-time as date changes)
│       ├── PrePublishChecks (brand score, variables, approval)
│       └── ScheduleButton / PublishNowButton
├── MailingListsTab
│   ├── ListToolbar
│   │   ├── SearchBar
│   │   ├── FilterByType (static, dynamic, campaign, event)
│   │   └── NewListButton
│   ├── MailingListList
│   │   └── MailingListCard[]
│   │       ├── Name, Type badge, Auto-update indicator
│   │       ├── Contact count + trend
│   │       └── Actions (Edit, View Contacts, Use in Sequence)
│   ├── MailingListDetail
│   │   ├── ListOverview (type, filters, contact count, auto-update status)
│   │   ├── FilterBuilder (if dynamic)
│   │   │   ├── FilterRule[] (field + operator + value)
│   │   │   ├── MatchMode (ALL/ANY)
│   │   │   ├── AddRuleButton
│   │   │   └── PreviewMatchingContacts (count + top 10)
│   │   └── ContactTable
│   │       └── ContactRow[] (name, email, engagement score, added date)
│   └── SuppressionListManager
│       ├── SearchBar + AddButton
│       ├── SuppressionRow[] (email, reason, scope, date)
│       └── ImportCSVButton
├── AnalyticsTab
│   ├── ChannelOverviewCards (Email, LinkedIn, Podcast, Website, YouTube)
│   │   └── ChannelCard (key metric + trend + sparkline)
│   ├── EmailTrendChart (open rate + click rate over 7/30/90d)
│   ├── CampaignAttributionTable (campaign × metrics × revenue)
│   ├── ChannelDeepDive (per channel: detailed metrics + charts)
│   └── AnomalyAlerts (flagged metric drops)
├── AutomationsTab
│   ├── AutomationList
│   │   └── AutomationCard[] (name, trigger, status, last triggered, count)
│   └── AutomationBuilder
│       ├── TriggerSelector (type + config)
│       ├── ConditionBuilder (optional filters)
│       ├── ActionSelector (enroll in sequence, send email, notify, etc.)
│       └── ActivateToggle
├── ABTestModal
│   ├── TestTypeSelector (subject, content, send time, CTA, channel)
│   ├── VariantAEditor
│   ├── VariantBEditor
│   ├── SplitRatioSlider
│   ├── WinnerCriterionSelector
│   ├── TestDurationSelector
│   └── LaunchTestButton
└── CommandPalette (Cmd+K)
    ├── Search sequences, lists, scheduled content
    └── Quick actions: New sequence, Schedule content, Export
```

### 10.2 Key Component Interfaces

```typescript
// Email Sequence
interface EmailSequence {
  id: string;
  name: string;
  type: 'welcome' | 'nurture' | 'launch' | 'cross_sell' | 're_engagement' | 'webinar_followup' | 'custom';
  trigger_type: string;
  trigger_config: Record<string, any>;
  status: 'draft' | 'active' | 'paused' | 'archived';
  campaign_id: string | null;
  mailing_list_id: string | null;
  total_emails: number;
  total_duration_days: number;
  enrollment_count: number;
  completion_rate: number;
  avg_open_rate: number;
  avg_click_rate: number;
  emails: SequenceEmail[];
  created_at: string;
}

interface SequenceEmail {
  id: string;
  sequence_id: string;
  order: number;
  subject: string;
  subject_variant_b: string | null;
  preview_text: string | null;
  content: ContentBlock[];
  delay_days: number;
  delay_hours: number;
  template_id: string | null;
  send_time_optimization: boolean;
  status: 'draft' | 'ready' | 'sending' | 'sent' | 'paused';
  sent_count: number;
  opened_count: number;
  clicked_count: number;
  bounced_count: number;
  unsubscribed_count: number;
  open_rate: number;
  click_rate: number;
}

// Mailing List
interface MailingList {
  id: string;
  name: string;
  type: 'static' | 'dynamic' | 'campaign' | 'event' | 'segmented';
  filters: FilterRule[];
  filter_match_mode: 'all' | 'any';
  auto_update: boolean;
  contact_count: number;
  contacts: Contact[];
}

interface FilterRule {
  field: string;
  operator: 'is' | 'is_not' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'between';
  value: string | number | string[];
}

// Content Schedule
interface ContentSchedule {
  id: string;
  asset_id: string;
  asset_name: string;
  channel: 'email' | 'linkedin' | 'podcast' | 'website' | 'youtube' | 'webhook';
  scheduled_at: string;
  published_at: string | null;
  status: 'scheduled' | 'pending_approval' | 'approved' | 'publishing' | 'published' | 'failed' | 'cancelled';
  published_url: string | null;
  ai_send_time_score: number | null;
  conflict_warning: string | null;
  approval_status: 'pending' | 'approved' | 'rejected';
}

// Email Metrics
interface EmailMetricsDetail {
  email_id: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced_hard: number;
  bounced_soft: number;
  unsubscribed: number;
  spam_complaints: number;
  open_rate: number;
  click_rate: number;
  open_to_click_rate: number;
  engagement_over_time: { timestamp: string; opens: number; clicks: number }[];
  top_links: { url: string; clicks: number; percentage: number }[];
  devices: { type: string; count: number; percentage: number }[];
  clients: { name: string; count: number; percentage: number }[];
}

// A/B Test
interface ABTest {
  id: string;
  email_id: string;
  test_type: 'subject_line' | 'content' | 'send_time' | 'cta' | 'channel';
  variant_a: { content: any; metric: number; sample_size: number };
  variant_b: { content: any; metric: number; sample_size: number };
  split_ratio: number;
  winner_criterion: string;
  status: 'draft' | 'running' | 'completed' | 'inconclusive';
  winner: 'a' | 'b' | 'tie' | 'inconclusive';
  confidence_level: number;
}

// Channel Analytics
interface ChannelAnalytics {
  channel: string;
  period: string;
  primary_metric: { label: string; value: number; trend: number };
  secondary_metric: { label: string; value: number; trend: number };
  trend_data: { date: string; value: number }[];
  comparison_to_prior: number; // % change
}
```

---

## Appendix: Gap from v1.0

| Existing Ticket | Coverage in Expanded Spec |
|----------------|--------------------------|
| TICKET-031 (Email Seq List) | DIST-002 (Supabase-backed, status groups, search, filters) |
| TICKET-032 (Create/Edit Seq) | DIST-003, DIST-004, DIST-005, DIST-006 (expanded with visual timeline, drag-reorder) |
| TICKET-033 (Preview Timeline) | DIST-005, DIST-006 (visual timeline with metrics, drag-to-reorder) |
| TICKET-034 (Mailing List List) | DIST-009 (Supabase-backed, type badges, contact count) |
| TICKET-035 (Create/Edit List) | DIST-010, DIST-011, DIST-012 (filter builder, preview, dynamic lists) |
| TICKET-036 (Manual Add/Remove) | DIST-013 (expanded with bulk operations, search contacts) |
| TICKET-037 (Scheduling Calendar) | DIST-016, DIST-017, DIST-018 (multi-channel calendar, conflict detection) |
| TICKET-038 (Multi-Channel Publish) | DIST-023, DIST-047, DIST-048 (expanded with per-channel formatting, pre-publish checks) |
| TICKET-039 (Send Action) | DIST-025, DIST-062 (trigger-based auto-enroll + cron advance) |
| TICKET-040 (Performance Metrics) | DIST-021, DIST-022, DIST-031 (expanded with detail view, devices, clients) |
| TICKET-041 (A/B Test) | DIST-027, DIST-028, DIST-029, DIST-030 (full framework with significance testing) |
| TICKET-042 (Export Metrics) | DIST-044 (expanded to sequences + metrics + lists) |
| TICKET-043 (Auto-Update Logic) | DIST-014, DIST-064 (expanded with hourly cron, smart filter evaluation) |

**New capabilities (not in v1.0):**
- Visual email sequence timeline with drag-reorder
- Dynamic mailing list segmentation with filter builder
- Multi-channel calendar (week/month/list/Gantt views)
- AI send time optimization + subject line scoring + channel routing
- Full A/B testing framework with statistical significance
- Per-channel content formatting (LinkedIn, YouTube, podcast, etc.)
- Pre-publish checks (brand score, variables, conflicts, approval)
- Suppression list management (global + per-sequence)
- Automation builder (visual trigger → condition → action)
- Distribution approval workflow
- Realtime email metrics updates
- 6 background cron jobs
- Outbound webhooks for delivery events
- Campaign attribution analytics
- Anomaly detection
- 10 new Supabase tables
- 3 AI personas
- 50 API endpoints
