<p align="center">
  <img src="public/design/logo.svg" alt="NLA Template" width="120" height="120" />
</p>

<h1 align="center">NLA Template</h1>
<p align="center"><strong>Next.js 16 E-commerce Template with WhatsApp AI Agent</strong></p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge" alt="Next.js" />
  <img src="https://img.shields.io/badge/shadcn/ui-components-blueviolet?style=for-the-badge" alt="shadcn/ui" />
  <img src="https://img.shields.io/badge/AI-OpenAI-green?style=for-the-badge" alt="OpenAI" />
  <img src="https://img.shields.io/badge/Redis-Upstash-red?style=for-the-badge" alt="Upstash Redis" />
</p>

## Features

### WhatsApp AI Agent
- **Inbound webhook** at `/api/v1/webhooks/ycloud` — receives WhatsApp messages from customers via YCloud
- **yCloud signature verification** — HMAC-SHA256 with `YCloud-Signature: t=...,s=...` header
- **Mark as read + typing indicator** — calls yCloud API to show double-check and typing status
- **Message debounce** — 10s window collects burst messages via Redis queue, only processes the last one
- **AI agent** with `gpt-5-nano` via Vercel AI Gateway — responds to customer inquiries
- **Multimodal**: audio transcription (Whisper via OpenAI), image analysis with compression, PDF text extraction
- **Protected chat API** at `/api/v1/chat` — same agent logic, requires `x-api-key` header
- **Agent tools**: products, product detail, pages, blog, company info, long-term memory, derivation to human
- **Phone anonymization** — HMAC-SHA256 with `WS_ENCRYPTION_KEY`, no raw numbers in Redis
- **Session history** — 7 days in Redis, persists across serverless instances
- **Long-term memory** — 1 year in Redis, agent persists customer preferences/data
- **Memory management** — `deleteMemory` tool for GDPR compliance (deletes all customer keys)
- **Web UI integration** — button clicks from the store (e.g. "Pedir por WhatsApp") are recorded as `system` messages in session history so the agent has context
- **Phone cookie** — after first WhatsApp send, the phone is saved in a cookie (15 min TTL). Subsequent clicks send directly without showing the dialog, with auto-reload of the phone number when the cookie expires

### Rate Limiting
- **Redis-based** (cross-instance): 1 msg per 30s per IP, 1 msg per 30s per recipient
- **In-memory fallback**: 2/min per IP, 10/hr per IP, 10/hr per recipient, 50/hr global

### E-commerce
- **Next.js 16** with App Router and Turbopack
- **shadcn/ui** components for modern UI
- **REST API** with 13+ v1 CRUD endpoints
- **Scalar API Documentation** at `/api`
- **WhatsApp API (YCloud)** — send messages via YCloud SDK with country code dialog
- **Product Gallery** with carousel and fallback images
- **Reviews** system with star rating
- **Inventory** tracking by location
- **Geolocation** service with Vercel headers
- **Cookie Consent** banner
- **Notifications** with Sonner toasts
- **Product filtering** — search + category filter

### AI Agent Tools (14 tools)

**Públicas (cualquier usuario) — 11 tools:**

| Tool | Params | Description |
|---|---|---|
| `getProducts` | `query?`, `category?` | Product catalog from hardcoded data |
| `getProductDetail` | `slug` | Full product info with variants and prices |
| `getPages` | `query?`, `category?` | Institutional pages (terms, privacy, etc.) |
| `getPageDetail` | `slug` | Full page content |
| `getBlog` | `query?`, `category?` | Blog posts |
| `getPostDetail` | `slug` | Full article content |
| `getCompanyInfo` | — | Contact/social data from brand config |
| `saveLongMemory` | `key`, `value`, `override?` | 1-year persistent memory in Redis |
| `searchMyHistory` | `limit?` | Recent conversation history from Redis session |
| `deleteMemory` | `confirm="BORRAR"` | Deletes ALL customer data (GDPR). Two-step confirmation. |
| `deriveToHuman` | `reason` | ⚠️ Blocks chat 24h, transfers to admin. Use when no tool exists for user's request. |

**Admin-only (requiere `ADMIN_WHATSAPP` en env):**

| Tool | Params | Description |
|---|---|---|
| `getDerivedConversations` | — | Lists all chats pending human attention (SCAN wa:derived:*) |
| `resolveDerivation` | `phone` | Frees a derived chat so the agent resumes responding |
| `findChatByPhone` | `phone` | Looks up session history for a given phone number |

### Pages & Blog
- Pages module — legal & policy pages, config-driven
- Blog module — list + detail with reading time, author
- OG/Twitter images per page and post
- JSON-LD structured data

### Scheduling
- Weekly calendar with responsive grid (frontend only)
- Time slots config-driven per day
- Booking requires human intervention via agent derivation

### SEO & Design
- Dynamic OG/Twitter images (Satori)
- JSON-LD: BreadcrumbList, Product, BlogPosting, WebPage, Event, Organization, WebSite
- Dynamic brand colors via `NEXT_PUBLIC_BRAND_COLOR` (32 Radix UI palettes)
- PWA manifest, sitemap.xml, robots.txt, llms.txt
- Dark mode toggle
- CORS proxy via middleware

### Storage
- **Upstash Redis** for production — sessions, long-term memory, rate limiting, dedup, message queue, derivation flags
- **In-memory Map fallback** when Redis is not configured — same APIs, no persistence across restarts (derivation always returns false)
- **Phone anonymization** via HMAC-SHA256 with `WS_ENCRYPTION_KEY` — no raw phone numbers in Redis keys

### Redis — Solo infraestructura del agente
Redis solo almacena datos de infraestructura del agente. No hay datos de tienda (productos, pedidos, reseñas, citas, stock) en Redis.

| Key Pattern | TTL | Purpose |
|---|---|---|
| `wa:session:{hash}` | 7d | Chat history + session state |
| `wa:longmemory:{hash}` | 365d | Agent-persisted customer data |
| `wa:queue:{hash}` | — | Message debounce (cleared after drain) |
| `wa:dedup:{wamid}` | 1h | Webhook deduplication |
| `wa:ratelimit:ip:{ip}` | 30s | Per-IP rate limit |
| `wa:ratelimit:to:{to}` | 30s | Per-recipient rate limit |
| `wa:derived:{hash}` | 24h | Derivation flag — blocks agent, requires admin |

El agente es **solo informativo**: responde con datos de las tools de consulta. Si el usuario necesita una acción (comprar, agendar, cancelar, etc.) y no existe tool, el agente llama `deriveToHuman` y un administrador retoma el chat.

### Testing
- **315 tests** (Vitest) — 6 test files
- Organized by domain: webhook, session-store, tools, API endpoints, config coverage, console guards

## Technology Stack

- **Framework**: Next.js 16 + Turbopack
- **Language**: TypeScript 5.7+
- **UI**: shadcn/ui + Tailwind CSS
- **API**: Next.js Route Handlers (REST)
- **AI**: Vercel AI SDK + OpenAI (gpt-5-nano via Gateway, Whisper for audio)
- **WhatsApp**: YCloud API (outbound SDK + inbound webhooks)
- **Redis**: Upstash (sessions, memory, rate limiting, dedup)
- **Testing**: Vitest (315 tests)
- **CI/CD**: GitHub Actions + Semantic Release
- **Hosting**: Vercel

## Environment Variables

### Public (`src/lib/env.public.ts`)

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_BRAND_COLOR` | Radix UI palette name | nla |
| `NEXT_PUBLIC_BASE_URL` | Base URL | http://localhost:3000 |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Business WhatsApp number | 1234567890 |
| `NEXT_PUBLIC_INDEXING` | Enable indexing | false |
| `NEXT_PUBLIC_WEEK_MAX` | Max agenda weeks | 4 |

### Private (`src/lib/env.ts`)

| Variable | Description |
|---|---|
| `ADMIN_WHATSAPP` | Admin WhatsApp number (private, for admin tools detection) |
| `API_KEY` | API key for protected endpoints |
| `YCLOUD_API_KEY` | YCloud API key (send + media download) |
| `YCLOUD_WEBHOOK_SECRET` | Webhook secret for HMAC verification |
| `WS_ENCRYPTION_KEY` | HMAC key for phone anonymization in Redis |
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway key (chat + images via gateway) |
| `AI_GATEWAY_ZDR` | Zero Data Retention (default: `false`, requires Vercel Pro/Enterprise) |
| `OPENAI_API_KEY` | OpenAI API key (audio transcription via Whisper) |
| `AI_PROVIDER` | Provider mode: `mixed` (gateway+openai) or `openai` (all via openai) |
| `KV_REST_API_URL` | Upstash Redis REST URL |
| `KV_REST_API_TOKEN` | Upstash Redis REST token |

## API Endpoints

| Route | Methods | Data source | Auth |
|---|---|---|---|---|
| `/api/v1/products` | GET, POST, PUT, DELETE | Seed (hardcoded TS) | POST/PUT/DELETE require key |
| `/api/v1/products/[slug]` | GET, POST, PUT, DELETE | Seed (hardcoded TS) | POST/PUT/DELETE require key |
| `/api/v1/categories` | GET, POST, PUT, DELETE | Seed (hardcoded TS) | POST/PUT/DELETE require key |
| `/api/v1/pages` | GET, POST, PUT, DELETE | Seed (hardcoded TS) | POST/PUT/DELETE require key |
| `/api/v1/paginas` | GET, POST, PUT, DELETE | Seed (hardcoded TS) | POST/PUT/DELETE require key |
| `/api/v1/paginas/[slug]` | GET, POST, PUT, DELETE | Seed (hardcoded TS) | POST/PUT/DELETE require key |
| `/api/v1/blog` | GET, POST, PUT, DELETE | Seed (hardcoded TS) | POST/PUT/DELETE require key |
| `/api/v1/blog/[slug]` | GET, POST, PUT, DELETE | Seed (hardcoded TS) | POST/PUT/DELETE require key |
| `/api/v1/resenas/[productSlug]` | GET | Seed (in-memory) | Público |
| `/api/v1/formulario` | GET, POST, PUT, DELETE | In-memory | POST público, GET/PUT/DELETE require key |
| `/api/v1/agenda` | GET, POST, PUT, DELETE | Seed (in-memory) | POST/PUT/DELETE require key |
| `/api/v1/chat` | POST | Redis (sessions) + AI | Requiere key |
| `/api/v1/webhooks/ycloud` | GET, POST | YCloud WhatsApp | Público (HMAC) |
| `/api/v1/whatsapp/send` | POST | YCloud SDK | Público (rate-limited) |

### Authentication
POST/PUT/DELETE endpoints require header: `x-api-key: your_api_key`
The `/api/v1/chat` endpoint also requires `x-api-key`.

### In-memory Fallback
When Upstash Redis is not configured (`KV_REST_API_URL` empty), all storage functions fall back to local `Map` objects:
- **Sessions & long memory** — `Map<string, string>` in process memory
- **Message queue** — `Map<string, string[]>` for debounce
- **Dedup** — `Set<string>` with `setTimeout` cleanup (1h TTL)
- **Rate limit** — `Map<string, number>` with expiration timestamps

This allows full local development without Redis. Restarting the server clears all in-memory data.

## Redis Keys Structure

| Key Pattern | Type | TTL | Purpose |
|---|---|---|---|
| `wa:session:{hash}` | STRING | 7 days | Conversation history (user/assistant/system) |
| `wa:longmemory:{hash}` | STRING | 1 year | Agent-persisted customer data |
| `wa:queue:{hash}` | LIST | — | Message debounce (cleared after processing) |
| `wa:dedup:{wamid}` | STRING | 1 hour | yCloud retry dedup |
| `wa:ratelimit:ip:{ip}` | STRING | 30s | Per-IP rate limit |
| `wa:ratelimit:to:{number}` | STRING | 30s | Per-recipient rate limit |
| `wa:derived:{hash}` | STRING | 24h | Derivation flag — blocks agent, flags chat for admin |

## Project Structure

```
src/
├── app/api/v1/
│   ├── chat/           → chat with AI agent (protected)
│   ├── webhooks/ycloud/   → inbound WhatsApp webhook
│   ├── whatsapp/send/     → outbound WhatsApp sender
│   └── [products|blog|...] → CRUD endpoints
├── components/
│   ├── ui/whatsapp-dialog.tsx  → phone input + send dialog
│   ├── whatsapp-provider.tsx   → useWhatsApp() hook
│   └── ...
├── lib/
│   ├── external/
│   │   ├── ai/            → Vercel AI SDK (gateway, openai, transcription, image/pdf analysis)
│   │   └── upstash/       → Redis client
│   ├── modules/agents/    → Agent service, session-store, tools, schemas
│   ├── config/data/       → Seed data (products, pages, blog, agenda...)
│   └── test/              → 310 tests organized by domain
└── ...
```

## Test Structure

```
src/lib/test/
├── agents/
│   ├── webhook.test.ts        → signature, payload, URL
│   ├── session-store.test.ts  → anonymize, session, dedup, multimodal
│   └── tools.test.ts          → products, reviews, pages, blog, agenda, form
├── api.test.ts                → REST endpoint auth + CRUD
├── config-keys.test.ts        → UI config coverage
└── console-isdev.test.ts      → console.* guards
```

## Available Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest (315 tests) |
| `pnpm format` | Prettier |

## License

MIT License — Copyright (c) 2026 NATULEADAN SAS BIC

Developed by [Leonardo Jara](https://github.com/leojara95).
