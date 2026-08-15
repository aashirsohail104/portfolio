import { ProductCard } from "@/components/product/ProductCard";
import { GridSkeleton } from "@/components/ui/Skeleton";
import type { Product } from "@/lib/api/types";

export function RelatedProducts({
  related,
  loading,
  onQuickView,
}: {
  related: Product[];
  loading?: boolean;
  onQuickView?: (product: Product) => void;
}) {
  if (loading) {
    return <GridSkeleton count={4} />;
  }
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="mb-5 text-xl font-bold text-foreground">
        You may also like
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
        ))}
      </div>
    </section>
  );
}