# API Contract (future-proof)

**Branch**: `001-battery-charger-catalog` | **Date**: 2026-08-09

The demo storefront consumes the local JSON data layer (`data/`) through
`src/lib/api/client.ts`. This document fixes the data-access contract so a
future REST API can replace the JSON without touching UI components.

## Contract invariant

- UI components depend ONLY on `src/lib/api/client.ts` + the TypeScript types
  in `src/lib/api/types.ts` (which mirror `contracts/product.schema.json`).
- Swapping the source is a change to `client.ts` alone.

## Client surface (async, promise-based)

```ts
getCatalog(): Promise<Catalog>          // products + categories + source meta
getProductBySlug(slug: string): Promise<Product | null>
getRelatedProducts(product: Product): Promise<Product[]>
getCategories(): Promise<Category[]>
```

## Future REST mapping (informative)

| Client method | Future REST endpoint | Returns |
|---------------|----------------------|---------|
| `getCatalog` | `GET /api/catalog` | `Catalog` object (same JSON schema) |
| `getProductBySlug` | `GET /api/products/:slug` | `Product` (product.schema.json) |
| `getRelatedProducts` | `GET /api/products/:slug/related` | `Product[]` |
| `getCategories` | `GET /api/categories` | `Category[]` |

## Error model

- Client methods resolve to typed data or throw; callers surface a friendly
  empty/error state (never a crash).
- On JSON source, failures mean missing/corrupt files → validate against the
  JSON Schema and fall back to an empty catalog with a console warning.
- A future API should return `404` for unknown slugs and `5xx` for failures;
  the client normalizes both to `null` / empty arrays.
