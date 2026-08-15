import { describe, expect, it } from "vitest";
import * as client from "@/lib/api/client";
import fixturesProducts from "@test/fixtures/products.json";

const fixtures = fixturesProducts as unknown as import("@/lib/api/types").Product[];

describe("api client pure helpers", () => {
  it("findProduct returns the product for a known slug and null for an unknown slug", () => {
    const known = fixtures[0];
    expect(client.findProduct(fixtures, known.slug)).toEqual(known);
    expect(client.findProduct(fixtures, "no-such-product-slug")).toBeNull();
  });

  it("findProduct is case-sensitive on slug", () => {
    const known = fixtures[0];
    expect(client.findProduct(fixtures, known.slug.toUpperCase())).toBeNull();
  });

  it("relatedProducts returns valid Product[] and drops unknown slugs without crashing", () => {
    const target = {
      ...fixtures[0],
      slug: "synthetic-related-target",
      relatedProducts: [fixtures[0].slug, "does-not-exist-slug-xyz"],
    };
    const related = client.relatedProducts(fixtures, target);
    expect(Array.isArray(related)).toBe(true);
    expect(related).toHaveLength(1);
    expect(related[0]).toMatchObject({ slug: fixtures[0].slug });
  });
});

describe("api client async contract surface", () => {
  it("getProductBySlug resolves a Product for a catalog slug and null for an unknown slug", async () => {
    const catalog = await client.getCatalog();
    const slug = catalog.products[0].slug;
    const product = await client.getProductBySlug(slug);
    expect(product).not.toBeNull();
    expect(product?.slug).toBe(slug);
    expect(await client.getProductBySlug("no-such-catalog-slug")).toBeNull();
  });

  it("getCatalog resolves products (>= 20) and categories (>= 5)", async () => {
    const catalog = await client.getCatalog();
    expect(catalog.products.length).toBeGreaterThanOrEqual(20);
    expect(catalog.categories.length).toBeGreaterThanOrEqual(5);
    expect(typeof catalog.version).toBe("string");
  });

  it("getCategories resolves the catalog's category entries", async () => {
    const catalog = await client.getCatalog();
    const categories = await client.getCategories();
    expect(categories.length).toBeGreaterThanOrEqual(5);
    for (const category of catalog.categories) {
      expect(categories).toContainEqual(category);
    }
  });

  it("variant product price equals the minimum of its variant prices", () => {
    const variantProduct = fixtures.find(
      (p) => Array.isArray(p.variants) && p.variants.length > 0
    );
    expect(variantProduct).toBeDefined();
    const min = Math.min(...variantProduct!.variants!.map((v) => v.price));
    expect(variantProduct!.price).toBe(min);
  });
});