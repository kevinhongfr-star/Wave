# Backend Schema Alignment Request — WAVE / VISTA / DEX AI

**To:** DEX AI Team, VISTA Team
**From:** NEXUS (on behalf of Kevin)
**Date:** 2026-07-12
**Subject:** Backend Schema Mapping — WAVE + VISTA + DEX AI Consolidation Request

---

## Context

We're building three interconnected applications on a shared Supabase backend:

| App | Role | Scope |
|-----|------|-------|
| **WAVE** | Internal marketing intelligence | Marketing planning, asset generation, inbound lead tracking, B2C→B2B maturity detection, pricing intelligence |
| **VISTA** | Outbound sales engine | Outbound prospecting, lead management, sales pipeline |
| **DEX AI / Council Portal** | B2C career advisory | Career assessments, credit-based advisory, subscriptions, leadership development |

**The goal:** A single Supabase instance as the central backend. All three apps share core tables (contacts, companies) and communicate through a cross-app sync layer. Before we consolidate, we need each team's current or planned schema mapping.

---

## What We Need From You

Please provide:
1. **Your current/planned Supabase table definitions** (CREATE TABLE statements preferred, or a table list with key fields and types)
2. **How you identify contacts** (email? UUID? external ID?) — this is critical for cross-app linking
3. **How you identify companies** (domain? name? external ID?)
4. **Any existing event/webhook system** you use to communicate with other systems
5. **Your pricing/product model** (if applicable) — how products, tiers, or services are tracked

---

## WAVE Backend Schema (for your reference)

Below is WAVE's complete Supabase schema organized by domain.

### Core Shared Tables

#### contacts
> Central entity — all three apps reference this. **This is the most critical table for alignment.**

Key fields: `id (UUID)`, `email (unique)`, `first_name`, `last_name`, `phone`, `title`, `company_id (FK→companies)`, `source`, `tags`, `tier`, `status`, `b2b_readiness_score`, `metadata (JSONB)`

#### companies
Key fields: `id (UUID)`, `name`, `domain (unique)`, `industry`, `size`, `region`, `tier`, `status`, `metadata (JSONB)`

#### cross_app_sync_log
> The cross-app communication layer. Already designed to receive events from VISTA and DEX_AI.

```sql
CREATE TABLE cross_app_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_app TEXT NOT NULL,  -- 'VISTA', 'DEX_AI', 'WAVE'
  source_event_id TEXT,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Module 1: Dashboard & Intelligence

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `action_feed` | Actionable alerts across all modules | `type`, `title`, `priority`, `source_module`, `resolved`, `read_by[]` |
| `ai_briefs` | AI-generated daily/weekly briefs | `brief_type`, `content`, `generated_for`, `generated_at` |
| `kpi_daily_snapshots` | Daily KPI tracking | `metric_name`, `metric_value`, `snapshot_date` |
| `ai_insights` | AI-generated insights | `module`, `insight_type`, `content`, `status`, `confidence` |
| `agent_daily_metrics` | AI agent performance tracking | `agent_name`, `tasks_completed`, `tasks_failed`, `tokens_used` |
| `notification_log` | Notification audit trail | `user_id`, `type`, `channel`, `read` |

---

### Module 2: Content Calendar

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `content_schedule` | Content publication schedule | `asset_id`, `scheduled_date`, `channel`, `status` |
| `content_versions` | Asset version history | `asset_id`, `version_number`, `content_snapshot` |
| `content_comments` | Collaboration comments | `asset_id`, `user_id`, `content` |
| `saved_views` | User-saved filter views | `user_id`, `view_name`, `filters (JSONB)` |
| `content_gaps` | Identified content opportunities | `topic`, `priority`, `competitor_url` |
| `content_edit_activity` | Real-time edit tracking | `asset_id`, `user_id`, `started_at`, `ended_at` |

---

### Module 3: Template & Asset Library

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `templates` | Reusable marketing templates | `name`, `type`, `category`, `tags[]`, `status`, `usage_count` |
| `assets` | Marketing assets (files, documents) | `name`, `type`, `folder_id`, `status`, `file_url` |
| `asset_folders` | Folder structure | `name`, `parent_id` |
| `template_analytics` | Template usage tracking | `template_id`, `event_type`, `created_at` |
| `template_approvals` | Approval workflow | `template_id`, `status`, `reviewer_id` |

---

### Module 4: Distribution Engine

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `email_sequences` | Automated email sequences | `name`, `type`, `status`, `trigger_type`, `campaign_id` |
| `sequence_emails` | Individual emails in a sequence | `sequence_id`, `order`, `subject`, `body`, `delay_days` |
| `mailing_lists` | Audience lists | `name`, `type`, `campaign_id` |
| `mailing_list_contacts` | List membership | `list_id`, `contact_id` |
| `content_schedules` | Distribution scheduling | `asset_id`, `channel`, `scheduled_at`, `status` |
| `email_metrics` | Email performance tracking | `email_id`, `contact_id`, `event_type` (sent/opened/clicked/bounced) |
| `sequence_enrollments` | Who's in which sequence | `sequence_id`, `contact_id`, `status` |
| `suppression_list` | Do-not-contact list | `email`, `reason` |
| `ab_tests` | A/B test tracking | `email_id`, `variant_a`, `variant_b`, `status` |
| `automation_rules` | Distribution automation | `name`, `trigger_type`, `actions (JSONB)`, `status` |
| `distribution_log` | Distribution audit trail | `channel`, `recipient`, `status`, `created_at` |

---

### Module 5: B2C Journey Engine (Critical for DEX AI alignment)

> This is where B2C leads are nurtured and B2B readiness is detected. DEX AI events feed into this.

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `journeys` | Visual journey builder | `name`, `trigger_type`, `category`, `status`, `canvas_state (JSONB)` |
| `journey_nodes` | Journey steps (visual) | `journey_id`, `node_type` (trigger/email/wait/condition/cross_sell/signal_check/webhook), `config (JSONB)` |
| `journey_edges` | Connections between nodes | `from_node_id`, `to_node_id`, `condition (JSONB)` |
| `journey_instances` | Per-contact journey execution | `journey_id`, `contact_id`, `status`, `current_node_id`, `next_execution_at` |
| `journey_events` | Audit trail + analytics | `instance_id`, `event_type`, `event_data (JSONB)` |
| `journey_templates` | Pre-built journey templates | `name`, `category`, `nodes_json (JSONB)` |
| **`b2b_signals`** | **B2C→B2B maturity detection** | `contact_id`, `signal_type`, `confidence_score`, `status` (detected/verified/routed_to_vista/converted), `vista_contact_id` |
| `cross_sell_suggestions` | AI-driven cross-sell | `contact_id`, `source_assessment`, `suggested_assessment`, `ai_confidence`, `ai_reasoning` |

**Journey trigger types:** `on_registration`, `on_assessment_complete`, `on_content_viewed`, `on_event_registered`, `on_score_changed`, `on_time_based`, `on_manual`, `on_b2b_signal`, `on_cross_sell`, `on_webhook`

**Journey categories:** `onboarding`, `nurture`, `cross_sell`, `re_engagement`, `event_followup`, `b2b_routing`, `custom`

**B2B signal types:** `executive_title`, `large_company`, `team_purchase`, `consultation_request`, `engagement_spike`, `member_referral`

---

### Module 6: Content Repurposing

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `repurposing_maps` | Source → derivative mappings | `source_asset_id`, `strategy`, `status` |
| `repurposing_derivatives` | Generated derivative content | `map_id`, `derivative_type`, `channel`, `status` |
| `content_extractions` | Extracted content elements | `source_asset_id`, `element_type`, `content` |
| `derivative_generation_logs` | Generation audit | `derivative_id`, `model_used`, `tokens`, `status` |
| `derivative_performance` | Performance tracking | `derivative_id`, `metric_type`, `metric_value` |

---

### Module 7: Events & Registration

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `events` | Event master list | `name`, `type`, `start_date`, `end_date`, `capacity`, `pricing_tier`, `status` |
| `event_registrations` | Attendee registrations | `event_id`, `contact_id`, `status`, `checked_in_at` |
| `event_sessions` | Multi-session events | `event_id`, `title`, `speaker`, `scheduled_at` |
| `event_feedback` | Post-event feedback | `event_id`, `contact_id`, `rating`, `comments` |
| `event_leads` | Leads generated from events | `event_id`, `contact_id`, `quality_score`, `follow_up_status` |

---

### Module 8: Analytics & Intelligence

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `analytics_snapshots` | Periodic analytics data | `module`, `snapshot_type`, `data (JSONB)`, `period` |
| `campaigns` | Marketing campaign tracking | `name`, `status`, `budget`, `start_date`, `end_date` |
| `agent_logs` | AI agent activity logs | `agent_name`, `action_type`, `success`, `error` |
| `report_schedules` | Automated report scheduling | `report_type`, `recipients[]`, `frequency`, `next_run` |
| `alerts` | System alerts | `type`, `severity`, `message`, `resolved` |
| `market_signals` | External market intelligence | `source`, `signal_type`, `content`, `relevance_score` |

---

### Module 9: Pricing & Product Catalog

| Table | Purpose | Key Fields |
|-------|---------|------------|
| **`products`** | All products/services | `name`, `tier` (free/low_ticket/mid_ticket/high_ticket/search/council/platform), `category`, `base_price_cny`, `pricing_model` (one_time/monthly/annual/per_credit/...), `status`, `never_discount`, `capacity_total`, `cross_sell_targets[]` |
| `bundles` | Product bundles | `name`, `component_product_ids[]`, `bundle_price_cny`, `discount_percent` |
| `cross_sell_rules` | Automated cross-sell logic | `source_product_id`, `target_product_id`, `condition_type`, `delay_days`, `success_rate` |
| **`revenue_records`** | All revenue tracking | `product_id`, `contact_id`, `company_id`, `tier`, `actual_price_cny`, `discount_applied`, `cross_sell_rule_id`, `phase` |
| `pricing_phases` | Phase configuration | `slug` (wedge/prove/scale/premium), `start_month`, `active_rules (JSONB)` |
| `discount_rules` | Discount configuration | `condition_type`, `discount_percent`, `never_discount_product_ids[]`, `frame_as` |
| `price_validations` | Pricing validation tracking | `product_id`, `price_tested_cny`, `total_sold_full_price`, `validated` |

**Current product tiers:** `free`, `low_ticket`, `mid_ticket`, `high_ticket`, `search`, `council`, `platform`

> **Note:** v2 pricing adds Tier 1.5 (B2C/DEX AI products). We'll need to add `b2c_entry` as a new tier value.

---

### Cross-Page Infrastructure

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `user_workspace_memory` | User workspace state | `user_id`, `page_id`, `state (JSONB)` |
| `layout_presets` | Dashboard layout configs | `user_id`, `page_id`, `preset_name` |
| `milestones` | Project milestones | `title`, `target_date`, `status` |
| `guided_flows` | Onboarding/first-run flows | `user_id`, `flow_type`, `status`, `current_step` |
| `system_config` | Global settings | `config_key`, `config_value (JSONB)` |
| `priority_scores` | Task/content prioritization | `entity_type`, `entity_id`, `score` |
| `health_scores` | Module health tracking | `page_id`, `score`, `metrics (JSONB)` |

---

## Key Integration Points (What We Need to Align)

### 1. Contact Identity
WAVE uses `contacts.id (UUID)` as the primary key, with `email` as the unique business identifier. **All three apps must reference the same contact.** If DEX AI or VISTA has a different contact ID scheme, we need a mapping table:

```sql
-- Proposed: cross-app contact mapping
CREATE TABLE contact_app_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id),  -- WAVE central contacts
  app_name TEXT NOT NULL,  -- 'WAVE', 'VISTA', 'DEX_AI'
  app_contact_id TEXT NOT NULL,  -- ID in the source app
  UNIQUE(contact_id, app_name)
);
```

### 2. B2C Events → B2B Maturity
DEX AI user actions (assessment completion, credit purchases, subscription upgrades) need to flow into WAVE's `journey_events` and `b2b_signals` tables via `cross_app_sync_log`. Proposed event types:

| Event | Source | Triggers in WAVE |
|-------|--------|-----------------|
| `dex_ai.signup` | DEX AI | Create/update contact, start onboarding journey |
| `dex_ai.assessment_complete` | DEX AI | Update engagement score, trigger cross-sell |
| `dex_ai.credit_purchase` | DEX AI | Update contact tier, trigger nurture journey |
| `dex_ai.credit_consume` | DEX AI | Engagement signal (high consumption = high maturity) |
| `dex_ai.subscription_start` | DEX AI | Update contact tier to 'member' or 'pro' |
| `dex_ai.b2b_signal` | DEX AI | Create b2b_signal, notify VISTA |

### 3. B2B Signal Routing
When WAVE detects a B2B signal (via `b2b_signals` table), it should create a lead in VISTA. The `vista_contact_id` field already exists for this link. We need VISTA's API endpoint or table structure to push leads to.

### 4. Revenue Consistency
All revenue flows through WAVE's `revenue_records` for the master view. If VISTA or DEX AI processes payments independently, we need a sync mechanism to keep revenue_records updated.

---

## Proposed Consolidation Approach

1. **Each team shares their schema** → We identify overlaps and conflicts
2. **Agree on shared tables** → contacts, companies, cross_app_sync_log are shared by all
3. **App-specific tables stay in separate schemas** → `wave.*`, `vista.*`, `dex_ai.*` (Supabase schemas)
4. **Cross-app communication via cross_app_sync_log** → Event-driven, async, auditable
5. **Single `contacts` table** → One source of truth, all apps reference it

---

## Timeline

Please share your schema mapping by **2026-07-16** so we can:
- Identify conflicts and overlaps by 07-18
- Finalize consolidated schema by 07-21
- Begin implementation

---

*Generated by NEXUS on behalf of Kevin Hong*
*WAVE specs available at: https://github.com/kevinhongfr-star/Wave*
