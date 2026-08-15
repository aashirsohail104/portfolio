import { describe, expect, it } from "vitest";
import type { Product } from "@/lib/api/types";
import fixtures from "@test/fixtures/products.json";
import {
  resolveWishlistProducts,
  wishlistAdd,
  wishlistHas,
  wishlistRemove,
  wishlistToggle,
  type WishlistItem,
} from "@/lib/logic/wishlist";

const products = fixtures as unknown as Product[];

describe("wishlistAdd / wishlistHas", () => {
  it("adds an item with a timestamp", () => {
    const list = wishlistAdd([], "p1");
    expect(list).toHaveLength(1);
    expect(list[0].productId).toBe("p1");
    expect(typeof list[0].addedAt).toBe("number");
    expect(wishlistHas(list, "p1")).toBe(true);
  });

  it("add is a no-op when the product is already present and keeps identity", () => {
    const list: WishlistItem[] = [{ productId: "p1", addedAt: 1 }];
    expect(wishlistAdd(list, "p1")).toBe(list);
  });
});

describe("wishlistRemove", () => {
  it("removes the matching product only", () => {
    const list: WishlistItem[] = [
      { productId: "p1", addedAt: 1 },
      { productId: "p2", addedAt: 2 },
    ];
    const result = wishlistRemove(list, "p1");
    expect(result).toEqual([{ productId: "p2", addedAt: 2 }]);
    expect(wishlistHas(result, "p1")).toBe(false);
  });
});

describe("wishlistToggle", () => {
  it("adds when absent and removes when present", () => {
    const added = wishlistToggle([], "p1");
    expect(wishlistHas(added, "p1")).toBe(true);
    const removed = wishlistToggle(added, "p1");
    expect(wishlistHas(removed, "p1")).toBe(false);
    expect(removed).toEqual([]);
  });
});

describe("resolveWishlistProducts", () => {
  it("resolves products in list order and drops orphans", () => {
    const list: WishlistItem[] = [
      { productId: products[2].id, addedAt: 1 },
      { productId: "ghost-product", addedAt: 2 },
      { productId: products[0].id, addedAt: 3 },
    ];
    const resolved = resolveWishlistProducts(list, products);
    expect(resolved.map((p) => p.id)).toEqual([
      products[2].id,
      products[0].id,
    ]);
  });
});