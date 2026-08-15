import type { Category, Product } from "@/lib/api/types";

export function findCategories(categories: Category[], names: string[]): Category[] {
  return names
    .map((name) => categories.find((c) => c.name === name))
    .filter((c): c is Category => c !== undefined);
}

export function countProductsByCategory(products: Product[], category: string): number {
  return products.filter((p) => p.category === category).length;
}
