/**
 * Shared utilities for the live-battle serverless functions.
 * The AnyCable broadcaster + handle()/jsonResponse() helpers, originally
 * adapted from slidev-addon-slide-quiz (functions/netlify/shared.mts) — MIT.
 * The battle defines its own valibot schemas in battle-shared.mts.
 */
import { broadcaster } from "@anycable/serverless-js";
import * as v from "valibot";

const broadcastURL =
  process.env.ANYCABLE_BROADCAST_URL || "http://127.0.0.1:8090/_broadcast";
const broadcastKey = process.env.ANYCABLE_BROADCAST_KEY || "";

export const broadcastTo = broadcaster(broadcastURL, broadcastKey);

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

// ── handle() decorator ──

export function handle<T>(
  schema: v.GenericSchema<T>,
  handler: (body: T) => Promise<Response>,
): (req: Request, ...args: unknown[]) => Promise<Response> {
  return async (req: Request) => {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400);
    }

    const result = v.safeParse(schema, raw);
    if (!result.success) {
      const issue = result.issues[0];
      const path = issue.path?.map((p) => p.key).join(".") || "body";
      console.error("[handle] validation failed:", path, issue.message);
      return jsonResponse({ error: `Invalid field: ${path}` }, 400);
    }

    return handler(result.output);
  };
}
