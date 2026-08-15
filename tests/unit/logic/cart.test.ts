import { describe, expect, it } from "vitest";
import type { Product } from "@/lib/api/types";
import fixtures from "@test/fixtures/products.json";
import {
  CART_MAX_QUANTITY,
  cartItemKey,
  cartReducer,
  cartTotals,
  resolveCartLines,
  type CartItem,
} from "@/lib/logic/cart";

const products = fixtures as unknown as Product[];

const smps = products.find(
  (p) => p.id === "professional-12v-smps-10a-20a-30a"
)!;
const saa = products.find((p) => p.id === "suoer-saa-1000c-inverter-charger")!;

function line(
  productId: string,
  variantName: string | null,
  quantity: number
): CartItem {
  return { productId, variantName, quantity, addedAt: Date.now() };
}

describe("cartItemKey", () => {
  it("keys distinguish variant lines and normalize null/empty", () => {
    expect(cartItemKey({ productId: "p1", variantName: null })).toBe("p1::");
    expect(
      cartItemKey({ productId: "p1", variantName: "12V 20A" })
    ).toBe("p1::12V 20A");
  });
});

describe("cartReducer add", () => {
  it("appends a new line with quantity 1 and a timestamp", () => {
    const state = cartReducer([], {
      type: "add",
      payload: { productId: "p1", variantName: null },
    });
    expect(state).toHaveLength(1);
    expect(state[0]).toMatchObject({
      productId: "p1",
      variantName: null,
      quantity: 1,
    });
    expect(typeof state[0].addedAt).toBe("number");
  });

  it("increments an existing identical line and caps at 99", () => {
    const start = line("p1", null, 3);
    const bumped = cartReducer([start], {
      type: "add",
      payload: { productId: "p1", variantName: null },
    });
    expect(bumped).toHaveLength(1);
    expect(bumped[0].quantity).toBe(4);

    let state: CartItem[] = [line("p1", null, CART_MAX_QUANTITY)];
    state = cartReducer(state, {
      type: "add",
      payload: { productId: "p1", variantName: null },
    });
    expect(state[0].quantity).toBe(CART_MAX_QUANTITY);
  });

  it("treats null and omitted variantName as the same line", () => {
    let state = cartReducer([], {
      type: "add",
      payload: { productId: "p1", variantName: null },
    });
    state = cartReducer(state, {
      type: "add",
      payload: { productId: "p1" },
    });
    expect(state).toHaveLength(1);
    expect(state[0].quantity).toBe(2);
  });

  it("keeps different variants as separate lines", () => {
    let state = cartReducer([], {
      type: "add",
      payload: { productId: "p1", variantName: "12V 10A" },
    });
    state = cartReducer(state, {
      type: "add",
      payload: { productId: "p1", variantName: "12V 20A" },
    });
    expect(state).toHaveLength(2);
  });
});

describe("cartReducer increment/decrement/remove/setQuantity/clear", () => {
  it("increment raises quantity and is a no-op for unknown lines", () => {
    const state = cartReducer([line("p1", null, 1)], {
      type: "increment",
      payload: { productId: "p1", variantName: null },
    });
    expect(state[0].quantity).toBe(2);
    expect(
      cartReducer([], {
        type: "increment",
        payload: { productId: "ghost", variantName: null },
      })
    ).toEqual([]);
  });

  it("decrement never goes below 1 and removes at quantity 1", () => {
    const reduced = cartReducer([line("p1", null, 2)], {
      type: "decrement",
      payload: { productId: "p1", variantName: null },
    });
    expect(reduced[0].quantity).toBe(1);

    const removed = cartReducer([line("p1", null, 1)], {
      type: "decrement",
      payload: { productId: "p1", variantName: null },
    });
    expect(removed).toEqual([]);
  });

  it("remove deletes only the matching line", () => {
    const state = [
      line("p1", null, 2),
      line("p2", null, 1),
      line("p1", "12V 20A", 1),
    ];
    const result = cartReducer(state, {
      type: "remove",
      payload: { productId: "p1", variantName: null },
    });
    expect(result.map((i) => i.productId)).toEqual(["p2", "p1"]);
    expect(result[1].variantName).toBe("12V 20A");
  });

  it("setQuantity clamps into 1..CART_MAX_QUANTITY", () => {
    const start = [line("p1", null, 5)];
    expect(
      cartReducer(start, {
        type: "setQuantity",
        payload: { productId: "p1", variantName: null, quantity: 0 },
      })[0].quantity
    ).toBe(1);
    expect(
      cartReducer(start, {
        type: "setQuantity",
        payload: { productId: "p1", variantName: null, quantity: 500 },
      })[0].quantity
    ).toBe(CART_MAX_QUANTITY);
    expect(
      cartReducer(start, {
        type: "setQuantity",
        payload: { productId: "p1", variantName: null, quantity: 3 },
      })[0].quantity
    ).toBe(3);
  });

  it("clear empties the cart", () => {
    expect(cartReducer([line("p1", null, 2), line("p2", null, 1)], { type: "clear" })).toEqual([]);
  });
});

describe("cartTotals", () => {
  it("prices base lines from the product price and sums quantities", () => {
    const items = [line(saa.id, null, 2)];
    expect(cartTotals(items, products)).toEqual({
      itemCount: 2,
      subtotal: saa.price * 2,
    });
  });

  it("prices a variant line from the matching variant price", () => {
    const items = [line(smps.id, "12V 20A", 3)];
    expect(cartTotals(items, products)).toEqual({
      itemCount: 3,
      subtotal: 2290 * 3,
    });
  });

  it("falls back to the product price for an unknown variant name", () => {
    const items = [line(smps.id, "12V 40A", 1)];
    expect(cartTotals(items, products).subtotal).toBe(smps.price);
  });

  it("sums mixed variant and base lines", () => {
    const items = [
      line(smps.id, "12V 30A", 1),
      line(saa.id, null, 1),
    ];
    expect(cartTotals(items, products).itemCount).toBe(2);
    expect(cartTotals(items, products).subtotal).toBe(2990 + 9999);
  });

  it("drops lines whose productId is not found", () => {
    const items = [line("ghost-product", null, 5)];
    expect(cartTotals(items, products)).toEqual({ itemCount: 0, subtotal: 0 });
  });
});

describe("resolveCartLines", () => {
  it("drops unresolved lines and resolves variants by name", () => {
    const items = [
      line(smps.id, "12V 20A", 1),
      line("ghost-product", null, 1),
    ];
    const lines = resolveCartLines(items, products);
    expect(lines).toHaveLength(1);
    expect(lines[0].product.id).toBe(smps.id);
    expect(lines[0].variant).toMatchObject({ name: "12V 20A", price: 2290 });
    expect(lines[0].variant?.price).toBe(2290);
  });

  it("omits the variant for base lines", () => {
    const lines = resolveCartLines([line(saa.id, null, 1)], products);
    expect(lines).toHaveLength(1);
    expect(lines[0].variant).toBeUndefined();
  });
});