import { createClient } from "@supabase/supabase-js";
import type { IncomingMessage, ServerResponse } from "node:http";

export const config = { runtime: "nodejs" };

function json(res: ServerResponse, status: number, body: Record<string, unknown>): void {
  res.statusCode = status;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(body));
}

export default async function handler(_req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = process.env.SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const report: Record<string, unknown> = {
    supabaseUrlSet: url.length > 0,
    supabaseUrlHost: url.replace(/^https?:\/\//, "").split("/")[0] || null,
    serviceRoleKeySet: key.length > 0,
    serviceRoleKeyPrefix: key.length > 8 ? key.slice(0, 5) + "…" : null,
    resendSet: (process.env.RESEND_API_KEY ?? "").length > 0,
    emailFrom: (process.env.EMAIL_FROM ?? "").length > 0,
    notificationEmail: (process.env.ORDER_NOTIFICATION_EMAIL ?? "").length > 0,
  };
  if (!url || !key) {
    report.ok = false;
    report.reason = "missing supabase env";
    json(res, 200, report);
    return;
  }
  try {
    const supabase = createClient(url, key);
    const { error } = await supabase.rpc("create_order", {
      p_order: { probe: true },
    });
    report.ok = !error;
    report.rpcError = error ? (error as { message?: string }).message : null;
    report.rpcDetails = error ? (error as { details?: string }).details : null;
    json(res, 200, report);
  } catch (e) {
    report.ok = false;
    report.exception = e instanceof Error ? e.message : String(e);
    json(res, 200, report);
  }
}
