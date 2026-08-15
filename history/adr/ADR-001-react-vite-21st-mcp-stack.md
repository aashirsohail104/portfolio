# ADR-001: React + Vite + 21st.dev MCP Frontend Stack

> **Scope**: Document the integrated frontend application stack as one decision cluster. Grouping: React, Vite, TypeScript, Tailwind CSS, react-router, Vitest/RTL, and the 21st.dev MCP component-sourcing mandate all change together.

- **Status:** Proposed
- **Date:** 2026-08-09
- **Feature:** 001-battery-charger-catalog
- **Context:** Anas Electronics is building a premium demo e-commerce storefront — a battery charger product catalog sourced from smarteshop.pk (23 products) with an API-ready JSON data layer, 7 routes, and client-side state only. The ratified constitution makes 21st.dev MCP-first component sourcing NON-NEGOTIABLE (Principle I), which constrains the stack to formats 21st.dev components ship in (React + Tailwind). Delivery must meet the NON-NEGOTIABLE Lighthouse/WCAG budget (Performance ≥ 98, LCP < 2s, CLS < 0.05, INP < 200ms, WCAG 2.2 AA) and be a static build deployable to any host.

## Decision

- **Framework**: React 18 (with react-router for client-side routing; ~7 routes)
- **Language**: TypeScript 5 (ES2022, strict) — types mirror the data-layer JSON Schema contracts
- **Build tool**: Vite (fast dev server, production static output to `dist/`)
- **Styling**: Tailwind CSS, design tokens in `src/styles/tokens.css` (seeded from a 21st.dev theme via `get_theme`), forming the Anas Electronics design system
- **Component source**: 21st.dev MCP server (`21st`, https://21st.dev/api/mcp) — mandatory primary source; every component searched/generated via the MCP and adapted to the design tokens (constitution Principle I/II)
- **Testing**: Vitest + React Testing Library (jsdom) — pure logic (search/filter/sort/cart/wishlist/compare/pricing) unit-tested, components tested with RTL
- **Linting/formatting**: ESLint + Prettier
- **State management**: React Context + LocalStorage persistence (namespaced, versioned keys); no state library — logic isolated as pure modules in `src/lib/logic/`
- **Deployment**: static SPA build to any static host

## Consequences

### Positive

- 21st.dev React/Tailwind components are directly consumable, satisfying the MCP-first mandate and delivering a premium, consistent UI surface with minimal hand-rolled code.
- Vite produces a production-ready static site (HTML/CSS/JS) with a first-class dev server; trivial to deploy anywhere.
- TypeScript strict + JSON Schema contracts give a type-safe, verifiable data layer shared between UI and tests.
- Vitest + RTL give fast unit/component test coverage for the tested pure-logic modules.
- Simple SPA keeps operational burden at zero (no server, no SSR infra).

### Negative

- Client-side rendering means SEO relies entirely on per-route meta/OG/JSON-LD, `robots.txt`, `sitemap.xml`, and breadcrumbs (no SSR) — a dedicated `src/lib/seo/` module is required to hold the SEO ≥ 100 budget.
- No backend: cart/wishlist/compare persist only in LocalStorage; no real checkout/payment (accepted demo-scope tradeoff).
- Product images are hotlinked from the smarteshop.pk CDN — the app depends on that host's availability and bandwidth (local optimized copies deferred as a future optimization).
- Pinning to the React ecosystem constrains 21st.dev reuse to React components and makes a future framework change a coordinated, cross-cutting effort.
- React 18 (not 19) is selected per the plan; framework upgrades must be re-evaluated together with the toolchain.

## Alternatives Considered

- **Next.js + Tailwind + Vercel**: rejected — overkill for a static demo storefront; an SPA is simpler to deploy anywhere, and SSR is not required to meet the SEO budget (static meta + JSON-LD suffice).
- **Vanilla JS + Tailwind CDN**: rejected — 21st.dev components (React/TSX) are not directly consumable; weaker structure for 7 routes + persistent client state.
- **Preact / Svelte + Tailwind**: rejected — smaller 21st.dev component ecosystem; React's ecosystem matches the MCP catalog best.
- **Redux / Zustand for state**: rejected as a separate library — overkill at this scale; React Context + pure logic modules + LocalStorage meet the spec with less complexity.
- **Real backend + DB**: rejected — out of scope for a demo; the API-ready JSON data layer plus the `src/lib/api/client.ts` seam keeps a future REST API swappable without UI changes.

## References

- Feature Spec: specs/001-battery-charger-catalog/spec.md
- Implementation Plan: specs/001-battery-charger-catalog/plan.md
- Research: specs/001-battery-charger-catalog/research.md (sections 2, 3)
- Data Model: specs/001-battery-charger-catalog/data-model.md
- Contracts: specs/001-battery-charger-catalog/contracts/ (product.schema.json, catalog.schema.json, api.md)
- Related ADRs: none (first ADR). A future "Data Layer / API-readiness" ADR is a candidate (contracts/api.md + data-model.md) if it diverges from this stack.
- Evaluator Evidence: history/prompts/001-battery-charger-catalog/2-battery-charger-catalog-implementation-plan.plan.prompt.md; history/prompts/001-battery-charger-catalog/3-battery-charger-catalog-tasks.tasks.prompt.md (listed this ADR as the next step)
