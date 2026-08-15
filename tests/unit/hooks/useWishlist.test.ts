import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import fixtures from "@test/fixtures/products.json";
import type { Product } from "@/lib/api/types";
import { useWishlist } from "@/hooks/useWishlist";

const products = fixtures as unknown as Product[];

describe("useWishlist", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("toggles membership and tracks productCount", () => {
    const { result } = renderHook(() => useWishlist());

    expect(result.current.has(products[0].id)).toBe(false);
    act(() => result.current.toggle(products[0].id));
    expect(result.current.has(products[0].id)).toBe(true);
    expect(result.current.productCount).toBe(1);

    act(() => result.current.toggle(products[0].id));
    expect(result.current.has(products[0].id)).toBe(false);
    expect(result.current.productCount).toBe(0);
  });

  it("add and remove are exposed", () => {
    const { result } = renderHook(() => useWishlist());
    act(() => result.current.add(products[1].id));
    expect(result.current.items[0].productId).toBe(products[1].id);
    act(() => result.current.remove(products[1].id));
    expect(result.current.items).toEqual([]);
  });

  it("persists items under anas-elec.wishlist.v1", () => {
    const { result } = renderHook(() => useWishlist());
    act(() => result.current.toggle(products[0].id));
    const stored = JSON.parse(
      window.localStorage.getItem("anas-elec.wishlist.v1") as string
    );
    expect(stored).toHaveLength(1);
    expect(stored[0].productId).toBe(products[0].id);
  });
});