import type { IncomingMessage, ServerResponse } from "node:http";

export const config = { runtime: "nodejs" };

export default async function handler(_req: IncomingMessage, res: ServerResponse): Promise<void> {
  res.statusCode = 200;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify({ ok: true, ts: Date.now() }));
}
