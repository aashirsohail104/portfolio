export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "packed"
  | "dispatched"
  | "delivered"
  | "cancelled"
  | "failed";

export type PaymentMethod = "cod";

export interface OrderLineInput {
  productId: string;
  variantName?: string | null;
  quantity: number;
}

export interface OrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerWhatsapp?: string | null;
  shippingAddress: string;
  city: string;
  postalCode?: string | null;
  notes?: string | null;
  paymentMethod: PaymentMethod;
  lines: OrderLineInput[];
  website?: string;
}

export interface PriceSource {
  id: string;
  slug: string;
  brand?: string | null;
  productName: string;
  price: number;
  oldPrice?: number | null;
  stockStatus: string;
  image: string;
  variants?: Array<{
    name: string;
    price: number;
    oldPrice?: number | null;
    stockStatus: string;
  }>;
}

export interface BilledLine {
  productId: string;
  productName: string;
  brand: string | null;
  model: string | null;
  variantName: string | null;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
  productImage: string;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
}

export interface ValidatedOrder {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerWhatsapp: string | null;
  shippingAddress: string;
  city: string;
  postalCode: string | null;
  notes: string | null;
  paymentMethod: PaymentMethod;
  createdAt: string;
  lines: BilledLine[];
  totals: OrderTotals;
}

export type OrderValidation =
  | { ok: true; order: ValidatedOrder }
  | { ok: false; errors: string[] };

export interface SiteIdentity {
  name: string;
  address: string;
  phone: string;
  whatsapp?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type VariantSource = NonNullable<NonNullable<PriceSource["variants"]>[number]>;

// --- helpers ---

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// --- order number ---

export function buildOrderNumber(date: Date, sequence: number): string {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const seq = String(sequence).padStart(4, "0");
  return `AE-${year}${month}${day}-${seq}`;
}

// --- validation ---

export function validateOrder(
  payload: unknown,
  catalogProducts: PriceSource[],
  opts?: { now?: Date }
): OrderValidation {
  const errors: string[] = [];
  const products = Array.isArray(catalogProducts) ? catalogProducts : [];
  const data = toRecord(payload);

  if (data === null) {
    errors.push("Order payload must be an object");
    return { ok: false, errors };
  }

  if (typeof data.website === "string" && data.website.trim() !== "") {
    errors.push("Spam submission detected");
    return { ok: false, errors };
  }

  const customerName = str(data.customerName);
  if (customerName === "") {
    errors.push("customerName is required");
  }

  const customerEmail = str(data.customerEmail);
  if (customerEmail === "") {
    errors.push("customerEmail is required");
  } else if (!EMAIL_RE.test(customerEmail)) {
    errors.push("Invalid email address");
  }

  const customerPhone = str(data.customerPhone);
  if (customerPhone === "") {
    errors.push("customerPhone is required");
  }

  const shippingAddress = str(data.shippingAddress);
  if (shippingAddress === "") {
    errors.push("shippingAddress is required");
  }

  const city = str(data.city);
  if (city === "") {
    errors.push("city is required");
  }

  let paymentMethod: PaymentMethod = "cod";
  if (data.paymentMethod !== undefined && data.paymentMethod !== null) {
    if (data.paymentMethod === "cod") {
      paymentMethod = "cod";
    } else {
      errors.push("Invalid payment method");
    }
  }

  interface ResolvedLine {
    input: OrderLineInput;
    product: PriceSource;
    variant: VariantSource | null;
  }

  const resolved: ResolvedLine[] = [];

  if (!Array.isArray(data.lines)) {
    errors.push("lines must be a non-empty array");
  } else if (data.lines.length === 0) {
    errors.push("lines must be a non-empty array");
  } else {
    for (const entry of data.lines) {
      const lineMap = toRecord(entry);
      const before = errors.length;

      if (lineMap === null) {
        errors.push("Invalid line item");
        continue;
      }

      const productId = str(lineMap.productId);
      const product = products.find((p) => p.id === productId) ?? null;
      if (product === null) {
        errors.push(`Product "${productId}" not found`);
      }

      const rawQty = lineMap.quantity;
      const quantity = typeof rawQty === "number" ? rawQty : NaN;
      if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99) {
        errors.push("Quantity must be a whole number between 1 and 99");
      }

      let variant: VariantSource | null = null;
      const variantName = str(lineMap.variantName);
      if (product !== null && variantName !== "") {
        variant = product.variants?.find((v) => v.name === variantName) ?? null;
        if (variant === null) {
          errors.push(`Unknown variant "${variantName}" for product "${productId}"`);
        }
      }

      if (
        product !== null &&
        (product.stockStatus !== "in_stock" ||
          (variant !== null && variant.stockStatus !== "in_stock"))
      ) {
        errors.push(`"${product.productName}" is currently out of stock`);
      }

      if (errors.length === before && product !== null) {
        resolved.push({
          input: {
            productId,
            variantName: variantName === "" ? null : variantName,
            quantity,
          },
          product,
          variant,
        });
      }
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  let subtotalSum = 0;
  let discountSum = 0;

  const lines: BilledLine[] = resolved.map((entry) => {
    const unitPrice = round2(entry.variant !== null ? entry.variant.price : entry.product.price);
    const oldPrice = entry.variant !== null ? entry.variant.oldPrice : entry.product.oldPrice;
    const perUnitDiscount =
      oldPrice != null && oldPrice > unitPrice ? round2(oldPrice - unitPrice) : 0;
    const lineSubtotal = round2(unitPrice * entry.input.quantity);
    subtotalSum += lineSubtotal;
    discountSum += round2(perUnitDiscount * entry.input.quantity);
    return {
      productId: entry.product.id,
      productName: entry.product.productName,
      brand: entry.product.brand ?? null,
      model: entry.input.variantName ?? null,
      variantName: entry.input.variantName ?? null,
      quantity: entry.input.quantity,
      unitPrice,
      discount: perUnitDiscount,
      subtotal: lineSubtotal,
      productImage: entry.product.image,
    };
  });

  const subtotal = round2(subtotalSum);
  const discount = round2(discountSum);
  const totals: OrderTotals = {
    subtotal,
    discount,
    shippingFee: 0,
    tax: 0,
    total: round2(subtotal - discount),
  };

  const order: ValidatedOrder = {
    orderNumber: "",
    customerName,
    customerEmail,
    customerPhone,
    customerWhatsapp: str(data.customerWhatsapp) || null,
    shippingAddress,
    city,
    postalCode: str(data.postalCode) || null,
    notes: str(data.notes) || null,
    paymentMethod,
    createdAt: (opts?.now ?? new Date()).toISOString(),
    lines,
    totals,
  };

  return { ok: true, order };
}

// --- email ---

export function buildOrderEmailHtml(order: ValidatedOrder, site: SiteIdentity): string {
  const money = (amount: number): string => "Rs." + amount.toLocaleString("en-PK");

  const orderDateLabel = new Date(order.createdAt).toLocaleString("en-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const customerRows: Array<[string, string]> = [
    ["Name", order.customerName],
    ["Phone", order.customerPhone],
  ];
  if (order.customerWhatsapp) {
    customerRows.push(["WhatsApp", order.customerWhatsapp]);
  }
  customerRows.push(["Email", order.customerEmail]);
  customerRows.push(["Address", order.shippingAddress]);
  customerRows.push(["City", order.city]);
  if (order.postalCode) {
    customerRows.push(["Postal code", order.postalCode]);
  }

  const customerHtml = customerRows
    .map(
      ([label, value]) =>
        `<tr><td class="cust-label">${esc(label)}</td><td class="cust-value">${esc(
          value
        )}</td></tr>`
    )
    .join("");

  const itemsHtml = order.lines
    .map((line) => {
      const originalPrice = line.discount > 0 ? line.unitPrice + line.discount : null;
      const discountHtml =
        originalPrice !== null
          ? `<div class="old-price"><s>${money(originalPrice)}</s> <span class="off">-${money(
              line.discount
            )} off</span></div>`
          : "";
      return `<tr>
        <td class="item-name"><div class="prod-name">${esc(line.productName)}</div>${
        line.brand ? `<div class="prod-brand">${esc(line.brand)}</div>` : ""
      }</td>
        <td class="center">${line.model ? esc(line.model) : "&mdash;"}</td>
        <td class="center">${line.quantity}</td>
        <td class="right">${money(line.unitPrice)}${discountHtml}</td>
        <td class="right">${money(line.subtotal)}</td>
      </tr>`;
    })
    .join("");

  const summaryRows = `
      <tr><td class="summary-label">Subtotal</td><td class="right">${money(
        order.totals.subtotal
      )}</td></tr>
      <tr><td class="summary-label">Discount</td><td class="right">-${money(
        order.totals.discount
      )}</td></tr>
      <tr><td class="summary-label">Shipping</td><td class="right">${money(
        order.totals.shippingFee
      )}</td></tr>
      <tr><td class="summary-label">Tax</td><td class="right">${money(order.totals.tax)}</td></tr>
      <tr class="total-row"><td class="summary-label">TOTAL</td><td class="right">${money(
        order.totals.total
      )}</td></tr>`;

  const notesHtml = order.notes
    ? esc(order.notes).replace(/\n/g, "<br/>")
    : "&mdash;";

  const whatsappHtml = site.whatsapp
    ? ` | <a href="https://wa.me/${esc(site.whatsapp)}" style="color:#e5e7eb;">WhatsApp</a>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>New Order ${esc(order.orderNumber)} — ANAS ELECTRONICS</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; padding: 24px; background: #eceff1; color: #1a1a2e; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.5; }
  .container { max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e0e6ec; }
  .header { background: #0b1f3a; color: #ffffff; padding: 24px 28px; text-align: center; }
  .header h1 { margin: 0 0 4px; font-size: 24px; letter-spacing: 3px; }
  .subhead { margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 2px; color: #ffd54a; }
  .section { padding: 20px 28px; }
  .section-title { margin: 0 0 12px; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #0b1f3a; border-bottom: 2px solid #0b1f3a; padding-bottom: 8px; }
  table { width: 100%; border-collapse: collapse; }
  .meta-table td { padding: 6px 0; }
  .meta-label, .cust-label { font-weight: 700; color: #0b1f3a; }
  .meta-label { width: 110px; }
  .meta-value { color: #1a1a2e; }
  .cust-table { margin-top: 4px; }
  .cust-label { width: 120px; padding: 4px 0; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; }
  .cust-value { padding: 4px 0; }
  .items-table th { background: #f4f6f9; color: #0b1f3a; text-align: left; padding: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
  .items-table td { padding: 10px 8px; border-bottom: 1px solid #eef1f5; vertical-align: top; }
  .prod-name { font-weight: 700; }
  .prod-brand { color: #5b6472; font-size: 12px; }
  .old-price { margin-top: 2px; font-size: 12px; color: #7c8796; }
  .old-price s { color: #b23b3b; }
  .off { color: #1b7a3d; font-weight: 700; }
  .center { text-align: center; }
  .right { text-align: right; }
  .summary-table td { padding: 5px 0; }
  .summary-label { font-weight: 700; color: #0b1f3a; }
  .total-row td { border-top: 2px solid #0b1f3a; padding-top: 10px; font-size: 16px; }
  .action { margin: 18px 0 0; padding: 12px 16px; background: #fff8e1; border-left: 4px solid #ffd54a; font-weight: 700; color: #6b4e0a; }
  .footer { background: #0b1f3a; color: #e5e7eb; padding: 16px 28px; text-align: center; font-size: 12px; }
  .footer a { color: #e5e7eb; }
  a { color: #0b1f3a; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ANAS ELECTRONICS</h1>
      <p class="subhead">NEW ORDER — ACTION REQUIRED</p>
    </div>

    <div class="section">
      <p class="section-title">Order</p>
      <table class="meta-table">
        <tr>
          <td class="meta-label">Order ID</td>
          <td class="meta-value">${esc(order.orderNumber)}</td>
          <td class="meta-label">Order Date</td>
          <td class="meta-value">${esc(orderDateLabel)}</td>
        </tr>
        <tr>
          <td class="meta-label">Status</td>
          <td class="meta-value">Pending</td>
          <td class="meta-label">Payment method</td>
          <td class="meta-value">Cash on Delivery</td>
        </tr>
      </table>
    </div>

    <div class="section">
      <p class="section-title">Customer Details</p>
      <table class="cust-table">
        ${customerHtml}
      </table>
    </div>

    <div class="section">
      <p class="section-title">Order Items</p>
      <table class="items-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Model</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
    </div>

    <div class="section">
      <p class="section-title">Order Summary</p>
      <table class="summary-table">
        ${summaryRows}
      </table>
    </div>

    <div class="section">
      <p class="section-title">Customer Notes</p>
      <p>${notesHtml}</p>
      <p class="action">Please review, confirm, pack and dispatch this order.</p>
    </div>

    <div class="footer">
      <div><strong>${esc(site.name)}</strong></div>
      <div>${esc(site.address)}</div>
      <div>${esc(site.phone)}${whatsappHtml}</div>
    </div>
  </div>
</body>
</html>`;
}