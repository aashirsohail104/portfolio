import { describe, expect, it } from "vitest";
import type { Product } from "@/lib/api/types";
import fixtures from "@test/fixtures/products.json";
import { searchProducts } from "@/lib/logic/search";

const products = fixtures as unknown as Product[];

describe("searchProducts", () => {
  it("returns an empty array for an empty query", () => {
    expect(searchProducts(products, "")).toEqual([]);
  });

  it("returns an empty array for a whitespace-only query", () => {
    expect(searchProducts(products, "   ")).toEqual([]);
  });

  it("matches the productName case-insensitively", () => {
    const results = searchProducts(products, "suoer");
    expect(results.length).toBeGreaterThan(0);
    for (const p of results) {
      expect(p.productName.toLowerCase()).toContain("suoer");
    }
  });

  it("matches against tags", () => {
    const ezee = products.find(
      (p) => p.id === "ezee20a-variable-pulse-repair-charger"
    );
    const results = searchProducts(products, "pulse repair");
    expect(results).toContain(ezee);
  });

  it("returns matches in catalog order", () => {
    const results = searchProducts(products, "a");
    expect(results.length).toBeGreaterThan(0);
    const positions = results.map((p) =>
      products.findIndex((candidate) => candidate.id === p.id)
    );
    for (let i = 1; i < positions.length; i++) {
      expect(positions[i - 1]).toBeLessThan(positions[i]);
    }
  });

  it("returns an empty array when nothing matches", () => {
    expect(searchProducts(products, "zebra unicorn")).toEqual([]);
  });
});