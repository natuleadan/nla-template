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
- **Agent tools**: products, product detail (with reviews), pages, blog, agenda, company info, long-term memory
- **Phone anonymization** — HMAC-SHA256 with `WS_ENCRYPTION_KEY`, no raw numbers in Redis
- **Session history** — 7 days in Redis, persists across serverless instances
- **Long-term memory** — 1 year in Redis, agent persists customer preferences/data
- **Memory management** — `deleteMemory` tool for GDPR compliance (deletes all customer keys)
- **Web UI integration** — button clicks from the store (e.g. "Pedir por WhatsApp") are recorded as `system` messages in session history so the agent has context

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

### AI Agent Tools (23 tools)

**Públicas (cualquier usuario):**

| Tool | Params | Description |
|---|---|---|
| `getProducts` | `query?`, `category?` | Catalog + stock por variante (desde Redis) |
| `getProductDetail` | `slug` | Product info + variantes + stock + reviews aprobadas |
| `getPages` | `query?`, `category?` | Institutional pages |
| `getPageDetail` | `slug` | Full page content |
| `getBlog` | `query?`, `category?` | Blog posts |
| `getPostDetail` | `slug` | Full article content |
| `getAgenda` | `day?` | Available slots (checked against Redis real-time) |
| `getCompanyInfo` | — | Contact/social data |
| `saveLongMemory` | `key`, `value`, `override?` | 1-year persistent memory |
| `searchMyHistory` | `limit?` | Recent conversation history |
| `deleteMemory` | `confirm="BORRAR"` | Deletes ALL customer data (GDPR) |
| `createReview` | `productSlug`, `comment`, `rating` | Creates review (pending moderation, name from WhatsApp or "Anónimo") |
| `getMyReviews` | — | User's own reviews |
| `setReviewVisibility` | `id`, `visibility` | Toggle public/private on own review |
| `createComment` | `postSlug`, `name`, `comment` | Blog comment (pending moderation) |
| `getMyComments` | — | User's own comments |
| `setCommentVisibility` | `id`, `visibility` | Toggle public/private on own comment |
| `getMyAppointments` | — | User's own appointments |
| `createAppointment` | `day`, `time`, `type` | Book appointment (checks real availability, notifies admin) |
| `createOrder` | `items`, `total`, `email`, `idNumber`, `fullName`, `deliveryAddress` | Create order (pending_payment, notifies admin) |
| `getMyOrders` | — | User's own orders |
| `getOrderDetail` | `id` | Order detail (own or admin) |
| `shareDeliveryGps` | `orderId`, `lat`, `lng` | Save delivery GPS location |

**Admin-only (requiere `ADMIN_WHATSAPP` en env):**

| Tool | Params | Description |
|---|---|---|
| `updateStock` | `slug`, `variantId`, `quantity` | Set product variant stock in Redis |
| `getPendingReviews` | — | List reviews pending moderation |
| `approveReview` | `id` | Approve review → visible to public |
| `rejectReview` | `id` | Reject review → removed from queue |
| `getPendingComments` | — | List comments pending moderation |
| `approveComment` | `id` | Approve comment |
| `rejectComment` | `id` | Reject comment |
| `getAllAppointments` | — | All appointments in system |
| `getAppointmentDetail` | `id` | Full appointment details |
| `updateApptStatus` | `id`, `status` | Set confirmed/cancelled/completed/noshow |
| `getAllOrders` | — | All orders in system |
| `updateOrderStatus` | `id`, `status` | paid/shipping/delivered/cancelled |
| `verifyPayment` | `id`, `confirmed` | Human-in-the-loop: confirms payment, notifies customer |

### Pages & Blog
- Pages module — legal & policy pages, config-driven
- Blog module — list + detail with reading time, author
- OG/Twitter images per page and post
- JSON-LD structured data

### Scheduling
- Weekly calendar with responsive grid
- Time slots config-driven per day
- WhatsApp booking via YCloud API

### SEO & Design
- Dynamic OG/Twitter images (Satori)
- JSON-LD: BreadcrumbList, Product, BlogPosting, WebPage, Event, Organization, WebSite
- Dynamic brand colors via `NEXT_PUBLIC_BRAND_COLOR` (32 Radix UI palettes)
- PWA manifest, sitemap.xml, robots.txt, llms.txt
- Dark mode toggle
- CORS proxy via middleware

### Storage
- **Upstash Redis** for production — sessions, long-term memory, rate limiting, dedup, message queue
- **In-memory Map fallback** when Redis is not configured — same APIs, no persistence across restarts
- **Phone anonymization** via HMAC-SHA256 with `WS_ENCRYPTION_KEY` — no raw phone numbers in Redis

### Redis Business Data
- **Stock**: `bus:stock:{slug}` — HASH por variante, actualizado por admin
- **Reviews**: `bus:review:{id}` + sets pending/approved/my — moderación + visibilidad public/private
- **Comments**: `bus:comment:{id}` + sets pending/approved/my — moderación + visibilidad
- **Appointments**: `bus:appointment:{id}` + agenda hash `bus:agenda:{day}` — disponibilidad real
- **Orders**: `bus:order:{id}` + sets my/all + GPS `deliveryGpsLat/Lng` — ciclo de pago con human-in-the-loop
- **Admin detection**: `ADMIN_WHATSAPP` env var privada (no expuesta al público)
- **Notifications**: creación de cita/pedido → notifica al admin; confirmación de pago → notifica al cliente

### Testing
- **326 tests** (Vitest)
- Organized by domain: webhook, session-store, tools, config coverage, console guards

## Technology Stack

- **Framework**: Next.js 16 + Turbopack
- **Language**: TypeScript 5.7+
- **UI**: shadcn/ui + Tailwind CSS
- **API**: Next.js Route Handlers (REST)
- **AI**: Vercel AI SDK + OpenAI (gpt-5-nano via Gateway, Whisper for audio)
- **WhatsApp**: YCloud API (outbound SDK + inbound webhooks)
- **Redis**: Upstash (sessions, memory, rate limiting, dedup)
- **Testing**: Vitest (326 tests)
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
| `/api/v1/products` | GET, POST, PUT, DELETE | Seed + Redis stock | POST/PUT/DELETE require key |
| `/api/v1/products/[slug]` | GET, POST, PUT, DELETE | Seed + Redis stock + reviews | POST/PUT/DELETE require key |
| `/api/v1/categories` | GET, POST, PUT, DELETE | Seed (validated) | POST/PUT/DELETE require key |
| `/api/v1/pages` | GET, POST, PUT, DELETE | Seed (validated) | POST/PUT/DELETE require key |
| `/api/v1/paginas` | GET, POST, PUT, DELETE | Seed (validated) | POST/PUT require key |
| `/api/v1/paginas/[slug]` | GET, POST, PUT, DELETE | Seed (validated) | POST/PUT/DELETE require key |
| `/api/v1/blog` | GET, POST, PUT, DELETE | Seed (validated) | POST/PUT require key |
| `/api/v1/blog/[slug]` | GET, POST, PUT, DELETE | Seed (validated) | POST/PUT/DELETE require key |
| `/api/v1/resenas/[productSlug]` | GET, POST, PUT, DELETE | Seed + Redis approved | PUT/DELETE require key, GET/POST público |
| `/api/v1/inventario/[productSlug]` | GET, POST, PUT, DELETE | Seed + Redis stock enrich | POST/PUT/DELETE require key |
| `/api/v1/pedidos` | GET, POST, PUT, DELETE | Redis `bus:order:*` | GET/PUT/DELETE require key, POST público |
| `/api/v1/pedidos/[id]` | GET | Redis `bus:order:{id}` | Público |
| `/api/v1/formulario` | GET, POST, PUT, DELETE | In-memory | POST público, GET/PUT/DELETE require key |
| `/api/v1/agenda` | GET, POST, PUT, DELETE | Seed + Redis slots | POST/PUT require key |
| `/api/v1/chat` | POST | Redis + AI | Requiere key |
| `/api/v1/webhooks/ycloud` | GET, POST | YCloud WhatsApp | Público (HMAC) |
| `/api/v1/whatsapp/send` | POST | YCloud SDK | Público (rate-limited) |
| `/ordenes/[orderId]` | GET | Redis via Server Component | Público (Partial Prerender) |

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
│   └── tools.test.ts          → products, reviews, pages, blog, agenda
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
| `pnpm test` | Vitest (326 tests) |
| `pnpm format` | Prettier |

## License

MIT License — Copyright (c) 2026 NATULEADAN SAS BIC

Developed by [Leonardo Jara](https://github.com/leojara95).
