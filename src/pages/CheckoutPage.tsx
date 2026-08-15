import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

import { useCommerce } from "@/context/CommerceContext";
import { resolveCartLines } from "@/lib/logic/cart";
import { formatPrice } from "@/lib/logic/pricing";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { usePageMeta } from "@/lib/seo/usePageMeta";
import { onImgError } from "@/lib/image";
import { ORDER_ERROR_MESSAGE, placeOrder } from "@/lib/orders";

interface CheckoutValues {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerWhatsapp: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  notes: string;
}

type CheckoutField = keyof CheckoutValues;

type CheckoutErrors = Partial<Record<CheckoutField, string>>;

const INITIAL_VALUES: CheckoutValues = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  customerWhatsapp: "",
  shippingAddress: "",
  city: "",
  postalCode: "",
  notes: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass = (hasError: boolean) =>
  `mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground ${
    hasError ? "border-destructive" : "border-input"
  }`;

function validate(values: CheckoutValues): CheckoutErrors {
  const errors: CheckoutErrors = {};
  if (!values.customerName.trim()) {
    errors.customerName = "Please enter your full name.";
  }
  const email = values.customerEmail.trim();
  if (!email) {
    errors.customerEmail = "Please enter your email address.";
  } else if (!EMAIL_RE.test(email)) {
    errors.customerEmail = "Please enter a valid email address.";
  }
  if (!values.customerPhone.trim()) {
    errors.customerPhone = "Please enter your phone number.";
  }
  if (!values.shippingAddress.trim()) {
    errors.shippingAddress = "Please enter your delivery address.";
  }
  if (!values.city.trim()) {
    errors.city = "Please enter your city.";
  }
  return errors;
}

export default function CheckoutPage() {
  const { products, cart } = useCommerce();

  usePageMeta({
    title: "Checkout | Anas Electronics",
    description: "Complete your order with cash on delivery across Pakistan.",
    canonicalPath: "/checkout",
    noIndex: true,
  });

  const [values, setValues] = useState<CheckoutValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<{ orderId: string } | null>(null);
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const lines = resolveCartLines(cart.items, products);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (name in errors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as CheckoutField];
        return next;
      });
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const currentLines = resolveCartLines(cart.items, products).map((line) => ({
      productId: line.product.id,
      variantName: line.item.variantName,
      quantity: line.item.quantity,
    }));
    if (currentLines.length === 0) return;

    setSubmitting(true);
    setSubmitError(null);

    const result = await placeOrder({
      customerName: values.customerName.trim(),
      customerEmail: values.customerEmail.trim(),
      customerPhone: values.customerPhone.trim(),
      customerWhatsapp: values.customerWhatsapp.trim() || undefined,
      shippingAddress: values.shippingAddress.trim(),
      city: values.city.trim(),
      postalCode: values.postalCode.trim() || undefined,
      notes: values.notes.trim() || undefined,
      paymentMethod: "cod",
      lines: currentLines,
      idempotencyKey,
    });

    if (result.ok) {
      setPlacedOrder({ orderId: result.orderId });
      cart.clear();
    } else {
      setSubmitError(
        result.message === ORDER_ERROR_MESSAGE ? result.message : ORDER_ERROR_MESSAGE
      );
      setSubmitting(false);
    }
  }

  if (placedOrder) {
    return (
      <div className="container-page py-8">
        <div
          role="status"
          aria-live="polite"
          className="mx-auto max-w-lg rounded-lg border border-border bg-card p-8 text-center shadow-card"
        >
          <span
            aria-hidden="true"
            className="mx-auto grid size-16 place-items-center rounded-full bg-success/10 text-success"
          >
            <CheckCircle2 className="size-8" />
          </span>
          <h2 className="mt-4 text-xl font-semibold text-foreground">
            Order placed successfully!
          </h2>
          <p className="mt-2 text-sm text-foreground">
            Your order number is: <span className="font-semibold">AE-{placedOrder.orderId}</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            We have received your order and will contact you shortly to confirm delivery.
          </p>
          <Button as_child size="lg" className="mt-6 w-full">
            <Link to="/catalog">Continue shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

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
      <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-6 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_380px]"
      >
        <Card>
          <CardHeader>
            <CardTitle>Customer details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {submitError && (
              <div
                role="alert"
                className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {submitError}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="checkout-name" className="text-sm font-medium text-foreground">
                  Full name <span aria-hidden="true" className="text-destructive">*</span>
                </label>
                <input
                  id="checkout-name"
                  name="customerName"
                  type="text"
                  autoComplete="name"
                  value={values.customerName}
                  onChange={handleChange}
                  aria-required="true"
                  aria-invalid={!!errors.customerName}
                  aria-describedby={errors.customerName ? "checkout-name-error" : undefined}
                  className={inputClass(!!errors.customerName)}
                  placeholder="e.g. Ahmed Khan"
                />
                {errors.customerName && (
                  <p
                    id="checkout-name-error"
                    role="alert"
                    className="mt-1.5 text-xs font-medium text-destructive"
                  >
                    {errors.customerName}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="checkout-phone" className="text-sm font-medium text-foreground">
                  Phone <span aria-hidden="true" className="text-destructive">*</span>
                </label>
                <input
                  id="checkout-phone"
                  name="customerPhone"
                  type="tel"
                  autoComplete="tel"
                  value={values.customerPhone}
                  onChange={handleChange}
                  aria-required="true"
                  aria-invalid={!!errors.customerPhone}
                  aria-describedby={errors.customerPhone ? "checkout-phone-error" : undefined}
                  className={inputClass(!!errors.customerPhone)}
                  placeholder="03XX XXXXXXX"
                />
                {errors.customerPhone && (
                  <p
                    id="checkout-phone-error"
                    role="alert"
                    className="mt-1.5 text-xs font-medium text-destructive"
                  >
                    {errors.customerPhone}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="checkout-email" className="text-sm font-medium text-foreground">
                  Email <span aria-hidden="true" className="text-destructive">*</span>
                </label>
                <input
                  id="checkout-email"
                  name="customerEmail"
                  type="email"
                  autoComplete="email"
                  value={values.customerEmail}
                  onChange={handleChange}
                  aria-required="true"
                  aria-invalid={!!errors.customerEmail}
                  aria-describedby={errors.customerEmail ? "checkout-email-error" : undefined}
                  className={inputClass(!!errors.customerEmail)}
                  placeholder="you@example.com"
                />
                {errors.customerEmail && (
                  <p
                    id="checkout-email-error"
                    role="alert"
                    className="mt-1.5 text-xs font-medium text-destructive"
                  >
                    {errors.customerEmail}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="checkout-whatsapp" className="text-sm font-medium text-foreground">
                  WhatsApp{" "}
                  <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <input
                  id="checkout-whatsapp"
                  name="customerWhatsapp"
                  type="tel"
                  autoComplete="tel"
                  value={values.customerWhatsapp}
                  onChange={handleChange}
                  className={inputClass(false)}
                  placeholder="03XX XXXXXXX"
                />
              </div>
            </div>

            <div>
              <label htmlFor="checkout-address" className="text-sm font-medium text-foreground">
                Delivery address <span aria-hidden="true" className="text-destructive">*</span>
              </label>
              <textarea
                id="checkout-address"
                name="shippingAddress"
                rows={2}
                value={values.shippingAddress}
                onChange={handleChange}
                aria-required="true"
                aria-invalid={!!errors.shippingAddress}
                aria-describedby={errors.shippingAddress ? "checkout-address-error" : undefined}
                className={`${inputClass(!!errors.shippingAddress)} resize-y`}
                placeholder="House number, street, area"
              />
              {errors.shippingAddress && (
                <p
                  id="checkout-address-error"
                  role="alert"
                  className="mt-1.5 text-xs font-medium text-destructive"
                >
                  {errors.shippingAddress}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="checkout-city" className="text-sm font-medium text-foreground">
                  City <span aria-hidden="true" className="text-destructive">*</span>
                </label>
                <input
                  id="checkout-city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  value={values.city}
                  onChange={handleChange}
                  aria-required="true"
                  aria-invalid={!!errors.city}
                  aria-describedby={errors.city ? "checkout-city-error" : undefined}
                  className={inputClass(!!errors.city)}
                  placeholder="e.g. Lahore"
                />
                {errors.city && (
                  <p
                    id="checkout-city-error"
                    role="alert"
                    className="mt-1.5 text-xs font-medium text-destructive"
                  >
                    {errors.city}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="checkout-postal" className="text-sm font-medium text-foreground">
                  Postal code{" "}
                  <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <input
                  id="checkout-postal"
                  name="postalCode"
                  type="text"
                  autoComplete="postal-code"
                  value={values.postalCode}
                  onChange={handleChange}
                  className={inputClass(false)}
                  placeholder="e.g. 54000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="checkout-notes" className="text-sm font-medium text-foreground">
                Notes <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <textarea
                id="checkout-notes"
                name="notes"
                rows={4}
                value={values.notes}
                onChange={handleChange}
                className={`${inputClass(false)} resize-y`}
                placeholder="Any delivery instructions?"
              />
            </div>
          </CardContent>
        </Card>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="divide-y divide-border">
                {lines.map(({ item, product, variant }) => {
                  const unitPrice = variant ? variant.price : product.price;
                  return (
                    <li
                      key={`${item.productId}::${item.variantName ?? ""}`}
                      className="flex gap-3 py-3 first:pt-0"
                    >
                      <img
                        src={product.image}
                        alt=""
                        onError={onImgError}
                        className="h-14 w-14 shrink-0 rounded-md bg-muted object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-medium text-foreground">
                          {product.productName}
                        </p>
                        {variant && (
                          <p className="mt-0.5 text-xs text-muted-foreground">{variant.name}</p>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatPrice(unitPrice)} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {formatPrice(unitPrice * item.quantity)}
                      </p>
                    </li>
                  );
                })}
              </ul>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-foreground">{formatPrice(cart.subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping calculated at checkout. Free delivery on orders over Rs 5,000.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-3">
              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? <Spinner label="Placing order…" /> : "Place order"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Cash on delivery (COD). Payment is collected when your order arrives.
              </p>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}