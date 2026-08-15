import type { Product } from "@/lib/api/types";

export const COMPARE_MAX = 4;

export function compareAdd(
  list: string[],
  productId: string,
  max: number = COMPARE_MAX
): string[] {
  if (list.includes(productId)) return list;
  const next = [...list, productId];
  if (next.length > max) {
    return next.slice(next.length - max);
  }
  return next;
}

export function compareRemove(list: string[], productId: string): string[] {
  return list.filter((id) => id !== productId);
}

export function compareHas(list: string[], productId: string): boolean {
  return list.includes(productId);
}

export function resolveCompareProducts(
  list: string[],
  products: Product[]
): Product[] {
  const byId = new Map(products.map((p) => [p.id, p]));
  const resolved: Product[] = [];
  for (const id of list) {
    const product = byId.get(id);
    if (product) resolved.push(product);
  }
  return resolved;
}