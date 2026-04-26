<p align="center">
  <img src="public/design/logo.svg" alt="NLA Template" width="120" height="120" />
</p>

<h1 align="center">NLA Template</h1>
<p align="center"><strong>Next.js 16 E-commerce Template with shadcn/ui</strong></p>

<p align="center">
  <a href="https://github.com/natuleadan/nla-template/actions/workflows/ci.yml?branch=main"><img src="https://img.shields.io/github/actions/workflow/status/natuleadan/nla-template/ci.yml?branch=main&style=for-the-badge" alt="CI status" /></a>
  <a href="https://github.com/natuleadan/nla-template/releases"><img src="https://img.shields.io/github/v/release/natuleadan/nla-template?include_prereleases&style=for-the-badge" alt="GitHub release" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge" alt="Next.js" />
  <img src="https://img.shields.io/badge/shadcn/ui-components-blueviolet?style=for-the-badge" alt="shadcn/ui" />
</p>

> ⚠️ **Active Development** — This template is under active construction. APIs, module interfaces, and features may change without prior notice. For production use, rely only on tagged releases (`vX.Y.Z`).

## 1. What is NLA Template?

NLA Template is a Next.js 16 e-commerce starter template with shadcn/ui components. It provides a complete foundation for building modern e-commerce applications with REST API, config-driven modules, and WhatsApp-based ordering.

Built with Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui. Ready to deploy to Vercel with CI/CD and automated releases.

## 2. Features

### E-commerce
- **Next.js 16** with App Router and Turbopack
- **shadcn/ui** components for modern UI
- **REST API** with 13+ categories and CRUD endpoints (GET/POST/PUT/DELETE)
- **Scalar API Documentation** at `/api`
- **WhatsApp ordering** — products, booking, and inquiries via WhatsApp
- **Product Gallery** with carousel and fallback images
- **Reviews** system with star rating
- **Inventory** tracking by location
- **Geolocation** service with Vercel headers
- **Cookie Consent** banner with shadcn components
- **Notifications** with Sonner toasts
- **Product filtering** — search + category filter + infinite scroll (4 items)

### Pages
- **Paginas module** — legal & policy pages config-driven
- **Paginas list** — infinite scroll (6 items), search, category filter, 1/2/3 grid
- **Paginas detail** — HTML prose rendering with ShareDialog
- **Paginas API** — CRUD endpoints, JSON-LD structured data

### Blog
- **Blog module** — list with infinite scroll (6 items), search, category filter, 1/2/3 grid
- **Blog detail** — 25/75 image/content layout, ShareDialog, reading time, author
- **Blog API** — CRUD endpoints, JSON-LD structured data
- **Blog OG/Twitter images** — dynamic per post and list

### Scheduling
- **Agenda module** — weekly calendar with responsive grid (2/4/6/7 cols)
- **Time slots** — config-driven per-day, past slots disabled with toast
- **Week navigation** — limited to `NEXT_PUBLIC_WEEK_MAX` weeks ahead, no past navigation
- **Current time** badge with live clock
- **WhatsApp booking** — slot dialog → product selector → WhatsApp redirect

### Search
- **GlobalSearch (Cmd+K)** — search products, blog posts, pages, and today's agenda slots

### SEO & Design
- **Dynamic OG/Twitter images** for all pages (Satori/ImageResponse)
- **JSON-LD structured data** — BreadcrumbList, Product, BlogPosting, Event, CollectionPage, etc.
- **Dynamic brand colors** via `NEXT_PUBLIC_BRAND_COLOR` env var (Radix UI palettes, 32 palettes)
- **Custom fonts** — Roboto via next/font/google
- **PWA manifest**, sitemap.xml, robots.txt, llms.txt
- **CORS proxy** — security headers and cross-origin support via `proxy.ts`

### Accessibility
- **Skip-to-content link** — keyboard-accessible on page load
- **ARIA landmarks** — `navigation`, `main`, `contentinfo` roles with labels
- **ARIA labels** — all icon-only buttons (search, theme, whatsapp, hamburger, social sharing)
- **ARIA live regions** — loading states, empty states, cart quantities, week calendar
- **Dialog/Sheet descriptions** — `aria-describedby` properly wired for all dialogs
- **Localized screen reader text** — all sr-only labels in Spanish
- **Brand-colored table headers** — with white text using `var(--color-primary)`

### UI Components
- **Typography** — H1–H4, P, Blockquote, List, Table, InlineCode, Lead
- **Prose** — HTML content renderer with custom CSS (no external plugin)
- **ShareDialog** — copy link + X, Facebook, LinkedIn, email (mailto) with contextual info
- **Dark mode toggle** — sun/moon icons with keyboard shortcut (D key)
- **ThemeProvider** — next-themes integration

### DX
- **Husky + Commitlint** for conventional commits
- **GitHub Actions CI/CD** with build, lint, and test
- **Semantic Release** for automated versioning
- **CodeQL** security scanning

## 3. Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5.7+
- **UI**: shadcn/ui + Tailwind CSS
- **API**: Next.js Route Handlers (REST)
- **Documentation**: Scalar
- **Testing**: Vitest
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel

## 4. Getting Started

```bash
# Clone the repository
git clone https://github.com/natuleadan/nla-template.git

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env.local

# Run development server
pnpm dev
```

## 5. Environment Variables

### Public (safe for browser — `src/lib/env.public.ts`)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BRAND_COLOR` | Radix UI color palette name | nla |
| `NEXT_PUBLIC_BASE_URL` | Base URL (OG images, sitemap, canonical, API docs) | http://localhost:3000 |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number for orders and bookings | 1234567890 |
| `NEXT_PUBLIC_INDEXING` | Enable search engine indexing (robots.txt) | false |
| `NEXT_PUBLIC_WEEK_MAX` | Max future weeks for agenda booking | 4 |

### Private (server-only — `src/lib/config/env.ts`)

| Variable | Description | Default |
|----------|-------------|---------|
| `API_KEY` | API key for protected endpoints (POST, PUT, DELETE) | dev-key-change-in-production |

## 6. API Endpoints

| Category | Endpoints |
|----------|-----------|
| `products` | GET, POST, PUT, DELETE |
| `products/[slug]` | GET, POST, PUT, DELETE |
| `categories` | GET, POST, PUT, DELETE |
| `pages` | GET, POST, PUT, DELETE |
| `formulario` | GET, POST, PUT, DELETE |
| `resenas` | GET, POST, PUT, DELETE |
| `inventario` | GET, POST, PUT, DELETE |
| `pedidos` | GET, POST, PUT, DELETE |
| `blog` | GET, POST, PUT, DELETE |
| `blog/[slug]` | GET, POST, PUT, DELETE |
| `agenda` | GET, POST, PUT, DELETE |
| `paginas` | GET, POST, PUT, DELETE |
| `paginas/[slug]` | GET, POST, PUT, DELETE |

### Authentication

POST/PUT/DELETE endpoints require the header:
```
x-api-key: your_api_key
```

## 7. Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run tests |

## 8. Project Structure

```
src/
├── proxy.ts          # Edge middleware (CORS, security headers)
├── app/
│   ├── agenda/       # Weekly calendar + WhatsApp booking
│   ├── api/          # REST API endpoints (v1 + legacy)
│   ├── blog/         # Blog list, detail, OG/Twitter images
│   ├── contacto/     # Contact form page
│   ├── paginas/      # Legal/policy pages list + detail
│   ├── tienda/       # Product listing + detail
│   └── ...
├── components/
│   ├── agenda/       # WeeklyCalendar, DayColumn, SlotDialog, SlotButton
│   ├── blog/         # PostCard, BlogToolbar, BlogHeroImage
│   ├── metadata/     # JSON-LD structured data components
│   ├── paginas/      # PaginaCard, PaginaToolbar
│   ├── ui/           # shadcn/ui primitives + Typography, Prose, ShareDialog
│   ├── layout/       # Navbar, Footer, PageHeader, GlobalSearch, ThemeToggle
│   ├── products/     # ProductCard, ProductDetails, ProductGrid, TiendaToolbar
│   ├── forms/        # ContactForm
│   ├── cart/         # CartSheet with WhatsApp order summary
│   └── landing/      # Hero section
├── hooks/
├── lib/
│   ├── env.public.ts     # Public environment variable helpers
│   ├── config/           # env.ts + seed data (products, categories, blog, agenda, paginas...)
│   │   └── site/        # All configurable text grouped by module
│   ├── modules/          # Business logic modules (CRUD, notification, scalar...)
│   ├── styles/           # Radix UI color palettes (32)
│   └── test/             # API tests
public/
└── design/               # Logo, background, fallback images
```

## 9. License

MIT License

Copyright (c) 2026 NATULEADAN SAS BIC

---

## 10. Contributors

Developed by [Leonardo Jara](https://github.com/leojara95).

Thanks to all contributors:

<p align="left">
  <a href="https://github.com/natuleadan"><img src="https://avatars.githubusercontent.com/u/210283438?v=4&s=48" width="48" height="48" alt="natuleadan" title="natuleadan"/></a>
  <a href="https://github.com/leojara95"><img src="https://avatars.githubusercontent.com/u/268038834?v=4&s=48" width="48" height="48" alt="leojara95" title="leojara95"/></a>
</p>

---

## Star History

<a href="https://www.star-history.com/?repos=natuleadan%2Fnla-template&type=date&legend=top-left">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/image?repos=natuleadan/nla-template&type=date&theme=dark&legend=top-left" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/image?repos=natuleadan/nla-template&type=date&theme=light&legend=top-left" />
    <img alt="Star History Chart" src="https://api.star-history.com/image?repos=natuleadan/nla-template&type=date&legend=top-left" />
  </picture>
</a>
