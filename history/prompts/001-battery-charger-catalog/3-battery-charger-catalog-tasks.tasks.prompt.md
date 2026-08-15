---
id: 3
title: Battery charger catalog task decomposition
stage: tasks
date: 2026-08-09
surface: agent
model: deepseek-v4-flash-free
feature: 001-battery-charger-catalog
branch: 001-battery-charger-catalog
user: Haroon Traders
command: /sp.tasks
labels: ["tasks", "catalog", "planning", "user-stories"]
links:
  spec: specs/001-battery-charger-catalog/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-battery-charger-catalog/tasks.md
tests:
  - None (planning stage, no runtime code)
---

## Prompt

(The user invoked /sp.tasks with empty argument text; the task list must be
generated from the ratified constitution and the spec/plan for feature
001-battery-charger-catalog. 21st.dev MCP-first component sourcing is
mandatory (constitution Principle I); every component task must search the
21st MCP before any manual implementation.)

## Response snapshot

Produced specs/001-battery-charger-catalog/tasks.md: 75 tasks T001-T075
organized into 8 phases.

- Phase 1 Setup (T001-T009, all [P]): Vite + React 18 + TS project, deps,
  Tailwind + tokens.css, route skeleton, Vitest config, ESLint/Prettier,
  directory structure.
- Phase 2 Foundational (T010-T022): data/products.json (23 products),
  categories.json, site.json; contract validation test vs JSON Schema;
  src/lib/api/types.ts + client.ts + tests; tests/fixtures/products.json;
  src/lib/logic/pricing.ts + tests; useLocalStorage/useDebounce hooks;
  21st.dev-sourced base UI components (Button, Badge, Skeleton, Modal, Toast,
  EmptyState, Spinner); public/ SEO assets; src/lib/seo/ module. BLOCKS all
  user stories.
- Phase 3 User Story 1 Browse (T023-T034, P1, MVP): sort/filter logic +
  tests-first, ProductCard/Skeleton/QuickView/PriceTag/DiscountBadge/StockBadge
  from 21st.dev MCP, FilterSidebar, useProducts, CatalogPage with URL query
  sync, lazy images.
- Phase 4 User Story 2 Details (T035-T043, P1): ProductGallery, StickyBuyBox,
  ProductSpecs/Features/TrustBadges, RelatedProducts, useProductDetail,
  ProductDetailPage (/product/:slug), breadcrumbs + Product schema.org.
- Phase 5 User Story 3 Search (T044-T050, P2): search logic + tests, SearchBar,
  SearchPage, HomePage discovery sections, FlashSaleBanner, header wiring.
- Phase 6 User Story 4 Cart/Wishlist (T051-T060, P2): cart.ts/wishlist.ts +
  tests-first, useCart/useWishlist (versioned LocalStorage), commerce buttons,
  CartDrawer, CartPage, WishlistPage, header counts.
- Phase 7 User Story 5 Compare (T061-T066, P3): compare.ts + tests-first,
  useCompare, CompareBar, ComparePage, card/detail toggle.
- Phase 8 Polish (T067-T075): full SEO JSON-LD, WCAG 2.2 AA audit, performance
  pass (CLS < 0.05, INP < 200ms), Framer Motion polish, e-commerce UX, full
  test/lint/typecheck, Lighthouse ≥ 98/100/100/100, QA report, production build.

Format: "- [ ] T### [P] [Story] Description with exact file path"; per-story
independent tests-first; MVP = US1 only; US1/US2 parallel after Foundational,
US3/US4/US5 depend on US1.

## Outcome

- ✅ Impact: Decomposed the catalog feature into 75 ordered, testable tasks
  with clear parallel opportunities and an MVP-first incremental delivery
  strategy.
- 🧪 Tests: None (planning stage, no runtime code)
- 📁 Files: specs/001-battery-charger-catalog/tasks.md
- 🔁 Next prompts: /sp.adr (react-vite-21st-mcp-stack) then implementation via
  the constitution 15-phase workflow; remind user to restart opencode so the
  21st MCP config loads before component tasks.
- 🧠 Reflection: Kept every component task explicit about sourcing from the
  21st.dev MCP first to honor constitution Principle I; locked tests-first for
  all pure logic modules to guarantee test failure before implementation; each
  story has an independent test gate so stories can ship separately.

## Evaluation notes (flywheel)

- Failure modes observed: create-new-feature.ps1 crashed on a 4-arg Join-Path
  after creating the branch; worked around by manually creating
  history/prompts/001-battery-charger-catalog/ (inherited from /sp.spec).
- Graders run and results (PASS/FAIL): tasks.md validated against the
  tasks-template format (IDs, [P], [Story], exact paths); 75 tasks present;
  no [NEEDS CLARIFICATION] markers.
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
