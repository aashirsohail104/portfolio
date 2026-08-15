import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Modal } from "@/components/ui/Modal";
import { PriceTag } from "@/components/commerce/PriceTag";
import { StockBadge } from "@/components/commerce/StockBadge";
import { RatingStars } from "@/components/commerce/RatingStars";
import { WishlistButton } from "@/components/commerce/WishlistButton";
import { CompareToggle } from "@/components/commerce/CompareToggle";
import { QtyStepper } from "@/components/commerce/QtyStepper";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { onImgError } from "@/lib/image";
import type { Product, Variant } from "@/lib/api/types";

export function QuickView({
  product,
  open,
  onClose,
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants?.[0] ?? null);
      setQty(1);
    }
  }, [product, open]);

  const variants = product?.variants ?? [];
  const isVariant = variants.length > 0;
  const displayPrice = isVariant ? (selectedVariant?.price ?? product?.price ?? 0) : product?.price ?? 0;
  const displayOld = isVariant ? (selectedVariant?.oldPrice ?? null) : (product?.oldPrice ?? null);
  const stock = isVariant ? (selectedVariant?.stockStatus ?? "sold_out") : (product?.stockStatus ?? "sold_out");

  if (!product) return null;

  return (
    <Modal open={open} onClose={onClose} title={product.productName} labelledBy="quick-view-title">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="overflow-hidden rounded-md bg-muted">
          <img src={product.image} alt="" onError={onImgError} className="aspect-square size-full object-cover" />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-brand">{product.category}</p>
          <h3 id="quick-view-title" className="text-base font-semibold leading-snug text-foreground">
            {product.productName}
          </h3>
          <RatingStars rating={product.rating ?? 0} reviews={product.reviews ?? 0} />
          <PriceTag price={displayPrice} oldPrice={displayOld} size="lg" />
          <StockBadge stockStatus={stock} />

          {isVariant && (
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Options">
              {variants.map((v) => {
                const selected = selectedVariant?.name === v.name;
                return (
                  <button
                    key={v.name}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setSelectedVariant(v)}
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
          )}

          <div className="mt-auto space-y-3 pt-2">
            {stock === "in_stock" && <QtyStepper value={qty} onChange={setQty} />}
            <div className="flex gap-2">
              <AddToCartButton
                product={product}
                quantity={qty}
                fullWidth
                variantName={isVariant ? (selectedVariant?.name ?? null) : null}
              />
              <WishlistButton productId={product.id} size="lg" />
              <CompareToggle productId={product.id} />
            </div>
            <Link
              to={`/product/${product.slug}`}
              onClick={onClose}
              className="inline-flex h-10 w-full items-center justify-center rounded-md border border-input text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              View full details
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}