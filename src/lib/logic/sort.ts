import type { Product } from "@/lib/api/types";
import { minVariantPrice } from "./pricing";

export type SortOption =
  | "featured"
  | "best-selling"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const copy = [...products];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => minVariantPrice(a) - minVariantPrice(b));
    case "price-desc":
      return copy.sort((a, b) => minVariantPrice(b) - minVariantPrice(a));
    case "name-asc":
      return copy.sort((a, b) => a.productName.localeCompare(b.productName));
    case "name-desc":
      return copy.sort((a, b) => b.productName.localeCompare(a.productName));
    case "featured":
    case "best-selling":
    default:
      return copy;
  }
}