import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import fixtures from "@test/fixtures/products.json";
import type { Product } from "@/lib/api/types";
import { COMPARE_MAX } from "@/lib/logic/compare";
import { useCompare } from "@/hooks/useCompare";

const products = fixtures as unknown as Product[];

describe("useCompare", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("add, remove and has behave like the compare set", () => {
    const { result } = renderHook(() => useCompare());
    act(() => result.current.add(products[0].id));
    expect(result.current.has(products[0].id)).toBe(true);
    act(() => result.current.remove(products[0].id));
    expect(result.current.has(products[0].id)).toBe(false);
  });

  it("caps the compare set at COMPARE_MAX, replacing the oldest", () => {
    const { result } = renderHook(() => useCompare());
    for (let i = 0; i < COMPARE_MAX + 1; i++) {
      act(() => result.current.add(`p${i}`));
    }
    expect(result.current.items).toEqual(["p1", "p2", "p3", "p4"]);
    expect(result.current.productCount).toBe(COMPARE_MAX);
  });

  it("persists items under anas-elec.compare.v1", () => {
    const { result } = renderHook(() => useCompare());
    act(() => result.current.add(products[0].id));
    const stored = JSON.parse(
      window.localStorage.getItem("anas-elec.compare.v1") as string
    );
    expect(stored).toEqual([products[0].id]);
  });
});