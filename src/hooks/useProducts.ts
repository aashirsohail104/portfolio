import { useEffect, useState } from "react";
import type { Category, Product } from "@/lib/api/types";
import { getCatalog } from "@/lib/api/client";

export function useProducts(): {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
} {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getCatalog()
      .then((catalog) => {
        if (!active) return;
        setProducts(catalog.products);
        setCategories(catalog.categories);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { products, categories, loading, error };
}