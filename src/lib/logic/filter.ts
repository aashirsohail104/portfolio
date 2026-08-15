import type { Product } from "@/lib/api/types";
import { minVariantPrice } from "./pricing";

export function filterByType(
  products: Product[],
  category: string | null
): Product[] {
  if (!category) return products;
  return products.filter((p) => p.category === category);
}

export function filterByPrice(
  products: Product[],
  min: number | null,
  max: number | null
): Product[] {
  if (min == null && max == null) return products;
  return products.filter((p) => {
    const price = minVariantPrice(p);
    if (min != null && price < min) return false;
    if (max != null && price > max) return false;
    return true;
  });
}