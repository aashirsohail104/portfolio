import { Card } from "@/components/ui/Card";
import type { Product } from "@/lib/api/types";

export function ProductFeatures({ product }: { product: Product }) {
  const features = product.features ?? [];
  if (features.length === 0) return null;

  return (
    <Card as="section" aria-labelledby="features-heading">
      <div className="p-5">
        <h2 id="features-heading" className="mb-4 text-lg font-semibold text-foreground">
          Key features
        </h2>
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm text-foreground/90">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="mt-0.5 shrink-0 text-brand"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

export function ProductFullDescription({ product }: { product: Product }) {
  if (!product.fullDescription) return null;
  return (
    <Card as="section" aria-labelledby="description-heading">
      <div className="p-5">
        <h2 id="description-heading" className="mb-3 text-lg font-semibold text-foreground">
          About this product
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{product.fullDescription}</p>
      </div>
    </Card>
  );
}