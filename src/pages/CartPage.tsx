import { Link, useNavigate } from "react-router-dom";

import { useCommerce } from "@/context/CommerceContext";
import { resolveCartLines } from "@/lib/logic/cart";
import { formatPrice } from "@/lib/logic/pricing";
import { PriceTag } from "@/components/commerce/PriceTag";
import { QtyStepper } from "@/components/commerce/QtyStepper";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { usePageMeta } from "@/lib/seo/usePageMeta";
import { onImgError } from "@/lib/image";

export default function CartPage() {
  const { products, cart, showToast } = useCommerce();
  const navigate = useNavigate();

  usePageMeta({
    title: "Your Cart | Anas Electronics",
    description: "Review your cart before checkout.",
    canonicalPath: "/cart",
    noIndex: true,
  });

  const lines = resolveCartLines(cart.items, products);

  if (lines.length === 0) {
    return (
      <div className="container-page py-8">
        <EmptyState
          title="Your cart is empty"
          message="Browse the catalog to find chargers, power supplies and more."
          actionHref="/catalog"
          actionLabel="Browse catalog"
        />
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold text-foreground">Your cart</h1>
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          {lines.map((line) => {
            const unitPrice = line.variant ? line.variant.price : line.product.price;
            const total = unitPrice * line.item.quantity;
            return (
              <Card key={`${line.item.productId}::${line.item.variantName ?? ""}`}>
                <CardContent className="flex items-center gap-4 p-4">
                  <Link
                    to={`/product/${line.product.slug}`}
                    className="shrink-0"
                    aria-label={line.product.productName}
                  >
                    <img
                      src={line.product.image}
                      alt=""
                      onError={onImgError}
                      className="h-20 w-20 rounded object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/product/${line.product.slug}`}
                      className="line-clamp-2 font-medium text-foreground hover:text-brand"
                    >
                      {line.product.productName}
                    </Link>
                    {line.variant && (
                      <p className="mt-0.5 text-sm text-muted-foreground">{line.variant.name}</p>
                    )}
                    <div className="mt-2">
                      <PriceTag price={unitPrice} size="sm" />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <QtyStepper
                      value={line.item.quantity}
                      onChange={(q) =>
                        cart.setQuantity({
                          productId: line.item.productId,
                          variantName: line.item.variantName,
                          quantity: q,
                        })
                      }
                    />
                    <p className="text-sm font-semibold text-foreground">{formatPrice(total)}</p>
                    <button
                      type="button"
                      onClick={() =>
                        cart.remove({
                          productId: line.item.productId,
                          variantName: line.item.variantName,
                        })
                      }
                      className="text-sm font-medium text-destructive hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-foreground">{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground">Calculated at checkout</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-3">
              <Button className="w-full" onClick={() => navigate("/checkout")}>
                Checkout
              </Button>
              <button
                type="button"
                onClick={() => {
                  cart.clear();
                  showToast("Cart cleared");
                }}
                className="text-center text-sm font-medium text-destructive hover:underline"
              >
                Clear cart
              </button>
              <p className="text-xs text-muted-foreground">
                Payment is processed securely at checkout. Prices are in Pakistani rupees (PKR).
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}