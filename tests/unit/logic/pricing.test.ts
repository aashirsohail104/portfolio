import { describe, expect, it } from "vitest";
import {
  computeDiscount,
  formatPrice,
  hasDiscount,
  isOldPriceValid,
  minVariantPrice,
} from "@/lib/logic/pricing";
import type { Product } from "@/lib/api/types";
import fixtures from "@test/fixtures/products.json";

const products = fixtures as unknown as Product[];

describe("formatPrice", () => {
  it("prepends Rs. and formats with en-PK style commas", () => {
    expect(formatPrice(9999)).toBe("Rs.9,999");
    expect(formatPrice(1690)).toBe("Rs.1,690");
  });

  it("formats larger numbers with thousands separators", () => {
    expect(formatPrice(14999)).toBe("Rs.14,999");
    expect(formatPrice(25000)).toBe("Rs.25,000");
  });
});

describe("computeDiscount", () => {
  it("computes the rounded discount percentage", () => {
    expect(computeDiscount(9999, 15000)).toBe(33);
    expect(computeDiscount(100, 200)).toBe(50);
  });

  it("returns 0 when oldPrice is null", () => {
    expect(computeDiscount(1690, null)).toBe(0);
  });

  it("returns 0 when oldPrice is not greater than price", () => {
    expect(computeDiscount(25000, 25000)).toBe(0);
    expect(computeDiscount(5000, 4000)).toBe(0);
  });
});

describe("isOldPriceValid", () => {
  it("is true only when oldPrice exists and exceeds price", () => {
    expect(isOldPriceValid(9999, 15000)).toBe(true);
    expect(isOldPriceValid(9999, null)).toBe(false);
    expect(isOldPriceValid(25000, 25000)).toBe(false);
    expect(isOldPriceValid(3000, 2500)).toBe(false);
  });
});

describe("hasDiscount", () => {
  it("flags products with a valid old price", () => {
    expect(hasDiscount({ price: 9999, oldPrice: 15000 })).toBe(true);
    expect(hasDiscount({ price: 9999, oldPrice: null })).toBe(false);
    expect(hasDiscount({ price: 1690, oldPrice: 1690 })).toBe(false);
  });
});

describe("minVariantPrice", () => {
  it("returns the minimum variant price when variants exist", () => {
    const variantProduct = products.find(
      (p) => Array.isArray(p.variants) && p.variants.length > 0
    );
    expect(variantProduct).toBeDefined();
    expect(minVariantPrice(variantProduct!)).toBe(
      Math.min(...variantProduct!.variants!.map((v) => v.price))
    );
  });

  it("falls back to the product price without variants", () => {
    const plain = products.find((p) => !p.variants);
    expect(plain).toBeDefined();
    expect(minVariantPrice(plain!)).toBe(plain!.price);
  });

  it("falls back to the product price for an empty variants array", () => {
    expect(minVariantPrice({ price: 4500, variants: [] })).toBe(4500);
  });
});