# Feature Specification: Production Order Backend

**Feature Branch**: `002-orders-backend`
**Created**: 2026-08-12
**Status**: Draft
**Input**: Business requirement — transform the demo/dummy checkout into a real
production-ready order workflow that creates orders, stores them, and notifies
the business owner by email, while preserving the existing frontend.

## Summary

Anas Electronics (Korangi No. 6 Market, Karachi · 0312 3581962) sells battery
chargers and solar equipment. Today the checkout completes with a demo toast
and nothing is persisted. This feature adds a serverless order API backed by
Supabase/Postgres and a transactional email notification to
`anasrajputups@gmail.com` so every real customer order is stored and the owner
is notified with a complete, professionally formatted HTML email.

Frontend (Vite SPA) is treated as FINISHED. Only the minimal checkout wiring
is added to connect the real backend.

## Core Requirement

Every successful order submission must:
1. Validate customer info + line items server-side.
2. Compute totals server-side from authoritative product prices in
   `data/products.json` (never trust client prices).
3. Generate a unique human-readable order ID `AE-YYYYMMDD-XXXX`.
4. Store `orders` + `order_items` (historical price snapshots) in Postgres.
5. Email the complete order to `anasrajputups@gmail.com`.
6. Return a real success response with the order ID, then show on the checkout
   page: "Order placed successfully! Your order number is AE-…".

## User Stories

### US1 — Place a Real Order (P1)
Customer complete: browse → cart → checkout form (name, phone, email, whatsapp,
address, city, postal, notes) → **PLACE ORDER** → backend validates → stores
order → emails owner → customer sees real order number.

### US2 — Owner Notification (P1)
On every order, the owner receives `NEW ORDER #AE-… — Anas Electronics` with
full order, customer, product lines, and financial summary.

### US3 — Failure Safety (P2)
If the backend fails, the customer sees "We couldn't place your order right
now. Please try again." with a retry button — never a false success, never
internal errors. If email fails after the order is stored, the order is kept
and marked `notification_status = 'failed'` (retryable).

### US4 — Duplicate Protection (P2)
Double-clicking PLACE ORDER must not create duplicate orders (frontend disable
+ idempotency key + server-side uniqueness).

## Edge Cases / Tests

- Single product qty 1 · multiple products different qty
- Invalid email · missing phone · missing address
- Invalid product ID · quantity 0 · negative quantity
- Tampered client price (reject/use server price)
- Double-click (no duplicate) · DB unavailable · email unavailable
- Existing product flow and search must still work

## Assumptions

- Deployment: Vercel (serverless functions in `api/`).
- Database: Supabase/Postgres (new; none exists). Orders only.
- Email: Resend transactional email. Recipient is Gmail — delivered via Resend
  server-side (no Gmail login, no client credentials).
- Payment: Cash on Delivery initially; payment-method enum is extensible.
- Admin dashboard: deferred to a future phase (documented, not built).
- Stock: only `stockStatus` enum exists today; quantity field is an extension
  point, not implemented now.
- `data/products.json` remains the authoritative server-side product source for
  prices; order items snapshot prices at purchase time.