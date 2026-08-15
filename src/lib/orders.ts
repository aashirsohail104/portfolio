export const ORDER_ERROR_MESSAGE =
  "We couldn't place your order right now. Please try again.";

export interface CheckoutLineInput {
  productId: string;
  variantName?: string | null;
  quantity: number;
}

export interface CheckoutPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerWhatsapp?: string;
  shippingAddress: string;
  city: string;
  postalCode?: string;
  notes?: string;
  paymentMethod: "cod";
  lines: CheckoutLineInput[];
  idempotencyKey: string;
}

export interface PlaceOrderSuccess {
  ok: true;
  orderId: string;
}

export interface PlaceOrderFailure {
  ok: false;
  message: string;
}

export type PlaceOrderResult = PlaceOrderSuccess | PlaceOrderFailure;

interface ErrorBody {
  message?: string;
}

interface SuccessBody {
  success?: boolean;
  orderId?: string;
  message?: string;
}

export async function placeOrder(payload: CheckoutPayload): Promise<PlaceOrderResult> {
  let response: Response;
  try {
    response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, message: ORDER_ERROR_MESSAGE };
  }

  if (!response.ok) {
    let message: string | undefined;
    try {
      const body: unknown = await response.json();
      if (typeof body === "object" && body !== null && "message" in body) {
        const candidate = (body as ErrorBody).message;
        if (typeof candidate === "string" && candidate.trim() !== "") {
          message = candidate;
        }
      }
    } catch {
      // Non-JSON error body; the generic message is safe to show.
    }
    return { ok: false, message: message ?? ORDER_ERROR_MESSAGE };
  }

  let orderId: string | undefined;
  try {
    const body: unknown = await response.json();
    if (typeof body === "object" && body !== null && "orderId" in body) {
      const candidate = (body as SuccessBody).orderId;
      if (typeof candidate === "string" && candidate.trim() !== "") {
        orderId = candidate;
      }
    }
  } catch {
    // Non-JSON success body; treat as an unknown failure.
  }

  if (!orderId) {
    return { ok: false, message: ORDER_ERROR_MESSAGE };
  }

  return { ok: true, orderId };
}