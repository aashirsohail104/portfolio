# Quickstart: Battery Charger Product Catalog

**Branch**: `001-battery-charger-catalog` | **Date**: 2026-08-09

Production-ready React + TypeScript + Tailwind demo storefront for the Anas
Electronics battery charger catalog. Product data lives in `data/` (JSON,
API-ready) — see [data-model.md](data-model.md) and [contracts/](contracts/).

## Prerequisites

- Node.js 20+ and npm (or pnpm)

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

Serves the app with hot reload (Vite). Open the printed local URL.

## Build

```bash
npm run build
```

Outputs optimized static site to `dist/` (HTML + JS + CSS), ready for any
static host.

## Preview production build

```bash
npm run preview
```

## Test

```bash
npm run test          # Vitest unit + component tests (watch)
npm run test:run      # single run (CI)
```

Logic tests cover search, filter, sort, cart totals, wishlist, compare, and
pricing/discount formatting.

## Lint / typecheck

```bash
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit
```

## Updating the catalog

Edit `data/products.json` (validated against `contracts/product.schema.json`),
then rebuild. No UI component changes required — see [api.md](contracts/api.md)
for switching to a live API later.

## Concurrency-friendly checks (quality gates)

- Lighthouse (local): Performance ≥ 98, Accessibility ≥ 100, SEO ≥ 100,
  Best Practices ≥ 100, CLS < 0.05, LCP < 2s, INP < 200ms
- WCAG 2.2 AA manual + automated pass
- All UI components sourced from the 21st.dev MCP and adapted to the Anas
  Electronics design system
