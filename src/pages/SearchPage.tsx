import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useCommerce } from "@/context/CommerceContext";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { QuickView } from "@/components/product/QuickView";
import { SearchBar } from "@/components/search/SearchBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { searchProducts } from "@/lib/logic/search";
import { usePageMeta } from "@/lib/seo/usePageMeta";
import type { Product } from "@/lib/api/types";

export default function SearchPage() {
  const { products, loading } = useCommerce();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [quickView, setQuickView] = useState<Product | null>(null);

  const results = useMemo(() => searchProducts(products, query), [products, query]);

  const pageMeta = useMemo(
    () => ({
      title: query ? `Search: ${query} | Anas Electronics` : "Search | Anas Electronics",
      description: "Search results from the Anas Electronics catalog.",
      canonicalPath: "/search",
      noIndex: true,
    }),
    [query]
  );

  usePageMeta(pageMeta);

  return (
    <div className="container-page py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground">Search results</h1>
        <p className="mt-2 text-muted-foreground">
          Find battery chargers, power supplies, charge controllers and inverters.
        </p>
      </header>

      <div className="mb-8">
        <SearchBar variant="large" initialQuery={query} />
      </div>

      {!query ? (
        <EmptyState
          title="Type something to search"
          message="Search for battery chargers, power supplies, charge controllers and accessories across the Anas Electronics catalog."
        />
      ) : (
        <>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            {results.length} result{results.length === 1 ? "" : "s"} for &quot;{query}&quot;
          </h2>
          <ProductGrid
            products={results}
            loading={loading}
            onQuickView={setQuickView}
            emptyTitle="No results found"
            emptyMessage={`No products matched "${query}". Try a different search term.`}
          />
        </>
      )}

      <QuickView product={quickView} open={!!quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}