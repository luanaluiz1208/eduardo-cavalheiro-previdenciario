import type { VercelRequest, VercelResponse } from "@vercel/node";
import { endAdminSession } from "../lib/auth";
import { ensureSameOrigin, methodNotAllowed, sendJson } from "../lib/http";

export default function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "POST") return methodNotAllowed(response, ["POST"]);
  if (!ensureSameOrigin(request, response)) return;
  endAdminSession(response);
  return sendJson(response, 200, { authenticated: false });
}
