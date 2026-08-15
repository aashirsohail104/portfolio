import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { useCommerce } from "@/context/CommerceContext";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { categoryHref } from "@/components/layout/categoryLinks";
import type { Category, Product } from "@/lib/api/types";

const INVERTER_CATEGORIES = ["Inverter", "Solar Inverters"];
const INVERTER_LINK: Category = { name: "Inverter", slug: "inverter" };

export function FeaturedInverters({
  onQuickView,
}: {
  onQuickView: (product: Product) => void;
}) {
  const { products, loading } = useCommerce();

  const inverters = products.filter((p) => INVERTER_CATEGORIES.includes(p.category));
  const display = inverters.length >= 2 ? inverters : products.slice(0, 8);

  return (
    <section aria-labelledby="home-featured-inverters">
      <div className="flex items-baseline justify-between gap-4">
        <h2
          id="home-featured-inverters"
          className="text-xl font-bold text-foreground sm:text-2xl"
        >
          Featured Inverters
        </h2>
        <Link
          to={categoryHref(INVERTER_LINK)}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand hover:text-brand/80"
        >
          View all inverters
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
      <div className="mt-5">
        <ProductGrid products={display} loading={loading} onQuickView={onQuickView} />
      </div>
    </section>
  );
}
