import type { Category } from "@/lib/api/types";

export function categoryHref(category: Category, sub?: { slug: string }): string {
  if (sub) return `/catalog?category=${category.slug}&subCategory=${sub.slug}`;
  return `/catalog?category=${category.slug}`;
}
