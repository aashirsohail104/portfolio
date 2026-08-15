import type { Product, Variant } from "@/lib/api/types";

export interface CartItem {
  productId: string;
  variantName: string | null;
  quantity: number;
  addedAt: number;
}

export type CartAction =
  | { type: "add"; payload: { productId: string; variantName?: string | null } }
  | { type: "increment"; payload: { productId: string; variantName?: string | null } }
  | { type: "decrement"; payload: { productId: string; variantName?: string | null } }
  | { type: "remove"; payload: { productId: string; variantName?: string | null } }
  | {
      type: "setQuantity";
      payload: { productId: string; variantName?: string | null; quantity: number };
    }
  | { type: "clear" };

export const CART_MAX_QUANTITY = 99;

function normalizeVariant(variantName: string | null | undefined): string | null {
  if (variantName === undefined || variantName === null || variantName === "") {
    return null;
  }
  return variantName;
}

export function cartItemKey(item: {
  productId: string;
  variantName: string | null;
}): string {
  return `${item.productId}::${item.variantName ?? ""}`;
}

function findLine(
  state: CartItem[],
  productId: string,
  variantName: string | null | undefined
): number {
  const variant = normalizeVariant(variantName);
  return state.findIndex(
    (item) =>
      item.productId === productId &&
      normalizeVariant(item.variantName) === variant
  );
}

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "add": {
      const idx = findLine(
        state,
        action.payload.productId,
        action.payload.variantName
      );
      if (idx !== -1) {
        return state.map((item, i) =>
          i === idx
            ? {
                ...item,
                quantity: Math.min(CART_MAX_QUANTITY, item.quantity + 1),
              }
            : item
        );
      }
      return [
        ...state,
        {
          productId: action.payload.productId,
          variantName: normalizeVariant(action.payload.variantName),
          quantity: 1,
          addedAt: Date.now(),
        },
      ];
    }
    case "increment": {
      const idx = findLine(
        state,
        action.payload.productId,
        action.payload.variantName
      );
      if (idx === -1) return state;
      return state.map((item, i) =>
        i === idx
          ? {
              ...item,
              quantity: Math.min(CART_MAX_QUANTITY, item.quantity + 1),
            }
          : item
      );
    }
    case "decrement": {
      const idx = findLine(
        state,
        action.payload.productId,
        action.payload.variantName
      );
      if (idx === -1) return state;
      const item = state[idx];
      if (item.quantity <= 1) {
        return state.filter((_, i) => i !== idx);
      }
      return state.map((it, i) =>
        i === idx ? { ...it, quantity: it.quantity - 1 } : it
      );
    }
    case "remove": {
      return state.filter(
        (item) =>
          !(
            item.productId === action.payload.productId &&
            normalizeVariant(item.variantName) ===
              normalizeVariant(action.payload.variantName)
          )
      );
    }
    case "setQuantity": {
      const idx = findLine(
        state,
        action.payload.productId,
        action.payload.variantName
      );
      if (idx === -1) return state;
      const clamped = Math.max(
        1,
        Math.min(CART_MAX_QUANTITY, action.payload.quantity)
      );
      return state.map((item, i) =>
        i === idx ? { ...item, quantity: clamped } : item
      );
    }
    case "clear":
      return [];
    default:
      return state;
  }
}

function linePrice(variantName: string | null, product: Product): number {
  if (variantName) {
    const variant = product.variants?.find((v) => v.name === variantName);
    if (variant) return variant.price;
  }
  return product.price;
}

export function cartTotals(
  items: CartItem[],
  products: Product[]
): { itemCount: number; subtotal: number } {
  const byId = new Map(products.map((p) => [p.id, p]));
  let itemCount = 0;
  let subtotal = 0;
  for (const item of items) {
    const product = byId.get(item.productId);
    if (!product) continue;
    itemCount += item.quantity;
    subtotal += item.quantity * linePrice(item.variantName, product);
  }
  return { itemCount, subtotal };
}

export function resolveCartLines(
  items: CartItem[],
  products: Product[]
): Array<{ item: CartItem; product: Product; variant?: Variant }> {
  const byId = new Map(products.map((p) => [p.id, p]));
  const lines: Array<{ item: CartItem; product: Product; variant?: Variant }> = [];
  for (const item of items) {
    const product = byId.get(item.productId);
    if (!product) continue;
    const variant =
      item.variantName && product.variants
        ? product.variants.find((v) => v.name === item.variantName)
        : undefined;
    lines.push(variant ? { item, product, variant } : { item, product });
  }
  return lines;
}