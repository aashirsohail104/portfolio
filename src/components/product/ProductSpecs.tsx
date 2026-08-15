import { Card } from "@/components/ui/Card";
import type { Product } from "@/lib/api/types";

export function ProductSpecs({ product }: { product: Product }) {
  const specs = product.specifications ?? [];
  if (specs.length === 0) return null;

  return (
    <Card as="section" aria-labelledby="specs-heading">
      <div className="p-5">
        <h2 id="specs-heading" className="mb-4 text-lg font-semibold text-foreground">
          Specifications
        </h2>
        <dl className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:gap-x-6 sm:divide-y-0">
          {specs.map((spec) => (
            <div key={spec.label} className="flex justify-between gap-4 border-b border-border py-3 last:border-b-0 sm:border-b">
              <dt className="text-sm text-muted-foreground">{spec.label}</dt>
              <dd className="text-right text-sm font-medium text-foreground">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Card>
  );
}