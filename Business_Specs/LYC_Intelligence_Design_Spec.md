# LYC Intelligence — Design & Brand Specification

**Version:** 1.0
**Date:** 2026-07-10
**Author:** NEXUS (on behalf of Kevin Hong)
**Status:** Active — source of truth for all UI/UX work

---

## 1. Brand Identity

### 1.1 Product Name
**LYC Intelligence** — the AI-powered executive search & leadership advisory platform by LYC Partners.

Sub-products:
- **DEX AI** — AI intelligence layer (scoring, matching, analytics)
- **NEXUS** — AI executive advisory chatbot
- **GRID** — Organizational intelligence & market mapping engine
- **LENS** — Candidate reporting & deliverable generation

### 1.2 Tagline
> "Know where you stand. Know where to go."

Secondary: "Leadership isn't a title — it's a trajectory."

### 1.3 Brand Positioning
**"McKinsey meets Soho House"** — premium, data-driven, authoritative, yet warm and human. Not a cold enterprise tool. Not a consumer app. Board-level aesthetic with modern tech sensibility.

### 1.4 Brand Principles
| Principle | Meaning |
|-----------|---------|
| Expert | We know our stuff but don't lecture |
| Direct | Clear without being cold |
| Confident | We trust our system |
| Human | Professional warmth |

### 1.5 Logo
- **File:** `Brand_Assets/lyc-logo-kevin-selected.png` (primary — dark bg, white text)
- **Usage:** Always on dark or neutral backgrounds. Minimum clear space = logo height ÷ 2.
- **Minimum size:** 120px wide (digital), 25mm wide (print)
- **Never:** Stretch, recolor, add effects, or place on busy backgrounds without contrast overlay.

---

## 2. Color System

### 2.1 Primary Brand Color
| Token | Hex | Usage |
|-------|-----|-------|
| Fuchsia | `#C108AB` | Primary accent, CTAs, active states, links |
| Fuchsia Hover | `#A00790` | Hover/pressed states on fuchsia elements |
| Fuchsia Light | `rgba(193,8,171,.08)` | Subtle backgrounds, badges, highlights |

**Fuchsia Opacity Scale:**
| Token | Value | Usage |
|-------|-------|-------|
| `--accent-5` | `#c108ab08` | Barely-there tint |
| `--accent-10` | `#c108ab1a` | Hover backgrounds |
| `--accent-15` | `#c108ab26` | Selection highlight |
| `--accent-20` | `#c108ab33` | Active indicators |
| `--accent-40` | `#c108ab66` | Disabled accent |
| `--accent-60` | `#c108ab99` | Muted accent |
| `--accent-80` | `#c108abcc` | Semi-emphasis |
| `--accent-90` | `#c108abe6` | Near-full accent |

### 2.2 Secondary Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Teal | `#00897B` | Success states, secondary accents, data viz |
| Teal Light | `#4DB6AC` | Teal hover/light variants |
| Ocean | `#4FC3F7` | Data visualization, info states |
| Ocean Deep | `#0288D1` | Strong info, links in data context |
| Slate | `#607D8B` | Muted text, subtle borders |
| Blue Grey | `#B0BEC5` | Disabled states, placeholder text |

### 2.3 Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Green | `#2d8a4e` | Success, positive, placed |
| Amber | `#b8860b` | Warning, caution, pending |
| Red | `#c0392b` | Error, critical, blocked |
| Blue | `#2c5282` | Information, neutral data |

### 2.4 Neutral / Background Palette
| Token | Hex | Usage |
|-------|-----|-------|
| White | `#FFFFFF` | Card backgrounds, primary surface |
| BG | `#FAFAFA` | Page background |
| BG Warm | `#F7F6F4` / `#FAF8F5` | Warm neutral sections |
| BG Alt | `#F5F5F5` | Secondary surfaces |
| BG Tertiary | `#EDEDED` | Inactive/toggle backgrounds |
| Border | `#E5E5E5` / `#E8E6E3` | Borders, dividers |
| Text Primary | `#1A1A1A` / `#000000` | Headlines, primary text |
| Text Secondary | `#555555` / `#333333` | Body text |
| Text Muted | `#999999` / `#666666` | Captions, placeholders |

### 2.5 Dark Theme
| Token | Light | Dark |
|-------|-------|------|
| BG Primary | `#FFFFFF` | `#0D0A14` (warm purple-black) |
| BG Secondary | `#F5F5F5` | `#1A0F1E` |
| BG Tertiary | `#EDEDED` | `#281530` |
| BG Hover | `#E5E5E5` | `#3A2040` |
| Text Primary | `#000000` | `#FFFFFF` |
| Text Secondary | `#333333` | `#CCCCCC` |
| Text Muted | `#666666` | `#888888` |
| Border | `#E5E5E5` | `#281530` |

Atmospheric dark colors:
- Sky: `#0D1A2E`
- Mist: `#1A0F1E`
- Lavender: `#1E1030`
- Cream: `#1A0F1E`

**Note:** Dark theme uses warm purple-black gradients matching LYC's corporate site, NOT cold grey-black.

---

## 3. Typography

### 3.1 Font Families
| Role | Font | Stack | Source |
|------|------|-------|--------|
| **Headings** | Libre Baskerville | `'Libre Baskerville', Georgia, serif` | Self-hosted (woff2) |
| **Body / UI** | DM Sans | `'DM Sans', system-ui, -apple-system, sans-serif` | Self-hosted (woff2) |
| **Fallback** | System | `system-ui, -apple-system, sans-serif` | OS default |

**DO NOT use Google Fonts CDN.** All fonts are bundled locally in `/fonts/`.

### 3.2 Font Weights
| Weight | Libre Baskerville | DM Sans |
|--------|-------------------|---------|
| Regular | 400 | 400 |
| Medium | — | 500 |
| Semi-Bold | — | 600 |
| Bold | 700 | — |

### 3.3 Type Scale
| Element | Family | Size | Weight | Line Height |
|---------|--------|------|--------|-------------|
| Hero Heading | Libre Baskerville | 48–64px | 700 | 1.15 |
| H1 | Libre Baskerville | 32px | 700 | 1.2 |
| H2 | Libre Baskerville | 26px | 600 | 1.3 |
| H3 | Libre Baskerville | 20px | 600 | 1.3 |
| H4 | Libre Baskerville | 18px | 600 | 1.4 |
| Body | DM Sans | 14px | 400 | 1.6 |
| Body Small | DM Sans | 13px | 400 | 1.5 |
| Caption | DM Sans | 12px | 400 | 1.4 |
| Micro / XXS | DM Sans | 10px | 600 | 1.3 |
| Nav Link | DM Sans | 14px | 500 | 1.0 |

**Minimum font size:** 10px. Never go below 8pt in any output (PDF or screen).

### 3.4 Typography Rules
- Headings: Always serif (Libre Baskerville). Never sans-serif for headlines.
- Body: Always sans-serif (DM Sans). Never serif for body text.
- Uppercase labels: `font-size: 9–10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2–2.5px;`
- Line height: 1.5–1.6 for body, 1.15–1.3 for headings.
- Max line length: ~70 characters for readability.

---

## 4. Spacing & Layout

### 4.1 Spacing Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-xs` | 4px | Tight gaps, icon padding |
| `--spacing-sm` | 8px | Small gaps, compact spacing |
| `--spacing-md` | 16px | Standard padding, card gaps |
| `--spacing-lg` | 24px | Section padding, large gaps |
| `--spacing-xl` | 32px | Page padding, major sections |

### 4.2 Layout Grid
- **Max content width:** 1200px (centered)
- **Page padding:** 32px desktop, 20px mobile
- **Grid columns:** 12-column grid for complex layouts
- **Standard grids:**
  - Cards: `grid-template-columns: repeat(3, 1fr); gap: 24px`
  - Stats: `grid-template-columns: repeat(4, 1fr); gap: 24px`
  - Two-column: `grid-template-columns: repeat(2, 1fr); gap: 24px`

### 4.3 Breakpoints
| Breakpoint | Width | Target |
|------------|-------|--------|
| Mobile | < 768px | Single column, hamburger nav |
| Tablet | 768–1024px | 2-column grids |
| Desktop | > 1024px | Full layout, 3–4 column grids |

### 4.4 Touch Targets
- **Minimum tap target:** 44×44px (all interactive elements)
- Buttons: `min-height: 44px` (or 36px for secondary)
- Touch targets must have adequate spacing (≥8px gap)

---

## 5. Border Radius

### 🔴 HARD RULE: ZERO BORDER RADIUS
```css
*, *::before, *::after {
  border-radius: 0 !important;
}
```

**All elements are sharp-edged (0px radius).** This is a non-negotiable brand rule. Override all Tailwind `rounded-*` utilities. The only exception is:
- Avatar circles / profile images (use `border-radius: 50%`)
- Badge pills (use `border-radius: 9999px` for status badges only)
- Chat bubbles (user: `12px 12px 4px 12px`, assistant: `12px 12px 12px 4px`)

---

## 6. Shadows & Elevation

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` / `shadow-card` | `0 1px 3px rgba(0,0,0,0.08)` | Cards at rest |
| `--shadow-md` / `shadow-card-hover` | `0 4px 12px rgba(0,0,0,0.1)` | Card hover, elevated elements |
| `shadow-modal` | `0 8px 32px rgba(0,0,0,0.15)` | Modals, dropdowns, popups |
| `shadow-nav` | `0 1px 8px rgba(0,0,0,0.06)` | Sticky nav on scroll |

**Hover elevation pattern:** Cards lift on hover with `translateY(-4px)` + shadow increase. Transition: `0.3s ease-out`.

---

## 7. Components

### 7.1 Buttons
| Type | Background | Text | Border | Min Height |
|------|-----------|------|--------|------------|
| Primary (CTA) | `#C108AB` | `#FFFFFF` | None | 44px |
| Primary Hover | `#A00790` | `#FFFFFF` | None | 44px |
| Secondary | `#EDEDED` | `#666666` | None | 44px |
| Ghost | Transparent | `#555555` | None | 44px |
| Danger | `#c0392b` | `#FFFFFF` | None | 44px |

- All buttons: `border-radius: 0` (zero radius)
- Primary CTA: Apply `.cta-glow` animation (subtle fuchsia pulse)
- Hover: `translateY(-1px)` with shadow increase
- Disabled: `opacity: 0.5; cursor: not-allowed`

### 7.2 Cards
- Background: `#FFFFFF`
- Border: `1px solid #E5E5E5`
- Padding: 16–24px
- Shadow: `0 1px 3px rgba(0,0,0,0.08)`
- Border radius: **0px** (always)
- Hover: border color shifts to `accent/20`, shadow increases

### 7.3 Inputs
- Background: `#FFFFFF`
- Border: `1px solid #E5E5E5`
- Border radius: **0px**
- Padding: 14px 16px
- Focus: `box-shadow: 0 0 0 2px rgba(193, 8, 171, 0.4); border-color: #C108AB;`
- Font size: **16px** on mobile (prevents iOS zoom)
- Placeholder: `#999999`

### 7.4 Badges & Tags
- Background: `rgba(color, 0.1)` (10% opacity of semantic color)
- Text: semantic color at full value
- Padding: 4px 8px
- Font: 10px, bold, uppercase
- Border radius: `9999px` (pill shape — only exception to zero-radius rule)

### 7.5 Navigation
- **Sticky nav** with `backdrop-filter: blur(12px)` and `background: rgba(255,255,255,0.92)`
- Height: 60px (`--nav-height`)
- Scroll shadow: appears when scrolled (`0 1px 8px rgba(0,0,0,0.06)`)
- Mobile: Hamburger → slide-in panel from right (280px wide)

### 7.6 Tables
- Header: `font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #999`
- Row padding: 12px 16px
- Row border: `1px solid #E5E5E5` bottom
- Hover row: `background: #F5F5F5`
- Sortable columns: cursor pointer, indicator icon

---

## 8. Icons & Illustrations

### 8.1 Icon Library
- **Primary:** Lucide React (`lucide-react`)
- **Custom:** `src/components/icons/LycIcons.tsx` (brand-specific icons)
- **Size:** 16px (inline), 20px (buttons), 24px (nav), 32–48px (feature sections)
- **Stroke width:** 1.5–2px
- **Color:** Inherit from parent text color, or brand accent for active states

### 8.2 Custom Icon Animations
| Icon | Animation | Duration |
|------|-----------|----------|
| Trident (Match) | Pulse scale | 2s infinite |
| Quest (Nexus) | Continuous rotate | 6s linear |
| Spark (Analytics) | Flash blink | 2s infinite |
| Bridge (Connect) | Stroke draw | 3s infinite |
| Impact (Ripple) | Expanding ring | 1.8s infinite |
| Compass (Sway) | Needle rotation ±8° | 4s infinite |
| Forge (Strike) | Hammer tap | 2s infinite |

### 8.3 Illustration Style
- No photos in UI components (photos only in hero sections and content)
- Abstract geometric shapes with fuchsia/teal palette
- Dot grid patterns with subtle pulse animation
- Gradient meshes: fuchsia → transparent

---

## 9. Motion & Animation

### 9.1 Easing Functions
| Token | Value | Usage |
|-------|-------|-------|
| `--ease-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | General transitions |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful bounces |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Page enters, reveals |

### 9.2 Standard Durations
| Type | Duration |
|------|----------|
| Micro (hover, toggle) | 150–200ms |
| Small (dropdown, tooltip) | 200–300ms |
| Medium (page transition) | 300–400ms |
| Large (complex animation) | 400–700ms |

### 9.3 Key Animations
- **Page enter:** `opacity 0→1, translateY(8px→0)`, 0.4s ease-out-expo
- **Card hover:** `translateY(-4px)` + shadow increase, 0.3s ease-out
- **Scroll reveal:** `opacity 0→1, translateY(24px→0)`, 0.7s ease-out-expo
- **CTA glow:** Subtle fuchsia box-shadow pulse, 2.5s infinite
- **Loading shimmer:** Gradient sweep, 1.5s infinite

### 9.4 Reduced Motion
Respect `prefers-reduced-motion: reduce`:
- Disable all animations and transitions
- Show content immediately (no scroll reveal)
- Static cards (no hover transform)
- No shimmer skeletons

---

## 10. Voice & Tone

### 10.1 Writing Principles
| Principle | Do | Don't |
|-----------|----|----|
| Expert | "Your shortlist is strong — 3 candidates above 85% fit" | "Based on multivariate analysis of candidate parameters..." |
| Direct | "This candidate withdrew" | "Regrettably, the candidate has elected to discontinue..." |
| Confident | "The match score reflects strong alignment" | "Our AI is the best in the industry" |
| Human | "Congratulations on the successful placement" | "Woo you nailed it!!" |

### 10.2 Tone by Context
| Context | Tone | Example |
|---------|------|---------|
| Success | Warm + professional | "Mandate created. Your search is live." |
| Error | Calm + reassuring | "Something went wrong. We're on it. Try again in a moment." |
| Empty state | Encouraging + clear | "No mandates yet. Let's set up your first search." |
| Loading | Transparent | "Loading your dashboard... this should take a few seconds." |
| Warning | Honest + actionable | "This mandate has been open 45 days. Consider refreshing the search sweep." |
| Data-heavy | Scannable | Use numbers, percentages, comparisons — not paragraphs |

### 10.3 Copy Rules
1. **Numbers over adjectives** — "3 of 5 candidates scored" not "Most candidates scored well"
2. **Active voice** — "The system matched 12 candidates" not "12 candidates were matched"
3. **Front-load important info** — "Search completed: 47 candidates found" not "We have completed your search and found..."
4. **One idea per sentence** — No run-ons
5. **Localize date/time** — Always in user's timezone
6. **No emoji** in UI copy (brand rule)
7. **No exclamation marks** unless genuinely celebrating (placement confirmed)

---

## 11. Data Visualization

### 11.1 Chart Colors
| Sequence | Color | Hex |
|----------|-------|-----|
| 1 | Fuchsia | `#C108AB` |
| 2 | Teal | `#00897B` |
| 3 | Ocean | `#4FC3F7` |
| 4 | Amber | `#F59E0B` |
| 5 | Red | `#c0392b` |
| 6 | Slate | `#607D8B` |

### 11.2 Score Match Colors
| Score Range | Color | Label |
|-------------|-------|-------|
| 85–100 | `#22c55e` (Green) | Excellent |
| 70–84 | `#F59E0B` (Amber) | Good |
| 50–69 | `#3B82F6` (Blue) | Moderate |
| < 50 | `#94A3B8` (Grey) | Low |

### 11.3 Pipeline Stage Colors
| Stage | Color |
|-------|-------|
| Sourcing | `#2c5282` (Blue) |
| Screening | `#b8860b` (Amber) |
| Interview | `#C108AB` (Fuchsia) |
| Offer | `#00897B` (Teal) |
| Placed | `#22c55e` (Green) |

---

## 12. Responsive Design

### 12.1 Mobile-First Approach
- Base styles target mobile
- `@media (min-width: 768px)` for tablet+
- `@media (min-width: 1024px)` for desktop

### 12.2 Mobile Specifics
- **Navigation:** Hamburger menu → slide-in panel (280px, right side)
- **Grids:** Collapse to single column (or 2-column for small cards)
- **Font size:** Body text never below 14px. Inputs always 16px (prevent iOS zoom).
- **Touch targets:** Minimum 44×44px
- **Spacing:** Page padding 20px, section padding 32px
- **Safe areas:** `env(safe-area-inset-bottom)` for bottom navigation
- **Sticky elements:** Bottom navigation bar on mobile, sticky header on scroll

### 12.3 Progressive Enhancement
- Scroll reveal animations: Desktop only (disable on mobile for performance)
- Card hover effects: Desktop only
- Backdrop blur: Progressive (fallback to solid background)

---

## 13. Accessibility

### 13.1 Color Contrast
- All text must meet WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text)
- Never rely on color alone to convey information (use icons + labels)

### 13.2 Focus States
- All interactive elements: `outline: 2px solid #C108AB; outline-offset: 2px;`
- Focus visible only (not on click): `:focus-visible`

### 13.3 Screen Readers
- All icons: `aria-hidden="true"` when decorative, `aria-label` when functional
- All images: meaningful `alt` text
- Form inputs: always associated `<label>` or `aria-label`
- Dynamic content: `aria-live` regions for async updates

### 13.4 Keyboard Navigation
- All interactive elements reachable via Tab
- Logical tab order
- Escape closes modals/dropdowns
- Enter/Space activates buttons

---

## 14. Dark Mode

### 14.1 Toggle
- User preference stored in `localStorage` key `lyc-theme`
- Applied via `data-theme="dark"` attribute on `<html>`
- System preference: `prefers-color-scheme: dark` as initial default

### 14.2 Dark Mode Rules
- Background: warm purple-black (`#0D0A14`), NOT cold grey
- Fuchsia accent stays constant across themes
- Cards: subtle border (`#281530`), no shadow (dark bg provides separation)
- Text: pure white `#FFFFFF` for primary, `#CCCCCC` for secondary, `#888888` for muted
- Images: slight brightness reduction if needed

---

## 15. Do's and Don'ts

### ✅ DO
- Use fuchsia as the primary accent sparingly — it's powerful because it's limited
- Keep layouts breathable with generous whitespace
- Use data and numbers over vague language
- Test all interactions on mobile first
- Use the zero-radius aesthetic consistently
- Load fonts locally (never Google CDN)
- Use DM Sans for everything UI, Libre Baskerville for headings only

### ❌ DON'T
- Use rounded corners (except badges and chat bubbles)
- Use emoji in UI copy
- Use Google Fonts CDN
- Use generic stock illustrations
- Use color as the only differentiator
- Go below 10px font size
- Use cold grey-black in dark mode (always warm purple-black)
- Add drop shadows to cards in dark mode
- Use more than 3 font weights on a single page

---

## 16. File Structure Reference

```
src/
├── styles/
│   └── tokens.css          # Design token CSS custom properties
├── index.css               # Global styles, animations, responsive rules
├── constants/
│   └── brandVoice.ts       # Voice & tone guidelines (code)
├── components/
│   ├── ui/                 # Base UI primitives (Button, Card, Badge, Input...)
│   ├── icons/
│   │   └── LycIcons.tsx    # Custom brand SVG icons
│   ├── shell/              # AppShell, TopBar, SurfaceTabs, SubTabs
│   └── nexus/              # NEXUS chatbot components
├── pages/                  # Route-level page components
└── lib/
    └── supabase.ts         # Supabase client

public/
├── fonts/                  # Self-hosted woff2 fonts
│   ├── LibreBaskerville-Regular.woff2
│   ├── LibreBaskerville-Bold.woff2
│   ├── DMSans-Regular.woff2
│   ├── DMSans-Medium.woff2
│   └── DMSans-SemiBold.woff2
```

---

## 17. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS + CSS custom properties |
| Icons | Lucide React + custom SVG |
| Backend | Vercel Serverless Functions |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| AI | DeepSeek API (deepseek-chat model) |
| Router | React Router v6 |

---

*This document is the single source of truth for LYC Intelligence's visual identity and design system. All implementations should reference this spec. For questions or updates, contact Kevin Hong.*
