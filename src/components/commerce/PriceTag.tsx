import type { Variant } from "@/lib/api/types";
import { computeDiscount, formatPrice } from "@/lib/logic/pricing";

function variantMinPrice(price: number, variants?: Variant[]): number {
  if (variants && variants.length > 0) {
    return Math.min(...variants.map((v) => v.price));
  }
  return price;
}

export function PriceTag({
  price,
  oldPrice,
  variants,
  size = "md",
  className = "",
}: {
  price: number;
  oldPrice?: number | null;
  variants?: Variant[];
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const hasVariants = Boolean(variants && variants.length > 0);
  const displayPrice = variantMinPrice(price, variants);
  const displayOld = oldPrice != null && oldPrice > displayPrice ? oldPrice : null;
  const showStrike = displayOld != null;

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  }[size];

  return (
    <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-0.5 ${className}`}>
      {hasVariants && <span className="text-xs text-muted-foreground">From</span>}
      <span className={`font-bold tracking-tight text-foreground ${sizeClasses}`}>
        {formatPrice(displayPrice)}
      </span>
      {showStrike && displayOld != null && (
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(displayOld)}
        </span>
      )}
    </div>
  );
}

export { computeDiscount };