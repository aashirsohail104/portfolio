import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCommerce } from "@/context/CommerceContext";
import type { Product } from "@/lib/api/types";

export function AddToCartButton({
  product,
  quantity = 1,
  fullWidth = false,
  variantName,
  onSelectVariant,
}: {
  product: Product;
  quantity?: number;
  fullWidth?: boolean;
  variantName?: string | null;
  onSelectVariant?: (product: Product) => void;
}) {
  const { cart, showToast } = useCommerce();
  const [feedback, setFeedback] = useState<"idle" | "pressed">("idle");

  const soldOut =
    product.stockStatus === "sold_out" ||
    (variantName != null
      ? product.variants?.find((v) => v.name === variantName)?.stockStatus === "sold_out"
      : false);
  const isVariant = Array.isArray(product.variants) && product.variants.length > 0;

  const handleClick = () => {
    if (soldOut) return;
    if (isVariant && variantName == null) {
      onSelectVariant?.(product);
      return;
    }
    for (let i = 0; i < quantity; i++) cart.add({ productId: product.id, variantName: variantName ?? null });
    setFeedback("pressed");
    showToast(`${product.productName} added to cart`);
    window.setTimeout(() => setFeedback("idle"), 1600);
  };

  if (soldOut) {
    return (
      <Button
        variant="outline"
        size={fullWidth ? "lg" : "md"}
        className={fullWidth ? "w-full" : ""}
        onClick={() => showToast("We\u2019ll notify you when this is back in stock.", "info")}
      >
        Notify me
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      size={fullWidth ? "lg" : "md"}
      className={fullWidth ? "w-full" : ""}
      onClick={handleClick}
      aria-label={`Add ${product.productName} to cart`}
    >
      {feedback === "pressed" ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Added
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 6h15l-1.7 8.5a2 2 0 0 1-2 1.5H8.2a2 2 0 0 1-2-1.5L4.3 3.5A1.2 1.2 0 0 0 3 2.5" />
          </svg>
          {isVariant && variantName == null ? "Choose options" : "Add to cart"}
        </>
      )}
    </Button>
  );
}