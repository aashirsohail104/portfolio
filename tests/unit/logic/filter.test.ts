import { describe, expect, it } from "vitest";
import type { Product } from "@/lib/api/types";
import fixtures from "@test/fixtures/products.json";
import { filterByPrice, filterByType } from "@/lib/logic/filter";
import { minVariantPrice } from "@/lib/logic/pricing";

const products = fixtures as unknown as Product[];

describe("filterByType", () => {
  it("returns all products for a null category", () => {
    expect(filterByType(products, null)).toEqual(products);
  });

  it("returns all products for an empty-string category", () => {
    expect(filterByType(products, "")).toEqual(products);
  });

  it("returns only products matching the category", () => {
    const filtered = filterByType(products, "Inverter");
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((p) => p.category === "Inverter")).toBe(true);
    expect(filtered.length).toBeLessThan(products.length);
  });

  it("returns an empty array for an unknown category", () => {
    expect(filterByType(products, "No Such Category")).toEqual([]);
  });
});

describe("filterByPrice", () => {
  it("returns all products with open bounds", () => {
    expect(filterByPrice(products, null, null)).toEqual(products);
  });

  it("applies the min bound inclusively", () => {
    const filtered = filterByPrice(products, 2500, null);
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((p) => minVariantPrice(p) >= 2500)).toBe(true);
    expect(filtered).not.toContain(
      products.find((p) => p.category === "Power Supply")
    );
  });

  it("applies the max bound inclusively", () => {
    const filtered = filterByPrice(products, null, 5000);
    expect(filtered.every((p) => minVariantPrice(p) <= 5000)).toBe(true);
  });

  it("returns an empty array when no product falls within the bounds", () => {
    expect(filterByPrice(products, 100000, null)).toEqual([]);
  });

  it("includes products exactly on an inclusive boundary", () => {
    const smps = products.find(
      (p) => p.id === "professional-12v-smps-10a-20a-30a"
    );
    expect(smps).toBeDefined();
    const filtered = filterByPrice(products, 1690, 1690);
    expect(filtered).toContain(smps);
  });
});