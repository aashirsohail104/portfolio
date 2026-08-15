import type { Product } from "@/lib/api/types";

export function searchProducts(products: Product[], query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.productName.toLowerCase().includes(q) ||
      (p.tags ?? []).some((tag) => tag.toLowerCase().includes(q))
  );
}