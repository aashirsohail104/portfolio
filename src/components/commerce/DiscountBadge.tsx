import { Badge } from "@/components/ui/Badge";
import { computeDiscount } from "@/lib/logic/pricing";

export function DiscountBadge({
  oldPrice,
  price,
}: {
  oldPrice?: number | null;
  price: number;
}) {
  const pct = computeDiscount(price, oldPrice ?? null);
  if (pct <= 0) return null;
  return <Badge tone="destructive">{pct}% OFF</Badge>;
}