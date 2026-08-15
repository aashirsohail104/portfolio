import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import { EventEmitter } from "node:events";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { OrderPayload } from "../../../api/lib/order-core";
import handler from "../../../api/orders";
import productsJson from "../../../data/products.json";

// --- mocked boundary ---

const mock = vi.hoisted(() => {
  const mockState = {
    idempotencyLookupResult: { data: null, error: null } as {
      data: unknown;
      error: unknown;
    },
    createOrderResult: {
      data: { order_number: "AE-20260812-1001" },
      error: null,
    } as { data: unknown; error: unknown },
    updateResult: { data: null, error: null } as { data: unknown; error: unknown },
    throwMode: null as "lookup" | "create" | "update" | null,
  };

  const defaultLookup = async () => {
    if (mockState.throwMode === "lookup") throw new Error("lookup boom");
    return mockState.idempotencyLookupResult;
  };
  const defaultRpc = async () => {
    if (mockState.throwMode === "create") throw new Error("create boom");
    return mockState.createOrderResult;
  };
  const defaultUpdate = async () => {
    if (mockState.throwMode === "update") throw new Error("update boom");
    return mockState.updateResult;
  };
  const defaultSend = async (): Promise<{
    data: { id: string } | null;
    error: { message: string; name: string; statusCode?: number } | null;
  }> => ({ data: { id: "email_1" }, error: null });

  const lookupSpy = vi.fn(defaultLookup);
  const updateSpy = vi.fn(defaultUpdate);
  const fromBuilder = {
    select: vi.fn(() => ({ eq: vi.fn(() => ({ maybeSingle: lookupSpy })) })),
    update: vi.fn(() => ({ eq: updateSpy })),
  };
  const client = {
    from: vi.fn(() => fromBuilder),
    rpc: vi.fn(defaultRpc),
  };
  const send = vi.fn(defaultSend);
  const createClient = vi.fn(() => client);
  const Resend = vi.fn(() => ({ emails: { send } }));

  return {
    mockState,
    client,
    fromBuilder,
    lookupSpy,
    updateSpy,
    send,
    createClient,
    Resend,
  };
});

vi.mock("@supabase/supabase-js", () => ({ createClient: mock.createClient }));
vi.mock("resend", () => ({ Resend: mock.Resend }));

// --- fixtures from the authoritative catalog ---

type CatalogProduct = {
  id: string;
  price: number;
  oldPrice: number | null;
  stockStatus: string;
  variants?: Array<{
    name: string;
    price: number;
    oldPrice: number | null;
    stockStatus: string;
  }>;
};

const products = productsJson as unknown as CatalogProduct[];
const inverter = products.find((p) => p.id === "suoer-saa-1000c-inverter-charger")!;
const smps = products.find((p) => p.id === "professional-12v-smps-10a-20a-30a")!;
const smps20a = smps.variants!.find((v) => v.name === "12V 20A")!;

function validPayload(): OrderPayload {
  return {
    customerName: "Ali Khan",
    customerEmail: "ali.khan@gmail.com",
    customerPhone: "03123456789",
    shippingAddress: "House 42, Main Road Korangi, Karachi",
    city: "Karachi",
    paymentMethod: "cod",
    lines: [{ productId: inverter.id, quantity: 1 }],
  };
}

function requestPayload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return { idempotencyKey: "client-key-001", ...validPayload(), ...overrides };
}

// --- helpers ---

type MockResponse = {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};

function makeResponse(): MockResponse & ServerResponse {
  const mock = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    body: "",
  };
  return Object.assign(mock, {
    setHeader(key: string, value: string) {
      mock.headers[key] = String(value);
    },
    end(payload: string) {
      mock.body = payload;
    },
  }) as MockResponse & ServerResponse;
}

function fakeReq(method: string, bodyText: string): IncomingMessage {
  const req = new EventEmitter() as IncomingMessage;
  Object.defineProperty(req, "method", { value: method });
  Object.defineProperty(req, "headers", { value: { "content-type": "application/json" } });
  queueMicrotask(() => {
    req.emit("data", Buffer.from(bodyText));
    req.emit("end");
  });
  return req;
}

function post(payload: unknown): Promise<{ status: number; body: Record<string, any> }> {
  return invoke(JSON.stringify(payload));
}

async function invoke(bodyText: string): Promise<{ status: number; body: Record<string, any> }> {
  const res = makeResponse();
  await handler(fakeReq("POST", bodyText), res);
  return { status: res.statusCode, body: JSON.parse(res.body || "{}") };
}

function json(r: MockResponse & ServerResponse): { status: number; body: Record<string, any> } {
  return { status: r.statusCode, body: JSON.parse(r.body || "{}") };
}

function rpcPOrder(): Record<string, any> {
  const calls = mock.client.rpc.mock.calls as unknown as Array<
    [string, { p_order: string | Record<string, any> }]
  >;
  expect(calls.length).toBeGreaterThan(0);
  const raw = calls[0][1].p_order;
  return typeof raw === "string" ? JSON.parse(raw) : raw;
}

function errorText(body: Record<string, any>): string {
  return Array.isArray(body.errors) ? (body.errors as string[]).join(" ") : String(body.message);
}

// --- env + mock reset ---

beforeEach(() => {
  process.env.SUPABASE_URL = "https://project-ref.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
  process.env.RESEND_API_KEY = "re_test_AB12CD34";
  process.env.EMAIL_FROM = "Anas Electronics <orders@example.com>";
  process.env.ORDER_NOTIFICATION_EMAIL = "anas.orders.test@gmail.com";

  mock.mockState.idempotencyLookupResult = { data: null, error: null };
  mock.mockState.createOrderResult = {
    data: { order_number: "AE-20260812-1001" },
    error: null,
  };
  mock.mockState.updateResult = { data: null, error: null };
  mock.mockState.throwMode = null;

  mock.lookupSpy.mockReset().mockImplementation(async () => {
    if (mock.mockState.throwMode === "lookup") throw new Error("lookup boom");
    return mock.mockState.idempotencyLookupResult;
  });
  mock.updateSpy.mockReset().mockImplementation(async () => {
    if (mock.mockState.throwMode === "update") throw new Error("update boom");
    return mock.mockState.updateResult;
  });
  mock.client.rpc.mockReset().mockImplementation(async () => {
    if (mock.mockState.throwMode === "create") throw new Error("create boom");
    return mock.mockState.createOrderResult;
  });
  mock.send
    .mockReset()
    .mockImplementation(async () => ({ data: { id: "email_1" }, error: null }));
  mock.createClient.mockReset().mockImplementation(() => mock.client);
  mock.Resend.mockReset().mockImplementation(() => ({ emails: { send: mock.send } }));
});

afterEach(() => {
  vi.clearAllMocks();
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.RESEND_API_KEY;
  delete process.env.EMAIL_FROM;
  delete process.env.ORDER_NOTIFICATION_EMAIL;
});

// --- orders api ---

describe("orders api", () => {
  it("accepts a single in-stock product billed from catalog prices and emails once", async () => {
    const { status, body } = await post(requestPayload());
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.orderId).toBe("AE-20260812-1001");

    expect(mock.client.rpc).toHaveBeenCalledTimes(1);
    expect(mock.client.rpc).toHaveBeenCalledWith("create_order", expect.anything());
    expect(mock.lookupSpy).toHaveBeenCalled();

    const pOrder = rpcPOrder();
    expect(pOrder.customer_name).toBe("Ali Khan");
    const items = pOrder.items as Array<Record<string, unknown>>;
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      product_id: inverter.id,
      quantity: 1,
      unit_price: inverter.price,
    });

    expect(mock.send).toHaveBeenCalledTimes(1);
    const sendCalls = mock.send.mock.calls as unknown as Array<[{ to: string; subject: string; html: string }]>;
    expect(sendCalls.length).toBeGreaterThan(0);
    const emailArgs = sendCalls[0][0];
    expect(emailArgs.to).toMatch(/gmail\.com/);
    expect(emailArgs.subject).toContain("NEW ORDER #AE-20260812-1001");
    expect(mock.fromBuilder.update).toHaveBeenCalledWith(
      expect.objectContaining({ notification_status: "sent" })
    );
  });

  it("bills multiple products and a variant line with server-computed totals", async () => {
    const { status, body } = await post(
      requestPayload({
        lines: [
          { productId: inverter.id, quantity: 2 },
          { productId: smps.id, variantName: "12V 20A", quantity: 3 },
        ],
      })
    );
    expect(status).toBe(200);
    expect(body.success).toBe(true);

    const pOrder = rpcPOrder();
    expect(pOrder.items).toHaveLength(2);
    expect(pOrder.subtotal).toBe(26868);
    expect(pOrder.discount).toBe(10002);
    expect(pOrder.total).toBe(16866);

    const variantItem = (pOrder.items as Array<Record<string, unknown>>).find(
      (item) => item.product_id === smps.id
    );
    expect(variantItem).toMatchObject({
      variant_name: "12V 20A",
      unit_price: smps20a.price,
      quantity: 3,
    });
  });

  it("rejects an invalid email", async () => {
    const { status, body } = await post(requestPayload({ customerEmail: "not-an-email" }));
    expect(status).toBe(400);
    expect(body.success).toBe(false);
    expect(errorText(body)).toMatch(/email/i);
    expect(mock.client.rpc).not.toHaveBeenCalled();
    expect(mock.send).not.toHaveBeenCalled();
  });

  it("rejects a missing phone number", async () => {
    const payload = requestPayload();
    delete payload.customerPhone;
    const { status, body } = await post(payload);
    expect(status).toBe(400);
    expect(body.success).toBe(false);
    expect(errorText(body)).toMatch(/phone/i);
  });

  it("rejects a missing shipping address", async () => {
    const payload = requestPayload();
    delete payload.shippingAddress;
    const { status, body } = await post(payload);
    expect(status).toBe(400);
    expect(body.success).toBe(false);
    expect(errorText(body)).toMatch(/address/i);
  });

  it("rejects an unknown product id", async () => {
    const { status, body } = await post(
      requestPayload({ lines: [{ productId: "does-not-exist", quantity: 1 }] })
    );
    expect(status).toBe(400);
    expect(body.success).toBe(false);
    expect(errorText(body)).toMatch(/not found/i);
  });

  it("rejects a zero quantity line", async () => {
    const { status, body } = await post(
      requestPayload({ lines: [{ productId: inverter.id, quantity: 0 }] })
    );
    expect(status).toBe(400);
    expect(body.success).toBe(false);
  });

  it("rejects a negative quantity line", async () => {
    const { status, body } = await post(
      requestPayload({ lines: [{ productId: inverter.id, quantity: -2 }] })
    );
    expect(status).toBe(400);
    expect(body.success).toBe(false);
  });

  it("never trusts client-supplied prices and bills from the catalog", async () => {
    const { status, body } = await post(
      requestPayload({
        lines: [{ productId: inverter.id, quantity: 1, clientPrice: 1, clientTotal: 1 }],
      })
    );
    expect(status).toBe(200);
    expect(body.success).toBe(true);

    const pOrder = rpcPOrder();
    const items = pOrder.items as Array<Record<string, unknown>>;
    expect(items[0].unit_price).toBe(inverter.price);
    expect(pOrder.subtotal).toBe(inverter.price);
    expect(pOrder.discount).toBe(5001);
    expect(pOrder.total).toBe(4998);
  });

  it("returns the existing order on duplicate submission without creating again", async () => {
    mock.mockState.idempotencyLookupResult = {
      data: { order_number: "AE-20260812-1001" },
      error: null,
    };
    const payload = requestPayload();
    const first = await post(payload);
    const second = await post(payload);
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(first.body.orderId).toBe("AE-20260812-1001");
    expect(second.body.orderId).toBe(first.body.orderId);
    expect(mock.client.rpc).not.toHaveBeenCalled();
  });

  it("returns a generic 500 and hides the raw error when the database is down", async () => {
    mock.mockState.createOrderResult = { data: null, error: { message: "connection refused" } };
    const { status, body } = await post(requestPayload());
    expect(status).toBe(500);
    expect(body.success).toBe(false);
    expect(String(body.message)).toMatch(/couldn't place your order/i);
    expect(body).not.toHaveProperty("error");
    expect(body).not.toHaveProperty("stack");
    expect(JSON.stringify(body)).not.toMatch(/connection refused/);
  });

  it("retains the order and marks the notification failed when the email errors", async () => {
    mock.send.mockRejectedValueOnce(new Error("smtp unavailable"));
    const { status, body } = await post(requestPayload());
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.orderId).toBe("AE-20260812-1001");
    expect(mock.client.rpc).toHaveBeenCalledTimes(1);
    expect(mock.fromBuilder.update).toHaveBeenCalledWith(
      expect.objectContaining({ notification_status: "failed" })
    );
  });

  it("marks the notification failed, not sent, when Resend rejects with an error response", async () => {
    mock.send.mockResolvedValueOnce({
      data: null,
      error: { message: "You can only send testing emails to your own email address", name: "application_error", statusCode: 403 },
    });
    const { status, body } = await post(requestPayload());
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.orderId).toBe("AE-20260812-1001");
    expect(mock.client.rpc).toHaveBeenCalledTimes(1);
    expect(mock.fromBuilder.update).toHaveBeenCalledWith(
      expect.objectContaining({ notification_status: "failed" })
    );
    expect(mock.fromBuilder.update).not.toHaveBeenCalledWith(
      expect.objectContaining({ notification_status: "sent" })
    );
  });

  it("places the order without email when resend is not configured", async () => {
    delete process.env.RESEND_API_KEY;
    const { status, body } = await post(requestPayload());
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.orderId).toBe("AE-20260812-1001");
    expect(mock.send).not.toHaveBeenCalled();
    expect(mock.fromBuilder.update).toHaveBeenCalledWith(
      expect.objectContaining({ notification_status: "pending" })
    );
  });

  it("rejects a payload without an idempotency key", async () => {
    const payload = requestPayload();
    delete payload.idempotencyKey;
    const { status, body } = await post(payload);
    expect(status).toBe(400);
    expect(body.success).toBe(false);
    expect(mock.client.rpc).not.toHaveBeenCalled();
  });

  it("rejects a malformed JSON body", async () => {
    const res = makeResponse();
    await handler(fakeReq("POST", "{not json"), res);
    const { status, body } = json(res);
    expect(status).toBe(400);
    expect(body.success).toBe(false);
    expect(mock.client.rpc).not.toHaveBeenCalled();
  });

  it("rejects non-POST methods", async () => {
    const res = makeResponse();
    await handler(fakeReq("GET", ""), res);
    const { status, body } = json(res);
    expect(status).toBe(405);
    expect(body.success).toBe(false);
    expect(mock.client.rpc).not.toHaveBeenCalled();
  });

  it("returns a generic 500 and hides internals on unexpected handler errors", async () => {
    mock.mockState.throwMode = "create";
    const { status, body } = await post(requestPayload());
    expect(status).toBe(500);
    expect(body.success).toBe(false);
    expect(String(body.message)).toMatch(/couldn't place your order/i);
    expect(body).not.toHaveProperty("error");
    expect(body).not.toHaveProperty("stack");
    expect(JSON.stringify(body)).not.toMatch(/create boom|Error/);
  });

  it("returns exactly the documented success body shape", async () => {
    const { body } = await post(requestPayload());
    expect(Object.keys(body).sort()).toEqual(["message", "orderId", "success"]);
    expect(typeof body.message).toBe("string");
    expect(String(body.message)).not.toBe("");
  });
});