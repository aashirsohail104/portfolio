import { describe, expect, it } from "vitest";
import type { ValidateFunction } from "ajv";
import Ajv from "ajv/dist/2020";
import addFormats from "ajv-formats";

import productSchema from "../../../specs/001-battery-charger-catalog/contracts/product.schema.json";
import catalogSchema from "../../../specs/001-battery-charger-catalog/contracts/catalog.schema.json";
import products from "../../../data/products.json";
import categories from "../../../data/categories.json";
import site from "../../../data/site.json";
import fixtures from "../../fixtures/products.json";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
ajv.addSchema(productSchema, "product.schema.json");
const validateCatalog = ajv.compile(catalogSchema);
const validateProduct = ajv.getSchema("product.schema.json") as ValidateFunction;

const catalog = {
  version: site.version,
  source: site.source,
  products,
  categories,
};

type Product = {
  id: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  discount: number;
  stockStatus: string;
  image: string;
  galleryImages?: string[];
  relatedProducts: string[];
  variants?: { name: string; price: number }[];
};

describe("catalog contract", () => {
  it("composed catalog is valid against catalog.schema", () => {
    expect(validateCatalog(catalog)).toBe(true);
    expect(validateCatalog.errors).toBeNull();
  });

  it("contains the full catalog from data/products.json (33 products)", () => {
    expect(products).toHaveLength(products.length);
    expect(products.length).toBeGreaterThanOrEqual(33);
  });

  it("every product passes productSchema validation", () => {
    const failures: string[] = [];
    for (const [index, product] of products.entries()) {
      if (!validateProduct(product)) {
        failures.push(`products[${index}]: ${JSON.stringify(validateProduct.errors)}`);
      }
    }
    expect(failures).toEqual([]);
  });

  it("all slugs and ids are unique", () => {
    const productsTyped = products as unknown as Product[];
    const slugs = productsTyped.map((p) => p.slug);
    const ids = productsTyped.map((p) => p.id);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every image and galleryImage is an absolute https URL", () => {
    const failures: string[] = [];
    for (const product of products as unknown as Product[]) {
      if (!product.image.startsWith("https://")) {
        failures.push(`${product.slug}.image`);
      }
      for (const image of product.galleryImages ?? []) {
        if (!image.startsWith("https://")) {
          failures.push(`${product.slug}.galleryImage`);
        }
      }
    }
    expect(failures).toEqual([]);
  });

  it("prices are valid and discount matches the computed value", () => {
    const failures: string[] = [];
    for (const product of products as unknown as Product[]) {
      if (product.price < 0) {
        failures.push(`${product.slug}: negative price`);
      }
      if (product.oldPrice !== null && product.oldPrice !== undefined) {
        if (product.oldPrice <= product.price) {
          failures.push(`${product.slug}: oldPrice must exceed price`);
        }
        const expected = Math.round((1 - product.price / product.oldPrice) * 100);
        if (product.discount !== expected) {
          failures.push(`${product.slug}: discount ${product.discount} !== ${expected}`);
        }
      } else if (product.discount !== 0) {
        failures.push(`${product.slug}: discount should be 0 when no oldPrice`);
      }
    }
    expect(failures).toEqual([]);
  });

  it("stockStatus is one of in_stock/sold_out", () => {
    for (const product of products as unknown as Product[]) {
      expect(["in_stock", "sold_out"]).toContain(product.stockStatus);
    }
  });

  it("every relatedProducts entry references an existing slug", () => {
    const slugs = new Set((products as unknown as Product[]).map((p) => p.slug));
    const failures: string[] = [];
    for (const product of products as unknown as Product[]) {
      for (const related of product.relatedProducts) {
        if (!slugs.has(related)) {
          failures.push(`${product.slug} -> ${related}`);
        }
      }
    }
    expect(failures).toEqual([]);
  });

  it("variant products have unique names and product price equals minimum variant price", () => {
    const withVariants = (products as unknown as Product[]).filter(
      (p) => Array.isArray(p.variants) && p.variants.length > 0
    );
    expect(withVariants.length).toBeGreaterThan(0);
    for (const product of withVariants) {
      const names = product.variants!.map((v) => v.name);
      expect(new Set(names).size).toBe(names.length);
      const minPrice = Math.min(...product.variants!.map((v) => v.price));
      expect(minPrice).toBeGreaterThanOrEqual(0);
      expect(product.price).toBe(minPrice);
    }
  });

  it("fixtures/products.json validate against productSchema", () => {
    const failures: string[] = [];
    for (const [index, fixture] of fixtures.entries()) {
      if (!validateProduct(fixture)) {
        failures.push(`fixtures[${index}]: ${JSON.stringify(validateProduct.errors)}`);
      }
    }
    expect(failures).toEqual([]);
  });
});