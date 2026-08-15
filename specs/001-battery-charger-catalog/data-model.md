# Data Model: Battery Charger Product Catalog

**Branch**: `001-battery-charger-catalog` | **Date**: 2026-08-09 | **Plan**: [plan.md](plan.md)

Defines entities, fields, relationships, and validation rules for the JSON
data layer and client state. The entity fields map 1:1 to the feature spec
schema and to the contracts in `/contracts/`.

## Entities

### 1. Product

The core catalog entity. Mirrors the spec schema exactly.

| Field | Type | Required | Description / Validation |
|-------|------|----------|--------------------------|
| `id` | string | ✅ | Stable unique identifier (slug-derived). Pattern: `^[a-z0-9]+(-[a-z0-9]+)*$` |
| `slug` | string | ✅ | URL slug. Unique, same pattern as `id` |
| `category` | string | ✅ | Top-level category, e.g. `"Battery Charger"`, `"Server Power Supply"`, `"Cell"`, `"Charge Controller"`, `"Power Supply"`, `"Module"`, `"Inverter"` |
| `subCategory` | string | ⬜ | Narrower bucket, e.g. `"Automatic"`, `"Pulse Repair"`, `"Smart"`, `"Solar"` |
| `brand` | string | ⬜ | Manufacturer (e.g., `"Suoer"`, `"EZEE"`, `"Homeax"`, `"HP"`, `"Simtek"`, `"Gotion"`) |
| `productName` | string | ✅ | Display name exactly as on source site |
| `shortDescription` | string | ✅ | One-to-two line summary for cards/listings |
| `fullDescription` | string | ✅ | Detailed description (detail page) |
| `specifications` | array | ⬜ | List of `{ label, value }` rows for the spec table |
| `features` | array | ⬜ | List of feature strings (bullet list) |
| `voltage` | string | ⬜ | e.g. `"12V/24V"`, `"14V"` — used for compare |
| `chargingCurrent` | string | ⬜ | e.g. `"20A"`, `"10A/20A"` — used for compare |
| `batteryCompatibility` | string | ⬜ | e.g. `"Lead Acid / AGM / Gel"`, `"18650 Li-ion"` |
| `warranty` | string | ⬜ | e.g. `"3 Months Warranty"`; empty when source omits |
| `stockStatus` | enum | ✅ | `"in_stock"` \| `"sold_out"` |
| `price` | number | ✅ | Selling price in PKR (min price for variant products) |
| `oldPrice` | number \| null | ⬜ | Compare-at price; `null` when not discounted |
| `discount` | number | ⬜ | Computed percent (0 when no oldPrice) |
| `rating` | number | ⬜ | 0..5; `0` when no source rating (no fabrication) |
| `reviews` | number | ⬜ | Review count; `0` when none |
| `image` | string | ✅ | Primary image URL (source CDN) |
| `galleryImages` | array | ⬜ | Additional image URLs for the gallery |
| `tags` | array | ⬜ | Search/filter tags (product type, brand, use-case) |
| `relatedProducts` | array | ✅ | Slugs of related products (can be empty) |
| `variants` | array | ⬜ | Only for "From Rs." items; see Variant |

**Validation rules**

- `id` and `slug` are required, URL-safe, and unique across the catalog.
- `price` ≥ 0; `oldPrice` > `price` when present; `discount` =
  `round((1 - price/oldPrice) * 100)` when `oldPrice` present, else 0.
- `stockStatus` must be one of the two enum values.
- `image` must be an absolute HTTPS URL.
- `relatedProducts` references product `slug` values only; unknown slugs are
  ignored at render time (defensive) but flagged in schema validation.
- `variants` may not be empty if present; `price` equals the minimum variant
  price.

### 2. Variant

Optional option set for variable-priced products (e.g., 12V/24V SMPS in
10A/20A/30A).

| Field | Type | Required | Description / Validation |
|-------|------|----------|--------------------------|
| `name` | string | ✅ | Variant label, e.g. `"20A"` |
| `price` | number | ✅ | Variant price in PKR, ≥ 0 |
| `oldPrice` | number \| null | ⬜ | Compare-at price for this variant |
| `stockStatus` | enum | ✅ | `in_stock` \| `sold_out` |

### 3. Category / SubCategory

Used for navigation and filtering (mirrors source filter buckets).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | e.g. `"Battery Charger"` |
| `slug` | string | ✅ | URL-safe identifier |
| `subCategories` | array | ⬜ | Nested sub-category names/slugs |
| `count` | number | ⬜ | Product count (derived, optional) |

### 4. CartItem (client state)

| Field | Type | Required | Description / Validation |
|-------|------|----------|--------------------------|
| `productId` | string | ✅ | Product `id` |
| `variantName` | string \| null | ⬜ | Selected variant, if any |
| `quantity` | number | ✅ | Integer ≥ 1 (upper bound 99) |
| `addedAt` | number | ✅ | Epoch ms for ordering |

### 5. WishlistItem (client state)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `productId` | string | ✅ | Product `id` |
| `addedAt` | number | ✅ | Epoch ms |

### 6. CompareItem (client state)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `productId` | string | ✅ | Product `id` |

Validation: max 4 compared products.

## Relationships

- **Product → Variant**: 1-to-many (optional). A product with variants uses
  the minimum variant price as its display `price`.
- **Product → Category / SubCategory**: many-to-one (a product belongs to one
  category and optionally one subCategory).
- **Product → Product (relatedProducts)**: self-referential many-to-many via
  slug references.
- **Product → CartItem / WishlistItem / CompareItem**: referenced by `id`;
  client state resolves against the catalog at load time and drops orphans.

## State Transitions

- **Cart item**: `add` (create qty 1) → `increment` / `decrement` (qty up to
  99, down to 1) → `remove`. Removing at qty 1 deletes the item.
- **Stock status**: static per product in the JSON; UI switches between
  "Add to cart" (in stock) and "Notify me" (sold out). No runtime transition.
- **Compare set**: `add` (up to 4) → `remove`. Adding a 5th replaces the
  oldest or is rejected (decided at implementation).

## Persistence

- Cart, wishlist, and compare sets persist to LocalStorage under namespaced
  keys (e.g., `anas-elec.cart.v1`); schema-versioned to allow future
  migration. Corrupt/invalid stored state is discarded and reinitialized.
