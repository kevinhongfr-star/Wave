-- ============================================================
-- WAVE — Full Supabase Migration
-- Version: 1.0 | Date: 2026-07-15 | Author: NEXUS
-- Source: Backend_Schema_Alignment_Request.md + Notion_Data_Integration_Spec.md
-- 
-- IMPORTANT: Run in order. All tables use IF NOT EXISTS where possible.
-- Total: ~65 tables across core + 9 modules + infrastructure + Notion sync
-- ============================================================

-- ============================================================
-- SECTION 0: CORE SHARED TABLES (WAVE / VISTA / DEX AI)
-- ============================================================

-- 0.1 Companies
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  industry TEXT,
  size TEXT,
  region TEXT,
  tier TEXT,
  status TEXT DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 0.2 Contacts (central entity — all 3 apps reference this)
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  title TEXT,
  company_id UUID REFERENCES companies(id),
  source TEXT,
  tags TEXT[] DEFAULT '{}',
  tier TEXT,
  status TEXT DEFAULT 'active',
  b2b_readiness_score NUMERIC DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_contacts_tier ON contacts(tier);

-- 0.3 Cross-App Sync Log
CREATE TABLE IF NOT EXISTS cross_app_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_app TEXT NOT NULL,
  source_event_id TEXT,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sync_source ON cross_app_sync_log(source_app);
CREATE INDEX IF NOT EXISTS idx_sync_processed ON cross_app_sync_log(processed) WHERE processed = FALSE;

-- 0.4 Cross-App Contact Mapping
CREATE TABLE IF NOT EXISTS contact_app_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id),
  app_name TEXT NOT NULL,
  app_contact_id TEXT NOT NULL,
  UNIQUE(contact_id, app_name)
);

-- ============================================================
-- SECTION 1: MODULE 1 — DASHBOARD & INTELLIGENCE
-- ============================================================

CREATE TABLE IF NOT EXISTS action_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  priority INTEGER DEFAULT 5,
  source_module TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  read_by UUID[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_action_feed_resolved ON action_feed(resolved) WHERE resolved = FALSE;

CREATE TABLE IF NOT EXISTS ai_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_type TEXT NOT NULL,
  content TEXT,
  generated_for TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kpi_daily_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  snapshot_date DATE NOT NULL,
  UNIQUE(metric_name, snapshot_date)
);

CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module TEXT,
  insight_type TEXT,
  content TEXT,
  status TEXT DEFAULT 'pending',
  confidence NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  tasks_completed INTEGER DEFAULT 0,
  tasks_failed INTEGER DEFAULT 0,
  tokens_used BIGINT DEFAULT 0,
  metric_date DATE NOT NULL,
  UNIQUE(agent_name, metric_date)
);

CREATE TABLE IF NOT EXISTS notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  type TEXT,
  channel TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SECTION 2: MODULE 2 — CONTENT CALENDAR
-- ============================================================

-- Note: assets table created in Section 3 (needed as FK reference)

CREATE TABLE IF NOT EXISTS content_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID,
  scheduled_date DATE,
  channel TEXT,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID,
  version_number INTEGER NOT NULL,
  content_snapshot JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID,
  user_id UUID,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  view_name TEXT,
  filters JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT,
  priority INTEGER,
  competitor_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_edit_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID,
  user_id UUID,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ
);

-- ============================================================
-- SECTION 3: MODULE 3 — TEMPLATE & ASSET LIBRARY
-- ============================================================

CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT,
  folder_id UUID,
  status TEXT DEFAULT 'idea',
  file_url TEXT,
  -- Notion sync columns (NOTION-001)
  assigned_to TEXT,
  notion_phase TEXT,
  asset_priority TEXT,
  dependencies TEXT[] DEFAULT '{}',
  product_layer TEXT,
  notion_asset_id TEXT UNIQUE,
  asset_category TEXT,
  asset_format TEXT,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_notion_phase ON assets(notion_phase);
CREATE INDEX IF NOT EXISTS idx_assets_priority ON assets(asset_priority);

CREATE TABLE IF NOT EXISTS asset_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  parent_id UUID REFERENCES asset_folders(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS template_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id),
  event_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS template_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id),
  status TEXT DEFAULT 'pending',
  reviewer_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SECTION 4: MODULE 4 — DISTRIBUTION ENGINE
-- ============================================================

CREATE TABLE IF NOT EXISTS email_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT,
  status TEXT DEFAULT 'draft',
  trigger_type TEXT,
  campaign_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sequence_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID REFERENCES email_sequences(id),
  order_num INTEGER NOT NULL,
  subject TEXT,
  body TEXT,
  delay_days INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mailing_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT,
  campaign_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mailing_list_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID REFERENCES mailing_lists(id),
  contact_id UUID REFERENCES contacts(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(list_id, contact_id)
);

-- Note: content_schedules is separate from content_schedule (Mod 2)
-- Renaming to avoid confusion:
CREATE TABLE IF NOT EXISTS distribution_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID,
  channel TEXT,
  scheduled_at TIMESTAMPTZ,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id UUID,
  contact_id UUID REFERENCES contacts(id),
  event_type TEXT NOT NULL,
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sequence_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID REFERENCES email_sequences(id),
  contact_id UUID REFERENCES contacts(id),
  status TEXT DEFAULT 'active',
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(sequence_id, contact_id)
);

CREATE TABLE IF NOT EXISTS suppression_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id UUID,
  variant_a TEXT,
  variant_b TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  trigger_type TEXT,
  actions JSONB DEFAULT '{}',
  status TEXT DEFAULT 'inactive',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS distribution_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel TEXT,
  recipient TEXT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SECTION 5: MODULE 5 — B2C JOURNEY ENGINE
-- ============================================================

CREATE TABLE IF NOT EXISTS journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  trigger_type TEXT,
  category TEXT,
  status TEXT DEFAULT 'draft',
  canvas_state JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS journey_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id UUID REFERENCES journeys(id),
  node_type TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  position_x NUMERIC,
  position_y NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS journey_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_node_id UUID REFERENCES journey_nodes(id),
  to_node_id UUID REFERENCES journey_nodes(id),
  condition JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS journey_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id UUID REFERENCES journeys(id),
  contact_id UUID REFERENCES contacts(id),
  status TEXT DEFAULT 'active',
  current_node_id UUID,
  next_execution_at TIMESTAMPTZ,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_journey_instances_contact ON journey_instances(contact_id);
CREATE INDEX IF NOT EXISTS idx_journey_instances_next ON journey_instances(next_execution_at) WHERE status = 'active';

CREATE TABLE IF NOT EXISTS journey_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID REFERENCES journey_instances(id),
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS journey_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  nodes_json JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS b2b_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id),
  signal_type TEXT NOT NULL,
  confidence_score NUMERIC,
  status TEXT DEFAULT 'detected',
  vista_contact_id TEXT,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  routed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_b2b_signals_contact ON b2b_signals(contact_id);
CREATE INDEX IF NOT EXISTS idx_b2b_signals_status ON b2b_signals(status) WHERE status IN ('detected', 'verified');

CREATE TABLE IF NOT EXISTS cross_sell_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id),
  source_assessment TEXT,
  suggested_assessment TEXT,
  ai_confidence NUMERIC,
  ai_reasoning TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SECTION 6: MODULE 6 — CONTENT REPURPOSING
-- ============================================================

CREATE TABLE IF NOT EXISTS repurposing_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_asset_id UUID,
  strategy TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS repurposing_derivatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  map_id UUID REFERENCES repurposing_maps(id),
  derivative_type TEXT,
  channel TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_extractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_asset_id UUID,
  element_type TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS derivative_generation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  derivative_id UUID REFERENCES repurposing_derivatives(id),
  model_used TEXT,
  tokens INTEGER,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS derivative_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  derivative_id UUID REFERENCES repurposing_derivatives(id),
  metric_type TEXT,
  metric_value NUMERIC,
  measured_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SECTION 7: MODULE 7 — EVENTS & REGISTRATION
-- ============================================================

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  capacity INTEGER,
  pricing_tier TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  contact_id UUID REFERENCES contacts(id),
  status TEXT DEFAULT 'registered',
  payment_status TEXT DEFAULT 'pending',
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, contact_id)
);

CREATE TABLE IF NOT EXISTS event_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  title TEXT,
  speaker TEXT,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  contact_id UUID REFERENCES contacts(id),
  rating INTEGER,
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  contact_id UUID REFERENCES contacts(id),
  quality_score NUMERIC,
  follow_up_status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SECTION 8: MODULE 8 — ANALYTICS & INTELLIGENCE
-- ============================================================

CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module TEXT,
  snapshot_type TEXT,
  data JSONB DEFAULT '{}',
  period TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  budget NUMERIC,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT,
  action_type TEXT,
  success BOOLEAN,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS report_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type TEXT,
  recipients UUID[] DEFAULT '{}',
  frequency TEXT,
  next_run TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT,
  severity TEXT DEFAULT 'info',
  message TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS market_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT,
  signal_type TEXT,
  content TEXT,
  relevance_score NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SECTION 9: MODULE 9 — PRICING & PRODUCT CATALOG
-- ============================================================

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tier TEXT,
  category TEXT,
  base_price_cny NUMERIC,
  pricing_model TEXT,
  status TEXT DEFAULT 'active',
  never_discount BOOLEAN DEFAULT FALSE,
  capacity_total INTEGER,
  cross_sell_targets TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  component_product_ids UUID[] DEFAULT '{}',
  bundle_price_cny NUMERIC,
  discount_percent NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cross_sell_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_product_id UUID REFERENCES products(id),
  target_product_id UUID REFERENCES products(id),
  condition_type TEXT,
  delay_days INTEGER DEFAULT 0,
  success_rate NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS revenue_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  contact_id UUID REFERENCES contacts(id),
  company_id UUID REFERENCES companies(id),
  tier TEXT,
  actual_price_cny NUMERIC,
  discount_applied NUMERIC DEFAULT 0,
  cross_sell_rule_id UUID REFERENCES cross_sell_rules(id),
  phase TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pricing_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  start_month INTEGER,
  active_rules JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS discount_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  condition_type TEXT,
  discount_percent NUMERIC,
  never_discount_product_ids UUID[] DEFAULT '{}',
  frame_as TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS price_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  price_tested_cny NUMERIC,
  total_sold_full_price INTEGER DEFAULT 0,
  validated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SECTION 10: CROSS-PAGE INFRASTRUCTURE
-- ============================================================

CREATE TABLE IF NOT EXISTS user_workspace_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  page_id TEXT,
  state JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS layout_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  page_id TEXT,
  preset_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  target_date DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS guided_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  flow_type TEXT,
  status TEXT DEFAULT 'pending',
  current_step INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key TEXT UNIQUE NOT NULL,
  config_value JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS priority_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  score NUMERIC DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS health_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT,
  score NUMERIC DEFAULT 0,
  metrics JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SECTION 11: NOTION INTEGRATION (NOTION-002, NOTION-003)
-- ============================================================

CREATE TABLE IF NOT EXISTS build_tracker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deliverable_number INTEGER UNIQUE,
  deliverable_name TEXT NOT NULL,
  build_phase TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Building',
  assigned_to TEXT,
  completed_at TIMESTAMPTZ,
  notion_page_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_build_tracker_phase ON build_tracker(build_phase);
CREATE INDEX IF NOT EXISTS idx_build_tracker_status ON build_tracker(status);

CREATE TABLE IF NOT EXISTS notion_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_db TEXT NOT NULL,
  sync_type TEXT NOT NULL DEFAULT 'full',
  records_fetched INTEGER DEFAULT 0,
  records_upserted INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_details TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================================
-- SECTION 12: RLS POLICIES (basic — tighten as needed)
-- ============================================================

-- Enable RLS on all tables
DO $$ 
DECLARE 
  t TEXT;
  tables TEXT[] := ARRAY[
    'companies', 'contacts', 'cross_app_sync_log', 'contact_app_mapping',
    'action_feed', 'ai_briefs', 'kpi_daily_snapshots', 'ai_insights', 'agent_daily_metrics', 'notification_log',
    'content_schedule', 'content_versions', 'content_comments', 'saved_views', 'content_gaps', 'content_edit_activity',
    'templates', 'assets', 'asset_folders', 'template_analytics', 'template_approvals',
    'email_sequences', 'sequence_emails', 'mailing_lists', 'mailing_list_contacts', 'distribution_schedule',
    'email_metrics', 'sequence_enrollments', 'suppression_list', 'ab_tests', 'automation_rules', 'distribution_log',
    'journeys', 'journey_nodes', 'journey_edges', 'journey_instances', 'journey_events', 'journey_templates', 'b2b_signals', 'cross_sell_suggestions',
    'repurposing_maps', 'repurposing_derivatives', 'content_extractions', 'derivative_generation_logs', 'derivative_performance',
    'events', 'event_registrations', 'event_sessions', 'event_feedback', 'event_leads',
    'analytics_snapshots', 'campaigns', 'agent_logs', 'report_schedules', 'alerts', 'market_signals',
    'products', 'bundles', 'cross_sell_rules', 'revenue_records', 'pricing_phases', 'discount_rules', 'price_validations',
    'user_workspace_memory', 'layout_presets', 'milestones', 'guided_flows', 'system_config', 'priority_scores', 'health_scores',
    'build_tracker', 'notion_sync_log'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;

-- Basic policy: authenticated users can read all, service_role can write all
-- (Tighten per-table as the app matures)
DO $$ 
DECLARE 
  t TEXT;
  tables TEXT[] := ARRAY[
    'companies', 'contacts', 'cross_app_sync_log', 'contact_app_mapping',
    'action_feed', 'ai_briefs', 'kpi_daily_snapshots', 'ai_insights', 'agent_daily_metrics', 'notification_log',
    'content_schedule', 'content_versions', 'content_comments', 'saved_views', 'content_gaps', 'content_edit_activity',
    'templates', 'assets', 'asset_folders', 'template_analytics', 'template_approvals',
    'email_sequences', 'sequence_emails', 'mailing_lists', 'mailing_list_contacts', 'distribution_schedule',
    'email_metrics', 'sequence_enrollments', 'suppression_list', 'ab_tests', 'automation_rules', 'distribution_log',
    'journeys', 'journey_nodes', 'journey_edges', 'journey_instances', 'journey_events', 'journey_templates', 'b2b_signals', 'cross_sell_suggestions',
    'repurposing_maps', 'repurposing_derivatives', 'content_extractions', 'derivative_generation_logs', 'derivative_performance',
    'events', 'event_registrations', 'event_sessions', 'event_feedback', 'event_leads',
    'analytics_snapshots', 'campaigns', 'agent_logs', 'report_schedules', 'alerts', 'market_signals',
    'products', 'bundles', 'cross_sell_rules', 'revenue_records', 'pricing_phases', 'discount_rules', 'price_validations',
    'user_workspace_memory', 'layout_presets', 'milestones', 'guided_flows', 'system_config', 'priority_scores', 'health_scores',
    'build_tracker', 'notion_sync_log'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format(
      'CREATE POLICY "authenticated_read_%I" ON %I FOR SELECT TO authenticated USING (true)',
      t, t
    );
    EXECUTE format(
      'CREATE POLICY "service_role_all_%I" ON %I FOR ALL TO service_role USING (true) WITH CHECK (true)',
      t, t
    );
  END LOOP;
END $$;

-- ============================================================
-- END OF MIGRATION
-- Total tables: ~65
-- ============================================================
