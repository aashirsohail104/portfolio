import { describe, expect, it } from "vitest";
import type { Product } from "@/lib/api/types";
import fixtures from "@test/fixtures/products.json";
import { minVariantPrice } from "@/lib/logic/pricing";
import { sortProducts } from "@/lib/logic/sort";

const products = fixtures as unknown as Product[];

describe("sortProducts", () => {
  it("featured preserves the original catalog order", () => {
    expect(sortProducts(products, "featured")).toEqual(products);
  });

  it("best-selling preserves the original order as a stable fallback", () => {
    expect(sortProducts(products, "best-selling")).toEqual(products);
  });

  it("price-asc sorts by minimum variant price ascending", () => {
    const sorted = sortProducts(products, "price-asc");
    const prices = sorted.map(minVariantPrice);
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i - 1]).toBeLessThanOrEqual(prices[i]);
    }
  });

  it("price-desc sorts by minimum variant price descending", () => {
    const sorted = sortProducts(products, "price-desc");
    const prices = sorted.map(minVariantPrice);
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i - 1]).toBeGreaterThanOrEqual(prices[i]);
    }
  });

  it("name-asc sorts by productName a-z using localeCompare", () => {
    const sorted = sortProducts(products, "name-asc");
    const names = sorted.map((p) => p.productName);
    expect(names).toEqual(
      [...names].sort((a, b) => a.localeCompare(b))
    );
  });

  it("name-desc sorts by productName z-a using localeCompare", () => {
    const sorted = sortProducts(products, "name-desc");
    const names = sorted.map((p) => p.productName);
    expect(names).toEqual(
      [...names].sort((a, b) => b.localeCompare(a))
    );
  });

  it("does not mutate the input array", () => {
    const snapshot = [...products];
    sortProducts(products, "price-asc");
    sortProducts(products, "name-desc");
    expect(products).toEqual(snapshot);
  });

  it("returns a new array rather than the input reference", () => {
    expect(sortProducts(products, "price-asc")).not.toBe(products);
  });
});