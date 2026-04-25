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

NLA Template is a Next.js 16 e-commerce starter template with shadcn/ui components. It provides a complete foundation for building modern e-commerce applications with REST API, authentication, and best practices.

Built with Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui. Ready to deploy to Vercel with CI/CD and automated releases.

## 2. Features

- **Next.js 16** with App Router and Turbopack
- **shadcn/ui** components for modern UI
- **REST API** with 8 categories and 4 endpoints each (GET/POST/PUT/DELETE)
- **Scalar API Documentation** at `/api`
- **Husky + Commitlint** for conventional commits
- **GitHub Actions CI/CD** with build, lint, and test
- **Semantic Release** for automated versioning
- **CodeQL** security scanning
- **Cookie Consent** with shadcn components
- **Geolocation** service with Vercel headers
- **Notifications** with Sonner
- **Product Gallery** with carousel and fallback images

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

| Variable | Description | Default |
|----------|-------------|---------|
| `API_KEY` | API key for protected endpoints | (required) |
| `NEXT_PUBLIC_BASE_URL` | Base URL of the application | http://localhost:3000 |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number for orders | 1234567890 |

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
app/
├── api/              # REST API endpoints
│   └── v1/          # API v1 (8 categories)
components/
├── ui/               # shadcn/ui components
├── layout/           # Navbar, Footer
├── products/         # ProductCard, ProductDetails
lib/
├── config/           # Environment variables
└── modules/          # Business logic
    ├── products/     # Product management
    ├── reviews/      # Reviews
    ├── inventory/    # Inventory
    └── scalar/      # API documentation
public/
├── design/          # Icons and placeholders
└── store/           # Product images
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