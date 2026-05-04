---
name: NLA Template
description: E-commerce, blog, scheduling, and certificate verification template with AI assistant
colors:
  surface-bg: oklch(1 0 0)
  surface-fg: oklch(0.153 0.006 107.1)
  surface-card: oklch(1 0 0)
  surface-card-fg: oklch(0.153 0.006 107.1)
  surface-muted: oklch(0.966 0.005 106.5)
  surface-muted-fg: oklch(0.58 0.031 107.3)
  surface-secondary: oklch(0.967 0.001 286.375)
  surface-secondary-fg: oklch(0.21 0.006 285.885)
  surface-popover: oklch(1 0 0)
  surface-popover-fg: oklch(0.153 0.006 107.1)
  surface-sidebar: oklch(0.988 0.003 106.5)
  surface-sidebar-fg: oklch(0.153 0.006 107.1)
  accent-primary: var(--brand-9)
  accent-primary-fg: "#ffffff"
  accent-accent: var(--brand-9)
  accent-accent-fg: "#ffffff"
  accent-destructive: var(--brand-9)
  accent-success: oklch(0.55 0.15 145)
  accent-warning: oklch(0.7 0.15 75)
  border-default: oklch(0.93 0.007 106.5)
  border-input: oklch(0.93 0.007 106.5)
  border-ring: var(--brand-9)
  chart-1: var(--brand-9)
  chart-2: var(--brand-8)
  chart-3: var(--brand-7)
  chart-4: var(--brand-6)
  chart-5: var(--brand-5)
typography:
  display:
    fontFamily: Roboto, sans-serif
    fontSize: clamp(1.875rem, 4vw, 2.25rem)
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.025em
  headline:
    fontFamily: Roboto, sans-serif
    fontSize: clamp(1.25rem, 3vw, 1.5rem)
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.025em
  title:
    fontFamily: Roboto, sans-serif
    fontSize: clamp(1rem, 2.5vw, 1.125rem)
    fontWeight: 500
    lineHeight: 1.375
    letterSpacing: normal
  body:
    fontFamily: Roboto, sans-serif
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: normal
  label:
    fontFamily: Roboto, sans-serif
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: normal
rounded:
  sm: calc(0.45rem * 0.6)
  md: calc(0.45rem * 0.8)
  lg: 0.45rem
  xl: calc(0.45rem * 1.4)
  "2xl": calc(0.45rem * 1.8)
  "3xl": calc(0.45rem * 2.2)
  "4xl": calc(0.45rem * 2.6)
spacing:
  inset: 1rem
  section: 2rem
  grid: 1.5rem
  component-gap: 1rem
components:
  button-primary:
    backgroundColor: "{accent-primary}"
    textColor: "{accent-primary-fg}"
    rounded: "{rounded.lg}"
    padding: 12px 16px
  button-outline:
    backgroundColor: transparent
    textColor: "{surface-fg}"
    rounded: "{rounded.lg}"
    padding: 12px 16px
  card-default:
    backgroundColor: "{surface-card}"
    textColor: "{surface-card-fg}"
    rounded: "{rounded.xl}"
    padding: 16px
  input-default:
    backgroundColor: transparent
    textColor: "{surface-fg}"
    rounded: "{rounded.lg}"
    padding: 4px 10px
  badge-default:
    backgroundColor: "{accent-primary}"
    textColor: "{accent-primary-fg}"
    rounded: "{rounded.4xl}"
    padding: 2px 8px
---

# Design System: NLA Template

## 1. Overview

**Creative North Star: "El Mostrador Digital"**

The interface of a well-run hardware store counter: professional, warm, and direct. Every interaction has purpose — like handing a customer the exact tool they need. The aesthetic is clean without being cold, structured without feeling rigid.

This system serves a bilingual (es/en) product catalog, blog, scheduling tool, certificate verification, and AI assistant. It needs to feel trustworthy for commercial transactions while remaining approachable for first-time visitors. The brand voice is that of a knowledgeable shopkeeper, not a corporate website.

**Key Characteristics:**
- Neutral-heavy surfaces with one red accent used sparingly (5–10% of any screen)
- Flat by default; depth only for floating elements (sheets, dropdowns, modals)
- Solid, tactile components with micro-interactions (1px press on buttons)
- Warm-tinted neutrals (oklch hue ~106 — a subtle warmth, not clinical gray)
- Dark mode that respects the same palette rules, not inverted
- 32-swappable brand palettes via `data-brand` attribute (default is deep red `#b32323`)

### The Dynamic Palette Doctrine

The brand accent (`--brand-9`) is **never hardcoded**. It is resolved at runtime via CSS custom properties driven by a `data-brand` attribute on `<html>`. The default is a curated red (`#b32323`), but 31 Radix UI palettes (amber, blue, green, purple, etc.) ship with the codebase — any can be activated by setting the `BRAND_COLOR` environment variable. This file documents the **default** palette; the structural rules (weight, contrast, elevation, typography) hold regardless of which palette is active.

## 2. Colors

The palette is **Restrained**: tinted neutrals carry 90–95% of every surface. The single accent (brand-9, a deep warm red) punctuates interactive elements and status signals. No secondary or tertiary accent roles exist — the system relies on neutral contrast, not multiple colors.

### Primary (Accent = Dynamic Brand)
- **Brand-9 Deep Red** (`var(--brand-9)`, default `#b32323` / `oklch(49.9% 0.1798 26.74)`): Primary buttons, links, focus rings, active nav indicators, badges, chart line 1, progress fills. Resolves to whatever palette is active via `data-brand`.

### Neutral
- **White** (`oklch(1 0 0)`): Page backgrounds (`--background`), cards, popovers in light mode.
- **Near-Black Warm** (`oklch(0.153 0.006 107.1)`): Primary text, card headers. Tinted a hair toward the brand hue — not pure gray.
- **Warm Ash** (`oklch(0.966 0.005 106.5)`): Muted surface backgrounds (secondary, muted). Subtle warmth.
- **Ash Muted** (`oklch(0.58 0.031 107.3)`): Secondary body text, descriptions, placeholders.
- **Warm Border** (`oklch(0.93 0.007 106.5)`): Borders, dividers, input strokes. Near-invisible but present.
- **Cool Secondary** (`oklch(0.967 0.001 286.375)`): Secondary button backgrounds. The only surface veering slightly cool, for contrast with the warm neutral.

### Semantic
- **Success Green** (`oklch(0.55 0.15 145)` / dark `oklch(0.65 0.12 145)`): In-stock indicators, live badges, WhatsApp CTAs, certificate indefinite labels.
- **Warning Amber** (`oklch(0.7 0.15 75)` / dark `oklch(0.75 0.12 75)`): Star ratings, expiring certificate labels.
- **Destructive** (same as brand-9): Error states, low-stock badges. Intentional design choice — the same red that represents the brand also signals urgency.

### Dark Mode

Dark mode inverts surface lightness but preserves the accent. Background becomes `oklch(0.153 0.006 107.1)` (near-black warm), cards become `oklch(0.228 0.013 107.4)` (one step lighter). Borders become `oklch(1 0 0 / 10%)` — white at 10% opacity. The accent remains at brand-9's exact lightness (`oklch(49.9% 0.1798 26.74)`) in both modes.

### The One Accent Rule

The brand-9 accent (red by default) is used on **primary interactive elements only**: primary buttons, links, focus rings, badges, chart series 1. It must never exceed ~10% of any viewport's surface. Rarity is the point — when the accent appears, it means something.

### The Brand-Swappable Rule

Every token referencing `var(--brand-9)` is resolved from the active palette. The accent color can be hot-swapped to any of 31 palettes (amber, green, purple, etc.) by changing a single environment variable. Do not hardcode hex values for accent roles — always reference `var(--brand-9)` or the semantic alias (`--primary`, `--ring`, `--accent`, `--destructive`).

## 3. Typography

**Display & Body Font:** Roboto (Google Fonts, via `next/font/google`)

**Character:** Roboto is a neo-grotesque with warm, open shapes. It pairs naturally with the warm neutral palette — neither cold (Helvetica) nor quirky (Inter geometric). Its dual-axis (sans display + sans body, same family) means the hierarchy rests entirely on weight and scale, not font switching.

### Hierarchy

- **Display** (700, clamp(1.875rem, 4vw, 2.25rem), 1.2, -0.025em): Page-level `<h1>` headings. Appears once per view. Tracking tightened for headline presence.
- **Headline** (600, clamp(1.25rem, 3vw, 1.5rem), 1.3, -0.025em): Section headings (`<h2>`), card titles, dialog titles. Weight contrast vs display via notched-down weight, not just size.
- **Title** (500, clamp(1rem, 2.5vw, 1.125rem), 1.375): Card entity names, list item titles, product names. Leading-snug for density in cards.
- **Body** (400, 0.875rem, 1.5): Running text, descriptions, product details. Max line length 65–75 characters (enforced via `max-w-prose` or equivalent).
- **Label** (500, 0.75rem, 1.25): Badges, button text, table headers, metadata. Medium weight for readability at small size.

### The No-Serif Rule

The system uses Roboto for every typographic role — display, body, heading, label. There is no serif, no mono (outside code blocks). Hierarchy is communicated through weight (700 → 600 → 500 → 400) and scale (≥1.25 ratio between steps), not font switching.

## 4. Elevation

Flat with purpose. Surfaces at rest are planar — cards use a subtle ring instead of a drop shadow. Depth appears only when an element floats above the page: dropdown menus, sheets, dialogs, and modals. The system does not have a shadow token scale; shadows are applied ad-hoc via Tailwind's `shadow-lg` for the floating layer.

### The Ring-Not-Shadow Rule

Cards, containers, and panels at rest use `ring-1 ring-foreground/10` (a 1px semi-transparent outline inside the element) rather than `box-shadow`. This defines the surface boundary without implying weight or float. Shadows are reserved exclusively for elements that break the page plane: sheets, dropdowns, modals, tooltips.

### Floating Layer
- **Sheets, Modals, Dropdowns:** `shadow-lg` — the only depth tier. One level of float, no nesting.

### Focus / Interaction
- **Focus ring:** 3px at 50% opacity of brand-9 (`focus-visible:ring-3 focus-visible:ring-ring/50`). Applies to all interactive elements.
- **Button press:** `active:translate-y-px` — a 1px downward micro-movement. The tactile confirmation of a solid, mechanical click.
- **Invalid state:** Red ring at 20% opacity + red border (`aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20`).

### Border Radius Scale (Base 0.45rem / ~7.2px)

| Token | Value | Used On |
|---|---|---|
| `--radius-sm` | ~4.3px (0.27rem) | Inline code, prose elements |
| `--radius-md` | ~5.8px (0.36rem) | Skeleton |
| `--radius-lg` | ~7.2px (0.45rem) | Buttons, inputs, nav links, alerts |
| `--radius-xl` | ~10px (0.63rem) | Cards, sheet content |
| `--radius-2xl` | ~13px (0.81rem) | Reserved |
| `--radius-3xl` | ~15.8px (0.99rem) | Reserved |
| `--radius-4xl` | ~18.7px (1.17rem) | Badges (pill shape) |

## 5. Components

### Buttons

Solid, tactile, and reliable. A button communicates action with a saturated background, clear hover state, and a 1px press-down on click.

- **Shape:** Gently rounded (0.45rem / `rounded-lg`). Not pill, not square.
- **Primary (`--primary` = brand-9):** Solid brand-9 background, white text, `hover:opacity-80`. Used for the single primary action per view.
- **Outline:** Transparent background with `border-border`, `hover:bg-muted`. Used for secondary and grouped actions.
- **Secondary:** Light neutral background (`--secondary`), dark text. Used for tertiary actions alongside primary.
- **Ghost:** No background until hover (`hover:bg-muted`). Used in navigation and toolbars.
- **Destructive:** Transparent tint over brand-9 (`bg-destructive/10`), red text. Used for delete, remove, low-stock.
- **Link:** Text-only with underline-on-hover. Used inline.
- **Sizing:** 6 sizes from xs (h-6, 24px) to lg (h-11, 44px) plus 4 icon-only variants. Default height is h-10 (40px).
- **States:** Hover = opacity/background shift; Active = translateY(1px); Disabled = opacity-50, no pointer events; Focus = 3px brand-9 ring at 50%.
- **Padding:** Default 12px horizontal (`px-3`).
- **Transition:** `transition-all duration-200`.

### Cards

Boundary-defined containers with no floating weight. Used for product grids, blog post previews, page cards, and certificate listings.

- **Corner Style:** `rounded-xl` (0.63rem / ~10px).
- **Background:** `bg-card` (white in light, elevated dark in dark mode).
- **Boundary:** `ring-1 ring-foreground/10` — not a shadow, not a border. A soft inner boundary.
- **Internal Padding:** 16px (`p-4`) on default size, 12px (`p-3`) on compact size.
- **Footer:** Separated by `border-t` with `bg-muted/50` background.
- **Card content area:** Has no padding on its own — padding lives on CardHeader and CardFooter. For image primary cards (blog), the image is `aspect-video` and flush to the top.
- **Nesting:** Cards are never nested. Each card is a standalone unit.

### Inputs

Clean, minimal inputs with a clear focus signal and mobile-friendly sizing.

- **Style:** `border-input` stroke, transparent background, `rounded-lg`.
- **Height:** h-8 (32px). Compact by default, comfortable for inline forms.
- **Focus:** Brand-9 border swap + 3px ring at 50% — the same focus language as buttons.
- **Mobile text:** 16px (`text-base` on mobile) to prevent iOS zoom on focus. Drops to 14px on `md:`.
- **Error:** Red border + red ring (`aria-invalid`).
- **Disabled:** 50% opacity, muted background, no pointer events.
- **Placeholder:** `text-muted-foreground`.

### Badges

Compact, pill-shaped labels for categories, statuses, and counts.

- **Shape:** `rounded-4xl` (~18.7px radius) — fully pill.
- **Height:** h-5 (20px).
- **Default:** Solid brand-9 background, white text. Used for primary categories.
- **Secondary:** Neutral background, secondary text. Used for secondary categories.
- **Destructive:** Transparent brand-9 tint, red text. Used for low-stock, warnings.
- **Outline:** Transparent with border. Used for service type labels.
- **Transition:** `transition-all duration-150`.

### Navigation (Navbar)

A sticky top bar with three responsive states. The brand identity is present via the accent on hover states and active elements, but the chrome itself is neutral.

- **Style:** `sticky top-0`, `z-50`, full width. Background is `bg-background/95` with `backdrop-blur` (falls back to `bg-background/60` when backdrop-filter is unsupported). Bottom border separates it from content.
- **Height:** h-16 (64px).
- **Container:** `max-w-7xl mx-auto px-4 md:px-6 lg:px-8`.
- **Desktop:** Full text labels with icons. `transition-colors duration-200` on hover (`bg-muted`).
- **Tablet (md to lg):** Icon-only with hover-expand labels. Labels are `max-w-0` at rest, expand to `max-w-40` on hover/focus-within via `transition-all duration-200`.
- **Mobile (<md):** Sheet drawer from right (w-72, 288px), with full text labels at `text-base`.
- **Brand identity:** `IconBarbell` logo (barbell icon, `size-8`), brand name in bold tracking-tight. Both link to home.
- **Actions:** WhatsApp CTA button, global search (cmd+k), language switcher, theme toggle.

### Separators

- **Horizontal:** `h-px w-full bg-border` — a 1px hairline using the border color.
- **Vertical:** `w-px self-stretch bg-border`.

### Skeleton

- `animate-pulse rounded-md bg-muted`: Simple pulse animation for loading states. Unmistakably placeholder — no fake text lines, no shimmer gradient.

## 6. Do's and Don'ts

### Do:
- **Do** use `ring-1 ring-foreground/10` for card boundaries. No box-shadow on static surfaces.
- **Do** reference `var(--brand-9)` or semantic aliases for accent roles. Never hardcode a hex for primary, accent, destructive, or ring.
- **Do** use OKLCH for color values. The palette is designed in perceptually-uniform space.
- **Do** keep the brand accent under ~10% of surface area per view. Rarity is the point.
- **Do** use `bg-background/95 backdrop-blur` for sticky chrome. It needs to feel like glass, not paint.
- **Do** make all interactive elements focus-visible with the 3px brand-9 ring at 50% opacity.
- **Do** use `text-base` on mobile inputs to prevent iOS zoom.
- **Do** respect the `data-brand` mechanism. The accent is always swappable.
- **Do** use `duration-200` as the standard micro-interaction speed.
- **Do** use `font-heading` (Roboto) for all titles and `font-sans` (Roboto) for body.

### Don't:
- **Don't** apply box-shadow to cards. Use `ring-1 ring-foreground/10`.
- **Don't** hardcode brand colors (`#b32323` or any hex) in component files. Always use `--brand-9`, `--primary`, or the semantic color token.
- **Don't** use gradient text, glassmorphism as default, side-stripe borders (>1px colored left/right borders), or the hero-metric template (big number + small label + gradient). This system is flat, solid, and direct.
- **Don't** use emojis as UI icons. Use Tabler Icons (SVG, `@tabler/icons-react`).
- **Don't** override `--font-heading` with a different font family. Roboto serves all roles.
- **Don't** use border-left or border-right as a colored accent stripe on cards or callouts.
- **Don't** use cards inside cards — nesting is always wrong.
- **Don't** animate CSS layout properties (width, height, top, left). Use transform and opacity only.
- **Don't** use `#000` or `#fff`. Tint every neutral toward the brand hue.
- **Don't** disable zoom or use fixed-width containers. The layout is always responsive via `max-w-7xl mx-auto px-4 md:px-6 lg:px-8`.
