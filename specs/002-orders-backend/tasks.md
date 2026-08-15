---
description: "Task list for production order backend implementation"
---

# Tasks: Production Order Backend

**Row format**: `[ID] [P] [Domain] Description — file`

- **Tests first**: order-core tests MUST fail before the logic they exercise.
- **[P]**: can run in parallel (different files).

## Phase A — Foundation

- [ ] T001 [P] Audit existing checkout + deployment (`src/pages/CartPage.tsx`,
  `src/lib/api/`, `package.json`) — DONE during plan.
- [X] T002 [P] Add deps `@supabase/supabase-js`, `resend` (package.json)
- [X] T003 [P] Add `vercel.json` SPA rewrite + `.env.example`
- [X] T004 [P] Extend `config/tsconfig.json` to include `../api` + `node` types
- [ ] T005 [P] Create `specs/002-orders-backend/{spec,plan,tasks}.md`

## Phase B — Database

- [ ] T010 Database agent: `supabase/migrations/0001_orders.sql` — order_status
  enum, `orders`, `order_items` (price snapshots), indexes, unique constraints,
  RLS (no anon policy), `create_order` RPC transaction.

## Phase C — Core logic + API

- [ ] T020 [P] Testing agent: `tests/unit/orders/order-core.test.ts` FIRST —
  validation, totals, tampered price, order number (RED)
- [ ] T021 Core agent: `api/lib/order-core.ts` — `OrderPayload` types,
  `validateOrder`, `computeTotals` (server prices), `buildOrderNumber`,
  `buildOrderEmailHtml` (GR
- [ ] T030 [P] Testing agent: `tests/unit/orders/orders-api.test.ts` FIRST —
  idempotency, db-down, email-down (RED)
- [ ] T031 API agent: `api/orders.ts` — Vercel handler: parse+cap, honeypot,
  idempotency lookup, validate, `create_order` RPC, Resend notify,
  `notification_status`, safe error responses.

## Phase D — Checkout integration

- [ ] T040 Frontend agent: `src/lib/orders.ts` (placeOrder client) +
  `src/pages/CheckoutPage.tsx` (form, order summary, success w/ order number,
  failure + retry) + wire `src/pages/CartPage.tsx`, `src/components/cart/CartDrawer.tsx`,
  `src/app.tsx`.

## Phase E — Verify & document

- [ ] T050 Run `npm run typecheck`, `npm run lint`, `npm run test:run`,
  `npm run build` — all green
- [ ] T051 Security review (secrets, validation, rate-limit hooks, CORS)
- [ ] T052 Update `tests/qa-report.md`, `AGENTS.md`, README backend section

## Test scenarios (must cover)

1. One product qty 1 · 2. Multi-product different qty · 3. Invalid email ·
4. Missing phone · 5. Missing address · 6. Invalid product ID · 7. Qty 0 ·
8. Negative qty · 9. Tampered frontend price (use server price) ·
10. Double-click (no duplicate) · 11. DB unavailable (safe error) ·
12. Email unavailable (order kept) · 13. Existing product flow works ·
14. Existing search works.