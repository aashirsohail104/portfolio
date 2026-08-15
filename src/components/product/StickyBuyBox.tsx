import { useEffect, useState } from "react";

import { Card } from "@/components/ui/Card";
import { PriceTag } from "@/components/commerce/PriceTag";
import { DiscountBadge } from "@/components/commerce/DiscountBadge";
import { StockBadge } from "@/components/commerce/StockBadge";
import { RatingStars } from "@/components/commerce/RatingStars";
import { QtyStepper } from "@/components/commerce/QtyStepper";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { WishlistButton } from "@/components/commerce/WishlistButton";
import { CompareToggle } from "@/components/commerce/CompareToggle";
import type { Product, Variant } from "@/lib/api/types";

export function StickyBuyBox({ product }: { product: Product }) {
  const [variant, setVariant] = useState<Variant | null>(product.variants?.[0] ?? null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setVariant(product.variants?.[0] ?? null);
    setQty(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const variants = product.variants ?? [];
  const isVariant = variants.length > 0;

  const displayPrice = isVariant ? (variant?.price ?? product.price) : product.price;
  const displayOld = isVariant ? (variant?.oldPrice ?? null) : (product.oldPrice ?? null);
  const stockStatus = isVariant
    ? (variant?.stockStatus ?? "sold_out")
    : product.stockStatus;

  return (
    <Card as="div" className="sticky top-20 p-5 lg:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <DiscountBadge oldPrice={product.oldPrice ?? null} price={product.price} />
        <StockBadge stockStatus={stockStatus} />
      </div>

      <div className="mt-3 flex items-end gap-3">
        <PriceTag price={displayPrice} oldPrice={displayOld} size="lg" />
        <RatingStars rating={product.rating ?? 0} reviews={product.reviews ?? 0} />
      </div>

      <div className="my-4 h-px bg-border" />

      {isVariant && (
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-foreground">
            Options <span className="text-muted-foreground">— {variant?.name}</span>
          </p>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Product options">
            {variants.map((v) => {
              const selected = variant?.name === v.name;
              return (
                <button
                  key={v.name}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setVariant(v)}
                  className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                    selected
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-input text-foreground hover:border-foreground/40"
                  }`}
                >
                  {v.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        {stockStatus !== "sold_out" && <QtyStepper value={qty} onChange={setQty} />}
        <div className="flex gap-2">
          <WishlistButton productId={product.id} />
          <CompareToggle productId={product.id} label="Compare" />
        </div>
      </div>

      <div className="mt-4">
        <AddToCartButton
          product={product}
          quantity={qty}
          fullWidth
          variantName={isVariant ? (variant?.name ?? null) : null}
        />
      </div>

      <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <Mark color="text-success" />
          In stock, ready to ship
        </li>
        <li className="flex items-center gap-2">
          <Mark color="text-brand" />
          Free delivery on orders over Rs 5,000
        </li>
        <li className="flex items-center gap-2">
          <Mark color="text-brand" />
          {product.warranty ?? "Official brand warranty"}
        </li>
      </ul>
    </Card>
  );
}

function Mark({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={color} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </svg>
  );
}