<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# WAVE — Development Instructions for Trae

## Project Overview
WAVE is the Marketing Operations Platform for LYC Partners. It manages content planning, asset generation, multi-channel distribution, email sequences, B2C journey orchestration, event registration, and analytics.

## Design System — READ THIS FIRST
Before writing ANY UI code, read:
1. `wave-app-update/DESIGN_SYSTEM.md` — design tokens, rules, typography, colors
2. `wave-app-update/globals.css` — the actual CSS tokens and component styles
3. `Business_Specs/LYC_Intelligence_Design_Spec.md` — full brand specification

### Non-Negotiable Rules
- **Zero border radius** on everything (except badges, avatars, chat bubbles)
- **Libre Baskerville** for headings, **DM Sans** for body/UI
- **Fuchsia (#C108AB)** as primary accent
- **44px min** touch targets
- **No emoji** in UI copy
- **Dark mode**: warm purple-black (#0D0A14), never cold grey

## Architecture
- Frontend: Next.js 15 + TypeScript + Tailwind CSS
- Backend: Vercel Serverless Functions
- Database: Supabase (PostgreSQL + Auth + RLS + Realtime)
- AI: DeepSeek API (deepseek-chat for fast, deepseek-reasoner for reasoning)
- Integration: Feishu agents write to Supabase, WAVE reads via Realtime

## Build Order
Follow `wave-app-update/TRAE_BRIEFING_BATCH2.md` for ticket priority and sprint planning.

## Key Libs
- `src/lib/deepseek.ts` — DeepSeek API wrapper with rate limiting and retry
- `src/lib/supabase/client.ts` — Browser Supabase client
- `src/lib/supabase/server.ts` — Server-side Supabase client
- `src/lib/supabase/admin.ts` — Admin client (bypasses RLS)

## Tech Stack Reference
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| AI | DeepSeek API |
| Hosting | Vercel |
