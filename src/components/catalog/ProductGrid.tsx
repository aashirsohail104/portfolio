import { AnimatePresence } from "framer-motion";

import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Product } from "@/lib/api/types";

export function ProductGrid({
  products,
  loading,
  onQuickView,
  emptyTitle = "No products found",
  emptyMessage = "Try adjusting your filters or search.",
  emptyActionHref,
  emptyActionLabel,
}: {
  products: Product[];
  loading?: boolean;
  onQuickView?: (product: Product) => void;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyActionHref?: string;
  emptyActionLabel?: string;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
        actionHref={emptyActionHref}
        actionLabel={emptyActionLabel}
      />
    );
  }

  return (
    <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <AnimatePresence initial={false}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
        ))}
      </AnimatePresence>
    </ul>
  );
}