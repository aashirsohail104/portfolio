import { Link } from "react-router-dom";

import { useCommerce } from "@/context/CommerceContext";
import { COMPARE_MAX } from "@/lib/logic/compare";
import { computeDiscount, minVariantPrice } from "@/lib/logic/pricing";
import { PriceTag } from "@/components/commerce/PriceTag";
import { EmptyState } from "@/components/ui/EmptyState";
import { usePageMeta } from "@/lib/seo/usePageMeta";
import { onImgError } from "@/lib/image";
import type { Product } from "@/lib/api/types";

export default function ComparePage() {
  const { products, compare } = useCommerce();

  usePageMeta({
    title: "Compare Products | Anas Electronics",
    description: "Side-by-side comparison of battery chargers and power supplies.",
    canonicalPath: "/compare",
    noIndex: true,
  });

  const comparison = compare.items
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  if (comparison.length === 0) {
    return (
      <div className="container-page py-8">
        <EmptyState
          title="Nothing to compare yet"
          message={`Add up to ${COMPARE_MAX} products to compare specifications side by side.`}
          actionHref="/catalog"
          actionLabel="Browse catalog"
        />
      </div>
    );
  }

  const labelCell = "p-3 text-left text-muted-foreground font-medium bg-muted w-32";
  const productCell = "border border-border p-3 align-top";

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold text-foreground">
        Compare products ({comparison.length}/{COMPARE_MAX})
      </h1>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th scope="col" className={labelCell}>
                <span className="sr-only">Specification</span>
              </th>
              {comparison.map((p) => (
                <th key={p.id} scope="col" className={`${productCell} text-left font-medium`}>
                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/product/${p.slug}`}
                      className="flex flex-col items-start gap-2 no-underline"
                    >
                      <img
                        src={p.image}
                        alt=""
                        onError={onImgError}
                        className="h-16 w-16 rounded object-cover"
                      />
                      <span className="font-medium leading-snug text-foreground hover:text-brand">
                        {p.productName}
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => compare.remove(p.id)}
                      className="self-start text-sm font-medium text-destructive hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className={labelCell}>
                Price
              </th>
              {comparison.map((p) => (
                <td key={p.id} className={productCell}>
                  <PriceTag price={p.price} variants={p.variants} />
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className={labelCell}>
                Discount
              </th>
              {comparison.map((p) => {
                const pct = computeDiscount(minVariantPrice(p), p.oldPrice ?? null);
                return (
                  <td key={p.id} className={productCell}>
                    {pct > 0 ? (
                      <span className="font-semibold text-success">{pct}% off</span>
                    ) : (
                      <span className="text-muted-foreground">&mdash;</span>
                    )}
                  </td>
                );
              })}
            </tr>
            <tr>
              <th scope="row" className={labelCell}>
                Availability
              </th>
              {comparison.map((p) => (
                <td key={p.id} className={productCell}>
                  {p.stockStatus === "in_stock" ? (
                    <span className="font-medium text-success">In stock</span>
                  ) : (
                    <span className="font-medium text-warning">Out of stock</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className={labelCell}>
                Category
              </th>
              {comparison.map((p) => (
                <td key={p.id} className={productCell}>
                  {p.category}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className={labelCell}>
                Brand
              </th>
              {comparison.map((p) => (
                <td key={p.id} className={productCell}>
                  {p.brand || "\u2014"}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className={labelCell}>
                Voltage
              </th>
              {comparison.map((p) => (
                <td key={p.id} className={productCell}>
                  {p.voltage || "\u2014"}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className={labelCell}>
                Charging current
              </th>
              {comparison.map((p) => (
                <td key={p.id} className={productCell}>
                  {p.chargingCurrent || "\u2014"}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className={labelCell}>
                Battery compatibility
              </th>
              {comparison.map((p) => (
                <td key={p.id} className={productCell}>
                  {p.batteryCompatibility || "\u2014"}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className={labelCell}>
                Warranty
              </th>
              {comparison.map((p) => (
                <td key={p.id} className={productCell}>
                  {p.warranty || "\u2014"}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className={labelCell}>
                Rating
              </th>
              {comparison.map((p) => (
                <td key={p.id} className={productCell}>
                  {p.rating != null ? (
                    <span>
                      <span className="font-semibold text-foreground">{p.rating}</span>
                      <span className="text-muted-foreground">
                        {" "}
                        ({p.reviews ?? 0} {p.reviews === 1 ? "review" : "reviews"})
                      </span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">&mdash;</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}