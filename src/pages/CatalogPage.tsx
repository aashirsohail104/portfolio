import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useCommerce } from "@/context/CommerceContext";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import {
  FilterSidebar,
  useDefaultFilters,
  matchesFilters,
  applyPriceRange,
  activeFilterCount,
  type FilterState,
} from "@/components/catalog/FilterSidebar";
import { SortSelect } from "@/components/catalog/SortSelect";
import { QuickView } from "@/components/product/QuickView";
import { sortProducts, type SortOption } from "@/lib/logic/sort";
import { usePageMeta } from "@/lib/seo/usePageMeta";
import type { Product } from "@/lib/api/types";

const catalogPageMeta = {
  title: "Battery Chargers & Power Supplies | Anas Electronics",
  description: "Browse battery chargers, power supplies, charge controllers and inverters.",
  canonicalPath: "/catalog",
};

export default function CatalogPage() {
  const { products, categories, loading } = useCommerce();
  const defaultFilter = useDefaultFilters();
  const [filter, setFilter] = useState(defaultFilter);
  const [sort, setSort] = useState<SortOption>("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  usePageMeta(catalogPageMeta);

  const categorySlug = searchParams.get("category");
  const subCategorySlug = searchParams.get("subCategory");

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === categorySlug) ?? null,
    [categories, categorySlug]
  );
  const activeSubCategory = useMemo(
    () => activeCategory?.subCategories?.find((s) => s.slug === subCategorySlug) ?? null,
    [activeCategory, subCategorySlug]
  );

  const urlKey = `${categorySlug ?? ""}/${subCategorySlug ?? ""}`;
  const lastHandledKey = useRef<string | null>(null);

  useEffect(() => {
    if (urlKey === lastHandledKey.current) return;
    if (categorySlug && categories.length === 0) return;

    const targetCategories = new Set<string>();
    const targetSubCategories = new Set<string>();
    if (activeCategory) {
      targetCategories.add(activeCategory.name);
      if (activeSubCategory) targetSubCategories.add(activeSubCategory.name);
    }

    lastHandledKey.current = urlKey;
    setFilter((prev) => {
      const same =
        prev.categories.size === targetCategories.size &&
        [...prev.categories].every((n) => targetCategories.has(n)) &&
        prev.subCategories.size === targetSubCategories.size &&
        [...prev.subCategories].every((n) => targetSubCategories.has(n));
      if (same) return prev;
      return { ...prev, categories: targetCategories, subCategories: targetSubCategories };
    });
  }, [urlKey, activeCategory, activeSubCategory, categorySlug, categories]);

  const handleFilterChange = useCallback(
    (next: FilterState) => {
      const categoryNames = [...next.categories];
      const subCategoryNames = [...next.subCategories];
      const params = new URLSearchParams(searchParams);
      const cleanSubCategories = new Set<string>();

      if (categoryNames.length === 1) {
        const cat = categories.find((c) => c.name === categoryNames[0]);
        if (cat) {
          params.set("category", cat.slug);
          for (const name of subCategoryNames) {
            if (cat.subCategories?.some((s) => s.name === name)) cleanSubCategories.add(name);
          }
          if (cleanSubCategories.size === 1) {
            const sub = cat.subCategories?.find((s) => s.name === [...cleanSubCategories][0]);
            if (sub) params.set("subCategory", sub.slug);
            else params.delete("subCategory");
          } else {
            params.delete("subCategory");
          }
        } else {
          params.delete("category");
          params.delete("subCategory");
        }
      } else {
        params.delete("category");
        params.delete("subCategory");
      }

      lastHandledKey.current = `${params.get("category") ?? ""}/${params.get("subCategory") ?? ""}`;
      setSearchParams(params, { replace: true });
      setFilter({ ...next, categories: new Set(categoryNames), subCategories: cleanSubCategories });
    },
    [categories, searchParams, setSearchParams]
  );

  const clearCategoryFilter = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.delete("subCategory");
    lastHandledKey.current = "/";
    setSearchParams(params, { replace: true });
    setFilter((prev) => ({ ...prev, categories: new Set<string>(), subCategories: new Set<string>() }));
  }, [searchParams, setSearchParams]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) counts[p.category] = (counts[p.category] ?? 0) + 1;
    return counts;
  }, [products]);

  const categoryFiltered = useMemo(
    () => products.filter((p) => matchesFilters(p, filter)),
    [products, filter]
  );
  const priceFiltered = useMemo(
    () => applyPriceRange(categoryFiltered, filter.priceMin, filter.priceMax),
    [categoryFiltered, filter.priceMin, filter.priceMax]
  );
  const sorted = useMemo(() => sortProducts(priceFiltered, sort), [priceFiltered, sort]);

  const filterSidebar = (
    <FilterSidebar
      categories={categories}
      filter={filter}
      onChange={handleFilterChange}
      resultCount={sorted.length}
      productCounts={categoryCounts}
    />
  );

  return (
    <div className="container-page py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground">Catalog</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Browse battery chargers, power supplies, charge controllers and inverters for every
          application.
        </p>
      </header>

      <div className="mb-6 lg:hidden">
        <button
          type="button"
          aria-expanded={filterOpen}
          aria-controls="mobile-filters"
          onClick={() => setFilterOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground"
        >
          <span className="flex items-center gap-2">
            Filters
            {activeFilterCount(filter) > 0 && (
              <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                {activeFilterCount(filter)}
              </span>
            )}
          </span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
            className={`transition-transform ${filterOpen ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {filterOpen && (
          <div id="mobile-filters" className="mt-4 rounded-lg border border-border bg-card p-4">
            {filterSidebar}
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <div className="hidden lg:block">
          <div className="lg:sticky lg:top-40 rounded-lg border border-border bg-card p-5 shadow-card">
            {filterSidebar}
          </div>
        </div>

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-card">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-medium text-foreground">
                {sorted.length} product{sorted.length === 1 ? "" : "s"}
              </p>
              {activeCategory && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
                  {activeCategory.name}
                  <button
                    type="button"
                    onClick={clearCategoryFilter}
                    aria-label={`Remove ${activeCategory.name} filter`}
                    className="grid size-4 place-items-center rounded-full transition-colors hover:bg-brand hover:text-brand-foreground focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      aria-hidden="true"
                    >
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
            </div>
            <SortSelect value={sort} onChange={setSort} />
          </div>
          <ProductGrid products={sorted} loading={loading} onQuickView={setQuickView} />
        </div>
      </div>

      <QuickView product={quickView} open={!!quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}
