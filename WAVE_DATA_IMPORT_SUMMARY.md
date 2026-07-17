# WAVE Data Import Summary — 2026-07-17

## Data Imported from Notion

### Email Sequences (26 sequences, 102 emails)
- **Table**: `email_sequences` + `sequence_emails`
- **Content**: Full subject lines, body text, sequence order, timing/delay
- **Coverage**: Pilot invitations, webinar nurture, B2B/B2C outreach, CEO/CHRO/PE prospecting, post-diagnostic follow-up, Signal Council nurture, WAVE onboarding

### Products & Pricing (30 products)
- **Table**: `products`
- **Categories**:
  - 11 Individual Diagnostics (B2C): LEAP ¥5,760, BRIDGE/MOSAIC/FORGE/QUEST/COACH/DRIVE/IMPACT/PRISM/SPARK/SHIFT Composite
  - 7 Corporate Packages (B2B): Single/Dual Diagnostic, SHIFT Composite, Team Package, BRIDGE/FORGE/SPARK packages
  - 6 Advisory Retainers: Executive/Board/Sales/AI Strategy/Executive Coaching/Career Coaching
  - 3 SHIFT Programs: LEAP (8-12wk), QUEST (6-10wk), DRIVE (4-8wk)
  - 3 Signal Council Tiers: Member (Tier 1), Council Insider (Tier 2), Council Nxt Gen

### ROI Calculator
- **Status**: Fetched from Notion, saved locally (`/tmp/roi_calculator_full.json`)
- **Content**: 7 sections, 7 tables with formulas, benchmarks, persona-specific emphasis
- **Next**: Requires `wave_config` table creation to store JSON in Supabase

## Database Schema Notes
- `email_sequences`: id, name, type, status, trigger_type, campaign_id
- `sequence_emails`: id, sequence_id, order_num, subject, body, delay_days
- `products`: id, name, tier, category, base_price_cny, pricing_model, status
- **Missing**: `wave_config` table for ROI/pricing JSON storage

## Connection Details
- Supabase: `https://rnnlteyqmtxkzllbohuu.supabase.co`
- Data ready for WAVE app to query
