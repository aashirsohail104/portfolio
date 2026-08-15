import { describe, expect, it } from "vitest";
import type { Product } from "@/lib/api/types";
import fixtures from "@test/fixtures/products.json";
import {
  COMPARE_MAX,
  compareAdd,
  compareHas,
  compareRemove,
  resolveCompareProducts,
} from "@/lib/logic/compare";

const products = fixtures as unknown as Product[];

describe("compareAdd", () => {
  it("appends new product ids in order", () => {
    let list = compareAdd([], "p1");
    list = compareAdd(list, "p2");
    expect(list).toEqual(["p1", "p2"]);
  });

  it("dedupes duplicate ids", () => {
    let list = compareAdd([], "p1");
    list = compareAdd(list, "p1");
    expect(list).toEqual(["p1"]);
  });

  it("drops the oldest when adding beyond max and appends the new id", () => {
    let list: string[] = [];
    for (let i = 1; i <= COMPARE_MAX; i++) {
      list = compareAdd(list, `p${i}`);
    }
    expect(list).toEqual(["p1", "p2", "p3", "p4"]);

    const added = compareAdd(list, "p5");
    expect(added).toEqual(["p2", "p3", "p4", "p5"]);
    expect(added).toHaveLength(COMPARE_MAX);
  });

  it("respects a custom max", () => {
    const added = compareAdd(["a"], "b", 1);
    expect(added).toEqual(["b"]);
  });
});

describe("compareRemove / compareHas", () => {
  it("removes a product id", () => {
    expect(compareRemove(["p1", "p2"], "p1")).toEqual(["p2"]);
    expect(compareRemove(["p1", "p2"], "p3")).toEqual(["p1", "p2"]);
  });

  it("has reports membership", () => {
    expect(compareHas(["p1"], "p1")).toBe(true);
    expect(compareHas(["p1"], "p2")).toBe(false);
  });
});

describe("resolveCompareProducts", () => {
  it("resolves product ids in list order and drops orphans", () => {
    const ids = [products[3].id, "ghost-product", products[1].id];
    const resolved = resolveCompareProducts(ids, products);
    expect(resolved.map((p) => p.id)).toEqual([
      products[3].id,
      products[1].id,
    ]);
  });
});