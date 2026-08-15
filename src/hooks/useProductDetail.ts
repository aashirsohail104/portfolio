import { useEffect, useState } from "react";
import type { Product } from "@/lib/api/types";
import { getProductBySlug, getRelatedProducts } from "@/lib/api/client";

export function useProductDetail(slug: string): {
  product: Product | null;
  related: Product[];
  loading: boolean;
  error: string | null;
} {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setProduct(null);
    setRelated([]);

    getProductBySlug(slug)
      .then((p) => {
        if (!active) return;
        setProduct(p);
        if (!p) return;
        return getRelatedProducts(p).then((r) => {
          if (active) setRelated(r);
        });
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
  }, [slug]);

  return { product, related, loading, error };
}