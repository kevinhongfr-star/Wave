# Outreach Funnel → 365 Build Tracker → Supabase → DeepSeek Mapping

**Purpose:** Connect the refined outreach funnel to the existing 365 deliverables tracker (Notion), operational database (Supabase), and intelligence layer (DeepSeek).

---

## 1. FUNNEL STAGE → JOURNEY STAGE MAPPING

| Funnel Stage | Notion Journey Stage | Description |
|--------------|---------------------|-------------|
| Outreach (500 targets) | **Awareness** | They become aware of LYC through your message/content |
| Conversation (50+ meetings) | **Engagement** | Real dialogue, they share challenges |
| Opportunity (12 scored 7+) | **Diagnosis** | You diagnose their problem, map to product |
| Proposal (sent to 12) | **Development** | Tailored solution being developed |
| Paid (3 closed) | **Loyalty** | They're a client — nurture for expansion |
| Nurture (450+ non-converters) | **All Stages** | Cyclical — move through Awareness→Engagement repeatedly |

---

## 2. NOTION 365 TRACKER — ENTRIES TO ADD

The current Phase 3 database has 50 entries but is missing the **outreach-specific deliverables**. Add these:

### Outreach Infrastructure (NEW entries to add)

| # | Deliverable | Category | Format | Journey Stage | Product | Phase | Status |
|---|-------------|----------|--------|---------------|---------|-------|--------|
| 451 | 500-Target Hit List Spreadsheet | Sales Infrastructure | Spreadsheet | Awareness | LYC Partners | Phase 3 | Queued |
| 452 | Sniper Outreach Template (High-touch) | Communication Template | Document Spec | Awareness | LYC Partners | Phase 3 | Queued |
| 453 | Trojan Horse Outreach Template (Podcast) | Communication Template | Document Spec | Awareness | LYC Partners | Phase 3 | Queued |
| 454 | Farmer Outreach Template (Content-led) | Communication Template | Document Spec | Awareness | LYC Partners | Phase 3 | Queued |
| 455 | Weiqi Outreach Template (Ecosystem) | Communication Template | Document Spec | Awareness | LYC Partners | Phase 3 | Queued |
| 456 | Outreach Cadence Tracker | Sales Infrastructure | Spreadsheet | Awareness | LYC Partners | Phase 3 | Queued |
| 457 | Warmth Score Calculator | Sales Infrastructure | Framework | Awareness | LYC Partners | Phase 3 | Queued |
| 458 | Opportunity Scoring Matrix | Sales Infrastructure | Framework | Diagnosis | LYC Partners | Phase 3 | Queued |
| 459 | Nurture Sequence — Email (5 touches) | Email Sequence | Email Copy | Engagement | LYC Partners | Phase 3 | Queued |
| 460 | Nurture Sequence — LinkedIn (4 touches) | Communication Template | Document Spec | Engagement | LYC Partners | Phase 3 | Queued |
| 461 | Nurture Sequence — Webinar Invite | Event / Webinar | Document Spec | Engagement | LYC Partners | Phase 3 | Queued |
| 462 | Pipeline Velocity Dashboard | Sales Infrastructure | Spreadsheet | All Stages | LYC Partners | Phase 3 | Queued |
| 463 | Competitive Displacement Playbook | Sales Infrastructure | Document Spec | Diagnosis | LYC Partners | Phase 3 | Queued |
| 464 | Referral Request Template | Communication Template | Document Spec | Awareness | LYC Partners | Phase 3 | Queued |
| 465 | Multi-Threading Map (Top-25 Accounts) | Sales Infrastructure | Spreadsheet | Awareness | LYC Partners | Phase 3 | Queued |

### Existing Phase 3 entries that map to funnel

| Existing # | Deliverable | Funnel Stage | Journey Stage |
|------------|-------------|--------------|---------------|
| #307 | B2B Discovery Call Script | Conversation | Engagement |
| #306 | B2C Discovery Call Script | Conversation | Engagement |
| #337 | Discovery Call Script | Conversation | Engagement |
| #358 | Discovery Call Follow-Up Email | Conversation | Engagement |
| #405 | Discovery Conversation Brief Template | Conversation | Engagement |
| #334 | B2B Sales Email Sequence (5 Emails) | Nurture | Engagement |
| #395 | B2B Nurture Email Sequence (5 Emails) | Nurture | Engagement |
| #387 | B2C Nurture Email Sequence (5 Emails) | Nurture | Engagement |
| #341 | Engagement Proposal Template (B2B) | Proposal | Development |
| #340 | Engagement Proposal Template (B2C) | Proposal | Development |
| #270 | Quarterly Business Review Template | Paid | Loyalty |
| #347 | Client Referral Programme Guide | Paid → Outreach | Loyalty → Awareness |

---

## 3. SUPABASE OPERATIONAL DATABASE

### Tables needed for the outreach funnel

#### `outreach_contacts` (the 500-target list)
```sql
CREATE TABLE outreach_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT,
  company TEXT,
  company_size INT,
  industry TEXT,
  city TEXT,
  icp_category TEXT, -- which of 12 personas
  bucket TEXT CHECK (bucket IN ('sniper', 'trojan_horse', 'farmer', 'weiqi')),
  source TEXT, -- where found
  warmth_score INT CHECK (warmth_score BETWEEN 1 AND 5),
  linkedin_url TEXT,
  email TEXT,
  notes TEXT,
  funnel_stage TEXT DEFAULT 'outreach' CHECK (funnel_stage IN ('outreach', 'conversation', 'opportunity', 'proposal', 'paid', 'nurture')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `outreach_touches` (every message sent)
```sql
CREATE TABLE outreach_touches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES outreach_contacts(id),
  touch_number INT CHECK (touch_number BETWEEN 1 AND 5),
  channel TEXT CHECK (channel IN ('linkedin', 'email', 'intro', 'content_engagement')),
  message_template TEXT,
  message_custom TEXT,
  sent_at TIMESTAMPTZ,
  response TEXT, -- their reply
  response_at TIMESTAMPTZ,
  next_action TEXT,
  next_action_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `conversations` (meetings/calls)
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES outreach_contacts(id),
  meeting_date TIMESTAMPTZ,
  duration_minutes INT,
  type TEXT CHECK (type IN ('video', 'phone', 'coffee', 'event')),
  diagnostic_notes TEXT,
  challenge_stated TEXT, -- their problem
  tried_before TEXT, -- what they've tried
  magic_wand TEXT, -- "if you could fix one thing..."
  budget_signal TEXT,
  timeline_signal TEXT,
  decision_process TEXT,
  opportunity_score INT CHECK (opportunity_score BETWEEN 0 AND 13),
  classification TEXT CHECK (classification IN ('hot', 'warm', 'early', 'not_qualified')),
  next_steps TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `opportunities` (scored conversations → proposals)
```sql
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES outreach_contacts(id),
  conversation_id UUID REFERENCES conversations(id),
  product_mapped TEXT CHECK (product_mapped IN ('PRISM', 'BRIDGE', 'MOSAIC', 'SPARK', 'FORGE', 'SHIFT', 'ADVISORY', 'COACHING')),
  first_step TEXT, -- diagnostic, workshop, pilot
  first_step_price DECIMAL(10,2),
  full_engagement_price DECIMAL(10,2),
  proposal_sent_at TIMESTAMPTZ,
  proposal_followup_at TIMESTAMPTZ,
  negotiation_notes TEXT,
  status TEXT CHECK (status IN ('identified', 'proposed', 'negotiating', 'closed_won', 'closed_lost', 'nurture')),
  close_probability INT CHECK (close_probability BETWEEN 0 AND 100),
  expected_close_date DATE,
  actual_close_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `nurture_enrollments` (content/event nurture tracking)
```sql
CREATE TABLE nurture_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES outreach_contacts(id),
  nurture_type TEXT CHECK (nurture_type IN ('newsletter', 'podcast', 'webinar', 'workshop', 'linkedin_content', 'research')),
  enrolled_at TIMESTAMPTZ,
  last_touched_at TIMESTAMPTZ,
  engagement_count INT DEFAULT 0,
  next_touch_date DATE,
  status TEXT CHECK (status IN ('active', 'paused', 'converted', 'unsubscribed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `referrals` (Weiqi → Sniper conversion tracking)
```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_contact_id UUID REFERENCES outreach_contacts(id), -- the Weiqi ecosystem player
  referred_contact_id UUID REFERENCES outreach_contacts(id), -- the person they introduced
  referral_date DATE,
  referral_context TEXT,
  conversion_to_sniper BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. DEEPSEEK INTELLIGENCE LAYER

### What DeepSeek handles (via WAVE agent bridge)

| Function | Input | Output | Model |
|----------|-------|--------|-------|
| **Warmth score calculation** | Contact source + LinkedIn activity + engagement history | warmth_score (1-5) | flash |
| **Opportunity scoring** | Conversation transcript + notes | opportunity_score (0-13) + classification | pro |
| **Next message generation** | Contact profile + previous touches + template | Personalized outreach message | flash |
| **Content mapping** | Contact ICP + funnel stage | Recommended content piece + CTA | flash |
| **Pipeline health check** | All contacts + touches + conversations | Red flags + velocity analysis | pro |
| **Referral potential** | Weiqi contact activity + relationship depth | referral_potential (high/medium/low) | flash |

### DeepSeek API calls (example)

```python
# Opportunity scoring
response = deepseek_call(
    prompt=f"""
    Score this sales opportunity based on the conversation notes:
    
    Challenge stated: {conversation.challenge_stated}
    Budget signal: {conversation.budget_signal}
    Timeline: {conversation.timeline_signal}
    Decision process: {conversation.decision_process}
    Product fit: {opportunity.product_mapped}
    
    Score each dimension (0-3 for challenge, budget, timeline; 0-2 for product fit, decision clarity).
    Return JSON: {{"scores": {{"challenge": X, "budget": X, "timeline": X, "product_fit": X, "decision": X}}, "total": X, "classification": "hot|warm|early|not_qualified"}}
    """,
    model="pro"
)
```

---

## 5. WAVE MODULE → FUNNEL STAGE MAPPING

| WAVE Module | Funnel Stage | What It Does |
|-------------|--------------|--------------|
| **Content Calendar** | Awareness | Plans LinkedIn posts, articles, research that attract targets |
| **Distribution Engine** | Awareness → Engagement | Sends outreach (LinkedIn + Email), orchestrates multi-channel touches |
| **Template Library** | All Stages | Stores outreach templates, email sequences, proposal templates |
| **B2C Journey Engine** | Engagement → Nurture | Automated nurture sequences for non-converters |
| **Repurposing Engine** | Awareness | Turns one piece of content into multiple formats for different buckets |
| **Events & Registration** | Engagement | Webinars/workshops that convert nurture → conversation |
| **Analytics & Intelligence** | All Stages | Pipeline velocity, conversion rates, warmth scores, red flags |
| **Agent Bridge** | All Stages | Assigns tasks to Maria (email), Echo (LinkedIn), Carl (events), NEXUS (scoring) |

---

## 6. AGENT TASK ASSIGNMENTS

| Agent | Funnel Responsibility | WAVE Module | Trigger |
|-------|----------------------|-------------|---------|
| **Maria** | Email outreach + newsletter nurture | Distribution Engine, B2C Journey | New contact added → send first email |
| **Echo** | LinkedIn content + distribution | Content Calendar, Distribution Engine | Content published → distribute to relevant contacts |
| **Carl** | Webinar/workshop invitations | Events & Registration | Contact in nurture 30+ days → invite to next event |
| **NEXUS** | Pipeline intelligence + scoring | Analytics & Intelligence | Conversation completed → score opportunity |
| **Kevin** | Sniper conversations + proposals | — | Opportunity scored 10+ → Kevin calls within 24h |

---

## 7. AUTOMATION TRIGGERS

| Trigger | Action | Agent |
|---------|--------|-------|
| New contact added to `outreach_contacts` | Send first outreach message | Maria |
| 3 days no reply | Engage their LinkedIn content (like + comment) | Echo |
| 7 days no reply | Send second message (different angle) | Maria |
| 14 days no reply | Send third touch (value add — article/research) | Maria |
| 21 days no reply | Send final touch (event invite) | Carl |
| 28 days no reply | Move to nurture, stop outbound | System |
| Meeting booked | Generate pre-meeting research brief | NEXUS |
| Conversation completed | Score opportunity, classify | NEXUS |
| Score 10+ → hot opportunity | Alert Kevin, propose within 48h | NEXUS → Kevin |
| Proposal sent | Set 5-day follow-up reminder | System |
| Proposal follow-up due | Send follow-up email | Maria |
| Opportunity closed lost | Move to nurture, schedule 60-day re-engagement | System |
| Weiqi contact active 30+ days | Ask for referral | NEXUS |

---

## 8. METRICS DASHBOARD (WAVE Analytics Module)

| Metric | Source | Target |
|--------|--------|--------|
| Total outreach sent | `outreach_contacts` count | 500 by Day 90 |
| Response rate | `outreach_touches` with response / total touches | 11% (55 responses) |
| Conversation rate | `conversations` count / outreach sent | 10% (50 conversations) |
| Opportunity rate | `opportunities` with score 7+ / conversations | 22% (12 opportunities) |
| Proposal rate | `opportunities` with proposal_sent / opportunities | 100% (12 proposals) |
| Close rate | `opportunities` closed_won / proposals | 25% (3 closes) |
| Pipeline velocity | Avg days per stage | <30 days total |
| Nurture conversion | Contacts moving nurture → conversation | 5% (22 from 450) |
| Referral rate | `referrals` generated / Weiqi contacts | 40% (40 referrals from 100) |
| Warmth score trend | Avg warmth score over time | Increasing (more warm intros) |

---

*Mapping created: 2026-07-11 | NEXUS for Kevin Hong | LYC Partners*
