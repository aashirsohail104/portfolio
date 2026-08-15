# Research: Battery Charger Product Catalog

**Branch**: `001-battery-charger-catalog` | **Date**: 2026-08-09 | **Plan**: [plan.md](plan.md)

Phase 0 research output. All decisions resolve the Technical Context and
satisfy the constitution gates.

## 1. Source Data Research (smarteshop.pk)

- **Decision**: Use the official smarteshop.pk Battery Chargers collection
  (`/collections/battery-chargers`) as the single product data source, as
  instructed. Research limited to content only (research integrity principle).
- **Rationale**: The website owner granted explicit permission to use product
  information and images; the user mandates this as the OFFICIAL source.
- **Alternatives considered**: Public product APIs, manual demo data — rejected
  because only the named source carries the accurate hierarchy, specs, and
  imagery.

### Catalog facts captured (2026-08-09)

- **23 products** across 2 collection pages (15 + 8).
- **Product-type buckets** (from source filters): Battery Charger (3),
  Cell (1), Charge Controller (1), Power Supply (2) + mixed items (inverters
  with built-in chargers, pulse-repair chargers, server power supplies,
  protection modules).
- **Pricing**: PKR (Rs.), formatted with commas (e.g., "Rs.9,999"); many items
  discounted with an old price; some show "From Rs." (variant pricing);
  at least one has no discount (EZEE20A Variable).
- **Stock states observed**: in-stock and sold-out items coexist; sold-out
  items show a "Notify me" action on the source.
- **Notable products**: Suoer SAA-1000C / SUA-2000C inverters with chargers;
  Suoer SON-10A+/SON-20A+; EZEE20A 12V/24V 20A pulse repair; 14V 32A/37A/47A/
  57A/82A server chargers (HP 82A ATSN-7001044-Y000); 18650 8-bay charger;
  Homeax DC12V 10A/20A smart chargers; Simtek Planet 40 MPPT controller;
  Gotion 3.7V 50Ah cell; XH-M609 module; Digitech 3-in-1; 12V/24V SMPS
  (10A/20A/30A variants); 12V 100A server PSU.
- **Ratings**: the source publishes no customer ratings — rating/reviews will
  remain empty/omitted (no fabrication).
- **Warranty**: only some items state it (e.g., Simtek "3 Months Warranty");
  others unstated — warranty field per product, empty when source omits.

## 2. 21st.dev MCP Toolset (verified live)

- **Decision**: Use the `21st` MCP server (https://21st.dev/api/mcp) as the
  mandatory component source. Verified live: server `21st v0.1.0` responds;
  `tools/list` exposes 30+ tools.
- **Rationale**: Constitution Principle I (NON-NEGOTIABLE) mandates
  MCP-first component sourcing; React/Tailwind is the catalog's native format,
  so a React + Tailwind app can reuse components directly.
- **Alternatives considered**: hand-writing components — rejected (constitution
  violation); copying from reference site — rejected (research integrity).

### Relevant tools for this feature

| Tool | Use in this feature |
|------|---------------------|
| `search` / `search_picker` | Find product card, gallery, header, footer, drawer, modal, pricing/table, search bar components |
| `get_inspiration` | Project-aware inspiration before implementation (pass design context) |
| `get_component` | Fetch component code (metered; free tier cap — check `get_usage`) |
| `get_theme` | Free theme CSS (Tailwind/shadcn tokens) to seed the Anas Electronics design system |
| `generate` | AI-generate bespoke components (sticky buy box, quick view) when catalog lacks a fit |
| `search_logo` | Brand/UI SVG logos (payment icons, social icons) |
| `get_usage` | Monitor daily retrieval quota before pulling component code |

## 3. Application Stack

- **Decision**: TypeScript 5 + React 18 + Vite + Tailwind CSS; react-router for
  client routing; Vitest + React Testing Library for tests.
- **Rationale**: 21st.dev components are authored in React + Tailwind — this
  stack makes MCP reuse direct. Vite gives production-ready static output
  (HTML/CSS/JS) with a first-class dev server, meeting the "production-ready
  HTML, Tailwind CSS, and modular JavaScript" deliverables. TypeScript adds
  type safety shared with the data-layer contracts.
- **Alternatives considered**:
  - Vanilla JS + Tailwind CDN: rejected — 21st.dev components (React/TSX) not
    directly consumable; weaker structure for 7 routes + state.
  - Next.js: rejected — overkill for a static demo storefront; SPA is
    sufficient and simpler to deploy anywhere.
  - Preact/Svelte: rejected — smaller 21st.dev component ecosystem.

## 4. Data Layer (API-ready JSON)

- **Decision**: Single source of truth in `data/products.json` (+ categories,
  site.json), consumed through a thin data-access client (`src/lib/api/`).
  The client reads bundled JSON today; switching to a REST API later only
  changes the client implementation, never the UI components.
- **Rationale**: Spec FR-002 + SC-002 require updating the catalog by replacing
  JSON or connecting an API without UI changes.
- **Alternatives considered**: hardcoded TS objects (not updatable without
  rebuild/UI edits); a real backend/DB (out of scope for demo, adds ops burden).

## 5. Product Schema & Modeling

- **Decision**: Product entity matches the spec schema exactly (id, slug,
  category, subCategory, brand, productName, shortDescription, fullDescription,
  specifications, features, voltage, chargingCurrent, batteryCompatibility,
  warranty, stockStatus, price, oldPrice, discount, rating, reviews, image,
  galleryImages, tags, relatedProducts). Variants modeled as an optional
  `variants` array for "From Rs." items (price = min across variants).
- **Rationale**: Keeps spec → data-model → JSON contract 1:1 and traceable.
- **Alternatives considered**: flattening variants into separate products —
  rejected (would lose variant grouping and "From" pricing semantics).

## 6. Images

- **Decision**: Store source CDN image URLs in the JSON data layer and
  hotlink them; implement `loading="lazy"` + `srcset`/responsive sizing,
  skeleton loaders, hover preview, gallery/thumbnail/zoom, and progressive
  loading client-side.
- **Rationale**: User explicitly requires using the source images directly and
  maintaining original quality; lazy loading + responsive sizing preserve the
  LCP/CLS budget.
- **Alternatives considered**: downloading + optimizing locally (future
  optimization; adds build-time asset pipeline not required for the demo).

## 7. State & Persistence

- **Decision**: Client-side state via React context + `useLocalStorage` hooks;
  cart/wishlist/compare persisted in LocalStorage. Pure logic (search, filter,
  sort, cart totals, wishlist, compare, pricing/discount) in `src/lib/logic/`
  as pure functions, unit-tested with Vitest.
- **Rationale**: Spec FR-010/FR-011 + Assumptions (demo-scope, no server
  accounts). Pure logic is the constitution-mandated "modular JavaScript".
- **Alternatives considered**: Redux/Zustand (overkill for this scale);
  server-side state (out of scope).

## 8. SEO & Accessibility

- **Decision**: Central `src/lib/seo/` module (meta manager, JSON-LD builders,
  breadcrumbs) applied per route; static `robots.txt`, `sitemap.xml`,
  favicon, and og-image in `public/`; WCAG 2.2 AA patterns (focus management,
  keyboard nav, ARIA, skip links) applied across components.
- **Rationale**: Constitution Principle VI is NON-NEGOTIABLE (SEO ≥ 100,
  Accessibility ≥ 100, WCAG 2.2 AA) and mandates these assets on every page.
- **Alternatives considered**: per-page manual tags (error-prone, duplicated);
  no structured data (fails SEO budget).

## 9. Design System

- **Decision**: Seed the Anas Electronics design system from a 21st.dev theme
  (`get_theme`) and design tokens (colors, typography, spacing, radii, motion)
  in `src/styles/tokens.css`; every reused component adapted to these tokens.
  Visual direction per constitution Principle V (Apple simplicity, Tesla
  typography, EcoFlow cards, DJI spacing, Nothing micro-interactions, Stripe
  docs quality, Vercel minimalism, Linear animations, Raycast polish).
- **Rationale**: Principle II requires one consistent visual language; token
  architecture keeps it maintainable and measurable.
- **Alternatives considered**: ad-hoc Tailwind classes per component
  (inconsistent, violates Principle II).

## Open items

- None. All Technical Context unknowns resolved; no `NEEDS CLARIFICATION`
  markers remain.
