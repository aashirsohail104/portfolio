import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { PriceTag } from "@/components/commerce/PriceTag";
import { DiscountBadge } from "@/components/commerce/DiscountBadge";
import { StockBadge } from "@/components/commerce/StockBadge";
import { RatingStars } from "@/components/commerce/RatingStars";
import { WishlistButton } from "@/components/commerce/WishlistButton";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { onImgError } from "@/lib/image";
import type { Product } from "@/lib/api/types";

export function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView?: (product: Product) => void;
}) {
  const soldOut = product.stockStatus === "sold_out";
  const images = [product.image, ...(product.galleryImages ?? [])];
  const hasHover = !soldOut && images.length > 1;
  const reduceMotion = useReducedMotion();
  const hoverScale = reduceMotion ? "" : "hover:scale-[1.015]";

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="group flex flex-col"
    >
      <Card
        as="div"
        className={`relative flex h-full flex-col overflow-hidden p-0 transition-[box-shadow,transform] duration-300 hover:shadow-premium ${hoverScale}`}
      >
        <Link
          to={`/product/${product.slug}`}
          className="relative aspect-square overflow-hidden bg-muted"
          aria-label={product.productName}
        >
          <img
            src={product.image}
            alt=""
            loading="lazy"
            decoding="async"
            onError={onImgError}
            className={`size-full object-cover transition-transform duration-700 ${
              hasHover ? "group-hover:scale-105 group-hover:opacity-0" : ""
            }`}
          />
          {hasHover && (
            <img
              src={images[1]}
              alt=""
              loading="lazy"
              decoding="async"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
              className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            <DiscountBadge oldPrice={product.oldPrice ?? null} price={product.price} />
          </div>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-3 grid size-9 translate-x-1 place-items-center rounded-full border border-border bg-background/80 text-foreground opacity-0 shadow-card backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
          >
            <ArrowUpRight className="size-4" />
          </span>
        </Link>

        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="absolute inset-x-4 top-[68%] translate-y-2 rounded-md bg-foreground/90 py-2 text-sm font-medium text-background opacity-0 backdrop-blur-sm transition-all duration-300 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
          >
            Quick view
          </button>
        )}

        <div className="flex flex-1 flex-col gap-2 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-brand">{product.category}</p>
          <Link
            to={`/product/${product.slug}`}
            className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-foreground hover:text-brand"
          >
            {product.productName}
          </Link>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
            <PriceTag
              price={product.price}
              oldPrice={product.oldPrice ?? null}
              variants={product.variants}
              size="sm"
            />
            <WishlistButton productId={product.id} size="sm" className="size-9 shrink-0 sm:size-auto sm:px-3" />
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <RatingStars rating={product.rating ?? 0} reviews={product.reviews ?? 0} />
            <StockBadge stockStatus={soldOut ? "sold_out" : "in_stock"} />
          </div>
        </div>
      </Card>
    </motion.li>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="aspect-square w-full rounded-md" />
      <Skeleton className="h-3 w-1/4 rounded-md" />
      <Skeleton className="h-4 w-4/5 rounded-md" />
      <Skeleton className="h-9 w-full rounded-md" />
    </div>
  );
}