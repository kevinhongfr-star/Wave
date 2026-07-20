# WAVE — Product Vision: Marketing Operations Hub

**Version**: 2.0 (Redesign)
**Date**: 2026-07-20
**Status**: APPROVED — Kevin Hong
**Author**: NEXUS Agent

---

## 1. Product Definition

**WAVE** is LYC Partners' internal marketing operations hub — a closed-loop platform that manages the complete lifecycle of marketing content from creation through distribution to inbound tracking.

### What WAVE Is
- Campaign planner & tracker (per content, per channel)
- Content hub with asset storage and metadata
- Repurposing engine with AI-powered transformation workflows
- Distribution manager for email sequences and multi-channel publishing
- Mailing list manager with segmentation
- Inbound lead tracker with status pipeline
- Cross-module analytics and reporting

### What WAVE Is NOT
- NOT a visual design tool (use Canva, Figma)
- NOT a video editor (use CapCut, Riverside)
- NOT a document editor (use Notion)
- NOT a gated SaaS product (Kevin is the sole user)
- NOT a client-facing platform

### Core Principle
**Workflow engine, not dashboard.** Every page serves a workflow action: create, transform, distribute, track, respond.

---

## 2. Content Lifecycle (The Loop)

```
                         ┌──────────────────┐
                         │   INBOUND FLOW    │
                         │  Lead comes in    │
                         │  Track & respond  │
                         └────────┬─────────┘
                                  │
                                  ▼
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────────┐
│  CREATE  │───▶│  STORE   │───▶│ REPURPOSE│───▶│  DISTRIBUTE   │
│ Content  │    │ In Hub   │    │ N ways   │    │ M channels   │
│ (any fmt)│    │ Tag/Meta │    │ AI-powrd │    │ Email/Social │
└──────────┘    └──────────┘    └──────────┘    └──────────────┘
                                     │                  │
                                     ▼                  ▼
                              ┌──────────┐      ┌──────────────┐
                              │ Campaign │      │   MAILING     │
                              │  Link    │      │    LIST       │
                              │ to goals │      │  Segments     │
                              └──────────┘      └──────────────┘
```

Every content piece is tracked through this entire loop. WAVE knows:
- Where it came from (source)
- What it's been repurposed into (transformation chains)
- Which campaigns it feeds (campaign linkage)
- How it was distributed (channel + timing)
- What inbound it generated (feedback loop)

---

## 3. Module Overview

### 3.1 Campaign Planner
**Purpose**: Create, manage, and track marketing campaigns.

- Campaign per content piece OR per channel OR both
- Status pipeline: Planning → Active → Paused → Completed → Archived
- Goal setting (targets: leads, engagement, conversions)
- Timeline with milestones
- Linked entities: content_pieces, mailing_list segments, distribution_log, inbound
- Campaign types:
  - **Content Campaign**: Centered around a specific content piece
  - **Channel Campaign**: Centered around a channel (Q3 LinkedIn push)
  - **Account Campaign**: Centered around a target account/cluster

### 3.2 Content Hub
**Purpose**: Single source of truth for all marketing content assets.

- Content types: blog, video, webinar, podcast, newsletter, social_post, case_study, white_paper, email_template, presentation, infographic, diagnostic
- Metadata: source (Notion/manual/upload), status, owner, tags, language, linked campaigns
- Filters: type, status, date range, campaign, tag, source
- Link to Notion page for original content
- View repurposing chains

### 3.3 Repurposing Engine
**Purpose**: Transform one content piece into multiple formats, track each transformation.

- Select source content → choose target formats → AI generates (DeepSeek) → review → publish
- Each transformation = one "job" with status: queued → processing → review → approved → published → failed
- Repurposing chains visualization
- Checklist per job: quality check, brand consistency, platform optimization
- Manual override: can create jobs without AI
- Supported transformations (DeepSeek-powered):
  - Webinar → Blog post, Summary, Social posts, Email sequence
  - Blog → LinkedIn post, Twitter thread, Newsletter section, Case study
  - Podcast → Transcript summary, Key quotes, Social posts
  - Case study → Email sequence, Social posts, Presentation slides
  - Any → Executive summary, Key takeaways, FAQ format

### 3.4 Distribution Manager
**Purpose**: Schedule and track content distribution across channels.

- Channels: email, linkedin, website, social_media, partner_network, event
- Each distribution = content_piece + channel + campaign + scheduled_date + actual_date + status
- Email sequences linked to campaigns + mailing list segments
- Track: sent, opened, clicked, responded (via MS Graph API)
- Calendar view: what's being distributed when

### 3.5 Mailing List Manager
**Purpose**: Manage contacts, segments, and campaign assignments.

- Import from existing 4,310+ contacts in Supabase
- Contact fields: email, name, company, role, source, segment_tags, status
- Segments: custom tag-based groups
- Health metrics: active count, bounce rate, unsubscribe rate
- Campaign assignment: which contacts targeted by which campaigns
- Sync: MS Graph contacts, manual import/export (CSV)

### 3.6 Inbound Tracker
**Purpose**: Track inbound leads, inquiries, and responses.

- Sources: email inquiry, website form, webinar registration, LinkedIn message, event, referral
- Fields: contact_name, email, company, role, source, message, received_date
- Status pipeline: New → Acknowledged → Qualified → In Progress → Responded → Closed/Won → Closed/Lost
- Link to campaign: which campaign generated this inbound?
- Assignment: who owns the response?
- Response tracking: date responded, response method, outcome

### 3.7 Templates
**Purpose**: Reusable templates for each content type.

- Template per content type: email sequence, blog, social post, presentation
- Template fields: name, type, structure (JSON), variables, example output
- AI-powered generation: fill variables → DeepSeek generates content
- Library organized by: channel, purpose, industry/cluster

### 3.8 Analytics
**Purpose**: Cross-module metrics and reporting.

- Campaign performance: leads generated, content produced, distribution reach, inbound conversion
- Content performance: pieces created, repurposing throughput, distribution frequency
- Repurposing ROI: source pieces vs output, AI success rate
- Channel performance: which channels drive most inbound
- Mailing list health: growth rate, engagement trends
- Dashboard KPIs: active campaigns, content this month, repurposing completed, emails sent, new inbound, list health

### 3.9 Agent Bridge (AI Orchestrator)
**Purpose**: Central hub for all AI tasks routed to DeepSeek.

- Active AI jobs queue
- Job history with status
- Model selection: flash (fast) vs pro (reasoning)
- Token usage tracking
- Cost tracking
- Retry/override capabilities

---

## 4. Navigation Structure

```
Sidebar:
├── Dashboard          /dashboard
├── Campaigns          /dashboard/campaigns
├── Content Hub        /dashboard/content
├── Repurposing        /dashboard/repurposing
├── Distribution       /dashboard/distribution
├── Mailing List       /dashboard/mailing-list
├── Inbound            /dashboard/inbound
├── Templates          /dashboard/templates
├── Analytics          /dashboard/analytics
└── Agent Bridge       /dashboard/agents
```

---

## 5. Technology Stack

### Current (Keep)
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Backend**: Supabase (PostgreSQL + REST API)
- **Styling**: Tailwind CSS + custom design tokens
- **Deployment**: Vercel
- **AI**: DeepSeek API (flash + pro models)

### To Add
- **Validation**: zod (form + API validation)
- **Forms**: react-hook-form (campaign creation, contact management)
- **Charts**: recharts (analytics visualization)
- **Date handling**: date-fns (campaign timelines, scheduling)
- **Notifications**: sonner (toast notifications)
- **Animations**: framer-motion (status transitions)

### NOT Adding
- Auth providers (solo user — no auth needed)
- CMS (Notion is the CMS)
- Email sending libraries (MS Graph API handles this)

---

## 6. Build Phases Summary

| Phase | Name | Scope | Hours | Batches | Tickets |
|-------|------|-------|-------|---------|---------|
| 1 | Foundation | DB schema, Campaign CRUD, Content Hub, Bug fixes | 20h | 3 | 12 |
| 2 | Repurposing Engine | Transformation jobs, DeepSeek, Chain tracking | 25h | 3 | 14 |
| 3 | Distribution + Inbound | Multi-channel distribution, Inbound tracker | 20h | 3 | 12 |
| 4 | Polish & Intelligence | Analytics, Agent Bridge, UI polish | 15h | 2 | 10 |
| **Total** | | | **80h** | **11** | **48** |

---

## 7. Success Criteria (Go-Live Checklist)

1. ✅ Can create a campaign, link it to content and contacts
2. ✅ Can see all content pieces with real status tracking
3. ✅ Can select a content piece, create repurposing jobs, track progress
4. ✅ Can view distribution schedule and history
5. ✅ Can manage mailing list segments
6. ✅ Can log inbound leads and track response status
7. ✅ Dashboard shows real cross-module KPIs
8. ✅ AI can actually repurpose content via DeepSeek
9. ✅ All data persists in Supabase and survives redeployment
10. ✅ Responsive enough to use on laptop

---

## 8. Cross-Reference Documents

| Document | Purpose |
|----------|---------|
| `01_DATA_MODEL.md` | Complete database schema (all tables, columns, types, relations) |
| `02_API_ROUTES.md` | All API route specifications (endpoints, methods, payloads) |
| `03_PHASE_1_FOUNDATION.md` | Phase 1 — 3 batches, 12 tickets |
| `04_PHASE_2_REPURPOSING.md` | Phase 2 — 3 batches, 14 tickets |
| `05_PHASE_3_DISTRIBUTION.md` | Phase 3 — 3 batches, 12 tickets |
| `06_PHASE_4_POLISH.md` | Phase 4 — 2 batches, 10 tickets |
| `07_TICKET_INDEX.md` | Master ticket index — all 48 tickets across all phases |

---

*Document generated: 2026-07-20 | Author: NEXUS Agent | Version 2.0*
