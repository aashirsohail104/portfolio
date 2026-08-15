# Anas Electronics Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-08-11

## Active Technologies

- TypeScript 5 (ES2022, strict) + Node.js 20+ + React 18 + Vite + Tailwind CSS (via 21st.dev MCP) + Vitest + React Testing Library (001-battery-charger-catalog)

## Project Structure

```text
data/
src/
public/
tests/
config/
```

## Commands

npm run dev; npm run build; npm test; npm run lint; npm run typecheck

## Code Style

TypeScript 5 (ES2022, strict) + Node.js 20+: Follow standard conventions

## Recent Changes

- 001-battery-charger-catalog: Added TypeScript 5 + React 18 + Vite + Tailwind CSS (21st.dev MCP component sourcing)
- 001-battery-charger-catalog: Premium redesign — design tokens (--neon, --shadow-premium, --font-display Outfit, marquee/float keyframes), 3-tier header + category nav deep-links, solar/inverter hero, 10-section homepage, catalog URL query-param sync (sticky sidebar), polished ProductCard, premium Footer (real site.json contact), ContactPage (/contact), micro-interactions + reduced-motion + a11y fixes. 33 products / 12 categories, 121 tests green.

<!-- MANUAL ADDITIONS START -->
- Image fix (2026-08-12): replaced 10 broken Phase-0 solar main images + 1 Simtek gallery (all 404) with exact smarteshop.pk matches; Shopify width=600 optimization on heavy PNGs (nalibatt/voltronic/inverterzone/fnirsi); new shared fallback helper src/lib/image.ts (fallbackImage + onImgError) wired into every product-image <img>; schema is additionalProperties:false so imageSource/imageMatch documented in tests/qa-report.md instead of data. 121 tests green.
- Order backend (2026-08-12): Vercel serverless API (api/orders.ts) + Supabase Postgres (supabase/migrations/0001_orders.sql) + Resend email; pure core (api/lib/order-core.ts: validateOrder, computeTotals, buildOrderNumber, buildOrderEmailHtml); checkout page (src/pages/CheckoutPage.tsx) + client (src/lib/orders.ts); idempotency, server-side totals from data/products.json, email to anasrajputups@gmail.com; 38 new tests (20 order-core + 18 api), 159 total green. Frontend unchanged except CartPage/CartDrawer/app.tsx checkout wiring.
<!-- MANUAL ADDITIONS END -->
