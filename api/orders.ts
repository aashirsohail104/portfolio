import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { createRequire } from "node:module";
import type { IncomingMessage, ServerResponse } from "node:http";
import {
  buildOrderEmailHtml,
  validateOrder,
  type OrderPayload,
  type OrderStatus,
  type OrderValidation,
  type PriceSource,
  type SiteIdentity,
} from "./lib/order-core.js";

const require = createRequire(import.meta.url);

export const config = { runtime: "nodejs" };

const MAX_BODY_BYTES = 100 * 1024;
const DEFAULT_NOTIFICATION_EMAIL = "anasrajputups@gmail.com";

const productsData = require("../data/products.json") as PriceSource[];
const siteData = require("../data/site.json") as {
  contact: { name: string; address: string; phone: string; whatsapp: string };
};

const products = productsData;

const siteIdentity: SiteIdentity = {
  name: siteData.contact.name,
  address: siteData.contact.address,
  phone: siteData.contact.phone,
  whatsapp: siteData.contact.whatsapp,
};

// --- helpers ---

function sendJson(
  res: ServerResponse,
  body: { success: boolean; message: string; orderId?: string; errors?: string[] },
  status: number,
  extraHeaders: Record<string, string> = {}
): void {
  res.statusCode = status;
  res.setHeader("content-type", "application/json");
  for (const [key, value] of Object.entries(extraHeaders)) {
    res.setHeader(key, value);
  }
  res.end(JSON.stringify(body));
}

function readRequestBody(req: IncomingMessage, maxBytes: number): Promise<string | null> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    let total = 0;
    req.on("data", (chunk: Buffer) => {
      total += chunk.byteLength;
      if (total > maxBytes) {
        req.destroy();
        resolve(null);
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });
    req.on("error", () => {
      resolve(null);
    });
  });
}

function isValidationError(v: OrderValidation): v is { ok: false; errors: string[] } {
  return !v.ok;
}

async function setNotificationStatus(
  supabase: SupabaseClient,
  idempotencyKey: string,
  status: "pending" | "sent" | "failed"
): Promise<void> {
  try {
    await supabase
      .from("orders")
      .update({ notification_status: status })
      .eq("idempotency_key", idempotencyKey);
  } catch {
    return;
  }
}

// --- handler ---

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    if (req.method !== "POST") {
      sendJson(res, { success: false, message: "Method not allowed." }, 405, {
        allow: "POST",
      });
      return;
    }

    const bodyText = await readRequestBody(req, MAX_BODY_BYTES);
    if (bodyText === null) {
      sendJson(res, { success: false, message: "Request too large." }, 413);
      return;
    }

    let rawPayload: unknown;
    try {
      rawPayload = JSON.parse(bodyText);
    } catch {
      sendJson(res, { success: false, message: "Invalid request body." }, 400);
      return;
    }

    const payload = rawPayload as OrderPayload & { idempotencyKey?: unknown };
    const idempotencyKey =
      typeof payload.idempotencyKey === "string" ? payload.idempotencyKey.trim() : "";
    const itemCount = Array.isArray(payload.lines) ? payload.lines.length : 0;
    console.log("[order-api]", "attempt", { ids: itemCount });

    if (idempotencyKey === "") {
      sendJson(res, { success: false, message: "Missing idempotency key." }, 400);
      return;
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      console.error("order-api: missing SUPABASE config");
      sendJson(res, { success: false, message: "Server configuration error." }, 500);
      return;
    }
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const existing = await supabase
      .from("orders")
      .select("order_number")
      .eq("idempotency_key", idempotencyKey)
      .maybeSingle();
    if (existing.data?.order_number) {
      sendJson(
        res,
        {
          success: true,
          orderId: existing.data.order_number,
          message: "Order placed successfully.",
        },
        200
      );
      return;
    }

    const validation = validateOrder(rawPayload, products, { now: new Date() });
    if (isValidationError(validation)) {
      console.log("[order-api]", "validation failed", { ids: validation.errors.length });
      sendJson(
        res,
        { success: false, message: "Unable to place order.", errors: validation.errors },
        400
      );
      return;
    }
    const order = validation.order;

    const createOrderArg: {
      customer_name: string;
      customer_email: string;
      customer_phone: string;
      customer_whatsapp: string | null;
      shipping_address: string;
      city: string;
      postal_code: string | null;
      notes: string | null;
      payment_method: string;
      subtotal: number;
      discount: number;
      shipping_fee: number;
      tax: number;
      total: number;
      idempotency_key: string;
      status: OrderStatus;
      items: Array<{
        product_id: string;
        product_name: string;
        brand: string | null;
        model: string | null;
        variant_name: string | null;
        quantity: number;
        unit_price: number;
        discount: number;
        subtotal: number;
        product_image: string;
      }>;
    } = {
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      customer_phone: order.customerPhone,
      customer_whatsapp: order.customerWhatsapp,
      shipping_address: order.shippingAddress,
      city: order.city,
      postal_code: order.postalCode,
      notes: order.notes,
      payment_method: "cod",
      subtotal: order.totals.subtotal,
      discount: order.totals.discount,
      shipping_fee: 0,
      tax: 0,
      total: order.totals.total,
      idempotency_key: idempotencyKey,
      status: "pending",
      items: order.lines.map((line) => ({
        product_id: line.productId,
        product_name: line.productName,
        brand: line.brand,
        model: line.model,
        variant_name: line.variantName,
        quantity: line.quantity,
        unit_price: line.unitPrice,
        discount: line.discount,
        subtotal: line.subtotal,
        product_image: line.productImage,
      })),
    };

    const created = await supabase.rpc("create_order", {
      p_order: createOrderArg,
    });
    if (created.error) {
      console.error("order-api: create_order RPC failed", created.error.message);
      sendJson(
        res,
        { success: false, message: "We couldn't place your order right now. Please try again." },
        500
      );
      return;
    }
    const orderNumber =
      typeof created.data?.order_number === "string" ? created.data.order_number : "";
    if (orderNumber === "") {
      console.error("order-api: create_order returned no order number");
      sendJson(
        res,
        { success: false, message: "We couldn't place your order right now. Please try again." },
        500
      );
      return;
    }
    order.orderNumber = orderNumber;
    console.log("[order-api]", "success", { orderId: orderNumber, ids: itemCount });

    const resendApiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM;
    const emailConfigured =
      typeof resendApiKey === "string" &&
      resendApiKey !== "" &&
      typeof emailFrom === "string" &&
      emailFrom !== "";

    if (emailConfigured) {
      try {
        const resend = new Resend(resendApiKey);
        const result = await resend.emails.send({
          from: emailFrom,
          to: process.env.ORDER_NOTIFICATION_EMAIL ?? DEFAULT_NOTIFICATION_EMAIL,
          subject: `NEW ORDER #${orderNumber} — Anas Electronics`,
          html: buildOrderEmailHtml(order, siteIdentity),
        });
        if (result.error || !result.data?.id) {
          console.error(
            "order-api: email send failed for order " + orderNumber,
            result.error ?? "no message id returned"
          );
          await setNotificationStatus(supabase, idempotencyKey, "failed");
        } else {
          console.log("[order-api]", "email sent", {
            orderId: orderNumber,
            messageId: result.data.id,
          });
          await setNotificationStatus(supabase, idempotencyKey, "sent");
        }
      } catch (error) {
        console.error("order-api: email send failed for order " + orderNumber, error);
        await setNotificationStatus(supabase, idempotencyKey, "failed");
      }
    } else {
      console.log(
        "[order-api]",
        "email skipped (RESEND_API_KEY or EMAIL_FROM not configured)",
        { orderId: orderNumber }
      );
      await setNotificationStatus(supabase, idempotencyKey, "pending");
    }

    sendJson(res, { success: true, orderId: orderNumber, message: "Order placed successfully." }, 200);
  } catch (error) {
    console.error("order-api: unexpected error", error);
    sendJson(res, { success: false, message: "We couldn't place your order right now. Please try again." }, 500);
  }
}
