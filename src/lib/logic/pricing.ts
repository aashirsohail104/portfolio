import type { Product } from "@/lib/api/types";

export function formatPrice(value: number): string {
  return "Rs." + value.toLocaleString("en-PK");
}

export function computeDiscount(price: number, oldPrice: number | null): number {
  if (oldPrice == null || oldPrice <= price) return 0;
  return Math.round((1 - price / oldPrice) * 100);
}

export function isOldPriceValid(price: number, oldPrice: number | null): boolean {
  return oldPrice != null && oldPrice > price;
}

export function hasDiscount(p: { price: number; oldPrice: number | null }): boolean {
  return isOldPriceValid(p.price, p.oldPrice);
}

export function minVariantPrice(p: Pick<Product, "price" | "variants">): number {
  if (p.variants && p.variants.length > 0) {
    return Math.min(...p.variants.map((v) => v.price));
  }
  return p.price;
}