import { useState } from "react";

import { useCommerce } from "@/context/CommerceContext";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { QuickView } from "@/components/product/QuickView";
import { EmptyState } from "@/components/ui/EmptyState";
import { usePageMeta } from "@/lib/seo/usePageMeta";
import type { Product } from "@/lib/api/types";

export default function WishlistPage() {
  const { products, wishlist, loading } = useCommerce();
  const [qv, setQv] = useState<Product | null>(null);

  usePageMeta({
    title: "Your Wishlist | Anas Electronics",
    description: "Products you have saved.",
    canonicalPath: "/wishlist",
    noIndex: true,
  });

  const wishlisted = products.filter((p) =>
    wishlist.items.some((item) => item.productId === p.id)
  );

  if (wishlisted.length === 0) {
    return (
      <div className="container-page py-8">
        <EmptyState
          title="Your wishlist is empty"
          message="Save products you love and find them here."
          actionHref="/catalog"
          actionLabel="Browse catalog"
        />
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold text-foreground">Your wishlist ({wishlisted.length})</h1>
      <div className="mt-6">
        <ProductGrid products={wishlisted} loading={loading} onQuickView={setQv} />
      </div>
      <QuickView product={qv} open={!!qv} onClose={() => setQv(null)} />
    </div>
  );
}