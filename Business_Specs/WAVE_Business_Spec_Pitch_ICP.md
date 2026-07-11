# WAVE — Business Specification, Objectives, Investor Pitch & ICP

**Version:** 1.0 | **Date:** 2026-07-11 | **Author:** NEXUS | **Owner:** Kevin Hong (CTO)
**Classification:** Confidential — For Investors, Board & Internal Stakeholders

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Specification](#2-business-specification)
3. [Business Objectives & Revenue Model](#3-business-objectives--revenue-model)
4. [Investor Pitch Deck](#4-investor-pitch-deck)
5. [Ideal Customer Profile (ICP)](#5-ideal-customer-profile-icp)
6. [Internal Stakeholder Blueprint](#6-internal-stakeholder-blueprint)
7. [Appendices](#7-appendices)

---

## 1. Executive Summary

**LYC Partners** is a premium leadership advisory firm building an AI-native marketing engine to replace the fragmented toolstack that every consulting firm cobbles together. **WAVE** is the inbound marketing operations pillar of that engine.

The problem is universal: leadership advisory firms spend 60% of their marketing effort on coordination — moving content between tools, chasing approvals, manually routing leads, guessing what to publish next. The result is slow cycles, inconsistent messaging, and a sales funnel that depends on heroic individual effort rather than system intelligence.

WAVE solves this by unifying **content planning → template creation → multi-channel distribution → automated customer journeys → B2B signal detection → revenue intelligence** into a single AI-orchestrated platform. One diagnostic insight becomes 10+ content touchpoints. One B2C assessment buyer is automatically nurtured toward Council membership. One B2B signal triggers an outbound route to the BD team — with full context.

**WAVE is not a SaaS product for sale.** It is LYC Partners' proprietary marketing infrastructure — a competitive moat that makes the firm operate with the efficiency of a 50-person marketing team while running a 9-person crew.

The broader opportunity: if WAVE proves out, the architecture (WAVE + VISTA + DEX AI) becomes a replicable playbook for professional services firms worldwide — a $492B addressable market by 2035.

---

## 2. Business Specification

### 2.1 What WAVE Is

WAVE is a **marketing operations platform** purpose-built for LYC Partners' demand generation engine. It manages the complete lifecycle of inbound marketing:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         WAVE PLATFORM                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │ Page 1:          │  │ Page 2:          │  │ Page 3:          │  │
│  │ Dashboard        │→ │ Content Calendar │→ │ Template &       │  │
│  │ (Command Center) │  │ (Editorial Hub)  │  │ Asset Library    │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│           │                     │                     │               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │ Page 4:          │  │ Page 5:          │  │ Page 6:          │  │
│  │ Distribution     │← │ B2C Journey      │← │ Content          │  │
│  │ Engine           │  │ Engine           │  │ Repurposing      │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│           │                     │                     │               │
│  ┌──────────────────┐  ┌──────────────────┐                          │
│  │ Page 7:          │  │ Page 8:          │                          │
│  │ Events &         │  │ Analytics &      │                          │
│  │ Registration     │  │ Intelligence     │                          │
│  └──────────────────┘  └──────────────────┘                          │
│                                                                       │
├─────────────────────────────────────────────────────────────────────┤
│  CROSS-PAGE INFRASTRUCTURE                                           │
│  Resizable panels · Split view · Focus Mode · Milestone tracker     │
│  Workspace memory · Priority engine · Health scores · Guided flows  │
│  Real-time multi-user · Layout presets · Cross-page drag & drop     │
├─────────────────────────────────────────────────────────────────────┤
│  AI LAYER (DeepSeek API)                                             │
│  Content Generator · Campaign Optimizer · Journey Optimizer         │
│  Priority Advisor · Health Analyst · Cross-Sell Predictor           │
│  Send Time Optimizer · Subject Line Scorer · B2B Signal Analyst     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 The 8 Modules

| Module | Purpose | Key Capability |
|--------|---------|---------------|
| **1. Dashboard** | Executive command center | AI morning brief, KPI health, priority feed, today's schedule |
| **2. Content Calendar** | Editorial planning & execution | Multi-view (table/calendar/board/timeline), AI gap detection, inline editing |
| **3. Template & Asset Library** | Content creation at scale | Notion-style block editor, AI generation, variable system, version control |
| **4. Distribution Engine** | Multi-channel publishing | Email sequences, mailing lists, scheduling calendar, A/B testing, 5-channel publishing |
| **5. B2C Journey Engine** | Automated customer lifecycle | Visual journey builder (12 node types), cross-sell chains, B2B signal detection |
| **6. Content Repurposing** | 1 → 10+ content multiplication | Automated derivative generation (webinar → article → LinkedIn → podcast → newsletter) |
| **7. Events & Registration** | Unified event management | Webinars, workshops, programs — registration, payments, attendance tracking |
| **8. Analytics & Intelligence** | Revenue-linked marketing ROI | Campaign attribution, content performance, journey conversion, revenue tracking |

### 2.3 Platform Ecosystem

WAVE does not operate in isolation. It is one pillar of LYC's three-platform architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     WAVE         │    │     VISTA        │    │     DEX AI       │
│  (Inbound)       │    │  (Outbound)      │    │  (B2C Portal)    │
│                  │    │                  │    │                  │
│ • Content        │───→│ • BD Pipeline    │    │ • Assessment     │
│ • Distribution   │    │ • Outreach       │    │   Delivery       │
│ • Journeys       │    │ • Account Mgmt   │    │ • Results        │
│ • Signals        │    │ • Proposals      │    │ • Recommendations│
│ • Analytics      │    │ • Revenue        │    │ • Next Steps     │
│                  │    │                  │    │                  │
│ Echo, Carl,      │    │ James, BD Team   │    │ Candidates,      │
│ Maria, Xuemei    │    │                  │    │ Assessors        │
└────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │        NEXUS             │
                    │   (AI Orchestrator)      │
                    │                          │
                    │  • Cross-platform logic  │
                    │  • Agent coordination    │
                    │  • Executive briefings   │
                    │  • Decision support      │
                    └──────────────────────────┘
```

**Data flow:** WAVE detects B2B signal → creates lead in VISTA → BD team follows up. DEX AI delivers assessments → results feed WAVE journey engine → cross-sell triggers.

### 2.4 Technical Architecture

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 14 (App Router) | SSR, API routes, React Server Components |
| Database | Supabase (PostgreSQL) | Auth, Realtime, Storage, Edge Functions — all-in-one |
| AI | DeepSeek API (flash + pro) | 10x cheaper than GPT-4, competitive quality |
| Hosting | Vercel | Zero-config Next.js deployment |
| Email | MS Graph API / SendGrid | Kevin's existing infrastructure |
| Podcast | Ausha API | Existing podcast hosting |
| Recording | Riverside | Existing recording tool |
| Communication | Feishu (Lark) | Team collaboration + bot integration |

### 2.5 What Makes WAVE Different from HubSpot / Marketo / ActiveCampaign

| Dimension | HubSpot / Marketo | WAVE |
|-----------|-------------------|------|
| **Purpose** | Generic marketing automation for any industry | Purpose-built for professional services / leadership advisory |
| **AI layer** | Bolt-on AI features (2025-2026 add-ons) | AI-native from day one — every surface has AI assistance |
| **Content creation** | None (bring your own content) | Integrated template library + AI generation + brand enforcement |
| **Diagnostic → Content** | No connection | Assessment result → personalized content journey automatically |
| **B2B signal detection** | Manual (sales rep identifies) | Automated (6 signal types, auto-routed to BD) |
| **Cross-sell** | Basic workflow rules | Diagnostic-triggered chain (LEAP → PRISM → BRIDGE → Council) |
| **UX standard** | Enterprise admin panel | Notion/Linear/Canva-level creative tool feel |
| **Cost** | $800-$3,200/month + implementation | Proprietary — no per-seat licensing, DeepSeek at ~¥60/day |
| **Integration** | API + Zapier | Shared Supabase database with VISTA + DEX AI (zero-latency) |

---

## 3. Business Objectives & Revenue Model

### 3.1 Revenue Model

WAVE is not sold as a SaaS product. It is LYC Partners' internal marketing engine that drives revenue through three channels:

```
                    WAVE-DRIVEN REVENUE ARCHITECTURE

┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  CHANNEL 1: B2C Assessment Sales                                 │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │ Content → Registration → Assessment Purchase              │   │
│  │                                                           │   │
│  │ Products: LEAP ($295), QUEST ($195), COACH ($395),       │   │
│  │           DRIVE ($295), IMPACT ($395)                     │   │
│  │ Target: 500+ assessments/year                             │   │
│  │ Revenue: ~$150K/year                                      │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                   │
│  CHANNEL 2: B2B Consulting Engagements                          │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │ B2C Signal → VISTA Lead → BD Follow-up → Engagement      │   │
│  │                                                           │   │
│  │ Products: BRIDGE ($15K-$50K), FORGE ($25K-$75K),         │   │
│  │           MOSAIC ($50K-$150K), SPARK ($30K-$80K)          │   │
│  │ Target: 20+ engagements/year from WAVE-sourced leads      │   │
│  │ Revenue: ~$600K-$1.2M/year                                │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                   │
│  CHANNEL 3: Council Membership                                   │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │ Assessment → Journey → Cross-sell → Council Invitation   │   │
│  │                                                           │   │
│  │ Product: Council ($5K-$25K/year membership)              │   │
│  │ Target: 30+ members by Year 2                             │   │
│  │ Revenue: ~$150K-$750K/year (recurring)                    │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                   │
│  TOTAL TARGET (Year 2): $900K - $2.1M/year                      │
│  WAVE-Attributable Share: 60-80% of inbound pipeline            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Business Objectives

**Phase 1: Foundation (Months 1-3)**
- [ ] WAVE MVP operational: Content Calendar + Template Library + Distribution Engine
- [ ] Team onboarded: Echo, Carl, Maria using WAVE daily
- [ ] 1,000+ contacts in mailing lists
- [ ] 5 active email sequences (welcome, nurture, launch, cross-sell, re-engagement)
- [ ] First BRIDGE/IMPACT webinar: 100+ registrations, 50+ attendees

**Phase 2: Automation (Months 3-6)**
- [ ] B2C Journey Engine active: automated LEAP → PRISM → BRIDGE cross-sell chain
- [ ] 100+ LEAP assessments sold via WAVE-driven funnel
- [ ] B2B signal detection operational: 5+ signals/week routed to VISTA
- [ ] Content repurposing engine: 1 webinar → 10+ derivatives within 48 hours
- [ ] First B2B engagement sourced from WAVE signal

**Phase 3: Intelligence (Months 6-12)**
- [ ] Full analytics operational: campaign attribution, journey conversion, revenue tracking
- [ ] AI optimization active: send time, subject line, cross-sell timing, channel routing
- [ ] 500+ total contacts, 30%+ assessment completion rate
- [ ] Council membership: 10+ members recruited through WAVE journey
- [ ] WAVE-attributed revenue: $300K+ in Year 1

**Phase 4: Scale (Year 2)**
- [ ] 2,000+ contacts, 50+ B2B signals/year
- [ ] Council: 30+ members
- [ ] WAVE-attributed revenue: $900K+
- [ ] Architecture documented as a repeatable internal playbook for future team scaling

### 3.3 Key Performance Indicators

| KPI | Target (Month 6) | Target (Month 12) | Target (Month 24) |
|-----|-----------------|-------------------|-------------------|
| Contact database size | 1,000 | 2,500 | 5,000 |
| Monthly content pieces published | 20 | 40 | 60 |
| Email sequence open rate | 35% | 42% | 45% |
| B2C assessments sold/month | 15 | 40 | 80 |
| B2B signals detected/month | 5 | 12 | 25 |
| B2B signals → VISTA lead conversion | 70% | 80% | 90% |
| Journey completion rate | 25% | 35% | 45% |
| Cross-sell acceptance rate | 15% | 25% | 35% |
| Content repurposing ratio | 1:6 | 1:10 | 1:12 |
| WAVE-attributed revenue/month | $15K | $30K | $75K |
| Team hours saved vs. manual (est.) | 40h/month | 80h/month | 120h/month |

### 3.4 Cost Structure

| Cost Item | Monthly | Annual | Notes |
|-----------|---------|--------|-------|
| DeepSeek API | ~¥1,800 ($250) | ¥21,600 ($3,000) | All AI compute, ~¥60/day |
| Supabase | $25 (Pro) | $300 | Database, Auth, Storage, Realtime |
| Vercel | $20 (Pro) | $240 | Frontend hosting |
| Ausha | $19 | $228 | Podcast hosting |
| Riverside | $15 | $180 | Recording |
| LinkedIn API | Free (basic) | $0 | Organic posting |
| Domain + Email | $10 | $120 | Infrastructure |
| **Total** | **~$330/month** | **~$4,068/year** | |

**Cost efficiency:** HubSpot Marketing Hub Professional costs $890/month for comparable features (without AI, without diagnostic integration, without B2B signal detection). WAVE delivers more capability at 63% lower cost — and the gap widens as volume scales.

---

## 4. Investor Pitch Deck

### Slide 1: Title

> **LYC Intelligence**
> "Know where you stand. Know where to go."
> AI-Native Marketing Infrastructure for Professional Services

### Slide 2: The Problem

**Professional services firms run their revenue engine on duct tape.**

- Content planned in Notion → assets created in Canva → distributed via Buffer → leads tracked in HubSpot → BD managed in spreadsheets
- 6-8 tools, zero integration, constant context-switching
- Marketing teams spend 60% of time on coordination, 40% on strategy
- No connection between diagnostic insights and content delivery
- B2C buyers fall into a black hole after purchase — no automated nurture
- B2B signals from existing clients go undetected for months
- Result: slow cycles, inconsistent messaging, revenue leakage

**The cost:** A 9-person marketing team operates like a 3-person team because their tools don't talk to each other.

### Slide 3: The Solution

**WAVE + VISTA + DEX AI: One AI-native marketing engine.**

- **WAVE** (Inbound): Content → Distribution → Journeys → Intelligence
- **VISTA** (Outbound): Pipeline → Outreach → Account Management → Revenue
- **DEX AI** (Portal): Assessment Delivery → Results → Recommendations

All three share one database (Supabase). Zero integration latency. AI orchestration (NEXUS) coordinates everything.

**Key insight:** We don't sell the platform. We *use* the platform to generate revenue. The platform is our competitive moat.

### Slide 4: Market Opportunity

The marketing automation software market is **$112B in 2025**, growing at **16.4% CAGR** to **$492B by 2035** ([source](https://www.precedenceresearch.com/digital-marketing-software-market)).

Within that:
- **AI-powered marketing platforms** are the fastest-growing segment (23.7% CAGR for AI content generation)
- **Professional services** remain underserved — enterprise tools (HubSpot, Marketo) are too generic; SMB tools lack sophistication
- **Diagnostic-driven marketing** is a blue ocean — no platform connects assessment results to automated content journeys

**Our wedge:** The marketing automation market is $112B and growing at 16.4% CAGR. Most professional services firms spend $10K-$15K/year on generic tools (HubSpot, Marketo) that require 60%+ of their time on tool management rather than actual marketing. We built our own — purpose-built, AI-native, integrated with our own diagnostic products — at 63% lower cost. The platform makes LYC operate like a 50-person marketing team with 9 people. That operational leverage is the competitive advantage.

**Why this matters:** The broader market validates the approach — AI-powered marketing is the fastest-growing segment (23.7% CAGR for AI content generation). Firms spending $10K+/year on generic tools with no diagnostic integration and no B2B signal detection are leaving money on the table. We are not leaving money on the table.

### Slide 5: Product

**8 modules, 315 development tickets, 1,031 hours of detailed spec.**

| Capability | What It Does | Business Impact |
|-----------|-------------|-----------------|
| Content Calendar | AI-powered editorial planning with gap detection | 3x faster content planning |
| Template Library | Notion-style editor + AI generation + brand enforcement | 5x faster content creation |
| Distribution Engine | Email sequences + 5-channel publishing + A/B testing | Automated multi-channel reach |
| B2C Journey Engine | Visual builder + 12 node types + cross-sell chains | Zero-human B2C sales funnel |
| B2B Signal Detection | 6 signal types → auto-route to BD team | Catch $100K+ deals earlier |
| Content Repurposing | 1 webinar → 10+ derivatives automatically | 10x content multiplication |
| Analytics & Intelligence | Campaign ROI + journey conversion + revenue attribution | Data-driven marketing decisions |

**UX standard:** Notion/Linear/Canva-level. Not enterprise admin panel. Every element inline-editable. Nothing static. Full Supabase connectivity.

### Slide 6: Business Model

**Revenue through the platform, not from the platform.**

| Revenue Channel | Year 1 | Year 2 | Year 3 |
|----------------|--------|--------|--------|
| B2C Assessments | $75K | $150K | $300K |
| B2B Engagements (WAVE-sourced) | $200K | $600K | $1.2M |
| Council Membership | $50K | $300K | $750K |
| **Total** | **$325K** | **$1.05M** | **$2.25M** |

**Unit economics:**
- CAC (B2C): <$50 (content-driven, organic)
- CAC (B2B): <$500 (signal-detected, inbound)
- LTV (B2C assessment): $295-$395
- LTV (B2B engagement): $25K-$150K
- LTV (Council member): $5K-$25K/year × 3 years avg = $15K-$75K
- **LTV:CAC ratio:** 50:1 (B2B), 6:1 (B2C)

### Slide 7: Competitive Advantage

| Factor | HubSpot | ActiveCampaign | Custom Build (typical) | WAVE |
|--------|---------|---------------|----------------------|------|
| Cost/year | $10,680 | $3,000-$15,000 | $50K-$200K dev + $10K/yr maintenance | $4,068 |
| AI-native | Partial (2025 add-on) | Partial | None | Yes (DeepSeek, 10+ AI personas) |
| Diagnostic → Content | No | No | Custom only | Built-in |
| B2B signal detection | No | No | No | Built-in (6 signal types) |
| Cross-sell automation | Basic | Basic | Custom only | Diagnostic-triggered chains |
| Professional services fit | Generic | Generic | Varies | Purpose-built |
| Integration with BD (VISTA) | API + Zapier | API + Zapier | Custom | Shared database (zero latency) |
| UX quality | Enterprise | Mid-market | Varies | Notion/Linear/Canva-level |

**Moat:** The platform encodes LYC's specific go-to-market logic (7 clusters, 11 products, diagnostic → content → cross-sell → Council path). No generic tool can replicate this.

### Slide 8: Traction & Milestones

**Built to date (July 2026):**
- ✅ Complete product architecture: 3 platforms (WAVE + VISTA + DEX AI)
- ✅ Detailed business requirements: 685-line BRD
- ✅ Intelligence layer spec: AI-native design with DeepSeek integration
- ✅ 5 page specs fully expanded: 315 tickets, 1,031 hours of development detail
- ✅ HTML prototype with LYC brand design system
- ✅ GitHub repository with Next.js application
- ✅ Vercel deployment (live)
- ✅ Database schema designed (Supabase)
- ✅ 87+ development tickets with full dependencies

**Next 90 days:**
- WAVE MVP operational (Content Calendar + Templates + Distribution)
- First webinar planned and executed through WAVE
- 500+ contacts in mailing lists
- First automated email sequences live

**Next 6 months:**
- B2C Journey Engine operational
- B2B signal detection live
- First WAVE-sourced B2B engagement closed

### Slide 9: Team

| Role | Name | Responsibility |
|------|------|---------------|
| CTO / Product Owner | Kevin Hong | Architecture, product decisions, revenue strategy |
| PM / Orchestrator | NEXUS (AI) | Specs, coordination, guardrails, documentation |
| Engineer | Trae (AI) | Code implementation, deployment |
| Content | Echo | Newsletter, LinkedIn, podcast, webinar |
| Events | Carl | Webinars, workshops, programs |
| Website | Valentina | Vercel publishing |
| Email | Maria | Sequences, lead management |
| Scripts | Xuemei | Podcast + webinar writing |
| BD | James / VISTA team | Outbound, proposals, account management |
| 8 Interns | Vanjulla, Ava, Hareesha, Sumaya, Muhammad, Isam, Magnus, Raphael | Podcast production, intelligence, platform content |

**Key advantage:** AI-augmented team. NEXUS, Trae, James are AI agents — not headcount. The human team is 7 people producing output equivalent to a 20+ person marketing department.

### Slide 10: The Ask

**WAVE is internal infrastructure. Not for sale. Not SaaS.**

WAVE is self-funded internal infrastructure. Development cost: ~$5K (DeepSeek API + tools). Running cost: ~$330/month. It is not a product. It is our marketing engine.

**What we're building toward:**
1. **Prove the model:** WAVE drives $1M+ in attributable revenue within 18 months
2. **Document the playbook:** Architecture, specs, AI orchestration patterns — so any new team member or future agent can operate it
3. **Scale the model:** Apply the same AI-augmented playbook to new revenue streams, new geographies, new product lines

**If you're interested in how a 9-person team runs a $1M+ revenue engine on $330/month of infrastructure**, let's talk after we hit $1M in proven revenue. The moat isn't the software — it's the integration of diagnostics, content, AI, and domain expertise that no off-the-shelf tool can replicate.

---

## 5. Ideal Customer Profile (ICP)

### 5.1 Primary ICP: B2C Assessment Buyer

**Who:** Mid-career professionals (30-55) seeking leadership development, self-awareness, or career transition support.

| Attribute | Detail |
|-----------|--------|
| **Demographics** | 30-55 years old, MBA or equivalent, Director/VP/Senior Manager level |
| **Geography** | Global (English-speaking): US, UK, EU, APAC, Middle East |
| **Income** | $80K-$300K/year (can afford $295-$395 assessments) |
| **Psychographics** | Self-improvement oriented, data-driven decision maker, values external validation, career-conscious |
| **Pain points** | "Am I on the right track?", "What's my leadership blind spot?", "How do I get to the next level?" |
| **Where they find us** | LinkedIn content, podcast, newsletter, webinar, Google (SEO from website articles) |
| **Buying trigger** | Career transition, promotion consideration, team conflict, leadership challenge, curiosity after seeing LYC content |

**Journey through WAVE:**
```
Content Discovery → Newsletter Signup → Free Resource → LEAP Assessment ($295)
    → Results Email → PRISM Suggestion (7 days) → PRISM ($495)
    → BRIDGE Invitation (14 days) → BRIDGE Program ($15K-$50K)
    → Council Invitation (30 days) → Council Membership ($5K-$25K/year)
```

**Expected conversion rates:**
- Content → Newsletter: 5-8%
- Newsletter → LEAP: 3-5%
- LEAP → PRISM: 20-30%
- PRISM → BRIDGE: 10-15%
- BRIDGE → Council: 15-25%

### 5.2 Secondary ICP: B2B Decision Maker (Signal-Detected)

**Who:** Senior executives in large organizations who show B2B buying signals through their B2C engagement.

| Attribute | Detail |
|-----------|--------|
| **Demographics** | 40-60 years old, C-suite/VP/Board level |
| **Company** | 500+ employees, $100M+ revenue |
| **Geography** | Global |
| **Pain points** | "My leadership team is misaligned", "We need succession planning", "Our culture needs transformation" |
| **Signal triggers** | Job title (Director+), company size (500+), multiple team members from same company, consultation request, engagement spike |

**How they enter:**
```
B2C Assessment (LEAP/PRISM) → B2B Signal Detected → Auto-create VISTA Lead
    → BD Team Follow-up → Discovery Call → BRIDGE/FORGE/MOSAIC Engagement ($25K-$150K)
```

### 5.3 Tertiary ICP: HR/L&D Buyer (Inbound via Content)

**Who:** HR Directors, L&D Heads, CHROs seeking diagnostic tools for their organization.

| Attribute | Detail |
|-----------|--------|
| **Role** | HR Director, L&D Head, CHRO, Talent Development VP |
| **Company** | 200-5,000 employees |
| **Budget** | $10K-$100K/year for leadership development |
| **Pain points** | "How do we assess leadership potential at scale?", "We need data-driven succession planning" |
| **Content they consume** | Webinar on diagnostic AI, LinkedIn posts about leadership assessment, case studies |

**Journey:**
```
Content → Webinar Registration → Attend → Follow-up Sequence
    → Team Assessment Demo → PRISM for Teams ($5K-$15K)
    → Annual License → MOSAIC/SPARK Enterprise ($50K-$150K)
```

### 5.4 Anti-ICP (Who We Don't Serve)

| Not Our Customer | Why |
|-----------------|-----|
| Students / early-career (< 5 years exp) | Can't afford assessments, not ready for leadership development |
| Solo entrepreneurs / freelancers | No team context for B2B products, limited budget |
| Enterprise procurement (> 10,000 employees) | Too slow, too many stakeholders, requires dedicated BD (not self-serve) |
| Price-sensitive bargain hunters | Not willing to invest $295+ in self-assessment |
| Non-English speakers | Content is English-first (future: localize) |

---

## 6. Internal Stakeholder Blueprint

### 6.1 Stakeholder Map

```
┌─────────────────────────────────────────────────────────────────┐
│                     LYC PARTNERS STAKEHOLDERS                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─── STRATEGIC LAYER ────────────────────────────────────────┐ │
│  │                                                             │ │
│  │  Kevin Hong (CTO)                                          │ │
│  │  • Final authority on product, revenue, architecture       │ │
│  │  • KPIs: Revenue, pipeline, platform ROI                   │ │
│  │  • Cadence: Weekly overview, daily critical decisions      │ │
│  │                                                             │ │
│  │  NEXUS (AI Orchestrator)                                   │ │
│  │  • Specs, coordination, guardrails, documentation          │ │
│  │  • KPIs: System uptime, task completion, quality           │ │
│  │  • Cadence: Real-time                                      │ │
│  │                                                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─── OPERATIONAL LAYER ──────────────────────────────────────┐ │
│  │                                                             │ │
│  │  Echo (Content Manager)                                    │ │
│  │  • KPIs: Content pieces published, engagement rate,        │ │
│  │    newsletter opens, LinkedIn impressions                  │ │
│  │  • WAVE pages: Content Calendar, Templates, Distribution   │ │
│  │  • Cadence: Daily in WAVE                                  │ │
│  │                                                             │ │
│  │  Carl (Events Manager)                                     │ │
│  │  • KPIs: Webinar registrations, attendance rate,           │ │
│  │    post-event conversion                                   │ │
│  │  • WAVE pages: Events & Registration, Content Calendar     │ │
│  │  • Cadence: Daily during event cycles                      │ │
│  │                                                             │ │
│  │  Maria (Email Manager)                                     │ │
│  │  • KPIs: Open rate, click rate, sequence completion,       │ │
│  │    conversion per sequence                                 │ │
│  │  • WAVE pages: Distribution Engine, Mailing Lists          │ │
│  │  • Cadence: Daily                                          │ │
│  │                                                             │ │
│  │  Valentina (Web Manager)                                   │ │
│  │  • KPIs: Website traffic, SEO rankings, article views      │ │
│  │  • WAVE pages: Content Calendar (website channel)          │ │
│  │  • Cadence: 2-3x/week                                     │ │
│  │                                                             │ │
│  │  Xuemei (Script Writer)                                    │ │
│  │  • KPIs: Scripts delivered, on-time %, revision rounds     │ │
│  │  • WAVE pages: Templates (script templates)                │ │
│  │  • Cadence: Per project                                    │ │
│  │                                                             │ │
│  │  Emily (Registration Manager)                              │ │
│  │  • KPIs: Registration conversion, payment success,         │ │
│  │    form completion rate                                    │ │
│  │  • WAVE pages: Events & Registration                       │ │
│  │  • Cadence: Per event                                      │ │
│  │                                                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─── GROWTH LAYER ───────────────────────────────────────────┐ │
│  │                                                             │ │
│  │  James/AI + BD Team (VISTA)                                │ │
│  │  • KPIs: B2B leads from WAVE, pipeline value, close rate   │ │
│  │  • Interface: B2B signals from WAVE → VISTA leads          │ │
│  │  • Cadence: As signals arrive                              │ │
│  │                                                             │ │
│  │  Trae/AI (Engineer)                                        │ │
│  │  • KPIs: Tickets completed, bugs, deploy frequency         │ │
│  │  • Interface: Builds WAVE from specs                       │ │
│  │  • Cadence: Sprint-based                                   │ │
│  │                                                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─── SUPPORT LAYER ──────────────────────────────────────────┐ │
│  │                                                             │ │
│  │  8 Interns (Vanjulla, Ava, Hareesha, Sumaya, Muhammad,     │ │
│  │            Isam, Magnus, Raphael)                           │ │
│  │  • Podcast production, intelligence gathering, content      │ │
│  │  • WAVE pages: Content Calendar (as contributors)          │ │
│  │  • Cadence: Weekly tasks                                   │ │
│  │                                                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 RACI Matrix

| Activity | Kevin | NEXUS | Echo | Carl | Maria | Valentina | Xuemei | Emily | James/BD | Trae |
|----------|-------|-------|------|------|-------|-----------|--------|-------|----------|------|
| Content strategy | A | C | R | C | I | I | I | I | I | I |
| Content creation | I | C | R | I | I | I | R | I | I | I |
| Editorial calendar | A | C | R | R | I | R | I | I | I | I |
| Template management | I | C | R | I | I | I | R | I | I | I |
| Email sequences | I | C | C | I | R | I | I | I | I | I |
| Mailing lists | I | C | C | I | R | I | I | I | I | I |
| Distribution scheduling | A | C | R | R | R | R | I | I | I | I |
| Journey design | A | R | C | C | C | I | I | I | I | I |
| B2B signal review | I | R | I | I | I | I | I | I | R | I |
| Event planning | A | C | C | R | I | I | I | R | I | I |
| Analytics review | A | R | C | C | C | I | I | I | C | I |
| Platform development | I | A | I | I | I | I | I | I | I | R |
| AI optimization | I | R | C | I | C | I | I | I | I | C |

*R=Responsible, A=Accountable, C=Consulted, I=Informed*

### 6.3 Internal Communication Cadence

| Meeting | Frequency | Attendees | Purpose | Duration |
|---------|-----------|-----------|---------|----------|
| **Morning Brief** | Daily (auto) | Kevin + NEXUS | AI-generated: yesterday's metrics, today's priorities, blockers | 5 min (async) |
| **Content Stand-up** | Mon/Wed/Fri | Kevin, Echo, Carl, Xuemei | Content pipeline review, upcoming deadlines | 15 min |
| **Distribution Review** | Tuesday | Kevin, Echo, Maria | Sequence performance, mailing list health, upcoming sends | 20 min |
| **Campaign Planning** | Weekly (Thu) | Kevin, Echo, Carl, Maria | Campaign status, cross-channel coordination | 30 min |
| **B2B Signal Review** | Weekly (Fri) | Kevin, James/BD, NEXUS | New signals, lead quality, routing decisions | 15 min |
| **Monthly Business Review** | Monthly (1st Mon) | All stakeholders | Revenue, pipeline, platform health, strategy adjustments | 60 min |
| **Quarterly Strategy** | Quarterly | Kevin + key stakeholders | Revenue targets, product roadmap, team scaling | 2 hours |

### 6.4 Stakeholder-Specific Dashboards

**Kevin's Dashboard (Executive View):**
- Revenue pipeline (B2C + B2B + Council)
- WAVE-attributed revenue (this month, quarter, year)
- Platform health score (all 8 modules)
- Team utilization (who's doing what, blockers)
- B2B signal pipeline (signals → leads → opportunities → closed)
- Council membership funnel

**Echo's Dashboard (Content View):**
- Content calendar (what's publishing when)
- Content gaps (what's missing for campaigns)
- Performance by content type (what works)
- Template usage (most/least used)
- Repurposing pipeline (source → derivatives)

**Maria's Dashboard (Email View):**
- Sequence performance (open, click, conversion rates)
- Mailing list health (size, growth, suppression)
- Upcoming sends (this week)
- A/B test results
- Anomaly alerts (declining metrics)

**Carl's Dashboard (Events View):**
- Upcoming events (registration status)
- Past event performance (attendance, conversion)
- Registration funnel (landing page → form → payment → confirmed)
- Content tied to events (pre/post event content plan)

**James/BD Dashboard (B2B View):**
- B2B signals (new, pending, routed, converted)
- VISTA pipeline (leads, opportunities, proposals, closed)
- WAVE-sourced lead quality (conversion rate, deal size)
- Revenue from WAVE-sourced leads

---

## 7. Appendices

### Appendix A: Product Portfolio Reference

| Product | Type | Price | Target | WAVE Role |
|---------|------|-------|--------|-----------|
| LEAP | Self-assessment | $295 | B2C individuals | Entry point → cross-sell PRISM |
| QUEST | Self-assessment | $195 | B2C individuals | Entry point |
| COACH | Self-assessment | $395 | B2C coaches | Entry point |
| DRIVE | Self-assessment | $295 | B2C individuals | Entry point |
| IMPACT | Self-assessment | $395 | B2C individuals | Entry point |
| PRISM | Team assessment | $495+ | B2C/B2B teams | Cross-sell from LEAP |
| BRIDGE | Program | $15K-$50K | B2B teams | Mid-funnel engagement |
| FORGE | Consulting | $25K-$75K | B2B enterprise | High-value engagement |
| MOSAIC | Consulting | $50K-$150K | B2B enterprise | Premium engagement |
| SPARK | Consulting | $30K-$80K | B2B | Specialized engagement |
| SHIFT | Consulting | TBD | B2B | Transformation |
| Council | Membership | $5K-$25K/year | Qualified individuals | Recurring revenue |

### Appendix B: The 7 Executive Clusters

| Cluster | Description | Key Products |
|---------|-------------|-------------|
| Executive | C-suite, board members | MOSAIC, FORGE, Council |
| Senior Leadership | VP, SVP, Managing Director | BRIDGE, PRISM, Council |
| Middle Management | Director, Senior Manager | LEAP, PRISM, BRIDGE |
| Emerging Leaders | Manager, Team Lead | LEAP, QUEST, DRIVE |
| Specialist | Individual contributor, expert | QUEST, COACH, LEAP |
| Entrepreneur | Founder, solo business owner | IMPACT, DRIVE, COACH |
| Transition | Career changers, returning professionals | LEAP, QUEST, COACH |

### Appendix C: Development Status (July 2026)

| Component | Status | Detail |
|-----------|--------|--------|
| Business Requirements (BRD) | ✅ Complete | 685 lines |
| Intelligence Layer Spec | ✅ Complete | AI architecture, DeepSeek integration |
| Design Spec (Brand/UX) | ✅ Complete | Colors, typography, components |
| Page 1: Dashboard | ✅ Expanded | 36 tickets, 126h |
| Page 2: Content Calendar | ✅ Expanded | 42 tickets, 175h |
| Page 3: Template Library | ✅ Expanded | 66 tickets, 190h |
| Page 4: Distribution Engine | ✅ Expanded | 66 tickets, 218h |
| Page 5: B2C Journey Engine | ✅ Expanded | 92 tickets, 242h |
| Cross-Page Infrastructure | ✅ Expanded | 13 tickets, 80h |
| Page 6: Content Repurposing | 📋 Next | — |
| Page 7: Events & Registration | 📋 Pending | — |
| Page 8: Analytics & Intelligence | 📋 Pending | — |
| HTML Prototype | ✅ Deployed | Vercel live |
| Next.js Application | ✅ Scaffolded | 8 module pages |
| GitHub Repository | ✅ Active | kevinhongfr-star/Wave |
| Supabase Database | ✅ Provisioned | Schema designed, not yet migrated |
| **Total Specified** | **315 tickets** | **1,031 hours** |

### Appendix D: Market Data Sources

- Digital Marketing Software Market: $112.39B (2025) → $492.18B (2035), 16.38% CAGR — [Precedence Research](https://www.precedenceresearch.com/digital-marketing-software-market)
- Marketing Automation Software Market: 11.5% CAGR through 2032 — [PNP Media](https://thepnpmedia.com/2026/07/09/marketing-automation-market-to-grow-at-11-5-cagr-through-2032/)
- AI-Powered Marketing Platform Market: AI content generation 23.74% CAGR through 2031 — [Mordor Intelligence](https://www.mordorintelligence.com/industry-reports/ai-powered-marketing-platform-market)
- SME marketing automation adoption: 22.18% CAGR through 2031 — Mordor Intelligence
- Cloud-based deployment: 72.19% of 2025 revenue — Mordor Intelligence

---

**END OF DOCUMENT**

*Prepared by NEXUS for Kevin Hong — July 11, 2026*
*Confidential. Not for external distribution without CTO approval.*
