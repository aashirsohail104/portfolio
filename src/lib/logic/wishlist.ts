import type { Product } from "@/lib/api/types";

export interface WishlistItem {
  productId: string;
  addedAt: number;
}

export function wishlistToggle(
  list: WishlistItem[],
  productId: string
): WishlistItem[] {
  return wishlistHas(list, productId)
    ? wishlistRemove(list, productId)
    : wishlistAdd(list, productId);
}

export function wishlistAdd(
  list: WishlistItem[],
  productId: string
): WishlistItem[] {
  if (wishlistHas(list, productId)) return list;
  return [...list, { productId, addedAt: Date.now() }];
}

export function wishlistRemove(
  list: WishlistItem[],
  productId: string
): WishlistItem[] {
  return list.filter((item) => item.productId !== productId);
}

export function wishlistHas(list: WishlistItem[], productId: string): boolean {
  return list.some((item) => item.productId === productId);
}

export function resolveWishlistProducts(
  list: WishlistItem[],
  products: Product[]
): Product[] {
  const byId = new Map(products.map((p) => [p.id, p]));
  const resolved: Product[] = [];
  for (const item of list) {
    const product = byId.get(item.productId);
    if (product) resolved.push(product);
  }
  return resolved;
}