---

description: "Task list for battery charger catalog feature implementation"

---

# Tasks: Battery Charger Product Catalog

**Input**: Design documents from `/specs/001-battery-charger-catalog/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The plan.md and quickstart.md commit to Vitest unit tests for the
pure logic modules (search, filter, sort, cart, wishlist, compare, pricing)
and contract validation of the JSON data layer against the JSON Schema. These
are included below. All logic tests MUST be written first and fail before the
implementation task that makes them pass.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `src/` + `data/` + `public/` + `tests/` at repository root
- Paths below follow the plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 [P] Initialize Vite + React + TypeScript project (package.json, config/vite.config.ts, config/tsconfig.json, index.html, .gitignore)
- [X] T002 [P] Install runtime dependencies: react, react-dom, react-router, tailwindcss (package.json)
- [X] T003 [P] Install dev dependencies: typescript, @vitejs/plugin-react, vitest, @testing-library/react, @testing-library/jest-dom, jsdom, eslint, prettier (package.json)
- [X] T004 [P] Configure Tailwind CSS + PostCSS (config/tailwind.config.js, postcss.config.js, src/styles/main.css)
- [X] T005 [P] Create design tokens for the Anas Electronics design system in src/styles/tokens.css (colors, typography, spacing, radii, motion)
- [X] T006 [P] Create app entry + route skeleton (src/main.tsx, src/app.tsx, src/pages/*.tsx placeholder route components)
- [X] T007 [P] Configure Vitest + test setup (config/vite.config.ts test block, tests/setup.ts, jsdom environment)
- [X] T008 [P] Configure ESLint/Prettier + npm scripts (eslint.config.js, .prettierrc, "dev/build/test/lint/typecheck" in package.json)
- [X] T009 [P] Create directory structure (src/components/{product,layout,search,commerce,ui}, src/hooks, src/lib/{api,logic,seo}, src/pages, src/styles, public/, tests/{unit,fixtures})

**Checkpoint**: Project boots (`npm run dev`), `npm run build`, and `npm run test` all work.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**âš ï¸ CRITICAL**: No user story work can begin until this phase is complete

- [X] T010 Create data/products.json with all 23 products from the source collection (full schema: id, slug, category, subCategory, brand, productName, shortDescription, fullDescription, specifications, features, voltage, chargingCurrent, batteryCompatibility, warranty, stockStatus, price, oldPrice, discount, rating, reviews, image, galleryImages, tags, relatedProducts, variants where applicable) in data/products.json
- [X] T011 Create data/categories.json (category/subCategory hierarchy) and data/site.json (brand, contact, delivery info) in data/
- [X] T012 [P] Write contract validation test for data/products.json + data/categories.json against contracts/product.schema.json + contracts/catalog.schema.json in tests/unit/api/catalog.contract.test.ts
- [X] T013 Define data-layer types mirroring contracts/product.schema.json in src/lib/api/types.ts (Product, Variant, Category, Catalog)
- [X] T014 Implement data access client in src/lib/api/client.ts (getCatalog, getProductBySlug, getRelatedProducts, getCategories)
- [X] T015 [P] Write unit tests for data access client in tests/unit/api/client.test.ts (uses tests/fixtures/products.json)
- [X] T016 Create tests/fixtures/products.json (subset fixture matching the contract) in tests/fixtures/
- [X] T017 Implement pricing/discount helpers in src/lib/logic/pricing.ts (discount %, Rs. currency formatting, oldPrice validation)
- [X] T018 [P] Write unit tests for pricing in tests/unit/logic/pricing.test.ts
- [X] T019 [P] Implement persistence hooks in src/hooks/useLocalStorage.ts and src/hooks/useDebounce.ts
- [X] T020 [P] Source and adapt base design-system components from the 21st.dev MCP in src/components/ui/ (Button, Badge, Skeleton, Modal, Toast, EmptyState, Spinner) adapted to Anas Electronics tokens
- [X] T021 [P] Create static SEO assets in public/ (robots.txt, sitemap.xml, favicon.svg, og-image.png placeholder)
- [X] T022 Implement base SEO module in src/lib/seo/ (meta manager, breadcrumbs, schema.org builders)

**Checkpoint**: Data layer loads all 23 products; fixtures validate against schema; base UI + SEO primitives ready.

---

## Phase 3: User Story 1 - Browse the Battery Charger Catalog (Priority: P1) ðŸŽ¯ MVP

**Goal**: Catalog page renders all products from the data layer with filter/sort; cards show image, name, price, discount badge, stock status.

**Independent Test**: Open the catalog page and confirm all 23 source products render with correct names, PKR prices, stock status, and images; selecting a product-type filter and price range changes visible results; sort options reorder without reload.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T023 [P] [US1] Unit tests for sort logic (featured, best-selling, price asc/desc, alphabetically) in tests/unit/logic/sort.test.ts
- [X] T024 [P] [US1] Unit tests for filter logic (byType, byPrice) in tests/unit/logic/filter.test.ts

### Implementation for User Story 1

- [X] T025 [P] [US1] Implement sort logic in src/lib/logic/sort.ts (featured, best-selling, price asc/desc, alphabetical)
- [X] T026 [P] [US1] Implement filter logic in src/lib/logic/filter.ts (filterByType, filterByPrice)
- [X] T027 [P] [US1] Source and adapt ProductCard from the 21st.dev MCP in src/components/product/ProductCard.tsx (image, name, price, oldPrice, discount badge, stock badge, quick view trigger)
- [X] T028 [P] [US1] Create ProductCardSkeleton in src/components/product/ProductCardSkeleton.tsx (image skeleton loading)
- [X] T029 [P] [US1] Source and adapt commerce primitives from the 21st.dev MCP in src/components/commerce/ (PriceTag, DiscountBadge, StockBadge, RatingStars)
- [X] T030 [P] [US1] Source and adapt QuickView modal from the 21st.dev MCP in src/components/product/QuickView.tsx (image, price, stock, add-to-cart trigger)
- [X] T031 [P] [US1] Source and adapt filter sidebar + grid layout from the 21st.dev MCP in src/components/layout/ (FilterSidebar.tsx, product grid container)
- [X] T032 [US1] Implement useProducts hook in src/hooks/useProducts.ts (load catalog, expose products/categories)
- [X] T033 [US1] Implement CatalogPage in src/pages/CatalogPage.tsx (grid, type + price-range filters, sort controls, sold-out states, URL query sync)
- [X] T034 [US1] Add lazy-loaded responsive images with hover preview on product cards in src/components/product/ProductCard.tsx

**Checkpoint**: User Story 1 fully functional â€” catalog browses, filters, and sorts correctly. MVP is deliverable.

---

## Phase 4: User Story 2 - View Product Details (Priority: P1)

**Goal**: Product detail page renders all fields from the data layer with image gallery, specs, sticky buy box, and related products.

**Independent Test**: Open any product detail page and confirm every field renders (gallery, specs, price, warranty, stock); sticky buy box stays visible while scrolling; out-of-stock shows "notify me".

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T035 [P] [US2] Component test for StickyBuyBox visibility on scroll in tests/unit/components/sticky-buy-box.test.tsx
- [X] T036 [P] [US2] Component test for gallery thumbnail switching in tests/unit/components/product-gallery.test.tsx

### Implementation for User Story 2

- [X] T037 [P] [US2] Source and adapt ProductGallery + thumbnails from the 21st.dev MCP in src/components/product/ProductGallery.tsx (main image, thumbnail navigation, zoom, hover preview, progressive loading)
- [X] T038 [P] [US2] Implement StickyBuyBox in src/components/product/StickyBuyBox.tsx (price, qty stepper, add-to-cart, sold-out/notify-me state)
- [X] T039 [P] [US2] Source and adapt specs/features display from the 21st.dev MCP in src/components/product/ (ProductSpecs.tsx, ProductFeatures.tsx, ProductTrustBadges.tsx)
- [X] T040 [P] [US2] Source and adapt RelatedProducts from the 21st.dev MCP in src/components/product/RelatedProducts.tsx
- [X] T041 [US2] Implement useProductDetail hook in src/hooks/useProductDetail.ts (getProductBySlug + getRelatedProducts)
- [X] T042 [US2] Implement ProductDetailPage in src/pages/ProductDetailPage.tsx (route /product/:slug; gallery, descriptions, specs, features, voltage, current, compatibility, warranty, price, stock, related)
- [X] T043 [US2] Add breadcrumbs + Product schema.org structured data for the detail page (src/lib/seo/)

**Checkpoint**: User Story 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - Search and Discover Products (Priority: P2)

**Goal**: Search by name/tag returns cards quickly; home page surfaces featured, best-sellers, and flash-sale sections.

**Independent Test**: Search a known product name/tag and confirm matching cards appear in under 1 second; empty query shows friendly empty state; home page sections render product cards that link to detail pages.

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T044 [P] [US3] Unit tests for search logic (name + tags, debounce, empty results) in tests/unit/logic/search.test.ts

### Implementation for User Story 3

- [X] T045 [P] [US3] Implement search logic in src/lib/logic/search.ts (searchProducts by name + tags)
- [X] T046 [P] [US3] Source and adapt SearchBar from the 21st.dev MCP in src/components/search/SearchBar.tsx (debounced live results)
- [X] T047 [US3] Implement SearchPage in src/pages/SearchPage.tsx (results grid, empty state with suggestions)
- [X] T048 [P] [US3] Build HomePage discovery sections in src/pages/HomePage.tsx (hero, featured, best sellers, flash sale) reusing ProductCard
- [X] T049 [P] [US3] Create FlashSaleBanner countdown component in src/components/product/FlashSaleBanner.tsx
- [X] T050 [US3] Wire header search into SearchPage route (src/components/layout/Header.tsx)

**Checkpoint**: Search returns results quickly and home page discovery sections render. User Stories 1-3 functional.

---

## Phase 6: User Story 4 - Save to Cart and Wishlist (Priority: P2)

**Goal**: Add to cart and wishlist from cards/quick view/detail; cart quantities adjustable; both persist across sessions.

**Independent Test**: Add a product to the cart and wishlist, reload the page, and confirm both persist; increase cart quantity and confirm the total updates; remove and confirm counts update.

### Tests for User Story 4

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T051 [P] [US4] Unit tests for cart logic (add, increment, decrement, remove, totals, persistence shape) in tests/unit/logic/cart.test.ts
- [X] T052 [P] [US4] Unit tests for wishlist logic (add, remove, toggle, has) in tests/unit/logic/wishlist.test.ts

### Implementation for User Story 4

- [X] T053 [P] [US4] Implement cart logic in src/lib/logic/cart.ts (reducer: add, increment, decrement, remove, totals)
- [X] T054 [P] [US4] Implement wishlist logic in src/lib/logic/wishlist.ts (add, remove, toggle, has)
- [X] T055 [P] [US4] Implement useCart and useWishlist hooks in src/hooks/ (LocalStorage persistence via useLocalStorage, namespaced versioned keys)
- [X] T056 [P] [US4] Source and adapt AddToCartButton, WishlistButton, QtyStepper from the 21st.dev MCP in src/components/commerce/
- [X] T057 [US4] Source and adapt CartDrawer from the 21st.dev MCP in src/components/layout/CartDrawer.tsx (line items, qty, remove, totals, checkout CTA)
- [X] T058 [US4] Implement CartPage in src/pages/CartPage.tsx (line items, qty steppers, totals, empty state, sticky summary)
- [X] T059 [US4] Implement WishlistPage in src/pages/WishlistPage.tsx (grid of saved products, move-to-cart, empty state)
- [X] T060 [US4] Integrate cart/wishlist counts into Header and wire actions into ProductCard, QuickView, and detail buy box (src/components/layout/Header.tsx, src/components/product/)

**Checkpoint**: User Stories 1-4 functional â€” cart and wishlist persist and update correctly.

---

## Phase 7: User Story 5 - Compare Products (Priority: P3)

**Goal**: Select multiple products for side-by-side comparison of price and specifications.

**Independent Test**: Select two or more products and confirm a comparison view renders their attributes in aligned columns; removing a product updates the view immediately.

### Tests for User Story 5

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T061 [P] [US5] Unit tests for compare logic (add up to 4, remove, has) in tests/unit/logic/compare.test.ts

### Implementation for User Story 5

- [X] T062 [P] [US5] Implement compare logic in src/lib/logic/compare.ts (add up to 4, remove, has)
- [X] T063 [P] [US5] Implement useCompare hook in src/hooks/useCompare.ts (LocalStorage persistence)
- [X] T064 [P] [US5] Source and adapt CompareBar from the 21st.dev MCP in src/components/product/CompareBar.tsx (floating bar with selected products)
- [X] T065 [US5] Implement ComparePage in src/pages/ComparePage.tsx (side-by-side attributes: image, price, voltage, chargingCurrent, batteryCompatibility, specifications; remove product; empty state)
- [X] T066 [US5] Add compare toggle to ProductCard and ProductDetailPage (src/components/product/)

**Checkpoint**: All five user stories independently functional.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T067 [P] Implement full SEO: Organization/WebSite/BreadcrumbList/Product JSON-LD + per-route meta/OG in src/lib/seo/ and src/app.tsx
- [X] T068 [P] Accessibility audit and fixes (WCAG 2.2 AA: keyboard navigation, focus management, ARIA, skip links, color contrast) across src/components/ and src/pages/
- [X] T069 [P] Performance pass: lazy route code-splitting (React.lazy), image lazy loading audit, CLS/INP check (CLS < 0.05, INP < 200ms)
- [X] T070 [P] Animation polish with Framer Motion: page transitions, micro-interactions, loading skeletons across src/components/ and src/pages/
- [X] T071 [P] E-commerce UX polish: sticky buy box mobile behavior, gallery swipe, cart drawer animations (src/components/)
- [X] T072 [P] Run full test suite (npm run test:run) and fix failures; run `npm run lint` and `npm run typecheck` and fix issues
- [ ] T073 [P] Run Lighthouse on all routes and verify Performance â‰¥ 98, Accessibility â‰¥ 100, SEO â‰¥ 100, Best Practices â‰¥ 100
- [X] T074 [P] Create testing checklist + QA report in tests/qa-report.md
- [X] T075 Run production build (npm run build) and verify dist/ output includes SEO assets (robots.txt, sitemap.xml, favicon, og-image)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 and US2 can proceed in parallel (both depend only on Foundational)
  - US3 depends on US1 (reuses ProductCard + catalog data)
  - US4 depends on US1 (ProductCard/QuickView actions) and Foundational (useLocalStorage)
  - US5 depends on US1 (ProductCard compare toggle)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P2)**: Depends on US1 (reuses ProductCard, catalog data)
- **User Story 4 (P2)**: Depends on US1 (card actions) + Foundational (persistence hooks)
- **User Story 5 (P3)**: Depends on US1 (ProductCard compare toggle)

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Logic (src/lib/logic) before hooks (src/hooks)
- Hooks before components
- Components before pages
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks (T001-T009) can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- US1 and US2 run in parallel after Foundational
- All tests for a story marked [P] can run in parallel
- All logic implementations marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all US1 tests together:
Task: "Unit tests for sort logic in tests/unit/logic/sort.test.ts"
Task: "Unit tests for filter logic in tests/unit/logic/filter.test.ts"

# Launch all US1 logic + components together:
Task: "Implement sort logic in src/lib/logic/sort.ts"
Task: "Implement filter logic in src/lib/logic/filter.ts"
Task: "Source ProductCard from 21st.dev MCP in src/components/product/ProductCard.tsx"
Task: "Create ProductCardSkeleton in src/components/product/ProductCardSkeleton.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Browse catalog, filter, sort, images, sold-out states
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational â†’ Foundation ready
2. Add User Story 1 â†’ Test independently â†’ Deploy/Demo (MVP!)
3. Add User Story 2 â†’ Test independently â†’ Deploy/Demo
4. Add User Story 3 â†’ Test independently â†’ Deploy/Demo
5. Add User Story 4 â†’ Test independently â†’ Deploy/Demo
6. Add User Story 5 â†’ Test independently â†’ Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3 (after US1 baseline)
   - Developer D: User Story 4 (after US1 baseline)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- All component tasks MUST search the 21st.dev MCP first and adapt the most premium/performant component to the Anas Electronics design system (constitution mandate); manually building a component that exists on 21st.dev is a violation
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence


