# Implementation Plan: Battery Charger Product Catalog

**Branch**: `001-battery-charger-catalog` | **Date**: 2026-08-09 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-battery-charger-catalog/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a premium demo e-commerce storefront for the Anas Electronics battery
charger catalog, sourced from the official smarteshop.pk battery chargers
collection (23 products). All product data lives in a reusable, API-ready JSON
data layer decoupled from the UI. The storefront provides catalog browsing
with filter/sort, product detail with gallery + sticky buy box, search,
cart and wishlist with client-side persistence, and side-by-side comparison —
all built with components sourced from the 21st.dev MCP server, adapted to the
Anas Electronics design system, meeting the constitution's Lighthouse budget
and WCAG 2.2 AA.

## Technical Context

**Language/Version**: TypeScript 5 (ES2022, strict) + Node.js 20+  
**Primary Dependencies**: React 18 + Vite + Tailwind CSS (sourced via 21st.dev MCP); react-router; Vitest + React Testing Library  
**Storage**: Local JSON files (`data/products.json`, `data/categories.json`,
`data/site.json`) as the data layer; LocalStorage for cart/wishlist/compare
state  
**Testing**: Vitest unit tests for search/filter/sort/cart/wishlist/compare
logic; component tests with Testing Library  
**Target Platform**: Static web app (Vite build output deployable to any
static host; modern evergreen browsers)  
**Project Type**: web (frontend-only)  
**Performance Goals**: Lighthouse Performance ≥ 98, LCP < 2s, CLS < 0.05,
INP < 200ms; lazy-loaded + optimized images  
**Constraints**: WCAG 2.2 AA; SEO assets on every page; responsive across
mobile/tablet/laptop/desktop/ultrawide; 21st.dev MCP-first component sourcing;
JSON data layer must be swappable for a future API without UI changes  
**Scale/Scope**: 23 products, ~7 routes (home, catalog, product detail, cart,
wishlist, compare, search), client-side state only

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Gates derived from the Anas Electronics constitution (v1.0.0):

1. **21st.dev MCP-First (NON-NEGOTIABLE)** — PASS. React + Tailwind stack is
   selected specifically so 21st.dev components (React/Tailwind) are directly
   consumable. Plan mandates searching the `21st` MCP before manually creating
   any component.
2. **Component Reuse & Design System** — PASS. All components adapted to the
   Anas Electronics design system; most premium/performant 21st.dev version
   chosen per surface.
3. **Professional Prompt Architecture** — PASS. Implementation prompts follow
   Mission → Rules → Architecture → Skills → Subagents → Planning →
   Implementation → Testing → Optimization → Final Review.
4. **Mandatory Skills & Subagent Pipeline** — PASS. UIUX-Pro-Max, Framer
   Motion, Performance, SEO, Accessibility, JS Architecture, E-commerce UX
   skills loaded; single-responsibility subagent pipeline used.
5. **Design Excellence** — PASS. Design direction references Apple simplicity,
   Tesla typography, EcoFlow cards, DJI spacing, Nothing micro-interactions,
   Stripe docs quality, Vercel minimalism, Linear animations, Raycast polish.
6. **Performance / SEO / Accessibility Budget (NON-NEGOTIABLE)** — PASS.
   Hard targets encoded in Technical Context and Success Criteria.
7. **Research Integrity** — PASS. Research (this plan) is limited to product
   content from smarteshop.pk; no layout/CSS/branding/copy is copied.

No violations. Complexity Tracking intentionally left empty.

## Project Structure

### Documentation (this feature)

```text
specs/001-battery-charger-catalog/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
data/                        # Reusable, API-ready data layer (single source of truth)
├── products.json            # All 23 products (full schema from spec)
├── categories.json          # Category/subCategory hierarchy
└── site.json                # Site config (brand, contact, delivery info)

src/
├── main.tsx                 # App entry + router
├── app.tsx                  # Root layout (header, nav, footer, drawer)
├── assets/
│   └── images/              # Fetched product images (lazy, optimized)
├── components/              # 21st.dev-sourced components adapted to design system
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductCardSkeleton.tsx
│   │   ├── QuickView.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── ProductThumbnails.tsx
│   │   ├── StickyBuyBox.tsx
│   │   ├── RelatedProducts.tsx
│   │   └── CompareBar.tsx
│   ├── layout/             # Header, Nav, Footer, CartDrawer
│   ├── search/             # SearchBar, SearchResults
│   ├── commerce/           # AddToCartButton, WishlistButton, QtyStepper, PriceTag, DiscountBadge, StockBadge, RatingStars
│   └── ui/                 # Skeleton, Modal, Toast, EmptyState, Spinner
├── hooks/                  # useCart, useWishlist, useCompare, useProducts, useLocalStorage, useDebounce
├── lib/
│   ├── api/                # Data access layer (loads JSON today, swappable for API later)
│   │   ├── client.ts       # fetchProducts/fetchCategories/fetchProductBySlug
│   │   └── types.ts        # Product, Category, Variant types (mirrors contracts/)
│   ├── logic/              # Pure, tested business logic
│   │   ├── search.ts       # searchProducts
│   │   ├── filter.ts       # filterByType, filterByPrice
│   │   ├── sort.ts         # sortProducts
│   │   ├── cart.ts         # cart reducer + totals
│   │   ├── wishlist.ts
│   │   ├── compare.ts
│   │   └── pricing.ts      # discount %, currency formatting
│   └── seo/                # Meta manager, schema.org builders, breadcrumbs
├── pages/                  # Route components
│   ├── HomePage.tsx        # Hero, featured, best sellers, flash sale
│   ├── CatalogPage.tsx     # Filter/sort grid
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   ├── WishlistPage.tsx
│   ├── ComparePage.tsx
│   └── SearchPage.tsx
├── styles/                 # Tailwind + design tokens (Anas Electronics DS)
│   ├── tokens.css          # Colors, typography, spacing, radii, motion
│   └── main.css
└── vite-env.d.ts

public/                      # Static SEO assets
├── index.html               # App shell (meta, OG, JSON-LD)
├── robots.txt
├── sitemap.xml
├── favicon.svg
└── og-image.png

tests/
├── unit/
│   ├── logic/               # search, filter, sort, cart, wishlist, compare, pricing
│   ├── api/                 # data layer contract tests (fixtures vs schema)
│   └── components/          # Testing Library component tests
└── fixtures/                # sample products.json for tests

config/
├── vite.config.ts           # Vite + Vitest config, path aliases
├── tsconfig.json
└── tailwind.config.js
```

**Structure Decision**: Frontend-only static web app with Vite. Data is
separated from UI via `data/` + `src/lib/api/` (a thin client that reads JSON
now and can switch to `fetch()` against a REST API later with zero component
changes). Business logic is isolated as pure functions in `src/lib/logic/`
for unit testing. Components live in `src/components/` grouped by surface
(product, layout, search, commerce, ui). This honors the "reusable JSON data
layer" and "modular JavaScript" constitution requirements.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations; complexity justified by feature scope (React +
Vite + typed data layer are the smallest viable stack that satisfies the
21st.dev MCP component-reuse mandate and the JSON/API-swappable requirement).
