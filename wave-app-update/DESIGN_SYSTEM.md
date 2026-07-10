# WAVE Design System — LYC Intelligence Aligned

**Version:** 2.0 (updated 2026-07-10)
**Status:** Active — this is the source of truth for all WAVE UI/UX work.

## Key Changes from v1

| Aspect | v1 (old) | v2 (current) |
|--------|----------|--------------|
| Heading font | Crimson Pro | **Libre Baskerville** |
| Body/UI font | Inter | **DM Sans** |
| Primary accent | #0F1115 (near-black) | **#C108AB (fuchsia)** |
| Border radius | 10px / 6px | **0px (sharp edges)** |
| Dark mode | cold grey-black | **warm purple-black (#0D0A14)** |
| Nav background | solid dark | **backdrop-blur glass** |
| Card hover | none | **translateY(-4px) + shadow** |
| CTA buttons | static | **subtle glow animation** |

## Hard Rules

1. **Zero border radius** — all elements sharp-edged. Exceptions: badge pills (9999px), avatars (50%), chat bubbles (12px/4px).
2. **Fuchsia (#C108AB)** is the primary accent — use for CTAs, active states, focus rings. Not for large backgrounds or body text.
3. **Self-host fonts** in production. `next/font/google` OK for development; bundle woff2 in `/public/fonts/` for production.
4. **Dark mode** uses warm purple-black (`#0D0A14`), NEVER cold grey-black.
5. **No emoji** in UI copy.
6. **44px minimum touch target** for all interactive elements.
7. **16px font size** on mobile inputs (prevents iOS zoom).
8. **WCAG 2.1 AA** color contrast compliance.

## Color Reference

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#C108AB` | CTAs, active states, links, focus |
| Primary Hover | `#A00790` | Hover on primary |
| Teal | `#00897B` | Success states, secondary accent |
| Ocean | `#4FC3F7` | Data viz, info states |
| Amber | `#F59E0B` | Warning states |
| Red | `#c0392b` | Error, destructive actions |
| BG | `#FAFAFA` | Page background |
| BG Warm | `#F7F6F4` | Warm neutral sections |
| Card | `#FFFFFF` | Card surfaces |
| Border | `#E5E5E5` | Borders, dividers |
| Text Primary | `#1A1A1A` | Headlines, primary text |
| Text Secondary | `#555555` | Body text |
| Text Muted | `#999999` | Captions, placeholders |

## Typography Scale

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| Hero | Libre Baskerville | 48–64px | 700 | 1.15 |
| H1 | Libre Baskerville | 32px | 700 | 1.2 |
| H2 | Libre Baskerville | 26px | 600 | 1.3 |
| H3 | Libre Baskerville | 20px | 600 | 1.3 |
| H4 | Libre Baskerville | 18px | 600 | 1.4 |
| Body | DM Sans | 14px | 400 | 1.6 |
| Small | DM Sans | 13px | 400 | 1.5 |
| Caption | DM Sans | 12px | 400 | 1.4 |
| Label | DM Sans | 10px | 700 | 1.3 |

## Brand Voice

- **Expert** but not lecturing
- **Direct** but not cold
- **Confident** but not arrogant
- **Human** — professional warmth

## Reference

Full design spec: `Business_Specs/LYC_Intelligence_Design_Spec.md`
