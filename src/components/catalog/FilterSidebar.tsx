import { useMemo } from "react";
import type { Category, Product } from "@/lib/api/types";

export interface FilterState {
  categories: Set<string>;
  subCategories: Set<string>;
  priceMin: number | null;
  priceMax: number | null;
  inStockOnly: boolean;
}

export function useDefaultFilters(): FilterState {
  return useMemo(
    () => ({
      categories: new Set<string>(),
      subCategories: new Set<string>(),
      priceMin: null,
      priceMax: null,
      inStockOnly: false,
    }),
    []
  );
}

export function matchesFilters(product: Product, f: FilterState): boolean {
  if (f.categories.size > 0 && !f.categories.has(product.category)) return false;
  if (f.subCategories.size > 0 && product.subCategory && !f.subCategories.has(product.subCategory)) return false;
  if (f.inStockOnly && product.stockStatus !== "in_stock") return false;
  return true;
}

export function applyPriceRange(products: Product[], min: number | null, max: number | null): Product[] {
  return products.filter((p) => {
    if (min != null && p.price < min) return false;
    if (max != null && p.price > max) return false;
    return true;
  });
}

export function activeFilterCount(f: FilterState): number {
  let n = f.categories.size + f.subCategories.size;
  if (f.priceMin != null) n++;
  if (f.priceMax != null) n++;
  if (f.inStockOnly) n++;
  return n;
}

export function resetFilters(): FilterState {
  return {
    categories: new Set<string>(),
    subCategories: new Set<string>(),
    priceMin: null,
    priceMax: null,
    inStockOnly: false,
  };
}

export function FilterSidebar({
  categories,
  filter,
  onChange,
  resultCount,
  productCounts,
}: {
  categories: Category[];
  filter: FilterState;
  onChange: (f: FilterState) => void;
  resultCount: number;
  productCounts?: Record<string, number>;
}) {
  const set = (patch: Partial<FilterState>) => onChange({ ...filter, ...patch });

  return (
    <aside aria-label="Filters" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Filters</h2>
        {activeFilterCount(filter) > 0 && (
          <button
            type="button"
            onClick={() => onChange(resetFilters())}
            className="text-sm font-medium text-brand hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-foreground">Category</legend>
        <div className="space-y-1">
          {categories.map((c) => {
            const active = filter.categories.has(c.name);
            const count = productCounts?.[c.name];
            return (
              <label
                key={c.name}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                  active ? "bg-muted font-medium text-brand" : "text-foreground/90"
                }`}
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => {
                    const next = new Set(filter.categories);
                    if (e.target.checked) next.add(c.name);
                    else next.delete(c.name);
                    set({ categories: next });
                  }}
                  className="size-4 rounded border-input accent-brand"
                />
                <span className="flex-1">{c.name}</span>
                {count != null && (
                  <span className={`text-xs ${active ? "text-brand" : "text-muted-foreground"}`}>
                    {count}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-foreground">Price range</legend>
        <div className="flex items-center gap-2">
          <PriceInput
            label="Min"
            value={filter.priceMin}
            onChange={(v) => set({ priceMin: v })}
          />
          <span className="text-muted-foreground">—</span>
          <PriceInput
            label="Max"
            value={filter.priceMax}
            onChange={(v) => set({ priceMax: v })}
          />
        </div>
      </fieldset>

      <label className="flex items-center gap-2 text-sm text-foreground/90">
        <input
          type="checkbox"
          checked={filter.inStockOnly}
          onChange={(e) => set({ inStockOnly: e.target.checked })}
          className="size-4 rounded border-input accent-brand"
        />
        In stock only
      </label>

      <p className="border-t border-border pt-3 text-sm text-muted-foreground">
        {resultCount} product{resultCount === 1 ? "" : "s"}
      </p>
    </aside>
  );
}

function PriceInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <label className="flex flex-1 flex-col gap-1 text-xs text-muted-foreground">
      <span>{label} (Rs)</span>
      <input
        type="number"
        min={0}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        placeholder="Any"
        className="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
      />
    </label>
  );
}