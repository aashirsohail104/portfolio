import type { Product } from "@/lib/api/types";
import { cartReducer, cartTotals, type CartItem } from "@/lib/logic/cart";
import { useLocalStorage } from "./useLocalStorage";

export interface LineKey {
  productId: string;
  variantName?: string | null;
}

export function useCart(products: Product[]) {
  const [items, setItems] = useLocalStorage<CartItem[]>("anas-elec.cart.v1", []);

  const add = (p: LineKey) =>
    setItems((current) => cartReducer(current, { type: "add", payload: p }));
  const increment = (k: LineKey) =>
    setItems((current) => cartReducer(current, { type: "increment", payload: k }));
  const decrement = (k: LineKey) =>
    setItems((current) => cartReducer(current, { type: "decrement", payload: k }));
  const remove = (k: LineKey) =>
    setItems((current) => cartReducer(current, { type: "remove", payload: k }));
  const setQuantity = (k: LineKey & { quantity: number }) =>
    setItems((current) => cartReducer(current, { type: "setQuantity", payload: k }));
  const clear = () => setItems([]);

  const totals = cartTotals(items, products);

  return {
    items,
    add,
    increment,
    decrement,
    remove,
    setQuantity,
    clear,
    itemCount: totals.itemCount,
    subtotal: totals.subtotal,
  };
}