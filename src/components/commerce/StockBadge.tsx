import { Badge } from "@/components/ui/Badge";

export function StockBadge({ stockStatus }: { stockStatus: "in_stock" | "sold_out" }) {
  if (stockStatus === "sold_out") {
    return (
      <Badge tone="warning">
        <span className="size-1.5 rounded-full bg-warning" aria-hidden="true" />
        Out of stock
      </Badge>
    );
  }
  return (
    <Badge tone="success">
      <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
      In stock
    </Badge>
  );
}