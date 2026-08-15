import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import type { Product } from "@/lib/api/types";
import fixtures from "@test/fixtures/products.json";
import { useCart } from "@/hooks/useCart";

const products = fixtures as unknown as Product[];
const smps = products.find(
  (p) => p.id === "professional-12v-smps-10a-20a-30a"
)!;
const saa = products.find((p) => p.id === "suoer-saa-1000c-inverter-charger")!;

describe("useCart", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("add, increment, decrement, setQuantity, remove and clear", () => {
    const { result } = renderHook(() => useCart(products));

    act(() => result.current.add({ productId: smps.id, variantName: "12V 20A" }));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(1);

    act(() => result.current.add({ productId: smps.id, variantName: "12V 20A" }));
    expect(result.current.items[0].quantity).toBe(2);

    act(() => result.current.increment({ productId: smps.id, variantName: "12V 20A" }));
    expect(result.current.items[0].quantity).toBe(3);

    act(() => result.current.decrement({ productId: smps.id, variantName: "12V 20A" }));
    expect(result.current.items[0].quantity).toBe(2);

    act(() =>
      result.current.setQuantity({
        productId: smps.id,
        variantName: "12V 20A",
        quantity: 1,
      })
    );
    expect(result.current.items[0].quantity).toBe(1);

    act(() => result.current.decrement({ productId: smps.id, variantName: "12V 20A" }));
    expect(result.current.items).toHaveLength(0);

    act(() => result.current.add({ productId: smps.id, variantName: "12V 20A" }));
    act(() => result.current.clear());
    expect(result.current.items).toHaveLength(0);
  });

  it("treats null and omitted variantName as the same line", () => {
    const { result } = renderHook(() => useCart(products));
    act(() => result.current.add({ productId: saa.id, variantName: null }));
    act(() => result.current.add({ productId: saa.id }));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it("prices variant lines from the variant and base lines from the product", () => {
    const { result } = renderHook(() => useCart(products));
    act(() => result.current.add({ productId: smps.id, variantName: "12V 20A" }));
    act(() => result.current.add({ productId: smps.id, variantName: "12V 20A" }));
    act(() => result.current.add({ productId: saa.id }));

    expect(result.current.itemCount).toBe(3);
    expect(result.current.subtotal).toBe(2290 * 2 + saa.price);
  });

  it("persists items under anas-elec.cart.v1", () => {
    const { result } = renderHook(() => useCart(products));
    act(() => result.current.add({ productId: smps.id, variantName: "12V 10A" }));
    const stored = JSON.parse(
      window.localStorage.getItem("anas-elec.cart.v1") as string
    );
    expect(stored).toMatchObject([
      { productId: smps.id, variantName: "12V 10A", quantity: 1 },
    ]);
  });
});