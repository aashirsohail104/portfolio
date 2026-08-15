import { useState } from "react";
import { Link } from "react-router-dom";

import { useCommerce } from "@/context/CommerceContext";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { QuickView } from "@/components/product/QuickView";
import { FlashSaleBanner } from "@/components/home/FlashSaleBanner";
import { Hero } from "@/components/home/Hero";
import { SolarSolutionsSpotlight } from "@/components/home/SolarSolutionsSpotlight";
import { FeaturedInverters } from "@/components/home/FeaturedInverters";
import { BatteriesCharging } from "@/components/home/BatteriesCharging";
import { SolarAccessoriesProtection } from "@/components/home/SolarAccessoriesProtection";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { usePageMeta } from "@/lib/seo/usePageMeta";
import type { Product } from "@/lib/api/types";

export default function HomePage() {
  const { products, categories, loading } = useCommerce();
  const [qv, setQv] = useState<Product | null>(null);

  usePageMeta({
    title: "Anas Electronics — Battery Chargers & Power Supplies",
    description:
      "PKR-priced battery chargers, power supplies, solar inverters, lithium batteries and charge controllers from Anas Electronics.",
    canonicalPath: "/",
  });

  const featured = products.slice(0, 8);

  return (
    <div className="container-page flex flex-col gap-10 py-8">
      <Hero />

      <FlashSaleBanner category="Power Supplies" />

      <SolarSolutionsSpotlight />

      <FeaturedInverters onQuickView={setQv} />

      <section aria-labelledby="home-categories">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="home-categories" className="text-xl font-bold text-foreground sm:text-2xl">
            Shop by category
          </h2>
        </div>
        {categories.length === 0 && loading ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat.name).length;
              return (
                <Link
                  key={cat.slug}
                  to="/catalog"
                  className="group rounded-lg border border-border bg-card p-5 shadow-card transition-colors hover:border-brand/50"
                >
                  <h3 className="text-base font-semibold text-foreground group-hover:text-brand">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {count} {count === 1 ? "product" : "products"}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand">
                    Shop
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section aria-labelledby="home-best-sellers">
        <h2 id="home-best-sellers" className="text-xl font-bold text-foreground sm:text-2xl">
          Best Sellers
        </h2>
        <div className="mt-5">
          <ProductGrid products={featured} loading={loading} onQuickView={setQv} />
        </div>
      </section>

      <BatteriesCharging />

      <SolarAccessoriesProtection />

      <section aria-label="Why shop with Anas Electronics" className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <div
              className="mb-2 grid h-11 w-11 place-items-center rounded-full bg-muted text-brand"
              aria-hidden="true"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <CardTitle>Authentic products</CardTitle>
            <CardDescription>
              Every charger and power supply is sourced with genuine, verified specifications.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div
              className="mb-2 grid h-11 w-11 place-items-center rounded-full bg-muted text-brand"
              aria-hidden="true"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z" />
              </svg>
            </div>
            <CardTitle>Free delivery over Rs 5,000</CardTitle>
            <CardDescription>
              Orders above Rs 5,000 ship free to major cities across Pakistan.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div
              className="mb-2 grid h-11 w-11 place-items-center rounded-full bg-muted text-brand"
              aria-hidden="true"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6.3 20.5 5 8.5l7-4 7 4-1.3 12H6.3zM12 8v6M12 17v.01" />
              </svg>
            </div>
            <CardTitle>Official warranty</CardTitle>
            <CardDescription>
              Covered by official manufacturer warranty with local after-sales support.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <QuickView product={qv} open={!!qv} onClose={() => setQv(null)} />
    </div>
  );
}