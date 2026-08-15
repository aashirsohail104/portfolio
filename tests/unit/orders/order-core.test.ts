import { describe, expect, it } from "vitest";
import type {
  OrderPayload,
  OrderValidation,
  PriceSource,
  SiteIdentity,
  ValidatedOrder,
} from "../../../api/lib/order-core";
import {
  buildOrderEmailHtml,
  buildOrderNumber,
  validateOrder,
} from "../../../api/lib/order-core";

const catalog: PriceSource[] = [
  {
    id: "p1",
    slug: "p1",
    brand: "Suoer",
    productName: "1000W Inverter",
    price: 9999,
    oldPrice: 15000,
    stockStatus: "in_stock",
    image: "https://cdn.test/p1.jpg",
  },
  {
    id: "p2",
    slug: "p2",
    brand: "Suoer",
    productName: "12V Charger",
    price: 1200,
    stockStatus: "in_stock",
    image: "https://cdn.test/p2.jpg",
    variants: [
      { name: "20A", price: 1200, stockStatus: "in_stock" },
      { name: "30A", price: 1500, stockStatus: "in_stock" },
    ],
  },
  {
    id: "p3",
    slug: "p3",
    brand: "Suoer",
    productName: "Cable",
    price: 800,
    stockStatus: "sold_out",
    image: "https://cdn.test/p3.jpg",
  },
];

function validPayload(): OrderPayload {
  return {
    customerName: "Ali Khan",
    customerEmail: "ali@test.com",
    customerPhone: "03123456789",
    shippingAddress: "Main Road, Korangi",
    city: "Karachi",
    paymentMethod: "cod",
    lines: [{ productId: "p1", quantity: 1 }],
  };
}

const site: SiteIdentity = {
  name: "Anas Electronics",
  address: "Korangi No. 6 Market, Main Road, Karachi, Pakistan",
  phone: "03123581962",
};

function requireOrder(result: OrderValidation): ValidatedOrder {
  if (!result.ok) {
    throw new Error(`expected ok but got errors: ${result.errors.join("; ")}`);
  }
  return result.order;
}

function expectInvalid(result: OrderValidation): string[] {
  expect(result.ok).toBe(false);
  if (result.ok) {
    throw new Error("expected validation to fail");
  }
  return result.errors;
}

describe("order-core", () => {
  it("accepts a single in-stock product with catalog pricing and server-computed totals", () => {
    const order = requireOrder(validateOrder(validPayload(), catalog));
    expect(order.lines).toHaveLength(1);
    expect(order.lines[0].unitPrice).toBe(9999);
    expect(order.lines[0].subtotal).toBe(9999);
    expect(order.totals.subtotal).toBe(9999);
    expect(order.totals.discount).toBe(5001);
    expect(order.totals.total).toBe(4998);
    expect(order.orderNumber).toBe("");
  });

  it("computes totals across multiple products and variants", () => {
    const order = requireOrder(
      validateOrder(
        {
          ...validPayload(),
          lines: [
            { productId: "p1", quantity: 2 },
            { productId: "p2", variantName: "20A", quantity: 3 },
          ],
        },
        catalog,
      ),
    );
    expect(order.totals.subtotal).toBe(23598);
    expect(order.totals.discount).toBe(10002);
    expect(order.totals.total).toBe(13596);
    const variantLine = order.lines.find((line) => line.productId === "p2");
    expect(variantLine).toBeDefined();
    expect(variantLine?.model).toBe("20A");
    expect(variantLine?.variantName).toBe("20A");
    expect(variantLine?.unitPrice).toBe(1200);
    expect(variantLine?.subtotal).toBe(3600);
  });

  it("rejects an invalid email", () => {
    const errors = expectInvalid(
      validateOrder({ ...validPayload(), customerEmail: "not-an-email" }, catalog),
    );
    expect(errors.join(" ")).toMatch(/email/i);
  });

  it("rejects a missing phone", () => {
    const { customerPhone, ...payload } = validPayload();
    void customerPhone;
    const errors = expectInvalid(validateOrder(payload, catalog));
    expect(errors.join(" ")).toMatch(/phone/i);
  });

  it("rejects a missing shipping address", () => {
    const { shippingAddress, ...payload } = validPayload();
    void shippingAddress;
    const errors = expectInvalid(validateOrder(payload, catalog));
    expect(errors.join(" ")).toMatch(/address/i);
  });

  it("rejects an unknown product id", () => {
    const errors = expectInvalid(
      validateOrder(
        { ...validPayload(), lines: [{ productId: "does-not-exist", quantity: 1 }] },
        catalog,
      ),
    );
    expect(errors.join(" ")).toMatch(/not found/i);
  });

  it("rejects a zero quantity", () => {
    const errors = expectInvalid(
      validateOrder(
        { ...validPayload(), lines: [{ productId: "p1", quantity: 0 }] },
        catalog,
      ),
    );
    expect(errors.join(" ")).toMatch(/quantity/i);
  });

  it("rejects a negative quantity", () => {
    const errors = expectInvalid(
      validateOrder(
        { ...validPayload(), lines: [{ productId: "p1", quantity: -2 }] },
        catalog,
      ),
    );
    expect(errors.join(" ")).toMatch(/quantity/i);
  });

  it("never trusts client-supplied prices", () => {
    const payload = validPayload();
    const order = requireOrder(
      validateOrder(
        {
          ...payload,
          lines: [{ ...payload.lines[0], clientPrice: 1, clientTotal: 1 }],
        },
        catalog,
      ),
    );
    expect(order.lines[0].unitPrice).toBe(9999);
    expect(order.lines[0].subtotal).toBe(9999);
    expect(order.totals.subtotal).toBe(9999);
    expect(order.totals.discount).toBe(5001);
    expect(order.totals.total).toBe(4998);
  });

  it("formats order numbers with a date and zero-padded sequence", () => {
    expect(buildOrderNumber(new Date(2026, 7, 12), 7)).toBe("AE-20260812-0007");
    expect(buildOrderNumber(new Date(2026, 11, 1), 1)).toBe("AE-20261201-0001");
    expect(buildOrderNumber(new Date(2026, 7, 12), 1)).toBe("AE-20260812-0001");
  });

  it("builds an order email with brand, status, formatted prices and contact action", () => {
    const order = requireOrder(validateOrder(validPayload(), catalog));
    const html = buildOrderEmailHtml(order, site);
    expect(html).toContain("ANAS ELECTRONICS");
    expect(html).toContain("NEW ORDER");
    expect(html).toContain("Pending");
    expect(html).toContain("Rs.9,999");
    expect(html).toContain("1000W Inverter");
    expect(html).toContain("ACTION");
    expect(html).toContain("03123581962");
  });

  it("escapes malicious notes in the order email", () => {
    const order = requireOrder(
      validateOrder({ ...validPayload(), notes: "<script>alert(1)</script>" }, catalog),
    );
    const html = buildOrderEmailHtml(order, site);
    expect(html).not.toContain("<script>");
  });

  it("rejects orders carrying a website (honeypot)", () => {
    const errors = expectInvalid(
      validateOrder({ ...validPayload(), website: "http://spam" }, catalog),
    );
    expect(errors.length).toBeGreaterThan(0);
  });

  it("accepts the cod payment method", () => {
    const order = requireOrder(validateOrder(validPayload(), catalog));
    expect(order.paymentMethod).toBe("cod");
  });

  it("rejects an unsupported payment method", () => {
    const errors = expectInvalid(
      validateOrder({ ...validPayload(), paymentMethod: "card" }, catalog),
    );
    expect(errors.join(" ")).toMatch(/payment method/i);
  });

  it("rejects an out-of-stock product", () => {
    const errors = expectInvalid(
      validateOrder(
        { ...validPayload(), lines: [{ productId: "p3", quantity: 1 }] },
        catalog,
      ),
    );
    expect(errors.join(" ")).toMatch(/out of stock/i);
  });

  it("rejects an unknown variant", () => {
    const errors = expectInvalid(
      validateOrder(
        { ...validPayload(), lines: [{ productId: "p2", variantName: "50A", quantity: 1 }] },
        catalog,
      ),
    );
    expect(errors.join(" ")).toMatch(/variant/i);
  });

  it("trims the customer name before storing", () => {
    const order = requireOrder(
      validateOrder({ ...validPayload(), customerName: "   Ali   " }, catalog),
    );
    expect(order.customerName).toBe("Ali");
  });

  it("rejects a name that is empty after trimming", () => {
    const errors = expectInvalid(
      validateOrder({ ...validPayload(), customerName: "   " }, catalog),
    );
    expect(errors.join(" ")).toMatch(/name/i);
  });

  it("stores the provided createdAt from opts.now", () => {
    const order = requireOrder(
      validateOrder(validPayload(), catalog, { now: new Date("2026-08-12T10:00:00Z") }),
    );
    expect(order.createdAt).toBe("2026-08-12T10:00:00.000Z");
  });
});