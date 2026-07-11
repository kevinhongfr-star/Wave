
-- Outreach funnel operational tables
-- Created: 2026-07-11 | NEXUS for LYC Partners

-- 1. The 500-target hit list
CREATE TABLE IF NOT EXISTS outreach_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT,
  company TEXT,
  company_size INT,
  industry TEXT,
  city TEXT,
  icp_category TEXT,
  bucket TEXT CHECK (bucket IN ('sniper', 'trojan_horse', 'farmer', 'weiqi')),
  source TEXT,
  warmth_score INT DEFAULT 1 CHECK (warmth_score BETWEEN 1 AND 5),
  linkedin_url TEXT,
  email TEXT,
  notes TEXT,
  funnel_stage TEXT DEFAULT 'outreach' CHECK (funnel_stage IN ('outreach', 'conversation', 'opportunity', 'proposal', 'paid', 'nurture')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Every outreach touch (max 5 per contact)
CREATE TABLE IF NOT EXISTS outreach_touches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES outreach_contacts(id) ON DELETE CASCADE,
  touch_number INT CHECK (touch_number BETWEEN 1 AND 5),
  channel TEXT CHECK (channel IN ('linkedin', 'email', 'intro', 'content_engagement')),
  message_template TEXT,
  message_custom TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  response TEXT,
  response_at TIMESTAMPTZ,
  next_action TEXT,
  next_action_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Conversations (meetings/calls after response)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES outreach_contacts(id) ON DELETE CASCADE,
  meeting_date TIMESTAMPTZ,
  duration_minutes INT,
  type TEXT CHECK (type IN ('video', 'phone', 'coffee', 'event')),
  diagnostic_notes TEXT,
  challenge_stated TEXT,
  tried_before TEXT,
  magic_wand TEXT,
  budget_signal TEXT,
  timeline_signal TEXT,
  decision_process TEXT,
  opportunity_score INT CHECK (opportunity_score BETWEEN 0 AND 13),
  classification TEXT CHECK (classification IN ('hot', 'warm', 'early', 'not_qualified')),
  next_steps TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Opportunities (scored conversations → proposals)
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES outreach_contacts(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  product_mapped TEXT CHECK (product_mapped IN ('PRISM', 'BRIDGE', 'MOSAIC', 'SPARK', 'FORGE', 'SHIFT', 'ADVISORY', 'COACHING')),
  first_step TEXT,
  first_step_price DECIMAL(10,2),
  full_engagement_price DECIMAL(10,2),
  proposal_sent_at TIMESTAMPTZ,
  proposal_followup_at TIMESTAMPTZ,
  negotiation_notes TEXT,
  status TEXT DEFAULT 'identified' CHECK (status IN ('identified', 'proposed', 'negotiating', 'closed_won', 'closed_lost', 'nurture')),
  close_probability INT DEFAULT 50 CHECK (close_probability BETWEEN 0 AND 100),
  expected_close_date DATE,
  actual_close_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Nurture enrollments (content/event tracking for non-converters)
CREATE TABLE IF NOT EXISTS nurture_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES outreach_contacts(id) ON DELETE CASCADE,
  nurture_type TEXT CHECK (nurture_type IN ('newsletter', 'podcast', 'webinar', 'workshop', 'linkedin_content', 'research')),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  last_touched_at TIMESTAMPTZ DEFAULT NOW(),
  engagement_count INT DEFAULT 0,
  next_touch_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'converted', 'unsubscribed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Referrals (Weiqi → Sniper conversion tracking)
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_contact_id UUID REFERENCES outreach_contacts(id) ON DELETE CASCADE,
  referred_contact_id UUID REFERENCES outreach_contacts(id) ON DELETE SET NULL,
  referred_name TEXT,
  referred_title TEXT,
  referred_company TEXT,
  referral_date DATE DEFAULT CURRENT_DATE,
  referral_context TEXT,
  conversion_to_sniper BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_contacts_bucket ON outreach_contacts(bucket);
CREATE INDEX IF NOT EXISTS idx_contacts_stage ON outreach_contacts(funnel_stage);
CREATE INDEX IF NOT EXISTS idx_contacts_warmth ON outreach_contacts(warmth_score DESC);
CREATE INDEX IF NOT EXISTS idx_touches_contact ON outreach_touches(contact_id);
CREATE INDEX IF NOT EXISTS idx_conv_contact ON conversations(contact_id);
CREATE INDEX IF NOT EXISTS idx_opp_contact ON opportunities(contact_id);
CREATE INDEX IF NOT EXISTS idx_opp_status ON opportunities(status);
CREATE INDEX IF NOT EXISTS idx_nurture_contact ON nurture_enrollments(contact_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_contact_id);
