# Implementation Plan: Production Order Backend

**Branch**: `002-orders-backend` | **Date**: 2026-08-12 | **Spec**: [spec.md](spec.md)

## Architecture Decision

```
Browser SPA (unchanged)  ── POST /api/orders ──▶ Vercel Node serverless fn
                                                   │ validation (catalog prices)
                                                   │ order number AE-YYYYMMDD-XXXX
                                                   │ Supabase transaction (orders + items)
                                                   ▼
                                        Resend ──▶ anasrajputups@gmail.com
```

- **API**: single Vercel function `api/orders.ts` (no Express/Hono needed).
  Vercel runs TS functions via esbuild — no separate build step.
- **Database**: Supabase Postgres via `@supabase/supabase-js`, service-role key
  used ONLY server-side. RLS enabled tables with no anon policy.
- **Email**: Resend SDK (`resend` npm). HTML body built by a pure function in
  `api/lib/order-core.ts`.
- **Server-side totals**: re-resolve each line against `data/products.json`
  (imported into the function). Client prices/totals are ignored.
- **Atomicity**: single SQL RPC (`create_order`) runs the insert transaction.
- **Order number**: `AE-<YYYYMMDD>-<1..9999>` from a per-day sequence table;
  retried on collision.
- **Idempotency**: client sends `idempotencyKey` (crypto.randomUUID); unique
  column; duplicate submit returns the existing order.
- **Secrets**: env only (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
  `RESEND_API_KEY`, `ORDER_NOTIFICATION_EMAIL`). `.env*` is gitignored.

## Files

### Create
- `api/orders.ts` — Vercel handler (validate → create → notify → respond)
- `api/lib/order-core.ts` — pure logic: `validateOrder`, `computeTotals`,
  `buildOrderNumber`, `buildOrderEmailHtml`, `OrderPayload`/`OrderResult` types
- `supabase/migrations/0001_orders.sql` — enum, tables, indexes, `create_order` RPC
- `src/pages/CheckoutPage.tsx` — real checkout form + success/failure states
- `src/lib/orders.ts` — `placeOrder(payload, idempotencyKey)` client
- `tests/unit/orders/order-core.test.ts`, `tests/unit/orders/orders-api.test.ts`
- `vercel.json` (SPA rewrite), `.env.example`
- `specs/002-orders-backend/{spec,plan,tasks}.md`

### Modify
- `src/pages/CartPage.tsx` — Checkout button → navigate `/checkout`
- `src/components/cart/CartDrawer.tsx` — "Go to checkout" → `/checkout`
- `src/app.tsx` — lazy route `/checkout`
- `config/tsconfig.json` — include `../api`, add `node` types
- `package.json` — add `@supabase/supabase-js`, `resend`
- `AGENTS.md`, `tests/qa-report.md`

### Preserve (untouched)
All `src/components/**` styling, `src/pages/{Home,Catalog,ProductDetail,Wishlist,
Compare,Search,Contact}`, `data/**`, `src/styles/**`, animations, design tokens,
and all existing routes/tests.

## Phases
1. Audit (done) → 2. Architecture (this doc) → 3. Database migration →
4. `order-core.ts` + handler → 5. Email template → 6. Checkout integration →
7. Security review → 8. Tests (14 scenarios) → 9. Deployment config →
10. Full journey verification.