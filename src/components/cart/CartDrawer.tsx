import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { useCommerce } from "@/context/CommerceContext";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { resolveCartLines } from "@/lib/logic/cart";
import { formatPrice } from "@/lib/logic/pricing";
import { QtyStepper } from "@/components/commerce/QtyStepper";
import { EmptyState } from "@/components/ui/EmptyState";
import { onImgError } from "@/lib/image";

export function CartDrawer() {
  const { products, cart, cartOpen, closeCart } = useCommerce();
  const lines = resolveCartLines(cart.items, products);
  const panelRef = useRef<HTMLElement>(null);
  useFocusTrap(panelRef, cartOpen);

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [cartOpen, closeCart]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <motion.button
            type="button"
            aria-label="Close cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50"
            onClick={closeCart}
          />
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-card shadow-drawer focus:outline-none z-50"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-lg font-semibold text-foreground">
                Your cart
                {cart.itemCount > 0 && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({cart.itemCount})
                  </span>
                )}
              </h2>
              <button
                type="button"
                aria-label="Close"
                onClick={closeCart}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 pb-16">
                <EmptyState
                  title="Your cart is empty"
                  message="Browse the catalog to find chargers, power supplies and more."
                />
                <Link
                  to="/catalog"
                  onClick={closeCart}
                  className="text-sm font-medium text-brand hover:underline"
                >
                  Browse catalog
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
                  {lines.map(({ item, product, variant }) => {
                    const linePrice = variant ? variant.price : product.price;
                    return (
                      <li
                        key={`${item.productId}::${item.variantName ?? ""}`}
                        className="flex gap-3 py-4"
                      >
                        <Link
                          to={`/product/${product.slug}`}
                          onClick={closeCart}
                          className="block h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted"
                        >
                          <img src={product.image} alt="" onError={onImgError} className="size-full object-cover" />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/product/${product.slug}`}
                            onClick={closeCart}
                            className="line-clamp-2 text-sm font-medium text-foreground hover:text-brand"
                          >
                            {product.productName}
                          </Link>
                          {variant && (
                            <p className="mt-0.5 text-xs text-muted-foreground">{variant.name}</p>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <QtyStepper
                              value={item.quantity}
                              onChange={(q) =>
                                cart.setQuantity({
                                  productId: item.productId,
                                  variantName: item.variantName,
                                  quantity: q,
                                })
                              }
                            />
                            <button
                              type="button"
                              aria-label={`Remove ${product.productName} from cart`}
                              onClick={() =>
                                cart.remove({
                                  productId: item.productId,
                                  variantName: item.variantName,
                                })
                              }
                              className="text-xs font-medium text-destructive hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          {formatPrice(linePrice * item.quantity)}
                        </p>
                      </li>
                    );
                  })}
                </ul>

                <footer className="border-t border-border px-5 py-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="text-lg font-bold text-foreground">
                      {formatPrice(cart.subtotal)}
                    </span>
                  </div>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Shipping calculated at checkout.
                  </p>
                  <Link
                    to="/checkout"
                    onClick={closeCart}
                    className="flex h-11 w-full items-center justify-center rounded-md bg-brand text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
                  >
                    Go to checkout
                  </Link>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="mt-2 w-full text-center text-sm text-muted-foreground hover:text-foreground"
                  >
                    Continue shopping
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}